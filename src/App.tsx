import { useState, useRef, useCallback, useEffect } from 'react';
import { MainLayout } from './components/MainLayout';
import { CardForm } from './components/CardForm';
import { CardPreview } from './components/CardPreview';
import { ChangelogModal } from './components/ChangelogModal';
import type { PlayerInfo, Language } from './types';
import { toBlob } from 'html-to-image';
import { Download } from 'lucide-react';
import { i18n } from './utils/i18n';

/**
 * FF14 Character Card Application
 * 
 * The main entry point for the application. Manages character state, 
 * handles local persistence, and coordinates image generation/download.
 */
const STORAGE_KEY = 'ff14-playerInfo';

const defaultPlayerInfo: PlayerInfo = {
  name: '',
  region: 'KR',
  dataCenter: 'Korea',
  server: '',
  jobs: [],
  playstyles: [],
  activeTime: '',
  comment: '',
  font: 'font-pretendard',
  mainJob: undefined,
  isNicknameChanged: false,
  isSprout: false,
  isMentor: false,
  jobLevels: {},
  imagePosition: { x: 0, y: 0, scale: 1 },
  layout: 'header',
  language: 'ko',
  pointColor: '#e44c21',
};

function loadPlayerInfo(): PlayerInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPlayerInfo;
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle missing fields from older saves
    return { ...defaultPlayerInfo, ...parsed };
  } catch {
    return defaultPlayerInfo;
  }
}

function App() {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>(loadPlayerInfo);

  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-save to localStorage (debounced by React batching)
  useEffect(() => {
    try {
      // Save without image to avoid localStorage quota issues
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image: _image, ...rest } = playerInfo;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch {
      // Silently fail if quota exceeded
    }
  }, [playerInfo]);

  const handleImageChange = useCallback((image: string | undefined) => {
    setPlayerInfo(prev => ({ ...prev, image }));
  }, []);

  const handleLanguageChange = useCallback((language: Language) => {
    setPlayerInfo(prev => ({ ...prev, language }));
  }, []);

  const handleDownload = useCallback(() => {
    if (previewRef.current === null) return;

    const originalTransform = previewRef.current.style.transform;
    previewRef.current.style.transform = 'none';

    toBlob(previewRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      style: {
        boxShadow: 'none',
        transform: 'none',
      },
    })
      .then((blob) => {
        if (previewRef.current) previewRef.current.style.transform = originalTransform;
        if (!blob) throw new Error('Blob generation failed');

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `ff14-${playerInfo.name || 'sheet'}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup after a short delay
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);
      })
      .catch((err) => {
        if (previewRef.current) previewRef.current.style.transform = originalTransform;
        console.error('Failed to generate image:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        alert(`${i18n[playerInfo.language].layout.saveError}\n\nDetails: ${errorMessage}`);
      });
  }, [playerInfo.name, playerInfo.language]);

  return (
    <>
      <MainLayout
        lang={playerInfo.language}
        layoutType={playerInfo.layout || 'header'}
        onLanguageChange={handleLanguageChange}
        form={
          <div className="flex flex-col h-full relative">
            <div className="flex-1 p-6 pb-24">
              <CardForm playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} />
            </div>

            {/* 
              Sticky Action Bar: Pinned to the bottom for quick access. 
              On mobile, it uses fixed positioning to stay at the viewport edge.
            */}
            <div className="fixed bottom-0 left-0 right-0 lg:sticky lg:bottom-0 bg-white/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl border-t border-neutral-200 dark:border-[#3a3a3c] p-4 mt-auto z-40">
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
            playerInfo={playerInfo}
            onImageChange={handleImageChange}
            id="card-preview"
          />
        }
      />
      <ChangelogModal lang={playerInfo.language} />
    </>
  );
}

export default App;
