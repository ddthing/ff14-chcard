import { useEffect } from 'react';
import { X } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { i18n } from '../../utils/i18n';

export function StickerUndoNotice() {
    const { playerInfo, removedSticker, undoStickerRemoval, dismissStickerUndo } = usePlayer();
    const t = i18n[playerInfo.language].form;

    useEffect(() => {
        if (!removedSticker) return;
        const timeoutId = window.setTimeout(dismissStickerUndo, 6000);
        return () => window.clearTimeout(timeoutId);
    }, [dismissStickerUndo, removedSticker]);

    if (!removedSticker) return null;

    return (
        <div className="fixed bottom-5 left-1/2 z-[190] flex -translate-x-1/2 items-center gap-3 border px-4 py-3 shadow-lg" style={{ backgroundColor: 'var(--surface-50)', borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }} role="status" aria-live="polite">
            <span className="text-sm font-medium">{t.stickerDeleted}</span>
            <button type="button" onClick={undoStickerRemoval} className="text-sm font-bold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]">
                {t.undo}
            </button>
            <button type="button" onClick={dismissStickerUndo} aria-label={i18n[playerInfo.language].layout.close} className="p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]">
                <X size={15} aria-hidden="true" />
            </button>
        </div>
    );
}
