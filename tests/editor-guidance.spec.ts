import { test, expect } from '@playwright/test';
import { readStoredValue, seed } from './helpers';

test.beforeEach(async ({ page }) => { await page.route('https://cdn.jsdelivr.net/**', route => route.abort()); });

test('desktop editor rail expands, labels the active section, and keeps roving tab focus', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');
    const rail = page.locator('nav.u040');
    await expect(rail).toHaveAttribute('data-orientation', 'vertical');
    for (const id of ['basic', 'job', 'style', 'design', 'stickers', 'slot']) await expect(page.locator(`#profile-tab-${id}`)).toHaveCount(1);
    await expect.poll(() => rail.evaluate(element => element.getBoundingClientRect().width)).toBe(76);
    await expect(page.locator('#editor-title')).toHaveText('기본');
    await page.locator('input[name="character-name"]').fill('Seriane');
    const editor = page.locator('#editor-panel');
    const collapsedLeft = await editor.evaluate(element => element.getBoundingClientRect().left);

    await page.getByRole('button', { name: '편집 메뉴 펼치기', exact: true }).click();
    await expect(rail).toHaveAttribute('data-expanded', 'true');
    await expect.poll(() => rail.evaluate(element => element.getBoundingClientRect().width)).toBe(200);
    const expandedLeft = await editor.evaluate(element => element.getBoundingClientRect().left);
    expect(expandedLeft - collapsedLeft).toBe(124);
    await expect(rail.getByRole('tab', { name: '기본', exact: true }).locator('span')).toHaveCSS('opacity', '1');

    const basic = rail.getByRole('tab', { name: '기본', exact: true });
    await basic.focus();
    await page.keyboard.press('ArrowDown');
    await expect(rail.getByRole('tab', { name: '직업', exact: true })).toBeFocused();
    await expect(page.locator('#editor-title')).toHaveText('직업');
    await page.keyboard.press('ArrowRight');
    await expect(rail.getByRole('tab', { name: '스타일', exact: true })).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(rail.getByRole('tab', { name: '직업', exact: true })).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(basic).toBeFocused();
    await page.keyboard.press('End');
    await expect(page.locator('#profile-tab-slot')).toBeFocused();
    await expect(page.locator('#editor-title')).toHaveText('보관함');
    await page.keyboard.press('Home');
    await expect(rail.getByRole('tab', { name: '기본', exact: true })).toBeFocused();
    await expect(rail.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
    await expect(page.locator('input[name="character-name"]')).toHaveValue('Seriane');

    await page.locator('#profile-tab-design').click();
    await page.getByRole('button', { name: '폰트', exact: true }).and(page.locator('[aria-haspopup="listbox"]')).click();
    await expect(page.getByRole('listbox', { name: '폰트', exact: true })).toBeVisible();
    await page.locator('#profile-tab-basic').click();
    await expect(page.getByRole('listbox', { name: '폰트', exact: true })).toHaveCount(0);
    await page.locator('#profile-tab-design').click();
});

test('mobile rail stays horizontal and the editor help button fits at 320 and 375 pixels', async ({ page }) => {
    await seed(page);
    for (const width of [320, 375]) {
        await page.setViewportSize({ width, height: 844 });
        const rail = page.locator('nav.u040');
        await expect(rail).toHaveAttribute('data-orientation', 'horizontal');
        await expect(rail.getByRole('tab')).toHaveCount(6);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await expect(page.locator('.u040-tog')).toBeHidden();
        const visibleLaunchers = page.locator('.studio-mobile-sheet-tour:visible');
        await expect(visibleLaunchers).toHaveCount(1);
        await expect(visibleLaunchers).toHaveAccessibleName('사용방법');
    }
});

