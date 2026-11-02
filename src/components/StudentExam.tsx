/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  GraduationCap, 
  Flame, 
  Heart, 
  Volume2, 
  RotateCcw, 
  Home, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Sparkles,
  X
} from "lucide-react";
import { speakText, stopSpeaking } from "../utils/audio";
import { getAmericanIPA, getAmericanIPAOrdinal } from "../data";
import { NumberItem } from "../types";
import { getStats, updateStatsOnGameComplete } from "../utils/stats";
import { getWordEmoji } from "../utils/wordEmojis";
import { WordEmoji } from "./WordEmoji";

// Import all vocabulary lists from data
import {
  totalColors,
  totalFamily,
  totalFruits,
  totalVegetables,
  totalFood,
  totalRoutine,
  totalAnimals,
  totalClothing,
  totalBody,
  totalWeather,
  totalPlaces,
  totalClassroom,
  totalSports,
  totalInstruments,
  totalProfessions,
  totalCalendar,
  totalHouse,
  totalTastes
} from "../data";

// 12 Standard Spanish Motivational Quotes
const MOTIVATIONAL_QUOTES = [
  "¡El éxito es la suma de pequeños esfuerzos repetidos día tras día!",
  "¡No te detengas, estás haciendo un trabajo increíble!",
  "¡El conocimiento es un tesoro que te acompañará para siempre!",
  "¡Cada palabra que aprendes es un paso más hacia tus sueños!",
  "¡Tu mente tiene un poder infinito, sigue alimentándola!",
  "¡La práctica constante te convertirá en un maestro!",
  "¡Siente el fuego del saber en tu corazón y vencerás!",
  "¡Sigue adelante, el aprendizaje abre todas las puertas!",
  "¡Aprender inglés es tu pasaporte al mundo entero!",
  "¡Tu esfuerzo de hoy dará grandes frutos mañana!",
  "¡Estás progresando a pasos agigantados, sigue así!",
  "¡La educación es el arma más poderosa para cambiar el mundo!"
];

// Shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Normalize matching to prevent minor dash/space penalty
const verifyAnswer = (input: string, correct: string, alternatives?: string[]): boolean => {
  const normInput = input.trim().toLowerCase().replace(/[-\s]/g, "");
  const normCorrect = correct.trim().toLowerCase().replace(/[-\s]/g, "");
  
  if (normInput === normCorrect) return true;
  
  if (alternatives) {
    for (const alt of alternatives) {
      const normAlt = alt.trim().toLowerCase().replace(/[-\s]/g, "");
      if (normInput === normAlt) return true;
    }
  }
  return false;
};

// Exam stage types
type ExamStage = 
  | "INTRO"
  | "PLAYING_TEST"
  | "TEST_COMPLETED"
  | "FAILED"
  | "CERTIFIED";

interface MissedWord {
  spanish: string;
  correct: string;
  typed: string;
}

interface TestQuestion {
  id: number;
  spanish: string;
  english: string;
  correct: string;
  alternatives?: string[];
}

// Test 3 sentence completion questions (Numbers - Expanded to 20 questions)
const ALL_TEST3_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    spanish: "Yo tengo _____ (35) años.",
    english: "I am _____ (35) years old.",
    correct: "thirty-five",
    alternatives: ["thirty five"]
  },
  {
    id: 2,
    spanish: "Mi hermano tiene _____ (30) pelotas.",
    english: "My brother has _____ (30) balls.",
    correct: "thirty"
  },
  {
    id: 3,
    spanish: "Mi mamá tiene _____ (3) cucharas.",
    english: "My mom has _____ (3) spoons.",
    correct: "three"
  },
  {
    id: 4,
    spanish: "Yo tengo _____ (13) amigos.",
    english: "I have _____ (13) friends.",
    correct: "thirteen"
  },
  {
    id: 5,
    spanish: "Mi hermana sacó _____ (90) en su examen.",
    english: "My sister got _____ (90) on her exam.",
    correct: "ninety"
  },
  {
    id: 6,
    spanish: "El granjero compró _____ (45) ovejas.",
    english: "The farmer bought _____ (45) sheep.",
    correct: "forty-five",
    alternatives: ["forty five"]
  },
  {
    id: 7,
    spanish: "Nuestra aula tiene _____ (12) carpetas.",
    english: "Our classroom has _____ (12) desks.",
    correct: "twelve"
  },
  {
    id: 8,
    spanish: "Mi tío tiene _____ (18) camisas de vestir.",
    english: "My uncle has _____ (18) dress shirts.",
    correct: "eighteen"
  },
  {
    id: 9,
    spanish: "Hay _____ (50) estrellas brillantes en la bandera.",
    english: "There are _____ (50) bright stars on the flag.",
    correct: "fifty"
  },
  {
    id: 10,
    spanish: "Mi hermana tiene _____ (15) años.",
    english: "My sister is _____ (15) years old.",
    correct: "fifteen"
  },
  {
    id: 11,
    spanish: "Mi tía preparó _____ (40) pasteles de manzana.",
    english: "My aunt prepared _____ (40) apple pies.",
    correct: "forty"
  },
  {
    id: 12,
    spanish: "Tengo _____ (11) primos en mi familia.",
    english: "I have _____ (11) cousins in my family.",
    correct: "eleven"
  },
  {
    id: 13,
    spanish: "Había _____ (100) globos de helio flotando.",
    english: "There were _____ (100) helium balloons floating.",
    correct: "one hundred",
    alternatives: ["hundred", "a hundred"]
  },
  {
    id: 14,
    spanish: "El libro contiene _____ (80) páginas ilustradas.",
    english: "The book contains _____ (80) illustrated pages.",
    correct: "eighty"
  },
  {
    id: 15,
    spanish: "Mi gallina puso _____ (12) huevos esta semana.",
    english: "My hen laid _____ (12) eggs this week.",
    correct: "twelve"
  },
  {
    id: 16,
    spanish: "Mi abuelo cumplió _____ (70) años de edad.",
    english: "My grandfather turned _____ (70) years old.",
    correct: "seventy"
  },
  {
    id: 17,
    spanish: "En el zoológico vimos _____ (16) monos traviesos.",
    english: "At the zoo, we saw _____ (16) mischievous monkeys.",
    correct: "sixteen"
  },
  {
    id: 18,
    spanish: "Él caminó _____ (20) kilómetros bajo la lluvia.",
    english: "He walked _____ (20) kilometers in the rain.",
    correct: "twenty"
  },
  {
    id: 19,
    spanish: "La canasta de frutas tiene _____ (8) plátanos.",
    english: "The fruit basket has _____ (8) bananas.",
    correct: "eight"
  },
  {
    id: 20,
    spanish: "La jirafa alta tiene _____ (9) manchas grandes.",
    english: "The tall giraffe has _____ (9) large spots.",
    correct: "nine"
  }
];

