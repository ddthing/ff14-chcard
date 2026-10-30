import { expect, test } from '@playwright/test';
import { seed } from './helpers';

test('short viewports provide usable editing and preview modes without changing profile data', async ({ page }) => {
    await page.setViewportSize({ width: 568, height: 320 });
    await seed(page, { jobs: [], name: 'Keep this name' });
    const sheet = page.locator('.studio-mobile-sheet');
    for (const size of [{ width: 568, height: 320 }, { width: 844, height: 390 }, { width: 320, height: 568 }]) {
        await page.setViewportSize(size);
        await expect(sheet).toHaveAttribute('data-compact', 'true');
        if (await sheet.getAttribute('data-detent') === 'collapsed') await sheet.locator('.u336-gr').click();
        await expect.poll(() => page.locator('.studio-tab-content').evaluate(el => el.clientHeight)).toBeGreaterThanOrEqual(100);
        await sheet.locator('.u336-gr').click();
        await expect(sheet).toHaveAttribute('data-detent', 'collapsed');
        await expect.poll(() => page.locator('.studio-canvas').evaluate(el => el.clientHeight)).toBeGreaterThanOrEqual(100);
        await expect(page.locator('#preview-panel')).not.toHaveAttribute('aria-hidden', 'true');
        await sheet.locator('.u336-gr').click();
        await expect(page.locator('input[name="character-name"]')).toHaveValue('Keep this name');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(sheet).not.toHaveAttribute('data-compact', 'true');
    await expect(page.locator('#preview-panel')).not.toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('input[name="character-name"]')).toHaveValue('Keep this name');
});

test('landscape crop keeps at least 120px for the image and both actions inside the viewport', async ({ page }) => {
    await seed(page);
    await page.locator('#card-preview input[type=file]').setInputFiles({ name: 'crop.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="560"><rect width="1400" height="560" fill="#52647c"/></svg>') });
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    for (const size of [{ width: 568, height: 320 }, { width: 844, height: 390 }, { width: 320, height: 568 }]) {
        await page.setViewportSize(size);
        await expect.poll(() => dialog.locator('.reactEasyCrop_Container').evaluate(el => el.clientHeight)).toBeGreaterThanOrEqual(120);
        for (const name of ['적용하기', '자동 채우기']) {
            const button = dialog.getByRole('button', { name, exact: true });
            await expect(button).toBeInViewport({ ratio: 1 });
            await expect(button).toBeEnabled();
        }
    }
    await dialog.getByRole('button', { name: '자동 채우기', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect.poll(() => page.locator('#card-preview .sheet-image > img').evaluate(el => (el as HTMLImageElement).naturalWidth)).toBe(1400);
});

test('font menu remains bounded and its last option reachable after rotating an open menu', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await seed(page);
    await page.locator('#profile-tab-design').click();
    await page.locator('button[aria-label="폰트"][aria-haspopup="listbox"]').click();
    const menu = page.getByRole('listbox', { name: '폰트', exact: true });
    await expect(menu).toBeVisible();
    for (const size of [{ width: 320, height: 568 }, { width: 568, height: 320 }, { width: 960, height: 768 }]) {
        await page.setViewportSize(size);
        await expect.poll(async () => {
            const box = await menu.boundingBox();
            return !!box && box.x >= 7 && box.y >= 7 && box.x + box.width <= size.width - 7 && box.y + box.height <= size.height - 7;
        }).toBe(true);
        await menu.press('End');
        const last = menu.getByRole('option').last();
        await expect(last).toBeInViewport({ ratio: 1 });
    }
    await menu.press('Escape');
    await expect(menu).toBeHidden();
});
