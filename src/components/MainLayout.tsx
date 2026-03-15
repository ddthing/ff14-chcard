import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { i18n } from '../utils/i18n';
import type { Language } from '../types';

/**
 * Main Layout Component
 * 
 * Provides the overall structure of the application, including the Apple-style 
 * navigation bar, sidebar for form inputs, and the card preview area.
 * Handles responsive scaling for the card preview to ensure it fits mobile devices.
 */
interface MainLayoutProps {
    /** The content of the form sidebar */
    form: ReactNode;
    /** The content of the card preview area */
    preview: ReactNode;
    /** Current active language */
    lang: Language;
    /** Layout type of the character card */
    layoutType: 'header' | 'left-portrait';
    /** Callback for language changes */
    onLanguageChange: (lang: Language) => void;
}

export function MainLayout({ form, preview, lang, layoutType, onLanguageChange }: MainLayoutProps) {
    // State for the scale factor of the card preview area
    const [scale, setScale] = useState(1);
    // Reference to the container of the card preview for width calculations
    const containerRef = useRef<HTMLDivElement>(null);
    // Localized layout strings
    const t = i18n[lang].layout;

    /**
     * Calculates the appropriate scale factor based on the container width.
     * Ensures the fixed-width card fits comfortably within respondent viewports.
     */
    useEffect(() => {
        const calculateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const isMobile = window.innerWidth < 1024;

                if (isMobile) {
                    // Mobile scaling logic: fill the width while maintaining a small margin
                    const availableWidth = Math.min(containerWidth - 32, window.innerWidth - 32);
                    const targetWidth = layoutType === 'left-portrait' ? 800 : 700;
                    const newScale = Math.min(1, availableWidth / targetWidth);
                    
                    // We don't cap by heightScale as strictly on mobile to allow scrolling
                    setScale(newScale);
                } else {
                    // Desktop view: keep at original size (1x)
                    setScale(1);
                }
            }
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, [layoutType]);

    return (
        <div className="min-h-screen bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col transition-colors duration-300">
            
            {/* Global Header: Apple-style translucent navigation bar */}
            <header className="bg-[rgba(251,251,253,0.8)] dark:bg-[rgba(29,29,31,0.8)] backdrop-blur-xl backdrop-saturate-[180%] border-b border-[#d2d2d7]/60 dark:border-[#424245]/60 h-11 flex items-center justify-between px-6 shrink-0 z-50 transition-colors duration-300 sticky top-0">
                <div className="text-sm font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {t.headerTitle}
                </div>
                <div className="flex items-center gap-6">
                    <LanguageSelector currentLang={lang} onLanguageChange={onLanguageChange} />
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Application Area */}
            <main className="flex flex-col lg:flex-row flex-1 min-h-0">

                {/* Sidebar Panel: Form components for character customization */}
                <div className="w-full lg:w-[420px] xl:w-[460px] bg-white dark:bg-[#1d1d1f] flex flex-col lg:h-[calc(100vh-44px)] border-r border-[#d2d2d7]/40 dark:border-[#424245]/40 z-20 transition-colors duration-300 lg:sticky lg:top-11 order-2 lg:order-1">
                    <div className="p-6 border-b border-[#d2d2d7]/30 dark:border-[#424245]/30 shrink-0">
                        <h1 className="font-semibold text-xl tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                            {t.title}
                        </h1>
                        <p className="text-[13px] text-[#86868b] mt-1">
                            {t.tutorial}
                        </p>
                    </div>
                    {/* Scrollable form content area */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {form}
                    </div>
                </div>

                {/* Preview Panel: Real-time card visualization with responsive scaling */}
                <div ref={containerRef} className="flex-1 bg-[#f5f5f7] dark:bg-black flex items-start justify-center overflow-hidden transition-colors duration-300 p-4 lg:p-8 order-1 lg:order-2">
                    <div
                        className="lg:sticky lg:top-16 origin-top"
                        style={{
                            transform: `scale(${scale})`,
                            width: layoutType === 'left-portrait' ? 800 : 700,
                            // Adjust height based on scale to prevent large empty spaces at the bottom
                            marginBottom: `${( (layoutType === 'left-portrait' ? 720 : 500) * (scale - 1) )}px`
                        }}
                    >
                        {preview}
                    </div>
                </div>
            </main>
        </div>
    );
}
