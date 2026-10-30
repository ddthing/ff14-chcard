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
