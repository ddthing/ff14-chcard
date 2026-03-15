import { Sprout as SproutIcon, Crown } from 'lucide-react';
import type { PlayerInfo, Language } from '../../types';
import { getAllWorldsGrouped } from '../../data/servers';
import { i18n } from '../../utils/i18n';
import { Section } from './Section';

/**
 * Basic Info Section Component
 * 
 * Handles core character identity fields such as name, world, and status toggles.
 * Features an Apple-inspired layout with refined typography and interactive elements.
 */
interface BasicInfoSectionProps {
    playerInfo: PlayerInfo;
    handleChange: <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => void;
    lang: Language;
}

export function BasicInfoSection({ playerInfo, handleChange, lang }: BasicInfoSectionProps) {
    const t = i18n[lang].form;
    const worldsGrouped = getAllWorldsGrouped(lang);

    /**
     * Apple 스타일의 기본 입력창 클래스
     */
    const inputClass = "w-full bg-[#f5f5f7] dark:bg-[#2d2d2f] border border-[#d2d2d7] dark:border-[#424245] px-3 py-2.5 rounded-xl text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all";

    /**
     * 공통 토글 버튼 스타일 (아웃라인 스타일)
     */
    const getToggleClass = (isActive: boolean) => `
        h-[42px] flex items-center justify-center gap-1.5 px-3 rounded-xl border transition-all duration-200 text-xs font-semibold whitespace-nowrap
        ${isActive 
            ? 'shadow-sm' 
            : 'bg-white dark:bg-transparent border-[#d2d2d7] dark:border-[#424245] text-[#86868b] hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2f]'}
    `;

    const getToggleStyle = (isActive: boolean) => isActive ? {
        borderColor: playerInfo.pointColor,
        color: playerInfo.pointColor,
        backgroundColor: `${playerInfo.pointColor}15`
    } : {};

    return (
        <Section title={t.basicInfo}>
            <div className="space-y-2.5">
                {/* 1행: 닉네임 입력 및 이름 변경 여부 토글 */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={playerInfo.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`${inputClass} flex-1 font-bold text-base`}
                        placeholder={t.nickname}
                    />
                    <button
                        type="button"
                        onClick={() => handleChange('isNicknameChanged', !playerInfo.isNicknameChanged)}
                        className={`flex items-center justify-center px-4 rounded-xl border transition-all text-xs font-semibold whitespace-nowrap ${
                            playerInfo.isNicknameChanged 
                                ? 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-500/10 dark:border-orange-500/30 dark:text-orange-400' 
                                : 'bg-white dark:bg-transparent border-[#d2d2d7] dark:border-[#424245] text-[#86868b] hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2f]'
                        }`}
                    >
                        {t.diffIngame}
                    </button>
                </div>

                {/* 2행: 서버 선택, 포인트 컬러, 상태 토글 그룹 (유연한 래핑 적용) */}
                <div className="flex flex-wrap gap-2 items-center">
                    {/* 서버 선택 */}
                    <select
                        value={playerInfo.server}
                        onChange={(e) => {
                            const selectedWorld = e.target.value;
                            for (const reg of worldsGrouped) {
                                for (const dc of reg.dataCenters) {
                                    if (dc.worlds.includes(selectedWorld)) {
                                        handleChange('region', reg.region);
                                        handleChange('dataCenter', dc.name);
                                        handleChange('server', selectedWorld);
                                        return;
                                    }
                                }
                            }
                            if (selectedWorld === "") {
                                handleChange('server', "");
                            }
                        }}
                        className={`${inputClass} flex-1 min-w-[140px] h-[42px]`}
                    >
                        <option value="">{t.selectServer}</option>
                        {worldsGrouped.flatMap(reg => 
                            reg.dataCenters.map(dc => (
                                <optgroup 
                                    key={`${reg.region}-${dc.name}`} 
                                    label={`${reg.regionDisplay} - ${dc.displayName}`}
                                >
                                    {dc.worlds.map(world => (
                                        <option key={world} value={world}>
                                            {world}
                                        </option>
                                    ))}
                                </optgroup>
                            ))
                        )}
                    </select>

                    {/* 포인트 컬러 및 HEX */}
                    <div className="flex items-center gap-2 px-3 bg-[#f5f5f7] dark:bg-[#2d2d2f] border border-[#d2d2d7] dark:border-[#424245] rounded-xl h-[42px] shrink-0">
                        <input
                            type="color"
                            value={playerInfo.pointColor}
                            onChange={(e) => handleChange('pointColor', e.target.value)}
                            className="w-6 h-6 rounded-lg cursor-pointer bg-transparent border-none p-0 overflow-hidden shrink-0"
                            title={t.pointColor}
                        />
                        <input
                            type="text"
                            value={playerInfo.pointColor.toUpperCase()}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                                    handleChange('pointColor', val.toLowerCase());
                                }
                            }}
                                className="w-14 bg-transparent text-[11px] font-mono text-[#86868b] focus:text-[#1d1d1f] dark:focus:text-[#f5f5f7] outline-none border-none p-0 uppercase font-bold"
                            placeholder="#HEX"
                            maxLength={7}
                        />
                    </div>

                    {/* 상태 토글 (새싹, 멘토) */}
                    <div className="flex gap-1 items-center shrink-0">
                        <button
                            type="button"
                            onClick={() => handleChange('isSprout', !playerInfo.isSprout)}
                            className={getToggleClass(playerInfo.isSprout)}
                            style={getToggleStyle(playerInfo.isSprout)}
                        >
                            <SproutIcon size={16} className={!playerInfo.isSprout ? 'opacity-40' : ''} />
                            <span>{t.newbie}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleChange('isMentor', !playerInfo.isMentor)}
                            className={getToggleClass(playerInfo.isMentor)}
                            style={getToggleStyle(playerInfo.isMentor)}
                        >
                            <Crown size={16} className={!playerInfo.isMentor ? 'opacity-40' : ''} />
                            <span>{t.mentor}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Section>
    );
}
