import { AlertTriangle, X } from 'lucide-react';
import { usePlayerSelector } from '../../contexts/PlayerContext';
import { i18n } from '../../utils/i18n';

interface PersistenceNoticeProps {
    onDismiss: () => void;
    onOpenLibrary?: () => void;
}

export function PersistenceNotice({ onDismiss, onOpenLibrary }: PersistenceNoticeProps) {
    const language = usePlayerSelector(state => state.playerInfo.language);
    const persistenceStatus = usePlayerSelector(state => state.persistenceStatus);
    if (!persistenceStatus) return null;
    const t = i18n[language].layout;
    return <aside className="studio-persistence-notice" role="alert">
        <AlertTriangle size={16} aria-hidden="true" />
        <p>{persistenceStatus === 'image-omitted' ? t.profileSavedWithoutImage : t.profileSaveFailed}</p>
        {onOpenLibrary && <button type="button" className="studio-persistence-backup" onClick={onOpenLibrary}>{t.openBackup}</button>}
        <button type="button" className="studio-persistence-close" onClick={onDismiss} aria-label={t.close}><X size={16} aria-hidden="true" /></button>
    </aside>;
}
