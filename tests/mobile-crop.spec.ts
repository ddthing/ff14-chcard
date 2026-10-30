import { expect, test } from '@playwright/test';
import { i18n } from '../src/utils/i18n';
import { seed } from './helpers';

for (const language of ['ko', 'en', 'ja', 'fr', 'de', 'zh-Hans', 'zh-Hant'] as const) {
    test(`${language}: crop controls remain reachable after portrait and landscape rotation`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await seed(page, { language });
        const image = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="700" height="280"><rect width="700" height="280" fill="#537364"/></svg>');
        await page.locator('#card-preview input[type="file"]').setInputFiles({ name: 'mobile-crop.svg', mimeType: 'image/svg+xml', buffer: image });
        const dialog = page.getByRole('dialog');
        const apply = dialog.getByRole('button', { name: i18n[language].preview.apply, exact: true });
        await expect(dialog).toBeVisible();
        for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 320, height: 568 }]) {
            await page.setViewportSize(viewport);
            await expect.poll(async () => {
                const bounds = await dialog.locator('.image-cropper-dialog').boundingBox();
                const action = await apply.boundingBox();
                const crop = await dialog.locator('.reactEasyCrop_Container').boundingBox();
                return Boolean(bounds && action && crop && bounds.y >= 12
                    && bounds.y + bounds.height <= viewport.height - 12
                    && bounds.x >= 12 && bounds.x + bounds.width <= viewport.width - 12
                    && action.y >= 12 && action.y + action.height <= viewport.height - 12
                    && crop.height >= 80);
            }).toBe(true);
            await expect(apply).toBeEnabled();
        }
        await apply.click();
        await expect(dialog).toHaveCount(0);
        await expect(page.locator('#card-preview .sheet-image > img')).toBeVisible();
    });
}
