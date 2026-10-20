import { type KeyboardEvent, type ReactNode, type Ref, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, LoaderCircle, Focus, MoveHorizontal, Redo2, Undo2, ZoomIn } from 'lucide-react';
import type { Language } from '../types';
import { useWindowScale } from '../hooks/useWindowScale';
import { usePlayerActions, usePlayerSelector } from '../contexts/PlayerContext';
import { GlobalHeader } from './GlobalHeader';
import { Footer } from './Footer';
import { MobileEditorSheet, type MobileEditorSheetHandle } from './MobileEditorSheet';
import { PersistenceNotice } from './common/PersistenceNotice';
import { i18n } from '../utils/i18n';

interface MainLayoutProps {
    form: ReactNode;
    preview: ReactNode;
    exportControls: ReactNode;
    lang: Language;
    layoutType: 'header' | 'left-portrait';
    cardSize: { width: number; height: number };
    onLanguageChange: (lang: Language) => void;
    navigation?: ReactNode;
    editorTitle?: string;
    onStartTour?: () => void;
    onOpenLibrary?: () => void;
    mobileEditorRef?: Ref<MobileEditorSheetHandle>;
}

function HistoryControls({ lang }: { lang: Language }) {
    const canUndo = usePlayerSelector(state => state.canUndo);
    const canRedo = usePlayerSelector(state => state.canRedo);
    const { undo, redo } = usePlayerActions();
    const copy = i18n[lang].studio;
    return (
        <div className="studio-history" role="group" aria-label={copy.history}>
            <button type="button" onClick={undo} disabled={!canUndo} aria-label={copy.undo} title={copy.undoHint} aria-keyshortcuts="Control+Z Meta+Z">
                <Undo2 size={16} aria-hidden="true" />
            </button>
            <button type="button" onClick={redo} disabled={!canRedo} aria-label={copy.redo} title={copy.redoHint} aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z Control+Y">
                <Redo2 size={16} aria-hidden="true" />
            </button>
        </div>
    );
}

function DraftStatus({ lang, expanded, onInspect }: { lang: Language; expanded: boolean; onInspect: () => void }) {
    const persistenceStatus = usePlayerSelector(state => state.persistenceStatus);
    const isPersisting = usePlayerSelector(state => state.isPersisting);
    const copy = i18n[lang].studio;
    if (persistenceStatus && !isPersisting) return <button type="button" className="studio-draft studio-draft-warning studio-draft-inspect" aria-expanded={expanded} onClick={onInspect}>
        <AlertTriangle size={13} aria-hidden="true" />
        {persistenceStatus === 'image-omitted' ? copy.draftImageWarning : copy.draftWarning}
    </button>;
    return <span className="studio-draft" aria-busy={isPersisting}>
        {isPersisting ? <LoaderCircle size={13} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Check size={13} aria-hidden="true" />}
        {isPersisting ? copy.draftSaving : copy.localDraft}
    </span>;
}

