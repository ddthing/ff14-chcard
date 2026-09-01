import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { PlayerProvider, usePlayerSelector } from './contexts/PlayerContext';
import { i18n } from './utils/i18n';

const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Privacy = lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));
const Guide = lazy(() => import('./pages/Guide').then(module => ({ default: module.Guide })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Faq = lazy(() => import('./pages/Faq').then(module => ({ default: module.Faq })));

function DocumentLanguage() {
  const language = usePlayerSelector(snapshot => snapshot.playerInfo.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}

function LoadingFallback() {
  const language = usePlayerSelector(snapshot => snapshot.playerInfo.language);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-200)' }} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" aria-hidden="true" style={{ borderColor: 'var(--text-primary)', borderTopColor: 'transparent' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{i18n[language].layout.loading}</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <PlayerProvider>
        <BrowserRouter>
          <DocumentLanguage />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<Faq />} />
              {/* 정의되지 않은 경로는 홈으로 리다이렉트 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </PlayerProvider>
    </HelmetProvider>
  );
}

export default App;
