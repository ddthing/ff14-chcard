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

    const getToggleClass = (isActive: boolean) =>
        `h-[38px] flex items-center justify-center gap-1.5 px-3.5 rounded-[8px] border transition-all duration-150 text-[11px] font-semibold whitespace-nowrap` +
        (isActive ? ' ring-1 ring-neutral-300 dark:ring-neutral-600' : ' hover:opacity-80');

    const getToggleStyle = (isActive: boolean): React.CSSProperties => isActive
        ? { borderColor: `${playerInfo.pointColor}50`, color: playerInfo.pointColor, backgroundColor: `${playerInfo.pointColor}12` }
        : { backgroundColor: 'var(--surface-300)', borderColor: 'var(--border-default)', color: 'var(--text-muted)' };

    return (
        <Section title={t.basicInfo}>
            <div className="space-y-2.5">
                {/* 1행: 닉네임 + 인게임과 다름 토글 */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={playerInfo.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`${inputClass} flex-1 font-semibold`}
                        placeholder={t.nickname}
                    />
                    <button
                        type="button"
                        onClick={() => handleChange('isNicknameChanged', !playerInfo.isNicknameChanged)}
                        className="flex items-center justify-center px-3.5 rounded-[8px] border transition-all text-[11px] font-semibold whitespace-nowrap"
                        style={playerInfo.isNicknameChanged
                            ? { backgroundColor: `${playerInfo.pointColor}12`, borderColor: `${playerInfo.pointColor}50`, color: playerInfo.pointColor }
                            : { backgroundColor: 'var(--surface-300)', borderColor: 'var(--border-default)', color: 'var(--text-muted)' }
                        }
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
                        className={`${inputClass} flex-1 w-full sm:w-auto sm:min-w-[140px]`}
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
