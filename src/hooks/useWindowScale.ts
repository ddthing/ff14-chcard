import { useState, useEffect, type RefObject } from 'react';

/**
 * Custom hook to calculate the scale of a fixed-width element 
 * to fit within its container.
 * 
 * @param containerRef Ref to the parent container
 * @param targetWidth The width of the element to scale
 * @param padding Horizontal padding to subtract from available width
 */
export function useWindowScale(
    containerRef: RefObject<HTMLDivElement | null>,
    targetWidth: number,
    padding: number = 32
) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const calculateScale = (containerWidth: number) => {
            const isMobile = window.innerWidth < 768;
            const availableWidth = isMobile
                ? Math.min(containerWidth - padding, window.innerWidth - padding)
                : containerWidth - (padding * 2);
            const nextScale = Math.max(0.1, Math.min(1, availableWidth / targetWidth));
            setScale(previousScale => previousScale === nextScale ? previousScale : nextScale);
        };

        calculateScale(container.getBoundingClientRect().width);
        const observer = new ResizeObserver(([entry]) => {
            if (entry) calculateScale(entry.contentRect.width);
        });
        observer.observe(container);

        return () => observer.disconnect();
    }, [containerRef, targetWidth, padding]);

    return scale;
}
