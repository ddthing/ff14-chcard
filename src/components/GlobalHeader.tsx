import { ArrowUpRight, CircleHelp } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { i18n } from '../utils/i18n';
import type { Language } from '../types';
import { Link } from 'react-router-dom';
import { editorCopy } from '../utils/editorCopy';
interface GlobalHeaderProps { lang: Language; onLanguageChange: (lang: Language) => void; onStartTour?: () => void }
export function GlobalHeader({ lang, onLanguageChange, onStartTour }: GlobalHeaderProps) {
    return <header className="studio-header"><div className="studio-header-inner">
        <Link to="/" className="studio-brand">
            <span className="studio-brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M16 2 21 11 30 16 21 21 16 30 11 21 2 16 11 11Z" stroke="currentColor"/><path d="m16 8 3 8-3 8-3-8Z" fill="currentColor"/></svg></span>
            <span className="studio-brand-lockup"><span className="studio-brand-title" lang="en" translate="no">CH<span className="studio-brand-dot">.</span>CARD</span><span className="studio-brand-caption">{editorCopy[lang].mark}</span></span>
        </Link>
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
            {onStartTour ? <button type="button" className="studio-tour-trigger studio-tour-trigger--header" onClick={onStartTour}><CircleHelp size={14} aria-hidden="true" />{i18n[lang].tour.start}</button>
                : <Link to="/guide" className="studio-guide">{i18n[lang].studio.guide}<ArrowUpRight size={13} aria-hidden="true" /></Link>}
            <LanguageSelector currentLang={lang} onLanguageChange={onLanguageChange} /><ThemeToggle lang={lang} />
        </div>
    </div></header>;
}
