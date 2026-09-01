import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
    type ReactNode,
} from 'react';
import type { PlayerInfo, Language, Sticker } from '../types';
import { normalizePlayerInfo } from '../utils/playerData';

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
    removedSticker: { sticker: Sticker; index: number } | null;
    removeSticker: (id: string) => void;
    undoStickerRemoval: () => void;
    dismissStickerUndo: () => void;
    persistenceStatus: 'image-omitted' | 'failed' | null;
    dismissPersistenceStatus: () => void;
}

interface PlayerStoreSnapshot {
    playerInfo: PlayerInfo;
    selectedStickerId: string | null;
    removedSticker: { sticker: Sticker; index: number } | null;
    persistenceStatus: 'image-omitted' | 'failed' | null;
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
    removeSticker: (id: string) => void;
    undoStickerRemoval: () => void;
    dismissStickerUndo: () => void;
    setPersistenceStatus: (status: PlayerStoreSnapshot['persistenceStatus']) => void;
    dismissPersistenceStatus: () => void;
}

type PlayerActions = Omit<PlayerContextType, 'playerInfo' | 'selectedStickerId' | 'removedSticker' | 'persistenceStatus'>;

const STORAGE_KEY = 'ff14-playerInfo';

function loadPlayerInfo(): PlayerInfo {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return normalizePlayerInfo(raw ? JSON.parse(raw) : undefined);
    } catch {
        return normalizePlayerInfo(undefined);
    }
}

function persistPlayerInfo(playerInfo: PlayerInfo): PlayerStoreSnapshot['persistenceStatus'] {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(playerInfo));
        return null;
    } catch {
        // Fallback: If quota is exceeded, keep the text and layout data but omit the image.
        try {
            const rest = { ...playerInfo };
            delete rest.image;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
            return 'image-omitted';
        } catch {
            return 'failed';
        }
    }
}

function createPlayerStore(): PlayerStore {
    let snapshot: PlayerStoreSnapshot = {
        playerInfo: loadPlayerInfo(),
        selectedStickerId: null,
        removedSticker: null,
        persistenceStatus: null,
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

    const removeSticker = (id: string) => {
        const stickers = snapshot.playerInfo.stickers ?? [];
        const index = stickers.findIndex(sticker => sticker.id === id);
        if (index < 0) return;

        snapshot = {
            ...snapshot,
            playerInfo: { ...snapshot.playerInfo, stickers: stickers.filter(sticker => sticker.id !== id) },
            selectedStickerId: snapshot.selectedStickerId === id ? null : snapshot.selectedStickerId,
            removedSticker: { sticker: stickers[index], index },
        };
        notify(listeners);
        notify(playerInfoListeners);
    };

    const undoStickerRemoval = () => {
        if (!snapshot.removedSticker) return;
        const { sticker, index } = snapshot.removedSticker;
        const stickers = [...(snapshot.playerInfo.stickers ?? [])];
        stickers.splice(Math.min(index, stickers.length), 0, sticker);
        snapshot = {
            ...snapshot,
            playerInfo: { ...snapshot.playerInfo, stickers },
            selectedStickerId: sticker.id,
            removedSticker: null,
        };
        notify(listeners);
        notify(playerInfoListeners);
    };

    const dismissStickerUndo = () => {
        if (!snapshot.removedSticker) return;
        snapshot = { ...snapshot, removedSticker: null };
        notify(listeners);
    };

    const setPersistenceStatus = (persistenceStatus: PlayerStoreSnapshot['persistenceStatus']) => {
        if (snapshot.persistenceStatus === persistenceStatus) return;
        snapshot = { ...snapshot, persistenceStatus };
        notify(listeners);
    };

    const dismissPersistenceStatus = () => setPersistenceStatus(null);

    return {
        getSnapshot: () => snapshot,
        subscribe,
        subscribePlayerInfo,
        setPlayerInfo,
        updatePlayerField,
        updateLanguage,
        updateImage,
        setSelectedStickerId,
        removeSticker,
        undoStickerRemoval,
        dismissStickerUndo,
        setPersistenceStatus,
        dismissPersistenceStatus,
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
                store.setPersistenceStatus(persistPlayerInfo(store.getSnapshot().playerInfo));
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
        removeSticker: store.removeSticker,
        undoStickerRemoval: store.undoStickerRemoval,
        dismissStickerUndo: store.dismissStickerUndo,
        dismissPersistenceStatus: store.dismissPersistenceStatus,
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
        removedSticker: snapshot.removedSticker,
        persistenceStatus: snapshot.persistenceStatus,
        setSelectedStickerId: store.setSelectedStickerId,
        removeSticker: store.removeSticker,
        undoStickerRemoval: store.undoStickerRemoval,
        dismissStickerUndo: store.dismissStickerUndo,
        dismissPersistenceStatus: store.dismissPersistenceStatus,
    }), [snapshot, store]);
}
