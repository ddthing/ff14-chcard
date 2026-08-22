import { usePlayer } from '../../contexts/PlayerContext';
import { getContrastColor } from '../../utils/styles';
import { i18n } from '../../utils/i18n';
import { JOBS } from '../../data/jobs';

export function CardMainJob() {
    const { playerInfo } = usePlayer();
    const { mainJob, jobLevels, language: lang } = playerInfo;
    const t = i18n[lang].preview;

    if (!mainJob) return null;

    const mJob = JOBS.find(j => j.id === mainJob);
    if (!mJob) return null;

    const getJobName = (job: typeof JOBS[0], useFullName = false) => {
        if (lang === 'ko') return job.nameKr;
        if (lang === 'ja') return job.nameJa;
        return useFullName ? job.name : job.nameEn;
    };

    const localizedMainJobName = getJobName(mJob, true);

    return (
        <div 
            className="relative flex items-center overflow-hidden rounded-xl border p-4 pr-20 transition-[background-color,border-color,box-shadow] group/mainjob"
            style={{ 
                backgroundColor: `${playerInfo.pointColor}10`, 
                borderColor: `${playerInfo.pointColor}30` 
            }}
        >
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: playerInfo.pointColor }}></div>
            
            <img src={mJob.iconUrl} alt={localizedMainJobName} width={48} height={48} className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 dark-invert transition-transform duration-300 group-hover/mainjob:scale-110" />
            <div className="relative z-10 min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-1 opacity-90" style={{ color: playerInfo.pointColor }}>{t.mainJob}</div>
                <div className="text-2xl font-black tracking-tight leading-none text-slate-900 dark:text-slate-100 whitespace-nowrap">{localizedMainJobName}</div>
                <div className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap" style={{ backgroundColor: playerInfo.pointColor, color: getContrastColor(playerInfo.pointColor) }}>
                    Lv.{jobLevels[mainJob] || '?'}
                </div>
            </div>
        </div>
    );
}
