import type { Language } from '../types';

export interface AboutSection {
    id: string;
    title: string;
    paragraphs?: string[];
    items?: string[];
}

export interface AboutCopy {
    title: string;
    eyebrow: string;
    intro: string;
    sections: AboutSection[];
    cta: string;
}

export const aboutContent = {
    ko: {
        title: '소개',
        eyebrow: '서비스의 범위와 원칙',
        intro: 'FF14 캐릭터 카드 생성기는 파이널 판타지 14 플레이어가 자신의 캐릭터와 플레이 성향을 한 장의 공유용 이미지로 정리할 수 있도록 만든 비공식 팬 프로젝트입니다.',
        sections: [
            {
                id: 'purpose',
                title: '왜 만들었나요?',
                paragraphs: [
                    '게임 안에서 쌓은 캐릭터의 모습과 플레이 경험을 소개할 때, 복잡한 이미지 편집 프로그램 없이도 필요한 정보와 스크린샷을 한 장에 담을 수 있는 도구가 필요했습니다.',
                    '이 서비스는 정해진 양식에 이용자를 맞추기보다, 이름·서버·직업·플레이스타일·자기소개를 원하는 만큼 조합해 현재의 캐릭터를 기록하는 데 초점을 둡니다.',
                ],
            },
            {
                id: 'features',
                title: '무엇을 할 수 있나요?',
                items: [
                    '한국·글로벌 서버와 데이터센터에서 월드를 선택하고, 전투·제작·채집 직업을 카드에 표시할 수 있습니다.',
                    '스크린샷을 업로드하고 크롭한 뒤, 레이아웃·폰트·포인트 컬러·스티커를 조정할 수 있습니다.',
                    '플레이스타일과 활동 시간, 짧은 자기소개를 입력하고 현재 카드를 고화질 PNG로 저장할 수 있습니다.',
                ],
            },
            {
                id: 'limits',
                title: '제공하지 않는 기능',
                items: [
                    'Lodestone이나 공식 계정에서 캐릭터 정보를 자동으로 가져오거나 동기화하지 않습니다.',
                    '로그인, 사용자 갤러리, 댓글, 서버에 프로필을 공개적으로 저장하는 기능을 제공하지 않습니다.',
                    '이미지 배경 제거와 같은 전문 이미지 편집 기능은 제공하지 않습니다. 필요한 경우 외부 도구에서 처리한 이미지를 업로드해 주세요.',
                ],
            },
            {
                id: 'privacy',
                title: '브라우저에서 처리되는 내용',
                paragraphs: [
                    '카드 편집 상태의 일부는 기능을 위해 브라우저 localStorage에 저장될 수 있습니다. 브라우저 데이터나 쿠키를 삭제하면 저장된 상태가 사라질 수 있습니다.',
                    '이미지 저장은 현재 화면을 브라우저에서 PNG로 생성해 다운로드하는 방식입니다. 서비스 계정이나 서버에 프로필을 업로드하는 기능은 없습니다. 웹폰트처럼 화면에 필요한 외부 자원은 해당 공급처에서 불러올 수 있습니다.',
                ],
            },
            {
                id: 'fan-project',
                title: '팬 프로젝트 안내',
                paragraphs: [
                    '본 서비스는 SQUARE ENIX CO., LTD. 및 관련 권리자와 공식적인 제휴·승인을 받은 서비스가 아닙니다. 게임명, 게임 에셋, 직업 아이콘과 같은 권리는 각 권리자에게 있습니다.',
                    '생성한 카드와 업로드 이미지의 이용 권리와 공개 범위는 이용자가 직접 확인해야 합니다. 상업적 이용이나 재배포가 필요한 경우 관련 권리자의 지침을 먼저 확인하세요.',
                ],
            },
        ],
        cta: '카드 생성 시작하기',
    },
    en: {
        title: 'About',
        eyebrow: 'Scope and principles',
        intro: 'The FF14 Character Card Generator is an unofficial fan project that helps Final Fantasy XIV players arrange their character and playstyle into a single shareable image.',
        sections: [
            {
                id: 'purpose',
                title: 'Why was it made?',
                paragraphs: [
                    'Players often want to introduce a character’s look and play experience without opening a full image editor. This tool brings the useful profile details and a screenshot together in one card.',
                    'It is designed around flexible self-description: choose the name, world, jobs, playstyles, and comment that represent your character right now instead of filling out a fixed official profile.',
                ],
            },
            {
                id: 'features',
                title: 'What can it do?',
                items: [
                    'Choose worlds from Korean and global data centers and show combat, crafting, and gathering jobs on the card.',
                    'Upload and crop a screenshot, then adjust the layout, font, point color, and stickers.',
                    'Add playstyles, active time, and a short introduction, then save the current card as a high-resolution PNG.',
                ],
            },
            {
                id: 'limits',
                title: 'What it does not do',
                items: [
                    'It does not import or synchronize character data automatically from Lodestone or an official account.',
                    'It does not provide accounts, a public profile gallery, comments, or server-hosted public profiles.',
                    'It does not include professional image editing such as background removal. Process an image externally if needed, then upload it here.',
                ],
            },
            {
                id: 'privacy',
                title: 'What happens in the browser',
                paragraphs: [
                    'Some editing state may be stored in your browser’s localStorage for functionality. Clearing browser data or cookies can remove that state.',
                    'Saving creates a PNG from the current card in the browser and downloads it. The service has no account or profile-upload feature. External resources such as web fonts may still be loaded from their providers.',
                ],
            },
            {
                id: 'fan-project',
                title: 'Fan project notice',
                paragraphs: [
                    'This service is not officially affiliated with or approved by SQUARE ENIX CO., LTD. or other rights holders. Game names, game assets, and job icons belong to their respective owners.',
                    'You are responsible for checking the rights and sharing scope of your generated card and uploaded images. Review the relevant rights-holder guidance before commercial use or redistribution.',
                ],
            },
        ],
        cta: 'Start making a card',
    },
    ja: {
        title: '紹介',
        eyebrow: 'サービスの範囲と方針',
        intro: 'FF14キャラクターカードジェネレーターは、ファイナルファンタジーXIVのプレイヤーがキャラクターとプレイスタイルを一枚の共有画像にまとめられるように作った非公式ファンプロジェクトです。',
        sections: [
            {
                id: 'purpose',
                title: 'なぜ作ったのですか？',
                paragraphs: [
                    'ゲーム内で育てたキャラクターの姿や遊び方を紹介したいとき、複雑な画像編集ソフトを使わずに必要な情報とスクリーンショットを一枚にまとめられるツールが必要でした。',
                    '決められたプロフィールに合わせるのではなく、名前・ワールド・ジョブ・プレイスタイル・自己紹介を組み合わせて、今のキャラクターを記録することを目的にしています。',
                ],
            },
            {
                id: 'features',
                title: 'できること',
                items: [
                    '韓国・グローバルのデータセンターからワールドを選び、戦闘・製作・採集ジョブをカードに表示できます。',
                    'スクリーンショットをアップロードしてトリミングし、レイアウト・フォント・ポイントカラー・ステッカーを調整できます。',
                    'プレイスタイル、活動時間、短い自己紹介を入力し、現在のカードを高解像度PNGで保存できます。',
                ],
            },
            {
                id: 'limits',
                title: '提供していない機能',
                items: [
                    'ロードストーンや公式アカウントからキャラクター情報を自動取得・同期する機能はありません。',
                    'ログイン、公開ギャラリー、コメント、サーバーにプロフィールを公開保存する機能はありません。',
                    '背景削除などの専門的な画像編集機能はありません。必要な場合は外部ツールで処理した画像をアップロードしてください。',
                ],
            },
            {
                id: 'privacy',
                title: 'ブラウザ内で処理される内容',
                paragraphs: [
                    '編集状態の一部は機能のためブラウザのlocalStorageに保存される場合があります。ブラウザデータやCookieを削除すると保存状態が消えることがあります。',
                    '画像の保存は、現在のカードをブラウザ内でPNGに変換してダウンロードする方式です。サービスのアカウントやプロフィールをアップロードする機能はありません。Webフォントなどの外部リソースは提供元から読み込まれる場合があります。',
                ],
            },
            {
                id: 'fan-project',
                title: 'ファンプロジェクトについて',
                paragraphs: [
                    '本サービスはSQUARE ENIX CO., LTD.および関連する権利者と公式な提携・承認を受けたサービスではありません。ゲーム名、ゲームの素材、ジョブアイコンなどの権利は各権利者に帰属します。',
                    '作成したカードやアップロード画像の権利と公開範囲は利用者自身で確認してください。商用利用や再配布を行う場合は、関連する権利者のガイドラインを先に確認してください。',
                ],
            },
        ],
        cta: 'カード作成を始める',
    },
} satisfies Record<Language, AboutCopy>;
