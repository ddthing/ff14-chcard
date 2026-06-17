import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { APP_VERSION, CHANGELOG } from '../constants/changelog';
import { i18n } from '../utils/i18n';
import type { Language } from '../types';

interface ChangelogModalProps {
    lang: Language;
    /**
     * External open trigger — set to true to force-open the modal from a
     * parent component (e.g. the floating Changelog badge).
     */
    forceOpen?: boolean;
    onForceClose?: () => void;
}

export function ChangelogModal({ lang, forceOpen, onForceClose }: ChangelogModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = i18n[lang].changelog;

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem('lastSeenVersion');
        if (lastSeenVersion !== APP_VERSION) setIsOpen(true);
    }, []);

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className="w-full max-w-[400px] rounded-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4 zoom-in-[0.98] duration-300"
                style={{
                    backgroundColor: 'var(--surface-50)',
                    border: '1px solid var(--border-medium)',
                }}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex justify-between items-start" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="flex flex-col gap-1">
                        <div
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em]"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <Sparkles size={12} strokeWidth={2.5} />
                            Version {APP_VERSION}
                        </div>
                        <h2
                            className="text-xl font-extrabold tracking-tight"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {t.title}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-colors group"
                        style={{ backgroundColor: 'var(--surface-200)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--surface-300)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--surface-200)')}
                    >
                        <X size={16} className="text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {CHANGELOG.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span
                                    className="text-xs font-bold px-2.5 py-1 rounded-md"
                                    style={{ backgroundColor: 'var(--surface-200)', color: 'var(--text-primary)' }}
                                >
                                    {CHANGELOG[0].version}
                                </span>
                                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                                    {CHANGELOG[0].date}
                                </span>
                            </div>
                            <ul className="space-y-3">
                                {CHANGELOG[0].items[lang].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3 text-[13px] leading-relaxed font-medium"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--text-muted)', opacity: 0.5 }} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                        onClick={handleClose}
                        className="w-full py-3 rounded-xl text-sm font-bold active:scale-[0.98] transition-all"
                        style={{
                            backgroundColor: 'var(--text-primary)',
                            color: 'var(--surface-200)',
                            letterSpacing: '-0.01em',
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.9')}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
}
