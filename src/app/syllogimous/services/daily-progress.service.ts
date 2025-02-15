import { Injectable } from "@angular/core";
import { LS_DAILY_GOAL, LS_DAILY_PROGRESS, LS_TRAINING_UNIT, LS_WEEKLY_GOAL } from "../constants/local-storage.constants";

export const DEFAULT_DAILY_GOAL = 30;
export const DEFAULT_WEEKLY_GOAL = 120;
export const DEFAULT_TRAINING_UNIT_LENGTH = 10;
export const DEFAULT_LEVEL_UP_THRESHOLD = 0.8;
export const DEFAULT_LEVEL_DOWN_THRESHOLD = 0.6;

@Injectable({
    providedIn: 'root'
})
export class DailyProgressService {
    get DAILY_GOAL() {
        const dailyLS = localStorage.getItem(LS_DAILY_GOAL);
        return Number(dailyLS || DEFAULT_DAILY_GOAL) * 60 * 1000;
    }
    get WEEKLY_GOAL() {
        const weeklyLS = localStorage.getItem(LS_WEEKLY_GOAL);
        return Number(weeklyLS || DEFAULT_WEEKLY_GOAL) * 60 * 1000;
    }

    getToday() {
        return new Date().toISOString().split("T")[0];
    }

    getDailyProgressLS() {
        const lsDailyProgress = localStorage.getItem(LS_DAILY_PROGRESS);
        if (!lsDailyProgress) {
            return {};
        }
        return JSON.parse(lsDailyProgress) as Record<string, number>;
    }

    setDailyProgressLS(isoDate: string, ms: number) {
        const dailyProgress = this.getDailyProgressLS();
        dailyProgress[isoDate] = dailyProgress[isoDate] || 0;
        dailyProgress[isoDate] += ms;
        localStorage.setItem(LS_DAILY_PROGRESS, JSON.stringify(dailyProgress));
    }

    calcDailyProgress(isoDate: string) {
        return Math.max(0, Math.min(100, Math.floor(100 * (this.getDailyProgressLS()[isoDate] || 0) / this.DAILY_GOAL)));
    }

    getWeekStartDate(isoDate: string) {
        const date = new Date(isoDate);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff)).toISOString().split('T')[0];
    }

    calcWeeklyProgress(isoDate: string) {
        const weekStartDate = this.getWeekStartDate(isoDate);
        const dailyProgress = this.getDailyProgressLS();
        let weeklyTotal = 0;
        
        // Sum up all days in the week
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStartDate);
            date.setDate(date.getDate() + i);
            const currentDate = date.toISOString().split('T')[0];
            weeklyTotal += dailyProgress[currentDate] || 0;
        }

        return Math.max(0, Math.min(100, Math.floor(100 * weeklyTotal / this.WEEKLY_GOAL)));
    }

    getTimePlayed(isoDate: string) {
        return this.getDailyProgressLS()[isoDate] || 0;
    }
    
    getTimePlayedThisWeek(isoDate: string) {
        const weekStartDate = this.getWeekStartDate(isoDate);
        const dailyProgress = this.getDailyProgressLS();
        let weeklyTotal = 0;
        
        // Sum up all days in the week
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStartDate);
            date.setDate(date.getDate() + i);
            const currentDate = date.toISOString().split('T')[0];
            weeklyTotal += dailyProgress[currentDate] || 0;
        }
    
        return weeklyTotal;
    }

    getTrainingUnitLS() {
        const ls = localStorage.getItem(LS_TRAINING_UNIT);
        if (!ls) {
            return { right: 0, timeout: 0, wrong: 0 };
        }
        return JSON.parse(ls) as { right: number, timeout: number, wrong: number };
    }

    updateTrainingUnitLS(right: number, timeout: number, wrong: number) {
        const trainingUnit = this.getTrainingUnitLS();
        trainingUnit.right += right;
        trainingUnit.timeout += timeout;
        trainingUnit.wrong += wrong;
        localStorage.setItem(LS_TRAINING_UNIT, JSON.stringify(trainingUnit));
    }

    resetTrainingUnitLS() {
        localStorage.setItem(LS_TRAINING_UNIT, JSON.stringify({ right: 0, timeout: 0, wrong: 0 }));
    }

    calcTrainingUnitsPercentage() {
        const { right, timeout, wrong } = this.getTrainingUnitLS();
        const rightPerc = Math.max(0, Math.min(1, right / DEFAULT_TRAINING_UNIT_LENGTH)) * 100;
        const timeoutPerc = Math.max(0, Math.min(1, timeout / DEFAULT_TRAINING_UNIT_LENGTH)) * 100;
        const wrongPerc = Math.max(0, Math.min(1, wrong / DEFAULT_TRAINING_UNIT_LENGTH)) * 100;
        return {
            right,
            rightPerc,
            timeout,
            timeoutPerc,
            wrong,
            wrongPerc
        };
    }
}