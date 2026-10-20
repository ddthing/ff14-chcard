// Lucian UX/UI Prompt #336 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#336
import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';
import type { Language } from '../types';
import { i18n } from '../utils/i18n';
import './mobile-editor-sheet.css';

export type MobileEditorDetent = 0 | 1 | 2;

export interface MobileEditorSheetHandle {
    setDetent: (detent: MobileEditorDetent) => void;
    getDetent: () => MobileEditorDetent;
}

interface MobileEditorSheetProps {
    children: ReactNode;
    editorTitle: string;
    lang: Language;
    navigation?: ReactNode;
    onStartTour?: () => void;
}

const DETENT_NAMES = ['collapsed', 'half', 'full'] as const;
const COLLAPSED_HEIGHT = 132;
const FULL_PEEK_HEIGHT = 56;

function clampDetent(value: number): MobileEditorDetent {
    return Math.max(0, Math.min(2, Math.round(value))) as MobileEditorDetent;
}

export const MobileEditorSheet = forwardRef<MobileEditorSheetHandle, MobileEditorSheetProps>(function MobileEditorSheet(
    { children, editorTitle, lang, navigation, onStartTour },
    forwardedRef,
) {
    const rootRef = useRef<HTMLDivElement>(null);
    const detentRef = useRef<MobileEditorDetent>(1);
    const runtimeRef = useRef<Pick<MobileEditorSheetHandle, 'setDetent' | 'getDetent'> | null>(null);
    const [detent, setDetentState] = useState<MobileEditorDetent>(1);
    const [isMobile, setIsMobile] = useState(false);
    const copy = i18n[lang].workspace;
    const detentLabel = copy[DETENT_NAMES[detent]];
    const handleLabel = `${copy.changeHeight}: ${detentLabel}`;

    useImperativeHandle(forwardedRef, () => ({
        setDetent(nextDetent) {
            if (runtimeRef.current) {
                runtimeRef.current.setDetent(nextDetent);
                return;
            }
            const next = clampDetent(nextDetent);
            detentRef.current = next;
            setDetentState(next);
        },
        getDetent() {
            return runtimeRef.current?.getDetent() ?? detentRef.current;
        },
    }), []);

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const workspace = root.parentElement;
        const page = root.closest<HTMLElement>('.studio-page');
        const header = root.querySelector<HTMLElement>('.u336-hd');
        const handle = root.querySelector<HTMLButtonElement>('.u336-gr');
        const editor = root.querySelector<HTMLElement>('.studio-mobile-sheet-editor');
        if (!workspace || !page || !header || !handle || !editor) return;

        const mobileMedia = window.matchMedia('(max-width: 959px)');
        const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
        const viewport = window.visualViewport;
        const previousViewportHeight = page.style.getPropertyValue('--studio-visual-viewport-height');
        const previousViewportTop = page.style.getPropertyValue('--studio-visual-viewport-top');
        const detents = [0, 0, 0];
        let y = 0;
        let target = 0;
        let velocity = 0;
        let raf = 0;
        let focusRaf = 0;
        let lastFrame = 0;
        let isDragging = false;
        let activePointerId: number | null = null;
        let startY = 0;
        let startOffset = 0;
        let coordinateScale = 1;
        let moved = false;
        let history: Array<[number, number]> = [];
        let dragEnd = Number.NEGATIVE_INFINITY;
        let prefersReducedMotion = reducedMotionMedia.matches;

        const restoreInlineValue = (property: string, value: string) => {
            if (value) page.style.setProperty(property, value);
            else page.style.removeProperty(property);
        };

        const paint = () => {
            const half = detents[1];
            const full = detents[2];
            const progress = Math.max(0, Math.min(1, (half - y) / Math.max(1, half - full)));
            root.style.setProperty('--studio-sheet-height', `${Math.max(0, workspace.clientHeight - y).toFixed(1)}px`);
            root.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
            root.style.setProperty('--p', progress.toFixed(3));
            workspace.style.setProperty('--studio-editor-progress', progress.toFixed(3));
            workspace.style.setProperty('--studio-sheet-top', `${Math.max(0, y).toFixed(1)}px`);
        };

        const stopAnimation = () => {
            if (!raf) return;
            cancelAnimationFrame(raf);
            raf = 0;
        };

        const step = (now: number) => {
            raf = 0;
            if (!root.isConnected) return;
            const dt = Math.min(0.032, Math.max(0, (now - lastFrame) / 1000));
            lastFrame = now;
            // Keep #336's slightly underdamped spring so the sheet passes its target before settling.
            velocity += (-320 * (y - target) - 25 * velocity) * dt;
            y += velocity * dt;
            if (Math.abs(y - target) < 0.3 && Math.abs(velocity) < 6) {
                y = target;
                velocity = 0;
                paint();
                return;
            }
            paint();
            raf = requestAnimationFrame(step);
        };

        const run = () => {
            if (!mobileMedia.matches) {
                stopAnimation();
                root.style.removeProperty('transform');
                return;
            }
            if (prefersReducedMotion) {
                y = target;
                velocity = 0;
                paint();
                return;
            }
            if (!raf) {
                lastFrame = performance.now();
                raf = requestAnimationFrame(step);
            }
        };

        const updateDetents = () => {
            const height = workspace.clientHeight;
            detents[2] = Math.min(FULL_PEEK_HEIGHT, Math.round(height * 0.12));
            const collapsedVisible = Math.min(COLLAPSED_HEIGHT, Math.max(128, height * 0.35));
            detents[0] = Math.max(detents[2], height - collapsedVisible);
            detents[1] = Math.max(detents[2], Math.min(Math.round(height * 0.5), detents[0] - 40));
            detents[1] = Math.min(detents[0], detents[1]);
            if (!isDragging) {
                target = detents[detentRef.current];
                y = target;
                velocity = 0;
                run();
            }
        };

        const updatePageViewport = () => {
            if (!mobileMedia.matches) {
                page.style.removeProperty('--studio-visual-viewport-height');
                page.style.removeProperty('--studio-visual-viewport-top');
                return;
            }
            page.style.setProperty('--studio-visual-viewport-height', `${viewport?.height ?? window.innerHeight}px`);
            page.style.setProperty('--studio-visual-viewport-top', `${viewport?.offsetTop ?? 0}px`);
        };

        const alignFocusedField = () => {
            const active = document.activeElement;
            if (!(active instanceof HTMLElement) || !editor.contains(active)) return;
            const panel = active.closest<HTMLElement>('.studio-tab-content');
            if (!panel) return;
            const activeRect = active.getBoundingClientRect();
            const panelRect = panel.getBoundingClientRect();
            const margin = 12;
            if (activeRect.bottom > panelRect.bottom - margin) {
                panel.scrollTop += activeRect.bottom - panelRect.bottom + margin;
            } else if (activeRect.top < panelRect.top + margin) {
                panel.scrollTop -= panelRect.top - activeRect.top + margin;
            }
        };

        const scheduleFieldAlignment = () => {
            if (focusRaf) cancelAnimationFrame(focusRaf);
            focusRaf = requestAnimationFrame(() => {
                focusRaf = 0;
                alignFocusedField();
            });
        };

        const setDetent = (requested: MobileEditorDetent) => {
            const next = clampDetent(requested);
            detentRef.current = next;
            setDetentState(next);
            target = detents[next];
            run();
        };

        const band = (value: number) => {
            if (value < detents[2]) return detents[2] - (detents[2] - value) * 0.25;
            if (value > detents[0]) return detents[0] + (value - detents[0]) * 0.25;
            return value;
        };

        const onPointerDown = (event: PointerEvent) => {
            if (!(event.target instanceof Node) || !header.contains(event.target)) return;
            if (!mobileMedia.matches || (event.pointerType === 'mouse' && event.button !== 0)) return;
            if (isDragging) return;
            isDragging = true;
            activePointerId = event.pointerId;
            moved = false;
            const rect = root.getBoundingClientRect();
            coordinateScale = root.offsetHeight / (rect.height || 1);
            startY = event.clientY;
            startOffset = y;
            velocity = 0;
            history = [[performance.now(), y]];
            stopAnimation();
        };

        const onPointerMove = (event: PointerEvent) => {
            if (!isDragging || event.pointerId !== activePointerId) return;
            const raw = startOffset + (event.clientY - startY) * coordinateScale;
            if (Math.abs(raw - startOffset) > 4) moved = true;
            y = band(raw);
            paint();
            history.push([performance.now(), y]);
            if (history.length > 6) history.shift();
        };

        const onPointerUp = (event: PointerEvent) => {
            if (!isDragging || event.pointerId !== activePointerId) return;
            isDragging = false;
            activePointerId = null;
            if (!moved) {
                target = detents[detentRef.current];
                run();
                return;
            }
            dragEnd = performance.now();
            const first = history[0];
            const last = history[history.length - 1];
            const elapsed = (last[0] - first[0]) / 1000;
            velocity = elapsed > 0.001 ? (last[1] - first[1]) / elapsed : 0;
            // Project the release velocity by 0.2 seconds, then snap to the nearest detent.
            const projected = y + velocity * 0.2;
            let nearest: MobileEditorDetent = 0;
            detents.forEach((candidate, index) => {
                if (Math.abs(candidate - projected) < Math.abs(detents[nearest] - projected)) {
                    nearest = index as MobileEditorDetent;
                }
            });
            setDetent(nearest);
        };

        const onHandleClick = (event: MouseEvent) => {
            if (event.detail > 0 && performance.now() - dragEnd < 350) return;
            setDetent(detentRef.current === 2 ? 0 : clampDetent(detentRef.current + 1));
        };

        const onHandleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setDetent(clampDetent(detentRef.current + 1));
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setDetent(clampDetent(detentRef.current - 1));
            }
        };

        const onEditorFocus = (event: FocusEvent) => {
            if (!mobileMedia.matches) return;
            const focused = event.target;
            if (!(focused instanceof HTMLElement) || !focused.matches('input, textarea, select, [contenteditable="true"]')) return;
            setDetent(2);
            scheduleFieldAlignment();
        };

        const syncResponsiveMode = () => {
            setIsMobile(mobileMedia.matches);
            updatePageViewport();
            if (mobileMedia.matches) {
                updateDetents();
            } else {
                stopAnimation();
                root.style.removeProperty('transform');
                root.style.removeProperty('--studio-sheet-height');
                root.style.removeProperty('--p');
                workspace.style.removeProperty('--studio-editor-progress');
                workspace.style.removeProperty('--studio-sheet-top');
            }
        };

        const onViewportResize = () => {
            updatePageViewport();
            updateDetents();
            scheduleFieldAlignment();
        };

        const onReducedMotionChange = () => {
            prefersReducedMotion = reducedMotionMedia.matches;
            if (prefersReducedMotion && raf) {
                stopAnimation();
                y = target;
                velocity = 0;
                paint();
            }
        };

        runtimeRef.current = { setDetent, getDetent: () => detentRef.current };
        window.addEventListener('pointerdown', onPointerDown, true);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
        handle.addEventListener('click', onHandleClick);
        handle.addEventListener('keydown', onHandleKeyDown);
        editor.addEventListener('focusin', onEditorFocus);
        mobileMedia.addEventListener('change', syncResponsiveMode);
        reducedMotionMedia.addEventListener('change', onReducedMotionChange);
        window.addEventListener('resize', onViewportResize);
        viewport?.addEventListener('resize', onViewportResize);
        viewport?.addEventListener('scroll', updatePageViewport);

        const resizeObserver = new ResizeObserver(updateDetents);
        resizeObserver.observe(workspace);
        syncResponsiveMode();

        return () => {
            window.removeEventListener('pointerdown', onPointerDown, true);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            handle.removeEventListener('click', onHandleClick);
            handle.removeEventListener('keydown', onHandleKeyDown);
            editor.removeEventListener('focusin', onEditorFocus);
            mobileMedia.removeEventListener('change', syncResponsiveMode);
            reducedMotionMedia.removeEventListener('change', onReducedMotionChange);
            window.removeEventListener('resize', onViewportResize);
            viewport?.removeEventListener('resize', onViewportResize);
            viewport?.removeEventListener('scroll', updatePageViewport);
            resizeObserver.disconnect();
            stopAnimation();
            if (focusRaf) cancelAnimationFrame(focusRaf);
            if (runtimeRef.current?.setDetent === setDetent) runtimeRef.current = null;
            restoreInlineValue('--studio-visual-viewport-height', previousViewportHeight);
            restoreInlineValue('--studio-visual-viewport-top', previousViewportTop);
            workspace.style.removeProperty('--studio-editor-progress');
            workspace.style.removeProperty('--studio-sheet-top');
            root.style.removeProperty('--studio-sheet-height');
        };
    }, []);

    return (
        <div
            ref={rootRef}
            className="ux u336 u336-sh studio-mobile-sheet"
            role="region"
            aria-label={copy.editPanel}
            data-detent={DETENT_NAMES[detent]}
        >
            <div className="studio-mobile-sheet-top">
                <div className="u336-hd">
                    <span className="studio-mobile-sheet-title">{editorTitle}</span>
                    <span className="studio-mobile-sheet-height" aria-hidden="true">{detentLabel}</span>
                    <button
                        type="button"
                        className="u336-gr"
                        aria-label={handleLabel}
                        aria-controls="editor-panel"
                        aria-expanded={detent > 0}
                        aria-keyshortcuts="ArrowUp ArrowDown"
                        title={detent === 2 ? copy.collapse : copy.expand}
                    >
                        <span className="sr-only">{handleLabel}</span>
                    </button>
                </div>
                {onStartTour && (
                    <button
                        type="button"
                        className="studio-mobile-sheet-tour"
                        aria-label={i18n[lang].tour.start}
                        title={i18n[lang].tour.start}
                        onClick={onStartTour}
                    >
                        <CircleHelp size={16} aria-hidden="true" />
                    </button>
                )}
            </div>
            {navigation && <div className="studio-mobile-sheet-navigation">{navigation}</div>}
            <div
                className="studio-mobile-sheet-editor"
                aria-hidden={isMobile && detent === 0 ? true : undefined}
                inert={isMobile && detent === 0 ? true : undefined}
            >
                {children}
            </div>
        </div>
    );
});
