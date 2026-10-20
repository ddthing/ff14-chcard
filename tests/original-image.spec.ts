import { expect, test } from '@playwright/test';
import { seed } from './helpers';

test.beforeEach(async ({ page }) => {
    await page.route('https://cdn.jsdelivr.net/**', route => route.abort());
});

test('keeps original file bytes and dimensions above 3000 px in the cropper', async ({ page }) => {
    await seed(page);
    const original = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 3201;
        canvas.height = 16;
        const context = canvas.getContext('2d')!;
        context.fillStyle = '#d43535';
        context.fillRect(0, 0, 1600, 16);
        context.fillStyle = '#286bd6';
        context.fillRect(1600, 0, 1601, 16);
        return { dataUrl: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height };
    });
    const sourceBytes = Buffer.from(original.dataUrl.split(',')[1], 'base64');
    const input = page.locator('input[type="file"][aria-label="이미지 업로드"]');
    await input.setInputFiles({ name: 'original-resolution.png', mimeType: 'image/png', buffer: sourceBytes });

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const cropperImage = dialog.locator('img').first();
    await expect.poll(() => cropperImage.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(original.width);
    await expect.poll(() => cropperImage.evaluate(image => (image as HTMLImageElement).naturalHeight)).toBe(original.height);
    expect(await cropperImage.getAttribute('src') === original.dataUrl).toBe(true);
});

test('crops exact source pixels to lossless PNG with rotation and flips', async ({ page }) => {
    await page.goto('/');
    const results = await page.evaluate(async () => {
        const sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = 2;
        sourceCanvas.height = 2;
        const sourceContext = sourceCanvas.getContext('2d')!;
        const sourcePixels = sourceContext.createImageData(2, 2);
        sourcePixels.data.set([
            255, 0, 0, 255, 0, 255, 0, 255,
            0, 0, 255, 255, 255, 255, 0, 255,
        ]);
        sourceContext.putImageData(sourcePixels, 0, 0);
        const source = sourceCanvas.toDataURL('image/png');

        const modulePath = '/src/utils/cropImage.ts';
        const { default: getCroppedImg } = await import(modulePath);
        async function inspect(dataUrl: string) {
            const response = await fetch(dataUrl);
            const bitmap = await createImageBitmap(await response.blob());
            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const context = canvas.getContext('2d')!;
            context.drawImage(bitmap, 0, 0);
            const pixels = Array.from(context.getImageData(0, 0, bitmap.width, bitmap.height).data);
            return { type: dataUrl.slice(0, dataUrl.indexOf(';')), width: bitmap.width, height: bitmap.height, pixels };
        }

        const rightColumn = await getCroppedImg(source, { x: 1, y: 0, width: 1, height: 2 });
        const rotatedAndFlipped = await getCroppedImg(
            source,
            { x: 0, y: 0, width: 2, height: 2 },
            90,
            { horizontal: true, vertical: false }
        );
        if (!rightColumn || !rotatedAndFlipped) throw new Error('Crop returned no image.');
        return { rightColumn: await inspect(rightColumn), rotatedAndFlipped: await inspect(rotatedAndFlipped) };
    });

    expect(results.rightColumn).toEqual({
        type: 'data:image/png',
        width: 1,
        height: 2,
        pixels: [0, 255, 0, 255, 255, 255, 0, 255],
    });
    expect(results.rotatedAndFlipped).toEqual({
        type: 'data:image/png',
        width: 2,
        height: 2,
        pixels: [255, 255, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 0, 0, 255],
    });
});
