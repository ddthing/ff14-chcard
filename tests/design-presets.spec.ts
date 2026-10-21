import { expect, test } from '@playwright/test';
import type { PlayerInfo } from '../src/types';
import { DESIGN_PRESETS } from '../src/data/designPresets';
import { presetCopy } from '../src/utils/presetCopy';
import { readStoredValue, seed } from './helpers';

test('signature looks preserve the profile and media, undo atomically, and survive reload', async ({ page }) => {
    const stickerUrl = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="18" fill="purple"/></svg>').toString('base64');
    await seed(page, { stickers: [{ id: 'kept-sticker', url: stickerUrl, x: 40, y: 30, scale: 0.75, rotation: 15 }] });
    await expect.poll(async () => (await readStoredValue<PlayerInfo>(page, 'currentProfile'))?.pointColor).toBe('#7c3aed');
    const original = (await readStoredValue<PlayerInfo>(page, 'currentProfile'))!;
    const undo = page.getByRole('button', { name: '실행 취소', exact: true });
    const redo = page.getByRole('button', { name: '다시 실행', exact: true });
    await expect(undo).toBeDisabled();
    await page.locator('#profile-tab-design').click();
    const picker = page.getByTestId('design-presets');
    const card = page.locator('#card-preview');

    for (const preset of DESIGN_PRESETS) {
        const button = picker.locator(`[data-preset="${preset.id}"]`);
        await button.click();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
        await expect(card).toHaveAttribute('data-layout', preset.settings.layout);
        await expect(card).toHaveClass(new RegExp(preset.settings.font));
        await expect.poll(async () => (await readStoredValue<PlayerInfo>(page, 'currentProfile'))?.pointColor).toBe(preset.settings.pointColor);
        const current = (await readStoredValue<PlayerInfo>(page, 'currentProfile'))!;
        // This checks every original field, including image bytes, sticker state,
        // jobs, levels, language and profile content, against the permitted patch.
        const originalFields = Object.fromEntries(Object.entries(original).filter(([key]) => !key.startsWith('__')));
        expect(current).toMatchObject({ ...originalFields, ...preset.settings });
        await expect(card.locator('[data-sticker-id="kept-sticker"]')).toHaveCount(1);
        await expect(card.locator('.sheet-name')).toHaveText(original.name);

        // Reapplying the current look must not introduce an empty history step.
        await button.click();
        await undo.click();
        await expect(card).toHaveAttribute('data-layout', original.layout!);
        await expect(card).toHaveClass(new RegExp(original.font));
        await expect(page.getByRole('textbox', { name: '포인트 컬러 HEX', exact: true })).toHaveValue(original.pointColor.toUpperCase());
        await expect(undo).toBeDisabled();
        await expect(picker.locator('[aria-pressed="true"]')).toHaveCount(0);
        await redo.click();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
        await undo.click();
        await expect(undo).toBeDisabled();
        await expect(card).toHaveAttribute('data-layout', original.layout!);
    }

    await picker.locator('[data-preset="botanica"]').click();
    await expect.poll(async () => (await readStoredValue<PlayerInfo>(page, 'currentProfile'))?.pointColor).toBe('#537364');
    await page.reload();
    await page.locator('#profile-tab-design').click();
    await expect(picker.locator('[data-preset="botanica"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(card.locator('[data-sticker-id="kept-sticker"]')).toHaveCount(1);
});

test('a preset that only changes color stays separate from edits before and after it', async ({ page }) => {
    const botanica = DESIGN_PRESETS.find(preset => preset.id === 'botanica')!;
    await seed(page, botanica.settings);
    await page.locator('#profile-tab-design').click();
    const preset = page.getByTestId('design-presets').locator('[data-preset="botanica"]');
    const color = page.getByRole('textbox', { name: '포인트 컬러 HEX', exact: true });
    const undo = page.getByRole('button', { name: '실행 취소', exact: true });
    const redo = page.getByRole('button', { name: '다시 실행', exact: true });
    await expect(preset).toHaveAttribute('aria-pressed', 'true');
    // Keep every edit within the continuous-history window, even on slow CI.
    await page.clock.setFixedTime(new Date('2026-10-21T00:00:00Z'));
    await color.fill('#123456');
    await preset.click();
    await expect(color).toHaveValue('#537364');
    await color.fill('#654321');

    await undo.click();
    await expect(color).toHaveValue('#537364');
    await expect(preset).toHaveAttribute('aria-pressed', 'true');
    await undo.click();
    await expect(color).toHaveValue('#123456');
    await expect(preset).toHaveAttribute('aria-pressed', 'false');
    await redo.click();
    await expect(color).toHaveValue('#537364');
    await expect(preset).toHaveAttribute('aria-pressed', 'true');
    await redo.click();
    await expect(color).toHaveValue('#654321');
    await expect(redo).toBeDisabled();
});

test('keyboard activation and manual edits keep the selected look truthful', async ({ page }) => {
    await seed(page);
    await page.locator('#profile-tab-design').click();
    const picker = page.getByTestId('design-presets');
    for (const [id, key] of [['editorial', 'Enter'], ['nocturne', 'Space']] as const) {
        const button = picker.locator(`[data-preset="${id}"]`);
        await button.focus();
        await page.keyboard.press(key);
        await expect(button).toHaveAttribute('aria-pressed', 'true');
        await expect(picker.locator('[aria-pressed="true"]')).toHaveCount(1);
    }
    await page.getByRole('textbox', { name: '포인트 컬러 HEX', exact: true }).fill('#123456');
    await expect(picker.locator('[aria-pressed="true"]')).toHaveCount(0);
    await expect(page.getByText('직접 설정한 스타일', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '실행 취소', exact: true }).click();
    await expect(picker.locator('[data-preset="nocturne"]')).toHaveAttribute('aria-pressed', 'true');
});

test('all locales retain readable, accessible preset controls at narrow widths and in both themes', async ({ page }) => {
    await seed(page);
    const locales = [
        { lang: 'ko', switch: null },
        { lang: 'en', switch: 'EN 언어' },
        { lang: 'ja', switch: 'JA language' },
    ] as const;
    for (const locale of locales) {
        await page.setViewportSize({ width: 1440, height: 1000 });
        if (locale.switch) await page.getByRole('button', { name: locale.switch, exact: true }).click();
        await page.locator('#profile-tab-design').click();
        const picker = page.getByRole('group', { name: presetCopy[locale.lang].title, exact: true });
        await expect(picker).toBeVisible();
        for (const preset of DESIGN_PRESETS) {
            await expect(picker.getByRole('button', { name: presetCopy[locale.lang].looks[preset.id].name, exact: true })).toBeVisible();
        }
        for (const width of [320, 390]) {
            await page.setViewportSize({ width, height: 844 });
            await page.locator('#profile-tab-design').click();
            expect(await picker.evaluate(element => {
                const rect = element.getBoundingClientRect();
                return rect.left >= 0 && rect.right <= innerWidth && document.documentElement.scrollWidth <= innerWidth;
            })).toBe(true);
            expect(await picker.getByRole('button').evaluateAll(buttons => buttons.every(button => {
                const description = button.querySelector('[id]')!;
                const rect = button.getBoundingClientRect();
                return rect.width >= 44 && rect.height >= 44
                    && description.scrollWidth <= description.clientWidth
                    && getComputedStyle(button).transitionProperty === 'none';
            }))).toBe(true);
        }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole('button', { name: 'ダークモードに変更', exact: true }).click();
    await page.setViewportSize({ width: 320, height: 844 });
    await page.getByTestId('design-presets').locator('[data-preset="editorial"]').click();
    await expect(page.getByTestId('design-presets').locator('[data-preset="editorial"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#card-preview')).toHaveClass(/font-myungjo/);
});
