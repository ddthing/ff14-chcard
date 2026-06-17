import type { Language } from '../types';

export const i18n = {
    ko: {
        layout: {
            title: '프로필 작성',
            tutorial: '정보를 입력하면 실시간으로 미리보기 가능합니다.',
            headerTitle: 'FF14 캐릭터 카드 생성기',
            saveImage: '이미지 저장',
            saveError: '이미지 생성에 실패했습니다.',
            reset: '초기화',
            renderingTitle: '고화질 카드를 렌더링 중입니다...',
            renderingDesc: '잠시만 기다려주세요'
        },
        footer: {
            home: "홈",
            guide: "가이드",
            about: "소개",
            faq: "FAQ",
            contact: "문의",
            privacy: "개인정보처리방침",
            terms: "이용약관"
        },
        changelog: {
            title: '새로운 소식',
            close: '확인'
        },
        form: {
            layout: '레이아웃',
            layoutHeader: '가로형',
            layoutPortrait: '세로형',
            basicInfo: '기본 정보',
            nickname: '닉네임',
            diffIngame: '인게임과 다름',
            selectServer: '서버 선택',
            job: '직업',
            battle: '전투',
            crafting: '제작',
            gathering: '채집',
            mainJobSelect: '주 직업 선택',
            pleaseSelect: '선택해주세요',
            jobLevel: '직업 레벨',
            applyAll: '일괄 적용',
            allMax: '전체 만렙',
            battleMax: '전투 만렙',
            lifeMax: '제작/채집 만렙',
            reset: '초기화',
            playstyle: '플레이 스타일',
            details: '상세 정보',
            selectTime: '접속 시간 선택',
            customTime: '접속 시간을 직접 입력',
            list: '목록',
            commentPlaceholder: '자기소개 (200자 이내)',
            uploadImage: '이미지 업로드',
            delete: '삭제',
            font: '폰트',
            pointColor: '포인트 컬러',
            newbie: '새싹',
            mentor: '멘토',
            tabBasic: '기본',
            tabJob: '직업',
            tabStyle: '스타일',
            tabDesign: '꾸미기',
            stickers: '스티커',
            addSticker: '스티커 추가',
            stickerX: '가로 위치',
            stickerY: '세로 위치',
            stickerSize: '크기',
            stickerRotate: '회전',
            advancedSticker: '세부 위치 조정',
        },
        preview: {
            sprout: '새싹',
            mentor: '멘토',
            diffIngame: '인게임과 다름',
            mainJob: '주 직업',
            battle: '전투 직업',
            crafting: '제작',
            gathering: '채집',
            playstyle: '플레이 스타일',
            comment: '한마디',
            clickToEdit: '클릭하여 편집',
            editDone: '편집 완료',
            dragToMove: '드래그하여 이동 / 슬라이더로 확대',
            uploadPlease: '이미지를 업로드해 주세요',
            homeWorld: '홈 월드',
            activeTime: '활동 시간',
            footerTitle: 'FF14 캐릭터 카드 생성기',
            adjustImageArea: '이미지 영역 설정',
            cancel: '취소',
            apply: '적용하기',
            emptyName: '닉네임을 입력해 주세요',
            createOwn: '나만의 카드 만들기:',
            designedBy: '디자인 & 개발:',
            defaultComment: '에오르제아에서 함께 모험하며 소중한 추억을 쌓을 인연을 기다리고 있어요. 부담 없이 다가와 주세요! ✨'
        },
        privacy: {
            title: "개인정보처리방침",
            sections: [
                {
                    id: "purpose",
                    h: "1. 개인정보의 처리 목적",
                    p: "본 서비스는 사용자가 업로드하는 캐릭터 이미지를 서버에 저장하거나 별도의 개인 식별 정보를 수집하지 않습니다. 모든 카드 생성 및 편집 작업은 사용자의 브라우저 로컬 환경(Client-side) 내에서만 처리됩니다."
                },
                {
                    id: "ads",
                    h: "2. 쿠키 및 광고 서비스 (AdSense)",
                    p: "본 사이트는 Google AdSense 광고 서비스를 이용합니다. 구글은 사용자의 방문 기록을 바탕으로 최적화된 광고를 제공하기 위해 쿠키(Cookie)를 사용할 수 있습니다. 사용자는 브라우저 설정 또는 구글 광고 설정 페이지를 통해 쿠키 수집을 거부할 수 있습니다."
                },
                {
                    id: "rights",
                    h: "3. 정보주체의 권리 및 연락처",
                    p: "본 서비스는 개인 정보를 보관하지 않으므로 데이터 삭제 요청이 불필요하나, 서비스 운영 및 법적 문의가 필요한 경우 개발자 (https://coner.luv3r.me/)에게 문의해 주시기 바랍니다."
                }
            ],
            updatedAt: "최종 수정일: 2026년 4월 25일"
        },
        terms: {
            title: "이용약관",
            sections: [
                {
                    id: "svc",
                    h: "1. 서비스 이용",
                    p: "본 서비스는 비상업적 목적으로 운영되는 팬 제작 도구입니다. 생성된 캐릭터 카드는 개인 SNS 공유 및 커뮤니티 활동 등 비영리적 용도로 자유롭게 사용하실 수 있습니다."
                },
                {
                    id: "copyright",
                    h: "2. 저작권 안내",
                    p: "서비스 내 사용된 직업 아이콘 및 관련 에셋의 모든 권리는 SQUARE ENIX CO., LTD.에 있습니다. 본 서비스는 스퀘어 에닉스의 2차 창작 가이드라인을 준수하며, 이를 영리 목적으로 재판매하는 행위는 엄격히 금지됩니다."
                }
            ],
            updatedAt: "최종 수정일: 2026년 4월 25일"
        },
        guide: {
            title: "사용자 가이드",
            intro: "FF14 캐릭터 카드 생성기를 100% 활용하는 방법을 안내해 드립니다.",
            sections: [
                {
                    id: "intro_detail",
                    h: "FF14 캐릭터 카드 생성기란?",
                    p: "파이널 판타지 14(FFXIV)를 즐기는 모험가 분들을 위한 온라인 프로필 제작 도구입니다. 본인의 캐릭터 스크린샷과 게임 내 정보를 입력하면, 트위터(X)나 인스타그램, 디스코드 등 다양한 SNS에 공유하기 좋은 고화질 캐릭터 카드를 즉시 생성할 수 있습니다. 복잡한 이미지 편집 프로그램이나 포토샵을 다룰 필요 없이, 누구나 웹 브라우저에서 마우스 클릭만으로 나만의 개성 있는 프로필을 완성할 수 있습니다."
                },
                {
                    id: "step1",
                    h: "1. 기본 정보 및 서버(홈 월드) 설정",
                    p: "가장 먼저 캐릭터의 닉네임과 소속된 홈 월드를 입력해 주세요. 한국 서버(카벙클, 초코보, 모그리, 톤베리, 펜리르)는 물론, 일본, 북미, 유럽, 오세아니아 등 글로벌 전 데이터센터의 서버를 선택할 수 있습니다. '인게임과 다름' 옵션을 체크하면 인게임 닉네임과 SNS 활동명이 다를 경우 유용하게 사용할 수 있습니다."
                },
                {
                    id: "step2",
                    h: "2. 직업 및 레벨 세팅 (전투/제작/채집)",
                    p: "파이널 판타지 14의 모든 직업을 완벽하게 지원합니다. 나이트, 전사, 백마도사 등의 탱커/힐러부터 최신 확장팩에 추가된 바이퍼, 픽토맨서까지 21종의 전투 직업은 물론, 목수, 요리사 등 8종의 제작 직업(DoH)과 3종의 채집 직업(DoL) 레벨을 세밀하게 설정할 수 있습니다. 만렙 유저를 위해 버튼 한 번으로 전투, 채집/제작 직업을 한 번에 100레벨로 설정할 수 있는 '일괄 적용' 기능도 제공됩니다."
                },
                {
                    id: "step3",
                    h: "3. 플레이스타일과 코멘트 (자기소개)",
                    p: "하드코어, 레이드, 절 레이드, 룩덕, 하우징, 스크린샷, 터주 낚시, 롤플레잉(RP) 등 여러분이 에오르제아에서 가장 즐겨 하는 콘텐츠를 태그 형태로 선택해 보세요. 그리고 200자 이내의 코멘트 란에는 트위터 트친소나 부대 모집 시 전하고 싶은 인사말을 작성할 수 있습니다."
                },
                {
                    id: "step4",
                    h: "4. 이미지 첨부 및 꾸미기 (폰트/색상/스티커)",
                    p: "캐릭터의 가장 멋진 스크린샷을 업로드한 뒤, 원하는 비율과 위치로 크롭(자르기) 하세요. 프리텐다드, 쿠키런, 갈무리9 등 14종의 예쁜 한국어 웹 폰트 중 하나를 선택하고, 테마에 맞는 포인트 컬러(HEX 코드)를 지정해 카드 분위기를 완전히 바꿀 수 있습니다. 마지막으로 다양한 스티커를 카드 위에 붙여 꾸미면 세상에 단 하나뿐인 프로필이 완성됩니다."
                },
                {
                    id: "step5",
                    h: "5. 고화질 이미지 저장 및 공유",
                    p: "모든 설정이 완료되면 화면 하단의 '이미지 저장' 버튼을 누르세요. 서버를 거치지 않고 브라우저 자체적으로 고해상도 PNG 이미지를 렌더링하여 안전하고 빠르게 다운로드할 수 있습니다. 완성된 이미지는 트위터의 #파판14_트친소 해시태그와 함께 공유해 새로운 인연을 만들어 보세요!"
                }
            ]
        }
    },
    en: {
        layout: {
            title: 'Create Profile',
            tutorial: 'The preview will instantly update as you type.',
            headerTitle: 'FF14 Character Card Generator',
            saveImage: 'Save Image',
            saveError: 'Failed to generate image.',
            reset: 'Reset',
            renderingTitle: 'Rendering high-quality card...',
            renderingDesc: 'Please wait a moment'
        },
        footer: {
            home: "Home",
            guide: "Guide",
            about: "About",
            faq: "FAQ",
            contact: "Contact",
            privacy: "Privacy Policy",
            terms: "Terms of Service"
        },
        changelog: {
            title: "What's New",
            close: 'Got it'
        },
        form: {
            layout: 'Layout',
            layoutHeader: 'Horizontal',
            layoutPortrait: 'Vertical',
            basicInfo: 'Basic Info',
            nickname: 'Character Name',
            diffIngame: 'Diff. IGN',
            selectServer: 'Select Home World',
            job: 'Classes / Jobs',
            battle: 'DoW & DoM',
            crafting: 'DoH',
            gathering: 'DoL',
            mainJobSelect: 'Select Main Job',
            pleaseSelect: 'Please select',
            jobLevel: 'Job Level',
            applyAll: 'Apply',
            allMax: 'All Lv.100',
            battleMax: 'Combat 100',
            lifeMax: 'DoH/L 100',
            reset: 'Reset',
            playstyle: 'Playstyle',
            details: 'Details',
            selectTime: 'Select Active Time',
            customTime: 'Enter custom active time',
            list: 'List',
            commentPlaceholder: 'Search Comment (Max 200 chars)',
            uploadImage: 'Click to upload image',
            delete: 'Delete',
            font: 'Font',
            pointColor: 'Point Color',
            newbie: 'Sprout',
            mentor: 'Mentor',
            tabBasic: 'Basic',
            tabJob: 'Jobs',
            tabStyle: 'Style',
            tabDesign: 'Design',
            stickers: 'Stickers',
            addSticker: 'Add Sticker',
            stickerX: 'Pos X',
            stickerY: 'Pos Y',
            stickerSize: 'Size',
            stickerRotate: 'Rotate',
            advancedSticker: 'Advanced Position',
        },
        preview: {
            sprout: 'Sprout',
            mentor: 'Mentor',
            diffIngame: 'Diff. IGN',
            mainJob: 'Main Job',
            battle: 'DoW & DoM',
            crafting: 'DoH',
            gathering: 'DoL',
            playstyle: 'Playstyle',
            comment: 'Comment',
            clickToEdit: 'Click to edit',
            editDone: 'Done',
            dragToMove: 'Drag to move / Slider to zoom',
            uploadPlease: 'Please upload an image',
            homeWorld: 'HOME WORLD',
            activeTime: 'ACTIVE TIME',
            footerTitle: 'FF14 Character Card Generator',
            adjustImageArea: 'Adjust Image Area',
            cancel: 'Cancel',
            apply: 'Apply',
            emptyName: 'Please enter nickname',
            createOwn: 'Create your own at',
            designedBy: 'Designed & Developed by',
            defaultComment: "Always looking for new friends to explore Eorzea together. Don't hesitate to reach out! Let's make some memories. ✨"
        },
        privacy: {
            title: "Privacy Policy",
            sections: [
                {
                    id: "purpose",
                    h: "1. Data Processing",
                    p: "We do not store your images or collect personal data on our servers. All processing happens locally in your browser (Client-side) for maximum security."
                },
                {
                    id: "ads",
                    h: "2. Cookies and Ads (Google AdSense)",
                    p: "This site uses Google AdSense. Google may use cookies to serve ads based on your visits to this or other websites. You can opt out via your browser settings or Google Ad settings."
                },
                {
                    id: "contact",
                    h: "3. Rights & Contact",
                    p: "Since we do not store any personal data, deletion requests are not necessary. For service-related or legal inquiries, please contact the developer at https://coner.luv3r.me/"}
            ],
            updatedAt: "Last updated: April 25, 2026"
        },
        terms: {
            title: "Terms of Service",
            sections: [
                {
                    id: "usage",
                    h: "1. Service Usage",
                    p: "This is a non-commercial fan-made tool. Generated cards can be freely used for personal social media and community activities."
                },
                {
                    id: "copyright",
                    h: "2. Copyright Notice",
                    p: "All rights to game assets (icons, etc.) belong to SQUARE ENIX CO., LTD. Commercial resale of these assets or the generated cards is strictly prohibited."
                }
            ],
            updatedAt: "Last updated: April 25, 2026"
        },
        guide: {
            title: "User Guide",
            intro: "Learn how to make the most of the FF14 Character Card Generator.",
            sections: [
                {
                    id: "basic",
                    h: "1. Basic Setup & Layout",
                    p: "Enter your character name and Home World. Choose between horizontal or vertical layouts. For best results, upload a high-resolution screenshot."
                },
                {
                    id: "jobs",
                    h: "2. Jobs & Levels",
                    p: "Select your main job to highlight it on your card. Input your levels for combat, crafting, and gathering classes. Use the 'Apply' buttons to quickly set multiple classes to max level."
                },
                {
                    id: "playstyle",
                    h: "3. Playstyle & Comment",
                    p: "Select playstyle tags like Hardcore, Glamour, or Housing to show what you enjoy most. Add a short comment (up to 200 characters) to greet other players."
                },
                {
                    id: "custom",
                    h: "4. Design & Save",
                    p: "Pick a theme-matching point color (HEX) and font. Decorate empty spaces with custom stickers. Once you're done, click 'Save Image' at the bottom to download your card."
                }
            ]
        }
    },
    ja: {
        layout: {
            title: 'プロフィール作成',
            tutorial: '情報を入力するとリアルタイムでプレビューできます。',
            headerTitle: 'FF14 キャラクターカードジェネレーター',
            saveImage: '画像を保存',
            saveError: '画像の生成に失敗しました。',
            reset: 'リセット',
            renderingTitle: '高画質カードをレンダリング中です...',
            renderingDesc: '少々お待ちください'
        },
        footer: {
            home: "ホーム",
            guide: "ガイド",
            about: "About",
            faq: "FAQ",
            contact: "お問い合わせ",
            privacy: "プライバシーポリシー",
            terms: "利用規約"
        },
        changelog: {
            title: 'アップデートのお知らせ',
            close: '確認'
        },
        form: {
            layout: 'レイアウト',
            layoutHeader: '縦型',
            layoutPortrait: '横型',
            basicInfo: '基本情報',
            nickname: 'キャラクター名',
            diffIngame: 'ゲーム内と異なる',
            selectServer: 'ワールド選択',
            job: 'クラス / ジョブ',
            battle: '戦闘職',
            crafting: '製作',
            gathering: '採集',
            mainJobSelect: 'メインジョブ選択',
            pleaseSelect: '選択してください',
            jobLevel: 'ジョブレベル',
            applyAll: '一括適用',
            allMax: '全ジョブ Lv.100',
            battleMax: '戦闘 Lv.100',
            lifeMax: '製作/採集 100',
            reset: 'リセット',
            playstyle: 'プレイスタイル',
            details: '詳細情報',
            selectTime: 'ログイン時間を選択',
            customTime: 'ログイン時間を直接入力',
            list: 'リスト',
            commentPlaceholder: '自己紹介 (200文字以内)',
            uploadImage: '画像をアップロード',
            delete: '削除',
            font: 'フォント',
            pointColor: 'ポイントカラー',
            newbie: '若葉',
            mentor: 'メンター',
            tabBasic: '基本',
            tabJob: 'ジョブ',
            tabStyle: 'スタイル',
            tabDesign: 'デザイン',
            stickers: 'ステッカー',
            addSticker: 'ステッカー追加',
            stickerX: '横位置',
            stickerY: '縦位置',
            stickerSize: 'サイズ',
            stickerRotate: '回転',
            advancedSticker: '詳細位置の調整',
        },
        preview: {
            sprout: '若葉',
            mentor: 'メンター',
            diffIngame: 'ゲーム内と異なる',
            mainJob: 'メインジョブ',
            battle: '戦闘職',
            crafting: '製作',
            gathering: '採集',
            playstyle: 'プレイスタイル',
            comment: '一言',
            clickToEdit: 'クリックして編集',
            editDone: '完了',
            dragToMove: 'ドラッグで移動 / スライダーで拡大',
            uploadPlease: '画像をアップロードしてください',
            homeWorld: 'ホームワールド',
            activeTime: '活動時間',
            footerTitle: 'FF14 キャラクターカードジェネレーター',
            adjustImageArea: '画像範囲の設定',
            cancel: 'キャンセル',
            apply: '適用',
            emptyName: '名前を入力してください',
            createOwn: '自分だけのカードを作る:',
            designedBy: 'デザイン & 開発:',
            defaultComment: 'エオルゼアで一緒に冒険したり、楽しい時間を過ごせる仲間を探しています。お気軽に声をかけてくださいね！ ✨'
        },
        privacy: {
            title: "プライバシーポリシー",
            sections: [
                {
                    id: "processing",
                    h: "1. データの取り扱い",
                    p: "アップロードされた画像や個人情報をサーバーに保存したり、個人の識別情報を収集したりすることはありません。すべてのカード作成および編集作業は、ユーザーのブラウザ内(Client-side)でのみ処理されます。"
                },
                {
                    id: "adsense",
                    h: "2. クッキーと広告 (Google AdSense)",
                    p: "当サイトでは Google AdSense 広告サービスを利用しています。Googleはユーザーの訪問履歴に基づいた広告を提供するためにクッキー(Cookie)を使用することがあります。ブラウザの設定でクッキーの収集を拒否できます。"
                },
                {
                    id: "contact",
                    h: "3. 情報主体の権利及び連絡先",
                    p: "本サービスは個人情報を保管しないため、データの削除要請は不要です。運営上の問い合わせや法的連絡が必要な場合は、開発者 (https://coner.luv3r.me/) までお問い合わせください。"}
            ],
            updatedAt: "最終更新日: 2026年4月25日"
        },
        terms: {
            title: "利用規約",
            sections: [
                {
                    id: "usage",
                    h: "1. サービスの利用",
                    p: "本サービスは非営利目的で運営されるファンツールです。作成されたカードは、個人SNSやコミュニティでの活動など、非営利目的に限り自由にご利用いただけます。"
                },
                {
                    id: "copyright",
                    h: "2. 著作権について",
                    p: "ジョブアイコンなどのゲームアセットの権利はSQUARE ENIX CO., LTD.に帰属します。営利目的での転売や再配布は厳格に禁止されています。"
                }
            ],
            updatedAt: "最終更新日: 2026年4月25日"
        },
        guide: {
            title: "ユーザーガイド",
            intro: "FF14キャラクターカード作成ツールを最大限に活用する方法をご案内します。",
            sections: [
                {
                    id: "setup",
                    h: "1. 基本設定とレイアウト",
                    p: "キャラクター名とホームワールドを入力します。横型または縦型のレイアウトを選択でき、高解像度のスクリーンショットをアップロードするほど綺麗なカードが作成できます。"
                },
                {
                    id: "jobs",
                    h: "2. ジョブとレベル",
                    p: "メインジョブを設定するとカードに反映されます。戦闘、製作、採集タブを使ってレベルを入力してください。「一括適用」ボタンを使うと、すべてカンスト状態に設定できて便利です。"
                },
                {
                    id: "playstyle",
                    h: "3. プレイスタイルと一言",
                    p: "レイド、ミラプリ、ハウジングなど、よく遊ぶプレイスタイルのタグを選択して個性を表現しましょう。200文字以内のコメントで、他のプレイヤーへの挨拶を添えることができます。"
                },
                {
                    id: "design",
                    h: "4. デザインと保存",
                    p: "雰囲気に合うポイントカラー(HEX)とフォントを選びます。ステッカー機能を使って余白を可愛く飾ることも可能です。設定が完了したら、画面下部の「画像を保存」ボタンを押してダウンロードしてください。"
                }
            ]
        }
    }
};

