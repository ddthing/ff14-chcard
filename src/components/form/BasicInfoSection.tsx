import { Sprout as SproutIcon, Crown } from 'lucide-react';
import { getAllWorldsGrouped } from '../../data/servers';
import { i18n } from '../../utils/i18n';
import { inputClass } from '../../utils/styles';
import { Section } from './Section';

/**
 * Basic Info Section Component
 *
 * 닉네임, 서버, 새싹/멘토 상태를 입력하는 섹션.
 * 포인트컬러는 꾸미기 탭으로 분리됨.
 * 이미지 업로드는 CardForm 기본 탭에서 직접 처리됨.
 */
import { usePlayer } from '../../contexts/PlayerContext';

export function BasicInfoSection() {
    const { playerInfo, updatePlayerField: handleChange } = usePlayer();
    const lang = playerInfo.language;
    const t = i18n[lang].form;
    const worldsGrouped = getAllWorldsGrouped(lang);

    // inputClass is shared from utils/styles — do not redefine locally.

    const getToggleClass = (isActive: boolean) => `
        h-[42px] flex items-center justify-center gap-1.5 px-3 rounded-xl border transition-all duration-200 text-xs font-semibold whitespace-nowrap
        ${isActive
            ? 'shadow-sm'
            : 'bg-white dark:bg-transparent border-[#d2d2d7] dark:border-[#424245] text-[#86868b] hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2f]'}
    `;

    const getToggleStyle = (isActive: boolean) => isActive ? {
        borderColor: playerInfo.pointColor,
        color: playerInfo.pointColor,
        backgroundColor: `${playerInfo.pointColor}15`,
    } : {};

    return (
        <Section title={t.basicInfo}>
            <div className="space-y-2.5">
                {/* 1행: 닉네임 + 인게임과 다름 토글 */}
                <div className="flex flex-col sm:flex-row gap-2">
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

                {/* 2행: 서버 선택 + 새싹/멘토 토글 */}
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
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
                            if (selectedWorld === '') {
                                handleChange('server', '');
                            }
                        }}
                        className={`${inputClass} flex-1 w-full sm:w-auto sm:min-w-[140px] h-[42px]`}
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

                    {/* 새싹 / 멘토 토글 */}
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
