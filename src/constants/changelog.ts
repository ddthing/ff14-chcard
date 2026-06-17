import type { Language } from '../types';

/**
 * Changelog
 *
 * APP_VERSION gates the "What's New" modal — bump this string with every
 * public release to ensure returning users see the latest entries on their
 * next visit. Entries are displayed newest-first; the most recent entry
 * receives full visual weight while older entries are subdued.
 */
export const APP_VERSION = 'v1.4';

export interface ChangelogEntry {
    version: string;
    date: string;
    items: Record<Language, string[]>;
}

export const CHANGELOG: ChangelogEntry[] = [
    {
        version: 'v1.4',
        date: '2026-05-21',
        items: {
            ko: [
                '웹 폰트 지연 로딩(Lazy-Loading) 적용으로 초기 로딩 속도 대폭 개선',
                '이미지 업로드 시 \'자동 채우기(Auto Fill)\' 옵션 추가',
                '전반적인 코드베이스 리팩터링 및 UI 컴포넌트 최적화',
            ],
            en: [
                'Significantly improved initial load speed with lazy-loaded web fonts',
                'Added \'Auto Fill\' option when cropping uploaded images',
                'Refactored codebase and optimized UI components',
            ],
            ja: [
                'Webフォントの遅延読み込みによる初期ロード速度の大幅な改善',
                '画像アップロード時に「自動塗りつぶし(Auto Fill)」オプションを追加',
                'コードベースのリファクタリングとUIコンポーネントの最適化',
            ],
        },
    },
    {
        version: 'v1.3.0',
        date: '2026-04-01',
        items: {
            ko: [
                '데스크탑·모바일 환경 최적화를 위한 입력 탭 구조 분리',
                '플레이 스타일 항목 추가 (터주)',
                '구글 애드센스 광고 영역 최적화 및 레이아웃 개선',
            ],
            en: [
                'Separated input tabs optimized for Desktop and Mobile',
                'Added new playstyle tag: Big Fish',
                'Optimized Google AdSense regions and layout',
            ],
            ja: [
                'デスクトップ・モバイルに最適化された入力タブの分離',
                'プレイスタイルに「ヌシ釣り」を追加',
                'Google AdSense 広告エリアの追加とレイアウトの最適化',
            ],
        },
    },
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
            ],
        },
    },
    {
        version: 'v1.1.0',
        date: '2026-02-28',
        items: {
            ko: [
                '캐릭터 카드 레이아웃 2종(가로형, 세로형) 지원',
                '다크 모드 지원',
                '실시간 미리보기 기능 최적화',
            ],
            en: [
                'Supported two card layouts (Horizontal, Vertical)',
                'Dark mode support',
                'Real-time preview optimization',
            ],
            ja: [
                'キャラクターカードのレイアウト2種(横型, 縦型)に対応',
                'ダークモード対応',
                'リアルタイムプレビュー機能の最適化',
            ],
        },
    },
];
