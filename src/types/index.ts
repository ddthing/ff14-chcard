export type Region = 'KR' | 'Global';
export type Language = 'ko' | 'en' | 'ja';

export interface Job {
    id: string;
    name: string; // Internal name / logic name
    nameKr: string; // Korean display name
    nameEn: string; // English display name / Global
    nameJa: string; // Japanese display name
    role: 'Tank' | 'Healer' | 'Melee' | 'Physical Ranged' | 'Magical Ranged' | 'Limited' | 'Crafting' | 'Gathering';
    iconUrl: string;
}

export interface PlayerInfo {
    name: string;
    region: Region;
    dataCenter: string;
    server: string;
    jobs: string[]; // Job IDs
    playstyles: string[]; // Playstyle tags
    activeTime: string; // e.g. "평일 저녁 / 주말 상시"
    comment: string;
    image?: string; // base64 or object URL
    font: string;
    mainJob?: string; // Job ID of the main job
    isNicknameChanged: boolean; // 인게임과 다른 닉네임 여부
    isSprout: boolean;
    isMentor: boolean;
    jobLevels: Record<string, number>; // Job ID -> Level mapping
    imagePosition?: { x: number; y: number; scale: number };
    layout?: 'header' | 'left-portrait';
    language: Language;
    pointColor: string;
}
