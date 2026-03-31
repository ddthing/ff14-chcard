import { useRef, type ChangeEvent } from 'react';
import { Plus, X, Move, Maximize, RotateCw, Settings2 } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { i18n } from '../../utils/i18n';
import { Section } from './Section';
import type { Sticker } from '../../types';

export function StickerSection() {
    const { playerInfo, updatePlayerField } = usePlayer();
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
                    x: 50,
                    y: 50,
                    scale: 0.5,
                    rotation: 0,
                };
                updatePlayerField('stickers', [...stickers, newSticker]);
            };
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = '';
    };

    const updateSticker = (id: string, updates: Partial<Sticker>) => {
        const newStickers = stickers.map(s => s.id === id ? { ...s, ...updates } : s);
        updatePlayerField('stickers', newStickers);
    };

    const removeSticker = (id: string) => {
        const newStickers = stickers.filter(s => s.id !== id);
        updatePlayerField('stickers', newStickers);
    };

    const sliderClass = "w-full h-1.5 bg-neutral-200 dark:bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-[#0071e3]";

    return (
        <Section title={t.stickers}>
            <div className="space-y-4">
                {/* Add Button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-[#d2d2d7] dark:border-[#424245] bg-[#f5f5f7] dark:bg-[#2d2d2f] text-[#86868b] hover:border-[#424245] dark:hover:border-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    <span className="text-xs font-semibold">{t.addSticker}</span>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddSticker}
                />

                {/* Sticker List */}
                <div className="space-y-3">
                    {stickers.map((sticker, index) => (
                        <div key={sticker.id} className="bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded-xl p-4 shadow-sm">
                            {/* Header: Thumbnail + Number + Delete */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-100 dark:border-[#3a3a3c] bg-neutral-50 dark:bg-black/20 flex-shrink-0">
                                        <img src={sticker.url} alt="sticker" className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-xs font-bold text-neutral-400">#{index + 1}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSticker(sticker.id)}
                                    className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Advanced Settings Toggle — all controls inside */}
                            <details className="group mt-3">
                                <summary className="list-none flex items-center gap-1.5 cursor-pointer text-[#303030] dark:text-neutral-300 text-xs font-semibold select-none hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors [&::-webkit-details-marker]:hidden">
                                    <Settings2 size={14} />
                                    <span>{(t as any).advancedSticker || 'Advanced Settings'}</span>
                                </summary>

                                <div className="mt-3 pt-3 border-t border-[#d2d2d7]/40 dark:border-[#424245]/40 space-y-4">
                                    {/* Scale + Rotation sliders */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Scale */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                                                    <Maximize size={12} /> {t.stickerSize}
                                                </label>
                                                <span className="text-[10px] font-mono text-neutral-500">{sticker.scale.toFixed(1)}x</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="3"
                                                step="0.05"
                                                value={sticker.scale}
                                                onChange={(e) => updateSticker(sticker.id, { scale: Number(e.target.value) })}
                                                className={sliderClass}
                                            />
                                        </div>

                                        {/* Rotation */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                                                    <RotateCw size={12} /> {t.stickerRotate}
                                                </label>
                                                <span className="text-[10px] font-mono text-neutral-500">{sticker.rotation}°</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="360"
                                                value={sticker.rotation}
                                                onChange={(e) => updateSticker(sticker.id, { rotation: Number(e.target.value) })}
                                                className={sliderClass}
                                            />
                                        </div>
                                    </div>

                                    {/* X / Y compact number inputs */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* X Position */}
                                        <div className="flex items-center justify-between bg-neutral-50 dark:bg-[#2d2d2f] px-2.5 py-2 rounded-lg border border-neutral-200 dark:border-[#424245]">
                                            <label className="text-[10px] font-bold text-neutral-400 flex items-center gap-1">
                                                <Move size={10} /> X
                                            </label>
                                            <div className="flex items-center gap-0.5">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={Math.round(sticker.x)}
                                                    onChange={(e) => updateSticker(sticker.id, { x: Number(e.target.value) })}
                                                    className="w-10 bg-transparent text-right text-xs font-mono text-[#303030] dark:text-neutral-200 outline-none"
                                                />
                                                <span className="text-[10px] font-mono text-neutral-400">%</span>
                                            </div>
                                        </div>

                                        {/* Y Position */}
                                        <div className="flex items-center justify-between bg-neutral-50 dark:bg-[#2d2d2f] px-2.5 py-2 rounded-lg border border-neutral-200 dark:border-[#424245]">
                                            <label className="text-[10px] font-bold text-neutral-400 flex items-center gap-1">
                                                <Move size={10} className="rotate-90" /> Y
                                            </label>
                                            <div className="flex items-center gap-0.5">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={Math.round(sticker.y)}
                                                    onChange={(e) => updateSticker(sticker.id, { y: Number(e.target.value) })}
                                                    className="w-10 bg-transparent text-right text-xs font-mono text-[#303030] dark:text-neutral-200 outline-none"
                                                />
                                                <span className="text-[10px] font-mono text-neutral-400">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
