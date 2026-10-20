// Lucian UX/UI Prompt #122 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#122
import { useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import { Plus, X, Move, Maximize, RotateCw, ChevronsUp, ChevronsDown } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { i18n } from '../../utils/i18n';
import type { Sticker } from '../../types';
import '../stickerlayers.css';

const MAX_STICKER_FILE_SIZE = 2 * 1024 * 1024;
const MAX_STICKER_DIMENSION = 1600;

function stickerControlId(stickerId: string, control: string): string {
    return `sticker-${stickerId}-${control}`;
}

function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result as string));
        reader.addEventListener('error', () => reject(new Error('sticker-read-failed')));
        reader.readAsDataURL(file);
    });
}

function loadStickerImage(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', () => reject(new Error('sticker-decode-failed')));
        image.src = dataUrl;
    });
}

async function prepareStickerImage(file: File): Promise<string> {
    const dataUrl = await readFileAsDataUrl(file);

    // Keep animated GIFs and already-small images byte-for-byte unchanged.
    if (file.type === 'image/gif') return dataUrl;

    const image = await loadStickerImage(dataUrl);
    const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
    if (longestSide <= MAX_STICKER_DIMENSION) return dataUrl;

    const scale = MAX_STICKER_DIMENSION / longestSide;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) return dataUrl;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp', 0.85);
}

