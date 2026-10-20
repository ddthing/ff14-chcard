import { lazy, Suspense, useCallback, useState, useMemo, useRef, useEffect, type MouseEvent } from 'react';
import { MainLayout } from '../components/MainLayout';
import { CardForm } from '../components/CardForm';
import { CardPreview } from '../components/CardPreview';
import { i18n } from '../utils/i18n';
import { usePlayerActions, usePlayerSelector } from '../contexts/PlayerContext';
import { useImageExport } from '../hooks/useImageExport';
import { useToast } from '../hooks/useToast';
import { pageMeta } from '../utils/pageMeta';
import { SeoHead } from '../components/SeoHead';
import { StickerUndoNotice } from '../components/common/StickerUndoNotice';
import { useCardDimensions } from '../hooks/useCardDimensions';
import { getExportDimensions, type ExportQuality } from '../utils/exportDimensions';
import { useOriginalImageRatio } from '../hooks/useOriginalImageRatio';
import { EditorRail } from '../components/EditorRail';
import { ExportSplitButton } from '../components/ExportSplitButton';
import type { MobileEditorSheetHandle } from '../components/MobileEditorSheet';
import type { EditorTabId } from '../components/editorTabs';
import type { GuidedTourStep } from '../components/GuidedTour';
const GuidedTour = lazy(() => import('../components/GuidedTour').then(module => ({ default: module.GuidedTour })));
export function Home() {
    const hydrated = usePlayerSelector(state => state.isHydrated);
    const language = usePlayerSelector(state => state.playerInfo.language);
    if (!hydrated) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-200)' }} role="status" aria-live="polite">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{i18n[language].layout.loading}</span>
    </div>;
    return <EditorHome />;
}

