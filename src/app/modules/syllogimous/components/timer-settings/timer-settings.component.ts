// src/app/modules/syllogimous/components/timer-settings/timer-settings.component.ts

import { Component, OnInit } from '@angular/core';
import { GameModeService } from '../../services/game-mode.service';
import { EnumGameMode } from '../../models/game-modes.models';
import { Question } from '../../models/question.models';

@Component({
    selector: 'app-timer-settings',
    template: `
        <div class="card p-3 mb-3">
            <h5>Timer Settings</h5>
            <ng-container *ngIf="currentMode === EnumGameMode.Adaptive">
                <app-timeout-rate-control></app-timeout-rate-control>
            </ng-container>

            <ng-container *ngIf="currentMode === EnumGameMode.Normal">
                <div class="mb-3" *ngFor="let type of problemTypes">
                    <label class="form-label">{{ type.name }} ({{ type.premises }} premises)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" 
                               [value]="getTimeForType(type.key)"
                               (change)="updateTime($event, type.key)"
                               [disabled]="isAdaptiveMode"
                               min="10" step="5">
                        <span class="input-group-text">seconds</span>
                    </div>
                </div>
                <button class="btn btn-outline-secondary" 
                        (click)="resetToDefaults()"
                        [disabled]="isAdaptiveMode">
                    Reset to Defaults
                </button>
            </ng-container>
        </div>
    `
})
export class TimerSettingsComponent implements OnInit {
    EnumGameMode = EnumGameMode;
    currentMode: EnumGameMode;
    problemTypes: Array<{key: string, name: string, premises: number}> = [];

    constructor(private gameModeService: GameModeService) {
        this.currentMode = this.gameModeService.getState().showStatsForMode;
    }

    ngOnInit() {
        // Gather all problem types from history
        const stats = this.gameModeService.getStats(this.currentMode);
        const typeMap = new Map<string, {name: string, premises: number}>();
        
        stats.history.forEach((q: Question) => {
            const key = `${q.type}_${q.premises.length}`;
            if (!typeMap.has(key)) {
                typeMap.set(key, {
                    name: q.type,
                    premises: q.premises.length
                });
            }
        });

        this.problemTypes = Array.from(typeMap.entries())
            .map(([key, value]) => ({
                key,
                name: value.name,
                premises: value.premises
            }))
            .sort((a, b) => a.name.localeCompare(b.name) || a.premises - b.premises);
    }

    get isAdaptiveMode(): boolean {
        return this.currentMode === EnumGameMode.Adaptive;
    }

    getTimeForType(key: string): number {
        const stats = this.gameModeService.getStats(this.currentMode);
        return stats.timerSettings?.timePerProblemType[key] || 
               stats.timerSettings?.defaultTimePerProblemType[key] || 
               60;
    }

    updateTime(event: Event, key: string) {
        const value = +(event.target as HTMLInputElement).value;
        const stats = this.gameModeService.getStats(this.currentMode);
        if (stats.timerSettings) {
            stats.timerSettings.timePerProblemType[key] = value;
            this.gameModeService.updateTimerSettings(this.currentMode, stats.timerSettings);
        }
    }

    resetToDefaults() {
        this.gameModeService.resetTimerSettings(this.currentMode);
    }
}