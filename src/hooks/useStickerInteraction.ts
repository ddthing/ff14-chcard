import { useState, useCallback, type RefObject } from 'react';
import type { Sticker } from '../types';

interface TransformStart {
    scale: number;
    rot: number;
    dist: number;
    angle: number;
}

interface UseStickerInteractionProps {
    stickers?: Sticker[];
    updateStickers: (stickers: Sticker[]) => void;
    constraintsRef: RefObject<HTMLDivElement | null>;
}

export function useStickerInteraction({ stickers, updateStickers, constraintsRef }: UseStickerInteractionProps) {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [transformingId, setTransformingId] = useState<string | null>(null);
    const [transformAction, setTransformAction] = useState<'scale' | 'rotate' | null>(null);
    const [transformStart, setTransformStart] = useState<TransformStart | null>(null);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!constraintsRef.current || (!draggingId && !transformingId)) return;

        const rect = constraintsRef.current.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        if (draggingId) {
            const xPx = Math.max(0, Math.min(px, rect.width));
            const yPx = Math.max(0, Math.min(py, rect.height));
            const newX = Number(((xPx / rect.width) * 100).toFixed(1));
            const newY = Number(((yPx / rect.height) * 100).toFixed(1));

            updateStickers(stickers?.map((s) =>
                s.id === draggingId ? { ...s, x: newX, y: newY } : s
            ) || []);
        } else if (transformingId && transformStart) {
            const sticker = stickers?.find(s => s.id === transformingId);
            if (!sticker) return;

            const cx = (sticker.x / 100) * rect.width;
            const cy = (sticker.y / 100) * rect.height;

            const currentDist = Math.hypot(px - cx, py - cy);
            const currentAngle = Math.atan2(py - cy, px - cx);

            let newScale = sticker.scale;
            let newRot = sticker.rotation;

            if (transformAction === 'scale') {
                const scaleMultiplier = currentDist / transformStart.dist;
                newScale = transformStart.scale * scaleMultiplier;
                newScale = Math.max(0.1, Math.min(3, newScale));
            } else if (transformAction === 'rotate') {
                const angleDiff = currentAngle - transformStart.angle;
                newRot = (transformStart.rot + angleDiff * (180 / Math.PI)) % 360;
                if (newRot < 0) newRot += 360;
            }

            updateStickers(stickers?.map((s) =>
                s.id === transformingId ? { ...s, scale: Number(newScale.toFixed(2)), rotation: Math.round(newRot) } : s
            ) || []);
        }
    }, [draggingId, transformingId, transformAction, transformStart, stickers, updateStickers, constraintsRef]);

    const handlePointerUp = useCallback(() => {
        setDraggingId(null);
        setTransformingId(null);
        setTransformAction(null);
    }, []);

    const startDrag = useCallback((id: string) => {
        setDraggingId(id);
    }, []);

    const startTransform = useCallback((
        id: string,
        sticker: Sticker,
        clientX: number,
        clientY: number,
        action: 'scale' | 'rotate'
    ) => {
        if (!constraintsRef.current) return;
        const rect = constraintsRef.current.getBoundingClientRect();
        const cx = (sticker.x / 100) * rect.width;
        const cy = (sticker.y / 100) * rect.height;
        const px = clientX - rect.left;
        const py = clientY - rect.top;

        setTransformingId(id);
        setTransformAction(action);
        setTransformStart({
            scale: sticker.scale,
            rot: sticker.rotation,
            dist: Math.hypot(px - cx, py - cy),
            angle: Math.atan2(py - cy, px - cx),
        });
    }, [constraintsRef]);

    return {
        draggingId,
        transformingId,
        handlePointerMove,
        handlePointerUp,
        startDrag,
        startTransform,
    };
}
