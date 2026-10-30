import { expect, test } from '@playwright/test';
import { i18n } from '../src/utils/i18n';
import type { Language } from '../src/types';
import { chooseQuality, exportPng, nativeSize, pixels, seed } from './helpers';

test.beforeEach(async ({ page }) => { await page.route('https://cdn.jsdelivr.net/**', route => route.abort()); });

async function switchLanguage(page: import('@playwright/test').Page, from: Language, to: Language) {
    if (from === to) return;
    const suffix = from === 'ko' ? '언어' : from === 'ja' ? '言語' : 'language';
    const target = to === 'ko' ? 'KR' : to === 'en' ? 'EN' : 'JA';
    await page.getByRole('button', { name: `${target} ${suffix}`, exact: true }).click();
}

test('mobile preview remains visible as the edit sheet moves through its detents', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 844 });
    await seed(page);
    let currentLanguage: Language = 'ko';
    for (const language of ['ko', 'en', 'ja'] as const) {
        await switchLanguage(page, currentLanguage, language);
        currentLanguage = language;
        const sheet = page.getByRole('region', { name: i18n[language].workspace.editPanel, exact: true });
        const handle = sheet.getByRole('button', { name: new RegExp(i18n[language].workspace.changeHeight) });
        const expectPeek = async () => {
            await expect.poll(async () => {
                const [card, panel] = await Promise.all([page.locator('#card-preview').boundingBox(), sheet.boundingBox()]);
                return Boolean(card && panel && card.y >= 0 && card.y + card.height <= panel.y + 1);
            }).toBe(true);
        };
        if (await sheet.getAttribute('data-detent') === 'collapsed') await handle.press('ArrowUp');
        await expect(sheet).toHaveAttribute('data-detent', 'half');
        await expectPeek();
        if (language === 'ko') {
            await handle.click();
            await expect(sheet).toHaveAttribute('data-detent', 'full');
            await handle.click();
            await expect(sheet).toHaveAttribute('data-detent', 'collapsed');
            await handle.click();
            await expect(sheet).toHaveAttribute('data-detent', 'half');
        }

        await handle.press('ArrowUp');
        await expect(sheet).toHaveAttribute('data-detent', 'full');
        await expect(page.locator('#card-preview')).toBeVisible();
        await handle.press('ArrowDown');
        await expect(sheet).toHaveAttribute('data-detent', 'half');
        await expectPeek();
        await handle.press('ArrowDown');
        await expect(sheet).toHaveAttribute('data-detent', 'collapsed');
        await expectPeek();
    }

    for (const width of [320, 375]) {
        await page.setViewportSize({ width, height: 844 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `viewport ${width}px`).toBe(true);
    }
});

test('mobile detent pointer drag snaps the sheet and never moves the card outside the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 844 });
    await seed(page);
    const sheet = page.getByRole('region', { name: i18n.ko.workspace.editPanel, exact: true });
    await expect(sheet).toHaveAttribute('data-detent', 'half');
    await expect.poll(() => sheet.evaluate(element => {
        const workspace = element.closest('.studio-workspace')!.getBoundingClientRect();
        const header = element.querySelector('.u336-hd')!.getBoundingClientRect();
        return header.top >= workspace.top + workspace.height * 0.4;
    })).toBe(true);
    const dragHandle = sheet.locator('.u336-hd');
    const bounds = await dragHandle.boundingBox();
    expect(bounds).toBeTruthy();
    const pointerX = bounds!.x + 20;
    const pointerY = bounds!.y + bounds!.height / 2;
    await page.mouse.move(pointerX, pointerY);
    await page.mouse.down();
    await page.mouse.move(pointerX, pointerY - 280, { steps: 8 });
    await page.mouse.up();
    await expect(sheet).toHaveAttribute('data-detent', 'full');
    const box = await page.locator('#card-preview').boundingBox();
    expect(box).toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    await expect(page.locator('#card-preview')).toBeVisible();
});

