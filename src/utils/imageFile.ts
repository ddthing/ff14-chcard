export type ImageFileErrorCode = 'invalid-type' | 'read-failed' | 'aborted';
export type ImageReadPhase = 'reading' | 'validating';

export interface ReadImageFileOptions {
    signal?: AbortSignal;
    onProgress?: (loaded: number, total: number) => void;
    onPhaseChange?: (phase: ImageReadPhase) => void;
}

export class ImageFileError extends Error {
    code: ImageFileErrorCode;

    constructor(code: ImageFileErrorCode) {
        super(code);
        this.code = code;
    }
}

export function readBlobAsDataUrl(file: Blob, options: ReadImageFileOptions = {}): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        let settled = false;

        const finish = (callback: () => void) => {
            if (settled) return;
            settled = true;
            options.signal?.removeEventListener('abort', abort);
            callback();
        };

        const abort = () => {
            if (reader.readyState === FileReader.LOADING) reader.abort();
            finish(() => reject(new ImageFileError('aborted')));
        };

        if (options.signal?.aborted) {
            finish(() => reject(new ImageFileError('aborted')));
            return;
        }

        reader.onprogress = event => {
            options.onProgress?.(event.loaded, event.lengthComputable ? event.total : file.size);
        };
        reader.onload = () => typeof reader.result === 'string'
            ? finish(() => resolve(reader.result as string))
            : finish(() => reject(new ImageFileError('read-failed')));
        reader.onerror = () => finish(() => reject(new ImageFileError('read-failed')));
        reader.onabort = () => finish(() => reject(new ImageFileError('aborted')));
        options.signal?.addEventListener('abort', abort, { once: true });
        options.onPhaseChange?.('reading');
        try {
            reader.readAsDataURL(file);
        } catch {
            finish(() => reject(new ImageFileError('read-failed')));
        }
    });
}

function validateImageDecodes(dataUrl: string, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        let settled = false;

        const finish = (callback: () => void) => {
            if (settled) return;
            settled = true;
            signal?.removeEventListener('abort', abort);
            image.onload = null;
            image.onerror = null;
            callback();
        };

        const abort = () => {
            finish(() => {
                image.src = '';
                reject(new ImageFileError('aborted'));
            });
        };

        if (signal?.aborted) {
            finish(() => reject(new ImageFileError('aborted')));
            return;
        }

        image.onload = () => image.naturalWidth > 0 && image.naturalHeight > 0
            ? finish(resolve)
            : finish(() => reject(new ImageFileError('read-failed')));
        image.onerror = () => finish(() => reject(new ImageFileError('read-failed')));
        signal?.addEventListener('abort', abort, { once: true });
        image.src = dataUrl;
    });
}

function yieldForProgressRender(signal?: AbortSignal): Promise<void> {
    if (typeof requestAnimationFrame === 'undefined') return Promise.resolve();
    return new Promise((resolve, reject) => {
        let frame = 0;
        const cleanup = () => signal?.removeEventListener('abort', abort);
        const abort = () => {
            cancelAnimationFrame(frame);
            cleanup();
            reject(new ImageFileError('aborted'));
        };

        if (signal?.aborted) {
            reject(new ImageFileError('aborted'));
            return;
        }
        signal?.addEventListener('abort', abort, { once: true });
        frame = requestAnimationFrame(() => {
            cleanup();
            resolve();
        });
    });
}

export async function readImageFile(file: File, options: ReadImageFileOptions = {}): Promise<string> {
    if (!file.type.startsWith('image/')) throw new ImageFileError('invalid-type');

    const dataUrl = await readBlobAsDataUrl(file, options);
    // Let React paint the last measured FileReader bytes before switching to
    // the separate, indeterminate image-decode phase.
    if (options.onProgress) await yieldForProgressRender(options.signal);
    if (options.signal?.aborted) throw new ImageFileError('aborted');
    options.onPhaseChange?.('validating');
    await validateImageDecodes(dataUrl, options.signal);
    return dataUrl;
}
