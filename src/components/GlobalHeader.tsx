import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { i18n } from '../utils/i18n';
import type { Language } from '../types';
import { Link } from 'react-router-dom';

interface GlobalHeaderProps {
    lang: Language;
    onLanguageChange: (lang: Language) => void;
    pageTitle?: string;
}

export function GlobalHeader({ lang, onLanguageChange, pageTitle }: GlobalHeaderProps) {
    const title = pageTitle || i18n[lang].layout.headerTitle;

    return (
        <header
            className="glass min-h-12 flex items-center shrink-0 z-50 sticky top-0"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
            <div className="mx-auto flex w-full max-w-[1300px] items-center justify-between gap-4 px-4 py-2.5 md:px-6">
                <Link
                    to="/"
                    translate="no"
                    aria-label={i18n[lang].layout.headerTitle}
                    className="min-w-0 truncate text-[13px] font-semibold tracking-[-0.01em] transition-[color,opacity] duration-150 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-100)]"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {title}
                </Link>

                <div className="flex shrink-0 items-center gap-2 md:gap-3">
                <LanguageSelector currentLang={lang} onLanguageChange={onLanguageChange} />
                <ThemeToggle lang={lang} />
                </div>
            </div>
        </header>
    );
}
