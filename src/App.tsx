import { useRef, useCallback, useState } from 'react';
import { MainLayout } from './components/MainLayout';
import { CardForm } from './components/CardForm';
import { CardPreview } from './components/CardPreview';
import { ChangelogModal } from './components/ChangelogModal';
import { ChangelogBadge } from './components/ChangelogBadge';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { i18n } from './utils/i18n';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext';

function AppContent() {
  const { playerInfo, updateImage, updateLanguage } = usePlayer();
  const previewRef = useRef<HTMLDivElement>(null);

  // ─── Changelog modal state ─────────────────────────────────────────────────
  // Tracks whether the modal was explicitly opened via the floating badge.
  // The modal manages its own auto-open logic internally via localStorage.
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  const handleDownload = useCallback(() => {
    if (previewRef.current === null) return;

    // Reset transform for accurate capture
    const originalTransform = previewRef.current.style.transform;
    previewRef.current.style.transform = 'none';

    // toPng is generally more stable for font embedding
    toPng(previewRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      style: {
        boxShadow: 'none',
        transform: 'none',
      },
    })
      .then((dataUrl: string) => {
        if (previewRef.current) previewRef.current.style.transform = originalTransform;
        if (!dataUrl) throw new Error('Image generation failed');

        const link = document.createElement('a');
        link.download = `ff14-${playerInfo.name || 'sheet'}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err: unknown) => {
        if (previewRef.current) previewRef.current.style.transform = originalTransform;
        console.error('Failed to generate image:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        
        let detailedMessage = i18n[playerInfo.language].layout.saveError;
        if (errorMessage.includes('cssRules')) {
          detailedMessage += '\n\nCORS Error: External fonts (Google Fonts) blocked. Please try again or check your internet connection.';
        } else {
          detailedMessage += `\n\nDetails: ${errorMessage}`;
        }
        alert(detailedMessage);
      });
  }, [playerInfo.name, playerInfo.language, playerInfo.pointColor]);

  return (
    <>
      {/* Changelog modal — receives external trigger from the floating badge */}
      <ChangelogModal
        lang={playerInfo.language}
        forceOpen={isChangelogOpen}
        onForceClose={() => setIsChangelogOpen(false)}
      />
      <MainLayout
        lang={playerInfo.language}
        layoutType={playerInfo.layout || 'header'}
        onLanguageChange={updateLanguage}
        changelogBadge={
          <ChangelogBadge
            lang={playerInfo.language}
            onClick={() => setIsChangelogOpen(true)}
          />
        }
        form={
          <div className="flex flex-col h-full relative">
            <div className="flex-1 min-h-0">
              <CardForm />
            </div>
            {/*
             * Save Button Bar
             *
             * Fixed to the viewport bottom on mobile; absolute within the sidebar on desktop.
             * Opacity is set to 95% (not 100%) to preserve the blur effect while preventing
             * the hatched ad-placeholder behind it from bleeding through on short content.
             */}
            <div className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-0 md:w-full bg-white/95 dark:bg-[#1d1d1f]/95 backdrop-blur-xl border-t border-[#d2d2d7]/60 dark:border-[#424245]/60 p-4 shrink-0 z-40">
              <button
                onClick={handleDownload}
                className="w-full bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-black font-semibold text-sm py-3.5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-2xl lg:shadow-none"
              >
                <Download size={18} />
                {i18n[playerInfo.language].layout.saveImage}
              </button>
            </div>
          </div>
        }
        preview={
          <CardPreview
            ref={previewRef}
            onImageChange={updateImage}
            id="card-preview"
          />
        }
      />
    </>
  );
}

function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}

export default App;
