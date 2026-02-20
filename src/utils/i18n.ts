export const i18n = {
    ko: {
        form: {
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
        }
    },
    en: {
        form: {
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
            battleMax: 'Combat Lv.100',
            lifeMax: 'DoH/DoL Lv.100',
            reset: 'Reset',
            playstyle: 'Playstyle',
            details: 'Details',
            selectTime: 'Select Active Time',
            customTime: 'Enter custom active time',
            list: 'List',
            commentPlaceholder: 'Search Comment (Max 200 chars)',
            uploadImage: 'Upload Image',
            delete: 'Delete',
            font: 'Font',
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

export const getActiveTimes = (lang: 'ko' | 'en') => lang === 'ko' ? ACTIVE_TIMES_KO : ACTIVE_TIMES_EN;
export const PLAYSTYLES_KO = [
    '초보/새싹', '복귀 유저', '하드코어/레이드', '절 레이드',
    '라이트/즐겜', '스샷/룩덕', '하우징', '제작/채집',
    'RP(롤플레잉)', 'PVP', '업적작', '지도/보물고',
    '디스코드 가능', '트위터 교류', '인게임 위주'
];

export const PLAYSTYLES_EN = [
    'Sprout / Beginner', 'Returner', 'Hardcore / Raid', 'Ultimate Raids',
    'Casual / Social', 'Gpose / Glamour', 'Housing', 'Crafter / Gatherer',
    'Roleplay (RP)', 'PvP', 'Achievement Hunter', 'Treasure Hunt',
    'Discord Available', 'Twitter (X) Active', 'In-game Focused'
];

export const getPlaystyles = (lang: 'ko' | 'en') => lang === 'ko' ? PLAYSTYLES_KO : PLAYSTYLES_EN;

export const playstyleTranslate = (tag: string, toLang: 'ko' | 'en') => {
    // tag is always stored as KO in playerInfo to maintain backward compatibility
    if (toLang === 'ko') return tag;
    const index = PLAYSTYLES_KO.indexOf(tag);
    return index !== -1 ? PLAYSTYLES_EN[index] : tag;
};

export const FONTS_KO = [
    { id: 'font-pretendard', name: '프리텐다드' },
    { id: 'font-paperozi', name: '페이퍼로지' },
    { id: 'font-a2z', name: '에이투지체' },
    { id: 'font-tmoney', name: '티머니 둥근바람' },
    { id: 'font-cookie', name: '쿠키런체' },
    { id: 'font-police', name: '경찰공평체' },
    { id: 'font-myungjo', name: '부크크 명조' },
    { id: 'font-stardust', name: 'PF스타더스트' },
    { id: 'font-gangwon', name: '강원교육모두체' },
    { id: 'font-galmuri', name: '갈무리11' },
    { id: 'font-tangba', name: '탕바체' },
    { id: 'font-puradak', name: '푸라닭 젠틀고딕' },
];

export const FONTS_EN = [
    { id: 'font-pretendard', name: 'Pretendard' },
    { id: 'font-paperozi', name: 'Paperlogy' },
    { id: 'font-a2z', name: 'A2Z' },
    { id: 'font-tmoney', name: 'TMoney RoundWind' },
    { id: 'font-cookie', name: 'CookieRun' },
    { id: 'font-police', name: 'Police Fairness' },
    { id: 'font-myungjo', name: 'Bookk Myungjo' },
    { id: 'font-stardust', name: 'PF Stardust' },
    { id: 'font-gangwon', name: 'Gangwon Edu Modu' },
    { id: 'font-galmuri', name: 'Galmuri 11' },
    { id: 'font-tangba', name: 'Tangba' },
    { id: 'font-puradak', name: 'Puradak Gentle Gothic' },
];

export const getFonts = (lang: 'ko' | 'en') => lang === 'ko' ? FONTS_KO : FONTS_EN;
