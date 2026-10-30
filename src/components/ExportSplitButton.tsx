// Lucian UX/UI Prompt #010 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#010
import { Check, ChevronDown, Download, Image as ImageIcon, LoaderCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { i18n } from '../utils/i18n';
import type { ExportQuality } from '../utils/exportDimensions';
import type { Language } from '../types';
import './export-split-button.css';

type QualityKey = 'original' | 'standard' | 'high' | 'ultra';

type QualityOption = {
    value: ExportQuality;
    key: QualityKey;
    marker: string;
};

const QUALITY_OPTIONS: QualityOption[] = [
    { value: 'original', key: 'original', marker: 'PNG' },
    { value: 1, key: 'standard', marker: '1×' },
    { value: 2, key: 'high', marker: '2×' },
    { value: 3, key: 'ultra', marker: '3×' },
];

type ExportSplitButtonProps = {
    lang: Language;
    quality: ExportQuality;
    onQualityChange: (quality: ExportQuality) => void;
    onDownload: (event: MouseEvent<HTMLButtonElement>) => Promise<boolean>;
    isRendering: boolean;
    outputSize: { width: number; height: number; limited: boolean };
};

type MenuPosition = { top: number; left: number; maxHeight?: number; placement: 'above' | 'below' };
type LabelRoll = { from: string; to: string };

export function ExportSplitButton({ lang, quality, onQualityChange, onDownload, isRendering, outputSize }: ExportSplitButtonProps) {
    const copy = i18n[lang];
    const menuCopy = copy.exportMenu;
    const studio = copy.studio;
    const qualityLabels: Record<QualityKey, string> = {
        original: studio.original,
        standard: studio.standard,
        high: studio.high,
        ultra: studio.ultra,
    };
    const selectedOption = QUALITY_OPTIONS.find(option => option.value === quality) ?? QUALITY_OPTIONS[0];
    const selectedLabel = qualityLabels[selectedOption.key];
    const saveLabel = menuCopy.saveLabel.replace('{quality}', menuCopy.compactQuality[selectedOption.key]);
    const outputHint = outputSize.limited
        ? studio.exportLimited
        : quality === 'original'
            ? studio.originalHint
            : studio.exportHint;
    const reactId = useId();
    const menuId = `export-quality-menu-${reactId}`;
    const selectedQualityDescriptionId = `export-quality-description-${reactId}`;
    const rootRef = useRef<HTMLDivElement>(null);
    const caretRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const pendingOpenFocusRef = useRef(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuEntered, setMenuEntered] = useState(false);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({ top: 0, left: 0, placement: 'below' });
    const [phase, setPhase] = useState<'idle' | 'busy' | 'done'>('idle');
    const [labelRoll, setLabelRoll] = useState<LabelRoll | null>(null);
    const previousLabelRef = useRef(saveLabel);
    const busy = isRendering || phase === 'busy';
    const done = !isRendering && phase === 'done';
    const menuVisible = menuOpen && !busy;
    const selectedIndex = QUALITY_OPTIONS.findIndex(option => option.value === quality);

    useEffect(() => {
        if (previousLabelRef.current === saveLabel) return;

        const previousLabel = previousLabelRef.current;
        previousLabelRef.current = saveLabel;
        setLabelRoll({ from: previousLabel, to: saveLabel });
        const timeout = window.setTimeout(() => setLabelRoll(null), 520);
        return () => window.clearTimeout(timeout);
    }, [saveLabel]);

    useLayoutEffect(() => {
        if (!menuVisible) return;

        const updatePosition = () => {
            const trigger = caretRef.current;
            const menu = menuRef.current;
            if (!trigger || !menu) return;

            const triggerRect = trigger.getBoundingClientRect();
            const viewport = window.visualViewport;
            const viewportLeft = viewport?.offsetLeft ?? 0;
            const viewportTop = viewport?.offsetTop ?? 0;
            const documentWidth = document.documentElement.clientWidth || window.innerWidth;
            const documentHeight = document.documentElement.clientHeight || window.innerHeight;
            const viewportWidth = viewport ? Math.min(documentWidth, viewport.width) : documentWidth;
            const viewportHeight = viewport ? Math.min(documentHeight, viewport.height) : documentHeight;
            const viewportRight = viewportLeft + viewportWidth;
            const viewportBottom = viewportTop + viewportHeight;
            const gutter = 8;
            const menuWidth = menu.offsetWidth;
            const menuHeight = Math.max(menu.offsetHeight, menu.scrollHeight);
            const minLeft = viewportLeft + gutter;
            const maxLeft = Math.max(minLeft, viewportRight - menuWidth - gutter);
            const left = Math.max(minLeft, Math.min(triggerRect.right - menuWidth, maxLeft));
            const spaceBelow = Math.max(0, viewportBottom - triggerRect.bottom - gutter);
            const spaceAbove = Math.max(0, triggerRect.top - viewportTop - gutter);
            const placeAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;
            const availableHeight = placeAbove ? spaceAbove : spaceBelow;
            const maxHeight = Math.min(menuHeight, availableHeight);
            const proposedTop = placeAbove ? triggerRect.top - maxHeight - gutter : triggerRect.bottom + gutter;
            const minTop = viewportTop + gutter;
            const maxTop = Math.max(minTop, viewportBottom - maxHeight - gutter);
            const top = Math.min(Math.max(minTop, proposedTop), maxTop);

            setMenuPosition(current => current.top === top
                && current.left === left
                && current.maxHeight === maxHeight
                && current.placement === (placeAbove ? 'above' : 'below')
                ? current
                : { top, left, maxHeight, placement: placeAbove ? 'above' : 'below' });
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        const visualViewport = window.visualViewport;
        visualViewport?.addEventListener('resize', updatePosition);
        visualViewport?.addEventListener('scroll', updatePosition);
        const resizeObserver = typeof ResizeObserver === 'undefined' || !caretRef.current || !menuRef.current
            ? null
            : new ResizeObserver(updatePosition);
        if (caretRef.current) resizeObserver?.observe(caretRef.current);
        if (menuRef.current) resizeObserver?.observe(menuRef.current);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
            visualViewport?.removeEventListener('resize', updatePosition);
            visualViewport?.removeEventListener('scroll', updatePosition);
            resizeObserver?.disconnect();
        };
    }, [menuVisible]);

    useEffect(() => {
        if (!menuVisible || !menuEntered || !pendingOpenFocusRef.current) return;
        const target = optionRefs.current[Math.max(0, selectedIndex)];
        target?.focus({ preventScroll: true });
        pendingOpenFocusRef.current = false;
    }, [menuEntered, menuVisible, selectedIndex]);

    useEffect(() => {
        if (!menuVisible) return;

        const closeOnOutsidePress = (event: PointerEvent) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
            setMenuOpen(false);
            setMenuEntered(false);
        };

        document.addEventListener('pointerdown', closeOnOutsidePress);
        return () => document.removeEventListener('pointerdown', closeOnOutsidePress);
    }, [menuVisible]);

    useEffect(() => {
        if (phase !== 'done') return;
        const timeout = window.setTimeout(() => setPhase('idle'), 1600);
        return () => window.clearTimeout(timeout);
    }, [phase]);

    const openMenu = useCallback(() => {
        if (busy) return;
        pendingOpenFocusRef.current = true;
        setMenuEntered(false);
        setMenuOpen(true);
    }, [busy]);

    useEffect(() => {
        if (!menuVisible) return;
        const frame = window.requestAnimationFrame(() => setMenuEntered(true));
        return () => window.cancelAnimationFrame(frame);
    }, [menuVisible]);

    const closeMenu = useCallback((restoreFocus = false) => {
        setMenuOpen(false);
        setMenuEntered(false);
        pendingOpenFocusRef.current = false;
        if (restoreFocus) caretRef.current?.focus({ preventScroll: true });
    }, []);

    const handleQualitySelect = (option: QualityOption) => {
        onQualityChange(option.value);
        closeMenu(true);
    };

    const handleMenuKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu(true);
            return;
        }

        if (event.key === 'Tab') {
            closeMenu(true);
            return;
        }

        const activeIndex = optionRefs.current.indexOf(document.activeElement as HTMLButtonElement);
        let nextIndex = activeIndex;
        if (event.key === 'ArrowDown') nextIndex = (activeIndex + 1 + QUALITY_OPTIONS.length) % QUALITY_OPTIONS.length;
        else if (event.key === 'ArrowUp') nextIndex = (activeIndex - 1 + QUALITY_OPTIONS.length) % QUALITY_OPTIONS.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = QUALITY_OPTIONS.length - 1;
        else return;

        event.preventDefault();
        optionRefs.current[nextIndex]?.focus({ preventScroll: true });
    };

    const handleCaretKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        openMenu();
    };

    const handleDownload = async (event: MouseEvent<HTMLButtonElement>) => {
        if (busy) return;
        closeMenu(false);
        setPhase('busy');
        try {
            const success = await onDownload(event);
            setPhase(success ? 'done' : 'idle');
        } catch {
            setPhase('idle');
        }
    };

    const menu = menuVisible && typeof document !== 'undefined'
        ? createPortal(
            <ul
                ref={menuRef}
                id={menuId}
                className="u010-menu"
                data-open={menuEntered ? '1' : '0'}
                data-placement={menuPosition.placement}
                role="menu"
                aria-label={menuCopy.options}
                style={{ top: menuPosition.top, left: menuPosition.left, maxHeight: menuPosition.maxHeight }}
                onKeyDown={handleMenuKeyDown}
            >
                {QUALITY_OPTIONS.map((option, index) => {
                    const label = qualityLabels[option.key];
                    const selected = option.value === quality;
                    const description = option.value === 'original' ? studio.originalHint : studio.exportHint;
                    return (
                        <li key={option.key} role="none">
                            <button
                                ref={element => { optionRefs.current[index] = element; }}
                                className="u010-opt"
                                type="button"
                                role="menuitemradio"
                                aria-label={label}
                                aria-checked={selected}
                                tabIndex={selected ? 0 : -1}
                                onClick={() => handleQualitySelect(option)}
                            >
                                <span className="u010-oi" aria-hidden="true">
                                    <ImageIcon size={18} strokeWidth={1.8} />
                                    <span>{option.marker}</span>
                                </span>
                                <span className="u010-copy">
                                    <b>{label}</b>
                                    <small>{description}</small>
                                </span>
                                <span className="u010-chk" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                            </button>
                        </li>
                    );
                })}
            </ul>,
            document.body,
        )
        : null;

    return (
        <div ref={rootRef} className="ux u010" data-open={menuVisible ? '1' : '0'} data-state={busy ? 'busy' : done ? 'done' : 'idle'}>
            <div className="u010-output-info">
                <div className="u010-output-row">
                    <span className="u010-quality-label">{studio.quality}</span>
                    <output className="u010-output-size" aria-label={studio.outputSize}>
                        {outputSize.width} × {outputSize.height} px
                    </output>
                </div>
                <span className="u010-output-hint">{outputHint}</span>
            </div>
            <div className="u010-grp" role="group" aria-label={studio.quality}>
                <button
                    className="u010-main"
                    type="button"
                    aria-label={saveLabel}
                    aria-describedby={selectedQualityDescriptionId}
                    aria-busy={busy}
                    disabled={busy}
                    onClick={handleDownload}
                >
                    <span className="u010-ic" aria-hidden="true">
                        <Download className="u010-go" size={16} strokeWidth={2} />
                        <LoaderCircle className="u010-spin" size={16} strokeWidth={2} />
                        <Check className="u010-ok" size={16} strokeWidth={2.6} />
                    </span>
                    <span className="u010-labs" aria-hidden="true">
                        {labelRoll ? (
                            <>
                                <span className="u010-label u010-label--out">{labelRoll.from}</span>
                                <span className="u010-label u010-label--in">{labelRoll.to}</span>
                            </>
                        ) : <span className="u010-label">{saveLabel}</span>}
                    </span>
                    <span className="u010-compact-label" aria-hidden="true">PNG</span>
                    <span className="u010-bar" aria-hidden="true" />
                </button>
                <span id={selectedQualityDescriptionId} className="u010-visually-hidden">{selectedLabel}</span>
                <span className="u010-div" aria-hidden="true" />
                <button
                    ref={caretRef}
                    className="u010-caret"
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={menuVisible}
                    aria-controls={menuVisible ? menuId : undefined}
                    aria-label={menuCopy.options}
                    disabled={busy}
                    onClick={() => menuOpen ? closeMenu(false) : openMenu()}
                    onKeyDown={handleCaretKeyDown}
                >
                    <ChevronDown size={18} strokeWidth={2.2} aria-hidden="true" />
                </button>
            </div>
            {menu}
        </div>
    );
}
