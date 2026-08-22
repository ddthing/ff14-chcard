import { ArrowRight, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { usePlayerSelector } from '../contexts/PlayerContext';
import { faqContent } from '../utils/faqContent';
import { pageMeta } from '../utils/pageMeta';

export function Faq() {
    const lang = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const t = faqContent[lang];
    const meta = pageMeta[lang].faq;
    const guideLink = {
        ko: {
            text: '입력 항목을 고르는 기준과 저장 전 점검표는 가이드에서 확인할 수 있습니다.',
            label: '카드 제작 가이드 보기',
        },
        en: {
            text: 'The guide explains how to choose fields and check a card before saving.',
            label: 'Open the card creation guide',
        },
        ja: {
            text: '入力項目を選ぶ基準と保存前のチェックリストは、ガイドで確認できます。',
            label: 'カード作成ガイドを見る',
        },
    }[lang];

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: t.items.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
            },
        })),
    };

    return (
        <>
            <Helmet>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <link rel="canonical" href="https://ff14-chcard.pages.dev/faq" />
                <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            </Helmet>
            <PageLayout title={t.pageTitle}>
                <article className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
                    <p className="mb-10 text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {t.intro}
                    </p>

                    <div className="grid gap-4">
                        {t.items.map((faq, index) => (
                            <details
                                key={index}
                                className="group border p-5 transition-[color,background-color,border-color,box-shadow] duration-200"
                                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}
                                itemScope
                                itemProp="mainEntity"
                                itemType="https://schema.org/Question"
                            >
                                <summary
                                    className="flex cursor-pointer list-none items-center justify-between text-[16px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                    style={{ color: 'var(--text-primary)' }}
                                    itemProp="name"
                                >
                                    <span className="flex min-w-0 items-start gap-3">
                                        <span className="shrink-0 font-black" style={{ color: 'var(--foreground)' }}>Q.</span>
                                        <span className="break-words">{faq.q}</span>
                                    </span>
                                    <span className="ml-4 shrink-0 opacity-50 transition-transform duration-200 group-open:rotate-180">
                                        <ChevronDown size={16} aria-hidden="true" />
                                    </span>
                                </summary>
                                <div
                                    className="mt-4 border-t pt-4 pl-8 text-[15px] leading-relaxed"
                                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                                    itemScope
                                    itemProp="acceptedAnswer"
                                    itemType="https://schema.org/Answer"
                                >
                                    <span itemProp="text">{faq.a}</span>
                                </div>
                            </details>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-[13px] leading-6" style={{ color: 'var(--text-secondary)' }}>{guideLink.text}</p>
                        <Link to="/guide#checklist" className="inline-flex shrink-0 items-center gap-2 text-[13px] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]" style={{ color: 'var(--text-primary)' }}>
                            {guideLink.label}
                            <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </div>
                </article>
            </PageLayout>
        </>
    );
}
