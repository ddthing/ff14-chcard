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
// Standard text/select input surface. Uses design token CSS variables for
// automatic light/dark mode support without separate dark: variants.
// Applied to: text inputs, selects, dropdowns, and inline-editable triggers.
export const inputClass =
    'w-full px-3.5 py-2.5 rounded-[8px] text-[13px] font-medium ' +
    'outline-none transition-all duration-150 ' +
    '[background-color:var(--surface-300)] ' +
    '[color:var(--text-primary)] ' +
    '[border:1px_solid_var(--border-default)] ' +
    'placeholder:[color:var(--text-muted)] ' +
    'focus:[border-color:var(--border-medium)] ' +
    'focus:[box-shadow:0_0_0_3px_rgba(38,37,30,0.06)]';

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
