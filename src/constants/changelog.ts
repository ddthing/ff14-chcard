import type { Language } from '../types';

export const APP_VERSION = 'v1.2.0';

export interface ChangelogEntry {
    version: string;
    date: string;
    items: Record<Language, string[]>;
}

export const CHANGELOG: ChangelogEntry[] = [
    {
        version: 'v1.2.0',
        date: '2026-03-15',
        items: {
            ko: [
                '다국어 지원 추가 (한국어, 영어, 일본어)',
                '서버 선택 UI 통합 및 데이터센터별 분류 적용',

            ],
            en: [
                'Added multi-language support (KO, EN, JA)',
                'Unified server selection UI with data center groups',
            ],
            ja: [
                '多言語対応の追加 (韓国語、英語、日本語)',
                'ワールド選択UIの統合とデータセンター別分類の適用',
            ]
        }
    },
    {
        version: 'v1.1.0',
        date: '2026-02-28',
        items: {
            ko: [
                '캐릭터 카드 레이아웃 2종(가로형, 세로형) 지원',
                '다크 모드 지원',
                '실시간 미리보기 기능 최적화'
            ],
            en: [
                'Supported two card layouts (Horizontal, Vertical)',
                'Dark mode support',
                'Real-time preview optimization'
            ],
            ja: [
                'キャラクターカードのレイアウト2種(横型, 縦型)に対応',
                'ダークモード対応',
                'リアルタイムプレビュー機能の最適化'
            ]
        }
    }
];