export const ACTIVE_TIMES_KO = [
    '평일 저녁 / 주말 상시',
    '평일 야간 / 주말 랜덤',
    '주말 위주',
    '랜덤 접속 (불규칙)',
    '매일 접속 (하드코어)',
    '새벽반',
    '접속 뜸함',
    '직접 입력'
];
export const ACTIVE_TIMES_EN = [
    'Weekday Evenings / Weekends',
    'Weekday Nights / Random Weekends',
    'Weekends Mostly',
    'Random (Irregular)',
    'Everyday (Hardcore)',
    'Late Night / Dawn',
    'Rarely Active',
    'Custom'
];
export const ACTIVE_TIMES_JA = [
    '平日夜 / 週末常時',
    '平日深夜 / 週末ランダム',
    '週末メイン',
    '不定期',
    '毎日ログイン',
    '深夜・早朝',
    'ログイン少なめ',
    '直接入力'
];

export const getActiveTimes = (lang: Language) => {
    if (lang === 'ko') return ACTIVE_TIMES_KO;
    if (lang === 'ja') return ACTIVE_TIMES_JA;
    return ACTIVE_TIMES_EN;
};

export const PLAYSTYLES_KO = [
    '초보/새싹', '복귀 유저', '하드코어/레이드', '절 레이드',
    '라이트/즐겜', '스샷/룩덕', '하우징', '제작/채집', '터주',
    'RP(롤플레잉)', 'PVP', '업적작', '마작', '골드소서', '지도/보물고',
    '디스코드 가능', '트위터 교류', '인게임 위주'
];

