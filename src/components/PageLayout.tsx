import { type ReactNode } from 'react';
import { GlobalHeader } from './GlobalHeader';
import { Footer } from './Footer';
import { usePlayerActions, usePlayerSelector } from '../contexts/PlayerContext';
import { i18n } from '../utils/i18n';


interface PageLayoutProps {
    children: ReactNode;
    title: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
    const lang = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const { updateLanguage } = usePlayerActions();

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-200" style={{ backgroundColor: 'var(--surface-200)', color: 'var(--text-primary)' }}>
            <a href="#main-content" className="skip-link">{i18n[lang].layout.skipToContent}</a>
            <GlobalHeader lang={lang} onLanguageChange={updateLanguage} pageTitle={title} />

            {/* ── Content ────────────────────────────────────────────────── */}
            <main id="main-content" className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-20 animate-tab-in">
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
