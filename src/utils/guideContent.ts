import type { Language } from '../types';
import type { RoleGroup } from './guideReference';

export type GuideSectionId =
    | 'purpose'
    | 'screenshot'
    | 'profile'
    | 'jobs'
    | 'style'
    | 'save';

export interface GuideSection {
    id: GuideSectionId;
    title: string;
    intro: string;
    points: string[];
}

export interface GuideUseCase {
    id: 'social' | 'recruitment' | 'screenshot';
    title: string;
    summary: string;
    fieldsLabel: string;
    fields: string[];
    exampleLabel: string;
    example: string;
    privacy: string;
}

export interface GuideChecklistItem {
    id: string;
    label: string;
}

export interface GuideCopy {
    title: string;
    eyebrow: string;
    intro: string;
    contentsLabel: string;
    useCasesTitle: string;
    useCasesIntro: string;
    useCases: GuideUseCase[];
    sectionLabel: string;
    sections: GuideSection[];
    referenceTitle: string;
    referenceIntro: string;
    roleNames: Record<RoleGroup, string>;
    jobCountLabel: string;
    worldScopeTitle: string;
    worldScopeIntro: string;
    regionCountLabel: string;
    dataCenterCountLabel: string;
    worldCountLabel: string;
    checklistTitle: string;
    checklistIntro: string;
    checklist: GuideChecklistItem[];
    checklistProgress: (completed: number, total: number) => string;
    createCta: string;
    exampleNotice: string;
}

