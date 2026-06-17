import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { CardForm } from '../components/CardForm';
import { CardPreview } from '../components/CardPreview';
import { ChangelogModal } from '../components/ChangelogModal';
import { ChangelogBadge } from '../components/ChangelogBadge';
import { UpdateToast } from '../components/common/UpdateToast';
import { Download } from 'lucide-react';
import { APP_VERSION } from '../constants/changelog';
import { i18n } from '../utils/i18n';
import { usePlayer } from '../contexts/PlayerContext';
import { useImageExport } from '../hooks/useImageExport';
import { useToast } from '../hooks/useToast';
import { ToastNotification } from '../components/common/ToastNotification';
import { AdBanner } from '../components/AdBanner';
import { SEOContent } from '../components/SEOContent';
import { Helmet } from 'react-helmet-async';

export function Home() {
  const { playerInfo, updateImage, updateLanguage } = usePlayer();

  // ─── Changelog modal ───────────────────────────────────────────────────────
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  // ─── Image export — two-pass, cross-browser stable ─────────────────────────
  const [pixelRatio, setPixelRatio] = useState(2);

  // Set pixelRatio dynamically based on window width to prevent OOM on mobile
  useEffect(() => {
    const updateRatio = () => {
      setPixelRatio(window.innerWidth < 768 ? 1.5 : 2);
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
        <title>FF14 캐릭터 카드 생성기 - 파판14 캐릭터 시트 만들기</title>
        <meta name="description" content="파이널 판타지 14(FF14) 캐릭터 카드를 쉽고 예쁘게 만들어 보세요. 직업, 서버, 주 활동 시간 등을 커스터마이징하고 고화질 PNG로 저장할 수 있습니다. 무료 온라인 캐릭터 시트 제작 도구." />
        <link rel="canonical" href="https://ff14-chcard.pages.dev/" />
      </Helmet>

      <ToastNotification toast={toast} onDismiss={dismissToast} />

      {/* Rendering Modal with AdSense Placeholder */}
      {isRendering && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
              <div
                  className="w-full max-w-[340px] rounded-2xl flex flex-col overflow-hidden animate-in zoom-in-[0.98] duration-300"
                  style={{
                      backgroundColor: 'var(--surface-50)',
                      border: '1px solid var(--border-medium)',
                  }}
              >
                  <div className="p-6 flex flex-col items-center justify-center text-center gap-4">
                      {/* Spinner */}
                      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--text-primary)', borderTopColor: 'transparent' }}></div>
                      
                      <div className="space-y-1">
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{i18n[playerInfo.language].layout.renderingTitle}</p>
                          <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{i18n[playerInfo.language].layout.renderingDesc}</p>
                      </div>
                      
                      {/* AdSense Native Ad Area */}
                      <div className="w-full h-[140px] rounded-xl mt-2 flex items-center justify-center" style={{ backgroundColor: 'var(--surface-200)', border: '1px dashed var(--border-default)' }}>
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Google AdSense Area</span>
                      </div>
                  </div>
              </div>
          </div>
      )}


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
                borderTop: '1px solid var(--border-medium)',
              }}
            >
              <UpdateToast lang={playerInfo.language} />
              <button
                onClick={handleDownload}
                className="w-full text-[13px] font-semibold py-3 rounded-[10px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--surface-200)',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <Download size={15} />
                {i18n[playerInfo.language].layout.saveImage}
              </button>

              {/* Sidebar Footer Links */}
              <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="flex justify-center items-center gap-4 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    <Link to="/privacy" className="transition-colors hover:opacity-70">{i18n[playerInfo.language].footer.privacy}</Link>
                    <Link to="/terms" className="transition-colors hover:opacity-70">{i18n[playerInfo.language].footer.terms}</Link>
                    <a href="https://ko-fi.com/reconeur" target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-70 flex items-center gap-1">
                        ☕ {playerInfo.language === 'ko' ? '후원하기' : playerInfo.language === 'ja' ? 'サポート' : 'Support'}
                    </a>
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>{APP_VERSION}</span>
              </div>
            </div>
          </div>
        }
        previewAd={
          <div className="hidden md:block">
            <AdBanner variant="wide" />
          </div>
        }
        preview={
          <CardPreview
            ref={exportRef}
            onImageChange={updateImage}
            id="card-preview"
          />
        }
        bottomContent={<SEOContent />}
      />
    </>
  );
}