export function MainLayout({
    form,
    preview,
    exportControls,
    lang,
    layoutType,
    cardSize,
    onLanguageChange,
    navigation,
    editorTitle,
    onStartTour,
    onOpenLibrary,
    mobileEditorRef,
}: MainLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const persistenceStatus = usePlayerSelector(state => state.persistenceStatus);
    const [noticeOpen, setNoticeOpen] = useState(true);
    const [previousPersistenceStatus, setPreviousPersistenceStatus] = useState(persistenceStatus);
    if (previousPersistenceStatus !== persistenceStatus) {
        setPreviousPersistenceStatus(persistenceStatus);
        setNoticeOpen(true);
    }
    const [zoom, setZoom] = useState<'fit' | 'width' | 'actual'>('fit');
    const [canvasHeight, setCanvasHeight] = useState(0);
    const targetWidth = layoutType === 'left-portrait' ? 880 : 700;
    const fitScale = useWindowScale(containerRef, targetWidth, 24, zoom === 'fit' && cardSize.height > 0 ? cardSize.height : undefined);
    const mobileFitHeight = canvasHeight > 24 && cardSize.height > 0
        ? Math.min(1, Math.max(0.001, (canvasHeight - 24) / cardSize.height))
        : 1;
    const scale = zoom === 'actual' ? 1 : zoom === 'fit' ? Math.min(fitScale, mobileFitHeight) : fitScale;
    const studioCopy = i18n[lang].studio;
    const workspaceCopy = i18n[lang].workspace;
    const { undo, redo } = usePlayerActions();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const update = () => setCanvasHeight(container.clientHeight);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    const handleHistoryKey = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.defaultPrevented || event.nativeEvent.isComposing || event.altKey || !(event.metaKey || event.ctrlKey)) return;
        const target = event.target;
        if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select, [role="dialog"], [role="slider"], [inert]'))) return;
        const key = event.key.toLowerCase();
        if (key !== 'z' && !(key === 'y' && event.ctrlKey)) return;
        event.preventDefault();
        if (event.shiftKey || key === 'y') redo(); else undo();
    };

    const changeZoom = (value: 'fit' | 'width' | 'actual') => {
        setZoom(value);
        containerRef.current?.scrollTo({ top: 0, left: 0 });
    };

    return (
        <div className="studio-page" onKeyDown={handleHistoryKey}>
            <a href="#main-content" className="skip-link">{i18n[lang].layout.skipToContent}</a>
            <GlobalHeader lang={lang} onLanguageChange={onLanguageChange} onStartTour={onStartTour} />
            <main id="main-content" aria-labelledby="page-title" className="studio-main">
                <h1 id="page-title" className="sr-only">{studioCopy.workspace}</h1>
                <div className="studio-workspace-toolbar" role="group" aria-label={workspaceCopy.tools} data-tour="export-controls">
                    <div className="studio-workspace-tools-meta">
                        <HistoryControls lang={lang} />
                        <DraftStatus lang={lang} expanded={noticeOpen} onInspect={() => setNoticeOpen(value => !value)} />
                    </div>
                    <div className="studio-workspace-export">{exportControls}</div>
                </div>
                {noticeOpen && <PersistenceNotice onDismiss={() => setNoticeOpen(false)} onOpenLibrary={onOpenLibrary} />}
                <div className={'studio-workspace' + (navigation ? ' studio-workspace--rail' : '')} role="region" aria-label={studioCopy.workspace}>
                    <MobileEditorSheet
                        ref={mobileEditorRef}
                        navigation={navigation}
                        editorTitle={editorTitle || studioCopy.editor}
                        lang={lang}
                        onStartTour={onStartTour}
                    >
                        <section id="editor-panel" tabIndex={-1} aria-labelledby="editor-title" className="studio-editor">
                            <div className="studio-panel-heading">
                                <h2 id="editor-title" key={editorTitle} className="studio-editor-current-title">{editorTitle || studioCopy.editor}</h2>
                            </div>
                            <div className="studio-form">{form}</div>
                        </section>
                    </MobileEditorSheet>
                    <section id="preview-panel" tabIndex={-1} aria-labelledby="preview-title" className="studio-preview">
                        <div className="studio-preview-toolbar">
                            <div className="flex items-center gap-3">
                                <h2 id="preview-title">{studioCopy.preview}</h2>
                                <span className="studio-live"><span />{studioCopy.live}</span>
                            </div>
                            <div className="studio-zoom" role="group" aria-label={studioCopy.zoom} data-tour="preview-controls">
                                <button type="button" aria-pressed={zoom === 'fit'} onClick={() => changeZoom('fit')} title={studioCopy.fit} aria-label={studioCopy.fit}>
                                    <Focus size={15} aria-hidden="true" />
                                </button>
                                <button type="button" aria-pressed={zoom === 'width'} onClick={() => changeZoom('width')} title={studioCopy.fitWidth} aria-label={studioCopy.fitWidth}>
                                    <MoveHorizontal size={15} aria-hidden="true" />
                                </button>
                                <span className="tabular-nums" aria-hidden="true">{Math.round(scale * 100)}%</span>
                                <button type="button" aria-pressed={zoom === 'actual'} onClick={() => changeZoom('actual')} title={studioCopy.actualSize} aria-label={studioCopy.actualSize}>
                                    <ZoomIn size={15} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                        <div ref={containerRef} className="studio-canvas" role="region" aria-label={studioCopy.canvas} tabIndex={0}>
                            <div className="studio-canvas-stage">
                                <div className="studio-artboard" style={{ width: targetWidth * scale, height: cardSize.height * scale }}>
                                    <div className="studio-card-wrapper" style={{ width: targetWidth, transform: 'scale(' + scale + ')' }}>{preview}</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
