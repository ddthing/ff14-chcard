import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
    type ReactNode,
} from 'react';
import type { PlayerInfo, Language } from '../types';

type PlayerInfoUpdater = PlayerInfo | ((prev: PlayerInfo) => PlayerInfo);
type Listener = () => void;

interface PlayerContextType {
    playerInfo: PlayerInfo;
    setPlayerInfo: (info: PlayerInfoUpdater) => void;
    updatePlayerField: <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => void;
    updateLanguage: (lang: Language) => void;
    updateImage: (image: string | undefined) => void;
    selectedStickerId: string | null;
    setSelectedStickerId: (id: string | null) => void;
}

interface PlayerStoreSnapshot {
    playerInfo: PlayerInfo;
    selectedStickerId: string | null;
}

interface PlayerStore {
    getSnapshot: () => PlayerStoreSnapshot;
    subscribe: (listener: Listener) => () => void;
    subscribePlayerInfo: (listener: Listener) => () => void;
    setPlayerInfo: (info: PlayerInfoUpdater) => void;
    updatePlayerField: <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => void;
    updateLanguage: (lang: Language) => void;
    updateImage: (image: string | undefined) => void;
    setSelectedStickerId: (id: string | null) => void;
}

type PlayerActions = Omit<PlayerContextType, 'playerInfo' | 'selectedStickerId'>;

import { PROFILE_SCHEMA_VERSION } from '../constants/storage';

const STORAGE_KEY = 'ff14-playerInfo';

const defaultPlayerInfo: PlayerInfo = {
    name: '',
    region: 'KR',
    dataCenter: '',
    server: '',
    jobs: [],
    playstyles: [],
    activeTime: '',
    comment: '',
    font: 'font-pretendard',
    mainJob: undefined,
    isNicknameChanged: false,
    isSprout: false,
    isMentor: false,
    jobLevels: {},
    imagePosition: { x: 0, y: 0, scale: 1 },
    layout: 'header',
    language: 'ko',
    pointColor: '#e44c21',
    stickers: [],
    version: PROFILE_SCHEMA_VERSION,
};

function loadPlayerInfo(): PlayerInfo {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultPlayerInfo;
        
        const parsed = JSON.parse(raw);
        
        // Hybrid Reset Logic
        // If the stored data has an older version (or no version) it might need a reset.
        if (parsed.version !== PROFILE_SCHEMA_VERSION) {
            return {
                ...defaultPlayerInfo,
                // Keep the user's specific text/content data
                name: parsed.name || '',
                server: parsed.server || '',
                region: parsed.region || 'KR',
                dataCenter: parsed.dataCenter || '',
                jobs: parsed.jobs || [],
                jobLevels: parsed.jobLevels || {},
                playstyles: parsed.playstyles || [],
                activeTime: parsed.activeTime || '',
                comment: parsed.comment || '',
                image: parsed.image,
                mainJob: parsed.mainJob,
                isNicknameChanged: parsed.isNicknameChanged || false,
                isSprout: parsed.isSprout || false,
                isMentor: parsed.isMentor || false,
                imagePosition: parsed.imagePosition || { x: 0, y: 0, scale: 1 },
                stickers: parsed.stickers || [],
                // Force reset specific design elements to defaults:
                // font, layout, language, pointColor are not copied from `parsed`
            };
        }

        return { ...defaultPlayerInfo, ...parsed };
    } catch {
        return defaultPlayerInfo;
    }
}

function persistPlayerInfo(playerInfo: PlayerInfo) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(playerInfo));
    } catch {
        // Fallback: If quota is exceeded, keep the text and layout data but omit the image.
        try {
            const rest = { ...playerInfo };
            delete rest.image;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
        } catch {
            // Local persistence is best-effort and must never interrupt editing.
        }
    }
}

