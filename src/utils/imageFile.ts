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
        try {
            reader.readAsDataURL(file);
        } catch {
            reject(new ImageFileError('read-failed'));
        }
    });
}

async function validateImageDecodes(file: File): Promise<void> {
    const objectUrl = URL.createObjectURL(file);
    try {
        await new Promise<void>((resolve, reject) => {
            const image = new Image();
            image.onload = () => image.naturalWidth > 0 && image.naturalHeight > 0
                ? resolve()
                : reject(new ImageFileError('read-failed'));
            image.onerror = () => reject(new ImageFileError('read-failed'));
            image.src = objectUrl;
        });
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}

export async function readImageFile(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) throw new ImageFileError('invalid-type');
    await validateImageDecodes(file);
    return readAsDataUrl(file);
}
