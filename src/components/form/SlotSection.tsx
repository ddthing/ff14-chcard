import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Save, Download, Trash2, FileDown, Upload } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import type { PlayerInfo } from '../../types';
import { Button } from '../ui/Button';
import { i18n } from '../../utils/i18n';
import { normalizePlayerInfo } from '../../utils/playerData';
import { readStoredValue, writeStoredValue } from '../../utils/profileStorage';

const SLOTS_STORAGE_KEY = 'slots';
const LEGACY_SLOTS_STORAGE_KEY = 'ff14-chcard-slots';
const PENDING_SLOTS_STORAGE_KEY = 'ff14-chcard-slots-pending';
const LOCAL_STORAGE_FALLBACK_LIMIT = 1_000_000;

interface SlotData {
    id: string;
    name: string;
    date: string;
    data: PlayerInfo;
}

function normalizeSlots(value: unknown): SlotData[] {
    if (!Array.isArray(value)) return [];

    return value.flatMap((candidate, index) => {
        if (typeof candidate !== 'object' || candidate === null || Array.isArray(candidate)) return [];
        const record = candidate as Record<string, unknown>;
        if (typeof record.data !== 'object' || record.data === null) return [];

        return [{
            id: typeof record.id === 'string' ? record.id : `imported-slot-${index}`,
            name: typeof record.name === 'string' && record.name.trim() ? record.name.trim() : `Slot ${index + 1}`,
            date: typeof record.date === 'string' ? record.date : '',
            data: normalizePlayerInfo(record.data),
        }];
    });
}

function readLocalStorageValue(key: string): { available: true; value: string | null } | { available: false } {
    try {
        return { available: true, value: window.localStorage.getItem(key) };
    } catch {
        return { available: false };
    }
}

function removeLocalStorageValue(key: string) {
    try {
        window.localStorage.removeItem(key);
    } catch {
        // IndexedDB remains the canonical store when localStorage is unavailable.
    }
}

function parseStoredSlots(raw: string): SlotData[] | undefined {
    try {
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) ? normalizeSlots(parsed) : undefined;
    } catch {
        return undefined;
    }
}

function writeLocalStorageFallback(slots: SlotData[]): boolean {
    try {
        const serialized = JSON.stringify(slots);
        if (serialized.length > LOCAL_STORAGE_FALLBACK_LIMIT) return false;
        window.localStorage.setItem(PENDING_SLOTS_STORAGE_KEY, serialized);
        return true;
    } catch {
        return false;
    }
}

interface LoadedSlots {
    slots: SlotData[];
    writable: boolean;
    unavailable?: boolean;
    error?: boolean;
}

async function loadSlots(): Promise<LoadedSlots> {
    const fallback = readLocalStorageValue(PENDING_SLOTS_STORAGE_KEY);
    const legacy = readLocalStorageValue(LEGACY_SLOTS_STORAGE_KEY);

    let storedSlots: unknown;
    try {
        storedSlots = await readStoredValue<unknown>(SLOTS_STORAGE_KEY);
    } catch {
        const fallbackSlots = fallback.available && fallback.value !== null
            ? parseStoredSlots(fallback.value)
            : undefined;
        const legacySlots = legacy.available && legacy.value !== null
            ? parseStoredSlots(legacy.value)
            : undefined;
        const readableSlots = fallbackSlots ?? legacySlots;

        return {
            slots: readableSlots ?? [],
            writable: false,
            unavailable: true,
            error: true,
        };
    }

    if (!fallback.available || !legacy.available) {
        return {
            slots: Array.isArray(storedSlots) ? normalizeSlots(storedSlots) : [],
            writable: false,
            unavailable: true,
            error: true,
        };
    }

    if (fallback.value !== null) {
        const fallbackSlots = parseStoredSlots(fallback.value);
        if (!fallbackSlots) {
            return {
                slots: Array.isArray(storedSlots) ? normalizeSlots(storedSlots) : [],
                writable: false,
                unavailable: true,
                error: true,
            };
        }

        try {
            await writeStoredValue(SLOTS_STORAGE_KEY, fallbackSlots);
            removeLocalStorageValue(PENDING_SLOTS_STORAGE_KEY);
            removeLocalStorageValue(LEGACY_SLOTS_STORAGE_KEY);
            return { slots: fallbackSlots, writable: true };
        } catch {
            return { slots: fallbackSlots, writable: true, error: true };
        }
    }

    if (storedSlots !== undefined) {
        if (!Array.isArray(storedSlots)) {
            return { slots: [], writable: false, unavailable: true, error: true };
        }
        // A stored value is canonical; any leftover legacy copy can now be removed safely.
        removeLocalStorageValue(LEGACY_SLOTS_STORAGE_KEY);
        return { slots: normalizeSlots(storedSlots), writable: true };
    }

    if (legacy.value !== null) {
        const legacySlots = parseStoredSlots(legacy.value);
        if (!legacySlots) {
            return { slots: [], writable: false, unavailable: true, error: true };
        }

        try {
            await writeStoredValue(SLOTS_STORAGE_KEY, legacySlots);
            removeLocalStorageValue(LEGACY_SLOTS_STORAGE_KEY);
            return { slots: legacySlots, writable: true };
        } catch {
            // Keep the legacy value intact until an IndexedDB write succeeds.
            return { slots: legacySlots, writable: true, error: true };
        }
    }

    return { slots: [], writable: true };
}

