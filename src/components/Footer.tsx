import { Link } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';
import { i18n } from '../utils/i18n';

export function Footer() {
    const { playerInfo } = usePlayer();
    const lang = playerInfo.language;
    const t = i18n[lang].footer || {
        home: "Home",
        guide: "Guide",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        about: "About",
        faq: "FAQ",
        contact: "Contact"
    };

    return (
        <footer
            className="shrink-0"
            style={{
                borderTop: '1px solid var(--border-default)',
                backgroundColor: 'var(--surface-200)',
            }}
        >
            {/* ── Main row ─────────────────────────────────────────────── */}
            <div className="max-w-screen-xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Brand */}
                <p className="text-[12px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {i18n[lang].layout.headerTitle}
                </p>

                {/* Nav links */}
                <nav className="flex gap-6 text-[12px]">
                    {([
                        { to: '/', label: t.home },
                        { to: '/guide', label: t.guide },
                        { to: '/about', label: t.about },
                        { to: '/faq', label: t.faq },
                        { to: '/contact', label: t.contact },
                        { to: '/privacy', label: t.privacy },
                        { to: '/terms', label: t.terms },
                    ] as const).map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className="transition-colors duration-150"
                            style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                            {label}
                        </Link>
                    ))}
                    <a
                        href="https://ko-fi.com/reconeur"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-150 flex items-center gap-1 font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                        ☕ {lang === 'ko' ? '후원하기' : lang === 'ja' ? 'サポート' : 'Support'}
                    </a>
                </nav>
            </div>

            {/* ── Legal notice ─────────────────────────────────────────── */}
            <div
                className="px-6 py-3 text-center"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
                <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    FINAL FANTASY XIV © 2010–2026 SQUARE ENIX CO., LTD. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
