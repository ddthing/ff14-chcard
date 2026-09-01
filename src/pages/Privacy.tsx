import { PageLayout } from '../components/PageLayout';
import { usePlayerSelector } from '../contexts/PlayerContext';
import { i18n } from '../utils/i18n';
import { pageMeta } from '../utils/pageMeta';
import { SeoHead } from '../components/SeoHead';

export function Privacy() {
    const lang = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const t = i18n[lang].privacy;
    const meta = pageMeta[lang].privacy;

    return (
        <>
            <SeoHead meta={meta} path="/privacy" />
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