export const PLAYSTYLES_EN = [
    'Sprout / Beginner', 'Returner', 'Hardcore / Raid', 'Ultimate Raids',
    'Casual / Social', 'Gpose / Glamour', 'Housing', 'Crafter / Gatherer', 'Big Fish',
    'Roleplay (RP)', 'PvP', 'Achievement Hunter', 'Mahjong', 'Gold Saucer', 'Treasure Hunt',
    'Discord Available', 'Twitter (X) Active', 'In-game Focused'
];

export const PLAYSTYLES_JA = [
    '初心者/若葉', '復帰勢', 'レイド/高難易度', '絶レイド',
    'ライト勢/エンジョイ', 'SS/ミラプリ', 'ハウジング', 'ギャザクラ', 'ヌシ釣り',
    'RP(ロールプレイ)', 'PvP', 'アチーブメント', '麻雀', 'ゴールドソーサー', '地図/宝物庫',
    'Discord可能', 'Twitter(X)交流有', 'ログイン多め'
];

export const getPlaystyles = (lang: Language) => {
    if (lang === 'ko') return PLAYSTYLES_KO;
    if (lang === 'ja') return PLAYSTYLES_JA;
    return PLAYSTYLES_EN;
};

export const playstyleTranslate = (tag: string, toLang: Language) => {
    if (toLang === 'ko') return tag;
    const index = PLAYSTYLES_KO.indexOf(tag);
    if (index === -1) return tag;
    if (toLang === 'ja') return PLAYSTYLES_JA[index];
    return PLAYSTYLES_EN[index];
};

