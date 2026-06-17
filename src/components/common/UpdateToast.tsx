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

    // Inline banner — to be placed inside the sidebar button bar above the save button
    return (
        <div
            className="flex items-center justify-between gap-3 px-3 py-2.5 mb-3 rounded-[10px]"
            style={{
                backgroundColor: 'var(--surface-300)',
                border: '1px solid var(--border-medium)',
            }}
        >
            <div className="flex items-center gap-2 min-w-0">
                <Sparkles size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                <span className="text-[11px] font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'ko'
                        ? '새 버전이 준비되었습니다'
                        : lang === 'ja'
                        ? '新しいバージョンが利用可能です'
                        : 'New version available'}
                </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={handleUpdate}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-opacity active:scale-[0.96] flex items-center gap-1"
                    style={{ backgroundColor: 'var(--text-primary)', color: 'var(--surface-200)' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                    <RefreshCw size={11} className={isChecking ? 'animate-spin' : ''} />
                    {lang === 'ko' ? '업데이트' : lang === 'ja' ? '更新' : 'Update'}
                </button>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 rounded-md transition-opacity"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                    <X size={13} />
                </button>
            </div>
        </div>
    );
}
