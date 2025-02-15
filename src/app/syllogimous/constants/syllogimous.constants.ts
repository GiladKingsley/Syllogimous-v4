import { Settings } from "../models/settings.models";
import { EnumQuestionType } from "./question.constants";

export enum EnumScreens {
    Intro = "Intro",
    Start = "Start",
    Tutorial = "Tutorial",
    Game = "Game",
    Feedback = "Feedback",
    History = "History",
    Tutorials = "Tutorials",
    Stats = "Stats",
    PlaygroundMode = "Playground Mode",
    Settings = "Settings",
    TiersMatrix = "Tiers Matrix",
    OtherGames = "Other Games",
}

export enum EnumTiers {
    Adept = "Adept",
    Scholar = "Scholar",
    Savant = "Savant",
    Expert = "Expert",
    Mastermind = "Mastermind",
    Visionary = "Visionary",
    Genius = "Genius",
    Virtuoso = "Virtuoso",
    Luminary = "Luminary",
    Prodigy = "Prodigy",
    Oracle = "Oracle",
    Sage = "Sage",
    Philosopher = "Philosopher",
    Mystic = "Mystic",
    Transcendent = "Transcendent",
}

export const TIER_COLORS: Record<EnumTiers, { bgColor: string, textColor: string }> = {
    [EnumTiers.Adept]:          { bgColor: "#F0F8FF", textColor: "#045D56" },  // Alice Blue with Teal
    [EnumTiers.Scholar]:        { bgColor: "#ADD8E6", textColor: "#013220" },  // Light Blue with Deep Green
    [EnumTiers.Savant]:         { bgColor: "#E6E6FA", textColor: "#4B0082" },  // Lavender with Indigo
    [EnumTiers.Expert]:         { bgColor: "#D8BFD8", textColor: "#8B008B" },  // Thistle with Dark Magenta
    [EnumTiers.Mastermind]:     { bgColor: "#DDA0DD", textColor: "#483D8B" },  // Plum with Dark Slate Blue
    [EnumTiers.Visionary]:      { bgColor: "#B0E0E6", textColor: "#002366" },  // Powder Blue with Royal Blue
    [EnumTiers.Genius]:         { bgColor: "#AFEEEE", textColor: "#004953" },  // Pale Turquoise with Deep Aqua
    [EnumTiers.Virtuoso]:       { bgColor: "#00CED1", textColor: "#002D62" },  // Dark Turquoise with Deep Blue
    [EnumTiers.Luminary]:       { bgColor: "#98FB98", textColor: "#006400" },  // Pale Green with Dark Green
    [EnumTiers.Prodigy]:        { bgColor: "#FFFACD", textColor: "#556B2F" },  // Lemon Chiffon with Dark Olive Green
    [EnumTiers.Oracle]:         { bgColor: "#FFDAB9", textColor: "#A0522D" },  // Peach Puff with Sienna
    [EnumTiers.Sage]:           { bgColor: "#FFC0CB", textColor: "#8B0000" },  // Pink with Dark Red
    [EnumTiers.Philosopher]:    { bgColor: "#D8BFD8", textColor: "#4A235A" },  // Thistle with Dark Purple
    [EnumTiers.Mystic]:         { bgColor: "#C71585", textColor: "#FFE4E1" },  // Medium Violet Red with Misty Rose
    [EnumTiers.Transcendent]:   { bgColor: "#4B0082", textColor: "#F0F8FF" },  // Indigo with Alice Blue
};

export const ORDERED_TIERS = Object.keys(TIER_COLORS) as EnumTiers[];

export const ORDERED_QUESTION_TYPES = [ 
    EnumQuestionType.Distinction,
    EnumQuestionType.ComparisonNumerical,
    EnumQuestionType.ComparisonChronological,
    EnumQuestionType.Syllogism,
    EnumQuestionType.LinearArrangement,
    EnumQuestionType.CircularArrangement,
    EnumQuestionType.Direction,
    EnumQuestionType.Direction3DSpatial,
    EnumQuestionType.Direction3DTemporal,
    EnumQuestionType.Analogy,
    EnumQuestionType.Binary,
];

/** The following is a matrix that represents configurations of question types over tiers */
export const TIERS_MATRIX: Record<number, [ number, number, number, number, number, number, number, number, number, number, number ]> = {
     0: [  2,  2,  2, -1, -1, -1, -1, -1, -1, -1, -1 ],
     1: [  3,  3,  3,  2, -1, -1, -1, -1, -1, -1, -1 ],
     2: [  4,  4,  4,  3,  2, -1, -1, -1, -1, -1, -1 ],
     3: [  5,  5,  5,  4,  3,  2, -1, -1, -1, -1, -1 ],
     4: [  6,  6,  6,  5,  4,  3,  2, -1, -1, -1, -1 ],
     5: [  7,  7,  7,  6,  5,  4,  3,  2,  2,  3, -1 ],
     6: [  8,  8,  8,  7,  6,  5,  4,  3,  3,  4,  4 ],
     7: [  9,  9,  9,  8,  7,  6,  5,  4,  4,  5,  5 ],
     8: [ 10, 10, 10,  9,  8,  7,  6,  5,  5,  6,  6 ],
     9: [ 11, 11, 11, 10,  9,  8,  7,  6,  6,  7,  7 ],
    10: [ 12, 12, 12, 11, 10,  9,  8,  7,  7,  8,  8 ],
    11: [ 13, 13, 13, 12, 11, 10,  9,  8,  8,  9,  9 ],
    12: [ 14, 14, 14, 13, 12, 11, 10,  9,  9, 10, 10 ],
    13: [ 15, 15, 15, 14, 13, 12, 11, 10, 10, 11, 11 ],
    14: [ 16, 16, 16, 15, 14, 13, 12, 11, 11, 12, 12 ],
};

/** Given an EnumTiers value construct a Settings instance */
export function getSettingsFromTier(tier: EnumTiers) {
    const tierIdx = ORDERED_TIERS.findIndex(_tier => _tier === tier);
    const settings = new Settings();
    settings.setEnable("negation", false);
    settings.setEnable("meta", false);
    for (let i = 0; i < TIERS_MATRIX[tierIdx].length; i++) {
        const questionType = ORDERED_QUESTION_TYPES[i];
        const numOfPremises = TIERS_MATRIX[tierIdx][i];
        const activeQuestion = numOfPremises > -1 ? true : false;
        settings.setQuestionSettings(questionType, activeQuestion, numOfPremises);
    }
    if (tierIdx > 5) {
        settings.setEnable("negation", true);
    }
    if (tierIdx > 6) {
        settings.setEnable("meta", true);
    }
    // console.log(tier, "matrix row", TIERS_MATRIX[tierIdx]);
    // console.log(tier, "settings", settings);
    return settings;
}