import { expect, test } from '@playwright/test';
import { seed, chooseQuality, exportPng, pixels, nativeSize } from './helpers';

test('neutral UI uses flat controls and one language selector without shrinking the desktop workspace', async ({ page }) => {
    await seed(page);
    await expect(page.locator('html')).toHaveAttribute('data-radius', 'none');
    const colors = await page.locator('body').evaluate(body => {
        const rgb = getComputedStyle(body).backgroundColor.match(/\d+/g)!.map(Number);
        return Math.max(...rgb.slice(0, 3)) - Math.min(...rgb.slice(0, 3));
    });
    expect(colors).toBeLessThanOrEqual(1);
    await expect(page.locator('header select option')).toHaveCount(7);
});

test('PNG keeps photo content at the outer edge at every export quality', async ({ page }) => {
    await seed(page, { jobs: [], mainJob: undefined, cornerWash: false, jobWatermark: false });
    const size = await nativeSize(page);
    for (const quality of ['standard', 'high', 'ultra', 'original'] as const) {
        await chooseQuality(page, quality);
        const { png, width, height } = await exportPng(page);
        const factor = quality === 'original' ? 1 : { standard: 1, high: 2, ultra: 3 }[quality];
        expect(width).toBe(size.width * factor);
        expect(height).toBe(size.height * factor);
        const samples = await pixels(page, png, [
            { x: width / 2, y: 0, width: 1, height: 1 },
            { x: width / 2, y: 5 * factor, width: 1, height: 1 },
            { x: 0, y: 20 * factor, width: 1, height: 1 },
            { x: 5 * factor, y: 20 * factor, width: 1, height: 1 },
        ]);
        expect(samples[0]).toEqual(samples[1]);
        expect(samples[2]).toEqual(samples[3]);
    }
});

import { i18n, getActiveTimes, getPlaystyles, activeTimeTranslate, playstyleTranslate } from '../src/utils/i18n';
import { LANGUAGES, normalizeLanguage } from '../src/utils/languages';
import { aboutContent } from '../src/utils/aboutContent';
import { guideContent } from '../src/utils/guideContent';
import { faqContent } from '../src/utils/faqContent';
import { contactContent } from '../src/utils/contactContent';
import { pageMeta } from '../src/utils/pageMeta';
import { normalizePlayerInfo } from '../src/utils/playerData';
import { readStoredValue, profile } from './helpers';

test('all locale dictionaries preserve translated keys, interpolation and canonical activity IDs', () => {
    const flatten = (value: unknown, path = '', result: Record<string, string> = {}) => {
        if (typeof value === 'string') result[path] = value;
        else if (value && typeof value === 'object') Object.entries(value).forEach(([key, child]) => flatten(child, `${path}.${key}`, result));
        return result;
    };
    for (const { id } of LANGUAGES) {
        const sets = [i18n, aboutContent, guideContent, faqContent, contactContent, pageMeta];
        for (const set of sets) {
            const english = flatten(set.en);
            const translated = flatten(set[id]);
            expect(Object.keys(translated).sort()).toEqual(Object.keys(english).sort());
            for (const [key, value] of Object.entries(translated)) {
                expect(value.trim(), `${id}${key}`).not.toBe('');
                expect(value.match(/\{\w+\}/g) ?? [], `${id}${key}`).toEqual(english[key].match(/\{\w+\}/g) ?? []);
            }
        }
        expect(getPlaystyles(id)).toHaveLength(getPlaystyles('ko').length);
        expect(getActiveTimes(id)).toHaveLength(getActiveTimes('ko').length);
        expect(playstyleTranslate('스샷/룩덕', id)).toBe(getPlaystyles(id)[5]);
        expect(activeTimeTranslate('평일 저녁 / 주말 상시', id)).toBe(getActiveTimes(id)[0]);
        expect(activeTimeTranslate('My own hours 自訂', id)).toBe('My own hours 自訂');
        expect(normalizePlayerInfo({ language: id }).language).toBe(id);
    }
    expect(normalizeLanguage('zh-TW')).toBe('zh-Hant');
    expect(normalizeLanguage('zh_CN')).toBe('zh-Hans');
    expect(normalizeLanguage('fr-FR')).toBe('fr');
    expect(normalizeLanguage('xx')).toBe('ko');
});

for (const { id } of LANGUAGES) {
    test(`${id}: mobile editing, persisted language, PNG and every public route remain usable`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.setViewportSize({ width: 320, height: 844 });
        await seed(page);
        await page.locator('header select').selectOption(id);
        await expect(page.locator('html')).toHaveAttribute('lang', id);
        await expect(page.locator('.sheet-credit > span')).toHaveText(i18n[id].preview.designedBy);
        for (const tab of ['basic', 'job', 'style', 'design', 'stickers', 'slot']) {
            await page.locator(`#profile-tab-${tab}`).click();
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            await expect(page.locator(`#profile-tab-${tab}`)).toHaveAttribute('aria-selected', 'true');
            expect(await page.locator('.studio-tab-content').evaluate(panel => panel.scrollWidth <= panel.clientWidth + 1), `${id} ${tab} panel overflow`).toBe(true);
        }
        await expect.poll(async () => (await readStoredValue<{ language: string }>(page, 'currentProfile'))?.language).toBe(id);
        const saved = await readStoredValue<Record<string, unknown>>(page, 'currentProfile');
        expect(saved).toMatchObject({ name: profile.name, comment: profile.comment, jobs: profile.jobs, pointColor: profile.pointColor });
        await page.reload();
        await expect(page.locator('header select')).toHaveValue(id);
        const theme = page.locator('.studio-header button[aria-pressed]');
        await theme.click();
        await expect(page.locator('html')).toHaveClass(/dark/);
        expect(await page.locator('body').evaluate(body => { const rgb = getComputedStyle(body).backgroundColor.match(/\d+/g)!.map(Number); return Math.max(...rgb.slice(0, 3)) - Math.min(...rgb.slice(0, 3)); })).toBeLessThanOrEqual(1);
        await theme.click();
        const exported = await exportPng(page);
        expect(exported.width).toBe(700);
        expect(exported.height).toBeGreaterThan(280);
        for (const [route, title] of [
            ['guide', guideContent[id].title], ['faq', faqContent[id].pageTitle],
            ['about', aboutContent[id].title], ['contact', contactContent[id].title],
            ['terms', i18n[id].terms.title], ['privacy', i18n[id].privacy.title],
        ]) {
            await page.goto(`/${route}`);
            await expect(page.locator('main h1')).toHaveText(title);
            await expect(page.locator('html')).toHaveAttribute('lang', id);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            await expect(page.locator('main')).not.toContainText('undefined');
        }
        expect(errors).toEqual([]);
    });
}
