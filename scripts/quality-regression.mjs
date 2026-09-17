/**
 * Browser regression checks. Run against `npm run dev` in an isolated profile:
 * await (await import('/scripts/quality-regression.mjs')).runQualityChecks()
 * Uses the real React UI and Canvas APIs; no test-only application hooks.
 */
export async function runQualityChecks() {
    const results = [];
    const check = (name, condition) => {
        if (!condition) throw new Error(`FAIL: ${name}`);
        results.push({ name, passed: true });
    };
    const settle = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
    const waitFor = async predicate => {
        for (let i = 0; i < 100; i++) {
            if (predicate()) return;
            await settle(50);
        }
        throw new Error('Timed out waiting for UI');
    };
    const click = async selector => {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Missing ${selector}`);
        element.click();
        await settle();
    };
    const upload = (selector, file) => {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        const input = document.querySelector(selector);
        input.files = transfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const { parseProfileBackup } = await import('/src/utils/profileBackup.ts');
    const { normalizePlayerInfo } = await import('/src/utils/playerData.ts');
    const { default: cropImage, createImage, rotateSize } = await import('/src/utils/cropImage.ts');

    for (const [name, payload] of [
        ['missing slots', { format: 'ff14-chcard-backup', version: 1 }],
        ['unsupported version', { format: 'ff14-chcard-backup', version: 2, slots: [] }],
        ['invalid slot', { format: 'ff14-chcard-backup', version: 1, slots: [{ data: [] }] }],
        ['invalid current profile', { format: 'ff14-chcard-backup', version: 1, slots: [], currentProfile: null }],
    ]) {
        let rejected = false;
        try { parseProfileBackup(payload); } catch { rejected = true; }
        check(`backup rejects ${name}`, rejected);
    }
    const backup = parseProfileBackup({ format: 'ff14-chcard-backup', version: 1,
        currentProfile: { name: 'Round trip', language: 'ja' },
        slots: [{ id: 'duplicate', data: {} }, { id: 'duplicate', data: {} }] });
    check('valid backup preserves profile', backup.currentProfile.name === 'Round trip' && backup.currentProfile.language === 'ja');
    check('duplicate slot IDs repaired', new Set(backup.slots.map(slot => slot.id)).size === 2);
    const profile = normalizePlayerInfo({ stickers: [
        { id: 'same', url: 'test.png', scale: Infinity, x: -20 },
        { id: 'same', url: 'test.png', y: 500 },
    ] });
    check('duplicate sticker IDs repaired', new Set(profile.stickers.map(sticker => sticker.id)).size === 2);
    check('sticker coordinates and scale bounded', profile.stickers[0].x === 0 && profile.stickers[1].y === 100 && profile.stickers[0].scale === 1);

    const fixture = document.createElement('canvas');
    fixture.width = 320; fixture.height = 240;
    const context = fixture.getContext('2d');
    context.fillStyle = '#a63727'; context.fillRect(0, 0, 320, 240);
    context.fillStyle = '#295e9b'; context.fillRect(80, 40, 160, 120);
    const source = fixture.toDataURL();
    const image = await createImage(source);
    for (const rotation of [0, 90, 180]) {
        for (const horizontal of [false, true]) {
            const crop = { x: 20, y: 30, width: 120, height: 100 };
            const reference = document.createElement('canvas');
            const bounds = rotateSize(image.width, image.height, rotation);
            reference.width = bounds.width; reference.height = bounds.height;
            const ctx = reference.getContext('2d');
            ctx.translate(bounds.width / 2, bounds.height / 2);
            ctx.rotate(rotation * Math.PI / 180); ctx.scale(horizontal ? -1 : 1, 1);
            ctx.translate(-image.width / 2, -image.height / 2); ctx.drawImage(image, 0, 0);
            const pixels = ctx.getImageData(crop.x, crop.y, crop.width, crop.height);
            reference.width = crop.width; reference.height = crop.height;
            ctx.putImageData(pixels, 0, 0);
            const actual = await cropImage(source, crop, rotation, { horizontal, vertical: false });
            check(`crop matches original pixels (${rotation}°, flip ${horizontal})`, actual === reference.toDataURL('image/webp', 0.85));
        }
    }
    let invalidCropRejected = false;
    try { await cropImage(source, { x: 0, y: 0, width: 0, height: 10 }); } catch { invalidCropRejected = true; }
    check('invalid crop reports error', invalidCropRejected);

    await click('#profile-tab-basic');
    const name = document.querySelector('input[name="character-name"]');
    const expected = `Immediate save ${Date.now()}`;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(name, expected);
    name.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();
    window.dispatchEvent(new PageTransitionEvent('pagehide'));
    check('pagehide flushes pending edit', JSON.parse(localStorage.getItem('ff14-playerInfo')).name === expected);

    const blob = await new Promise(resolve => fixture.toBlob(resolve));
    const file = new File([blob], 'quality-fixture.png', { type: 'image/png' });
    upload('#card-preview input[type="file"]', file);
    await waitFor(() => document.querySelector('[role="dialog"] .reactEasyCrop_Image'));
    await settle(350);
    const dialog = document.querySelector('[role="dialog"]');
    const rect = dialog.getBoundingClientRect();
    check('crop dialog outside transformed card', !dialog.closest('#card-preview'));
    check('crop dialog covers viewport', Math.abs(rect.width - document.documentElement.getBoundingClientRect().width) < 2 && Math.abs(rect.height - innerHeight) < 2 && rect.x === 0 && rect.y === 0);
    check('background inert while cropping', document.getElementById('root').inert);
    check('focus enters crop dialog', dialog.contains(document.activeElement));

    // Delay image decode to reproduce cancel-during-processing deterministically.
    const NativeImage = window.Image;
    const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    window.Image = function (...args) {
        const instance = new NativeImage(...args);
        Object.defineProperty(instance, 'src', {
            get() { return srcDescriptor.get.call(instance); },
            set(value) { setTimeout(() => srcDescriptor.set.call(instance, value), 150); },
        });
        return instance;
    };
    const previousImage = JSON.parse(localStorage.getItem('ff14-playerInfo')).image;
    try {
        const apply = [...dialog.querySelectorAll('button')].at(-1);
        check('crop apply ready', !apply.disabled);
        apply.click();
        await settle();
        dialog.querySelector('button').click();
        await settle(600);
        check('cancelled crop does not overwrite image', JSON.parse(localStorage.getItem('ff14-playerInfo')).image === previousImage);
        check('background restored after cancel', !document.getElementById('root').inert);
    } finally {
        window.Image = NativeImage;
    }

    await click('#profile-tab-design');
    const stickerInput = [...document.querySelectorAll('#editor-panel input[type="file"]')].at(-1);
    const sendSticker = () => {
        const transfer = new DataTransfer(); transfer.items.add(file);
        stickerInput.files = transfer.files;
        stickerInput.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const countBefore = JSON.parse(localStorage.getItem('ff14-playerInfo')).stickers.length;
    sendSticker(); sendSticker();
    await settle(700);
    const current = JSON.parse(localStorage.getItem('ff14-playerInfo'));
    check('concurrent sticker uploads preserve both', current.stickers.length === countBefore + 2);
    const sticker = document.querySelector('#card-preview button[aria-describedby^="sticker-keyboard"]');
    sticker.click(); await settle();
    check('selected sticker is included in PNG export', !sticker.querySelector('img').closest('.export-ignore'));

    await click('#profile-tab-slot');
    const slotsBefore = localStorage.getItem('ff14-chcard-slots');
    const invalidFile = new File([JSON.stringify({ format: 'ff14-chcard-backup', version: 1 })], 'invalid.json', { type: 'application/json' });
    upload('#editor-panel input[accept="application/json,.json"]', invalidFile);
    await settle(100);
    check('invalid backup leaves existing slots intact', localStorage.getItem('ff14-chcard-slots') === slotsBefore);
    check('invalid backup announces failure', !!document.querySelector('#profile-panel-slot [aria-live="assertive"]'));
    await click('#profile-tab-basic');
    return { passed: results.length, results };
}
