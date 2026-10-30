import type { Region, Language } from '../types';

export const REGIONS: Region[] = ['KR', 'Global'];

export const REGION_NAMES: Record<Language, Record<Region, string>> = {
    fr: { KR: 'Serveurs coréens', Global: 'Serveurs globaux' },
    de: { KR: 'Koreanische Server', Global: 'Globale Server' },
    'zh-Hans': { KR: '韩国服务器', Global: '全球服务器' },
    'zh-Hant': { KR: '韓國伺服器', Global: '全球伺服器' },
    ko: { KR: '한국 서버', Global: '글로벌 서버' },
    en: { KR: 'Korean Server', Global: 'Global Server' },
    ja: { KR: '韓国サーバー', Global: 'グローバルサーバー' }
};

export const DATA_CENTERS: Record<Region, string[]> = {
    KR: ['Korea'],
    Global: [
        'Aether (NA)', 'Primal (NA)', 'Crystal (NA)', 'Dynamis (NA)',
        'Chaos (EU)', 'Light (EU)',
        'Materia (OCE)',
        'Elemental (JP)', 'Gaia (JP)', 'Mana (JP)', 'Meteor (JP)'
    ]
};

const DC_DISPLAY_NAMES: Record<Language, Record<string, string>> = {
    fr: { Korea: 'Corée' }, de: { Korea: 'Korea' }, 'zh-Hans': { Korea: '韩国' }, 'zh-Hant': { Korea: '韓國' },
    ko: { 'Korea': '한국' },
    en: { 'Korea': 'Korea' },
    ja: { 'Korea': '韓国' }
};

export const WORLDS: Record<string, string[]> = {
    // Korea
    'Korea': ['카벙클', '초코보', '모그리', '톤베리', '펜리르'],

    // NA
    'Aether (NA)': ['Adamantoise', 'Cactuar', 'Faerie', 'Gilgamesh', 'Jenova', 'Midgardsormr', 'Sargatanas', 'Siren'],
    'Primal (NA)': ['Behemoth', 'Excalibur', 'Exodus', 'Famfrit', 'Hyperion', 'Lamia', 'Leviathan', 'Ultros'],
    'Crystal (NA)': ['Balmung', 'Brynhildr', 'Coeurl', 'Diabolos', 'Goblin', 'Malboro', 'Mateus', 'Zalera'],
    'Dynamis (NA)': ['Halicarnassus', 'Maduin', 'Marilith', 'Seraph', 'Cuchulainn', 'Golem', 'Kraken', 'Rafflesia'],

    // EU
    'Chaos (EU)': ['Cerberus', 'Louisoix', 'Moogle', 'Omega', 'Phantom', 'Ragnarok', 'Sagittarius', 'Spriggan'],
    'Light (EU)': ['Alpha', 'Lich', 'Odin', 'Phoenix', 'Raiden', 'Shiva', 'Twintania', 'Zodiark'],

    // OCE
    'Materia (OCE)': ['Bismarck', 'Ravana', 'Sephirot', 'Sophia', 'Zurvan'],

    // JP
    'Elemental (JP)': ['Aegis', 'Atomos', 'Carbuncle', 'Garuda', 'Gungnir', 'Kujata', 'Ramuh', 'Tonberry', 'Typhon', 'Unicorn'],
    'Gaia (JP)': ['Alexander', 'Bahamut', 'Durandal', 'Fenrir', 'Ifrit', 'Ridill', 'Tiamat', 'Ultima'],
    'Mana (JP)': ['Anima', 'Asura', 'Chocobo', 'Hades', 'Ixion', 'Masamune', 'Pandaemonium', 'Titan'],
    'Meteor (JP)': ['Belias', 'Mandragora', 'Ramuh', 'Shinryu', 'Unicorn', 'Valefor', 'Yojimbo', 'Zeromus'],
};

// Helper to get grouped worlds for the unified dropdown
export const getAllWorldsGrouped = (lang: Language) => REGIONS.map(region => ({
    region,
    regionDisplay: REGION_NAMES[lang][region],
    dataCenters: DATA_CENTERS[region].map(dc => ({
        name: dc,
        displayName: DC_DISPLAY_NAMES[lang][dc] || dc,
        worlds: WORLDS[dc] || []
    }))
}));
