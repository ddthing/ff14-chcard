import { normalizePlayerInfo } from './playerData';

export const MAX_BACKUP_BYTES = 20 * 1024 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Validate the complete envelope before replacing any existing local data. */
export function parseProfileBackup(value: unknown) {
    if (!isRecord(value) || value.format !== 'ff14-chcard-backup' || value.version !== 1
        || !Array.isArray(value.slots)
        || (value.currentProfile !== undefined && !isRecord(value.currentProfile))) {
        throw new Error('Invalid backup');
    }

    const ids = new Set<string>();
    const slots = value.slots.map((slot, index) => {
        if (!isRecord(slot) || !isRecord(slot.data)) throw new Error('Invalid backup slot');
        let id = typeof slot.id === 'string' && slot.id ? slot.id : `imported-slot-${index}`;
        while (ids.has(id)) id = `${id}-${index}`;
        ids.add(id);
        return {
            id,
            name: typeof slot.name === 'string' && slot.name.trim() ? slot.name.trim() : `Slot ${index + 1}`,
            date: typeof slot.date === 'string' ? slot.date : '',
            data: normalizePlayerInfo(slot.data),
        };
    });

    return {
        slots,
        currentProfile: value.currentProfile === undefined ? undefined : normalizePlayerInfo(value.currentProfile),
    };
}
