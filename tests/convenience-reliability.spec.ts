import { expect, test } from '@playwright/test';
import { seed } from './helpers';

test('long slot names never push visible load/delete actions outside their row on phones or tablets', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await seed(page);
    await page.locator('#profile-tab-slot').click();
    const name = 'LongCharacterProfileNameWithoutSpaces_ABCDEFGHIJKLMNOPQRSTUVWXYZ_1234567890_ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    await page.getByRole('textbox', { name: '슬롯 이름', exact: true }).fill(name);
    await page.getByRole('button', { name: '저장', exact: true }).click();
    const load = page.getByRole('button', { name: `${name} 불러오기`, exact: true });
    await expect(load).toBeEnabled();
    for (const viewport of [{ width: 320, height: 568 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }]) {
        await page.setViewportSize(viewport);
        await load.scrollIntoViewIfNeeded();
        await expect(load).toBeInViewport({ ratio: 1 });
        expect(await load.evaluate(button => getComputedStyle(button.parentElement!).opacity)).toBe('1');
        expect(await load.evaluate(button => {
            const row = button.parentElement!.parentElement!;
            return row.scrollWidth <= row.clientWidth + 1;
        })).toBe(true);
    }
    page.once('dialog', dialog => dialog.accept());
    await load.click();
    await expect(page.getByRole('status').filter({ hasText: /불러/ })).toBeVisible();
});

test('new public pages open at the top and cross-page checklist links reach their target', async ({ page }) => {
    await seed(page);
    await page.goto('/guide');
    await page.locator('main h1').waitFor();
    await page.locator('footer a[href="/about"]').click();
    await expect(page.locator('main h1')).toHaveText('소개');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.goto('/faq');
    await page.locator('a[href="/guide#checklist"]').click();
    await expect(page.locator('#checklist')).toBeInViewport();
});

test('small-screen PNG actions stay one line in every existing locale', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await seed(page, { language: 'ja' });
    await expect.poll(() => page.locator('.u010-main').evaluate(button => button.clientHeight)).toBeLessThanOrEqual(44);
    await expect(page.locator('.u010-quality-label')).toContainText('元の解像度');
});

test('library save keeps readable text in the mobile sheet across sizes and themes', async ({ page }) => {
    await seed(page);
    for (const dark of [false, true]) {
        if (dark) await page.getByRole('button', { name: '다크 모드로 변경', exact: true }).click();
        for (const viewport of [{ width: 320, height: 568 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }]) {
            await page.setViewportSize(viewport);
            await page.locator('#profile-tab-slot').click();
            const save = page.getByRole('button', { name: '저장', exact: true });
            await save.scrollIntoViewIfNeeded();
            const contrast = await save.evaluate(button => {
                const luminance = (color: string) => {
                    const [r, g, b] = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => {
                        const channel = value / 255;
                        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
                    });
                    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
                };
                const style = getComputedStyle(button);
                const fg = luminance(style.color);
                const bg = luminance(style.backgroundColor);
                return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
            });
            expect(contrast, `${viewport.width}px dark=${dark}`).toBeGreaterThanOrEqual(4.5);
        }
    }
});
