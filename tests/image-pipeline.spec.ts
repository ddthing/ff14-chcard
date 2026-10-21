import { expect, test } from '@playwright/test';
import { exportPng, seed } from './helpers';

const cropFile = {
    name: 'pipeline.svg', mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="700" height="280"><rect width="700" height="280" fill="#b13042"/></svg>'),
};

for (const action of ['적용하기', '자동 채우기']) {
    test(`${action}: cancelling a pending crop never overwrites the existing photo`, async ({ page }) => {
        await seed(page);
        const photo = page.locator('#card-preview .sheet-image > img');
        const original = await photo.getAttribute('src');
        await page.locator('#card-preview input[type="file"]').setInputFiles(cropFile);
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await page.evaluate(() => {
            const debug = window as typeof window & { heldCropCount: number; releaseCropImage?: () => Promise<void> };
            debug.heldCropCount = 0;
            const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
            Object.defineProperty(HTMLImageElement.prototype, 'src', {
                configurable: true,
                get() { return descriptor.get!.call(this); },
                set(value: string) {
                    if (debug.heldCropCount === 0 && value.startsWith('data:image/svg+xml') && this.crossOrigin === 'anonymous') {
                        debug.heldCropCount++;
                        const image = this as HTMLImageElement;
                        debug.releaseCropImage = async () => {
                            await new Promise<void>(resolve => {
                                image.addEventListener('load', () => resolve(), { once: true });
                                descriptor.set!.call(image, value);
                            });
                            await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
                        };
                        return;
                    }
                    descriptor.set!.call(this, value);
                },
            });
        });
        await dialog.getByRole('button', { name: action, exact: true }).click();
        await expect.poll(() => page.evaluate(() => (window as typeof window & { heldCropCount: number }).heldCropCount)).toBe(1);
        await dialog.getByRole('button', { name: '취소', exact: true }).first().click();
        await expect(dialog).toHaveCount(0);
        await page.evaluate(async () => (window as typeof window & { releaseCropImage: () => Promise<void> }).releaseCropImage());
        await expect(photo).toHaveAttribute('src', original!);
        await expect(page.getByRole('button', { name: '실행 취소', exact: true })).toBeDisabled();
    });
}

test('PNG export releases its rendering canvas after the download is encoded', async ({ page }) => {
    await seed(page);
    await page.getByRole('button', { name: '출력 옵션', exact: true }).click();
    await page.getByRole('menuitemradio', { name: '표준 · 1×', exact: true }).click();
    await page.evaluate(() => {
        const debug = window as typeof window & { encodedCanvases: HTMLCanvasElement[] };
        debug.encodedCanvases = [];
        const native = HTMLCanvasElement.prototype.toBlob;
        HTMLCanvasElement.prototype.toBlob = function (callback, ...args) {
            debug.encodedCanvases.push(this);
            return native.call(this, callback, ...args);
        };
    });
    const png = await exportPng(page);
    expect(png.width).toBe(700);
    const canvases = await page.evaluate(() => (window as typeof window & { encodedCanvases: HTMLCanvasElement[] }).encodedCanvases.map(canvas => [canvas.width, canvas.height]));
    expect(canvases.length).toBeGreaterThan(0);
    expect(canvases.every(([width, height]) => width === 0 && height === 0)).toBe(true);
});

test('Escape cancels a crop during PNG encoding and releases its canvas', async ({ page }) => {
    await seed(page);
    const photo = page.locator('#card-preview .sheet-image > img');
    const original = await photo.getAttribute('src');
    await page.locator('#card-preview input[type="file"]').setInputFiles(cropFile);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.evaluate(() => {
        const debug = window as typeof window & { cropCanvas?: HTMLCanvasElement; finishEncoding?: () => void };
        const native = HTMLCanvasElement.prototype.toBlob;
        HTMLCanvasElement.prototype.toBlob = function (callback, ...args) {
            debug.cropCanvas = this;
            return native.call(this, blob => { debug.finishEncoding = () => callback(blob); }, ...args);
        };
    });
    await dialog.getByRole('button', { name: '적용하기', exact: true }).click();
    await expect.poll(() => page.evaluate(() => !!(window as typeof window & { finishEncoding?: () => void }).finishEncoding)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => {
        const canvas = (window as typeof window & { cropCanvas: HTMLCanvasElement }).cropCanvas;
        return [canvas.width, canvas.height];
    })).toEqual([0, 0]);
    await page.evaluate(() => (window as typeof window & { finishEncoding: () => void }).finishEncoding());
    await expect(photo).toHaveAttribute('src', original!);
});

