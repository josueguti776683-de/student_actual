/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { GameMode, NumberItem } from "./types";
import { updateStatsOnGameComplete } from "./utils/stats";
import {
  numeros1a20,
  numeros21a100,
  decenas,
  totalNumeros100,
  ordinal1a20,
  ordinal21a100,
  ordinalDecenas,
  totalOrdinal100,
  calendarDays,
  calendarMonths,
  calendarTime,
  totalCalendar,
  colorBasic,
  colorMiddle,
  colorAdvanced,
  totalColors,
  sportsBasic,
  sportsMiddle,
  sportsAdvanced,
  totalSports,
  instrumentsBasic,
  instrumentsMiddle,
  instrumentsAdvanced,
  totalInstruments,
  professionsBasic,
  professionsMiddle,
  professionsAdvanced,
  totalProfessions,
  familyBasic,
  familyMiddle,
  familyAdvanced,
  totalFamily,
  houseParts,
  houseLiving,
  houseKitchen,
  houseBedroom,
  houseBathroom,
  totalHouse,
  classroomSupplies,
  classroomShapes,
  classroomCountries,
  totalClassroom,
  placesUrban,
  placesShops,
  placesTransport,
  totalPlaces,
  weatherPhenomena,
  weatherPhrases,
  totalWeather,
  animalsFarm,
  animalsForest,
  animalsBirds,
  animalsReptiles,
  totalAnimals,
  fruitsBasic,
  fruitsBerries,
  totalFruits,
  vegetablesGreens,
  vegetablesTubers,
  totalVegetables,
  foodMeals,
  foodPantry,
  foodPrepared,
  totalFood,
  tastesBasic,
  tastesAdvanced,
  cookingVerbsList,
  tastesSentences,
  totalTastes,
  clothingBasic,
  clothingWomens,
  totalClothing,
  bodyExternal,
  bodyInternal,
  totalBody,
  routineBasic,
  routineCommands,
  routineRemaining,
  totalRoutine,
  routineSentences
} from "./data";
import {
  ModulesMenu,
  MainMenu,
  Subplay1Menu,
  Subplay2Menu,
  Subplay3Menu,
  Subplay3RoutineMenu,
  Subplay4RoutineMenu
} from "./components/MainMenus";
import Play1View from "./components/Play1View";
import Play2View from "./components/Play2View";
import Play3View from "./components/Play3View";
import Play4View from "./components/Play4View";
import { PlaySentences } from "./components/PlaySentences";
import { PlayWordsMultiple } from "./components/PlayWordsMultiple";
import PenaltyModal from "./components/PenaltyModal";
import ResultsView from "./components/ResultsView";
import WelcomeView from "./components/WelcomeView";
import PracticeReadListen from "./components/PracticeReadListen";
import StudentExam from "./components/StudentExam";
import { DictionaryView } from "./components/DictionaryView";
import { stopSpeaking } from "./utils/audio";
import { sentencesList30, sentencesList80, allVocabList } from "./data/vocabulary";

