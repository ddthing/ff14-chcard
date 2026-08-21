import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/PageLayout';
import { usePlayerSelector } from '../contexts/PlayerContext';
import { Bug, Coffee, Mail, MessageCircle } from 'lucide-react';
import { pageMeta } from '../utils/pageMeta';

export function Contact() {
    const lang = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const meta = pageMeta[lang].contact;

    const content = {
        ko: {
            title: "문의하기 (Contact)",
            h1: "연락처 및 버그 제보",
            p1: "서비스 이용 중 발생하는 오류, 추가되었으면 하는 기능, 기타 문의사항이 있으시다면 언제든 아래의 채널을 통해 연락해 주시기 바랍니다.",
            emailTitle: "이메일 문의",
            emailDesc: "일반적인 문의나 비즈니스 관련 연락은 아래 이메일로 부탁드립니다.",
            snsTitle: "소셜 미디어 (개발자)",
            snsDesc: "트위터 멘션이나 DM을 통한 피드백도 환영합니다.",
            bugTitle: "버그 리포트",
            bugDesc: "기술적인 오류나 버그는 스크린샷과 함께 사용 중이신 기기(PC/모바일, 브라우저) 정보를 포함하여 제보해주시면 문제 해결에 큰 도움이 됩니다.",
            sponsor: "서버 유지비 후원 (Ko-fi)"
        },
        en: {
            title: "Contact Us",
            h1: "Contact & Bug Reports",
            p1: "If you encounter any issues, have feature requests, or any other inquiries, please feel free to reach out through the channels below.",
            emailTitle: "Email",
            emailDesc: "For general inquiries or business contacts:",
            snsTitle: "Social Media",
            snsDesc: "Feedback via Twitter mentions or DMs is also welcome.",
            bugTitle: "Bug Reports",
            bugDesc: "When reporting technical errors, please include a screenshot and information about your device/browser to help us fix it faster.",
            sponsor: "Support Server Costs (Ko-fi)"
        },
        ja: {
            title: "お問い合わせ (Contact)",
            h1: "お問い合わせ・バグ報告",
            p1: "ご利用中のエラー、機能の追加要望、その他のお問い合わせにつきましては、下記の窓口よりいつでもご連絡ください。",
            emailTitle: "メール",
            emailDesc: "一般的なお問い合わせはこちらへお願いします。",
            snsTitle: "ソーシャルメディア",
            snsDesc: "TwitterのメンションやDMからのフィードバックも歓迎します。",
            bugTitle: "バグ報告",
            bugDesc: "技術的な問題やバグについては、スクリーンショットとご利用のデバイス(PC/スマホ、ブラウザ)情報を添えていただくと、迅速な解決に繋がります。",
            sponsor: "サーバー維持費のサポート (Ko-fi)"
        }
    }[lang];

    return (
        <>
            <Helmet>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <link rel="canonical" href="https://ff14-chcard.pages.dev/contact" />
            </Helmet>
            <PageLayout title={content.title}>
                <article className="space-y-10" itemScope itemType="https://schema.org/ContactPage">
                    <section>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{content.h1}</h2>
                        <p className="leading-relaxed opacity-90">{content.p1}</p>
                    </section>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="p-6 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}>
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Mail size={18} aria-hidden="true" /> {content.emailTitle}
                            </h3>
                            <p className="opacity-80 text-sm mb-4">{content.emailDesc}</p>
                            <a href="mailto:coner@luv3r.me" className="font-medium hover:underline" style={{ color: 'var(--foreground)' }}>
                                coner@luv3r.me
                            </a>
                        </section>

                        <section className="p-6 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}>
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <MessageCircle size={18} aria-hidden="true" /> {content.snsTitle}
                            </h3>
                            <p className="opacity-80 text-sm mb-4">{content.snsDesc}</p>
                            <a href="https://x.com/reconeur" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: 'var(--foreground)' }}>
                                @reconeur
                            </a>
                        </section>

                        <section className="p-6 rounded-xl border md:col-span-2" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}>
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Bug size={18} aria-hidden="true" /> {content.bugTitle}
                            </h3>
                            <p className="opacity-80 text-sm mb-4">{content.bugDesc}</p>
                            <div className="pt-2 border-t mt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                                <a href="https://ko-fi.com/reconeur" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 font-medium hover:opacity-70 transition-opacity">
                                    <Coffee size={16} aria-hidden="true" /> {content.sponsor}
                                </a>
                            </div>
                        </section>
                    </div>
                </article>
            </PageLayout>
        </>
    );
}
