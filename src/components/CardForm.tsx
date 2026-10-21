import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { PlayerInfo } from '../types';
import { ChevronLeft, ChevronRight, ContactRound, Swords, Tags, Paintbrush, ImagePlus, X, Archive, Layers } from 'lucide-react';
import { i18n } from '../utils/i18n';
import { ColorPalettePicker } from './ColorPalettePicker';
import { DesignPresetPicker } from './DesignPresetPicker';
import { FontPicker } from './FontPicker';
import { BackgroundEffectsSection } from './form/BackgroundEffectsSection';
const ImageCropperModal = lazy(() => import('./ImageCropperModal').then(module => ({ default: module.ImageCropperModal })));

// ─── Form Section Sub-Components ─────────────────────────────────────────────
import { Section } from './form/Section';
import { BasicInfoSection } from './form/BasicInfoSection';
import { JobSelectionSection } from './form/JobSelectionSection';
import { PlaystyleSection } from './form/PlaystyleSection';
import { DetailsSection } from './form/DetailsSection';
import { StickerSection } from './form/StickerSection';
import { SlotSection } from './form/SlotSection';

import { usePlayerActions, usePlayerSelector } from '../contexts/PlayerContext';
import { useCharacterImageUpload, type CharacterImageUploadCopy } from '../hooks/useCharacterImageUpload';
import { CharacterImageUpload } from './CharacterImageUpload';
import type { EditorTabId } from './editorTabs';

type CardFormProps = {
    activeTab?: EditorTabId;
    onTabChange?: (tab: EditorTabId) => void;
    externalNavigation?: boolean;
};

