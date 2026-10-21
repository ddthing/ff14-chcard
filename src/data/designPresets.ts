import type { PlayerInfo } from '../types';

type DesignSettings = Required<Pick<PlayerInfo, 'pointColor' | 'font' | 'layout' | 'cornerWash' | 'jobWatermark'>>;

export interface DesignPreset {
    id: 'editorial' | 'nocturne' | 'botanica' | 'archive';
    settings: DesignSettings;
}

// A preset is deliberately limited to appearance. Profile and media never enter
// this object, so applying a look also remains one reversible history action.
export const DESIGN_PRESETS: readonly DesignPreset[] = [
    { id: 'editorial', settings: { pointColor: '#ac6244', font: 'font-myungjo', layout: 'header', cornerWash: true, jobWatermark: false } },
    { id: 'nocturne', settings: { pointColor: '#354e73', font: 'font-pretendard', layout: 'left-portrait', cornerWash: true, jobWatermark: true } },
    { id: 'botanica', settings: { pointColor: '#537364', font: 'font-pretendard', layout: 'header', cornerWash: true, jobWatermark: true } },
    { id: 'archive', settings: { pointColor: '#6d6259', font: 'font-cloudsanscode', layout: 'left-portrait', cornerWash: false, jobWatermark: false } },
];

export function matchesDesignPreset(player: PlayerInfo, preset: DesignPreset): boolean {
    const { settings } = preset;
    return player.pointColor.toLowerCase() === settings.pointColor
        && player.font === settings.font
        && (player.layout ?? 'header') === settings.layout
        && Boolean(player.cornerWash) === settings.cornerWash
        && Boolean(player.jobWatermark) === settings.jobWatermark;
}
