// Lucian UX/UI Prompt #038 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#038
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AlignCenter, ArrowDown, ArrowUp, Ellipsis, RotateCcw, Trash2 } from 'lucide-react';
import type { Language } from '../types';
import { i18n } from '../utils/i18n';
import './sticker-context-menu.css';

interface StickerContextMenuProps {
    lang: Language;
    canvasRef: RefObject<HTMLDivElement | null>;
    stickerNumber: number;
    isSelected: boolean;
    isAtFront: boolean;
    isAtBack: boolean;
    onRequestOpen: () => void;
    onMoveForward: () => void;
    onMoveBackward: () => void;
    onCenter: () => void;
    onReset: () => void;
    onDelete: () => void;
    children: ReactNode;
}

interface MenuPosition {
    left: number;
    top: number;
    originX: 'left' | 'right';
    originY: 'top' | 'bottom';
}

interface TriggerPosition {
    left: number;
    top: number;
}

const VIEWPORT_GUTTER = 8;

function focusableElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    )).filter(element => {
        const style = window.getComputedStyle(element);
        return element.tabIndex >= 0
            && !element.closest('[inert], [hidden], [aria-hidden="true"]')
            && element.getClientRects().length > 0
            && style.visibility !== 'hidden'
            && style.display !== 'none';
    });
}

