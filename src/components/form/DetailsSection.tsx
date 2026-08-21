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
    const t = i18n[lang].form;
    const activeTimes = getActiveTimes(lang);
    const activeTimePresetIndex = ACTIVE_TIMES_KO.indexOf(playerInfo.activeTime);
    const hasStoredCustomTime = playerInfo.activeTime !== '' && activeTimePresetIndex === -1;
    const [customModeRequested, setCustomModeRequested] = useState(hasStoredCustomTime);
    // The persisted value rehydrates custom mode after the Style tab remounts;
    // local mode preserves the intentional "Custom" selection before text is entered.
    const isCustomTime = hasStoredCustomTime || customModeRequested;

    /**
     * Apple 스타일 입력창 클래스
     */
    // inputClass is shared from utils/styles — do not redefine locally.

    const handleTimeChange = (value: string) => {
        // Find the index of the selected localized string to store the Korean (base) version
        const index = activeTimes.indexOf(value);
        const isCustomOption = index === activeTimes.length - 1;

        if (isCustomOption) {
            setCustomModeRequested(true);
            handleChange('activeTime', '');
        } else if (index !== -1) {
            setCustomModeRequested(false);
            // Store the Korean version as the source of truth
            handleChange('activeTime', ACTIVE_TIMES_KO[index]);
        } else {
            setCustomModeRequested(true);
            handleChange('activeTime', value);
        }
    };

    return (
        <Section title={t.details}>
            <div className="flex flex-col gap-2.5">
                {/* 접속 시간대 설정 */}
            {!isCustomTime ? (
                <select
                    name="active-time"
                    aria-label={t.selectTime}
                    value={activeTimePresetIndex !== -1 ? activeTimes[activeTimePresetIndex] : ''}
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
                        name="custom-active-time"
                        aria-label={t.customTime}
                        value={playerInfo.activeTime}
                        onChange={(e) => handleChange('activeTime', e.target.value)}
                        className={`${inputClass} flex-1`}
                        placeholder={t.customTime}
                    />
                    <button
                        type="button"
                        aria-label={t.list}
                        onClick={() => {
                            setCustomModeRequested(false);
                            handleChange('activeTime', '');
                        }}
                        className="flex items-center justify-center whitespace-nowrap rounded-[8px] border px-3.5 text-[11px] font-semibold transition-[color,background-color,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                        style={{ backgroundColor: 'var(--surface-300)', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                    >
                        {t.list}
                    </button>
                </div>
            )}

            {/* 자기소개 코멘트 영역 */}
            <textarea
                name="profile-comment"
                aria-label={t.commentPlaceholder}
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
