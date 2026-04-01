import { useRef, useCallback, useState } from 'react';
import { MainLayout } from './components/MainLayout';
import { CardForm } from './components/CardForm';
import { CardPreview } from './components/CardPreview';
import { ChangelogModal } from './components/ChangelogModal';
import { ChangelogBadge } from './components/ChangelogBadge';
import { UpdateToast } from './components/common/UpdateToast';
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

  const handleDownload = useCallback(async () => {
    if (previewRef.current === null) return;

    // 브라우저 호환성(특히 Firefox/Safari)을 위한 렌더링 최적화 대기
    try {
      if (document.fonts) {
        await document.fonts.ready; // 등록된 모든 웹폰트 로딩 대기
      }
      // DOM 렌더 트리 업데이트 및 backdrop-filter 반사 시간 확보 (안정성 증가)
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (e) {
      console.warn('Font loading wait failed', e);
    }

    // Reset transform for accurate capture
    const originalTransform = previewRef.current.style.transform;
    previewRef.current.style.transform = 'none';

    // toPng is generally more stable for font embedding
    toPng(previewRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      // 1. 광고 및 불필요한 레이어를 캡처에서 제외 (파이어폭스/사파리 부하 감소 및 에러 방지)
      filter: (node) => {
        const classList = (node as HTMLElement).classList;
        if (classList) {
          return !classList.contains('adsense-container') && 
                 !classList.contains('changelog-badge') &&
                 !classList.contains('export-ignore');
        }
        return true;
      },
      // 2. 폰트 로드 대기 시간 확보 및 명시적 스타일 지정
      fontEmbedCSS: undefined, // 기존 CSS 자동 추출 사용
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
        const errorMessage = err instanceof Error ? err.message : String(err);
        
        let detailedMessage = i18n[playerInfo.language].layout.saveError;
        if (errorMessage.includes('cssRules') || errorMessage.includes('trim')) {
          detailedMessage += `\n\n[Browser Compatibility Alert]\n${playerInfo.language === 'ko' ? '브라우저 호환성 문제로 실패했습니다. 크롬 브라우저 이용을 권장하며, 오류가 지속되면 광고 차단 앱을 잠시 꺼보세요.' : 'Failed due to browser compatibility. We recommend Chrome, or try disabling ad-blockers.'}\n\nDetails: ${errorMessage}`;
        } else {
          detailedMessage += `\n\nDetails: ${errorMessage}`;
        }
        alert(detailedMessage);
      });
  }, [playerInfo.name, playerInfo.language, playerInfo.pointColor]);

  return (
    <>
      <UpdateToast lang={playerInfo.language} />
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
          <div className="flex flex-col h-full relative overflow-hidden bg-white dark:bg-[#1d1d1f]">
            {/* Form Scrollable Area */}
            <div className="flex-1 overflow-hidden">
              <CardForm />
            </div>

            {/*
             * Save Button Bar
             *
             * Pinned to the bottom of the sidebar area. Using sticky on mobile
             * ensures it stays at the bottom of the viewport while the user
             * is interacting with the form tabs.
             */}
            <div className="sticky bottom-0 md:relative shrink-0 bg-white/95 dark:bg-[#1d1d1f]/95 backdrop-blur-xl border-t border-[#d2d2d7]/60 dark:border-[#424245]/60 p-4 z-40 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.3)]">
              <button
                onClick={handleDownload}
                className="w-full bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-black font-extrabold text-sm py-4 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl md:shadow-none"
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