// Test 4 sentence completion questions (Other modules - Expanded to 20 questions)
const ALL_TEST4_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    spanish: "Si hoy es jueves, ayer fue _____.",
    english: "If today is Thursday, yesterday was _____.",
    correct: "Wednesday",
    alternatives: ["wednesday"]
  },
  {
    id: 2,
    spanish: "¿De qué color es el sol? Es _____.",
    english: "What color is the sun? It is _____.",
    correct: "yellow",
    alternatives: ["Yellow"]
  },
  {
    id: 3,
    spanish: "¿De qué color es la rosa? Es _____.",
    english: "What color is the rose? It is _____.",
    correct: "red",
    alternatives: ["Red"]
  },
  {
    id: 4,
    spanish: "Escribe celeste en inglés: _____.",
    english: "The color of a clear daytime sky in English is _____.",
    correct: "sky blue",
    alternatives: ["light blue", "lightblue", "skyblue"]
  },
  {
    id: 5,
    spanish: "Sabes cómo se escribe novia en inglés: _____.",
    english: "A boy's female romantic partner in English is _____.",
    correct: "girlfriend"
  },
  {
    id: 6,
    spanish: "¿De qué color es la hoja de un papel limpio? Es _____.",
    english: "What color is a clean sheet of paper? It is _____.",
    correct: "white",
    alternatives: ["White"]
  },
  {
    id: 7,
    spanish: "Sabes cómo se escribe tío en inglés: _____.",
    english: "My father's brother is my _____.",
    correct: "uncle",
    alternatives: ["Uncle"]
  },
  {
    id: 8,
    spanish: "¿De qué color es el oro? Es _____.",
    english: "What color is gold? It is _____.",
    correct: "gold",
    alternatives: ["Gold", "yellow"]
  },
  {
    id: 9,
    spanish: "La reina malvada le dio a Blancanieves una _____ envenenada.",
    english: "The evil queen gave Snow White a poisoned _____.",
    correct: "apple",
    alternatives: ["Apple"]
  },
  {
    id: 10,
    spanish: "El último mes del año es _____.",
    english: "The last month of the year is _____.",
    correct: "December",
    alternatives: ["december"]
  },
  {
    id: 11,
    spanish: "Si hoy es lunes, mañana será _____.",
    english: "If today is Monday, tomorrow will be _____.",
    correct: "Tuesday",
    alternatives: ["tuesday"]
  },
  {
    id: 12,
    spanish: "El papá de mi papá es mi _____.",
    english: "My dad's dad is my _____.",
    correct: "grandfather",
    alternatives: ["Grandfather", "grandpa"]
  },
  {
    id: 13,
    spanish: "Si ayer fue martes, ¿qué día es hoy? Hoy es _____.",
    english: "If yesterday was Tuesday, what day is today? Today is _____.",
    correct: "Wednesday",
    alternatives: ["wednesday"]
  },
  {
    id: 14,
    spanish: "Sabes cómo se escribe tía en inglés: _____.",
    english: "My mother's sister is my _____.",
    correct: "aunt",
    alternatives: ["Aunt"]
  },
  {
    id: 15,
    spanish: "¿Con qué día comienza la semana escolar? Es el _____.",
    english: "With which day does the school week begin? It's _____.",
    correct: "Monday",
    alternatives: ["monday"]
  },
  {
    id: 16,
    spanish: "¿Qué día sigue al viernes? Es el _____.",
    english: "What day follows Friday? It's _____.",
    correct: "Saturday",
    alternatives: ["saturday"]
  },
  {
    id: 17,
    spanish: "¿Cuál es el séptimo (7mo) día de la semana? Es el _____.",
    english: "What is the seventh (7th) day of the week? It is _____.",
    correct: "Sunday",
    alternatives: ["sunday"]
  },
  {
    id: 18,
    spanish: "El primer (1er) mes del año es _____.",
    english: "The first month of the year is _____.",
    correct: "January",
    alternatives: ["january"]
  },
  {
    id: 19,
    spanish: "¿De qué color es el cabello oscuro o el carbón? Es _____.",
    english: "What color is dark hair or coal? It is _____.",
    correct: "black",
    alternatives: ["Black"]
  },
  {
    id: 20,
    spanish: "Sabes cómo se escribe padre en inglés: _____.",
    english: "The male parent of a family is written _____.",
    correct: "father",
    alternatives: ["Father"]
  }
];

interface StudentExamProps {
  onBack: () => void;
}

