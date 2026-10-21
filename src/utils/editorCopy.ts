import type { Language } from '../types';

export const editorCopy = {
    ko: {
        edition: '모험가를 위한 작은 디자인 스튜디오',
        title: '당신의 모험을,', titleAccent: '한 장에.',
        description: '에오르제아의 당신을 기록하는 가장 당신다운 방법.',
        private: '사진은 이 브라우저 안에만', presets: '디자인 둘러보기',
        document: '나의 캐릭터 카드', untitled: '새로운 모험가',
        focus: '집중 보기', exitFocus: '편집 화면으로', backdrop: '어두운 작업 배경',
        canvasNote: '작은 순간도, 오래 남도록.', layout: '카드 배치', dimensions: '카드 원본 크기',
        focusHint: 'Esc를 누르면 편집 화면으로 돌아갑니다.', mark: '캐릭터 카드 스튜디오',
    },
    en: {
        edition: 'A little design studio for adventurers',
        title: 'Your adventure,', titleAccent: 'beautifully framed.',
        description: 'A little piece of Eorzea. Unmistakably yours.',
        private: 'Your photos stay in this browser', presets: 'Explore the looks',
        document: 'My character card', untitled: 'A new adventurer',
        focus: 'Focus view', exitFocus: 'Back to editor', backdrop: 'Dark canvas backdrop',
        canvasNote: 'Small moments. Lasting stories.', layout: 'Card layout', dimensions: 'Native card dimensions',
        focusHint: 'Press Esc to return to the editor.', mark: 'Character card studio',
    },
    ja: {
        edition: '冒険者のための小さなデザインスタジオ',
        title: 'あなたの冒険を、', titleAccent: '一枚に。',
        description: 'エオルゼアのあなたを、あなたらしく残そう。',
        private: '写真はこのブラウザの中だけに', presets: 'デザインを見る',
        document: 'マイキャラクターカード', untitled: '新しい冒険者',
        focus: '集中表示', exitFocus: '編集画面に戻る', backdrop: '暗い作業背景',
        canvasNote: '小さな瞬間も、ずっと残そう。', layout: 'カードレイアウト', dimensions: 'カードの元のサイズ',
        focusHint: 'Escキーで編集画面に戻ります。', mark: 'キャラクターカードスタジオ',
    },
} satisfies Record<Language, Record<string, string>>;
