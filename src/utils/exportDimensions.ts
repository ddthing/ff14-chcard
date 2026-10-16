export const MAX_EXPORT_PIXELS = 12_000_000;
const MAX_EXPORT_SIDE = 16_384;

export function getExportDimensions(width: number, height: number, requestedRatio: number) {
    const selectedRatio = Math.max(1, requestedRatio);
    const ratio = Math.min(selectedRatio, Math.sqrt(MAX_EXPORT_PIXELS / (width * height)), MAX_EXPORT_SIDE / width, MAX_EXPORT_SIDE / height);
    return { width: Math.floor(width * ratio), height: Math.floor(height * ratio), ratio, limited: ratio < selectedRatio };
}
