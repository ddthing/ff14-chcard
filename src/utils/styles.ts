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
    'outline-none transition-[color,background-color,border-color,box-shadow] duration-150 ' +
    '[background-color:var(--surface-300)] ' +
    '[color:var(--text-primary)] ' +
    '[border:1px_solid_var(--border-default)] ' +
    'placeholder:[color:var(--text-muted)] ' +
    'focus-visible:[border-color:var(--border-medium)] ' +
    'focus-visible:[box-shadow:var(--shadow-focus)] ' +
    'focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]';

/**
 * Returns the black or white text color with the stronger WCAG relative-luminance contrast.
 */
export function getContrastColor(hexColor: string): '#000000' | '#ffffff' {
    const hex = hexColor.replace('#', '').trim();
    if (!/^[0-9a-f]{6}$/i.test(hex)) return '#000000';

    const toLinearChannel = (value: number) => {
        const channel = value / 255;
        return channel <= 0.03928
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
    };

    const red = toLinearChannel(parseInt(hex.substring(0, 2), 16));
    const green = toLinearChannel(parseInt(hex.substring(2, 4), 16));
    const blue = toLinearChannel(parseInt(hex.substring(4, 6), 16));
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    const contrastWithBlack = (luminance + 0.05) / 0.05;
    const contrastWithWhite = 1.05 / (luminance + 0.05);

    return contrastWithBlack >= contrastWithWhite ? '#000000' : '#ffffff';
}
