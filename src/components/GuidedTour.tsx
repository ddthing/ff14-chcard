// Lucian UX/UI Prompt #197 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#197
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Language } from '../types';
import { i18n } from '../utils/i18n';
import './guided-tour.css';

export type GuidedTourStep = {
    target: string;
    title: string;
    description: string;
    prepare?: () => void | Promise<void>;
};

export type GuidedTourProps = {
    open: boolean;
    lang: Language;
    steps: GuidedTourStep[];
    onClose: () => void;
};

type Viewport = { width: number; height: number };
type Rect = { x: number; y: number; width: number; height: number };
type TipSide = 'dn' | 'up' | 'rt' | 'lt' | 'none';
type TipPosition = { left: number; top: number; side: TipSide; arrowX: number; arrowY: number };

const spotlightPadding = 6;
const tooltipMargin = 12;
const tooltipGap = 12;

function readViewport(): Viewport {
    return {
        width: Math.max(1, document.documentElement.clientWidth || window.innerWidth),
        height: Math.max(1, document.documentElement.clientHeight || window.innerHeight),
    };
}

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

function isRenderable(element: Element) {
    if (!element.isConnected || element.closest('[hidden]') || element.getClientRects().length === 0) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.visibility !== 'collapse';
}

function visibleRect(element: Element, viewport: Viewport): Rect | null {
    const rect = element.getBoundingClientRect();
    let left = Math.max(0, rect.left);
    let top = Math.max(0, rect.top);
    let right = Math.min(viewport.width, rect.right);
    let bottom = Math.min(viewport.height, rect.bottom);

    for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
        const style = window.getComputedStyle(ancestor);
        const clipX = /auto|scroll|hidden|clip/.test(style.overflowX);
        const clipY = /auto|scroll|hidden|clip/.test(style.overflowY);
        if (!clipX && !clipY) continue;
        const bounds = ancestor.getBoundingClientRect();
        if (clipX) {
            left = Math.max(left, bounds.left + ancestor.clientLeft);
            right = Math.min(right, bounds.left + ancestor.clientLeft + ancestor.clientWidth);
        }
        if (clipY) {
            top = Math.max(top, bounds.top + ancestor.clientTop);
            bottom = Math.min(bottom, bounds.top + ancestor.clientTop + ancestor.clientHeight);
        }
    }

    if (right <= left || bottom <= top) return null;
    return { x: left, y: top, width: right - left, height: bottom - top };
}

function paddedRect(rect: Rect, viewport: Viewport): Rect {
    const left = Math.max(0, rect.x - spotlightPadding);
    const top = Math.max(0, rect.y - spotlightPadding);
    const right = Math.min(viewport.width, rect.x + rect.width + spotlightPadding);
    const bottom = Math.min(viewport.height, rect.y + rect.height + spotlightPadding);
    return { x: left, y: top, width: right - left, height: bottom - top };
}

function spotlightPath(hole: Rect | null, viewport: Viewport) {
    const { width, height } = viewport;
    if (!hole) return `M0 0H${width}V${height}H0Z`;
    const radius = Math.min(14, hole.width / 2, hole.height / 2);
    const { x, y } = hole;
    const right = x + hole.width;
    const bottom = y + hole.height;
    return `M0 0H${width}V${height}H0Z M${x + radius} ${y}H${right - radius}Q${right} ${y} ${right} ${y + radius}V${bottom - radius}Q${right} ${bottom} ${right - radius} ${bottom}H${x + radius}Q${x} ${bottom} ${x} ${bottom - radius}V${y + radius}Q${x} ${y} ${x + radius} ${y}Z`;
}

