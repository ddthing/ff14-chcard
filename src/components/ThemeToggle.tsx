import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import type { Language } from '../types';

export function ThemeToggle({ lang }: { lang: Language }) {
    const labels = {
        ko: { light: '라이트 모드로 변경', dark: '다크 모드로 변경' },
        en: { light: 'Switch to light mode', dark: 'Switch to dark mode' },
        ja: { light: 'ライトモードに変更', dark: 'ダークモードに変更' },
    }[lang];
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
                if (saved) return saved;
            } catch {
                // Use the default theme when storage is unavailable.
            }
            // Optional: Check system preference
            // if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        }
        return 'light'; // Default
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.content = theme === 'dark' ? '#252525' : '#ffffff';
        }
        try {
            localStorage.setItem('theme', theme);
        } catch {
            // Theme still applies for the current session.
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'light' ? labels.dark : labels.light}
            className="flex size-9 items-center justify-center rounded-full transition-[color,background-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            aria-label={theme === 'light' ? labels.dark : labels.light}
            aria-pressed={theme === 'dark'}
        >
            {theme === 'light' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
        </button>
    );
}
