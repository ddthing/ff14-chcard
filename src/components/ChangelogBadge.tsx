import { Sparkles } from 'lucide-react';
import { APP_VERSION } from '../constants/changelog';
import type { Language } from '../types';

/**
 * ChangelogBadge
 *
 * A minimal floating badge anchored to the bottom-right of the card preview
 * panel. It surfaces the current version and invites users to explore release
 * notes — without demanding attention or introducing colour noise.
 *
 * Design principles:
 *   - Zero hue: monochrome only. The badge inherits the panel background via
 *     a translucent glassmorphism surface, keeping it neutral in both themes.
 *   - Subdued at rest, clear on hover: default opacity is 50% so the badge
 *     recedes into the background; hovering elevates it to full opacity.
 *   - Consistent scale: uses the same 11px caption track and border radius
 *     tokens (`rounded-full`, `border-[#d2d2d7]`) as other system elements.
 */

interface ChangelogBadgeProps {
    lang: Language;
    onClick: () => void;
}

// Badge label by language — intentionally brief.
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
            className={[
                // Layout
                'flex items-center gap-1.5 px-3 py-1.5',
                // Shape
                'rounded-full',
                // Glassmorphism surface — strictly monochrome
                'bg-white/60 dark:bg-black/40',
                'backdrop-blur-md',
                'border border-[#d2d2d7]/40 dark:border-[#424245]/40',
                // Shadow — very subtle, no colour
                'shadow-[0_1px_8px_rgba(0,0,0,0.06)]',
                // Typography
                'text-[11px] font-medium tracking-tight',
                'text-[#1d1d1f]/50 dark:text-[#f5f5f7]/50',
                // Interaction — opacity gate keeps it unobtrusive at rest
                'opacity-60 hover:opacity-100',
                'hover:bg-white/80 dark:hover:bg-black/60',
                'active:scale-95',
                'transition-all duration-200',
                'cursor-pointer select-none',
            ].join(' ')}
        >
            {/* Sparkles icon — same style as the rest of the UI (lucide stroke) */}
            <Sparkles
                size={11}
                className="shrink-0 text-[#1d1d1f]/40 dark:text-[#f5f5f7]/40"
            />
            <span>{BADGE_LABEL[lang]}</span>
            {/* Version pill — provides technical context without dominating */}
            <span className="text-[10px] font-mono opacity-60">{APP_VERSION}</span>
        </button>
    );
}
