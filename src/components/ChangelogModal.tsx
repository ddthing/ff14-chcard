import { useEffect, useState } from 'react';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { APP_VERSION, CHANGELOG } from '../constants/changelog';
import { i18n } from '../utils/i18n';
import type { Language } from '../types';

interface ChangelogModalProps {
    lang: Language;
}

export function ChangelogModal({ lang }: ChangelogModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = i18n[lang].changelog;

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem('lastSeenVersion');
        if (lastSeenVersion !== APP_VERSION) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('lastSeenVersion', APP_VERSION);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1d1d1f] w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden border border-[#d2d2d7]/30 dark:border-[#424245]/30 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-6 pb-2 flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[#0071e3] font-bold text-xs uppercase tracking-wider">
                            <Sparkles size={14} />
                            {APP_VERSION} Update
                        </div>
                        <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                            {t.title}
                        </h2>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="p-1.5 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2f] text-[#86868b] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
                    <div className="space-y-8">
                        {CHANGELOG.map((entry, idx) => (
                            <div key={entry.version} className={idx !== 0 ? 'opacity-60 pt-4 border-t border-[#d2d2d7]/50 dark:border-[#424245]/50' : ''}>
                                <div className="flex items-baseline justify-between mb-3">
                                    <span className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                                        {entry.version}
                                    </span>
                                    <span className="text-[11px] font-medium text-[#86868b]">
                                        {entry.date}
                                    </span>
                                </div>
                                <ul className="space-y-3">
                                    {entry.items[lang].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
                                            <ChevronRight size={14} className="shrink-0 mt-0.5 text-[#0071e3]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-2">
                    <button
                        onClick={handleClose}
                        className="w-full py-3.5 bg-[#0071e3] text-white rounded-xl font-semibold text-sm hover:bg-[#0077ED] transition-colors shadow-sm"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
}
