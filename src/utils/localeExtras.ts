import type { Language } from '../types';

type ExtraLanguage = Exclude<Language, 'ko' | 'en' | 'ja'>;
export const localeActivities: Record<ExtraLanguage, { times: string[]; styles: string[] }> = {
    fr: {
        times: ['Soirs en semaine / Week-ends', 'Nuits en semaine / Week-ends variables', 'Surtout le week-end', 'Horaires variables', 'Tous les jours', 'Nuit / Aube', 'Rarement en ligne', 'Personnalisé'],
        styles: ['Novice', 'De retour', 'Raids / Haut niveau', 'Raids fatals', 'Détente / Social', 'Pose de groupe / Mirage', 'Logement', 'Artisanat / Récolte', 'Pêche légendaire', 'Jeu de rôle (RP)', 'JcJ', 'Hauts faits', 'Mahjong', 'Gold Saucer', 'Chasse aux trésors', 'Discord disponible', 'Actif sur Twitter (X)', 'Échanges en jeu'],
    },
    de: {
        times: ['Werktags abends / Am Wochenende', 'Werktags nachts / Wechselnde Wochenenden', 'Meist am Wochenende', 'Unregelmäßig', 'Jeden Tag', 'Nachts / Frühmorgens', 'Selten online', 'Eigene Angabe'],
        styles: ['Neuling', 'Rückkehrer', 'Raids / Anspruchsvoll', 'Fatale Raids', 'Entspannt / Sozial', 'Gruppenpose / Projektionen', 'Housing', 'Handwerk / Sammeln', 'Legendäre Fische', 'Rollenspiel (RP)', 'PvP', 'Errungenschaften', 'Mahjong', 'Gold Saucer', 'Schatzsuche', 'Discord verfügbar', 'Auf Twitter (X) aktiv', 'Kontakte im Spiel'],
    },
    'zh-Hans': {
        times: ['工作日晚间 / 周末随时', '工作日深夜 / 周末不定', '主要周末', '时间不固定', '每天在线', '深夜 / 凌晨', '偶尔在线', '自定义'],
        styles: ['新人 / 豆芽', '回归玩家', '高难 / 团本', '绝境战', '休闲 / 社交', '集体姿势 / 幻化', '房屋装修', '制作 / 采集', '钓鱼之皇', '角色扮演 (RP)', 'PvP', '成就收集', '麻将', '金碟游乐场', '寻宝', '可用 Discord', 'Twitter (X) 交流', '游戏内交流'],
    },
    'zh-Hant': {
        times: ['平日晚間／週末隨時', '平日深夜／週末不定', '主要週末', '時間不固定', '每天上線', '深夜／凌晨', '偶爾上線', '自訂'],
        styles: ['新手／豆芽', '回歸玩家', '高難／團本', '絕境戰', '休閒／社交', '團體姿勢／投影', '房屋裝潢', '製作／採集', '釣魚之皇', '角色扮演 (RP)', 'PvP', '成就收集', '麻將', '金碟遊樂場', '尋寶', '可用 Discord', 'Twitter (X) 交流', '遊戲內交流'],
    },
};

export const navigationCopy: Record<Language, { nav: string; guideText: string; guideLabel: string }> = {
    ko: { nav: '사이트 안내', guideText: '입력 항목을 고르는 기준과 저장 전 점검표는 가이드에서 확인할 수 있습니다.', guideLabel: '카드 제작 가이드 보기' },
    en: { nav: 'Site navigation', guideText: 'The guide explains how to choose fields and check a card before saving.', guideLabel: 'Open the card creation guide' },
    ja: { nav: 'サイト案内', guideText: '入力項目を選ぶ基準と保存前のチェックリストは、ガイドで確認できます。', guideLabel: 'カード作成ガイドを見る' },
    fr: { nav: 'Navigation du site', guideText: 'Le guide aide à choisir les informations et à vérifier la carte avant de l’enregistrer.', guideLabel: 'Ouvrir le guide de création' },
    de: { nav: 'Seitennavigation', guideText: 'Die Anleitung hilft bei der Auswahl der Angaben und der Prüfung vor dem Speichern.', guideLabel: 'Anleitung öffnen' },
    'zh-Hans': { nav: '网站导航', guideText: '指南提供填写建议与保存前检查表。', guideLabel: '查看卡片制作指南' },
    'zh-Hant': { nav: '網站導覽', guideText: '指南提供填寫建議與儲存前檢查表。', guideLabel: '查看卡片製作指南' },
};
