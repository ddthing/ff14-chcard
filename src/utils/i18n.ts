import type { Language } from '../types';

export const i18n = {
    ko: {
        layout: {
            title: '프로필 작성',
            tutorial: '정보를 입력하면 실시간으로 미리보기 가능합니다.',
            headerTitle: 'FF14 캐릭터 카드 생성기',
            skipToContent: '콘텐츠로 건너뛰기',
            close: '닫기',
            externalNewWindow: '새 창에서 열림',
            saveImage: '이미지 저장',
            exportErrorCors: '저장 실패 — 브라우저 보안 정책 충돌.\nChrome 사용을 권장하며, 브라우저 확장 프로그램이 활성화된 경우 잠시 꺼보세요.',
            exportErrorGeneric: '저장에 실패했습니다.',
            errorDetails: '세부 정보',
            reset: '초기화',
            renderingTitle: '고화질 카드를 렌더링 중입니다…',
            renderingDesc: '잠시만 기다려주세요',
            loading: '페이지를 불러오는 중입니다…',
            profileSavedWithoutImage: '브라우저 저장 공간이 부족해 이미지 없이 편집 내용을 저장했습니다. 저장 탭에서 JSON 백업을 내보내 주세요.',
            profileSaveFailed: '브라우저 저장 공간이 부족해 편집 내용을 자동 저장하지 못했습니다. 저장 탭에서 JSON 백업을 내보내 주세요.'
        },
        footer: {
            guide: "가이드",
            about: "소개",
            faq: "자주 묻는 질문",
            contact: "문의",
            privacy: "개인정보처리방침",
            terms: "이용약관",
            support: "후원",
            projectNotice: "FF14 캐릭터 카드 생성기 © SQUARE ENIX. 팬 프로젝트"
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
            allMax: '전체 만렙',
            battleMax: '전투 만렙',
            lifeMax: '제작/채집 만렙',
            reset: '초기화',
            resetConfirm: '선택한 항목을 모두 초기화하시겠습니까?',
            playstyle: '플레이 스타일',
            details: '상세 정보',
            selectTime: '접속 시간 선택',
            customTime: '접속 시간을 직접 입력',
            list: '목록',
            commentPlaceholder: '자기소개 (200자 이내)',
            uploadImage: '이미지 업로드',
            imageFileTooLarge: '캐릭터 이미지는 10MB 이하로 업로드해주세요.',
            imageInvalidType: '이미지 파일만 업로드할 수 있습니다.',
            imageUploadError: '이미지를 읽지 못했습니다. 다른 파일을 선택해주세요.',
            delete: '삭제',
            font: '폰트',
            pointColor: '포인트 컬러',
            pointColorHint: '카드의 강조 색상입니다. HEX 코드를 입력하거나 추천 색상을 선택하세요.',
            pointColorInvalid: 'HEX 6자리를 입력해주세요.',
            pointColorContrast: (ratio: string, safe: boolean) => `흰 배경 대비 ${ratio}:1 · ${safe ? '일반 글자 AA 통과' : '일반 글자 AA 미달'}`,
            adjustToSafeColor: '안전 색상으로 조정',
            colorPresets: '추천 색상',
            newbie: '새싹',
            mentor: '멘토',
            tabBasic: '기본',
            tabJob: '직업',
            tabStyle: '스타일',
            tabDesign: '꾸미기',
            tabSlot: '저장',
            stickers: '스티커',
            addSticker: '스티커 추가',
            stickerHint: 'PNG, JPG, GIF 등 2MB 이하 이미지를 추가하세요. 카드에서 위치와 크기를 조절할 수 있습니다.',
            stickerEmpty: '아직 추가된 스티커가 없습니다.',
            stickerFileTooLarge: '스티커는 2MB 이하 이미지로 업로드해주세요.',
            stickerUploadError: '스티커 이미지를 읽지 못했습니다. 다른 이미지를 선택해주세요.',
            stickerDeleted: '스티커를 삭제했습니다.',
            undo: '되돌리기',
            stickerSize: '크기',
            stickerRotate: '회전',
            advancedSticker: '세부 위치 조정',
            centerSticker: '가운데 정렬',
            resetStickerTransform: '크기·회전 초기화',
            tabNavigation: '프로필 작성 단계',
            autoFill: '자동 채우기',
            saveCurrentProfile: '현재 프로필 저장',
            slotName: '슬롯 이름',
            slotNamePlaceholder: '슬롯 이름 (예: 본캐, 부캐)',
            save: '저장',
            savedSlots: '저장된 슬롯',
            noSavedSlots: '저장된 슬롯이 없습니다.',
            load: '불러오기',
            loadConfirm: '현재 작업 중인 내용이 덮어씌워집니다. 불러오시겠습니까?',
            deleteConfirm: '정말 삭제하시겠습니까?',
            defaultCharacter: '캐릭터',
            overwriteSlotConfirm: '같은 이름의 슬롯이 있습니다. 기존 슬롯을 업데이트할까요?',
            slotSaved: '프로필을 저장했습니다.',
            slotUpdated: '저장된 프로필을 업데이트했습니다.',
            slotLoaded: '프로필을 불러왔습니다.',
            slotDeleted: '저장된 프로필을 삭제했습니다.',
            slotSaveError: '브라우저 저장 공간이 부족해 저장하지 못했습니다. 백업을 내보낸 뒤 다시 시도해주세요.',
            exportBackup: '백업 내보내기',
            importBackup: '백업 가져오기',
            importConfirm: '현재 저장 슬롯과 작업 내용을 백업 파일로 교체할까요?',
            backupExported: '백업 파일을 만들었습니다.',
            backupImported: '백업을 가져왔습니다.',
            backupImportError: '올바른 FF14 캐릭터 카드 백업 파일이 아닙니다.',
            moveForward: '앞으로 이동',
            moveBackward: '뒤로 이동',
            zoom: '확대/축소',
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
            dragToMove: '드래그하여 이동 / 슬라이더로 확대',
            uploadPlease: '이미지를 업로드해 주세요',
            homeWorld: '홈 월드',
            activeTime: '활동 시간',
            footerTitle: 'FF14 캐릭터 카드 생성기',
            adjustImageArea: '이미지 영역 설정',
            cropProcessing: '이미지를 처리하고 있습니다.',
            cropError: '이미지를 처리하지 못했습니다. 다른 이미지로 다시 시도해주세요.',
            cancel: '취소',
            apply: '적용하기',
            createOwn: '나만의 카드 만들기:',
            designedBy: '디자인 & 개발:',
            characterImage: '캐릭터 이미지',
            deleteSticker: '스티커 삭제',
            rotateSticker: '스티커 회전 조절',
            scaleSticker: '스티커 크기 조절',
            stickerKeyboardHelp: '포커스 상태에서 방향키로 이동하고, Shift와 방향키로 빠르게 이동하며, Delete 또는 Backspace로 삭제할 수 있습니다.',
        },
        privacy: {
            title: "개인정보처리방침",
            sections: [
                {
                    id: "purpose",
                    h: "1. 개인정보의 처리 목적",
                    p: "본 서비스는 계정이나 공개 프로필을 제공하지 않으며, 사용자가 업로드한 캐릭터 이미지와 입력한 프로필을 서비스 서버에 저장하는 기능을 제공하지 않습니다. 카드 편집과 PNG 생성은 사용자의 브라우저에서 처리됩니다."
                },
                {
                    id: "storage",
                    h: "2. 쿠키 및 브라우저 저장소",
                    p: "카드 편집 상태, 저장 슬롯, 테마 설정 등 일부 정보는 기능 제공을 위해 브라우저의 localStorage에 저장될 수 있습니다. 브라우저 사이트 데이터나 쿠키를 삭제하면 이 정보가 사라질 수 있습니다. 화면에 필요한 웹폰트는 외부 제공처에서 불러올 수 있습니다."
                },
                {
                    id: "rights",
                    h: "3. 정보주체의 권리 및 연락처",
                    p: "브라우저에 저장된 정보는 이용자가 브라우저 사이트 데이터 삭제 기능으로 직접 삭제할 수 있습니다. 서비스 운영, 법적 문의 또는 개인정보 관련 문의는 문의하기 페이지를 이용해 주세요."
                }
            ],
            updatedAt: "최종 수정일: 2026년 8월 22일"
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
    },
    en: {
        layout: {
            title: 'Create Profile',
            tutorial: 'The preview will instantly update as you type.',
            headerTitle: 'FF14 Character Card Generator',
            skipToContent: 'Skip to content',
            close: 'Close',
            externalNewWindow: 'opens in a new window',
            saveImage: 'Save Image',
            exportErrorCors: 'Save failed — a browser security policy blocked the export.\nChrome is recommended. If browser extensions are active, try disabling them temporarily.',
            exportErrorGeneric: 'Save failed.',
            errorDetails: 'Details',
            reset: 'Reset',
            renderingTitle: 'Rendering high-quality card…',
            renderingDesc: 'Please wait a moment',
            loading: 'Loading page…',
            profileSavedWithoutImage: 'Browser storage is full, so your edits were saved without the image. Export a JSON backup from the Save tab.',
            profileSaveFailed: 'Browser storage is full and your edits could not be saved automatically. Export a JSON backup from the Save tab.'
        },
        footer: {
            guide: "Guide",
            about: "About",
            faq: "Frequently Asked Questions",
            contact: "Contact",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            support: "Support",
            projectNotice: "FF14 Character Card Generator © SQUARE ENIX · Fan Project"
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
            allMax: 'All Lv.100',
            battleMax: 'Combat 100',
            lifeMax: 'DoH/L 100',
            reset: 'Reset',
            resetConfirm: 'Reset all selected items?',
            playstyle: 'Playstyle',
            details: 'Details',
            selectTime: 'Select Active Time',
            customTime: 'Enter custom active time',
            list: 'List',
            commentPlaceholder: 'Introduce your character (Max 200 chars)',
            uploadImage: 'Click to upload image',
            imageFileTooLarge: 'Please upload a character image no larger than 10 MB.',
            imageInvalidType: 'Only image files can be uploaded.',
            imageUploadError: 'The image could not be read. Please choose another file.',
            delete: 'Delete',
            font: 'Font',
            pointColor: 'Point Color',
            pointColorHint: 'Accent color for the card. Enter a HEX code or choose a preset.',
            pointColorInvalid: 'Enter a complete 6-digit HEX color.',
            pointColorContrast: (ratio: string, safe: boolean) => `${ratio}:1 on white · ${safe ? 'AA for normal text' : 'Below AA for normal text'}`,
            adjustToSafeColor: 'Adjust to safe color',
            colorPresets: 'Presets',
            newbie: 'Sprout',
            mentor: 'Mentor',
            tabBasic: 'Basic',
            tabJob: 'Jobs',
            tabStyle: 'Style',
            tabDesign: 'Design',
            tabSlot: 'Save',
            stickers: 'Stickers',
            addSticker: 'Add Sticker',
            stickerHint: 'Add a PNG, JPG, or GIF up to 2 MB. Adjust its position and size on the card.',
            stickerEmpty: 'No stickers added yet.',
            stickerFileTooLarge: 'Please upload a sticker image no larger than 2 MB.',
            stickerUploadError: 'The sticker image could not be read. Please choose another image.',
            stickerDeleted: 'Sticker deleted.',
            undo: 'Undo',
            stickerSize: 'Size',
            stickerRotate: 'Rotate',
            advancedSticker: 'Advanced Position',
            centerSticker: 'Center sticker',
            resetStickerTransform: 'Reset size & rotation',
            tabNavigation: 'Profile creation steps',
            autoFill: 'Auto Fill',
            saveCurrentProfile: 'Save current profile',
            slotName: 'Slot name',
            slotNamePlaceholder: 'Slot name (e.g. Main, Alt)',
            save: 'Save',
            savedSlots: 'Saved slots',
            noSavedSlots: 'No saved slots yet.',
            load: 'Load',
            loadConfirm: 'Your current work will be replaced. Load this profile?',
            deleteConfirm: 'Delete this saved profile?',
            defaultCharacter: 'Character',
            overwriteSlotConfirm: 'A slot with this name exists. Update it?',
            slotSaved: 'Profile saved.',
            slotUpdated: 'Saved profile updated.',
            slotLoaded: 'Profile loaded.',
            slotDeleted: 'Saved profile deleted.',
            slotSaveError: 'The browser storage is full. Export a backup and try again.',
            exportBackup: 'Export backup',
            importBackup: 'Import backup',
            importConfirm: 'Replace your saved slots and current work with this backup?',
            backupExported: 'Backup file created.',
            backupImported: 'Backup imported.',
            backupImportError: 'This is not a valid FF14 character card backup.',
            moveForward: 'Move forward',
            moveBackward: 'Move backward',
            zoom: 'Zoom',
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
            dragToMove: 'Drag to move / Slider to zoom',
            uploadPlease: 'Please upload an image',
            homeWorld: 'HOME WORLD',
            activeTime: 'ACTIVE TIME',
            footerTitle: 'FF14 Character Card Generator',
            adjustImageArea: 'Adjust Image Area',
            cropProcessing: 'Processing image.',
            cropError: 'The image could not be processed. Try another image.',
            cancel: 'Cancel',
            apply: 'Apply',
            createOwn: 'Create your own at',
            designedBy: 'Designed & Developed by',
            characterImage: 'Character image',
            deleteSticker: 'Delete sticker',
            rotateSticker: 'Rotate sticker',
            scaleSticker: 'Resize sticker',
            stickerKeyboardHelp: 'While focused, use arrow keys to move, Shift plus an arrow key to move faster, and Delete or Backspace to remove.',
        },
        privacy: {
            title: "Privacy Policy",
            sections: [
                {
                    id: "purpose",
                    h: "1. Data Processing",
                    p: "The service does not provide accounts or public profiles, and it has no feature for storing uploaded character images or profile input on a service server. Card editing and PNG generation happen in your browser."
                },
                {
                    id: "storage",
                    h: "2. Cookies and Browser Storage",
                    p: "Some information such as card editing state, saved slots, and theme settings may be stored in browser localStorage for functionality. Clearing site data or cookies can remove it. Web fonts needed by the interface may be loaded from external providers."
                },
                {
                    id: "contact",
                    h: "3. Rights & Contact",
                    p: "You can delete browser-stored information through your browser's site-data settings. For service, legal, or privacy questions, please use the Contact page."}
            ],
            updatedAt: "Last updated: August 22, 2026"
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
    },
    ja: {
        layout: {
            title: 'プロフィール作成',
            tutorial: '情報を入力するとリアルタイムでプレビューできます。',
            headerTitle: 'FF14 キャラクターカードジェネレーター',
            skipToContent: 'コンテンツへ移動',
            close: '閉じる',
            externalNewWindow: '新しいウィンドウで開きます',
            saveImage: '画像を保存',
            exportErrorCors: '保存に失敗しました — ブラウザのセキュリティポリシーにより書き出しがブロックされました。\nChromeの利用をおすすめします。ブラウザ拡張機能が有効な場合は、一時的に無効にしてお試しください。',
            exportErrorGeneric: '保存に失敗しました。',
            errorDetails: '詳細',
            reset: 'リセット',
            renderingTitle: '高画質カードをレンダリング中です…',
            renderingDesc: '少々お待ちください',
            loading: 'ページを読み込んでいます…',
            profileSavedWithoutImage: 'ブラウザの保存容量が不足したため、画像を除いて編集内容を保存しました。保存タブからJSONバックアップを書き出してください。',
            profileSaveFailed: 'ブラウザの保存容量が不足し、編集内容を自動保存できませんでした。保存タブからJSONバックアップを書き出してください。'
        },
        footer: {
            guide: "ガイド",
            about: "紹介",
            faq: "よくある質問",
            contact: "お問い合わせ",
            privacy: "プライバシーポリシー",
            terms: "利用規約",
            support: "サポート",
            projectNotice: "FF14 キャラクターカード生成機 © SQUARE ENIX · ファンプロジェクト"
        },
        form: {
            layout: 'レイアウト',
            layoutHeader: '横型',
            layoutPortrait: '縦型',
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
            allMax: '全ジョブ Lv.100',
            battleMax: '戦闘 Lv.100',
            lifeMax: '製作/採集 100',
            reset: 'リセット',
            resetConfirm: '選択した項目をすべてリセットしますか？',
            playstyle: 'プレイスタイル',
            details: '詳細情報',
            selectTime: 'ログイン時間を選択',
            customTime: 'ログイン時間を直接入力',
            list: 'リスト',
            commentPlaceholder: '自己紹介 (200文字以内)',
            uploadImage: '画像をアップロード',
            imageFileTooLarge: 'キャラクター画像は10MB以下でアップロードしてください。',
            imageInvalidType: '画像ファイルのみアップロードできます。',
            imageUploadError: '画像を読み込めませんでした。別のファイルを選択してください。',
            delete: '削除',
            font: 'フォント',
            pointColor: 'ポイントカラー',
            pointColorHint: 'カードのアクセントカラーです。HEXコードを入力するか、おすすめから選択してください。',
            pointColorInvalid: '6桁のHEXカラーを入力してください。',
            pointColorContrast: (ratio: string, safe: boolean) => `白背景との比率 ${ratio}:1 · ${safe ? '通常文字AA適合' : '通常文字AA未達'}`,
            adjustToSafeColor: '安全な色に調整',
            colorPresets: 'おすすめ',
            newbie: '若葉',
            mentor: 'メンター',
            tabBasic: '基本',
            tabJob: 'ジョブ',
            tabStyle: 'スタイル',
            tabDesign: 'デザイン',
            tabSlot: '保存',
            stickers: 'ステッカー',
            addSticker: 'ステッカー追加',
            stickerHint: 'PNG・JPG・GIFなど、2MB以下の画像を追加してください。カード上で位置とサイズを調整できます。',
            stickerEmpty: 'まだステッカーがありません。',
            stickerFileTooLarge: 'ステッカーは2MB以下の画像をアップロードしてください。',
            stickerUploadError: 'ステッカー画像を読み込めませんでした。別の画像を選択してください。',
            stickerDeleted: 'ステッカーを削除しました。',
            undo: '元に戻す',
            stickerSize: 'サイズ',
            stickerRotate: '回転',
            advancedSticker: '詳細位置の調整',
            centerSticker: '中央に配置',
            resetStickerTransform: '大きさ・回転をリセット',
            tabNavigation: 'プロフィール作成ステップ',
            autoFill: '自動で合わせる',
            saveCurrentProfile: '現在のプロフィールを保存',
            slotName: 'スロット名',
            slotNamePlaceholder: 'スロット名（例：メイン、サブ）',
            save: '保存',
            savedSlots: '保存済みスロット',
            noSavedSlots: '保存済みのスロットはありません。',
            load: '読み込む',
            loadConfirm: '現在の作業内容が上書きされます。読み込みますか？',
            deleteConfirm: 'この保存プロフィールを削除しますか？',
            defaultCharacter: 'キャラクター',
            overwriteSlotConfirm: '同じ名前のスロットがあります。更新しますか？',
            slotSaved: 'プロフィールを保存しました。',
            slotUpdated: '保存済みプロフィールを更新しました。',
            slotLoaded: 'プロフィールを読み込みました。',
            slotDeleted: '保存済みプロフィールを削除しました。',
            slotSaveError: 'ブラウザの保存容量が不足しています。バックアップを書き出してから再試行してください。',
            exportBackup: 'バックアップを書き出す',
            importBackup: 'バックアップを読み込む',
            importConfirm: '保存済みスロットと現在の作業をこのバックアップに置き換えますか？',
            backupExported: 'バックアップファイルを作成しました。',
            backupImported: 'バックアップを読み込みました。',
            backupImportError: '有効なFF14キャラクターカードのバックアップではありません。',
            moveForward: '前へ移動',
            moveBackward: '後ろへ移動',
            zoom: '拡大・縮小',
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
            dragToMove: 'ドラッグで移動 / スライダーで拡大',
            uploadPlease: '画像をアップロードしてください',
            homeWorld: 'ホームワールド',
            activeTime: '活動時間',
            footerTitle: 'FF14 キャラクターカードジェネレーター',
            adjustImageArea: '画像範囲の設定',
            cropProcessing: '画像を処理しています。',
            cropError: '画像を処理できませんでした。別の画像で再試行してください。',
            cancel: 'キャンセル',
            apply: '適用',
            createOwn: '自分だけのカードを作る:',
            designedBy: 'デザイン & 開発:',
            characterImage: 'キャラクター画像',
            deleteSticker: 'ステッカーを削除',
            rotateSticker: 'ステッカーを回転',
            scaleSticker: 'ステッカーの大きさを調整',
            stickerKeyboardHelp: 'フォーカス中は矢印キーで移動、Shiftと矢印キーで速く移動、DeleteまたはBackspaceで削除できます。',
        },
        privacy: {
            title: "プライバシーポリシー",
            sections: [
                {
                    id: "processing",
                    h: "1. データの取り扱い",
                    p: "本サービスはアカウントや公開プロフィールを提供しておらず、アップロードしたキャラクター画像やプロフィール入力をサービスのサーバーに保存する機能はありません。カードの編集とPNG生成はブラウザ内で行われます。"
                },
                {
                    id: "storage",
                    h: "2. Cookieとブラウザストレージ",
                    p: "カードの編集状態、保存スロット、テーマ設定などの一部情報は、機能のためブラウザのlocalStorageに保存される場合があります。ブラウザデータやCookieを削除すると消えることがあります。画面に必要なWebフォントは外部の提供元から読み込まれる場合があります。"
                },
                {
                    id: "contact",
                    h: "3. 情報主体の権利及び連絡先",
                    p: "ブラウザに保存された情報は、ブラウザのサイトデータ設定から利用者自身で削除できます。サービス運営、法的連絡、プライバシーに関するお問い合わせは、お問い合わせページをご利用ください。"}
            ],
            updatedAt: "最終更新日: 2026年8月22日"
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
