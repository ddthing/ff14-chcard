import type { Language } from '../types';

export interface PageMeta {
    title: string;
    description: string;
}

export const pageMeta = {
    ko: {
        home: {
            title: 'FF14 캐릭터 카드 생성기 - 파판14 캐릭터 시트 만들기',
            description: '파이널 판타지 14(FF14) 캐릭터 카드를 쉽고 예쁘게 만들어 보세요. 직업, 서버, 활동 시간 등을 꾸미고 고화질 PNG로 저장할 수 있는 무료 온라인 도구입니다.',
        },
        guide: {
            title: '가이드 - FF14 캐릭터 카드 생성기',
            description: 'FF14 캐릭터 카드 생성기의 사용 방법을 안내합니다. 기본 정보 입력부터 직업, 디자인, 이미지 저장까지 단계별로 확인해 보세요.',
        },
        faq: {
            title: '자주 묻는 질문 - FF14 캐릭터 카드 생성기',
            description: 'FF14 캐릭터 카드 생성기 사용 중 자주 묻는 질문과 문제 해결 방법을 확인하세요.',
        },
        about: {
            title: '소개 - FF14 캐릭터 카드 생성기',
            description: 'FF14 캐릭터 카드 생성기의 제작 목적, 주요 기능, 개인정보 보호 방침을 소개합니다.',
        },
        contact: {
            title: '문의하기 - FF14 캐릭터 카드 생성기',
            description: 'FF14 캐릭터 카드 생성기의 버그 제보, 기능 제안, 기타 문의 방법을 안내합니다.',
        },
        terms: {
            title: '이용약관 - FF14 캐릭터 카드 생성기',
            description: 'FF14 캐릭터 카드 생성기의 이용약관을 안내합니다.',
        },
        privacy: {
            title: '개인정보처리방침 - FF14 캐릭터 카드 생성기',
            description: 'FF14 캐릭터 카드 생성기의 개인정보 처리 방식과 이용자 권리를 안내합니다.',
        },
    },
    en: {
        home: {
            title: 'FF14 Character Card Generator - Create Your FFXIV Card',
            description: 'Create a beautiful Final Fantasy XIV character card with jobs, home world, playstyle, and more. Customize it and save a high-resolution PNG for free.',
        },
        guide: {
            title: 'Guide - FF14 Character Card Generator',
            description: 'Learn how to use the FF14 Character Card Generator, from entering profile details and jobs to customizing and saving your card.',
        },
        faq: {
            title: 'Frequently Asked Questions - FF14 Character Card Generator',
            description: 'Find answers to common questions and troubleshooting tips for the FF14 Character Card Generator.',
        },
        about: {
            title: 'About - FF14 Character Card Generator',
            description: 'Learn about the purpose, features, and privacy principles behind the FF14 Character Card Generator.',
        },
        contact: {
            title: 'Contact - FF14 Character Card Generator',
            description: 'Find contact details for bug reports, feature requests, and other questions about the FF14 Character Card Generator.',
        },
        terms: {
            title: 'Terms of Service - FF14 Character Card Generator',
            description: 'Read the terms of service for the FF14 Character Card Generator.',
        },
        privacy: {
            title: 'Privacy Policy - FF14 Character Card Generator',
            description: 'Learn how the FF14 Character Card Generator handles data and protects user privacy.',
        },
    },
    ja: {
        home: {
            title: 'FF14 キャラクターカードジェネレーター - FF14カードを作成',
            description: 'ファイナルファンタジーXIVのキャラクターカードを簡単に作成できます。ジョブ、ワールド、プレイスタイルなどを設定して、高解像度PNGで保存できます。',
        },
        guide: {
            title: 'ガイド - FF14 キャラクターカードジェネレーター',
            description: 'プロフィール情報やジョブの入力からデザイン、画像の保存まで、FF14キャラクターカードの作り方を紹介します。',
        },
        faq: {
            title: 'よくある質問 - FF14 キャラクターカードジェネレーター',
            description: 'FF14キャラクターカードジェネレーターに関するよくある質問とトラブル解決方法を確認できます。',
        },
        about: {
            title: '紹介 - FF14 キャラクターカードジェネレーター',
            description: 'FF14キャラクターカードジェネレーターの目的、主な機能、プライバシーへの取り組みを紹介します。',
        },
        contact: {
            title: 'お問い合わせ - FF14 キャラクターカードジェネレーター',
            description: 'FF14キャラクターカードジェネレーターへのバグ報告、機能提案、その他のお問い合わせ方法を案内します。',
        },
        terms: {
            title: '利用規約 - FF14 キャラクターカードジェネレーター',
            description: 'FF14キャラクターカードジェネレーターの利用規約をご案内します。',
        },
        privacy: {
            title: 'プライバシーポリシー - FF14 キャラクターカードジェネレーター',
            description: 'FF14キャラクターカードジェネレーターのデータ取り扱いと利用者の権利についてご案内します。',
        },
    },
} satisfies Record<Language, Record<'home' | 'guide' | 'faq' | 'about' | 'contact' | 'terms' | 'privacy', PageMeta>>;
