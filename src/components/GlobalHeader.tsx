import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { i18n } from '../utils/i18n';
import type { Language } from '../types';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface GlobalHeaderProps {
    lang: Language;
    onLanguageChange: (lang: Language) => void;
    showLogo?: boolean;
    changelogBadge?: ReactNode;
}

export function GlobalHeader({ lang, onLanguageChange, showLogo = true, changelogBadge }: GlobalHeaderProps) {
    const t = i18n[lang].layout;

    const navLabels = {
        ko: { about: '소개', guide: '가이드', faq: 'FAQ', contact: '문의' },
        en: { about: 'About', guide: 'Guide', faq: 'FAQ', contact: 'Contact' },
        ja: { about: '概要', guide: 'ガイド', faq: 'FAQ', contact: 'お問い合わせ' }
    }[lang];

    return (
        <header
            className="glass h-11 flex items-center justify-between px-5 shrink-0 z-50 sticky top-0"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
            <div className="flex items-center gap-4">
                {showLogo ? (
                    <Link to="/" className="text-[13px] font-bold tracking-[-0.01em] hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                        {t.headerTitle}
                    </Link>
                ) : (
                    <div className="text-[13px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--text-primary)' }}>
                        {t.headerTitle}
                    </div>
                )}

                <nav className="hidden md:flex items-center gap-5 ml-4 text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    <Link to="/about" className="hover:opacity-70 transition-opacity">{navLabels.about}</Link>
                    <Link to="/guide" className="hover:opacity-70 transition-opacity">{navLabels.guide}</Link>
                    <Link to="/faq" className="hover:opacity-70 transition-opacity">{navLabels.faq}</Link>
                    <Link to="/contact" className="hover:opacity-70 transition-opacity">{navLabels.contact}</Link>
                </nav>
            </div>
            
            <div className="flex items-center gap-5">
                {changelogBadge}
                <LanguageSelector currentLang={lang} onLanguageChange={onLanguageChange} />
                <ThemeToggle />
            </div>
        </header>
    );
}
