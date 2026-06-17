import { useState } from 'react';
import { i18n, getActiveTimes, ACTIVE_TIMES_KO } from '../../utils/i18n';
import { inputClass } from '../../utils/styles';
import { Section } from './Section';

/**
 * Details Section Component
 * 
 * Manages supplementary character information like active time and self-introduction.
 * Provides a seamless transition between preset list selection and custom text input.
 */
import { usePlayer } from '../../contexts/PlayerContext';

export function DetailsSection() {
    const { playerInfo, updatePlayerField: handleChange } = usePlayer();
    const lang = playerInfo.language;
    const [isCustomTime, setIsCustomTime] = useState(false);
    const t = i18n[lang].form;
    const activeTimes = getActiveTimes(lang);

    /**
     * Apple 스타일 입력창 클래스
     */
    // inputClass is shared from utils/styles — do not redefine locally.

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
            <div className="flex flex-col gap-2.5">
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
                        className="flex items-center justify-center px-3.5 rounded-[8px] border transition-all text-[11px] font-semibold whitespace-nowrap"
                        style={{ backgroundColor: 'var(--surface-300)', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
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
            </div>
        </Section>
    );
}
