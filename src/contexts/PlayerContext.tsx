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
    commitStickerChange: (update: (stickers: Sticker[]) => Sticker[]) => void;
    undoStickerRemoval: () => void;
    dismissStickerUndo: () => void;
    persistenceStatus: 'image-omitted' | 'failed' | null;
    dismissPersistenceStatus: () => void;
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
}

interface PlayerStoreSnapshot {
    playerInfo: PlayerInfo;
    selectedStickerId: string | null;
    removedSticker: { sticker: Sticker; index: number } | null;
    persistenceStatus: 'image-omitted' | 'failed' | null;
    canUndo: boolean;
    canRedo: boolean;
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
    commitStickerChange: (update: (stickers: Sticker[]) => Sticker[]) => void;
    undoStickerRemoval: () => void;
    dismissStickerUndo: () => void;
    setPersistenceStatus: (status: PlayerStoreSnapshot['persistenceStatus']) => void;
    dismissPersistenceStatus: () => void;
    undo: () => void;
    redo: () => void;
}

type PlayerActions = Omit<PlayerContextType, 'playerInfo' | 'selectedStickerId' | 'removedSticker' | 'persistenceStatus' | 'canUndo' | 'canRedo'>;

const STORAGE_KEY = 'ff14-playerInfo';
const CONTINUOUS_EDIT_FIELDS = new Set<keyof PlayerInfo>(['name', 'activeTime', 'comment', 'pointColor', 'jobLevels', 'stickers']);

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
        canUndo: false,
        canRedo: false,
    };
    const past: PlayerInfo[] = [];
    const future: PlayerInfo[] = [];
    let lastEdit: { field: keyof PlayerInfo; time: number } | null = null;
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

    const recordHistory = (next: PlayerInfo) => {
        const previous = snapshot.playerInfo;
        const changed = (Object.keys(next) as (keyof PlayerInfo)[]).filter(key => !Object.is(previous[key], next[key]));
        if (changed.length === 0) return false;
        const field = changed.length === 1 && CONTINUOUS_EDIT_FIELDS.has(changed[0]) ? changed[0] : null;
        const time = Date.now();
        if (!field || !lastEdit || field !== lastEdit.field || time - lastEdit.time > 700 || future.length > 0) {
            past.push(previous);
            if (past.length > 30) past.shift();
        }
        future.length = 0;
        lastEdit = field ? { field, time } : null;
        return true;
    };

    const setPlayerInfo = (nextInfo: PlayerInfoUpdater) => {
        const playerInfo = typeof nextInfo === 'function'
            ? nextInfo(snapshot.playerInfo)
            : nextInfo;

        if (Object.is(playerInfo, snapshot.playerInfo) || !recordHistory(playerInfo)) return;

        snapshot = { ...snapshot, playerInfo, canUndo: past.length > 0, canRedo: false };
        notify(listeners);
        notify(playerInfoListeners);
    };

    const updatePlayerField = <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => {
        if (Object.is(snapshot.playerInfo[field], value)) return;
        setPlayerInfo(prev => ({ ...prev, [field]: value }));
    };

    const restoreHistory = (direction: 'undo' | 'redo') => {
        const source = direction === 'undo' ? past : future;
        const destination = direction === 'undo' ? future : past;
        const playerInfo = source.pop();
        if (!playerInfo) return;
        destination.push(snapshot.playerInfo);
        lastEdit = null;
        snapshot = { ...snapshot, playerInfo, removedSticker: null,
            selectedStickerId: playerInfo.stickers?.some(sticker => sticker.id === snapshot.selectedStickerId) ? snapshot.selectedStickerId : null,
            canUndo: past.length > 0, canRedo: future.length > 0 };
        notify(listeners);
        notify(playerInfoListeners);
    };
    const undo = () => restoreHistory('undo');
    const redo = () => restoreHistory('redo');

    const commitStickerChange = (update: (stickers: Sticker[]) => Sticker[]) => {
        const current = snapshot.playerInfo.stickers ?? [];
        const next = update(current);
        if (next === current) return;
        // Menu commands are single undo steps, separate from continuous dragging.
        lastEdit = null;
        updatePlayerField('stickers', next);
        lastEdit = null;
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

        const playerInfo = { ...snapshot.playerInfo, stickers: stickers.filter(sticker => sticker.id !== id) };
        lastEdit = null;
        recordHistory(playerInfo);

        snapshot = {
            ...snapshot,
            playerInfo,
            canUndo: past.length > 0, canRedo: false,
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
        const playerInfo = { ...snapshot.playerInfo, stickers };
        lastEdit = null;
        recordHistory(playerInfo);
        snapshot = {
            ...snapshot,
            playerInfo,
            canUndo: past.length > 0, canRedo: false,
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
        commitStickerChange,
        undoStickerRemoval,
        dismissStickerUndo,
        setPersistenceStatus,
        dismissPersistenceStatus,
        undo,
        redo,
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

        const flushPersistence = () => {
            if (timeoutId === undefined) return;
            window.clearTimeout(timeoutId);
            timeoutId = undefined;
            store.setPersistenceStatus(persistPlayerInfo(store.getSnapshot().playerInfo));
        };
        const handleVisibility = () => { if (document.visibilityState === 'hidden') flushPersistence(); };
        schedulePersistence();
        const unsubscribe = store.subscribePlayerInfo(schedulePersistence);
        window.addEventListener('pagehide', flushPersistence);
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            unsubscribe();
            window.removeEventListener('pagehide', flushPersistence);
            document.removeEventListener('visibilitychange', handleVisibility);
            flushPersistence();
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
        commitStickerChange: store.commitStickerChange,
        undoStickerRemoval: store.undoStickerRemoval,
        dismissStickerUndo: store.dismissStickerUndo,
        dismissPersistenceStatus: store.dismissPersistenceStatus,
        undo: store.undo,
        redo: store.redo,
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
        canUndo: snapshot.canUndo,
        canRedo: snapshot.canRedo,
        undo: store.undo,
        redo: store.redo,
        setSelectedStickerId: store.setSelectedStickerId,
        removeSticker: store.removeSticker,
        commitStickerChange: store.commitStickerChange,
        undoStickerRemoval: store.undoStickerRemoval,
        dismissStickerUndo: store.dismissStickerUndo,
        dismissPersistenceStatus: store.dismissPersistenceStatus,
    }), [snapshot, store]);
}
