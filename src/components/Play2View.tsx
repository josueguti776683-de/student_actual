/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { NumberItem } from "../types";
import { getWordEmoji } from "../utils/wordEmojis";
import { WordEmoji } from "./WordEmoji";
import {
  totalNumeros100,
  totalOrdinal100,
  totalCalendar,
  totalColors,
  totalSports,
  totalInstruments,
  totalProfessions,
  totalFamily,
  totalHouse,
  totalClassroom,
  totalPlaces,
  totalWeather,
  totalAnimals,
  totalFruits,
  totalVegetables,
  totalFood,
  totalTastes,
  cookingVerbsList,
  totalClothing,
  totalBody,
  totalRoutine
} from "../data";
import { speakText, stopSpeaking } from "../utils/audio";
import { motion, AnimatePresence } from "motion/react";
import { getMotivationForScreen } from "../utils/motivation";

const getFontSizeForSymbol = (symbol: string | number | undefined, baseMax: number = 70) => {
  const str = String(symbol || "");
  const len = str.length;
  if (len <= 3) return `${baseMax}px`;
  if (len <= 6) return `${Math.min(baseMax, 48)}px`;
  if (len <= 10) return `${Math.min(baseMax, 32)}px`;
  if (len <= 14) return `${Math.min(baseMax, 24)}px`;
  if (len <= 20) return `${Math.min(baseMax, 18)}px`;
  return `${Math.min(baseMax, 14)}px`;
};

interface Play2ViewProps {
  currentList: NumberItem[];
  currentIndex: number;
  autoSpeakEnabled: boolean;
  onCorrect: () => void;
  onIncorrect: () => void;
  onBack: () => void;
  onToggleAutoSpeak: () => void;
  openPenalty: (
    word: string,
    isExam: boolean,
    plusOne: number,
    resumeCallback: () => void,
    onPenaltyMistake?: () => void
  ) => void;
  insertIncorrectQuestionAgain: (item: NumberItem) => void;
  displayTitle: string;
}

