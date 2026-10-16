import { useLayoutEffect, useState, type RefObject } from 'react';

export function useCardDimensions(ref: RefObject<HTMLDivElement | null>) {
    const [size, setSize] = useState({ width: 700, height: 500 });
    useLayoutEffect(() => {
        const card = ref.current;
        if (!card) return;
        const measure = () => {
            const width = card.offsetWidth, height = card.offsetHeight;
            setSize(previous => previous.width === width && previous.height === height ? previous : { width, height });
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(card);
        return () => observer.disconnect();
    }, [ref]);
    return size;
}
