import { useState, useRef, useCallback, useEffect } from 'react';
import { MainLayout } from './components/MainLayout';
import { CardForm } from './components/CardForm';
import { CardPreview } from './components/CardPreview';
import type { PlayerInfo } from './types';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

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

  const handleImagePositionChange = useCallback((position: { x: number; y: number; scale: number }) => {
    setPlayerInfo(prev => ({ ...prev, imagePosition: position }));
  }, []);

  const handleDownload = useCallback(() => {
    if (previewRef.current === null) return;



    toPng(previewRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      // Remove backgroundColor to preserve transparency (rounded corners) and avoid masking issues
      // Override shadow to prevent rendering artifacts/memory issues on mobile
      style: {
        boxShadow: 'none',
      },
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `ff14-${playerInfo.name || 'sheet'}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to generate image', err);
        alert('이미지 생성에 실패했습니다.');
      });
  }, [playerInfo.name]);

  return (
    <MainLayout
      form={
        <div className="flex flex-col gap-6 h-full">
          <CardForm playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} />

          <div className="sticky bottom-0 bg-white/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl border-t border-neutral-200 dark:border-[#3a3a3c] p-4 -mx-6 -mb-6 mt-auto z-20">
            <button
              onClick={handleDownload}
              className="w-full bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-black font-semibold text-sm py-3.5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} />
              이미지 저장
            </button>
          </div>
        </div>
      }
      preview={
        <CardPreview
          ref={previewRef}
          playerInfo={playerInfo}
          onImagePositionChange={handleImagePositionChange}
          id="card-preview"
        />
      }
    />
  );
}

export default App;
