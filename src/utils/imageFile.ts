export const MAX_CHARACTER_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_CHARACTER_IMAGE_DIMENSION = 3000;

export type ImageFileErrorCode = 'invalid-type' | 'too-large' | 'read-failed';

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

function decodeImage(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new ImageFileError('read-failed'));
        image.src = dataUrl;
    });
}

export async function readImageFile(file: File, maxBytes = MAX_CHARACTER_IMAGE_BYTES): Promise<string> {
    if (!file.type.startsWith('image/')) throw new ImageFileError('invalid-type');
    if (file.size > maxBytes) throw new ImageFileError('too-large');

    const dataUrl = await readAsDataUrl(file);
    const image = await decodeImage(dataUrl);
    const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
    if (longestSide <= MAX_CHARACTER_IMAGE_DIMENSION) return dataUrl;

    const scale = MAX_CHARACTER_IMAGE_DIMENSION / longestSide;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new ImageFileError('read-failed');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp', 0.9);
}
