import { forwardRef, useRef, useState, type ChangeEvent } from 'react';
import type { PlayerInfo } from '../types';
import { JOBS } from '../data/jobs';
import { Sprout, Crown, ImagePlus } from 'lucide-react';
import { i18n, playstyleTranslate, activeTimeTranslate } from '../utils/i18n';
import { ImageCropperModal } from './ImageCropperModal';
import { JobList } from './preview/JobList';

/**
 * Card Preview Component
 * 
 * Renders the final character card based on the user's input.
 * Supports real-time image cropping and dynamic job/status display.
 */
interface CardPreviewProps {
    playerInfo: PlayerInfo;
    id?: string;
    onImageChange?: (image: string | undefined) => void;
}

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ playerInfo, id, onImageChange }, ref) => {
    const { name, server, region, jobs, playstyles, activeTime, comment, image, font, mainJob, isSprout, isMentor, jobLevels, isNicknameChanged } = playerInfo;

    const lang = playerInfo.language;
    const t = i18n[lang].preview;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setCropImageSrc(reader.result as string);
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = '';
    };

    const handleCropApply = (croppedImageBase64: string) => {
        onImageChange?.(croppedImageBase64);
        setCropImageSrc(null);
    };

    const handleCropCancel = () => {
        setCropImageSrc(null);
    };

    // Sort jobs: Main job first
    const sortedJobs = JOBS.filter(j => jobs.includes(j.id)).sort((a, b) => {
        if (a.id === mainJob) return -1;
        if (b.id === mainJob) return 1;
        return 0;
    });

    // Group by role for display
    const battleJobs = sortedJobs.filter(j => ['Tank', 'Healer', 'Melee', 'Physical Ranged', 'Magical Ranged', 'Limited'].includes(j.role));
    const craftingJobs = sortedJobs.filter(j => j.role === 'Crafting');
    const gatheringJobs = sortedJobs.filter(j => j.role === 'Gathering');

    const getJobName = (job: typeof JOBS[0]) => {
        if (lang === 'ko') return job.nameKr;
        if (lang === 'ja') return job.nameJa;
        return job.nameEn;
    };

    return (
        <div
            className={`max-w-none bg-white dark:bg-[#1d1d1f] text-neutral-900 dark:text-[#f5f5f7] shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden relative rounded-2xl flex ${playerInfo.layout === 'left-portrait' ? 'w-[800px] flex-row min-h-[720px]' : 'w-[700px] flex-col'} ${font}`}
            ref={ref}
            id={id}
        >
            {cropImageSrc && (
                <ImageCropperModal
                    imageSrc={cropImageSrc}
                    onApply={handleCropApply}
                    onCancel={handleCropCancel}
                    lang={lang}
                    aspectRatio={playerInfo.layout === 'left-portrait' ? 2 / 4.5 : 700 / 280}
                />
            )}

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />

            {/* Image Section */}
            {image ? (
                <div
                    className={`${playerInfo.layout === 'left-portrait' ? 'w-[320px] min-h-[720px] border-r border-[#d2d2d7] dark:border-[#3a3a3c]' : 'w-full h-[280px]'} relative overflow-hidden group cursor-pointer shrink-0`}
                    onClick={() => fileInputRef.current?.click()}
                    title={t.clickToEdit}
                >
                    <img
                        src={image}
                        alt="Character"
                        className="absolute inset-0 w-full h-full object-cover select-none transition-transform group-hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-medium text-sm flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
                            <ImagePlus size={16} /> {t.clickToEdit}
                        </span>
                    </div>
                </div>
            ) : (
                <div
                    className={`${playerInfo.layout === 'left-portrait' ? 'w-[320px] min-h-[720px] border-r border-neutral-200 dark:border-[#3a3a3c]' : 'w-full h-[280px] border-b border-neutral-200 dark:border-[#3a3a3c]'} bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-[#2d2d2f] dark:to-[#3a3a3c] flex flex-col items-center justify-center gap-3 cursor-pointer hover:from-neutral-200 hover:to-neutral-300 dark:hover:from-[#3a3a3c] dark:hover:to-[#48484a] transition-colors group shrink-0 relative`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="p-4 bg-white/50 dark:bg-black/20 rounded-full group-hover:scale-110 transition-transform">
                        <ImagePlus size={32} className="text-neutral-400 dark:text-[#86868b]" />
                    </div>
                    <span className="text-neutral-500 dark:text-[#86868b] text-sm font-semibold text-center px-4">{t.uploadPlease}</span>
                </div>
            )}

            {/* Content */}
            <div className={`p-8 space-y-6 flex-1`}>

                {/* Name / Server / Status */}
                <div className="flex items-end justify-between border-b border-neutral-100 dark:border-[#3a3a3c] pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight leading-none whitespace-nowrap">
                                {name || 'Unknown'}
                            </h1>
                            {isSprout && (
                                <span style={{ color: playerInfo.pointColor }} title={t.sprout}>
                                    <Sprout size={22} />
                                </span>
                            )}
                            {isMentor && (
                                <span style={{ color: playerInfo.pointColor }} title={t.mentor}>
                                    <Crown size={22} />
                                </span>
                            )}
                            {isNicknameChanged && (
                                <span 
                                    className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap"
                                    style={{ backgroundColor: `${playerInfo.pointColor}20`, color: playerInfo.pointColor }}
                                >
                                    {t.diffIngame}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-sm text-neutral-500 dark:text-[#a1a1a6] font-medium whitespace-nowrap">{server}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#3a3a3c] text-neutral-400 dark:text-[#86868b] font-semibold whitespace-nowrap">{region}</span>
                        </div>
                    </div>
                    {activeTime && (
                        <div className="text-right">
                           <p className="text-[10px] font-bold text-neutral-400 dark:text-[#86868b] uppercase tracking-[0.2em] mb-0.5" style={{ fontFamily: 'inherit' }}>{t.activeTime}</p>
                           <span className="text-xs text-neutral-400 dark:text-[#86868b] font-medium whitespace-nowrap">
                               {activeTimeTranslate(activeTime, lang)}
                           </span>
                        </div>
                    )}
                </div>

                {/* Main Job Highlight */}
                {mainJob && (() => {
                    const mJob = JOBS.find(j => j.id === mainJob);
                    if (!mJob) return null;
                    const localizedJobName = getJobName(mJob);
                    return (
                        <div 
                            className="flex items-center gap-4 rounded-xl p-4 border"
                            style={{ backgroundColor: `${playerInfo.pointColor}10`, borderColor: `${playerInfo.pointColor}30` }}
                        >
                            <img src={mJob.iconUrl} alt={localizedJobName} className="w-12 h-12 dark-invert" />
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: playerInfo.pointColor }}>{t.mainJob}</div>
                                <div className="text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">{localizedJobName}</div>
                                <div className="text-xs whitespace-nowrap opacity-70" style={{ color: playerInfo.pointColor }}>{mJob.nameEn} · Lv.{jobLevels[mainJob] || '?'}</div>
                            </div>
                        </div>
                    );
                })()}

                {/* Job List with Levels */}
                {sortedJobs.length > 0 && (
                    <div className="space-y-4">
                        <JobList title={t.battle} jobs={battleJobs} mainJob={mainJob} jobLevels={jobLevels} lang={lang} type="battle" pointColor={playerInfo.pointColor} />
                        <JobList title={t.crafting} jobs={craftingJobs} jobLevels={jobLevels} lang={lang} type="crafting" pointColor={playerInfo.pointColor} />
                        <JobList title={t.gathering} jobs={gatheringJobs} jobLevels={jobLevels} lang={lang} type="gathering" pointColor={playerInfo.pointColor} />
                    </div>
                )}

                {/* Playstyles */}
                {playstyles.length > 0 && (
                    <div>
                        <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">{t.playstyle}</div>
                        <div className="flex flex-wrap gap-1.5">
                            {playstyles.map(tag => (
                                <span 
                                    key={tag} 
                                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                                    style={{ backgroundColor: `${playerInfo.pointColor}15`, color: playerInfo.pointColor }}
                                >
                                    {playstyleTranslate(tag, lang)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comment */}
                {comment && (
                    <div className="bg-neutral-50 dark:bg-[#2d2d2f] rounded-xl p-4">
                        <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">{t.comment}</div>
                        <p className="text-sm text-neutral-700 dark:text-[#d1d1d6] whitespace-pre-wrap leading-relaxed italic">"{comment}"</p>
                    </div>
                )}

                {/* Footer */}
                <div className="pt-3 border-t border-neutral-100 dark:border-[#3a3a3c] flex justify-between items-center">
                    <span className="text-[10px] text-neutral-300 dark:text-[#6e6e73] font-bold tracking-[0.25em]" style={{ fontFamily: 'inherit' }}>{t.footerTitle}</span>
                    <span className="text-[10px] text-neutral-300 dark:text-[#6e6e73]">
                        Made by <a href="https://x.com/reconeur" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-500 dark:hover:text-[#a1a1a6] transition-colors underline decoration-neutral-200 dark:decoration-[#3a3a3c] underline-offset-2">@reconeur</a> · {new Date().getFullYear()}
                    </span>
                </div>
            </div>
        </div>
    );
});

CardPreview.displayName = "CardPreview";
