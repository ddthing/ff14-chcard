import { RotateCcw } from 'lucide-react';
import { i18n, PLAYSTYLES_KO, getPlaystyles } from '../../utils/i18n';
import { Section } from './Section';

import { usePlayer } from '../../contexts/PlayerContext';

export function PlaystyleSection() {
    const { playerInfo, updatePlayerField: handleChange } = usePlayer();
    const lang = playerInfo.language;
    const t = i18n[lang].form;
    const playstylesKo = PLAYSTYLES_KO;
    const playstylesOptions = getPlaystyles(lang);

    const togglePlaystyle = (tag: string) => {
        const current = playerInfo.playstyles;
        const next = current.includes(tag)
            ? current.filter(t => t !== tag)
            : [...current, tag];
        handleChange('playstyles', next);
    };

    const handleReset = () => {
        if (playerInfo.playstyles.length > 0 && !window.confirm(t.resetConfirm)) return;
        handleChange('playstyles', []);
    };

    return (
        <Section title={t.playstyle}>
            <div className="mb-2 flex justify-end">
                <button
                    type="button"
                    onClick={handleReset}
                    aria-label={i18n[lang].layout.reset}
                    className="flex items-center gap-1 text-[10px] font-semibold text-[var(--text-muted)] transition-[color,opacity] duration-150 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                >
                    <RotateCcw size={11} aria-hidden="true" />
                    {i18n[lang].layout.reset}
                </button>
            </div>
            {/* 플레이스타일 태그 목록 그리드 */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                {playstylesKo.map((tagKo, idx) => {
                    const displayTag = playstylesOptions[idx];
                    const isSelected = playerInfo.playstyles.includes(tagKo);
                    return (
                        <button
                            type="button"
                            aria-pressed={isSelected}
                            key={tagKo}
                            onClick={() => togglePlaystyle(tagKo)}
                            className="flex min-h-[40px] items-center justify-center rounded-[8px] border px-2 py-2 text-center text-[11px] font-semibold leading-tight transition-[color,background-color,border-color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                            style={isSelected
                                ? { backgroundColor: `${playerInfo.pointColor}10`, color: playerInfo.pointColor, borderColor: `${playerInfo.pointColor}30` }
                                : { backgroundColor: 'var(--surface-200)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }
                            }
                            title={displayTag}
                        >
                            {displayTag}
                        </button>
                    );
                })}
            </div>
        </Section>
    );
}
