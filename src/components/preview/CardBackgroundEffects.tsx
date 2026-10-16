import { usePlayerSelector } from '../../contexts/PlayerContext';
import { JOBS } from '../../data/jobs';
export function CardBackgroundEffects() {
    const { cornerWash, jobWatermark, mainJob } = usePlayerSelector(s => s.playerInfo);
    const job = jobWatermark ? JOBS.find(job => job.id === mainJob) : undefined;
    return <>{cornerWash && <span className="sheet-corner-wash" aria-hidden="true" />}{job && <span className="sheet-job-watermark" aria-hidden="true" style={{ maskImage: 'url("' + job.iconUrl + '")' }}><span className="sheet-ink-texture" /></span>}</>;
}
