import { test, expect } from '@playwright/test';
import { seed, nativeSize, exportPng, chooseQuality } from './helpers';
test.beforeEach(async ({ page }) => { await page.route('https://cdn.jsdelivr.net/**', route => route.abort()); });

test('history groups typing and palette selection, handles shortcuts and clears redo branches', async ({ page }) => {
    await page.goto('/');
    const undo = page.getByRole('button', { name: '실행 취소', exact: true });
    const redo = page.getByRole('button', { name: '다시 실행', exact: true });
    await expect(undo).toBeDisabled();
    await page.getByRole('textbox', { name: '닉네임', exact: true }).pressSequentially('Seriane');
    await page.getByRole('tab', { name: '꾸미기', exact: true }).click();
    const initialColor = await page.getByRole('textbox', { name: '포인트 컬러 HEX', exact: true }).inputValue();
    const firstColor = page.locator('.color-palette__swatch').first();
    const firstHex = (await page.locator('.color-palette__slot').first().locator('.color-palette__hex').innerText()).toUpperCase();
    await firstColor.click();
    await expect(page.getByRole('textbox', { name: '포인트 컬러 HEX', exact: true })).toHaveValue(firstHex);
    await undo.click();
    await expect(page.getByRole('textbox', { name: '포인트 컬러 HEX', exact: true })).toHaveValue(initialColor);
    await expect(page.locator('.sheet-name')).toHaveText('Seriane');
    await page.locator('#preview-panel').focus(); await page.keyboard.press('Control+Shift+z');
    await expect(page.getByRole('textbox', { name: '포인트 컬러 HEX', exact: true })).toHaveValue(firstHex);
    await page.keyboard.press('Control+z');
    await page.locator('.color-palette__swatch').nth(1).click();
    await expect(redo).toBeDisabled();
    await undo.click(); await undo.click();
    await expect(page.locator('.sheet-name')).toHaveCount(0);
    await expect(undo).toBeDisabled();
    await redo.click(); await expect(page.locator('.sheet-name')).toHaveText('Seriane');
});

test('native text undo and keyboard font navigation remain independent', async ({ page }) => {
    await page.goto('/');
    const name = page.getByRole('textbox', { name: '닉네임', exact: true });
    await name.pressSequentially('Seriane'); await name.press('Control+z');
    await expect(name).toHaveValue('');
    await expect(page.getByRole('button', { name: '다시 실행', exact: true })).toBeDisabled();
    await name.press('Control+Shift+z'); await expect(name).toHaveValue('Seriane');
    await page.getByRole('tab', { name: '꾸미기', exact: true }).click();
    const font = page.getByRole('button', { name: '폰트', exact: true }).and(page.locator('[aria-haspopup="listbox"]'));
    await font.focus(); await page.keyboard.press('ArrowDown');
    const fonts = page.getByRole('listbox', { name: '폰트', exact: true });
    await expect(fonts).toBeFocused();
    await page.keyboard.press('End');
    const lastActiveOption = await fonts.getAttribute('aria-activedescendant');
    expect(lastActiveOption).toBeTruthy();
    await expect(page.locator(`[id="${lastActiveOption}"]`)).toHaveRole('option');
    await expect(page.locator(`[id="${lastActiveOption}"]`)).toContainText('구름 산스 코드');
    await page.keyboard.press('Escape'); await expect(font).toBeFocused();
    await expect(fonts).toHaveCount(0);
});

test('discrete toggles and sticker deletion have distinct undo steps', async ({ page }) => {
    const url = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="purple"/></svg>').toString('base64');
    await seed(page, { isSprout: false, stickers: [{ id: 'history', url, x: 50, y: 50, scale: 1, rotation: 0 }] });
    const sprout = page.getByRole('button', { name: '새싹', exact: true }), undo = page.getByRole('button', { name: '실행 취소', exact: true }), redo = page.getByRole('button', { name: '다시 실행', exact: true });
    await sprout.click(); await sprout.click(); await undo.click(); await expect(sprout).toHaveAttribute('aria-pressed', 'true');
    await undo.click(); await expect(sprout).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#profile-tab-stickers').click();
    const historySticker = page.getByTestId('sticker-layer-list').locator('[data-sticker-id="history"]');
    await historySticker.getByRole('button', { name: /삭제/ }).click();
    const sticker = page.locator('#card-preview [data-testid="card-sticker"][data-sticker-id="history"]');
    await expect(sticker).toHaveCount(0); await undo.click(); await expect(sticker).toHaveCount(1);
    await expect(page.getByText('스티커를 삭제했습니다.', { exact: true })).toHaveCount(0);
    await redo.click(); await expect(sticker).toHaveCount(0);
});

for (const layout of ['header', 'left-portrait']) {
    test(layout + ': whole-card fit and actual-size pan stay within the workspace', async ({ page }) => {
        await seed(page, { layout });
        for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 720 }]) {
            await page.setViewportSize(viewport);
            await expect.poll(() => page.locator('#card-preview').evaluate(card => {
                const b = card.getBoundingClientRect(), c = document.querySelector('.studio-canvas')!.getBoundingClientRect();
                return b.top >= c.top && b.bottom <= c.bottom && b.left >= c.left && b.right <= c.right;
            })).toBe(true);
        }
        const size = await nativeSize(page);
        await page.getByRole('button', { name: '너비에 맞춤', exact: true }).click();
        await page.getByRole('button', { name: '실제 크기', exact: true }).click();
        await expect.poll(() => page.locator('#card-preview').evaluate(card => card.getBoundingClientRect().width)).toBe(size.width);
        await page.getByRole('button', { name: '화면에 맞춤', exact: true }).click();
        for (const width of [320, 390, 768]) {
            await page.setViewportSize({ width, height: 844 });
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.getByRole('button', { name: '실제 크기', exact: true }).click();
        await expect.poll(() => page.locator('.studio-canvas').evaluate(canvas => canvas.scrollWidth > canvas.clientWidth)).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
}
test('large imported cards show and download the same bounded PNG size', async ({ page }) => {
    await seed(page, { comment: '긴 소개 문장입니다.\n'.repeat(220) });
    await chooseQuality(page, 'ultra');
    await expect(page.getByText('큰 카드의 저장 크기가 자동 조정됩니다.', { exact: true })).toBeVisible();
    const expected = (await page.getByLabel('PNG 출력 크기', { exact: true }).innerText()).match(/\d+/g)!.map(Number);
    const output = await exportPng(page);
    expect([output.width, output.height]).toEqual(expected);
    expect(output.width * output.height).toBeLessThanOrEqual(12_000_000);
    expect(Math.max(output.width, output.height)).toBeLessThanOrEqual(16_384);
});
