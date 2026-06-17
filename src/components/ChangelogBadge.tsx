import { Sparkles } from 'lucide-react';
import { APP_VERSION } from '../constants/changelog';
import type { Language } from '../types';

/**
 * ChangelogBadge
 *
 * Minimal floating badge anchored to the bottom-right of the card preview panel.
 * Design: monochrome, token-based, subdued at rest (40% opacity), clear on hover.
 */

interface ChangelogBadgeProps {
    lang: Language;
    onClick: () => void;
}

const BADGE_LABEL: Record<Language, string> = {
    ko: '업데이트',
    en: "What's New",
    ja: 'アップデート',
};

export function ChangelogBadge({ lang, onClick }: ChangelogBadgeProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`${BADGE_LABEL[lang]} ${APP_VERSION}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md active:scale-95 transition-all duration-200 cursor-pointer select-none export-ignore"
            style={{
                backgroundColor: 'var(--surface-100)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-muted)',
                opacity: 0.6,
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.6'; }}
        >
            <Sparkles size={11} style={{ flexShrink: 0 }} />
            <span>{BADGE_LABEL[lang]}</span>
            <span style={{ fontSize: '10px', fontFamily: 'monospace', opacity: 0.6 }}>{APP_VERSION}</span>
        </button>
    );
}
