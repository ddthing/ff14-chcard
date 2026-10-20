import { test, expect } from '@playwright/test';
import { seed } from './helpers';

test.beforeEach(async ({ page }) => { await page.route('https://cdn.jsdelivr.net/**', route => route.abort()); });

test('five palette candidates select only the profile accent', async ({ page }) => {
    await seed(page);
    await page.locator('#profile-tab-design').click();
    const swatches = page.locator('.color-palette__swatch');
    await expect(swatches).toHaveCount(5);

    const layout = await page.locator('#card-preview').getAttribute('data-layout');
    const fontFamily = await page.locator('#card-preview .sheet-name').evaluate(element => getComputedStyle(element).fontFamily);
    const selected = swatches.first();
    const hex = (await page.locator('.color-palette__slot').first().locator('.color-palette__hex').innerText()).toUpperCase();
    await selected.click();

    await expect(page.getByRole('textbox', { name: '포인트 컬러 HEX', exact: true })).toHaveValue(hex);
    await expect(selected).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#card-preview')).toHaveAttribute('data-layout', layout!);
    await expect.poll(() => page.locator('#card-preview .sheet-name').evaluate(element => getComputedStyle(element).fontFamily)).toBe(fontFamily);
});

test('locked candidates survive shuffle, selection stays put, and all locks disable shuffle', async ({ page }) => {
    await seed(page);
    await page.locator('#profile-tab-design').click();
    const swatches = page.locator('.color-palette__swatch');
    const slots = page.locator('.color-palette__slot');
    const firstHex = (await slots.nth(0).locator('.color-palette__hex').innerText()).toUpperCase();
    const lock = slots.nth(0).locator('.color-palette__lock');
    await lock.click();
    await expect(lock).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#profile-tab-basic').click();
    await page.locator('#profile-tab-design').click();
    await expect(lock).toHaveAttribute('aria-pressed', 'true');
    await swatches.nth(0).click();
    const accent = await page.getByRole('textbox', { name: '포인트 컬러 HEX', exact: true }).inputValue();

    await page.getByRole('button', { name: '새로 섞기', exact: true }).click();
    await expect(slots.nth(0).locator('.color-palette__hex')).toHaveText(firstHex);
    await expect(page.getByRole('textbox', { name: '포인트 컬러 HEX', exact: true })).toHaveValue(accent);

    for (let index = 1; index < 5; index++) await slots.nth(index).locator('.color-palette__lock').click();
    await expect(page.getByRole('button', { name: '새로 섞기', exact: true })).toBeDisabled();
    await expect(page.getByRole('status', { name: '팔레트 상태' })).toContainText('모든 색이 잠겨 있습니다');
});

test('palette swatches support Enter and Space activation', async ({ page }) => {
    await seed(page);
    await page.locator('#profile-tab-design').click();
    const swatches = page.locator('.color-palette__swatch');
    for (const [index, key] of [[0, 'Enter'], [1, 'Space']] as const) {
        const swatch = swatches.nth(index);
        const hex = (await page.locator('.color-palette__slot').nth(index).locator('.color-palette__hex').innerText()).toUpperCase();
        await swatch.focus();
        await page.keyboard.press(key);
        await expect(swatch).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByRole('textbox', { name: '포인트 컬러 HEX', exact: true })).toHaveValue(hex);
    }
});

test('palette fits narrow screens, keeps readable text, and honors reduced motion in both themes', async ({ page }, testInfo) => {
    await seed(page, { pointColor: '#777777' });
    await page.locator('#profile-tab-design').click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: testInfo.outputPath('palette-light.png'), fullPage: true });
    for (const dark of [false, true]) {
        if (dark) await page.getByRole('button', { name: '다크 모드로 변경', exact: true }).click();
        if (dark) await page.screenshot({ path: testInfo.outputPath('palette-dark.png'), fullPage: true });
        for (const width of [320, 375]) {
            await page.setViewportSize({ width, height: 844 });
            const palette = page.locator('.color-palette');
            await expect(palette).toBeVisible();
            expect(await palette.evaluate(element => {
                const rect = element.getBoundingClientRect();
                return rect.left >= 0 && rect.right <= innerWidth && document.documentElement.scrollWidth <= innerWidth;
            })).toBe(true);
            expect(await page.locator('.color-palette__hex').evaluateAll(elements => elements.every(element => {
                const range = document.createRange();
                range.selectNodeContents(element);
                const textRects = [...range.getClientRects()];
                const box = element.getBoundingClientRect();
                return element.textContent?.match(/^#[0-9A-F]{6}$/) !== null
                    && textRects.length === 1
                    && element.scrollWidth <= element.clientWidth
                    && textRects[0].left >= box.left
                    && textRects[0].right <= box.right;
            }))).toBe(true);
            expect(await page.locator('.color-palette__copy').evaluateAll(elements => elements.every(element => {
                const parse = (value: string) => value.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(channel => {
                    const normalized = channel / 255;
                    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
                });
                const styles = getComputedStyle(element);
                if (styles.opacity !== '1') return false;
                const [red, green, blue] = parse(styles.color);
                const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
                const [bgRed, bgGreen, bgBlue] = parse(styles.backgroundColor);
                const background = 0.2126 * bgRed + 0.7152 * bgGreen + 0.0722 * bgBlue;
                return (Math.max(luminance, background) + 0.05) / (Math.min(luminance, background) + 0.05) >= 4.5;
            }))).toBe(true);
            expect(await page.locator('.color-palette__swatch').first().evaluate(element => getComputedStyle(element).transitionProperty)).toBe('none');
            expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
        }
    }
});

test('palette labels and actions are translated in Korean, English and Japanese', async ({ page }) => {
    await seed(page);
    const locales = [
        { button: 'EN 언어', title: 'Color palette', shuffle: 'Shuffle', design: 'Design' },
        { button: 'JA language', title: 'カラーパレット', shuffle: 'シャッフル', design: 'デザイン' },
        { button: 'KR 言語', title: '색 팔레트', shuffle: '새로 섞기', design: '꾸미기' },
    ];
    for (const locale of locales) {
        await page.getByRole('button', { name: locale.button, exact: true }).click();
        await page.getByRole('tab', { name: locale.design, exact: true }).click();
        await expect(page.getByRole('group', { name: locale.title, exact: true }).first()).toBeVisible();
        await expect(page.getByRole('button', { name: locale.shuffle, exact: true })).toBeVisible();
        await expect(page.locator('.color-palette__swatch')).toHaveCount(5);
    }
});

test('copy reports clipboard success and failure', async ({ page }) => {
    await seed(page);
    await page.locator('#profile-tab-design').click();
    await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => undefined } });
    });
    await page.getByRole('button', { name: /HEX 복사:/ }).first().click();
    const stack = page.getByRole('region', { name: '알림', exact: true });
    await expect(stack.locator('[data-testid="toast-card"]').first()).toHaveAttribute('data-type', 'success');
    await expect(stack.locator('.u070-live').first()).toContainText('색상 코드를 복사했습니다');

    await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('clipboard denied'); } } });
    });
    await page.getByRole('button', { name: /HEX 복사:/ }).first().click();
    await expect(stack.locator('[data-testid="toast-card"]').first()).toHaveAttribute('data-type', 'error');
    await expect(stack.locator('.u070-live').first()).toContainText('복사하지 못했습니다');
});
