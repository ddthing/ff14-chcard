import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';
import { usePlayerSelector } from '../contexts/PlayerContext';
import { aboutContent } from '../utils/aboutContent';
import { pageMeta } from '../utils/pageMeta';

export function About() {
    const lang = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const t = aboutContent[lang];
    const meta = pageMeta[lang].about;

    return (
        <>
            <SeoHead meta={meta} path="/about" />
            <PageLayout title={t.title}>
                <article className="space-y-10 pb-12" itemScope itemType="https://schema.org/AboutPage">
                    <header className="space-y-4 border-b pb-8" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>
                            {t.eyebrow}
                        </p>
                        <p className="max-w-2xl text-[16px] leading-8" style={{ color: 'var(--text-secondary)' }}>{t.intro}</p>
                    </header>

                    <div className="space-y-6">
                        {t.sections.map(section => (
                            <section key={section.id} id={section.id} className="border p-6 md:p-8" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}>
                                <h2 className="text-[20px] font-semibold" style={{ color: 'var(--text-primary)' }}>{section.title}</h2>
                                {section.paragraphs && (
                                    <div className="mt-4 space-y-4 leading-7" style={{ color: 'var(--text-secondary)' }}>
                                        {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                                    </div>
                                )}
                                {section.items && (
                                    <ul className="mt-4 space-y-3 leading-7" style={{ color: 'var(--text-secondary)' }}>
                                        {section.items.map(item => (
                                            <li key={item} className="flex items-start gap-3">
                                                <Check size={16} className="mt-1 shrink-0" style={{ color: 'var(--foreground)' }} aria-hidden="true" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}
                    </div>

                    <div className="flex justify-end border-t pt-6" style={{ borderColor: 'var(--border-subtle)' }}>
                        <Link to="/" className="inline-flex items-center gap-2 text-[14px] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]" style={{ color: 'var(--text-primary)' }}>
                            {t.cta}
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                </article>
            </PageLayout>
        </>
    );
}
