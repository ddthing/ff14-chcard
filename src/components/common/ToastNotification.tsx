// Lucian UX/UI Prompt #070 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#070
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type FocusEvent as ReactFocusEvent } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Info, LoaderCircle, X } from 'lucide-react';
import type { ToastRecord, ToastSwipeDirection, ToastType } from '../../contexts/ToastContext';
import './toast-stack.css';

interface ToastCardProps {
    toast: ToastRecord;
    collapsedIndex: number;
    isBack: boolean;
    isFront: boolean;
    isExpanded: boolean;
    closeLabel: string;
    expandLabel: string;
    collapseLabel: string;
    onDismiss: (id: string, direction?: ToastSwipeDirection) => void;
    onToggleExpanded?: () => void;
}

interface PointerGesture {
    pointerId: number;
    startX: number;
    startY: number;
    deltaX: number;
    deltaY: number;
    horizontal: boolean;
}

const TOAST_COLOR: Record<ToastType, string> = {
    error: 'var(--ux-danger)',
    success: 'var(--ux-mint)',
    info: 'var(--ux-accent)',
    loading: 'var(--ux-warn)',
};

function ToastIcon({ type }: { type: ToastType }) {
    if (type === 'error') return <AlertTriangle size={18} strokeWidth={2.2} aria-hidden="true" />;
    if (type === 'success') return <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden="true" />;
    if (type === 'loading') return <LoaderCircle className="u070-spin" size={18} strokeWidth={2.2} aria-hidden="true" />;
    return <Info size={18} strokeWidth={2.2} aria-hidden="true" />;
}

export function ToastCard({
    toast,
    collapsedIndex,
    isBack,
    isFront,
    isExpanded,
    closeLabel,
    expandLabel,
    collapseLabel,
    onDismiss,
    onToggleExpanded,
}: ToastCardProps) {
    const pointerRef = useRef<PointerGesture | null>(null);
    const [drag, setDrag] = useState({ active: false, deltaX: 0 });
    const [entering, setEntering] = useState(true);

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => setEntering(false));
        return () => window.cancelAnimationFrame(frame);
    }, []);

    const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
        if (!isFront || toast.isLeaving || event.button !== 0) return;
        if (event.target instanceof Element && event.target.closest('button')) return;

        pointerRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            deltaX: 0,
            deltaY: 0,
            horizontal: false,
        };

        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
            // Pointer capture may be unavailable when a browser ends the gesture early.
        }
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
        const gesture = pointerRef.current;
        if (!gesture || gesture.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - gesture.startX;
        const deltaY = event.clientY - gesture.startY;
        const horizontal = gesture.horizontal || (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY));
        pointerRef.current = { ...gesture, deltaX, deltaY, horizontal };

        if (horizontal) {
            event.preventDefault();
            setDrag({ active: true, deltaX });
        }
    };

    const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
        const gesture = pointerRef.current;
        if (!gesture || gesture.pointerId !== event.pointerId) return;

        pointerRef.current = null;
        setDrag({ active: false, deltaX: 0 });
        if (gesture.horizontal && Math.abs(gesture.deltaX) > 90) {
            onDismiss(toast.id, gesture.deltaX > 0 ? 1 : -1);
        }
    };

    const clearGesture = () => {
        pointerRef.current = null;
        setDrag({ active: false, deltaX: 0 });
    };

    const color = TOAST_COLOR[toast.type];
    const style = {
        '--c': color,
        '--dx': `${drag.deltaX}px`,
        '--y': isExpanded ? '0px' : `${-collapsedIndex * 14}px`,
        '--s': isExpanded ? '1' : `${Math.max(0.7, 1 - collapsedIndex * 0.06)}`,
        '--o': drag.active
            ? `${Math.max(0.2, 1 - Math.abs(drag.deltaX) / 260)}`
            : (!isExpanded && collapsedIndex > 2 ? '0' : '1'),
        zIndex: isExpanded ? undefined : 50 - collapsedIndex,
        '--exit-x': toast.exitDirection ? `${toast.exitDirection * 420}px` : '420px',
        '--exit-rotate': toast.exitDirection ? `${toast.exitDirection * 8}deg` : '8deg',
        '--duration': `${Math.max(1, toast.durationMs ?? 1)}ms`,
    } as CSSProperties;

    const classes = [
        'u070-t',
        entering ? 'enter' : '',
        drag.active ? 'drag' : '',
        toast.isLeaving ? 'leave' : '',
        toast.isLeaving && toast.exitDirection ? 'side' : '',
        isBack ? 'back' : '',
    ].filter(Boolean).join(' ');

    return (
        <article
            className={classes}
            style={style}
            data-testid="toast-card"
            data-toast-id={toast.id}
            data-type={toast.type}
            aria-hidden={isBack && !isExpanded ? true : undefined}
            inert={isBack && !isExpanded}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={clearGesture}
            onLostPointerCapture={clearGesture}
        >
            <span className="u070-ic" aria-hidden="true">
                <ToastIcon type={toast.type} />
            </span>
            <span className="u070-tx">
                <span
                    className="u070-live"
                    role={toast.type === 'error' ? 'alert' : 'status'}
                    aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
                    aria-atomic="true"
                >
                    {toast.message}
                </span>
                <p className="u070-message" aria-hidden="true">{toast.message}</p>
            </span>
            <span className="u070-actions">
                {isFront && onToggleExpanded && (
                    <button
                        className="u070-expand"
                        data-testid="toast-expand"
                        type="button"
                        onClick={onToggleExpanded}
                        aria-controls="u070-stack-list"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? collapseLabel : expandLabel}
                        title={isExpanded ? collapseLabel : expandLabel}
                    >
                        {isExpanded
                            ? <ChevronDown size={16} aria-hidden="true" />
                            : <ChevronUp size={16} aria-hidden="true" />}
                    </button>
                )}
                <button
                    className="u070-x"
                    data-testid="toast-dismiss"
                    type="button"
                    onClick={() => onDismiss(toast.id)}
                    aria-label={closeLabel}
                    title={closeLabel}
                >
                    <X size={15} aria-hidden="true" />
                </button>
            </span>
            {toast.durationMs !== null && !toast.isLeaving && (
                <span
                    key={`${toast.id}-${toast.progressKey}`}
                    className="u070-bar"
                    style={{ '--duration': `${Math.max(1, toast.durationMs)}ms` } as CSSProperties}
                    aria-hidden="true"
                />
            )}
        </article>
    );
}

