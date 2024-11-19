// src/app/modules/syllogimous/components/body/stats/type-based-stats/type-based-stats.component.ts

import { Component, Input } from '@angular/core';
import { Question } from 'src/app/modules/syllogimous/models/question.models';
import { StatsService } from 'src/app/modules/syllogimous/services/stats.service';
import { SyllogimousService } from 'src/app/modules/syllogimous/services/syllogimous.service';
import { EnumGameMode } from 'src/app/modules/syllogimous/models/game-modes.models';
import { GameModeService } from 'src/app/modules/syllogimous/services/game-mode.service';

@Component({
    selector: 'app-type-based-stats',
    templateUrl: './type-based-stats.component.html',
    styleUrls: ['./type-based-stats.component.css']
})
export class TypeBasedStatsComponent {
    @Input() mode!: EnumGameMode;
    
    typeBasedStats: Record<string, any> = {};
    types: string[] = [];

    constructor(
        public sylSrv: SyllogimousService,
        public statsService: StatsService,
        private gameModeService: GameModeService
    ) { }

    ngOnInit() {
        const stats = this.gameModeService.getStats(this.mode);
        this.processStats(stats.history);
    }

    private processStats(questions: Question[]) {
        this.types = [...new Set(questions.map(q => q.type))];
        this.typeBasedStats = {};

        this.types.forEach(type => {
            const typeQuestions = questions.filter(q => q.type === type);
            const completed = typeQuestions.length;
            const correct = typeQuestions.filter(q => q.userAnswer === q.isValid).length;

            this.typeBasedStats[type] = {
                type,
                completed,
                accuracy: completed ? correct / completed : 0,
                stats: {}
            };

            // Process timing stats per number of premises
            typeQuestions.forEach(q => {
                const ps = q.premises.length;
                this.typeBasedStats[type].stats[ps] = this.typeBasedStats[type].stats[ps] || {
                    sum: 0,
                    count: 0,
                    fastest: 0,
                    slowest: 0,
                };

                const dt = q.answeredAt - q.createdAt;
                this.typeBasedStats[type].stats[ps].sum += dt;
                this.typeBasedStats[type].stats[ps].count += 1;

                if (q.userAnswer !== undefined) {
                    if (this.typeBasedStats[type].stats[ps].fastest === 0 
                        || dt < this.typeBasedStats[type].stats[ps].fastest) {
                        this.typeBasedStats[type].stats[ps].fastest = dt;
                    }
                    if (this.typeBasedStats[type].stats[ps].slowest === 0 
                        || dt > this.typeBasedStats[type].stats[ps].slowest) {
                        this.typeBasedStats[type].stats[ps].slowest = dt;
                    }
                }
            });
        });
    }
}