import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Screen and Mode States
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [mode, setMode] = useState<GameMode>("MENU");
  const [subType, setSubType] = useState<string>("");
  const [subTypeLabel, setSubTypeLabel] = useState<string>("");
  const [lastPlayMode, setLastPlayMode] = useState<string>("1");
  const [displayTitle, setDisplayTitle] = useState<string>("");

  // Game/Exam Queue states
  const [currentList, setCurrentList] = useState<NumberItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Scoring / Performance
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);

  // Auto Speak Global switch: enabled by default
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState<boolean>(true);

  // Fast Test tracking states
  const [sessionBaseList, setSessionBaseList] = useState<NumberItem[]>([]);
  const [fastTestPendingList, setFastTestPendingList] = useState<NumberItem[]>([]);
  const [fastTestSentencesOverride, setFastTestSentencesOverride] = useState<any[]>([]);
  const [fastTestVocabOverride, setFastTestVocabOverride] = useState<any[]>([]);

  // Penalty Modal Control
  const [penaltyModal, setPenaltyModal] = useState<{
    isOpen: boolean;
    correctWord: string;
    isExamMode: boolean;
    plusOneVal: number;
    resumeCallback: () => void;
    onPenaltyMistake?: () => void;
  }>({
    isOpen: false,
    correctWord: "",
    isExamMode: false,
    plusOneVal: 0,
    resumeCallback: () => {},
    onPenaltyMistake: undefined
  });

  // Automatically update statistics in localStorage when user reaches the RESULTS screen
  useEffect(() => {
    if (mode === "RESULTS" && activeModule !== null) {
      updateStatsOnGameComplete(activeModule, errorCount);
    }
  }, [mode, activeModule, errorCount]);

  // Global AutoSpeak Switch Toggle
  const toggleAutoSpeak = () => {
    setAutoSpeakEnabled(prev => !prev);
  };

  // Helper utility to shuffle arrays
  const shuffleList = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // ----------------------------------------------------
  // Initialize Special 5-Minute Mode (PLAY 1, custom random words from all 20 modules)
  // ----------------------------------------------------
  const iniciarModo5Minutos = (wordCount: number = 15) => {
    stopSpeaking();
    
    // Assemble a master list of items from all modules
    const mappedNumeros1a20 = numeros1a20.map(([word, digit]) => ({ word, digit } as NumberItem));
    const mappedNumeros21a100 = numeros21a100.map(([word, digit]) => ({ word, digit } as NumberItem));

    const masterPool: NumberItem[] = [
      ...mappedNumeros1a20,
      ...mappedNumeros21a100,
      ...totalOrdinal100,
      ...totalCalendar,
      ...totalColors,
      ...totalSports,
      ...totalInstruments,
      ...totalProfessions,
      ...totalFamily,
      ...totalHouse,
      ...totalClassroom,
      ...totalPlaces,
      ...totalWeather,
      ...totalAnimals,
      ...totalFruits,
      ...totalVegetables,
      ...totalFood,
      ...totalTastes,
      ...totalClothing,
      ...totalBody,
      ...totalRoutine,
    ];

    // Filter out any invalid items, ensuring we only get items with non-empty word
    const validPool = masterPool.filter(item => item && item.word && item.word.trim().length > 0);

    // Shuffle validPool and pick custom wordCount items
    const shuffled = shuffleList(validPool);
    const selected = shuffled.slice(0, wordCount);

    setActiveModule(999); // Use a special module ID for 5-minute mode so we know it's special
    setCurrentList(selected);
    setSessionBaseList(selected);
    setFastTestPendingList(selected);
    setFastTestSentencesOverride([]);
    setFastTestVocabOverride([]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setErrorCount(0);
    setSubType(`modo_5_minutos_${wordCount}`);
    setSubTypeLabel(`MODO: 5 MINUTOS (${wordCount} PALABRAS)`);
    setDisplayTitle(`MODO: 5 MINUTOS (${wordCount} PALABRAS)`);
    setLastPlayMode("1");
    setMode("PLAY1");
  };

  // ----------------------------------------------------
  // Initialize Special Repaso Rápido (PLAY 2 Multiple Choice, custom random words from all 20 modules)
  // ----------------------------------------------------
  const iniciarRepasoRapido = (wordCount: number = 15) => {
    stopSpeaking();
    
    // Assemble a master list of items from all modules
    const mappedNumeros1a20 = numeros1a20.map(([word, digit]) => ({ word, digit, symbol: String(digit) } as NumberItem));
    const mappedNumeros21a100 = numeros21a100.map(([word, digit]) => ({ word, digit, symbol: String(digit) } as NumberItem));

    const masterPool: NumberItem[] = [
      ...mappedNumeros1a20,
      ...mappedNumeros21a100,
      ...totalOrdinal100,
      ...totalCalendar,
      ...totalColors,
      ...totalSports,
      ...totalInstruments,
      ...totalProfessions,
      ...totalFamily,
      ...totalHouse,
      ...totalClassroom,
      ...totalPlaces,
      ...totalWeather,
      ...totalAnimals,
      ...totalFruits,
      ...totalVegetables,
      ...totalFood,
      ...totalTastes,
      ...totalClothing,
      ...totalBody,
      ...totalRoutine,
    ];

    // Filter out any invalid items, ensuring we only get items with non-empty word
    const validPool = masterPool.filter(item => item && item.word && item.word.trim().length > 0);

    // Shuffle validPool and pick custom wordCount items
    const shuffled = shuffleList(validPool);
    const selected = shuffled.slice(0, wordCount);

    setActiveModule(994);
    setCurrentList(selected);
    setSessionBaseList(selected);
    setFastTestPendingList(selected);
    setFastTestSentencesOverride([]);
    setFastTestVocabOverride([]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setErrorCount(0);
    setSubType(`repaso_rapido_${wordCount}`);
    setSubTypeLabel(`REPASO RÁPIDO (${wordCount} PREGUNTAS)`);
    setDisplayTitle(`⚡ REPASO RÁPIDO (${wordCount} PREGUNTAS)`);
    setLastPlayMode("2");
    setMode("PLAY2");
  };

  // ----------------------------------------------------
  // Initialize PLAY 1 (Learning) & PLAY 4 (Pairs)
  // ----------------------------------------------------
  const iniciarPlay = (
    groupKey: "group1" | "group2" | "group3" | "group4" | "group5",
    shuffle: boolean = false,
    targetPlayMode: "1" | "4" = "1"
  ) => {
    stopSpeaking();
    let rawList: NumberItem[] = [];
    let label = "";

    const isOrd = activeModule === 2;
    const isCalendar = activeModule === 3;
    const isColor = activeModule === 4;
    const isSport = activeModule === 5;
    const isInstrument = activeModule === 6;
    const isProfession = activeModule === 7;
    const isFamily = activeModule === 8;
    const isHouse = activeModule === 9;
    const isClassroom = activeModule === 10;
    const isPlaces = activeModule === 11;
    const isWeather = activeModule === 12;
    const isAnimals = activeModule === 13;
    const isFruits = activeModule === 14;
    const isVegetables = activeModule === 15;
    const isFood = activeModule === 16;
    const isTastes = activeModule === 17;
    const isClothing = activeModule === 18;
    const isBody = activeModule === 19;
    const isRoutine = activeModule === 20;

    if (groupKey === "group1") {
      if (isBody) {
        rawList = bodyExternal;
        label = "EXTERNAL BODY";
        setDisplayTitle("EXTERNAL BODY PARTS");
      } else if (isClothing) {
        rawList = clothingBasic;
        label = "BASIC CLOTHING";
        setDisplayTitle("BASIC CLOTHING");
      } else if (isTastes) {
        rawList = tastesBasic;
        label = "BASIC TASTES";
        setDisplayTitle("BASIC TASTES");
      } else if (isHouse) {
        rawList = houseParts;
        label = "PARTS & OUTSIDE";
        setDisplayTitle("HOUSE PARTS & OUTSIDE");
      } else if (isCalendar) {
        rawList = calendarDays;
        label = "DAYS OF THE WEEK";
        setDisplayTitle("DAYS");
      } else if (isColor) {
        rawList = colorBasic;
        label = "BASIC COLORS";
        setDisplayTitle("COLORS");
      } else if (isSport) {
        rawList = sportsBasic;
        label = "BASIC SPORTS";
        setDisplayTitle("SPORTS");
      } else if (isInstrument) {
        rawList = instrumentsBasic;
        label = "BASIC INSTRUMENTS";
        setDisplayTitle("INSTRUMENTS");
      } else if (isProfession) {
        rawList = professionsBasic;
        label = "CAREER PROFESSIONS";
        setDisplayTitle("PROFESSIONS");
      } else if (isFamily) {
        rawList = familyBasic;
        label = "FAMILY BASIC";
        setDisplayTitle("FAMILY & PEOPLE");
      } else if (isClassroom) {
        rawList = classroomSupplies;
        label = "SCHOOL SUPPLIES";
        setDisplayTitle("SCHOOL SUPPLIES");
      } else if (isPlaces) {
        rawList = placesUrban;
        label = "URBAN PLACES";
        setDisplayTitle("URBAN PLACES");
      } else if (isWeather) {
        rawList = weatherPhenomena;
        label = "WEATHER WORDS";
        setDisplayTitle("WEATHER WORDS");
      } else if (isAnimals) {
        rawList = animalsFarm;
        label = "FARM & BIG";
        setDisplayTitle("FARM & BIG MAMMALS");
      } else if (isFruits) {
        rawList = fruitsBasic;
        label = "BASIC FRUITS";
        setDisplayTitle("BASIC FRUITS");
      } else if (isVegetables) {
        rawList = vegetablesGreens;
        label = "GREENS & ROOTS";
        setDisplayTitle("GREENS & ROOTS");
      } else if (isFood) {
        rawList = foodMeals;
        label = "MEALS & DRINKS";
        setDisplayTitle("MEALS & DRINKS");
      } else if (isRoutine) {
        rawList = routineBasic;
        label = "DAILY ROUTINE BASIC";
        setDisplayTitle("DAILY ROUTINE BASIC");
      } else {
        rawList = isOrd ? ordinal1a20 : numeros1a20.map(([word, digit]) => ({ word, digit }));
        label = isOrd ? "GROUP 1 (1st-20th)" : "GROUP 1 (1-20)";
        setDisplayTitle("GROUP 1");
      }
    } else if (groupKey === "group2") {
      if (isBody) {
        rawList = bodyInternal;
        label = "INTERNAL & CONDITIONS";
        setDisplayTitle("INTERNAL PARTS & CONDITIONS");
      } else if (isClothing) {
        rawList = clothingWomens;
        label = "WOMEN'S CLOTHING";
        setDisplayTitle("WOMEN'S CLOTHING");
      } else if (isTastes) {
        rawList = tastesAdvanced;
        label = "ADVANCED TASTES";
        setDisplayTitle("ADVANCED TASTES");
      } else if (isHouse) {
        rawList = houseLiving;
        label = "LIVING ROOM";
        setDisplayTitle("LIVING ROOM");
      } else if (isCalendar) {
        rawList = calendarMonths;
        label = "MONTHS OF THE YEAR";
        setDisplayTitle("MONTHS");
      } else if (isColor) {
        rawList = colorMiddle;
        label = "MIDDLE COLORS";
        setDisplayTitle("COLORS");
      } else if (isSport) {
        rawList = sportsMiddle;
        label = "MIDDLE SPORTS";
        setDisplayTitle("SPORTS");
      } else if (isInstrument) {
        rawList = instrumentsMiddle;
        label = "MIDDLE INSTRUMENTS";
        setDisplayTitle("INSTRUMENTS");
      } else if (isProfession) {
        rawList = professionsMiddle;
        label = "LABOR A PROFESSIONS";
        setDisplayTitle("PROFESSIONS");
      } else if (isFamily) {
        rawList = familyMiddle;
        label = "FAMILY EXTENDED";
        setDisplayTitle("FAMILY & PEOPLE");
      } else if (isClassroom) {
        rawList = classroomShapes;
        label = "SHAPES & SUBJECTS";
        setDisplayTitle("SHAPES & SUBJECTS");
      } else if (isPlaces) {
        rawList = placesShops;
        label = "SHOPS & STORES";
        setDisplayTitle("SHOPS & STORES");
      } else if (isWeather) {
        rawList = weatherPhrases;
        label = "WEATHER PHRASES";
        setDisplayTitle("WEATHER PHRASES");
      } else if (isAnimals) {
        rawList = animalsForest;
        label = "FOREST & EXOTIC";
        setDisplayTitle("FOREST & EXOTIC ANIMALS");
      } else if (isFruits) {
        rawList = fruitsBerries;
        label = "BERRIES & NUTS";
        setDisplayTitle("BERRIES, NUTS & CHERRIES");
      } else if (isVegetables) {
        rawList = vegetablesTubers;
        label = "TUBERS & LEGUMES";
        setDisplayTitle("TUBERS & LEGUMES");
      } else if (isFood) {
        rawList = foodPantry;
        label = "PANTRY & MEATS";
        setDisplayTitle("PANTRY & MEATS");
      } else if (isRoutine) {
        rawList = routineCommands;
        label = "COMMON COMMANDS";
        setDisplayTitle("COMMON COMMANDS");
      } else {
        rawList = isOrd ? ordinal21a100 : numeros21a100.map(([word, digit]) => ({ word, digit }));
        label = isOrd ? "GROUP 2 (21st-100th)" : "GROUP 2 (21-100)";
        setDisplayTitle("GROUP 2");
      }
    } else if (groupKey === "group3") {
      if (isTastes) {
        rawList = cookingVerbsList;
        label = "COOKING VERBS";
        setDisplayTitle("COOKING VERBS");
      } else if (isHouse) {
        rawList = houseKitchen;
        label = "KITCHEN";
        setDisplayTitle("KITCHEN");
      } else if (isCalendar) {
        rawList = calendarTime;
        label = "TIME EXPRESSIONS";
        setDisplayTitle("TIME & EXPRESSIONS");
      } else if (isColor) {
        rawList = colorAdvanced;
        label = "ADVANCED COLORS";
        setDisplayTitle("COLORS");
      } else if (isSport) {
        rawList = sportsAdvanced;
        label = "ADVANCED SPORTS";
        setDisplayTitle("SPORTS");
      } else if (isInstrument) {
        rawList = instrumentsAdvanced;
        label = "ADVANCED INSTRUMENTS";
        setDisplayTitle("INSTRUMENTS");
      } else if (isProfession) {
        rawList = professionsAdvanced;
        label = "LABOR B PROFESSIONS";
        setDisplayTitle("PROFESSIONS");
      } else if (isFamily) {
        rawList = familyAdvanced;
        label = "PEOPLE & CO.";
        setDisplayTitle("FAMILY & PEOPLE");
      } else if (isClassroom) {
        rawList = classroomCountries;
        label = "COUNTRIES";
        setDisplayTitle("COUNTRIES");
      } else if (isPlaces) {
        rawList = placesTransport;
        label = "VEHICLES & TRANSPORT";
        setDisplayTitle("VEHICLES & TRANSPORT");
      } else if (isAnimals) {
        rawList = animalsBirds;
        label = "BIRDS & MARINE";
        setDisplayTitle("BIRDS & MARINE ANIMALS");
      } else if (isFood) {
        rawList = foodPrepared;
        label = "PREPARED FOODS";
        setDisplayTitle("PREPARED FOODS");
      } else if (isRoutine) {
        rawList = routineRemaining;
        label = "DAILY ROUTINE PHRASES";
        setDisplayTitle("DAILY ROUTINE PHRASES");
      } else {
        rawList = isOrd ? ordinalDecenas : decenas.map(([word, digit]) => ({ word, digit }));
        label = isOrd ? "GROUP 3 (TENS)" : "GROUP 3 (TENS)";
        setDisplayTitle("GROUP 3");
      }
    } else if (groupKey === "group4") {
      if (isHouse) {
        rawList = houseBedroom;
        label = "BEDROOM";
        setDisplayTitle("BEDROOM");
      } else if (isAnimals) {
        rawList = animalsReptiles;
        label = "REPTILES & BUGS";
        setDisplayTitle("REPTILES & CREEPY CRAWLIES");
      }
    } else if (groupKey === "group5") {
      if (isHouse) {
        rawList = houseBathroom;
        label = "BATHROOM & TOILETRIES";
        setDisplayTitle("BATHROOM & TOILETRIES");
      }
    }

    if (shuffle) {
      rawList = shuffleList(rawList);
    }

    setCurrentList(rawList);
    setSessionBaseList(rawList);
    setFastTestPendingList(rawList);
    setFastTestSentencesOverride([]);
    setFastTestVocabOverride([]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setErrorCount(0);
    setSubType(groupKey);
    setSubTypeLabel(targetPlayMode === "4" ? `${label} (PAIRS)` : label);
    setLastPlayMode(targetPlayMode === "4" ? (isRoutine ? "5" : "4") : "1");
    setMode(targetPlayMode === "4" ? "PLAY4" : "PLAY1");
  };

  // ----------------------------------------------------
  // Initialize PLAY 2 (Multiple Choice)
  // ----------------------------------------------------
  const iniciarMultiple = (size: number, part?: 1 | 2) => {
    stopSpeaking();
    
    const isOrd = activeModule === 2;
    const isCalendar = activeModule === 3;
    const isColor = activeModule === 4;
    const isSport = activeModule === 5;
    const isInstrument = activeModule === 6;
    const isProfession = activeModule === 7;
    const isFamily = activeModule === 8;
    const isHouse = activeModule === 9;
    const isClassroom = activeModule === 10;
    const isPlaces = activeModule === 11;
    const isWeather = activeModule === 12;
    const isAnimals = activeModule === 13;
    const isFruits = activeModule === 14;
    const isVegetables = activeModule === 15;
    const isFood = activeModule === 16;
    const isTastes = activeModule === 17;
    const isClothing = activeModule === 18;
    const isBody = activeModule === 19;
    const isRoutine = activeModule === 20;
    let pool: NumberItem[] = [];
    if (isCalendar) {
      pool = totalCalendar;
    } else if (isColor) {
      pool = totalColors;
    } else if (isSport) {
      pool = totalSports;
    } else if (isInstrument) {
      pool = totalInstruments;
    } else if (isProfession) {
      pool = totalProfessions;
    } else if (isFamily) {
      pool = totalFamily;
    } else if (isHouse) {
      pool = totalHouse;
    } else if (isClassroom) {
      pool = totalClassroom;
    } else if (isPlaces) {
      pool = totalPlaces;
    } else if (isWeather) {
      pool = totalWeather;
    } else if (isAnimals) {
      pool = totalAnimals;
    } else if (isFruits) {
      pool = totalFruits;
    } else if (isVegetables) {
      pool = totalVegetables;
    } else if (isFood) {
      pool = totalFood;
    } else if (isClothing) {
      pool = totalClothing;
    } else if (isBody) {
      pool = totalBody;
    } else if (isRoutine) {
      pool = totalRoutine;
    } else if (isTastes) {
      if (size === 20) {
        pool = tastesSentences.map((s, index) => ({
          word: s.c,
          digit: index + 1,
          symbol: s.e,
          isSentence: true,
          distractors: s.d,
          isTastes: true
        }));
      } else if (size === 30 || size === 31) {
        pool = cookingVerbsList;
      } else {
        pool = totalTastes;
      }
    } else {
      pool = isOrd ? totalOrdinal100 : totalNumeros100.map(([word, digit]) => ({ word, digit }));
    }

    if (part === 1) {
      const halfSize = Math.ceil(pool.length / 2);
      pool = pool.slice(0, halfSize);
    } else if (part === 2) {
      const halfSize = Math.ceil(pool.length / 2);
      pool = pool.slice(halfSize);
    }

    const slicedSize = Math.min(size, pool.length);
    const shuffled = shuffleList(pool).slice(0, slicedSize);

    setCurrentList(shuffled);
    setSessionBaseList(shuffled);
    setFastTestPendingList(shuffled);
    setFastTestSentencesOverride([]);
    setFastTestVocabOverride([]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setErrorCount(0);
    setSubType(part ? `${size}-random-p${part}` : `${slicedSize}-random`);
    if (isCalendar) {
      setSubTypeLabel(`${slicedSize} MC QUESTIONS`);
      setDisplayTitle("CALENDAR QUESTIONS");
    } else if (isColor) {
      setSubTypeLabel(`${slicedSize} MC COLORS`);
      setDisplayTitle("COLORS QUESTIONS");
    } else if (isSport) {
      setSubTypeLabel(`${slicedSize} MC SPORTS`);
      setDisplayTitle("SPORTS QUESTIONS");
    } else if (isInstrument) {
      setSubTypeLabel(`${slicedSize} MC INSTRUMENTS`);
      setDisplayTitle("INSTRUMENTS QUESTIONS");
    } else if (isProfession) {
      setSubTypeLabel(`${slicedSize} MC PROFESSIONS`);
      setDisplayTitle("PROFESSIONS QUESTIONS");
    } else if (isFamily) {
      setSubTypeLabel(`${slicedSize} MC FAMILY & PEOPLE`);
      setDisplayTitle("FAMILY QUESTIONS");
    } else if (isHouse) {
      setSubTypeLabel(`${slicedSize} MC HOUSE`);
      setDisplayTitle("HOUSE QUESTIONS");
    } else if (isClassroom) {
      setSubTypeLabel(`${slicedSize} MC CLASSROOM`);
      setDisplayTitle("CLASSROOM QUESTIONS");
    } else if (isPlaces) {
      setSubTypeLabel(`${slicedSize} MC PLACES`);
      setDisplayTitle("PLACES QUESTIONS");
    } else if (isWeather) {
      setSubTypeLabel(`${slicedSize} MC WEATHER`);
      setDisplayTitle("WEATHER QUESTIONS");
    } else if (isAnimals) {
      setSubTypeLabel(`${slicedSize} MC ANIMALS`);
      setDisplayTitle("ANIMALS QUESTIONS");
    } else if (isFruits) {
      setSubTypeLabel(`${slicedSize} MC FRUITS`);
      setDisplayTitle("FRUITS QUESTIONS");
    } else if (isVegetables) {
      setSubTypeLabel(`${slicedSize} MC VEGETABLES`);
      setDisplayTitle("VEGETABLES QUESTIONS");
    } else if (isFood) {
      setSubTypeLabel(`${slicedSize} MC FOOD`);
      setDisplayTitle("FOOD QUESTIONS");
    } else if (isClothing) {
      setSubTypeLabel(`${slicedSize} MC CLOTHING`);
      setDisplayTitle("CLOTHING QUESTIONS");
    } else if (isBody) {
      setSubTypeLabel(`${slicedSize} MC BODY PARTS`);
      setDisplayTitle("BODY ANATOMY QUESTIONS");
    } else if (isRoutine) {
      setSubTypeLabel(`${slicedSize} MC ROUTINE`);
      setDisplayTitle("ROUTINE & COMMANDS QUESTIONS");
    } else if (isTastes) {
      if (size === 20) {
        setSubTypeLabel("SENTENCE TRANSLATION");
        setDisplayTitle("SENTENCES");
      } else if (size === 30 || size === 31) {
        setSubTypeLabel("COOKING VERBS MC");
        setDisplayTitle("COOKING VERBS MC");
      } else {
        setSubTypeLabel("TASTES & FLAVORS MC");
        setDisplayTitle("TASTES & FLAVORS MC");
      }
    } else {
      setSubTypeLabel(isOrd ? `${slicedSize} MC ORDINALS` : `${slicedSize} MC NUMBERS`);
      setDisplayTitle(slicedSize === 30 ? "GROUP 1 - 30 QUESTIONS" : "GROUP 2 - 65 QUESTIONS");
    }

    if (part) {
      setSubTypeLabel(prev => `${prev} - Part ${part}`);
      setDisplayTitle(prev => `${prev} - PART ${part}`);
    }

    setLastPlayMode("2");
    setMode("PLAY2");
  };

  // ----------------------------------------------------
  // Initialize PLAY 3 (Writing exam)
  // ----------------------------------------------------
  const iniciarExamen = (size: number) => {
    stopSpeaking();

    const isOrd = activeModule === 2;
    const isCalendar = activeModule === 3;
    const isColor = activeModule === 4;
    const isSport = activeModule === 5;
    const isInstrument = activeModule === 6;
    const isProfession = activeModule === 7;
    const isFamily = activeModule === 8;
    const isHouse = activeModule === 9;
    const isClassroom = activeModule === 10;
    const isPlaces = activeModule === 11;
    const isWeather = activeModule === 12;
    const isAnimals = activeModule === 13;
    const isFruits = activeModule === 14;
    const isVegetables = activeModule === 15;
    const isFood = activeModule === 16;
    const isTastes = activeModule === 17;
    const isClothing = activeModule === 18;
    const isBody = activeModule === 19;
    const isRoutine = activeModule === 20;
    let pool: NumberItem[] = [];
    if (isCalendar) {
      pool = totalCalendar;
    } else if (isColor) {
      pool = totalColors;
    } else if (isSport) {
      pool = totalSports;
    } else if (isInstrument) {
      pool = totalInstruments;
    } else if (isProfession) {
      pool = totalProfessions;
    } else if (isFamily) {
      pool = totalFamily;
    } else if (isHouse) {
      pool = totalHouse;
    } else if (isClassroom) {
      pool = totalClassroom;
    } else if (isPlaces) {
      pool = totalPlaces;
    } else if (isWeather) {
      pool = totalWeather;
    } else if (isAnimals) {
      pool = totalAnimals;
    } else if (isFruits) {
      pool = totalFruits;
    } else if (isVegetables) {
      pool = totalVegetables;
    } else if (isFood) {
      pool = totalFood;
    } else if (isClothing) {
      pool = totalClothing;
    } else if (isBody) {
      pool = totalBody;
    } else if (isRoutine) {
      pool = totalRoutine;
    } else if (isTastes) {
      pool = [...totalTastes, ...cookingVerbsList];
    } else {
      pool = isOrd ? totalOrdinal100 : totalNumeros100.map(([word, digit]) => ({ word, digit }));
    }
    const slicedSize = Math.min(size, pool.length);
    const shuffled = shuffleList(pool).slice(0, slicedSize);

    setCurrentList(shuffled);
    setSessionBaseList(shuffled);
    setFastTestPendingList(shuffled);
    setFastTestSentencesOverride([]);
    setFastTestVocabOverride([]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setErrorCount(0);
    setSubType(`${slicedSize}-exam`);
    
    let levelStr = "EXAM";
    if (isClassroom) {
      levelStr = size === 25 ? "EASY" : size === 50 ? "HARD" : "ADVANCED";
    } else if (isPlaces) {
      levelStr = size === 25 ? "EASY" : size === 50 ? "HARD" : "ADVANCED";
    } else if (isWeather) {
      levelStr = size === 15 ? "EASY" : size === 30 ? "HARD" : "ADVANCED";
    } else if (isAnimals) {
      levelStr = size === 30 ? "EASY" : size === 65 ? "HARD" : "ADVANCED";
    } else if (isFruits) {
      levelStr = size === 18 ? "EASY" : size === 30 ? "HARD" : "ADVANCED";
    } else if (isVegetables) {
      levelStr = size === 20 ? "EASY" : size === 34 ? "HARD" : "ADVANCED";
    } else if (isFood) {
      levelStr = size === 20 ? "EASY" : size === 40 ? "HARD" : "ADVANCED";
    } else if (isClothing) {
      levelStr = size === 20 ? "EASY" : size === 40 ? "HARD" : "ADVANCED";
    } else if (isBody) {
      levelStr = size === 20 ? "EASY" : size === 40 ? "HARD" : "ADVANCED";
    } else if (isRoutine) {
      levelStr = size === 20 ? "EASY" : size === 45 ? "HARD" : "ADVANCED";
    } else if (isTastes) {
      levelStr = size === 20 ? "EASY" : size === 40 ? "HARD" : "ADVANCED";
    } else if (isProfession) {
      levelStr = size === 20 ? "EASY" : size === 40 ? "HARD" : "ADVANCED";
    } else if (isFamily) {
      levelStr = size === 18 ? "EASY" : size === 17 ? "HARD" : "ADVANCED";
    } else if (isHouse) {
      levelStr = size === 30 ? "EASY" : size === 50 ? "HARD" : "ADVANCED";
    } else if (isInstrument || isSport || isColor) {
      levelStr = size === 10 ? "EASY" : size === 20 ? "HARD" : "ADVANCED";
    } else {
      levelStr = size === 20 ? "EASY" : size === 40 ? "HARD" : "ADVANCED";
    }

    setSubTypeLabel(`EXAM: ${levelStr}`);
    if (isCalendar) {
      setDisplayTitle(`${levelStr} CALENDAR EXAM`);
    } else if (isColor) {
      setDisplayTitle(`${levelStr} COLORS EXAM`);
    } else if (isSport) {
      setDisplayTitle(`${levelStr} SPORTS EXAM`);
    } else if (isInstrument) {
      setDisplayTitle(`${levelStr} INSTRUMENTS EXAM`);
    } else if (isProfession) {
      setDisplayTitle(`${levelStr} PROFESSIONS EXAM`);
    } else if (isFamily) {
      setDisplayTitle(`${levelStr} FAMILY & PEOPLE EXAM`);
    } else if (isHouse) {
      setDisplayTitle(`${levelStr} HOUSE EXAM`);
    } else if (isClassroom) {
      setDisplayTitle(`${levelStr} CLASSROOM EXAM`);
    } else if (isPlaces) {
      setDisplayTitle(`${levelStr} PLACES EXAM`);
    } else if (isWeather) {
      setDisplayTitle(`${levelStr} WEATHER EXAM`);
    } else if (isAnimals) {
      setDisplayTitle(`${levelStr} ANIMALS EXAM`);
    } else if (isFruits) {
      setDisplayTitle(`${levelStr} FRUITS EXAM`);
    } else if (isVegetables) {
      setDisplayTitle(`${levelStr} VEGETABLES EXAM`);
    } else if (isFood) {
      setDisplayTitle(`${levelStr} FOOD EXAM`);
    } else if (isClothing) {
      setDisplayTitle(`${levelStr} CLOTHING EXAM`);
    } else if (isBody) {
      setDisplayTitle(`${levelStr} BODY PARTS & ANATOMY EXAM`);
    } else if (isRoutine) {
      setDisplayTitle(`${levelStr} ROUTINE & COMMANDS EXAM`);
    } else if (isTastes) {
      setDisplayTitle(`${levelStr} TASTES & COOKING EXAM`);
    } else {
      setDisplayTitle(size === 20 ? "EASY EXAM" : size === 40 ? "HARD EXAM" : "ADVANCED EXAM");
    }
    setLastPlayMode(isRoutine ? "4" : "3");
    setMode("PLAY3");
  };

  // ----------------------------------------------------
  // Handle correctness events
  // ----------------------------------------------------
  const handleItemCorrect = () => {
    setCorrectCount(prev => prev + 1);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= currentList.length) {
      setTimeout(() => {
        setMode("RESULTS");
      }, 300);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const handleItemIncorrect = () => {
    setErrorCount(prev => prev + 1);
  };

  // Play 1 specific logic: Appending failed word to random position downstream
  const handlePlay1Incorrect = () => {
    setErrorCount(prev => prev + 1);
    const failedItem = currentList[currentIndex];
    setCurrentList(prev => {
      const nextList = [...prev];
      const remainingCount = nextList.length - currentIndex;
      const offset = Math.floor(Math.random() * remainingCount) + 1;
      const targetPos = currentIndex + offset;
      nextList.splice(targetPos, 0, failedItem);
      return nextList;
    });
  };

  // Play 2 specific logic: Appending missed question at random position downstream
  const insertIncorrectPlay2Again = (item: NumberItem) => {
    setErrorCount(prev => prev + 1);
    setCurrentList(prev => {
      const nextList = [...prev];
      const remainingCount = nextList.length - currentIndex;
      const offset = Math.floor(Math.random() * remainingCount) + 1;
      const targetPos = currentIndex + offset;
      nextList.splice(targetPos, 0, item);
      return nextList;
    });
  };

  // Play 3 specific logic: Injecting missed exam question in a later random index
  const insertIncorrectPlay3Randomly = (item: NumberItem) => {
    setErrorCount(prev => prev + 1);
    setCurrentList(prev => {
      const nextList = [...prev];
      // Increment plusOne penalty counter for this item
      const updatedItem = { ...item, plusOne: (item.plusOne || 0) + 1 };
      
      const remainingCount = nextList.length - currentIndex;
      const offset = Math.floor(Math.random() * remainingCount) + 1;
      const targetPos = currentIndex + offset;
      nextList.splice(targetPos, 0, updatedItem);
      return nextList;
    });
  };

  // Open Unified penalty practice
  const openPenaltyModal = (
    word: string,
    isExam: boolean,
    plusOne: number,
    resumeCallback: () => void,
    onPenaltyMistake?: () => void
  ) => {
    setPenaltyModal({
      isOpen: true,
      correctWord: word,
      isExamMode: isExam,
      plusOneVal: plusOne,
      resumeCallback,
      onPenaltyMistake
    });
  };

  const closePenaltyModal = () => {
    // Read resumeCallback
    const callback = penaltyModal.resumeCallback;
    setPenaltyModal(prev => ({ ...prev, isOpen: false }));
    // Wake up gameplay
    if (callback) {
      callback();
    }
  };

  // ----------------------------------------------------
  // AGAIN & FAST TEST buttons on Results View
  // ----------------------------------------------------
  const getGroupWords = (groupKey: "group1" | "group2" | "group3" | "group4" | "group5"): NumberItem[] => {
    let rawList: NumberItem[] = [];
    const isOrd = activeModule === 2;
    const isCalendar = activeModule === 3;
    const isColor = activeModule === 4;
    const isSport = activeModule === 5;
    const isInstrument = activeModule === 6;
    const isProfession = activeModule === 7;
    const isFamily = activeModule === 8;
    const isHouse = activeModule === 9;
    const isClassroom = activeModule === 10;
    const isPlaces = activeModule === 11;
    const isWeather = activeModule === 12;
    const isAnimals = activeModule === 13;
    const isFruits = activeModule === 14;
    const isVegetables = activeModule === 15;
    const isFood = activeModule === 16;
    const isTastes = activeModule === 17;
    const isClothing = activeModule === 18;
    const isBody = activeModule === 19;
    const isRoutine = activeModule === 20;

    if (groupKey === "group1") {
      if (isBody) {
        rawList = bodyExternal;
      } else if (isClothing) {
        rawList = clothingBasic;
      } else if (isTastes) {
        rawList = tastesBasic;
      } else if (isHouse) {
        rawList = houseParts;
      } else if (isCalendar) {
        rawList = calendarDays;
      } else if (isColor) {
        rawList = colorBasic;
      } else if (isSport) {
        rawList = sportsBasic;
      } else if (isInstrument) {
        rawList = instrumentsBasic;
      } else if (isProfession) {
        rawList = professionsBasic;
      } else if (isFamily) {
        rawList = familyBasic;
      } else if (isClassroom) {
        rawList = classroomSupplies;
      } else if (isPlaces) {
        rawList = placesUrban;
      } else if (isWeather) {
        rawList = weatherPhenomena;
      } else if (isAnimals) {
        rawList = animalsFarm;
      } else if (isFruits) {
        rawList = fruitsBasic;
      } else if (isVegetables) {
        rawList = vegetablesGreens;
      } else if (isFood) {
        rawList = foodMeals;
      } else if (isRoutine) {
        rawList = routineBasic;
      } else {
        rawList = isOrd ? ordinal1a20 : numeros1a20.map(([word, digit]) => ({ word, digit }));
      }
    } else if (groupKey === "group2") {
      if (isBody) {
        rawList = bodyInternal;
      } else if (isClothing) {
        rawList = clothingWomens;
      } else if (isTastes) {
        rawList = tastesAdvanced;
      } else if (isHouse) {
        rawList = houseLiving;
      } else if (isCalendar) {
        rawList = calendarMonths;
      } else if (isColor) {
        rawList = colorMiddle;
      } else if (isSport) {
        rawList = sportsMiddle;
      } else if (isInstrument) {
        rawList = instrumentsMiddle;
      } else if (isProfession) {
        rawList = professionsMiddle;
      } else if (isFamily) {
        rawList = familyMiddle;
      } else if (isClassroom) {
        rawList = classroomShapes;
      } else if (isPlaces) {
        rawList = placesShops;
      } else if (isWeather) {
        rawList = weatherPhrases;
      } else if (isAnimals) {
        rawList = animalsForest;
      } else if (isFruits) {
        rawList = fruitsBerries;
      } else if (isVegetables) {
        rawList = vegetablesTubers;
      } else if (isFood) {
        rawList = foodPantry;
      } else if (isRoutine) {
        rawList = routineCommands;
      } else {
        rawList = isOrd ? ordinal21a100 : numeros21a100.map(([word, digit]) => ({ word, digit }));
      }
    } else if (groupKey === "group3") {
      if (isTastes) {
        rawList = cookingVerbsList;
      } else if (isHouse) {
        rawList = houseKitchen;
      } else if (isCalendar) {
        rawList = calendarTime;
      } else if (isColor) {
        rawList = colorAdvanced;
      } else if (isSport) {
        rawList = sportsAdvanced;
      } else if (isInstrument) {
        rawList = instrumentsAdvanced;
      } else if (isProfession) {
        rawList = professionsAdvanced;
      } else if (isFamily) {
        rawList = familyAdvanced;
      } else if (isClassroom) {
        rawList = classroomCountries;
      } else if (isPlaces) {
        rawList = placesTransport;
      } else if (isAnimals) {
        rawList = animalsBirds;
      } else if (isFood) {
        rawList = foodPrepared;
      } else if (isRoutine) {
        rawList = routineRemaining;
      } else {
        rawList = isOrd ? ordinalDecenas : decenas.map(([word, digit]) => ({ word, digit }));
      }
    } else if (groupKey === "group4") {
      if (isHouse) {
        rawList = houseBedroom;
      } else if (isAnimals) {
        rawList = animalsReptiles;
      }
    } else if (groupKey === "group5") {
      if (isHouse) {
        rawList = houseBathroom;
      }
    }
    return rawList;
  };

  const getModuleTotalPool = (): NumberItem[] => {
    const isOrd = activeModule === 2;
    const isCalendar = activeModule === 3;
    const isColor = activeModule === 4;
    const isSport = activeModule === 5;
    const isInstrument = activeModule === 6;
    const isProfession = activeModule === 7;
    const isFamily = activeModule === 8;
    const isHouse = activeModule === 9;
    const isClassroom = activeModule === 10;
    const isPlaces = activeModule === 11;
    const isWeather = activeModule === 12;
    const isAnimals = activeModule === 13;
    const isFruits = activeModule === 14;
    const isVegetables = activeModule === 15;
    const isFood = activeModule === 16;
    const isTastes = activeModule === 17;
    const isClothing = activeModule === 18;
    const isBody = activeModule === 19;
    const isRoutine = activeModule === 20;

    if (isCalendar) return totalCalendar;
    if (isColor) return totalColors;
    if (isSport) return totalSports;
    if (isInstrument) return totalInstruments;
    if (isProfession) return totalProfessions;
    if (isFamily) return totalFamily;
    if (isHouse) return totalHouse;
    if (isClassroom) return totalClassroom;
    if (isPlaces) return totalPlaces;
    if (isWeather) return totalWeather;
    if (isAnimals) return totalAnimals;
    if (isFruits) return totalFruits;
    if (isVegetables) return totalVegetables;
    if (isFood) return totalFood;
    if (isClothing) return totalClothing;
    if (isBody) return totalBody;
    if (isRoutine) return totalRoutine;
    if (isTastes) return [...totalTastes, ...cookingVerbsList];
    return isOrd ? totalOrdinal100 : totalNumeros100.map(([word, digit]) => ({ word, digit }));
  };

  const iniciarFastTest = () => {
    stopSpeaking();

    // 1. Determine the pool of items practiced in this session.
    let pool = sessionBaseList.filter(item => item && item.word);
    if (pool.length === 0) {
      // Fallback: use total module pool
      pool = getModuleTotalPool();
    }

    if (pool.length === 0) return;

    // Ensure we keep track of the session base and pending lists
    let activePending = fastTestPendingList.length > 0 ? [...fastTestPendingList] : [...pool];

    let selected: NumberItem[] = [];

    if (pool.length <= 8) {
      // Less than or equal to 8 words: take all of them shuffled
      selected = shuffleList(pool);
      // Reset pending for next rounds
      activePending = [...pool];
    } else {
      // Greater than 8 words: run our beautiful 8-item rotating loop
      if (activePending.length >= 8) {
        // Take 8 randomly from pending
        const shuffledPending = shuffleList(activePending);
        selected = shuffledPending.slice(0, 8);
        // Remove selected from pending
        const selectedWords = new Set(selected.map(item => item.word));
        activePending = activePending.filter(item => !selectedWords.has(item.word));
      } else {
        // Pending has less than 8 items: take all pending, then pad
        const remainingUntested = [...activePending];
        const needed = 8 - remainingUntested.length;
        const untestedWords = new Set(remainingUntested.map(item => item.word));
        const testedItems = pool.filter(item => !untestedWords.has(item.word));
        const padded = shuffleList(testedItems).slice(0, needed);
        
        selected = [...remainingUntested, ...padded];
        // Reset pending to the entire pool except the ones currently selected
        const selectedWords = new Set(selected.map(item => item.word));
        activePending = pool.filter(item => !selectedWords.has(item.word));
      }
    }

    // Save pending list state
    setFastTestPendingList(activePending);

    // 2. Launch the selected items in the appropriate component/mode
    if (subType === "play3_30" || subType === "play3_80" || subType === "play3_80_p1" || subType === "play3_80_p2" || subType === "play3_fast") {
      // Sentences: map NumberItem to TrackedSentence
      const mappedSentences = selected.map(item => ({
        english: item.symbol || "",
        correct: item.word,
        distractors: (item.distractors || ["", ""]) as [string, string],
        plusOne: 0
      }));
      setFastTestSentencesOverride(mappedSentences);
      setSubType("play3_fast");
      setLastPlayMode("3");
      setMode("PLAY3_ROUTAINE");
    } else if (subType === "play4_v1" || subType === "play4_v2" || subType === "play4_fast") {
      // Routine Vocab: map NumberItem to TrackedWord
      const mappedVocab = selected.map(item => ({
        eng: item.symbol || "",
        esp: item.word,
        plusOne: 0
      }));
      setFastTestVocabOverride(mappedVocab);
      setSubType("play4_fast");
      setLastPlayMode("4");
      setMode("PLAY4_ROUTAINE");
    } else {
      // Standard modules: set currentList to selected, and start PLAY3 (Writing exam)
      setCurrentList(selected);
      setCurrentIndex(0);
      setCorrectCount(0);
      setErrorCount(0);
      const cleanSub = subType.endsWith("-fast") ? subType : `${subType}-fast`;
      setSubType(cleanSub);
      setSubTypeLabel("FAST TEST (8 WORDS)");
      setDisplayTitle("⚡ FAST WRITING TEST");
      setLastPlayMode("3");
      setMode("PLAY3");
    }
  };

  const handleAgain = () => {
    stopSpeaking();
    if (mode === "RESULTS") {
      if (subType === "play3_fast" || subType === "play4_fast" || subType.endsWith("-fast")) {
        iniciarFastTest();
      } else if (subType === "group1" || subType === "group2" || subType === "group3" || subType === "group4" || subType === "group5") {
        if (lastPlayMode === "4" || lastPlayMode === "5") {
          iniciarPlay(subType as any, false, "4");
        } else {
          iniciarPlay(subType as any, true, "1");
        }
      } else if (subType.startsWith("modo_5_minutos")) {
        const parts = subType.split("_");
        const count = parseInt(parts[parts.length - 1], 10);
        iniciarModo5Minutos(!isNaN(count) && count > 0 ? count : 15);
      } else if (subType.startsWith("repaso_rapido")) {
        const parts = subType.split("_");
        const count = parseInt(parts[parts.length - 1], 10);
        iniciarRepasoRapido(!isNaN(count) && count > 0 ? count : 15);
      } else if (subType.includes("-random")) {
        const [sizeStr, , partStr] = subType.split("-");
        const size = parseInt(sizeStr, 10);
        const part = partStr === "p1" ? 1 : partStr === "p2" ? 2 : undefined;
        iniciarMultiple(size as any, part);
      } else if (subType.endsWith("-exam")) {
        const size = parseInt(subType.split("-")[0], 10);
        iniciarExamen(size as any);
      } else if (subType === "play3_30" || subType === "play3_80" || subType === "play3_80_p1" || subType === "play3_80_p2") {
        setMode("PLAY3_ROUTAINE");
      } else if (subType === "play4_v1" || subType === "play4_v2") {
        setMode("PLAY4_ROUTAINE");
      }
    }
  };

  const handleMainMenu = () => {
    stopSpeaking();
    if (activeModule === 999 || activeModule === 994) {
      setActiveModule(null);
    } else {
      setMode("MENU");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B1B3D] flex items-start justify-center p-0 sm:p-4 select-none animate-[fadeIn_0.5s_ease-out] overflow-y-auto">
      
      {/* Unified smooth scrolling container */}
      <div 
        className="w-full sm:max-w-[600px] min-h-screen sm:min-h-[850px] bg-gradient-to-b from-[#0E1F42] to-[#07122E] border-0 sm:border sm:border-[#00FF66]/25 rounded-none sm:rounded-[30px] shadow-[0_0_0_1px_rgba(0,255,102,0.125),_0_20px_60px_rgba(0,0,0,0.9),_0_0_100px_rgba(0,255,102,0.063)] flex flex-col relative transition-all duration-300 pb-12"
        id="phoneAppLayout"
      >
        
        {/* Dynamic transition screen flow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule === null ? "modules-dashboard" : `${activeModule}-${mode}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
            id="dynamicTransitionContainer"
          >
            {activeModule === null ? (
              <ModulesMenu
                onSelectModule={(id, wordCount) => {
                  if (id === 999) {
                    iniciarModo5Minutos(wordCount);
                  } else if (id === 994) {
                    iniciarRepasoRapido(wordCount);
                  } else if (id === 998) {
                    setActiveModule(998);
                    setMode("WELCOME");
                  } else if (id === 997) {
                    setActiveModule(997);
                    setMode("PRACTICE_READ_LISTEN");
                  } else if (id === 996) {
                    setActiveModule(996);
                    setMode("STUDENT_EXAM");
                  } else if (id === 995) {
                    setActiveModule(995);
                    setMode("DICCIONARIO");
                  } else {
                    setActiveModule(id);
                    setMode("MENU");
                  }
                }}
              />
            ) : activeModule === 998 ? (
              <WelcomeView onBack={() => setActiveModule(null)} />
            ) : activeModule === 997 ? (
              <PracticeReadListen onBack={() => setActiveModule(null)} />
            ) : activeModule === 996 ? (
              <StudentExam onBack={() => setActiveModule(null)} />
            ) : activeModule === 995 ? (
              <DictionaryView onBack={() => setActiveModule(null)} />
            ) : (
              <>
                {mode === "MENU" && (
                  <MainMenu
                    displayTitle={
                      activeModule === 20 ? "M20 ROUTINE & COMMANDS" :
                      activeModule === 19 ? "M19 BODY & HUMAN ANATOMY" :
                      activeModule === 18 ? "M18 CLOTHING & OUTLOOK" :
                      activeModule === 17 ? "M17 TASTES & COOKING" :
                      activeModule === 16 ? "M16 FOOD & DRINKS" :
                      activeModule === 15 ? "M15 VEGETABLES & LEGUMES" :
                      activeModule === 14 ? "M14 FRUITS & NUTS" :
                      activeModule === 13 ? "M13 WILDLIFE & ANIMALS" :
                      activeModule === 12 ? "M12 WEATHER" :
                      activeModule === 11 ? "M11 PLACES" :
                      activeModule === 10 ? "M10 CLASSROOM" :
                      activeModule === 9 ? "M9 HOUSE & HOME" :
                      activeModule === 8 ? "M8 FAMILY & PEOPLE" :
                      activeModule === 7 ? "M7 PROFESSIONS" :
                      activeModule === 6 ? "M6 INSTRUMENTS" :
                      activeModule === 5 ? "M5 SPORTS" :
                      activeModule === 4 ? "M4 COLORS" :
                      activeModule === 3 ? "M3 DAYS, MONTHS & TIME" :
                      activeModule === 2 ? "M2 ORDINAL NUMBERS" :
                      "M1 NATURAL NUMBERS"
                    }
                    displaySubtitle={
                      activeModule === 20 ? "RUTINA DIARIA Y COMANDOS" :
                      activeModule === 19 ? "CUERPO Y ANATOMÍA" :
                      activeModule === 18 ? "ROPA Y ACCESORIOS" :
                      activeModule === 17 ? "SABORES Y COCINA" :
                      activeModule === 16 ? "ALIMENTOS Y BEBIDAS" :
                      activeModule === 15 ? "VERDURAS Y LEGUMBRES" :
                      activeModule === 14 ? "FRUTAS Y FRUTOS SECOS" :
                      activeModule === 13 ? "ANIMALES Y FAUNA" :
                      activeModule === 12 ? "CLIMA Y ESTACIONES" :
                      activeModule === 11 ? "LUGARES Y TRANSPORTE" :
                      activeModule === 10 ? "AULA Y MATERIAS" :
                      activeModule === 9 ? "CASA Y VOCABULARIO" :
                      activeModule === 8 ? "FAMILIA Y PERSONAS" :
                      activeModule === 7 ? "PROFESIONES" :
                      activeModule === 6 ? "INSTRUMENTOS" :
                      activeModule === 5 ? "DEPORTES" :
                      activeModule === 4 ? "COLORES" :
                      activeModule === 3 ? "DÍAS, MESES Y TIEMPO" :
                      activeModule === 2 ? "NÚMEROS ORDINALES" :
                      "NÚMEROS NATURALES"
                    }
                    onSelectPlay={(nextMode) => setMode(nextMode)}
                    onBackToModules={() => {
                       setActiveModule(null);
                    }}
                    isRoutine={activeModule === 20}
                    showPlay4={activeModule === 1 || activeModule === 2 || activeModule === 3 || activeModule === 4 || activeModule === 5 || activeModule === 6 || activeModule === 7 || activeModule === 8 || activeModule === 9 || activeModule === 10 || activeModule === 11 || activeModule === 12 || activeModule === 13 || activeModule === 14 || activeModule === 15 || activeModule === 16 || activeModule === 17 || activeModule === 18 || activeModule === 19 || activeModule === 20}
                  />
                )}

                {mode === "SUBPLAY1" && (
                  <Subplay1Menu isSport={activeModule === 5}
                    isOrdinal={activeModule === 2}
                    isCalendar={activeModule === 3}
                    isColor={activeModule === 4}
                    isInstrument={activeModule === 6}
                    isProfession={activeModule === 7}
                    isFamily={activeModule === 8}
                    isHouse={activeModule === 9}
                    isClassroom={activeModule === 10}
                    isPlaces={activeModule === 11}
                    isWeather={activeModule === 12}
                    isAnimals={activeModule === 13}
                    isFruits={activeModule === 14}
                    isVegetables={activeModule === 15}
                    isFood={activeModule === 16}
                    isTastes={activeModule === 17}
                    isClothing={activeModule === 18}
                    isBody={activeModule === 19}
                    isRoutine={activeModule === 20}
                    onBack={() => setMode("MENU")}
                    onSelectGroup={(key) => iniciarPlay(key, false, "1")}
                  />
                )}

                {mode === "SUBPLAY4" && (
                  <Subplay1Menu isSport={activeModule === 5}
                    isOrdinal={activeModule === 2}
                    isCalendar={activeModule === 3}
                    isColor={activeModule === 4}
                    isInstrument={activeModule === 6}
                    isProfession={activeModule === 7}
                    isFamily={activeModule === 8}
                    isHouse={activeModule === 9}
                    isClassroom={activeModule === 10}
                    isPlaces={activeModule === 11}
                    isWeather={activeModule === 12}
                    isAnimals={activeModule === 13}
                    isFruits={activeModule === 14}
                    isVegetables={activeModule === 15}
                    isFood={activeModule === 16}
                    isTastes={activeModule === 17}
                    isClothing={activeModule === 18}
                    isBody={activeModule === 19}
                    isRoutine={activeModule === 20}
                    isPlay4={true}
                    onBack={() => setMode("MENU")}
                    onSelectGroup={(key) => iniciarPlay(key, false, "4")}
                  />
                )}

                {mode === "SUBPLAY2" && (
                  <Subplay2Menu isSport={activeModule === 5}
                    isOrdinal={activeModule === 2}
                    isCalendar={activeModule === 3}
                    isColor={activeModule === 4}
                    isInstrument={activeModule === 6}
                    isProfession={activeModule === 7}
                    isFamily={activeModule === 8}
                    isHouse={activeModule === 9}
                    isClassroom={activeModule === 10}
                    isPlaces={activeModule === 11}
                    isWeather={activeModule === 12}
                    isAnimals={activeModule === 13}
                    isFruits={activeModule === 14}
                    isVegetables={activeModule === 15}
                    isFood={activeModule === 16}
                    isTastes={activeModule === 17}
                    isClothing={activeModule === 18}
                    isBody={activeModule === 19}
                    isRoutine={activeModule === 20}
                    onBack={() => setMode("MENU")}
                    onSelectSize={(size, part) => iniciarMultiple(size, part)}
                  />
                )}

                {mode === "SUBPLAY3" && (
                  <Subplay3Menu isSport={activeModule === 5}
                    isOrdinal={activeModule === 2}
                    isCalendar={activeModule === 3}
                    isColor={activeModule === 4}
                    isInstrument={activeModule === 6}
                    isProfession={activeModule === 7}
                    isFamily={activeModule === 8}
                    isHouse={activeModule === 9}
                    isClassroom={activeModule === 10}
                    isPlaces={activeModule === 11}
                    isWeather={activeModule === 12}
                    isAnimals={activeModule === 13}
                    isFruits={activeModule === 14}
                    isVegetables={activeModule === 15}
                    isFood={activeModule === 16}
                    isTastes={activeModule === 17}
                    isClothing={activeModule === 18}
                    isBody={activeModule === 19}
                    isRoutine={activeModule === 20}
                    onBack={() => setMode("MENU")}
                    onSelectDifficulty={(size) => iniciarExamen(size)}
                  />
                )}

                {mode === "PLAY1" && (
                  <Play1View
                    currentList={currentList}
                    currentIndex={currentIndex}
                    autoSpeakEnabled={autoSpeakEnabled}
                    onCorrect={handleItemCorrect}
                    onIncorrect={handlePlay1Incorrect}
                    onBack={() => {
                      if (activeModule === 999) {
                        setActiveModule(null);
                      } else {
                        setMode("SUBPLAY1");
                      }
                    }}
                    onToggleAutoSpeak={toggleAutoSpeak}
                    openPenalty={openPenaltyModal}
                    displayTitle={displayTitle}
                  />
                )}

                {mode === "PLAY2" && (
                  <Play2View
                    currentList={currentList}
                    currentIndex={currentIndex}
                    autoSpeakEnabled={autoSpeakEnabled}
                    onCorrect={handleItemCorrect}
                    onIncorrect={handleItemIncorrect}
                    onBack={() => {
                      if (activeModule === 994) {
                        setActiveModule(null);
                      } else {
                        setMode("SUBPLAY2");
                      }
                    }}
                    onToggleAutoSpeak={toggleAutoSpeak}
                    openPenalty={openPenaltyModal}
                    insertIncorrectQuestionAgain={insertIncorrectPlay2Again}
                    displayTitle={displayTitle}
                  />
                )}

                {mode === "PLAY3" && (
                  <Play3View
                    currentList={currentList}
                    currentIndex={currentIndex}
                    autoSpeakEnabled={autoSpeakEnabled}
                    onCorrect={handleItemCorrect}
                    onIncorrect={handleItemIncorrect}
                    onBack={() => setMode(activeModule === 20 ? "SUBPLAY5_ROUTAINE" : "SUBPLAY3")}
                    onToggleAutoSpeak={toggleAutoSpeak}
                    openPenalty={openPenaltyModal}
                    insertIncorrectQuestionRandomly={insertIncorrectPlay3Randomly}
                    displayTitle={displayTitle}
                  />
                )}

                {mode === "PLAY4" && (
                  <Play4View
                    currentList={currentList}
                    autoSpeakEnabled={autoSpeakEnabled}
                    onCorrect={() => setCorrectCount(prev => prev + 1)}
                    onIncorrect={handleItemIncorrect}
                    onComplete={() => setMode("RESULTS")}
                    onBack={() => setMode("SUBPLAY4")}
                    onToggleAutoSpeak={toggleAutoSpeak}
                    openPenalty={openPenaltyModal}
                    isRoutine={activeModule === 20}
                    displayTitle={
                      activeModule === 1 || activeModule === 2
                        ? displayTitle
                        : subTypeLabel.replace(" (PAIRS)", "")
                    }
                  />
                )}

                {mode === "SUBPLAY3_ROUTAINE" && (
                  <Subplay3RoutineMenu
                    onBack={() => setMode("MENU")}
                    onSelectMode={(subMode) => {
                      setSubType(subMode);
                      setLastPlayMode("3");
                      setMode("PLAY3_ROUTAINE");
                    }}
                  />
                )}

                {mode === "SUBPLAY4_ROUTAINE" && (
                  <Subplay4RoutineMenu
                    onBack={() => setMode("MENU")}
                    onSelectMode={(subMode) => {
                      setSubType(subMode);
                      setLastPlayMode("4");
                      setMode("PLAY4_ROUTAINE");
                    }}
                  />
                )}

                {mode === "SUBPLAY5_ROUTAINE" && (
                  <Subplay3Menu
                    isSport={activeModule === 5}
                    isOrdinal={activeModule === 2}
                    isCalendar={activeModule === 3}
                    isColor={activeModule === 4}
                    isInstrument={activeModule === 6}
                    isProfession={activeModule === 7}
                    isFamily={activeModule === 8}
                    isHouse={activeModule === 9}
                    isClassroom={activeModule === 10}
                    isPlaces={activeModule === 11}
                    isWeather={activeModule === 12}
                    isAnimals={activeModule === 13}
                    isFruits={activeModule === 14}
                    isVegetables={activeModule === 15}
                    isFood={activeModule === 16}
                    isTastes={activeModule === 17}
                    isClothing={activeModule === 18}
                    isBody={activeModule === 19}
                    isRoutine={activeModule === 20}
                    onBack={() => setMode("MENU")}
                    onSelectDifficulty={(size) => iniciarExamen(size)}
                  />
                )}

                {mode === "PLAY3_ROUTAINE" && (
                  <PlaySentences
                    mode={subType as "play3_30" | "play3_80" | "play3_80_p1" | "play3_80_p2" | "play3_fast"}
                    itemsOverride={fastTestSentencesOverride}
                    onBack={() => setMode("SUBPLAY3_ROUTAINE")}
                    onComplete={(correct, errors, originalTotal) => {
                      setCorrectCount(correct);
                      setErrorCount(errors);
                      const isFastMode = subType === "play3_fast";
                      setSubTypeLabel(
                        isFastMode 
                          ? "FAST ROUTINE SENTENCES" 
                          : subType === "play3_30" 
                            ? "ROUTINE SENTENCES 30" 
                            : subType === "play3_80_p1"
                              ? "ROUTINE SENTENCES 80 (PART 1)"
                              : subType === "play3_80_p2"
                                ? "ROUTINE SENTENCES 80 (PART 2)"
                                : "ROUTINE SENTENCES 80"
                      );
                      if (!isFastMode) {
                        let sentences = sentencesList80;
                        if (subType === "play3_30") {
                          sentences = sentencesList30;
                        } else if (subType === "play3_80_p1") {
                          sentences = sentencesList80.slice(0, 40);
                        } else if (subType === "play3_80_p2") {
                          sentences = sentencesList80.slice(40, 80);
                        }
                        const pool = sentences.map((s, idx) => ({
                          word: s.correct,
                          digit: idx + 1,
                          symbol: s.english,
                          distractors: s.distractors,
                          isSentence: true
                        }));
                        setSessionBaseList(pool);
                        setFastTestPendingList(pool);
                      }
                      setCurrentList(Array(originalTotal).fill({} as any));
                      setMode("RESULTS");
                    }}
                    openPenalty={openPenaltyModal}
                  />
                )}

                {mode === "PLAY4_ROUTAINE" && (
                  <PlayWordsMultiple
                    mode={subType as "play4_v1" | "play4_v2" | "play4_fast"}
                    itemsOverride={fastTestVocabOverride}
                    onBack={() => setMode("SUBPLAY4_ROUTAINE")}
                    onComplete={(correct, errors, originalTotal) => {
                      setCorrectCount(correct);
                      setErrorCount(errors);
                      const isFastMode = subType === "play4_fast";
                      setSubTypeLabel(isFastMode ? "FAST ROUTINE VOCABULARY" : subType === "play4_v1" ? "ROUTINE VOCABULARY 1" : "ROUTINE VOCABULARY 2");
                      if (!isFastMode) {
                        const pool = allVocabList.map(([eng, esp], idx) => ({
                          word: esp,
                          digit: idx + 1,
                          symbol: eng
                        }));
                        setSessionBaseList(pool);
                        setFastTestPendingList(pool);
                      }
                      setCurrentList(Array(originalTotal).fill({} as any));
                      setMode("RESULTS");
                    }}
                    openPenalty={openPenaltyModal}
                  />
                )}

                {mode === "RESULTS" && (
                  <ResultsView
                    correctCount={correctCount ?? 0}
                    totalQuestionCount={currentList?.length ?? 0}
                    errorCount={errorCount ?? 0}
                    onAgain={handleAgain}
                    onMainMenu={handleMainMenu}
                    onFastTest={iniciarFastTest}
                    subTypeLabel={subTypeLabel || ""}
                    lastPlayMode={lastPlayMode || "1"}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Global Floating Penalty Modal Overlay */}
        <PenaltyModal
          isOpen={penaltyModal.isOpen}
          correctWord={penaltyModal.correctWord}
          isExamMode={penaltyModal.isExamMode}
          plusOneVal={penaltyModal.plusOneVal}
          onCompleted={closePenaltyModal}
          onMistake={penaltyModal.onPenaltyMistake}
        />


      </div>
    </div>
  );
}
