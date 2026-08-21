import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { ToastState } from '../../hooks/useToast';
import { usePlayerSelector } from '../../contexts/PlayerContext';
import { i18n } from '../../utils/i18n';

interface ToastNotificationProps {
    toast: ToastState;
    onDismiss: () => void;
}

const ICON_MAP = {
    error: AlertTriangle,
    success: CheckCircle,
    info: Info,
} as const;

const COLOR_MAP = {
    error: {
        bg: 'color-mix(in oklab, var(--destructive) 8%, transparent)',
        border: 'color-mix(in oklab, var(--destructive) 25%, transparent)',
        icon: 'var(--destructive)',
        text: 'var(--text-primary)',
    },
    success: {
        bg: 'color-mix(in oklab, var(--success) 8%, transparent)',
        border: 'color-mix(in oklab, var(--success) 25%, transparent)',
        icon: 'var(--success)',
        text: 'var(--text-primary)',
    },
    info: {
        bg: 'var(--surface-300)',
        border: 'var(--border-medium)',
        icon: 'var(--text-secondary)',
        text: 'var(--text-primary)',
    },
} as const;

/**
 * ToastNotification — styled, auto-dismissing notification banner.
 *
 * Replaces native `alert()` calls throughout the app.
 * Renders as a fixed-position banner at the top of the viewport.
 */
export function ToastNotification({ toast, onDismiss }: ToastNotificationProps) {
    const language = usePlayerSelector(snapshot => snapshot.playerInfo.language);

    if (!toast.visible) return null;

    const colors = COLOR_MAP[toast.type];
    const Icon = ICON_MAP[toast.type];
    const closeLabel = i18n[language].layout.close;

    return (
        <div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-32px)] max-w-[480px] animate-in slide-in-from-top-2 fade-in duration-300"
            role={toast.type === 'error' ? 'alert' : 'status'}
            aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
            aria-atomic="true"
        >
            <div
                className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
                style={{
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: 'var(--shadow-elevated)',
                }}
            >
                <Icon
                    size={18}
                    className="shrink-0 mt-0.5"
                    style={{ color: colors.icon }}
                    aria-hidden="true"
                />
                <p
                    className="flex-1 text-[13px] font-medium leading-relaxed whitespace-pre-wrap"
                    style={{ color: colors.text }}
                >
                    {toast.message}
                </p>
                <button
                    type="button"
                    onClick={onDismiss}
                    className="shrink-0 p-1 rounded-md transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                    style={{ color: 'var(--text-muted)' }}
                    aria-label={closeLabel}
                >
                    <X size={14} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