test('automatic filling decodes once, encodes asynchronously, and can retry a failed encoder', async ({ page }) => {
    await seed(page);
    await page.locator('#card-preview input[type="file"]').setInputFiles(cropFile);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.evaluate(() => {
        const debug = window as typeof window & { cropDecodes: number; encodedCanvases: HTMLCanvasElement[] };
        debug.cropDecodes = 0;
        debug.encodedCanvases = [];
        const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            configurable: true,
            get() { return descriptor.get!.call(this); },
            set(value: string) {
                if (value.startsWith('data:image/svg+xml') && this.crossOrigin === 'anonymous') debug.cropDecodes++;
                descriptor.set!.call(this, value);
            },
        });
        const native = HTMLCanvasElement.prototype.toBlob;
        let failNext = true;
        HTMLCanvasElement.prototype.toBlob = function (callback, ...args) {
            debug.encodedCanvases.push(this);
            if (failNext) { failNext = false; queueMicrotask(() => callback(null)); return; }
            return native.call(this, callback, ...args);
        };
        HTMLCanvasElement.prototype.toDataURL = () => { throw new Error('Synchronous PNG encoding used'); };
    });
    await dialog.getByRole('button', { name: '자동 채우기', exact: true }).click();
    await expect(dialog.getByRole('alert')).toBeVisible();
    await expect(dialog.getByRole('button', { name: '자동 채우기', exact: true })).toBeEnabled();
    await dialog.getByRole('button', { name: '자동 채우기', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect.poll(() => page.locator('#card-preview .sheet-image > img').evaluate(image => [(image as HTMLImageElement).naturalWidth, (image as HTMLImageElement).naturalHeight])).toEqual([700, 280]);
    const metrics = await page.evaluate(() => {
        const debug = window as typeof window & { cropDecodes: number; encodedCanvases: HTMLCanvasElement[] };
        return { decodes: debug.cropDecodes, sizes: debug.encodedCanvases.map(canvas => [canvas.width, canvas.height]) };
    });
    expect(metrics).toEqual({ decodes: 2, sizes: [[0, 0], [0, 0]] });
});

test('PNG export releases a failed canvas and succeeds on retry', async ({ page }) => {
    await seed(page);
    await page.getByRole('button', { name: '출력 옵션', exact: true }).click();
    await page.getByRole('menuitemradio', { name: '표준 · 1×', exact: true }).click();
    await page.evaluate(() => {
        const debug = window as typeof window & { encodedCanvases: HTMLCanvasElement[] };
        debug.encodedCanvases = [];
        const native = HTMLCanvasElement.prototype.toBlob;
        let failNext = true;
        HTMLCanvasElement.prototype.toBlob = function (callback, ...args) {
            debug.encodedCanvases.push(this);
            if (failNext) { failNext = false; queueMicrotask(() => callback(null)); return; }
            return native.call(this, callback, ...args);
        };
    });
    const save = page.getByRole('button', { name: / PNG 저장$/ });
    await save.click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(save).toBeEnabled();
    const png = await exportPng(page);
    expect(png.width).toBe(700);
    expect(await page.evaluate(() => (window as typeof window & { encodedCanvases: HTMLCanvasElement[] }).encodedCanvases.every(canvas => canvas.width === 0 && canvas.height === 0))).toBe(true);
});
