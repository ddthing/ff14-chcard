import type { Job, Language } from '../../types';

interface JobListProps {
    title: string;
    jobs: Job[];
    mainJob?: string;
    jobLevels: Record<string, number>;
    lang: Language;
    type: 'battle' | 'crafting' | 'gathering';
    pointColor: string;
}

export function JobList({ title, jobs, mainJob, jobLevels, lang, type, pointColor }: JobListProps) {
    if (jobs.length === 0) return null;

    // Filter out main job if it's battle
    const displayJobs = type === 'battle' ? jobs.filter(j => j.id !== mainJob) : jobs;
    if (displayJobs.length === 0) return null;

    const getJobName = (job: Job) => {
        if (lang === 'ko') return job.nameKr;
        if (lang === 'ja') return job.nameJa;
        return job.nameEn;
    };

    return (
        <div className="pl-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>{title}</div>
            <div className="flex flex-wrap gap-2">
                {displayJobs.map(job => (
                    <div 
                        key={job.id} 
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border"
                        style={{ backgroundColor: `${pointColor}10`, borderColor: `${pointColor}20` }}
                    >
                        <img src={job.iconUrl} alt="" aria-hidden="true" width={20} height={20} className="w-5 h-5 dark-invert" />
                        <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                            {getJobName(job)}
                        </span>
                        <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                            Lv.{jobLevels[job.id] || '?'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
