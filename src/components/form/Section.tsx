import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Section
 *
 * A composable container that enforces consistent vertical rhythm and label
 * typography for every form section across all four sidebar tabs.
 * Now features an accordion toggle to reduce scroll fatigue on mobile.
 */
export function Section({ title, children, defaultOpen = true }: { title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <section className="space-y-2.5 bg-transparent">
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group outline-none cursor-pointer"
            >
                <h3
                    className="text-[10px] font-bold uppercase tracking-[0.1em] group-hover:text-neutral-500 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                >
                    {title}
                </h3>
                <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-200 group-hover:text-neutral-500 ${isOpen ? 'rotate-180' : ''}`} 
                    style={{ color: 'var(--text-muted)' }}
                />
            </button>
            
            {isOpen && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </section>
    );
}
