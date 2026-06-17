import { type ReactNode } from 'react';
import { GlobalHeader } from './GlobalHeader';
import { Footer } from './Footer';
import { usePlayer } from '../contexts/PlayerContext';


interface PageLayoutProps {
    children: ReactNode;
    title: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
    const { playerInfo, updateLanguage } = usePlayer();
    const lang = playerInfo.language;

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-200" style={{ backgroundColor: 'var(--surface-200)', color: 'var(--text-primary)' }}>
            <GlobalHeader lang={lang} onLanguageChange={updateLanguage} showLogo={true} />

            {/* ── Content ────────────────────────────────────────────────── */}
            <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-20 animate-tab-in">
                {/* Page title — no decorative bar, border-bottom instead */}
                <div className="mb-12 pb-6" style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <h1
                        className="text-[28px] font-semibold tracking-tight"
                        style={{ color: 'var(--text-primary)', letterSpacing: '-0.325px' }}
                    >
                        {title}
                    </h1>
                </div>

                <div className="text-[14px] leading-[1.75] space-y-6" style={{ color: 'var(--text-secondary)' }}>
                    {children}
                </div>
            </main>

            {/* ── Footer ────────────────────────────────────────────────── */}
            <Footer />
        </div>
    );
}