function measureTipPosition(target: Rect | null, tip: HTMLElement, viewport: Viewport): TipPosition {
    const width = Math.min(tip.getBoundingClientRect().width || 286, Math.max(0, viewport.width - tooltipMargin * 2));
    const height = tip.getBoundingClientRect().height;
    const maxLeft = Math.max(tooltipMargin, viewport.width - width - tooltipMargin);
    const maxTop = Math.max(tooltipMargin, viewport.height - height - tooltipMargin);

    if (!target) {
        return { left: Math.max(tooltipMargin, (viewport.width - width) / 2), top: Math.max(tooltipMargin, (viewport.height - height) / 2), side: 'none', arrowX: 0, arrowY: 0 };
    }

    const below = viewport.height - (target.y + target.height + tooltipGap + tooltipMargin);
    const above = target.y - tooltipGap - tooltipMargin;
    const right = viewport.width - (target.x + target.width + tooltipGap + tooltipMargin);
    const left = target.x - tooltipGap - tooltipMargin;
    let side: TipSide;
    let proposedLeft: number;
    let proposedTop: number;

    if (below >= height) {
        side = 'dn';
        proposedLeft = target.x + target.width / 2 - width / 2;
        proposedTop = target.y + target.height + tooltipGap;
    } else if (above >= height) {
        side = 'up';
        proposedLeft = target.x + target.width / 2 - width / 2;
        proposedTop = target.y - tooltipGap - height;
    } else if (right >= width) {
        side = 'rt';
        proposedLeft = target.x + target.width + tooltipGap;
        proposedTop = target.y + target.height / 2 - height / 2;
    } else if (left >= width) {
        side = 'lt';
        proposedLeft = target.x - tooltipGap - width;
        proposedTop = target.y + target.height / 2 - height / 2;
    } else if (below >= above) {
        side = 'dn';
        proposedLeft = target.x + target.width / 2 - width / 2;
        proposedTop = target.y + target.height + tooltipGap;
    } else {
        side = 'up';
        proposedLeft = target.x + target.width / 2 - width / 2;
        proposedTop = target.y - tooltipGap - height;
    }

    const placedLeft = clamp(proposedLeft, tooltipMargin, maxLeft);
    const placedTop = clamp(proposedTop, tooltipMargin, maxTop);
    return {
        left: placedLeft,
        top: placedTop,
        side,
        arrowX: clamp(target.x + target.width / 2 - placedLeft, 18, Math.max(18, width - 18)),
        arrowY: clamp(target.y + target.height / 2 - placedTop, 18, Math.max(18, height - 18)),
    };
}

function translateProgress(template: string, current: number, total: number) {
    return template.replace('{current}', String(current)).replace('{total}', String(total));
}

