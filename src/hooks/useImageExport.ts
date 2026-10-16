import { useCallback, useRef } from 'react';
import { getExportDimensions } from '../utils/exportDimensions';
interface UseImageExportOptions {
    filename?: string; pixelRatio?: number; onError?: (message: string) => void;
    errorCopy?: { cors: string; generic: string; details: string };
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
            const { ratio } = getExportDimensions(width, height, pixelRatio);
            const fontEmbedCSS = await getFontEmbedCSS(node);
            const options = { width, height, pixelRatio: ratio, fontEmbedCSS, cacheBust: false,
                filter: (element: HTMLElement) => !element.classList?.contains('export-ignore'),
                style: { boxShadow: 'none', transform: 'none' } };
            const needsWarmup = /AppleWebKit/.test(navigator.userAgent) && !/(Chrome|Chromium|Edg|OPR)\//.test(navigator.userAgent);
            if (needsWarmup) await toBlob(node, { ...options, pixelRatio: Math.min(1, ratio) });
            const blob = await toBlob(node, options);
            if (!blob) throw new Error('Image generation returned an empty result.');
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
            onError?.(errorCopy ? (cors ? errorCopy.cors : errorCopy.generic) + '\n\n' + errorCopy.details + ': ' + message : 'Save failed.\n\nDetails: ' + message);
            return false;
        } finally { exportingRef.current = false; }
    }, [filename, pixelRatio, onError, errorCopy]);
    return { exportRef, download };
}
