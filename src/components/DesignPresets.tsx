import { Check } from 'lucide-react';
import { usePlayerActions, usePlayerSelector } from '../contexts/PlayerContext';
import { i18n } from '../utils/i18n';
import { Section } from './form/Section';
const PRESETS = [
    { id: 'signature', color: '#ad482f', font: 'font-pretendard', layout: 'header' },
    { id: 'botanical', color: '#3e6556', font: 'font-pretendard', layout: 'left-portrait' },
    { id: 'editorial', color: '#46577e', font: 'font-myungjo', layout: 'header' },
    { id: 'minimal', color: '#57534e', font: 'font-pretendard', layout: 'left-portrait' },
] as const;
export function DesignPresets() {
    const { language, pointColor, font, layout } = usePlayerSelector(s => s.playerInfo);
    const { setPlayerInfo } = usePlayerActions();
    const t = i18n[language].studio;
    return <Section title={t.presets}><p className="mb-3 text-xs leading-relaxed text-text-secondary">{t.presetsHint}</p><div className="grid grid-cols-2 gap-3">
        {PRESETS.map(preset => {
            const selected = pointColor === preset.color && font === preset.font && layout === preset.layout;
            return <button key={preset.id} type="button" className="preset-button" aria-pressed={selected} onClick={() => setPlayerInfo(prev => ({ ...prev, pointColor: preset.color, font: preset.font, layout: preset.layout }))}>
                <span className={'preset-art' + (preset.layout === 'left-portrait' ? ' preset-art-portrait' : '')} aria-hidden="true" style={{ '--preset-color': preset.color } as React.CSSProperties}><span className="preset-art-image"><span /></span><span className="preset-art-copy"><i /><i /><i /></span></span>
                <span className="flex min-h-10 items-center justify-between gap-2 px-3 text-xs font-semibold"><span className="min-w-0 break-words">{t[preset.id]}</span>{selected && <Check size={12} className="shrink-0" aria-hidden="true" />}</span>
            </button>;
        })}
    </div></Section>;
}
