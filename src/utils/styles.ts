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

function hexToRgb(hexColor: string): [number, number, number] | null {
    const hex = hexColor.replace('#', '').trim();
    if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
    return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16),
    ];
}

function relativeLuminance(hexColor: string): number | null {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return null;
    const [red, green, blue] = rgb.map(value => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function getContrastRatio(foreground: string, background: string): number | null {
    const foregroundLuminance = relativeLuminance(foreground);
    const backgroundLuminance = relativeLuminance(background);
    if (foregroundLuminance === null || backgroundLuminance === null) return null;
    const lighter = Math.max(foregroundLuminance, backgroundLuminance);
    const darker = Math.min(foregroundLuminance, backgroundLuminance);
    return (lighter + 0.05) / (darker + 0.05);
}

/** Preserve the accent hue while meeting contrast on the actual surface. */
export function getAccessibleAccentColor(hexColor: string, surfaceColor: string, minimumRatio = 3): string {
    const rgb = hexToRgb(hexColor);
    const target = getContrastColor(surfaceColor);
    if (!rgb) return target;
    if ((getContrastRatio(hexColor, surfaceColor) ?? 0) >= minimumRatio) return hexColor;
    const channelTarget = target === '#ffffff' ? 255 : 0;
    for (let step = 1; step <= 50; step++) {
        const color = `#${rgb.map(value => Math.round(value + (channelTarget - value) * step / 50).toString(16).padStart(2, '0')).join('')}`;
        if ((getContrastRatio(color, surfaceColor) ?? 0) >= minimumRatio) return color;
    }
    return target;
}

export function getAccentSurface(hexColor: string, surfaceColor: string): string {
    const accent = hexToRgb(hexColor) ?? [87, 83, 78];
    const surface = hexToRgb(surfaceColor) ?? [255, 255, 255];
    return `#${surface.map((value, index) => Math.round(value * 0.92 + accent[index] * 0.08).toString(16).padStart(2, '0')).join('')}`;
}
