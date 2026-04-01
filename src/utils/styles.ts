/**
 * Shared Style Tokens
 *
 * Design-system–level class strings shared across all form components.
 * Centralizing these prevents silent divergence when one component is updated
 * and others are inadvertently left behind — a common source of visual debt.
 *
 * Usage:
 *   import { inputClass } from '../../utils/styles';
 */

// ─── Form Input ───────────────────────────────────────────────────────────────
// Standard text/select input surface: off-white fill, subtle border, blue focus ring.
// Applied to: text inputs, selects, dropdowns, and inline-editable triggers.
export const inputClass =
    'w-full bg-[#f5f5f7] dark:bg-[#2d2d2f] border border-[#d2d2d7] dark:border-[#424245] ' +
    'px-4 py-3 rounded-xl text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] ' +
    'focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all';

/**
 * Returns a contrast color (black or white) based on the input hex color.
 * Uses the YIQ luminance formula for optimal accessibility.
 */
export function getContrastColor(hexColor: string): '#000000' | '#ffffff' {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#ffffff';
}
