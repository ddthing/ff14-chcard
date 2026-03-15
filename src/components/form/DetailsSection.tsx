import { useState } from 'react';
import type { PlayerInfo, Language } from '../../types';
import { i18n, getActiveTimes, ACTIVE_TIMES_KO } from '../../utils/i18n';
import { Section } from './Section';

/**
 * Details Section Component
 * 
 * Manages supplementary character information like active time and self-introduction.
 * Provides a seamless transition between preset list selection and custom text input.
 */
interface DetailsSectionProps {
    playerInfo: PlayerInfo;
    handleChange: <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => void;
    lang: Language;
}

export function DetailsSection({ playerInfo, handleChange, lang }: DetailsSectionProps) {
    const [isCustomTime, setIsCustomTime] = useState(false);
    const t = i18n[lang].form;
    const activeTimes = getActiveTimes(lang);

    /**
     * Apple 스타일 입력창 클래스
     */
    const inputClass = "w-full bg-[#f5f5f7] dark:bg-[#2d2d2f] border border-[#d2d2d7] dark:border-[#424245] px-3 py-2.5 rounded-xl text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all";

    const handleTimeChange = (value: string) => {
        // Find the index of the selected localized string to store the Korean (base) version
        const index = activeTimes.indexOf(value);
        const isCustomOption = value === '직접 입력' || value === 'Custom' || value === '直接入力';

        if (isCustomOption) {
            setIsCustomTime(true);
            handleChange('activeTime', '');
        } else if (index !== -1) {
            // Store the Korean version as the source of truth
            handleChange('activeTime', ACTIVE_TIMES_KO[index]);
        } else {
            handleChange('activeTime', value);
        }
    };

    return (
        <Section title={t.details}>
            {/* 접속 시간대 설정 */}
            {!isCustomTime ? (
                <select
                    value={activeTimes.includes(playerInfo.activeTime) ? playerInfo.activeTime : ''}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className={inputClass}
                >
                    <option value="" disabled>{t.selectTime}</option>
                    {activeTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={playerInfo.activeTime}
                        onChange={(e) => handleChange('activeTime', e.target.value)}
                        className={`${inputClass} flex-1`}
                        placeholder={t.customTime}
                        autoFocus
                    />
                    <button
                        onClick={() => setIsCustomTime(false)}
                        className="flex items-center justify-center px-4 rounded-xl border transition-all text-sm font-semibold whitespace-nowrap bg-[#f5f5f7] border-[#d2d2d7] text-[#86868b] hover:bg-[#e8e8ed] dark:bg-[#2d2d2f] dark:border-[#424245] dark:hover:bg-[#3a3a3c]"
                    >
                        {t.list}
                    </button>
                </div>
            )}

            {/* 자기소개 코멘트 영역 */}
            <textarea
                value={playerInfo.comment}
                onChange={(e) => handleChange('comment', e.target.value)}
                className={`${inputClass} h-20 resize-none`}
                placeholder={t.commentPlaceholder}
                maxLength={200}
            />
        </Section>
    );
}
