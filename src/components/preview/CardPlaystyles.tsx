import { usePlayerSelector } from '../../contexts/PlayerContext';
import { playstyleTranslate, i18n } from '../../utils/i18n';
export function CardPlaystyles() {
    const { playstyles, language: lang } = usePlayerSelector(s => s.playerInfo);
    if (!playstyles.length) return null;
    return <section aria-label={i18n[lang].preview.playstyle}><h3 className="sheet-label">{i18n[lang].preview.playstyle}</h3><div className="sheet-tags">
        {playstyles.map(tag => <span key={tag}><i className="sheet-paper-texture" aria-hidden="true" />{playstyleTranslate(tag, lang)}</span>)}
    </div></section>;
}
