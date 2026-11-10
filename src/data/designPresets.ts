import type { CardFinish, PlayerInfo } from '../types';

type DesignSettings = Required<Pick<PlayerInfo, 'pointColor' | 'font' | 'layout' | 'cornerWash' | 'jobWatermark' | 'cardFinish'>>;

export interface DesignPreset {
    id: CardFinish;
    settings: DesignSettings;
}

// A preset is deliberately limited to appearance. Profile and media never enter
// this object, so applying a look also remains one reversible history action.
export const DESIGN_PRESETS: readonly DesignPreset[] = [
    { id: 'editorial', settings: { cardFinish: 'editorial', pointColor: '#ac6244', font: 'font-myungjo', layout: 'header', cornerWash: true, jobWatermark: false } },
    { id: 'nocturne', settings: { cardFinish: 'nocturne', pointColor: '#354e73', font: 'font-pretendard', layout: 'left-portrait', cornerWash: true, jobWatermark: true } },
    { id: 'botanica', settings: { cardFinish: 'botanica', pointColor: '#537364', font: 'font-pretendard', layout: 'header', cornerWash: true, jobWatermark: true } },
    { id: 'archive', settings: { cardFinish: 'archive', pointColor: '#6d6259', font: 'font-cloudsanscode', layout: 'left-portrait', cornerWash: false, jobWatermark: false } },
];

export const CARD_FINISH_PAPER: Record<CardFinish, string> = {
    editorial: '#f8f1e7',
    nocturne: '#18212f',
    botanica: '#eef3e9',
    archive: '#f4f3ef',
};

export function isCardFinish(value: unknown): value is CardFinish {
    return typeof value === 'string' && Object.hasOwn(CARD_FINISH_PAPER, value);
}

export function matchesDesignPreset(player: PlayerInfo, preset: DesignPreset): boolean {
    const { settings } = preset;
    return player.pointColor.toLowerCase() === settings.pointColor
        && player.font === settings.font
        && (player.layout ?? 'header') === settings.layout
        && Boolean(player.cornerWash) === settings.cornerWash
        && Boolean(player.jobWatermark) === settings.jobWatermark
        && player.cardFinish === settings.cardFinish;
}
