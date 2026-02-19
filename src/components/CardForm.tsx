import { type ChangeEvent, type Dispatch, type SetStateAction, useRef, useState } from 'react';
import type { PlayerInfo, Region } from '../types';
import { DATA_CENTERS, WORLDS } from '../data/servers';
import { JOBS, PLAYSTYLES } from '../data/jobs';
import { Upload, Swords, Hammer, Sprout as SproutIcon, Crown, Leaf } from 'lucide-react';

interface CardFormProps {
    playerInfo: PlayerInfo;
    setPlayerInfo: Dispatch<SetStateAction<PlayerInfo>>;
}

const ACTIVE_TIMES = [
    '평일 저녁 / 주말 상시',
    '평일 야간 / 주말 랜덤',
    '주말 위주',
    '랜덤 접속 (불규칙)',
    '매일 접속 (하드코어)',
    '새벽반',
    '접속 뜸함',
    '직접 입력'
];

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
    const [jobTab, setJobTab] = useState<'Battle' | 'Crafting' | 'Gathering'>('Battle');
    const [isCustomTime, setIsCustomTime] = useState(false);
    const [batchLevel, setBatchLevel] = useState(100);

    const handleChange = (field: keyof PlayerInfo, value: any) => {
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

            {/* Identity */}
            <Section title="기본 정보">
                <div className="space-y-2">
                    <input
                        type="text"
                        value={playerInfo.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`${inputClass} font-semibold text-base`}
                        placeholder="닉네임"
                    />
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#86868b] select-none">
                        <input
                            type="checkbox"
                            checked={playerInfo.isNicknameChanged}
                            onChange={(e) => handleChange('isNicknameChanged', e.target.checked)}
                            className="rounded border-[#d2d2d7] dark:border-[#424245] accent-[#0071e3] w-3.5 h-3.5"
                        />
                        인게임과 다름
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
                        <option value="">서버 선택</option>
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
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${playerInfo.isSprout ? 'bg-[#34c759]/10 border-[#34c759]/40 text-[#248a3d] dark:text-[#30d158]' : 'border-[#d2d2d7] dark:border-[#424245] text-[#86868b]'}`}
                    >
                        <SproutIcon size={16} /> 초보
                    </button>
                    <button
                        onClick={() => handleChange('isMentor', !playerInfo.isMentor)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${playerInfo.isMentor ? 'bg-[#ff9f0a]/10 border-[#ff9f0a]/40 text-[#c93400] dark:text-[#ff9f0a]' : 'border-[#d2d2d7] dark:border-[#424245] text-[#86868b]'}`}
                    >
                        <Crown size={16} /> 멘토
                    </button>
                </div>
            </Section>

            {/* Jobs */}
            <Section title="직업">
                {/* Tabs */}
                <div className="flex gap-1 bg-[#e8e8ed] dark:bg-[#2d2d2f] rounded-xl p-1">
                    {[
                        { key: 'Battle' as const, label: '전투', icon: Swords },
                        { key: 'Crafting' as const, label: '제작', icon: Hammer },
                        { key: 'Gathering' as const, label: '채집', icon: Leaf },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setJobTab(tab.key)}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${jobTab === tab.key ? 'bg-white dark:bg-[#48484a] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm' : 'text-[#86868b]'}`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Job Selector */}
                {playerInfo.jobs.length > 0 && (
                    <div className="bg-[#f5f5f7] dark:bg-[#2d2d2f] p-3 rounded-xl space-y-2">
                        <span className="text-xs font-semibold text-[#86868b]">주 직업 선택</span>
                        <div className="flex flex-wrap gap-1.5">
                            {playerInfo.jobs.map(jobId => {
                                const job = JOBS.find(j => j.id === jobId);
                                if (!job) return null;
                                return (
                                    <button
                                        key={jobId}
                                        onClick={() => handleChange('mainJob', jobId)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${playerInfo.mainJob === jobId ? 'bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] border-transparent' : 'bg-white dark:bg-[#3a3a3c] border-[#d2d2d7] dark:border-[#48484a] text-[#6e6e73] dark:text-[#a1a1a6]'}`}
                                    >
                                        <img src={job.iconUrl} alt={job.nameKr} className={`w-4 h-4 ${playerInfo.mainJob === jobId ? 'icon-invert' : ''}`} />
                                        {job.nameKr}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Job Grid */}
                <div className="grid grid-cols-4 gap-1.5">
                    {filteredJobs.map(job => {
                        const isSelected = playerInfo.jobs.includes(job.id);
                        const isMain = playerInfo.mainJob === job.id;
                        return (
                            <button
                                key={job.id}
                                onClick={() => toggleJob(job.id)}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${isSelected ? 'bg-[#f5f5f7] dark:bg-[#2d2d2f] border-[#d2d2d7] dark:border-[#48484a]' : 'border-transparent hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2f]'} ${isMain ? 'ring-2 ring-[#0071e3]' : ''}`}
                            >
                                <img src={job.iconUrl} alt={job.nameKr} className={`w-7 h-7 ${isSelected ? 'opacity-100' : 'opacity-25 grayscale'}`} />
                                <span className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-[#1d1d1f] dark:text-[#f5f5f7]' : 'text-[#86868b]'}`}>{job.nameKr}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Job Level Inputs */}
                {playerInfo.jobs.length > 0 && (
                    <div className="space-y-3 mt-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#86868b]">직업 레벨</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={batchLevel}
                                    onChange={e => setBatchLevel(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                                    className="w-14 text-center text-xs font-semibold bg-white dark:bg-[#3a3a3c] border border-[#d2d2d7] dark:border-[#48484a] rounded-md py-1 text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none"
                                />
                                <button
                                    onClick={() => {
                                        const newLevels: Record<string, number> = {};
                                        playerInfo.jobs.forEach(jid => { newLevels[jid] = batchLevel; });
                                        setPlayerInfo(prev => ({ ...prev, jobLevels: newLevels }));
                                    }}
                                    className="px-3 py-1 text-xs font-semibold bg-[#0071e3] text-white rounded-lg hover:bg-[#0077ed] transition-colors"
                                >
                                    일괄 적용
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {playerInfo.jobs.map(jobId => {
                                const job = JOBS.find(j => j.id === jobId);
                                if (!job) return null;
                                return (
                                    <div key={jobId} className="flex items-center gap-2 bg-[#f5f5f7] dark:bg-[#2d2d2f] rounded-lg px-2.5 py-1.5">
                                        <img src={job.iconUrl} alt={job.nameKr} className="w-5 h-5" />
                                        <span className="text-xs font-medium text-[#6e6e73] dark:text-[#a1a1a6] flex-1 truncate">{job.nameKr}</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={playerInfo.jobLevels[jobId] || 90}
                                            onChange={e => handleLevelChange(jobId, parseInt(e.target.value) || 1)}
                                            className="w-12 text-center text-xs font-semibold bg-white dark:bg-[#3a3a3c] border border-[#d2d2d7] dark:border-[#48484a] rounded-md py-1 text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Section>

            {/* Playstyle */}
            <Section title="플레이 스타일">
                <div className="flex flex-wrap gap-1.5">
                    {PLAYSTYLES.map(tag => (
                        <button
                            key={tag}
                            onClick={() => togglePlaystyle(tag)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${playerInfo.playstyles.includes(tag) ? 'bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] border-transparent' : 'bg-white dark:bg-[#3a3a3c] border-[#d2d2d7] dark:border-[#48484a] text-[#6e6e73] dark:text-[#a1a1a6] hover:border-[#86868b]'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </Section>

            {/* Details */}
            <Section title="상세 정보">
                {/* Active Time */}
                {!isCustomTime ? (
                    <select
                        value={ACTIVE_TIMES.includes(playerInfo.activeTime) ? playerInfo.activeTime : ''}
                        onChange={(e) => {
                            if (e.target.value === '직접 입력') {
                                setIsCustomTime(true);
                                handleChange('activeTime', '');
                            } else {
                                handleChange('activeTime', e.target.value);
                            }
                        }}
                        className={inputClass}
                    >
                        <option value="" disabled>접속 시간 선택</option>
                        {ACTIVE_TIMES.map(time => (
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
                            placeholder="접속 시간을 직접 입력"
                        />
                        <button onClick={() => setIsCustomTime(false)} className="px-3 py-2 bg-[#e8e8ed] dark:bg-[#3a3a3c] rounded-xl text-xs font-medium text-[#86868b]">
                            목록
                        </button>
                    </div>
                )}

                <textarea
                    value={playerInfo.comment}
                    onChange={(e) => handleChange('comment', e.target.value)}
                    className={`${inputClass} h-20 resize-none`}
                    placeholder="자기소개 (200자 이내)"
                    maxLength={200}
                />

                {/* Image Upload */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-[#e8e8ed] dark:bg-[#3a3a3c] hover:bg-[#d2d2d7] dark:hover:bg-[#48484a] rounded-xl text-sm font-medium flex items-center gap-2 transition-all text-[#1d1d1f] dark:text-[#f5f5f7]"
                    >
                        <Upload size={16} /> 이미지 업로드
                    </button>
                    {playerInfo.image && (
                        <button onClick={() => handleChange('image', undefined)} className="text-xs text-[#ff3b30] font-medium">삭제</button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
            </Section>

            {/* Font */}
            <Section title="폰트">
                <div className="grid grid-cols-2 gap-1.5">
                    {[
                        { id: 'font-gmarket', name: 'Gmarket Sans' },
                        { id: 'font-pretendard', name: 'Pretendard' },
                        { id: 'font-myeongjo', name: '나눔명조' },
                        { id: 'font-dodum', name: '고운돋움' },
                        { id: 'font-aggro', name: 'S-Core Dream' },
                        { id: 'font-cookie', name: '쿠키런' },
                        { id: 'font-jalnan', name: '여기어때 잘난체' },
                        { id: 'font-yangjin', name: '양진체' },
                        { id: 'font-apple', name: 'Apple SD Gothic' },
                        { id: 'font-bh', name: 'Black Han Sans' },
                    ].map(font => (
                        <button
                            key={font.id}
                            onClick={() => handleChange('font', font.id)}
                            className={`p-2.5 text-sm font-medium rounded-xl border transition-all ${font.id} ${playerInfo.font === font.id ? 'bg-[#0071e3] text-white border-transparent' : 'bg-white dark:bg-[#3a3a3c] border-[#d2d2d7] dark:border-[#48484a] text-[#6e6e73] dark:text-[#a1a1a6]'}`}
                        >
                            {font.name}
                        </button>
                    ))}
                </div>
            </Section>
        </div>
    );
}
