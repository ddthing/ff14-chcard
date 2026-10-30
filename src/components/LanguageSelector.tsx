import { Globe } from 'lucide-react';
import type { Language } from '../types';
import { LANGUAGES, normalizeLanguage } from '../utils/languages';

interface LanguageSelectorProps {
    currentLang: Language;
    onLanguageChange: (lang: Language) => void;
}

export function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
    return (
        <label className="studio-language">
            <Globe size={16} aria-hidden="true" />
            <select
                className="studio-header-control"
                aria-label={LANGUAGES.find(language => language.id === currentLang)!.selection}
                value={currentLang}
                onChange={event => onLanguageChange(normalizeLanguage(event.target.value))}
            >
                {LANGUAGES.map(language => (
                    <option key={language.id} value={language.id} lang={language.id}>{language.name}</option>
                ))}
            </select>
        </label>
    );
}
