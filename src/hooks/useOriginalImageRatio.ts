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
        const resizeObserver = new ResizeObserver(refresh);
        const mutationObserver = new MutationObserver(refresh);

        function refresh() {
            const nextPhoto = cardRoot?.querySelector<HTMLImageElement>(CHARACTER_PHOTO_SELECTOR) ?? null;
            if (nextPhoto !== photo) {
                if (photo) {
                    photo.removeEventListener('load', refresh);
                    photo.removeEventListener('error', refresh);
                    resizeObserver.unobserve(photo);
                }
                photo = nextPhoto;
                if (photo) {
                    photo.addEventListener('load', refresh);
                    photo.addEventListener('error', refresh);
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
            photo?.removeEventListener('load', refresh);
            photo?.removeEventListener('error', refresh);
        };
    }, [ref]);

    return ratio;
}