export const guideContent = {
    ko: {
        title: 'FF14 캐릭터 카드 제작 가이드',
        eyebrow: '카드 제작 참고서',
        intro: '카드에 무엇을 넣을지 정하고, 이미지와 텍스트가 함께 잘 읽히도록 다듬는 방법을 안내합니다. 필요한 부분만 골라 읽은 뒤 생성기로 돌아가 바로 적용해 보세요.',
        contentsLabel: '가이드 목차',
        useCasesTitle: '먼저 카드의 목적을 정해보세요',
        useCasesIntro: '같은 기능도 어디에 공유할지에 따라 강조할 정보가 달라집니다. 아래 예시는 실제 입력 필드에 맞춘 가상의 작성 방향입니다.',
        useCases: [
            {
                id: 'social',
                title: 'SNS 자기소개',
                summary: '처음 만나는 사람에게 캐릭터와 플레이 성향을 짧게 소개할 때 적합합니다.',
                fieldsLabel: '추천 필드',
                fields: ['닉네임·서버', '주 직업·플레이스타일', '짧은 자기소개'],
                exampleLabel: '가상 예시',
                example: '주말에 천천히 던전과 하우징을 즐겨요. 초행 환영!',
                privacy: '실명, 연락처, 주로 접속하는 장소처럼 공개하고 싶지 않은 정보는 넣지 마세요.',
            },
            {
                id: 'recruitment',
                title: '자유부대·공대 모집',
                summary: '활동 시간과 함께 어떤 교류를 원하는지 전달해야 할 때 유용합니다.',
                fieldsLabel: '추천 필드',
                fields: ['서버·데이터센터', '주 직업·보조 직업', '활동 시간·자기소개'],
                exampleLabel: '가상 예시',
                example: '평일 21시 이후 접속합니다. 천천히 배우며 함께할 분을 찾아요.',
                privacy: '모집에 필요한 시간대만 적고, 개인 연락처는 게시할 커뮤니티의 안전한 절차를 사용하세요.',
            },
            {
                id: 'screenshot',
                title: '스크린샷 기록',
                summary: '특정 순간의 캐릭터 모습과 분위기를 한 장의 이미지로 남길 때 적합합니다.',
                fieldsLabel: '추천 필드',
                fields: ['고해상도 스크린샷', '레이아웃·포인트 컬러', '최소한의 스티커'],
                exampleLabel: '가상 예시',
                example: '최근 Gpose에서 마음에 들었던 장면을 중심으로 정리했어요.',
                privacy: '스크린샷에 다른 플레이어의 이름이나 채팅 내용이 보이는지 저장 전에 확인하세요.',
            },
        ],
        sectionLabel: '작성 단계',
        sections: [
            {
                id: 'purpose',
                title: '카드에 담을 정보를 먼저 고르기',
                intro: '카드는 모든 정보를 많이 담을수록 좋아지는 문서가 아닙니다. 공유할 장소에서 한눈에 전달할 내용부터 정하면 입력과 꾸미기가 훨씬 쉬워집니다.',
                points: [
                    '이름·서버·주 직업처럼 상대가 나를 구분하는 정보와, 플레이스타일·활동 시간처럼 교류에 도움이 되는 정보를 나눠 생각하세요.',
                    '공식 프로필이나 Lodestone 정보를 자동으로 복사하는 기능이 아니라, 원하는 시점의 캐릭터 모습을 직접 기록하는 도구입니다.',
                    '완성 전에 공개 범위를 정하세요. 카드에 넣은 정보와 업로드한 스크린샷은 저장·공유하는 이미지에 포함됩니다.',
                ],
            },
            {
                id: 'screenshot',
                title: '스크린샷과 크롭 다듬기',
                intro: '이미지가 카드의 분위기를 결정하지만, 장식보다 캐릭터가 잘 보이는 구도가 먼저입니다.',
                points: [
                    '얼굴·장비·실루엣 중 무엇을 보여줄지 정하고, 카드 비율에서 피사체가 잘리지 않을 만큼 주변 여백을 남기세요.',
                    '밝은 이미지에는 밝은 글자가 묻힐 수 있고 어두운 이미지에는 짙은 글자가 약해질 수 있습니다. 미리보기에서 이름과 직업 아이콘을 먼저 확인하세요.',
                    '낮은 해상도의 이미지를 크게 확대하면 카드 출력 크기와 관계없이 픽셀이 보일 수 있습니다. 가능한 한 원본 해상도가 높은 스크린샷을 사용하세요.',
                    '가로형과 세로형을 바꾼 뒤에는 이미지 위치를 다시 확인하세요. 같은 크롭 좌표라도 카드 비율이 달라지면 보이는 영역이 달라집니다.',
                ],
            },
            {
                id: 'profile',
                title: '기본 정보와 자기소개 쓰기',
                intro: '짧은 문장 하나가 카드의 사용 목적을 분명하게 만듭니다. 무엇을 좋아하는지, 언제 활동하는지, 어떤 교류를 원하는지 중 하나부터 선택하세요.',
                points: [
                    '인게임 이름과 다른 이름을 공개하고 싶다면 “인게임과 다름”을 켜고, 실제 게임 이름을 자기소개에 다시 적지 않는 방식으로 구분하세요.',
                    '서버와 데이터센터는 상대가 나를 찾거나 함께 플레이할 때 필요한 정보인지 생각하고 선택하세요.',
                    '플레이스타일 태그는 빠르게 분위기를 전달하고, 자기소개는 태그만으로 설명하기 어려운 활동이나 교류 방식을 보충합니다.',
                    '실명·연락처·정확한 생활 일정처럼 카드에 필요하지 않은 개인정보는 작성하지 않는 편이 안전합니다.',
                ],
            },
            {
                id: 'jobs',
                title: '직업과 플레이스타일 표현하기',
                intro: '주 직업은 카드의 시선을 모으는 기준이고, 나머지 직업은 현재 즐기는 콘텐츠의 폭을 보여주는 보조 정보입니다.',
                points: [
                    '주 직업은 가장 자주 플레이하거나 지금 소개하고 싶은 직업 하나를 선택하세요. 선택하지 않아도 직업 목록 자체는 사용할 수 있습니다.',
                    '전투·제작·채집 직업은 카드 안에서 역할별로 나뉘므로, 모든 직업을 선택하기보다 보여주고 싶은 범위를 정하는 것이 읽기 쉽습니다.',
                    '플레이스타일 태그는 많이 고르는 것보다 현재의 플레이 방식을 잘 설명하는 항목만 남기는 편이 전달력이 좋습니다.',
                    '직업 레벨은 특정 시점의 기록입니다. 최신 상태를 자동으로 확인하는 기능이 아니므로 필요하면 자기소개에 기준 시점을 덧붙이세요.',
                ],
            },
            {
                id: 'style',
                title: '스타일과 꾸미기 조절하기',
                intro: '스타일은 정보를 읽게 만드는 바탕이고, 스티커와 포인트 컬러는 분위기를 보완하는 마지막 단계입니다.',
                points: [
                    '폰트는 큰 제목보다 작은 서버명·직업명까지 읽히는지를 기준으로 선택하세요. 장식성이 강할수록 짧은 텍스트에 쓰는 편이 안전합니다.',
                    '포인트 컬러를 고를 때는 강조색 자체보다 이름·직업 아이콘·본문과의 대비를 먼저 확인하세요.',
                    '스티커는 카드의 빈 공간을 보완하는 정도로 배치하고 이름, 직업 아이콘, 자기소개 문장을 가리지 않도록 미리보기에서 확인하세요.',
                    '레이아웃을 먼저 정하고 이미지 위치를 맞춘 뒤 색상과 스티커를 추가하면 다시 조정할 일이 줄어듭니다.',
                ],
            },
            {
                id: 'save',
                title: '저장하고 공유하기 전에 확인하기',
                intro: '저장 버튼은 현재 카드 미리보기를 PNG 이미지로 만들어 다운로드합니다. 공유 전에는 이미지 안에 실제로 보이는 정보를 마지막으로 확인하세요.',
                points: [
                    '모바일 인앱 브라우저는 보안 정책 때문에 다운로드를 막을 수 있습니다. 저장이 되지 않으면 Chrome·Safari·Edge 같은 외부 브라우저에서 다시 시도하세요.',
                    '일부 편집 상태는 브라우저의 localStorage에 남을 수 있지만, 브라우저 데이터나 쿠키를 삭제하면 사라질 수 있습니다. 완성 카드는 이미지로 보관하세요.',
                    '이미지를 공유하기 전 이름, 서버, 스크린샷에 보이는 다른 플레이어의 이름과 채팅 내용을 확인하세요.',
                    '이 서비스는 SQUARE ENIX와 공식 제휴 관계가 없는 팬 프로젝트입니다. 게임·폰트·이미지의 권리는 각 권리자에게 있습니다.',
                ],
            },
        ],
        referenceTitle: '현재 선택할 수 있는 범위',
        referenceIntro: '아래 목록은 카드 편집기의 실제 직업·서버 선택 데이터에서 만들어집니다. 직업명이나 월드가 바뀌면 이 참고 영역도 함께 바뀝니다.',
        roleNames: { battle: '전투 직업', crafting: '제작 직업', gathering: '채집 직업' },
        jobCountLabel: '개 직업',
        worldScopeTitle: '서버와 데이터센터',
        worldScopeIntro: '한국 서버와 글로벌 데이터센터의 선택지를 제공합니다. Lodestone에서 캐릭터를 자동으로 가져오지는 않습니다.',
        regionCountLabel: '개 지역',
        dataCenterCountLabel: '개 데이터센터',
        worldCountLabel: '개 월드',
        checklistTitle: '저장 전 점검표',
        checklistIntro: '이 점검표는 현재 방문 세션에서만 동작하며 서버나 계정에 저장되지 않습니다.',
        checklist: [
            { id: 'image', label: '이미지가 의도한 위치와 크기로 보입니다.' },
            { id: 'identity', label: '이름과 서버 표기가 맞습니다.' },
            { id: 'job', label: '주 직업과 플레이스타일이 현재 나를 설명합니다.' },
            { id: 'privacy', label: '공개하고 싶지 않은 개인정보가 보이지 않습니다.' },
            { id: 'contrast', label: '글자와 포인트 컬러의 대비가 충분합니다.' },
            { id: 'share', label: '실제로 공유할 화면에서도 내용을 읽을 수 있습니다.' },
        ],
        checklistProgress: (completed, total) => `${completed}/${total} 확인`,
        createCta: '카드 만들기로 돌아가기',
        exampleNotice: '예시는 실제 이용자의 정보가 아닌 작성 방향을 보여주는 가상 문장입니다.',
    },
    en: {
        title: 'FF14 Character Card Guide',
        eyebrow: 'Card creation reference',
        intro: 'Use this guide to decide what belongs on your card and make the image and text work together. Read only the sections you need, then return to the generator and apply them.',
        contentsLabel: 'Guide contents',
        useCasesTitle: 'Start with the card’s purpose',
        useCasesIntro: 'The same fields serve different purposes depending on where you share the card. These examples are fictional directions based on the fields in the generator.',
        useCases: [
            {
                id: 'social',
                title: 'Social introduction',
                summary: 'A compact way to introduce your character and playstyle to people who are meeting you for the first time.',
                fieldsLabel: 'Suggested fields',
                fields: ['Name and world', 'Main job and playstyles', 'Short introduction'],
                exampleLabel: 'Fictional example',
                example: 'I enjoy relaxed dungeons and housing on weekends. New players welcome!',
                privacy: 'Leave out your real name, contact details, or usual location if you do not want to share them.',
            },
            {
                id: 'recruitment',
                title: 'FC or static recruitment',
                summary: 'Useful when your activity hours and the kind of group interaction you want matter most.',
                fieldsLabel: 'Suggested fields',
                fields: ['World and data center', 'Main and secondary jobs', 'Active time and comment'],
                exampleLabel: 'Fictional example',
                example: 'Usually online after 9 PM KST. Looking for a patient group to learn with.',
                privacy: 'Share only the time window needed for recruitment and use the community’s safer contact process.',
            },
            {
                id: 'screenshot',
                title: 'Screenshot record',
                summary: 'A visual record for a character moment where the screenshot and atmosphere should lead.',
                fieldsLabel: 'Suggested fields',
                fields: ['High-resolution screenshot', 'Layout and point color', 'A small number of stickers'],
                exampleLabel: 'Fictional example',
                example: 'A card built around a recent Gpose screenshot I wanted to keep.',
                privacy: 'Check that other players’ names or chat messages are not visible in the screenshot.',
            },
        ],
        sectionLabel: 'Writing steps',
        sections: [
            {
                id: 'purpose',
                title: 'Choose what the card needs to say',
                intro: 'A card does not become better by containing every possible detail. Decide what someone should understand at a glance before filling in and decorating it.',
                points: [
                    'Separate identity details such as name, world, and main job from connection details such as playstyles and active time.',
                    'This tool does not copy an official profile or Lodestone data automatically. It records the version of your character that you want to present.',
                    'Decide what you are comfortable making public. The information and screenshot in the card become part of the image you save and share.',
                ],
            },
            {
                id: 'screenshot',
                title: 'Choose and crop the screenshot',
                intro: 'The screenshot sets the mood, but a readable character silhouette comes before decoration.',
                points: [
                    'Choose whether the face, gear, or overall silhouette is the focus, then leave enough space to keep it from being cropped by the card ratio.',
                    'Light text can disappear on a bright screenshot and dark text can lose contrast on a dark one. Check the name and job icons first in the preview.',
                    'A low-resolution source can look pixelated when enlarged, regardless of the card’s output size. Use the highest-resolution screenshot available.',
                    'Recheck the image after switching between horizontal and vertical layouts because the visible area changes with the ratio.',
                ],
            },
            {
                id: 'profile',
                title: 'Write the profile details',
                intro: 'One short sentence can clarify the purpose of the card. Start with what you enjoy, when you play, or what kind of interaction you want.',
                points: [
                    'If your public name differs from your in-game name, enable “Different from in-game” and avoid repeating the in-game name in the comment.',
                    'Choose a world and data center when people need that information to find or play with you.',
                    'Playstyle tags communicate the mood quickly; use the comment for activities or interaction preferences that a tag cannot capture.',
                    'Do not add real names, contact details, or precise personal schedules that the card does not need.',
                ],
            },
            {
                id: 'jobs',
                title: 'Show jobs and playstyles',
                intro: 'The main job gives the card a visual focus. The remaining jobs show the range of content you currently enjoy.',
                points: [
                    'Choose one main job that you play most or want to introduce now. The job list can still be used without selecting a main job.',
                    'Combat, crafting, and gathering jobs are grouped separately on the card. Selecting only the range you want to show keeps it easier to read.',
                    'A few accurate playstyle tags communicate more than selecting every available option.',
                    'Job levels describe a snapshot in time. They are not checked automatically, so add a reference date in your comment if it matters.',
                ],
            },
            {
                id: 'style',
                title: 'Adjust style and decoration',
                intro: 'Style creates the reading surface; stickers and the point color should finish the mood without competing with the information.',
                points: [
                    'Choose a font by checking whether small world and job labels remain readable, not only whether the large title looks decorative.',
                    'When choosing a point color, check its contrast with the name, job icons, and body text before judging the color by itself.',
                    'Use stickers to fill or frame open space, and make sure they do not cover the name, job icons, or introduction in the preview.',
                    'Set the layout, position the image, and then add color and stickers to reduce rework.',
                ],
            },
            {
                id: 'save',
                title: 'Check before saving and sharing',
                intro: 'Save Image turns the current card preview into a PNG download. Before sharing it, review what is actually visible in the image.',
                points: [
                    'Mobile in-app browsers can block downloads. If saving fails, try an external browser such as Chrome, Safari, or Edge.',
                    'Some editing state may remain in localStorage, but clearing browser data or cookies can remove it. Keep finished cards as image files.',
                    'Before sharing, check the name, world, and any other players’ names or chat messages visible in the screenshot.',
                    'This is an unofficial fan project with no official SQUARE ENIX partnership. Game, font, and image rights remain with their respective owners.',
                ],
            },
        ],
        referenceTitle: 'Current supported scope',
        referenceIntro: 'The lists below are generated from the same job and world data used by the editor. They change with the editor’s source data rather than a separate copy in this guide.',
        roleNames: { battle: 'Combat jobs', crafting: 'Crafting jobs', gathering: 'Gathering jobs' },
        jobCountLabel: ' jobs',
        worldScopeTitle: 'Worlds and data centers',
        worldScopeIntro: 'The editor includes Korean worlds and global data centers. It does not import characters from Lodestone automatically.',
        regionCountLabel: ' regions',
        dataCenterCountLabel: ' data centers',
        worldCountLabel: ' worlds',
        checklistTitle: 'Pre-save checklist',
        checklistIntro: 'This checklist only lives in the current session. It is not sent to a server or saved to an account.',
        checklist: [
            { id: 'image', label: 'The image has the intended position and scale.' },
            { id: 'identity', label: 'The name and world are correct.' },
            { id: 'job', label: 'The main job and playstyles still describe me.' },
            { id: 'privacy', label: 'No private information is visible.' },
            { id: 'contrast', label: 'Text and the point color have enough contrast.' },
            { id: 'share', label: 'The card remains readable where I plan to share it.' },
        ],
        checklistProgress: (completed, total) => `${completed}/${total} checked`,
        createCta: 'Return to card maker',
        exampleNotice: 'Examples are fictional sentences that demonstrate a writing direction.',
    },
    ja: {
        title: 'FF14キャラクターカード作成ガイド',
        eyebrow: 'カード作成リファレンス',
        intro: 'カードに載せる情報を選び、画像と文章を読みやすく整える方法を紹介します。必要な項目だけ確認して、ジェネレーターに戻って試してみてください。',
        contentsLabel: 'ガイド目次',
        useCasesTitle: 'まずカードの目的を決める',
        useCasesIntro: '同じ入力項目でも、共有する場所によって強調する情報は変わります。以下はジェネレーターの項目に合わせた架空の作成例です。',
        useCases: [
            {
                id: 'social',
                title: 'SNSでの自己紹介',
                summary: '初めて会う人にキャラクターとプレイスタイルを短く伝えたいときに向いています。',
                fieldsLabel: 'おすすめ項目',
                fields: ['名前・ワールド', 'メインジョブ・プレイスタイル', '短い自己紹介'],
                exampleLabel: '架空の例',
                example: '週末はゆっくりダンジョンやハウジングを楽しんでいます。初心者歓迎！',
                privacy: '本名、連絡先、普段いる場所など、公開したくない情報は入力しないでください。',
            },
            {
                id: 'recruitment',
                title: 'FC・固定メンバー募集',
                summary: '活動時間や、どのような交流を望んでいるかを伝えたいときに便利です。',
                fieldsLabel: 'おすすめ項目',
                fields: ['ワールド・データセンター', 'メイン・サブジョブ', '活動時間・自己紹介'],
                exampleLabel: '架空の例',
                example: '平日は21時以降にログインします。ゆっくり学べる仲間を探しています。',
                privacy: '募集に必要な時間帯だけを書き、個人の連絡先はコミュニティの安全な方法を使ってください。',
            },
            {
                id: 'screenshot',
                title: 'スクリーンショットの記録',
                summary: 'キャラクターの好きな瞬間や雰囲気を一枚の画像として残したいときに向いています。',
                fieldsLabel: 'おすすめ項目',
                fields: ['高解像度スクリーンショット', 'レイアウト・ポイントカラー', '少数のステッカー'],
                exampleLabel: '架空の例',
                example: '最近のGposeで気に入った一枚を中心にまとめました。',
                privacy: 'スクリーンショットに他のプレイヤーの名前やチャットが写っていないか確認してください。',
            },
        ],
        sectionLabel: '作成の流れ',
        sections: [
            {
                id: 'purpose',
                title: 'カードに載せる情報を選ぶ',
                intro: 'カードは情報を増やすほど良くなるものではありません。共有する場所で一目で伝えたい内容を先に決めると、入力と装飾が簡単になります。',
                points: [
                    '名前・ワールド・メインジョブのような識別情報と、プレイスタイル・活動時間のような交流に役立つ情報を分けて考えましょう。',
                    '公式プロフィールやロードストーンの情報を自動でコピーする機能ではなく、見せたい時点のキャラクターを自分で記録するツールです。',
                    '公開する範囲を先に決めてください。入力した情報と画像は、保存・共有するカード画像に含まれます。',
                ],
            },
            {
                id: 'screenshot',
                title: 'スクリーンショットとトリミング',
                intro: '画像がカードの雰囲気を決めますが、装飾よりもキャラクターが見やすい構図を優先しましょう。',
                points: [
                    '顔、装備、全体のシルエットのどれを見せたいか決め、カードの比率で切れないように周囲の余白を残してください。',
                    '明るい画像では明るい文字が、暗い画像では暗い文字が見えにくくなります。プレビューで名前とジョブアイコンを先に確認しましょう。',
                    '低解像度の画像を拡大すると、カードの出力サイズに関係なく粗く見えることがあります。できるだけ高解像度の画像を使ってください。',
                    '横型と縦型を切り替えた後は画像の位置を確認してください。比率が変わると同じ座標でも見える範囲が変わります。',
                ],
            },
            {
                id: 'profile',
                title: '基本情報と自己紹介を書く',
                intro: '短い一文でもカードの目的を明確にできます。好きなこと、活動時間、望む交流のどれか一つから書き始めましょう。',
                points: [
                    'ゲーム内の名前と公開名が異なる場合は「ゲーム内と異なる」を有効にし、自己紹介にゲーム内の名前を重ねて書かない方法もあります。',
                    '一緒に遊ぶ人が自分を見つける必要がある場合に、ワールドとデータセンターを選んでください。',
                    'プレイスタイルのタグは雰囲気を伝え、タグで表しきれない活動や交流方法はコメントで補足します。',
                    'カードに必要のない本名、連絡先、細かな生活予定は入力しないでください。',
                ],
            },
            {
                id: 'jobs',
                title: 'ジョブとプレイスタイルを表現する',
                intro: 'メインジョブはカードの視線を集める軸です。それ以外のジョブは、今楽しんでいるコンテンツの幅を伝える補助情報になります。',
                points: [
                    '一番よく遊ぶ、または今紹介したいジョブを一つ選びましょう。メインジョブを選ばなくてもジョブ一覧は利用できます。',
                    '戦闘・製作・採集のジョブはカード内で分かれて表示されます。見せたい範囲だけを選ぶと読みやすくなります。',
                    'プレイスタイルはすべて選ぶより、今の遊び方をよく表す項目を少数選ぶ方が伝わります。',
                    'ジョブレベルはある時点の記録です。自動確認は行わないため、必要ならコメントに基準時点を書いてください。',
                ],
            },
            {
                id: 'style',
                title: 'スタイルと装飾を整える',
                intro: 'スタイルは情報を読むための土台です。ステッカーとポイントカラーは情報と競合しないように最後に加えましょう。',
                points: [
                    '大きなタイトルだけでなく、小さなワールド名やジョブ名まで読めるかを基準にフォントを選んでください。',
                    'ポイントカラーは色単体ではなく、名前・ジョブアイコン・本文とのコントラストを先に確認しましょう。',
                    'ステッカーは空いた場所を補う程度に使い、名前、ジョブアイコン、自己紹介を隠さないようにプレビューで確認してください。',
                    'レイアウトを決めて画像を配置してから、色とステッカーを加えると調整のやり直しが減ります。',
                ],
            },
            {
                id: 'save',
                title: '保存・共有前に確認する',
                intro: '画像を保存すると、現在のカードプレビューがPNG画像としてダウンロードされます。共有前に画像に実際に表示される情報を確認してください。',
                points: [
                    'モバイルのアプリ内ブラウザではダウンロードがブロックされることがあります。保存できない場合はChrome、Safari、Edgeなどの外部ブラウザを試してください。',
                    '一部の編集状態はブラウザのlocalStorageに残ることがありますが、ブラウザデータやCookieを削除すると消える場合があります。完成したカードは画像で保管してください。',
                    '共有前に名前、ワールド、スクリーンショットに写った他のプレイヤーの名前やチャットを確認してください。',
                    '本サービスはSQUARE ENIXと公式提携していないファンプロジェクトです。ゲーム、フォント、画像の権利は各権利者に帰属します。',
                ],
            },
        ],
        referenceTitle: '現在選択できる範囲',
        referenceIntro: '以下はエディターと同じジョブ・ワールドデータから生成されます。データが更新されると、この参考欄も一緒に変わります。',
        roleNames: { battle: '戦闘ジョブ', crafting: '製作ジョブ', gathering: '採集ジョブ' },
        jobCountLabel: 'ジョブ',
        worldScopeTitle: 'ワールドとデータセンター',
        worldScopeIntro: '韓国ワールドとグローバルデータセンターを選択できます。ロードストーンからキャラクターを自動取得する機能はありません。',
        regionCountLabel: '地域',
        dataCenterCountLabel: 'データセンター',
        worldCountLabel: 'ワールド',
        checklistTitle: '保存前チェックリスト',
        checklistIntro: 'このチェックリストは現在のセッションだけで動作し、サーバーやアカウントには保存されません。',
        checklist: [
            { id: 'image', label: '画像が意図した位置と大きさで表示されています。' },
            { id: 'identity', label: '名前とワールドの表記が正しいです。' },
            { id: 'job', label: 'メインジョブとプレイスタイルが今の自分を表しています。' },
            { id: 'privacy', label: '公開したくない個人情報が表示されていません。' },
            { id: 'contrast', label: '文字とポイントカラーのコントラストが十分です。' },
            { id: 'share', label: '共有する場所でもカードを読むことができます。' },
        ],
        checklistProgress: (completed, total) => `${completed}/${total} 確認`,
        createCta: 'カード作成に戻る',
        exampleNotice: '例文は作成の方向性を示す架空の文章です。',
    },
} satisfies Record<Language, GuideCopy>;
