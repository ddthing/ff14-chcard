import { useId } from 'react';
import { usePlayerActions, usePlayerSelector } from '../../contexts/PlayerContext';
import { i18n } from '../../utils/i18n';
import { Section } from './Section';
export function BackgroundEffectsSection() {
    const { cornerWash, jobWatermark, mainJob, language } = usePlayerSelector(s => s.playerInfo);
    const { updatePlayerField } = usePlayerActions();
    const t = i18n[language].studio;
    const id = useId();
    return <Section title={t.backgroundEffects}>
        <p className="mb-3 text-xs leading-relaxed text-text-secondary">{t.backgroundEffectsHint}</p>
        <div className="divide-y divide-[var(--border-default)] border-y border-[var(--border-default)]">
            <label className="flex min-h-14 cursor-pointer items-center gap-3 py-3 text-text-primary">
                <input type="checkbox" aria-label={t.cornerWash} aria-describedby={id + '-wash'} checked={Boolean(cornerWash)} onChange={event => updatePlayerField('cornerWash', event.target.checked)} className="h-4 w-4 shrink-0 accent-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--text-primary)]" />
                <span><span className="block text-xs font-medium">{t.cornerWash}</span><span id={id + '-wash'} className="mt-1 block text-[11px] leading-relaxed text-text-secondary">{t.cornerWashHint}</span></span>
            </label>
            <label className={'flex min-h-14 items-center gap-3 py-3 text-text-primary ' + (mainJob ? 'cursor-pointer' : 'cursor-default')}>
                <input type="checkbox" aria-label={t.jobWatermark} checked={Boolean(jobWatermark)} disabled={!mainJob} aria-describedby={id + '-watermark' + (!mainJob ? ' ' + id : '')} onChange={event => updatePlayerField('jobWatermark', event.target.checked)} className="h-4 w-4 shrink-0 accent-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--text-primary)]" />
                <span><span className="block text-xs font-medium">{t.jobWatermark}</span><span id={id + '-watermark'} className="mt-1 block text-[11px] leading-relaxed text-text-secondary">{t.jobWatermarkHint}</span></span>
            </label>
        </div>
        {!mainJob && <p id={id} className="mt-2 text-[11px] leading-relaxed text-text-secondary">{t.watermarkNeedsJob}</p>}
    </Section>;
}
