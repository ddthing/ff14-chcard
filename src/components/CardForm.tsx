import { useCallback, useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import type { PlayerInfo } from '../types';
import { ChevronDown, Check, ContactRound, Swords, Tags, Paintbrush, ImagePlus, X, Save } from 'lucide-react';
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
import { SlotSection } from './form/SlotSection';

import { usePlayer } from '../contexts/PlayerContext';

type TabId = 'basic' | 'job' | 'style' | 'design' | 'slot';

export function CardForm() {
    const { playerInfo, setPlayerInfo, updateImage: onImageChange } = usePlayer();
    const fontRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isFontOpen, setIsFontOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>('basic');
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});
    const tabListRef = useRef<HTMLDivElement>(null);
    const [tabScrollState, setTabScrollState] = useState({ left: false, right: false });

    const lang = playerInfo.language || 'ko';
    const t = i18n[lang].form;
    const tp = i18n[lang].preview;
    const fontsOptions = getFonts(lang);
    const isPointColorValid = /^#[0-9a-f]{6}$/i.test(playerInfo.pointColor);

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
        { id: 'basic',  label: t.tabBasic,  icon: <ContactRound size={13} /> },
        { id: 'job',    label: t.tabJob,    icon: <Swords       size={13} /> },
        { id: 'style',  label: t.tabStyle,  icon: <Tags         size={13} /> },
        { id: 'design', label: t.tabDesign, icon: <Paintbrush   size={13} /> },
        { id: 'slot',   label: t.tabSlot,   icon: <Save         size={13} /> },
    ];

    const activeTabIndex = Math.max(0, tabs.findIndex(tab => tab.id === activeTab));

    const updateTabScrollState = useCallback(() => {
        const element = tabListRef.current;
        if (!element) return;

        const nextState = {
            left: element.scrollLeft > 1,
            right: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
        };
        setTabScrollState(current => (
            current.left === nextState.left && current.right === nextState.right
                ? current
                : nextState
        ));
    }, []);

    useEffect(() => {
        const element = tabListRef.current;
        if (!element) return;

        updateTabScrollState();
        const observer = new ResizeObserver(updateTabScrollState);
        observer.observe(element);
        return () => observer.disconnect();
    }, [lang, updateTabScrollState]);

    const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
        const key = event.key;
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;

        event.preventDefault();
        const nextIndex = key === 'Home'
            ? 0
            : key === 'End'
                ? tabs.length - 1
                : (currentIndex + (key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        const nextTab = tabs[nextIndex];
        setActiveTab(nextTab.id);
        tabRefs.current[nextTab.id]?.focus();
    };

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
                aria-label={t.uploadImage}
                className="hidden"
                onChange={handleFileChange}
            />

            {/* ───── Tab Bar ────────────────────────────────────────────────── */}
            <div className="relative shrink-0">
                <div
                    ref={tabListRef}
                    className="flex overflow-x-auto px-1 scrollbar-hide"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    role="tablist"
                    aria-orientation="horizontal"
                    aria-label={t.tabNavigation}
                    onScroll={updateTabScrollState}
                    data-tab-overflow-left={tabScrollState.left || undefined}
                    data-tab-overflow-right={tabScrollState.right || undefined}
                >
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            ref={element => { tabRefs.current[tab.id] = element; }}
                            id={`profile-tab-${tab.id}`}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`profile-panel-${tab.id}`}
                            tabIndex={activeTab === tab.id ? 0 : -1}
                            onKeyDown={event => handleTabKeyDown(event, index)}
                            className="relative flex min-w-[78px] flex-1 items-center justify-center gap-1.5 px-2 py-3 text-[11px] font-semibold transition-[color,background-color,box-shadow] duration-150 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-medium)]"
                            style={{
                                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                            }}
                        >
                            <span aria-hidden="true">{tab.icon}</span>
                            <span>{tab.label}</span>
                            {/* Active indicator line */}
                            {activeTab === tab.id && (
                                <span
                                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                                    style={{ backgroundColor: 'var(--text-primary)' }}
                                />
                            )}
                        </button>
                    ))}
                </div>
                {tabScrollState.left && (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-0 w-5"
                        style={{ background: 'linear-gradient(to right, var(--surface-50), transparent)' }}
                    />
                )}
                {tabScrollState.right && (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 right-0 w-5"
                        style={{ background: 'linear-gradient(to left, var(--surface-50), transparent)' }}
                    />
                )}
            </div>

            <div className="flex shrink-0 items-center justify-between px-4 py-2 text-[10px] font-semibold" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--surface-50)' }}>
                <span>{tabs[activeTabIndex].label}</span>
                <span className="tabular-nums">{activeTabIndex + 1} / {tabs.length}</span>
            </div>

            {/* ───── Tab Content ────────────────────────────────────────────── */}
            <div
                className="flex-1 overflow-y-auto scrollbar-hide flex flex-col p-4 pb-10"
                style={{ backgroundColor: 'var(--surface-100)' }}
                id={`profile-panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`profile-tab-${activeTab}`}
                tabIndex={0}
            >

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
                                    /* Uploaded state: thumbnail + change / remove actions */
                                    <div className="flex gap-2.5 items-center">
                                        <div
                                            className="w-14 h-14 rounded-[8px] overflow-hidden cursor-pointer shrink-0 group relative"
                                            style={{ border: '1px solid var(--border-default)' }}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <img
                                                src={playerInfo.image}
                                                alt={t.nickname}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ImagePlus size={15} aria-hidden="true" className="text-white" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 flex-1">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full py-2 text-[11px] font-semibold rounded-[8px] flex items-center justify-center gap-1.5 transition-colors"
                                                style={{ backgroundColor: 'var(--surface-300)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                                                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--surface-400)')}
                                                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--surface-300)')}
                                            >
                                                <ImagePlus size={12} aria-hidden="true" /> {tp.clickToEdit}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onImageChange(undefined)}
                                                className="w-full py-2 text-[11px] font-semibold rounded-[8px] flex items-center justify-center gap-1.5 transition-colors"
                                                style={{ backgroundColor: 'color-mix(in oklab, var(--destructive) 6%, transparent)', border: '1px solid color-mix(in oklab, var(--destructive) 20%, transparent)', color: 'var(--destructive)' }}
                                                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in oklab, var(--destructive) 10%, transparent)')}
                                                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in oklab, var(--destructive) 6%, transparent)')}
                                            >
                                                <X size={12} aria-hidden="true" /> {t.delete}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Empty state: full-width drop zone */
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                    className="group flex h-[64px] w-full items-center justify-center gap-2.5 rounded-[8px] border-2 border-dashed text-[12px] font-semibold transition-[color,border-color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                        style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)', backgroundColor: 'transparent' }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
                                            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-medium)';
                                            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                                        }}
                                    >
                                        <ImagePlus size={16} aria-hidden="true" className="group-hover:scale-110 transition-transform" />
                                        {t.uploadImage}
                                    </button>
                                )}
                            </Section>
                        </div>

                        <BasicInfoSection />

                        {/* Layout Selector */}
                        <Section title={t.layout}>
                            <div
                                className="flex rounded-[8px] p-[3px] gap-0.5"
                                style={{ backgroundColor: 'var(--surface-300)', border: '1px solid var(--border-subtle)' }}
                            >
                                {(['header', 'left-portrait'] as const).map(layout => (
                                    <button
                                        key={layout}
                                        type="button"
                                        onClick={() => handleChange('layout', layout)}
                                        className="flex-1 rounded-[6px] py-1.5 text-[11px] font-semibold transition-[color,background-color,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                        style={
                                            playerInfo.layout === layout
                                                ? {
                                                    backgroundColor: 'var(--surface-50)',
                                                    color: 'var(--text-primary)',
                                                    border: '1px solid var(--border-default)',
                                                }
                                                : { color: 'var(--text-muted)', border: '1px solid transparent' }
                                        }
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
                            <div className="space-y-2.5">
                                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                    {t.pointColorHint}
                                </p>
                                <div
                                    className="flex items-center gap-2.5 px-3 min-w-0 overflow-hidden"
                                    style={{
                                        backgroundColor: 'var(--surface-300)',
                                        border: '1px solid var(--border-default)',
                                        height: '42px',
                                    }}
                                >
                                    <input
                                        type="color"
                                        aria-label={t.pointColor}
                                        name="point-color"
                                        value={isPointColorValid ? playerInfo.pointColor : '#000000'}
                                        onChange={(e) => handleChange('pointColor', e.target.value)}
                                        className="h-7 w-7 shrink-0 cursor-pointer border-none bg-transparent p-0"
                                        title={t.pointColor}
                                    />
                                    <input
                                        type="text"
                                        aria-label={`${t.pointColor} HEX`}
                                        name="point-color-hex"
                                        autoComplete="off"
                                        value={playerInfo.pointColor.toUpperCase()}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                                                handleChange('pointColor', val.toLowerCase());
                                            }
                                        }}
                                        className="min-w-0 flex-1 border-none bg-transparent p-0 font-mono text-[12px] font-bold uppercase outline-none"
                                        style={{ color: 'var(--text-primary)' }}
                                        placeholder="#HEX"
                                        maxLength={7}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                                        {t.colorPresets}
                                    </p>
                                    <div className="grid grid-cols-6 gap-2" role="group" aria-label={t.colorPresets}>
                                        {['#e44c21', '#0071e3', '#30d158', '#ff375f', '#bf5af2', '#ffd60a'].map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => handleChange('pointColor', color)}
                                                aria-label={`${t.pointColor}: ${color}`}
                                                aria-pressed={playerInfo.pointColor === color}
                                                className="h-7 w-full border transition-[transform,box-shadow] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                                style={{
                                                    backgroundColor: color,
                                                    borderColor: playerInfo.pointColor === color ? 'var(--text-primary)' : 'transparent',
                                                    boxShadow: playerInfo.pointColor === color ? '0 0 0 1px var(--surface-100)' : 'none',
                                                }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Font Selector ─────────────────────────────────────── */}
                        <Section title={t.font}>
                            <div className="relative w-full" ref={fontRef}>
                                 <button
                                     type="button"
                                     onClick={() => setIsFontOpen(!isFontOpen)}
                                     aria-label={t.font}
                                     aria-expanded={isFontOpen}
                                     aria-haspopup="listbox"
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
                                         aria-hidden="true"
                                         className={`text-[#86868b] transition-transform ${isFontOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {isFontOpen && (
                                     <div
                                         className="absolute top-full mt-1.5 left-0 right-0 rounded-[10px] z-50 max-h-60 overflow-y-auto p-1"
                                         role="listbox"
                                         aria-label={t.font}
                                         style={{
                                            backgroundColor: 'var(--surface-100)',
                                            border: '1px solid var(--border-medium)',
                                        }}
                                    >
                                        {fontsOptions.map(font => {
                                            const isSelected = playerInfo.font === font.id;
                                            return (
                                                 <button
                                                     key={font.id}
                                                     type="button"
                                                     role="option"
                                                     aria-selected={isSelected}
                                                     onClick={() => {
                                                        handleChange('font', font.id);
                                                        setIsFontOpen(false);
                                                    }}
                                                    className="card-preview w-full flex items-center justify-between px-3 py-2 rounded-[7px] transition-colors duration-100"
                                                    style={{
                                                        backgroundColor: isSelected ? 'var(--surface-300)' : 'transparent',
                                                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                                                    }}
                                                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--surface-200)'; }}
                                                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                                >
                                                    <span className={`text-[14px] ${font.id}`}>{font.name}</span>
                                                    {isSelected && <Check size={14} aria-hidden="true" style={{ color: 'var(--text-primary)' }} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </Section>
                    </div>
                )}

                {/* ── Tab 5: Slot ─────────────────────────────────────────────── */}
                {activeTab === 'slot' && (
                    <div className="animate-tab-in flex-1 flex flex-col">
                        <SlotSection />
                    </div>
                )}

            </div>
        </div>
    );
}