export function StickerContextMenu({
    lang,
    canvasRef,
    stickerNumber,
    isSelected,
    isAtFront,
    isAtBack,
    onRequestOpen,
    onMoveForward,
    onMoveBackward,
    onCenter,
    onReset,
    onDelete,
    children,
}: StickerContextMenuProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const openerRef = useRef<HTMLElement | null>(null);
    const requestedPointRef = useRef<{ x: number; y: number } | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<MenuPosition | null>(null);
    const [triggerPosition, setTriggerPosition] = useState<TriggerPosition | null>(null);
    const [focusFirstOnOpen, setFocusFirstOnOpen] = useState(true);
    const formText = i18n[lang].form;
    const layerText = i18n[lang].layers;

    const placeMenu = useCallback(() => {
        const menu = menuRef.current;
        const point = requestedPointRef.current;
        if (!menu || !point) return;

        const viewport = window.visualViewport;
        const viewportLeft = viewport?.offsetLeft ?? 0;
        const viewportTop = viewport?.offsetTop ?? 0;
        const documentWidth = document.documentElement.clientWidth || window.innerWidth;
        const documentHeight = document.documentElement.clientHeight || window.innerHeight;
        const viewportWidth = viewport ? Math.min(documentWidth, viewport.width) : documentWidth;
        const viewportHeight = viewport ? Math.min(documentHeight, viewport.height) : documentHeight;
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        const flipX = point.x + menuWidth > viewportLeft + viewportWidth - VIEWPORT_GUTTER;
        const flipY = point.y + menuHeight > viewportTop + viewportHeight - VIEWPORT_GUTTER;
        const left = flipX ? point.x - menuWidth : point.x;
        const top = flipY ? point.y - menuHeight : point.y;

        setPosition({
            left: Math.max(viewportLeft + VIEWPORT_GUTTER, Math.min(left, viewportLeft + viewportWidth - menuWidth - VIEWPORT_GUTTER)),
            top: Math.max(viewportTop + VIEWPORT_GUTTER, Math.min(top, viewportTop + viewportHeight - menuHeight - VIEWPORT_GUTTER)),
            originX: flipX ? 'right' : 'left',
            originY: flipY ? 'bottom' : 'top',
        });
    }, []);

    const updateTriggerPosition = useCallback(() => {
        const host = hostRef.current;
        const canvas = canvasRef.current;
        if (!isSelected || !host || !canvas) {
            setTriggerPosition(null);
            return;
        }

        const hostRect = host.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const studioCanvasRect = host.closest<HTMLElement>('.studio-canvas')?.getBoundingClientRect() ?? canvasRect;
        const visualViewport = window.visualViewport;
        const documentWidth = document.documentElement.clientWidth || window.innerWidth;
        const documentHeight = document.documentElement.clientHeight || window.innerHeight;
        const viewportLeft = visualViewport?.offsetLeft ?? 0;
        const viewportTop = visualViewport?.offsetTop ?? 0;
        const viewportWidth = visualViewport ? Math.min(documentWidth, visualViewport.width) : documentWidth;
        const viewportHeight = visualViewport ? Math.min(documentHeight, visualViewport.height) : documentHeight;
        const isTouch = window.matchMedia('(pointer: coarse)').matches;
        const triggerSize = isTouch ? 44 : 28;
        const gap = 4;
        const visibleBounds = {
            left: Math.max(canvasRect.left, studioCanvasRect.left, viewportLeft),
            top: Math.max(canvasRect.top, studioCanvasRect.top, viewportTop),
            right: Math.min(canvasRect.right, studioCanvasRect.right, viewportLeft + viewportWidth),
            bottom: Math.min(canvasRect.bottom, studioCanvasRect.bottom, viewportTop + viewportHeight),
        };
        if (visibleBounds.right - visibleBounds.left < triggerSize || visibleBounds.bottom - visibleBounds.top < triggerSize) {
            setTriggerPosition(null);
            return;
        }

        const anchorBounds = {
            left: Math.max(hostRect.left, visibleBounds.left),
            top: Math.max(hostRect.top, visibleBounds.top),
            right: Math.min(hostRect.right, visibleBounds.right),
            bottom: Math.min(hostRect.bottom, visibleBounds.bottom),
        };
        if (anchorBounds.right <= anchorBounds.left || anchorBounds.bottom <= anchorBounds.top) {
            setTriggerPosition(null);
            return;
        }

        const minLeft = visibleBounds.left + 4;
        const minTop = visibleBounds.top + 4;
        const maxLeft = Math.max(minLeft, visibleBounds.right - triggerSize - 4);
        const maxTop = Math.max(minTop, visibleBounds.bottom - triggerSize - 4);
        const leftCandidates = [anchorBounds.left - triggerSize - gap, anchorBounds.right + gap];
        const topCandidates = [anchorBounds.top - triggerSize - gap, anchorBounds.bottom + gap];
        const availableLeft = leftCandidates.find(candidate => candidate >= minLeft && candidate <= maxLeft);
        const availableTop = topCandidates.find(candidate => candidate >= minTop && candidate <= maxTop);
        const left = Math.max(minLeft, Math.min(availableLeft ?? leftCandidates[0], maxLeft));
        const top = Math.max(minTop, Math.min(availableTop ?? topCandidates[0], maxTop));

        setTriggerPosition(current => current !== null && current.left === left && current.top === top ? current : { left, top });
    }, [canvasRef, isSelected]);

    const openAt = (x: number, y: number, opener: HTMLElement | null, focusFirst = true) => {
        requestedPointRef.current = { x, y };
        openerRef.current = opener;
        setPosition({ left: x, top: y, originX: 'left', originY: 'top' });
        setFocusFirstOnOpen(focusFirst);
        setIsOpen(true);
        onRequestOpen();
    };

    const openFromTrigger = (event: ReactMouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        openAt(rect.right, rect.bottom, event.currentTarget);
    };

    const handleContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target instanceof HTMLElement
            ? event.target.closest<HTMLElement>('button')
            : null;
        openAt(event.clientX, event.clientY, target ?? hostRef.current);
    };

    const handleHostKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') {
            event.preventDefault();
            const target = event.target instanceof HTMLElement
                ? event.target.closest<HTMLElement>('button')
                : null;
            const rect = (target ?? hostRef.current)?.getBoundingClientRect();
            if (rect) openAt(rect.left + Math.min(40, rect.width / 2), rect.top + Math.min(28, rect.height / 2), target ?? hostRef.current);
        }
    };

    const closeMenu = useCallback((returnFocus: boolean) => {
        setIsOpen(false);
        if (!returnFocus) return;

        window.requestAnimationFrame(() => {
            const opener = openerRef.current;
            if (opener?.isConnected) {
                opener.focus();
                return;
            }

            document.querySelector<HTMLElement>('[data-testid="sticker-layer-select"], [data-sticker-add]')?.focus();
        });
    }, []);

    const moveFocus = (event: ReactKeyboardEvent<HTMLDivElement>, direction: -1 | 1 | 'first' | 'last') => {
        const menuItems = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? []);
        if (menuItems.length === 0) return;

        const currentIndex = menuItems.indexOf(document.activeElement as HTMLButtonElement);
        const nextIndex = direction === 'first'
            ? 0
            : direction === 'last'
                ? menuItems.length - 1
                : (currentIndex + direction + menuItems.length) % menuItems.length;
        event.preventDefault();
        menuItems[nextIndex].focus();
    };

    const moveTabFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        const menuOpener = openerRef.current;
        const opener = menuOpener === triggerRef.current
            ? hostRef.current?.querySelector<HTMLElement>('button:not(.sticker-context-trigger)') ?? menuOpener
            : menuOpener;
        const elements = focusableElements().filter(element => element !== triggerRef.current && !menuRef.current?.contains(element));
        const currentIndex = opener ? elements.indexOf(opener) : -1;
        const delta = event.shiftKey ? -1 : 1;
        const nextIndex = currentIndex + delta;
        const next = elements[nextIndex];

        if (currentIndex >= 0 && nextIndex >= 0 && nextIndex < elements.length) event.preventDefault();
        closeMenu(false);
        if (nextIndex >= 0 && nextIndex < elements.length) window.requestAnimationFrame(() => next.focus());
    };

    const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowDown') moveFocus(event, 1);
        else if (event.key === 'ArrowUp') moveFocus(event, -1);
        else if (event.key === 'Home') moveFocus(event, 'first');
        else if (event.key === 'End') moveFocus(event, 'last');
        else if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu(true);
        } else if (event.key === 'Tab') {
            moveTabFocus(event);
        }
    };

    const invoke = (action: () => void) => {
        action();
        closeMenu(true);
    };

    useLayoutEffect(() => {
        updateTriggerPosition();
    });

    useEffect(() => {
        if (!isSelected) return;
        const viewport = window.visualViewport;
        const studioCanvas = hostRef.current?.closest<HTMLElement>('.studio-canvas');
        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateTriggerPosition);
        if (observer && canvasRef.current) observer.observe(canvasRef.current);
        if (observer && studioCanvas) observer.observe(studioCanvas);
        window.addEventListener('resize', updateTriggerPosition);
        window.addEventListener('scroll', updateTriggerPosition, true);
        viewport?.addEventListener('resize', updateTriggerPosition);
        viewport?.addEventListener('scroll', updateTriggerPosition);
        return () => {
            window.removeEventListener('resize', updateTriggerPosition);
            window.removeEventListener('scroll', updateTriggerPosition, true);
            viewport?.removeEventListener('resize', updateTriggerPosition);
            viewport?.removeEventListener('scroll', updateTriggerPosition);
            observer?.disconnect();
        };
    }, [canvasRef, isSelected, updateTriggerPosition]);

    useLayoutEffect(() => {
        if (!isOpen) return;
        placeMenu();
        if (!focusFirstOnOpen) return;
        menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus();
    }, [isOpen, focusFirstOnOpen, placeMenu]);

    useEffect(() => {
        if (!isOpen) return;
        const closeOnOutsidePointer = (event: PointerEvent) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (menuRef.current?.contains(target) || hostRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
            closeMenu(false);
        };
        const reposition = () => placeMenu();
        document.addEventListener('pointerdown', closeOnOutsidePointer, true);
        window.addEventListener('resize', reposition);
        return () => {
            document.removeEventListener('pointerdown', closeOnOutsidePointer, true);
            window.removeEventListener('resize', reposition);
        };
    }, [isOpen, closeMenu, placeMenu]);

    const menuPositionStyle = position ? {
        left: `${position.left}px`,
        top: `${position.top}px`,
        transformOrigin: `${position.originX} ${position.originY}`,
    } : undefined;

    return (
        <div
            ref={hostRef}
            className="sticker-context-host"
            onContextMenu={handleContextMenu}
            onKeyDown={handleHostKeyDown}
        >
            {children}
            {isSelected && triggerPosition && typeof document !== 'undefined' && createPortal(
                <button
                    ref={triggerRef}
                    type="button"
                    className="sticker-context-trigger export-ignore"
                    data-testid="sticker-menu-trigger"
                    aria-label={`${layerText.actions} ${stickerNumber}`}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onPointerDown={event => event.stopPropagation()}
                    onClick={openFromTrigger}
                    style={{ left: `${triggerPosition.left}px`, top: `${triggerPosition.top}px` }}
                >
                    <Ellipsis size={16} aria-hidden="true" />
                </button>,
                document.body,
            )}
            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    ref={menuRef}
                    className="sticker-context-menu is-open"
                    data-testid="sticker-context-menu"
                    role="menu"
                    aria-label={`${layerText.actions} ${stickerNumber}`}
                    style={menuPositionStyle}
                    onKeyDown={handleMenuKeyDown}
                >
                    <button type="button" role="menuitem" data-menu-action="move-forward" disabled={isAtFront} onClick={() => invoke(onMoveForward)}>
                        <ArrowUp size={16} aria-hidden="true" />
                        <span>{formText.moveForward}</span>
                    </button>
                    <button type="button" role="menuitem" data-menu-action="move-backward" disabled={isAtBack} onClick={() => invoke(onMoveBackward)}>
                        <ArrowDown size={16} aria-hidden="true" />
                        <span>{formText.moveBackward}</span>
                    </button>
                    <button type="button" role="menuitem" data-menu-action="center" onClick={() => invoke(onCenter)}>
                        <AlignCenter size={16} aria-hidden="true" />
                        <span>{formText.centerSticker}</span>
                    </button>
                    <button type="button" role="menuitem" data-menu-action="reset" onClick={() => invoke(onReset)}>
                        <RotateCcw size={16} aria-hidden="true" />
                        <span>{formText.resetStickerTransform}</span>
                    </button>
                    <div className="sticker-context-separator" role="separator" />
                    <button type="button" role="menuitem" data-menu-action="delete" className="is-danger" onClick={() => invoke(onDelete)}>
                        <Trash2 size={16} aria-hidden="true" />
                        <span>{formText.delete}</span>
                    </button>
                </div>,
                document.body,
            )}
        </div>
    );
}
