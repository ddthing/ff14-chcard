import { type ReactNode, useEffect, useRef, useState } from 'react';
import { type Language } from '../types';
import { useWindowScale } from '../hooks/useWindowScale';
import { GlobalHeader } from './GlobalHeader';
import { Footer } from './Footer';
import { i18n } from '../utils/i18n';
import { Eye, PanelLeft, Image } from 'lucide-react';


/**
 * Main Layout Component (Floating App Widget Design)
 */
interface MainLayoutProps {
    /** 폼 사이드바 콘텐츠 */
    form: ReactNode;
    /** 카드 미리보기 콘텐츠 */
    preview: ReactNode;
    /** 현재 언어 */
    lang: Language;
    /** 카드 레이아웃 타입 */
    layoutType: 'header' | 'left-portrait';
    /** 언어 변경 콜백 */
    onLanguageChange: (lang: Language) => void;
    isExporting?: boolean;
    previewAction?: ReactNode;
}

export function MainLayout({ form, preview, lang, layoutType, onLanguageChange, isExporting, previewAction }: MainLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardWrapperRef = useRef<HTMLDivElement>(null);
    const [mobilePanel, setMobilePanel] = useState<'editor' | 'preview'>('editor');
    const t = i18n[lang].layout;


    const targetWidth = layoutType === 'left-portrait' ? 800 : 700;
    const scale = useWindowScale(containerRef, targetWidth);

    const [cardHeight, setCardHeight] = useState(layoutType === 'left-portrait' ? 720 : 500);

    // Use ResizeObserver to track the actual height of the card
    useEffect(() => {
        const wrapper = cardWrapperRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;

            // Hidden mobile panels report zero; retain the last measured size.
            if (entry.contentRect.height <= 0) return;
            const nextHeight = Math.ceil(entry.contentRect.height);
            setCardHeight(previousHeight => previousHeight === nextHeight ? previousHeight : nextHeight);
        });

        const frame = requestAnimationFrame(() => {
            observer.observe(wrapper.firstElementChild ?? wrapper);
        });

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [layoutType]);

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-200" style={{ backgroundColor: 'var(--surface-200)', color: 'var(--text-primary)' }}>
            <a href="#main-content" className="skip-link">{i18n[lang].layout.skipToContent}</a>

            {/* ── Global Header ───────────────────────────────────────────── */}
            <GlobalHeader lang={lang} onLanguageChange={onLanguageChange} pageTitle={i18n[lang].layout.headerTitle} />

            {/* ── Floating App Widget Wrapper ─────────────────────────────── */}
            <main
                id="main-content"
                aria-labelledby="page-title"
                className="flex-1 w-full flex flex-col items-center justify-start py-6 md:py-10 px-4 transition-colors duration-200"
            >
                <div className="mb-6 flex w-full max-w-[1300px] flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 id="page-title" className="text-2xl font-semibold tracking-tight md:text-4xl">{t.studioTitle}</h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">{t.studioDescription}</p>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">{t.localOnly}</p>
                </div>
                <div className="mb-3 grid w-full grid-cols-2 border border-[var(--border-default)] p-1 md:hidden" role="group" aria-label={t.title}>
                    {(['editor', 'preview'] as const).map(panel => (
                        <button key={panel} type="button" aria-pressed={mobilePanel === panel} aria-controls={panel === 'editor' ? 'editor-panel' : 'preview-panel'}
                            onClick={() => setMobilePanel(panel)}
                            className={`flex min-h-11 items-center justify-center gap-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 ${mobilePanel === panel ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-[var(--text-secondary)]'}`}>
                            {panel === 'editor' ? <PanelLeft size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                            {panel === 'editor' ? t.editor : t.livePreview}
                        </button>
                    ))}
                </div>
                <div className="w-full flex flex-col items-center justify-start">
                
                <div 
                    className="w-full max-w-[1300px] flex flex-col md:flex-row items-stretch rounded-xl md:rounded-2xl overflow-hidden relative transition-[background-color,border-color,box-shadow] duration-300"
                    style={{ 
                        backgroundColor: 'var(--surface-100)', 
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'none'
                    }}
                >
                    {/* ── Sidebar (Inside Widget) ───────────────────────────── */}
                    <aside
                        id="editor-panel"
                        aria-label={t.editor}
                        className={`${mobilePanel === 'editor' ? 'flex' : 'hidden'} md:flex order-1 w-full md:w-[340px] xl:w-[400px] z-30 flex-shrink-0 flex-col transition-colors duration-200 md:border-r`}
                        style={{ backgroundColor: 'var(--surface-50)', borderColor: 'var(--border-subtle)' }}
                    >
                        {/* Height constraint: Scrolling on desktop, natural flow on mobile */}
                        <div className="flex flex-col w-full h-auto md:h-[min(76vh,860px)] md:min-h-[620px]">
                            <div className="flex-1 overflow-hidden flex flex-col h-full">
                                {form}
                            </div>
                        </div>
                    </aside>

                    {/* ── Right Content Area (Canvas + Footer) ──────────────── */}
                    <section id="preview-panel" aria-label={t.livePreview} className={`${mobilePanel === 'preview' || isExporting ? 'flex' : 'hidden'} md:flex order-2 flex-1 flex-col min-w-0 relative items-center`}>
                        <div className="flex w-full items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface-50)] px-5 py-4">
                            <span className="flex items-center gap-2 text-xs font-semibold"><Eye size={15} aria-hidden="true" />{t.livePreview}</span>
                            <span className="text-[11px] tabular-nums text-[var(--text-muted)]">{targetWidth} × {cardHeight}</span>
                        </div>
                        
                        {/* Canvas Panel */}
                        <div
                            ref={containerRef}
                            className="preview-workspace w-full flex-1 flex flex-col items-center justify-center overflow-hidden py-8 md:py-10 transition-colors duration-200"
                        >
                            <div
                                className="self-center relative flex justify-center overflow-visible"
                                style={{
                                    width: (layoutType === 'left-portrait' ? 800 : 700) * scale,
                                    height: cardHeight * scale,
                                }}
                            >
                                <div
                                    ref={cardWrapperRef}
                                    className="preview-sheet absolute top-0 origin-top [backface-visibility:hidden] transform-gpu"
                                    style={{
                                        transform: `scale(${scale}) translateZ(0)`,
                                        width: layoutType === 'left-portrait' ? 800 : 700,
                                    }}
                                >
                                    {preview}
                                </div>
                            </div>
                        </div>
                        <p className="flex w-full items-center justify-center gap-2 border-t border-[var(--border-subtle)] bg-[var(--surface-50)] px-4 py-3 text-center text-xs leading-5 text-[var(--text-muted)]"><Image size={14} aria-hidden="true" />{t.previewHint}</p>
                        <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--surface-50)] p-4 md:hidden">{previewAction}</div>
                    </section>
                </div>
                
                </div>
            </main>

            <Footer />
        </div>
    );
}
