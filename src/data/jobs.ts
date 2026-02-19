import type { Job } from '../types';

export interface JobWithIcon extends Job {
    iconUrl: string;
}

// 아이콘 경로: public/icons/ 폴더에 업로드된 SVG 파일 사용
// Vite에서 public/ 하위는 `/` 루트로 접근 가능

export const JOBS: JobWithIcon[] = [
    // ========== TANKS ==========
    { id: 'PLD', name: 'Paladin', nameKr: '나이트', nameEn: 'Paladin', role: 'Tank', iconUrl: '/icons/나이트.svg' },
    { id: 'WAR', name: 'Warrior', nameKr: '전사', nameEn: 'Warrior', role: 'Tank', iconUrl: '/icons/전사.svg' },
    { id: 'DRK', name: 'Dark Knight', nameKr: '암흑기사', nameEn: 'Dark Knight', role: 'Tank', iconUrl: '/icons/암흑기사.svg' },
    { id: 'GNB', name: 'Gunbreaker', nameKr: '건브레이커', nameEn: 'Gunbreaker', role: 'Tank', iconUrl: '/icons/건브레이커.svg' },

    // ========== HEALERS ==========
    { id: 'WHM', name: 'White Mage', nameKr: '백마도사', nameEn: 'White Mage', role: 'Healer', iconUrl: '/icons/백마도사.svg' },
    { id: 'SCH', name: 'Scholar', nameKr: '학자', nameEn: 'Scholar', role: 'Healer', iconUrl: '/icons/학자.svg' },
    { id: 'AST', name: 'Astrologian', nameKr: '점성술사', nameEn: 'Astrologian', role: 'Healer', iconUrl: '/icons/점성술사.svg' },
    { id: 'SGE', name: 'Sage', nameKr: '현자', nameEn: 'Sage', role: 'Healer', iconUrl: '/icons/현자.svg' },

    // ========== MELEE DPS ==========
    { id: 'MNK', name: 'Monk', nameKr: '몽크', nameEn: 'Monk', role: 'Melee', iconUrl: '/icons/몽크.svg' },
    { id: 'DRG', name: 'Dragoon', nameKr: '용기사', nameEn: 'Dragoon', role: 'Melee', iconUrl: '/icons/용기사.svg' },
    { id: 'NIN', name: 'Ninja', nameKr: '닌자', nameEn: 'Ninja', role: 'Melee', iconUrl: '/icons/닌자.svg' },
    { id: 'SAM', name: 'Samurai', nameKr: '사무라이', nameEn: 'Samurai', role: 'Melee', iconUrl: '/icons/사무라이.svg' },
    { id: 'RPR', name: 'Reaper', nameKr: '리퍼', nameEn: 'Reaper', role: 'Melee', iconUrl: '/icons/리퍼.svg' },
    { id: 'VPR', name: 'Viper', nameKr: '바이퍼', nameEn: 'Viper', role: 'Melee', iconUrl: '/icons/바이퍼.svg' },

    // ========== PHYSICAL RANGED DPS ==========
    { id: 'BRD', name: 'Bard', nameKr: '음유시인', nameEn: 'Bard', role: 'Physical Ranged', iconUrl: '/icons/음유시인.svg' },
    { id: 'MCH', name: 'Machinist', nameKr: '기공사', nameEn: 'Machinist', role: 'Physical Ranged', iconUrl: '/icons/기공사.svg' },
    { id: 'DNC', name: 'Dancer', nameKr: '무도가', nameEn: 'Dancer', role: 'Physical Ranged', iconUrl: '/icons/무도가.svg' },

    // ========== MAGICAL RANGED DPS ==========
    { id: 'BLM', name: 'Black Mage', nameKr: '흑마도사', nameEn: 'Black Mage', role: 'Magical Ranged', iconUrl: '/icons/흑마도사.svg' },
    { id: 'SMN', name: 'Summoner', nameKr: '소환사', nameEn: 'Summoner', role: 'Magical Ranged', iconUrl: '/icons/소환사.svg' },
    { id: 'RDM', name: 'Red Mage', nameKr: '적마도사', nameEn: 'Red Mage', role: 'Magical Ranged', iconUrl: '/icons/적마도사.svg' },
    { id: 'PCT', name: 'Pictomancer', nameKr: '픽토맨서', nameEn: 'Pictomancer', role: 'Magical Ranged', iconUrl: '/icons/픽토맨서.svg' },
    { id: 'BLU', name: 'Blue Mage', nameKr: '청마도사', nameEn: 'Blue Mage', role: 'Limited', iconUrl: '/icons/청마도사.svg' },

    // ========== CRAFTING (Disciples of the Hand) ==========
    { id: 'CRP', name: 'Carpenter', nameKr: '목수', nameEn: 'Carpenter', role: 'Crafting', iconUrl: '/icons/목수.svg' },
    { id: 'BSM', name: 'Blacksmith', nameKr: '대장장이', nameEn: 'Blacksmith', role: 'Crafting', iconUrl: '/icons/대장장이.svg' },
    { id: 'ARM', name: 'Armorer', nameKr: '갑주제작사', nameEn: 'Armorer', role: 'Crafting', iconUrl: '/icons/갑주제작사.svg' },
    { id: 'GSM', name: 'Goldsmith', nameKr: '보석공예가', nameEn: 'Goldsmith', role: 'Crafting', iconUrl: '/icons/보석공예가.svg' },
    { id: 'LTW', name: 'Leatherworker', nameKr: '가죽공예가', nameEn: 'Leatherworker', role: 'Crafting', iconUrl: '/icons/가죽공예가.svg' },
    { id: 'WVR', name: 'Weaver', nameKr: '재봉사', nameEn: 'Weaver', role: 'Crafting', iconUrl: '/icons/재봉사.svg' },
    { id: 'ALC', name: 'Alchemist', nameKr: '연금술사', nameEn: 'Alchemist', role: 'Crafting', iconUrl: '/icons/연금술사.svg' },
    { id: 'CUL', name: 'Culinarian', nameKr: '요리사', nameEn: 'Culinarian', role: 'Crafting', iconUrl: '/icons/요리사.svg' },

    // ========== GATHERING (Disciples of the Land) ==========
    { id: 'MIN', name: 'Miner', nameKr: '광부', nameEn: 'Miner', role: 'Gathering', iconUrl: '/icons/광부.svg' },
    { id: 'BTN', name: 'Botanist', nameKr: '원예가', nameEn: 'Botanist', role: 'Gathering', iconUrl: '/icons/원예가.svg' },
    { id: 'FSH', name: 'Fisher', nameKr: '어부', nameEn: 'Fisher', role: 'Gathering', iconUrl: '/icons/어부.svg' },
];

export const PLAYSTYLES = [
    '초보/새싹', '복귀 유저', '하드코어/레이드', '절 레이드',
    '라이트/즐겜', '스샷/룩덕', '하우징', '제작/채집',
    'RP(롤플레잉)', 'PVP', '업적작', '지도/보물고',
    '디스코드 가능', '트위터 교류', '인게임 위주'
];
