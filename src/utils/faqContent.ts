import type { Language } from '../types';

export interface FaqItem {
    q: string;
    a: string;
}

export interface FaqCopy {
    pageTitle: string;
    intro: string;
    items: FaqItem[];
}

export const faqContent = {
    ko: {
        pageTitle: '자주 묻는 질문 (FAQ)',
        intro: 'FF14 캐릭터 카드 생성기 사용 시 자주 문의하시는 내용을 정리했습니다. 원하는 답변을 찾지 못하셨다면 문의하기 페이지를 통해 연락해 주세요.',
        items: [
            { q: '이미지 저장이 안 되거나 오류가 발생합니다.', a: '모바일 인앱 브라우저에서는 보안 정책으로 다운로드가 차단될 수 있습니다. Chrome, Safari, Edge 같은 외부 브라우저에서 다시 시도하고, 데스크톱에서는 팝업 차단 설정을 확인해 주세요.' },
            { q: '업로드한 캐릭터 스크린샷과 개인정보가 서버에 저장되나요?', a: '저장되지 않습니다. 이미지 처리와 입력 데이터 처리는 사용자의 브라우저 안에서만 이루어지며, 스크린샷 원본이나 개인 정보를 외부 서버로 전송하지 않습니다.' },
            { q: '글로벌 서버 유저도 사용할 수 있나요?', a: '네. 한국뿐 아니라 북미, 유럽, 일본, 오세아니아의 데이터센터와 월드를 선택할 수 있으며, 영어와 일본어 인터페이스도 제공합니다.' },
            { q: '스마트폰이나 태블릿에서도 카드를 만들 수 있나요?', a: '반응형 레이아웃으로 모바일에서도 사용할 수 있습니다. 세밀한 이미지 크롭과 스티커 배치는 화면이 넓은 PC에서 더 편리합니다.' },
            { q: '캐릭터 로드스톤 API 연동을 지원하나요?', a: '지원하지 않습니다. 특정 시점의 모습이나 원하는 직업 레벨을 자유롭게 표현할 수 있도록 수동 입력 방식을 사용하며, 데이터 수집을 최소화합니다.' },
            { q: '추가하고 싶은 무료 폰트를 제안할 수 있나요?', a: '상업적 이용이 가능한 오픈 라이선스 폰트라면 추가를 검토합니다. 문의하기 페이지나 개발자의 SNS를 통해 폰트 이름과 다운로드 링크를 보내 주세요.' },
            { q: '생성한 카드를 인쇄해서 굿즈나 명함으로 만들어도 되나요?', a: '개인 소장이나 지인과의 소량 공유는 가능합니다. 카드 이미지를 판매해 영리적 이익을 얻는 행위는 관련 2차 창작 가이드라인에 따라 금지됩니다.' },
            { q: 'Mac Safari에서 한글 입력 시 글자가 분리됩니다.', a: 'Mac Safari에서 간혹 발생하는 한글 자소 분리 현상입니다. 문제가 계속되면 Chrome이나 Firefox에서 입력해 주세요.' },
            { q: '스크린샷의 배경을 투명하게 지우고 싶습니다.', a: '현재 배경 제거 기능은 제공하지 않습니다. 게임 내 /gpose에서 단색 배경으로 촬영한 뒤 외부 이미지 도구로 배경을 제거한 PNG를 업로드해 주세요.' },
            { q: '배치한 스티커의 위치나 크기를 어떻게 조절하나요?', a: '스티커를 클릭하면 조작 핸들이 표시됩니다. 핸들을 드래그해 위치, 크기, 회전을 조절하고, 삭제 버튼이나 Delete 키로 제거할 수 있습니다.' },
            { q: '플레이스타일 태그를 직접 입력할 수 있나요?', a: '현재는 일관된 카드 디자인을 위해 제공되는 태그 중에서만 선택할 수 있습니다. 자유로운 소개는 자기소개 코멘트에 작성해 주세요.' },
            { q: '포인트 컬러에 원하는 색상 코드를 직접 입력할 수 있나요?', a: '가능합니다. 색상 선택 도구의 HEX 입력란에 원하는 코드를 입력해 주세요.' },
            { q: '나중에 다시 접속하면 이전 입력 내용이 남아있나요?', a: '일부 설정은 브라우저의 로컬 스토리지에 저장됩니다. 브라우저 데이터나 쿠키를 삭제하면 초기화될 수 있으므로, 완성된 카드는 이미지로 다운로드해 보관해 주세요.' },
            { q: '다운로드한 이미지 화질이 깨져 보입니다.', a: '기본적으로 웹 공유에 맞춘 고화질로 렌더링됩니다. 원본 스크린샷의 해상도가 낮거나 이미지를 크게 확대하면 픽셀화될 수 있으니 고화질 원본을 사용해 주세요.' },
            { q: '새싹과 멘토 아이콘은 어떻게 적용하나요?', a: '기본 정보 탭에서 새싹 또는 멘토 옵션을 활성화하면 카드의 닉네임 옆에 표시됩니다.' },
            { q: '세로형 카드를 가로형으로 바꿀 수 있나요?', a: '네. 기본 탭의 레이아웃에서 가로형과 세로형을 실시간으로 전환할 수 있습니다. 레이아웃을 바꾸면 이미지 위치를 다시 조정해야 할 수 있습니다.' },
            { q: '이 서비스는 스퀘어 에닉스와 관련이 있나요?', a: '아닙니다. 본 서비스는 이용자가 만든 비공식 팬 프로젝트이며 SQUARE ENIX나 액토즈소프트와 공식적인 제휴 관계가 없습니다.' },
            { q: '카드를 영어로 저장하고 싶습니다.', a: '헤더의 언어 선택기에서 English를 선택해 주세요. UI와 카드에 표시되는 직업, 서버, 플레이스타일 등이 영어로 바뀝니다.' },
        ],
    },
    en: {
        pageTitle: 'Frequently Asked Questions (FAQ)',
        intro: 'Here are answers to common questions about the FF14 Character Card Generator. If you cannot find what you need, contact us through the Contact page.',
        items: [
            { q: 'The image will not save or an error appears.', a: 'Mobile in-app browsers may block downloads for security reasons. Try Chrome, Safari, or Edge, and check popup blocking on desktop.' },
            { q: 'Are uploaded screenshots or personal data stored on a server?', a: 'No. Image processing and profile editing happen only in your browser. Original screenshots and personal data are not sent to an external server.' },
            { q: 'Can players on global worlds use the generator?', a: 'Yes. You can choose worlds and data centers in Korea, North America, Europe, Japan, and Oceania. English and Japanese interfaces are also available.' },
            { q: 'Can I create a card on a phone or tablet?', a: 'The responsive layout works on mobile devices. Detailed cropping and sticker placement are more comfortable on a larger PC screen.' },
            { q: 'Does the generator connect to the official Lodestone API?', a: 'No. The generator uses manual input so you can represent any snapshot, job level, or past glamour you want while minimizing data collection.' },
            { q: 'Can I suggest a free font?', a: 'We consider fonts with licenses that allow commercial use. Send the font name and download link through the Contact page or the developer’s social accounts.' },
            { q: 'Can I print the card as merchandise or a business card?', a: 'Personal keepsakes and small gifts are fine. Selling card images for profit is prohibited under the applicable fan-content guidelines.' },
            { q: 'Korean text separates when I type in Safari on Mac.', a: 'This is an occasional Korean IME issue in Mac Safari. If it continues, try entering text in Chrome or Firefox.' },
            { q: 'How can I remove the screenshot background?', a: 'Background removal is not built in. Capture your character against a solid background in /gpose, remove it with an external image tool, and upload the resulting PNG.' },
            { q: 'How do I adjust a sticker’s position or size?', a: 'Click a sticker to show its handles. Drag them to move, resize, or rotate it. Use the delete button or the Delete key to remove it.' },
            { q: 'Can I type a custom playstyle tag?', a: 'For visual consistency, you can choose from the provided tags. Use the profile comment for details that do not fit a tag.' },
            { q: 'Can I enter a custom point-color code?', a: 'Yes. Enter the color in the HEX field of the color picker.' },
            { q: 'Will my profile still be there when I return later?', a: 'Some settings are stored in your browser’s local storage. Clearing browser data or cookies may reset them, so download finished cards as images for safekeeping.' },
            { q: 'The downloaded image looks pixelated.', a: 'Cards are rendered at a high resolution suited to web sharing. A low-resolution source image or heavy enlargement can still cause pixelation, so use a high-resolution screenshot.' },
            { q: 'How do I add the sprout or mentor icon?', a: 'Enable Sprout or Mentor in the Basic Info tab. The icon will appear next to the nickname on the card.' },
            { q: 'Can I change a vertical card to horizontal?', a: 'Yes. Switch between horizontal and vertical layouts in the Basic tab. You may need to reposition the image after changing layouts.' },
            { q: 'Is this service affiliated with SQUARE ENIX?', a: 'No. This is an unofficial fan project made by a player and has no official partnership with SQUARE ENIX or ACTOZ SOFT.' },
            { q: 'How do I save a card in English?', a: 'Choose English in the header language selector. The interface and card labels such as jobs, worlds, and playstyles will switch to English.' },
        ],
    },
    ja: {
        pageTitle: 'よくある質問 (FAQ)',
        intro: 'FF14キャラクターカードジェネレーターに関するよくある質問をまとめました。解決しない場合は、お問い合わせページからご連絡ください。',
        items: [
            { q: '画像を保存できない、またはエラーが表示されます。', a: 'モバイルのアプリ内ブラウザでは、セキュリティ上の理由でダウンロードがブロックされることがあります。Chrome、Safari、Edgeなどの外部ブラウザで試し、PCではポップアップ設定を確認してください。' },
            { q: 'アップロードしたスクリーンショットや個人情報はサーバーに保存されますか？', a: '保存されません。画像処理とプロフィール編集はブラウザ内だけで行われ、元画像や個人情報を外部サーバーへ送信することはありません。' },
            { q: 'グローバル版のワールドでも使えますか？', a: 'はい。韓国、北米、欧州、日本、オセアニアのデータセンターとワールドを選択できます。英語と日本語のUIにも対応しています。' },
            { q: 'スマートフォンやタブレットでも作成できますか？', a: 'レスポンシブレイアウトによりモバイルでも利用できます。細かなトリミングやステッカーの配置は、画面の広いPCの方が操作しやすくなります。' },
            { q: '公式ロードストーンAPIとの連携に対応していますか？', a: '対応していません。過去の装備や任意のジョブレベルなどを自由に表現できるよう手入力方式を採用し、データ収集も最小限にしています。' },
            { q: '追加してほしい無料フォントを提案できますか？', a: '商用利用が可能なライセンスのフォントであれば追加を検討します。お問い合わせページや開発者のSNSから、フォント名とダウンロードリンクをお知らせください。' },
            { q: '作成したカードをグッズや名刺として印刷できますか？', a: '個人で楽しむ範囲や少量の配布は可能です。カード画像を販売して利益を得る行為は、関連する二次創作ガイドラインにより禁止されています。' },
            { q: 'MacのSafariで日本語入力をすると文字が分離します。', a: 'Mac Safariでまれに発生する日本語入力の問題です。解決しない場合はChromeやFirefoxで入力してください。' },
            { q: 'スクリーンショットの背景を透明にしたいです。', a: '背景削除機能は搭載していません。/gposeで単色背景を使って撮影し、外部の画像ツールで背景を削除したPNGをアップロードしてください。' },
            { q: '配置したステッカーの位置や大きさを調整するには？', a: 'ステッカーをクリックすると操作ハンドルが表示されます。ドラッグで移動、拡大縮小、回転ができ、削除ボタンまたはDeleteキーで削除できます。' },
            { q: 'プレイスタイルのタグを直接入力できますか？', a: 'デザインの統一性のため、用意されたタグから選択する方式です。タグでは表せない内容はプロフィールのコメント欄に入力してください。' },
            { q: 'ポイントカラーのコードを直接入力できますか？', a: '可能です。カラーピッカーのHEX入力欄に色コードを入力してください。' },
            { q: '次回アクセスしたときに入力内容は残りますか？', a: '一部の設定はブラウザのローカルストレージに保存されます。ブラウザデータやCookieを削除すると初期化されるため、完成したカードは画像として保存してください。' },
            { q: 'ダウンロードした画像がぼやけて見えます。', a: 'カードはWeb共有に適した高解像度で出力されますが、元画像の解像度が低い場合や大きく拡大した場合はピクセル化することがあります。高解像度の画像を使用してください。' },
            { q: '若葉とメンターのアイコンはどう追加しますか？', a: '基本情報タブで若葉またはメンターを有効にすると、カードの名前の横に表示されます。' },
            { q: '縦型カードを横型に変更できますか？', a: 'はい。基本タブのレイアウトから横型と縦型を切り替えられます。レイアウト変更後は画像の位置を再調整する場合があります。' },
            { q: 'このサービスはSQUARE ENIXと関係がありますか？', a: 'いいえ。本サービスはプレイヤーが制作した非公式のファンプロジェクトであり、SQUARE ENIXやACTOZ SOFTとの公式な提携はありません。' },
            { q: 'カードを英語で保存するには？', a: 'ヘッダーの言語選択からEnglishを選んでください。UIとカード内のジョブ、ワールド、プレイスタイルなどが英語に切り替わります。' },
        ],
    },
} satisfies Record<Language, FaqCopy>;