function createPlayerStore(): PlayerStore {
    let snapshot: PlayerStoreSnapshot = {
        playerInfo: loadPlayerInfo(),
        selectedStickerId: null,
    };
    const listeners = new Set<Listener>();
    const playerInfoListeners = new Set<Listener>();

    const notify = (subscribers: Set<Listener>) => {
        subscribers.forEach(listener => listener());
    };

    const subscribe = (listener: Listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    const subscribePlayerInfo = (listener: Listener) => {
        playerInfoListeners.add(listener);
        return () => playerInfoListeners.delete(listener);
    };

    const setPlayerInfo = (nextInfo: PlayerInfoUpdater) => {
        const playerInfo = typeof nextInfo === 'function'
            ? nextInfo(snapshot.playerInfo)
            : nextInfo;

        if (Object.is(playerInfo, snapshot.playerInfo)) return;

        snapshot = { ...snapshot, playerInfo };
        notify(listeners);
        notify(playerInfoListeners);
    };

    const updatePlayerField = <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => {
        setPlayerInfo(prev => ({ ...prev, [field]: value }));
    };

    const updateLanguage = (language: Language) => {
        setPlayerInfo(prev => ({ ...prev, language }));
    };

    const updateImage = (image: string | undefined) => {
        setPlayerInfo(prev => ({ ...prev, image }));
    };

    const setSelectedStickerId = (id: string | null) => {
        if (Object.is(id, snapshot.selectedStickerId)) return;

        snapshot = { ...snapshot, selectedStickerId: id };
        notify(listeners);
    };

    return {
        getSnapshot: () => snapshot,
        subscribe,
        subscribePlayerInfo,
        setPlayerInfo,
        updatePlayerField,
        updateLanguage,
        updateImage,
        setSelectedStickerId,
    };
}

const PlayerContext = createContext<PlayerStore | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [store] = useState<PlayerStore>(() => createPlayerStore());

    // Debounced persistence keeps typing, sliders, and sticker movement off the hot path.
    useEffect(() => {
        let timeoutId: number | undefined;

        const schedulePersistence = () => {
            if (timeoutId !== undefined) window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                timeoutId = undefined;
                persistPlayerInfo(store.getSnapshot().playerInfo);
            }, 250);
        };

        schedulePersistence();
        const unsubscribe = store.subscribePlayerInfo(schedulePersistence);

        return () => {
            unsubscribe();
            if (timeoutId !== undefined) window.clearTimeout(timeoutId);
        };
    }, [store]);

    return (
        <PlayerContext.Provider value={store}>
            {children}
        </PlayerContext.Provider>
    );
}

function usePlayerStore() {
    const store = useContext(PlayerContext);
    if (!store) {
        throw new Error('Player hooks must be used within a PlayerProvider');
    }
    return store;
}

/** Subscribe to the smallest stable slice needed by shell and metadata UI. */
// eslint-disable-next-line react-refresh/only-export-components
export function usePlayerSelector<T>(selector: (snapshot: PlayerStoreSnapshot) => T): T {
    const store = usePlayerStore();
    return useSyncExternalStore(
        store.subscribe,
        () => selector(store.getSnapshot()),
        () => selector(store.getSnapshot()),
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayerActions(): PlayerActions {
    const store = usePlayerStore();
    return useMemo(() => ({
        setPlayerInfo: store.setPlayerInfo,
        updatePlayerField: store.updatePlayerField,
        updateLanguage: store.updateLanguage,
        updateImage: store.updateImage,
        setSelectedStickerId: store.setSelectedStickerId,
    }), [store]);
}

// The provider and hook intentionally share this module for a stable public API.
// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer() {
    const store = usePlayerStore();
    const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

    return useMemo(() => ({
        playerInfo: snapshot.playerInfo,
        setPlayerInfo: store.setPlayerInfo,
        updatePlayerField: store.updatePlayerField,
        updateLanguage: store.updateLanguage,
        updateImage: store.updateImage,
        selectedStickerId: snapshot.selectedStickerId,
        setSelectedStickerId: store.setSelectedStickerId,
    }), [snapshot, store]);
}
