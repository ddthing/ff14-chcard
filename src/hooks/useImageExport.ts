import { useCallback, useRef } from 'react';
import { getExportDimensions, getOriginalImagePixelRatio, type ExportQuality } from '../utils/exportDimensions';
interface UseImageExportOptions {
    filename?: string; pixelRatio?: ExportQuality; onError?: (message: string) => void;
    errorCopy?: { cors: string; generic: string; details: string; original?: string };
}
async function verifyPngDimensions(blob: Blob, expectedWidth: number, expectedHeight: number) {
    const header = new Uint8Array(await blob.slice(0, 24).arrayBuffer());
    const isPng = header.length === 24
        && header[0] === 137 && header[1] === 80 && header[2] === 78 && header[3] === 71
        && header[12] === 73 && header[13] === 72 && header[14] === 68 && header[15] === 82;
    if (!isPng) throw new Error('Image generation returned an invalid PNG.');

    const view = new DataView(header.buffer, header.byteOffset, header.byteLength);
    const actualWidth = view.getUint32(16);
    const actualHeight = view.getUint32(20);
    if (actualWidth !== expectedWidth || actualHeight !== expectedHeight) {
        throw new Error(`Original-resolution PNG was ${actualWidth} × ${actualHeight}px; expected ${expectedWidth} × ${expectedHeight}px.`);
    }
}

function objectPositionFraction(value: string | undefined) {
    if (!value) return 0.5;
    if (value === 'left' || value === 'top') return 0;
    if (value === 'right' || value === 'bottom') return 1;
    if (value === 'center') return 0.5;
    const percent = value.match(/^(-?\d+(?:\.\d+)?)%$/);
    return percent ? Math.max(0, Math.min(1, Number(percent[1]) / 100)) : 0.5;
}

function getObjectPosition(style: CSSStyleDeclaration) {
    const [horizontal, vertical] = style.objectPosition.trim().split(/\s+/);
    return { x: objectPositionFraction(horizontal), y: objectPositionFraction(vertical ?? horizontal) };
}

async function canvasToPngBlob(canvas: HTMLCanvasElement) {
    if (canvas.toBlob) {
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        if (blob) return blob;
        throw new Error('The browser could not encode the original-resolution PNG.');
    }

    const response = await fetch(canvas.toDataURL('image/png'));
    const blob = await response.blob();
    if (!blob.size) throw new Error('The browser could not encode the original-resolution PNG.');
    return blob;
}

/**
 * Render all card layers except the character photo, then composite the photo
 * directly from its decoded source image. SVG/foreignObject rendering can
 * resample one-pixel source detail even when the final canvas has enough pixels.
 */
async function createOriginalResolutionBlob(
    node: HTMLDivElement,
    photo: HTMLImageElement,
    width: number,
    height: number,
    outputWidth: number,
    outputHeight: number,
    ratio: number,
    fontEmbedCSS: string,
) {
    const imageBox = photo.closest<HTMLElement>('.sheet-image');
    if (!imageBox) throw new Error('The character photo has no export container.');

    const clone = node.cloneNode(true) as HTMLDivElement;
    const clonePhoto = clone.querySelector<HTMLImageElement>('.sheet-image > img');
    const cloneImageBox = clone.querySelector<HTMLElement>('.sheet-image');
    if (!clonePhoto || !cloneImageBox) throw new Error('The character photo could not be prepared for export.');
    clonePhoto.remove();
    clone.style.setProperty('background-color', 'transparent', 'important');
    cloneImageBox.style.setProperty('background-color', 'transparent', 'important');

    // Keep the cloned tree laid out and styleable without exposing it to the
    // user or changing the live card being edited.
    const host = document.createElement('div');
    host.setAttribute('aria-hidden', 'true');
    host.inert = true;
    host.style.cssText = 'position:fixed;left:-100000px;top:0;z-index:-1;opacity:0;pointer-events:none;';
    host.appendChild(clone);
    document.body.appendChild(host);

    try {
        const { toCanvas } = await import('html-to-image');
        const overlayCanvas = await toCanvas(clone, {
            width,
            height,
            pixelRatio: ratio,
            fontEmbedCSS,
            cacheBust: false,
            skipAutoScale: true,
            filter: (element: HTMLElement) => !element.classList?.contains('export-ignore'),
            style: { boxShadow: 'none', transform: 'none' },
        });
        if (overlayCanvas.width !== outputWidth || overlayCanvas.height !== outputHeight) {
            throw new Error(`Card overlay was ${overlayCanvas.width} × ${overlayCanvas.height}px; expected ${outputWidth} × ${outputHeight}px.`);
        }

        const context = overlayCanvas.getContext('2d');
        if (!context) throw new Error('The browser cannot create the original-resolution export canvas.');

        const cardRect = node.getBoundingClientRect();
        const boxRect = imageBox.getBoundingClientRect();
        const scaleX = cardRect.width > 0 ? node.offsetWidth / cardRect.width : 1;
        const scaleY = cardRect.height > 0 ? node.offsetHeight / cardRect.height : 1;
        const photoBoxWidth = imageBox.clientWidth;
        const photoBoxHeight = imageBox.clientHeight;
        if (photoBoxWidth <= 0 || photoBoxHeight <= 0) throw new Error('The character photo has no visible export area.');

        const x = (boxRect.left - cardRect.left) * scaleX;
        const y = (boxRect.top - cardRect.top) * scaleY;
        const destination = {
            x: x * ratio,
            y: y * ratio,
            width: photoBoxWidth * ratio,
            height: photoBoxHeight * ratio,
        };

        const objectFit = getComputedStyle(photo).objectFit;
        const coverScale = objectFit === 'cover'
            ? Math.max(photoBoxWidth / photo.naturalWidth, photoBoxHeight / photo.naturalHeight)
            : null;
        const position = getObjectPosition(getComputedStyle(photo));
        const source = coverScale === null
            ? { x: 0, y: 0, width: photo.naturalWidth, height: photo.naturalHeight }
            : {
                x: (photo.naturalWidth - photoBoxWidth / coverScale) * position.x,
                y: (photo.naturalHeight - photoBoxHeight / coverScale) * position.y,
                width: photoBoxWidth / coverScale,
                height: photoBoxHeight / coverScale,
            };
        // Reuse the overlay canvas as the final canvas. Painting behind its
        // transparent photo area keeps the source photo, photo wash, and card
        // background beneath stickers and the outer frame without allocating
        // another full-size raster.
        context.save();
        try {
            context.globalCompositeOperation = 'destination-over';
            context.imageSmoothingEnabled = false;
            context.drawImage(photo, source.x, source.y, source.width, source.height,
                destination.x, destination.y, destination.width, destination.height);
            // The photo can contain alpha, so preserve the image-area wash
            // beneath it as it appears in the preview.
            context.fillStyle = getComputedStyle(imageBox).backgroundColor;
            context.fillRect(destination.x, destination.y, destination.width, destination.height);
            context.fillStyle = getComputedStyle(node).backgroundColor;
            context.fillRect(0, 0, outputWidth, outputHeight);
        } finally {
            context.restore();
        }

        return await canvasToPngBlob(overlayCanvas);
    } finally {
        host.remove();
    }
}