function EditorHome() {
    const language = usePlayerSelector(s => s.playerInfo.language);
    const layout = usePlayerSelector(s => s.playerInfo.layout ?? 'header');
    const name = usePlayerSelector(s => s.playerInfo.name);
    const { updateImage, updateLanguage } = usePlayerActions();
    const t = i18n[language].studio;
    const [pixelRatio, setPixelRatio] = useState<ExportQuality>('original');
    const [activeTab, setActiveTab] = useState<EditorTabId>('basic');
    const [tourOpen, setTourOpen] = useState(false);
    const mobileEditorRef = useRef<MobileEditorSheetHandle>(null);
    const previousTourDetent = useRef<0 | 1 | 2>(1);
    const selectEditorTab = useCallback((tab: EditorTabId) => { setActiveTab(tab); mobileEditorRef.current?.setDetent(1); }, []);
    const editSticker = useCallback(() => selectEditorTab('stickers'), [selectEditorTab]);
    const previousTourTab = useRef<EditorTabId>('basic');
    const startTour = useCallback(() => { previousTourTab.current = activeTab; previousTourDetent.current = mobileEditorRef.current?.getDetent() ?? 1; setTourOpen(true); }, [activeTab]);
    const closeTour = useCallback(() => { setTourOpen(false); setActiveTab(previousTourTab.current); mobileEditorRef.current?.setDetent(previousTourDetent.current); }, []);
    const tourCopy = i18n[language].tour.steps;
    const tourSteps = useMemo<GuidedTourStep[]>(() => [
        { target: '[data-tour="image-upload"]', ...tourCopy.photo, prepare: () => { setActiveTab('basic'); mobileEditorRef.current?.setDetent(2); } },
        { target: 'input[name="character-name"]', ...tourCopy.basic, prepare: () => { setActiveTab('basic'); mobileEditorRef.current?.setDetent(2); } },
        { target: '[data-tour="job-selection"] [role="tablist"]', ...tourCopy.job, prepare: () => { setActiveTab('job'); mobileEditorRef.current?.setDetent(2); } },
        { target: '[data-tour="style-section"] section:first-child', ...tourCopy.style, prepare: () => { setActiveTab('style'); mobileEditorRef.current?.setDetent(2); } },
        { target: '.color-palette', ...tourCopy.design, prepare: () => { setActiveTab('design'); mobileEditorRef.current?.setDetent(2); } },
        { target: '[data-tour="stickers-section"] [data-sticker-add]', ...tourCopy.stickers, prepare: () => { setActiveTab('stickers'); mobileEditorRef.current?.setDetent(2); } },
        { target: '[data-tour="preview-controls"]', ...tourCopy.preview, prepare: () => mobileEditorRef.current?.setDetent(0) },
        { target: '[data-tour="export-controls"]', ...tourCopy.export, prepare: () => mobileEditorRef.current?.setDetent(0) },
    ], [tourCopy]);
    const editorTitle = { basic: i18n[language].form.tabBasic, job: i18n[language].form.tabJob, style: i18n[language].form.tabStyle, design: i18n[language].form.tabDesign, stickers: i18n[language].form.tabStickers, slot: i18n[language].form.tabSlot }[activeTab];
    const [isRendering, setIsRendering] = useState(false);
    const renderingRef = useRef(false);
    const returnFocusRef = useRef<HTMLButtonElement | null>(null);
    const { showToast, updateToast } = useToast();
    const exportToastRef = useRef<string | null>(null);
    const exportErrorHandledRef = useRef(false);
    const { exportRef, download } = useImageExport({
        filename: 'ff14-' + (name || 'sheet'), pixelRatio,
        errorCopy: { cors: i18n[language].layout.exportErrorCors, generic: i18n[language].layout.exportErrorGeneric, original: i18n[language].layout.exportErrorOriginal, details: i18n[language].layout.errorDetails },
        onError: message => {
            exportErrorHandledRef.current = true;
            if (exportToastRef.current) updateToast(exportToastRef.current, message, 'error');
            else showToast(message, 'error');
        },
    });
    const cardSize = useCardDimensions(exportRef);
    const originalPixelRatio = useOriginalImageRatio(exportRef);
    const outputSize = getExportDimensions(cardSize.width, cardSize.height, pixelRatio, originalPixelRatio);
    useEffect(() => {
        if (!isRendering && returnFocusRef.current) {
            const activeElement = document.activeElement;
            if (!activeElement || activeElement === document.body || activeElement === returnFocusRef.current) {
                returnFocusRef.current.focus({ preventScroll: true });
            }
            returnFocusRef.current = null;
        }
    }, [isRendering]);
    const handleDownload = async (event: MouseEvent<HTMLButtonElement>) => {
        if (renderingRef.current) return false;
        returnFocusRef.current = event.currentTarget; renderingRef.current = true; setIsRendering(true);
        exportErrorHandledRef.current = false;
        const notificationId = showToast(i18n[language].layout.renderingTitle, 'loading');
        exportToastRef.current = notificationId;
        try {
            const success = await download();
            if (success) updateToast(notificationId, t.exported, 'success');
            else if (!exportErrorHandledRef.current) updateToast(notificationId, i18n[language].layout.exportErrorGeneric, 'error');
            return success;
        } finally { exportToastRef.current = null; renderingRef.current = false; setIsRendering(false); }
    };
    const form = useMemo(() => <CardForm activeTab={activeTab} onTabChange={selectEditorTab} externalNavigation />, [activeTab, selectEditorTab]);
    const preview = useMemo(() => <CardPreview ref={exportRef} onImageChange={updateImage} onStickerEdit={editSticker} id="card-preview" />, [exportRef, updateImage, editSticker]);
    return <>
        <SeoHead meta={pageMeta[language].home} path="/" />
        <StickerUndoNotice />
        {tourOpen && <Suspense fallback={null}><GuidedTour open={tourOpen} lang={language} steps={tourSteps} onClose={closeTour} /></Suspense>}
        {isRendering && <div className="fixed inset-0 z-[100] cursor-wait bg-black/10" aria-hidden="true" />}
        <div inert={isRendering ? true : undefined} aria-hidden={isRendering || undefined}>
            <MainLayout lang={language} layoutType={layout} cardSize={cardSize} onLanguageChange={updateLanguage} form={form} preview={preview} mobileEditorRef={mobileEditorRef} onOpenLibrary={() => selectEditorTab('slot')} navigation={<EditorRail activeTab={activeTab} onTabChange={selectEditorTab} lang={language} />} editorTitle={editorTitle} onStartTour={startTour} exportControls={<ExportSplitButton lang={language} quality={pixelRatio} onQualityChange={setPixelRatio} onDownload={handleDownload} isRendering={isRendering} outputSize={outputSize} />} />
        </div>
    </>;
}
