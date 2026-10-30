import { expect, test } from '@playwright/test';
import { seed } from './helpers';
import { LANGUAGES } from '../src/utils/languages';

test('header controls share height, icon size and alignment in every language without reducing editing space', async ({ page }) => {
    await seed(page);
    for (const { id } of LANGUAGES) {
        await page.setViewportSize({ width: 1366, height: 768 });
        await page.locator('header select').selectOption(id);
        const metrics = await page.locator('.studio-header-inner').evaluate(header => {
            const select = header.querySelector('select')!;
            const help = header.querySelector('.studio-tour-trigger')!;
            const theme = header.querySelector('button[aria-pressed]')!;
            return [select, help, theme].map(control => {
                const rect = control.getBoundingClientRect();
                const icon = control === select ? select.parentElement!.querySelector('svg') : control.querySelector('svg');
                return { height: rect.height, width: rect.width, center: rect.y + rect.height / 2, icon: icon?.getBoundingClientRect().height };
            });
        });
        expect(metrics.map(control => control.height)).toEqual([44, 44, 44]);
        expect(metrics.map(control => control.icon)).toEqual([16, 16, 16]);
        expect(metrics.every(control => control.width >= 44)).toBe(true);
        expect(Math.max(...metrics.map(control => control.center)) - Math.min(...metrics.map(control => control.center))).toBeLessThanOrEqual(0.5);
        expect((await page.locator('.studio-header').boundingBox())!.height).toBeLessThanOrEqual(57);
        for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
            await page.setViewportSize(viewport);
            const help = page.locator('.studio-mobile-sheet-tour');
            const bounds = await help.boundingBox();
            expect(bounds!.width).toBeGreaterThanOrEqual(44);
            expect(bounds!.height).toBeGreaterThanOrEqual(44);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        }
    }
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/guide');
    await expect(page.locator('main h1')).toBeVisible();
    const guide = await page.locator('.studio-guide').boundingBox();
    const language = await page.locator('header select').boundingBox();
    expect(guide!.height).toBe(language!.height);
});
