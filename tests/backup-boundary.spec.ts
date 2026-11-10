import { expect, test } from '@playwright/test';
import { seed } from './helpers';
import { i18n } from '../src/utils/i18n';

test('backup media cannot trigger an external request or replace the current profile', async ({ page }) => {
    await seed(page);
    let requests = 0;
    await page.route('https://backup-probe.invalid/**', route => {
        requests++;
        return route.abort();
    });
    await page.locator('#profile-tab-slot').click();
    const file = page.getByLabel(i18n.ko.form.importBackup, { exact: true });
    await expect(page.getByRole('button', { name: i18n.ko.form.importBackup, exact: true })).toBeEnabled();
    const url = 'https://backup-probe.invalid/photo.png';
    const payloads = [
        { currentProfile: { image: url, name: 'Unsafe' }, slots: [] },
        { currentProfile: { name: 'Unsafe' }, slots: [{ data: { stickers: [{ url }] } }] },
    ];
    page.on('dialog', dialog => dialog.accept());
    for (const payload of payloads) {
        await file.setInputFiles({
            name: 'fixture.json',
            mimeType: 'application/json',
            buffer: Buffer.from(JSON.stringify({ format: 'ff14-chcard-backup', version: 1, ...payload })),
        });
        await expect(page.getByRole('status').filter({ hasText: i18n.ko.form.backupImportError })).toBeVisible();
    }
    await page.locator('#profile-tab-basic').click();
    await expect(page.locator('input[name="character-name"]')).toHaveValue('세리안');
    expect(requests).toBe(0);
});
