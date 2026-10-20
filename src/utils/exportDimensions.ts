export const MAX_EXPORT_PIXELS = 12_000_000;
const MAX_EXPORT_SIDE = 16_384;

export type ExportQuality = number | 'original';

/**
 * Estimate how many output pixels are available for each CSS pixel of the
 * displayed character photo. `clientWidth` and `clientHeight` intentionally
 * ignore preview zoom transforms: the exported card is rendered at its layout
 * size, and those are the dimensions used by the export canvas.
 */
export function getOriginalImagePixelRatio(image: HTMLImageElement | null | undefined): number {
    if (!image || image.naturalWidth <= 0 || image.naturalHeight <= 0) return 1;

    const renderedWidth = image.clientWidth;
    const renderedHeight = image.clientHeight;
    if (renderedWidth <= 0 || renderedHeight <= 0) return 1;

    const ratio = Math.min(image.naturalWidth / renderedWidth, image.naturalHeight / renderedHeight);
    return Number.isFinite(ratio) ? Math.max(1, ratio) : 1;
}

export function getExportDimensions(width: number, height: number, requestedRatio: ExportQuality, originalImageRatio = 1) {
    const isOriginal = requestedRatio === 'original';
    const selectedRatio = isOriginal
        ? (Number.isFinite(originalImageRatio) ? Math.max(1, originalImageRatio) : 1)
        : (Number.isFinite(requestedRatio) ? Math.max(1, requestedRatio) : 1);
    const ratio = isOriginal
        ? selectedRatio
        : Math.min(selectedRatio, Math.sqrt(MAX_EXPORT_PIXELS / (width * height)), MAX_EXPORT_SIDE / width, MAX_EXPORT_SIDE / height);

    return {
        width: Math.floor(width * ratio),
        height: Math.floor(height * ratio),
        ratio,
        limited: !isOriginal && ratio < selectedRatio,
    };
}
