import { test, expect } from '@playwright/test';
import { seed } from './helpers';

test.beforeEach(async ({ page }) => { await page.route('https://cdn.jsdelivr.net/**', route => route.abort()); });

test('font picker uses localized typeahead and arrow/Home/End navigation without committing until selection', async ({ page }) => {
    await seed(page);
    await page.locator('#profile-tab-design').click();
    const trigger = page.getByRole('button', { name: '폰트', exact: true }).and(page.locator('[aria-haspopup="listbox"]'));
    const originalFont = await trigger.locator('.u031-v-name').innerText();
    await trigger.focus();
    await page.keyboard.press('ArrowDown');

    const listbox = page.getByRole('listbox', { name: '폰트', exact: true });
    await expect(listbox).toBeFocused();
    await expect(listbox).toHaveAttribute('aria-activedescendant', /option-\d+$/);
    await page.keyboard.press('End');
    const lastOption = await listbox.getAttribute('aria-activedescendant');
    await expect(page.locator(`[id="${lastOption}"]`)).toContainText('구름 산스 코드');
    await page.keyboard.press('Home');
    const firstOption = await listbox.getAttribute('aria-activedescendant');
    await expect(page.locator(`[id="${firstOption}"]`)).toContainText('프리텐다드');
    await page.keyboard.press('g');
    const typeaheadOption = await listbox.getAttribute('aria-activedescendant');
    await expect(page.locator(`[id="${typeaheadOption}"]`)).toContainText('G마켓 산스');
    await expect(listbox.getByRole('option', { selected: true })).toContainText(originalFont);
    await expect(trigger.locator('.u031-v-name')).toHaveText(originalFont);
    await expect(page.locator('#card-preview')).toHaveClass(/font-pretendard/);

    await page.keyboard.press('Tab');
    await expect(listbox).toHaveCount(0);
    await expect(page.getByRole('button', { name: '배경 효과', exact: true })).toBeFocused();

    await trigger.click();
    await expect(listbox).toBeFocused();
    await page.keyboard.press('g');
    await page.keyboard.press('Enter');
    await expect(trigger.locator('.u031-v-name')).toHaveText('G마켓 산스');
    await expect(page.locator('#card-preview')).toHaveClass(/font-gmarket/);
    await expect(page.getByRole('listbox', { name: '폰트', exact: true })).toHaveCount(0);
});

test('font picker closes on Escape, Tab and outside click without accidental selection', async ({ page }) => {
    await seed(page);
    await page.locator('#profile-tab-design').click();
    const trigger = page.getByRole('button', { name: '폰트', exact: true }).and(page.locator('[aria-haspopup="listbox"]'));
    const originalFont = await trigger.locator('.u031-v-name').innerText();
    const listbox = page.getByRole('listbox', { name: '폰트', exact: true });

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('End');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger.locator('.u031-v-name')).toHaveText(originalFont);

    await trigger.click();
    await expect(listbox).toBeFocused();
    await page.keyboard.press('End');
    await page.keyboard.press('Tab');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(listbox).toHaveCount(0);
    await expect(trigger.locator('.u031-v-name')).toHaveText(originalFont);

    await trigger.click();
    await expect(listbox).toBeFocused();
    await page.locator('#preview-panel').click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(listbox).toHaveCount(0);
    await expect(trigger.locator('.u031-v-name')).toHaveText(originalFont);

    await trigger.click();
    await listbox.getByRole('option', { name: 'G마켓 산스', exact: true }).click();
    await expect(trigger.locator('.u031-v-name')).toHaveText('G마켓 산스');
    await expect(page.locator('#card-preview')).toHaveClass(/font-gmarket/);
});

