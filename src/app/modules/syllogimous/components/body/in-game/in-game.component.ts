// src/app/modules/syllogimous/components/body/in-game/in-game.component.ts

import { Component, OnDestroy, OnInit } from "@angular/core";
import { SyllogimousService } from "../../../services/syllogimous.service";
import { StatsService } from "../../../services/stats.service";
import { GameModeService } from "../../../services/game-mode.service";
import { EnumGameMode } from "../../../models/game-modes.models";

@Component({
    selector: "app-body-in-game",
    templateUrl: "./in-game.component.html",
    styleUrls: ["./in-game.component.css"]
})
export class BodyInGameComponent implements OnInit, OnDestroy {
    timerFull = 0;
    timerLeft = 0;
    timer: any;
    showTimer = false;

    constructor(
        public sylSrv: SyllogimousService,
        private statsService: StatsService,
        private gameModeService: GameModeService
    ) { }

    ngOnInit() {
        const currentMode = this.gameModeService.getState().activeMode;
        
        // Only handle timer for non-Relaxed modes
        if (currentMode === EnumGameMode.Relaxed) {
            return;
        }

        // Get time from game mode service
        const time = this.gameModeService.getTimeForQuestion(this.sylSrv.question);
        
        if (time !== null) {
            this.showTimer = true;
            this.timerFull = time;
            this.timerLeft = time;
            
            this.timer = setInterval(() => {
                this.timerLeft -= 1;
                if (this.timerLeft < 0) {
                    this.sylSrv.checkQuestion();
                }
            }, 1000);
            console.log("start timer", this.timer, "with time", this.timerFull);
        }
    }

    ngOnDestroy() {
        if (this.timer) {
            console.log("end timer", this.timer, "with time", this.timerLeft);
            clearInterval(this.timer);
        }
    }
}