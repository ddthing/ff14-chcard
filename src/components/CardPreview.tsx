import { forwardRef, useCallback, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { JOBS } from '../data/jobs';
import { ImagePlus, Maximize2, X, RotateCw } from 'lucide-react';
import { i18n } from '../utils/i18n';
import { CardProfileHeader } from './preview/CardProfileHeader';
import { CardMainJob } from './preview/CardMainJob';
import { CardPlaystyles } from './preview/CardPlaystyles';
import { ImageCropperModal } from './ImageCropperModal';
import { JobList } from './preview/JobList';
import { usePlayer } from '../contexts/PlayerContext';
import { useStickerInteraction } from '../hooks/useStickerInteraction';
import { useFontLoader } from '../hooks/useFontLoader';
import type { Sticker } from '../types';
import { ImageFileError, readImageFile } from '../utils/imageFile';

/**
 * Card Preview Component
 * 
 * Renders the final character card based on the user's input.
 * Supports real-time image cropping and dynamic job/status display.
 */
interface CardPreviewProps {
    id?: string;
    onImageChange?: (image: string | undefined) => void;
}

const BATTLE_ROLES = new Set([
    'Tank',
    'Healer',
    'Melee',
    'Physical Ranged',
    'Magical Ranged',
    'Limited',
]);

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ id, onImageChange }, ref) => {
    const { playerInfo, updatePlayerField, selectedStickerId, setSelectedStickerId, removeSticker } = usePlayer();
    const { jobs, comment, image, font, mainJob, jobLevels } = playerInfo;

    const lang = playerInfo.language;
    const t = i18n[lang].preview;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageTriggerRef = useRef<HTMLButtonElement>(null);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const shouldReduceMotion = useReducedMotion();

    const updateStickers = useCallback((stickers: Sticker[]) => updatePlayerField('stickers', stickers), [updatePlayerField]);
    
    const { 
        draggingId, 
        transformingId, 
        handlePointerMove, 
        handlePointerUp, 
        handlePointerCancel,
        startDrag, 
        startTransform 
    } = useStickerInteraction({ 
        stickers: playerInfo.stickers, 
        updateStickers, 
        constraintsRef 
    });

    useFontLoader(playerInfo.font);

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        setImageError(null);
        try {
            setCropImageSrc(await readImageFile(file));
        } catch (error) {
            setImageError(error instanceof ImageFileError && error.code === 'too-large'
                ? i18n[lang].form.imageFileTooLarge
                : error instanceof ImageFileError && error.code === 'invalid-type'
                    ? i18n[lang].form.imageInvalidType
                    : i18n[lang].form.imageUploadError);
        }
    };

    const handleStickerKeyDown = useCallback((event: ReactKeyboardEvent<HTMLButtonElement>, stickerId: string) => {
        const moveStep = event.shiftKey ? 2 : 0.2;
        let dx = 0;
        let dy = 0;

        if (event.key === 'ArrowUp') dy = -moveStep;
        else if (event.key === 'ArrowDown') dy = moveStep;
        else if (event.key === 'ArrowLeft') dx = -moveStep;
        else if (event.key === 'ArrowRight') dx = moveStep;
        else if (event.key === 'Delete' || event.key === 'Backspace') {
            event.preventDefault();
            removeSticker(stickerId);
            return;
        } else {
            return;
        }

        event.preventDefault();
        updateStickers(playerInfo.stickers?.map(sticker =>
            sticker.id === stickerId
                ? {
                    ...sticker,
                    x: Number(Math.max(0, Math.min(100, sticker.x + dx)).toFixed(1)),
                    y: Number(Math.max(0, Math.min(100, sticker.y + dy)).toFixed(1)),
                }
                : sticker
        ) || []);
    }, [playerInfo.stickers, removeSticker, updateStickers]);

    const handleCropApply = (croppedImageBase64: string) => {
        onImageChange?.(croppedImageBase64);
        setCropImageSrc(null);
    };

    const handleCropCancel = () => {
        setCropImageSrc(null);
    };

    const adjustSticker = useCallback((stickerId: string, action: 'scale' | 'rotate', direction: 1 | -1) => {
        updateStickers(playerInfo.stickers?.map(sticker => {
            if (sticker.id !== stickerId) return sticker;

            if (action === 'rotate') {
                return { ...sticker, rotation: (sticker.rotation + direction * 5 + 360) % 360 };
            }

            return { ...sticker, scale: Number(Math.max(0.1, Math.min(3, sticker.scale + direction * 0.05)).toFixed(2)) };
        }) || []);
    }, [playerInfo.stickers, updateStickers]);

    const handleStickerHandleKeyDown = useCallback((
        event: ReactKeyboardEvent<HTMLButtonElement>,
        stickerId: string,
        action: 'scale' | 'rotate',
    ) => {
        const isHorizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
        const isVertical = event.key === 'ArrowUp' || event.key === 'ArrowDown';
        if (!isHorizontal && !isVertical) return;

        const increases = action === 'rotate'
            ? event.key === 'ArrowRight'
            : event.key === 'ArrowUp' || event.key === 'ArrowRight';
        event.preventDefault();
        adjustSticker(stickerId, action, increases ? 1 : -1);
    }, [adjustSticker]);

    // Job grouping is unchanged visually, but no longer recalculates on every
    // keystroke when the selected job list itself has not changed.
    const { sortedJobs, battleJobs, craftingJobs, gatheringJobs } = useMemo(() => {
        const selectedJobIds = new Set(jobs);
        const sorted = JOBS
            .filter(job => selectedJobIds.has(job.id))
            .sort((a, b) => {
                if (a.id === mainJob) return -1;
                if (b.id === mainJob) return 1;
                return 0;
            });

        return {
            sortedJobs: sorted,
            battleJobs: sorted.filter(job => BATTLE_ROLES.has(job.role)),
            craftingJobs: sorted.filter(job => job.role === 'Crafting'),
            gatheringJobs: sorted.filter(job => job.role === 'Gathering'),
        };
    }, [jobs, mainJob]);

    return (
        <motion.div
            layout={!shouldReduceMotion}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.2, duration: 0.6 }}
            className={`card-preview max-w-none overflow-hidden relative flex origin-top ${playerInfo.layout === 'left-portrait' ? 'w-[800px] flex-row min-h-[720px]' : 'w-[700px] flex-col'} ${font}`}
            style={{ backgroundColor: 'var(--surface-50)' }}
            ref={ref}
            id={id}
        >
            {cropImageSrc && (
                <ImageCropperModal
                    imageSrc={cropImageSrc}
                    onApply={handleCropApply}
                    onCancel={handleCropCancel}
                    returnFocusRef={imageTriggerRef}
                    lang={lang}
                    aspectRatio={playerInfo.layout === 'left-portrait' ? 2 / 4.5 : 700 / 280}
                />
            )}

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                aria-label={t.uploadPlease}
                className="hidden"
                onChange={handleImageUpload}
            />
            {imageError && (
                <p role="alert" className="export-ignore absolute left-4 right-4 top-4 z-[70] bg-[var(--surface-50)] p-3 text-xs shadow-lg" style={{ color: 'var(--destructive)' }}>
                    {imageError}
                </p>
            )}

            {/* Image Section */}
            {image ? (
                <motion.button
                    type="button"
                    layout={!shouldReduceMotion}
                    ref={imageTriggerRef}
                    aria-label={t.clickToEdit}
                    className={`${playerInfo.layout === 'left-portrait' ? 'w-[320px] min-h-[720px] border-r border-[#d2d2d7] dark:border-[#3a3a3c]' : 'w-full h-[280px]'} relative overflow-hidden group cursor-pointer shrink-0 border-0 p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-medium)]`}
                    onClick={() => fileInputRef.current?.click()}
                    title={t.clickToEdit}
                >
                    <img
                        src={image}
                        alt={t.characterImage}
                        width={playerInfo.layout === 'left-portrait' ? 320 : 700}
                        height={playerInfo.layout === 'left-portrait' ? 720 : 280}
                        className="absolute inset-0 w-full h-full object-cover select-none transition-transform group-hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm export-ignore">
                        <span className="text-white font-medium text-sm flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
                            <ImagePlus size={16} aria-hidden="true" /> {t.clickToEdit}
                        </span>
                    </div>
                </motion.button>
            ) : (
                <motion.button
                    type="button"
                    layout={!shouldReduceMotion}
                    ref={imageTriggerRef}
                    aria-label={t.uploadPlease}
                    className={`${playerInfo.layout === 'left-portrait' ? 'w-[320px] min-h-[720px] border-r border-neutral-200 dark:border-[#3a3a3c]' : 'w-full h-[280px] border-b border-neutral-200 dark:border-[#3a3a3c]'} bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-[#2a2a2c] dark:to-[#323234] flex flex-col items-center justify-center gap-4 cursor-pointer hover:from-neutral-100 hover:to-neutral-200 dark:hover:from-[#323234] dark:hover:to-[#3a3a3c] transition-colors group shrink-0 relative border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-medium)]`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="absolute inset-4 border-2 border-dashed border-neutral-300 dark:border-[#4a4a4c] rounded-xl pointer-events-none group-hover:scale-[0.98] transition-transform duration-300"></div>
                    <div className="p-4 bg-white/60 dark:bg-black/30 rounded-full group-hover:scale-110 transition-transform duration-300 z-10 border border-neutral-200/50 dark:border-[#4a4a4c]/50">
                        <ImagePlus size={32} aria-hidden="true" className="text-neutral-400 dark:text-[#86868b]" />
                    </div>
                    <span className="text-neutral-500 dark:text-[#98989d] text-sm font-semibold text-center px-4 z-10 tracking-wide">{t.uploadPlease}</span>
                </motion.button>
            )}

            {/* Content */}
            <motion.div layout={!shouldReduceMotion} className={`p-8 space-y-6 flex-1 relative flex flex-col`}>
                
                {/* Name / Server / Status */}
                <CardProfileHeader />

                {/* Main Job Highlight */}
                <CardMainJob />

                {/* Job List with Levels */}
                {sortedJobs.length > 0 && (
                    <div className="space-y-4">
                        <JobList title={t.battle} jobs={battleJobs} mainJob={playerInfo.mainJob} jobLevels={jobLevels} lang={lang} type="battle" pointColor={playerInfo.pointColor} />
                        <JobList title={t.crafting} jobs={craftingJobs} jobLevels={jobLevels} lang={lang} type="crafting" pointColor={playerInfo.pointColor} />
                        <JobList title={t.gathering} jobs={gatheringJobs} jobLevels={jobLevels} lang={lang} type="gathering" pointColor={playerInfo.pointColor} />
                    </div>
                )}

                {/* Playstyles */}
                <CardPlaystyles />

                {/* Comment */}
                {comment && (
                    <div className="rounded-xl p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--surface-100)' }}>
                        <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>{t.comment}</div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed relative z-10" style={{ fontStyle: 'normal', color: 'var(--text-primary)' }}>{comment}</p>
                    </div>
                )}

                {/* Watermark / Footer (Viral Loop) */}
                <div className="mt-auto flex items-end justify-between border-t border-neutral-100 px-4 pt-4 dark:border-[#3a3a3c]">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-[0.25em]" style={{ color: 'var(--text-primary)' }}>
                            {t.footerTitle}
                        </span>
                        <span className="text-[10px] text-neutral-400 dark:text-[#86868b] font-medium tracking-tight">
                            {t.createOwn} <strong className="text-neutral-600 dark:text-[#a1a1a6]" translate="no">ff14-chcard.pages.dev</strong>
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right">
                        <span className="text-[8px] text-neutral-400 dark:text-[#86868b] uppercase tracking-[0.15em] font-bold">
                            {t.designedBy}
                        </span>
                        <span className="text-[11px] font-bold text-neutral-700 dark:text-[#d1d1d6]">
                            <a href="https://x.com/reconeur" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]">
                                @reconeur
                                <span className="sr-only">({i18n[lang].layout.externalNewWindow})</span>
                            </a>
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Sticker Layer */}
            <div 
                className="absolute inset-0 pointer-events-none overflow-hidden z-50"
                ref={constraintsRef}
            >
                {/* Drag / Transform Tracker Layer */}
                {(draggingId || transformingId) && (
                    <div 
                        className="absolute inset-0 pointer-events-auto z-[60]"
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerCancel}
                    />
                )}
                
                {/* 배경 클릭 시 스티커 선택 해제 */}
                <div 
                    className={`absolute inset-0 z-40 ${selectedStickerId ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    onPointerDown={() => setSelectedStickerId(null)}
                />

                {playerInfo.stickers?.map((sticker, index) => {
                    const isSelected = selectedStickerId === sticker.id;
                    return (
                    <div
                        key={sticker.id}
                        className="absolute pointer-events-auto select-none group/sticker"
                        role="group"
                        aria-label={`${i18n[lang].form.stickers} ${index + 1}`}
                        style={{
                            left: `${sticker.x}%`,
                            top: `${sticker.y}%`,
                            transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                            zIndex: (draggingId === sticker.id || transformingId === sticker.id) ? 55 : (isSelected ? 52 : 51)
                        }}
                    >
                        {/* 스티커 이미지 박스 (선택 시 테두리 표시) */}
                        <button
                            type="button"
                            aria-label={`${i18n[lang].form.stickers} ${index + 1}`}
                            aria-describedby={`sticker-keyboard-help-${index}`}
                            aria-pressed={isSelected}
                            className="block border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2"
                            onClick={() => setSelectedStickerId(sticker.id)}
                            onKeyDown={(event) => handleStickerKeyDown(event, sticker.id)}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                                setSelectedStickerId(sticker.id);
                                startDrag(sticker.id);
                            }}
                            onPointerCancel={handlePointerCancel}
                        >
                            <span id={`sticker-keyboard-help-${index}`} className="sr-only">{t.stickerKeyboardHelp}</span>
                            <div className={`relative ${isSelected ? 'ring-2 ring-[#0071e3] ring-offset-2 ring-offset-white dark:ring-offset-[#1d1d1f] rounded export-ignore' : ''}`}>
                                <img
                                    src={sticker.url}
                                    alt=""
                                    width={96}
                                    height={96}
                                    draggable={false}
                                    className="max-w-none pointer-events-none cursor-move drop-shadow-sm"
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </div>
                        </button>

                        {/* 선택 시 조작 UI: 삭제(X) 및 트랜스폼(핸들) */}
                        {isSelected && (
                            <div className="absolute inset-0 pointer-events-none export-ignore">
                                    {/* 삭제 버튼 (우상단) - Inverse Scaling */}
                                    <button
                                        type="button"
                                        className="transform-control pointer-events-auto absolute -top-5 -right-5 w-10 h-10 flex items-center justify-center text-white hover:opacity-80 transition-opacity cursor-pointer group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
                                        style={{ transform: `scale(${1 / Math.max(0.1, sticker.scale)})`, transformOrigin: 'center' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSticker(sticker.id);
                                        }}
                                        aria-label={t.deleteSticker}
                                    >
                                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                                            <X size={12} aria-hidden="true" strokeWidth={3} />
                                        </div>
                                    </button>

                                    {/* 회전 핸들 (좌하단) - Inverse Scaling */}
                                    <button
                                        type="button"
                                        className="transform-control pointer-events-auto absolute -bottom-5 -left-5 w-10 h-10 flex items-center justify-center border-0 bg-transparent p-0 text-[#1d1d1f] hover:opacity-80 transition-opacity cursor-crosshair touch-none group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
                                        style={{ transform: `scale(${1 / Math.max(0.1, sticker.scale)})`, transformOrigin: 'center' }}
                                        onPointerDown={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            startTransform(sticker.id, sticker, e.clientX, e.clientY, 'rotate');
                                        }}
                                        onPointerCancel={handlePointerCancel}
                                        onClick={(e) => {
                                            if (e.detail === 0) adjustSticker(sticker.id, 'rotate', 1);
                                        }}
                                        onKeyDown={(e) => handleStickerHandleKeyDown(e, sticker.id, 'rotate')}
                                        aria-label={t.rotateSticker}
                                    >
                                        <div className="w-7 h-7 bg-white border border-[#d2d2d7] rounded-full flex items-center justify-center shadow-sm">
                                            <RotateCw size={12} aria-hidden="true" strokeWidth={2.5} />
                                        </div>
                                    </button>

                                    {/* 크기 조절 핸들 (우하단) - Inverse Scaling */}
                                    <button
                                        type="button"
                                        className="transform-control pointer-events-auto absolute -bottom-5 -right-5 w-10 h-10 flex items-center justify-center border-0 bg-transparent p-0 text-[#1d1d1f] hover:opacity-80 transition-opacity cursor-se-resize touch-none group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
                                        style={{ transform: `scale(${1 / Math.max(0.1, sticker.scale)})`, transformOrigin: 'center' }}
                                        onPointerDown={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            startTransform(sticker.id, sticker, e.clientX, e.clientY, 'scale');
                                        }}
                                        onPointerCancel={handlePointerCancel}
                                        onClick={(e) => {
                                            if (e.detail === 0) adjustSticker(sticker.id, 'scale', 1);
                                        }}
                                        onKeyDown={(e) => handleStickerHandleKeyDown(e, sticker.id, 'scale')}
                                        aria-label={t.scaleSticker}
                                    >
                                        <div className="w-7 h-7 bg-white border border-[#d2d2d7] rounded-full flex items-center justify-center shadow-sm">
                                            <Maximize2 size={12} aria-hidden="true" strokeWidth={2.5} className="rotate-90" />
                                        </div>
                                    </button>
                            </div>
                        )}
                    </div>
                )})}
            </div>
        </motion.div>
    );
});

CardPreview.displayName = "CardPreview";
