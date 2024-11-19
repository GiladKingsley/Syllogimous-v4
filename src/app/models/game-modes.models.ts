// src/app/modules/syllogimous/models/game-modes.models.ts

import { Question } from '@app/modules/syllogimous/models/question.models';
export enum EnumGameMode {
    Relaxed = "Relaxed",
    Normal = "Normal", 
    Adaptive = "Adaptive"
}

export const MODE_TIER_NAMES: Record<EnumGameMode, string[]> = {
    [EnumGameMode.Relaxed]: [
        'Novice', 'Learner', 'Student', 'Scholar', 'Thinker', 'Philosopher',
        'Sage', 'Mentor', 'Guide', 'Teacher', 'Master', 'Enlightened'
    ],
    [EnumGameMode.Normal]: [
        'Apprentice', 'Initiate', 'Adept', 'Expert', 'Virtuoso', 'Champion',
        'Elite', 'Master', 'Grandmaster', 'Legend', 'Mythical', 'Transcendent'
    ],
    [EnumGameMode.Adaptive]: [
        'Seeker', 'Explorer', 'Discoverer', 'Pioneer', 'Innovator', 'Inventor',
        'Creator', 'Visionary', 'Luminary', 'Oracle', 'Sage', 'Ascendant'
    ]
};

export interface TimerSettings {
    targetTimeoutRate: number;
    timePerProblemType: Record<string, number>;
    defaultTimePerProblemType: Record<string, number>;
}

export interface SmartTimerData {
    rounds: Array<{
        questionType: string;
        premises: number;
        timeTaken: number;
        wasTimeout: boolean;
        timestamp: number;
    }>;
    consecutiveTimeouts: number;
    currentTimeoutRate: number;
}

export interface GameModeStats {
    mode: EnumGameMode;
    tier: string;
    score: number;
    timerSettings?: TimerSettings;
    smartTimerData?: SmartTimerData;
    history: Question[];
}

export interface GameModeState {
    activeMode: EnumGameMode;
    stats: Record<EnumGameMode, GameModeStats>;
    showStatsForMode: EnumGameMode;
}