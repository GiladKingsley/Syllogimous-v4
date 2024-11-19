// src/app/modules/syllogimous/components/body/stats/error-analysis/error-analysis.component.ts

import { Component, Input } from '@angular/core';
import { Question } from 'src/app/modules/syllogimous/models/question.models';
import { SyllogimousService } from 'src/app/modules/syllogimous/services/syllogimous.service';
import { EnumGameMode } from 'src/app/modules/syllogimous/models/game-modes.models';
import { GameModeService } from 'src/app/modules/syllogimous/services/game-mode.service';

@Component({
    selector: 'app-error-analysis',
    templateUrl: './error-analysis.component.html',
    styleUrls: ['./error-analysis.component.css']
})
export class ErrorAnalysisComponent {
    @Input() mode!: EnumGameMode;
    
    questions: Question[] = [];
    mostCommonMistake = "No Mistakes Yet";
    leastCommonMistake = "No Mistakes Yet";

    constructor(
        private sylSrv: SyllogimousService,
        private gameModeService: GameModeService
    ) {}

    ngOnInit() {
        const stats = this.gameModeService.getStats(this.mode);
        this.questions = stats.history;

        const typeMistakesCount: Record<string, number> = {};
        this.questions
            .filter(q => q.userAnswer !== q.isValid)
            .forEach(q => {
                typeMistakesCount[q.type] = typeMistakesCount[q.type] || 0;
                typeMistakesCount[q.type]++;
            });
        const sorted = Object.entries(typeMistakesCount).sort((a, b) => a[1] - b[1]);
        if (sorted.length) {
            this.mostCommonMistake = sorted[sorted.length - 1][0];
            this.leastCommonMistake = sorted[0][0];
        }
    }
}