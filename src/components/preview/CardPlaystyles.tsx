import { usePlayer } from '../../contexts/PlayerContext';
import { playstyleTranslate } from '../../utils/i18n';
import { i18n } from '../../utils/i18n';

export function CardPlaystyles() {
    const { playerInfo } = usePlayer();
    const { playstyles, language: lang } = playerInfo;
    const t = i18n[lang].preview;

    if (!playstyles || playstyles.length === 0) return null;

    return (
        <div className="pl-4">
            <div className="text-[10px] text-neutral-400 dark:text-[#86868b] font-semibold uppercase tracking-wider mb-2">{t.playstyle}</div>
            <div className="flex flex-wrap gap-1.5">
                {playstyles.map(tag => (
                    <span 
                        key={tag} 
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${playerInfo.pointColor}15`, color: 'var(--text-primary)' }}
                    >
                        {playstyleTranslate(tag, lang)}
                    </span>
                ))}
            </div>
        </div>
    );
}
