import { expect, test } from '@playwright/test';
import { seed, readStoredValue, exportPng } from './helpers';
import { i18n } from '../src/utils/i18n';
import { normalizePlayerInfo } from '../src/utils/playerData';

const source = '<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="560"><rect width="1400" height="560" fill="#184a70"/><rect width="350" height="560" fill="#e63b48"/><rect x="1050" width="350" height="560" fill="#54b85f"/></svg>';
const sourceUrl = 'data:image/svg+xml;base64,' + Buffer.from(source).toString('base64');
const file = { name: 'retained-source.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(source) };
type PhotoProfile = { image?: string; originalImage?: string; imageCrop?: { x: number; y: number; width: number; height: number } };

async function uploadCrop(page: import('@playwright/test').Page) {
    await page.locator('#card-preview input[type=file]').setInputFiles(file);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.locator('input[type=range]').fill('2');
    await expect(dialog.locator('input[type=range]')).toHaveValue('2');
    await dialog.getByRole('button', { name: '적용하기', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect.poll(async () => (await readStoredValue<PhotoProfile>(page, 'currentProfile'))?.originalImage).toBe(sourceUrl);
}

test('re-cropping retains original bytes, restores the crop, and keeps undo, reload and the compact fallback consistent', async ({ page }) => {
    await seed(page);
    const before = await page.locator('#card-preview .sheet-image > img').getAttribute('src');
    await uploadCrop(page);
    const applied = (await readStoredValue<PhotoProfile>(page, 'currentProfile'))!;
    expect(applied.imageCrop!.width).toBeCloseTo(50, 0);
    expect(applied.imageCrop!.height).toBeCloseTo(50, 0);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ff14-playerInfo')!).originalImage)).toBeUndefined();
    await page.getByRole('button', { name: '실행 취소', exact: true }).click();
    await expect(page.locator('#card-preview .sheet-image > img')).toHaveAttribute('src', before!);
    await expect.poll(async () => (await readStoredValue<PhotoProfile>(page, 'currentProfile'))?.originalImage).toBeUndefined();
    await page.getByRole('button', { name: '다시 실행', exact: true }).click();
    await expect.poll(async () => (await readStoredValue<PhotoProfile>(page, 'currentProfile'))?.originalImage).toBe(sourceUrl);
    await page.reload();
    await page.locator('.studio-tab-content').getByRole('button', { name: i18n.ko.preview.clickToEdit, exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('img')).toHaveAttribute('src', sourceUrl);
    await expect.poll(() => dialog.locator('input[type=range]').inputValue()).toBe('2');
    await dialog.getByRole('button', { name: '취소', exact: true }).first().click();
    await expect(page.locator('#card-preview .sheet-image > img')).toHaveAttribute('src', applied.image!);
    await page.locator('.studio-tab-content').getByRole('button', { name: i18n.ko.preview.clickToEdit, exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: '적용하기', exact: true }).click();
    await expect(page.getByRole('button', { name: '실행 취소', exact: true })).toBeDisabled();
    const png = await exportPng(page);
    expect(png.width).toBe(700);
});

test('slot backup, import and layout changes keep the original available, and deleting the photo clears its source', async ({ page }) => {
    await seed(page);
    await uploadCrop(page);
    await page.locator('#profile-tab-slot').click();
    await page.getByRole('textbox', { name: '슬롯 이름', exact: true }).fill('Original keeper');
    await page.getByRole('button', { name: '저장', exact: true }).click();
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: '백업 내보내기', exact: true }).click();
    const download = await pending;
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
    const backup = Buffer.concat(chunks);
    const data = JSON.parse(backup.toString());
    expect(data.currentProfile.originalImage).toBe(sourceUrl);
    expect(data.slots[0].data.originalImage).toBe(sourceUrl);
    await page.locator('#profile-tab-basic').click();
    await page.locator('.studio-tab-content').getByRole('button', { name: '삭제', exact: true }).click();
    await expect.poll(async () => (await readStoredValue<PhotoProfile>(page, 'currentProfile'))?.image).toBeUndefined();
    expect(await readStoredValue<PhotoProfile>(page, 'currentProfile')).toMatchObject({ originalImage: undefined, imageCrop: undefined });
    await page.locator('#profile-tab-slot').click();
    page.once('dialog', dialog => dialog.accept());
    await page.getByLabel('백업 가져오기', { exact: true }).setInputFiles({ name: 'retained.json', mimeType: 'application/json', buffer: backup });
    await expect.poll(async () => (await readStoredValue<PhotoProfile>(page, 'currentProfile'))?.originalImage).toBe(sourceUrl);
    await page.locator('.studio-layout-switch').getByRole('button', { name: '세로형', exact: true }).click();
    await page.locator('#card-preview .sheet-image').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('img')).toHaveAttribute('src', sourceUrl);
    await dialog.getByRole('button', { name: '자동 채우기', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect.poll(() => page.locator('#card-preview .sheet-image > img').evaluate(image => (image as HTMLImageElement).naturalHeight)).toBe(560);
});

test('a compact fallback restores the matching original and crop with newer text edits after a failed write', async ({ page }) => {
    await seed(page);
    await uploadCrop(page);
    const applied = (await readStoredValue<PhotoProfile>(page, 'currentProfile'))!;
    await page.evaluate(() => {
        IDBObjectStore.prototype.put = function () { throw new DOMException('Write failed', 'QuotaExceededError'); };
        const native = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
            if (key === 'ff14-playerInfo') {
                const profile = JSON.parse(value);
                if (profile.image || profile.originalImage) throw new DOMException('Too large', 'QuotaExceededError');
            }
            native.call(this, key, value);
        };
    });
    await page.locator('input[name="character-name"]').fill('Keep newer text');
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ff14-playerInfo')!).__ff14ImageOmittedFromFallback)).toBe(true);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ff14-playerInfo')!).originalImage)).toBeUndefined();
    await page.reload();
    await expect(page.locator('input[name="character-name"]')).toHaveValue('Keep newer text');
    await expect.poll(async () => (await readStoredValue<PhotoProfile>(page, 'currentProfile'))?.originalImage).toBe(sourceUrl);
    expect(await readStoredValue<PhotoProfile>(page, 'currentProfile')).toMatchObject({ image: applied.image, originalImage: applied.originalImage, imageCrop: applied.imageCrop });
});

