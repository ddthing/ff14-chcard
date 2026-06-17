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
        const calculateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const isMobile = window.innerWidth < 768;
                
                let availableWidth;
                if (isMobile) {
                    availableWidth = Math.min(containerWidth - padding, window.innerWidth - padding);
                } else {
                    // md:p-8 padding (32px * 2 = 64px)
                    availableWidth = containerWidth - (padding * 2);
                }
                
                const newScale = Math.min(1, availableWidth / targetWidth);
                setScale(newScale);
            }
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, [containerRef, targetWidth, padding]);

    return scale;
}
