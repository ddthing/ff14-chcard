import { useState, useRef, useEffect } from 'react';
import { Swords, Hammer, Leaf, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { JOBS } from '../../data/jobs';
import { i18n } from '../../utils/i18n';
import { inputClass } from '../../utils/styles';
import { usePlayer } from '../../contexts/PlayerContext';

/**
 * JobSelectionSection
 *
 * Three-tab grid (Battle / Crafting / Gathering) for selecting jobs + levels.
 * Main job selector lives below the tab bar, inside a collapsible dropdown.
 *
 * Token rules:
 *  - All inactive states: --surface-*, --border-*, --text-* tokens.
 *  - Role colors stay as semantic constants (Tank blue, Healer green, etc.)
 *    because they carry meaning and are not theming concerns.
 *  - The active job card border/bg derives from roleColor (semantic),
 *    not from the accent token.
 */

// ─── Semantic role color constants (not theming tokens) ─────────────────────
const ROLE_COLOR: Record<string, string> = {
    'Tank':             '#0071e3',
    'Healer':           '#34c759',
    'Melee':            '#ff3b30',
    'Physical Ranged':  '#ff3b30',
    'Magical Ranged':   '#ff3b30',
    'Limited':          '#8e8e93',
    'Crafting':         '#a2845e',
    'Gathering':        '#30d158',
};

export function JobSelectionSection() {
    const { playerInfo, setPlayerInfo, updatePlayerField: handleChange } = usePlayer();
    const lang = playerInfo.language;
    const mainJobRef = useRef<HTMLDivElement>(null);
    const [isMainJobOpen, setIsMainJobOpen] = useState(false);
    const [jobTab, setJobTab] = useState<'Battle' | 'Crafting' | 'Gathering'>('Battle');

    const t = i18n[lang].form;

    // Close main-job dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (mainJobRef.current && !mainJobRef.current.contains(event.target as Node)) {
                setIsMainJobOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getJobDisplayName = (job: typeof JOBS[0]) => {
        if (lang === 'ko') return job.nameKr;
        if (lang === 'ja') return job.nameJa;
        return job.nameEn;
    };

    // ─── Bulk selection ───────────────────────────────────────────────────────
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
            const newJobs = Array.from(new Set([...prev.jobs, ...targetJobs]));
            const newLevels = { ...prev.jobLevels };
            targetJobs.forEach(id => { newLevels[id] = id === 'BLU' ? Math.min(level, 80) : level; });
            return { ...prev, jobs: newJobs, jobLevels: newLevels, mainJob: prev.mainJob || targetJobs[0] };
        });
    };

    // ─── Toggle single job ────────────────────────────────────────────────────
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
            const isFirst = next.length === 1;
            setPlayerInfo(prev => ({
                ...prev,
                jobs: next,
                mainJob: isFirst ? jobId : prev.mainJob,
                jobLevels: { ...prev.jobLevels, [jobId]: jobId === 'BLU' ? 80 : 100 },
            }));
        }
    };

    const handleLevelChange = (jobId: string, level: number) => {
        setPlayerInfo(prev => ({
            ...prev,
            jobLevels: { ...prev.jobLevels, [jobId]: Math.min(jobId === 'BLU' ? 80 : 100, Math.max(1, level)) },
        }));
    };

    const filteredJobs = JOBS.filter(job => {
        if (jobTab === 'Battle')   return ['Tank', 'Healer', 'Melee', 'Physical Ranged', 'Magical Ranged', 'Limited'].includes(job.role);
        if (jobTab === 'Crafting') return job.role === 'Crafting';
        if (jobTab === 'Gathering') return job.role === 'Gathering';
        return false;
    });

    // ─── Shared bulk-action button style (token-based) ────────────────────────
    const bulkBtnStyle: React.CSSProperties = {
        backgroundColor: 'var(--surface-300)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-subtle)',
    };

    return (
        <section className="space-y-4">
            {/* ── Header: title + bulk actions ─────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h3
                    className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                    style={{ color: 'var(--text-muted)' }}
                >
                    {t.job}
                </h3>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handleBulkSelect('battle', 100)}
                            className="px-2 py-1 text-[10px] font-semibold rounded-[5px] transition-colors whitespace-nowrap"
                            style={bulkBtnStyle}
                        >
                            {t.battleMax}
                        </button>
                        <button
                            onClick={() => handleBulkSelect('life', 100)}
                            className="px-2 py-1 text-[10px] font-semibold rounded-[5px] transition-colors whitespace-nowrap"
                            style={bulkBtnStyle}
                        >
                            {t.lifeMax}
                        </button>
                        <button
                            onClick={() => handleBulkSelect('all', 100)}
                            className="px-2 py-1 text-[10px] font-semibold rounded-[5px] transition-colors whitespace-nowrap"
                            style={bulkBtnStyle}
                        >
                            {t.allMax}
                        </button>
                    </div>
                    <div className="w-px h-3" style={{ backgroundColor: 'var(--border-medium)' }} />
                    <button
                        type="button"
                        onClick={() => handleBulkSelect('clear', 0)}
                        className="flex items-center gap-1 text-[10px] font-semibold transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--error, #cf2d56)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')}
                    >
                        <RotateCcw size={11} />
                        {i18n[lang].layout.reset}
                    </button>
                </div>
            </div>

            {/* ── Job-category tab bar ──────────────────────────────────────── */}
            <div
                className="flex rounded-[8px] p-[3px] gap-0.5"
                style={{ backgroundColor: 'var(--surface-300)', border: '1px solid var(--border-subtle)' }}
            >
                {[
                    { key: 'Battle'   as const, label: t.battle,   icon: Swords  },
                    { key: 'Crafting' as const, label: t.crafting,  icon: Hammer  },
                    { key: 'Gathering' as const, label: t.gathering, icon: Leaf   },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setJobTab(tab.key)}
                        className="flex-1 py-1.5 rounded-[6px] text-[11px] font-semibold flex items-center justify-center gap-1 transition-all px-1 truncate"
                        style={
                            jobTab === tab.key
                                ? {
                                    backgroundColor: 'var(--surface-50)',
                                    color: 'var(--text-primary)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                }
                                : { color: 'var(--text-muted)' }
                        }
                    >
                        <tab.icon size={12} className="shrink-0" />
                        <span className="truncate">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Main job dropdown ─────────────────────────────────────────── */}
            {playerInfo.jobs.length > 0 && (
                <div
                    className="p-3 rounded-[10px] space-y-2 relative"
                    style={{ backgroundColor: 'var(--surface-300)', border: '1px solid var(--border-subtle)' }}
                    ref={mainJobRef}
                >
                    <span
                        className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        {t.mainJobSelect}
                    </span>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsMainJobOpen(!isMainJobOpen)}
                            className={`${inputClass} flex items-center justify-between cursor-pointer`}
                        >
                            <div className="flex items-center gap-2">
                                {playerInfo.mainJob ? (() => {
                                    const job = JOBS.find(j => j.id === playerInfo.mainJob);
                                    if (!job) return <span style={{ color: 'var(--text-muted)' }}>{t.pleaseSelect}</span>;
                                    return (
                                        <>
                                            <img src={job.iconUrl} alt={getJobDisplayName(job)} className="w-5 h-5 dark-invert" />
                                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                                {getJobDisplayName(job)}
                                            </span>
                                        </>
                                    );
                                })() : (
                                    <span style={{ color: 'var(--text-muted)' }}>{t.pleaseSelect}</span>
                                )}
                            </div>
                            <ChevronDown
                                size={15}
                                style={{ color: 'var(--text-muted)' }}
                                className={`transition-transform ${isMainJobOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown list */}
                        {isMainJobOpen && (
                            <div
                                className="absolute top-full left-0 right-0 mt-1.5 backdrop-blur-xl rounded-[10px] z-50 max-h-60 overflow-y-auto p-1"
                                style={{
                                    backgroundColor: 'var(--surface-100)',
                                    border: '1px solid var(--border-default)',
                                    boxShadow: 'var(--shadow-elevated)',
                                }}
                            >
                                {playerInfo.jobs.map(jobId => {
                                    const job = JOBS.find(j => j.id === jobId);
                                    if (!job) return null;
                                    const isSelected = playerInfo.mainJob === jobId;
                                    const jobName = getJobDisplayName(job);
                                    return (
                                        <button
                                            key={jobId}
                                            type="button"
                                            onClick={() => { handleChange('mainJob', jobId); setIsMainJobOpen(false); }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[7px] transition-colors duration-100"
                                            style={{
                                                backgroundColor: isSelected ? 'var(--surface-300)' : 'transparent',
                                                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            }}
                                            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--surface-200)'; }}
                                            onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                                        >
                                            <img src={job.iconUrl} alt={jobName} className="w-5 h-5 dark-invert" />
                                            <span className={`text-[13px] flex-1 text-left ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                                                {jobName}
                                            </span>
                                            {isSelected && <Check size={13} style={{ color: 'var(--text-primary)' }} />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Job grid ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {filteredJobs.map(job => {
                    const isSelected = playerInfo.jobs.includes(job.id);
                    const isMain     = playerInfo.mainJob === job.id;
                    const jobName    = getJobDisplayName(job);
                    const roleColor  = ROLE_COLOR[job.role] ?? '#8e8e93';

                    return (
                        <div
                            key={job.id}
                            className="flex flex-col items-center p-2 rounded-[10px] relative transition-all duration-200 group min-h-[100px] justify-between"
                            style={{
                                backgroundColor: isSelected ? `${roleColor}06` : 'var(--surface-200)',
                                border: isSelected ? `1px solid ${roleColor}40` : '1px solid var(--border-subtle)',
                                boxShadow: isSelected ? `0 3px 10px -3px ${roleColor}25` : 'none',
                                opacity: isSelected ? 1 : 0.65,
                            }}
                            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
                            onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.opacity = '0.65'; }}
                        >
                            {/* Job icon + name */}
                            <button
                                type="button"
                                onClick={() => toggleJob(job.id)}
                                className="flex flex-col items-center w-full focus:outline-none pt-1 px-0.5"
                            >
                                <div className="relative">
                                    <img
                                        src={job.iconUrl}
                                        alt={jobName}
                                        className={`w-8 h-8 transition-all duration-300 dark-invert ${
                                            isSelected ? 'scale-105 drop-shadow-sm' : 'grayscale'
                                        }`}
                                    />
                                    {isMain && (
                                        <div
                                            className="absolute -top-1.5 -right-1.5 rounded-full p-0.5 shadow-sm"
                                            style={{
                                                backgroundColor: 'var(--surface-50)',
                                                border: '1px solid #f5c842',
                                            }}
                                            title="Main Job"
                                        >
                                            <Check size={8} className="text-yellow-500 fill-yellow-500" strokeWidth={4} />
                                        </div>
                                    )}
                                </div>
                                <span
                                    className="text-[10px] mt-1.5 font-semibold text-center leading-tight w-full px-0.5 break-keep"
                                    style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)' }}
                                >
                                    {jobName}
                                </span>
                            </button>

                            {/* Level input */}
                            <div className="w-full mt-auto">
                                {isSelected ? (
                                    <div className="w-full pt-1.5 flex justify-center">
                                        <div
                                            className="flex items-center justify-center gap-1 px-2 py-0.5 rounded-full transition-colors"
                                            style={{ backgroundColor: 'var(--surface-300)', border: '1px solid var(--border-default)' }}
                                        >
                                            <span
                                                className="text-[9px] font-bold"
                                                style={{ color: 'var(--text-muted)' }}
                                            >
                                                LV
                                            </span>
                                            <input
                                                type="number"
                                                min={1}
                                                max={job.id === 'BLU' ? 80 : 100}
                                                value={playerInfo.jobLevels[job.id] || 100}
                                                onChange={e => handleLevelChange(job.id, parseInt(e.target.value) || 1)}
                                                className="w-8 text-center text-[11px] font-bold bg-transparent border-none rounded p-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                style={{ color: 'var(--text-primary)' }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-[21px]" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
