import { useState, useCallback, useRef } from 'react';

export interface ToastState {
    visible: boolean;
    message: string;
    type: 'error' | 'success' | 'info';
}

const INITIAL: ToastState = { visible: false, message: '', type: 'info' };

/**
 * useToast — lightweight toast notification state hook.
 *
 * Returns the current toast state and a `show` function that
 * auto-dismisses after `duration` ms (default 6000).
 *
 * Usage:
 *   const { toast, showToast, dismissToast } = useToast();
 *   showToast('Something went wrong', 'error');
 */
export function useToast(duration = 6000) {
    const [toast, setToast] = useState<ToastState>(INITIAL);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const dismissToast = useCallback(() => {
        setToast(prev => ({ ...prev, visible: false }));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastState['type'] = 'info') => {
            // Clear any existing auto-dismiss timer
            if (timerRef.current) clearTimeout(timerRef.current);

            setToast({ visible: true, message, type });

            timerRef.current = setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, duration);
        },
        [duration],
    );

    return { toast, showToast, dismissToast };
}
