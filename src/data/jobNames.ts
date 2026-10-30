import type { Job, Language } from '../types';

// Official job guides: fr/de.finalfantasyxiv.com/jobguide/battle/ and
// www.ffxiv.com.tw/web/intro/guide/battle/. Stable IDs are never translated.
const names: Record<string, readonly [string, string, string, string]> = {
    PLD: ['Paladin', 'Paladin', '骑士', '騎士'],
    WAR: ['Guerrier', 'Krieger', '战士', '戰士'],
    DRK: ['Chevalier noir', 'Dunkelritter', '暗黑骑士', '暗黑騎士'],
    GNB: ['Pistosabreur', 'Revolverklinge', '绝枪战士', '絕槍戰士'],
    WHM: ['Mage blanc', 'Weißmagier', '白魔法师', '白魔道士'],
    SCH: ['Érudit', 'Gelehrter', '学者', '學者'],
    AST: ['Astromancien', 'Astrologe', '占星术士', '占星術師'],
    SGE: ['Sage', 'Weiser', '贤者', '賢者'],
    MNK: ['Moine', 'Mönch', '武僧', '武僧'],
    DRG: ['Chevalier dragon', 'Dragoon', '龙骑士', '龍騎士'],
    NIN: ['Ninja', 'Ninja', '忍者', '忍者'],
    SAM: ['Samouraï', 'Samurai', '武士', '武士'],
    RPR: ['Faucheur', 'Schnitter', '钐镰客', '奪魂者'],
    VPR: ['Rôdeur vipère', 'Viper', '蝰蛇剑士', '毒蛇劍士'],
    BRD: ['Barde', 'Barde', '吟游诗人', '吟遊詩人'],
    MCH: ['Machiniste', 'Maschinist', '机工士', '機工士'],
    DNC: ['Danseur', 'Tänzer', '舞者', '舞者'],
    BLM: ['Mage noir', 'Schwarzmagier', '黑魔法师', '黑魔道士'],
    SMN: ['Invocateur', 'Beschwörer', '召唤师', '召喚士'],
    RDM: ['Mage rouge', 'Rotmagier', '赤魔法师', '赤魔道士'],
    PCT: ['Pictomancien', 'Piktomant', '绘灵法师', '繪靈法師'],
    BLU: ['Mage bleu', 'Blaumagier', '青魔法师', '青魔道士'],
    // Keep the English name where a regional official name is not verified.
    BST: ['Dresseur', 'Bestienbändiger', 'Beastmaster', 'Beastmaster'],
    CRP: ['Menuisier', 'Zimmerer', '刻木匠', '木工師'],
    BSM: ['Forgeron', 'Grobschmied', '锻铁匠', '鍛冶師'],
    ARM: ['Armurier', 'Plattner', '铸甲匠', '甲冑師'],
    GSM: ['Orfèvre', 'Goldschmied', '雕金匠', '雕金師'],
    LTW: ['Tanneur', 'Gerber', '制革匠', '製革師'],
    WVR: ['Couturier', 'Weber', '裁衣匠', '裁縫師'],
    ALC: ['Alchimiste', 'Alchemist', '炼金术士', '鍊金術師'],
    CUL: ['Cuisinier', 'Gourmet', '烹调师', '烹調師'],
    MIN: ['Mineur', 'Minenarbeiter', '采矿工', '採掘師'],
    BTN: ['Botaniste', 'Gärtner', '园艺工', '園藝師'],
    FSH: ['Pêcheur', 'Fischer', '捕鱼人', '漁師'],
};

export function getJobName(job: Job, language: Language, compact = false): string {
    if (language === 'ko') return job.nameKr;
    if (language === 'ja') return job.nameJa;
    if (language === 'en') return compact ? job.nameEn : job.name;
    const column = { fr: 0, de: 1, 'zh-Hans': 2, 'zh-Hant': 3 } as const;
    return names[job.id]?.[column[language]] ?? job.name;
}
