// Lucian UX/UI Prompt #070 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#070
import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { usePlayerSelector } from './PlayerContext';
import { i18n } from '../utils/i18n';
import { ToastStack } from '../components/common/ToastNotification';

export type ToastType = 'error' | 'success' | 'info' | 'loading';
export type ToastSwipeDirection = -1 | 1;

export interface ToastRecord {
    id: string;
    message: string;
    type: ToastType;
    /** Persistent states such as loading and error use null. */
    durationMs: number | null;
    /** Restart the progress animation when an operation resolves. */
    progressKey: number;
    isLeaving: boolean;
    exitDirection?: ToastSwipeDirection;
}

export interface ToastContextValue {
    toasts: ToastRecord[];
    showToast: (message: string, type: ToastType, durationOverride?: number) => string;
    updateToast: (id: string, message: string, type: ToastType) => void;
    dismissToast: (id?: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<ToastContextValue | null>(null);

interface ActiveTimer {
    id: string;
    startedAt: number;
    remainingMs: number;
    timeoutId: number;
}

const DEFAULT_INFO_DURATION_MS = 6000;
const SUCCESS_DURATION_MS = 4500;
const EXIT_DURATION_MS = 500;
const PREFERRED_MAX_TOASTS = 6;

function durationFor(type: ToastType, durationOverride?: number): number | null {
    if (type === 'error' || type === 'loading') return null;

    const duration = type === 'success'
        ? (durationOverride ?? SUCCESS_DURATION_MS)
        : (durationOverride ?? DEFAULT_INFO_DURATION_MS);

    return Number.isFinite(duration) ? Math.max(0, duration) : null;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const language = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const [toasts, setToasts] = useState<ToastRecord[]>([]);
    const [interactionPaused, setInteractionPaused] = useState(false);
    const [documentHidden, setDocumentHidden] = useState(false);
    const toastsRef = useRef<ToastRecord[]>([]);
    const nextIdRef = useRef(0);
    const activeTimerRef = useRef<ActiveTimer | null>(null);
    const remainingMsRef = useRef(new Map<string, number>());
    const exitTimersRef = useRef(new Map<string, number>());
    const isPaused = interactionPaused || documentHidden;

    const replaceToasts = useCallback((next: ToastRecord[]) => {
        toastsRef.current = next;
        setToasts(next);
    }, []);

    const stopActiveTimer = useCallback((forId?: string) => {
        const active = activeTimerRef.current;
        if (!active || (forId && active.id !== forId)) return;

        window.clearTimeout(active.timeoutId);
        const remaining = Math.max(0, active.remainingMs - (Date.now() - active.startedAt));
        remainingMsRef.current.set(active.id, remaining);
        activeTimerRef.current = null;
    }, []);

    const dismissWithDirection = useCallback((id: string, direction?: ToastSwipeDirection) => {
        const target = toastsRef.current.find(toast => toast.id === id);
        if (!target || target.isLeaving) return;

        stopActiveTimer(id);
        remainingMsRef.current.delete(id);
        const exitTimer = exitTimersRef.current.get(id);
        if (exitTimer !== undefined) {
            window.clearTimeout(exitTimer);
            exitTimersRef.current.delete(id);
        }

        replaceToasts(toastsRef.current.map(toast => toast.id === id
            ? { ...toast, isLeaving: true, exitDirection: direction }
            : toast));
    }, [replaceToasts, stopActiveTimer]);

    const dismissToast = useCallback((id?: string) => {
        const targetId = id ?? toastsRef.current.find(toast => !toast.isLeaving)?.id;
        if (targetId) dismissWithDirection(targetId);
    }, [dismissWithDirection]);

    const showToast = useCallback((message: string, type: ToastType = 'info', durationOverride?: number) => {
        const id = `toast-${Date.now()}-${++nextIdRef.current}`;
        const durationMs = durationFor(type, durationOverride);
        const entry: ToastRecord = {
            id,
            message,
            type,
            durationMs,
            progressKey: 1,
            isLeaving: false,
        };

        remainingMsRef.current.set(id, durationMs ?? 0);

        const current = toastsRef.current;
        const activeCurrent = current.filter(toast => !toast.isLeaving);
        const next = [entry, ...current];

        // Keep the stack compact during ordinary bursts while preserving errors
        // and operations that still need to resolve or be dismissed explicitly.
        if (activeCurrent.length >= PREFERRED_MAX_TOASTS) {
            let evictIndex = -1;
            for (let index = next.length - 1; index > 0; index -= 1) {
                const candidate = next[index];
                if (!candidate?.isLeaving && (candidate.type === 'success' || candidate.type === 'info')) {
                    evictIndex = index;
                    break;
                }
            }

            if (evictIndex >= 0) {
                const [evicted] = next.splice(evictIndex, 1);
                if (evicted) {
                    remainingMsRef.current.delete(evicted.id);
                    const timer = exitTimersRef.current.get(evicted.id);
                    if (timer !== undefined) {
                        window.clearTimeout(timer);
                        exitTimersRef.current.delete(evicted.id);
                    }
                }
            }
        }

        replaceToasts(next);
        return id;
    }, [replaceToasts]);

    const updateToast = useCallback((id: string, message: string, type: ToastType) => {
        const target = toastsRef.current.find(toast => toast.id === id);
        stopActiveTimer(id);
        const durationMs = durationFor(type);
        if (durationMs === null) remainingMsRef.current.delete(id);
        else remainingMsRef.current.set(id, durationMs);

        const updated: ToastRecord = target
            ? { ...target, message, type, durationMs, progressKey: target.progressKey + 1, isLeaving: false, exitDirection: undefined }
            : { id, message, type, durationMs, progressKey: 1, isLeaving: false };

        const exitTimer = exitTimersRef.current.get(id);
        if (exitTimer !== undefined) {
            window.clearTimeout(exitTimer);
            exitTimersRef.current.delete(id);
        }

        // A user may dismiss a pending operation while it is still running.
        // Restore its terminal state with the same id so a real failure remains visible.
        const others = toastsRef.current.filter(toast => toast.id !== id);
        replaceToasts([updated, ...others]);
    }, [replaceToasts, stopActiveTimer]);

    const frontToast = toasts[0] ?? null;

    useEffect(() => {
        const updateVisibility = () => setDocumentHidden(document.visibilityState === 'hidden');
        updateVisibility();
        document.addEventListener('visibilitychange', updateVisibility);
        return () => document.removeEventListener('visibilitychange', updateVisibility);
    }, []);

    useEffect(() => {
        if (activeTimerRef.current) stopActiveTimer();
        if (isPaused || !frontToast || frontToast.isLeaving || frontToast.durationMs === null) return;

        const remainingMs = remainingMsRef.current.get(frontToast.id) ?? frontToast.durationMs;
        if (remainingMs <= 0) {
            dismissToast(frontToast.id);
            return;
        }

        const timer: ActiveTimer = {
            id: frontToast.id,
            startedAt: Date.now(),
            remainingMs,
            timeoutId: 0,
        };
        timer.timeoutId = window.setTimeout(() => {
            if (activeTimerRef.current !== timer) return;
            activeTimerRef.current = null;
            remainingMsRef.current.delete(timer.id);
            dismissToast(timer.id);
        }, remainingMs);
        activeTimerRef.current = timer;

        return () => {
            if (activeTimerRef.current === timer) stopActiveTimer(timer.id);
        };
    }, [dismissToast, frontToast, isPaused, stopActiveTimer]);

    useEffect(() => {
        const leavingIds = new Set(toasts.filter(toast => toast.isLeaving).map(toast => toast.id));

        for (const [id, timerId] of exitTimersRef.current) {
            if (!leavingIds.has(id)) {
                window.clearTimeout(timerId);
                exitTimersRef.current.delete(id);
            }
        }

        for (const toast of toasts) {
            if (!toast.isLeaving || exitTimersRef.current.has(toast.id)) continue;
            const timerId = window.setTimeout(() => {
                exitTimersRef.current.delete(toast.id);
                remainingMsRef.current.delete(toast.id);
                replaceToasts(toastsRef.current.filter(item => item.id !== toast.id));
            }, EXIT_DURATION_MS);
            exitTimersRef.current.set(toast.id, timerId);
        }
    }, [replaceToasts, toasts]);

    useEffect(() => () => {
        const active = activeTimerRef.current;
        if (active) window.clearTimeout(active.timeoutId);
        activeTimerRef.current = null;
        for (const timerId of exitTimersRef.current.values()) window.clearTimeout(timerId);
        exitTimersRef.current.clear();
    }, []);

    const contextValue = useMemo<ToastContextValue>(() => ({
        toasts,
        showToast,
        updateToast,
        dismissToast,
    }), [dismissToast, showToast, toasts, updateToast]);

    const portalTarget = typeof document === 'undefined' ? null : document.getElementById('root');
    const labels = i18n[language];

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            {portalTarget && createPortal(
                <ToastStack
                    toasts={toasts}
                    regionLabel={labels.notifications.region}
                    expandLabel={labels.notifications.expand}
                    collapseLabel={labels.notifications.collapse}
                    closeLabel={labels.layout.close}
                    paused={documentHidden}
                    onPauseChange={setInteractionPaused}
                    onDismiss={dismissWithDirection}
                />,
                portalTarget,
            )}
        </ToastContext.Provider>
    );
}
