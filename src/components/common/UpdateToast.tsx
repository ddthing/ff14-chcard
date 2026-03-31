import { useEffect, useState } from 'react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { APP_VERSION } from '../../constants/changelog';
import type { Language } from '../../types';

interface UpdateToastProps {
    lang: Language;
}

export function UpdateToast({ lang }: UpdateToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const checkVersion = async () => {
        if (isChecking) return;
        setIsChecking(true);
        try {
            // Fetch version.json from the server with a cache-busting timestamp
            const response = await fetch(`/version.json?t=${Date.now()}`, {
                cache: 'no-store'
            });
            if (response.ok) {
                const data = await response.json();
                if (data.version && data.version !== APP_VERSION) {
                    setIsVisible(true);
                }
            }
        } catch (error) {
            console.error('Failed to check for updates:', error);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        // Initial check on mount
        checkVersion();

        // Periodic check every 60 minutes
        const interval = setInterval(checkVersion, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdate = () => {
        window.location.reload();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-32px)] max-w-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-xl border border-[#d2d2d7] dark:border-[#424245] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3] flex items-center justify-center text-white shrink-0">
                        <Sparkles size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                            {lang === 'ko' ? '새 버전이 준비되었습니다' : 'New version available'}
                        </span>
                        <span className="text-[11px] text-[#86868b] font-medium">
                            {lang === 'ko' ? '최신 기능을 적용하려면 업데이트하세요.' : 'Update to get the latest features.'}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleUpdate}
                        className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.95] flex items-center gap-1.5 shadow-lg shadow-[#0071e3]/20"
                    >
                        <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''} />
                        {lang === 'ko' ? '업데이트' : 'Update'}
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2d2d2f] text-[#86868b] transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
