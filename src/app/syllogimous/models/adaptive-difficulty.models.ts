import { EnumQuestionType } from "../constants/question.constants";

export interface IQuestionAttempt {
    isCorrect: boolean;
    isTimeout: boolean;  // New field to track timeouts
    timestamp: number;
    difficulty: number;
}

export interface IDifficultyLevel {
    currentDifficulty: number;
    lastAttempts: IQuestionAttempt[];
}

export class AdaptiveDifficulty {
    private static readonly HISTORY_SIZE = 10;
    private static readonly REQUIRED_CORRECT_FOR_LEVEL_UP = 9;
    private static readonly MAX_INCORRECT_BEFORE_LEVEL_DOWN = 4;
    private static readonly MIN_DIFFICULTY = 2;
    private static readonly MAX_DIFFICULTY = 20;
    private static readonly TIMEOUT_WEIGHT = 0.5;  // Each timeout counts as half correct/incorrect

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
    public recordAttempt(type: EnumQuestionType, isCorrect: boolean, isTimeout: boolean = false): void {
        const level = this.difficultyLevels[type];
        console.log('Before recording:', type, {
            currentDifficulty: level.currentDifficulty,
            attempts: level.lastAttempts.length,
            correctCount: this.getEffectiveCorrectCount(level.lastAttempts)
        });
        
        // Add new attempt
        level.lastAttempts.push({
            isCorrect,
            isTimeout,
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
            correctCount: this.getEffectiveCorrectCount(level.lastAttempts)
        });
    }
    
    /**
     * Calculate effective correct count, counting timeouts as partial successes
     */
    private getEffectiveCorrectCount(attempts: IQuestionAttempt[]): number {
        return attempts.reduce((count, attempt) => {
            if (attempt.isTimeout) {
                return count + AdaptiveDifficulty.TIMEOUT_WEIGHT;
            }
            return count + (attempt.isCorrect ? 1 : 0);
        }, 0);
    }

    /**
     * Calculate effective incorrect count, counting timeouts as partial failures
     */
    private getEffectiveIncorrectCount(attempts: IQuestionAttempt[]): number {
        return attempts.reduce((count, attempt) => {
            if (attempt.isTimeout) {
                return count + AdaptiveDifficulty.TIMEOUT_WEIGHT;
            }
            return count + (attempt.isCorrect ? 0 : 1);
        }, 0);
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
        const effectiveCorrectCount = this.getEffectiveCorrectCount(level.lastAttempts);
        const effectiveIncorrectCount = this.getEffectiveIncorrectCount(level.lastAttempts);
        
        // Check for consecutive correct answers for immediate level up
        const lastNine = level.lastAttempts.slice(-9);
        const nineConsecutiveCorrect = lastNine.length === 9 && 
            lastNine.every(a => a.isCorrect && !a.isTimeout);

        // Level up conditions: either 9 consecutive correct or 9 effective correct out of 10
        if (nineConsecutiveCorrect || 
            (level.lastAttempts.length >= AdaptiveDifficulty.HISTORY_SIZE && 
             effectiveCorrectCount >= AdaptiveDifficulty.REQUIRED_CORRECT_FOR_LEVEL_UP)) {
            if (level.currentDifficulty < AdaptiveDifficulty.MAX_DIFFICULTY) {
                console.log(`Leveling UP ${type} from ${level.currentDifficulty} to ${level.currentDifficulty + 1} - ${nineConsecutiveCorrect ? 'got 9 consecutive correct!' : `got ${effectiveCorrectCount} effective correct out of ${level.lastAttempts.length}`}`);
                level.currentDifficulty++;
                level.lastAttempts = []; // Reset history after difficulty change
            }
        }
        // Level down if too many effective incorrect answers
        else if (effectiveIncorrectCount >= AdaptiveDifficulty.MAX_INCORRECT_BEFORE_LEVEL_DOWN) {
            if (level.currentDifficulty > AdaptiveDifficulty.MIN_DIFFICULTY) {
                console.log(`Leveling DOWN ${type} from ${level.currentDifficulty} to ${level.currentDifficulty - 1} - got ${effectiveIncorrectCount} effective incorrect answers`);
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