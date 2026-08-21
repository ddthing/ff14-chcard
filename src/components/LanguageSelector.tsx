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
        <div className="flex items-center gap-1.5" role="group" aria-label={currentLang === 'ko' ? '언어 선택' : currentLang === 'ja' ? '言語選択' : 'Language selection'}>
            <Globe size={14} aria-hidden="true" style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
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
                        aria-label={currentLang === 'ko' ? `${lang.label} 언어` : currentLang === 'ja' ? `${lang.label} 言語` : `${lang.label} language`}
                        aria-pressed={currentLang === lang.id}
                        className="rounded-full px-2 py-1 text-[10px] font-semibold transition-[color,background-color,border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
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
