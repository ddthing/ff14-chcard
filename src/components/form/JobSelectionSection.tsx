import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
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
 *  - Job selection surfaces stay neutral so the form follows the active
 *    Nova/Neutral contract. Job icon artwork remains unchanged.
 */

type JobTab = 'Battle' | 'Crafting' | 'Gathering';

export function JobSelectionSection() {
    const { playerInfo, setPlayerInfo, updatePlayerField: handleChange } = usePlayer();
    const lang = playerInfo.language;
    const mainJobRef = useRef<HTMLDivElement>(null);
    const mainJobTriggerRef = useRef<HTMLButtonElement>(null);
    const mainJobOptionRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const jobTabRefs = useRef<Partial<Record<JobTab, HTMLButtonElement | null>>>({});
    const [isMainJobOpen, setIsMainJobOpen] = useState(false);
    const [jobTab, setJobTab] = useState<JobTab>('Battle');

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

    const selectedMainJob = JOBS.find(job => job.id === playerInfo.mainJob);
    const selectedMainJobName = selectedMainJob ? getJobDisplayName(selectedMainJob) : '';

    const focusMainJobOption = (index: number) => {
        requestAnimationFrame(() => {
            mainJobOptionRefs.current[index]?.focus();
        });
    };

    const toggleMainJobDropdown = () => {
        const nextIsOpen = !isMainJobOpen;
        setIsMainJobOpen(nextIsOpen);
        if (nextIsOpen) {
            const selectedIndex = Math.max(0, playerInfo.jobs.indexOf(playerInfo.mainJob ?? ''));
            focusMainJobOption(selectedIndex);
        }
    };

    const handleMainJobTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Escape') {
            if (!isMainJobOpen) return;
            event.preventDefault();
            setIsMainJobOpen(false);
            return;
        }

        if (!['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;

        event.preventDefault();
        const selectedIndex = Math.max(0, playerInfo.jobs.indexOf(playerInfo.mainJob ?? ''));
        const nextIndex = event.key === 'ArrowUp'
            ? Math.max(0, selectedIndex - 1)
            : event.key === 'ArrowDown'
                ? Math.min(playerInfo.jobs.length - 1, selectedIndex + 1)
                : selectedIndex;
        setIsMainJobOpen(true);
        focusMainJobOption(nextIndex);
    };

    const handleMainJobOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
        const optionCount = playerInfo.jobs.length;

        if (event.key === 'Escape') {
            event.preventDefault();
            setIsMainJobOpen(false);
            mainJobTriggerRef.current?.focus();
            return;
        }

        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

        event.preventDefault();
        const nextIndex = event.key === 'Home'
            ? 0
            : event.key === 'End'
                ? optionCount - 1
                : (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + optionCount) % optionCount;
        focusMainJobOption(nextIndex);
    };

    // ─── Bulk selection ───────────────────────────────────────────────────────
    const handleBulkSelect = (type: 'all' | 'battle' | 'life' | 'clear', level: number) => {
        if (type === 'clear') {
            const hasSelectedJobs = playerInfo.jobs.length > 0 || Object.keys(playerInfo.jobLevels).length > 0 || Boolean(playerInfo.mainJob);
            if (hasSelectedJobs && !window.confirm(t.resetConfirm)) return;
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

    const jobTabs = [
        { key: 'Battle' as const, label: t.battle, icon: Swords },
        { key: 'Crafting' as const, label: t.crafting, icon: Hammer },
        { key: 'Gathering' as const, label: t.gathering, icon: Leaf },
    ];

    const handleJobTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

        event.preventDefault();
        const nextIndex = event.key === 'Home'
            ? 0
            : event.key === 'End'
                ? jobTabs.length - 1
                : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + jobTabs.length) % jobTabs.length;
        const nextTab = jobTabs[nextIndex];
        setJobTab(nextTab.key);
        jobTabRefs.current[nextTab.key]?.focus();
    };

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
                <h2
                    className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                    style={{ color: 'var(--text-muted)' }}
                >
                    {t.job}
                </h2>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => handleBulkSelect('battle', 100)}
                            className="px-2 py-1 text-[10px] font-semibold rounded-[5px] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                            style={bulkBtnStyle}
                        >
                            {t.battleMax}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleBulkSelect('life', 100)}
                            className="px-2 py-1 text-[10px] font-semibold rounded-[5px] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                            style={bulkBtnStyle}
                        >
                            {t.lifeMax}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleBulkSelect('all', 100)}
                            className="px-2 py-1 text-[10px] font-semibold rounded-[5px] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                            style={bulkBtnStyle}
                        >
                            {t.allMax}
                        </button>
                    </div>
                    <div className="w-px h-3" style={{ backgroundColor: 'var(--border-medium)' }} />
                    <button
                        type="button"
                        onClick={() => handleBulkSelect('clear', 0)}
                        className="flex items-center gap-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--destructive)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')}
                    >
                        <RotateCcw size={11} aria-hidden="true" />
                        {i18n[lang].layout.reset}
                    </button>
                </div>
            </div>

            {/* ── Job-category tab bar ──────────────────────────────────────── */}
            <div
                className="flex rounded-[8px] p-[3px] gap-0.5"
                style={{ backgroundColor: 'var(--surface-300)', border: '1px solid var(--border-subtle)' }}
                role="tablist"
                aria-label={t.job}
            >
                {jobTabs.map((tab, index) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setJobTab(tab.key)}
                        ref={element => { jobTabRefs.current[tab.key] = element; }}
                        id={`job-tab-${tab.key.toLowerCase()}`}
                        role="tab"
                        aria-selected={jobTab === tab.key}
                        aria-controls={jobTab === tab.key ? `job-panel-${tab.key.toLowerCase()}` : undefined}
                        tabIndex={jobTab === tab.key ? 0 : -1}
                        onKeyDown={event => handleJobTabKeyDown(event, index)}
                        className="flex-1 truncate rounded-[6px] px-1 py-1.5 text-[11px] font-semibold flex items-center justify-center gap-1 transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
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
                        <tab.icon size={12} className="shrink-0" aria-hidden="true" />
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
                            ref={mainJobTriggerRef}
                            type="button"
                            role="combobox"
                            onClick={toggleMainJobDropdown}
                            onKeyDown={handleMainJobTriggerKeyDown}
                            aria-expanded={isMainJobOpen}
                            aria-haspopup="listbox"
                            aria-controls={isMainJobOpen ? 'main-job-listbox' : undefined}
                            aria-label={selectedMainJobName ? `${selectedMainJobName} · ${t.mainJobSelect}` : t.mainJobSelect}
                            className={`${inputClass} flex items-center justify-between cursor-pointer focus-visible:outline-none`}
                        >
                            <div className="flex items-center gap-2">
                                {selectedMainJob ? (() => {
                                    const job = selectedMainJob;
                                    return (
                                        <>
                                            <img src={job.iconUrl} alt="" aria-hidden="true" width={20} height={20} className="w-5 h-5 dark-invert" />
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
                                aria-hidden="true"
                                style={{ color: 'var(--text-muted)' }}
                                className={`transition-transform ${isMainJobOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown list */}
                        {isMainJobOpen && (
                            <div
                                id="main-job-listbox"
                                role="listbox"
                                aria-label={t.mainJobSelect}
                                className="absolute top-full left-0 right-0 mt-1.5 backdrop-blur-xl rounded-[10px] z-50 max-h-60 overflow-y-auto p-1"
                                style={{
                                    backgroundColor: 'var(--surface-100)',
                                    border: '1px solid var(--border-default)',
                                    boxShadow: 'var(--shadow-elevated)',
                                }}
                            >
                                {playerInfo.jobs.map((jobId, index) => {
                                    const job = JOBS.find(j => j.id === jobId);
                                    if (!job) return null;
                                    const isSelected = playerInfo.mainJob === jobId;
                                    const jobName = getJobDisplayName(job);
                                    return (
                                        <button
                                            key={jobId}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            tabIndex={isSelected ? 0 : -1}
                                            ref={element => { mainJobOptionRefs.current[index] = element; }}
                                            onClick={() => {
                                                handleChange('mainJob', jobId);
                                                setIsMainJobOpen(false);
                                                mainJobTriggerRef.current?.focus();
                                            }}
                                            onKeyDown={event => handleMainJobOptionKeyDown(event, index)}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[7px] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-medium)]"
                                            style={{
                                                backgroundColor: isSelected ? 'var(--surface-300)' : 'transparent',
                                                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            }}
                                            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--surface-200)'; }}
                                            onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                                        >
                                            <img src={job.iconUrl} alt="" aria-hidden="true" width={20} height={20} className="w-5 h-5 dark-invert" />
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
            <div
                id={`job-panel-${jobTab.toLowerCase()}`}
                role="tabpanel"
                aria-labelledby={`job-tab-${jobTab.toLowerCase()}`}
                tabIndex={0}
                className="grid grid-cols-3 sm:grid-cols-4 gap-1.5"
            >
                {filteredJobs.map(job => {
                    const isSelected = playerInfo.jobs.includes(job.id);
                    const isMain     = playerInfo.mainJob === job.id;
                    const jobName    = getJobDisplayName(job);

                    return (
                        <div
                            key={job.id}
                            data-main-job={isMain ? 'true' : undefined}
                            title={isMain ? t.mainJobSelect : undefined}
                            className="group relative flex min-h-[100px] flex-col items-center justify-between rounded-[10px] p-2 transition-[color,background-color,border-color,box-shadow,opacity] duration-200"
                            style={{
                                backgroundColor: isMain ? 'var(--surface-50)' : isSelected ? 'var(--secondary)' : 'var(--background)',
                                border: isSelected ? '1px solid var(--foreground)' : '1px solid var(--border-subtle)',
                                boxShadow: isMain ? '0 0 0 2px var(--foreground)' : isSelected ? '0 0 0 1px var(--foreground)' : 'none',
                                opacity: isSelected ? 1 : 0.65,
                            }}
                            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
                            onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.opacity = '0.65'; }}
                            >
                            {/* Job icon + name */}
                            <button
                                type="button"
                                onClick={() => toggleJob(job.id)}
                                aria-pressed={isSelected}
                                aria-label={isMain ? `${jobName} · ${t.mainJobSelect}` : jobName}
                                className="flex w-full flex-col items-center px-0.5 pt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]"
                            >
                                <div className="relative">
                                    <img
                                        src={job.iconUrl}
                                        alt=""
                                        aria-hidden="true"
                                        width={32}
                                        height={32}
                                        className={`h-8 w-8 transition-[filter,transform,opacity] duration-300 dark-invert ${
                                            isSelected ? 'scale-105 drop-shadow-sm' : 'grayscale'
                                        }`}
                                    />
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
                                                name={`job-level-${job.id}`}
                                                aria-label={`${jobName} ${t.jobLevel}`}
                                                min={1}
                                                max={job.id === 'BLU' ? 80 : 100}
                                                value={playerInfo.jobLevels[job.id] || 100}
                                                onChange={e => handleLevelChange(job.id, parseInt(e.target.value) || 1)}
                                                className="w-8 rounded border-none bg-transparent p-0 text-center text-[11px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
