import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { seed, profile, exportPng, pixels } from './helpers';

const PNG_CRC_TABLE = Uint32Array.from({ length: 256 }, (_, value) => {
    let crc = value;
    for (let bit = 0; bit < 8; bit++) crc = (crc & 1) ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    return crc >>> 0;
});

function makePngChunk(type: string, data: Buffer) {
    const typeBytes = Buffer.from(type, 'ascii');
    let crc = 0xffffffff;
    for (const byte of typeBytes) crc = PNG_CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    for (const byte of data) crc = PNG_CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    const chunk = Buffer.allocUnsafe(12 + data.length);
    chunk.writeUInt32BE(data.length, 0);
    typeBytes.copy(chunk, 4);
    data.copy(chunk, 8);
    chunk.writeUInt32BE((crc ^ 0xffffffff) >>> 0, 8 + data.length);
    return chunk;
}

function addLargeTextChunk(png: Buffer) {
    let insertionOffset = 8;
    while (insertionOffset < png.length) {
        const length = png.readUInt32BE(insertionOffset);
        if (png.toString('ascii', insertionOffset + 4, insertionOffset + 8) === 'IEND') break;
        insertionOffset += 12 + length;
    }
    if (insertionOffset >= png.length) throw new Error('PNG is missing its IEND chunk');

    const prefix = Buffer.from('Comment\0', 'ascii');
    const data = Buffer.alloc(10 * 1024 * 1024 + 1 - png.length - 12, 0x41);
    prefix.copy(data);
    const chunk = makePngChunk('tEXt', data);
    return Buffer.concat([png.subarray(0, insertionOffset), chunk, png.subarray(insertionOffset)]);
}

test.beforeEach(async ({ page }) => { await page.route('https://cdn.jsdelivr.net/**', route => route.abort()); });

