import { useEffect, useState } from 'react';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { APP_VERSION, CHANGELOG } from '../constants/changelog';
import { i18n } from '../utils/i18n';
import type { Language } from '../types';

interface ChangelogModalProps {
    lang: Language;
    /**
     * External open trigger — set to true to force-open the modal from a
     * parent component (e.g. the floating Changelog badge). The internal
     * localStorage check continues to fire independently on mount.
     */
    forceOpen?: boolean;
    /** Called when the user dismisses the modal via the badge's trigger. */
    onForceClose?: () => void;
}

export function ChangelogModal({ lang, forceOpen, onForceClose }: ChangelogModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = i18n[lang].changelog;

    // Auto-open on first visit after a new release.
    useEffect(() => {
        const lastSeenVersion = localStorage.getItem('lastSeenVersion');
        if (lastSeenVersion !== APP_VERSION) {
            setIsOpen(true);
        }
    }, []);

    // Respond to external open triggers (e.g. badge click).
    useEffect(() => {
        if (forceOpen) setIsOpen(true);
    }, [forceOpen]);

    const handleClose = () => {
        localStorage.setItem('lastSeenVersion', APP_VERSION);
        setIsOpen(false);
        onForceClose?.();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1d1d1f] w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden border border-[#d2d2d7]/30 dark:border-[#424245]/30 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-6 pb-2 flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[#86868b] font-semibold text-xs uppercase tracking-wider">
                            <Sparkles size={13} />
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
                        {CHANGELOG.length > 0 && (
                            <div key={CHANGELOG[0].version}>
                                <div className="flex items-baseline justify-between mb-3">
                                    <span className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                                        {CHANGELOG[0].version}
                                    </span>
                                    <span className="text-[11px] font-medium text-[#86868b]">
                                        {CHANGELOG[0].date}
                                    </span>
                                </div>
                                <ul className="space-y-3">
                                    {CHANGELOG[0].items[lang].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
                                            <ChevronRight size={14} className="shrink-0 mt-0.5 text-[#86868b]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-2">
                    <button
                        onClick={handleClose}
                        className="w-full py-3.5 bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] rounded-xl font-semibold text-sm hover:bg-[#3a3a3c] dark:hover:bg-[#e8e8ed] active:scale-[0.98] transition-all"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
}
