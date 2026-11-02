/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NumberItem {
  word: string;
  digit: number;
  symbol?: string;    // E.g., "1st", "2nd" for ordinals
  emoji?: string;     // Optional explicit emoji icon
  isOrdinal?: boolean; // True for ordinals, false or undefined for natural
  isPronoun?: boolean; // True for pronouns
  isCalendar?: boolean; // True for Days, Months & Time
  calendarGroup?: "days" | "months" | "time";
  isColor?: boolean;    // True for Colors
  colorGroup?: "basic" | "middle" | "advanced";
  isSport?: boolean;    // True for Sports
  sportGroup?: "basic" | "middle" | "advanced";
  isInstrument?: boolean; // True for Instruments
  instrumentGroup?: "basic" | "middle" | "advanced";
  isProfession?: boolean; // True for Professions
  professionGroup?: "basic" | "middle" | "advanced";
  isFamily?: boolean;     // True for Family & People
  familyGroup?: "basic" | "middle" | "advanced";
  isHouse?: boolean;      // True for House
  houseGroup?: "parts" | "living" | "kitchen" | "bedroom" | "bathroom";
  isClassroom?: boolean;   // True for Classroom
  classroomGroup?: "supplies" | "shapes" | "countries";
  isPlaces?: boolean;      // True for Places
  placesGroup?: "urban" | "shops" | "transport";
  isWeather?: boolean;     // True for Weather
  weatherGroup?: "phenomena" | "phrases";
  isAnimals?: boolean;     // True for Animals
  animalsGroup?: "farm" | "forest" | "birds" | "reptiles";
  isFruits?: boolean;      // True for Fruits
  fruitsGroup?: string;
  isVegetables?: boolean;  // True for Vegetables
  vegetablesGroup?: string;
  isFood?: boolean;        // True for Food
  foodGroup?: string;
  isTastes?: boolean;      // True for Tastes
  tastesGroup?: "basic" | "advanced" | "verbs";
  isClothing?: boolean;    // True for Clothing
  clothingGroup?: "basic" | "womens";
  isBody?: boolean;        // True for Body parts
  bodyGroup?: "external" | "internal";
  isRoutine?: boolean;     // True for Routine & Commands
  routineGroup?: string;   // Group name
  isSentence?: boolean;    // True for Sentence translation
  distractors?: string[];  // Custom choices for sentence translation
  ipa?: string;        // Optional IPA pronunciation override
  plusOne?: number;
}

export type GameMode = "MENU" | "SUBPLAY1" | "SUBPLAY2" | "SUBPLAY3" | "SUBPLAY4" | "PLAY1" | "PLAY2" | "PLAY3" | "PLAY4" | "RESULTS" | "SUBPLAY3_ROUTAINE" | "SUBPLAY4_ROUTAINE" | "PLAY3_ROUTAINE" | "PLAY4_ROUTAINE" | "SUBPLAY5_ROUTAINE" | "WELCOME" | "STUDENT_EXAM" | "DICCIONARIO";

export interface GameState {
  mode: GameMode;
  subType: string; // e.g. "group1", "30-random", "EASY"
  originalTotal: number;
  currentList: NumberItem[];
  currentIndex: number;
  correctCount: number;
  errorCount: number;
  currentOptionSelected: string | null;
  // Play 1 specific
  isLearningMode: boolean; // showing learn word first
  typedWord: string;
}