/**
 * Translates active time strings between languages.
 * Uses Korean as the source of truth if applicable.
 */
export const activeTimeTranslate = (time: string, toLang: Language) => {
    if (toLang === 'ko') return time;

    // Find index in Korean list
    const index = ACTIVE_TIMES_KO.indexOf(time);
    if (index === -1) return time; // Return as-is for custom strings

    const activeTimes = getActiveTimes(toLang);
    return activeTimes[index];
};

export const FONTS_KO = [
    { id: 'font-pretendard', name: '프리텐다드' },
    { id: 'font-mona', name: '모나12' },
    { id: 'font-gmarket', name: 'G마켓 산스' },
    { id: 'font-police', name: '그리운 경찰공평체' },
    { id: 'font-myungjo', name: '부크크 명조' },
    { id: 'font-seabreeze', name: '온글잎 바닷바람' },
    { id: 'font-schoolsafe', name: '학교안심 나드르이' },
    { id: 'font-hancom', name: '한컴 말랑말랑' },
    { id: 'font-cafe24', name: '카페24 슈퍼매직' },
    { id: 'font-gangwon', name: '강원교육모두' },
    { id: 'font-cookierun', name: '쿠키런' },
    { id: 'font-galmuri9', name: '갈무리9' },
    { id: 'font-seogung', name: '서궁' },
    { id: 'font-cloudsanscode', name: '구름 산스 코드' }
];