test('full mobile sheet can scroll to the final sticker property control', async ({ page }) => {
    const url = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#663399"/></svg>').toString('base64');
    await page.setViewportSize({ width: 375, height: 844 });
    await seed(page, { stickers: Array.from({ length: 16 }, (_, index) => ({ id: `mobile-${index}`, url, x: 5 + index * 5, y: 50, scale: 0.5, rotation: 0 })) });
    const sheet = page.getByRole('region', { name: i18n.ko.workspace.editPanel, exact: true });
    await expect(sheet).toHaveAttribute('data-detent', 'half');
    await page.locator('#profile-tab-stickers').click();
    const list = page.getByTestId('sticker-layer-list');
    await expect(list.getByTestId('sticker-layer-row')).toHaveCount(16);
    await list.locator('[data-sticker-id="mobile-15"]').getByTestId('sticker-layer-select').click();
    const content = sheet.locator('.studio-mobile-sheet-editor .studio-tab-content');
    const control = page.getByTestId('sticker-y-input');
    const moveToLastControl = async () => {
        await content.evaluate(element => { element.scrollTop = element.scrollHeight; });
        await expect.poll(() => content.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
        const [lastControl, editorBox] = await Promise.all([control.boundingBox(), sheet.locator('.studio-mobile-sheet-editor').boundingBox()]);
        expect(lastControl).toBeTruthy(); expect(editorBox).toBeTruthy();
        expect(lastControl!.y).toBeGreaterThanOrEqual(editorBox!.y);
        expect(lastControl!.y + lastControl!.height).toBeLessThanOrEqual(editorBox!.y + editorBox!.height);
        expect(lastControl!.y + lastControl!.height).toBeLessThanOrEqual(844);
    };
    await moveToLastControl();
    await sheet.getByRole('button', { name: new RegExp(i18n.ko.workspace.changeHeight) }).press('ArrowUp');
    await expect(sheet).toHaveAttribute('data-detent', 'full');
    await moveToLastControl();
});

test('quality menu changes PNG dimensions without exporting until the save button is activated', async ({ page }) => {
    await seed(page);
    let currentLanguage: Language = 'ko';
    for (const language of ['ko', 'en', 'ja'] as const) {
        await page.setViewportSize({ width: 1440, height: 1000 });
        await switchLanguage(page, currentLanguage, language);
        currentLanguage = language;
        let downloads = 0;
        page.on('download', () => { downloads += 1; });
        const size = await nativeSize(page);
        const dimensions = page.getByLabel(i18n[language].studio.outputSize, { exact: true });
        const save = page.locator('.u010-main');

        await chooseQuality(page, 'high', language);
        await expect(dimensions).toHaveText(`${size.width * 2} × ${size.height * 2} px`);
        await expect(save).toBeEnabled();
        expect(downloads).toBe(0);

        for (const motion of ['reduce', 'no-preference'] as const) {
            await page.emulateMedia({ reducedMotion: motion });
            for (const width of [320, 375]) {
                await page.setViewportSize({ width, height: 844 });
                const trigger = page.getByRole('button', { name: i18n[language].exportMenu.options, exact: true });
                await trigger.click();
                const menu = page.getByRole('menu', { name: i18n[language].exportMenu.options, exact: true });
                await expect(menu).toBeVisible();
                await expect.poll(async () => {
                    const bounds = await menu.boundingBox();
                    return Boolean(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width);
                }).toBe(true);
                await page.keyboard.press('Home');
                await page.keyboard.press('Escape');
                await expect(menu).toHaveCount(0);
            }
        }
        await expect(dimensions).toHaveText(`${size.width * 2} × ${size.height * 2} px`);
    }
});

test('PNG dimensions do not change when the preview zoom changes', async ({ page }) => {
    await seed(page);
    await chooseQuality(page, 'standard');
    const dimensions = page.getByLabel(i18n.ko.studio.outputSize, { exact: true });
    const initial = await dimensions.innerText();
    await page.getByRole('button', { name: '실제 크기', exact: true }).click();
    await expect(dimensions).toHaveText(initial);
    await page.getByRole('button', { name: '화면에 맞춤', exact: true }).click();
    await expect(dimensions).toHaveText(initial);
});

test('sticker layers keep independent properties, reorder actual PNG layers, and undo property edits', async ({ page }) => {
    const svg = (color: string) => 'data:image/svg+xml;base64,' + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="${color}"/></svg>`).toString('base64');
    await seed(page, { stickers: [
        { id: 'red-layer', url: svg('#ff0000'), x: 50, y: 50, scale: 1, rotation: 0 },
        { id: 'blue-layer', url: svg('#0000ff'), x: 50, y: 50, scale: 1, rotation: 0 },
    ] });
    await page.locator('#profile-tab-stickers').click();
    const list = page.getByTestId('sticker-layer-list');
    const rows = list.getByTestId('sticker-layer-row');
    await expect(rows).toHaveCount(2);
    const red = list.locator('[data-sticker-id="red-layer"]');
    await red.getByTestId('sticker-layer-select').click();
    const properties = page.getByTestId('sticker-property-panel');
    const scale = properties.locator('#sticker-red-layer-scale');
    await expect(scale).toHaveValue('1');
    await scale.fill('1.4');
    await scale.press('Enter');
    await expect(page.locator('#card-preview [data-testid="card-sticker"][data-sticker-id="red-layer"]')).toHaveCount(1);
    await expect(page.locator('#card-preview [data-testid="card-sticker"][data-sticker-id="blue-layer"]')).toHaveCount(1);
    const undo = page.getByRole('button', { name: '실행 취소', exact: true });
    await undo.click();
    await expect(scale).toHaveValue('1');
    await expect(undo).toBeDisabled();
    await properties.getByRole('button', { name: i18n.ko.form.centerSticker, exact: true }).click();
    await expect(undo).toBeDisabled();

    const initialOrder = await rows.evaluateAll(items => items.map(row => row.getAttribute('data-sticker-id')));
    await red.getByTestId('sticker-move-to-front').click();
    const movedOrder = await rows.evaluateAll(items => items.map(row => row.getAttribute('data-sticker-id')));
    expect(movedOrder).toContain('red-layer');
    expect(movedOrder).toContain('blue-layer');
    expect(movedOrder).not.toEqual(initialOrder);
    await expect(page.locator('#card-preview [data-testid="card-sticker"][data-sticker-id="red-layer"]')).toHaveCount(1);
    await expect(page.locator('#card-preview [data-testid="card-sticker"][data-sticker-id="blue-layer"]')).toHaveCount(1);

    await chooseQuality(page, 'standard');
    const image = await exportPng(page);
    const [center] = await pixels(page, image.png, [{ x: image.width / 2, y: image.height / 2, width: 1, height: 1 }]);
    expect(center).toEqual([255, 0, 0, 255]);
});

test('clicking a canvas sticker from another editor section opens its layer controls', async ({ page }) => {
    const url = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#ff00ff"/></svg>').toString('base64');
    await seed(page, { stickers: [{ id: 'canvas-entry', url, x: 50, y: 50, scale: 1, rotation: 0 }] });
    await expect(page.locator('#profile-tab-basic')).toHaveAttribute('aria-selected', 'true');
    const stickerButton = page.locator('#card-preview [data-testid="card-sticker"] button[aria-pressed]');
    await stickerButton.click();
    await expect(page.locator('#profile-tab-stickers')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('sticker-property-panel')).toBeVisible();
    await expect(page.locator('#sticker-canvas-entry-scale')).toHaveValue('1');

    await page.locator('#profile-tab-basic').click();
    const bounds = await stickerButton.boundingBox();
    expect(bounds).toBeTruthy();
    const x = bounds!.x + bounds!.width / 2, y = bounds!.y + bounds!.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 32, y + 12, { steps: 4 });
    await page.mouse.up();
    await expect(page.locator('#profile-tab-basic')).toHaveAttribute('aria-selected', 'true');
});

test('sticker context menu opens by keyboard and right-click and stays inside a narrow viewport', async ({ page }) => {
    const url = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#ff00ff"/></svg>').toString('base64');
    await page.setViewportSize({ width: 320, height: 720 });
    await seed(page, { stickers: [{ id: 'edge-sticker', url, x: 4, y: 5, scale: 1, rotation: 0 }] });
    let currentLanguage: Language = 'ko';
    for (const language of ['ko', 'en', 'ja'] as const) {
        await switchLanguage(page, currentLanguage, language);
        currentLanguage = language;
        for (const motion of ['reduce', 'no-preference'] as const) {
            await page.emulateMedia({ reducedMotion: motion });
            if (motion === 'no-preference') await page.locator('.studio-header button[aria-pressed]').last().click();
            const sticker = page.getByTestId('card-sticker').first();
            await sticker.click();
            const trigger = page.getByTestId('sticker-menu-trigger');
            await trigger.focus();
            await page.keyboard.press('Enter');
            let menu = page.getByTestId('sticker-context-menu');
            await expect(menu).toBeVisible();
            await expect(menu.getByRole('menuitem')).toHaveCount(5);
            await page.keyboard.press('End');
            await expect(menu.getByRole('menuitem').last()).toBeFocused();
            await page.keyboard.press('Escape');
            await expect(menu).toHaveCount(0);

            await sticker.locator('button[aria-pressed="true"]').click({ button: 'right' });
            menu = page.getByTestId('sticker-context-menu');
            await expect(menu).toBeVisible();
            const menuBounds = await menu.boundingBox();
            expect(menuBounds).toBeTruthy();
            expect(menuBounds!.x).toBeGreaterThanOrEqual(0);
            expect(menuBounds!.x + menuBounds!.width).toBeLessThanOrEqual(320);
            await menu.locator('[data-menu-action="center"]').click();
            await expect(menu).toHaveCount(0);
        }
    }
});

test('sticker context menu opens by touch and flips into the viewport at the top edge', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 320, height: 720 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    try {
        const page = await context.newPage();
        const url = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#ff00ff"/></svg>').toString('base64');
        await page.route('https://cdn.jsdelivr.net/**', route => route.abort());
        await seed(page, { stickers: [{ id: 'touch-edge', url, x: 10, y: 12, scale: 1, rotation: 0 }] });
        await page.getByTestId('card-sticker').first().click();
        const trigger = page.getByTestId('sticker-menu-trigger');
        const triggerBounds = await trigger.boundingBox();
        expect(triggerBounds).toBeTruthy();
        await page.touchscreen.tap(triggerBounds!.x + triggerBounds!.width / 2, triggerBounds!.y + triggerBounds!.height / 2);
        const menu = page.getByTestId('sticker-context-menu');
        await expect(menu).toBeVisible();
        const bounds = await menu.boundingBox();
        expect(bounds).toBeTruthy();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.y).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(720);
        await menu.locator('[data-menu-action="delete"]').click();
        await expect(page.getByTestId('card-sticker')).toHaveCount(0);
        await context.close();
    } catch (error) {
        await context.close();
        throw error;
    }
});

test('sticker tab has its own localized tab and property panel across all supported languages', async ({ page }) => {
    await seed(page);
    let currentLanguage: Language = 'ko';
    for (const language of ['ko', 'en', 'ja'] as const satisfies readonly Language[]) {
        await switchLanguage(page, currentLanguage, language);
        currentLanguage = language;
        await expect(page.getByRole('tab', { name: i18n[language].form.tabStickers, exact: true })).toBeVisible();
        await page.locator('#profile-tab-stickers').click();
        await expect(page.getByRole('heading', { name: i18n[language].layers.title, exact: true })).toBeVisible();
        await expect(page.getByRole('tab', { name: i18n[language].form.tabSlot, exact: true })).toBeVisible();
    }
});

test('design and sticker tabs restore their own scroll positions independently', async ({ page }) => {
    const url = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#663399"/></svg>').toString('base64');
    await page.setViewportSize({ width: 375, height: 600 });
    await seed(page, { stickers: Array.from({ length: 16 }, (_, index) => ({ id: `scroll-${index}`, url, x: 5 + index * 5, y: 50, scale: 0.5, rotation: 0 })) });
    const sheet = page.getByRole('region', { name: i18n.ko.workspace.editPanel, exact: true });
    // Short screens use the same handle as an edit/preview switch.
    await sheet.locator('.u336-gr').press('ArrowUp');
    const content = page.locator('.studio-tab-content');

    await page.locator('#profile-tab-job').click();
    await content.evaluate(element => { element.scrollTop = element.scrollHeight; });
    await expect.poll(() => content.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
    const jobPosition = await content.evaluate(element => element.scrollTop);

    await page.locator('#profile-tab-stickers').click();
    await content.evaluate(element => { element.scrollTop = Math.floor((element.scrollHeight - element.clientHeight) / 2); });
    await expect.poll(() => content.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
    const stickerPosition = await content.evaluate(element => element.scrollTop);
    expect(stickerPosition).not.toEqual(jobPosition);

    await page.locator('#profile-tab-job').click();
    await expect.poll(() => content.evaluate(element => element.scrollTop)).toBe(jobPosition);
    await page.locator('#profile-tab-stickers').click();
    await expect.poll(() => content.evaluate(element => element.scrollTop)).toBe(stickerPosition);
});
