import { PROFILE_SCHEMA_VERSION } from '../constants/storage';
import { JOBS } from '../data/jobs';
import type { Language, PlayerInfo, Region, Sticker } from '../types';

const JOB_IDS = new Set(JOBS.map(job => job.id));
const FONT_IDS = new Set([
    'font-pretendard',
    'font-mona',
    'font-gmarket',
    'font-police',
    'font-myungjo',
    'font-seabreeze',
    'font-schoolsafe',
    'font-hancom',
    'font-cafe24',
    'font-gangwon',
    'font-cookierun',
    'font-galmuri9',
    'font-seogung',
    'font-cloudsanscode',
]);

export const DEFAULT_PLAYER_INFO: PlayerInfo = {
    name: '',
    region: 'KR',
    dataCenter: '',
    server: '',
    jobs: [],
    playstyles: [],
    activeTime: '',
    comment: '',
    font: 'font-pretendard',
    mainJob: undefined,
    isNicknameChanged: false,
    isSprout: false,
    isMentor: false,
    jobLevels: {},
    layout: 'header',
    language: 'ko',
    pointColor: '#e44c21',
    stickers: [],
    version: PROFILE_SCHEMA_VERSION,
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback = ''): string {
    return typeof value === 'string' ? value : fallback;
}

function booleanValue(value: unknown): boolean {
    return typeof value === 'boolean' ? value : false;
}

function finiteNumber(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function normalizeStickers(value: unknown): Sticker[] {
    if (!Array.isArray(value)) return [];

    return value.flatMap((candidate, index) => {
        if (!isRecord(candidate) || typeof candidate.url !== 'string' || candidate.url.length === 0) return [];

        return [{
            id: stringValue(candidate.id, `migrated-sticker-${index}`),
            url: candidate.url,
            x: Number(clamp(finiteNumber(candidate.x, 50), 0, 100).toFixed(1)),
            y: Number(clamp(finiteNumber(candidate.y, 50), 0, 100).toFixed(1)),
            scale: Number(clamp(finiteNumber(candidate.scale, 1), 0.1, 3).toFixed(2)),
            rotation: ((finiteNumber(candidate.rotation, 0) % 360) + 360) % 360,
        }];
    });
}

/** Convert persisted or imported unknown data into the current safe schema. */
export function normalizePlayerInfo(value: unknown): PlayerInfo {
    const source = isRecord(value) ? value : {};
    const jobs = Array.isArray(source.jobs)
        ? [...new Set(source.jobs.filter((job): job is string => typeof job === 'string' && JOB_IDS.has(job)))]
        : [];
    const jobLevelsSource = isRecord(source.jobLevels) ? source.jobLevels : {};
    const jobLevels = Object.fromEntries(jobs.map(jobId => {
        const maxLevel = jobId === 'BLU' ? 80 : 100;
        return [jobId, Math.round(clamp(finiteNumber(jobLevelsSource[jobId], maxLevel), 1, maxLevel))];
    }));
    const mainJob = typeof source.mainJob === 'string' && jobs.includes(source.mainJob)
        ? source.mainJob
        : undefined;
    const language: Language = source.language === 'en' || source.language === 'ja' ? source.language : 'ko';
    const region: Region = source.region === 'Global' ? 'Global' : 'KR';
    const pointColor = typeof source.pointColor === 'string' && /^#[0-9a-f]{6}$/i.test(source.pointColor)
        ? source.pointColor
        : DEFAULT_PLAYER_INFO.pointColor;
    const font = typeof source.font === 'string' && FONT_IDS.has(source.font)
        ? source.font
        : DEFAULT_PLAYER_INFO.font;

    return {
        name: stringValue(source.name),
        region,
        dataCenter: stringValue(source.dataCenter),
        server: stringValue(source.server),
        jobs,
        playstyles: Array.isArray(source.playstyles)
            ? [...new Set(source.playstyles.filter((item): item is string => typeof item === 'string'))]
            : [],
        activeTime: stringValue(source.activeTime),
        comment: stringValue(source.comment),
        image: typeof source.image === 'string' && source.image.length > 0 ? source.image : undefined,
        font,
        mainJob,
        isNicknameChanged: booleanValue(source.isNicknameChanged),
        isSprout: booleanValue(source.isSprout),
        isMentor: booleanValue(source.isMentor),
        jobLevels,
        layout: source.layout === 'left-portrait' ? 'left-portrait' : 'header',
        language,
        pointColor,
        stickers: normalizeStickers(source.stickers),
        version: PROFILE_SCHEMA_VERSION,
    };
}
