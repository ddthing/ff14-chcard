import { useState } from 'react';
import { Save, Download, Trash2 } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import type { PlayerInfo } from '../../types';
import { Button } from '../ui/Button';
import { i18n } from '../../utils/i18n';

interface SlotData {
    id: string;
    name: string;
    date: string;
    data: PlayerInfo;
}

function loadSlots(): SlotData[] {
    try {
        const saved = localStorage.getItem('ff14-chcard-slots');
        return saved ? JSON.parse(saved) as SlotData[] : [];
    } catch {
        return [];
    }
}

export function SlotSection() {
    const { playerInfo, setPlayerInfo } = usePlayer();
    const t = i18n[playerInfo.language].form;
    const [slots, setSlots] = useState<SlotData[]>(loadSlots);
    const [newSlotName, setNewSlotName] = useState('');

    const saveSlots = (newSlots: SlotData[]) => {
        setSlots(newSlots);
        try {
            localStorage.setItem('ff14-chcard-slots', JSON.stringify(newSlots));
        } catch {
            // Slot persistence is best-effort and should not interrupt editing.
        }
    };

    const handleSaveCurrent = () => {
        const name = newSlotName.trim() || playerInfo.name || t.defaultCharacter;
        const newSlot: SlotData = {
            id: Date.now().toString(),
            name,
            date: new Intl.DateTimeFormat(playerInfo.language).format(new Date()),
            data: { ...playerInfo }
        };
        saveSlots([...slots, newSlot]);
        setNewSlotName('');
    };

    const handleLoad = (slot: SlotData) => {
        if (window.confirm(t.loadConfirm)) {
            setPlayerInfo(slot.data);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t.deleteConfirm)) {
            saveSlots(slots.filter(s => s.id !== id));
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
