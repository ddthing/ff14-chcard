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
import { readStoredValue, writeStoredValue } from '../utils/profileStorage';

type PlayerInfoUpdater = PlayerInfo | ((prev: PlayerInfo) => PlayerInfo);
type Listener = () => void;

interface PlayerContextType {
    playerInfo: PlayerInfo;
    setPlayerInfo: (info: PlayerInfoUpdater) => void;
    commitPlayerChange: (info: PlayerInfoUpdater) => void;
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
    isHydrated: boolean;
    isPersisting: boolean;
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
    isHydrated: boolean;
    isPersisting: boolean;
    persistenceStatus: 'image-omitted' | 'failed' | null;
    canUndo: boolean;
    canRedo: boolean;
}

interface PlayerStore {
    getSnapshot: () => PlayerStoreSnapshot;
    subscribe: (listener: Listener) => () => void;
    subscribePlayerInfo: (listener: Listener) => () => void;
    setPlayerInfo: (info: PlayerInfoUpdater) => void;
    commitPlayerChange: (info: PlayerInfoUpdater) => void;
    updatePlayerField: <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => void;
    updateLanguage: (lang: Language) => void;
    updateImage: (image: string | undefined) => void;
    setSelectedStickerId: (id: string | null) => void;
    removeSticker: (id: string) => void;
    commitStickerChange: (update: (stickers: Sticker[]) => Sticker[]) => void;
    undoStickerRemoval: () => void;
    dismissStickerUndo: () => void;
    hydrate: () => Promise<void>;
    persistCurrentPlayerInfo: () => Promise<void>;
    setPersistenceStatus: (status: PlayerStoreSnapshot['persistenceStatus']) => void;
    dismissPersistenceStatus: () => void;
    undo: () => void;
    redo: () => void;
}

type PlayerActions = Omit<PlayerContextType, 'playerInfo' | 'selectedStickerId' | 'removedSticker' | 'isHydrated' | 'isPersisting' | 'persistenceStatus' | 'canUndo' | 'canRedo'>;

const STORAGE_KEY = 'ff14-playerInfo';
const CURRENT_PROFILE_KEY = 'currentProfile';
const STORAGE_REVISION_KEY = '__ff14StorageRevision';
const PENDING_WRITE_KEY = '__ff14PendingIndexedDbWrite';
const IMAGE_OMITTED_KEY = '__ff14ImageOmittedFromFallback';
const STICKER_URLS_OMITTED_KEY = '__ff14StickerUrlsOmittedFromFallback';
const CANONICAL_READ_FAILED_KEY = '__ff14CanonicalReadFailed';
const CONTINUOUS_EDIT_FIELDS = new Set<keyof PlayerInfo>(['name', 'activeTime', 'comment', 'pointColor', 'jobLevels', 'stickers']);
let lastStorageRevisionTime = 0;

