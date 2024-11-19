// src/app/modules/syllogimous/components/timer-settings/timeout-rate-control.component.ts

import { Component, OnInit } from '@angular/core';
import { GameModeService } from '../../services/game-mode.service';
import { EnumGameMode } from '../../models/game-modes.models';

@Component({
    selector: 'app-timeout-rate-control',
    template: `
        <div class="card p-3 mb-3">
            <h5>Adaptive Timer Settings</h5>
            <div class="mb-3">
                <label class="form-label">Target Timeout Rate (%):</label>
                <input type="number" class="form-control" 
                       [value]="targetTimeoutRate * 100"
                       (change)="updateTargetRate($event)"
                       min="5" max="30" step="5">
                <small class="text-muted">
                    The system will adjust timers to achieve approximately this percentage of timeouts.
                    Default is 15%.
                </small>
            </div>
            <div class="mb-3">
                <label class="form-label">Current Timeout Rate:</label>
                <div>{{ (currentTimeoutRate * 100).toFixed(1) }}%</div>
            </div>
            <button class="btn btn-outline-secondary" 
                    (click)="resetToDefault()">
                Reset to Default
            </button>
        </div>
    `
})
export class TimeoutRateControlComponent implements OnInit {
    targetTimeoutRate = 0.15;
    currentTimeoutRate = 0;

    constructor(private gameModeService: GameModeService) {}

    ngOnInit() {
        const stats = this.gameModeService.getStats(EnumGameMode.Adaptive);
        if (stats.timerSettings) {
            this.targetTimeoutRate = stats.timerSettings.targetTimeoutRate;
        }
        if (stats.smartTimerData) {
            this.currentTimeoutRate = stats.smartTimerData.currentTimeoutRate;
        }
    }

    updateTargetRate(event: Event) {
        const value = +(event.target as HTMLInputElement).value;
        this.targetTimeoutRate = value / 100;
        this.gameModeService.updateTimerSettings(EnumGameMode.Adaptive, {
            targetTimeoutRate: this.targetTimeoutRate
        });
    }

    resetToDefault() {
        this.targetTimeoutRate = 0.15;
        this.gameModeService.updateTimerSettings(EnumGameMode.Adaptive, {
            targetTimeoutRate: 0.15
        });
    }
}