import { useRef, type ChangeEvent } from 'react';
import { Plus, X, Move, Maximize, RotateCw, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { i18n } from '../../utils/i18n';
import { Section } from './Section';
import type { Sticker } from '../../types';

export function StickerSection() {
    const { playerInfo, updatePlayerField, selectedStickerId, setSelectedStickerId } = usePlayer();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const lang = playerInfo.language;
    const t = i18n[lang].form;
    const stickers = playerInfo.stickers || [];

    const handleAddSticker = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newSticker: Sticker = {
                    id: Math.random().toString(36).substr(2, 9),
                    url: reader.result as string,
                    x: 50, y: 50, scale: 0.5, rotation: 0,
                };
                updatePlayerField('stickers', [...stickers, newSticker]);
            };
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = '';
    };

    const updateSticker = (id: string, updates: Partial<Sticker>) => {
        updatePlayerField('stickers', stickers.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const removeSticker = (id: string) => {
        updatePlayerField('stickers', stickers.filter(s => s.id !== id));
        if (selectedStickerId === id) setSelectedStickerId(null);
    };

    const moveSticker = (index: number, direction: 'forward' | 'backward') => {
        if (direction === 'backward' && index > 0) {
            const arr = [...stickers];
            [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
            updatePlayerField('stickers', arr);
        } else if (direction === 'forward' && index < stickers.length - 1) {
            const arr = [...stickers];
            [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
            updatePlayerField('stickers', arr);
        }
    };

    // ─── Shared slider class (uses CSS accent-color) ─────────────────────────
    const sliderClass = 'w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-current';

    // ─── Shared sub-panel style ───────────────────────────────────────────────
    const panelStyle: React.CSSProperties = {
        backgroundColor: 'var(--surface-200)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '8px',
    };

    return (
        <Section title={t.stickers}>
            <div className="space-y-3">
                {/* ── Add sticker button ──────────────────────────────────── */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 rounded-[8px] border-2 border-dashed flex items-center justify-center gap-2 transition-all text-[12px] font-semibold"
                    style={{
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-muted)',
                        backgroundColor: 'transparent',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-medium)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                    }}
                >
                    <Plus size={15} />
                    {t.addSticker}
                </button>
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleAddSticker} />

                {/* ── Sticker list ─────────────────────────────────────────── */}
                <div className="space-y-2">
                    {stickers.map((sticker, index) => {
                        const isSelected = selectedStickerId === sticker.id;
                        return (
                            <div
                                key={sticker.id}
                                className="rounded-[10px] p-3 transition-all cursor-pointer"
                                style={{
                                    backgroundColor: 'var(--surface-200)',
                                    border: isSelected
                                        ? `1px solid var(--accent, #f54e00)`
                                        : '1px solid var(--border-subtle)',
                                    boxShadow: isSelected ? '0 0 0 2px rgba(245,78,0,0.12)' : 'none',
                                }}
                                onClick={e => {
                                    if ((e.target as HTMLElement).tagName !== 'INPUT' &&
                                        (e.target as HTMLElement).tagName !== 'SUMMARY') {
                                        setSelectedStickerId(sticker.id);
                                    }
                                }}
                            >
                                {/* Header row */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-9 h-9 rounded-[6px] overflow-hidden flex-shrink-0 flex items-center justify-center"
                                            style={{
                                                backgroundColor: isSelected ? 'rgba(245,78,0,0.06)' : 'var(--surface-300)',
                                                border: `1px solid ${isSelected ? 'rgba(245,78,0,0.2)' : 'var(--border-subtle)'}`,
                                            }}
                                        >
                                            <img src={sticker.url} alt="sticker" className="w-full h-full object-contain" />
                                        </div>
                                        <span
                                            className="text-[11px] font-bold"
                                            style={{ color: isSelected ? 'var(--accent, #f54e00)' : 'var(--text-muted)' }}
                                        >
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        <button
                                            type="button"
                                            onClick={e => { e.stopPropagation(); moveSticker(index, 'forward'); }}
                                            disabled={index === stickers.length - 1}
                                            className="p-1.5 rounded transition-colors disabled:opacity-30"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                                        >
                                            <ChevronUp size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={e => { e.stopPropagation(); moveSticker(index, 'backward'); }}
                                            disabled={index === 0}
                                            className="p-1.5 rounded transition-colors disabled:opacity-30"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                                        >
                                            <ChevronDown size={13} />
                                        </button>
                                        <div className="w-px h-3 mx-1" style={{ backgroundColor: 'var(--border-medium)' }} />
                                        <button
                                            type="button"
                                            onClick={e => { e.stopPropagation(); removeSticker(sticker.id); }}
                                            className="p-1 rounded transition-colors"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--error, #cf2d56)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Advanced settings toggle */}
                                <details className="group mt-2.5">
                                    <summary
                                        className="list-none flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold select-none transition-colors [&::-webkit-details-marker]:hidden"
                                        style={{ color: 'var(--text-muted)' }}
                                        onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
                                        onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
                                    >
                                        <Settings2 size={12} />
                                        <span>{(t as any).advancedSticker || 'Advanced Settings'}</span>
                                    </summary>

                                    <div
                                        className="mt-2.5 pt-2.5 space-y-3"
                                        style={{ borderTop: '1px solid var(--border-subtle)' }}
                                    >
                                        {/* Scale + Rotation */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Scale */}
                                            <div style={panelStyle} className="space-y-1.5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                                        <Maximize size={10} /> {t.stickerSize}
                                                    </label>
                                                    <div className="flex items-center gap-0.5">
                                                        <input
                                                            type="number" min="0.1" max="3" step="0.1"
                                                            value={sticker.scale}
                                                            onChange={e => updateSticker(sticker.id, { scale: Number(e.target.value) })}
                                                            className="w-9 bg-transparent text-right text-[11px] font-mono font-bold outline-none"
                                                            style={{ color: 'var(--text-primary)' }}
                                                        />
                                                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>x</span>
                                                    </div>
                                                </div>
                                                <input type="range" min="0.1" max="3" step="0.05"
                                                    value={sticker.scale}
                                                    onChange={e => updateSticker(sticker.id, { scale: Number(e.target.value) })}
                                                    className={sliderClass}
                                                    style={{ color: 'var(--text-primary)' }}
                                                />
                                            </div>

                                            {/* Rotation */}
                                            <div style={panelStyle} className="space-y-1.5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                                        <RotateCw size={10} /> {t.stickerRotate}
                                                    </label>
                                                    <div className="flex items-center gap-0.5">
                                                        <input
                                                            type="number" min="0" max="360"
                                                            value={sticker.rotation}
                                                            onChange={e => updateSticker(sticker.id, { rotation: Number(e.target.value) })}
                                                            className="w-9 bg-transparent text-right text-[11px] font-mono font-bold outline-none"
                                                            style={{ color: 'var(--text-primary)' }}
                                                        />
                                                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>°</span>
                                                    </div>
                                                </div>
                                                <input type="range" min="0" max="360"
                                                    value={sticker.rotation}
                                                    onChange={e => updateSticker(sticker.id, { rotation: Number(e.target.value) })}
                                                    className={sliderClass}
                                                    style={{ color: 'var(--text-primary)' }}
                                                />
                                            </div>
                                        </div>

                                        {/* X / Y position inputs */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { label: 'X', icon: <Move size={9} />, key: 'x' as const },
                                                { label: 'Y', icon: <Move size={9} className="rotate-90" />, key: 'y' as const },
                                            ].map(({ label, icon, key }) => (
                                                <div
                                                    key={key}
                                                    className="flex items-center justify-between px-2.5 py-1.5 rounded-[6px]"
                                                    style={{ backgroundColor: 'var(--surface-200)', border: '1px solid var(--border-subtle)' }}
                                                >
                                                    <label className="text-[10px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                                        {icon} {label}
                                                    </label>
                                                    <div className="flex items-center gap-0.5">
                                                        <input
                                                            type="number" min="0" max="100"
                                                            value={Math.round(sticker[key])}
                                                            onChange={e => updateSticker(sticker.id, { [key]: Number(e.target.value) })}
                                                            className="w-9 bg-transparent text-right text-[11px] font-mono outline-none"
                                                            style={{ color: 'var(--text-primary)' }}
                                                        />
                                                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </details>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
}
