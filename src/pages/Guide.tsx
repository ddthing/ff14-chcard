import { Camera, Palette, Share2, Wand2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/PageLayout';
import { usePlayerSelector } from '../contexts/PlayerContext';
import { i18n } from '../utils/i18n';
import { pageMeta } from '../utils/pageMeta';

const SECTION_ICONS = [Camera, Wand2, Palette, Share2];

export function Guide() {
    const lang = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const t = i18n[lang].guide;
    const meta = pageMeta[lang].guide;

    return (
        <>
            <Helmet>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <link rel="canonical" href="https://ff14-chcard.pages.dev/guide" />
            </Helmet>
            <PageLayout title={t.title}>
                <div className="space-y-8 pb-12">
                    <header className="border-b pb-8" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {t.intro}
                        </p>
                    </header>

                    <div className="space-y-5">
                        {t.sections.map((section, index) => {
                            const Icon = SECTION_ICONS[index % SECTION_ICONS.length];
                            return (
                                <article
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-20 border p-6 md:p-8"
                                    style={{ backgroundColor: 'var(--surface-100)', borderColor: 'var(--border-subtle)' }}
                                >
                                    <div className="mb-4 flex items-start gap-3">
                                        <div
                                            className="flex size-9 shrink-0 items-center justify-center"
                                            style={{ backgroundColor: 'var(--surface-200)', color: 'var(--text-primary)' }}
                                        >
                                            <Icon size={18} aria-hidden="true" />
                                        </div>
                                        <h2 className="text-xl font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                                            {section.h}
                                        </h2>
                                    </div>
                                    <p className="leading-8" style={{ color: 'var(--text-secondary)' }}>
                                        {section.p}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </PageLayout>
        </>
    );
}
