import { lazy, Suspense, useCallback, useState, useMemo, useRef, useEffect, type MouseEvent } from 'react';
import { MainLayout } from '../components/MainLayout';
import { CardForm } from '../components/CardForm';
import { CardPreview } from '../components/CardPreview';
import { Download, LoaderCircle } from 'lucide-react';
import { i18n } from '../utils/i18n';
import { usePlayerActions, usePlayerSelector } from '../contexts/PlayerContext';
import { useImageExport } from '../hooks/useImageExport';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/Button';
import { pageMeta } from '../utils/pageMeta';
import { SeoHead } from '../components/SeoHead';
import { StickerUndoNotice } from '../components/common/StickerUndoNotice';
import { PersistenceNotice } from '../components/common/PersistenceNotice';
import { useCardDimensions } from '../hooks/useCardDimensions';
import { getExportDimensions, type ExportQuality } from '../utils/exportDimensions';
import { useOriginalImageRatio } from '../hooks/useOriginalImageRatio';
import { EditorRail } from '../components/EditorRail';
import type { EditorTabId } from '../components/editorTabs';
import type { GuidedTourStep } from '../components/GuidedTour';
const GuidedTour = lazy(() => import('../components/GuidedTour').then(module => ({ default: module.GuidedTour })));
export function Home() {
    const language = usePlayerSelector(s => s.playerInfo.language);
    const layout = usePlayerSelector(s => s.playerInfo.layout ?? 'header');
    const name = usePlayerSelector(s => s.playerInfo.name);
    const { updateImage, updateLanguage } = usePlayerActions();
    const t = i18n[language].studio;
    const [pixelRatio, setPixelRatio] = useState<ExportQuality>('original');
    const [activeTab, setActiveTab] = useState<EditorTabId>('basic');
    const [tourOpen, setTourOpen] = useState(false);
    const previousTourTab = useRef<EditorTabId>('basic');
    const startTour = useCallback(() => { previousTourTab.current = activeTab; setTourOpen(true); }, [activeTab]);
    const closeTour = useCallback(() => { setTourOpen(false); setActiveTab(previousTourTab.current); }, []);
    const tourCopy = i18n[language].tour.steps;
    const tourSteps = useMemo<GuidedTourStep[]>(() => [
        { target: '[data-tour="image-upload"]', ...tourCopy.photo, prepare: () => setActiveTab('basic') },
        { target: 'input[name="character-name"]', ...tourCopy.basic, prepare: () => setActiveTab('basic') },
        { target: '[data-tour="job-selection"] [role="tablist"]', ...tourCopy.job, prepare: () => setActiveTab('job') },
        { target: '[data-tour="style-section"] section:first-child', ...tourCopy.style, prepare: () => setActiveTab('style') },
        { target: '.color-palette', ...tourCopy.design, prepare: () => setActiveTab('design') },
        { target: '[data-tour="preview-controls"]', ...tourCopy.preview },
        { target: '[data-tour="export-controls"]', ...tourCopy.export },
    ], [tourCopy]);
    const editorTitle = { basic: i18n[language].form.tabBasic, job: i18n[language].form.tabJob, style: i18n[language].form.tabStyle, design: i18n[language].form.tabDesign, slot: i18n[language].form.tabSlot }[activeTab];
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
        if (renderingRef.current) return;
        returnFocusRef.current = event.currentTarget; renderingRef.current = true; setIsRendering(true);
        exportErrorHandledRef.current = false;
        const notificationId = showToast(i18n[language].layout.renderingTitle, 'loading');
        exportToastRef.current = notificationId;
        try {
            if (await download()) updateToast(notificationId, t.exported, 'success');
            else if (!exportErrorHandledRef.current) updateToast(notificationId, i18n[language].layout.exportErrorGeneric, 'error');
        } finally { exportToastRef.current = null; renderingRef.current = false; setIsRendering(false); }
    };
    const form = useMemo(() => <CardForm activeTab={activeTab} onTabChange={setActiveTab} externalNavigation />, [activeTab]);
    const preview = useMemo(() => <CardPreview ref={exportRef} onImageChange={updateImage} id="card-preview" />, [exportRef, updateImage]);
    const downloadButton = <Button onClick={handleDownload} disabled={isRendering} aria-busy={isRendering} size="lg" className="studio-download">{isRendering ? <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}{i18n[language].layout.saveImage}</Button>;
    return <>
        <SeoHead meta={pageMeta[language].home} path="/" />
        <StickerUndoNotice /><PersistenceNotice />
        {tourOpen && <Suspense fallback={null}><GuidedTour open={tourOpen} lang={language} steps={tourSteps} onClose={closeTour} /></Suspense>}
        {isRendering && <div className="fixed inset-0 z-[100] cursor-wait bg-black/10" aria-hidden="true" />}
        <div inert={isRendering ? true : undefined} aria-hidden={isRendering || undefined}>
            <MainLayout lang={language} layoutType={layout} cardSize={cardSize} onLanguageChange={updateLanguage} form={form} preview={preview} mobileDownload={downloadButton} navigation={<EditorRail activeTab={activeTab} onTabChange={setActiveTab} lang={language} />} editorTitle={editorTitle} onStartTour={startTour} exportControls={<>
                <div className="studio-quality"><label htmlFor="export-quality">{t.quality}</label><select id="export-quality" value={pixelRatio} onChange={event => setPixelRatio(event.target.value === 'original' ? 'original' : Number(event.target.value))}>
                    <option value="original">{t.original}</option><option value={1}>{t.standard}</option><option value={2}>{t.high}</option><option value={3}>{t.ultra}</option>
                </select></div>
                <div className="studio-export-action"><div className="studio-output-info"><output className="studio-output-size" aria-label={t.outputSize}>{outputSize.width} × {outputSize.height} px</output><span>{outputSize.limited ? t.exportLimited : pixelRatio === 'original' ? t.originalHint : t.exportHint}</span></div>{downloadButton}</div>
            </>} />
        </div>
    </>;
}
