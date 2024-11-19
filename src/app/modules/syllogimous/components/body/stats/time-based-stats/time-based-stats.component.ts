// src/app/modules/syllogimous/components/body/stats/time-based-stats/time-based-stats.component.ts

import { Component, Input } from '@angular/core';
import { Question } from 'src/app/modules/syllogimous/models/question.models';
import { SyllogimousService } from 'src/app/modules/syllogimous/services/syllogimous.service';
import { formatTime } from 'src/app/utils/date';
import { EnumGameMode } from 'src/app/modules/syllogimous/models/game-modes.models';
import { GameModeService } from 'src/app/modules/syllogimous/services/game-mode.service';

@Component({
    selector: 'app-time-based-stats',
    templateUrl: './time-based-stats.component.html',
    styleUrls: ['./time-based-stats.component.css']
})
export class TimeBasedStatsComponent {
    @Input() mode!: EnumGameMode;
    
    formatTime = formatTime;
    questions: Question[] = [];
    totalPlayTime = 0;
    avgAnswer = 0;
    fastestAnswer = 0;
    slowestAnswer = 0;
    timeBasedStats: Record<string, any> = {};

    constructor(
        private sylSrv: SyllogimousService,
        private gameModeService: GameModeService
    ) {}

    ngOnInit() {
        const stats = this.gameModeService.getStats(this.mode);
        this.questions = stats.history;

        for (const q of this.questions) {
            const ps = q.premises.length;
            this.timeBasedStats[ps] = this.timeBasedStats[ps] || {
                sum: 0,
                count: 0,
                fastest: 0,
                slowest: 0,
            };

            const dt = q.answeredAt - q.createdAt;
            this.totalPlayTime += dt;

            this.timeBasedStats[ps].sum += dt;
            this.timeBasedStats[ps].count += 1;

            if (q.userAnswer !== undefined) {
                if (this.fastestAnswer === 0 || dt < this.fastestAnswer) {
                    this.fastestAnswer = dt;
                }
                if (this.slowestAnswer === 0 || dt > this.slowestAnswer) {
                    this.slowestAnswer = dt;
                }

                if (this.timeBasedStats[ps].fastest === 0 || dt < this.timeBasedStats[ps].fastest) {
                    this.timeBasedStats[ps].fastest = dt;
                }
                if (this.timeBasedStats[ps].slowest === 0 || dt > this.timeBasedStats[ps].slowest) {
                    this.timeBasedStats[ps].slowest = dt;
                }
            }
        }
    }
}