export function CardForm({ activeTab: controlledTab, onTabChange, externalNavigation = false }: CardFormProps = {}) {
    const playerInfo = usePlayerSelector(s => s.playerInfo);
    const { setPlayerInfo, commitPlayerChange, updateImage: onImageChange } = usePlayerActions();
    const panelRef = useRef<HTMLDivElement>(null);
    const scrollPositionsRef = useRef<Partial<Record<EditorTabId, number>>>({});
    const imageTriggerRef = useRef<HTMLButtonElement>(null);
    const [internalActiveTab, setInternalActiveTab] = useState<EditorTabId>('basic');
    const activeTab = controlledTab ?? internalActiveTab;
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const tabRefs = useRef<Partial<Record<EditorTabId, HTMLButtonElement | null>>>({});
    const tabListRef = useRef<HTMLDivElement>(null);
    const [tabScrollState, setTabScrollState] = useState({ left: false, right: false });

    const lang = playerInfo.language || 'ko';
    const t = i18n[lang].form;
    const tp = i18n[lang].preview;
    const studio = i18n[lang].studio;
    const {
        setInputRef: setImageInputRef,
        job: imageUploadJob,
        openPicker: openImagePicker,
        handleFileChange: handleImageFileChange,
        handleDrop: handleImageDrop,
        cancel: cancelImageUpload,
        retry: retryImageUpload,
        dismissCompleted: dismissImageUpload,
    } = useCharacterImageUpload({
        onImageReady: setCropImageSrc,
        onSelectionStart: () => setCropImageSrc(null),
    });
    const imageUploadCopy: CharacterImageUploadCopy = {
        dropPrompt: t.imageUploadDropPrompt,
        dropHint: studio.dropHint,
        reading: t.imageUploadReading,
        validating: t.imageUploadValidating,
        ready: t.imageUploadReady,
        retry: t.imageUploadRetry,
        cancel: t.imageUploadCancel,
        invalidType: t.imageInvalidType,
        readFailed: t.imageUploadError,
    };
    const isPointColorValid = /^#[0-9a-f]{6}$/i.test(playerInfo.pointColor);
    useLayoutEffect(() => {
        const panel = panelRef.current;
        if (panel) panel.scrollTop = scrollPositionsRef.current[activeTab] ?? 0;
    }, [activeTab]);

    const handleChange = <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => {
        setPlayerInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleCropApply = useCallback((croppedBase64: string) => {
        dismissImageUpload();
        onImageChange(croppedBase64);
        setCropImageSrc(null);
    }, [dismissImageUpload, onImageChange]);

    const handleCropCancel = useCallback(() => {
        dismissImageUpload();
        setCropImageSrc(null);
    }, [dismissImageUpload]);


    // ─── Tab Definitions ───────────────────────────────────────────────────────
    const tabs: { id: EditorTabId; label: string; icon: React.ReactNode }[] = [
        { id: 'basic',  label: t.tabBasic,  icon: <ContactRound size={13} /> },
        { id: 'job',    label: t.tabJob,    icon: <Swords       size={13} /> },
        { id: 'style',  label: t.tabStyle,  icon: <Tags         size={13} /> },
        { id: 'design', label: t.tabDesign, icon: <Paintbrush   size={13} /> },
        { id: 'stickers', label: t.tabStickers, icon: <Layers size={13} /> },
        { id: 'slot', label: t.tabSlot, icon: <Archive size={13} /> },
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

    const selectTab = (id: EditorTabId, focusTab = false) => {
        if (controlledTab === undefined) setInternalActiveTab(id);
        onTabChange?.(id);
        const tab = tabRefs.current[id], list = tabListRef.current;
        if (focusTab) tab?.focus({ preventScroll: true });
        if (tab && list) list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2 });
    };

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
        selectTab(nextTab.id, true);
    };

    return (
        <div className="flex flex-col h-full">

            {/* ───── Crop Modal ─────────────────────────────────────────────── */}
            {cropImageSrc && (
                <Suspense fallback={null}><ImageCropperModal
                    imageSrc={cropImageSrc}
                    onApply={handleCropApply}
                    onCancel={handleCropCancel}
                    returnFocusRef={imageTriggerRef}
                    lang={lang}
                    aspectRatio={playerInfo.layout === 'left-portrait' ? 2 / 4.5 : 700 / 280}
                /></Suspense>
            )}

            {/* ───── Tab Bar ────────────────────────────────────────────────── */}
            {!externalNavigation && <div className="relative shrink-0">
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
                            onClick={() => selectTab(tab.id)}
                            ref={element => { tabRefs.current[tab.id] = element; }}
                            id={`profile-tab-${tab.id}`}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={activeTab === tab.id ? `profile-panel-${tab.id}` : undefined}
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
            </div>}

            {!externalNavigation && <div className="studio-tab-intro" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--surface-50)' }}>
                <span>{studio.stepHints[activeTabIndex]}</span>
                <span className="tabular-nums">{activeTabIndex + 1} / {tabs.length}</span>
            </div>}

            {/* ───── Tab Content ────────────────────────────────────────────── */}
            <div
                ref={panelRef}
                onScroll={event => { scrollPositionsRef.current[activeTab] = event.currentTarget.scrollTop; }}
                className="studio-tab-content flex-1 overflow-y-auto flex flex-col"
                style={{ backgroundColor: 'var(--surface-100)' }}
                id={`profile-panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`profile-tab-${activeTab}`}
                tabIndex={0}
            >

                {/* ── Tab 1: Basic ── */}
                {activeTab === 'basic' && (
                    <div className="space-y-5 animate-tab-in">

                        <div
                            data-tour="image-upload"
                            onDragOver={playerInfo.image ? event => event.preventDefault() : undefined}
                            onDrop={playerInfo.image ? handleImageDrop : undefined}
                        >
                            <Section title={t.uploadImage}>
                                {playerInfo.image && (
                                    /* Uploaded state: thumbnail + change / remove actions */
                                    <div className="flex gap-2.5 items-center">
                                        <button
                                            ref={imageTriggerRef}
                                            type="button"
                                            aria-label={t.uploadImage}
                                            className="w-14 h-14 rounded-[8px] overflow-hidden cursor-pointer shrink-0 group relative border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                            style={{ border: '1px solid var(--border-default)' }}
                                            onClick={openImagePicker}
                                        >
                                            <img
                                                src={playerInfo.image}
                                                alt={tp.characterImage}
                                                width={56}
                                                height={56}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ImagePlus size={15} aria-hidden="true" className="text-white" />
                                            </div>
                                        </button>
                                        <div className="flex flex-col gap-1.5 flex-1">
                                            <button
                                                ref={imageTriggerRef}
                                                type="button"
                                                onClick={openImagePicker}
                                                className="w-full py-2 text-[11px] font-semibold rounded-[8px] flex items-center justify-center gap-1.5 transition-colors"
                                                style={{ backgroundColor: 'var(--surface-300)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                                                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--surface-400)')}
                                                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--surface-300)')}
                                            >
                                                <ImagePlus size={12} aria-hidden="true" /> {tp.clickToEdit}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    dismissImageUpload();
                                                    onImageChange(undefined);
                                                }}
                                                className="w-full py-2 text-[11px] font-semibold rounded-[8px] flex items-center justify-center gap-1.5 transition-colors"
                                                style={{ backgroundColor: 'color-mix(in oklab, var(--destructive) 6%, transparent)', border: '1px solid color-mix(in oklab, var(--destructive) 20%, transparent)', color: 'var(--destructive)' }}
                                                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in oklab, var(--destructive) 10%, transparent)')}
                                                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in oklab, var(--destructive) 6%, transparent)')}
                                            >
                                                <X size={12} aria-hidden="true" /> {t.delete}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <CharacterImageUpload
                                    inputRef={setImageInputRef}
                                    job={imageUploadJob}
                                    openPicker={openImagePicker}
                                    handleFileChange={handleImageFileChange}
                                    handleDrop={handleImageDrop}
                                    cancel={cancelImageUpload}
                                    retry={retryImageUpload}
                                    ariaLabel={t.uploadImage}
                                    triggerRef={playerInfo.image ? undefined : imageTriggerRef}
                                    messages={imageUploadCopy}
                                    mode={playerInfo.image ? 'compact' : 'dropzone'}
                                />
                            </Section>
                        </div>

                        <div data-tour="basic-section"><BasicInfoSection /></div>

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
                                        aria-pressed={playerInfo.layout === layout}
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
                    <div className="animate-tab-in flex-1 flex flex-col" data-tour="job-selection">
                        <JobSelectionSection />
                    </div>
                )}

                {/* ── Tab 3: Style ───────────────────────────────────────────── */}
                {activeTab === 'style' && (
                    <div className="space-y-5 animate-tab-in" data-tour="style-section">
                        <PlaystyleSection />
                        <DetailsSection />
                    </div>
                )}

                {/* ── Tab 4: Design ──────────────────────────────────────────── */}
                <div
                    hidden={activeTab !== 'design'}
                    className={`space-y-5 relative z-20${activeTab === 'design' ? ' animate-tab-in' : ''}`}
                    data-tour="design-section"
                >
                        <DesignPresetPicker
                            player={playerInfo}
                            lang={lang}
                            onSelect={preset => commitPlayerChange(previous => ({ ...previous, ...preset.settings }))}
                        />
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
                                        aria-invalid={!isPointColorValid}
                                        aria-describedby="point-color-status"
                                        name="point-color-hex"
                                        autoComplete="off"
                                        value={playerInfo.pointColor.toUpperCase()}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                                                handleChange('pointColor', val.toLowerCase());
                                            }
                                        }}
                                        className="min-w-0 flex-1 border-none bg-transparent p-0 font-mono text-[12px] font-bold uppercase outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                        style={{ color: 'var(--text-primary)' }}
                                        placeholder="#HEX"
                                        maxLength={7}
                                    />
                                </div>
                                <div id="point-color-status" className="text-[11px] leading-relaxed" role="status" aria-live="polite" style={{ color: isPointColorValid ? 'var(--text-secondary)' : 'var(--destructive)' }}>{isPointColorValid ? t.pointColorAuto : t.pointColorInvalid}</div>
                                <ColorPalettePicker value={playerInfo.pointColor} onChange={color => handleChange('pointColor', color)} lang={lang} />
                            </div>
                        </Section>

                        {/* Font Selector ─────────────────────────────────────── */}
                        <Section title={t.font}>
                            <FontPicker value={playerInfo.font} onChange={font => handleChange('font', font)} lang={lang} active={activeTab === 'design'} />
                        </Section>
                        <BackgroundEffectsSection />
                </div>

                {activeTab === 'stickers' && <div data-tour="stickers-section"><StickerSection /></div>}

                {/* ── Tab 6: Slot ─────────────────────────────────────────────── */}
                {activeTab === 'slot' && (
                    <div className="animate-tab-in flex-1 flex flex-col" data-tour="slot-section">
                        <SlotSection />
                    </div>
                )}

                {!externalNavigation && <div className="studio-step-nav">
                    <button type="button" disabled={activeTabIndex === 0} onClick={() => selectTab(tabs[activeTabIndex - 1].id, true)}><ChevronLeft size={14} aria-hidden="true" />{studio.previous}</button>
                    <button type="button" disabled={activeTabIndex === tabs.length - 1} onClick={() => selectTab(tabs[activeTabIndex + 1].id, true)}>{studio.next}<ChevronRight size={14} aria-hidden="true" /></button>
                </div>}
            </div>
        </div>
    );
}
