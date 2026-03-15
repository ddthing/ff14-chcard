import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { ZoomIn } from 'lucide-react';
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

    const t = i18n[lang].preview;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1d1d1f] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh] sm:h-[600px]">
                {/* Header */}
                <div className="p-4 border-b border-neutral-200 dark:border-[#3a3a3c] flex justify-between items-center">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                        {t.adjustImageArea}
                    </h2>
                    <button onClick={onCancel} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors">
                        {t.cancel}
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative flex-1 bg-neutral-100 dark:bg-black/50 overflow-hidden">
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
                <div className="p-6 space-y-6 bg-white dark:bg-[#1d1d1f]">
                    {/* Zoom Slider */}
                    <div className="flex items-center gap-4">
                        <ZoomIn size={20} className="text-neutral-500" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.01}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1.5 bg-neutral-200 dark:bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
                        />
                        <span className="text-sm font-medium text-neutral-500 w-8 text-right">{zoom.toFixed(1)}x</span>
                    </div>

                    <div className="text-xs text-center text-neutral-500 font-medium">
                        {t.dragToMove}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-[#424245] text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-[#2d2d2f] transition-colors"
                        >
                            {t.cancel}
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 py-3 rounded-xl bg-[#0071e3] text-white font-semibold text-sm hover:bg-[#0077ED] transition-colors shadow-sm"
                        >
                            {t.apply}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
