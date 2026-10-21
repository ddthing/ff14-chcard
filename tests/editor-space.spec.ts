import { expect, test } from '@playwright/test';
import { i18n } from '../src/utils/i18n';
import { seed } from './helpers';

test('desktop prioritizes the editing workspace at normal and short viewport heights', async ({ page }) => {
    await seed(page);
    for (const viewport of [{ width: 1920, height: 900 }, { width: 1366, height: 768 }, { width: 1024, height: 600 }]) {
        await page.setViewportSize(viewport);
        await expect(page.locator('.studio-brand')).toHaveText(i18n.ko.layout.headerTitle);
        await expect(page.locator('.studio-intro, .studio-brand-mark, .studio-document, .studio-privacy-note')).toHaveCount(0);
        const workspace = await page.locator('.studio-workspace').boundingBox();
        expect(workspace).toBeTruthy();
        expect(workspace!.y).toBeLessThanOrEqual(132);
        expect(workspace!.height).toBeGreaterThanOrEqual(viewport.height - 190);
        const heading = await page.locator('.studio-panel-heading').boundingBox();
        expect(heading!.height).toBeLessThanOrEqual(57);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
});

test('the original service title and one help control fit narrow mobile screens in all languages', async ({ page }) => {
    await seed(page);
    for (const [language, switchName] of [['ko', null], ['en', 'EN 언어'], ['ja', 'JA language']] as const) {
        if (switchName) await page.getByRole('button', { name: switchName, exact: true }).click();
        for (const width of [320, 390, 844]) {
            await page.setViewportSize({ width, height: width === 844 ? 390 : 844 });
            await expect(page.locator('.studio-brand')).toHaveText(i18n[language].layout.headerTitle);
            await expect(page.getByRole('button', { name: i18n[language].tour.start, exact: true })).toHaveCount(1);
            await expect(page.getByRole('button', { name: i18n[language].tour.start, exact: true })).toBeVisible();
            await expect(page.locator('.u010-main')).toBeVisible();
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            const header = await page.locator('.studio-header').boundingBox();
            expect(header!.height).toBeLessThanOrEqual(76);
        }
    }
});