export function useImageExport({ filename = 'ff14-card', pixelRatio = 2, onError, errorCopy }: UseImageExportOptions = {}) {
    const exportRef = useRef<HTMLDivElement>(null);
    const exportingRef = useRef(false);
    const download = useCallback(async (): Promise<boolean> => {
        const node = exportRef.current;
        if (!node || exportingRef.current) return false;
        exportingRef.current = true;
        try {
            const { toBlob, getFontEmbedCSS } = await import('html-to-image');
            await document.fonts?.ready;
            await Promise.all(Array.from(node.querySelectorAll('img')).map(image => image.decode()));
            await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
            const width = node.offsetWidth, height = node.offsetHeight;
            // Re-read the live card after decoding and layout have settled. The
            // output-size label's observer can lag a just-uploaded image or a
            // just-changed card layout by one frame.
            const originalPhoto = pixelRatio === 'original'
                ? node.querySelector<HTMLImageElement>('.sheet-image > img')
                : null;
            const originalImageRatio = getOriginalImagePixelRatio(originalPhoto);
            const output = getExportDimensions(width, height, pixelRatio, originalImageRatio);
            const { ratio } = output;
            const fontEmbedCSS = await getFontEmbedCSS(node);
            const options = { width, height, pixelRatio: ratio, fontEmbedCSS, cacheBust: false,
                skipAutoScale: pixelRatio === 'original',
                filter: (element: HTMLElement) => !element.classList?.contains('export-ignore'),
                style: { boxShadow: 'none', transform: 'none' } };
            const needsWarmup = /AppleWebKit/.test(navigator.userAgent) && !/(Chrome|Chromium|Edg|OPR)\//.test(navigator.userAgent);
            if (needsWarmup) await toBlob(node, { ...options, pixelRatio: Math.min(1, ratio) });
            const blob = originalPhoto
                ? await createOriginalResolutionBlob(node, originalPhoto, width, height, output.width, output.height, ratio, fontEmbedCSS)
                : await toBlob(node, options);
            if (!blob) throw new Error('Image generation returned an empty result.');
            if (pixelRatio === 'original') await verifyPngDimensions(blob, output.width, output.height);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = Array.from(filename).map(char => char.charCodeAt(0) < 32 ? '-' : char).join('').replace(/[<>:"/\\|?*]/g, '-').slice(0, 120) + '.png';
            link.href = url;
            document.body.appendChild(link); link.click(); link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const cors = message.includes('cssRules') || message.includes('SecurityError');
            const label = cors ? errorCopy?.cors : pixelRatio === 'original' ? errorCopy?.original ?? errorCopy?.generic : errorCopy?.generic;
            onError?.(errorCopy ? label + '\n\n' + errorCopy.details + ': ' + message : 'Save failed.\n\nDetails: ' + message);
            return false;
        } finally { exportingRef.current = false; }
    }, [filename, pixelRatio, onError, errorCopy]);
    return { exportRef, download };
}
