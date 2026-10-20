// Lucian UX/UI Prompt #040 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#040
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type CSSProperties } from 'react';
import { ChevronRight, ContactRound, Paintbrush, Save, Swords, Tags } from 'lucide-react';
import type { Language } from '../types';
import { i18n } from '../utils/i18n';
import { EDITOR_TABS, type EditorTabId } from './editorTabs';
import './editor-rail.css';

type EditorRailProps = {
    activeTab: EditorTabId;
    onTabChange: (tab: EditorTabId) => void;
    lang: Language;
};

const icons = {
    basic: ContactRound,
    job: Swords,
    style: Tags,
    design: Paintbrush,
    slot: Save,
} satisfies Record<EditorTabId, typeof ContactRound>;

const labels = {
    basic: 'tabBasic',
    job: 'tabJob',
    style: 'tabStyle',
    design: 'tabDesign',
    slot: 'tabSlot',
} as const satisfies Record<EditorTabId, keyof typeof i18n.ko.form>;

export function EditorRail({ activeTab, onTabChange, lang }: EditorRailProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navRef = useRef<HTMLUListElement>(null);
    const tabRefs = useRef<Partial<Record<EditorTabId, HTMLButtonElement | null>>>({});
    const t = i18n[lang].form;

    useEffect(() => {
        const media = window.matchMedia('(max-width: 959px)');
        const update = () => setIsMobile(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useLayoutEffect(() => {
        const nav = navRef.current;
        const activeButton = tabRefs.current[activeTab];
        if (!nav || !activeButton) return;

        const placeHighlight = () => {
            const item = activeButton.parentElement;
            if (!item) return;
            nav.style.setProperty('--u040-y', `${item.offsetTop}px`);
            nav.style.setProperty('--u040-x', `${item.offsetLeft}px`);
            nav.style.setProperty('--u040-highlight-width', `${item.offsetWidth}px`);
        };

        placeHighlight();
        const observer = new ResizeObserver(placeHighlight);
        observer.observe(nav);
        return () => observer.disconnect();
    }, [activeTab, isExpanded, isMobile]);

    const selectTab = (tab: EditorTabId, focus = false) => {
        onTabChange(tab);
        if (focus) tabRefs.current[tab]?.focus({ preventScroll: true });
    };

    const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
        const { key } = event;
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return;

        event.preventDefault();
        const nextIndex = key === 'Home'
            ? 0
            : key === 'End'
                ? EDITOR_TABS.length - 1
                : (currentIndex + (key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1) + EDITOR_TABS.length) % EDITOR_TABS.length;
        selectTab(EDITOR_TABS[nextIndex], true);
    };

    return (
        <nav
            className={`ux u040${isExpanded ? ' is-wide' : ''}`}
            aria-label={t.tabNavigation}
            data-expanded={isExpanded}
            data-orientation={isMobile ? 'horizontal' : 'vertical'}
        >
            <div className="u040-rail">
                <div className="u040-top">
                    <button
                        type="button"
                        className="u040-tog"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? t.navigationCollapse : t.navigationExpand}
                        title={isExpanded ? t.navigationCollapse : t.navigationExpand}
                        onClick={() => setIsExpanded(value => !value)}
                    >
                        <ChevronRight size={16} aria-hidden="true" />
                    </button>
                </div>
                <ul
                    ref={navRef}
                    className="u040-nav"
                    role="tablist"
                    aria-label={t.tabNavigation}
                    aria-orientation={isMobile ? 'horizontal' : 'vertical'}
                >
                    <li className="u040-hl" role="presentation" aria-hidden="true" />
                    {EDITOR_TABS.map((id, index) => {
                        const Icon = icons[id];
                        const label = t[labels[id]];
                        return (
                            <li className="u040-item" role="presentation" key={id}>
                                <button
                                    ref={element => { tabRefs.current[id] = element; }}
                                    className="u040-it"
                                    type="button"
                                    role="tab"
                                    id={`profile-tab-${id}`}
                                    aria-label={label}
                                    aria-selected={activeTab === id}
                                    aria-controls={activeTab === id ? `profile-panel-${id}` : undefined}
                                    tabIndex={activeTab === id ? 0 : -1}
                                    title={!isExpanded && !isMobile ? label : undefined}
                                    onClick={() => selectTab(id)}
                                    onKeyDown={event => handleTabKeyDown(event, index)}
                                    style={{ '--i': index } as CSSProperties}
                                >
                                    <Icon size={22} aria-hidden="true" />
                                    <span>{label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
