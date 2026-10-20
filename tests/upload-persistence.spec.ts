import { expect, test, type Page } from '@playwright/test';
import { readStoredValue, seed, writeStoredValue } from './helpers';

const PNG_CRC_TABLE = Uint32Array.from({ length: 256 }, (_, value) => {
    let crc = value;
    for (let bit = 0; bit < 8; bit++) crc = (crc & 1) ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    return crc >>> 0;
});

function makeLargePngDataUrl(size = 11 * 1024 * 1024) {
    // A valid 1x1 PNG with a large ancillary text chunk exercises the old
    // localStorage quota failure without requiring a giant decoded bitmap.
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/pLsAAAAASUVORK5CYII=', 'base64');
    let insertionOffset = 8;
    while (insertionOffset < png.length && png.toString('ascii', insertionOffset + 4, insertionOffset + 8) !== 'IEND') {
        insertionOffset += 12 + png.readUInt32BE(insertionOffset);
    }
    const prefix = Buffer.from('Comment\0', 'ascii');
    const data = Buffer.alloc(Math.max(0, size - png.length - 12), 0x41);
    prefix.copy(data);
    const type = Buffer.from('tEXt', 'ascii');
    let crc = 0xffffffff;
    for (const byte of Buffer.concat([type, data])) crc = PNG_CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    const chunk = Buffer.allocUnsafe(12 + data.length);
    chunk.writeUInt32BE(data.length, 0);
    type.copy(chunk, 4);
    data.copy(chunk, 8);
    chunk.writeUInt32BE((crc ^ 0xffffffff) >>> 0, 8 + data.length);
    return `data:image/png;base64,${Buffer.concat([png.subarray(0, insertionOffset), chunk, png.subarray(insertionOffset)]).toString('base64')}`;
}

async function holdIndexedDbOpen(page: Page, legacyProfile?: Record<string, unknown>) {
    await page.addInitScript(profileValue => {
        const debug = window as typeof window & { __idbOpenCalled?: boolean; __idbOpenArrived?: boolean; __releaseIDBOpen?: () => void };
        if (profileValue) localStorage.setItem('ff14-playerInfo', JSON.stringify(profileValue));
        const nativeOpen = indexedDB.open.bind(indexedDB);
        let held = false;
        Object.defineProperty(indexedDB, 'open', { configurable: true, value: (...args: Parameters<IDBFactory['open']>) => {
            debug.__idbOpenCalled = true;
            const request = nativeOpen(...args);
            if (held || args[0] !== 'ff14-chcard-storage') return request;
            held = true;
            const descriptor = Object.getOwnPropertyDescriptor(IDBRequest.prototype, 'onsuccess');
            if (descriptor?.set && descriptor.get) {
                Object.defineProperty(request, 'onsuccess', {
                    configurable: true,
                    get: () => descriptor.get!.call(request),
                    set: handler => descriptor.set!.call(request, typeof handler === 'function' ? function (event) {
                        debug.__idbOpenArrived = true;
                        debug.__releaseIDBOpen = () => handler.call(request, event);
                    } : handler),
                });
            }
            return request;
        }});
    }, legacyProfile);
}

async function releaseIndexedDbOpen(page: Page) {
    await page.evaluate(() => (window as typeof window & { __releaseIDBOpen?: () => void }).__releaseIDBOpen?.());
}

test.beforeEach(async ({ page }) => {
    await page.route('https://cdn.jsdelivr.net/**', route => route.abort());
});

test('large original profile media is saved byte-for-byte in IndexedDB and reloads without a quota warning', async ({ page }) => {
    const image = makeLargePngDataUrl();
    const legacy = {
        name: 'Large image profile', region: 'KR', server: 'Chocobo', dataCenter: 'Korea', mainJob: 'BST',
        jobs: ['BST'], jobLevels: { BST: 50 }, playstyles: ['screenshots'], activeTime: 'evenings',
        comment: 'keep every field', pointColor: '#7c3aed', language: 'en', font: 'font-pretendard',
        isSprout: true, cornerWash: false, jobWatermark: false, image,
        stickers: [{ id: 'large-media-sticker', url: image, x: 42, y: 61, scale: 1.2, rotation: 7 }],
    };
    await page.goto('/');
    await expect(page.locator('#card-preview')).toBeVisible();
    await writeStoredValue(page, 'currentProfile', legacy);
    await page.reload();
    await expect(page.locator('#card-preview')).toBeVisible();
    await expect(page.locator('.studio-persistence-notice')).toHaveCount(0);

    await expect.poll(async () => (await readStoredValue<Record<string, unknown>>(page, 'currentProfile'))?.image).toBe(image);
    const saved = await readStoredValue<Record<string, unknown>>(page, 'currentProfile');
    expect(saved).toMatchObject({ ...legacy, image });
    await expect(page.locator('input[name="character-name"]')).toHaveValue('Large image profile');
    await page.locator('input[name="character-name"]').fill('Changed text with large photo');
    await expect.poll(async () => (await readStoredValue<Record<string, unknown>>(page, 'currentProfile'))?.name).toBe('Changed text with large photo');
    await page.reload();
    await expect(page.locator('#card-preview')).toBeVisible();
    const reloaded = await readStoredValue<Record<string, unknown>>(page, 'currentProfile');
    expect(reloaded?.image).toBe(image);
    expect(reloaded?.stickers).toEqual(legacy.stickers);
    await expect(page.getByRole('alert')).toHaveCount(0);
});

