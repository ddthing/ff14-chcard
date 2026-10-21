import { useId, type CSSProperties } from 'react';
import { Check, Mountain, Sparkle } from 'lucide-react';
import type { Language, PlayerInfo } from '../types';
import { DESIGN_PRESETS, matchesDesignPreset, type DesignPreset } from '../data/designPresets';
import { presetCopy } from '../utils/presetCopy';
import { Section } from './form/Section';

interface DesignPresetPickerProps {
    player: PlayerInfo;
    lang: Language;
    onSelect: (preset: DesignPreset) => void;
}

export function DesignPresetPicker({ player, lang, onSelect }: DesignPresetPickerProps) {
    const t = presetCopy[lang];
    const id = useId();
    const current = DESIGN_PRESETS.find(preset => matchesDesignPreset(player, preset));

    return <Section title={t.title}>
        <p className="mb-3 text-[11px] leading-relaxed text-text-secondary">{t.hint}</p>
        <div role="group" aria-label={t.title} className="grid grid-cols-2 gap-2.5" data-testid="design-presets">
            {DESIGN_PRESETS.map((preset, index) => {
                const selected = current?.id === preset.id;
                const look = t.looks[preset.id];
                const portrait = preset.settings.layout === 'left-portrait';
                return <button
                    key={preset.id}
                    type="button"
                    data-preset={preset.id}
                    aria-label={look.name}
                    aria-describedby={`${id}-${preset.id}-description`}
                    aria-pressed={selected}
                    onClick={() => onSelect(preset)}
                    className={`group min-w-0 cursor-pointer overflow-hidden rounded-[5px] border p-2 text-left transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)] ${selected ? 'border-[var(--text-primary)] bg-[var(--surface-200)] shadow-[inset_0_0_0_1px_var(--text-primary)]' : 'border-[var(--border-default)] bg-[var(--surface-50)] hover:border-[var(--border-medium)]'}`}
                    style={{ '--look-accent': preset.settings.pointColor } as CSSProperties}
                >
                    <span aria-hidden="true" className="relative flex h-[76px] items-center justify-center overflow-hidden bg-[color-mix(in_srgb,var(--look-accent)_12%,var(--surface-100))] p-2.5">
                        <span className={`relative flex h-full w-full overflow-hidden border border-[var(--border-default)] bg-[var(--surface-50)] shadow-sm ${portrait ? 'flex-row' : 'flex-col'}`}>
                            <span className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-[color-mix(in_srgb,var(--look-accent)_25%,var(--surface-100))] text-[var(--look-accent)] ${portrait ? 'h-full w-[38%]' : 'h-[36%] w-full'}`}>
                                <Mountain size={portrait ? 25 : 19} strokeWidth={1} />
                            </span>
                            <span className="relative flex min-w-0 flex-1 flex-col justify-center gap-1 px-2 py-1">
                                <span className={`text-[11px] leading-none text-text-primary ${preset.id === 'editorial' ? 'font-serif' : preset.id === 'archive' ? 'font-mono' : 'font-sans'}`}>Aa</span>
                                <span className="block h-[2px] w-3/4 bg-[var(--look-accent)]" />
                                <span className="block h-[2px] w-1/2 bg-[var(--border-default)]" />
                                {preset.settings.jobWatermark && <Sparkle className="absolute bottom-1 right-1 text-[var(--look-accent)] opacity-25" size={17} strokeWidth={1} />}
                            </span>
                        </span>
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-1">
                        <span className="min-w-0 text-[11px] font-semibold leading-snug text-text-primary">{look.name}</span>
                        {selected ? <Check size={13} className="shrink-0 text-text-primary" aria-label={t.selected} /> : <span aria-hidden="true" className="text-[9px] tabular-nums text-text-secondary">0{index + 1}</span>}
                    </span>
                    <span id={`${id}-${preset.id}-description`} className="mt-1 block text-[9px] leading-relaxed text-text-secondary">{look.description}</span>
                </button>;
            })}
        </div>
        <p role="status" aria-live="polite" className="mt-2 text-[10px] leading-relaxed text-text-secondary">
            {current ? t.current.replace('{name}', t.looks[current.id].name) : t.custom}
        </p>
    </Section>;
}
