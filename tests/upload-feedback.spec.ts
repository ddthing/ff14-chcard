import { expect, test } from '@playwright/test';
import { seed } from './helpers';

test.beforeEach(async ({ page }) => {
    await page.route('https://cdn.jsdelivr.net/**', route => route.abort());
});

test('reports real FileReader progress locally and retries the same file', async ({ page }) => {
    await seed(page);
    await page.evaluate(() => {
        const debug = window as typeof window & {
            __imageReadStarts?: Array<{ name: string; size: number }>;
            __imageReadProgress?: Array<{ loaded: number; total: number }>;
            __uploadProgressValues?: number[];
            __uploadProgressLabels?: string[];
        };
        debug.__imageReadStarts = [];
        debug.__imageReadProgress = [];
        debug.__uploadProgressValues = [];
        debug.__uploadProgressLabels = [];

        const originalReadAsDataUrl = FileReader.prototype.readAsDataURL;
        FileReader.prototype.readAsDataURL = function (file: Blob) {
            const source = file as File;
            debug.__imageReadStarts?.push({ name: source.name, size: source.size });
            this.addEventListener('progress', event => {
                const progress = event as ProgressEvent<FileReader>;
                debug.__imageReadProgress?.push({ loaded: progress.loaded, total: progress.total });
            });
            return originalReadAsDataUrl.call(this, file);
        };

        new MutationObserver(() => {
            const bar = document.querySelector('[data-tour="image-upload"] .u032-bar[role="progressbar"]');
            const value = bar?.getAttribute('aria-valuenow');
            if (value !== null && value !== undefined) debug.__uploadProgressValues?.push(Number(value));
            const status = document.querySelector('[data-tour="image-upload"] .u032-meta small');
            if (status?.textContent?.startsWith('파일 읽는 중')) debug.__uploadProgressLabels?.push(status.textContent);
        }).observe(document.documentElement, {
            subtree: true,
            childList: true,
            attributes: true,
            characterData: true,
            attributeFilter: ['aria-valuenow', 'role'],
        });
    });
    const fileSize = 12 * 1024 * 1024;
    const input = page.locator('[data-tour="image-upload"] input[type="file"]');
    await input.setInputFiles({ name: 'unreadable.png', mimeType: 'image/png', buffer: Buffer.alloc(fileSize, 0xff) });

    const row = page.locator('[data-tour="image-upload"] .u032-row');
    await expect(row.getByRole('alert')).toHaveText('이미지를 읽지 못했습니다. 다른 파일을 선택해주세요.');
    const trace = await page.evaluate(() => {
        const debug = window as typeof window & {
            __imageReadStarts?: Array<{ name: string; size: number }>;
            __imageReadProgress?: Array<{ loaded: number; total: number }>;
            __uploadProgressValues?: number[];
            __uploadProgressLabels?: string[];
        };
        return {
            starts: debug.__imageReadStarts,
            progress: debug.__imageReadProgress,
            uiProgress: debug.__uploadProgressValues,
            uiLabels: debug.__uploadProgressLabels,
        };
    });
    expect(trace.starts).toEqual([{ name: 'unreadable.png', size: fileSize }]);
    expect(trace.progress?.some(({ loaded, total }) => loaded > 0 && total === fileSize)).toBe(true);
    expect(trace.uiLabels?.some(label => label.includes('12.0 MB / 12.0 MB · 100%'))).toBe(true);

    await row.locator('.u032-retry').click();
    await expect(row.getByRole('alert')).toHaveText('이미지를 읽지 못했습니다. 다른 파일을 선택해주세요.');
    const retriedFiles = await page.evaluate(() => (window as typeof window & {
        __imageReadStarts?: Array<{ name: string; size: number }>;
    }).__imageReadStarts);
    expect(retriedFiles).toEqual([
        { name: 'unreadable.png', size: fileSize },
        { name: 'unreadable.png', size: fileSize },
    ]);
    await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('a newer file supersedes pending decode, and cancel prevents a stale crop', async ({ page }) => {
    await page.addInitScript(() => {
        const debug = window as typeof window & { __heldImageSources?: string[] };
        debug.__heldImageSources = [];
        const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        if (!descriptor?.get || !descriptor.set) return;
        let holdsRemaining = 2;
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            configurable: true,
            get() { return descriptor.get!.call(this); },
            set(value: string) {
                if (holdsRemaining > 0 && value.startsWith('data:image/svg+xml;base64,')) {
                    holdsRemaining--;
                    debug.__heldImageSources?.push(value);
                    return;
                }
                descriptor.set!.call(this, value);
            },
        });
    });

    await seed(page);
    const input = page.locator('[data-tour="image-upload"] input[type="file"]');
    const svgFile = (name: string, color: string) => ({
        name,
        mimeType: 'image/svg+xml',
        buffer: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="280"><rect width="700" height="280" fill="${color}"/></svg>`),
    });
    const checking = page.locator('[data-tour="image-upload"] .u032-meta small');

    await input.setInputFiles(svgFile('old.svg', '#ab342b'));
    await expect(checking).toHaveText('이미지 확인 중');
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __heldImageSources?: string[] }).__heldImageSources?.length)).toBe(1);

    await input.setInputFiles(svgFile('superseded.svg', '#355c42'));
    await expect(checking).toHaveText('이미지 확인 중');
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __heldImageSources?: string[] }).__heldImageSources?.length)).toBe(2);
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await page.locator('[data-tour="image-upload"] .u032-cancel').click();
    await expect(page.locator('[data-tour="image-upload"] .u032-row')).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);

    const latest = svgFile('latest.svg', '#206b99');
    const latestDataUrl = `data:image/svg+xml;base64,${latest.buffer.toString('base64')}`;
    await input.setInputFiles(latest);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('img').first()).toHaveAttribute('src', latestDataUrl);
    expect(await page.evaluate(() => (window as typeof window & { __heldImageSources?: string[] }).__heldImageSources?.length)).toBe(2);
});