export function StickerSection() {
    const { playerInfo, updatePlayerField, commitStickerChange, selectedStickerId, setSelectedStickerId, removeSticker } = usePlayer();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const lang = playerInfo.language;
    const t = i18n[lang].form;
    const layerText = i18n[lang].layers;
    const stickers = playerInfo.stickers || [];
    const [uploadError, setUploadError] = useState('');
    const [orderAnnouncement, setOrderAnnouncement] = useState('');
    const frontToBackStickers = [...stickers].reverse();
    const selectedSticker = stickers.find(sticker => sticker.id === selectedStickerId) ?? null;

    const getLayerName = (number: number) => layerText.select.replace('{number}', String(number));

    const handleAddSticker = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setUploadError('');

        if (file) {
            if (!file.type.startsWith('image/')) {
                setUploadError(t.stickerUploadError);
            } else if (file.size > MAX_STICKER_FILE_SIZE) {
                setUploadError(t.stickerFileTooLarge);
            } else {
                try {
                    const url = await prepareStickerImage(file);
                    const newSticker: Sticker = {
                        id: Math.random().toString(36).substr(2, 9),
                        url,
                        x: 50, y: 50, scale: 0.5, rotation: 0,
                    };
                    commitStickerChange(current => [...current, newSticker]);
                } catch {
                    setUploadError(t.stickerUploadError);
                }
            }
        }
        if (e.target) e.target.value = '';
    };

    const moveStickerToEdge = (id: string, edge: 'front' | 'back') => {
        const sourceIndex = stickers.findIndex(sticker => sticker.id === id);
        if (sourceIndex < 0 || (edge === 'front' && sourceIndex === stickers.length - 1) || (edge === 'back' && sourceIndex === 0)) return;

        commitStickerChange(current => {
            const index = current.findIndex(sticker => sticker.id === id);
            if (index < 0 || (edge === 'front' && index === current.length - 1) || (edge === 'back' && index === 0)) return current;

            const next = [...current];
            const [sticker] = next.splice(index, 1);
            if (edge === 'front') next.push(sticker);
            else next.unshift(sticker);
            return next;
        });
        const sourceNumber = stickers.length - sourceIndex;
        const actionLabel = edge === 'front' ? layerText.moveToFront : layerText.moveToBack;
        setOrderAnnouncement(`${layerText.order}: ${getLayerName(sourceNumber)} ${actionLabel}`);
    };

    // ─── Shared sub-panel style ───────────────────────────────────────────────
    const panelStyle: CSSProperties = {
        backgroundColor: 'var(--surface-200)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '0',
        padding: '8px',
    };

    const updateSticker = (id: string, updates: Partial<Sticker>) => {
        updatePlayerField('stickers', stickers.map(sticker => sticker.id === id ? { ...sticker, ...updates } : sticker));
    };

    const commitStickerUpdate = (id: string, updates: Partial<Sticker>) => {
        commitStickerChange(current => {
            const index = current.findIndex(sticker => sticker.id === id);
            if (index < 0 || !(Object.keys(updates) as (keyof Sticker)[]).some(key => current[index][key] !== updates[key])) return current;

            const next = [...current];
            next[index] = { ...current[index], ...updates };
            return next;
        });
    };

    const scaleInputId = selectedSticker ? stickerControlId(selectedSticker.id, 'scale') : undefined;
    const scaleRangeId = selectedSticker ? stickerControlId(selectedSticker.id, 'scale-range') : undefined;
    const rotationInputId = selectedSticker ? stickerControlId(selectedSticker.id, 'rotation') : undefined;
    const rotationRangeId = selectedSticker ? stickerControlId(selectedSticker.id, 'rotation-range') : undefined;
    const removeLayerSticker = (id: string) => {
        const rowIndex = frontToBackStickers.findIndex(sticker => sticker.id === id);
        removeSticker(id);
        window.requestAnimationFrame(() => {
            const remainingRows = document.querySelectorAll<HTMLButtonElement>('[data-testid="sticker-layer-select"]');
            const nextRow = remainingRows[Math.min(Math.max(rowIndex, 0), remainingRows.length - 1)];
            (nextRow ?? document.querySelector<HTMLButtonElement>('[data-sticker-add]'))?.focus();
        });
    };

    return (
        <section className="sticker-layer-panel" aria-labelledby="sticker-layer-heading">
            <div className="sticker-layer-panel__header">
                <h2 id="sticker-layer-heading">{layerText.title}</h2>
                <p>{t.stickerHint}</p>
            </div>

            <button type="button" data-sticker-add className="sticker-layer-panel__add" onClick={() => fileInputRef.current?.click()}>
                <Plus size={15} aria-hidden="true" />
                {t.addSticker}
            </button>
            <input type="file" ref={fileInputRef} accept="image/*" aria-label={t.addSticker} className="hidden" onChange={handleAddSticker} />
            {uploadError && <p role="alert" aria-live="polite" className="sticker-layer-panel__error">{uploadError}</p>}

            <ol className="sticker-layer-panel__list" aria-label={layerText.order} data-testid="sticker-layer-list">
                {stickers.length === 0 ? (
                    <li className="sticker-layer-panel__empty-list-item">
                        <div className="sticker-layer-panel__empty" role="status">
                            <Move size={15} aria-hidden="true" />
                            <span>{layerText.empty}</span>
                        </div>
                    </li>
                ) : frontToBackStickers.map((sticker, frontIndex) => {
                            const arrayIndex = stickers.length - frontIndex - 1;
                            const isSelected = selectedStickerId === sticker.id;
                            const isAtFront = arrayIndex === stickers.length - 1;
                            const isAtBack = arrayIndex === 0;
                            const number = frontIndex + 1;
                            const selectLabel = getLayerName(number);
                            const positionLabels = [
                                isAtFront ? layerText.front : '',
                                isAtBack ? layerText.back : '',
                                isSelected ? layerText.selected : '',
                            ].filter(Boolean);

                            return (
                                <li key={sticker.id} aria-posinset={frontIndex + 1} aria-setsize={stickers.length}>
                                    <div
                                        className={`sticker-layer-panel__row${isSelected ? ' is-selected' : ''}`}
                                        data-testid="sticker-layer-row"
                                        data-sticker-id={sticker.id}
                                        role="group"
                                        aria-label={[selectLabel, ...positionLabels].join(', ')}
                                    >
                                        <button
                                            type="button"
                                            className="sticker-layer-panel__select"
                                            data-testid="sticker-layer-select"
                                            data-sticker-id={sticker.id}
                                            aria-label={selectLabel}
                                            aria-pressed={isSelected}
                                            onClick={() => setSelectedStickerId(sticker.id)}
                                            onKeyDown={event => {
                                                if (event.key === 'ArrowUp' || event.key === 'Home') {
                                                    event.preventDefault();
                                                    moveStickerToEdge(sticker.id, 'front');
                                                } else if (event.key === 'ArrowDown' || event.key === 'End') {
                                                    event.preventDefault();
                                                    moveStickerToEdge(sticker.id, 'back');
                                                }
                                            }}
                                        >
                                            <span className="sticker-layer-panel__thumbnail">
                                                <img src={sticker.url} alt="" width={44} height={44} />
                                            </span>
                                            <span className="sticker-layer-panel__row-copy">
                                                <span className="sticker-layer-panel__row-title">#{number}</span>
                                                <span className="sticker-layer-panel__row-status">
                                                    {positionLabels.map(label => <span key={label}>{label}</span>)}
                                                </span>
                                            </span>
                                        </button>
                                        <div className="sticker-layer-panel__actions" role="group" aria-label={`${layerText.actions} ${number}`}>
                                            <button
                                                type="button"
                                                data-testid="sticker-move-to-front"
                                                aria-label={`${layerText.moveToFront} ${number}`}
                                                title={layerText.moveToFront}
                                                disabled={isAtFront}
                                                onClick={() => moveStickerToEdge(sticker.id, 'front')}
                                            >
                                                <ChevronsUp size={15} aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                data-testid="sticker-move-to-back"
                                                aria-label={`${layerText.moveToBack} ${number}`}
                                                title={layerText.moveToBack}
                                                disabled={isAtBack}
                                                onClick={() => moveStickerToEdge(sticker.id, 'back')}
                                            >
                                                <ChevronsDown size={15} aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                className="is-danger"
                                                aria-label={`${selectLabel} ${t.delete}`}
                                                title={t.delete}
                                                onClick={() => removeLayerSticker(sticker.id)}
                                            >
                                                <X size={14} aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
            </ol>
            {stickers.length > 0 && <p className="sticker-layer-panel__sr-only" aria-live="polite" aria-atomic="true">{orderAnnouncement}</p>}

            {selectedSticker && (
                <section className="sticker-layer-panel__properties" data-testid="sticker-property-panel" data-sticker-id={selectedSticker.id} aria-labelledby="sticker-layer-properties-heading">
                    <h3 id="sticker-layer-properties-heading">{layerText.properties}</h3>
                    <div className="sticker-layer-panel__property-actions">
                        <button type="button" onClick={() => commitStickerUpdate(selectedSticker.id, { x: 50, y: 50 })}>
                            {t.centerSticker}
                        </button>
                        <button type="button" onClick={() => commitStickerUpdate(selectedSticker.id, { scale: 0.5, rotation: 0 })}>
                            {t.resetStickerTransform}
                        </button>
                    </div>

                    <div className="sticker-layer-panel__slider-grid">
                        <div className="sticker-layer-panel__slider-card" style={panelStyle}>
                            <div className="sticker-layer-panel__slider-heading">
                                <label id={`${scaleInputId}-label`} htmlFor={scaleInputId}>
                                    <Maximize size={11} aria-hidden="true" /> {t.stickerSize}
                                </label>
                                <div className="sticker-layer-panel__number-value">
                                    <input
                                        type="number" min="0.1" max="3" step="0.1"
                                        id={scaleInputId}
                                        name={scaleInputId}
                                        data-testid="sticker-scale-input"
                                        aria-labelledby={`${scaleInputId}-label`}
                                        value={selectedSticker.scale}
                                        onChange={event => updateSticker(selectedSticker.id, { scale: Number(event.target.value) })}
                                    />
                                    <span>x</span>
                                </div>
                            </div>
                            <input
                                type="range" min="0.1" max="3" step="0.05"
                                id={scaleRangeId}
                                name={scaleRangeId}
                                data-testid="sticker-scale-range"
                                aria-labelledby={`${scaleInputId}-label`}
                                value={selectedSticker.scale}
                                onChange={event => updateSticker(selectedSticker.id, { scale: Number(event.target.value) })}
                            />
                        </div>

                        <div className="sticker-layer-panel__slider-card" style={panelStyle}>
                            <div className="sticker-layer-panel__slider-heading">
                                <label id={`${rotationInputId}-label`} htmlFor={rotationInputId}>
                                    <RotateCw size={11} aria-hidden="true" /> {t.stickerRotate}
                                </label>
                                <div className="sticker-layer-panel__number-value">
                                    <input
                                        type="number" min="0" max="360"
                                        id={rotationInputId}
                                        name={rotationInputId}
                                        data-testid="sticker-rotation-input"
                                        aria-labelledby={`${rotationInputId}-label`}
                                        value={selectedSticker.rotation}
                                        onChange={event => updateSticker(selectedSticker.id, { rotation: Number(event.target.value) })}
                                    />
                                    <span>°</span>
                                </div>
                            </div>
                            <input
                                type="range" min="0" max="360" step="1"
                                id={rotationRangeId}
                                name={rotationRangeId}
                                data-testid="sticker-rotation-range"
                                aria-labelledby={`${rotationInputId}-label`}
                                value={selectedSticker.rotation}
                                onChange={event => updateSticker(selectedSticker.id, { rotation: Number(event.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="sticker-layer-panel__position-grid">
                        {[
                            { label: 'X', icon: <Move size={10} aria-hidden="true" />, key: 'x' as const },
                            { label: 'Y', icon: <Move size={10} aria-hidden="true" className="rotate-90" />, key: 'y' as const },
                        ].map(({ label, icon, key }) => {
                            const inputId = stickerControlId(selectedSticker.id, key);
                            return (
                                <div className="sticker-layer-panel__position-value" key={key}>
                                    <label htmlFor={inputId}>{icon}{label}</label>
                                    <div>
                                        <input
                                            type="number" min="0" max="100"
                                            id={inputId}
                                            name={inputId}
                                            data-testid={`sticker-${key}-input`}
                                            value={Math.round(selectedSticker[key])}
                                            onChange={event => updateSticker(selectedSticker.id, { [key]: Number(event.target.value) })}
                                        />
                                        <span>%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </section>
    );
}
