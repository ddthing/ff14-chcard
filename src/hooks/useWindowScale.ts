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
    padding: number = 32,
    targetHeight?: number,
) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const calculateScale = () => {
            const containerWidth = container.clientWidth;
            const isMobile = window.innerWidth < 960;
            const availableWidth = isMobile
                ? Math.min(containerWidth - padding, window.innerWidth - padding)
                : containerWidth - (padding * 2);
            const heightScale = !isMobile && targetHeight ? (container.clientHeight - padding * 2) / targetHeight : 1;
            const nextScale = Math.max(0.001, Math.min(1, availableWidth / targetWidth, heightScale));
            setScale(previousScale => previousScale === nextScale ? previousScale : nextScale);
        };

        calculateScale();
        const observer = new ResizeObserver(calculateScale);
        observer.observe(container);

        return () => observer.disconnect();
    }, [containerRef, targetWidth, targetHeight, padding]);

    return scale;
}
