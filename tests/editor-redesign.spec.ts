import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { i18n } from '../src/utils/i18n';
import { editorCopy } from '../src/utils/editorCopy';
import { chooseQuality, exportPng, nativeSize, seed } from './helpers';

test('focus view preserves the card, exports at native size and exits with Escape', async ({ page }) => {
    await seed(page);
    const focus = page.getByRole('button', { name: '집중 보기', exact: true });
    const card = page.locator('#card-preview');
    const originalSize = await nativeSize(page);
    const originalName = await card.locator('.sheet-name').innerText();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(i18n.ko.studio.workspace);
    await expect(focus).toHaveAttribute('aria-pressed', 'false');

    await focus.click();
    await expect(page.locator('.studio-page')).toHaveClass(/studio-page--focus/);
    await expect(focus).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#editor-panel')).toBeHidden();
    await expect(page.locator('nav.u040')).toBeHidden();
    await expect(page.locator('.studio-intro')).toHaveCount(0);
    await expect(card).toBeVisible();
    await expect(card.locator('.sheet-name')).toHaveText(originalName);
    expect(await nativeSize(page)).toEqual(originalSize);

    await chooseQuality(page, 'standard');
    const output = await exportPng(page);
    expect([output.width, output.height]).toEqual([originalSize.width, originalSize.height]);

    await page.locator('.studio-canvas').focus();
    await page.keyboard.press('Escape');
    await expect(focus).toHaveAttribute('aria-pressed', 'false');
    await expect(focus).toBeFocused();
    await expect(page.locator('#editor-panel')).toBeVisible();
    await expect(page.locator('nav.u040')).toBeVisible();
    await expect(page.getByRole('textbox', { name: i18n.ko.form.nickname, exact: true })).toHaveValue(originalName);
});

test('Escape closes a photo dialog without also leaving focus view', async ({ page }) => {
    await seed(page);
    const focus = page.getByRole('button', { name: '집중 보기', exact: true });
    await focus.click();
    const photo = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="700" height="280"><rect width="700" height="280" fill="#1c4638"/></svg>');
    await page.locator('#card-preview input[type="file"]').setInputFiles({ name: 'focus-photo.svg', mimeType: 'image/svg+xml', buffer: photo });
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(focus).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#card-preview')).toBeVisible();
    await page.locator('.studio-canvas').focus();
    await page.keyboard.press('Escape');
    await expect(focus).toBeFocused();
    await expect(focus).toHaveAttribute('aria-pressed', 'false');
});

test('stage layout controls update the real card and remain undoable', async ({ page }) => {
    await seed(page, { layout: 'header' });
    const footer = page.locator('.studio-stage-footer');
    const horizontal = footer.getByRole('button', { name: i18n.ko.form.layoutHeader, exact: true });
    const vertical = footer.getByRole('button', { name: i18n.ko.form.layoutPortrait, exact: true });
    await expect(horizontal).toHaveAttribute('aria-pressed', 'true');
    await vertical.click();
    await expect(vertical).toHaveAttribute('aria-pressed', 'true');
    await expect(horizontal).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#card-preview')).toHaveAttribute('data-layout', 'left-portrait');
    expect((await nativeSize(page)).width).toBe(880);
    await expect(page.locator('#card-preview .sheet-name')).toHaveText('세리안');
    await page.getByRole('button', { name: i18n.ko.studio.undo, exact: true }).click();
    await expect(horizontal).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#card-preview')).toHaveAttribute('data-layout', 'header');
    expect((await nativeSize(page)).width).toBe(700);
});

test('the canvas backdrop changes only the workspace and leaves the card unchanged', async ({ page }) => {
    await seed(page);
    const canvas = page.locator('.studio-canvas');
    const backdrop = page.getByRole('button', { name: editorCopy.ko.backdrop, exact: true });
    const originalBackground = await canvas.evaluate(element => getComputedStyle(element).backgroundColor);
    const readCardAppearance = () => page.locator('#card-preview').evaluate(card => {
        const style = getComputedStyle(card);
        return { background: style.backgroundColor, color: style.color, font: style.fontFamily, width: (card as HTMLElement).offsetWidth, height: (card as HTMLElement).offsetHeight, content: card.innerHTML };
    });
    const originalCard = await readCardAppearance();
    await backdrop.click();
    await expect(backdrop).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas).toHaveClass(/studio-canvas--ink/);
    await expect.poll(() => canvas.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(originalBackground);
    expect(await readCardAppearance()).toEqual(originalCard);
    await expect(page.getByRole('button', { name: i18n.ko.studio.undo, exact: true })).toBeDisabled();
    await backdrop.click();
    await expect(backdrop).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas).toHaveCSS('background-color', originalBackground);
});

test('resizing focus view to mobile restores the editing controls', async ({ page }) => {
    await seed(page);
    const focus = page.locator(`button[aria-label="${editorCopy.ko.focus}"]`);
    await focus.click();
    await expect(page.locator('#editor-panel')).toBeHidden();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('.studio-page')).not.toHaveClass(/studio-page--focus/);
    await expect(focus).toBeHidden();
    await expect(page.locator('nav.u040')).toBeVisible();
    await page.locator('#profile-tab-basic').click();
    await expect(page.getByRole('textbox', { name: i18n.ko.form.nickname, exact: true })).toBeVisible();
    await expect(page.locator('#card-preview')).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(focus).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#editor-panel')).toBeVisible();
});

test('focus view keeps hidden editor controls out of keyboard navigation', async ({ page }) => {
    await seed(page);
    await page.getByRole('button', { name: editorCopy.ko.focus, exact: true }).click();
    await expect(page.locator('.studio-intro')).toHaveCount(0);
    for (let step = 0; step < 14; step++) {
        await page.keyboard.press('Shift+Tab');
        expect(await page.evaluate(() => Boolean(document.activeElement?.closest('#editor-panel, nav.u040')))).toBe(false);
    }
});

for (const language of ['ko', 'en', 'ja'] as const) {
    test(`${language}: the studio remains usable at 320px and 390px`, async ({ page }) => {
        await seed(page, { language });
        const copy = editorCopy[language];
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(i18n[language].studio.workspace);
        const footer = page.locator('.studio-stage-footer');
        await expect(footer.getByRole('button', { name: i18n[language].form.layoutHeader, exact: true })).toBeVisible();
        await expect(footer.getByRole('button', { name: i18n[language].form.layoutPortrait, exact: true })).toBeVisible();
        const focusLabel = copy.focus;
        const focus = page.locator(`button[aria-label="${focusLabel}"]`);
        await expect(focus).toBeVisible();
        await expect(focus).toHaveAccessibleName(focusLabel);

        for (const width of [320, 390]) {
            await page.setViewportSize({ width, height: 844 });
            await expect(focus).toBeHidden();
            await expect(page.locator('nav.u040')).toBeVisible();
            await expect(page.locator('#card-preview')).toBeVisible();
            await expect(page.locator('.studio-mobile-sheet-tour')).toHaveAccessibleName(i18n[language].tour.start);
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            await expect(page.locator('.u010-main')).toBeVisible();
        }
    });
}

test('redesigned shell and focus mode pass WCAG AA in both themes', async ({ page }) => {
    await seed(page);
    const focus = page.getByRole('button', { name: '집중 보기', exact: true });
    for (const dark of [false, true]) {
        if (dark) await page.getByRole('button', { name: '다크 모드로 변경', exact: true }).click();
        for (const focused of [false, true]) {
            if (focused) await focus.click();
            const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
            expect(result.violations, `dark=${dark}, focus=${focused}`).toEqual([]);
        }
        await focus.click();
    }
});
