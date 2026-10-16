import { usePlayerSelector } from '../../contexts/PlayerContext';
import { i18n } from '../../utils/i18n';
import { JOBS } from '../../data/jobs';
export function CardMainJob() {
    const { mainJob, jobLevels, language: lang } = usePlayerSelector(s => s.playerInfo);
    const job = JOBS.find(candidate => candidate.id === mainJob);
    if (!job || !mainJob) return null;
    const name = lang === 'ko' ? job.nameKr : lang === 'ja' ? job.nameJa : job.name;
    return <section className="sheet-mainjob" aria-label={i18n[lang].preview.mainJob}>
        <span className="sheet-paper-texture" aria-hidden="true" />
        <div className="sheet-mainjob-copy"><p className="sheet-label">{i18n[lang].preview.mainJob}</p><h3 className="sheet-job-name">{name}</h3></div>
        <div className="sheet-mainjob-level" aria-label={i18n[lang].form.jobLevel + ' ' + (jobLevels[mainJob] || '?')}><span>Lv.</span><strong>{jobLevels[mainJob] || '?'}</strong></div>
        <div className="sheet-emblem" aria-hidden="true"><span className="sheet-emblem-icon" style={{ maskImage: 'url("' + job.iconUrl + '")' }}><span className="sheet-ink-texture" /></span></div>
    </section>;
}
