import type { Language } from '../types';

export const contactContent: Record<Language, {
    title: string;
    h1: string;
    p1: string;
    emailTitle: string;
    emailDesc: string;
    snsTitle: string;
    snsDesc: string;
    bugTitle: string;
    bugDesc: string;
    sponsor: string;
    faqLink: string;
    copyEnvironment: string;
    copiedEnvironment: string;
    copyFailed: string;
    newWindow: string;
}> = {
    ko: {
        title: '문의하기 (Contact)', h1: '연락처 및 버그 제보',
        p1: '서비스 오류, 기능 제안, 기타 문의사항은 아래 채널을 이용해주세요.',
        emailTitle: '이메일 문의', emailDesc: '일반 문의나 비즈니스 관련 연락은 아래 이메일로 부탁드립니다.',
        snsTitle: '소셜 미디어 (개발자)', snsDesc: '트위터 멘션이나 DM을 통한 피드백도 환영합니다.',
        bugTitle: '버그 리포트', bugDesc: '먼저 자주 묻는 질문을 확인하고, 해결되지 않으면 스크린샷과 기기·브라우저 정보를 함께 보내주세요.',
        sponsor: '서버 유지비 후원 (Ko-fi)', faqLink: '자주 묻는 질문 확인', copyEnvironment: '기기·브라우저 정보 복사',
        copiedEnvironment: '기기·브라우저 정보를 복사했습니다.', copyFailed: '정보를 복사하지 못했습니다. 브라우저 정보를 직접 적어주세요.', newWindow: '새 창에서 열림',
    },
    en: {
        title: 'Contact Us', h1: 'Contact & Bug Reports',
        p1: 'Use the channels below for service issues, feature requests, or other inquiries.',
        emailTitle: 'Email', emailDesc: 'For general inquiries or business contacts:',
        snsTitle: 'Social Media', snsDesc: 'Feedback via Twitter mentions or DMs is also welcome.',
        bugTitle: 'Bug Reports', bugDesc: 'Check the FAQ first. If the issue remains, include a screenshot and your device and browser information.',
        sponsor: 'Support Server Costs (Ko-fi)', faqLink: 'Check the FAQ', copyEnvironment: 'Copy device & browser info',
        copiedEnvironment: 'Device and browser information copied.', copyFailed: 'Could not copy the information. Please enter your browser details manually.', newWindow: 'opens in a new window',
    },
    ja: {
        title: 'お問い合わせ (Contact)', h1: 'お問い合わせ・バグ報告',
        p1: 'サービスのエラー、機能のご提案、その他のお問い合わせは下記の窓口をご利用ください。',
        emailTitle: 'メール', emailDesc: '一般的なお問い合わせはこちらへお願いします。',
        snsTitle: 'ソーシャルメディア', snsDesc: 'TwitterのメンションやDMからのフィードバックも歓迎します。',
        bugTitle: 'バグ報告', bugDesc: 'まずよくある質問を確認し、解決しない場合はスクリーンショットと端末・ブラウザ情報を添えてください。',
        sponsor: 'サーバー維持費のサポート (Ko-fi)', faqLink: 'よくある質問を確認', copyEnvironment: '端末・ブラウザ情報をコピー',
        copiedEnvironment: '端末・ブラウザ情報をコピーしました。', copyFailed: '情報をコピーできませんでした。ブラウザ情報を手動で入力してください。', newWindow: '新しいウィンドウで開きます',
    },
};
