import { useRef, useState, type ChangeEvent } from 'react';
import { Plus, X, Move, Maximize, RotateCw, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { i18n } from '../../utils/i18n';
import { Section } from './Section';
import type { Sticker } from '../../types';

const MAX_STICKER_FILE_SIZE = 2 * 1024 * 1024;
const MAX_STICKER_DIMENSION = 1600;

function stickerControlId(stickerId: string, control: string): string {
    return `sticker-${stickerId}-${control}`;
}

function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result as string));
        reader.addEventListener('error', () => reject(new Error('sticker-read-failed')));
        reader.readAsDataURL(file);
    });
}

function loadStickerImage(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', () => reject(new Error('sticker-decode-failed')));
        image.src = dataUrl;
    });
}

async function prepareStickerImage(file: File): Promise<string> {
    const dataUrl = await readFileAsDataUrl(file);

    // Keep animated GIFs and already-small images byte-for-byte unchanged.
    if (file.type === 'image/gif') return dataUrl;

    const image = await loadStickerImage(dataUrl);
    const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
    if (longestSide <= MAX_STICKER_DIMENSION) return dataUrl;

    const scale = MAX_STICKER_DIMENSION / longestSide;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) return dataUrl;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp', 0.85);
}

export function StickerSection() {
    const { playerInfo, updatePlayerField, selectedStickerId, setSelectedStickerId, removeSticker } = usePlayer();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const lang = playerInfo.language;
    const t = i18n[lang].form;
    const stickers = playerInfo.stickers || [];
    const [uploadError, setUploadError] = useState('');

    const handleAddSticker = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setUploadError('');

        if (file) {
            if (!file.type.startsWith('image/')) {
                setUploadError(t.stickerUploadError);
            } else if (file.size > MAX_STICKER_FILE_SIZE) {
                setUploadError(t.stickerFileTooLarge);
            } else {
                try {
                    const url = await prepareStickerImage(file);
                    const newSticker: Sticker = {
                        id: Math.random().toString(36).substr(2, 9),
                        url,
                        x: 50, y: 50, scale: 0.5, rotation: 0,
                    };
                    updatePlayerField('stickers', [...stickers, newSticker]);
                } catch {
                    setUploadError(t.stickerUploadError);
                }
            }
        }
        if (e.target) e.target.value = '';
    };

    const updateSticker = (id: string, updates: Partial<Sticker>) => {
        updatePlayerField('stickers', stickers.map(s => s.id === id ? { ...s, ...updates } : s));
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
    const sliderClass = 'w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)] focus-visible:ring-offset-2';

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
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {t.stickerHint}
                </p>

                {/* ── Add sticker button ──────────────────────────────────── */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-[8px] border-2 border-dashed py-2.5 text-[12px] font-semibold transition-[color,border-color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
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
                    <Plus size={15} aria-hidden="true" />
                    {t.addSticker}
                </button>
                <input type="file" ref={fileInputRef} accept="image/*" aria-label={t.addSticker} className="hidden" onChange={handleAddSticker} />
                {uploadError && (
                    <p role="alert" aria-live="polite" className="text-[11px] font-medium" style={{ color: 'var(--destructive)' }}>
                        {uploadError}
                    </p>
                )}

                {/* ── Sticker list ─────────────────────────────────────────── */}
                <div className="space-y-2">
                    {stickers.length === 0 ? (
                        <div
                            className="flex min-h-[64px] items-center justify-center gap-2 border border-dashed px-3 text-center text-[11px]"
                            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                            role="status"
                        >
                            <Move size={14} aria-hidden="true" />
                            <span>{t.stickerEmpty}</span>
                        </div>
                    ) : stickers.map((sticker, index) => {
                        const isSelected = selectedStickerId === sticker.id;
                        const scaleInputId = stickerControlId(sticker.id, 'scale');
                        const scaleRangeId = stickerControlId(sticker.id, 'scale-range');
                        const scaleLabelId = stickerControlId(sticker.id, 'scale-label');
                        const rotationInputId = stickerControlId(sticker.id, 'rotation');
                        const rotationRangeId = stickerControlId(sticker.id, 'rotation-range');
                        const rotationLabelId = stickerControlId(sticker.id, 'rotation-label');
                        return (
                            <div
                                key={sticker.id}
                                className="cursor-pointer rounded-[10px] p-3 transition-[color,background-color,border-color,box-shadow]"
                                role="group"
                                aria-label={`${t.stickers} ${index + 1}`}
                                style={{
                                    backgroundColor: 'var(--surface-200)',
                                    border: isSelected
                                        ? '1px solid var(--primary)'
                                        : '1px solid var(--border-subtle)',
                                    boxShadow: isSelected ? '0 0 0 2px color-mix(in oklab, var(--primary) 12%, transparent)' : 'none',
                                }}
                            >
                                {/* Header row */}
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        aria-label={`${t.stickers} ${index + 1}`}
                                        aria-pressed={isSelected}
                                        className="flex items-center gap-2.5 rounded border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                        onClick={() => setSelectedStickerId(sticker.id)}
                                    >
                                        <div
                                            className="w-9 h-9 rounded-[6px] overflow-hidden flex-shrink-0 flex items-center justify-center"
                                            style={{
                                                backgroundColor: isSelected ? 'color-mix(in oklab, var(--primary) 6%, transparent)' : 'var(--surface-300)',
                                                border: `1px solid ${isSelected ? 'color-mix(in oklab, var(--primary) 20%, transparent)' : 'var(--border-subtle)'}`,
                                            }}
                                        >
                                            <img src={sticker.url} alt="" width={36} height={36} className="h-full w-full object-contain" />
                                        </div>
                                        <span
                                            className="text-[11px] font-bold"
                                            style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}
                                        >
                                            #{index + 1}
                                        </span>
                                    </button>
                                    <div className="flex items-center gap-0.5">
                                        <button
                                            type="button"
                                            onClick={e => { e.stopPropagation(); moveSticker(index, 'forward'); }}
                                            disabled={index === stickers.length - 1}
                                            aria-label={`${t.stickers} ${index + 1} ${t.moveForward}`}
                                            className="p-1.5 rounded transition-colors disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                                        >
                                            <ChevronUp size={13} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={e => { e.stopPropagation(); moveSticker(index, 'backward'); }}
                                            disabled={index === 0}
                                            aria-label={`${t.stickers} ${index + 1} ${t.moveBackward}`}
                                            className="p-1.5 rounded transition-colors disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                                        >
                                            <ChevronDown size={13} aria-hidden="true" />
                                        </button>
                                        <div className="w-px h-3 mx-1" style={{ backgroundColor: 'var(--border-medium)' }} />
                                        <button
                                            type="button"
                                            onClick={e => { e.stopPropagation(); removeSticker(sticker.id); }}
                                            aria-label={`${t.stickers} ${index + 1} ${t.delete}`}
                                            className="p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--destructive)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                                        >
                                            <X size={14} aria-hidden="true" />
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
                                        <Settings2 size={12} aria-hidden="true" />
                                        <span>{t.advancedSticker}</span>
                                    </summary>

                                    <div
                                        className="mt-2.5 pt-2.5 space-y-3"
                                        style={{ borderTop: '1px solid var(--border-subtle)' }}
                                    >
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => updateSticker(sticker.id, { x: 50, y: 50 })}
                                                className="flex-1 border px-2 py-1.5 text-[10px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                                style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                                            >
                                                {t.centerSticker}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateSticker(sticker.id, { scale: 0.5, rotation: 0 })}
                                                className="flex-1 border px-2 py-1.5 text-[10px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                                style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                                            >
                                                {t.resetStickerTransform}
                                            </button>
                                        </div>
                                        {/* Scale + Rotation */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Scale */}
                                            <div style={panelStyle} className="space-y-1.5">
                                                <div className="flex justify-between items-center">
                                                    <label id={scaleLabelId} htmlFor={scaleInputId} className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                                        <Maximize size={10} aria-hidden="true" /> {t.stickerSize}
                                                    </label>
                                                    <div className="flex items-center gap-0.5">
                                                        <input
                                                            type="number" min="0.1" max="3" step="0.1"
                                                            id={scaleInputId}
                                                            name={scaleInputId}
                                                            aria-labelledby={scaleLabelId}
                                                            value={sticker.scale}
                                                            onChange={e => updateSticker(sticker.id, { scale: Number(e.target.value) })}
                                                            className="w-9 bg-transparent text-right text-[11px] font-mono font-bold outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                                            style={{ color: 'var(--text-primary)' }}
                                                        />
                                                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>x</span>
                                                    </div>
                                                </div>
                                                <input type="range" min="0.1" max="3" step="0.05"
                                                    id={scaleRangeId}
                                                    name={scaleRangeId}
                                                    aria-labelledby={scaleLabelId}
                                                    value={sticker.scale}
                                                    onChange={e => updateSticker(sticker.id, { scale: Number(e.target.value) })}
                                                    className={sliderClass}
                                                    style={{ color: 'var(--text-primary)' }}
                                                />
                                            </div>

                                            {/* Rotation */}
                                            <div style={panelStyle} className="space-y-1.5">
                                                <div className="flex justify-between items-center">
                                                    <label id={rotationLabelId} htmlFor={rotationInputId} className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                                        <RotateCw size={10} aria-hidden="true" /> {t.stickerRotate}
                                                    </label>
                                                    <div className="flex items-center gap-0.5">
                                                        <input
                                                            type="number" min="0" max="360"
                                                            id={rotationInputId}
                                                            name={rotationInputId}
                                                            aria-labelledby={rotationLabelId}
                                                            value={sticker.rotation}
                                                            onChange={e => updateSticker(sticker.id, { rotation: Number(e.target.value) })}
                                                            className="w-9 bg-transparent text-right text-[11px] font-mono font-bold outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                                            style={{ color: 'var(--text-primary)' }}
                                                        />
                                                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>°</span>
                                                    </div>
                                                </div>
                                                <input type="range" min="0" max="360"
                                                    id={rotationRangeId}
                                                    name={rotationRangeId}
                                                    aria-labelledby={rotationLabelId}
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
                                                { label: 'X', icon: <Move size={9} aria-hidden="true" />, key: 'x' as const },
                                                { label: 'Y', icon: <Move size={9} aria-hidden="true" className="rotate-90" />, key: 'y' as const },
                                            ].map(({ label, icon, key }) => {
                                                const inputId = stickerControlId(sticker.id, key);
                                                return (
                                                <div
                                                    key={key}
                                                    className="flex items-center justify-between px-2.5 py-1.5 rounded-[6px]"
                                                    style={{ backgroundColor: 'var(--surface-200)', border: '1px solid var(--border-subtle)' }}
                                                >
                                                    <label htmlFor={inputId} className="text-[10px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                                        {icon} {label}
                                                    </label>
                                                    <div className="flex items-center gap-0.5">
                                                        <input
                                                            type="number" min="0" max="100"
                                                            id={inputId}
                                                            name={inputId}
                                                            value={Math.round(sticker[key])}
                                                            onChange={e => updateSticker(sticker.id, { [key]: Number(e.target.value) })}
                                                            className="w-9 bg-transparent text-right text-[11px] font-mono outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                                            style={{ color: 'var(--text-primary)' }}
                                                        />
                                                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>%</span>
                                                    </div>
                                                </div>
                                                );
                                            })}
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