test('profile changes and a collection persist without losing content', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: '닉네임', exact: true }).fill('빛의 모험가');
    await page.getByRole('combobox', { name: '서버 선택', exact: true }).selectOption({ index: 1 });
    await page.getByRole('tab', { name: '꾸미기', exact: true }).click();
    await page.getByRole('button', { name: '보태니컬', exact: true }).click();
    await expect(page.locator('.sheet-name')).toHaveText('빛의 모험가');
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.reload();
    await expect(page.getByRole('textbox', { name: '닉네임', exact: true })).toHaveValue('빛의 모험가');
    await expect(page.locator('#card-preview')).toHaveAttribute('data-layout', 'left-portrait');
    await expect(page.getByRole('button', { name: '실행 취소', exact: true })).toBeDisabled();
});
test('primary tabs support arrows, Home and End with one active tab stop', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: '기본', exact: true }).focus();
    await page.keyboard.press('ArrowRight'); await expect(page.getByRole('tab', { name: '직업', exact: true })).toBeFocused();
    await page.keyboard.press('End'); await expect(page.getByRole('tab', { name: '저장', exact: true })).toBeFocused();
    await page.keyboard.press('Home'); await expect(page.getByRole('tab', { name: '기본', exact: true })).toBeFocused();
    await expect(page.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
});
test('mobile shortcuts and every editor tab fit narrow viewports', async ({ page }) => {
    await seed(page);
    for (const width of [320, 390, 768]) {
        await page.setViewportSize({ width, height: 844 });
        for (const id of ['basic', 'job', 'style', 'design', 'slot']) {
            await page.locator('#profile-tab-' + id).click();
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    const nav = page.getByRole('navigation', { name: '캐릭터 카드 스튜디오', exact: true });
    await nav.getByRole('button', { name: '미리보기', exact: true }).click(); await expect(page.locator('#preview-panel')).toBeFocused();
    await nav.getByRole('button', { name: '편집', exact: true }).click(); await expect(page.locator('#editor-panel')).toBeFocused();
});
test('all locales update the document, controls and creation credit', async ({ page }) => {
    await seed(page);
    await expect(page.locator('.sheet-credit > span')).toHaveText('제작:');
    await page.getByRole('button', { name: 'EN 언어', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.sheet-credit > span')).toHaveText('Created by');
    await page.getByRole('button', { name: 'JA language', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('.sheet-credit > span')).toHaveText('制作:');
});
test('Beastmaster has a real path SVG, cap 50 and remains last even as main job', async ({ page }) => {
    await seed(page);
    await page.getByRole('tab', { name: '직업', exact: true }).click();
    const level = page.getByRole('spinbutton', { name: '마수조련사 직업 레벨', exact: true });
    await expect(level).toHaveAttribute('max', '50');
    await level.fill('99'); await expect(level).toHaveValue('50');
    await page.getByRole('button', { name: '전투 만렙', exact: true }).click();
    await expect(page.getByRole('spinbutton', { name: '청마도사 직업 레벨', exact: true })).toHaveValue('80');
    await expect(level).toHaveValue('50');
    await expect(page.locator('[data-job-type="battle"] [role="listitem"]').last().getByRole('img')).toHaveAttribute('alt', '마수조련사');
    await expect(page.locator('.sheet-emblem-icon')).toHaveCSS('mask-image', /BST\.svg/);
    const svg = await (await page.request.get('/icons/BST.svg')).text();
    expect(svg).toContain('<path'); expect(svg).not.toMatch(/<image|data:image|<filter/);
    await expect(page.locator('.sheet-signature')).toContainText('ccard.ffxiv.world');
});
test('selected sticker exports at every quality with its image and without blue handles', async ({ page }) => {
    const url = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#ff00ff"/></svg>').toString('base64');
    await seed(page, { name: 'Export / test', stickers: [{ id: 'test', url, x: 50, y: 50, scale: 1, rotation: 0 }] });
    await page.locator('#card-preview').getByRole('button', { name: '스티커 1', exact: true }).click();
    for (const ratio of [1, 2, 3]) {
        await page.getByLabel('저장 품질', { exact: true }).selectOption(String(ratio));
        const result = await exportPng(page);
        expect(result.filename).toBe('ff14-Export - test.png');
        const [center] = await pixels(page, result.png, [{ x: result.width / 2, y: result.height / 2, width: 1, height: 1 }]);
        expect(center).toEqual([255, 0, 255, 255]);
        const blue = await page.evaluate(async encoded => {
            const image = await createImageBitmap(new Blob([Uint8Array.from(atob(encoded), c => c.charCodeAt(0))], { type: 'image/png' }));
            const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
            const ctx = canvas.getContext('2d')!; ctx.drawImage(image, 0, 0);
            const data = ctx.getImageData(0, 0, image.width, image.height).data;
            let count = 0;
            for (let i = 0; i < data.length; i += 4) if (data[i] === 0 && data[i + 1] === 113 && data[i + 2] === 227) count++;
            return count;
        }, result.png.toString('base64'));
        expect(blue).toBe(0);
    }
});
test('crop dialog lives outside the scaled card, restores focus and applies a photo', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const input = page.locator('input[type="file"][aria-label="이미지 업로드"]');
    const buffer = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="700" height="280"><rect width="700" height="280" fill="#1c4638"/></svg>');
    await input.setInputFiles({ name: 'photo.svg', mimeType: 'image/svg+xml', buffer });
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate(el => el.closest('#card-preview') === null)).toBe(true);
    await expect(page.locator('#root')).toHaveAttribute('inert', '');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('button', { name: '이미지 업로드', exact: true }).last()).toBeFocused();
    await input.setInputFiles({ name: 'photo.svg', mimeType: 'image/svg+xml', buffer });
    await page.getByRole('button', { name: '적용하기', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('#card-preview .sheet-image > img')).toBeVisible();
    await expect(page.locator('#root')).not.toHaveAttribute('inert', '');
});
test('all editor tabs pass automated WCAG AA checks in both themes', async ({ page }) => {
    await seed(page);
    for (const dark of [false, true]) {
        if (dark) await page.getByRole('button', { name: '다크 모드로 변경', exact: true }).click();
        for (const id of ['basic', 'job', 'style', 'design', 'slot']) {
            await page.locator('#profile-tab-' + id).click();
            const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
            expect(result.violations, id + '/' + dark).toEqual([]);
        }
    }
});
test('JSON backup includes effects and imports normalize invalid jobs and level caps', async ({ page }) => {
    await seed(page);
    await page.getByRole('tab', { name: '저장', exact: true }).click();
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: '백업 내보내기', exact: true }).click();
    const stream = await (await pending).createReadStream(); const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
    const backup = JSON.parse(Buffer.concat(chunks).toString());
    expect(backup.currentProfile.cornerWash).toBe(true); expect(backup.currentProfile.jobWatermark).toBe(true);
    const imported = { format: 'ff14-chcard-backup', version: 1, slots: [], currentProfile: { ...profile, name: '복원', jobs: ['BST', 'UNKNOWN'], jobLevels: { BST: 99 }, cornerWash: 'yes' } };
    page.on('dialog', dialog => dialog.accept());
    await page.getByLabel('백업 가져오기', { exact: true }).setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) });
    await expect(page.locator('.sheet-name')).toHaveText('복원');
    await expect(page.locator('.sheet-job')).toHaveCount(1);
    await expect(page.locator('.sheet-mainjob-level > strong')).toHaveText('50');
    await expect(page.locator('.sheet-corner-wash')).toHaveCount(0);
    await expect(page.locator('.sheet-job-watermark')).toHaveCount(1);
});
test('image validation rejects invalid files and accepts a valid PNG over 10 MiB through crop and export', async ({ page }) => {
    await seed(page);
    const input = page.locator('input[type="file"][aria-label="이미지 업로드"]');
    await input.setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
    await expect(page.getByRole('alert')).toHaveText('이미지 파일만 업로드할 수 있습니다.');
    await input.setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not a PNG image') });
    await expect(page.getByRole('alert')).toHaveText('이미지를 읽지 못했습니다. 다른 파일을 선택해주세요.');
    await expect(page.locator('#card-preview .sheet-image > img')).toHaveCount(1);

    const pngBytes = await page.evaluate(async () => {
        const canvas = document.createElement('canvas'); canvas.width = 700; canvas.height = 280;
        const context = canvas.getContext('2d')!; context.fillStyle = '#244b37'; context.fillRect(0, 0, 700, 280);
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(image => image ? resolve(image) : reject(new Error('PNG encode failed')), 'image/png'));
        return Array.from(new Uint8Array(await blob.arrayBuffer()));
    });
    const largePng = addLargeTextChunk(Buffer.from(pngBytes));
    expect(largePng.length).toBeGreaterThan(10 * 1024 * 1024);
    await input.setInputFiles({ name: 'high-quality.png', mimeType: 'image/png', buffer: largePng });
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const workingImage = dialog.locator('img').first();
    await expect(workingImage).toHaveAttribute('src', /^data:image\/png/);
    expect((await workingImage.getAttribute('src'))?.length).toBeLessThan(50_000);
    await dialog.getByRole('button', { name: '적용하기', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('#card-preview .sheet-image > img')).toBeVisible();
    const output = await exportPng(page);
    expect(output.png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(output.width).toBeGreaterThan(0);
    expect(output.height).toBeGreaterThan(0);
});

test('small compressed JPEGs keep their original bytes in the cropper', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[type="file"][aria-label="이미지 업로드"]');
    const { jpegDataUrl, pngDataUrl } = await page.evaluate(() => {
        const canvas = document.createElement('canvas'); canvas.width = 1000; canvas.height = 600;
        const context = canvas.getContext('2d')!;
        const image = context.createImageData(canvas.width, canvas.height);
        let state = 0x12345678;
        for (let i = 0; i < image.data.length; i += 4) {
            state ^= state << 13;
            state ^= state >>> 17;
            state ^= state << 5;
            image.data[i] = state & 0xff;
            image.data[i + 1] = (state >>> 8) & 0xff;
            image.data[i + 2] = (state >>> 16) & 0xff;
            image.data[i + 3] = 0xff;
        }
        context.putImageData(image, 0, 0);
        return { jpegDataUrl: canvas.toDataURL('image/jpeg', 0.92), pngDataUrl: canvas.toDataURL('image/png') };
    });
    const jpegBytes = Buffer.from(jpegDataUrl.slice(jpegDataUrl.indexOf(',') + 1), 'base64');
    const pngBytes = Buffer.from(pngDataUrl.slice(pngDataUrl.indexOf(',') + 1), 'base64');
    expect(jpegBytes.length).toBeLessThan(10 * 1024 * 1024);
    expect(pngBytes.length).toBeGreaterThan(jpegBytes.length * 2);

    await input.setInputFiles({ name: 'compressed-photo.jpg', mimeType: 'image/jpeg', buffer: jpegBytes });
    const workingImage = page.getByRole('dialog').locator('img').first();
    await expect(workingImage).toHaveAttribute('src', /^data:image\/jpeg/);
    expect(await workingImage.getAttribute('src') === jpegDataUrl).toBe(true);
});

test('large source dimensions are reduced to the 3000 px crop working bound', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[type="file"][aria-label="이미지 업로드"]');
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="8000" height="4000"><rect width="8000" height="4000" fill="#244b37"/></svg>');
    await input.setInputFiles({ name: '8k-character.svg', mimeType: 'image/svg+xml', buffer: svg });
    const dialogImage = page.getByRole('dialog').locator('img').first();
    await expect.poll(() => dialogImage.evaluate(image => Math.max((image as HTMLImageElement).naturalWidth, (image as HTMLImageElement).naturalHeight))).toBe(3000);
    await expect(dialogImage).toHaveAttribute('src', /^data:image\/webp/);
});