test('guided tour reveals each live target and switches to the required editor section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await seed(page, { jobs: [], mainJob: undefined, jobLevels: {} });
    const steps = [
        { progress: '1 / 8', title: '사진 넣기', target: '[data-tour="image-upload"]', tab: 'basic' },
        { progress: '2 / 8', title: '이름과 서버', target: 'input[name="character-name"]', tab: 'basic' },
        { progress: '3 / 8', title: '직업과 레벨', target: '[data-tour="job-selection"] [role="tablist"]', tab: 'job' },
        { progress: '4 / 8', title: '플레이 스타일', target: '[data-tour="style-section"] section:first-child', tab: 'style' },
        { progress: '5 / 8', title: '색과 폰트', target: '.color-palette', tab: 'design' },
        { progress: '6 / 8', title: '스티커 배치', target: '[data-tour="stickers-section"] [data-sticker-add]', tab: 'stickers' },
        { progress: '7 / 8', title: '미리보기 확인', target: '[data-tour="preview-controls"]' },
        { progress: '8 / 8', title: 'PNG로 저장', target: '[data-tour="export-controls"]' },
    ];
    const launcher = page.locator('.studio-tour-trigger--header');
    await launcher.click();
    const dialog = page.getByTestId('guided-tour-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-label', '카드 만들기 안내');
    await expect(page.locator('#root')).toHaveAttribute('inert', '');

    for (const [index, step] of steps.entries()) {
        await expect(dialog.locator('.u197-progress')).toHaveText(step.progress);
        await expect(dialog.getByRole('heading', { name: step.title, exact: true })).toBeVisible();
        await expect(dialog).toHaveAccessibleName(step.title);
        const describedBy = (await dialog.getAttribute('aria-describedby'))?.split(/\s+/).filter(Boolean) ?? [];
        expect(describedBy.length).toBeGreaterThan(0);
        const visibleDescription = await dialog.locator('.u197-content p').innerText();
        const announcements = await Promise.all(describedBy.map(id => page.locator(`[id="${id}"]`).innerText()));
        expect(announcements.join(' ')).toContain(visibleDescription);
        await expect(dialog.locator('.u197-announcement')).toHaveAttribute('aria-live', 'polite');
        await expect(dialog.locator('.u197-announcement')).toContainText(step.title);
        await expect(dialog.locator('.u197-announcement')).toContainText(visibleDescription);
        await expect(dialog.locator('.u197-announcement')).toContainText(step.progress);
        await expect(page.locator(step.target)).toBeVisible();
        await expect(page.locator('.u197-ring')).toBeVisible();
        expect(await page.evaluate(targetSelector => {
            const tip = document.querySelector('.u197-tip')!.getBoundingClientRect();
            const target = document.querySelector(targetSelector)?.getBoundingClientRect();
            return tip.left >= 0 && tip.top >= 0 && tip.right <= innerWidth && tip.bottom <= innerHeight && Boolean(target && target.width > 0 && target.height > 0);
        }, step.target)).toBe(true);
        if (step.tab) await expect(page.locator(`#profile-tab-${step.tab}`)).toHaveAttribute('aria-selected', 'true');

        if (index < steps.length - 1) {
            await dialog.getByRole('button', { name: '다음', exact: true }).click();
        } else {
            await expect(dialog.getByRole('button', { name: '완료', exact: true })).toBeVisible();
            await dialog.getByRole('button', { name: '완료', exact: true }).click();
        }
    }

    await expect(dialog).toHaveCount(0);
    await expect(page.locator('#root')).not.toHaveAttribute('inert', '');
    await expect(launcher).toBeFocused();
    await launcher.click();
    await expect(dialog.locator('.u197-progress')).toHaveText('1 / 8');
    await dialog.getByRole('button', { name: '닫기', exact: true }).click();
    await expect(dialog).toHaveCount(0);
});