test('legacy profile and slots migrate with every field and media value intact', async ({ page }) => {
    const media = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="#123456"/></svg>').toString('base64');
    const legacy = {
        name: 'Migrated profile', region: 'KR', server: 'Chocobo', dataCenter: 'Korea', mainJob: 'BST',
        jobs: ['BST'], jobLevels: { BST: 50 }, playstyles: ['screenshots'], activeTime: 'evenings',
        comment: 'all fields survive', pointColor: '#7c3aed', language: 'ko', font: 'font-pretendard',
        isSprout: true, cornerWash: false, jobWatermark: true, image: media,
        stickers: [{ id: 'legacy-sticker', url: media, x: 42, y: 61, scale: 1.2, rotation: 7 }],
    };
    const oldSlots = [{ id: 'legacy-slot-id', name: 'Legacy slot', date: '2024-03-04', data: legacy }];
    await page.addInitScript(({ profileValue, slotsValue }) => {
        localStorage.setItem('ff14-playerInfo', JSON.stringify(profileValue));
        localStorage.setItem('ff14-chcard-slots', JSON.stringify(slotsValue));
    }, { profileValue: legacy, slotsValue: oldSlots });
    await page.goto('/');
    await expect(page.locator('#card-preview')).toBeVisible();
    await page.locator('#profile-tab-slot').click();
    await expect.poll(async () => (await readStoredValue<Record<string, unknown>>(page, 'currentProfile'))?.image).toBe(media);
    await expect.poll(async () => (await readStoredValue<Array<{ id: string }>>(page, 'slots'))?.length).toBe(1);
    expect(await readStoredValue<Record<string, unknown>>(page, 'currentProfile')).toMatchObject(legacy);
    expect((await readStoredValue<Array<{ id: string; name: string; data: Record<string, unknown> }>>(page, 'slots'))?.[0]).toMatchObject({
        id: 'legacy-slot-id', name: 'Legacy slot', data: { image: media, stickers: legacy.stickers, comment: legacy.comment },
    });
    await page.reload();
    await expect(page.locator('input[name="character-name"]')).toHaveValue('Migrated profile');
    await page.locator('#profile-tab-slot').click();
    expect((await readStoredValue<Array<{ data: Record<string, unknown> }>>(page, 'slots'))?.[0].data.image).toBe(media);
});

test('editor waits for IndexedDB hydration before showing migrated legacy data', async ({ page }) => {
    const legacy = { name: 'Hydrated before paint', language: 'ko', comment: 'no blank overwrite' };
    await holdIndexedDbOpen(page, legacy);
    await page.goto('/');
    await expect(page.getByRole('status')).toContainText(/Loading page|페이지를 불러오는 중/);
    await expect(page.locator('#card-preview')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __idbOpenArrived?: boolean }).__idbOpenArrived)).toBe(true);
    await releaseIndexedDbOpen(page);
    await expect(page.locator('input[name="character-name"]')).toHaveValue('Hydrated before paint', { timeout: 5000 });
    await expect.poll(async () => (await readStoredValue<Record<string, unknown>>(page, 'currentProfile'))?.name).toBe('Hydrated before paint');
});

test('public privacy route remains available while profile hydration is pending', async ({ page }) => {
    await holdIndexedDbOpen(page);
    await page.goto('/privacy');
    await expect(page.locator('#main-content h1')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __idbOpenArrived?: boolean }).__idbOpenArrived)).toBe(true);
    await releaseIndexedDbOpen(page);
});

test('rapid profile edits serialize so the latest value survives reload', async ({ page }) => {
    await seed(page);
    const name = page.locator('input[name="character-name"]');
    await name.fill('First queued edit');
    await name.fill('Second queued edit');
    await name.fill('Latest serialized edit');
    await expect.poll(async () => (await readStoredValue<Record<string, unknown>>(page, 'currentProfile'))?.name).toBe('Latest serialized edit');
    await page.reload();
    await expect(name).toHaveValue('Latest serialized edit');
});

