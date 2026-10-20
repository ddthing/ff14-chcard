import { ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { i18n } from '../utils/i18n';
import type { Language } from '../types';
import { Link } from 'react-router-dom';
interface GlobalHeaderProps { lang: Language; onLanguageChange: (lang: Language) => void }
export function GlobalHeader({ lang, onLanguageChange }: GlobalHeaderProps) {
    return <header className="studio-header"><div className="studio-header-inner">
        <Link to="/" aria-label={i18n[lang].layout.headerTitle} className="studio-brand">
            <span className="studio-brand-title">{i18n[lang].layout.headerTitle}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
            <Link to="/guide" className="studio-guide">{i18n[lang].studio.guide}<ArrowUpRight size={13} aria-hidden="true" /></Link>
            <LanguageSelector currentLang={lang} onLanguageChange={onLanguageChange} /><ThemeToggle lang={lang} />
        </div>
    </div></header>;
}
