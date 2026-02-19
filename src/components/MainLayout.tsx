import { type ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface MainLayoutProps {
    form: ReactNode;
    preview: ReactNode;
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

                {/* Right Panel: Preview — responsive scaling via CSS zoom */}
                <div className="flex-1 bg-[#f5f5f7] dark:bg-black flex items-start justify-center overflow-hidden transition-colors duration-300 p-4 lg:p-8">
                    <div className="lg:sticky lg:top-16 preview-mobile-scale">
                        {preview}
                    </div>
                </div>
            </main>
        </div>
    );
}
