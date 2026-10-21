/** Encode without a synchronous base64 copy, and discard cancelled results. */
export async function canvasToPngBlob(canvas: HTMLCanvasElement, signal?: AbortSignal): Promise<Blob> {
    signal?.throwIfAborted();
    if (!canvas.toBlob) {
        const response = await fetch(canvas.toDataURL('image/png'), { signal });
        const blob = await response.blob();
        signal?.throwIfAborted();
        if (!blob.size) throw new Error('The browser could not encode the PNG.');
        return blob;
    }

    return new Promise((resolve, reject) => {
        let settled = false;
        const finish = (callback: () => void) => {
            if (settled) return;
            settled = true;
            signal?.removeEventListener('abort', abort);
            callback();
        };
        const abort = () => finish(() => reject(signal?.reason));
        signal?.addEventListener('abort', abort, { once: true });
        try {
            canvas.toBlob(blob => finish(() => {
                if (blob?.size) resolve(blob);
                else reject(new Error('The browser could not encode the PNG.'));
            }), 'image/png');
        } catch (error) {
            finish(() => reject(error));
        }
    });
}
