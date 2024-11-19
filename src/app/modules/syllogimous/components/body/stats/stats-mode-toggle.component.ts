// src/app/modules/syllogimous/components/body/stats/stats-mode-toggle.component.ts

import { Component } from '@angular/core';
import { EnumGameMode } from '../../../models/game-modes.models';
import { GameModeService } from '../../../services/game-mode.service';

@Component({
    selector: 'app-stats-mode-toggle',
    template: `
        <div class="card p-3 mb-4">
            <div class="form-group">
                <label class="form-label">View Stats For:</label>
                <div class="btn-group w-100" role="group">
                    <input type="radio" class="btn-check" name="statsMode" id="relaxedStats" 
                           [value]="EnumGameMode.Relaxed" [(ngModel)]="currentStatsMode"
                           (change)="onModeChange()">
                    <label class="btn btn-outline-primary" for="relaxedStats">
                        Relaxed
                    </label>

                    <input type="radio" class="btn-check" name="statsMode" id="normalStats" 
                           [value]="EnumGameMode.Normal" [(ngModel)]="currentStatsMode"
                           (change)="onModeChange()">
                    <label class="btn btn-outline-primary" for="normalStats">
                        Normal
                    </label>

                    <input type="radio" class="btn-check" name="statsMode" id="adaptiveStats" 
                           [value]="EnumGameMode.Adaptive" [(ngModel)]="currentStatsMode"
                           (change)="onModeChange()">
                    <label class="btn btn-outline-primary" for="adaptiveStats">
                        Adaptive
                    </label>
                </div>
            </div>
        </div>
    `
})
export class StatsModeToggleComponent {
    EnumGameMode = EnumGameMode;
    currentStatsMode: EnumGameMode;

    constructor(private gameModeService: GameModeService) {
        this.currentStatsMode = this.gameModeService.getState().showStatsForMode;
    }

    onModeChange() {
        this.gameModeService.setStatsViewMode(this.currentStatsMode);
    }
}