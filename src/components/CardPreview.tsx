import { forwardRef, useState } from 'react';
import type { PlayerInfo } from '../types';
import { JOBS } from '../data/jobs';
import { Sprout, Crown, ImagePlus, ZoomIn, Check } from 'lucide-react';
import { i18n, playstyleTranslate } from '../utils/i18n';

interface CardPreviewProps {
    playerInfo: PlayerInfo;
    id?: string;
    onImagePositionChange?: (pos: { x: number; y: number; scale: number }) => void;
}

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ playerInfo, id, onImagePositionChange }, ref) => {
    const { name, server, region, jobs, playstyles, activeTime, comment, image, font, mainJob, isSprout, isMentor, jobLevels, isNicknameChanged } = playerInfo;

    const lang = playerInfo.language || 'ko';
    const t = i18n[lang].preview;

    // Image Drag & Zoom Logic
    const [isEditing, setIsEditing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialOffset, setInitialOffset] = useState({ x: 0, y: 0, scale: 1 });
    // Robust initialization fallback for legacy data
    const [currentOffset, setCurrentOffset] = useState({
        x: playerInfo.imagePosition?.x ?? 0,
        y: playerInfo.imagePosition?.y ?? 0,
        scale: playerInfo.imagePosition?.scale ?? 1
    });



    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isEditing) return; // Only allow drag in edit mode
        setIsDragging(true);
        const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
        setDragStart({ x: clientX, y: clientY });
        setInitialOffset(currentOffset);
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
        const dx = clientX - dragStart.x;
        const dy = clientY - dragStart.y;
        setCurrentOffset({ ...currentOffset, x: initialOffset.x + dx, y: initialOffset.y + dy });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleSavePosition = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsEditing(false);
        setIsDragging(false);
        onImagePositionChange?.(currentOffset);
    };

    const handleImageClick = () => {
        if (!isEditing && onImagePositionChange) {
            // Initialize offset state when entering edit mode
            setCurrentOffset({
                x: playerInfo.imagePosition?.x ?? 0,
                y: playerInfo.imagePosition?.y ?? 0,
                scale: playerInfo.imagePosition?.scale ?? 1
            });
            setIsEditing(true);
        }
    };

    // Determine which offset to display:
    // When editing/dragging, use local state (currentOffset).
    // When viewing, use the saved prop (playerInfo.imagePosition).
    // This removes the need for a useEffect to sync them, preventing loops/lint errors.
    const finalOffset = isEditing ? currentOffset : (playerInfo.imagePosition ?? { x: 0, y: 0, scale: 1 });

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
            className={`w-[700px] min-w-[700px] max-w-none bg-white dark:bg-[#1d1d1f] text-neutral-900 dark:text-[#f5f5f7] shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden relative rounded-2xl ${font}`}
            ref={ref}
            id={id}
            style={{}}
        >
            {/* Top: Character Image */}
            {image ? (
                <div
                    className={`w-full h-[280px] relative overflow-hidden group ${onImagePositionChange ? 'cursor-pointer' : ''} ${isEditing ? 'touch-none' : ''}`}
                    onClick={handleImageClick}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <img
                        src={image}
                        alt="Character"
                        className={`w-full h-full object-cover pointer-events-none select-none transition-transform duration-75 ${isDragging ? 'cursor-grabbing' : ''}`}
                        style={{
                            transform: `translate(${finalOffset.x}px, ${finalOffset.y}px) scale(${finalOffset.scale})`
                        }}
                    />

                    {/* Hover Hint (when not editing) */}
                    {!isEditing && onImagePositionChange && (
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-medium text-sm flex items-center gap-2">
                                <ImagePlus size={16} /> {t.clickToEdit}
                            </span>
                        </div>
                    )}

                    {/* Editor Overlay */}
                    {isEditing && (
                        <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 bg-black/20" onClick={(e) => e.stopPropagation()}>
                            {/* Save Button */}
                            <button
                                onClick={handleSavePosition}
                                className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                                title={t.editDone}
                            >
                                <Check size={20} />
                            </button>

                            {/* Controls */}
                            <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 w-full max-w-[300px] mx-auto">
                                <ZoomIn size={18} className="text-white/80" />
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    value={currentOffset.scale}
                                    onChange={(e) => setCurrentOffset({ ...currentOffset, scale: parseFloat(e.target.value) })}
                                    className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                                />
                                <span className="text-white/80 text-xs w-8 text-right">{currentOffset.scale.toFixed(1)}x</span>
                            </div>
                            <div className="text-white/60 text-[10px] text-center mt-2 font-medium">
                                {t.dragToMove}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full h-[120px] bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-[#2d2d2f] dark:to-[#3a3a3c] flex flex-col items-center justify-center gap-2">
                    <ImagePlus size={24} className="text-neutral-300 dark:text-[#6e6e73]" />
                    <span className="text-neutral-300 dark:text-[#6e6e73] text-xs font-medium">{t.uploadPlease}</span>
                </div>
            )}

            {/* Content */}
            <div className="p-8 space-y-6">

                {/* Name / Server / Status */}
                <div className="flex items-end justify-between border-b border-neutral-100 dark:border-[#3a3a3c] pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight leading-none whitespace-nowrap">
                                {name || 'Unknown'}
                            </h1>
                            {isSprout && (
                                <span className="text-green-500 dark:text-[#30d158]" title={t.sprout}>
                                    <Sprout size={22} />
                                </span>
                            )}
                            {isMentor && (
                                <span className="text-yellow-500 dark:text-[#ff9f0a]" title={t.mentor}>
                                    <Crown size={22} />
                                </span>
                            )}
                            {isNicknameChanged && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-500 font-semibold whitespace-nowrap">{t.diffIngame}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-sm text-neutral-500 dark:text-[#a1a1a6] font-medium whitespace-nowrap">{server}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#3a3a3c] text-neutral-400 dark:text-[#86868b] font-semibold whitespace-nowrap">{region}</span>
                        </div>
                    </div>
                    {activeTime && (
                        <span className="text-xs text-neutral-400 dark:text-[#86868b] font-medium whitespace-nowrap">{activeTime}</span>
                    )}
                </div>

                {/* Main Job Highlight */}
                {mainJob && (() => {
                    const mJob = JOBS.find(j => j.id === mainJob);
                    if (!mJob) return null;
                    return (
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-500/10 rounded-xl p-4">
                            <img src={mJob.iconUrl} alt={lang === 'ko' ? mJob.nameKr : mJob.nameEn} className="w-12 h-12 dark-invert" />
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">{t.mainJob}</div>
                                <div className="text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">{lang === 'ko' ? mJob.nameKr : mJob.nameEn}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{mJob.nameEn} · Lv.{jobLevels[mainJob] || '?'}</div>
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
                                <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">{t.battle}</div>
                                <div className="flex flex-wrap gap-2">
                                    {battleJobs.filter(j => j.id !== mainJob).map(job => (
                                        <div key={job.id} className="flex items-center gap-1.5 bg-neutral-50 dark:bg-[#2d2d2f] rounded-lg px-2.5 py-1.5">
                                            <img src={job.iconUrl} alt={lang === 'ko' ? job.nameKr : job.nameEn} className="w-5 h-5 dark-invert" />
                                            <span className="text-xs font-medium text-neutral-700 dark:text-[#d1d1d6] whitespace-nowrap">{lang === 'ko' ? job.nameKr : job.nameEn}</span>
                                            <span className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold whitespace-nowrap">Lv.{jobLevels[job.id] || '?'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Crafting Jobs */}
                        {craftingJobs.length > 0 && (
                            <div>
                                <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">{t.crafting}</div>
                                <div className="flex flex-wrap gap-2">
                                    {craftingJobs.map(job => (
                                        <div key={job.id} className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-500/20 rounded-lg px-2.5 py-1.5">
                                            <img src={job.iconUrl} alt={lang === 'ko' ? job.nameKr : job.nameEn} className="w-5 h-5 dark-invert" />
                                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{lang === 'ko' ? job.nameKr : job.nameEn}</span>
                                            <span className="text-[10px] text-neutral-400 dark:text-neutral-400/70 font-semibold whitespace-nowrap">Lv.{jobLevels[job.id] || '?'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gathering Jobs */}
                        {gatheringJobs.length > 0 && (
                            <div>
                                <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">{t.gathering}</div>
                                <div className="flex flex-wrap gap-2">
                                    {gatheringJobs.map(job => (
                                        <div key={job.id} className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-500/20 rounded-lg px-2.5 py-1.5">
                                            <img src={job.iconUrl} alt={lang === 'ko' ? job.nameKr : job.nameEn} className="w-5 h-5 dark-invert" />
                                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{lang === 'ko' ? job.nameKr : job.nameEn}</span>
                                            <span className="text-[10px] text-neutral-400 dark:text-neutral-400/70 font-semibold whitespace-nowrap">Lv.{jobLevels[job.id] || '?'}</span>
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
                        <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">{t.playstyle}</div>
                        <div className="flex flex-wrap gap-1.5">
                            {playstyles.map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-neutral-100 dark:bg-[#2d2d2f] rounded-full text-xs text-neutral-600 dark:text-[#a1a1a6] font-medium">
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
                        <p className="text-sm text-neutral-700 dark:text-[#d1d1d6] whitespace-pre-wrap leading-relaxed">{comment}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="pt-3 border-t border-neutral-100 dark:border-[#3a3a3c] flex justify-between items-center">
                    <span className="text-[10px] text-neutral-300 dark:text-[#6e6e73] font-medium">FF14 트친소 시트</span>
                    <span className="text-[10px] text-neutral-300 dark:text-[#6e6e73]">
                        Made by <a href="https://x.com/reconeur" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-500 dark:hover:text-[#a1a1a6] transition-colors underline decoration-neutral-200 dark:decoration-[#3a3a3c] underline-offset-2">@reconeur</a> · {new Date().getFullYear()}
                    </span>
                </div>
            </div>
        </div>
    );
});

CardPreview.displayName = "CardPreview";
