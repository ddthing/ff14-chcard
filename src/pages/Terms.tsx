import { PageLayout } from '../components/PageLayout';
import { usePlayerSelector } from '../contexts/PlayerContext';
import { i18n } from '../utils/i18n';
import { pageMeta } from '../utils/pageMeta';
import { SeoHead } from '../components/SeoHead';

export function Terms() {
    const lang = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const t = i18n[lang].terms;
    const meta = pageMeta[lang].terms;

    return (
        <>
            <SeoHead meta={meta} path="/terms" />
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