export function SlotSection() {
    const { playerInfo, setPlayerInfo } = usePlayer();
    const t = i18n[playerInfo.language].form;
    const [slots, setSlots] = useState<SlotData[]>([]);
    const [storageUnavailable, setStorageUnavailable] = useState(false);
    const [storageReady, setStorageReady] = useState(false);
    const [canWriteSlots, setCanWriteSlots] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [newSlotName, setNewSlotName] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    const busyRef = useRef(false);
    const slotSaveErrorRef = useRef(t.slotSaveError);

    useEffect(() => {
        slotSaveErrorRef.current = t.slotSaveError;
    }, [t.slotSaveError]);

    useEffect(() => {
        let active = true;
        void loadSlots().then(loaded => {
            if (!active) return;
            setSlots(loaded.slots);
            setStorageUnavailable(loaded.unavailable ?? false);
            setCanWriteSlots(loaded.writable);
            setStorageReady(true);
            if (loaded.error) setStatus({ type: 'error', message: slotSaveErrorRef.current });
        }).catch(() => {
            if (!active) return;
            setStorageUnavailable(true);
            setStorageReady(true);
            setCanWriteSlots(false);
            setStatus({ type: 'error', message: slotSaveErrorRef.current });
        });

        return () => {
            active = false;
        };
    }, []);

    const saveSlots = async (newSlots: SlotData[]) => {
        try {
            await writeStoredValue(SLOTS_STORAGE_KEY, newSlots);
            removeLocalStorageValue(PENDING_SLOTS_STORAGE_KEY);
            removeLocalStorageValue(LEGACY_SLOTS_STORAGE_KEY);
            setSlots(newSlots);
            setCanWriteSlots(true);
            return true;
        } catch {
            if (writeLocalStorageFallback(newSlots)) {
                setSlots(newSlots);
                return true;
            }

            setStatus({ type: 'error', message: t.slotSaveError });
            return false;
        }
    };

    const runBusy = async (operation: () => Promise<void>) => {
        if (!storageReady || !canWriteSlots || storageUnavailable || busyRef.current) return;
        busyRef.current = true;
        setIsBusy(true);
        try {
            await operation();
        } finally {
            busyRef.current = false;
            setIsBusy(false);
        }
    };

    const handleSaveCurrent = async () => {
        if (!storageReady || !canWriteSlots || storageUnavailable || busyRef.current) return;
        const name = newSlotName.trim() || playerInfo.name || t.defaultCharacter;
        const existingIndex = slots.findIndex(slot => slot.name.toLocaleLowerCase() === name.toLocaleLowerCase());
        if (existingIndex >= 0 && !window.confirm(t.overwriteSlotConfirm)) return;

        const newSlot: SlotData = {
            id: existingIndex >= 0 ? slots[existingIndex].id : Date.now().toString(),
            name,
            date: new Intl.DateTimeFormat(playerInfo.language).format(new Date()),
            data: normalizePlayerInfo(playerInfo),
        };
        const nextSlots = existingIndex >= 0
            ? slots.map((slot, index) => index === existingIndex ? newSlot : slot)
            : [...slots, newSlot];

        await runBusy(async () => {
            if (await saveSlots(nextSlots)) {
                setNewSlotName('');
                setStatus({ type: 'success', message: existingIndex >= 0 ? t.slotUpdated : t.slotSaved });
            }
        });
    };

    const handleLoad = (slot: SlotData) => {
        if (window.confirm(t.loadConfirm)) {
            setPlayerInfo(slot.data);
            setStatus({ type: 'success', message: t.slotLoaded });
        }
    };

    const handleDelete = async (id: string) => {
        if (!storageReady || !canWriteSlots || storageUnavailable || busyRef.current) return;
        if (window.confirm(t.deleteConfirm)) {
            await runBusy(async () => {
                if (await saveSlots(slots.filter(s => s.id !== id))) {
                    setStatus({ type: 'success', message: t.slotDeleted });
                }
            });
        }
    };

    const handleExport = () => {
        const payload = JSON.stringify({
            format: 'ff14-chcard-backup',
            version: 1,
            exportedAt: new Date().toISOString(),
            currentProfile: normalizePlayerInfo(playerInfo),
            slots,
        }, null, 2);
        const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `ff14-chcard-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        if (!storageUnavailable) setStatus({ type: 'success', message: t.backupExported });
    };

    const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file || !storageReady || !canWriteSlots || storageUnavailable || busyRef.current) return;

        await runBusy(async () => {
            try {
                const parsed: unknown = JSON.parse(await file.text());
                if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('invalid backup');
                const record = parsed as Record<string, unknown>;
                if (record.format !== 'ff14-chcard-backup') throw new Error('invalid backup');
                const importedSlots = normalizeSlots(record.slots);
                if (!window.confirm(t.importConfirm)) return;
                if (!await saveSlots(importedSlots)) return;
                if (record.currentProfile !== undefined) setPlayerInfo(normalizePlayerInfo(record.currentProfile));
                setStatus({ type: 'success', message: t.backupImported });
            } catch {
                setStatus({ type: 'error', message: t.backupImportError });
            }
        });
    };

    return (
        <section className="flex min-w-0 flex-col gap-4" aria-busy={!storageReady || isBusy}>
            <div className="flex flex-col gap-3">
                <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>{t.saveCurrentProfile}</span>
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="profile-slot-name"
                        aria-label={t.slotName}
                        autoComplete="off"
                        value={newSlotName}
                        onChange={e => setNewSlotName(e.target.value)}
                        placeholder={t.slotNamePlaceholder}
                        className="flex-1 rounded-[8px] px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                        style={{ backgroundColor: 'var(--surface-300)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)' }}
                    />
                    <Button
                        onClick={handleSaveCurrent}
                        size="sm"
                        disabled={!storageReady || !canWriteSlots || storageUnavailable || isBusy}
                    >
                        <Save size={14} aria-hidden="true" /> {t.save}
                    </Button>
                </div>
            </div>

            <div className="h-px w-full my-2" style={{ backgroundColor: 'var(--border-subtle)' }} />

            <div className="flex flex-wrap gap-2">
                <input
                    ref={importInputRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={handleImport}
                    aria-label={t.importBackup}
                    disabled={!storageReady || !canWriteSlots || storageUnavailable || isBusy}
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleExport} disabled={!storageReady || isBusy}>
                    <FileDown size={14} aria-hidden="true" /> {t.exportBackup}
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => importInputRef.current?.click()} disabled={!storageReady || !canWriteSlots || storageUnavailable || isBusy}>
                    <Upload size={14} aria-hidden="true" /> {t.importBackup}
                </Button>
            </div>

            {status && (
                <p
                    role="status"
                    aria-live={status.type === 'error' ? 'assertive' : 'polite'}
                    className="text-[11px]"
                    style={{ color: status.type === 'error' ? 'var(--destructive)' : 'var(--text-secondary)' }}
                >
                    {status.message}
                </p>
            )}

            <div className="flex flex-col gap-3">
                <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>{t.savedSlots} ({slots.length})</span>
                
                {!storageReady ? (
                    <div className="py-8 flex items-center justify-center text-[12px]" style={{ color: 'var(--text-muted)' }}>
                        {i18n[playerInfo.language].layout.loading}
                    </div>
                ) : storageUnavailable && slots.length === 0 ? (
                    <div className="py-8 flex items-center justify-center text-[12px]" role="status" style={{ color: 'var(--destructive)' }}>
                        {t.slotSaveError}
                    </div>
                ) : slots.length === 0 ? (
                    <div className="py-8 flex items-center justify-center text-[12px]" style={{ color: 'var(--text-muted)' }}>
                        {t.noSavedSlots}
                    </div>
                ) : (
                    slots.map(slot => (
                        <div
                            key={slot.id}
                            className="group flex min-w-0 shrink-0 items-center justify-between gap-2 rounded-[10px] p-3 transition-[color,background-color,border-color,box-shadow]"
                            style={{ backgroundColor: 'var(--surface-200)', border: '1px solid var(--border-subtle)' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                        >
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                {slot.data.image ? (
                                        <img
                                        src={slot.data.image} 
                                        alt="" 
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 shrink-0 rounded-[8px] object-cover"
                                        style={{ border: '1px solid var(--border-subtle)' }} 
                                    />
                                ) : (
                                    <div 
                                        className="w-10 h-10 shrink-0 rounded-[8px] flex items-center justify-center text-[9px] font-bold"
                                        style={{ backgroundColor: 'var(--surface-300)', border: '1px dashed var(--border-medium)', color: 'var(--text-muted)' }}
                                    >
                                        IMG
                                    </div>
                                )}
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="line-clamp-2 break-all text-[13px] font-bold" title={slot.name} style={{ color: 'var(--text-primary)' }}>{slot.name}</span>
                                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{slot.date}</span>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => handleLoad(slot)}
                                    disabled={!storageReady || isBusy}
                                    aria-label={`${slot.name} ${t.load}`}
                                    className="rounded-[6px] p-2 transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                    style={{ backgroundColor: 'var(--surface-300)', color: 'var(--text-primary)' }}
                                    title={t.load}
                                >
                                    <Download size={14} aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(slot.id)}
                                    disabled={!storageReady || !canWriteSlots || storageUnavailable || isBusy}
                                    aria-label={`${slot.name} ${t.delete}`}
                                    className="rounded-[6px] p-2 transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                    style={{ backgroundColor: 'color-mix(in oklab, var(--destructive) 10%, transparent)', color: 'var(--destructive)' }}
                                    title={t.delete}
                                >
                                    <Trash2 size={14} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
