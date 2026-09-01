import { useRef, useState, type ChangeEvent } from 'react';
import { Save, Download, Trash2, FileDown, Upload } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import type { PlayerInfo } from '../../types';
import { Button } from '../ui/Button';
import { i18n } from '../../utils/i18n';
import { normalizePlayerInfo } from '../../utils/playerData';

interface SlotData {
    id: string;
    name: string;
    date: string;
    data: PlayerInfo;
}

function loadSlots(): SlotData[] {
    try {
        const saved = localStorage.getItem('ff14-chcard-slots');
        return normalizeSlots(saved ? JSON.parse(saved) : undefined);
    } catch {
        return [];
    }
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

export function SlotSection() {
    const { playerInfo, setPlayerInfo } = usePlayer();
    const t = i18n[playerInfo.language].form;
    const [slots, setSlots] = useState<SlotData[]>(loadSlots);
    const [newSlotName, setNewSlotName] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const importInputRef = useRef<HTMLInputElement>(null);

    const saveSlots = (newSlots: SlotData[]) => {
        try {
            localStorage.setItem('ff14-chcard-slots', JSON.stringify(newSlots));
            setSlots(newSlots);
            return true;
        } catch {
            setStatus({ type: 'error', message: t.slotSaveError });
            return false;
        }
    };

    const handleSaveCurrent = () => {
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
        if (saveSlots(nextSlots)) {
            setNewSlotName('');
            setStatus({ type: 'success', message: existingIndex >= 0 ? t.slotUpdated : t.slotSaved });
        }
    };

    const handleLoad = (slot: SlotData) => {
        if (window.confirm(t.loadConfirm)) {
            setPlayerInfo(slot.data);
            setStatus({ type: 'success', message: t.slotLoaded });
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t.deleteConfirm)) {
            if (saveSlots(slots.filter(s => s.id !== id))) {
                setStatus({ type: 'success', message: t.slotDeleted });
            }
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
        setStatus({ type: 'success', message: t.backupExported });
    };

    const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;

        try {
            const parsed: unknown = JSON.parse(await file.text());
            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('invalid backup');
            const record = parsed as Record<string, unknown>;
            if (record.format !== 'ff14-chcard-backup') throw new Error('invalid backup');
            const importedSlots = normalizeSlots(record.slots);
            if (!window.confirm(t.importConfirm)) return;
            if (!saveSlots(importedSlots)) return;
            if (record.currentProfile !== undefined) setPlayerInfo(normalizePlayerInfo(record.currentProfile));
            setStatus({ type: 'success', message: t.backupImported });
        } catch {
            setStatus({ type: 'error', message: t.backupImportError });
        }
    };

    return (
        <section className="flex flex-col gap-4 h-full">
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
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleExport}>
                    <FileDown size={14} aria-hidden="true" /> {t.exportBackup}
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => importInputRef.current?.click()}>
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

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>{t.savedSlots} ({slots.length})</span>
                
                {slots.length === 0 ? (
                    <div className="py-8 flex items-center justify-center text-[12px]" style={{ color: 'var(--text-muted)' }}>
                        {t.noSavedSlots}
                    </div>
                ) : (
                    slots.map(slot => (
                        <div
                            key={slot.id}
                            className="group flex items-center justify-between rounded-[10px] p-3 transition-[color,background-color,border-color,box-shadow]"
                            style={{ backgroundColor: 'var(--surface-200)', border: '1px solid var(--border-subtle)' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                        >
                            <div className="flex items-center gap-3">
                                {slot.data.image ? (
                                        <img
                                        src={slot.data.image} 
                                        alt="" 
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 rounded-[8px] object-cover"
                                        style={{ border: '1px solid var(--border-subtle)' }} 
                                    />
                                ) : (
                                    <div 
                                        className="w-10 h-10 rounded-[8px] flex items-center justify-center text-[9px] font-bold"
                                        style={{ backgroundColor: 'var(--surface-300)', border: '1px dashed var(--border-medium)', color: 'var(--text-muted)' }}
                                    >
                                        IMG
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{slot.name}</span>
                                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{slot.date}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
                                <button
                                    type="button"
                                    onClick={() => handleLoad(slot)}
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
