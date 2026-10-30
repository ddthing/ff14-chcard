import fr from './locales/fr-editorCopy';
import de from './locales/de-editorCopy';
import zhHans from './locales/zh-Hans-editorCopy';
import zhHant from './locales/zh-Hant-editorCopy';
import type { Language } from '../types';

export const editorCopy = {
    fr, de, 'zh-Hans': zhHans, 'zh-Hant': zhHant,
    ko: {
        focus: '집중 보기', exitFocus: '편집 화면으로', backdrop: '어두운 작업 배경',
        layout: '카드 배치', dimensions: '카드 원본 크기',
        focusHint: 'Esc를 누르면 편집 화면으로 돌아갑니다.',
    },
    en: {
        focus: 'Focus view', exitFocus: 'Back to editor', backdrop: 'Dark canvas backdrop',
        layout: 'Card layout', dimensions: 'Native card dimensions',
        focusHint: 'Press Esc to return to the editor.',
    },
    ja: {
        focus: '集中表示', exitFocus: '編集画面に戻る', backdrop: '暗い作業背景',
        layout: 'カードレイアウト', dimensions: 'カードの元のサイズ',
        focusHint: 'Escキーで編集画面に戻ります。',
    },
} satisfies Record<Language, Record<string, string>>;
