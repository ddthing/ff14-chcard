import { useCallback, useRef } from 'react';

interface UseImageExportOptions {
  filename?: string;
  pixelRatio?: number;
  onError?: (message: string) => void;
  errorCopy?: {
    cors: string;
    generic: string;
    details: string;
  };
}

/**
 * useImageExport
 *
 * Encapsulates the card → PNG export logic so App.tsx stays clean.
 *
 * Design goals:
 * 1. Consistent output across Chrome, Firefox, and Safari.
 * 2. Correct font embedding — waits for document.fonts.ready before capture.
 * 3. Two-pass rendering (call toPng twice) to force cross-origin image caching.
 *    This is the most reliable fix for blank/missing images in Firefox and Safari.
 * 4. Transform is reset to 'none' before capture so html-to-image gets the
 *    true pixel dimensions rather than a scaled version.
 * 5. Exports sticker-selection UI nodes are excluded via CSS class filter.
 *
 * Returns a stable `exportRef` (attach to the element you want to capture)
 * and a `download` async function the caller triggers on button click.
 */
export function useImageExport({ filename = 'ff14-card', pixelRatio = 2, onError, errorCopy }: UseImageExportOptions = {}) {
  const exportRef = useRef<HTMLDivElement>(null);

  const download = useCallback(async () => {
    const node = exportRef.current;
    if (!node) return;

    let previousTransform: string | null = null;

    try {
      // Export is an explicit user action. Keep html-to-image out of the
      // initial editor bundle and load it only when it is actually needed.
      const { toPng } = await import('html-to-image');

      // ── 1. Wait for all web fonts to finish loading ───────────────────────
      try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch {
        // Non-blocking — proceed even if font API is unavailable
      }

      // ── 2. Allow one frame for the browser to composite any deferred paints ─
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      // Small additional delay for backdrop-filter / compositing layers
      await new Promise<void>(resolve => setTimeout(resolve, 120));

      // ── 3. Reset CSS transform so html-to-image captures native dimensions ──
      previousTransform = node.style.transform;
      node.style.transform = 'none';

      // Node filter — strip elements that must not appear in the exported image
      const exportFilter = (n: Node) => {
        const el = n as HTMLElement;
        if (!el.classList) return true;
        return !el.classList.contains('export-ignore');
      };

      const captureOptions = {
        cacheBust: true,
        pixelRatio,
        filter: exportFilter,
        style: { boxShadow: 'none', transform: 'none' },
        // Disable font embedding from external stylesheets — they often cause
        // CORS errors in Firefox / Safari. The fonts are already rendered by the
        // browser; html-to-image will inline their face declarations from the
        // document's loaded font set instead.
        fontEmbedCSS: undefined as unknown as string,
      };

      // ── 4. First pass — primes the image cache (critical for Firefox/Safari)
      await toPng(node, captureOptions);

      // ── 5. Short pause after the first render pass ───────────────────────
      await new Promise<void>(resolve => setTimeout(resolve, 80));

      // ── 6. Second pass — the actual export ──────────────────────────────
      const dataUrl = await toPng(node, captureOptions);

      // Restore transform before any potential throw
      node.style.transform = previousTransform ?? '';

      if (!dataUrl) throw new Error('Image generation returned empty result.');

      // ── 7. Trigger download ──────────────────────────────────────────────
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      if (previousTransform !== null) {
        node.style.transform = previousTransform;
      }

      const message = err instanceof Error ? err.message : String(err);
      const isCorsRelated = message.includes('cssRules') || message.includes('SecurityError');

      const userMessage = errorCopy
        ? `${isCorsRelated ? errorCopy.cors : errorCopy.generic}\n\n${errorCopy.details}: ${message}`
        : isCorsRelated
          ? `Save failed — a browser security policy blocked the export.\n\nDetails: ${message}`
          : `Save failed.\n\nDetails: ${message}`;

      onError?.(userMessage);
    }
  }, [filename, pixelRatio, onError, errorCopy]);

  return { exportRef, download };
}
