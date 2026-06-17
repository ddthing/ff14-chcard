import { Globe } from 'lucide-react';
import type { Language } from '../types';

interface LanguageSelectorProps {
    currentLang: Language;
    onLanguageChange: (lang: Language) => void;
}

export function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
    const langs: { id: Language; label: string }[] = [
        { id: 'ko', label: 'KR' },
        { id: 'en', label: 'EN' },
        { id: 'ja', label: 'JA' },
    ];

    return (
        <div className="flex items-center gap-2">
            <Globe size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <div
                className="flex rounded-full p-[3px]"
                style={{
                    backgroundColor: 'var(--surface-300)',
                    border: '1px solid var(--border-subtle)',
                }}
            >
                {langs.map(lang => (
                    <button
                        key={lang.id}
                        type="button"
                        onClick={() => onLanguageChange(lang.id)}
                        className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full transition-all duration-200"
                        style={
                            currentLang === lang.id
                                ? {
                                    backgroundColor: 'var(--surface-50)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-medium)',
                                }
                                : { color: 'var(--text-muted)', border: '1px solid transparent' }
                        }
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
