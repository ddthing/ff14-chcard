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
        date: '2024-03-15',
        items: {
            ko: [
                '다국어 지원 추가 (한국어, 영어, 일본어)',
                '서버 선택 UI 통합 및 데이터센터별 분류 적용',
                '새싹/멘토 상태를 위한 아이콘 전용 토글 배지 도입',
                '포인트 컬러 커스텀 기능 추가 및 테마 연동',
                '전체적인 UI/UX 디자인 고도화 (Apple 스타일)',
                '이미지 크로핑 기능 개선'
            ],
            en: [
                'Added multi-language support (KO, EN, JA)',
                'Unified server selection UI with data center groups',
                'Icon-only toggle badges for Sprout/Mentor status',
                'Point color customization and theme integration',
                'UI/UX design refinement (Apple style)',
                'Improved image cropping functionality'
            ],
            ja: [
                '多言語対応の追加 (韓国語、英語、日本語)',
                'ワールド選択UIの統合とデータセンター別分類の適用',
                '若葉/メンター状態のためのアイコン専用トッジを追加',
                'ポイントカラーカスタム機能の追加とテーマ連動',
                '全体的なUI/UXデザインの高度化 (Appleスタイル)',
                '画像クロップ機能の改善'
            ]
        }
    },
    {
        version: 'v1.1.0',
        date: '2024-02-28',
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
