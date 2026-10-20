import { type ReactNode, type KeyboardEvent, useRef, useState } from 'react';
import { Check, Eye, Focus, PenLine, ZoomIn, Undo2, Redo2, MoveHorizontal, CircleHelp } from 'lucide-react';
import type { Language } from '../types';
import { useWindowScale } from '../hooks/useWindowScale';
import { usePlayerActions, usePlayerSelector } from '../contexts/PlayerContext';
import { GlobalHeader } from './GlobalHeader';
import { Footer } from './Footer';
import { i18n } from '../utils/i18n';

interface MainLayoutProps {
    form: ReactNode; preview: ReactNode; exportControls: ReactNode; mobileDownload: ReactNode;
    lang: Language; layoutType: 'header' | 'left-portrait';
    cardSize: { width: number; height: number }; onLanguageChange: (lang: Language) => void;
    navigation?: ReactNode; editorTitle?: string; onStartTour?: () => void;
}
function HistoryControls({ lang }: { lang: Language }) {
    const canUndo = usePlayerSelector(s => s.canUndo);
    const canRedo = usePlayerSelector(s => s.canRedo);
    const { undo, redo } = usePlayerActions();
    const t = i18n[lang].studio;
    return <div className="studio-history" role="group" aria-label={t.history}>
        <button type="button" onClick={undo} disabled={!canUndo} aria-label={t.undo} title={t.undoHint} aria-keyshortcuts="Control+Z Meta+Z"><Undo2 size={16} aria-hidden="true" /></button>
        <button type="button" onClick={redo} disabled={!canRedo} aria-label={t.redo} title={t.redoHint} aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z Control+Y"><Redo2 size={16} aria-hidden="true" /></button>
    </div>;
}
function DraftStatus({ lang }: { lang: Language }) {
    const persistenceStatus = usePlayerSelector(s => s.persistenceStatus);
    const t = i18n[lang].studio;
    return <span className={'studio-draft' + (persistenceStatus ? ' studio-draft-warning' : '')}><Check size={13} aria-hidden="true" />{persistenceStatus ? t.draftWarning : t.localDraft}</span>;
}
export function MainLayout({ form, preview, exportControls, mobileDownload, lang, layoutType, cardSize, onLanguageChange, navigation, editorTitle, onStartTour }: MainLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const targetWidth = layoutType === 'left-portrait' ? 880 : 700;
    const [zoom, setZoom] = useState<'fit' | 'width' | 'actual'>('fit');
    const fitScale = useWindowScale(containerRef, targetWidth, 24, zoom === 'fit' ? cardSize.height : undefined);
    const scale = zoom === 'actual' ? 1 : fitScale;
    const t = i18n[lang].studio;
    const { undo, redo } = usePlayerActions();
    const handleHistoryKey = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.defaultPrevented || event.nativeEvent.isComposing || event.altKey || !(event.metaKey || event.ctrlKey)) return;
        const target = event.target;
        if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select, [role="dialog"], [role="slider"], [inert]'))) return;
        const key = event.key.toLowerCase();
        if (key !== 'z' && !(key === 'y' && event.ctrlKey)) return;
        event.preventDefault();
        if (event.shiftKey || key === 'y') redo(); else undo();
    };
    const changeZoom = (value: 'fit' | 'width' | 'actual') => { setZoom(value); containerRef.current?.scrollTo({ top: 0, left: 0 }); };
    const jumpTo = (id: string) => {
        const target = document.getElementById(id);
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    };
    return <div className="studio-page" onKeyDown={handleHistoryKey}>
        <a href="#main-content" className="skip-link">{i18n[lang].layout.skipToContent}</a>
        <GlobalHeader lang={lang} onLanguageChange={onLanguageChange} onStartTour={onStartTour} />
        <main id="main-content" aria-labelledby="page-title" className="studio-main">
            <h1 id="page-title" className="sr-only">{t.workspace}</h1>
            <div className={'studio-workspace' + (navigation ? ' studio-workspace--rail' : '')} aria-label={t.workspace}>
                {navigation}
                <section id="editor-panel" tabIndex={-1} aria-labelledby="editor-title" className="studio-editor">
                    <div className="studio-panel-heading"><h2 id="editor-title" key={editorTitle} className="studio-editor-current-title">{editorTitle || t.editor}</h2><div className="flex items-center gap-2">{onStartTour && <button type="button" className="studio-tour-trigger studio-tour-trigger--editor" onClick={onStartTour}><CircleHelp size={14} aria-hidden="true" />{i18n[lang].tour.start}</button>}<HistoryControls lang={lang} /></div></div>
                    <div className="studio-form">{form}</div>
                    <div className="studio-editor-footer"><DraftStatus lang={lang} /><span aria-hidden="true">FF XIV</span></div>
                </section>
                <section id="preview-panel" tabIndex={-1} aria-labelledby="preview-title" className="studio-preview">
                    <div className="studio-preview-toolbar">
                        <div className="flex items-center gap-3"><h2 id="preview-title">{t.preview}</h2><span className="studio-live"><span />{t.live}</span></div>
                        <div className="studio-zoom" role="group" aria-label={t.zoom} data-tour="preview-controls">
                            <button type="button" aria-pressed={zoom === 'fit'} onClick={() => changeZoom('fit')} title={t.fit} aria-label={t.fit}><Focus size={15} aria-hidden="true" /></button>
                            <button type="button" aria-pressed={zoom === 'width'} onClick={() => changeZoom('width')} title={t.fitWidth} aria-label={t.fitWidth}><MoveHorizontal size={15} aria-hidden="true" /></button>
                            <span className="tabular-nums" aria-hidden="true">{Math.round(scale * 100)}%</span>
                            <button type="button" aria-pressed={zoom === 'actual'} onClick={() => changeZoom('actual')} title={t.actualSize} aria-label={t.actualSize}><ZoomIn size={15} aria-hidden="true" /></button>
                        </div>
                    </div>
                    <div ref={containerRef} className="studio-canvas" role="region" aria-label={t.canvas} tabIndex={0}>
                        <div className="studio-artboard" style={{ width: targetWidth * scale, height: cardSize.height * scale }}>
                            <div className="studio-card-wrapper" style={{ width: targetWidth, transform: 'scale(' + scale + ')' }}>{preview}</div>
                        </div>
                    </div>
                    <div className="studio-export-bar" data-tour="export-controls">{exportControls}</div>
                </section>
            </div>
        </main>
        <Footer />
        <nav className="studio-mobile-nav" aria-label={t.workspace}>
            <button type="button" onClick={() => jumpTo('editor-panel')}><PenLine size={17} aria-hidden="true" />{t.edit}</button>
            <button type="button" onClick={() => jumpTo('preview-panel')}><Eye size={17} aria-hidden="true" />{t.preview}</button>
            {mobileDownload}
        </nav>
    </div>;
}
