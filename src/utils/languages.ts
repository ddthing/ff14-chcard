import type { Language } from '../types';

export const LANGUAGES: ReadonlyArray<{ id: Language; name: string; selection: string }> = [
    { id: 'ko', name: '한국어', selection: '언어 선택' },
    { id: 'en', name: 'English', selection: 'Select language' },
    { id: 'ja', name: '日本語', selection: '言語を選択' },
    { id: 'fr', name: 'Français', selection: 'Choisir la langue' },
    { id: 'de', name: 'Deutsch', selection: 'Sprache wählen' },
    { id: 'zh-Hans', name: '简体中文', selection: '选择语言' },
    { id: 'zh-Hant', name: '繁體中文', selection: '選擇語言' },
];

/** Accept persisted BCP 47 tags without changing user-authored profile text. */
export function normalizeLanguage(value: unknown): Language {
    if (typeof value !== 'string') return 'ko';
    const tag = value.toLowerCase().replaceAll('_', '-');
    if (/^zh-(hant|tw|hk|mo)(-|$)/.test(tag)) return 'zh-Hant';
    if (tag === 'zh' || /^zh-(hans|cn|sg)(-|$)/.test(tag)) return 'zh-Hans';
    return LANGUAGES.find(language => language.id.toLowerCase() === tag.split('-')[0])?.id ?? 'ko';
}
