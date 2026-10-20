import { useCallback, useContext } from 'react';
import { ToastContext, type ToastType } from '../contexts/ToastContext';

/** Access the shared notification stack. */
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    const { toasts, showToast: showToastInContext, updateToast, dismissToast } = context;
    const showToast = useCallback((message: string, type: ToastType = 'info') => (
        showToastInContext(message, type)
    ), [showToastInContext]);

    return { toasts, showToast, updateToast, dismissToast };
}
