import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { JOBS } from '../src/data/jobs';
import { getContrastRatio } from '../src/utils/styles';
import { seed, nativeSize, exportPng, pixels, changed, chooseQuality } from './helpers';

for (const layout of ['header', 'left-portrait'] as const) {
    for (const [index, language] of (['ko', 'en', 'ja'] as const).entries()) {
        test(layout + ' / ' + language + ': long content, accessible accents and all jobs in both themes', async ({ page }) => {
            await seed(page, { layout, language, name: 'Seriane of the Silver Forest', activeTime: 'Weekday evenings / weekends whenever the adventure calls', comment: '함께할 모험을 기다립니다. A new adventure awaits. 新しい冒険へ。\n'.repeat(5), pointColor: ['#ffffff', '#ffff00', '#000000'][index] });
            for (const dark of [false, true]) {
                if (dark) await page.locator('.studio-header button[aria-pressed]').last().click();
                await expect(page.locator('.sheet-job')).toHaveCount(JOBS.length);
                const bstName = { ko: '마수조련사', en: 'Beastmaster', ja: '魔獣使い' }[language];
                await expect(page.locator('[data-job-type="battle"] [role="listitem"]').last().getByRole('img')).toHaveAttribute('alt', bstName);
                const styles = await page.locator('.sheet-mainjob').evaluate(el => {
                    const hex = (color: string) => '#' + color.match(/\d+/g)!.slice(0, 3).map(n => Number(n).toString(16).padStart(2, '0')).join('');
                    return { bg: hex(getComputedStyle(el).backgroundColor), text: hex(getComputedStyle(el.querySelector('.sheet-job-name')!).color), icon: hex(getComputedStyle(el.querySelector('.sheet-emblem-icon')!).backgroundColor) };
                });
                expect(getContrastRatio(styles.text, styles.bg)).toBeGreaterThanOrEqual(4.5);
                expect(getContrastRatio(styles.icon, styles.bg)).toBeGreaterThanOrEqual(3);
                const clipped = await page.locator('#card-preview').evaluate(card => {
                    const bounds = card.getBoundingClientRect();
                    return [...card.querySelectorAll('.sheet-name,.sheet-job-name,.sheet-job,.sheet-tags > span,.sheet-note > p,.sheet-footer')].filter(el => {
                        const box = el.getBoundingClientRect();
                        return box.left < bounds.left - 1 || box.right > bounds.right + 1 || box.bottom > bounds.bottom + 1 || el.scrollWidth > el.clientWidth + 1;
                    }).map(el => el.className);
                });
                expect(clipped).toEqual([]);
                expect((await new AxeBuilder({ page }).include('#card-preview').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
            }
        });
    }

    test(layout + ': 1x, 2x and 3x PNG dimensions, photograph and paper survive both themes', async ({ page }) => {
        await seed(page, { layout });
        const size = await nativeSize(page);
        expect(size.width).toBe(layout === 'header' ? 700 : 880);
        for (const dark of [false, true]) {
            if (dark) await page.getByRole('button', { name: '다크 모드로 변경', exact: true }).click();
            for (const ratio of [1, 2, 3]) {
                await chooseQuality(page, (['standard', 'high', 'ultra'] as const)[ratio - 1]);
                await expect(page.getByLabel('PNG 출력 크기', { exact: true })).toHaveText(size.width * ratio + ' × ' + size.height * ratio + ' px');
                const output = await exportPng(page);
                expect([output.width, output.height]).toEqual([size.width * ratio, size.height * ratio]);
                const [photo] = await pixels(page, output.png, [{ x: 30 * ratio, y: 30 * ratio, width: 1, height: 1 }]);
                expect(photo).toEqual([28, 70, 56, 255]);
            }
        }
        console.log(layout + ': native ' + size.width + ' × ' + size.height + ', 6 export combinations passed');
    });

    test(layout + ': Korean status and playstyle text stays inside its boxes in preview and export clone', async ({ page }) => {
        await seed(page, {
            layout,
            font: 'font-seogung',
            isSprout: true,
            isMentor: true,
            isNicknameChanged: true,
            playstyles: [
                '초보/새싹', '복귀 유저', '하드코어/레이드', '절 레이드',
                '라이트/즐겜', '스샷/룩덕', '하우징', '제작/채집', '터주',
                'RP(롤플레잉)', 'PVP', '업적작', '마작', '골드소서', '지도/보물고',
                '디스코드 가능', '트위터 교류', '인게임 위주',
            ],
        });

        const textBounds = await page.locator('#card-preview').evaluate(async card => {
            const measureText = (container: Element) => {
                const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
                const ranges: DOMRect[] = [];
                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    if (!node.textContent?.trim()) continue;
                    const range = document.createRange();
                    range.selectNodeContents(node);
                    ranges.push(...Array.from(range.getClientRects()));
                }
                const bounds = container.getBoundingClientRect();
                return {
                    text: container.textContent?.trim(),
                    lineCount: ranges.length,
                    inside: ranges.every(rect => rect.left >= bounds.left - 1
                        && rect.right <= bounds.right + 1
                        && rect.top >= bounds.top - 1
                        && rect.bottom <= bounds.bottom + 1),
                };
            };
            const selectors = '.sheet-statuses > span, .sheet-tags > span';
            const preview = [...card.querySelectorAll(selectors)].map(measureText);

            // Exercise html-to-image's own DOM clone. Its copied font sizing and
            // computed styles can make CJK text wrap differently from preview.
            const { toSvg } = await import('/node_modules/html-to-image/es/index.js');
            const root = card as HTMLElement;
            const svgUrl = await toSvg(root, {
                width: root.offsetWidth,
                height: root.offsetHeight,
                pixelRatio: 1,
                style: { boxShadow: 'none', transform: 'none' },
                filter: (element: HTMLElement) => !element.classList?.contains('export-ignore'),
            });
            const svg = new DOMParser().parseFromString(decodeURIComponent(svgUrl.slice(svgUrl.indexOf(',') + 1)), 'image/svg+xml');
            const clonedCard = svg.querySelector('foreignObject')?.firstElementChild;
            if (!clonedCard) throw new Error('html-to-image did not produce a foreignObject card clone');
            const sandbox = document.createElement('div');
            sandbox.style.cssText = 'position:fixed;left:-10000px;top:0;visibility:hidden';
            document.body.appendChild(sandbox);
            sandbox.appendChild(document.importNode(clonedCard, true));
            const exported = [...sandbox.querySelectorAll(selectors)].map(measureText);
            sandbox.remove();
            return { preview, exported };
        });
        expect(textBounds.preview).toHaveLength(21);
        expect(textBounds.exported).toHaveLength(21);
        for (const item of [...textBounds.preview, ...textBounds.exported]) {
            expect(item.lineCount, item.text).toBe(1);
            expect(item.inside, item.text).toBe(true);
        }

        // The image has a flat, known color, so sampling the former inset frame
        // in the downloaded PNG catches regressions that only appear on export.
        await chooseQuality(page, 'standard');
        const output = await exportPng(page);
        const [topFrame, leftFrame] = await pixels(page, output.png, [
            { x: 30, y: 12, width: 1, height: 1 },
            { x: 12, y: 30, width: 1, height: 1 },
        ]);
        expect(topFrame).toEqual([28, 70, 56, 255]);
        expect(leftFrame).toEqual([28, 70, 56, 255]);
    });

    test(layout + ': wash and watermark export independently, preserve photo and persist', async ({ page }) => {
        await seed(page, { layout, cornerWash: false, jobWatermark: false });
        await chooseQuality(page, 'standard');
        await page.getByRole('tab', { name: '꾸미기', exact: true }).click();
        const wash = page.getByRole('checkbox', { name: '모서리 색 번짐', exact: true });
        const watermark = page.getByRole('checkbox', { name: '주 직업 워터마크', exact: true });
        const base = await exportPng(page);
        await wash.check(); const withWash = await exportPng(page);
        await wash.uncheck(); await watermark.check(); const withMark = await exportPng(page);
        await wash.check(); const both = await exportPng(page);
        const size = await nativeSize(page);
        const bodyTop = layout === 'header' ? 280 : 0;
        const areas = [{ x: size.width - 60, y: bodyTop + 8, width: 40, height: 20 }, { x: size.width - 190, y: size.height - 245, width: 170, height: 170 }, { x: 30, y: 30, width: 100, height: 100 }];
        const [a, b, c, d] = await Promise.all([base, withWash, withMark, both].map(result => pixels(page, result.png, areas)));
        expect(changed(a[0], b[0])).toBeGreaterThan(100);
        expect(changed(a[1], c[1])).toBeGreaterThan(100);
        expect(changed(c[0], d[0])).toBeGreaterThan(100);
        expect(changed(b[1], d[1])).toBeGreaterThan(100);
        for (const result of [b, c, d]) expect(changed(a[2], result[2])).toBe(0);
        const iconAreas = await page.locator('#card-preview').evaluate(card => {
            const root = card.getBoundingClientRect(), scale = root.width / (card as HTMLElement).offsetWidth;
            return ['.sheet-emblem-icon', '.sheet-job-icon'].map(selector => {
                const rect = card.querySelector(selector)!.getBoundingClientRect();
                return { x: (rect.x - root.x) / scale, y: (rect.y - root.y) / scale, width: Math.floor(rect.width / scale), height: Math.floor(rect.height / scale) };
            });
        });
        const hideInk = await page.addStyleTag({ content: '.sheet-ink-texture { display:none !important; }' });
        const plainInk = await exportPng(page);
        const [printedIcons, plainIcons] = await Promise.all([both, plainInk].map(result => pixels(page, result.png, iconAreas)));
        expect(changed(printedIcons[0], plainIcons[0])).toBeGreaterThan(50);
        expect(changed(printedIcons[1], plainIcons[1])).toBeGreaterThan(10);
        await hideInk.evaluate(el => el.remove());
        // Real image backgrounds must be embedded in PNG, not disappear as pseudo-elements.
        const hide = await page.addStyleTag({ content: '.sheet-paper-texture,.sheet-ink-texture { display:none !important; }' });
        const untextured = await exportPng(page);
        const [plainBody] = await pixels(page, untextured.png, [{ x: layout === 'header' ? 8 : 328, y: bodyTop + 8, width: 100, height: 100 }]);
        const [printedBody] = await pixels(page, both.png, [{ x: layout === 'header' ? 8 : 328, y: bodyTop + 8, width: 100, height: 100 }]);
        expect(changed(plainBody, printedBody)).toBeGreaterThan(100);
        await hide.evaluate(el => el.remove());
        await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
        await page.reload();
        await expect(page.locator('.sheet-corner-wash')).toHaveCount(1);
        await expect(page.locator('.sheet-job-watermark')).toHaveCSS('mask-image', /BST\.svg/);
        await page.getByRole('tab', { name: '직업', exact: true }).click();
        await page.getByRole('combobox', { name: '마수조련사 · 주 직업 선택', exact: true }).click();
        await page.getByRole('option', { name: '나이트', exact: true }).click();
        await expect(page.locator('.sheet-job-watermark')).toHaveCSS('mask-image', /PLD\.svg/);
    });
}

test('background controls explain main-job requirement in every language', async ({ page }) => {
    await seed(page, { jobs: [], mainJob: undefined, jobWatermark: false });
    await page.getByRole('tab', { name: '꾸미기', exact: true }).click();
    await expect(page.getByRole('checkbox', { name: '주 직업 워터마크', exact: true })).toBeDisabled();
    await expect(page.getByText('직업 탭에서 주 직업을 먼저 선택하세요.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'EN 언어', exact: true }).click();
    await expect(page.getByRole('checkbox', { name: 'Main job watermark', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: 'JA language', exact: true }).click();
    await expect(page.getByRole('checkbox', { name: 'メインジョブの透かし', exact: true })).toBeDisabled();
});
