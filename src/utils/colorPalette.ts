// Lucian UX/UI Prompt #266 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#266

export type ColorPalette = [string, string, string, string, string];

const TARGET_LIGHTNESS = [94, 78, 58, 42, 18] as const;
const TARGET_SATURATION = [38, 46, 52, 46, 34] as const;

// The hue offsets adapt the reference's analogous, complementary, and split-complementary schemes.
const HARMONIES = [
    [0, 8, 16, 24, 12],
    [0, 54, 108, 180, 90],
    [0, 42, 84, 140, 70],
] as const;

type HslColor = { hue: number; saturation: number; lightness: number };

function normalizeHexColor(value: string): string | null {
    return /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : null;
}

function hexToHsl(hex: string): HslColor | null {
    const normalized = normalizeHexColor(hex);
    if (!normalized) return null;

    const red = parseInt(normalized.slice(1, 3), 16) / 255;
    const green = parseInt(normalized.slice(3, 5), 16) / 255;
    const blue = parseInt(normalized.slice(5, 7), 16) / 255;
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    const difference = maximum - minimum;
    const lightness = (maximum + minimum) / 2;
    let hue = 0;
    let saturation = 0;

    if (difference !== 0) {
        saturation = difference / (1 - Math.abs(2 * lightness - 1));
        switch (maximum) {
            case red:
                hue = ((green - blue) / difference) % 6;
                break;
            case green:
                hue = (blue - red) / difference + 2;
                break;
            default:
                hue = (red - green) / difference + 4;
        }
        hue *= 60;
        if (hue < 0) hue += 360;
    }

    return { hue, saturation: saturation * 100, lightness: lightness * 100 };
}

function hslToHex(hue: number, saturation: number, lightness: number): string {
    const normalizedHue = ((hue % 360) + 360) % 360;
    const s = Math.max(0, Math.min(saturation, 100)) / 100;
    const l = Math.max(0, Math.min(lightness, 100)) / 100;
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const section = normalizedHue / 60;
    const secondary = chroma * (1 - Math.abs((section % 2) - 1));
    const offset = l - chroma / 2;
    const channels = section < 1 ? [chroma, secondary, 0]
        : section < 2 ? [secondary, chroma, 0]
            : section < 3 ? [0, chroma, secondary]
                : section < 4 ? [0, secondary, chroma]
                    : section < 5 ? [secondary, 0, chroma]
                        : [chroma, 0, secondary];

    return `#${channels.map(channel => Math.round((channel + offset) * 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function randomUnit(random: () => number): number {
    return Math.max(0, Math.min(random(), 0.999999999));
}

function pickIndex(length: number, random: () => number): number {
    return Math.floor(randomUnit(random) * length);
}

function wrapHue(hue: number): number {
    return ((hue % 360) + 360) % 360;
}

function circularMean(hues: number[]): number {
    const radians = hues.map(hue => hue * Math.PI / 180);
    const x = radians.reduce((total, angle) => total + Math.cos(angle), 0);
    const y = radians.reduce((total, angle) => total + Math.sin(angle), 0);
    return wrapHue(Math.atan2(y, x) * 180 / Math.PI);
}

function hueDistance(left: number, right: number): number {
    const difference = Math.abs(wrapHue(left) - wrapHue(right));
    return Math.min(difference, 360 - difference);
}

function nearestLightnessSlot(lightness: number): number {
    return TARGET_LIGHTNESS.reduce((bestIndex, target, index) =>
        Math.abs(target - lightness) < Math.abs(TARGET_LIGHTNESS[bestIndex] - lightness) ? index : bestIndex, 0);
}

function makePalette(baseHue: number, harmony: readonly number[], random: () => number): ColorPalette {
    return TARGET_LIGHTNESS.map((lightness, index) => {
        const variation = (randomUnit(random) - 0.5) * 8;
        return hslToHex(
            baseHue + harmony[index],
            TARGET_SATURATION[index] + (randomUnit(random) - 0.5) * 10,
            lightness + variation,
        );
    }) as ColorPalette;
}

/** Start with five muted light-to-dark roles and include the user's current valid accent. */
export function createColorPalette(selectedColor: string, random: () => number = Math.random): ColorPalette {
    const selected = hexToHsl(selectedColor);
    const harmony = HARMONIES[pickIndex(HARMONIES.length, random)];
    const selectedSlot = selected ? nearestLightnessSlot(selected.lightness) : 2;
    const baseHue = selected && selected.saturation >= 8
        ? selected.hue - harmony[selectedSlot]
        : randomUnit(random) * 360;
    const palette = makePalette(baseHue, harmony, random);

    if (selected) palette[selectedSlot] = selectedColor.toUpperCase();
    return palette;
}

/** Regenerate only unlocked slots, deriving the scheme from the hues the user locked. */
export function shuffleColorPalette(
    palette: ColorPalette,
    locked: readonly boolean[],
    random: () => number = Math.random,
): ColorPalette {
    const anchors = palette.flatMap((color, index) => {
        if (!locked[index]) return [];
        const hsl = hexToHsl(color);
        return hsl && hsl.saturation >= 8 ? [{ hue: hsl.hue, index }] : [];
    });

    const candidates = HARMONIES.map(harmony => {
        const baseHue = anchors.length > 0
            ? circularMean(anchors.map(anchor => anchor.hue - harmony[anchor.index]))
            : null;
        const cost = baseHue === null ? 0 : anchors.reduce((total, anchor) =>
            total + hueDistance(anchor.hue, baseHue + harmony[anchor.index]) ** 2, 0);
        return { harmony, baseHue, cost };
    });
    const bestCost = Math.min(...candidates.map(candidate => candidate.cost));
    const bestCandidates = candidates.filter(candidate => candidate.cost <= bestCost + 0.01);
    const selected = bestCandidates[pickIndex(bestCandidates.length, random)];
    const baseHue = selected.baseHue ?? randomUnit(random) * 360;
    const next = makePalette(baseHue, selected.harmony, random);

    return next.map((color, index) => locked[index] ? palette[index] : color) as ColorPalette;
}

export function isValidPaletteColor(value: string): boolean {
    return normalizeHexColor(value) !== null;
}
