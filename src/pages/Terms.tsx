import { PageLayout } from '../components/PageLayout';
import { usePlayer } from '../contexts/PlayerContext';
import { i18n } from '../utils/i18n';
import { Helmet } from 'react-helmet-async';

export function Terms() {
    const { playerInfo } = usePlayer();
    const lang = playerInfo.language;
    const t = i18n[lang].terms;

    return (
        <>
            <Helmet>
                <title>이용약관 - FF14 캐릭터 카드 생성기</title>
                <meta name="description" content="파이널 판타지 14 캐릭터 카드 생성기의 이용약관을 안내합니다." />
                <link rel="canonical" href="https://ff14-chcard.pages.dev/terms" />
            </Helmet>
            <PageLayout title={t.title}>
            <article className="space-y-10" itemScope itemType="https://schema.org/TermsOfService">
                {t.sections.map((s) => (
                    <section key={s.id} className="scroll-mt-20" id={s.id}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{s.h}</h2>
                        <p className="text-[15px] leading-relaxed opacity-90">{s.p}</p>
                    </section>
                ))}
                <p className="text-sm opacity-60 mt-12">{t.updatedAt}</p>
            </article>
        </PageLayout>
        </>
    );
}
