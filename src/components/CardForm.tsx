import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { PlayerInfo } from '../types';
import { ChevronDown, Check, User, Swords, Sparkles, Palette, ImagePlus, X } from 'lucide-react';
import { i18n, getFonts } from '../utils/i18n';
import { inputClass } from '../utils/styles';
import { ImageCropperModal } from './ImageCropperModal';

// ─── Form Section Sub-Components ─────────────────────────────────────────────
import { Section } from './form/Section';
import { BasicInfoSection } from './form/BasicInfoSection';
import { JobSelectionSection } from './form/JobSelectionSection';
import { PlaystyleSection } from './form/PlaystyleSection';
import { DetailsSection } from './form/DetailsSection';
import { StickerSection } from './form/StickerSection';
import { AdBanner } from './AdBanner';

import { usePlayer } from '../contexts/PlayerContext';

type TabId = 'basic' | 'job' | 'style' | 'design';

export function CardForm() {
    const { playerInfo, setPlayerInfo, updateImage: onImageChange } = usePlayer();
    const fontRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isFontOpen, setIsFontOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>('basic');
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

    const lang = playerInfo.language || 'ko';
    const t = i18n[lang].form;
    const tp = i18n[lang].preview;
    const fontsOptions = getFonts(lang);

    // 폰트 드롭다운 외부 클릭 닫기
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (fontRef.current && !fontRef.current.contains(event.target as Node)) {
                setIsFontOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => {
        setPlayerInfo(prev => ({ ...prev, [field]: value }));
    };

    // 이미지 파일 선택 → 크롭 모달 열기
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setCropImageSrc(reader.result as string);
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = '';
    }, []);

    const handleCropApply = useCallback((croppedBase64: string) => {
        onImageChange(croppedBase64);
        setCropImageSrc(null);
    }, [onImageChange]);

    // inputClass is a shared design token — imported from utils/styles.

    // ─── Tab Definitions ───────────────────────────────────────────────────────
    const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
        { id: 'basic',  label: t.tabBasic,  icon: <User     size={13} /> },
        { id: 'job',    label: t.tabJob,    icon: <Swords   size={13} /> },
        { id: 'style',  label: t.tabStyle,  icon: <Sparkles size={13} /> },
        { id: 'design', label: t.tabDesign, icon: <Palette  size={13} /> },
    ];

    return (
        <div className="flex flex-col h-full">

            {/* ───── Crop Modal ─────────────────────────────────────────────── */}
            {cropImageSrc && (
                <ImageCropperModal
                    imageSrc={cropImageSrc}
                    onApply={handleCropApply}
                    onCancel={() => setCropImageSrc(null)}
                    lang={lang}
                    aspectRatio={playerInfo.layout === 'left-portrait' ? 2 / 4.5 : 700 / 280}
                />
            )}

            {/* Hidden file input — triggered programmatically from image UI */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* ───── Tab Bar ────────────────────────────────────────────────── */}
            <div className="px-4 pt-2.5 pb-0 shrink-0">
                <div className="flex bg-[#e8e8ed] dark:bg-[#2d2d2f] rounded-xl p-1 shadow-inner border border-[#d2d2d7]/50 dark:border-[#424245]/50">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 flex items-center justify-center gap-1
                                py-1.5 rounded-lg text-[11px] font-semibold transition-all
                                ${activeTab === tab.id
                                    ? 'bg-white dark:bg-[#48484a] text-[#1d1d1f] dark:text-white shadow-sm'
                                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'}
                            `}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ───── Tab Content ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col p-4 pb-10">

                {/* ── Tab 1: Basic ── */}
                {activeTab === 'basic' && (
                    <div className="space-y-5 animate-tab-in">

                        {/*
                         * Image Upload — Mobile Only
                         *
                         * On desktop, the card preview panel is always visible and
                         * clicking the card image triggers the file picker directly.
                         * Surfacing this control in the sidebar on desktop adds noise
                         * without providing value.
                         *
                         * On mobile (< md), the preview is collapsed at the top and
                         * tap targets are small, so we keep a dedicated upload affordance
                         * for a smooth first-run experience.
                         */}
                        <div className="block md:hidden">
                            <Section title={t.uploadImage}>
                                {playerInfo.image ? (
                                    /* Uploaded state: thumbnail with change / remove actions */
                                    <div className="flex gap-2 items-center">
                                        <div
                                            className="w-16 h-16 rounded-xl overflow-hidden border border-[#d2d2d7] dark:border-[#424245] cursor-pointer shrink-0 group relative"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <img
                                                src={playerInfo.image}
                                                alt="Character"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ImagePlus size={16} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 flex-1">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full py-2 text-xs font-semibold rounded-xl border border-[#d2d2d7] dark:border-[#424245] bg-[#f5f5f7] dark:bg-[#2d2d2f] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors flex items-center justify-center gap-1.5"
                                            >
                                                <ImagePlus size={13} /> {tp.clickToEdit}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onImageChange(undefined)}
                                                className="w-full py-2 text-xs font-semibold rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-1.5"
                                            >
                                                <X size={13} /> {t.delete}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Empty state: full-width drop zone */
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-[72px] rounded-xl border-2 border-dashed border-[#d2d2d7] dark:border-[#424245] bg-[#f5f5f7] dark:bg-[#2d2d2f] flex items-center justify-center gap-2.5 text-[#86868b] hover:border-[#424245] dark:hover:border-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-all group"
                                    >
                                        <ImagePlus size={18} className="group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-semibold">{t.uploadImage}</span>
                                    </button>
                                )}
                            </Section>
                        </div>

                        <BasicInfoSection />

                        {/* Layout Selector — moved from Design tab for discoverability */}
                        <Section title={t.layout}>
                            <div className="flex bg-[#e8e8ed] dark:bg-[#2d2d2f] rounded-xl p-1 shadow-inner border border-[#d2d2d7]/50 dark:border-[#424245]/50">
                                {(['header', 'left-portrait'] as const).map(layout => (
                                    <button
                                        key={layout}
                                        type="button"
                                        onClick={() => handleChange('layout', layout)}
                                        className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                                            playerInfo.layout === layout
                                                ? 'bg-white dark:bg-[#48484a] text-[#1d1d1f] dark:text-white shadow-sm'
                                                : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                                        }`}
                                    >
                                        {layout === 'header' ? t.layoutHeader : t.layoutPortrait}
                                    </button>
                                ))}
                            </div>
                        </Section>
                    </div>
                )}

                {/* ── Tab 2: Job ─────────────────────────────────────────────── */}
                {/*
                 * Flex fill: ensures the section expands to fill the available
                 * sidebar height regardless of how many jobs are selected.
                 * Prevents the raw canvas-pattern background from showing through
                 * the transparent save-button backdrop below short job grids.
                 */}
                {activeTab === 'job' && (
                    <div className="animate-tab-in flex-1 flex flex-col">
                        <JobSelectionSection />
                    </div>
                )}

                {/* ── Tab 3: Style ───────────────────────────────────────────── */}
                {activeTab === 'style' && (
                    <div className="space-y-5 animate-tab-in">
                        <PlaystyleSection />
                        <DetailsSection />
                    </div>
                )}

                {/* ── Tab 4: Design ──────────────────────────────────────────── */}
                {activeTab === 'design' && (
                    <div className="space-y-5 animate-tab-in relative z-20">
                        {/* Sticker Manager */}
                        <StickerSection />

                        {/* Point Color ──────────────────────────────────────── */}
                        <Section title={t.pointColor}>
                            <div className="flex items-center gap-3 px-3 bg-[#f5f5f7] dark:bg-[#2d2d2f] border border-[#d2d2d7] dark:border-[#424245] rounded-xl h-[42px]">
                                <input
                                    type="color"
                                    value={playerInfo.pointColor}
                                    onChange={(e) => handleChange('pointColor', e.target.value)}
                                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none p-0 overflow-hidden shrink-0"
                                    title={t.pointColor}
                                />
                                <input
                                    type="text"
                                    value={playerInfo.pointColor.toUpperCase()}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                                            handleChange('pointColor', val.toLowerCase());
                                        }
                                    }}
                                    className="flex-1 bg-transparent text-sm font-mono text-[#1d1d1f] dark:text-[#f5f5f7] outline-none border-none p-0 uppercase font-bold"
                                    placeholder="#HEX"
                                    maxLength={7}
                                />
                                {/* Quick-access preset swatches */}
                                <div className="flex gap-1.5 shrink-0">
                                    {['#e44c21', '#0071e3', '#30d158', '#ff375f', '#bf5af2', '#ffd60a'].map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => handleChange('pointColor', color)}
                                            className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 shrink-0"
                                            style={{
                                                backgroundColor: color,
                                                borderColor: playerInfo.pointColor === color ? '#1d1d1f' : 'transparent',
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* Font Selector ─────────────────────────────────────── */}
                        <Section title={t.font}>
                            <div className="relative w-full" ref={fontRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsFontOpen(!isFontOpen)}
                                    className={`${inputClass} flex items-center justify-between cursor-pointer`}
                                >
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const selectedFont = fontsOptions.find(f => f.id === playerInfo.font);
                                            return (
                                                <span className={`text-[15px] font-medium ${selectedFont?.id || ''}`}>
                                                    {selectedFont ? selectedFont.name : t.pleaseSelect}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`text-[#86868b] transition-transform ${isFontOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {isFontOpen && (
                                    <div className="absolute top-full mt-2 left-0 right-0 bg-white/95 dark:bg-[#1d1d1f]/95 backdrop-blur-xl border border-[#d2d2d7] dark:border-[#424245] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50 max-h-64 overflow-y-auto p-1.5 space-y-0.5">
                                        {fontsOptions.map(font => {
                                            const isSelected = playerInfo.font === font.id;
                                            return (
                                                <button
                                                    key={font.id}
                                                    type="button"
                                                    onClick={() => {
                                                        handleChange('font', font.id);
                                                        setIsFontOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${font.id} ${
                                                        isSelected
                                                            ? 'bg-neutral-100 dark:bg-[#3a3a3c] text-neutral-900 dark:text-white font-bold'
                                                            : 'hover:bg-neutral-50 dark:hover:bg-[#2d2d2f] text-neutral-700 dark:text-neutral-300 font-medium'
                                                    }`}
                                                >
                                                    <span className="text-[15px] tracking-wide">{font.name}</span>
                                                    {isSelected && <Check size={16} className="text-neutral-800 dark:text-neutral-200" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </Section>
                    </div>
                )}

                {/* ── Sidebar Ad — hidden on Job tab (grid fills the available space) ──── */}
                {activeTab !== 'job' && (
                    <div className="mt-auto pt-6 relative z-0">
                        <AdBanner variant="sidebar" />
                    </div>
                )}
            </div>
        </div>
    );
}
