import { Link } from 'react-router-dom';
import { usePlayerSelector } from '../contexts/PlayerContext';
import { i18n } from '../utils/i18n';

export function Footer() {
    const lang = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const t = i18n[lang].footer;

    return (
        <footer
            className="shrink-0"
            style={{
                borderTop: '1px solid var(--border-default)',
                backgroundColor: 'var(--surface-200)',
            }}
        >
            <div className="mx-auto flex w-full max-w-[1300px] flex-col items-start justify-between gap-5 px-4 py-6 md:flex-row md:items-center md:px-6">
                <Link
                    to="/"
                    className="text-[11px] font-semibold tracking-[-0.01em] text-[var(--text-secondary)] transition-[color,opacity] duration-150 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-200)]"
                >
                    {t.projectNotice}
                </Link>

                <nav aria-label={lang === 'ko' ? '사이트 안내' : lang === 'ja' ? 'サイト案内' : 'Site navigation'}>
                    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-[var(--text-secondary)] md:justify-end">
                        {[
                            { to: '/guide', label: t.guide },
                            { to: '/faq', label: t.faq },
                            { to: '/about', label: t.about },
                            { to: '/terms', label: t.terms },
                            { to: '/privacy', label: t.privacy },
                        ].map(({ to, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className="transition-[color,opacity] duration-150 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <a
                                href="https://ko-fi.com/reconeur"
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className="font-semibold transition-[color,opacity] duration-150 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                            >
                                {t.support}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
}
