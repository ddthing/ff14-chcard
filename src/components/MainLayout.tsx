import { type ReactNode, useEffect, useRef, useState } from 'react';
import { type Language } from '../types';
import { useWindowScale } from '../hooks/useWindowScale';
import { GlobalHeader } from './GlobalHeader';
import { Footer } from './Footer';
import { i18n } from '../utils/i18n';


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
}

export function MainLayout({ form, preview, lang, layoutType, onLanguageChange }: MainLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardWrapperRef = useRef<HTMLDivElement>(null);


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

            const minH = layoutType === 'left-portrait' ? 720 : 500;
            const nextHeight = Math.max(minH, Math.ceil(entry.contentRect.height));
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
            <div className="flex-1 w-full flex flex-col items-center justify-start py-6 md:py-12 px-4 transition-colors duration-200">
                
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
                        className="order-1 md:order-1 w-full md:w-[400px] xl:w-[440px] z-30 flex-shrink-0 flex flex-col transition-colors duration-200 border-t md:border-t-0 md:border-r"
                        style={{ backgroundColor: 'var(--surface-50)', borderColor: 'var(--border-subtle)' }}
                    >
                        {/* Height constraint: Scrolling on desktop, natural flow on mobile */}
                        <div className="md:h-[80vh] md:max-h-[900px] md:min-h-[700px] flex flex-col w-full h-auto md:h-full">
                            <div className="flex-1 overflow-hidden flex flex-col h-full">
                                {form}
                            </div>
                        </div>
                    </aside>

                    {/* ── Right Content Area (Canvas + Footer) ──────────────── */}
                    <main id="main-content" className="order-2 md:order-2 flex-1 flex flex-col min-w-0 relative items-center justify-center py-6 px-0 md:py-10 md:px-10" style={{ backgroundColor: 'var(--surface-100)' }}>
                        
                        {/* Canvas Panel */}
                        <div
                            ref={containerRef}
                            className="w-full flex-1 flex flex-col items-center justify-center overflow-hidden md:overflow-x-clip transition-colors duration-200"
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
                                    className="absolute top-0 origin-top will-change-transform [backface-visibility:hidden] transform-gpu transition-transform duration-300 ease-out"
                                    style={{
                                        transform: `scale(${scale}) translateZ(0)`,
                                        width: layoutType === 'left-portrait' ? 800 : 700,
                                    }}
                                >
                                    {preview}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                
            </div>

            <Footer />
        </div>
    );
}
