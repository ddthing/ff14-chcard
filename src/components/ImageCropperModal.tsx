import { useState, useCallback, useEffect, useId, useRef, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg, { createImage } from '../utils/cropImage';
import { ZoomIn, Maximize } from 'lucide-react';
import type { Language } from '../types';
import { i18n } from '../utils/i18n';

interface ImageCropperModalProps {
    imageSrc: string;
    onApply: (croppedImageBase64: string) => void;
    onCancel: () => void;
    lang: Language;
    aspectRatio?: number;
    returnFocusRef?: RefObject<HTMLButtonElement | null>;
}

export function ImageCropperModal({ imageSrc, onApply, onCancel, lang, aspectRatio = 700 / 280, returnFocusRef }: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingError, setProcessingError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const onCancelRef = useRef(onCancel);
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        onCancelRef.current = onCancel;
    }, [onCancel]);

    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const focusReturnTarget = returnFocusRef?.current;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCancelRef.current();
                return;
            }

            if (event.key !== 'Tab') return;

            const dialog = dialogRef.current;
            if (!dialog) return;

            const focusableElements = Array.from(
                dialog.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            );

            if (focusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            const activeElement = document.activeElement;

            if (event.shiftKey && activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousBodyOverflow;
            const focusTarget = focusReturnTarget ?? previousFocus;
            if (focusTarget instanceof HTMLElement && focusTarget.isConnected) {
                focusTarget.focus();
            }
        };
    }, [returnFocusRef]);

    const onCropComplete = useCallback((_croppedArea: unknown, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleApply = async () => {
        if (!croppedAreaPixels || isProcessing) return;
        setIsProcessing(true);
        setProcessingError(null);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
            if (croppedImage) {
                onApply(croppedImage);
            }
        } catch {
            setProcessingError(i18n[lang].preview.cropError);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAutoFill = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        setProcessingError(null);
        try {
            const image = await createImage(imageSrc);
            const imgRatio = image.width / image.height;
            let cropWidth = image.width;
            let cropHeight = image.height;
            let x = 0;
            let y = 0;

            if (imgRatio > aspectRatio) {
                cropWidth = image.height * aspectRatio;
                x = (image.width - cropWidth) / 2;
            } else {
                cropHeight = image.width / aspectRatio;
                y = (image.height - cropHeight) / 2;
            }

            const croppedImage = await getCroppedImg(imageSrc, { x, y, width: cropWidth, height: cropHeight }, 0);
            if (croppedImage) {
                onApply(croppedImage);
            }
        } catch {
            setProcessingError(i18n[lang].preview.cropError);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCropKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        const step = event.shiftKey ? 10 : 2;
        let x = 0;
        let y = 0;

        switch (event.key) {
            case 'ArrowLeft':
                x = -step;
                break;
            case 'ArrowRight':
                x = step;
                break;
            case 'ArrowUp':
                y = -step;
                break;
            case 'ArrowDown':
                y = step;
                break;
            default:
                return;
        }

        event.preventDefault();
        setCrop((previousCrop) => ({ x: previousCrop.x + x, y: previousCrop.y + y }));
    };

    const t = i18n[lang].preview;
    const form = i18n[lang].form;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} aria-busy={isProcessing}>
            <div 
                ref={dialogRef}
                className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col h-[80vh] sm:h-[600px] animate-in zoom-in-[0.98] duration-300"
                style={{ backgroundColor: 'var(--surface-100)', border: '1px solid var(--border-medium)' }}
            >
                {/* Header */}
                <div 
                    className="p-4 flex justify-between items-center"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                    <h2 id={titleId} className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {t.adjustImageArea}
                    </h2>
                    <button ref={closeButtonRef} type="button" onClick={onCancel} className="text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)] focus-visible:ring-offset-2" style={{ color: 'var(--text-muted)' }}>
                        {t.cancel}
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative flex-1 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-medium)]" style={{ backgroundColor: 'var(--surface-200)' }} tabIndex={0} aria-label={t.dragToMove} onKeyDown={handleCropKeyDown}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                {/* Controls */}
                <div className="p-6 space-y-6 shrink-0" style={{ backgroundColor: 'var(--surface-100)' }}>
                    {/* Zoom Slider */}
                    <div className="flex items-center gap-4">
                        <ZoomIn size={20} aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.01}
                            aria-label={form.zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)] focus-visible:ring-offset-2"
                            style={{ backgroundColor: 'var(--surface-300)', accentColor: 'var(--text-primary)' }}
                        />
                        <span className="text-sm font-medium w-8 text-right" style={{ color: 'var(--text-secondary)' }}>{zoom.toFixed(1)}x</span>
                    </div>

                    <div id={descriptionId} className="text-xs text-center font-medium" style={{ color: 'var(--text-muted)' }}>
                        {t.dragToMove}
                    </div>

                    {processingError && <p role="alert" className="text-center text-xs font-medium" style={{ color: 'var(--destructive)' }}>{processingError}</p>}
                    {isProcessing && <p role="status" className="sr-only">{t.cropProcessing}</p>}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleAutoFill}
                            type="button"
                            disabled={isProcessing}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)] focus-visible:ring-offset-2"
                            style={{ 
                                backgroundColor: 'var(--surface-300)', 
                                border: '1px solid var(--border-medium)', 
                                color: 'var(--text-primary)' 
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-400)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--surface-300)')}
                        >
                            <Maximize size={16} aria-hidden="true" />
                            {form.autoFill}
                        </button>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                type="button"
                                disabled={isProcessing}
                                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)] focus-visible:ring-offset-2"
                                style={{ 
                                    backgroundColor: 'transparent', 
                                    border: '1px solid var(--border-medium)', 
                                    color: 'var(--text-secondary)' 
                                }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-200)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleApply}
                                type="button"
                                disabled={isProcessing || !croppedAreaPixels}
                                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2"
                                style={{ 
                                    backgroundColor: 'var(--text-primary)', 
                                    color: 'var(--surface-200)' 
                                }}
                                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                                {t.apply}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
