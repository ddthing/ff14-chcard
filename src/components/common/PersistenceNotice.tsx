import { X } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { i18n } from '../../utils/i18n';

export function PersistenceNotice() {
    const { playerInfo, persistenceStatus, dismissPersistenceStatus } = usePlayer();
    if (!persistenceStatus) return null;
    const t = i18n[playerInfo.language].layout;

    return (
        <div className="fixed left-4 right-4 top-20 z-[180] mx-auto flex max-w-xl items-start justify-between gap-3 border p-4 shadow-lg" style={{ backgroundColor: 'var(--surface-50)', borderColor: 'var(--destructive)', color: 'var(--text-primary)' }} role="alert">
            <p className="text-sm leading-6">
                {persistenceStatus === 'image-omitted' ? t.profileSavedWithoutImage : t.profileSaveFailed}
            </p>
            <button type="button" onClick={dismissPersistenceStatus} aria-label={t.close} className="shrink-0 p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]">
                <X size={16} aria-hidden="true" />
            </button>
        </div>
    );
}