test('tour can close mid-step, restores focus and tab, leaves profile history intact, and can restart', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await seed(page);
    const startingTab = page.getByRole('tab', { name: '직업', exact: true });
    await startingTab.click();
    const launcher = page.locator('.studio-tour-trigger--header');
    const storedProfile = await readStoredValue(page, 'currentProfile');
    const undo = page.getByRole('button', { name: '실행 취소', exact: true });
    await expect(undo).toBeDisabled();

    await launcher.click();
    const dialog = page.getByTestId('guided-tour-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-label', '카드 만들기 안내');
    await expect(page.locator('#root')).toHaveAttribute('inert', '');
    await expect(dialog.getByRole('button', { name: '다음', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: '닫기', exact: true })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.getByRole('button', { name: '다음', exact: true })).toBeFocused();
    for (let index = 0; index < 3; index++) await dialog.getByRole('button', { name: '다음', exact: true }).click();
    await expect(dialog.locator('.u197-progress')).toHaveText('4 / 8');
    await dialog.getByRole('button', { name: '닫기', exact: true }).click();

    await expect(dialog).toHaveCount(0);
    await expect(page.locator('#root')).not.toHaveAttribute('inert', '');
    await expect(startingTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#editor-title')).toHaveText('직업');
    await expect(launcher).toBeFocused();
    await expect(undo).toBeDisabled();
    expect(await readStoredValue(page, 'currentProfile')).toEqual(storedProfile);

    await launcher.click();
    await expect(dialog.locator('.u197-progress')).toHaveText('1 / 8');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(launcher).toBeFocused();
    await expect(startingTab).toHaveAttribute('aria-selected', 'true');
    expect(await readStoredValue(page, 'currentProfile')).toEqual(storedProfile);
});

test('guided tour uses the current language and remains usable in dark mode with reduced motion', async ({ page }) => {
    await seed(page);
    const locales = [
        { button: 'EN 언어', label: 'Create a character card', start: 'How to use', title: 'Add a screenshot', next: 'Next' },
        { button: 'JA language', label: 'キャラクターカードの作り方', start: '使い方', title: '写真を追加', next: '次へ' },
        { button: 'KR 言語', label: '카드 만들기 안내', start: '사용방법', title: '사진 넣기', next: '다음' },
    ];
    await page.getByRole('button', { name: '다크 모드로 변경', exact: true }).click();
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    for (const locale of locales) {
        await page.getByRole('button', { name: locale.button, exact: true }).click();
        await expect(page.locator('.studio-tour-trigger:visible')).toHaveText(locale.start);
        await page.locator('.studio-tour-trigger:visible').click();
        const dialog = page.getByTestId('guided-tour-dialog');
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAttribute('aria-label', locale.label);
        await expect(dialog.getByRole('heading', { name: locale.title, exact: true })).toBeVisible();
        await expect(dialog.getByRole('button', { name: locale.next, exact: true })).toBeVisible();
        await expect(dialog.locator('.u197-content')).toHaveCSS('animation-name', 'none');
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);
    }

    await page.setViewportSize({ width: 320, height: 844 });
    const mobileLauncher = page.locator('.studio-mobile-sheet-tour');
    await expect(mobileLauncher).toBeVisible();
    await mobileLauncher.click();
    const mobileDialog = page.getByTestId('guided-tour-dialog');
    for (let index = 0; index < 7; index++) {
        await expect(mobileDialog.locator('.u197-progress')).toHaveText(`${index + 1} / 8`);
        await mobileDialog.getByRole('button', { name: '다음', exact: true }).click();
    }
    await expect(mobileDialog.locator('.u197-progress')).toHaveText('8 / 8');
    await expect(mobileDialog.getByRole('heading', { name: 'PNG로 저장', exact: true })).toBeVisible();
    await mobileDialog.getByRole('button', { name: '완료', exact: true }).click();
    await expect(mobileDialog).toHaveCount(0);
    await expect(mobileLauncher).toBeFocused();
    expect(await mobileLauncher.evaluate(element => {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= innerHeight && rect.right <= innerWidth;
    })).toBe(true);
});
