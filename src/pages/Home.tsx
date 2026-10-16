import { useState, useMemo, useRef, useEffect, type MouseEvent } from 'react';
import { MainLayout } from '../components/MainLayout';
import { CardForm } from '../components/CardForm';
import { CardPreview } from '../components/CardPreview';
import { Download } from 'lucide-react';
import { i18n } from '../utils/i18n';
import { usePlayerActions, usePlayerSelector } from '../contexts/PlayerContext';
import { useImageExport } from '../hooks/useImageExport';
import { useToast } from '../hooks/useToast';
import { ToastNotification } from '../components/common/ToastNotification';
import { Button } from '../components/ui/Button';
import { pageMeta } from '../utils/pageMeta';
import { SeoHead } from '../components/SeoHead';
import { StickerUndoNotice } from '../components/common/StickerUndoNotice';
import { PersistenceNotice } from '../components/common/PersistenceNotice';
import { useCardDimensions } from '../hooks/useCardDimensions';
import { getExportDimensions } from '../utils/exportDimensions';
export function Home() {
    const language = usePlayerSelector(s => s.playerInfo.language);
    const layout = usePlayerSelector(s => s.playerInfo.layout ?? 'header');
    const name = usePlayerSelector(s => s.playerInfo.name);
    const { updateImage, updateLanguage } = usePlayerActions();
    const t = i18n[language].studio;
    const [pixelRatio, setPixelRatio] = useState(2);
    const [isRendering, setIsRendering] = useState(false);
    const renderingRef = useRef(false);
    const returnFocusRef = useRef<HTMLButtonElement | null>(null);
    const { toast, showToast, dismissToast } = useToast();
    const { exportRef, download } = useImageExport({
        filename: 'ff14-' + (name || 'sheet'), pixelRatio,
        errorCopy: { cors: i18n[language].layout.exportErrorCors, generic: i18n[language].layout.exportErrorGeneric, details: i18n[language].layout.errorDetails },
        onError: message => showToast(message, 'error'),
    });
    const cardSize = useCardDimensions(exportRef);
    const outputSize = getExportDimensions(cardSize.width, cardSize.height, pixelRatio);
    useEffect(() => {
        if (!isRendering && returnFocusRef.current) { returnFocusRef.current.focus({ preventScroll: true }); returnFocusRef.current = null; }
    }, [isRendering]);
    const handleDownload = async (event: MouseEvent<HTMLButtonElement>) => {
        if (renderingRef.current) return;
        returnFocusRef.current = event.currentTarget; renderingRef.current = true; setIsRendering(true);
        try { if (await download()) showToast(t.exported, 'success'); }
        finally { renderingRef.current = false; setIsRendering(false); }
    };
    const form = useMemo(() => <CardForm />, []);
    const preview = useMemo(() => <CardPreview ref={exportRef} onImageChange={updateImage} id="card-preview" />, [exportRef, updateImage]);
    const downloadButton = <Button onClick={handleDownload} disabled={isRendering} aria-busy={isRendering} size="lg" className="studio-download"><Download size={16} aria-hidden="true" />{i18n[language].layout.saveImage}</Button>;
    return <>
        <SeoHead meta={pageMeta[language].home} path="/" />
        <ToastNotification toast={toast} onDismiss={dismissToast} /><StickerUndoNotice /><PersistenceNotice />
        {isRendering && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" role="status" aria-live="polite" aria-atomic="true" aria-label={i18n[language].layout.renderingTitle}>
            <div className="flex w-full max-w-[340px] flex-col items-center gap-4 rounded-2xl border p-6 text-center" style={{ backgroundColor: 'var(--surface-50)', borderColor: 'var(--border-medium)' }}>
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" aria-hidden="true" style={{ borderColor: 'var(--text-primary)', borderTopColor: 'transparent' }} />
                <p className="text-sm font-bold">{i18n[language].layout.renderingTitle}</p>
                <p className="text-xs text-text-secondary">{i18n[language].layout.renderingDesc}</p>
            </div>
        </div>}
        <div inert={isRendering ? true : undefined} aria-hidden={isRendering || undefined}>
            <MainLayout lang={language} layoutType={layout} cardSize={cardSize} onLanguageChange={updateLanguage} form={form} preview={preview} mobileDownload={downloadButton} exportControls={<>
                <div className="studio-quality"><label htmlFor="export-quality">{t.quality}</label><select id="export-quality" value={pixelRatio} onChange={event => setPixelRatio(Number(event.target.value))}>
                    <option value={1}>{t.standard}</option><option value={2}>{t.high}</option><option value={3}>{t.ultra}</option>
                </select></div>
                <div className="studio-export-action"><div className="studio-output-info"><output className="studio-output-size" aria-label={t.outputSize}>{outputSize.width} × {outputSize.height} px</output><span>{outputSize.limited ? t.exportLimited : t.exportHint}</span></div>{downloadButton}</div>
            </>} />
        </div>
    </>;
}
