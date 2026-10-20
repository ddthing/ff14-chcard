// <!-- Lucian UX/UI Prompt #031 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#031 -->
import {
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type CompositionEvent,
    type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import type { Language } from '../types';
import { getFonts, i18n } from '../utils/i18n';
import './font-picker.css';

const useSafeLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const CLOSE_ANIMATION_MS = 450;
const MENU_GAP = 8;
const VIEWPORT_GUTTER = 8;
const OPTION_HEIGHT = 46;
const TYPEAHEAD_RESET_MS = 600;

type PopupPosition = {
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    origin: 'top' | 'bottom';
};

type FontPickerProps = {
    value: string;
    onChange: (fontId: string) => void;
    lang: Language;
    active?: boolean;
    disabled?: boolean;
};

export function FontPicker({ value, onChange, lang, active = true, disabled = false }: FontPickerProps) {
    const fonts = getFonts(lang);
    const label = i18n[lang].form.font;
    const emptyLabel = i18n[lang].form.pleaseSelect;
    const isAvailable = active && !disabled;
    const selectedIndex = Math.max(0, fonts.findIndex(font => font.id === value));
    const listId = `font-picker-${useId()}-listbox`;
    const [isOpen, setIsOpen] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const [activeIndex, setActiveIndex] = useState(selectedIndex);
    const [previousAvailability, setPreviousAvailability] = useState(isAvailable);
    const [position, setPosition] = useState<PopupPosition | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typeaheadRef = useRef('');
    const isComposingRef = useRef(false);

    if (previousAvailability !== isAvailable) {
        setPreviousAvailability(isAvailable);
        if (!isAvailable) {
            setIsOpen(false);
            setIsRendered(false);
        }
    }

    const menuIsVisible = isOpen && isAvailable;
    const selectedFont = fonts.find(font => font.id === value);

    const clearCloseTimer = useCallback(() => {
        if (closeTimerRef.current !== null) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    const resetTypeahead = useCallback(() => {
        typeaheadRef.current = '';
        if (typeaheadTimerRef.current !== null) {
            clearTimeout(typeaheadTimerRef.current);
            typeaheadTimerRef.current = null;
        }
    }, []);

    const close = useCallback((restoreFocus = false) => {
        setIsOpen(false);
        resetTypeahead();
        clearCloseTimer();
        closeTimerRef.current = setTimeout(() => {
            setIsRendered(false);
            closeTimerRef.current = null;
        }, CLOSE_ANIMATION_MS);
        if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
    }, [clearCloseTimer, resetTypeahead, setIsOpen, setIsRendered]);

    const open = useCallback(() => {
        if (!active || disabled || fonts.length === 0) return;
        clearCloseTimer();
        resetTypeahead();
        setActiveIndex(selectedIndex);
        setIsRendered(true);
        setIsOpen(true);
    }, [active, clearCloseTimer, disabled, fonts.length, resetTypeahead, selectedIndex, setActiveIndex, setIsOpen, setIsRendered]);

    const updatePopupPosition = useCallback(() => {
        const trigger = triggerRef.current;
        if (!trigger) return;

        const rect = trigger.getBoundingClientRect();
        const viewport = window.visualViewport;
        const viewportLeft = viewport?.offsetLeft ?? 0;
        const viewportTop = viewport?.offsetTop ?? 0;
        const viewportWidth = viewport?.width || document.documentElement.clientWidth || window.innerWidth;
        const viewportHeight = viewport?.height ?? window.innerHeight;
        const viewportRight = viewportLeft + viewportWidth;
        const viewportBottom = viewportTop + viewportHeight;
        const width = Math.max(0, Math.min(rect.width, viewportWidth - VIEWPORT_GUTTER * 2));
        const left = Math.min(
            Math.max(rect.left, viewportLeft + VIEWPORT_GUTTER),
            viewportRight - width - VIEWPORT_GUTTER,
        );
        const fullHeight = fonts.length * OPTION_HEIGHT + VIEWPORT_GUTTER * 2;
        const belowSpace = Math.max(0, viewportBottom - rect.bottom - MENU_GAP - VIEWPORT_GUTTER);
        const aboveSpace = Math.max(0, rect.top - viewportTop - MENU_GAP - VIEWPORT_GUTTER);
        const opensAbove = belowSpace < fullHeight && aboveSpace > belowSpace;
        const availableHeight = opensAbove ? aboveSpace : belowSpace;
        const maxHeight = Math.min(fullHeight, availableHeight);
        const desiredTop = opensAbove
            ? rect.top - MENU_GAP - maxHeight
            : rect.bottom + MENU_GAP;
        const minTop = viewportTop + VIEWPORT_GUTTER;
        const maxTop = Math.max(minTop, viewportBottom - maxHeight - VIEWPORT_GUTTER);
        const top = Math.min(Math.max(desiredTop, minTop), maxTop);

        setPosition({
            top,
            left,
            width,
            maxHeight,
            origin: opensAbove ? 'bottom' : 'top',
        });
    }, [fonts.length, setPosition]);

    const scrollActiveOptionIntoView = useCallback(() => {
        const list = listRef.current;
        if (!list) return;

        const optionTop = activeIndex * OPTION_HEIGHT + VIEWPORT_GUTTER - list.scrollTop;
        const optionBottom = optionTop + OPTION_HEIGHT;
        if (optionTop < 0) {
            list.scrollTop = activeIndex * OPTION_HEIGHT + VIEWPORT_GUTTER;
        } else if (optionBottom > list.clientHeight) {
            list.scrollTop = activeIndex * OPTION_HEIGHT + VIEWPORT_GUTTER + OPTION_HEIGHT - list.clientHeight;
        }
    }, [activeIndex]);

    const handleTypeahead = useCallback((typedText: string) => {
        const nextCharacters = typedText.toLocaleLowerCase(lang);
        if (!nextCharacters) return;

        const previous = typeaheadRef.current;
        const isRepeatedCharacter = previous.length === 1 && previous === nextCharacters;
        const query = isRepeatedCharacter ? nextCharacters : `${previous}${nextCharacters}`;
        typeaheadRef.current = query;

        if (typeaheadTimerRef.current !== null) clearTimeout(typeaheadTimerRef.current);
        typeaheadTimerRef.current = setTimeout(() => {
            typeaheadRef.current = '';
            typeaheadTimerRef.current = null;
        }, TYPEAHEAD_RESET_MS);

        const startIndex = isRepeatedCharacter ? (activeIndex + 1) % fonts.length : 0;
        for (let offset = 0; offset < fonts.length; offset += 1) {
            const index = (startIndex + offset) % fonts.length;
            if (fonts[index].name.toLocaleLowerCase(lang).startsWith(query)) {
                setActiveIndex(index);
                return;
            }
        }

        if (query !== nextCharacters) {
            typeaheadRef.current = nextCharacters;
            const fallbackIndex = fonts.findIndex(font => font.name.toLocaleLowerCase(lang).startsWith(nextCharacters));
            if (fallbackIndex >= 0) setActiveIndex(fallbackIndex);
        }
    }, [activeIndex, fonts, lang, setActiveIndex]);

    const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            close(true);
            return;
        }
        if (event.key === 'Tab') {
            close(false);
            triggerRef.current?.focus({ preventScroll: true });
            return;
        }
        if (isComposingRef.current || event.nativeEvent.isComposing || event.key === 'Process') return;

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const delta = event.key === 'ArrowDown' ? 1 : -1;
            setActiveIndex(index => Math.max(0, Math.min(fonts.length - 1, index + delta)));
            return;
        }
        if (event.key === 'Home') {
            event.preventDefault();
            setActiveIndex(0);
            return;
        }
        if (event.key === 'End') {
            event.preventDefault();
            setActiveIndex(fonts.length - 1);
            return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const font = fonts[activeIndex];
            if (font) {
                onChange(font.id);
                close(true);
            }
            return;
        }
        if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            handleTypeahead(event.key);
        }
    };

    const handleCompositionEnd = (event: CompositionEvent<HTMLDivElement>) => {
        isComposingRef.current = false;
        handleTypeahead(event.data);
    };

    useEffect(() => () => {
        clearCloseTimer();
        resetTypeahead();
    }, [clearCloseTimer, resetTypeahead]);

    useEffect(() => {
        if (!menuIsVisible) return;

        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (!rootRef.current?.contains(target) && !listRef.current?.contains(target)) close(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [close, menuIsVisible]);

    useSafeLayoutEffect(() => {
        if (!menuIsVisible) return;
        updatePopupPosition();

        const trigger = triggerRef.current;
        const list = listRef.current;
        if (list) {
            list.focus({ preventScroll: true });
            scrollActiveOptionIntoView();
        }

        window.addEventListener('resize', updatePopupPosition);
        window.addEventListener('scroll', updatePopupPosition, true);
        const visualViewport = window.visualViewport;
        visualViewport?.addEventListener('resize', updatePopupPosition);
        visualViewport?.addEventListener('scroll', updatePopupPosition);
        const resizeObserver = typeof ResizeObserver === 'undefined' || !trigger
            ? null
            : new ResizeObserver(updatePopupPosition);
        if (trigger) resizeObserver?.observe(trigger);

        return () => {
            window.removeEventListener('resize', updatePopupPosition);
            window.removeEventListener('scroll', updatePopupPosition, true);
            visualViewport?.removeEventListener('resize', updatePopupPosition);
            visualViewport?.removeEventListener('scroll', updatePopupPosition);
            resizeObserver?.disconnect();
        };
    }, [menuIsVisible, activeIndex, scrollActiveOptionIntoView, updatePopupPosition]);

    const menuStyle: CSSProperties = {
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        width: position?.width ?? 'min(calc(100vw - 16px), 320px)',
        maxHeight: position?.maxHeight ?? 'calc(100vh - 16px)',
        '--u031-origin': position?.origin === 'bottom' ? '50% 100%' : '50% 0%',
        '--i': activeIndex,
    } as CSSProperties;

    return (
        <div ref={rootRef} className={`u031 u031-root${menuIsVisible ? ' is-open' : ''}`}>
            <div className="u031-f">
                <button
                    ref={triggerRef}
                    type="button"
                    className="u031-btn"
                    aria-label={label}
                    aria-haspopup="listbox"
                    aria-expanded={menuIsVisible}
                    aria-controls={isRendered && active && !disabled ? listId : undefined}
                    disabled={disabled}
                    onClick={() => menuIsVisible ? close(true) : open()}
                    onKeyDown={event => {
                        if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && !menuIsVisible) {
                            event.preventDefault();
                            open();
                        } else if (event.key === 'Escape' && menuIsVisible) {
                            event.preventDefault();
                            close(true);
                        }
                    }}
                >
                    <span className="u031-v">
                        <span className="u031-v-name">{selectedFont?.name ?? emptyLabel}</span>
                    </span>
                    <ChevronDown className="u031-car" size={16} aria-hidden="true" />
                </button>
            </div>

            {isRendered && active && !disabled && typeof document !== 'undefined' && createPortal(
                <div
                    ref={listRef}
                    id={listId}
                    className={`u031 u031-list${menuIsVisible ? ' is-open' : ''}`}
                    role="listbox"
                    tabIndex={-1}
                    aria-label={label}
                    aria-hidden={!menuIsVisible}
                    inert={!menuIsVisible}
                    aria-activedescendant={menuIsVisible ? `${listId}-option-${activeIndex}` : undefined}
                    onKeyDown={handleListKeyDown}
                    onCompositionStart={() => { isComposingRef.current = true; }}
                    onCompositionEnd={handleCompositionEnd}
                    onBlur={event => {
                        const nextTarget = event.relatedTarget;
                        if (nextTarget instanceof Node && rootRef.current?.contains(nextTarget)) return;
                        close(false);
                    }}
                    style={menuStyle}
                >
                    <div className="u031-hl" aria-hidden="true" />
                    <div className="u031-options">
                        {fonts.map((font, index) => {
                            const isSelected = value === font.id;
                            const isActive = activeIndex === index;
                            return (
                                <div
                                    key={font.id}
                                    id={`${listId}-option-${index}`}
                                    className="u031-o"
                                    role="option"
                                    aria-selected={isSelected}
                                    aria-posinset={index + 1}
                                    aria-setsize={fonts.length}
                                    onPointerMove={event => {
                                        if (event.pointerType === 'mouse' && !isActive) setActiveIndex(index);
                                    }}
                                    onClick={() => {
                                        onChange(font.id);
                                        close(true);
                                    }}
                                >
                                    <span className={`u031-o-label${isActive ? ` card-preview ${font.id}` : ''}`}>{font.name}</span>
                                    <Check className="u031-ck" size={16} strokeWidth={2.6} aria-hidden="true" />
                                </div>
                            );
                        })}
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
}
