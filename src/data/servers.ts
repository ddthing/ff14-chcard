import type { Region } from '../types';

export const REGIONS: Region[] = ['KR', 'Global'];

export const DATA_CENTERS: Record<Region, string[]> = {
    KR: ['Korea'],
    Global: [
        'Aether (NA)', 'Primal (NA)', 'Crystal (NA)', 'Dynamis (NA)',
        'Chaos (EU)', 'Light (EU)',
        'Materia (OCE)',
        'Elemental (JP)', 'Gaia (JP)', 'Mana (JP)', 'Meteor (JP)'
    ]
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
