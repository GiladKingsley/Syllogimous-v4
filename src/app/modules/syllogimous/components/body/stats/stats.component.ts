// src/app/modules/syllogimous/components/body/stats/stats.component.ts

import { Component, OnInit } from "@angular/core";
import { GameModeService } from '../../../services/game-mode.service';
import { EnumGameMode } from '../../../models/game-modes.models';

@Component({
    selector: "app-body-stats",
    template: `
        <div class="d-grid gap-5" style="min-width: 320px;">
            <app-stats-mode-toggle></app-stats-mode-toggle>
            
            <ng-container *ngIf="currentMode !== EnumGameMode.Relaxed">
                <app-timer-settings></app-timer-settings>
            </ng-container>

            <app-tier-stats [mode]="currentMode"></app-tier-stats>
            <app-accuracy-stats [mode]="currentMode"></app-accuracy-stats>
            <app-time-based-stats [mode]="currentMode"></app-time-based-stats>
            <app-type-based-stats [mode]="currentMode"></app-type-based-stats>
            <app-error-analysis [mode]="currentMode"></app-error-analysis>
        </div>
    `
})
export class BodyStatsComponent implements OnInit {
    EnumGameMode = EnumGameMode;
    currentMode: EnumGameMode;

    constructor(private gameModeService: GameModeService) {
        this.currentMode = this.gameModeService.getState().showStatsForMode;
    }

    ngOnInit() {
        this.gameModeService.state$.subscribe(state => {
            this.currentMode = state.showStatsForMode;
        });
    }
}