export default function Play2View({
  currentList,
  currentIndex,
  autoSpeakEnabled,
  onCorrect,
  onIncorrect,
  onBack,
  onToggleAutoSpeak,
  openPenalty,
  insertIncorrectQuestionAgain,
  displayTitle
}: Play2ViewProps) {
  const currentItem = currentList[currentIndex];
  
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [incorrectList, setIncorrectList] = useState<string[]>([]);
  const [motivationPhrase, setMotivationPhrase] = useState("");

  useEffect(() => {
    setMotivationPhrase(getMotivationForScreen("play2"));
  }, [currentIndex]);

  // Re-generate option states on transitions
  useEffect(() => {
    if (currentItem) {
      setSelectedOption(null);
      setIncorrectList([]);

      // Generate distractors with Set to guarantee exactly 3 unique options
      const correctWord = currentItem.word;
      const distractorSet = new Set<string>();
      distractorSet.add(correctWord);
      
      if (currentItem.isSentence && currentItem.distractors) {
        currentItem.distractors.forEach(option => distractorSet.add(option));
      } else {
        const isOrd = currentItem.isOrdinal;
        const isCalendar = currentItem.isCalendar;
        const isColor = currentItem.isColor;
        const isSport = currentItem.isSport;
        const isInstrument = currentItem.isInstrument;
        const isProfession = currentItem.isProfession;
        const isFamily = currentItem.isFamily;
        const isHouse = currentItem.isHouse;
        const isClassroom = currentItem.isClassroom;
        const isPlaces = currentItem.isPlaces;
        const isWeather = currentItem.isWeather;
        const isAnimals = currentItem.isAnimals;
        const isFruits = currentItem.isFruits;
        const isVegetables = currentItem.isVegetables;
        const isFood = currentItem.isFood;
        const isTastes = currentItem.isTastes;
        const isClothing = currentItem.isClothing;
        const isBody = currentItem.isBody;
        const isRoutine = currentItem.isRoutine;

        const pool = isCalendar
          ? totalCalendar.map(x => x.word)
          : isColor
            ? totalColors.map(x => x.word)
            : isSport
              ? totalSports.map(x => x.word)
              : isInstrument
                ? totalInstruments.map(x => x.word)
                : isProfession
                  ? totalProfessions.map(x => x.word)
                  : isFamily
                    ? totalFamily.map(x => x.word)
                    : isHouse
                      ? totalHouse.map(x => x.word)
                      : isClassroom
                        ? totalClassroom.map(x => x.word)
                        : isPlaces
                          ? totalPlaces.map(x => x.word)
                          : isWeather
                            ? totalWeather.map(x => x.word)
                            : isAnimals
                              ? totalAnimals.map(x => x.word)
                              : isFruits
                                ? totalFruits.map(x => x.word)
                                : isVegetables
                                  ? totalVegetables.map(x => x.word)
                                  : isFood
                                    ? totalFood.map(x => x.word)
                                    : isTastes
                                      ? [...totalTastes, ...cookingVerbsList].map(x => x.word)
                                      : isClothing
                                        ? totalClothing.map(x => x.word)
                                        : isBody
                                          ? totalBody.map(x => x.word)
                                          : isRoutine
                                            ? totalRoutine.map(x => x.word)
                                            : isOrd 
                                              ? totalOrdinal100.map(x => x.word)
                                              : totalNumeros100.map(x => x[0]);

        let safetyAttempts = 0;
        while (distractorSet.size < 3 && safetyAttempts < 50 && pool.length > 0) {
          safetyAttempts++;
          const randomWord = pool[Math.floor(Math.random() * pool.length)];
          if (randomWord) distractorSet.add(randomWord);
        }

        if (distractorSet.size < 3) {
          for (const item of currentList) {
            if (item && item.word) distractorSet.add(item.word);
            if (distractorSet.size >= 3) break;
          }
        }
      }

      // Combine option set and shuffle
      const combined = [...distractorSet].sort(() => Math.random() - 0.5);
      setOptions(combined);

      // Speak text automatically
      if (autoSpeakEnabled) {
        const t = setTimeout(() => {
          speakText(currentItem.isSentence ? (currentItem.symbol || "") : currentItem.word);
        }, 120);
        return () => clearTimeout(t);
      }
    }
  }, [currentIndex, currentItem, autoSpeakEnabled]);

  if (!currentItem) return null;

  const handleSpeak = () => {
    speakText(currentItem.isSentence ? (currentItem.symbol || "") : currentItem.word);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleVerifyClick = () => {
    if (!selectedOption) return;

    if (selectedOption === currentItem.word) {
      // Correct: proceed forward
      onCorrect();
    } else {
      // Incorrect choice: save to wrong list, trigger count, trigger penalty Modal
      const wrongOp = selectedOption;
      setIncorrectList(prev => [...prev, wrongOp]);
      onIncorrect();
      insertIncorrectQuestionAgain(currentItem);

      openPenalty(currentItem.word, false, 0, () => {
        // Penalty completed: let them choose again from remaining options
        setSelectedOption(null);
      });
    }
  };

  const progressPercent = Math.min(100, Math.round((currentIndex / currentList.length) * 100));

  return (
    <div className="flex flex-col min-h-full bg-transparent px-6 py-6 font-sans select-none text-slate-100" id="pantallaMultiple">
      
      {/* Header bar controls */}
      <div className="flex flex-col items-center w-full mb-6 gap-4 border-b border-[#00FF66]/10 pb-4" id="play2Header">
        {/* Top: Centered Title */}
        <div className="text-center">
          <span 
            className="uppercase block text-center"
            style={{ 
              fontSize: "18px", 
              fontWeight: 900, 
              letterSpacing: "4px", 
              color: "#00FF66",
              textShadow: "0 0 10px rgba(0, 255, 102, 0.3)"
            }} 
            id="tituloMultiple"
          >
            {displayTitle}
          </span>
        </div>
        
        {/* Bottom toolbar: Left (Auto Speak) & Right (Back) */}
        <div className="flex justify-between items-center w-full px-2">
          {/* Left: AUTO SPEAK Button */}
          <button 
            onClick={onToggleAutoSpeak}
            className={`border cursor-pointer active:scale-95 transition-all uppercase flex items-center gap-1.5 select-none rounded-full ${
              autoSpeakEnabled 
                ? "border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.2)]" 
                : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-slate-300"
            }`}
            style={{
              padding: "8px 16px",
              fontSize: "11px",
              fontWeight: 700,
            }}
            id="autoSpeakBtnMultiple"
          >
            {autoSpeakEnabled ? "🔊 AUTO ON" : "🔇 AUTO OFF"}
          </button>

          {/* Right: BACK Button */}
          <button 
            onClick={onBack}
            className="border border-[#00FF66]/60 bg-[#00FF66]/5 rounded-full cursor-pointer hover:bg-[#00FF66]/20 active:scale-95 transition-all uppercase select-none text-[#00FF66] hover:border-[#00FF66] hover:shadow-[0_0_12px_rgba(0,255,102,0.15)]"
            style={{
              padding: "8px 18px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "2px",
            }}
            id="play2BackBtn"
          >
            BACK
          </button>
        </div>
      </div>

      {/* Progress header container */}
      <div className="mb-6" id="play2ProgressSection">
        <div className="text-center font-bold text-xs uppercase tracking-widest text-[#00FF66] mb-2" id="progressMultiple">
          QUESTION {currentIndex + 1} / {currentList.length}
        </div>
        <div className="h-[6px] bg-[#F1E42] bg-slate-950/40 rounded-full border border-[#00FF66]/[0.125] overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-500 via-[#00FF66] to-[#00FF66]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
            id="fillMultiple"
          />
        </div>
      </div>

      {/* Multiple Choice core box layout */}
      <div className="flex-1 flex flex-col justify-start items-center pt-2 pb-6" id="play2ChoiceBoard">
        <div className="w-full max-w-sm rounded-[25px] p-5 html-neon-card-green text-center relative overflow-hidden flex flex-col justify-between min-h-[390px]">
          
          {/* Target Number Display Container with Speak Button centered and separate from text to prevent collision */}
          <div className="flex flex-col items-center justify-center gap-2 my-2 w-full" id="mcNumberContainer">
            <button 
              onClick={handleSpeak}
              className="html-speaker-btn-green w-12 h-12 shrink-0 flex items-center justify-center text-xl select-none"
              id="mcSpeakBtn"
            >
              🔊
            </button>
            <span 
              className="font-black text-white drop-shadow-[0_0_15px_rgba(0,255,102,0.6)] select-text leading-tight text-center break-words max-w-full px-2 block"
              style={{
                fontSize: getFontSizeForSymbol(currentItem.symbol ?? currentItem.digit, 66)
              }}
            >
              {currentItem.symbol ?? currentItem.digit}
            </span>
            {getWordEmoji(currentItem) && (
              <div className="flex justify-center items-center mt-1 select-none" id="mcEmojiContainer">
                <span className="text-3xl sm:text-4xl filter drop-shadow-[0_0_10px_rgba(0,255,102,0.4)]">
                  <WordEmoji item={currentItem} />
                </span>
              </div>
            )}
          </div>

          <div className="text-base text-white font-bold my-3 uppercase tracking-wide" id="questionText">
            Select the correct answer:
          </div>

          {/* Multiple options dynamic grid */}
          <div className="flex flex-col gap-3 my-2" id="optionsMultiple">
            {options.map((option, idx) => {
              const isSelected = selectedOption === option;

              let buttonStyle = "border-2 border-l-[6px] border-[#00FF66]/40 border-l-[#00CC52]/60 rounded-[20px] bg-gradient-to-b from-[#0F1E42]/80 to-[#0A1530]/80 shadow-[0_0_15px_rgba(0,255,102,0.1)] hover:brightness-110 active:scale-[0.98] transition-all";
              if (isSelected) {
                buttonStyle = "border-2 border-l-[6px] border-[#00FF66] rounded-[20px] bg-[#00FF66]/15 text-[#00FF66] drop-shadow-[0_0_15px_rgba(0,255,102,0.4)] cursor-pointer text-center";
              }

              return (
                <button
                  key={`${option}-${idx}`}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full py-3.5 px-4 text-sm md:text-base font-extrabold text-center rounded-[20px] cursor-pointer transition-all uppercase tracking-wider break-words text-white ${buttonStyle}`}
                  id={`play2Option-${idx}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Verification button */}
          <button
            onClick={handleVerifyClick}
            disabled={!selectedOption}
            className={`w-full py-4 rounded-[20px] transition-all font-black uppercase tracking-wider text-center ${
              selectedOption 
                ? "html-neon-btn-green cursor-pointer active:scale-97"
                : "opacity-40 bg-slate-900 border-2 border-slate-800 text-slate-500 cursor-default pointer-events-none"
            }`}
            id="verifyMultipleBtn"
          >
            VERIFY <span className="font-sans text-lg">✓</span>
          </button>

          {motivationPhrase && (
            <p className="text-[11px] text-[#00FF66]/80 font-bold text-center mt-3 leading-relaxed px-4 select-none italic" id="play2MotivationQuote">
              {motivationPhrase}
            </p>
          )}

        </div>
      </div>

    </div>
  );
}
