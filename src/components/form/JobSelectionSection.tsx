import { useState, useRef, useEffect } from 'react';
import { Swords, Hammer, Leaf, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { JOBS } from '../../data/jobs';
import { i18n } from '../../utils/i18n';
import { inputClass } from '../../utils/styles';
import { usePlayer } from '../../contexts/PlayerContext';

export function JobSelectionSection() {
    const { playerInfo, setPlayerInfo, updatePlayerField: handleChange } = usePlayer();
    const lang = playerInfo.language;
    const mainJobRef = useRef<HTMLDivElement>(null);
    const [isMainJobOpen, setIsMainJobOpen] = useState(false);
    const [jobTab, setJobTab] = useState<'Battle' | 'Crafting' | 'Gathering'>('Battle');

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Tank': return '#0071e3'; // Modern blue
            case 'Healer': return '#34c759'; // Apple green
            case 'Melee':
            case 'Physical Ranged':
            case 'Magical Ranged': return '#ff3b30'; // Modern red
            case 'Limited': return '#1d1d1f';
            case 'Crafting': return '#a2845e'; // Muted wood
            case 'Gathering': return '#30d158'; // Modern leaf
            default: return '#86868b';
        }
    };

    const t = i18n[lang].form;
    // inputClass is shared from utils/styles — do not redefine locally.

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (mainJobRef.current && !mainJobRef.current.contains(event.target as Node)) {
                setIsMainJobOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getJobDisplayName = (job: typeof JOBS[0]) => {
        if (lang === 'ko') return job.nameKr;
        if (lang === 'ja') return job.nameJa;
        return job.nameEn;
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
                newLevels[jobId] = jobId === 'BLU' ? Math.min(level, 80) : level;
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
            const isMain = next.length === 1;
            setPlayerInfo(prev => ({ 
                ...prev, 
                jobs: next, 
                mainJob: isMain ? jobId : prev.mainJob,
                jobLevels: { ...prev.jobLevels, [jobId]: jobId === 'BLU' ? 80 : 100 } 
            }));
        }
    };

    const handleLevelChange = (jobId: string, level: number) => {
        setPlayerInfo(prev => ({
            ...prev,
            jobLevels: { ...prev.jobLevels, [jobId]: Math.min(jobId === 'BLU' ? 80 : 100, Math.max(1, level)) }
        }));
    };

    const filteredJobs = JOBS.filter(job => {
        if (jobTab === 'Battle') return ['Tank', 'Healer', 'Melee', 'Physical Ranged', 'Magical Ranged', 'Limited'].includes(job.role);
        if (jobTab === 'Crafting') return job.role === 'Crafting';
        if (jobTab === 'Gathering') return job.role === 'Gathering';
        return false;
    });

    return (
        <section className="space-y-4">
            {/* 상단 제목 및 일괄 선택 버튼 그룹 */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest">{t.job}</h3>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                        <button onClick={() => handleBulkSelect('battle', 100)} className="px-2 py-1 text-[10px] font-bold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded transition-colors whitespace-nowrap">{t.battleMax}</button>
                        <button onClick={() => handleBulkSelect('life', 100)} className="px-2 py-1 text-[10px] font-bold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded transition-colors whitespace-nowrap">{t.lifeMax}</button>
                        <button onClick={() => handleBulkSelect('all', 100)} className="px-2 py-1 text-[10px] font-bold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded transition-colors whitespace-nowrap">{t.allMax}</button>
                    </div>
                    <div className="w-px h-3 bg-neutral-200 dark:bg-neutral-800" />
                    <button
                        type="button"
                        onClick={() => handleBulkSelect('clear', 0)}
                        className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 hover:text-red-500 transition-colors"
                    >
                        <RotateCcw size={12} />
                        {i18n[lang].layout.reset}
                    </button>
                </div>
            </div>

            {/* 역할별 탭 (Apple 스타일의 세그먼트 컨트롤) */}
            <div className="flex gap-1 bg-[#e8e8ed] dark:bg-[#2d2d2f] rounded-xl p-1 shadow-inner border border-[#d2d2d7]/50 dark:border-[#424245]/50 flex-wrap sm:flex-nowrap">
                {[
                    { key: 'Battle' as const, label: t.battle, icon: Swords },
                    { key: 'Crafting' as const, label: t.crafting, icon: Hammer },
                    { key: 'Gathering' as const, label: t.gathering, icon: Leaf },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setJobTab(tab.key)}
                        className={`flex-1 min-w-[30%] py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all px-1 ${
                            jobTab === tab.key 
                                ? 'bg-white dark:bg-[#48484a] text-[#1d1d1f] dark:text-white shadow-sm' 
                                : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                        }`}
                    >
                        <tab.icon size={13} className="shrink-0" /> <span className="truncate">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* 주직업 선택 드롭다운 */}
            {playerInfo.jobs.length > 0 && (
                <div className="bg-[#f5f5f7] dark:bg-[#2d2d2f] p-3 rounded-xl space-y-2 relative" ref={mainJobRef}>
                    <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest">{t.mainJobSelect}</span>
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
                                    const jobName = getJobDisplayName(job);
                                    return (
                                        <>
                                            <img src={job.iconUrl} alt={jobName} className="w-5 h-5 dark-invert" />
                                            <span className="font-semibold text-neutral-900 dark:text-white">{jobName}</span>
                                        </>
                                    );
                                })() : (
                                    <span className="text-[#86868b]">{t.pleaseSelect}</span>
                                )}
                            </div>
                            <ChevronDown size={16} className={`text-[#86868b] transition-transform ${isMainJobOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* 드롭다운 메뉴 */}
                        {isMainJobOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-xl border border-[#d2d2d7] dark:border-[#424245] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto p-1.5 space-y-0.5">
                                {playerInfo.jobs.map(jobId => {
                                    const job = JOBS.find(j => j.id === jobId);
                                    if (!job) return null;
                                    const isSelected = playerInfo.mainJob === jobId;
                                    const jobName = getJobDisplayName(job);
                                    return (
                                        <button
                                            key={jobId}
                                            type="button"
                                            onClick={() => {
                                                handleChange('mainJob', jobId);
                                                setIsMainJobOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                                isSelected
                                                    ? 'bg-[#f5f5f7] dark:bg-[#3a3a3c]'
                                                    : 'hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2f]'
                                            }`}
                                        >
                                            <img src={job.iconUrl} alt={jobName} className="w-5 h-5 dark-invert" />
                                            <span className={`text-sm flex-1 text-left ${
                                                isSelected
                                                    ? 'font-bold text-[#1d1d1f] dark:text-[#f5f5f7]'
                                                    : 'font-medium text-[#1d1d1f] dark:text-[#f5f5f7]'
                                            }`}>
                                                {jobName}
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

            {/* 직업 선택 그리드 및 레벨 입력 */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {filteredJobs.map(job => {
                    const isSelected = playerInfo.jobs.includes(job.id);
                    const isMain = playerInfo.mainJob === job.id;
                    const jobName = getJobDisplayName(job);
                    const roleColor = getRoleColor(job.role);
                    return (
                        <div
                            key={job.id}
                            className={`flex flex-col items-center p-2 rounded-xl border relative transition-all duration-300 group min-h-[110px] justify-between ${
                                isSelected 
                                    ? 'bg-white dark:bg-[#1d1d1f] shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] z-10' 
                                    : 'border-transparent hover:bg-neutral-50 dark:hover:bg-white/5 opacity-60 hover:opacity-100'
                            }`}
                            style={{ 
                                borderColor: isSelected ? `${roleColor}80` : 'transparent',
                                backgroundColor: isSelected ? `${roleColor}05` : undefined,
                                boxShadow: isSelected ? `0 4px 12px -4px ${roleColor}30` : undefined,
                            } as React.CSSProperties}
                        >
                            <button type="button" onClick={() => toggleJob(job.id)} className="flex flex-col items-center w-full focus:outline-none overflow-visible pt-1 px-0.5">
                                <div className="relative">
                                    <img 
                                        src={job.iconUrl} 
                                        alt={jobName} 
                                        className={`w-8 h-8 transition-all duration-500 dark-invert ${isSelected ? 'scale-110 drop-shadow-sm' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-80'}`} 
                                    />
                                    {isMain && (
                                        <div 
                                            className="absolute -top-1.5 -right-1.5 bg-white dark:bg-[#1d1d1f] rounded-full p-0.5 shadow-sm border border-yellow-400"
                                            title="Main Job"
                                        >
                                            <Check size={8} className="text-yellow-500 fill-yellow-500" strokeWidth={4} />
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[10px] mt-1.5 font-bold ${isSelected ? 'text-neutral-900 dark:text-neutral-100' : 'text-[#86868b]'} text-center leading-tight w-full px-0.5 break-keep`}>{jobName}</span>
                            </button>
                            
                            {/* 레벨 입력 필드 */}
                            <div className="w-full mt-auto">
                                {isSelected ? (
                                    <div className="w-full pt-1.5 border-t border-neutral-100 dark:border-white/10 flex items-center justify-center gap-1">
                                        <span className="text-[9px] font-extrabold opacity-40">LV</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={job.id === 'BLU' ? 80 : 100}
                                            value={playerInfo.jobLevels[job.id] || 100}
                                            onChange={e => handleLevelChange(job.id, parseInt(e.target.value) || 1)}
                                            className="w-10 text-center text-xs font-black bg-transparent border-none rounded p-0 text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-[21px]" /> /* 선택되지 않았을 때도 공간 유지 */
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
