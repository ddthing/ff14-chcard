import { ArrowUpRight, CircleHelp } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { i18n } from '../utils/i18n';
import type { Language } from '../types';
import { Link } from 'react-router-dom';
interface GlobalHeaderProps { lang: Language; onLanguageChange: (lang: Language) => void; onStartTour?: () => void }
export function GlobalHeader({ lang, onLanguageChange, onStartTour }: GlobalHeaderProps) {
    return <header className="studio-header"><div className="studio-header-inner">
        <Link to="/" className="studio-brand">
            <span className="studio-brand-title" lang={lang}>{i18n[lang].layout.headerTitle}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
            {onStartTour ? <button type="button" className="studio-header-control studio-tour-trigger studio-tour-trigger--header" onClick={onStartTour}><CircleHelp size={16} aria-hidden="true" />{i18n[lang].tour.start}</button>
                : <Link to="/guide" className="studio-header-control studio-guide">{i18n[lang].studio.guide}<ArrowUpRight size={16} aria-hidden="true" /></Link>}
            <LanguageSelector currentLang={lang} onLanguageChange={onLanguageChange} /><ThemeToggle lang={lang} />
        </div>
    </div></header>;
}
