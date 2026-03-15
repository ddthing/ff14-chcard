import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import type { PlayerInfo } from '../types';
import { ChevronDown, Check } from 'lucide-react';
import { i18n, getFonts } from '../utils/i18n';

// Extracted Sub-Components
import { Section } from './form/Section';
import { BasicInfoSection } from './form/BasicInfoSection';
import { JobSelectionSection } from './form/JobSelectionSection';
import { PlaystyleSection } from './form/PlaystyleSection';
import { DetailsSection } from './form/DetailsSection';

interface CardFormProps {
    playerInfo: PlayerInfo;
    setPlayerInfo: Dispatch<SetStateAction<PlayerInfo>>;
}

export function CardForm({ playerInfo, setPlayerInfo }: CardFormProps) {
    const fontRef = useRef<HTMLDivElement>(null);
    const [isFontOpen, setIsFontOpen] = useState(false);

    const lang = playerInfo.language || 'ko';
    const t = i18n[lang].form;
    const fontsOptions = getFonts(lang);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (fontRef.current && !fontRef.current.contains(event.target as Node)) {
                setIsFontOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => {
        setPlayerInfo(prev => ({ ...prev, [field]: value }));
    };

    const inputClass = "w-full bg-[#f5f5f7] dark:bg-[#2d2d2f] border border-[#d2d2d7] dark:border-[#424245] px-3 py-2.5 rounded-xl text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all";

    return (
        <div className="space-y-8 text-sm">

            {/* Layout Toggle Group */}
            <Section title={t.layout}>
                <div className="flex bg-[#e8e8ed] dark:bg-[#2d2d2f] rounded-xl p-1 shadow-inner border border-[#d2d2d7]/50 dark:border-[#424245]/50 overflow-hidden">
                    {(['header', 'left-portrait'] as const).map(layout => (
                        <button
                            key={layout}
                            type="button"
                            onClick={() => handleChange('layout', layout)}
                            className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${playerInfo.layout === layout ? 'bg-white dark:bg-[#48484a] text-[#1d1d1f] dark:text-white shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'}`}
                        >
                            {layout === 'header' ? t.layoutHeader : t.layoutPortrait}
                        </button>
                    ))}
                </div>
            </Section>

            <BasicInfoSection playerInfo={playerInfo} handleChange={handleChange} lang={lang} />
            <JobSelectionSection playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} handleChange={handleChange} lang={lang} />
            <PlaystyleSection playerInfo={playerInfo} handleChange={handleChange} lang={lang} />
            <DetailsSection playerInfo={playerInfo} handleChange={handleChange} lang={lang} />

            {/* Font */}
            <Section title={t.font}>
                <div className="relative" ref={fontRef}>
                    <button
                        type="button"
                        onClick={() => setIsFontOpen(!isFontOpen)}
                        className={`${inputClass} flex items-center justify-between cursor-pointer`}
                    >
                        <div className="flex items-center gap-2">
                            {(() => {
                                const selectedFont = fontsOptions.find(f => f.id === playerInfo.font);
                                return <span className={`text-[15px] font-medium ${selectedFont?.id || ''}`}>{selectedFont ? selectedFont.name : t.pleaseSelect}</span>;
                            })()}
                        </div>
                        <ChevronDown size={16} className={`text-[#86868b] transition-transform ${isFontOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu (Pops Upward since it's at the end of the form) */}
                    {isFontOpen && (
                        <div className="absolute bottom-full mb-2 left-0 right-0 bg-white/95 dark:bg-[#1d1d1f]/95 backdrop-blur-xl border border-[#d2d2d7] dark:border-[#424245] rounded-xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] z-50 max-h-64 overflow-y-auto p-1.5 space-y-0.5">
                            {fontsOptions.map(font => {
                                const isSelected = playerInfo.font === font.id;
                                return (
                                    <button
                                        key={font.id}
                                        type="button"
                                        onClick={() => {
                                            handleChange('font', font.id);
                                            setIsFontOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${font.id} ${isSelected
                                            ? 'bg-neutral-100 dark:bg-[#3a3a3c] text-neutral-900 dark:text-white font-bold'
                                            : 'hover:bg-neutral-50 dark:hover:bg-[#2d2d2f] text-neutral-700 dark:text-neutral-300 font-medium'
                                            }`}
                                    >
                                        <span className={`text-[15px] tracking-wide`}>
                                            {font.name}
                                        </span>
                                        {isSelected && <Check size={16} className="text-neutral-800 dark:text-neutral-200" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