export function GuidedTour({ open, lang, steps, onClose }: GuidedTourProps) {
    const isOpen = open && steps.length > 0;
    const [tourState, setTourState] = useState(() => ({ open: isOpen, index: isOpen ? 0 : -1 }));
    if (tourState.open !== isOpen) setTourState({ open: isOpen, index: isOpen ? 0 : -1 });
    const currentIndex = tourState.index;
    const [viewport, setViewport] = useState<Viewport>(() => typeof window === 'undefined' ? { width: 1, height: 1 } : readViewport());
    const [hole, setHole] = useState<Rect | null>(null);
    const [tipPosition, setTipPosition] = useState<TipPosition | null>(null);
    const tipRef = useRef<HTMLElement>(null);
    const skipButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);
    const holeRef = useRef<Rect | null>(null);
    const stepsRef = useRef(steps);
    const currentIndexRef = useRef(currentIndex);
    const onCloseRef = useRef(onClose);
    const closeRef = useRef<() => void>(() => undefined);
    const moveRef = useRef<(delta: number) => void>(() => undefined);
    const releaseEnvironmentRef = useRef<(() => void) | null>(null);
    const focusReturnRef = useRef<HTMLElement | null>(null);
    const animationRef = useRef<number | null>(null);
    const animationTargetRef = useRef<Rect | null>(null);
    const reducedMotionRef = useRef(false);
    const pendingFocusRef = useRef(false);
    const titleId = `guided-tour-title-${useId()}`;
    const descriptionId = `guided-tour-description-${useId()}`;

    const t = i18n[lang].tour;
    const currentStep = currentIndex >= 0 ? steps[currentIndex] : undefined;

    const moveBy = useCallback((delta: number) => {
        setTourState(state => {
            const next = state.index + delta;
            return next >= 0 && next < stepsRef.current.length ? { ...state, index: next } : state;
        });
    }, []);

    const closeTour = useCallback(() => {
        setTourState(state => ({ ...state, index: -1 }));
        if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        animationTargetRef.current = null;
        holeRef.current = null;
        pendingFocusRef.current = false;
        setHole(null);
        setTipPosition(null);
        releaseEnvironmentRef.current?.();
        const focusReturn = focusReturnRef.current;
        if (focusReturn?.isConnected) focusReturn.focus();
        onCloseRef.current();
    }, []);

    useLayoutEffect(() => {
        stepsRef.current = steps;
        currentIndexRef.current = currentIndex;
        onCloseRef.current = onClose;
        closeRef.current = closeTour;
        moveRef.current = moveBy;
    });

    useLayoutEffect(() => {
        if (!isOpen || currentIndex < 0 || !tipPosition || !pendingFocusRef.current) return;
        nextButtonRef.current?.focus({ preventScroll: true });
        pendingFocusRef.current = false;
    }, [currentIndex, isOpen, tipPosition]);

    useLayoutEffect(() => {
        if (!isOpen || typeof document === 'undefined') return;

        const appRoot = document.getElementById('root');
        const activeElement = document.activeElement;
        const focusReturn = activeElement instanceof HTMLElement ? activeElement : null;
        const previousInert = appRoot?.inert ?? false;
        const previousBodyOverflow = document.body.style.overflow;
        const previousDocumentOverflow = document.documentElement.style.overflow;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let released = false;

        focusReturnRef.current = focusReturn;
        reducedMotionRef.current = reducedMotion.matches;
        if (appRoot) appRoot.inert = true;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        skipButtonRef.current?.focus({ preventScroll: true });

        const handleReducedMotion = (event: MediaQueryListEvent) => {
            reducedMotionRef.current = event.matches;
            if (event.matches && animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
                const finalHole = animationTargetRef.current;
                if (finalHole) {
                    holeRef.current = finalHole;
                    setHole(finalHole);
                }
            }
        };
        reducedMotion.addEventListener('change', handleReducedMotion);

        const handleKeyDown = (event: KeyboardEvent) => {
            const dialog = tipRef.current;
            if (!dialog || currentIndexRef.current < 0) return;

            if (event.key === 'Escape') {
                event.preventDefault();
                closeRef.current();
                return;
            }
            if (!event.altKey && !event.ctrlKey && !event.metaKey && event.key === 'ArrowRight') {
                event.preventDefault();
                if (currentIndexRef.current >= stepsRef.current.length - 1) closeRef.current();
                else moveRef.current(1);
                return;
            }
            if (!event.altKey && !event.ctrlKey && !event.metaKey && event.key === 'ArrowLeft') {
                event.preventDefault();
                moveRef.current(-1);
                return;
            }
            if (event.key !== 'Tab') return;

            const controls = Array.from(dialog.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'))
                .filter(button => !button.hidden && button.getClientRects().length > 0);
            if (controls.length === 0) return;
            const first = controls[0];
            const last = controls[controls.length - 1];
            const activeIndex = controls.indexOf(document.activeElement as HTMLButtonElement);
            if (event.shiftKey && activeIndex <= 0) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (activeIndex === controls.length - 1 || activeIndex < 0)) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        const release = () => {
            if (released) return;
            released = true;
            document.removeEventListener('keydown', handleKeyDown);
            reducedMotion.removeEventListener('change', handleReducedMotion);
            if (appRoot) appRoot.inert = previousInert;
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousDocumentOverflow;
            animationTargetRef.current = null;
            if (releaseEnvironmentRef.current === release) releaseEnvironmentRef.current = null;
        };
        releaseEnvironmentRef.current = release;

        return () => {
            release();
            if (focusReturn?.isConnected) focusReturn.focus();
            if (focusReturnRef.current === focusReturn) focusReturnRef.current = null;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || currentIndex < 0) return;

        const step = stepsRef.current[currentIndex];
        if (!step) return;
        let cancelled = false;
        let retryFrame = 0;
        let measureFrame = 0;
        let positionFrame = 0;
        let retryCount = 0;
        let target: Element | null = null;
        let resizeObserver: ResizeObserver | null = null;
        let mutationObserver: MutationObserver | null = null;
        const pendingFrames = new Set<number>();
        pendingFocusRef.current = true;

        const requestFrame = (callback: FrameRequestCallback) => {
            const frame = requestAnimationFrame(time => {
                pendingFrames.delete(frame);
                if (!cancelled) callback(time);
            });
            pendingFrames.add(frame);
            return frame;
        };

        const updateViewport = () => {
            const nextViewport = readViewport();
            setViewport(nextViewport);
            return nextViewport;
        };

        const animateHole = (to: Rect, animated: boolean) => {
            if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
            animationTargetRef.current = to;
            const from = holeRef.current ?? { x: to.x + to.width / 2, y: to.y + to.height / 2, width: 0, height: 0 };
            if (!animated || reducedMotionRef.current) {
                holeRef.current = to;
                setHole(to);
                animationTargetRef.current = null;
                return;
            }

            const startedAt = performance.now();
            const animate = (now: number) => {
                const progress = Math.max(0, Math.min(1, (now - startedAt) / 520));
                const overshoot = 1.4;
                const eased = 1 + (overshoot + 1) * Math.pow(progress - 1, 3) + overshoot * Math.pow(progress - 1, 2);
                const nextHole = {
                    x: from.x + (to.x - from.x) * eased,
                    y: from.y + (to.y - from.y) * eased,
                    width: Math.max(0, from.width + (to.width - from.width) * eased),
                    height: Math.max(0, from.height + (to.height - from.height) * eased),
                };
                holeRef.current = nextHole;
                setHole(nextHole);
                if (progress < 1) animationRef.current = requestAnimationFrame(animate);
                else {
                    animationRef.current = null;
                    animationTargetRef.current = null;
                }
            };
            animationRef.current = requestAnimationFrame(animate);
        };

        const getTarget = () => {
            try {
                return document.querySelector(step.target);
            } catch {
                return null;
            }
        };

        const applyPosition = (animate: boolean) => {
            if (cancelled) return;
            const nextViewport = updateViewport();
            target = getTarget();
            const targetRect = target && isRenderable(target) ? visibleRect(target, nextViewport) : null;
            const nextHole = targetRect ? paddedRect(targetRect, nextViewport) : null;

            if (nextHole) {
                if (animate) animateHole(nextHole, true);
                else {
                    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
                    animationRef.current = null;
                    animationTargetRef.current = null;
                    holeRef.current = nextHole;
                    setHole(nextHole);
                }
            } else {
                if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
                animationTargetRef.current = null;
                holeRef.current = null;
                setHole(null);
            }

            const tip = tipRef.current;
            if (tip) {
                const measured = measureTipPosition(targetRect, tip, nextViewport);
                setTipPosition(measured);
                tip.style.setProperty('--ax', `${measured.arrowX}px`);
                tip.style.setProperty('--ay', `${measured.arrowY}px`);
            }
        };

        const schedulePosition = () => {
            if (positionFrame !== 0) return;
            positionFrame = requestFrame(() => {
                positionFrame = 0;
                applyPosition(false);
            });
        };

        const onViewportChange = () => schedulePosition();

        const beginTracking = () => {
            if (cancelled) return;
            target = getTarget();
            if ((!target || !isRenderable(target)) && retryCount < 16) {
                retryCount += 1;
                retryFrame = requestFrame(beginTracking);
                return;
            }

            if (target && isRenderable(target)) {
                target.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
            }

            // Wait for the selected tab to commit and for nested scroll containers
            // to finish updating before the first measurement.
            measureFrame = requestFrame(() => {
                measureFrame = requestFrame(() => {
                    applyPosition(true);
                    window.addEventListener('resize', onViewportChange, { passive: true });
                    window.addEventListener('scroll', onViewportChange, { passive: true, capture: true });
                    window.visualViewport?.addEventListener('resize', onViewportChange, { passive: true });
                    window.visualViewport?.addEventListener('scroll', onViewportChange, { passive: true });
                    if (target) {
                        resizeObserver = new ResizeObserver(schedulePosition);
                        resizeObserver.observe(target);
                        if (tipRef.current) resizeObserver.observe(tipRef.current);
                    }
                    const appRoot = document.getElementById('root');
                    if (appRoot) {
                        mutationObserver = new MutationObserver(schedulePosition);
                        mutationObserver.observe(appRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class', 'style'] });
                    }
                });
            });
        };

        const start = async () => {
            try {
                await step.prepare?.();
            } catch {
                // The tour remains usable if a caller's optional panel preparation fails.
            }
            if (!cancelled) beginTracking();
        };

        void start();

        return () => {
            cancelled = true;
            pendingFrames.forEach(cancelAnimationFrame);
            if (retryFrame) cancelAnimationFrame(retryFrame);
            if (measureFrame) cancelAnimationFrame(measureFrame);
            if (positionFrame) cancelAnimationFrame(positionFrame);
            if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();
            window.removeEventListener('resize', onViewportChange);
            window.removeEventListener('scroll', onViewportChange, true);
            window.visualViewport?.removeEventListener('resize', onViewportChange);
            window.visualViewport?.removeEventListener('scroll', onViewportChange);
        };
    }, [currentIndex, isOpen]);

    if (!isOpen || typeof document === 'undefined') return null;

    const progress = translateProgress(t.progress, Math.max(1, currentIndex + 1), steps.length);
    const nextLabel = currentIndex === steps.length - 1 ? t.finish : t.next;
    return createPortal(
        <div className="u197 guided-tour" data-ready={Boolean(tipPosition)} data-testid="guided-tour">
            <svg
                className="u197-ov"
                viewBox={`0 0 ${viewport.width} ${viewport.height}`}
                width={viewport.width}
                height={viewport.height}
                aria-hidden="true"
                focusable="false"
            >
                <path d={spotlightPath(hole, viewport)} fillRule="evenodd" />
            </svg>
            {hole && (
                <span
                    className="u197-ring"
                    aria-hidden="true"
                    style={{
                        transform: `translate3d(${hole.x}px, ${hole.y}px, 0)`,
                        width: hole.width,
                        height: hole.height,
                        borderRadius: Math.min(14, hole.height / 2),
                    }}
                />
            )}
            <section
                ref={tipRef}
                className={`u197-tip${tipPosition?.side ? ` ${tipPosition.side}` : ''}${currentStep ? ' is-visible' : ''}${tipPosition ? '' : ' is-pending'}${tipPosition?.side === 'none' ? ' is-centered' : ''}`}
                style={tipPosition ? { left: tipPosition.left, top: tipPosition.top } : undefined}
                role="dialog"
                aria-modal="true"
                aria-label={t.label}
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                data-testid="guided-tour-dialog"
            >
                <div className="u197-tip-header">
                    <small className="u197-progress" aria-hidden="true">{progress}</small>
                    <button ref={skipButtonRef} className="u197-x" type="button" onClick={closeTour}>{t.skip}</button>
                </div>
                <div className="u197-announcement" aria-live="polite" aria-atomic="true">
                    <span className="u197-sr-only">{progress}</span>
                    <div className="u197-content" key={currentIndex}>
                        {currentStep && <>
                            <h2 id={titleId}>{currentStep.title}</h2>
                            <p id={descriptionId}>{currentStep.description}</p>
                        </>}
                    </div>
                </div>
                <div className="u197-tf">
                    <span className="u197-dots" aria-hidden="true">
                        {steps.map((step, index) => <i key={`${step.target}-${index}`} className={index === currentIndex ? 'on' : undefined} />)}
                    </span>
                    <button className="u197-pv" type="button" onClick={() => moveBy(-1)} hidden={currentIndex <= 0}>{t.previous}</button>
                    <button ref={nextButtonRef} className="u197-nx" type="button" onClick={() => currentIndex < steps.length - 1 ? moveBy(1) : closeTour()}>
                        {nextLabel}
                    </button>
                </div>
            </section>
        </div>,
        document.body,
    );
}
