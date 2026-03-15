import type { PlayerInfo, Language } from '../../types';
import { i18n, PLAYSTYLES_KO, getPlaystyles } from '../../utils/i18n';
import { Section } from './Section';

interface PlaystyleSectionProps {
    playerInfo: PlayerInfo;
    handleChange: <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => void;
    lang: Language;
}

export function PlaystyleSection({ playerInfo, handleChange, lang }: PlaystyleSectionProps) {
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
            <div className="flex flex-wrap gap-1.5">
                {playstylesKo.map((tagKo, idx) => {
                    const displayTag = playstylesOptions[idx];
                    const isSelected = playerInfo.playstyles.includes(tagKo);
                    return (
                        <button
                            key={tagKo}
                            onClick={() => togglePlaystyle(tagKo)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all duration-300 ${
                                isSelected 
                                    ? 'shadow-sm border-transparent' 
                                    : 'bg-[#f5f5f7] dark:bg-[#2d2d2f] border-[#d2d2d7] dark:border-[#424245] text-[#86868b] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'
                            }`}
                            style={isSelected ? { 
                                backgroundColor: `${playerInfo.pointColor}15`, 
                                color: playerInfo.pointColor,
                                borderColor: `${playerInfo.pointColor}40`
                            } : {}}
                        >
                            {displayTag}
                        </button>
                    );
                })}
            </div>
        </Section>
    );
}
