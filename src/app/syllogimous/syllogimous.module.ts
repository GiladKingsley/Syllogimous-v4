import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SyllogimousComponent } from './syllogimous.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalLevelChangeComponent } from './components/modal-level-change/modal-level-change.component';
import { CardComponent } from './components/card/card.component';
import { IntroComponent } from './pages/intro/intro.component';
import { StartComponent } from './pages/start/start.component';
import { TutorialComponent } from './pages/tutorial/tutorial.component';
import { HistoryComponent } from './pages/history/history.component';
import { GameComponent } from './pages/game/game.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { StatsComponent } from './pages/stats/stats.component';
import { TutorialsComponent } from './pages/tutorials/tutorials.component';
import { TutorialDistinctionComponent } from './pages/tutorial/distinction/distinction.component';
import { TutorialSyllogismComponent } from './pages/tutorial/syllogism/syllogism.component';
import { TutorialComparisonNumericalComponent } from './pages/tutorial/comparison-numerical/comparison-numerical.component';
import { TutorialComparisonChronologicalComponent } from './pages/tutorial/comparison-chronological/comparison-chronological.component';
import { TutorialDirectionComponent } from './pages/tutorial/direction/direction.component';
import { TutorialDirection3DSpatialComponent } from './pages/tutorial/direction3D-spatial/direction3D-spatial.component';
import { TutorialDirection3DTemporalComponent } from './pages/tutorial/direction3D-temporal/direction3D-temporal.component';
import { TutorialAnalogyComponent } from './pages/tutorial/analogy/analogy.component';
import { TutorialBinaryComponent } from './pages/tutorial/binary/binary.component';
import { TutorialLinearArrangementComponent } from './pages/tutorial/linear-arrangement/linear-arrangement.component';
import { TutorialCircularArrangementComponent } from './pages/tutorial/circular-arrangement/circular-arrangement.component';
import { AccuracyStatsComponent } from './pages/stats/accuracy-stats/accuracy-stats.component';
import { ErrorAnalysisComponent } from './pages/stats/error-analysis/error-analysis.component';
import { TierStatsComponent } from './pages/stats/tier-stats/tier-stats.component';
import { TimeBasedStatsComponent } from './pages/stats/time-based-stats/time-based-stats.component';
import { TypeBasedStatsComponent } from './pages/stats/type-based-stats/type-based-stats.component';
import { StatsExportService } from './services/stats-export.service';
import { CardDropdownComponent } from './components/card/card-dropdown/card-dropdown.component';
import { TimerChooseComponent } from './pages/settings/timer-choose/timer-choose.component';
import { PlaygroundModeComponent } from './pages/playground-mode/playground-mode.component';
import { DailyProgressComponent } from './components/progress-and-performance/progress-and-performance.component';
import { GameModeChooseComponent } from './pages/settings/game-mode-choose/game-mode-choose.component';
import { EnumQuestionType } from './constants/question.constants';
import { EnumScreens } from './constants/syllogimous.constants';
import { TiersMatrixComponent } from './pages/tiers-matrix/tiers-matrix.component';
import { OtherGamesComponent } from './pages/other-games/other-games.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TutorialGraphMatchingComponent } from './pages/tutorial/graph-matching/graph-matching.component';
import { DataTransferService } from './services/data-transfer.service';
import { ImportConfirmationModalComponent } from './components/import-confirmation-modal/import-confirmation-modal.component';

const routes: Routes = [
    {
        path: '',
        component: SyllogimousComponent,
        children: [
            { path: "", redirectTo: EnumScreens.Intro, pathMatch: "full" },
            { path: EnumScreens.Intro, component: IntroComponent },
            { path: EnumScreens.Start, component: StartComponent },
            { path: EnumScreens.Game, component: GameComponent },
            { path: EnumScreens.Stats, component: StatsComponent },
            { path: EnumScreens.History, component: HistoryComponent },
            { path: EnumScreens.Feedback, component: FeedbackComponent },
            { path: EnumScreens.Settings, component: SettingsComponent },
            { path: EnumScreens.Tutorials, component: TutorialsComponent },
            {
                path: EnumScreens.Tutorial,
                component: TutorialComponent,
                children: [
                    { path: EnumQuestionType.Distinction, component: TutorialDistinctionComponent },
                    { path: EnumQuestionType.ComparisonNumerical, component: TutorialComparisonNumericalComponent },
                    { path: EnumQuestionType.ComparisonChronological, component: TutorialComparisonChronologicalComponent },
                    { path: EnumQuestionType.Syllogism, component: TutorialSyllogismComponent },
                    { path: EnumQuestionType.LinearArrangement, component: TutorialLinearArrangementComponent },
                    { path: EnumQuestionType.CircularArrangement, component: TutorialCircularArrangementComponent },
                    { path: EnumQuestionType.Direction, component: TutorialDirectionComponent },
                    { path: EnumQuestionType.Direction3DSpatial, component: TutorialDirection3DSpatialComponent },
                    { path: EnumQuestionType.Direction3DTemporal, component: TutorialDirection3DTemporalComponent },
                    { path: EnumQuestionType.GraphMatching, component: TutorialGraphMatchingComponent },
                    { path: EnumQuestionType.Analogy, component: TutorialAnalogyComponent },
                    { path: EnumQuestionType.Binary, component: TutorialBinaryComponent },
                ]
            },
            { path: EnumScreens.TiersMatrix, component: TiersMatrixComponent },
            { path: EnumScreens.PlaygroundMode, component: PlaygroundModeComponent },
            { path: EnumScreens.OtherGames, component: OtherGamesComponent },
        ]
    }
];

@NgModule({
    declarations: [
        SyllogimousComponent,
        CardComponent,
        ModalLevelChangeComponent,
        IntroComponent,
        StartComponent,
        HistoryComponent,
        GameComponent,
        FeedbackComponent,
        TutorialsComponent,
        TutorialComponent,
        TutorialDistinctionComponent,
        TutorialComparisonNumericalComponent,
        TutorialComparisonChronologicalComponent,
        TutorialSyllogismComponent,
        TutorialLinearArrangementComponent,
        TutorialCircularArrangementComponent,
        TutorialDirectionComponent,
        TutorialDirection3DSpatialComponent,
        TutorialDirection3DTemporalComponent,
        TutorialGraphMatchingComponent,
        TutorialAnalogyComponent,
        TutorialBinaryComponent,
        StatsComponent,
        AccuracyStatsComponent,
        ErrorAnalysisComponent,
        TierStatsComponent,
        TimeBasedStatsComponent,
        TypeBasedStatsComponent,
        CardDropdownComponent,
        PlaygroundModeComponent,
        TimerChooseComponent,
        DailyProgressComponent,
        GameModeChooseComponent,
        TiersMatrixComponent,
        OtherGamesComponent,
        SettingsComponent,
        ImportConfirmationModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    providers: [
        StatsExportService,
        DataTransferService
    ]
})
export class SyllogimousModule { }