import { expect, test } from '@playwright/test';
import { exportPng, pixels, seed, chooseQuality } from './helpers';

test.beforeEach(async ({ page }) => {
    await page.route('https://cdn.jsdelivr.net/**', route => route.abort());
});

test('original quality exports the full photo pixel resolution above the legacy cap', async ({ page }) => {
    const source = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 4_000;
        canvas.height = 1_600;
        const context = canvas.getContext('2d')!;
        context.fillStyle = '#e02727';
        context.fillRect(0, 0, 2_000, canvas.height);
        context.fillStyle = '#245fdd';
        context.fillRect(2_000, 0, 2_000, canvas.height);
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                context.fillStyle = (x + y) % 2 === 0 ? '#ffffff' : '#000000';
                context.fillRect(1_200 + x, 800 + y, 1, 1);
            }
        }
        return canvas.toDataURL('image/png');
    });

    const sticker = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#ff00ff"/></svg>').toString('base64');
    await seed(page, {
        image: source,
        name: 'Original export',
        stickers: [{ id: 'photo-overlay', url: sticker, x: 50, y: 10, scale: 1, rotation: 0 }],
    });
    await chooseQuality(page, 'original');
    const photo = page.locator('#card-preview .sheet-image > img');
    await expect.poll(() => photo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(4_000);

    const expected = (await page.getByLabel('PNG 출력 크기', { exact: true }).innerText()).match(/\d+/g)!.map(Number);
    expect(expected[0]).toBe(4_000);
    expect(expected[0] * expected[1]).toBeGreaterThan(12_000_000);

    const output = await exportPng(page);
    expect([output.width, output.height]).toEqual(expected);
    const [left, right, checker] = await pixels(page, output.png, [
        { x: 100, y: 800, width: 1, height: 1 },
        { x: 3_900, y: 800, width: 1, height: 1 },
        { x: 1_200, y: 800, width: 8, height: 8 },
    ]);
    expect(left).toEqual([224, 39, 39, 255]);
    expect(right).toEqual([36, 95, 221, 255]);
    expect(checker).toEqual(Array.from({ length: 8 }, (_, y) => Array.from({ length: 8 }, (_, x) => {
        const color = (x + y) % 2 === 0 ? 255 : 0;
        return [color, color, color, 255];
    })).flat(2));
    const stickerCenter = await page.locator('#card-preview').evaluate(card => {
        const sticker = card.querySelector<HTMLElement>('[data-testid="card-sticker"][data-sticker-id="photo-overlay"]')!;
        const cardRect = card.getBoundingClientRect();
        const stickerRect = sticker.getBoundingClientRect();
        const scaleX = (card as HTMLElement).offsetWidth / cardRect.width;
        const scaleY = (card as HTMLElement).offsetHeight / cardRect.height;
        const photo = card.querySelector<HTMLImageElement>('.sheet-image > img')!;
        const ratio = Math.min(photo.naturalWidth / photo.clientWidth, photo.naturalHeight / photo.clientHeight);
        return {
            x: Math.floor(((stickerRect.left + stickerRect.width / 2 - cardRect.left) * scaleX) * ratio),
            y: Math.floor(((stickerRect.top + stickerRect.height / 2 - cardRect.top) * scaleY) * ratio),
        };
    });
    const [photoSticker] = await pixels(page, output.png, [{ ...stickerCenter, width: 1, height: 1 }]);
    expect(photoSticker).toEqual([255, 0, 255, 255]);

    await page.getByRole('tab', { name: '기본', exact: true }).click();
    await page.getByRole('tabpanel', { name: '기본', exact: true }).getByRole('button', { name: '세로형', exact: true }).click();
    await expect(page.locator('#card-preview')).toHaveAttribute('data-layout', 'left-portrait');
    await expect.poll(async () => {
        const expectedForPortrait = await page.locator('#card-preview').evaluate(card => {
            const photo = card.querySelector<HTMLImageElement>('.sheet-image > img')!;
            const ratio = Math.max(1, Math.min(photo.naturalWidth / photo.clientWidth, photo.naturalHeight / photo.clientHeight));
            return [Math.floor((card as HTMLElement).offsetWidth * ratio), Math.floor((card as HTMLElement).offsetHeight * ratio)];
        });
        return (await page.getByLabel('PNG 출력 크기', { exact: true }).innerText()).match(/\d+/g)!.map(Number)
            .every((dimension, index) => dimension === expectedForPortrait[index]);
    }).toBe(true);
});
