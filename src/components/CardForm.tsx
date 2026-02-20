import { type ChangeEvent, type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import type { PlayerInfo, Region } from '../types';
import { DATA_CENTERS, WORLDS } from '../data/servers';
import { JOBS } from '../data/jobs';
import { Upload, Swords, Hammer, Sprout as SproutIcon, Crown, Leaf, ChevronDown, Check } from 'lucide-react';
import { i18n, getActiveTimes, PLAYSTYLES_KO, getPlaystyles, getFonts } from '../utils/i18n';

interface CardFormProps {
    playerInfo: PlayerInfo;
    setPlayerInfo: Dispatch<SetStateAction<PlayerInfo>>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest">{title}</h3>
            {children}
        </section>
    );
}

export function CardForm({ playerInfo, setPlayerInfo }: CardFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mainJobRef = useRef<HTMLDivElement>(null);
    const fontRef = useRef<HTMLDivElement>(null);
    const [isMainJobOpen, setIsMainJobOpen] = useState(false);
    const [isFontOpen, setIsFontOpen] = useState(false);

    const lang = playerInfo.language || 'ko';
    const t = i18n[lang].form;
    const activeTimes = getActiveTimes(lang);
    const playstylesOptions = getPlaystyles(lang);
    const playstylesKo = PLAYSTYLES_KO;
    const fontsOptions = getFonts(lang);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (mainJobRef.current && !mainJobRef.current.contains(event.target as Node)) {
                setIsMainJobOpen(false);
            }
            if (fontRef.current && !fontRef.current.contains(event.target as Node)) {
                setIsFontOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const [jobTab, setJobTab] = useState<'Battle' | 'Crafting' | 'Gathering'>('Battle');
    const [isCustomTime, setIsCustomTime] = useState(false);

    const handleChange = <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => {
        setPlayerInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => handleChange('image', reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleBulkSelect = (type: 'all' | 'battle' | 'life' | 'clear', level: number) => {
        if (type === 'clear') {
            setPlayerInfo(prev => ({ ...prev, jobs: [], jobLevels: {}, mainJob: undefined }));
            return;
        }

        const targetJobs = JOBS.filter(job => {
            if (type === 'all') return true;
            if (type === 'battle') return ['Tank', 'Healer', 'Melee', 'Physical Ranged', 'Magical Ranged', 'Limited'].includes(job.role);
            if (type === 'life') return ['Crafting', 'Gathering'].includes(job.role);
            return false;
        }).map(job => job.id);

        setPlayerInfo(prev => {
            const newJobsSet = new Set([...prev.jobs, ...targetJobs]);
            const newJobs = Array.from(newJobsSet);

            const newLevels = { ...prev.jobLevels };
            targetJobs.forEach(jobId => {
                newLevels[jobId] = level;
            });

            return {
                ...prev,
                jobs: newJobs,
                jobLevels: newLevels,
                mainJob: prev.mainJob || targetJobs[0]
            };
        });
    };

    const toggleJob = (jobId: string) => {
        const current = playerInfo.jobs;
        if (current.includes(jobId)) {
            const next = current.filter(id => id !== jobId);
            if (playerInfo.mainJob === jobId) handleChange('mainJob', undefined);
            const newLevels = { ...playerInfo.jobLevels };
            delete newLevels[jobId];
            setPlayerInfo(prev => ({ ...prev, jobs: next, jobLevels: newLevels }));
        } else {
            const next = [...current, jobId];
            if (next.length === 1) handleChange('mainJob', jobId);
            setPlayerInfo(prev => ({ ...prev, jobs: next, jobLevels: { ...prev.jobLevels, [jobId]: 90 } }));
        }
    };

    const handleLevelChange = (jobId: string, level: number) => {
        setPlayerInfo(prev => ({
            ...prev,
            jobLevels: { ...prev.jobLevels, [jobId]: Math.min(100, Math.max(1, level)) }
        }));
    };

    const togglePlaystyle = (tag: string) => {
        const current = playerInfo.playstyles;
        const next = current.includes(tag)
            ? current.filter(t => t !== tag)
            : [...current, tag];
        handleChange('playstyles', next);
    };

    const availableServers = DATA_CENTERS[playerInfo.region].flatMap(dc =>
        WORLDS[dc] ? WORLDS[dc].map(world => ({ dc, world })) : []
    );

    const filteredJobs = JOBS.filter(job => {
        if (jobTab === 'Battle') return ['Tank', 'Healer', 'Melee', 'Physical Ranged', 'Magical Ranged', 'Limited'].includes(job.role);
        if (jobTab === 'Crafting') return job.role === 'Crafting';
        if (jobTab === 'Gathering') return job.role === 'Gathering';
        return false;
    });

    const inputClass = "w-full bg-[#f5f5f7] dark:bg-[#2d2d2f] border border-[#d2d2d7] dark:border-[#424245] px-3 py-2.5 rounded-xl text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all";

    return (
        <div className="space-y-8 text-sm">

            {/* Language Toggle */}
            <div className="flex justify-end -mb-4">
                <div className="flex bg-[#e8e8ed] dark:bg-[#2d2d2f] rounded-lg p-0.5 relative z-10 shadow-sm border border-[#d2d2d7]/50 dark:border-[#424245]/50">
                    <button
                        onClick={() => handleChange('language', 'ko')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'ko' ? 'bg-white dark:bg-[#48484a] text-[#0071e3] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'}`}
                    >
                        KR
                    </button>
                    <button
                        onClick={() => handleChange('language', 'en')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-white dark:bg-[#48484a] text-[#0071e3] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'}`}
                    >
                        EN
                    </button>
                </div>
            </div>

            {/* Identity */}
            <Section title={t.basicInfo}>
                <div className="space-y-2">
                    <input
                        type="text"
                        value={playerInfo.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`${inputClass} font-semibold text-base`}
                        placeholder={t.nickname}
                    />
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#86868b] select-none">
                        <input
                            type="checkbox"
                            checked={playerInfo.isNicknameChanged}
                            onChange={(e) => handleChange('isNicknameChanged', e.target.checked)}
                            className="rounded border-[#d2d2d7] dark:border-[#424245] accent-[#0071e3] w-3.5 h-3.5"
                        />
                        {t.diffIngame}
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex border border-[#d2d2d7] dark:border-[#424245] rounded-xl overflow-hidden bg-[#f5f5f7] dark:bg-[#2d2d2f]">
                        {(['KR', 'Global'] as Region[]).map(r => (
                            <button
                                key={r}
                                onClick={() => handleChange('region', r)}
                                className={`flex-1 py-2 text-sm font-medium transition-all ${playerInfo.region === r ? 'bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f]' : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <select
                        value={playerInfo.server}
                        onChange={(e) => handleChange('server', e.target.value)}
                        className={inputClass}
                    >
                        <option value="">{t.selectServer}</option>
                        {availableServers.map(({ dc, world }) => (
                            <option key={world} value={world}>
                                {playerInfo.region === 'Global' ? `[${dc}] ${world}` : world}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sprout / Mentor */}
                <div className="flex gap-3">
                    <button
                        onClick={() => handleChange('isSprout', !playerInfo.isSprout)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${playerInfo.isSprout ? 'bg-neutral-800 dark:bg-neutral-200 border-neutral-800 dark:border-neutral-200 text-white dark:text-neutral-900 shadow-sm' : 'border-[#d2d2d7] dark:border-[#424245] text-[#86868b] hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
                    >
                        <SproutIcon size={16} className={playerInfo.isSprout ? 'text-green-400 dark:text-green-600' : ''} /> {i18n[lang].preview.sprout}
                    </button>
                    <button
                        onClick={() => handleChange('isMentor', !playerInfo.isMentor)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${playerInfo.isMentor ? 'bg-neutral-800 dark:bg-neutral-200 border-neutral-800 dark:border-neutral-200 text-white dark:text-neutral-900 shadow-sm' : 'border-[#d2d2d7] dark:border-[#424245] text-[#86868b] hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
                    >
                        <Crown size={16} className={playerInfo.isMentor ? 'text-yellow-400 dark:text-yellow-600' : ''} /> {i18n[lang].preview.mentor}
                    </button>
                </div>
            </Section>

            {/* Jobs */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest">{t.job}</h3>
                    {/* Quick Actions (Inline with title) */}
                    <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                        <button onClick={() => handleBulkSelect('battle', 100)} className="px-2 py-1 text-[10px] font-bold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded transition-colors">{t.battleMax}</button>
                        <button onClick={() => handleBulkSelect('life', 100)} className="px-2 py-1 text-[10px] font-bold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded transition-colors">{t.lifeMax}</button>
                        <button onClick={() => handleBulkSelect('all', 100)} className="px-2 py-1 text-[10px] font-bold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded transition-colors">{t.allMax}</button>
                        <button onClick={() => handleBulkSelect('clear', 0)} className="px-2 py-1 text-[10px] font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded transition-colors">{t.reset}</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-[#e8e8ed] dark:bg-[#2d2d2f] rounded-xl p-1">
                    {[
                        { key: 'Battle' as const, label: t.battle, icon: Swords },
                        { key: 'Crafting' as const, label: t.crafting, icon: Hammer },
                        { key: 'Gathering' as const, label: t.gathering, icon: Leaf },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setJobTab(tab.key)}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${jobTab === tab.key ? 'bg-white dark:bg-[#48484a] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'}`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Job Selector (Dropdown) */}
                {playerInfo.jobs.length > 0 && (
                    <div className="bg-[#f5f5f7] dark:bg-[#2d2d2f] p-3 rounded-xl space-y-2 relative" ref={mainJobRef}>
                        <span className="text-xs font-semibold text-[#86868b]">{t.mainJobSelect}</span>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsMainJobOpen(!isMainJobOpen)}
                                className={`${inputClass} flex items-center justify-between cursor-pointer`}
                            >
                                <div className="flex items-center gap-2">
                                    {playerInfo.mainJob ? (() => {
                                        const job = JOBS.find(j => j.id === playerInfo.mainJob);
                                        if (!job) return <span className="text-[#86868b]">{t.pleaseSelect}</span>;
                                        return (
                                            <>
                                                <img src={job.iconUrl} alt={lang === 'ko' ? job.nameKr : job.nameEn} className="w-5 h-5 dark-invert" />
                                                <span className="font-semibold text-neutral-900 dark:text-white">{lang === 'ko' ? job.nameKr : job.nameEn}</span>
                                            </>
                                        );
                                    })() : (
                                        <span className="text-[#86868b]">{t.pleaseSelect}</span>
                                    )}
                                </div>
                                <ChevronDown size={16} className={`text-[#86868b] transition-transform ${isMainJobOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isMainJobOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-xl border border-[#d2d2d7] dark:border-[#424245] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto p-1.5 space-y-0.5">
                                    {playerInfo.jobs.map(jobId => {
                                        const job = JOBS.find(j => j.id === jobId);
                                        if (!job) return null;
                                        const isSelected = playerInfo.mainJob === jobId;
                                        return (
                                            <button
                                                key={jobId}
                                                type="button"
                                                onClick={() => {
                                                    handleChange('mainJob', jobId);
                                                    setIsMainJobOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isSelected
                                                    ? 'bg-[#f5f5f7] dark:bg-[#3a3a3c]'
                                                    : 'hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2f]'
                                                    }`}
                                            >
                                                <img src={job.iconUrl} alt={lang === 'ko' ? job.nameKr : job.nameEn} className="w-5 h-5 dark-invert" />
                                                <span className={`text-sm flex-1 text-left ${isSelected
                                                    ? 'font-bold text-[#1d1d1f] dark:text-[#f5f5f7]'
                                                    : 'font-medium text-[#1d1d1f] dark:text-[#f5f5f7]'
                                                    }`}>
                                                    {lang === 'ko' ? job.nameKr : job.nameEn}
                                                </span>
                                                {isSelected && <Check size={14} className="text-neutral-800 dark:text-neutral-200" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Job Grid with Inline Level Inputs */}
                <div className="grid grid-cols-4 gap-2">
                    {filteredJobs.map(job => {
                        const isSelected = playerInfo.jobs.includes(job.id);
                        const isMain = playerInfo.mainJob === job.id;
                        return (
                            <div
                                key={job.id}
                                className={`flex flex-col items-center p-2 rounded-xl border transition-all ${isSelected ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 shadow-sm' : 'border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/50'} ${isMain ? 'ring-2 ring-neutral-800 dark:ring-neutral-300 ring-offset-1 dark:ring-offset-neutral-900' : ''}`}
                            >
                                <button type="button" onClick={() => toggleJob(job.id)} className="flex flex-col items-center w-full focus:outline-none">
                                    <img src={job.iconUrl} alt={lang === 'ko' ? job.nameKr : job.nameEn} className={`w-8 h-8 dark-invert ${isSelected ? 'opacity-100' : 'opacity-25 grayscale'}`} />
                                    <span className={`text-[10px] sm:text-[11px] mt-1 font-semibold ${isSelected ? 'text-neutral-900 dark:text-neutral-100' : 'text-[#86868b]'} text-center leading-tight truncate w-full`}>{lang === 'ko' ? job.nameKr : job.nameEn}</span>
                                </button>
                                {isSelected && (
                                    <div className="mt-2 w-full pt-2 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-center gap-1">
                                        <span className="text-[10px] font-bold text-[#86868b]">Lv.</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={playerInfo.jobLevels[job.id] || 90}
                                            onChange={e => handleLevelChange(job.id, parseInt(e.target.value) || 1)}
                                            className="w-10 text-center text-xs font-bold bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#424245] rounded block py-0.5 text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-500"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Playstyle */}
            <Section title={t.playstyle}>
                <div className="flex flex-wrap gap-1.5">
                    {playstylesKo.map((tagKo, idx) => {
                        const displayTag = playstylesOptions[idx];
                        return (
                            <button
                                key={tagKo}
                                onClick={() => togglePlaystyle(tagKo)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${playerInfo.playstyles.includes(tagKo) ? 'bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 border-transparent shadow-sm' : 'bg-white dark:bg-[#3a3a3c] border-[#d2d2d7] dark:border-[#48484a] text-[#6e6e73] dark:text-[#a1a1a6] hover:border-[#86868b]'}`}
                            >
                                {displayTag}
                            </button>
                        );
                    })}
                </div>
            </Section>

            {/* Details */}
            <Section title={t.details}>
                {/* Active Time */}
                {!isCustomTime ? (
                    <select
                        value={activeTimes.includes(playerInfo.activeTime) ? playerInfo.activeTime : ''}
                        onChange={(e) => {
                            if (e.target.value === '직접 입력' || e.target.value === 'Custom') {
                                setIsCustomTime(true);
                                handleChange('activeTime', '');
                            } else {
                                handleChange('activeTime', e.target.value);
                            }
                        }}
                        className={inputClass}
                    >
                        <option value="" disabled>{t.selectTime}</option>
                        {activeTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={playerInfo.activeTime}
                            onChange={(e) => handleChange('activeTime', e.target.value)}
                            className={`${inputClass} flex-1`}
                            placeholder={t.customTime}
                        />
                        <button onClick={() => setIsCustomTime(false)} className="px-3 py-2 bg-[#e8e8ed] dark:bg-[#3a3a3c] rounded-xl text-xs font-medium text-[#86868b]">
                            {t.list}
                        </button>
                    </div>
                )}

                <textarea
                    value={playerInfo.comment}
                    onChange={(e) => handleChange('comment', e.target.value)}
                    className={`${inputClass} h-20 resize-none`}
                    placeholder={t.commentPlaceholder}
                    maxLength={200}
                />

                {/* Image Upload */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-[#e8e8ed] dark:bg-[#3a3a3c] hover:bg-[#d2d2d7] dark:hover:bg-[#48484a] rounded-xl text-sm font-medium flex items-center gap-2 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                    >
                        <Upload size={16} /> {t.uploadImage}
                    </button>
                    {playerInfo.image && (
                        <button onClick={() => handleChange('image', undefined)} className="text-xs text-[#ff3b30] font-medium">{t.delete}</button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
            </Section>

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
