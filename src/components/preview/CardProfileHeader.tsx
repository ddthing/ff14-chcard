import { Sprout, Crown } from 'lucide-react';
import { usePlayerSelector } from '../../contexts/PlayerContext';
import { activeTimeTranslate, i18n } from '../../utils/i18n';
export function CardProfileHeader() {
    const { name, server, region, isSprout, isMentor, isNicknameChanged, activeTime, language: lang } = usePlayerSelector(s => s.playerInfo);
    const t = i18n[lang].preview;
    if (!name && !server && !activeTime && !isSprout && !isMentor && !isNicknameChanged) return null;
    return <div className="sheet-profile">
        <div className="sheet-identity">
            {server && <p className="sheet-world"><span className="sheet-world-mark" aria-hidden="true" />{server}<span className="sheet-region">{region}</span></p>}
            {name && <h2 className="sheet-name">{name}</h2>}
            {(isSprout || isMentor || isNicknameChanged) && <div className="sheet-statuses">
                {isSprout && <span><Sprout size={13} aria-hidden="true" />{t.sprout}</span>}
                {isMentor && <span><Crown size={13} aria-hidden="true" />{t.mentor}</span>}
                {isNicknameChanged && <span>{t.diffIngame}</span>}
            </div>}
        </div>
        {activeTime && <div className="sheet-active"><p className="sheet-label">{t.activeTime}</p><p className="sheet-active-value">{activeTimeTranslate(activeTime, lang)}</p></div>}
    </div>;
}
