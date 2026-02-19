import { forwardRef } from 'react';
import type { PlayerInfo } from '../types';
import { JOBS } from '../data/jobs';
import { Sprout, Crown, ImagePlus } from 'lucide-react';

interface CardPreviewProps {
    playerInfo: PlayerInfo;
    id?: string;
}

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ playerInfo, id }, ref) => {
    const { name, server, region, jobs, playstyles, activeTime, comment, image, font, mainJob, isSprout, isMentor, jobLevels, isNicknameChanged } = playerInfo;

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

    return (
        <div
            className={`w-[700px] bg-white dark:bg-[#1d1d1f] text-neutral-900 dark:text-[#f5f5f7] shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden relative rounded-2xl ${font}`}
            ref={ref}
            id={id}
            style={{}}
        >
            {/* Top: Character Image */}
            {image ? (
                <div className="w-full h-[280px] relative">
                    <img src={image} alt="Character" className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="w-full h-[120px] bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-[#2d2d2f] dark:to-[#3a3a3c] flex flex-col items-center justify-center gap-2">
                    <ImagePlus size={24} className="text-neutral-300 dark:text-[#6e6e73]" />
                    <span className="text-neutral-300 dark:text-[#6e6e73] text-xs font-medium">이미지를 업로드해 주세요</span>
                </div>
            )}

            {/* Content */}
            <div className="p-8 space-y-6">

                {/* Name / Server / Status */}
                <div className="flex items-end justify-between border-b border-neutral-100 dark:border-[#3a3a3c] pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight leading-none">
                                {name || 'Unknown'}
                            </h1>
                            {isSprout && (
                                <span className="text-green-500 dark:text-[#30d158]" title="초보">
                                    <Sprout size={22} />
                                </span>
                            )}
                            {isMentor && (
                                <span className="text-yellow-500 dark:text-[#ff9f0a]" title="멘토">
                                    <Crown size={22} />
                                </span>
                            )}
                            {isNicknameChanged && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-500 font-semibold">인게임과 다름</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-sm text-neutral-500 dark:text-[#a1a1a6] font-medium">{server}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#3a3a3c] text-neutral-400 dark:text-[#86868b] font-semibold">{region}</span>
                        </div>
                    </div>
                    {activeTime && (
                        <span className="text-xs text-neutral-400 dark:text-[#86868b] font-medium">{activeTime}</span>
                    )}
                </div>

                {/* Main Job Highlight */}
                {mainJob && (() => {
                    const mJob = JOBS.find(j => j.id === mainJob);
                    if (!mJob) return null;
                    return (
                        <div className="flex items-center gap-4 bg-neutral-50 dark:bg-[#2d2d2f] rounded-xl p-4">
                            <img src={mJob.iconUrl} alt={mJob.nameKr} className="w-12 h-12 dark-invert" />
                            <div>
                                <div className="text-xs text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider">주 직업</div>
                                <div className="text-xl font-bold leading-tight">{mJob.nameKr}</div>
                                <div className="text-xs text-neutral-500 dark:text-[#a1a1a6]">{mJob.nameEn} · Lv.{jobLevels[mainJob] || '?'}</div>
                            </div>
                        </div>
                    );
                })()}

                {/* Job List with Levels */}
                {sortedJobs.length > 0 && (
                    <div className="space-y-4">
                        {/* Battle Jobs */}
                        {battleJobs.length > 0 && (
                            <div>
                                <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">전투 직업</div>
                                <div className="flex flex-wrap gap-2">
                                    {battleJobs.filter(j => j.id !== mainJob).map(job => (
                                        <div key={job.id} className="flex items-center gap-1.5 bg-neutral-50 dark:bg-[#2d2d2f] rounded-lg px-2.5 py-1.5">
                                            <img src={job.iconUrl} alt={job.nameKr} className="w-5 h-5 dark-invert" />
                                            <span className="text-xs font-medium text-neutral-700 dark:text-[#d1d1d6]">{job.nameKr}</span>
                                            <span className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold">Lv.{jobLevels[job.id] || '?'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Crafting Jobs */}
                        {craftingJobs.length > 0 && (
                            <div>
                                <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">제작</div>
                                <div className="flex flex-wrap gap-2">
                                    {craftingJobs.map(job => (
                                        <div key={job.id} className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-500/10 rounded-lg px-2.5 py-1.5">
                                            <img src={job.iconUrl} alt={job.nameKr} className="w-5 h-5 dark-invert" />
                                            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">{job.nameKr}</span>
                                            <span className="text-[10px] text-purple-400 dark:text-purple-400/70 font-semibold">Lv.{jobLevels[job.id] || '?'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gathering Jobs */}
                        {gatheringJobs.length > 0 && (
                            <div>
                                <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">채집</div>
                                <div className="flex flex-wrap gap-2">
                                    {gatheringJobs.map(job => (
                                        <div key={job.id} className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg px-2.5 py-1.5">
                                            <img src={job.iconUrl} alt={job.nameKr} className="w-5 h-5 dark-invert" />
                                            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">{job.nameKr}</span>
                                            <span className="text-[10px] text-amber-400 dark:text-amber-400/70 font-semibold">Lv.{jobLevels[job.id] || '?'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Playstyles */}
                {playstyles.length > 0 && (
                    <div>
                        <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">플레이 스타일</div>
                        <div className="flex flex-wrap gap-1.5">
                            {playstyles.map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-neutral-100 dark:bg-[#2d2d2f] rounded-full text-xs text-neutral-600 dark:text-[#a1a1a6] font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comment */}
                {comment && (
                    <div className="bg-neutral-50 dark:bg-[#2d2d2f] rounded-xl p-4">
                        <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">한마디</div>
                        <p className="text-sm text-neutral-700 dark:text-[#d1d1d6] whitespace-pre-wrap leading-relaxed">{comment}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="pt-3 border-t border-neutral-100 dark:border-[#3a3a3c] flex justify-between items-center">
                    <span className="text-[10px] text-neutral-300 dark:text-[#6e6e73] font-medium">FF14 트친소 시트</span>
                    <span className="text-[10px] text-neutral-300 dark:text-[#6e6e73]">Made by @reconeur · {new Date().getFullYear()}</span>
                </div>
            </div>
        </div>
    );
});

CardPreview.displayName = "CardPreview";
