import { useState, useCallback } from 'react';
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
}

export function ImageCropperModal({ imageSrc, onApply, onCancel, lang, aspectRatio = 700 / 280 }: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    const onCropComplete = useCallback((_croppedArea: unknown, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleApply = async () => {
        if (!croppedAreaPixels) return;
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
            if (croppedImage) {
                onApply(croppedImage);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAutoFill = async () => {
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
        } catch (e) {
            console.error(e);
        }
    };

    const t = i18n[lang].preview;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div 
                className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col h-[80vh] sm:h-[600px] animate-in zoom-in-[0.98] duration-300"
                style={{ backgroundColor: 'var(--surface-100)', border: '1px solid var(--border-medium)' }}
            >
                {/* Header */}
                <div 
                    className="p-4 flex justify-between items-center"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                    <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {t.adjustImageArea}
                    </h2>
                    <button onClick={onCancel} className="text-sm font-semibold transition-colors" style={{ color: 'var(--text-muted)' }}>
                        {t.cancel}
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative flex-1 overflow-hidden" style={{ backgroundColor: 'var(--surface-200)' }}>
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
                        <ZoomIn size={20} style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.01}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                            style={{ backgroundColor: 'var(--surface-300)', accentColor: 'var(--text-primary)' }}
                        />
                        <span className="text-sm font-medium w-8 text-right" style={{ color: 'var(--text-secondary)' }}>{zoom.toFixed(1)}x</span>
                    </div>

                    <div className="text-xs text-center font-medium" style={{ color: 'var(--text-muted)' }}>
                        {t.dragToMove}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleAutoFill}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-colors"
                            style={{ 
                                backgroundColor: 'var(--surface-300)', 
                                border: '1px solid var(--border-medium)', 
                                color: 'var(--text-primary)' 
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-400)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--surface-300)')}
                        >
                            <Maximize size={16} />
                            {lang === 'ko' ? '자동 채우기' : lang === 'ja' ? '自動で合わせる' : 'Auto Fill'}
                        </button>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors"
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
                                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm"
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
