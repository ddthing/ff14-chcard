import { Sprout, Crown } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { getContrastColor } from '../../utils/styles';
import { activeTimeTranslate } from '../../utils/i18n';
import { i18n } from '../../utils/i18n';

export function CardProfileHeader() {
    const { playerInfo } = usePlayer();
    const { name, server, region, isSprout, isMentor, isNicknameChanged, activeTime, language: lang } = playerInfo;
    const t = i18n[lang].preview;

    return (
        <div className="flex items-end justify-between border-b border-neutral-100 dark:border-[#3a3a3c] pb-5">
            <div>
                {(name || isSprout || isMentor || isNicknameChanged) && (
                    <div className="flex items-center gap-2">
                        {name && (
                            <h1 className="text-3xl font-bold tracking-tight leading-none whitespace-nowrap">
                                {name}
                            </h1>
                        )}
                        {isSprout && (
                            <span style={{ color: playerInfo.pointColor }} title={t.sprout}>
                                <Sprout size={22} aria-hidden="true" />
                            </span>
                        )}
                        {isMentor && (
                            <span style={{ color: playerInfo.pointColor }} title={t.mentor}>
                                <Crown size={22} aria-hidden="true" />
                            </span>
                        )}
                        {isNicknameChanged && (
                            <span
                                className="text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap"
                                style={{ backgroundColor: playerInfo.pointColor, color: getContrastColor(playerInfo.pointColor) }}
                            >
                                {t.diffIngame}
                            </span>
                        )}
                    </div>
                )}
                {server && (
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm text-neutral-500 dark:text-[#a1a1a6] font-medium whitespace-nowrap">{server}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#3a3a3c] text-neutral-400 dark:text-[#86868b] font-semibold whitespace-nowrap">{region}</span>
                    </div>
                )}
            </div>
            {activeTime && (
                <div className="text-right">
                   <p className="text-[10px] font-bold text-neutral-400 dark:text-[#86868b] uppercase tracking-[0.2em] mb-0.5" style={{ fontFamily: 'inherit' }}>{t.activeTime}</p>
                   <span className="text-xs text-neutral-400 dark:text-[#86868b] font-medium whitespace-nowrap">
                       {activeTimeTranslate(activeTime, lang)}
                   </span>
                </div>
            )}
        </div>
    );
}
