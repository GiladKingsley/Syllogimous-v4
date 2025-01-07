import { EnumQuestionType } from "../constants/question.constants";

export interface IQuestionAttempt {
    isCorrect: boolean;
    timestamp: number;
    difficulty: number;
}

export interface IDifficultyLevel {
    currentDifficulty: number;
    lastAttempts: IQuestionAttempt[];
}

export class AdaptiveDifficulty {
    private static readonly HISTORY_SIZE = 10;
    private static readonly REQUIRED_CORRECT_FOR_LEVEL_UP = 9;    // Need 9 correct out of 10
    private static readonly MAX_INCORRECT_BEFORE_LEVEL_DOWN = 4;  // 4 incorrect answers triggers level down
    private static readonly MIN_DIFFICULTY = 2;
    private static readonly MAX_DIFFICULTY = 20;

    // Track difficulty and history per question type
    private difficultyLevels: Record<EnumQuestionType, IDifficultyLevel> = {} as any;

    constructor() {
        // Initialize all question types with minimum difficulty
        Object.values(EnumQuestionType).forEach(type => {
            this.difficultyLevels[type] = {
                currentDifficulty: AdaptiveDifficulty.MIN_DIFFICULTY,
                lastAttempts: []
            };
        });
    }

    /**
     * Record a question attempt and adjust difficulty if needed
     */
    public recordAttempt(type: EnumQuestionType, isCorrect: boolean): void {
        const level = this.difficultyLevels[type];
        console.log('Before recording:', type, {
            currentDifficulty: level.currentDifficulty,
            attempts: level.lastAttempts.length,
            correctCount: level.lastAttempts.filter(a => a.isCorrect).length
        });
        
        // Add new attempt
        level.lastAttempts.push({
            isCorrect,
            timestamp: Date.now(),
            difficulty: level.currentDifficulty
        });
    
        // Keep only last HISTORY_SIZE attempts at current difficulty
        level.lastAttempts = level.lastAttempts
            .filter(attempt => attempt.difficulty === level.currentDifficulty)
            .slice(-AdaptiveDifficulty.HISTORY_SIZE);
    
        // Only evaluate if we have enough history at current difficulty
        if (level.lastAttempts.length >= AdaptiveDifficulty.HISTORY_SIZE) {
            console.log('Evaluating difficulty for', type, 'with', level.lastAttempts.length, 'attempts');
            this.evaluateDifficulty(type);
        }
        
        console.log('After recording:', type, {
            currentDifficulty: level.currentDifficulty,
            attempts: level.lastAttempts.length,
            correctCount: level.lastAttempts.filter(a => a.isCorrect).length
        });
    }
    
    /**
     * Get current difficulty for a question type
     */
    public getDifficulty(type: EnumQuestionType): number {
        return this.difficultyLevels[type].currentDifficulty;
    }

    /**
     * Get full difficulty data for storage/restoration
     */
    public getDifficultyData(): Record<EnumQuestionType, IDifficultyLevel> {
        return {...this.difficultyLevels};
    }

    /**
     * Restore difficulty data (e.g. from localStorage)
     */
    public restoreDifficultyData(data: Record<EnumQuestionType, IDifficultyLevel>): void {
        this.difficultyLevels = {...data};
    }

    private evaluateDifficulty(type: EnumQuestionType): void {
        const level = this.difficultyLevels[type];
        const correctCount = level.lastAttempts.filter(a => a.isCorrect).length;
        const incorrectCount = level.lastAttempts.length - correctCount;
        
        // Check for consecutive correct answers for immediate level up
        const lastNine = level.lastAttempts.slice(-9);
        const nineConsecutiveCorrect = lastNine.length === 9 && lastNine.every(a => a.isCorrect);

        // Level up conditions: either 9 consecutive correct or 9 out of 10 total correct
        if (nineConsecutiveCorrect || 
            (level.lastAttempts.length >= AdaptiveDifficulty.HISTORY_SIZE && 
             correctCount >= AdaptiveDifficulty.REQUIRED_CORRECT_FOR_LEVEL_UP)) {
            if (level.currentDifficulty < AdaptiveDifficulty.MAX_DIFFICULTY) {
                console.log(`Leveling UP ${type} from ${level.currentDifficulty} to ${level.currentDifficulty + 1} - ${nineConsecutiveCorrect ? 'got 9 consecutive correct!' : `got ${correctCount} correct out of ${level.lastAttempts.length}`}`);
                level.currentDifficulty++;
                level.lastAttempts = []; // Reset history after difficulty change
            }
        }
        // Level down if too many incorrect answers
        else if (incorrectCount >= AdaptiveDifficulty.MAX_INCORRECT_BEFORE_LEVEL_DOWN) {
            if (level.currentDifficulty > AdaptiveDifficulty.MIN_DIFFICULTY) {
                console.log(`Leveling DOWN ${type} from ${level.currentDifficulty} to ${level.currentDifficulty - 1} - got ${incorrectCount} incorrect answers`);
                level.currentDifficulty--;
                level.lastAttempts = []; // Reset history after difficulty change
            }
        }
    }

    /**
     * Get completed attempts for all question types
     */
    public getCompletedAttempts(): Record<EnumQuestionType, IQuestionAttempt[]> {
        const attempts: Record<EnumQuestionType, IQuestionAttempt[]> = {} as any;
        Object.entries(this.difficultyLevels).forEach(([type, level]) => {
            attempts[type as EnumQuestionType] = [...level.lastAttempts];
        });
        return attempts;
    }
}