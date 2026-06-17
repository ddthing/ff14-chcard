import { PageLayout } from '../components/PageLayout';
import { usePlayer } from '../contexts/PlayerContext';
import { i18n } from '../utils/i18n';
import { Helmet } from 'react-helmet-async';

export function Privacy() {
    const { playerInfo } = usePlayer();
    const lang = playerInfo.language;
    const t = i18n[lang].privacy;

    return (
        <>
            <Helmet>
                <title>개인정보처리방침 - FF14 캐릭터 카드 생성기</title>
                <meta name="description" content="파이널 판타지 14 캐릭터 카드 생성기의 개인정보처리방침을 안내합니다." />
                <link rel="canonical" href="https://ff14-chcard.pages.dev/privacy" />
            </Helmet>
            <PageLayout title={t.title}>
                <article className="space-y-10" itemScope itemType="https://schema.org/PrivacyPolicy">
                    {t.sections.map((s) => (
                        <section key={s.id} className="scroll-mt-20" id={s.id}>
                            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{s.h}</h2>
                            <p className="text-[15px] leading-relaxed opacity-90">{s.p}</p>
                        </section>
                    ))}
                    <div className="pt-8 mt-10 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-[13px] opacity-70">
                            {t.updatedAt}
                        </p>
                    </div>
                </article>
            </PageLayout>
        </>
    );
}
