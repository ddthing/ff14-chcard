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

    return (
        <Section title={t.playstyle}>
            {/* 플레이스타일 태그 목록 그리드 */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                {playstylesKo.map((tagKo, idx) => {
                    const displayTag = playstylesOptions[idx];
                    const isSelected = playerInfo.playstyles.includes(tagKo);
                    return (
                        <button
                            key={tagKo}
                            onClick={() => togglePlaystyle(tagKo)}
                            className={`px-2 py-1.5 text-[11px] font-bold rounded-xl border transition-all duration-300 text-center truncate ${
                                isSelected 
                                    ? 'shadow-sm border-transparent' 
                                    : 'bg-[#f5f5f7] dark:bg-[#2d2d2f] border-[#d2d2d7] dark:border-[#424245] text-[#86868b] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'
                            }`}
                            style={isSelected ? { 
                                backgroundColor: `${playerInfo.pointColor}15`, 
                                color: playerInfo.pointColor,
                                border: `1px solid ${playerInfo.pointColor}40`
                            } : {}}
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
