import type { Job, Language } from '../../types';
interface JobListProps { title: string; jobs: Job[]; jobLevels: Record<string, number>; lang: Language; type: 'battle' | 'crafting' | 'gathering' }
export function JobList({ title, jobs, jobLevels, lang, type }: JobListProps) {
    if (!jobs.length) return null;
    return <section className="sheet-job-section" data-job-type={type} aria-label={title}>
        <div className="sheet-section-heading"><h3 className="sheet-label">{title}</h3><span className="sheet-count" aria-hidden="true">{String(jobs.length).padStart(2, '0')}</span></div>
        <div className="sheet-job-grid" role="list">{jobs.map(job => {
            const name = lang === 'ko' ? job.nameKr : lang === 'ja' ? job.nameJa : job.name;
            const level = jobLevels[job.id] || '?';
            return <div key={job.id} className="sheet-job" role="listitem" title={name + ' · Lv.' + level}>
                <span className="sheet-job-icon" style={{ maskImage: 'url("' + job.iconUrl + '")' }}><img src={job.iconUrl} alt={name} width={20} height={20} /><span className="sheet-ink-texture" aria-hidden="true" /></span>
                <span className="sheet-job-level"><span>Lv.</span>{level}</span>
            </div>;
        })}</div>
    </section>;
}