interface LegacyPlayerInfo {
    playerInfo: PlayerInfo;
    rawPlayerInfo: Record<string, unknown>;
    hasPendingWrite: boolean;
    pendingRevision?: string;
    storageRevision?: string;
    imageOmitted: boolean;
    stickerUrlsOmitted: boolean;
    canonicalReadFailed: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createStorageRevision(): string {
    lastStorageRevisionTime = Math.max(Date.now(), lastStorageRevisionTime + 1);
    return `${lastStorageRevisionTime.toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function observeStorageRevision(revision?: string): void {
    if (!revision) return;
    const revisionTime = Number.parseInt(revision.split('-')[0], 36);
    if (Number.isFinite(revisionTime)) lastStorageRevisionTime = Math.max(lastStorageRevisionTime, revisionTime);
}

function isPendingFallbackNewer(legacy: LegacyPlayerInfo, indexedDbRevision?: string): boolean {
    if (!legacy.hasPendingWrite) return false;
    if (!legacy.pendingRevision || legacy.pendingRevision === indexedDbRevision) return !legacy.pendingRevision;
    if (!indexedDbRevision) return true;

    const pendingTime = Number.parseInt(legacy.pendingRevision.split('-')[0], 36);
    const indexedDbTime = Number.parseInt(indexedDbRevision.split('-')[0], 36);
    return !Number.isFinite(pendingTime) || !Number.isFinite(indexedDbTime) || pendingTime >= indexedDbTime;
}

function loadLegacyPlayerInfo(): LegacyPlayerInfo | undefined {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return undefined;
        const parsed: unknown = JSON.parse(raw);
        if (!isRecord(parsed)) return undefined;
        const pendingWrite = parsed[PENDING_WRITE_KEY];
        return {
            playerInfo: normalizePlayerInfo(parsed),
            rawPlayerInfo: parsed,
            hasPendingWrite: pendingWrite === true || typeof pendingWrite === 'string',
            pendingRevision: typeof pendingWrite === 'string' ? pendingWrite : undefined,
            storageRevision: typeof parsed[STORAGE_REVISION_KEY] === 'string' ? parsed[STORAGE_REVISION_KEY] : undefined,
            imageOmitted: parsed[IMAGE_OMITTED_KEY] === true,
            stickerUrlsOmitted: parsed[STICKER_URLS_OMITTED_KEY] === true,
            canonicalReadFailed: parsed[CANONICAL_READ_FAILED_KEY] === true,
        };
    } catch {
        return undefined;
    }
}

interface LegacyWriteMetadata {
    storageRevision?: string;
    pendingRevision?: string;
    imageOmitted?: boolean;
    stickerUrlsOmitted?: boolean;
    canonicalReadFailed?: boolean;
}

function writeLegacyPlayerInfo(playerInfo: PlayerInfo, metadata: LegacyWriteMetadata = {}): boolean {
    try {
        const value: Record<string, unknown> = { ...playerInfo };
        if (metadata.storageRevision) value[STORAGE_REVISION_KEY] = metadata.storageRevision;
        if (metadata.pendingRevision) value[PENDING_WRITE_KEY] = metadata.pendingRevision;
        if (metadata.imageOmitted) value[IMAGE_OMITTED_KEY] = true;
        if (metadata.stickerUrlsOmitted) value[STICKER_URLS_OMITTED_KEY] = true;
        if (metadata.canonicalReadFailed) value[CANONICAL_READ_FAILED_KEY] = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

function hasProfileMedia(playerInfo: PlayerInfo): boolean {
    return Boolean(playerInfo.image) || Boolean(playerInfo.stickers?.some(sticker => sticker.url.length > 0));
}

function writeLightweightLegacyPlayerInfo(
    playerInfo: PlayerInfo,
    storageRevision?: string,
    pendingRevision?: string,
    canonicalReadFailed = false,
): boolean {
    const lightweightPlayerInfo: PlayerInfo = {
        ...playerInfo,
        image: undefined,
        stickers: (playerInfo.stickers ?? []).map(sticker => ({ ...sticker, url: '' })),
    };
    return writeLegacyPlayerInfo(lightweightPlayerInfo, {
        storageRevision,
        pendingRevision,
        imageOmitted: Boolean(playerInfo.image),
        stickerUrlsOmitted: Boolean(playerInfo.stickers?.some(sticker => sticker.url.length > 0)),
        canonicalReadFailed,
    });
}

function mergeOmittedLegacyMedia(legacy: LegacyPlayerInfo, indexedDbValue: unknown, preserveUnknownMedia = false): PlayerInfo {
    if (!legacy.imageOmitted && !legacy.stickerUrlsOmitted && !preserveUnknownMedia) return legacy.playerInfo;

    const canonicalPlayerInfo = normalizePlayerInfo(indexedDbValue);
    const image = legacy.imageOmitted || (preserveUnknownMedia && !legacy.playerInfo.image)
        ? canonicalPlayerInfo.image
        : legacy.playerInfo.image;
    const canonicalStickers = new Map((canonicalPlayerInfo.stickers ?? []).map(sticker => [sticker.id, sticker]));
    const legacyStickers = Array.isArray(legacy.rawPlayerInfo.stickers) ? legacy.rawPlayerInfo.stickers : [];
    const stickers = legacy.stickerUrlsOmitted || preserveUnknownMedia
        ? legacyStickers.flatMap((candidate, index) => {
            if (!isRecord(candidate)) return [];
            const url = typeof candidate.url === 'string' && candidate.url.length > 0
                ? candidate.url
                : canonicalStickers.get(typeof candidate.id === 'string' ? candidate.id : '')?.url;
            if (!url) return [];
            return [{ ...candidate, id: typeof candidate.id === 'string' ? candidate.id : `migrated-sticker-${index}`, url }];
        })
        : legacy.playerInfo.stickers ?? [];
    if (preserveUnknownMedia) {
        const existingIds = new Set(stickers.map(sticker => isRecord(sticker) && typeof sticker.id === 'string' ? sticker.id : undefined));
        for (const sticker of canonicalPlayerInfo.stickers ?? []) {
            if (!existingIds.has(sticker.id)) stickers.push(sticker);
        }
    }

    return normalizePlayerInfo({ ...legacy.rawPlayerInfo, image, stickers });
}

async function writeIndexedDbPlayerInfo(playerInfo: PlayerInfo, existingRevision?: string): Promise<string> {
    const storageRevision = existingRevision ?? createStorageRevision();
    await writeStoredValue(CURRENT_PROFILE_KEY, { ...playerInfo, [STORAGE_REVISION_KEY]: storageRevision });
    return storageRevision;
}

interface PersistResult {
    status: PlayerStoreSnapshot['persistenceStatus'];
    indexedDbCommitted: boolean;
    fullFallbackCommitted: boolean;
    compactFallbackCommitted: boolean;
}

async function persistPlayerInfo(
    playerInfo: PlayerInfo,
    indexedDbReadSucceeded: boolean,
    canDiscardExistingLegacyMedia: boolean,
    canonicalReadFailed: boolean,
): Promise<PersistResult> {
    if (indexedDbReadSucceeded) {
        const storageRevision = createStorageRevision();
        try {
            await writeIndexedDbPlayerInfo(playerInfo, storageRevision);
            writeLightweightLegacyPlayerInfo(playerInfo, storageRevision);
            return { status: null, indexedDbCommitted: true, fullFallbackCommitted: false, compactFallbackCommitted: false };
        } catch {
            // Preserve the newer localStorage fallback with a revision marker for next hydration.
            if (writeLegacyPlayerInfo(playerInfo, { storageRevision, pendingRevision: storageRevision })) {
                return { status: null, indexedDbCommitted: false, fullFallbackCommitted: true, compactFallbackCommitted: false };
            }
            if (!canDiscardExistingLegacyMedia) {
                return { status: 'failed', indexedDbCommitted: false, fullFallbackCommitted: false, compactFallbackCommitted: false };
            }
            if (writeLightweightLegacyPlayerInfo(playerInfo, storageRevision, storageRevision)) {
                return {
                    status: hasProfileMedia(playerInfo) ? 'image-omitted' : null,
                    indexedDbCommitted: false,
                    fullFallbackCommitted: false,
                    compactFallbackCommitted: true,
                };
            }
            return { status: 'failed', indexedDbCommitted: false, fullFallbackCommitted: false, compactFallbackCommitted: false };
        }
    }

    const storageRevision = createStorageRevision();
    if (writeLegacyPlayerInfo(playerInfo, { storageRevision, pendingRevision: storageRevision, canonicalReadFailed })) {
        return { status: 'failed', indexedDbCommitted: false, fullFallbackCommitted: true, compactFallbackCommitted: false };
    }
    if (!canDiscardExistingLegacyMedia) {
        return { status: 'failed', indexedDbCommitted: false, fullFallbackCommitted: false, compactFallbackCommitted: false };
    }
    if (!writeLightweightLegacyPlayerInfo(playerInfo, storageRevision, storageRevision, canonicalReadFailed)) {
        return { status: 'failed', indexedDbCommitted: false, fullFallbackCommitted: false, compactFallbackCommitted: false };
    }
    return { status: 'failed', indexedDbCommitted: false, fullFallbackCommitted: false, compactFallbackCommitted: true };
}

function createPlayerStore(): PlayerStore {
    let snapshot: PlayerStoreSnapshot = {
        playerInfo: normalizePlayerInfo(undefined),
        selectedStickerId: null,
        removedSticker: null,
        isHydrated: false,
        isPersisting: false,
        persistenceStatus: null,
        canUndo: false,
        canRedo: false,
    };
    const past: PlayerInfo[] = [];
    const future: PlayerInfo[] = [];
    let lastEdit: { field: keyof PlayerInfo; time: number } | null = null;
    const listeners = new Set<Listener>();
    const playerInfoListeners = new Set<Listener>();
    let playerInfoVersion = 0;
    let hydrationPromise: Promise<void> | undefined;
    let persistenceQueue: Promise<void> = Promise.resolve();
    let persistenceRequestVersion = 0;
    let indexedDbReadState: 'pending' | 'present' | 'missing' | 'failed' = 'pending';
    let indexedDbCanonicalReady = false;
    let preserveExistingLegacyMedia = false;

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

        playerInfoVersion += 1;
        snapshot = { ...snapshot, playerInfo, isPersisting: true, canUndo: past.length > 0, canRedo: false };
        notify(listeners);
        notify(playerInfoListeners);
    };

    const updatePlayerField = <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => {
        if (Object.is(snapshot.playerInfo[field], value)) return;
        setPlayerInfo(prev => ({ ...prev, [field]: value }));
    };

    const commitPlayerChange = (nextInfo: PlayerInfoUpdater) => {
        // Discrete commands must not merge into typing, even when a preset
        // happens to change only one continuously edited field such as color.
        lastEdit = null;
        setPlayerInfo(nextInfo);
        lastEdit = null;
    };

    const restoreHistory = (direction: 'undo' | 'redo') => {
        const source = direction === 'undo' ? past : future;
        const destination = direction === 'undo' ? future : past;
        const playerInfo = source.pop();
        if (!playerInfo) return;
        destination.push(snapshot.playerInfo);
        lastEdit = null;
        playerInfoVersion += 1;
        snapshot = { ...snapshot, playerInfo, isPersisting: true, removedSticker: null,
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
        playerInfoVersion += 1;

        snapshot = {
            ...snapshot,
            playerInfo,
            isPersisting: true,
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
        playerInfoVersion += 1;
        snapshot = {
            ...snapshot,
            playerInfo,
            isPersisting: true,
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

    const hydrate = () => {
        if (hydrationPromise) return hydrationPromise;

        const initialPlayerInfoVersion = playerInfoVersion;
        const hydrationWork = (async () => {
            let indexedDbValue: unknown;
            try {
                indexedDbValue = await readStoredValue<unknown>(CURRENT_PROFILE_KEY);
                indexedDbReadState = indexedDbValue === undefined ? 'missing' : 'present';
            } catch {
                indexedDbReadState = 'failed';
            }

            const legacy = loadLegacyPlayerInfo();
            observeStorageRevision(legacy?.storageRevision);
            observeStorageRevision(legacy?.pendingRevision);
            if (isRecord(indexedDbValue) && typeof indexedDbValue[STORAGE_REVISION_KEY] === 'string') {
                observeStorageRevision(indexedDbValue[STORAGE_REVISION_KEY] as string);
            }
            indexedDbCanonicalReady = indexedDbReadState === 'present' || (indexedDbReadState === 'missing' && !legacy);
            preserveExistingLegacyMedia = indexedDbReadState !== 'present'
                && Boolean(legacy && !legacy.imageOmitted && !legacy.stickerUrlsOmitted && hasProfileMedia(legacy.playerInfo));
            let playerInfo: PlayerInfo | undefined;
            let persistenceStatus: PlayerStoreSnapshot['persistenceStatus'] = null;
            let shouldMigrateLegacy = false;
            let storageRevision: string | undefined;

            if (indexedDbReadState === 'present') {
                const indexedDbRecord = isRecord(indexedDbValue) ? indexedDbValue : undefined;
                const indexedDbRevision = indexedDbRecord && typeof indexedDbRecord[STORAGE_REVISION_KEY] === 'string'
                    ? indexedDbRecord[STORAGE_REVISION_KEY] as string
                    : undefined;
                const hasNewerPendingFallback = legacy ? isPendingFallbackNewer(legacy, indexedDbRevision) : false;

                if (hasNewerPendingFallback && legacy) {
                    playerInfo = mergeOmittedLegacyMedia(legacy, indexedDbValue, legacy.canonicalReadFailed);
                    persistenceStatus = legacy.canonicalReadFailed
                        ? 'failed'
                        : legacy.imageOmitted || legacy.stickerUrlsOmitted ? 'image-omitted' : null;
                    shouldMigrateLegacy = true;
                } else {
                    playerInfo = normalizePlayerInfo(indexedDbValue);
                    storageRevision = indexedDbRevision;
                }
            } else if (legacy) {
                playerInfo = legacy.playerInfo;
                if (indexedDbReadState === 'failed') {
                    // An unreadable database could contain newer or larger media than this fallback.
                    persistenceStatus = 'failed';
                } else if (legacy.canonicalReadFailed) {
                    persistenceStatus = 'failed';
                } else if (legacy.imageOmitted || legacy.stickerUrlsOmitted) {
                    persistenceStatus = 'image-omitted';
                }
                shouldMigrateLegacy = indexedDbReadState === 'missing';
            }

            if (playerInfo && playerInfoVersion === initialPlayerInfoVersion) {
                snapshot = { ...snapshot, playerInfo, persistenceStatus };
                notify(listeners);
                notify(playerInfoListeners);
            }

            if (playerInfoVersion !== initialPlayerInfoVersion) return;

            if (shouldMigrateLegacy && playerInfo) {
                // Only a resolved missing/readable key authorizes a migration write. A failed
                // read must never replace an unreadable canonical profile with a compact copy.
                try {
                    storageRevision = await writeIndexedDbPlayerInfo(playerInfo, legacy?.hasPendingWrite ? legacy.pendingRevision : undefined);
                    indexedDbCanonicalReady = true;
                    preserveExistingLegacyMedia = false;
                    if (legacy?.canonicalReadFailed) {
                        persistenceStatus = legacy.imageOmitted || legacy.stickerUrlsOmitted ? 'image-omitted' : null;
                        setPersistenceStatus(persistenceStatus);
                    }
                } catch {
                    // Leave the original or marked pending localStorage value available.
                    return;
                }
            }

            if (indexedDbReadState === 'present' && !shouldMigrateLegacy) {
                // A committed IndexedDB profile safely backs this lightweight localStorage copy.
                writeLightweightLegacyPlayerInfo(playerInfo ?? normalizePlayerInfo(indexedDbValue), storageRevision);
            } else if (shouldMigrateLegacy && playerInfo && storageRevision) {
                // Replace the old full localStorage value only after the IndexedDB commit.
                writeLightweightLegacyPlayerInfo(playerInfo, storageRevision);
            }
        })();

        hydrationPromise = hydrationWork.catch(() => undefined).then(() => {
            if (!snapshot.isHydrated) {
                snapshot = { ...snapshot, isHydrated: true };
                notify(listeners);
            }
        });

        return hydrationPromise;
    };

    const persistCurrentPlayerInfo = () => {
        if (!snapshot.isPersisting) return persistenceQueue;

        const requestVersion = ++persistenceRequestVersion;
        const queuedWrite = persistenceQueue.then(async () => {
            const savePlayerInfoVersion = playerInfoVersion;
            let persistenceResult: PersistResult;
            try {
                persistenceResult = await persistPlayerInfo(
                    snapshot.playerInfo,
                    indexedDbReadState === 'present' || indexedDbReadState === 'missing',
                    indexedDbCanonicalReady || !preserveExistingLegacyMedia,
                    indexedDbReadState === 'failed',
                );
            } catch {
                persistenceResult = {
                    status: 'failed',
                    indexedDbCommitted: false,
                    fullFallbackCommitted: false,
                    compactFallbackCommitted: false,
                };
            }

            if (requestVersion !== persistenceRequestVersion || savePlayerInfoVersion !== playerInfoVersion) return;
            if (persistenceResult.indexedDbCommitted) {
                indexedDbCanonicalReady = true;
                preserveExistingLegacyMedia = false;
            } else if (persistenceResult.fullFallbackCommitted) {
                preserveExistingLegacyMedia = !indexedDbCanonicalReady && hasProfileMedia(snapshot.playerInfo);
            } else if (persistenceResult.compactFallbackCommitted) {
                preserveExistingLegacyMedia = false;
            }
            snapshot = { ...snapshot, isPersisting: false, persistenceStatus: persistenceResult.status };
            notify(listeners);
        });
        persistenceQueue = queuedWrite.catch(() => undefined);
        return persistenceQueue;
    };

    return {
        getSnapshot: () => snapshot,
        subscribe,
        subscribePlayerInfo,
        setPlayerInfo,
        commitPlayerChange,
        updatePlayerField,
        updateLanguage,
        updateImage,
        setSelectedStickerId,
        removeSticker,
        commitStickerChange,
        undoStickerRemoval,
        dismissStickerUndo,
        hydrate,
        persistCurrentPlayerInfo,
        setPersistenceStatus,
        dismissPersistenceStatus,
        undo,
        redo,
    };
}

const PlayerContext = createContext<PlayerStore | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [store] = useState<PlayerStore>(() => createPlayerStore());
    const hydrated = useSyncExternalStore(
        store.subscribe,
        () => store.getSnapshot().isHydrated,
        () => false,
    );

    useEffect(() => {
        void store.hydrate();
    }, [store]);

    // Debounced persistence keeps typing, sliders, and sticker movement off the hot path.
    useEffect(() => {
        if (!hydrated) return;

        let timeoutId: number | undefined;

        const schedulePersistence = () => {
            if (timeoutId !== undefined) window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                timeoutId = undefined;
                void store.persistCurrentPlayerInfo();
            }, 250);
        };

        const flushPersistence = () => {
            if (timeoutId === undefined) return;
            window.clearTimeout(timeoutId);
            timeoutId = undefined;
            void store.persistCurrentPlayerInfo();
        };
        const handleVisibility = () => { if (document.visibilityState === 'hidden') flushPersistence(); };
        const unsubscribe = store.subscribePlayerInfo(schedulePersistence);
        if (store.getSnapshot().isPersisting) schedulePersistence();
        window.addEventListener('pagehide', flushPersistence);
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            unsubscribe();
            window.removeEventListener('pagehide', flushPersistence);
            document.removeEventListener('visibilitychange', handleVisibility);
            flushPersistence();
        };
    }, [hydrated, store]);

    return <PlayerContext.Provider value={store}>{children}</PlayerContext.Provider>;
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
        commitPlayerChange: store.commitPlayerChange,
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
        commitPlayerChange: store.commitPlayerChange,
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
        isHydrated: snapshot.isHydrated,
        isPersisting: snapshot.isPersisting,
        setSelectedStickerId: store.setSelectedStickerId,
        removeSticker: store.removeSticker,
        commitStickerChange: store.commitStickerChange,
        undoStickerRemoval: store.undoStickerRemoval,
        dismissStickerUndo: store.dismissStickerUndo,
        dismissPersistenceStatus: store.dismissPersistenceStatus,
    }), [snapshot, store]);
}
