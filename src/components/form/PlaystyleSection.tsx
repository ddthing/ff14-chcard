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
        handleChange('playstyles', []);
    };

    return (
        <Section 
            title={
                <div className="flex items-center justify-between w-full">
                    <span>{t.playstyle}</span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                        }}
                        className="flex items-center gap-1 text-[10px] font-semibold transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--error, #cf2d56)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                        <RotateCcw size={11} />
                        {i18n[lang].layout.reset}
                    </button>
                </div>
            }
        >
            {/* 플레이스타일 태그 목록 그리드 */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                {playstylesKo.map((tagKo, idx) => {
                    const displayTag = playstylesOptions[idx];
                    const isSelected = playerInfo.playstyles.includes(tagKo);
                    return (
                        <button
                            key={tagKo}
                            onClick={() => togglePlaystyle(tagKo)}
                            className="px-2 py-2 text-[11px] font-semibold rounded-[8px] border transition-all duration-150 text-center flex items-center justify-center min-h-[40px] leading-tight"
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
