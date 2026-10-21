import { useEffect, useState, type RefObject } from 'react';
import { getOriginalImagePixelRatio } from '../utils/exportDimensions';

const CHARACTER_PHOTO_SELECTOR = '.sheet-image > img';

/** Tracks the effective source-pixel ratio of the card's displayed character photo. */
export function useOriginalImageRatio(ref: RefObject<HTMLDivElement | null>) {
    const [ratio, setRatio] = useState(1);

    useEffect(() => {
        const cardRoot = ref.current;
        if (!cardRoot) return;

        let photo: HTMLImageElement | null = null;
        let frame: number | null = null;
        const scheduleRefresh = () => {
            if (frame !== null) return;
            frame = requestAnimationFrame(() => {
                frame = null;
                refresh();
            });
        };
        const resizeObserver = new ResizeObserver(scheduleRefresh);
        const mutationObserver = new MutationObserver(records => {
            // Sticker transforms and form text never change the source-photo
            // ratio. Avoid synchronous layout reads for those frequent edits.
            if (records.some(record => record.target === cardRoot
                || (record.target instanceof Element && record.target.closest('.sheet-image')))) {
                scheduleRefresh();
            }
        });

        function refresh() {
            const nextPhoto = cardRoot?.querySelector<HTMLImageElement>(CHARACTER_PHOTO_SELECTOR) ?? null;
            if (nextPhoto !== photo) {
                if (photo) {
                    photo.removeEventListener('load', scheduleRefresh);
                    photo.removeEventListener('error', scheduleRefresh);
                    resizeObserver.unobserve(photo);
                }
                photo = nextPhoto;
                if (photo) {
                    photo.addEventListener('load', scheduleRefresh);
                    photo.addEventListener('error', scheduleRefresh);
                    resizeObserver.observe(photo);
                }
            }

            const nextRatio = getOriginalImagePixelRatio(photo);
            setRatio(previous => previous === nextRatio ? previous : nextRatio);
        }

        resizeObserver.observe(cardRoot);
        mutationObserver.observe(cardRoot, {
            attributes: true,
            attributeFilter: ['src', 'class', 'style', 'data-layout'],
            childList: true,
            subtree: true,
        });
        refresh();

        return () => {
            mutationObserver.disconnect();
            resizeObserver.disconnect();
            if (frame !== null) cancelAnimationFrame(frame);
            photo?.removeEventListener('load', scheduleRefresh);
            photo?.removeEventListener('error', scheduleRefresh);
        };
    }, [ref]);

    return ratio;
}