test('upload apply and crop cancel both clear transient rows and leave one usable image control', async ({ page }) => {
    await seed(page);
    const upload = page.locator('[data-tour="image-upload"]');
    const input = upload.locator('input[type="file"]');
    const svg = {
        name: 'portrait.svg', mimeType: 'image/svg+xml',
        buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="700" height="280"><rect width="700" height="280" fill="#176b57"/></svg>'),
    };

    await input.setInputFiles(svg);
    const crop = page.getByRole('dialog');
    await expect(crop).toBeVisible();
    await crop.getByRole('button', { name: '취소', exact: true }).last().click();
    await expect(crop).toHaveCount(0);
    await expect(upload.locator('.u032-row')).toHaveCount(0);
    await expect(page.locator('.u032-row')).toHaveCount(0);

    await input.setInputFiles(svg);
    const apply = page.getByRole('dialog').getByRole('button', { name: '적용하기', exact: true });
    await expect(apply).toBeEnabled();
    await apply.click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(upload.locator('.u032-row')).toHaveCount(0);
    await expect(page.locator('.u032-row')).toHaveCount(0);
    await expect(upload.locator('.u032-zone')).toHaveCount(0);
    await expect(upload.locator('button[aria-label="이미지 업로드"]')).toBeVisible();
    await upload.getByRole('button', { name: '삭제', exact: true }).click();
    await expect(upload.locator('.u032-zone')).toHaveCount(1);
    await expect(upload.locator('.u032-row')).toHaveCount(0);
});

test('large-photo slot backup export and import preserve media through reload', async ({ page }) => {
    const image = makeLargePngDataUrl();
    const profileValue = { name: 'Photo owner', language: 'ko', image, jobs: [], jobLevels: {}, stickers: [] };
    await page.goto('/');
    await expect(page.locator('#card-preview')).toBeVisible();
    await writeStoredValue(page, 'currentProfile', profileValue);
    await page.reload();
    await expect(page.locator('#card-preview')).toBeVisible();
    await page.locator('#profile-tab-slot').click();
    await expect(page.getByRole('button', { name: '저장', exact: true })).toBeEnabled();
    await page.getByRole('textbox', { name: '슬롯 이름', exact: true }).fill('Large photo slot');
    await page.getByRole('button', { name: '저장', exact: true }).click();
    await expect(page.getByText('Large photo slot', { exact: true })).toBeVisible();

    const downloadReady = page.waitForEvent('download');
    await page.getByRole('button', { name: '백업 내보내기', exact: true }).click();
    const download = await downloadReady;
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
    const backup = Buffer.concat(chunks);
    const parsed = JSON.parse(backup.toString('utf8')) as { slots: Array<{ data: { image?: string } }> };
    expect(parsed.slots[0]?.data.image).toBe(image);

    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: /Large photo slot 삭제/ }).click();
    await expect(page.getByText('Large photo slot', { exact: true })).toHaveCount(0);
    page.once('dialog', dialog => dialog.accept());
    await page.locator('input[aria-label="백업 가져오기"]').setInputFiles({
        name: 'large-photo-backup.json', mimeType: 'application/json', buffer: backup,
    });
    await expect(page.getByText('Large photo slot', { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.locator('#card-preview')).toBeVisible();
    const slots = await readStoredValue<Array<{ data: { image?: string } }>>(page, 'slots');
    expect(slots?.[0]?.data.image).toBe(image);
});

test('real IndexedDB and localStorage write failure shows one persistent save warning', async ({ page }) => {
    const image = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="#123456"/></svg>').toString('base64');
    const legacyProfile = { name: 'Read-only legacy profile', language: 'ko', image, jobs: [], jobLevels: {}, stickers: [] };
    const legacySlots = [{ id: 'readable-slot', name: 'Known slot', date: '2024-03-04', data: legacyProfile }];
    await page.addInitScript(({ profileValue, slotsValue }) => {
        localStorage.setItem('ff14-playerInfo', JSON.stringify(profileValue));
        localStorage.setItem('ff14-chcard-slots', JSON.stringify(slotsValue));
        indexedDB.open = (() => { throw new DOMException('blocked', 'SecurityError'); }) as typeof indexedDB.open;
        const originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key: string, value: string) {
            if (key === 'ff14-playerInfo') throw new DOMException('quota', 'QuotaExceededError');
            return originalSetItem.call(this, key, value);
        };
    }, { profileValue: legacyProfile, slotsValue: legacySlots });
    await page.goto('/');
    const name = page.locator('input[name="character-name"]');
    await name.fill('First edit');
    const warning = page.getByRole('alert');
    await expect(warning).toBeVisible();
    await name.fill('Second edit');
    await expect(page.getByRole('alert')).toHaveCount(1);
    await expect(warning).toContainText(/저장|storage|quota/i);

    await page.locator('#profile-tab-slot').click();
    const exportButton = page.getByRole('button', { name: '백업 내보내기', exact: true });
    await expect(exportButton).toBeEnabled();
    const downloadReady = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadReady;
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
    const backup = JSON.parse(Buffer.concat(chunks).toString('utf8')) as {
        currentProfile: { name: string; image?: string };
        slots: Array<{ id: string; name: string; data: { image?: string } }>;
    };
    expect(backup.currentProfile).toMatchObject({ name: 'Second edit', image });
    expect(backup.slots[0]).toMatchObject({ id: 'readable-slot', name: 'Known slot', data: { image } });
    await expect(page.getByRole('alert')).toHaveCount(1);
});
