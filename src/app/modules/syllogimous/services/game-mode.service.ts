// src/app/modules/syllogimous/services/game-mode.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EnumGameMode, GameModeState, GameModeStats, TimerSettings, MODE_TIER_NAMES } from '../models/game-modes.models';
import { Question } from '../models/question.models';

@Injectable({
    providedIn: 'root'
})
export class GameModeService {
    private readonly SMART_TIMER_WINDOW_SIZE = 30;
    private readonly DEFAULT_TARGET_TIMEOUT_RATE = 0.15;
    private readonly DEFAULT_TIME_ADJUSTMENT_FACTOR = 1.2;
    private readonly DEFAULT_TIME = 60;

    private state: GameModeState = {
        activeMode: EnumGameMode.Relaxed,
        stats: {
            [EnumGameMode.Relaxed]: {
                mode: EnumGameMode.Relaxed,
                tier: MODE_TIER_NAMES[EnumGameMode.Relaxed][0],
                score: 0,
                history: []
            },
            [EnumGameMode.Normal]: {
                mode: EnumGameMode.Normal,
                tier: MODE_TIER_NAMES[EnumGameMode.Normal][0],
                score: 0,
                history: [],
                timerSettings: {
                    targetTimeoutRate: 0,
                    timePerProblemType: {},
                    defaultTimePerProblemType: {}
                }
            },
            [EnumGameMode.Adaptive]: {
                mode: EnumGameMode.Adaptive,
                tier: MODE_TIER_NAMES[EnumGameMode.Adaptive][0],
                score: 0,
                history: [],
                timerSettings: {
                    targetTimeoutRate: this.DEFAULT_TARGET_TIMEOUT_RATE,
                    timePerProblemType: {},
                    defaultTimePerProblemType: {}
                },
                smartTimerData: {
                    rounds: [],
                    consecutiveTimeouts: 0,
                    currentTimeoutRate: 0
                }
            }
        },
        showStatsForMode: EnumGameMode.Relaxed
    };

    private stateSubject = new BehaviorSubject<GameModeState>(this.state);
    state$ = this.stateSubject.asObservable();

    constructor() {
        this.loadState();
    }

    private loadState() {
        const savedState = localStorage.getItem('gameModeState');
        if (savedState) {
            this.state = JSON.parse(savedState);
            this.stateSubject.next(this.state);
        }
    }

    private saveState() {
        localStorage.setItem('gameModeState', JSON.stringify(this.state));
        this.stateSubject.next(this.state);
    }

    setActiveMode(mode: EnumGameMode) {
        this.state.activeMode = mode;
        this.saveState();
    }

    setStatsViewMode(mode: EnumGameMode) {
        this.state.showStatsForMode = mode;
        this.saveState();
    }

    updateTimerSettings(mode: EnumGameMode, settings: Partial<TimerSettings>) {
        if (this.state.stats[mode].timerSettings) {
            this.state.stats[mode].timerSettings = {
                ...this.state.stats[mode].timerSettings!,
                ...settings
            };
            this.saveState();
        }
    }

    private initializeDefaultTime(questionType: string, premises: number) {
        const key = `${questionType}_${premises}`;
        const normalSettings = this.state.stats[EnumGameMode.Normal].timerSettings!;
        if (!normalSettings.defaultTimePerProblemType[key]) {
            normalSettings.defaultTimePerProblemType[key] = this.DEFAULT_TIME;
            this.saveState();
        }
        return normalSettings.defaultTimePerProblemType[key];
    }

    getTimeForQuestion(question: Question): number | null {
        const mode = this.state.activeMode;
        if (mode === EnumGameMode.Relaxed) {
            return null;
        }

        const key = `${question.type}_${question.premises.length}`;
        const defaultTime = this.initializeDefaultTime(question.type, question.premises.length);

        if (mode === EnumGameMode.Normal) {
            return defaultTime;
        }

        // Adaptive mode
        const adaptiveSettings = this.state.stats[EnumGameMode.Adaptive].timerSettings!;
        return adaptiveSettings.timePerProblemType[key] || defaultTime;
    }

    recordQuestionResult(question: Question, timeTaken: number, wasTimeout: boolean) {
        const mode = this.state.activeMode;
        
        // Record in mode-specific history
        this.state.stats[mode].history.push({
            ...question,
            createdAt: Date.now(),
            answeredAt: Date.now() + timeTaken
        });

        // Initialize default time if not set
        this.initializeDefaultTime(question.type, question.premises.length);

        if (mode === EnumGameMode.Adaptive) {
            this.updateSmartTimer(question, timeTaken, wasTimeout);
        }

        this.saveState();
    }

    private updateSmartTimer(question: Question, timeTaken: number, wasTimeout: boolean) {
        const stats = this.state.stats[EnumGameMode.Adaptive];
        const data = stats.smartTimerData!;
        const settings = stats.timerSettings!;

        // Add new round data
        const roundData = {
            questionType: question.type,
            premises: question.premises.length,
            timeTaken,
            wasTimeout,
            timestamp: Date.now()
        };

        // Update rounds array
        data.rounds.push(roundData);
        if (data.rounds.length > this.SMART_TIMER_WINDOW_SIZE) {
            data.rounds.shift();
        }

        // Update consecutive timeouts
        data.consecutiveTimeouts = wasTimeout ? data.consecutiveTimeouts + 1 : 0;

        // Calculate current timeout rate for this specific question type/premises
        const relevantRounds = data.rounds.filter(r => 
            r.questionType === question.type && 
            r.premises === question.premises.length
        );
        const timeouts = relevantRounds.filter(r => r.wasTimeout).length;
        data.currentTimeoutRate = timeouts / relevantRounds.length;

        // Adjust timer if needed
        const key = `${question.type}_${question.premises.length}`;
        const defaultTime = this.state.stats[EnumGameMode.Normal].timerSettings!.defaultTimePerProblemType[key];
        let currentTime = settings.timePerProblemType[key] || defaultTime;

        if (data.consecutiveTimeouts >= 3 || data.currentTimeoutRate > settings.targetTimeoutRate) {
            currentTime *= this.DEFAULT_TIME_ADJUSTMENT_FACTOR;
        } else if (data.currentTimeoutRate < settings.targetTimeoutRate / 2 && relevantRounds.length >= 5) {
            currentTime *= 0.95;
        }

        // Store adjusted time only in adaptive mode
        settings.timePerProblemType[key] = currentTime;
    }

    resetTimerSettings(mode: EnumGameMode) {
        if (mode === EnumGameMode.Normal) {
            // Reset to default fixed times
            Object.keys(this.state.stats[mode].timerSettings!.defaultTimePerProblemType).forEach(key => {
                this.state.stats[mode].timerSettings!.defaultTimePerProblemType[key] = this.DEFAULT_TIME;
            });
        } else if (mode === EnumGameMode.Adaptive) {
            // Reset adaptive timers to match normal mode defaults
            this.state.stats[mode].timerSettings!.timePerProblemType = {
                ...this.state.stats[EnumGameMode.Normal].timerSettings!.defaultTimePerProblemType
            };
            // Reset smart timer data
            this.state.stats[mode].smartTimerData = {
                rounds: [],
                consecutiveTimeouts: 0,
                currentTimeoutRate: 0
            };
        }
        this.saveState();
    }

    getStats(mode: EnumGameMode): GameModeStats {
        return this.state.stats[mode];
    }

    getState(): GameModeState {
        return this.state;
    }
}