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
        `flex h-[38px] items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] border px-3.5 text-[11px] font-semibold transition-[color,background-color,border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]` +
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
                        name="character-name"
                        aria-label={t.nickname}
                        autoComplete="nickname"
                        value={playerInfo.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`${inputClass} h-[42px] sm:flex-1 font-semibold`}
                        placeholder={t.nickname}
                    />
                    <button
                        type="button"
                        aria-pressed={playerInfo.isNicknameChanged}
                        onClick={() => handleChange('isNicknameChanged', !playerInfo.isNicknameChanged)}
                        className="flex h-[42px] w-full shrink-0 items-center justify-center whitespace-nowrap rounded-[8px] border px-3.5 py-0 text-[11px] font-semibold transition-[color,background-color,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)] sm:w-auto"
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
                        name="character-server"
                        aria-label={t.selectServer}
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
                            aria-pressed={playerInfo.isSprout}
                            aria-label={t.newbie}
                            onClick={() => handleChange('isSprout', !playerInfo.isSprout)}
                            className={getToggleClass(playerInfo.isSprout)}
                            style={getToggleStyle(playerInfo.isSprout)}
                        >
                            <SproutIcon size={16} aria-hidden="true" className={!playerInfo.isSprout ? 'opacity-40' : ''} />
                            <span>{t.newbie}</span>
                        </button>
                        <button
                            type="button"
                            aria-pressed={playerInfo.isMentor}
                            aria-label={t.mentor}
                            onClick={() => handleChange('isMentor', !playerInfo.isMentor)}
                            className={getToggleClass(playerInfo.isMentor)}
                            style={getToggleStyle(playerInfo.isMentor)}
                        >
                            <Crown size={16} aria-hidden="true" className={!playerInfo.isMentor ? 'opacity-40' : ''} />
                            <span>{t.mentor}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Section>
    );
}
