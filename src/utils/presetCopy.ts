import fr from './locales/fr-presetCopy';
import de from './locales/de-presetCopy';
import zhHans from './locales/zh-Hans-presetCopy';
import zhHant from './locales/zh-Hant-presetCopy';
import type { DesignPreset } from '../data/designPresets';
import type { Language } from '../types';

interface PresetCopy {
    title: string;
    hint: string;
    custom: string;
    selected: string;
    current: string;
    looks: Record<DesignPreset['id'], { name: string; description: string }>;
}

export const presetCopy: Record<Language, PresetCopy> = {
    fr, de, 'zh-Hans': zhHans, 'zh-Hant': zhHant,
    ko: {
        title: '시그니처 스타일',
        hint: '컬러, 폰트, 구도를 한 번에. 마음에 드는 조합에서 시작하세요.',
        custom: '직접 설정한 스타일',
        selected: '선택됨',
        current: '현재 스타일: {name}',
        looks: {
            editorial: { name: '에디토리얼', description: '테라코타 · 명조 · 가로 사진' },
            nocturne: { name: '녹턴', description: '미드나이트 블루 · 세로 사진' },
            botanica: { name: '보타니카', description: '세이지 그린 · 가로 사진' },
            archive: { name: '아카이브', description: '스톤 · 코드 서체 · 세로 사진' },
        },
    },
    en: {
        title: 'Signature looks',
        hint: 'Color, type and composition. Find a starting point that feels like you.',
        custom: 'Custom look',
        selected: 'Selected',
        current: 'Current look: {name}',
        looks: {
            editorial: { name: 'Editorial', description: 'Terracotta · Serif · Landscape' },
            nocturne: { name: 'Nocturne', description: 'Midnight blue · Portrait' },
            botanica: { name: 'Botanica', description: 'Sage green · Landscape' },
            archive: { name: 'Archive', description: 'Stone · Code type · Portrait' },
        },
    },
    ja: {
        title: 'シグネチャースタイル',
        hint: '色、フォント、構図をひとつに。お気に入りの組み合わせから始めましょう。',
        custom: 'カスタムスタイル',
        selected: '選択中',
        current: '現在のスタイル：{name}',
        looks: {
            editorial: { name: 'エディトリアル', description: 'テラコッタ · 明朝 · 横長写真' },
            nocturne: { name: 'ノクターン', description: 'ミッドナイトブルー · 縦長写真' },
            botanica: { name: 'ボタニカ', description: 'セージグリーン · 横長写真' },
            archive: { name: 'アーカイブ', description: 'ストーン · コード書体 · 縦長写真' },
        },
    },
};
