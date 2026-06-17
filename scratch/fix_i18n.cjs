const fs = require('fs');
const path = 'src/utils/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

const startTag = 'export const PLAYSTYLES_JA = [';
const endTag = '];';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = `export const PLAYSTYLES_JA = [
    '初心者/若葉', '復帰勢', 'レイド/高難易度', '絶レイド',
    'ライト勢/エンジョイ', 'SS/ミラプリ', 'ハウジング', 'ギャザクラ', 'ヌシ釣り',
    'RP(ロールプレイ)', 'PvP', 'ア치ーブメント', '麻雀', 'ゴールドソーサー', '地図/宝物庫',
    'Discord可能', 'Twitter(X)交流有', 'ログイン多め'
];`;
    // Wait, 'ア치이브먼트' is still there in my string. I must use the correct Japanese characters.
    // ア = \u30a2, チ = \u30c1, ー = \u30fc, ブ = \u30d6, メ = \u30e1, ン = \u30f3, ト = \u30c8
    const correctAchievement = '\u30a2\u30c1\u30fc\u30d6\u30e1\u30f3\u30c8';
    // 絶 = \u7d76, レ = \u30ec, イ = \u30a4, ド = \u30c9
    const correctUltimate = '\u7d76\u30ec\u30a4\u30c9';
    // ログイン = \u30ed\u30b0\u30a4\u30f3
    const correctLogin = '\u30ed\u30b0\u30a4\u30f3';

    const finalArray = `export const PLAYSTYLES_JA = [
    '初心者/若葉', '復帰勢', 'レイド/高難易度', '${correctUltimate}',
    'ライト勢/エンジョイ', 'SS/ミラプリ', 'ハウジング', 'ギャザクラ', 'ヌシ釣り',
    'RP(ロールプレイ)', 'PvP', '${correctAchievement}', '麻雀', 'ゴールドソーサー', '地図/宝物庫',
    'Discord可能', 'Twitter(X)交流有', '${correctLogin}多め'
];`;

    const updated = content.substring(0, startIndex) + finalArray + content.substring(endIndex + endTag.length);
    fs.writeFileSync(path, updated, 'utf8');
    console.log('Successfully updated PLAYSTYLES_JA');
} else {
    console.log('Could not find PLAYSTYLES_JA block');
}
