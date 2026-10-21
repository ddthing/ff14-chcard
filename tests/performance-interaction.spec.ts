import { expect, test } from '@playwright/test';
import { seed } from './helpers';

const stickerUrl = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#ff00ff"/></svg>').toString('base64');

test.beforeEach(async ({ page }) => {
    await seed(page, { stickers: [{ id: 'pointer-performance', url: stickerUrl, x: 50, y: 50, scale: 1, rotation: 0 }] });
});

test('pointer bursts wait for a paint and release preserves the final coordinates', async ({ page }) => {
    const sticker = page.getByTestId('card-sticker');
    await sticker.locator('button[aria-pressed]').dispatchEvent('pointerdown', { button: 0, clientX: 0, clientY: 0 });
    const result = await sticker.evaluate(async element => {
        const cardSticker = element as HTMLElement;
        const canvas = cardSticker.parentElement!;
        const tracker = canvas.firstElementChild!;
        const rect = canvas.getBoundingClientRect();
        const nativeFrame = window.requestAnimationFrame;
        const nativeCancel = window.cancelAnimationFrame;
        const frames = new Map<number, FrameRequestCallback>();
        let id = 1_000_000;
        window.requestAnimationFrame = callback => { frames.set(++id, callback); return id; };
        window.cancelAnimationFrame = frame => { frames.delete(frame); };
        try {
            for (let index = 1; index <= 100; index++) {
                tracker.dispatchEvent(new PointerEvent('pointermove', {
                    bubbles: true, clientX: rect.left + rect.width * (0.5 + index * 0.003),
                    clientY: rect.top + rect.height * 0.6,
                }));
                // Permit React commits between hardware events, without a paint.
                await Promise.resolve();
            }
            const beforePaint = { x: cardSticker.style.left, y: cardSticker.style.top };
            tracker.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
            await Promise.resolve();
            await Promise.resolve();
            return { beforePaint, afterRelease: { x: cardSticker.style.left, y: cardSticker.style.top } };
        } finally {
            window.requestAnimationFrame = nativeFrame;
            window.cancelAnimationFrame = nativeCancel;
            for (const callback of frames.values()) nativeFrame(callback);
        }
    });
    expect(result.beforePaint).toEqual({ x: '50%', y: '50%' });
    expect(result.afterRelease).toEqual({ x: '80%', y: '60%' });
    await expect.poll(() => sticker.evaluate(element => (element as HTMLElement).style.left)).toBe('80%');
});

test('pointer cancellation restores the gesture origin and discards a queued move', async ({ page }) => {
    const sticker = page.getByTestId('card-sticker');
    await sticker.locator('button[aria-pressed]').dispatchEvent('pointerdown', { button: 0, clientX: 0, clientY: 0 });
    await sticker.evaluate(async element => {
        const canvas = element.parentElement!;
        const tracker = canvas.firstElementChild!;
        const rect = canvas.getBoundingClientRect();
        const move = (x: number) => tracker.dispatchEvent(new PointerEvent('pointermove', {
            bubbles: true, clientX: rect.left + rect.width * x, clientY: rect.top + rect.height * 0.7,
        }));
        move(0.65);
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        await Promise.resolve();
        move(0.9);
        tracker.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true }));
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    });
    await expect.poll(() => sticker.evaluate(element => ({
        x: (element as HTMLElement).style.left, y: (element as HTMLElement).style.top,
    }))).toEqual({ x: '50%', y: '50%' });
});
