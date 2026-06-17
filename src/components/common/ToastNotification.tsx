import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { ToastState } from '../../hooks/useToast';

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
        bg: 'rgba(207, 45, 86, 0.08)',
        border: 'rgba(207, 45, 86, 0.25)',
        icon: '#cf2d56',
        text: 'var(--text-primary)',
    },
    success: {
        bg: 'rgba(31, 138, 101, 0.08)',
        border: 'rgba(31, 138, 101, 0.25)',
        icon: '#1f8a65',
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
    if (!toast.visible) return null;

    const colors = COLOR_MAP[toast.type];
    const Icon = ICON_MAP[toast.type];

    return (
        <div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-32px)] max-w-[480px] animate-in slide-in-from-top-2 fade-in duration-300"
        >
            <div
                className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
                style={{
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                }}
            >
                <Icon
                    size={18}
                    className="shrink-0 mt-0.5"
                    style={{ color: colors.icon }}
                />
                <p
                    className="flex-1 text-[13px] font-medium leading-relaxed whitespace-pre-wrap"
                    style={{ color: colors.text }}
                >
                    {toast.message}
                </p>
                <button
                    onClick={onDismiss}
                    className="shrink-0 p-1 rounded-md transition-opacity hover:opacity-60"
                    style={{ color: 'var(--text-muted)' }}
                    aria-label="닫기"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