export default function StudentExam({ onBack }: StudentExamProps) {
  // Local states for exam config
  const [examMode, setExamMode] = useState<"FAST" | "TRUTH" | "FINAL">("FAST");
  const [itemsPerTest, setItemsPerTest] = useState<number>(5);
  const [maxLives, setMaxLives] = useState<number>(3);

  // Master stage
  const [stage, setStage] = useState<ExamStage>("INTRO");

  // Theme and text variables (dynamic based on active mode/stage)
  const getThemeConfig = () => {
    if (stage === "INTRO") {
      return {
        accent: "#FF2A85",
        secondary: "#B0005C",
        title: "STUDENT OF EXAM",
        subtitle: "EXAMEN GENERAL"
      };
    }
    if (examMode === "FINAL") {
      return {
        accent: "#FFD700",
        secondary: "#FF8C00",
        title: "FINAL EXAM",
        subtitle: "EXAMEN FINAL"
      };
    }
    if (examMode === "TRUTH") {
      return {
        accent: "#00FF66",
        secondary: "#00D9FF",
        title: "TRUTH TEST",
        subtitle: "Prueba de la Verdad"
      };
    }
    return {
      accent: "#FF2A85",
      secondary: "#B0005C",
      title: "TEST FAST",
      subtitle: "PRUEBA RÁPIDA"
    };
  };

  const themeConfig = getThemeConfig();
  const themeAccentColor = themeConfig.accent;
  const themeSecondaryColor = themeConfig.secondary;
  const examTitleText = themeConfig.title;
  const examSubtitleText = themeConfig.subtitle;

  const [showRules, setShowRules] = useState<boolean>(false);
  const [currentTest, setCurrentTest] = useState<number>(1);
  const [lives, setLives] = useState<number>(3); // Lives remaining
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [testErrors, setTestErrors] = useState<number>(0);
  const [missedWords, setMissedWords] = useState<MissedWord[]>([]);
  const [randomMotivation, setRandomMotivation] = useState<string>("");

  // Pool of all words for random selection
  const [vocabPool, setVocabPool] = useState<NumberItem[]>([]);

  // Test 1: Word Translation Typing
  const [test1Items, setTest1Items] = useState<NumberItem[]>([]);
  const [test1Index, setTest1Index] = useState<number>(0);
  const [test1Typed, setTest1Typed] = useState<string>("");
  const test1InputRef = useRef<HTMLInputElement>(null);

  // Test 2: Card Matching Pairs
  const [test2LeftCards, setTest2LeftCards] = useState<{ id: string; label: string; word: string }[]>([]);
  const [test2RightCards, setTest2RightCards] = useState<{ id: string; label: string; word: string }[]>([]);
  const [test2SelectedLeft, setTest2SelectedLeft] = useState<string | null>(null);
  const [test2SelectedRight, setTest2SelectedRight] = useState<string | null>(null);
  const [test2MatchedWords, setTest2MatchedWords] = useState<string[]>([]);
  const [test2WrongLeft, setTest2WrongLeft] = useState<string | null>(null);
  const [test2WrongRight, setTest2WrongRight] = useState<string | null>(null);
  const [test2ClickLock, setTest2ClickLock] = useState<boolean>(false);

  // Test 3: Numbers sentence completion
  const [test3Questions, setTest3Questions] = useState<TestQuestion[]>([]);
  const [test3Index, setTest3Index] = useState<number>(0);
  const [test3Typed, setTest3Typed] = useState<string>("");
  const test3InputRef = useRef<HTMLInputElement>(null);

  // Test 4: Other modules sentence completion
  const [test4Questions, setTest4Questions] = useState<TestQuestion[]>([]);
  const [test4Index, setTest4Index] = useState<number>(0);
  const [test4Typed, setTest4Typed] = useState<string>("");
  const test4InputRef = useRef<HTMLInputElement>(null);

  // Test 5: Multiple Choice
  const [test5Items, setTest5Items] = useState<NumberItem[]>([]);
  const [test5Index, setTest5Index] = useState<number>(0);
  const [test5Options, setTest5Options] = useState<string[][]>([]); // 3 options per index

  // Sound and IPA resolution helpers
  const getIPA = (item: NumberItem): string => {
    if (!item) return "";
    if (item.ipa) return item.ipa;
    if (item.isOrdinal && typeof item.digit === "number") {
      return getAmericanIPAOrdinal(item.digit);
    }
    if (typeof item.digit === "number") {
      return getAmericanIPA(item.digit);
    }
    return "";
  };

  const getSpanishLabel = (item: NumberItem): string => {
    if (!item) return "";
    if (item.symbol) return item.symbol;
    if (typeof item.digit === "number") {
      return String(item.digit);
    }
    return item.word;
  };

  // Build pool on mount
  useEffect(() => {
    const combined: NumberItem[] = [
      ...(totalColors || []),
      ...(totalFamily || []),
      ...(totalFruits || []),
      ...(totalVegetables || []),
      ...(totalFood || []),
      ...(totalRoutine || []),
      ...(totalAnimals || []),
      ...(totalClothing || []),
      ...(totalBody || []),
      ...(totalWeather || []),
      ...(totalPlaces || []),
      ...(totalClassroom || []),
      ...(totalSports || []),
      ...(totalInstruments || []),
      ...(totalProfessions || []),
      ...(totalCalendar || []),
      ...(totalHouse || []),
      ...(totalTastes || [])
    ];
    // Keep only words that have clean values, and deduplicate by word (English representation)
    const uniqueMap = new Map<string, NumberItem>();
    combined.forEach(item => {
      if (item && item.word && item.word.trim().length > 0 && (item.symbol || typeof item.digit === "number")) {
        const key = item.word.trim().toLowerCase();
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      }
    });
    const filtered = Array.from(uniqueMap.values());
    setVocabPool(filtered);
    setRandomMotivation(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);

  // Update motivation on stage transitions and record stats when certified
  useEffect(() => {
    if (stage === "CERTIFIED" || stage === "FAILED") {
      setRandomMotivation(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }
    if (stage === "CERTIFIED") {
      updateStatsOnGameComplete(996, totalErrors);
    }
  }, [stage, totalErrors]);

  // Handle auto-speak for Test 1
  useEffect(() => {
    if (stage === "PLAYING_TEST" && currentTest === 1 && test1Items[test1Index]) {
      const timer = setTimeout(() => {
        speakText(test1Items[test1Index].word);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [stage, currentTest, test1Index, test1Items]);

  // Autofocus input fields
  useEffect(() => {
    if (stage === "PLAYING_TEST") {
      if (currentTest === 1 && test1InputRef.current) {
        test1InputRef.current.focus();
      } else if (currentTest === 3 && test3InputRef.current) {
        test3InputRef.current.focus();
      } else if (currentTest === 4 && test4InputRef.current) {
        test4InputRef.current.focus();
      }
    }
  }, [stage, currentTest, test1Index, test3Index, test4Index]);

  // Reset/Start Selected Exam function
  const startSelectedExam = (mode: "FAST" | "TRUTH" | "FINAL") => {
    setExamMode(mode);
    const wordCount = mode === "FINAL" ? 15 : (mode === "TRUTH" ? 10 : 5);
    const initialLives = mode === "FINAL" ? 1 : (mode === "TRUTH" ? 2 : 3);
    setItemsPerTest(wordCount);
    setMaxLives(initialLives);

    if (vocabPool.length < wordCount * 3) return;

    // 1. Prepare Test 1 Items (wordCount random words)
    const shuffledPool: NumberItem[] = shuffleArray(vocabPool);
    const test1: NumberItem[] = shuffledPool.slice(0, wordCount);
    setTest1Items(test1);
    setTest1Index(0);
    setTest1Typed("");

    // 2. Prepare Test 2 Cards (wordCount random words with unique Spanish labels, columns shuffled separately)
    const test2: NumberItem[] = [];
    const seenSpanishLabels = new Set<string>();
    for (const candidate of shuffledPool.slice(wordCount)) {
      const spLabel = getSpanishLabel(candidate).trim().toLowerCase();
      if (!seenSpanishLabels.has(spLabel)) {
        seenSpanishLabels.add(spLabel);
        test2.push(candidate);
        if (test2.length >= wordCount) break;
      }
    }
    const lefts = test2.map((item: NumberItem) => ({
      id: `L-${item.word}`,
      label: getSpanishLabel(item),
      emoji: getWordEmoji(item),
      word: item.word
    }));
    const rights = test2.map((item: NumberItem) => ({
      id: `R-${item.word}`,
      label: item.word,
      word: item.word
    }));
    setTest2LeftCards(shuffleArray(lefts));
    setTest2RightCards(shuffleArray(rights));
    setTest2SelectedLeft(null);
    setTest2SelectedRight(null);
    setTest2MatchedWords([]);
    setTest2WrongLeft(null);
    setTest2WrongRight(null);
    setTest2ClickLock(false);

    // 3. Prepare Test 3 dynamic random questions (wordCount random from larger pool)
    const shuffledTest3 = shuffleArray(ALL_TEST3_QUESTIONS).slice(0, wordCount);
    setTest3Questions(shuffledTest3);
    setTest3Index(0);
    setTest3Typed("");

    // 4. Prepare Test 4 dynamic random questions (wordCount random from larger pool)
    const shuffledTest4 = shuffleArray(ALL_TEST4_QUESTIONS).slice(0, wordCount);
    setTest4Questions(shuffledTest4);
    setTest4Index(0);
    setTest4Typed("");

    // 5. Prepare Test 5 Multiple Choice (wordCount random words)
    const test5: NumberItem[] = shuffledPool.slice(wordCount * 2, wordCount * 3);
    setTest5Items(test5);
    setTest5Index(0);

    // Generate options for each Test 5 item (1 correct, 2 distractors)
    const optionsArray: string[][] = [];
    test5.forEach((item: NumberItem) => {
      const distractors: string[] = shuffledPool
        .filter((p: NumberItem) => p.word !== item.word)
        .slice(0, 2)
        .map((p: NumberItem) => p.word);
      optionsArray.push(shuffleArray([item.word, ...distractors]));
    });
    setTest5Options(optionsArray);

    // Reset statistics
    setLives(initialLives);
    setTotalErrors(0);
    setTestErrors(0);
    setMissedWords([]);
    setCurrentTest(1);
    setStage("PLAYING_TEST");
  };

  const startExam = () => {
    startSelectedExam(examMode);
  };

  // Restart current test or restart the whole exam? 
  // Standard is resetting the whole exam to cleanly restore lives and maintain integrity.
  const handleAgain = () => {
    startExam();
  };

  // Lose life helper — returns true if the user just lost their last life
  const loseLife = (spanish: string, correct: string, typed: string): boolean => {
    const nextLives = lives - 1;
    setLives(nextLives);
    if (nextLives <= 0) {
      setStage("FAILED");
    }
    setTotalErrors(prev => prev + 1);
    setTestErrors(prev => prev + 1);
    setMissedWords(prev => [
      ...prev,
      { spanish, correct, typed: typed || "[Vacío]" }
    ]);
    return nextLives <= 0;
  };

  // ----------------------------------------------------
  // TEST 1 VERIFICATION
  // ----------------------------------------------------
  const handleTest1Verify = () => {
    const currentItem = test1Items[test1Index];
    if (!currentItem) return;

    const isCorrect = verifyAnswer(test1Typed, currentItem.word);
    let failedExam = false;
    if (isCorrect) {
      // Correct! Speak the word
      speakText(currentItem.word);
    } else {
      // Incorrect
      failedExam = loseLife(getSpanishLabel(currentItem), currentItem.word, test1Typed);
    }

    setTest1Typed("");
    if (failedExam) return;

    if (test1Index + 1 < itemsPerTest) {
      setTest1Index(prev => prev + 1);
    } else {
      setStage("TEST_COMPLETED");
    }
  };

  // ----------------------------------------------------
  // TEST 2 CARD MATCHING CLICK
  // ----------------------------------------------------
  const handleTest2CardClick = (side: "L" | "R", item: { label: string; word: string }) => {
    if (test2ClickLock) return;
    if (test2MatchedWords.includes(item.word)) return;

    if (side === "L") {
      setTest2SelectedLeft(item.word);
      // Check match if right was already selected
      if (test2SelectedRight) {
        evaluateTest2Match(item.word, test2SelectedRight);
      }
    } else {
      setTest2SelectedRight(item.word);
      // Check match if left was already selected
      if (test2SelectedLeft) {
        evaluateTest2Match(test2SelectedLeft, item.word);
      }
    }
  };

  const evaluateTest2Match = (leftWord: string, rightWord: string) => {
    if (leftWord === rightWord) {
      // Match! Speak the matched English word
      speakText(leftWord);
      setTest2MatchedWords(prev => {
        const updated = [...prev, leftWord];
        if (updated.length === itemsPerTest) {
          setTimeout(() => {
            setStage("TEST_COMPLETED");
          }, 600);
        }
        return updated;
      });
      setTest2SelectedLeft(null);
      setTest2SelectedRight(null);
    } else {
      // Mistake! Flash red and subtract life
      setTest2ClickLock(true);
      setTest2WrongLeft(leftWord);
      setTest2WrongRight(rightWord);

      const failedExam = loseLife(
        `Par incorrecto (${leftWord})`,
        leftWord,
        rightWord
      );
      if (failedExam) return;

      setTimeout(() => {
        setTest2SelectedLeft(null);
        setTest2SelectedRight(null);
        setTest2WrongLeft(null);
        setTest2WrongRight(null);
        setTest2ClickLock(false);
      }, 1000);
    }
  };

  // ----------------------------------------------------
  // TEST 3 VERIFICATION
  // ----------------------------------------------------
  const handleTest3Verify = () => {
    const q = test3Questions[test3Index];
    if (!q) return;

    const isCorrect = verifyAnswer(test3Typed, q.correct, q.alternatives);
    let failedExam = false;
    if (!isCorrect) {
      failedExam = loseLife(q.spanish, q.correct, test3Typed);
    }

    setTest3Typed("");
    if (failedExam) return;

    if (test3Index + 1 < itemsPerTest) {
      setTest3Index(prev => prev + 1);
    } else {
      setStage("TEST_COMPLETED");
    }
  };

  // ----------------------------------------------------
  // TEST 4 VERIFICATION
  // ----------------------------------------------------
  const handleTest4Verify = () => {
    const q = test4Questions[test4Index];
    if (!q) return;

    const isCorrect = verifyAnswer(test4Typed, q.correct, q.alternatives);
    let failedExam = false;
    if (!isCorrect) {
      failedExam = loseLife(q.spanish, q.correct, test4Typed);
    }

    setTest4Typed("");
    if (failedExam) return;

    if (test4Index + 1 < itemsPerTest) {
      setTest4Index(prev => prev + 1);
    } else {
      setStage("TEST_COMPLETED");
    }
  };

  // ----------------------------------------------------
  // TEST 5 MC VERIFICATION
  // ----------------------------------------------------
  const handleTest5Verify = (selectedWord: string) => {
    const currentItem = test5Items[test5Index];
    if (!currentItem) return;

    const isCorrect = selectedWord === currentItem.word;
    let failedExam = false;
    if (isCorrect) {
      speakText(currentItem.word);
    } else {
      failedExam = loseLife(getSpanishLabel(currentItem), currentItem.word, selectedWord);
    }

    if (failedExam) return;

    if (test5Index + 1 < itemsPerTest) {
      setTest5Index(prev => prev + 1);
    } else {
      setStage("CERTIFIED");
    }
  };

  // Proceed to next test from intermission
  const handleNextTest = () => {
    setTestErrors(0);
    setMissedWords([]);
    const next = currentTest + 1;
    setCurrentTest(next);
    setStage("PLAYING_TEST");
  };

  // Calculate score note
  const getNoteScore = () => {
    if (totalErrors === 0) return 100;
    if (totalErrors === 1) return 90;
    if (totalErrors === 2) return 80;
    if (totalErrors === 3) return 70;
    return Math.max(10, 100 - totalErrors * 10);
  };

  // Render Hearts
  const renderHearts = () => {
    return (
      <div className="flex gap-1.5 justify-center my-1 select-none" id="examHeartsRow">
        {Array.from({ length: maxLives }).map((_, i) => (
          <motion.div
            key={i}
            animate={i < lives ? { scale: 1 } : { scale: 0.8, opacity: 0.3 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Heart 
              size={20} 
              className={i < lives ? "fill-red-500 text-red-500 animate-pulse" : "text-slate-600 fill-slate-800"} 
              style={{ filter: i < lives ? "drop-shadow(0 0 6px rgba(239,68,68,0.5))" : "none" }}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  // Render current stage
  return (
    <div className={`flex-1 flex flex-col ${stage === "INTRO" ? "p-1 pt-1.5 sm:p-2 sm:pt-3" : "p-4 sm:p-6"} overflow-y-auto max-w-md mx-auto w-full select-none`} id="studentExamRoot">
      
      {/* Header Bar - Hidden in INTRO to prevent duplicate headings & wasted space */}
      {stage !== "INTRO" && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-5 shrink-0" id="studentExamHeader">
          {stage === "PLAYING_TEST" ? (
            <button
              onClick={onBack}
              className="px-4 py-1.5 rounded-full bg-slate-900 border-2 border-[#FF3366]/40 hover:border-[#FF3366] text-white hover:text-white text-[10px] font-black uppercase tracking-widest cursor-pointer active:scale-95 transition-all shadow-[0_0_10px_rgba(255,51,102,0.15)] flex items-center justify-center"
              id="studentExamExitBtn"
            >
              SALIR
            </button>
          ) : (
            <button
              onClick={onBack}
              className="flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-[#FF2A85] hover:bg-[#FF2A85]/10 cursor-pointer active:scale-95 transition-all"
              title="Volver"
              id="studentExamBackBtn"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <span className="text-center font-sans text-xs font-black tracking-widest text-[#FF2A85] uppercase" style={{ textShadow: "0 0 10px rgba(255,42,133,0.5)" }}>
            STUDENT OF EXAM
          </span>

          {/* Global indicators in header if playing */}
          {stage === "PLAYING_TEST" ? (
            <div className="flex items-center gap-2">
              {renderHearts()}
            </div>
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* ========================================== */}
        {/* 1. INTRO / WELCOME STAGE                   */}
        {/* ========================================== */}
        {stage === "INTRO" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col items-center justify-start relative py-0 px-2"
            id="examIntroCard"
          >
            <div 
              className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[80px] pointer-events-none" 
              style={{ backgroundColor: `${themeAccentColor}0d` }}
            />

            <div className="flex flex-col items-center justify-start pt-2 w-full">
              {/* Title centered at the TOP in large white text with neon red/green glow, with inline cap/sparkle icon same size */}
              <div className="flex items-center justify-center gap-2.5 mb-4 w-full text-center mt-2" id="examTitleContainer">
                {stage !== "INTRO" && examMode === "TRUTH" ? (
                  <Sparkles 
                    size={36} 
                    className="animate-pulse shrink-0" 
                    style={{ color: themeAccentColor, filter: `drop-shadow(0 0 10px ${themeAccentColor})` }} 
                  />
                ) : stage !== "INTRO" && examMode === "FINAL" ? (
                  <Award 
                    size={36} 
                    className="animate-pulse shrink-0" 
                    style={{ color: themeAccentColor, filter: `drop-shadow(0 0 10px ${themeAccentColor})` }} 
                  />
                ) : (
                  <GraduationCap 
                    size={36} 
                    className="animate-pulse shrink-0" 
                    style={{ color: themeAccentColor, filter: `drop-shadow(0 0 10px ${themeAccentColor})` }} 
                  />
                )}
                <h2 
                  className="text-2xl sm:text-3xl font-black tracking-wider text-white uppercase" 
                  style={{ textShadow: `0 0 15px ${themeAccentColor}, 0 0 5px ${themeAccentColor}` }}
                  id="examMainTitle"
                >
                  {examTitleText}
                </h2>
              </div>

              {/* Row with BACK and RULES buttons directly below the title */}
              <div className="flex items-center justify-between w-full max-w-xs mb-6 px-1" id="examIntroActionRow">
                <button
                  onClick={onBack}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-black tracking-widest text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-all uppercase"
                  style={{ '--hover-border-color': themeAccentColor } as React.CSSProperties}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = themeAccentColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1e293b')}
                  id="examIntroBackBtn"
                >
                  <ArrowLeft size={13} />
                  BACK
                </button>
                
                <button
                  onClick={() => setShowRules(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-black tracking-widest cursor-pointer active:scale-95 transition-all uppercase"
                  style={{ 
                    borderColor: `${themeAccentColor}70`, 
                    color: themeAccentColor,
                    background: `linear-gradient(to right, ${themeAccentColor}10, ${themeSecondaryColor}10)`,
                    boxShadow: `0 0 15px ${themeAccentColor}1a`
                  }}
                  id="examRulesIntroBtn"
                >
                  <BookOpen size={13} />
                  RULES
                </button>
              </div>

              {/* Submenu for the 2 exams (Test Fast and Truth Test) with 3D relief, neon glows, and white text */}
              <div className="flex flex-col items-center justify-center w-full my-2 gap-4 max-w-xs">
                {vocabPool.length < 10 ? (
                  <div className="text-xs text-yellow-500 font-bold animate-pulse bg-yellow-500/10 px-5 py-3 rounded-2xl border border-yellow-500/20 max-w-xs text-center w-full">
                    Cargando banco de preguntas... por favor espera un segundo.
                  </div>
                ) : (
                  <>
                    {/* BUTTON 1: TEST FAST */}
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0, 217, 255, 0.6)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startSelectedExam("FAST")}
                      className="w-full h-24 relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn"
                      style={{
                        border: "3px solid #00D9FF",
                        background: "linear-gradient(135deg, rgba(0, 217, 255, 0.15), rgba(0, 162, 232, 0.2))",
                        boxShadow: "0 6px 20px rgba(0, 217, 255, 0.3), inset 0 2px 4px rgba(255,255,255,0.15)"
                      }}
                      id="examStartFastBtn"
                    >
                      <span className="text-lg sm:text-xl font-extrabold font-sans text-white tracking-widest group-hover:text-slate-200 transition-colors uppercase">
                        TEST FAST
                      </span>
                      <span className="text-[10px] font-bold text-white/90 mt-1 uppercase tracking-widest text-center px-2 leading-tight">
                        PRUEBA RÁPIDA • 5 PALABRAS • 3 VIDAS
                      </span>
                    </motion.button>

                    {/* BUTTON 2: TRUTH TEST */}
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0, 255, 102, 0.6)" }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => startSelectedExam("TRUTH")}
                      className="w-full h-24 relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn"
                      style={{
                        border: "3px solid #00FF66",
                        background: "linear-gradient(135deg, rgba(0, 255, 102, 0.15), rgba(0, 200, 100, 0.2))",
                        boxShadow: "0 6px 20px rgba(0, 255, 102, 0.3), inset 0 2px 4px rgba(255,255,255,0.15)"
                      }}
                      id="examStartTruthBtn"
                    >
                      <span className="text-lg sm:text-xl font-extrabold font-sans text-white tracking-widest group-hover:text-slate-200 transition-colors uppercase">
                        TRUTH TEST
                      </span>
                      <span className="text-[10px] font-bold text-white/90 mt-1 uppercase tracking-widest text-center px-2 leading-tight">
                        PRUEBA DE LA VERDAD • 10 PALABRAS • 2 VIDAS
                      </span>
                    </motion.button>

                    {/* BUTTON 3: FINAL EXAM */}
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255, 51, 68, 0.6)" }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => startSelectedExam("FINAL")}
                      className="w-full h-24 relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn"
                      style={{
                        border: "3px solid #FF3344",
                        background: "linear-gradient(135deg, rgba(255, 51, 68, 0.15), rgba(180, 0, 30, 0.2))",
                        boxShadow: "0 6px 20px rgba(255, 51, 68, 0.3), inset 0 2px 4px rgba(255,255,255,0.15)"
                      }}
                      id="examStartFinalBtn"
                    >
                      <span className="text-lg sm:text-xl font-extrabold font-sans text-white tracking-widest group-hover:text-slate-200 transition-colors uppercase">
                        FINAL EXAM
                      </span>
                      <span className="text-[10px] font-bold text-white/90 mt-1 uppercase tracking-widest text-center px-2 leading-tight">
                        EXAMEN FINAL • 15 PALABRAS • 1 VIDA
                      </span>
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Motivation Message customized with the User's name */}
            <div className="text-center max-w-xs mt-auto px-4 pb-2 shrink-0 border-t border-slate-800/40 pt-4 w-full" id="examIntroMotivation">
              <span 
                className="text-[8px] font-black tracking-[3px] uppercase block mb-1.5 opacity-80"
                style={{ color: themeAccentColor }}
              >
                DAILY INSPIRATION FOR {getStats().userName.toUpperCase()} • MOTIVACIÓN
              </span>
              <p className="text-[11px] font-semibold text-slate-300 italic leading-relaxed">
                "¡Vamos, <span className="text-white font-black not-italic">{getStats().userName}</span>! {randomMotivation.replace(/^¡/, "")}"
              </p>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* 2. PLAYING TEST (1 to 5)                  */}
        {/* ========================================== */}
        {stage === "PLAYING_TEST" && (
          <motion.div
            key={`play-test-${currentTest}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-between"
          >
            {/* ProgressBar */}
            <div className="mb-4 shrink-0">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <span>TEST {currentTest} / 5</span>
                <span>
                  Pregunta {
                    currentTest === 1 ? test1Index + 1 :
                    currentTest === 2 ? test2MatchedWords.length + 1 :
                    currentTest === 3 ? test3Index + 1 :
                    currentTest === 4 ? test4Index + 1 :
                    test5Index + 1
                  } / 10
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full transition-all duration-300" 
                  style={{ 
                    background: `linear-gradient(to right, ${themeAccentColor}, ${themeSecondaryColor})`,
                    width: `${
                      ((currentTest - 1) * 10 + (
                        currentTest === 1 ? test1Index :
                        currentTest === 2 ? test2MatchedWords.length :
                        currentTest === 3 ? test3Index :
                        currentTest === 4 ? test4Index :
                        test5Index
                      )) * 2
                    }%` 
                  }}
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-start pt-1.5">
              
              {/* -------------------------------------- */}
              {/* TEST 1: E-S Writing Translation      */}
              {/* -------------------------------------- */}
              {currentTest === 1 && test1Items[test1Index] && (
                <div className="text-center animate-fade-in" id="test1Section">
                  <span className="text-[10px] font-black tracking-widest text-[#FF3366] uppercase mb-4 block" style={{ textShadow: "0 0 10px rgba(255,51,102,0.3)" }}>
                    ESCRIBE EL NOMBRE EN INGLÉS
                  </span>

                  <div className="html-neon-card-pink py-8 px-6 mb-5 relative text-center">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#FF3366] shadow-[0_0_15px_#FF3366]" />
                    
                    <h1 className="text-3xl font-black text-white uppercase tracking-wide mb-2" style={{ textShadow: "0 0 10px rgba(255,255,255,0.15)" }}>
                      {getSpanishLabel(test1Items[test1Index])}
                    </h1>

                    {/* Emoji underneath Spanish word */}
                    {getWordEmoji(test1Items[test1Index]) && (
                      <div className="flex justify-center items-center my-2 select-none" id="test1WordEmoji">
                        <span className="text-3xl sm:text-4xl filter drop-shadow-[0_0_10px_rgba(255,51,102,0.4)]">
                          <WordEmoji item={test1Items[test1Index]} />
                        </span>
                      </div>
                    )}

                    {/* Voice icon & IPA */}
                    <div className="flex items-center justify-center gap-3.5 my-4">
                      <button
                        onClick={() => speakText(test1Items[test1Index].word)}
                        className="w-11 h-11 rounded-full bg-[#FF3366]/10 border border-[#FF3366]/30 text-[#FF3366] flex items-center justify-center hover:bg-[#FF3366]/20 cursor-pointer active:scale-90 transition-all shadow-[0_0_10px_rgba(255,51,102,0.2)]"
                      >
                        <Volume2 size={18} />
                      </button>
                      <span className="font-mono text-slate-200 text-xs tracking-wider font-bold">
                        {getIPA(test1Items[test1Index])}
                      </span>
                    </div>

                    {/* Input box with forced white text */}
                    <input
                      ref={test1InputRef}
                      type="text"
                      value={test1Typed}
                      style={{ color: "white" }}
                      onChange={e => setTest1Typed(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleTest1Verify()}
                      placeholder="Escribe la respuesta en inglés..."
                      className="w-full bg-slate-950/80 border-2 border-slate-850 rounded-xl px-4 py-3 text-center text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3366] focus:shadow-[0_0_10px_rgba(255,51,102,0.25)] transition-all shadow-inner uppercase"
                    />
                  </div>

                  <button
                    onClick={handleTest1Verify}
                    className="w-full bg-slate-900/80 border-2 border-[#FF3366]/40 hover:border-[#FF3366] hover:bg-[#FF3366]/10 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(255,51,102,0.1)] active:scale-98"
                  >
                    VERIFICAR PALABRA
                  </button>
                </div>
              )}

              {/* -------------------------------------- */}
              {/* TEST 2: CARD MATCHING PAIRS           */}
              {/* -------------------------------------- */}
              {currentTest === 2 && (
                <div id="test2Section">
                  <span className="text-[10px] font-black tracking-widest uppercase mb-4 block text-center" style={{ color: themeAccentColor, textShadow: `0 0 10px ${themeAccentColor}4D` }}>
                    BUSCA LOS PARES COINCIDENTES
                  </span>

                  <div className="max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <div className="grid grid-cols-2 gap-3 my-2">
                      {/* Left Column (Spanish) */}
                      <div className="space-y-2">
                        <div className="text-center font-extrabold text-[10px] text-slate-300 uppercase tracking-widest sticky top-0 bg-slate-950/60 py-1 backdrop-blur-sm z-10">
                          ESPAÑOL
                        </div>
                        {test2LeftCards.map(item => {
                          const isMatched = test2MatchedWords.includes(item.word);
                          const isSelected = test2SelectedLeft === item.word;
                          const isWrong = test2WrongLeft === item.word;

                          return (
                            <button
                              key={item.id}
                              disabled={isMatched || test2ClickLock}
                              onClick={() => handleTest2CardClick("L", item)}
                              className={`w-full py-2 px-1.5 sm:py-2.5 sm:px-2.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wide border transition-all duration-200 text-center select-none cursor-pointer hyphens-auto break-words ${
                                isMatched 
                                  ? "bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66] opacity-60 shadow-[0_0_10px_rgba(0,255,102,0.1)]"
                                  : isWrong
                                  ? "bg-[#FF3366]/20 border-[#FF3366] text-[#FF3366] shadow-[0_0_15px_rgba(255,51,102,0.3)]"
                                  : isSelected
                                  ? "bg-[#00D9FF]/10 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.3)] scale-[1.02]"
                                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200"
                              }`}
                            >
                              <span className="block">{item.label}</span>
                              {item.emoji && (
                                <span className="block text-base mt-1 select-none">
                                  <WordEmoji item={item.emoji} />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Right Column (English) */}
                      <div className="space-y-2">
                        <div className="text-center font-extrabold text-[10px] text-slate-300 uppercase tracking-widest sticky top-0 bg-slate-950/60 py-1 backdrop-blur-sm z-10">
                          INGLES
                        </div>
                        {test2RightCards.map(item => {
                          const isMatched = test2MatchedWords.includes(item.word);
                          const isSelected = test2SelectedRight === item.word;
                          const isWrong = test2WrongRight === item.word;

                          return (
                            <button
                              key={item.id}
                              disabled={isMatched || test2ClickLock}
                              onClick={() => handleTest2CardClick("R", item)}
                              className={`w-full py-2 px-1.5 sm:py-2.5 sm:px-2.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wide border transition-all duration-200 text-center select-none cursor-pointer hyphens-auto break-words ${
                                isMatched 
                                  ? "bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66] opacity-60 shadow-[0_0_10px_rgba(0,255,102,0.1)]"
                                  : isWrong
                                  ? "bg-[#FF3366]/20 border-[#FF3366] text-[#FF3366] shadow-[0_0_15px_rgba(255,51,102,0.3)]"
                                  : isSelected
                                  ? "bg-[#00D9FF]/10 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.3)] scale-[1.02]"
                                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200"
                              }`}
                            >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* -------------------------------------- */}
              {/* TEST 3: NUMBERS SENTENCE COMPLETION   */}
              {/* -------------------------------------- */}
              {currentTest === 3 && test3Questions[test3Index] && (
                <div className="text-center animate-fade-in" id="test3Section">
                  <span className="text-[10px] font-black tracking-widest text-[#FF3366] uppercase mb-4 block" style={{ textShadow: "0 0 10px rgba(255,51,102,0.3)" }}>
                    COMPLETA LA ORACIÓN CON EL NÚMERO
                  </span>

                  <div className="html-neon-card-pink py-8 px-6 mb-5 relative text-left">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#FF3366] shadow-[0_0_15px_#FF3366]" />
                    
                    <span className="text-[9px] bg-[#FF3366]/10 text-[#FF3366] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-3.5 inline-block">
                      Módulo 1 • Números
                    </span>

                    <h2 className="text-[15px] font-black text-white leading-relaxed mb-3">
                      {test3Questions[test3Index].spanish}
                    </h2>
                    
                    <p className="text-[14px] font-bold text-slate-200 italic mb-4 leading-relaxed">
                      English: {test3Questions[test3Index].english}
                    </p>

                    {getWordEmoji(test3Questions[test3Index].correct) && (
                      <div className="flex justify-center items-center mb-4 select-none" id="test3WordEmoji">
                        <span className="text-3xl sm:text-4xl filter drop-shadow-[0_0_10px_rgba(255,51,102,0.4)]">
                          <WordEmoji item={test3Questions[test3Index].correct} />
                        </span>
                      </div>
                    )}

                    {/* Input box with forced white text */}
                    <input
                      ref={test3InputRef}
                      type="text"
                      value={test3Typed}
                      style={{ color: "white" }}
                      onChange={e => setTest3Typed(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleTest3Verify()}
                      placeholder="Escribe el número en inglés..."
                      className="w-full bg-slate-950/80 border-2 border-slate-850 rounded-xl px-4 py-3 text-center text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3366] focus:shadow-[0_0_10px_rgba(255,51,102,0.25)] transition-all shadow-inner uppercase"
                    />
                  </div>

                  <button
                    onClick={handleTest3Verify}
                    className="w-full bg-slate-900/80 border-2 border-[#FF3366]/40 hover:border-[#FF3366] hover:bg-[#FF3366]/10 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(255,51,102,0.1)] active:scale-98"
                  >
                    VERIFICAR RESPUESTA
                  </button>
                </div>
              )}

              {/* -------------------------------------- */}
              {/* TEST 4: OTHER MODULES COMPLETION      */}
              {/* -------------------------------------- */}
              {currentTest === 4 && test4Questions[test4Index] && (
                <div className="text-center animate-fade-in" id="test4Section">
                  <span className="text-[10px] font-black tracking-widest text-[#FF3366] uppercase mb-4 block" style={{ textShadow: "0 0 10px rgba(255,51,102,0.3)" }}>
                    COMPLETA LA ORACIÓN
                  </span>

                  <div className="html-neon-card-pink py-8 px-6 mb-5 relative text-left">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#FF3366] shadow-[0_0_15px_#FF3366]" />
                    
                    <span className="text-[9px] bg-[#FF3366]/10 text-[#FF3366] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-3.5 inline-block">
                      Varios Módulos • Vocabulario
                    </span>

                    <h2 className="text-[15px] font-black text-white leading-relaxed mb-3">
                      {test4Questions[test4Index].spanish}
                    </h2>
                    
                    <p className="text-[14px] font-bold text-slate-200 italic mb-4 leading-relaxed">
                      English: {test4Questions[test4Index].english}
                    </p>

                    {getWordEmoji(test4Questions[test4Index].correct) && (
                      <div className="flex justify-center items-center mb-4 select-none" id="test4WordEmoji">
                        <span className="text-3xl sm:text-4xl filter drop-shadow-[0_0_10px_rgba(255,51,102,0.4)]">
                          <WordEmoji item={test4Questions[test4Index].correct} />
                        </span>
                      </div>
                    )}

                    {/* Input box with forced white text */}
                    <input
                      ref={test4InputRef}
                      type="text"
                      value={test4Typed}
                      style={{ color: "white" }}
                      onChange={e => setTest4Typed(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleTest4Verify()}
                      placeholder="Escribe la palabra que falta en inglés..."
                      className="w-full bg-slate-950/80 border-2 border-slate-850 rounded-xl px-4 py-3 text-center text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3366] focus:shadow-[0_0_10px_rgba(255,51,102,0.25)] transition-all shadow-inner uppercase"
                    />
                  </div>

                  <button
                    onClick={handleTest4Verify}
                    className="w-full bg-slate-900/80 border-2 border-[#FF3366]/40 hover:border-[#FF3366] hover:bg-[#FF3366]/10 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(255,51,102,0.1)] active:scale-98"
                  >
                    VERIFICAR RESPUESTA
                  </button>
                </div>
              )}

              {/* -------------------------------------- */}
              {/* TEST 5: MULTIPLE CHOICE               */}
              {/* -------------------------------------- */}
              {currentTest === 5 && test5Items[test5Index] && (
                <div className="text-center animate-fade-in" id="test5Section">
                  <span className="text-[10px] font-black tracking-widest text-[#FF3366] uppercase mb-4 block" style={{ textShadow: "0 0 10px rgba(255,51,102,0.3)" }}>
                    SELECCIÓN MÚLTIPLE DE TRADUCCIÓN
                  </span>

                  <div className="html-neon-card-pink py-8 px-6 mb-5 relative text-center">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#FF3366] shadow-[0_0_15px_#FF3366]" />
                    
                    <span className="text-[9px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/35 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2.5 inline-block">
                      Test Final
                    </span>

                    <h1 className="text-3xl font-black text-white uppercase tracking-wide my-4" style={{ textShadow: "0 0 10px rgba(255,255,255,0.15)" }}>
                      {getSpanishLabel(test5Items[test5Index])}
                    </h1>

                    {/* Emoji underneath Spanish word */}
                    {getWordEmoji(test5Items[test5Index]) && (
                      <div className="flex justify-center items-center mb-4 select-none" id="test5WordEmoji">
                        <span className="text-3xl sm:text-4xl filter drop-shadow-[0_0_10px_rgba(255,51,102,0.4)]">
                          <WordEmoji item={test5Items[test5Index]} />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 3 Choices with neon highlight borders */}
                  <div className="space-y-3">
                    {test5Options[test5Index]?.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTest5Verify(option)}
                        className="w-full py-3 px-3 sm:py-4 sm:px-4 rounded-xl bg-slate-900/80 border-2 border-slate-850 hover:border-[#FF3366] text-white hover:text-white text-[11px] sm:text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-[#FF3366]/10 transition-all text-center select-none shadow-[0_4px_15px_rgba(0,0,0,0.5)] active:scale-98"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="w-full text-center pt-2 shrink-0">
              <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest">
                Examen dinámico
              </span>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* 3. TEST COMPLETED INTERMISSION              */}
        {/* ========================================== */}
        {stage === "TEST_COMPLETED" && (
          <motion.div
            key="test-completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border-2 rounded-[30px] p-6 flex-1 flex flex-col justify-start items-center gap-5 overflow-y-auto"
            style={{ 
              borderColor: `${themeAccentColor}66`,
              background: "linear-gradient(to bottom, #0F172A, #020617)",
              boxShadow: `0 0 25px ${themeAccentColor}26`
            }}
            id="testCompletedCard"
          >
            <div className="text-center w-full flex flex-col items-center">

              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-1" style={{ textShadow: "0 0 10px rgba(255,255,255,0.15)" }}>
                TEST {currentTest} COMPLETADO
              </h2>
              <span className="text-[10px] font-black text-white uppercase tracking-[3px] block mb-5">
                PROGRESO GUARDADO. PRÓXIMO RETO LISTO
              </span>

              {/* Statistics rectangle box with neon outline and dark play-card background */}
              <div 
                className="w-full max-w-sm bg-gradient-to-b from-[#0A121D] to-[#030712] border-2 rounded-2xl p-5 mb-4 text-left relative"
                style={{ 
                  borderColor: `${themeAccentColor}99`, 
                  boxShadow: `0 0 15px ${themeAccentColor}40`
                }}
              >

                <div className="text-[10px] font-black text-white uppercase tracking-[2px] mb-3 border-b border-slate-800/80 pb-2">
                  REPORTE DEL TEST {currentTest}
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 text-xs">
                  <div className="text-white font-extrabold tracking-wide uppercase text-[10.5px]">ERRORES COMETIDOS:</div>
                  <div className={`text-right font-black ${testErrors > 0 ? "text-red-400" : "text-[#00FF66]"} text-[11px]`}>
                    {testErrors}
                  </div>

                  <div className="text-white font-extrabold tracking-wide uppercase text-[10.5px]">CANTIDAD DE PREGUNTAS:</div>
                  <div className="text-right font-black text-white text-[11px]">
                    {itemsPerTest}
                  </div>

                  <div className="text-white font-extrabold tracking-wide uppercase text-[10.5px]">VIDAS RESTANTES:</div>
                  <div className="text-right font-black text-white text-[11px]">
                    {lives} DE {maxLives}
                  </div>
                </div>

                {/* Correction Box if had mistakes */}
                {missedWords.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-slate-800/80">
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block mb-2">
                      CORRECCIONES DE PALABRAS:
                    </span>
                    <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                      {missedWords.map((item, idx) => (
                        <div key={idx} className="text-[11px] font-bold text-white leading-relaxed">
                          • <span className="text-slate-300">{item.spanish}:</span>{" "}
                          <span className="text-red-400 line-through mr-1">{item.typed}</span>{" "}
                          ➔ <span className="text-[#00FF66] font-black">{item.correct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Buttons - directly under the report card */}
              <div className="w-full max-w-sm space-y-3 shrink-0">
                <button
                  onClick={handleNextTest}
                  className="w-full text-white py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                  style={{
                    background: `linear-gradient(to right, ${themeAccentColor}, ${themeSecondaryColor})`,
                    boxShadow: `0 0 15px ${themeAccentColor}4d`
                  }}
                >
                  NEXT TEST {currentTest + 1}
                  <ArrowRight size={13} />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAgain}
                    className="bg-slate-900 border border-slate-800 text-white py-3 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-1"
                    style={{ '--hover-border-color': themeAccentColor } as React.CSSProperties}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = themeAccentColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1e293b')}
                  >
                    <RotateCcw size={12} />
                    AGAIN
                  </button>
                  <button
                    onClick={onBack}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white py-3 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-1"
                  >
                    <Home size={12} />
                    HOME
                  </button>
                </div>
              </div>

              {/* Motivational Quote at the footer of Completed card */}
              {randomMotivation && (
                <div className="text-center select-none pt-4 mt-3 border-t border-slate-800/40 w-full max-w-sm">
                  <p 
                    className="text-[10px] font-black uppercase tracking-[2px] mb-1"
                    style={{ color: themeAccentColor }}
                  >
                    MOTIVACIÓN PARA {getStats().userName.toUpperCase()}:
                  </p>
                  <p className="text-[11px] font-bold text-white/90 leading-relaxed italic px-2">
                    "¡Vamos, <span className="text-[#00E5FF] font-black not-italic">{getStats().userName}</span>! {randomMotivation.replace(/^¡/, "")}"
                  </p>
                </div>
              )}

            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* 4. FAILED STAGE                            */}
        {/* ========================================== */}
        {stage === "FAILED" && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-b from-[#1C0F1A] to-[#0A0512] border-2 border-red-500/40 rounded-[30px] p-6 shadow-[0_0_25px_rgba(239,68,68,0.15)] flex-1 flex flex-col justify-between"
            id="examFailedCard"
          >
            <div className="text-center py-6 flex-1 flex flex-col items-center justify-center">
              <div className="w-18 h-18 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-5 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <XCircle size={38} className="animate-pulse" />
              </div>

              <h2 className="text-3xl font-black text-red-500 uppercase tracking-widest leading-none mb-1.5" style={{ textShadow: "0 0 10px rgba(239,68,68,0.4)" }}>
                REPROBÓ LA PRUEBA
              </h2>
              
              <p className="text-xs font-black text-slate-400 tracking-[1.5px] uppercase mb-6">
                porque SE EQUIVOCÓ {maxLives === 1 ? "1 VEZ" : `${maxLives} VECES`}
              </p>

              <div className="bg-red-500/5 border border-red-500/15 rounded-[20px] p-4.5 max-w-sm text-center">
                <div className="flex items-center justify-center gap-1 text-red-500 mb-1.5">
                  <AlertTriangle size={15} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Límite de Vidas Superado</span>
                </div>
                <p className="text-[11.5px] text-white leading-relaxed">
                  Has agotado {maxLives === 1 ? "tu única vida disponible" : `tus ${maxLives} vidas disponibles`}. Sigue repasando los módulos individuales para consolidar tu vocabulario y vuelve a intentarlo cuando estés listo.
                </p>
              </div>
            </div>

            <div className="space-y-3 shrink-0">
              <button
                onClick={startExam}
                className="w-full bg-gradient-to-r from-[#FF3366] to-[#A01B3F] hover:from-[#ff4d7b] hover:to-[#b0224b] text-white py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 active:scale-98"
              >
                <RotateCcw size={13} />
                INTENTAR DE NUEVO
              </button>

              <button
                onClick={onBack}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 py-3 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-1"
              >
                <Home size={12} />
                VOLVER AL MENÚ DE MÓDULOS
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* 5. CERTIFIED / FINAL SUCCESS STAGE        */}
        {/* ========================================== */}
        {stage === "CERTIFIED" && (
          <motion.div
            key="certified"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-b from-[#1E112A] to-[#0A0512] border-2 border-[#FF2A85]/50 rounded-[30px] p-6 shadow-[0_0_30px_rgba(255,42,133,0.15)] flex-1 flex flex-col justify-between"
            id="examCertifiedCard"
          >
            <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
              
              {/* Diploma or Certificate Icon (Graduation Cap) */}
              <div className="relative mb-5" id="diplomaIconWrapper">
                <div className="absolute inset-0 bg-[#FF2A85]/20 rounded-full blur-xl animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#FF2A85] to-[#B0005C] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,42,133,0.5)] border-2 border-[#FF2A85]/80 relative z-10">
                  <GraduationCap size={40} className="animate-bounce" style={{ animationDuration: "2.5s" }} />
                </div>
              </div>

              <h2 className="text-3xl font-black tracking-wider text-white uppercase leading-none mb-1">
                ¡EXAMEN PASADO!
              </h2>
              <span className="text-[10px] font-black tracking-[4px] text-[#FF2A85] uppercase block mb-5">
                CERTIFICADO DE STUDENT OF EXAM
              </span>

              {/* Statistics Table with custom data - NEON GREEN DESIGN */}
              <div className="w-full bg-[#0A0F14] border-2 border-[#00FF66]/60 rounded-2xl p-5 mb-5 text-left relative shadow-[0_0_15px_rgba(0,255,102,0.2)]">
                <div className="text-[10px] font-black text-[#00FF66] uppercase tracking-[2.5px] mb-3 border-b border-[#00FF66]/20 pb-2 flex justify-between items-center">
                  <span>REPORTE FINAL GENERAL</span>
                  <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66] animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <div className="text-white font-extrabold tracking-wide uppercase text-[10.5px]">VIDAS AL FINALIZAR:</div>
                  <div className="text-right font-black text-[#00FF66]">
                    {lives} de {maxLives}
                  </div>

                  <div className="text-white font-extrabold tracking-wide uppercase text-[10.5px]">ERRORES TOTALES:</div>
                  <div className="text-right font-black text-white">
                    {totalErrors}
                  </div>

                  <div className="text-white font-extrabold tracking-wide uppercase text-[10.5px]">TEST COMPLETADOS:</div>
                  <div className="text-right font-black text-[#00FF66]">
                    5 de 5
                  </div>

                  <div className="text-white font-extrabold tracking-wide uppercase text-[10.5px]">NOTA FINAL OBTENIDA:</div>
                  <div className="text-right font-black text-[#00FF66] text-sm" style={{ textShadow: "0 0 10px rgba(0,255,102,0.4)" }}>
                    {getNoteScore()} PUNTOS
                  </div>
                </div>
              </div>

              {/* Dynamic message based on 0 errors vs > 0 errors - NEON CELESTE DESIGN */}
              <div className="w-full bg-[#0A121D] border-2 border-[#00E5FF]/60 p-5 rounded-2xl text-center select-none shrink-0 mb-4 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                {totalErrors === 0 ? (
                  <p className="text-[11.5px] font-black text-white leading-relaxed uppercase tracking-wide">
                    ¡FELICIDADES POR PASAR EL EXAMEN, <span className="text-[#00E5FF] font-black">{getStats().userName.toUpperCase()}</span>! SIGUE ESTUDIANDO Y SERÁS MEJOR CADA DÍA.
                  </p>
                ) : (
                  <p className="text-[11px] font-bold text-slate-200 leading-relaxed uppercase tracking-wide">
                    <span className="text-[#00E5FF] font-black text-xs block mb-1">¡FELICIDADES POR LLEGAR HASTA AQUÍ, {getStats().userName.toUpperCase()}!</span>
                    NO SACASTE 100 PUNTOS PERO NO TE DESANIMES, SI SIGUES PRACTICANDO LO VAS A LOGRAR.
                    <br />
                    <span className="text-[10px] text-slate-400 block mt-2">QUE TU CORAZÓN SIENTA EL FUEGO DEL SABER, Y TU MENTE SIENTA LA ENERGÍA DEL SABER.</span>
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic Buttons */}
            <div className="space-y-3 shrink-0">
              <button
                onClick={onBack}
                className="w-full bg-gradient-to-r from-[#FF2A85] to-[#B0005C] hover:from-[#ff4093] hover:to-[#c40068] text-white py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Home size={13} />
                HOME
              </button>

              <button
                onClick={handleAgain}
                className="w-full bg-slate-900 border border-slate-800 hover:border-[#FF2A85]/50 text-slate-300 py-3 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-1"
              >
                <RotateCcw size={12} />
                AGAIN
              </button>

              {/* Motivational Quote with user name at the footer of Certified */}
              <div className="text-center select-none pt-3 mt-1 border-t border-slate-800/40 w-full">
                <p className="text-[11px] font-extrabold text-white leading-relaxed italic max-w-xs mx-auto">
                  "La práctica constante te convertirá en un maestro, <span className="text-[#00E5FF] font-black not-italic">{getStats().userName}</span>."
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* RULES OVERLAY MODAL */}
        {showRules && (
          <motion.div
            key="rules-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
            id="rulesModalOverlay"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-gradient-to-b from-[#1C1227] to-[#0D0614] border-2 border-[#FF2A85] rounded-[24px] p-5 max-w-sm w-full shadow-[0_0_35px_rgba(255,42,133,0.3)] relative overflow-hidden flex flex-col max-h-[90%] justify-between"
              id="rulesModalCard"
            >
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#FF2A85]/10 rounded-full blur-[40px] pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <Flame size={16} className="text-[#FF2A85] animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest text-[#FF2A85] uppercase">
                      RULES • REGLAS DEL EXAMEN
                    </span>
                  </div>
                  <button
                    onClick={() => setShowRules(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer active:scale-95"
                    id="closeRulesBtn"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-3 text-left overflow-y-auto max-h-[300px] pr-1 scrollbar-thin" id="rulesModalContent">
                  <p className="text-[11px] font-medium text-slate-300 leading-relaxed">
                    ¿Estás listo para demostrar tu dominio del vocabulario? Elige entre tres modalidades de examen diseñadas para evaluar tu retención en <b>5 modos dinámicos</b> de prueba.
                  </p>

                  <div className="space-y-2">
                    <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl">
                      <div className="text-[9px] font-black text-[#FF2A85] uppercase tracking-wider mb-0.5">
                        1. TRADUCCIÓN RÁPIDA (Typing)
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Escucha el audio y escribe la traducción correcta en inglés de la palabra mostrada.
                      </p>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl">
                      <div className="text-[9px] font-black text-[#FF2A85] uppercase tracking-wider mb-0.5">
                        2. EMPAREJAMIENTO (Cards)
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Une correctamente cada palabra en español con su traducción correspondiente en inglés.
                      </p>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl">
                      <div className="text-[9px] font-black text-[#FF2A85] uppercase tracking-wider mb-0.5">
                        3. COMPRENSIÓN AUDITIVA (Listening)
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Escribe el número en palabras en inglés correspondiente al número o frase mencionada.
                      </p>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl">
                      <div className="text-[9px] font-black text-[#FF2A85] uppercase tracking-wider mb-0.5">
                        4. COMPLETAR FRASES (Sentences)
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Rellena los espacios vacíos para completar oraciones con el vocabulario correcto.
                      </p>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl">
                      <div className="text-[9px] font-black text-[#FF2A85] uppercase tracking-wider mb-0.5">
                        5. OPCIÓN MÚLTIPLE (Choices)
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Elige la respuesta correcta en inglés entre varias alternativas propuestas.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FF2A85]/5 border border-[#FF2A85]/20 p-2.5 rounded-xl flex items-start gap-2 mt-2">
                    <Heart size={12} className="text-[#FF2A85] shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-[9px] font-medium text-[#FF2A85] leading-relaxed">
                      <b>SISTEMA DE VIDAS</b>: Depende del examen. <b>TEST FAST</b> tiene 3 vidas (5 palabras), <b>TRUTH TEST</b> tiene 2 vidas (10 palabras) y <b>FINAL EXAM</b> tiene 1 vida (15 palabras). Si te quedas sin vidas, reprobarás inmediatamente.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowRules(false)}
                className="w-full mt-4 bg-gradient-to-r from-[#FF2A85] to-[#B0005C] hover:from-[#ff4093] hover:to-[#c40068] text-white py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-95"
                id="closeRulesModalBtn"
              >
                ENTENDIDO
              </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
