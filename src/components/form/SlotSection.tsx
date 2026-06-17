import { useState, useEffect } from 'react';
import { Save, Download, Trash2 } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import type { PlayerInfo } from '../../types';

interface SlotData {
    id: string;
    name: string;
    date: string;
    data: PlayerInfo;
}

export function SlotSection() {
    const { playerInfo, setPlayerInfo } = usePlayer();
    const [slots, setSlots] = useState<SlotData[]>([]);
    const [newSlotName, setNewSlotName] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('ff14-chcard-slots');
        if (saved) {
            try {
                setSlots(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const saveSlots = (newSlots: SlotData[]) => {
        setSlots(newSlots);
        localStorage.setItem('ff14-chcard-slots', JSON.stringify(newSlots));
    };

    const handleSaveCurrent = () => {
        const name = newSlotName.trim() || playerInfo.name || '캐릭터';
        const newSlot: SlotData = {
            id: Date.now().toString(),
            name,
            date: new Date().toLocaleDateString(),
            data: { ...playerInfo }
        };
        saveSlots([...slots, newSlot]);
        setNewSlotName('');
    };

    const handleLoad = (slot: SlotData) => {
        if (window.confirm('현재 작업 중인 내용이 덮어씌워집니다. 불러오시겠습니까?')) {
            setPlayerInfo(slot.data);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            saveSlots(slots.filter(s => s.id !== id));
        }
    };

    return (
        <section className="flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-3">
                <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>현재 프로필 저장</span>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newSlotName}
                        onChange={e => setNewSlotName(e.target.value)}
                        placeholder="슬롯 이름 (예: 본캐, 부캐)"
                        className="flex-1 px-3 py-2 text-[13px] rounded-[8px] focus:outline-none"
                        style={{ backgroundColor: 'var(--surface-300)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)' }}
                    />
                    <button
                        onClick={handleSaveCurrent}
                        className="px-4 py-2 rounded-[8px] flex items-center justify-center gap-1.5 text-[12px] font-bold transition-all active:scale-[0.96]"
                        style={{ backgroundColor: 'var(--text-primary)', color: 'var(--surface-200)' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                        <Save size={14} /> 저장
                    </button>
                </div>
            </div>

            <div className="h-px w-full my-2" style={{ backgroundColor: 'var(--border-subtle)' }} />

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>저장된 슬롯 ({slots.length})</span>
                
                {slots.length === 0 ? (
                    <div className="py-8 flex items-center justify-center text-[12px]" style={{ color: 'var(--text-muted)' }}>
                        저장된 슬롯이 없습니다.
                    </div>
                ) : (
                    slots.map(slot => (
                        <div
                            key={slot.id}
                            className="p-3 rounded-[10px] flex items-center justify-between group transition-all"
                            style={{ backgroundColor: 'var(--surface-200)', border: '1px solid var(--border-subtle)' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                        >
                            <div className="flex items-center gap-3">
                                {slot.data.image ? (
                                    <img 
                                        src={slot.data.image} 
                                        alt="" 
                                        className="w-10 h-10 object-cover rounded-[8px]" 
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
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleLoad(slot)}
                                    className="p-1.5 rounded-[6px] transition-colors"
                                    style={{ backgroundColor: 'var(--surface-300)', color: 'var(--text-primary)' }}
                                    title="불러오기"
                                >
                                    <Download size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(slot.id)}
                                    className="p-1.5 rounded-[6px] transition-colors"
                                    style={{ backgroundColor: 'rgba(207,45,86,0.1)', color: 'var(--error, #cf2d56)' }}
                                    title="삭제"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
