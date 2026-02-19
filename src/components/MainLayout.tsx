import { type ReactNode, useRef, useState, useEffect, useCallback } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface MainLayoutProps {
    form: ReactNode;
    preview: ReactNode;
}

function PreviewScaler({ children }: { children: ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [innerHeight, setInnerHeight] = useState<number | undefined>(undefined);

    const CARD_WIDTH = 700;
    const PADDING = 32; // 16px * 2

    const updateScale = useCallback(() => {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.clientWidth - PADDING;
        const newScale = Math.min(1, containerWidth / CARD_WIDTH);
        setScale(newScale);
    }, []);

    const updateHeight = useCallback(() => {
        if (!innerRef.current) return;
        setInnerHeight(innerRef.current.offsetHeight);
    }, []);

    useEffect(() => {
        updateScale();
        updateHeight();
        const observer = new ResizeObserver(() => {
            updateScale();
            updateHeight();
        });
        if (containerRef.current) observer.observe(containerRef.current);
        if (innerRef.current) observer.observe(innerRef.current);
        return () => observer.disconnect();
    }, [updateScale, updateHeight]);

    const wrapperHeight = innerHeight && scale < 1 ? innerHeight * scale : undefined;

    return (
        <div ref={containerRef} className="w-full flex justify-center px-4 py-6 lg:p-8">
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    height: wrapperHeight ? `${wrapperHeight}px` : undefined,
                }}
            >
                <div ref={innerRef}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export function MainLayout({ form, preview }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col transition-colors duration-300">
            {/* Header — Apple navbar style */}
            <header className="bg-[rgba(251,251,253,0.8)] dark:bg-[rgba(29,29,31,0.8)] backdrop-blur-xl backdrop-saturate-[180%] border-b border-[#d2d2d7]/60 dark:border-[#424245]/60 h-11 flex items-center justify-between px-6 shrink-0 z-50 transition-colors duration-300 sticky top-0">
                <div className="text-sm font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                    FF14 트친소 시트
                </div>
                <ThemeToggle />
            </header>

            {/* Main Content */}
            <main className="flex flex-col lg:flex-row flex-1 min-h-0">

                {/* Left Panel: Form */}
                <div className="w-full lg:w-[420px] xl:w-[460px] bg-white dark:bg-[#1d1d1f] flex flex-col lg:h-[calc(100vh-44px)] border-r border-[#d2d2d7]/40 dark:border-[#424245]/40 z-20 transition-colors duration-300 lg:sticky lg:top-11">
                    <div className="p-6 border-b border-[#d2d2d7]/30 dark:border-[#424245]/30 shrink-0">
                        <h1 className="font-semibold text-xl tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">프로필 작성</h1>
                        <p className="text-[13px] text-[#86868b] mt-1">정보를 입력하면 우측에서 미리보기를 확인할 수 있어요.</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        {form}
                    </div>
                </div>

                {/* Right Panel: Preview — responsive scaling */}
                <div className="flex-1 bg-[#f5f5f7] dark:bg-black flex items-start justify-center overflow-x-hidden transition-colors duration-300">
                    <div className="lg:sticky lg:top-16 w-full">
                        <PreviewScaler>
                            {preview}
                        </PreviewScaler>
                    </div>
                </div>
            </main>
        </div>
    );
}
