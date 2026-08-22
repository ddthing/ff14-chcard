import { Route, Routes, StaticRouter } from 'react-router-dom';
import { PlayerProvider } from './contexts/PlayerContext';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Faq } from './pages/Faq';
import { Guide } from './pages/Guide';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

interface StaticAppProps {
    url: string;
}

/**
 * Server-rendered routes are intentionally limited to public information pages.
 * The editor home remains client-rendered because its primary state is local.
 */
export function StaticApp({ url }: StaticAppProps) {
    return (
        <PlayerProvider>
            <StaticRouter location={url}>
                <Routes>
                    <Route path="/guide" element={<Guide />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                </Routes>
            </StaticRouter>
        </PlayerProvider>
    );
}