test('clipboard and real PNG export add independent notifications that can be expanded and dismissed individually', async ({ page }) => {
    await seed(page);
    await page.locator('#profile-tab-design').click();
    let copiedColor = '';
    await page.evaluate(() => {
        const clipboard = { writeText: async (text: string) => { (window as Window & { copiedColor?: string }).copiedColor = text; } };
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clipboard });
    });

    await page.locator('.color-palette__copy').first().click();
    const stack = page.getByRole('region', { name: '알림', exact: true });
    const cards = stack.locator('[data-testid="toast-card"]');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toHaveAttribute('data-type', 'success');
    await expect(cards.first().locator('.u070-live')).toContainText('색상 코드를 복사했습니다');
    copiedColor = await page.evaluate(() => (window as Window & { copiedColor?: string }).copiedColor ?? '');
    expect(copiedColor).toMatch(/^#[0-9A-F]{6}$/);

    const save = page.locator('.studio-download').first();
    await save.click();
    await expect(save).toHaveAttribute('aria-busy', 'true');
    await expect(stack.locator('[data-type="loading"]')).toHaveCount(1);
    const exportToastId = await stack.locator('[data-type="loading"]').getAttribute('data-toast-id');
    expect(exportToastId).toBeTruthy();
    await expect(stack.locator(`[data-toast-id="${exportToastId}"]`)).toHaveAttribute('data-type', 'success');
    await expect(stack.locator(`[data-toast-id="${exportToastId}"] .u070-live`)).toContainText('PNG 카드를 저장했습니다');
    await expect(cards).toHaveCount(2);

    const expand = stack.getByTestId('toast-expand');
    await expand.focus();
    await expect(expand).toHaveAttribute('aria-expanded', 'true');
    await expect(stack).toHaveAttribute('data-expanded', 'true');
    const clipboardCard = cards.filter({ hasText: '색상 코드를 복사했습니다' });
    await clipboardCard.getByTestId('toast-dismiss').click();
    await expect(clipboardCard).toHaveCount(0);
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('.u070-live')).toContainText('PNG 카드를 저장했습니다');
    await cards.first().getByTestId('toast-dismiss').click();
    await expect(cards).toHaveCount(0);

    await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('clipboard denied'); } } });
    });
    await page.locator('.color-palette__copy').first().click();
    await expect(cards.first()).toHaveAttribute('data-type', 'error');
    await expect(cards.first().getByRole('alert')).toContainText('복사하지 못했습니다');
});

test('toast pause timers while hovered or focused and resume after interaction ends', async ({ page }) => {
    await seed(page);
    await page.clock.install();
    await page.locator('#profile-tab-design').click();
    await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => undefined } });
    });
    await page.locator('.color-palette__copy').first().click();
    const stack = page.getByRole('region', { name: '알림', exact: true });
    const card = stack.locator('[data-testid="toast-card"]').first();
    await expect(card).toHaveAttribute('data-type', 'success');

    await stack.hover();
    await expect(stack).toHaveClass(/is-paused/);
    await page.clock.fastForward(8_000);
    await expect(card).toBeVisible();

    await card.getByTestId('toast-dismiss').focus();
    await page.mouse.move(0, 0);
    await expect(stack).toHaveClass(/is-paused/);
    await page.clock.fastForward(8_000);
    await expect(card).toBeVisible();

    await page.locator('#preview-panel').focus();
    await expect(stack).not.toHaveClass(/is-paused/);
    await page.clock.fastForward(8_000);
    await expect(stack).toHaveCount(0);
});

test('keyboard dismissal of the last toast does not leave the next toast paused', async ({ page }) => {
    await seed(page);
    await page.clock.install();
    await page.locator('#profile-tab-design').click();
    await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => undefined } });
    });
    const copy = page.locator('.color-palette__copy').first();
    await copy.click();

    const stack = page.getByRole('region', { name: '알림', exact: true });
    const cards = stack.locator('[data-testid="toast-card"]');
    await expect(cards).toHaveCount(1);
    const dismiss = cards.first().getByTestId('toast-dismiss');
    await dismiss.focus();
    await expect(stack).toHaveClass(/is-paused/);
    await page.keyboard.press('Enter');
    await page.clock.fastForward(600);
    await expect(stack).toHaveCount(0);

    // The next action originates outside the toast stack; it must receive a fresh timer.
    await page.locator('#preview-panel').focus();
    await page.mouse.move(0, 0);
    await copy.click();
    await expect(cards).toHaveCount(1);
    await expect(stack).not.toHaveClass(/is-paused/);
    await page.clock.fastForward(5_000);
    await page.clock.fastForward(600);
    await expect(stack).toHaveCount(0);

    // With a second toast present, closing the focused front item must also
    // release the pause so the remaining item can resume its own timer.
    await copy.click();
    await expect(cards).toHaveCount(1);
    await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('clipboard denied'); } } });
    });
    await copy.click();
    await expect(cards).toHaveCount(2);
    const frontError = cards.filter({ hasText: '복사하지 못했습니다' });
    const frontDismiss = frontError.getByTestId('toast-dismiss');
    await frontDismiss.focus();
    await expect(stack).toHaveClass(/is-paused/);
    await page.keyboard.press('Enter');
    await page.clock.fastForward(600);
    await expect(frontError).toHaveCount(0);
    await expect(cards).toHaveCount(1);
    await expect(stack).not.toHaveClass(/is-paused/);
    await page.clock.fastForward(5_000);
    await page.clock.fastForward(600);
    await expect(stack).toHaveCount(0);
});
