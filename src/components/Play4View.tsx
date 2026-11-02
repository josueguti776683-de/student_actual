/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { NumberItem } from "../types";
import { speakText, stopSpeaking } from "../utils/audio";
import { getSpanishNumber, getSpanishOrdinal } from "../utils/dictionaryHelper";
import { motion } from "motion/react";

interface Play4ViewProps {
  currentList: NumberItem[];
  autoSpeakEnabled: boolean;
  onCorrect: () => void;
  onIncorrect: () => void;
  onComplete: () => void;
  onBack: () => void;
  onToggleAutoSpeak: () => void;
  openPenalty: (
    word: string,
    isExam: boolean,
    plusOne: number,
    resumeCallback: () => void
  ) => void;
  displayTitle: string;
  isRoutine?: boolean;
}

interface PairCardItem {
  id: string;
  word: string;
  label: string;
  item: NumberItem;
}

const BATCH_SIZE = 6;

function getSpanishLabelForItem(item: NumberItem): string {
  if (
    item.isPronoun ||
    item.isCalendar ||
    item.isColor ||
    item.isSport ||
    item.isInstrument ||
    item.isProfession ||
    item.isFamily ||
    item.isHouse ||
    item.isClassroom ||
    item.isPlaces ||
    item.isWeather ||
    item.isAnimals ||
    item.isFruits ||
    item.isVegetables ||
    item.isFood ||
    item.isTastes ||
    item.isClothing ||
    item.isBody ||
    item.isRoutine
  ) {
    return item.symbol || String(item.digit);
  }
  if (item.isOrdinal) {
    return getSpanishOrdinal(item.digit);
  }
  return getSpanishNumber(item.digit);
}