test('editing the current photo cancels an older upload from the other image control', async ({ page }) => {
    await seed(page);
    const image = page.locator('#card-preview .sheet-image > img');
    const before = await image.getAttribute('src');
    await page.evaluate(() => {
        const debug = window as typeof window & { releaseOldPhoto?: () => Promise<void>; heldPhoto: boolean };
        debug.heldPhoto = false;
        const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
        let holdNext = true;
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            configurable: true,
            get() { return descriptor.get!.call(this); },
            set(value: string) {
                if (holdNext && value.startsWith('data:image/svg+xml;base64,')) {
                    holdNext = false;
                    debug.heldPhoto = true;
                    const heldImage = this as HTMLImageElement;
                    debug.releaseOldPhoto = async () => {
                        await new Promise<void>(resolve => {
                            heldImage.addEventListener('load', () => resolve(), { once: true });
                            descriptor.set!.call(heldImage, value);
                        });
                        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
                    };
                    return;
                }
                descriptor.set!.call(this, value);
            },
        });
    });
    await page.locator('#card-preview input[type=file]').setInputFiles(file);
    await expect.poll(() => page.evaluate(() => (window as typeof window & { heldPhoto: boolean }).heldPhoto)).toBe(true);
    await page.locator('.studio-tab-content').getByRole('button', { name: i18n.ko.preview.clickToEdit, exact: true }).click();
    await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('src', before!);
    await page.evaluate(async () => (window as typeof window & { releaseOldPhoto: () => Promise<void> }).releaseOldPhoto());
    await expect(page.getByRole('dialog')).toHaveCount(1);
    await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('src', before!);
    await page.getByRole('dialog').getByRole('button', { name: '취소', exact: true }).first().click();
    await expect(image).toHaveAttribute('src', before!);
});

test('legacy profiles stay readable and malformed or orphaned crop metadata is discarded', () => {
    const old = normalizePlayerInfo({ image: sourceUrl, language: 'ko' });
    expect(old.image).toBe(sourceUrl);
    expect(old.originalImage).toBeUndefined();
    for (const imageCrop of [null, { x: -1, y: 0, width: 50, height: 50 }, { x: 90, y: 0, width: 50, height: 50 }, { x: 0, y: 0, width: Infinity, height: 50 }]) {
        expect(normalizePlayerInfo({ image: sourceUrl, originalImage: sourceUrl, imageCrop }).imageCrop).toBeUndefined();
    }
    expect(normalizePlayerInfo({ originalImage: sourceUrl, imageCrop: { x: 0, y: 0, width: 100, height: 100 } }).originalImage).toBeUndefined();
});
