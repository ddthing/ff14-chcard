import { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { CardForm } from '../components/CardForm';
import { CardPreview } from '../components/CardPreview';
import { Download } from 'lucide-react';
import { i18n } from '../utils/i18n';
import { usePlayer } from '../contexts/PlayerContext';
import { useImageExport } from '../hooks/useImageExport';
import { useToast } from '../hooks/useToast';
import { ToastNotification } from '../components/common/ToastNotification';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button';
import { pageMeta } from '../utils/pageMeta';

export function Home() {
  const { playerInfo, updateImage, updateLanguage } = usePlayer();
  const meta = pageMeta[playerInfo.language].home;

  // ─── Image export — two-pass, cross-browser stable ─────────────────────────
  const [pixelRatio, setPixelRatio] = useState(() => (
    typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 2
  ));

  // Set pixelRatio dynamically based on window width to prevent OOM on mobile
  useEffect(() => {
    const updateRatio = () => {
      const nextRatio = window.innerWidth < 768 ? 1.5 : 2;
      setPixelRatio(previousRatio => previousRatio === nextRatio ? previousRatio : nextRatio);
    };
    updateRatio();
    window.addEventListener('resize', updateRatio);
    return () => window.removeEventListener('resize', updateRatio);
  }, []);

  // ─── Toast Notifications ───────────────────────────────────────────────────
  const { toast, showToast, dismissToast } = useToast();

  const { exportRef, download } = useImageExport({
    filename: `ff14-${playerInfo.name || 'sheet'}`,
    pixelRatio,
    errorCopy: {
      cors: i18n[playerInfo.language].layout.exportErrorCors,
      generic: i18n[playerInfo.language].layout.exportErrorGeneric,
      details: i18n[playerInfo.language].layout.errorDetails,
    },
    onError: (msg) => showToast(msg, 'error'),
  });

  const [isRendering, setIsRendering] = useState(false);

  const handleDownload = async () => {
    setIsRendering(true);
    try {
      await download();
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href="https://ff14-chcard.pages.dev/" />
      </Helmet>

      <ToastNotification toast={toast} onDismiss={dismissToast} />

      {/* Rendering Modal */}
      {isRendering && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200" role="status" aria-live="polite" aria-atomic="true" aria-busy="true" aria-label={i18n[playerInfo.language].layout.renderingTitle}>
              <div
                  className="w-full max-w-[340px] rounded-2xl flex flex-col overflow-hidden animate-in zoom-in-[0.98] duration-300"
                  style={{
                      backgroundColor: 'var(--surface-50)',
                      border: '1px solid var(--border-medium)',
                  }}
              >
                  <div className="p-6 flex flex-col items-center justify-center text-center gap-4">
                      {/* Spinner */}
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" aria-hidden="true" style={{ borderColor: 'var(--text-primary)', borderTopColor: 'transparent' }}></div>
                      
                      <div className="space-y-1">
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{i18n[playerInfo.language].layout.renderingTitle}</p>
                          <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{i18n[playerInfo.language].layout.renderingDesc}</p>
                      </div>
                      
                  </div>
              </div>
          </div>
      )}

      <MainLayout
        lang={playerInfo.language}
        layoutType={playerInfo.layout || 'header'}
        onLanguageChange={updateLanguage}
        form={
          <div className="flex flex-col h-full relative overflow-hidden" style={{ backgroundColor: 'transparent' }}>
            {/* Form scrollable area */}
            <div className="flex-1 flex flex-col overflow-hidden pb-[130px] md:pb-0">
              <CardForm />
            </div>

            {/* Save Button Bar — pinned to bottom */}
            <div
              className="sticky bottom-0 left-0 right-0 shrink-0 p-4 z-[60] transition-colors duration-200"
              style={{
                 backgroundColor: 'var(--surface-50)',
                 borderTop: '1px solid var(--border-subtle)',
               }}
             >
               <Button
                onClick={handleDownload}
                size="lg"
                className="w-full active:scale-[0.98]"
              >
                <Download size={15} aria-hidden="true" />
                {i18n[playerInfo.language].layout.saveImage}
              </Button>
            </div>
          </div>
        }
        preview={
          <CardPreview
            ref={exportRef}
            onImageChange={updateImage}
            id="card-preview"
          />
        }
      />
    </>
  );
}