function shuffleCards<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Play4View({
  currentList,
  autoSpeakEnabled,
  onCorrect,
  onIncorrect,
  onComplete,
  onBack,
  onToggleAutoSpeak,
  openPenalty,
  displayTitle,
  isRoutine
}: Play4ViewProps) {
  const [batchIndex, setBatchIndex] = useState(0);
  const [leftCards, setLeftCards] = useState<PairCardItem[]>([]);
  const [rightCards, setRightCards] = useState<PairCardItem[]>([]);
  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [wrongLeft, setWrongLeft] = useState<string | null>(null);
  const [wrongRight, setWrongRight] = useState<string | null>(null);
  const [clickLock, setClickLock] = useState(false);
  const [totalMatchedCount, setTotalMatchedCount] = useState(0);

  const totalItems = currentList.length;
  const totalBatches = Math.max(1, Math.ceil(totalItems / BATCH_SIZE));

  // Initialize current batch of up to 6 pairs in random order
  useEffect(() => {
    const startIdx = batchIndex * BATCH_SIZE;
    const batchSlice = currentList.slice(startIdx, startIdx + BATCH_SIZE);

    let engColumn: PairCardItem[] = batchSlice.map((item, idx) => ({
      id: `L-${batchIndex}-${idx}-${item.word}`,
      word: item.word,
      label: item.word,
      item
    }));

    let espColumn: PairCardItem[] = batchSlice.map((item, idx) => ({
      id: `R-${batchIndex}-${idx}-${item.word}`,
      word: item.word,
      label: getSpanishLabelForItem(item),
      item
    }));

    // Shuffle English column in random order
    if (engColumn.length > 1) {
      engColumn = shuffleCards(engColumn);
    }

    // Shuffle Spanish column in random order so pairs are not horizontally aligned
    if (espColumn.length > 1) {
      let shuffled = shuffleCards(espColumn);
      let attempts = 0;
      while (
        attempts < 5 &&
        shuffled.every((card, idx) => card.word === engColumn[idx].word)
      ) {
        shuffled = shuffleCards(espColumn);
        attempts++;
      }
      espColumn = shuffled;
    }

    setLeftCards(engColumn);
    setRightCards(espColumn);
    setMatchedWords([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setWrongLeft(null);
    setWrongRight(null);
    setClickLock(false);
  }, [batchIndex, currentList]);

  const evaluateMatch = (leftWord: string, rightWord: string) => {
    const leftCard = leftCards.find(c => c.word === leftWord);
    const rightCard = rightCards.find(c => c.word === rightWord);
    const isSameSpanishLabel =
      leftCard &&
      rightCard &&
      getSpanishLabelForItem(leftCard.item).trim().toLowerCase() ===
        rightCard.label.trim().toLowerCase();

    if (leftWord === rightWord || isSameSpanishLabel) {
      if (leftWord !== rightWord && isSameSpanishLabel) {
        setRightCards(prev =>
          prev.map(c => {
            if (c.word === rightWord) return { ...c, word: leftWord };
            if (c.word === leftWord) return { ...c, word: rightWord };
            return c;
          })
        );
      }
      // Correct pair! Turn green
      if (autoSpeakEnabled) {
        speakText(leftWord);
      }
      onCorrect();
      setTotalMatchedCount(prev => prev + 1);

      const nextMatched = [...matchedWords, leftWord];
      setMatchedWords(nextMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all pairs in this batch of 6 are completed
      if (nextMatched.length >= leftCards.length && leftCards.length > 0) {
        setClickLock(true);
        setTimeout(() => {
          if (batchIndex + 1 < totalBatches) {
            setBatchIndex(prev => prev + 1);
          } else {
            onComplete();
          }
        }, 650);
      }
    } else {
      // Wrong pair! Mark red outline and open 3x English word penalty modal
      setClickLock(true);
      setWrongLeft(leftWord);
      setWrongRight(rightWord);
      onIncorrect();

      setTimeout(() => {
        openPenalty(leftWord, false, 0, () => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setWrongLeft(null);
          setWrongRight(null);
          setClickLock(false);
        });
      }, 450);
    }
  };

  const handleCardClick = (side: "L" | "R", card: PairCardItem) => {
    if (clickLock) return;
    if (matchedWords.includes(card.word)) return;

    if (side === "L") {
      if (autoSpeakEnabled) {
        speakText(card.word);
      }
      setSelectedLeft(card.word);
      if (selectedRight) {
        evaluateMatch(card.word, selectedRight);
      }
    } else {
      setSelectedRight(card.word);
      if (selectedLeft) {
        evaluateMatch(selectedLeft, card.word);
      }
    }
  };

  const progressPercentage =
    totalItems > 0 ? Math.min(100, Math.round((totalMatchedCount / totalItems) * 100)) : 0;

  return (
    <div
      className="flex flex-col flex-1 w-full py-5 px-4 sm:px-6 text-slate-100 bg-transparent font-sans select-none"
      id="pantallaPlay4"
    >
      {/* Top Header */}
      <div className="flex flex-col w-full mb-5">
        {/* 1 & 2: Centered Title and Subtitle */}
        <div className="flex flex-col items-center justify-center text-center w-full mb-3">
          <span className="text-xs sm:text-sm font-black tracking-[3px] text-[#00D9FF] uppercase block">
            {isRoutine ? "PLAY 5 - PAIRS" : "PLAY 4 - PAIRS"}
          </span>
          <h1 className="text-lg sm:text-xl font-black tracking-[2px] text-white uppercase logo-font mt-0.5">
            {displayTitle || "GROUP 1"}
          </h1>
        </div>

        {/* 4 (Left: AUTO) & 3 (Right: <- BACK) */}
        <div className="flex items-center justify-between w-full mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleAutoSpeak}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase transition-all cursor-pointer border ${
              autoSpeakEnabled
                ? "border-[#00FF66]/60 bg-[#00FF66]/15 text-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.2)]"
                : "border-slate-700 bg-slate-900/80 text-slate-400"
            }`}
            id="play4AutoSpeakBtn"
          >
            {autoSpeakEnabled ? "🔊 AUTO" : "🔇 MUTE"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              stopSpeaking();
              onBack();
            }}
            className="px-4 py-1.5 border border-[#00FF66]/40 bg-[#07122E] rounded-full text-[11px] font-bold tracking-[2px] text-[#00FF66] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.15)] uppercase whitespace-nowrap"
            id="play4BackBtn"
          >
            ← BACK
          </motion.button>
        </div>

        {/* 5: Counters (Left & Right) + 6: Progress Bar below counters */}
        <div>
          <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-2">
            <span>
              BLOQUE {batchIndex + 1} / {totalBatches}
            </span>
            <span className="text-[#00FF66]">
              TOTAL: {totalMatchedCount} / {totalItems}
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-900/90 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-[#00D9FF] to-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,0.6)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 7: 2-Column Matching Grid below progress bar (No column titles, random word order) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-1" id="play4Grid">
        {/* Left Column (English) */}
        <div className="space-y-2.5">
          {leftCards.map(card => {
            const isMatched = matchedWords.includes(card.word);
            const isSelected = selectedLeft === card.word;
            const isWrong = wrongLeft === card.word;

            return (
              <motion.button
                key={card.id}
                whileTap={!isMatched && !clickLock ? { scale: 0.97 } : undefined}
                disabled={isMatched || clickLock}
                onClick={() => handleCardClick("L", card)}
                className={`w-full min-h-[60px] py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider border-2 transition-all duration-200 flex items-center justify-center text-center select-none cursor-pointer break-words ${
                  isMatched
                    ? "bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] shadow-[0_0_16px_rgba(0,255,102,0.35)]"
                    : isWrong
                    ? "bg-[#FF3366]/20 border-[#FF3366] text-[#FF3366] shadow-[0_0_20px_rgba(255,51,102,0.5)] animate-shake"
                    : isSelected
                    ? "bg-[#00D9FF]/15 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_18px_rgba(0,217,255,0.45)] scale-[1.02]"
                    : "bg-slate-900/75 border-slate-700/80 hover:border-slate-500 text-white"
                }`}
                id={`play4-left-${card.word}`}
              >
                <span className="leading-snug">{card.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Right Column (Spanish) */}
        <div className="space-y-2.5">
          {rightCards.map(card => {
            const isMatched = matchedWords.includes(card.word);
            const isSelected = selectedRight === card.word;
            const isWrong = wrongRight === card.word;

            return (
              <motion.button
                key={card.id}
                whileTap={!isMatched && !clickLock ? { scale: 0.97 } : undefined}
                disabled={isMatched || clickLock}
                onClick={() => handleCardClick("R", card)}
                className={`w-full min-h-[60px] py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider border-2 transition-all duration-200 flex items-center justify-center text-center select-none cursor-pointer break-words ${
                  isMatched
                    ? "bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] shadow-[0_0_16px_rgba(0,255,102,0.35)]"
                    : isWrong
                    ? "bg-[#FF3366]/20 border-[#FF3366] text-[#FF3366] shadow-[0_0_20px_rgba(255,51,102,0.5)] animate-shake"
                    : isSelected
                    ? "bg-[#00D9FF]/15 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_18px_rgba(0,217,255,0.45)] scale-[1.02]"
                    : "bg-slate-900/75 border-slate-700/80 hover:border-slate-500 text-white"
                }`}
                id={`play4-right-${card.word}`}
              >
                <span className="leading-snug">{card.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
