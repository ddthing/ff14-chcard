const MAX_CHARACTER_IMAGE_DIMENSION = 3000;
// This only decides whether to keep an already-compressed source as-is; it never rejects an upload.
const MAX_RETAINED_IMAGE_BYTES = 10 * 1024 * 1024;

export type ImageFileErrorCode = 'invalid-type' | 'read-failed';

export class ImageFileError extends Error {
    code: ImageFileErrorCode;

    constructor(code: ImageFileErrorCode) {
        super(code);
        this.code = code;
    }
}

function readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string'
            ? resolve(reader.result)
            : reject(new ImageFileError('read-failed'));
        reader.onerror = () => reject(new ImageFileError('read-failed'));
        reader.onabort = () => reject(new ImageFileError('read-failed'));
        reader.readAsDataURL(file);
    });
}

async function decodeImage(file: File): Promise<HTMLImageElement> {
    const objectUrl = URL.createObjectURL(file);
    try {
        return await new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new ImageFileError('read-failed'));
            image.src = objectUrl;
        });
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}

export async function readImageFile(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) throw new ImageFileError('invalid-type');

    const image = await decodeImage(file);
    if (image.naturalWidth === 0 || image.naturalHeight === 0) throw new ImageFileError('read-failed');
    const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
    const shouldDownscale = longestSide > MAX_CHARACTER_IMAGE_DIMENSION;
    if (!shouldDownscale && file.size <= MAX_RETAINED_IMAGE_BYTES) return readAsDataUrl(file);

    const scale = shouldDownscale ? MAX_CHARACTER_IMAGE_DIMENSION / longestSide : 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new ImageFileError('read-failed');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    try {
        // Normalize uncropped metadata in a lossless working copy. The existing
        // 3000px reduction for very large sources keeps its WebP quality target.
        return shouldDownscale ? canvas.toDataURL('image/webp', 0.9) : canvas.toDataURL('image/png');
    } catch {
        throw new ImageFileError('read-failed');
    }
}