export const FONTS_EN = [
    { id: 'font-pretendard', name: 'Pretendard' },
    { id: 'font-mona', name: 'Mona12' },
    { id: 'font-gmarket', name: 'GMarket Sans' },
    { id: 'font-police', name: 'Nostalgic Police Fairness' },
    { id: 'font-myungjo', name: 'Bookk Myungjo' },
    { id: 'font-seabreeze', name: 'OngleIp Sea Breeze' },
    { id: 'font-schoolsafe', name: 'School Safe Outing' },
    { id: 'font-hancom', name: 'Hancom Malrangmalrang' },
    { id: 'font-cafe24', name: 'Cafe24 Super Magic' },
    { id: 'font-gangwon', name: 'Gangwon Education Modu' },
    { id: 'font-cookierun', name: 'CookieRun' },
    { id: 'font-galmuri9', name: 'Galmuri9' },
    { id: 'font-seogung', name: 'Seogung' },
    { id: 'font-cloudsanscode', name: 'Cloud Sans Code' }
];

export const FONTS_JA = [
    { id: 'font-pretendard', name: 'Pretendard' },
    { id: 'font-mona', name: 'モナ12' },
    { id: 'font-gmarket', name: 'Gマーケットサンズ' },
    { id: 'font-police', name: '恋しい警察公平体' },
    { id: 'font-myungjo', name: 'ブクク明朝' },
    { id: 'font-seabreeze', name: 'オンリーフ潮風' },
    { id: 'font-schoolsafe', name: '学校安心ナドゥルイ' },
    { id: 'font-hancom', name: 'ハンコムふわふわ' },
    { id: 'font-cafe24', name: 'Cafe24スーパーマジック' },
    { id: 'font-gangwon', name: '江原教育モドゥ' },
    { id: 'font-cookierun', name: 'クッキーラン' },
    { id: 'font-galmuri9', name: 'ガルムリ9' },
    { id: 'font-seogung', name: '西宮' },
    { id: 'font-cloudsanscode', name: 'クルムSansコード' }
];

export const getFonts = (lang: Language) => {
    if (lang === 'ko') return FONTS_KO;
    if (lang === 'ja') return FONTS_JA;
    return FONTS_EN;
};
