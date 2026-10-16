import { lazy, Suspense, forwardRef, useCallback, useMemo, useRef, useState, type ChangeEvent, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { JOBS } from '../data/jobs';
import { ImagePlus, Maximize2, X, RotateCw } from 'lucide-react';
import { i18n } from '../utils/i18n';
import { CardProfileHeader } from './preview/CardProfileHeader';
import { CardMainJob } from './preview/CardMainJob';
import { CardPlaystyles } from './preview/CardPlaystyles';
import { JobList } from './preview/JobList';
import { usePlayer } from '../contexts/PlayerContext';
import { useStickerInteraction } from '../hooks/useStickerInteraction';
import { useFontLoader } from '../hooks/useFontLoader';
import type { Sticker } from '../types';
import { ImageFileError, readImageFile } from '../utils/imageFile';

import { getAccessibleAccentColor, getAccentSurface } from '../utils/styles';
import { CardBackgroundEffects } from './preview/CardBackgroundEffects';
import './preview/card.css';
const ImageCropperModal = lazy(() => import('./ImageCropperModal').then(module => ({ default: module.ImageCropperModal })));

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
    const pointColor = /^#[0-9a-f]{6}$/i.test(playerInfo.pointColor) ? playerInfo.pointColor : '#57534e';
    const lightAccentSurface = getAccentSurface(pointColor, '#ffffff');
    const darkAccentSurface = getAccentSurface(pointColor, '#252b24');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageTriggerRef = useRef<HTMLButtonElement>(null);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

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
    const { battleJobs, craftingJobs, gatheringJobs } = useMemo(() => {
        const selectedJobIds = new Set(jobs);
        const sorted = JOBS
            .filter(job => selectedJobIds.has(job.id))
            .sort((a, b) => {
                if (a.id === 'BST') return 1;
                if (b.id === 'BST') return -1;
                if (a.id === mainJob) return -1;
                if (b.id === mainJob) return 1;
                return 0;
            });

        return {
            battleJobs: sorted.filter(job => BATTLE_ROLES.has(job.role)),
            craftingJobs: sorted.filter(job => job.role === 'Crafting'),
            gatheringJobs: sorted.filter(job => job.role === 'Gathering'),
        };
    }, [jobs, mainJob]);

    return (
        <div
            className={'card-preview character-sheet max-w-none overflow-hidden relative flex origin-top ' + (playerInfo.layout === 'left-portrait' ? 'w-[880px] flex-row min-h-[720px] ' : 'w-[700px] flex-col ') + font}
            style={{
                '--sheet-accent': pointColor,
                '--sheet-accent-surface-light': lightAccentSurface,
                '--sheet-accent-surface-dark': darkAccentSurface,
                '--sheet-icon-light': getAccessibleAccentColor(pointColor, lightAccentSurface),
                '--sheet-icon-dark': getAccessibleAccentColor(pointColor, darkAccentSurface),
                '--sheet-accent-text-light': getAccessibleAccentColor(pointColor, lightAccentSurface, 4.5),
                '--sheet-accent-text-dark': getAccessibleAccentColor(pointColor, darkAccentSurface, 4.5),
            } as CSSProperties}
            ref={ref} id={id} data-layout={playerInfo.layout || 'header'}
        >
            {cropImageSrc && (
                <Suspense fallback={null}><ImageCropperModal
                    imageSrc={cropImageSrc}
                    onApply={handleCropApply}
                    onCancel={handleCropCancel}
                    returnFocusRef={imageTriggerRef}
                    lang={lang}
                    aspectRatio={playerInfo.layout === 'left-portrait' ? 2 / 4.5 : 700 / 280}
                /></Suspense>
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
                <button
                    type="button"
                    ref={imageTriggerRef}
                    aria-label={t.clickToEdit}
                    className={`${playerInfo.layout === 'left-portrait' ? 'w-[320px] min-h-[720px]' : 'w-full h-[280px]'} sheet-image relative overflow-hidden group cursor-pointer shrink-0 border-0 p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-medium)]`}
                    onClick={() => fileInputRef.current?.click()}
                    title={t.clickToEdit}
                >
                    <img
                        src={image}
                        alt={t.characterImage}
                        width={playerInfo.layout === 'left-portrait' ? 320 : 700}
                        height={playerInfo.layout === 'left-portrait' ? 720 : 280}
                        className="absolute inset-0 w-full h-full object-cover select-none"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm export-ignore">
                        <span className="text-white font-medium text-sm flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
                            <ImagePlus size={16} aria-hidden="true" /> {t.clickToEdit}
                        </span>
                    </div>
                </button>
            ) : (
                <button
                    type="button"
                    ref={imageTriggerRef}
                    aria-label={t.uploadPlease}
                    className={`${playerInfo.layout === 'left-portrait' ? 'w-[320px] min-h-[720px]' : 'w-full h-[280px]'} sheet-image sheet-image-empty flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors group shrink-0 relative border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-medium)]`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="studio-placeholder-art"></div>
                    <div className="p-4 bg-white/60 dark:bg-black/30 rounded-full group-hover:scale-110 transition-transform duration-300 z-10 border border-neutral-200/50 dark:border-[#4a4a4c]/50">
                        <ImagePlus size={32} aria-hidden="true" className="text-[var(--text-secondary)]" />
                    </div>
                    <span className="text-[var(--text-secondary)] text-sm font-semibold text-center px-4 z-10 tracking-wide">{t.uploadPlease}</span>
                </button>
            )}

            <div className="sheet-body">
                <span className="sheet-paper-texture" aria-hidden="true" />
                <CardBackgroundEffects />
                <CardProfileHeader /><CardMainJob />
                {(battleJobs.length > 0 || craftingJobs.length > 0 || gatheringJobs.length > 0) && <div className={'sheet-jobs' + (craftingJobs.length && gatheringJobs.length ? ' sheet-jobs-paired' : '')}>
                    <JobList title={t.battle} jobs={battleJobs} jobLevels={jobLevels} lang={lang} type="battle" />
                    <JobList title={t.crafting} jobs={craftingJobs} jobLevels={jobLevels} lang={lang} type="crafting" />
                    <JobList title={t.gathering} jobs={gatheringJobs} jobLevels={jobLevels} lang={lang} type="gathering" />
                </div>}
                <CardPlaystyles />
                {comment && <section className="sheet-note" aria-label={t.comment}><h3 className="sheet-label">{t.comment}</h3><p>{comment}</p></section>}
                <footer className="sheet-footer">
                    <div className="sheet-signature"><span className="sheet-signature-title"><span aria-hidden="true" />{t.footerTitle}</span><span translate="no">ccard.ffxiv.world</span></div>
                    <div className="sheet-credit"><span>{t.designedBy}</span><a href="https://x.com/reconeur" target="_blank" rel="noopener noreferrer">@reconeur<span className="sr-only">({i18n[lang].layout.externalNewWindow})</span></a></div>
                </footer>
            </div>

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
                            <div className="relative">
                                {isSelected && <span aria-hidden="true" className="export-ignore absolute inset-0 rounded ring-2 ring-[#0071e3] ring-offset-2 ring-offset-white dark:ring-offset-[#1d1d1f]" />}
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
        </div>
    );
});

CardPreview.displayName = "CardPreview";
