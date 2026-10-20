// Lucian UX/UI Prompt #266 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#266
import { useId, useState } from 'react';
import { Check, Lock, LockOpen, Shuffle } from 'lucide-react';
import type { Language } from '../types';
import { i18n } from '../utils/i18n';
import { getContrastColor } from '../utils/styles';
import { createColorPalette, isValidPaletteColor, shuffleColorPalette, type ColorPalette } from '../utils/colorPalette';
import './color-palette.css';

type ColorPalettePickerProps = {
    value: string;
    onChange: (value: string) => void;
    lang: Language;
};

type ColorPaletteLocks = [boolean, boolean, boolean, boolean, boolean];
type CopyStatus = '' | 'copied' | 'copyFailed' | 'copyUnavailable';

const initialLocks = (): ColorPaletteLocks => [false, false, false, false, false];

export function ColorPalettePicker({ value, onChange, lang }: ColorPalettePickerProps) {
    const t = i18n[lang].palette;
    const statusId = `color-palette-status-${useId().replaceAll(':', '')}`;
    const [palette, setPalette] = useState<ColorPalette>(() => createColorPalette(value));
    const [locked, setLocked] = useState(initialLocks);
    const [copyStatus, setCopyStatus] = useState<CopyStatus>('');
    const [copiedColor, setCopiedColor] = useState('');
    const [shuffleCount, setShuffleCount] = useState(0);
    const allLocked = locked.every(Boolean);
    const selectedColor = isValidPaletteColor(value) ? value.toUpperCase() : null;
    const localizedColorLabel = (label: string, color: string) => label.replace('{color}', color);
    const statusMessage = copyStatus === 'copied' ? `${t.copied} ${copiedColor}`
        : copyStatus === 'copyFailed' ? t.copyFailed
            : copyStatus === 'copyUnavailable' ? t.copyUnavailable
                : allLocked ? t.allLocked : '';

    const handleShuffle = () => {
        if (allLocked) return;
        setCopyStatus('');
        setShuffleCount(current => current + 1);
        setPalette(current => shuffleColorPalette(current, locked));
    };

    const handleLock = (index: number) => {
        setCopyStatus('');
        setLocked(current => current.map((isLocked, slot) => slot === index ? !isLocked : isLocked) as ColorPaletteLocks);
    };

    const handleCopy = async (color: string) => {
        setCopyStatus('');
        if (!navigator.clipboard?.writeText) {
            setCopyStatus('copyUnavailable');
            return;
        }

        try {
            await navigator.clipboard.writeText(color);
            setCopiedColor(color);
            setCopyStatus('copied');
        } catch {
            setCopyStatus('copyFailed');
        }
    };

    return (
        <div className="color-palette" role="group" aria-label={t.title}>
            <div className="color-palette__header">
                <h3 className="color-palette__title">{t.title}</h3>
                <div className="color-palette__actions">
                    <button
                        type="button"
                        className="color-palette__action"
                        onClick={handleShuffle}
                        disabled={allLocked}
                        aria-describedby={allLocked ? statusId : undefined}
                    >
                        <Shuffle key={shuffleCount} className={shuffleCount > 0 ? 'color-palette__shuffle-icon is-spinning' : 'color-palette__shuffle-icon'} size={13} aria-hidden="true" />
                        <span>{t.shuffle}</span>
                    </button>
                </div>
            </div>

            <div className="color-palette__swatches" role="group" aria-label={t.title}>
                {palette.map((color, index) => {
                    const isSelected = selectedColor === color;
                    const isLocked = locked[index];
                    const swatchStyle = {
                        '--palette-color': color,
                        '--palette-ink': getContrastColor(color),
                        '--palette-index': index,
                    } as React.CSSProperties;

                    return (
                        <div className="color-palette__slot" key={index} style={swatchStyle}>
                            <button
                                type="button"
                                className={`color-palette__swatch${isSelected ? ' is-selected' : ''}`}
                                onClick={() => { setCopyStatus(''); onChange(color); }}
                                aria-label={localizedColorLabel(t.selectColor, color)}
                                aria-pressed={isSelected}
                            >
                                {isSelected && <span className="color-palette__selected"><Check size={11} aria-hidden="true" />{t.selected}</span>}
                            </button>
                            <button
                                type="button"
                                className="color-palette__lock"
                                onClick={() => handleLock(index)}
                                aria-label={localizedColorLabel(isLocked ? t.unlockColor : t.lockColor, color)}
                                aria-pressed={isLocked}
                                title={localizedColorLabel(isLocked ? t.unlockColor : t.lockColor, color)}
                            >
                                {isLocked ? <Lock size={15} aria-hidden="true" /> : <LockOpen size={15} aria-hidden="true" />}
                            </button>
                            <button
                                type="button"
                                className="color-palette__copy"
                                onClick={() => void handleCopy(color)}
                                aria-label={`${t.copy}: ${color}`}
                                title={`${t.copy}: ${color}`}
                            >
                                <span className="color-palette__hex">{color}</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            <p id={statusId} className="color-palette__status" role="status" aria-live="polite" aria-label={t.statusLabel}>
                {statusMessage}
            </p>
        </div>
    );
}
