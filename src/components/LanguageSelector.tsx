import { Globe } from 'lucide-react';
import type { Language } from '../types';

interface LanguageSelectorProps {
    currentLang: Language;
    onLanguageChange: (lang: Language) => void;
}

export function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
    const langs: { id: Language, label: string }[] = [
        { id: 'ko', label: 'KR' },
        { id: 'en', label: 'EN' },
        { id: 'ja', label: 'JA' }
    ];

    return (
        <div className="flex items-center gap-3">
            <Globe size={18} className="text-[#86868b] dark:text-[#a1a1a6] shrink-0" />
            <div className="flex bg-[#f5f5f7] dark:bg-[#2d2d2f] rounded-full p-1 border border-[#d2d2d7]/50 dark:border-[#424245]/50 shadow-sm scale-95 origin-right">
                {langs.map((lang) => (
                    <button
                        key={lang.id}
                        type="button"
                        onClick={() => onLanguageChange(lang.id)}
                        className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all duration-300 ${
                            currentLang === lang.id 
                                ? 'bg-white dark:bg-[#48484a] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm' 
                                : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                        }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
