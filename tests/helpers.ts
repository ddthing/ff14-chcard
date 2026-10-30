import { expect, type Page } from '@playwright/test';
import { JOBS, getJobMaxLevel } from '../src/data/jobs';
import { i18n } from '../src/utils/i18n';
import type { Language } from '../src/types';
export const profile = {
    name: '세리안', region: 'KR', server: '초코보', dataCenter: '한국', mainJob: 'BST',
    jobs: JOBS.map(job => job.id), jobLevels: Object.fromEntries(JOBS.map(job => [job.id, getJobMaxLevel(job.id)])),
    playstyles: ['스샷/룩덕', '라이트/즐겜', '하우징'], activeTime: '평일 저녁 / 주말 상시',
    comment: '느긋하게, 오래도록 함께할 모험을 좋아해요.\n에오르제아 어딘가에서 만나요.',
    pointColor: '#7c3aed', language: 'ko', font: 'font-pretendard', isSprout: true, cornerWash: true, jobWatermark: true,
};
export async function seed(page: Page, extra: Record<string, unknown> = {}) {
    await page.route('https://cdn.jsdelivr.net/**', route => route.abort());
    await page.addInitScript(data => {
        if (localStorage.getItem('ff14-playerInfo')) return;
        const canvas = document.createElement('canvas'); canvas.width = 700; canvas.height = 280;
        const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#1c4638'; ctx.fillRect(0, 0, 700, 280);
        localStorage.setItem('ff14-playerInfo', JSON.stringify({ image: canvas.toDataURL(), ...data }));
    }, { ...profile, ...extra });
    await page.goto('/');
    await expect(page.locator('#card-preview')).toBeVisible();
}
export async function readStoredValue<T>(page: Page, key: string): Promise<T | undefined> {
    return page.evaluate(async storageKey => {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open('ff14-chcard-storage');
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        try {
            return await new Promise<T | undefined>((resolve, reject) => {
                const request = db.transaction('values', 'readonly').objectStore('values').get(storageKey);
                request.onsuccess = () => resolve(request.result as T | undefined);
                request.onerror = () => reject(request.error);
            });
        } finally {
            db.close();
        }
    }, key);
}
export async function writeStoredValue<T>(page: Page, key: string, value: T): Promise<void> {
    await page.evaluate(async ({ storageKey, storedValue }) => {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open('ff14-chcard-storage');
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        try {
            await new Promise<void>((resolve, reject) => {
                const transaction = db.transaction('values', 'readwrite');
                transaction.objectStore('values').put(storedValue, storageKey);
                transaction.oncomplete = () => resolve();
                transaction.onabort = () => reject(transaction.error);
                transaction.onerror = () => reject(transaction.error);
            });
        } finally {
            db.close();
        }
    }, { storageKey: key, storedValue: value });
}
export async function nativeSize(page: Page) {
    return page.locator('#card-preview').evaluate(card => ({ width: (card as HTMLElement).offsetWidth, height: (card as HTMLElement).offsetHeight }));
}
export async function chooseQuality(page: Page, quality: 'original' | 'standard' | 'high' | 'ultra', language: Language = 'ko') {
    const trigger = page.getByRole('button', { name: i18n[language].exportMenu.options, exact: true });
    await trigger.click();
    const option = page.getByRole('menuitemradio', { name: i18n[language].studio[quality], exact: true });
    await option.click();
    await trigger.click();
    const selected = page.getByRole('menuitemradio', { name: i18n[language].studio[quality], exact: true });
    await expect(selected).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('Escape');
}
export async function exportPng(page: Page) {
    const pending = page.waitForEvent('download');
    const save = page.locator('.u010-main');
    await save.click();
    const download = await pending;
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
    const png = Buffer.concat(chunks);
    await expect(save).toBeEnabled();
    return { png, filename: download.suggestedFilename(), width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}
export async function pixels(page: Page, png: Buffer, points: { x: number; y: number; width: number; height: number }[]) {
    return page.evaluate(async ({ encoded, points }) => {
        const bitmap = await createImageBitmap(new Blob([Uint8Array.from(atob(encoded), c => c.charCodeAt(0))], { type: 'image/png' }));
        const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d')!; ctx.drawImage(bitmap, 0, 0);
        return points.map(({ x, y, width, height }) => Array.from(ctx.getImageData(Math.round(x), Math.round(y), width, height).data));
    }, { encoded: png.toString('base64'), points });
}
export const changed = (before: number[], after: number[]) => before.reduce((count, value, index) => count + (index % 4 !== 3 && value !== after[index] ? 1 : 0), 0);
