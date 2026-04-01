import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { PlayerInfo, Language } from '../types';

interface PlayerContextType {
    playerInfo: PlayerInfo;
    setPlayerInfo: (info: PlayerInfo | ((prev: PlayerInfo) => PlayerInfo)) => void;
    updatePlayerField: <K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => void;
    updateLanguage: (lang: Language) => void;
    updateImage: (image: string | undefined) => void;
    selectedStickerId: string | null;
    setSelectedStickerId: (id: string | null) => void;
}

const STORAGE_KEY = 'ff14-playerInfo';

const defaultPlayerInfo: PlayerInfo = {
    name: '',
    region: 'KR',
    dataCenter: 'Korea',
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
    imagePosition: { x: 0, y: 0, scale: 1 },
    layout: 'header',
    language: 'ko',
    pointColor: '#e44c21',
    stickers: [],
};

function loadPlayerInfo(): PlayerInfo {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultPlayerInfo;
        const parsed = JSON.parse(raw);
        return { ...defaultPlayerInfo, ...parsed };
    } catch {
        return defaultPlayerInfo;
    }
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo>(loadPlayerInfo);
    const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

    // Auto-save to localStorage
    useEffect(() => {
        try {
            // Save without image to avoid localStorage quota issues
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { image: _image, ...rest } = playerInfo;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
        } catch {
            // Silently fail if quota exceeded
        }
    }, [playerInfo]);

    const updatePlayerField = useCallback(<K extends keyof PlayerInfo>(field: K, value: PlayerInfo[K]) => {
        setPlayerInfo(prev => ({ ...prev, [field]: value }));
    }, []);

    const updateLanguage = useCallback((language: Language) => {
        setPlayerInfo(prev => ({ ...prev, language }));
    }, []);

    const updateImage = useCallback((image: string | undefined) => {
        setPlayerInfo(prev => ({ ...prev, image }));
    }, []);

    return (
        <PlayerContext.Provider value={{
            playerInfo,
            setPlayerInfo,
            updatePlayerField,
            updateLanguage,
            updateImage,
            selectedStickerId,
            setSelectedStickerId,
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
}
