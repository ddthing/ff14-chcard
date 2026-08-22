import { useState } from 'react';
import {
    ArrowRight,
    ChevronDown,
    ClipboardCheck,
    Compass,
    Download,
    Image as ImageIcon,
    Paintbrush,
    ShieldCheck,
    Swords,
    UserRound,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { usePlayerSelector } from '../contexts/PlayerContext';
import { guideContent, type GuideSectionId } from '../utils/guideContent';
import { getGuideReference } from '../utils/guideReference';
import { pageMeta } from '../utils/pageMeta';

const SECTION_ICONS: Record<GuideSectionId, typeof Compass> = {
    purpose: Compass,
    screenshot: ImageIcon,
    profile: UserRound,
    jobs: Swords,
    style: Paintbrush,
    save: Download,
};

export function Guide() {
    const lang = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const t = guideContent[lang];
    const meta = pageMeta[lang].guide;
    const reference = getGuideReference(lang);
    const [checklistState, setChecklistState] = useState<{ lang: typeof lang; checked: Record<string, boolean> }>({
        lang,
        checked: {},
    });
    const checked = checklistState.lang === lang ? checklistState.checked : {};

    const completedCount = t.checklist.filter(item => checked[item.id]).length;

    return (
        <>
            <Helmet>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <link rel="canonical" href="https://ff14-chcard.pages.dev/guide" />
            </Helmet>
            <PageLayout title={t.title}>
                <article className="space-y-10 pb-12">
                    <header className="space-y-4 border-b pb-8" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>
                            {t.eyebrow}
                        </p>
                        <p className="max-w-2xl text-[16px] leading-8" style={{ color: 'var(--text-secondary)' }}>
                            {t.intro}
                        </p>
                    </header>

                    <nav
                        aria-label={t.contentsLabel}
                        className="border p-5"
                        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}
                    >
                        <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                            <ClipboardCheck size={16} aria-hidden="true" />
                            {t.contentsLabel}
                        </div>
                        <ol className="grid gap-2 text-[13px] sm:grid-cols-2">
                            <li>
                                <a className="inline-flex items-center gap-2 hover:underline" href="#use-cases" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>00</span>
                                    {t.useCasesTitle}
                                </a>
                            </li>
                            {t.sections.map((section, index) => (
                                <li key={section.id}>
                                    <a className="inline-flex items-center gap-2 hover:underline" href={`#${section.id}`} style={{ color: 'var(--text-secondary)' }}>
                                        <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{String(index + 1).padStart(2, '0')}</span>
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a className="inline-flex items-center gap-2 hover:underline" href="#supported-scope" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>07</span>
                                    {t.referenceTitle}
                                </a>
                            </li>
                            <li>
                                <a className="inline-flex items-center gap-2 hover:underline" href="#checklist" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>08</span>
                                    {t.checklistTitle}
                                </a>
                            </li>
                        </ol>
                    </nav>

                    <section id="use-cases" className="scroll-mt-24 space-y-4">
                        <div>
                            <h2 className="text-[22px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>{t.useCasesTitle}</h2>
                            <p className="mt-2 leading-7" style={{ color: 'var(--text-secondary)' }}>{t.useCasesIntro}</p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            {t.useCases.map(useCase => (
                                <article
                                    key={useCase.id}
                                    className="flex min-w-0 flex-col border p-5"
                                    style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}
                                >
                                    <h3 className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>{useCase.title}</h3>
                                    <p className="mt-2 text-[13px] leading-6" style={{ color: 'var(--text-secondary)' }}>{useCase.summary}</p>
                                    <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>{useCase.fieldsLabel}</p>
                                        <ul className="mt-2 space-y-1 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                                            {useCase.fields.map(field => <li key={field}>· {field}</li>)}
                                        </ul>
                                    </div>
                                    <div className="mt-4 border-l-2 pl-3 text-[13px] leading-6" style={{ borderColor: 'var(--foreground)', color: 'var(--text-primary)' }}>
                                        <p className="mb-1 text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{useCase.exampleLabel}</p>
                                        <p>{useCase.example}</p>
                                    </div>
                                    <p className="mt-auto pt-4 text-[12px] leading-5" style={{ color: 'var(--text-muted)' }}>{useCase.privacy}</p>
                                </article>
                            ))}
                        </div>
                        <p className="flex items-start gap-2 text-[12px] leading-5" style={{ color: 'var(--text-muted)' }}>
                            <ShieldCheck size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                            {t.exampleNotice}
                        </p>
                    </section>

                    <div className="space-y-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>{t.sectionLabel}</p>
                        {t.sections.map((section, index) => {
                            const Icon = SECTION_ICONS[section.id];
                            return (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-24 border p-6 md:p-8"
                                    style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex size-9 shrink-0 items-center justify-center border" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', backgroundColor: 'var(--surface-200)' }}>
                                            <Icon size={17} aria-hidden="true" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{String(index + 1).padStart(2, '0')}</p>
                                            <h2 className="mt-1 text-[20px] font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>{section.title}</h2>
                                        </div>
                                    </div>
                                    <p className="mt-5 leading-7" style={{ color: 'var(--text-secondary)' }}>{section.intro}</p>
                                    <ul className="mt-5 space-y-3 border-t pt-5 text-[14px] leading-7" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                                        {section.points.map(point => (
                                            <li key={point} className="flex items-start gap-3">
                                                <span className="mt-3 size-1.5 shrink-0" style={{ backgroundColor: 'var(--foreground)' }} aria-hidden="true" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            );
                        })}
                    </div>

                    <section id="supported-scope" className="scroll-mt-24 space-y-5 border p-6 md:p-8" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}>
                        <div>
                            <h2 className="text-[22px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>{t.referenceTitle}</h2>
                            <p className="mt-2 leading-7" style={{ color: 'var(--text-secondary)' }}>{t.referenceIntro}</p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                [reference.totalRegions, t.regionCountLabel],
                                [reference.totalDataCenters, t.dataCenterCountLabel],
                                [reference.totalWorlds, t.worldCountLabel],
                            ].map(([value, label]) => (
                                <div key={label} className="border-l-2 py-1 pl-3" style={{ borderColor: 'var(--foreground)' }}>
                                    <p className="font-mono text-[22px] font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                                    <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {reference.roles.map(role => (
                                <div key={role.id} className="border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
                                    <div className="flex items-baseline justify-between gap-3">
                                        <h3 className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>{t.roleNames[role.id]}</h3>
                                        <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{role.jobs.length}{t.jobCountLabel}</span>
                                    </div>
                                    <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                                        {role.jobs.map(job => <li key={job.id}>{job.label}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t pt-5" style={{ borderColor: 'var(--border-subtle)' }}>
                            <div>
                                <h3 className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>{t.worldScopeTitle}</h3>
                                <p className="mt-1 text-[13px] leading-6" style={{ color: 'var(--text-secondary)' }}>{t.worldScopeIntro}</p>
                            </div>
                            {reference.regions.map(region => (
                                <details key={region.id} className="group border" style={{ borderColor: 'var(--border-subtle)' }}>
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[14px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-medium)]" style={{ color: 'var(--text-primary)' }}>
                                        <span>{region.label}</span>
                                        <ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                                    </summary>
                                    <div className="grid gap-3 border-t p-4 sm:grid-cols-2" style={{ borderColor: 'var(--border-subtle)' }}>
                                        {region.dataCenters.map(dataCenter => (
                                            <div key={dataCenter.id}>
                                                <h4 className="text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{dataCenter.label}</h4>
                                                <p className="mt-1 text-[12px] leading-5" style={{ color: 'var(--text-secondary)' }}>{dataCenter.worlds.join(' · ')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>

                    <section id="checklist" className="scroll-mt-24 border p-6 md:p-8" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-[22px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>{t.checklistTitle}</h2>
                                <p className="mt-2 leading-7" style={{ color: 'var(--text-secondary)' }}>{t.checklistIntro}</p>
                            </div>
                            <span className="shrink-0 font-mono text-[12px]" style={{ color: 'var(--text-muted)' }}>{t.checklistProgress(completedCount, t.checklist.length)}</span>
                        </div>
                        <div className="mt-5 grid gap-2 border-t pt-5 sm:grid-cols-2" style={{ borderColor: 'var(--border-subtle)' }}>
                            {t.checklist.map(item => (
                                <label key={item.id} className="flex cursor-pointer items-start gap-3 border p-3 text-[13px] leading-5 transition-colors hover:bg-[var(--surface-200)]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(checked[item.id])}
                                        onChange={event => setChecklistState({
                                            lang,
                                            checked: { ...checked, [item.id]: event.target.checked },
                                        })}
                                        className="mt-1 size-4 shrink-0 accent-[var(--foreground)]"
                                    />
                                    <span>{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-end border-t pt-6" style={{ borderColor: 'var(--border-subtle)' }}>
                        <Link to="/" className="inline-flex items-center gap-2 text-[14px] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]" style={{ color: 'var(--text-primary)' }}>
                            {t.createCta}
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                </article>
            </PageLayout>
        </>
    );
}
