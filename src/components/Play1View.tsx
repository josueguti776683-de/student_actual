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

const getFontSizeForSymbol = (symbol: string | number | undefined, baseMax: number = 90) => {
  const str = String(symbol || "");
  const len = str.length;
  if (len <= 3) return `${baseMax}px`;
  if (len <= 6) return `${Math.min(baseMax, 52)}px`;
  if (len <= 10) return `${Math.min(baseMax, 36)}px`;
  if (len <= 14) return `${Math.min(baseMax, 26)}px`;
  if (len <= 20) return `${Math.min(baseMax, 20)}px`;
  return `${Math.min(baseMax, 16)}px`;
};

interface Play1ViewProps {
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
  displayTitle: string;
}

export default function Play1View({
  currentList,
  currentIndex,
  autoSpeakEnabled,
  onCorrect,
  onIncorrect,
  onBack,
  onToggleAutoSpeak,
  openPenalty,
  displayTitle
}: Play1ViewProps) {
  const currentItem = currentList[currentIndex];
  const [isEscribir, setIsEscribir] = useState(false);
  const [typedInput, setTypedInput] = useState("");
  const [motivationPhrase, setMotivationPhrase] = useState("");
  const [writeAttempts, setWriteAttempts] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const themeColor = "#00FF66";
  const shadowColor = "rgba(0, 255, 102, 0.45)";

  // Update motivation phrase on card change
  useEffect(() => {
    setMotivationPhrase(getMotivationForScreen("play1"));
  }, [currentIndex]);

  // Auto-speak when cards transition
  useEffect(() => {
    setIsEscribir(false);
    setTypedInput("");
    setWriteAttempts(1);
    if (currentItem && autoSpeakEnabled) {
      const t = setTimeout(() => {
        speakText(currentItem.word);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [currentIndex, currentItem, autoSpeakEnabled]);

  // Focus the input when entering writing mode
  useEffect(() => {
    if (isEscribir) {
      const t = setTimeout(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
      return () => clearTimeout(t);
    }
  }, [isEscribir]);

  if (!currentItem) return null;

  const handleSpeak = () => {
    speakText(currentItem.word);
  };

  const handleLearnClick = () => {
    setIsEscribir(true);
    setWriteAttempts(1);
    // Instant focus in the user interaction context (using 10ms tick)
    setTimeout(() => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    }, 10);
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
        // Instantly focus without blur to keep keyboard open
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        // Dismiss keyboard gracefully before unmounting to prevent layout stutters
        inputRef.current?.blur();
        setTypedInput("");
        setIsEscribir(false);
        setWriteAttempts(1);
        onCorrect();
      }
    } else {
      // Trigger penalty state - DO NOT switch back to card layout (setIsEscribir(false)), stay on input
      setTypedInput("");
      setWriteAttempts(1);
      onIncorrect(); // Insert duplicate downstream
      openPenalty(currentItem.word, false, 0, () => {
        // Resume play: stay in writing mode, refresh focus cleanly
        setTypedInput("");
        setTimeout(() => {
          if (inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus();
          }
        }, 10);
      });
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
    <div className="flex flex-col min-h-full bg-transparent px-6 py-6 font-sans select-none text-slate-100" id="pantallaPlay bg">
      
      {/* Game Header */}
      <div className="flex flex-col items-center w-full mb-6 gap-4 border-b border-[#00FF66]/10 pb-4" id="play1Header">
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
            id="tituloPlay"
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
            id="autoSpeakBtnPlay"
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
            id="play1BackBtn"
          >
            BACK
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-6" id="play1ProgressSection">
        {/* Progress Text */}
        <div 
          className="text-center uppercase mb-2 select-text" 
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "3px",
            color: "#ffffff"
          }}
          id="progressPlay"
        >
          PROGRESS {currentIndex + 1} / {currentList.length}
        </div>
        
        {/* Progress Bar Container */}
        <div 
          className="relative overflow-hidden"
          style={{
            height: "6px",
            borderRadius: "3px",
            backgroundColor: "#0F1E42",
            border: "1px solid rgba(0, 255, 102, 0.125)"
          }}
        >
          {/* Animated golden/green glow progress fill */}
          <motion.div 
            className="h-full"
            style={{
              background: "linear-gradient(90deg, #00CC52 0%, #00FF66 50%, #00FF66 100%)",
              boxShadow: "0 0 20px #00FF66"
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
            id="fillPlay"
          />
        </div>
      </div>

      {/* Primary Transition Board */}
      <div className="flex-1 flex flex-col justify-start items-center pt-2 pb-6">
        <AnimatePresence mode="wait">
          {!isEscribir ? (
            /* LEARN FLASHCARD MODE (tarjetaSection) */
            <motion.div
              key="tarjeta"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm html-neon-card-green text-center flex flex-col items-center justify-between min-h-[320px] py-10 px-[30px]"
              id="tarjetaSection"
            >
              {/* Barra lateral izquierda */}
              <div 
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-b from-[#00FF66] via-[#00CC52] to-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.8)]" 
                style={{ width: "4px" }} 
              />

              {/* English Word with clamp size and glowing shadow */}
              <div className="pt-2 w-full flex justify-center text-center px-2" id="wordTopContainer">
                <span 
                  className="font-black uppercase tracking-wider text-white select-text break-words whitespace-normal leading-tight text-center w-full block px-2"
                  style={{
                    fontSize: "clamp(24px, 8vw, 44px)",
                    textShadow: "0 0 10px rgba(0, 255, 102, 0.6), 0 0 20px rgba(0, 255, 102, 0.3)"
                  }}
                >
                  {currentItem.word}
                </span>
              </div>

              {/* Speaker + American IPA description side-by-side centered Row */}
              <div className="flex items-center justify-center gap-3 w-full my-3" id="audioIpaContainer">
                <button 
                  onClick={handleSpeak}
                  className="html-speaker-btn-green focus:outline-none select-none text-2xl shrink-0"
                  id="speakClickBtn"
                  style={{ width: "48px", height: "48px", fontSize: "22px" }}
                >
                  🔊
                </button>
                
                <span 
                  className="font-extrabold select-text tracking-wide whitespace-nowrap"
                  style={{
                    fontSize: "19px",
                    color: "#00FF66",
                    textShadow: "0 0 10px rgba(0, 255, 102, 0.5)"
                  }}
                  id="ipaPronunciation"
                >
                  {currentItem.ipa ? currentItem.ipa : (currentItem.isOrdinal ? getAmericanIPAOrdinal(currentItem.digit) : getAmericanIPA(currentItem.digit))}
                </span>
              </div>

              {/* Big digits counter */}
              <span 
                className="font-black my-4 text-white select-text leading-none text-center break-words max-w-full px-2 block" 
                style={{
                  fontSize: getFontSizeForSymbol(currentItem.symbol ?? currentItem.digit, 80),
                  textShadow: "0 0 15px rgba(0, 255, 102, 0.8), 0 0 30px rgba(0, 255, 102, 0.5), 0 0 45px rgba(0, 255, 102, 0.2)"
                }}
                id="textoDigito"
              >
                {currentItem.symbol ?? currentItem.digit}
              </span>

              {/* Emoji underneath Spanish word */}
              {getWordEmoji(currentItem) && (
                <div className="flex justify-center items-center my-1 select-none" id="wordEmojiContainer">
                  <span className="text-4xl sm:text-5xl filter drop-shadow-[0_0_12px_rgba(0,255,102,0.4)] transition-transform hover:scale-110">
                    <WordEmoji item={currentItem} />
                  </span>
                </div>
              )}

              {/* Action Button: LEARN with shift animation and inner highlighting strip */}
              <motion.button
                onClick={handleLearnClick}
                className="w-full relative overflow-hidden bg-gradient-to-b from-[#00FF66] to-[#00CC52] border-2 border-[#00FF66] text-[#0B1B3D] uppercase select-none flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  padding: "20px 0",
                  marginTop: "25px",
                  borderRadius: "18px",
                  fontSize: "16px",
                  fontWeight: 900,
                  letterSpacing: "3px",
                  boxShadow: "0 0 15px rgba(0, 255, 102, 0.60), 0 0 30px rgba(0, 255, 102, 0.40)"
                }}
                whileHover={{ 
                  y: -4, 
                  boxShadow: "0 0 40px rgba(0,255,102,0.85), 0 0 80px rgba(0,255,102,0.55)",
                  filter: "brightness(1.15)"
                }}
                whileTap={{ y: 0, scale: 0.98 }}
                id="play1LearnBtn"
              >
                {/* Internal left highlight bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-b from-white via-[#00FF66] to-[#00CC52] shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_20px_#00FF66]" 
                  style={{ width: "4px" }} 
                />
                LEARN <span className="font-sans text-xl">→</span>
              </motion.button>
            </motion.div>
          ) : (
            /* WRITE TRAINING PRACTICE MODE (escribirSection) */
            <motion.div
              key="escribir"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-sm html-neon-card-green text-center flex flex-col items-center justify-between min-h-[320px] py-10 px-[30px]"
              id="escribirSection"
            >
              {/* Barra lateral izquierda */}
              <div 
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-b from-[#00FF66] via-[#00CC52] to-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.8)]" 
                style={{ width: "4px" }} 
              />

              <div className="text-xs text-white uppercase font-bold tracking-[3px]" id="writeLabel">
                WRITE IN ENGLISH:
              </div>

              {/* Large feedback number to type */}
              <div className="w-full text-center mt-3 px-2 break-words" id="numeroEscribirContainer">
                <span 
                  className="font-black text-white select-text leading-none text-center block break-words max-w-full px-2" 
                  style={{
                    fontSize: getFontSizeForSymbol(currentItem.symbol ?? currentItem.digit, 85),
                    textShadow: "0 0 15px rgba(0, 255, 102, 0.8), 0 0 30px rgba(0, 255, 102, 0.5), 0 0 45px rgba(0, 255, 102, 0.2)"
                  }}
                  id="numeroEscribir"
                >
                  {currentItem.symbol ?? currentItem.digit}
                </span>

                {/* Emoji underneath Spanish word in write mode */}
                {getWordEmoji(currentItem) && (
                  <div className="flex justify-center items-center mt-2 select-none" id="numeroEscribirEmoji">
                    <span className="text-3xl sm:text-4xl filter drop-shadow-[0_0_10px_rgba(0,255,102,0.4)]">
                      <WordEmoji item={currentItem} />
                    </span>
                  </div>
                )}
              </div>

              {/* Voice button paired side-by-side with green IPA pronunciation */}
              <div className="flex items-center justify-center gap-3 w-full my-4" id="audioIpaContainerPractice">
                <button 
                  onClick={handleSpeak}
                  className="html-speaker-btn-green focus:outline-none select-none text-2xl shrink-0"
                  id="practiceSpeakBtn"
                  style={{ width: "48px", height: "48px", fontSize: "22px" }}
                >
                  🔊
                </button>
                <span 
                  className="font-extrabold select-text tracking-wide whitespace-nowrap"
                  style={{
                    fontSize: "19px",
                    color: "#00FF66",
                    textShadow: "0 0 10px rgba(0, 255, 102, 0.5)"
                  }}
                  id="practiceIpaPronunciation"
                >
                  {currentItem.ipa ? currentItem.ipa : (currentItem.isOrdinal ? getAmericanIPAOrdinal(currentItem.digit) : getAmericanIPA(currentItem.digit))}
                </span>
              </div>

              {/* Countdown counter badge - "debajo de la pronunciación y arriba del cuadro de texto en el medio" */}
              <div className="flex justify-center items-center gap-1.5 mb-3 select-none" id="countdownPracticeCounter">
                <span 
                  className="text-[10px] tracking-wider font-extrabold uppercase transition-colors"
                  style={{ color: `${themeColor}CC` }}
                >
                  Progreso:
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
                    1/1
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium italic">
                  (escribe 1 vez)
                </span>
              </div>

              {/* Input section */}
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
                  id="inputRespuesta"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />

                <motion.button
                  onClick={handleVerify}
                  className="w-full relative overflow-hidden bg-gradient-to-b from-[#00FF66] to-[#00CC52] border-2 border-[#00FF66] text-[#0B1B3D] uppercase select-none flex items-center justify-center gap-2 cursor-pointer font-sans"
                  style={{
                    padding: "20px 0",
                    borderRadius: "18px",
                    fontSize: "16px",
                    fontWeight: 900,
                    letterSpacing: "3px",
                    boxShadow: "0 0 15px rgba(0, 255, 102, 0.60), 0 0 30px rgba(0, 255, 102, 0.40)"
                  }}
                  whileHover={{ 
                    y: -4, 
                    boxShadow: "0 0 40px rgba(0,255,102,0.85), 0 0 80px rgba(0,255,102,0.55)",
                    filter: "brightness(1.15)"
                  }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  id="play1VerifyBtn"
                >
                  {/* Internal left highlight bar */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-b from-white via-[#00FF66] to-[#00CC52] shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_20px_#00FF66]" 
                    style={{ width: "4px" }} 
                  />
                  VERIFY <span className="font-sans text-xl">→</span>
                </motion.button>

                {motivationPhrase && (
                  <p className="text-[11px] text-[#00FF66]/80 font-bold text-center mt-3 leading-relaxed px-4 select-none italic" id="play1MotivationQuote">
                    {motivationPhrase}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
