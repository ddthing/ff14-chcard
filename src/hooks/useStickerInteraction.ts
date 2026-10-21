import { useState, useCallback, useEffect, useRef, type RefObject } from 'react';
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
    const interactionSnapshotRef = useRef<Sticker[] | null>(null);
    const interactionRectRef = useRef<DOMRect | null>(null);
    const pendingMoveRef = useRef<(() => void) | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const discardPendingMove = useCallback(() => {
        if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        pendingMoveRef.current = null;
    }, []);

    const flushPendingMove = useCallback(() => {
        const pendingMove = pendingMoveRef.current;
        discardPendingMove();
        pendingMove?.();
    }, [discardPendingMove]);

    const beginInteraction = useCallback(() => {
        interactionSnapshotRef.current = stickers?.map(sticker => ({ ...sticker })) ?? [];
    }, [stickers]);

    const applyPointerPosition = useCallback((clientX: number, clientY: number) => {
        if (!constraintsRef.current || (!draggingId && !transformingId)) return;

        const rect = interactionRectRef.current ?? constraintsRef.current.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        const px = clientX - rect.left;
        const py = clientY - rect.top;

        if (draggingId) {
            const xPx = Math.max(0, Math.min(px, rect.width));
            const yPx = Math.max(0, Math.min(py, rect.height));
            const newX = Number(((xPx / rect.width) * 100).toFixed(1));
            const newY = Number(((yPx / rect.height) * 100).toFixed(1));
            const current = stickers?.find(sticker => sticker.id === draggingId);
            if (!current || (current.x === newX && current.y === newY)) return;

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
                const scaleMultiplier = currentDist / Math.max(0.001, transformStart.dist);
                newScale = transformStart.scale * scaleMultiplier;
                newScale = Math.max(0.1, Math.min(3, newScale));
            } else if (transformAction === 'rotate') {
                const angleDiff = currentAngle - transformStart.angle;
                newRot = (transformStart.rot + angleDiff * (180 / Math.PI)) % 360;
                if (newRot < 0) newRot += 360;
            }

            const scale = Number(newScale.toFixed(2));
            const rotation = Math.round(newRot);
            if (sticker.scale === scale && sticker.rotation === rotation) return;
            updateStickers(stickers?.map((s) =>
                s.id === transformingId ? { ...s, scale, rotation } : s
            ) || []);
        }
    }, [draggingId, transformingId, transformAction, transformStart, stickers, updateStickers, constraintsRef]);

    const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (!draggingId && !transformingId) return;
        const { clientX, clientY } = event;
        // High-refresh pointers can emit several events per paint. Keep only
        // the latest coordinates so the store, history, and preview update once.
        pendingMoveRef.current = () => applyPointerPosition(clientX, clientY);
        if (animationFrameRef.current === null) {
            animationFrameRef.current = requestAnimationFrame(flushPendingMove);
        }
    }, [draggingId, transformingId, applyPointerPosition, flushPendingMove]);

    const handlePointerUp = useCallback(() => {
        // A release can arrive before the next frame; preserve its last move.
        flushPendingMove();
        setDraggingId(null);
        setTransformingId(null);
        setTransformAction(null);
        setTransformStart(null);
        interactionSnapshotRef.current = null;
        interactionRectRef.current = null;
    }, [flushPendingMove]);

    const handlePointerCancel = useCallback(() => {
        discardPendingMove();
        const snapshot = interactionSnapshotRef.current;
        if (snapshot) updateStickers(snapshot);
        interactionSnapshotRef.current = null;
        handlePointerUp();
    }, [discardPendingMove, handlePointerUp, updateStickers]);

    useEffect(() => discardPendingMove, [discardPendingMove]);

    useEffect(() => {
        if (!draggingId && !transformingId) return;

        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerCancel);
        return () => {
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerCancel);
        };
    }, [draggingId, transformingId, handlePointerCancel, handlePointerUp]);

    const startDrag = useCallback((id: string) => {
        if (!constraintsRef.current) return;
        beginInteraction();
        interactionRectRef.current = constraintsRef.current.getBoundingClientRect();
        setDraggingId(id);
    }, [beginInteraction, constraintsRef]);

    const startTransform = useCallback((
        id: string,
        sticker: Sticker,
        clientX: number,
        clientY: number,
        action: 'scale' | 'rotate'
    ) => {
        if (!constraintsRef.current) return;
        beginInteraction();
        const rect = constraintsRef.current.getBoundingClientRect();
        interactionRectRef.current = rect;
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
    }, [beginInteraction, constraintsRef]);

    return {
        draggingId,
        transformingId,
        handlePointerMove,
        handlePointerUp,
        handlePointerCancel,
        startDrag,
        startTransform,
    };
}
