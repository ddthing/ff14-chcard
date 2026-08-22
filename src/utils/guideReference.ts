import type { Job, Language } from '../types';
import { JOBS } from '../data/jobs';
import { getAllWorldsGrouped } from '../data/servers';

export type RoleGroup = 'battle' | 'crafting' | 'gathering';

export interface GuideJobReference {
    id: string;
    label: string;
}

export interface GuideRoleReference {
    id: RoleGroup;
    jobs: GuideJobReference[];
}

export interface GuideDataCenterReference {
    id: string;
    label: string;
    worlds: string[];
}

export interface GuideRegionReference {
    id: string;
    label: string;
    dataCenters: GuideDataCenterReference[];
}

export interface GuideReference {
    roles: GuideRoleReference[];
    regions: GuideRegionReference[];
    totalJobs: number;
    totalRegions: number;
    totalDataCenters: number;
    totalWorlds: number;
}

const BATTLE_ROLES = new Set<Job['role']>([
    'Tank',
    'Healer',
    'Melee',
    'Physical Ranged',
    'Magical Ranged',
    'Limited',
]);

const ROLE_GROUPS: Array<{ id: RoleGroup; matches: (role: Job['role']) => boolean }> = [
    { id: 'battle', matches: role => BATTLE_ROLES.has(role) },
    { id: 'crafting', matches: role => role === 'Crafting' },
    { id: 'gathering', matches: role => role === 'Gathering' },
];

function getJobLabel(job: Job, lang: Language) {
    if (lang === 'ko') return job.nameKr;
    if (lang === 'ja') return job.nameJa;
    return job.name;
}

export function getGuideReference(lang: Language): GuideReference {
    const roles = ROLE_GROUPS.map(({ id, matches }) => ({
        id,
        jobs: JOBS
            .filter(job => matches(job.role))
            .map(job => ({ id: job.id, label: getJobLabel(job, lang) })),
    }));

    const regions = getAllWorldsGrouped(lang).map(region => ({
        id: region.region,
        label: region.regionDisplay,
        dataCenters: region.dataCenters.map(dataCenter => ({
            id: dataCenter.name,
            label: dataCenter.displayName,
            worlds: dataCenter.worlds,
        })),
    }));

    const totalDataCenters = regions.reduce((total, region) => total + region.dataCenters.length, 0);
    const totalWorlds = regions.reduce(
        (total, region) => total + region.dataCenters.reduce((regionTotal, dataCenter) => regionTotal + dataCenter.worlds.length, 0),
        0,
    );

    return {
        roles,
        regions,
        totalJobs: JOBS.length,
        totalRegions: regions.length,
        totalDataCenters,
        totalWorlds,
    };
}
