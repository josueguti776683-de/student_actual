/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { NumberItem } from "../types";
import { speakText, stopSpeaking } from "../utils/audio";
import { motion, AnimatePresence } from "motion/react";
import { getAmericanIPA, getAmericanIPAOrdinal } from "../data";
import { getMotivationForScreen } from "../utils/motivation";
import { getWordEmoji } from "../utils/wordEmojis";
import { WordEmoji } from "./WordEmoji";

const getFontSizeForSymbol = (symbol: string | number | undefined, baseMax: number = 95) => {
  const str = String(symbol || "");
  const len = str.length;
  if (len <= 3) return `${baseMax}px`;
  if (len <= 6) return `${Math.min(baseMax, 52)}px`;
  if (len <= 10) return `${Math.min(baseMax, 34)}px`;
  if (len <= 14) return `${Math.min(baseMax, 26)}px`;
  if (len <= 20) return `${Math.min(baseMax, 20)}px`;
  return `${Math.min(baseMax, 16)}px`;
};

interface Play3ViewProps {
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
  insertIncorrectQuestionRandomly: (item: NumberItem) => void;
  displayTitle: string;
}

export default function Play3View({
  currentList,
  currentIndex,
  autoSpeakEnabled,
  onCorrect,
  onIncorrect,
  onBack,
  onToggleAutoSpeak,
  openPenalty,
  insertIncorrectQuestionRandomly,
  displayTitle
}: Play3ViewProps) {
  const currentItem = currentList[currentIndex];
  const [typedInput, setTypedInput] = useState("");
  const [motivationPhrase, setMotivationPhrase] = useState("");
  const [writeAttempts, setWriteAttempts] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const themeColor = "#ff3366";
  const shadowColor = "rgba(255, 51, 102, 0.45)";

  useEffect(() => {
    setMotivationPhrase(getMotivationForScreen("play3"));
  }, [currentIndex]);

  // Auto-speak target on transitions
  useEffect(() => {
    setTypedInput("");
    setWriteAttempts(1);
    if (currentItem && autoSpeakEnabled) {
      const t = setTimeout(() => {
        speakText(currentItem.word);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [currentIndex, currentItem, autoSpeakEnabled]);

  // Focus input field on card transitions cleanly
  useEffect(() => {
    const t = setTimeout(() => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    }, 10);
    return () => clearTimeout(t);
  }, [currentIndex]);

  if (!currentItem) return null;

  const handleSpeak = () => {
    speakText(currentItem.word);
  };

  const handleVerify = () => {
    const normalizedInput = typedInput.trim().toLowerCase();
    const normalizedTarget = currentItem.word.trim().toLowerCase();

    if (!normalizedInput) return;

    const isMatch =
      normalizedInput === normalizedTarget ||
      normalizedInput.replace(/-/g, " ") === normalizedTarget.replace(/-/g, " ") ||
      normalizedInput.replace(/\s+/g, "-") === normalizedTarget.replace(/\s+/g, "-");

    if (isMatch) {
      if (writeAttempts > 1) {
        setWriteAttempts(prev => prev - 1);
        setTypedInput("");
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        // Only blur if it's the last question in the exam, to avoid keyboard collapse on transitions
        if (currentIndex + 1 >= currentList.length) {
          inputRef.current?.blur();
        }
        setTypedInput("");
        setWriteAttempts(1);
        onCorrect();
      }
    } else {
      // Wrong spelling submitted during exam
      setTypedInput("");
      setWriteAttempts(1);
      onIncorrect(); // increment dynamic score error count in App state

      // Create an explicit mock item representation with +1 increment for local calculation
      const updatedPenaltyLevel = (currentItem.plusOne || 0) + 1;

      // Duplicate question back randomly downstream
      insertIncorrectQuestionRandomly(currentItem);

      // Define standard modal spelling penalization mistake hook
      const handleModalMistake = () => {
        // Increment the exam penalty return level on this same object
        currentItem.plusOne = (currentItem.plusOne || 0) + 1;
      };

      // Trigger spelling workout penalty modal
      openPenalty(
        currentItem.word, 
        true, 
        updatedPenaltyLevel, 
        () => {
          // Callback when modal closes: stay on the same card so they have to learn it and try again!
          setTypedInput("");
          setTimeout(() => {
            if (inputRef.current && document.activeElement !== inputRef.current) {
              inputRef.current.focus();
            }
          }, 10);
        },
        handleModalMistake
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  // Progress calculations
  const progressPercent = Math.min(100, Math.round((currentIndex / currentList.length) * 100));

  return (
    <div className="flex flex-col min-h-full bg-transparent px-6 py-6 font-sans select-none text-slate-100" id="pantallaExamen">
      
      {/* Game Header */}
      <div className="flex flex-col items-center w-full mb-6 gap-4 border-b border-[#ff3366]/10 pb-4" id="play3Header">
        {/* Top: Centered Title */}
        <div className="text-center">
          <span 
            className="uppercase block text-center"
            style={{ 
              fontSize: "18px", 
              fontWeight: 900, 
              letterSpacing: "4px", 
              color: "#ff3366",
              textShadow: "0 0 10px rgba(255, 51, 102, 0.3)"
            }} 
            id="tituloExamen"
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
                ? "border-[#ff3366] bg-[#ff3366]/10 text-[#ff3366] shadow-[0_0_12px_rgba(255, 51, 102, 0.2)]" 
                : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-slate-300"
            }`}
            style={{
              padding: "8px 16px",
              fontSize: "11px",
              fontWeight: 700,
            }}
            id="autoSpeakBtnExamen"
          >
            {autoSpeakEnabled ? "🔊 AUTO ON" : "🔇 AUTO OFF"}
          </button>

          {/* Right: BACK Button */}
          <button 
            onClick={onBack}
            className="border border-[#ff3366]/60 bg-[#ff3366]/5 rounded-full cursor-pointer hover:bg-[#ff3366]/20 active:scale-95 transition-all uppercase select-none text-[#ff3366] hover:border-[#ff3366] hover:shadow-[0_0_12px_rgba(255, 51, 102, 0.15)]"
            style={{
              padding: "8px 18px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "2px",
            }}
            id="play3BackBtn"
          >
            BACK
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-6" id="play3ProgressSection">
        {/* Progress Text */}
        <div 
          className="text-center uppercase mb-2 select-text" 
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "3px",
            color: "#ffffff"
          }}
          id="progressExamen"
        >
          QUESTION {currentIndex + 1} / {currentList.length}
        </div>
        
        {/* Progress Bar Container */}
        <div 
          className="relative overflow-hidden"
          style={{
            height: "6px",
            borderRadius: "3px",
            backgroundColor: "#0F1E42",
            border: "1px solid rgba(255, 51, 102, 0.125)"
          }}
        >
          {/* Animated golden/green glow progress fill */}
          <motion.div 
            className="h-full"
            style={{
              background: "linear-gradient(90deg, #cc2952 0%, #ff3366 50%, #ff3366 100%)",
              boxShadow: "0 0 20px #ff3366"
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
            id="fillExamen"
          />
        </div>
      </div>

      {/* Main card write interface */}
      <div className="flex-1 flex flex-col justify-start items-center pt-2 pb-6" id="play3Board">
        <div className="w-full max-w-sm html-neon-card-pink text-center flex flex-col items-center justify-between min-h-[320px] py-10 px-[30px]" id="play3Card">
          
          {/* Barra lateral izquierda (pink) */}
          <div 
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-b from-[#ff3366] via-[#cc2952] to-[#ff3366] shadow-[0_0_15px_rgba(255,51,102,0.8)]" 
            style={{ width: "4px" }} 
          />

          <div className="text-xs text-white uppercase font-bold tracking-[3px]" id="examWriteLabel">
            WRITE IN ENGLISH:
          </div>

          {/* Centered number digit display */}
          <div className="w-full text-center mt-3 px-2 break-words" id="examNumberContainer">
            <span 
              className="font-black text-white select-text leading-none text-center block break-words max-w-full px-2"
              style={{
                fontSize: getFontSizeForSymbol(currentItem.symbol ?? currentItem.digit, 85),
                textShadow: "0 0 15px rgba(255, 51, 102, 0.8), 0 0 30px rgba(255, 51, 102, 0.5), 0 0 45px rgba(255, 51, 102, 0.2)"
              }}
            >
              {currentItem.symbol ?? currentItem.digit}
            </span>

            {/* Emoji underneath Spanish word */}
            {getWordEmoji(currentItem) && (
              <div className="flex justify-center items-center mt-2 select-none" id="examEmojiContainer">
                <span className="text-3xl sm:text-4xl filter drop-shadow-[0_0_10px_rgba(255,51,102,0.4)]">
                  <WordEmoji item={currentItem} />
                </span>
              </div>
            )}
          </div>

          {/* Voice button paired side-by-side with IPA pronunciation */}
          <div className="flex items-center justify-center gap-3 w-full my-4" id="audioIpaContainerExamen">
            <button 
              onClick={handleSpeak}
              className="html-speaker-btn-pink focus:outline-none select-none text-2xl shrink-0"
              id="examSpeakBtn"
              style={{ width: "48px", height: "48px", fontSize: "22px" }}
            >
              🔊
            </button>
            <span 
              className="font-extrabold select-text tracking-wide whitespace-nowrap"
              style={{
                fontSize: "19px",
                color: "#ff3366",
                textShadow: "0 0 10px rgba(255, 51, 102, 0.5)"
              }}
              id="examIpaPronunciation"
            >
              {currentItem.ipa ? currentItem.ipa : (currentItem.isOrdinal ? getAmericanIPAOrdinal(currentItem.digit) : getAmericanIPA(currentItem.digit))}
            </span>
          </div>

          {/* Countdown counter badge - "debajo de la pronunciación y arriba del cuadro de texto en el medio" */}
          <div className="flex justify-center items-center gap-1.5 mb-3 select-none" id="countdownExamenCounter">
            <span 
              className="text-[10px] tracking-wider font-extrabold uppercase transition-colors"
              style={{ color: `${themeColor}CC` }}
            >
              Intento:
            </span>
            <div 
              className="px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_8px_rgba(0,191,255,0.1)] transition-all"
              style={{
                backgroundColor: `${themeColor}1A`,
                borderColor: `${themeColor}50`,
              }}
            >
              <span 
                className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors"
                style={{ backgroundColor: themeColor }}
              />
              <span 
                className="text-[12px] font-black tracking-wider font-mono transition-colors"
                style={{ color: themeColor }}
              >
                1 / 1
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium italic">
              (escribe 1 vez)
            </span>
          </div>

          {/* Form input section */}
          <div className="w-full space-y-4">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value.toLowerCase())}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              enterKeyHint="done"
              inputMode="text"
              placeholder="write here..."
              className="w-full p-5 text-2xl bg-gradient-to-b from-[#050A1A] to-[#0A1530] border-2 rounded-[18px] text-center text-white font-bold outline-none placeholder:text-slate-700 tracking-[1px] transition-all"
              style={{
                borderColor: isFocused ? themeColor : `${themeColor}60`,
                boxShadow: isFocused ? `0 0 30px ${shadowColor}` : "none",
              }}
              id="inputExamen"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />

            <motion.button
              onClick={handleVerify}
              className="w-full relative overflow-hidden bg-gradient-to-b from-[#ff3366] to-[#cc2952] border-2 border-[#ff3366] text-white uppercase select-none flex items-center justify-center gap-2 cursor-pointer font-sans"
              style={{
                padding: "20px 0",
                borderRadius: "18px",
                fontSize: "16px",
                fontWeight: 900,
                letterSpacing: "3px",
                boxShadow: "0 0 15px rgba(255, 51, 102, 0.60), 0 0 30px rgba(255, 51, 102, 0.40)"
              }}
              whileHover={{ 
                y: -4, 
                boxShadow: "0 0 40px rgba(255,51,102,0.85), 0 0 80px rgba(255,51,102,0.55)",
                filter: "brightness(1.15)"
              }}
              whileTap={{ y: 0, scale: 0.98 }}
              id="play3VerifyBtn"
            >
              {/* Internal left highlight bar */}
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-b from-white via-[#ff3366] to-[#cc2952] shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_20px_#ff3366]" 
                style={{ width: "4px" }} 
              />
              VERIFY <span className="font-sans text-xl">→</span>
            </motion.button>

            {motivationPhrase && (
              <p className="text-[11px] text-[#ff3366]/80 font-bold text-center mt-3 leading-relaxed px-4 select-none italic" id="play3MotivationQuote">
                {motivationPhrase}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
