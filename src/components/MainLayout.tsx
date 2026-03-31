import { type ReactNode, useEffect, useRef, useState, useMemo } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { i18n } from '../utils/i18n';
import type { Language } from '../types';
import { useWindowScale } from '../hooks/useWindowScale';

/**
 * Main Layout Component
 *
 * 전체 레이아웃 구조:
 * - 상단: Apple 스타일 글로벌 내비게이션 바
 * - 좌측: 탭 기반 폼 사이드바 (sticky)
 * - 우측: 카드 미리보기 + 하단 광고 (미리보기 패널 너비 내)
 */
interface MainLayoutProps {
    /** 폼 사이드바 콘텐츠 */
    form: ReactNode;
    /** 카드 미리보기 콘텐츠 */
    preview: ReactNode;
    /** 미리보기 패널 하단 광고 (카드 아래, 사이드바 제외 너비) */
    previewAd?: ReactNode;
    /**
     * Floating changelog badge — rendered in the bottom-right corner of the
     * preview panel. Kept in MainLayout rather than the preview component so it
     * sits above the canvas-pattern background without affecting card export.
     */
    changelogBadge?: ReactNode;
    /** 현재 언어 */
    lang: Language;
    /** 카드 레이아웃 타입 */
    layoutType: 'header' | 'left-portrait';
    /** 언어 변경 콜백 */
    onLanguageChange: (lang: Language) => void;
}

export function MainLayout({ form, preview, previewAd, changelogBadge, lang, layoutType, onLanguageChange }: MainLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardWrapperRef = useRef<HTMLDivElement>(null);
    const t = i18n[lang].layout;

    const targetWidth = useMemo(() => layoutType === 'left-portrait' ? 800 : 700, [layoutType]);
    const scale = useWindowScale(containerRef, targetWidth);

    const [cardHeight, setCardHeight] = useState(layoutType === 'left-portrait' ? 720 : 500);

    // Use ResizeObserver to track the actual height of the card
    useEffect(() => {
        if (!cardWrapperRef.current) return;
        
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentBoxSize) {
                    // Update the height wrapper, ensuring a minimum height depending on layout
                    const minH = layoutType === 'left-portrait' ? 720 : 500;
                    const h = Math.max(minH, entry.target.getBoundingClientRect().height / scale);
                    setCardHeight(h);
                }
            }
        });
        
        // Short timeout allows React to render the children first
        setTimeout(() => {
            if (cardWrapperRef.current?.firstElementChild) {
                observer.observe(cardWrapperRef.current.firstElementChild);
            }
        }, 100);

        return () => observer.disconnect();
    }, [layoutType, scale]);

    return (
        <div className="min-h-screen bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col transition-colors duration-300">

            {/* 글로벌 헤더 */}
            <header className="bg-[rgba(251,251,253,0.8)] dark:bg-[rgba(29,29,31,0.8)] backdrop-blur-xl backdrop-saturate-[180%] border-b border-[#d2d2d7]/60 dark:border-[#424245]/60 h-11 flex items-center justify-between px-6 shrink-0 z-50 transition-colors duration-300 sticky top-0">
                <div className="text-sm font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {t.headerTitle}
                </div>
                <div className="flex items-center gap-6">
                    <LanguageSelector currentLang={lang} onLanguageChange={onLanguageChange} />
                    <ThemeToggle />
                </div>
            </header>

            {/* 메인 영역 */}
            <main className="flex flex-col md:flex-row flex-1 min-h-0 items-stretch">

                {/* 사이드바: 탭 기반 폼 (지속적인 배경 + sticky 내부) */}
                <div className="w-full md:w-[420px] xl:w-[460px] bg-white dark:bg-[#1d1d1f] border-r border-[#d2d2d7]/40 dark:border-[#424245]/40 z-20 transition-colors duration-300 flex-shrink-0 order-2 md:order-1 flex flex-col">
                    <div className="md:sticky md:top-11 md:h-[calc(100vh-44px)] flex flex-col w-full h-full">
                        {/* 사이드바 헤더: 타이틀만 (튜토리얼 제거) */}
                        <div className="px-4 py-3 border-b border-[#d2d2d7]/30 dark:border-[#424245]/30 shrink-0">
                            <h1 className="font-semibold text-sm tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                                {t.title}
                            </h1>
                        </div>
                        {/* CardForm이 탭바 + 스크롤 콘텐츠 직접 관리 */}
                        <div className="flex-1 overflow-hidden flex flex-col h-full">
                            {form}
                        </div>
                    </div>
                </div>

                {/* 미리보기 패널 */}
                <div
                    ref={containerRef}
                    className="flex-1 bg-[#f5f5f7] dark:bg-[#09090b] canvas-pattern flex flex-col items-center overflow-x-clip transition-colors duration-300 p-4 md:p-8 order-1 md:order-2"
                >
                    {/* 카드 (고정 너비 + 스케일) */}
                    <div
                        className="md:sticky md:top-16 self-center relative flex justify-center mt-0 overflow-visible transition-all duration-300"
                        style={{
                            width: (layoutType === 'left-portrait' ? 800 : 700) * scale,
                            height: cardHeight * scale,
                        }}
                    >
                        <div
                            ref={cardWrapperRef}
                            className="absolute top-0 origin-top will-change-transform [backface-visibility:hidden] transform-gpu"
                            style={{
                                transform: `scale(${scale}) translateZ(0)`,
                                width: layoutType === 'left-portrait' ? 800 : 700,
                            }}
                        >
                            {preview}
                        </div>
                    </div>

                    {/* 미리보기 패널 너비 내 광고 (카드 아래, 카드와 동일 너비 컨테이너) */}
                    {previewAd && (
                        <div
                            className="mt-6 self-center"
                            style={{ width: layoutType === 'left-portrait' ? 800 : 700 }}
                        >
                            {previewAd}
                        </div>
                    )}

                    {/*
                     * Changelog Badge
                     *
                     * Pinned to the bottom-right of the preview panel viewport.
                     * Using position:fixed on mobile so it remains visible even
                     * when the card is scrolled past; on desktop it sits within
                     * the panel's sticky context.
                     */}
                    {changelogBadge && (
                        <div className="fixed bottom-20 right-4 md:absolute md:bottom-6 md:right-6 z-30">
                            {changelogBadge}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
