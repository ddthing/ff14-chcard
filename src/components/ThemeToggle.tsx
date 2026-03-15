import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
            if (saved) return saved;
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
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors flex items-center justify-center"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
}
