import type { Job } from '../types';

// 아이콘 경로: public/icons/ 폴더에 업로드된 SVG 파일 사용
// Vite에서 public/ 하위는 `/` 루트로 접근 가능
// 파일명은 영문 직업 ID로 통일 (Vercel CDN 한글 경로 이슈 방지)

export const JOBS: Job[] = [
    // ========== TANKS ==========
    { id: 'PLD', name: 'Paladin', nameKr: '나이트', nameEn: 'PLD', nameJa: 'ナイト', role: 'Tank', iconUrl: '/icons/PLD.svg' },
    { id: 'WAR', name: 'Warrior', nameKr: '전사', nameEn: 'WAR', nameJa: '戦士', role: 'Tank', iconUrl: '/icons/WAR.svg' },
    { id: 'DRK', name: 'Dark Knight', nameKr: '암흑기사', nameEn: 'DRK', nameJa: '暗黒騎士', role: 'Tank', iconUrl: '/icons/DRK.svg' },
    { id: 'GNB', name: 'Gunbreaker', nameKr: '건브레이커', nameEn: 'GNB', nameJa: 'ガンブ레이カー', role: 'Tank', iconUrl: '/icons/GNB.svg' },

    // ========== HEALERS ==========
    { id: 'WHM', name: 'White Mage', nameKr: '백마도사', nameEn: 'WHM', nameJa: '白魔道士', role: 'Healer', iconUrl: '/icons/WHM.svg' },
    { id: 'SCH', name: 'Scholar', nameKr: '학자', nameEn: 'SCH', nameJa: '学者', role: 'Healer', iconUrl: '/icons/SCH.svg' },
    { id: 'AST', name: 'Astrologian', nameKr: '점성술사', nameEn: 'AST', nameJa: '占星術師', role: 'Healer', iconUrl: '/icons/AST.svg' },
    { id: 'SGE', name: 'Sage', nameKr: '현자', nameEn: 'SGE', nameJa: '賢者', role: 'Healer', iconUrl: '/icons/SGE.svg' },

    // ========== MELEE DPS ==========
    { id: 'MNK', name: 'Monk', nameKr: '몽크', nameEn: 'MNK', nameJa: 'モンク', role: 'Melee', iconUrl: '/icons/MNK.svg' },
    { id: 'DRG', name: 'Dragoon', nameKr: '용기사', nameEn: 'DRG', nameJa: '竜騎士', role: 'Melee', iconUrl: '/icons/DRG.svg' },
    { id: 'NIN', name: 'Ninja', nameKr: '닌자', nameEn: 'NIN', nameJa: '忍者', role: 'Melee', iconUrl: '/icons/NIN.svg' },
    { id: 'SAM', name: 'Samurai', nameKr: '사무라이', nameEn: 'SAM', nameJa: '侍', role: 'Melee', iconUrl: '/icons/SAM.svg' },
    { id: 'RPR', name: 'Reaper', nameKr: '리퍼', nameEn: 'RPR', nameJa: 'リーパー', role: 'Melee', iconUrl: '/icons/RPR.svg' },
    { id: 'VPR', name: 'Viper', nameKr: '바이퍼', nameEn: 'VPR', nameJa: 'ヴァイ퍼', role: 'Melee', iconUrl: '/icons/VPR.svg' },

    // ========== PHYSICAL RANGED DPS ==========
    { id: 'BRD', name: 'Bard', nameKr: '음유시인', nameEn: 'BRD', nameJa: '吟遊詩人', role: 'Physical Ranged', iconUrl: '/icons/BRD.svg' },
    { id: 'MCH', name: 'Machinist', nameKr: '기공사', nameEn: 'MCH', nameJa: '機工師', role: 'Physical Ranged', iconUrl: '/icons/MCH.svg' },
    { id: 'DNC', name: 'Dancer', nameKr: '무도가', nameEn: 'DNC', nameJa: '踊り子', role: 'Physical Ranged', iconUrl: '/icons/DNC.svg' },

    // ========== MAGICAL RANGED DPS ==========
    { id: 'BLM', name: 'Black Mage', nameKr: '흑마도사', nameEn: 'BLM', nameJa: '黒魔道士', role: 'Magical Ranged', iconUrl: '/icons/BLM.svg' },
    { id: 'SMN', name: 'Summoner', nameKr: '소환사', nameEn: 'SMN', nameJa: '召喚士', role: 'Magical Ranged', iconUrl: '/icons/SMN.svg' },
    { id: 'RDM', name: 'Red Mage', nameKr: '적마도사', nameEn: 'RDM', nameJa: '赤魔道士', role: 'Magical Ranged', iconUrl: '/icons/RDM.svg' },
    { id: 'PCT', name: 'Pictomancer', nameKr: '픽토맨서', nameEn: 'PCT', nameJa: 'ピクトマンサー', role: 'Magical Ranged', iconUrl: '/icons/PCT.svg' },
    { id: 'BLU', name: 'Blue Mage', nameKr: '청마도사', nameEn: 'BLU', nameJa: '青魔道士', role: 'Limited', iconUrl: '/icons/BLU.svg' },

    // ========== CRAFTING (Disciples of the Hand) ==========
    { id: 'CRP', name: 'Carpenter', nameKr: '목수', nameEn: 'CRP', nameJa: '木工師', role: 'Crafting', iconUrl: '/icons/CRP.svg' },
    { id: 'BSM', name: 'Blacksmith', nameKr: '대장장이', nameEn: 'BSM', nameJa: '鍛冶師', role: 'Crafting', iconUrl: '/icons/BSM.svg' },
    { id: 'ARM', name: 'Armorer', nameKr: '갑주제작사', nameEn: 'ARM', nameJa: '甲冑師', role: 'Crafting', iconUrl: '/icons/ARM.svg' },
    { id: 'GSM', name: 'Goldsmith', nameKr: '보석공예가', nameEn: 'GSM', nameJa: '彫金師', role: 'Crafting', iconUrl: '/icons/GSM.svg' },
    { id: 'LTW', name: 'Leatherworker', nameKr: '가죽공예가', nameEn: 'LTW', nameJa: '革細工師', role: 'Crafting', iconUrl: '/icons/LTW.svg' },
    { id: 'WVR', name: 'Weaver', nameKr: '재봉사', nameEn: 'WVR', nameJa: '裁縫師', role: 'Crafting', iconUrl: '/icons/WVR.svg' },
    { id: 'ALC', name: 'Alchemist', nameKr: '연금술사', nameEn: 'ALC', nameJa: '錬金術師', role: 'Crafting', iconUrl: '/icons/ALC.svg' },
    { id: 'CUL', name: 'Culinarian', nameKr: '요리사', nameEn: 'CUL', nameJa: '調理師', role: 'Crafting', iconUrl: '/icons/CUL.svg' },

    // ========== GATHERING (Disciples of the Land) ==========
    { id: 'MIN', name: 'Miner', nameKr: '광부', nameEn: 'MIN', nameJa: '採掘師', role: 'Gathering', iconUrl: '/icons/MIN.svg' },
    { id: 'BTN', name: 'Botanist', nameKr: '원예가', nameEn: 'BTN', nameJa: '園芸師', role: 'Gathering', iconUrl: '/icons/BTN.svg' },
    { id: 'FSH', name: 'Fisher', nameKr: '어부', nameEn: 'FSH', nameJa: '漁師', role: 'Gathering', iconUrl: '/icons/FSH.svg' },
];
