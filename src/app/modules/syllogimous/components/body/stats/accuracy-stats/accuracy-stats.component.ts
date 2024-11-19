// src/app/modules/syllogimous/components/body/stats/accuracy-stats/accuracy-stats.component.ts

import { Component, Input } from '@angular/core';
import { Question } from 'src/app/modules/syllogimous/models/question.models';
import { SyllogimousService } from 'src/app/modules/syllogimous/services/syllogimous.service';
import { EnumGameMode } from 'src/app/modules/syllogimous/models/game-modes.models';
import { GameModeService } from 'src/app/modules/syllogimous/services/game-mode.service';

@Component({
    selector: 'app-accuracy-stats',
    templateUrl: './accuracy-stats.component.html',
    styleUrls: ['./accuracy-stats.component.css']
})
export class AccuracyStatsComponent {
    @Input() mode!: EnumGameMode;

    questions: Question[] = [];
    correctQs: Question[] = [];
    incorrectQs: Question[] = [];
    unansweredQs: Question[] = [];
    currentStreak: Question[] = [];
    longestStreak: Question[] = [];

    constructor(
        private sylSrv: SyllogimousService,
        private gameModeService: GameModeService
    ) {}

    ngOnInit() {
        const stats = this.gameModeService.getStats(this.mode);
        this.questions = stats.history;

        this.correctQs = this.questions.filter(q => q.userAnswer !== undefined && q.isValid === q.userAnswer);
        this.incorrectQs = this.questions.filter(q => q.userAnswer !== undefined && q.isValid !== q.userAnswer);
        this.unansweredQs = this.questions.filter(q => q.userAnswer === undefined);

        for (const q of this.questions) {
            if (q.isValid !== q.userAnswer) {
                break;
            }
            this.currentStreak.push(q);
        }

        let streak = [];
        for (const q of this.questions) {
            if (q.isValid !== q.userAnswer) {
                if (streak.length > this.longestStreak.length) {
                    this.longestStreak = streak;
                    streak = [];
                }
                continue;
            }
            streak.push(q);
        }
    }
}