interface ToastStackProps {
    toasts: ToastRecord[];
    regionLabel: string;
    expandLabel: string;
    collapseLabel: string;
    closeLabel: string;
    paused: boolean;
    onPauseChange: (paused: boolean) => void;
    onDismiss: (id: string, direction?: ToastSwipeDirection) => void;
}

export function ToastStack({
    toasts,
    regionLabel,
    expandLabel,
    collapseLabel,
    closeLabel,
    paused,
    onPauseChange,
    onDismiss,
}: ToastStackProps) {
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [manualExpanded, setManualExpanded] = useState<boolean | null>(null);
    const mouseHoverRef = useRef(false);
    const stackRef = useRef<HTMLElement>(null);
    const zoneRef = useRef<HTMLDivElement>(null);
    const isExpanded = toasts.length > 1 && (manualExpanded ?? (hovered || focused));
    const interactionPaused = hovered || focused || isExpanded;
    const renderedToasts = isExpanded ? [...toasts].reverse() : toasts;

    useEffect(() => {
        onPauseChange(interactionPaused);
    }, [interactionPaused, onPauseChange]);

    useEffect(() => () => onPauseChange(false), [onPauseChange]);

    useEffect(() => {
        const stack = stackRef.current;
        if (toasts.length === 0 || !stack) {
            mouseHoverRef.current = false;
            setHovered(false);
            setFocused(false);
            setManualExpanded(null);
            return;
        }

        const focusStillInside = stack.contains(document.activeElement);
        setFocused(focusStillInside);
        const mouseStillOverStack = mouseHoverRef.current && stack.matches(':hover');
        mouseHoverRef.current = mouseStillOverStack;
        setHovered(mouseStillOverStack);
        if (focused && !focusStillInside) setManualExpanded(null);
    }, [focused, toasts]);

    useLayoutEffect(() => {
        if (isExpanded && zoneRef.current) {
            zoneRef.current.scrollTop = zoneRef.current.scrollHeight;
        }
    }, [isExpanded, toasts.length]);

    if (toasts.length === 0) return null;

    const toggleExpanded = () => setManualExpanded(!isExpanded);
    const handlePointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
        if (event.pointerType === 'mouse') {
            mouseHoverRef.current = true;
            setHovered(true);
        }
    };
    const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
        if (event.pointerType !== 'mouse') return;
        mouseHoverRef.current = false;
        setHovered(false);
        if (manualExpanded === false && !focused) setManualExpanded(null);
    };
    const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
        if (event.pointerType === 'mouse') return;
        mouseHoverRef.current = false;
        setHovered(false);
    };
    const handleBlur = (event: ReactFocusEvent<HTMLElement>) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
        setFocused(false);
        if (!hovered) setManualExpanded(null);
    };

    return (
        <section
            ref={stackRef}
            className={`ux u070-stack${paused || interactionPaused ? ' is-paused' : ''}`}
            role="region"
            aria-label={regionLabel}
            data-testid="toast-stack"
            data-expanded={isExpanded}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={handleBlur}
        >
            <div
                ref={zoneRef}
                id="u070-stack-list"
                className={`u070-zone${isExpanded ? ' u070-zone--expanded' : ''}`}
            >
                {renderedToasts.map(toast => {
                    const collapsedIndex = toasts.findIndex(item => item.id === toast.id);
                    const isFront = collapsedIndex === 0;
                    return (
                        <ToastCard
                            key={toast.id}
                            toast={toast}
                            collapsedIndex={collapsedIndex}
                            isBack={collapsedIndex > 0 && !isExpanded}
                            isFront={isFront}
                            isExpanded={isExpanded}
                            closeLabel={closeLabel}
                            expandLabel={expandLabel}
                            collapseLabel={collapseLabel}
                            onDismiss={onDismiss}
                            onToggleExpanded={toasts.length > 1 ? toggleExpanded : undefined}
                        />
                    );
                })}
            </div>
        </section>
    );
}
