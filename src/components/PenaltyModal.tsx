/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { speakText, stopSpeaking } from "../utils/audio";
import { motion, AnimatePresence } from "motion/react";
import { getMotivationForScreen } from "../utils/motivation";
import { getWordEmoji } from "../utils/wordEmojis";
import { WordEmoji } from "./WordEmoji";

interface PenaltyModalProps {
  isOpen: boolean;
  correctWord: string;
  isExamMode: boolean;
  plusOneVal: number;
  onCompleted: () => void;
  onMistake?: () => void;
}

export default function PenaltyModal({
  isOpen,
  correctWord,
  isExamMode,
  plusOneVal,
  onCompleted,
  onMistake
}: PenaltyModalProps) {
  const [typedInput, setTypedInput] = useState("");
  const [penalVeces, setPenalVeces] = useState(0);
  const [targetRepetitions, setTargetRepetitions] = useState(3);
  const [statusHtml, setStatusHtml] = useState<React.ReactNode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalPlusOneLevel, setModalPlusOneLevel] = useState(plusOneVal);
  const [motivationMessage, setMotivationMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setTypedInput("");
      setPenalVeces(0);
      setTargetRepetitions(3);
      setStatusHtml(null);
      setIsProcessing(false);
      setModalPlusOneLevel(plusOneVal);
      setMotivationMessage(getMotivationForScreen("penalty"));

      // Auto proclaim word
      const t = setTimeout(() => {
        speakText(correctWord);
      }, 150);

      // Focus text input field cleanly after modal transitions
      const t1 = setTimeout(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);

      return () => {
        clearTimeout(t);
        clearTimeout(t1);
        stopSpeaking();
      };
    }
  }, [isOpen, correctWord, plusOneVal]);

  // Maintain text field focus safely
  useEffect(() => {
    if (isOpen) {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen, penalVeces]);

  if (!isOpen) return null;

  const handleManualSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(correctWord);
  };

  const executeCorrectAction = (nextCount: number) => {
    setPenalVeces(nextCount);
    setTypedInput("");
    setStatusHtml(
      <span className="text-[#00FF66] font-extrabold">
        ✓ CORRECT ({nextCount}/{targetRepetitions})
      </span>
    );

    if (nextCount >= targetRepetitions) {
      setIsProcessing(true);
      // Synchronously call onCompleted without manual blur or delayed closing to maintain keyboard active state
      onCompleted();
    } else {
      setTimeout(() => {
        setStatusHtml(null);
      }, 1000);
    }
  };

  const executeWrongAction = () => {
    setPenalVeces(0); // reset correct spelling count

    // If in exam mode, increment local plusOne count and alert parent
    if (isExamMode) {
      const nextPlusOne = modalPlusOneLevel + 1;
      setModalPlusOneLevel(nextPlusOne);
      if (onMistake) {
        onMistake(); // informs parent to append further return replicas
      }
    }
    setStatusHtml(
      <span className="text-[#ff3366] font-extrabold">✗ WRONG! RESTARTING...</span>
    );
    setTypedInput("");
    inputRef.current?.focus();

    setTimeout(() => {
      setStatusHtml(null);
    }, 1200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return;

    const rawValue = e.target.value.toLowerCase();
    setTypedInput(rawValue);

    const normalizedInput = rawValue.trim();
    const targetLower = correctWord.trim().toLowerCase();

    const isMatch =
      normalizedInput === targetLower ||
      normalizedInput.replace(/-/g, " ") === targetLower.replace(/-/g, " ") ||
      normalizedInput.replace(/\s+/g, "-") === targetLower.replace(/\s+/g, "-");

    // Correct spelling match: auto-advance with 80ms buffer to allow virtual keyboard to finish smoothly
    if (isMatch) {
      setIsProcessing(true); // lock to prevent double entries or keyboard issues with long words
      setTimeout(() => {
        executeCorrectAction(penalVeces + 1);
        setIsProcessing(false);
      }, 80);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (isProcessing) return;

    if (e.key === "Enter") {
      const normalizedInput = typedInput.trim().toLowerCase();
      const targetLower = correctWord.trim().toLowerCase();
      if (!normalizedInput) return;

      const isMatch =
        normalizedInput === targetLower ||
        normalizedInput.replace(/-/g, " ") === targetLower.replace(/-/g, " ") ||
        normalizedInput.replace(/\s+/g, "-") === targetLower.replace(/\s+/g, "-");

      if (isMatch) {
        setIsProcessing(true);
        setTimeout(() => {
          executeCorrectAction(penalVeces + 1);
          setIsProcessing(false);
        }, 10);
      } else {
        executeWrongAction();
      }
    }
  };

  const isSecondRound = penalVeces >= 1;
  const themeColor = isSecondRound ? "#00FF66" : "#00BFFF";
  const shadowColor = isSecondRound ? "rgba(0, 255, 102, 0.45)" : "rgba(0, 191, 255, 0.45)";

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[1000] bg-[#050508]/95 flex items-center justify-center p-5 font-sans"
        id="modalPenalizacion"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="bg-gradient-to-b from-[#0F1E42] to-[#0A1530] rounded-[25px] px-[25px] py-[35px] w-full max-w-[340px] text-center border-2 border-[#ff336660] relative overflow-hidden shadow-[0_0_20px_rgba(255,51,102,0.3)] flex flex-col items-center"
          id="modalBox"
        >
          {/* Left vertical golden bar */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#ff3366] via-[#ff5588] to-[#ff3366] rounded-l-[25px] shadow-[0_0_10px_#ff3366]" />

          {/* Title - Error Alert */}
          <div className="text-xl text-[#ff3366] font-black tracking-widest uppercase mb-3 text-shadow-sm select-none" id="modalTitle">
            ERROR ALERT
          </div>

          {/* The Answer Is (Small but visible label) */}
          <div className="text-slate-500 font-extrabold text-[10px] uppercase tracking-wider mb-1.5 select-none" id="answerIsLabel">
            THE ANSWER IS:
          </div>

          {/* English word displayed prominently in uppercase, no truncation */}
          <div className="flex flex-col items-center justify-center py-2.5 px-4 bg-[#00FF660a] border border-[#00FF6640] rounded-[15px] w-full mb-3 shrink-0" id="modalWordContainer">
            <span className="text-lg font-black uppercase tracking-wider text-[#00FF66] text-shadow-sm select-text break-words leading-tight text-center w-full block">
               {correctWord}
            </span>
            {getWordEmoji(correctWord) && (
              <span className="text-2xl mt-1 select-none filter drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]">
                <WordEmoji item={correctWord} />
              </span>
            )}
          </div>

          {/* Compact Voice and Counter row (Small but highly visible) */}
          <div className="flex items-center justify-center gap-2.5 mb-3.5 shrink-0 select-none" id="voiceCounterRow">
            {/* Tiny voice button */}
            <button 
              type="button"
              onClick={handleManualSpeak}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66] text-xs cursor-pointer hover:bg-[#00FF66]/20 active:scale-95 transition-all text-shadow-sm shrink-0"
              id="modalSpeakBtn"
              title="Escuchar"
            >
              🔊
            </button>
            {/* Small status counter badge (displays 0/3, 1/3, 2/3, 3/3) */}
            <div 
              className="px-3 py-1 rounded-full flex items-center gap-1.5 bg-[#00FF66]/10 border border-[#00FF66]/30 shadow-[0_0_8px_rgba(0,255,102,0.05)]"
              id="penalContadorBadge"
            >
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">REPETIR:</span>
              <span className="text-xs font-black tracking-wider font-mono text-[#00FF66]">
                {penalVeces} / {targetRepetitions}
              </span>
            </div>
          </div>

          {/* Lightning Exam Penalty status */}
          {isExamMode && modalPlusOneLevel > 0 && (
            <div 
              className="text-[9px] text-[#ffd700] font-black tracking-wide bg-[#ffd70010] py-1.5 px-2.5 border border-[#ffd70030] rounded-xl mb-3 shrink-0 select-none animate-pulse max-w-full text-center" 
              id="penalPlusOne"
            >
              ⚡ +1 ACCUMULATED: WILL RETURN <span id="plusOneCount" className="underline">{modalPlusOneLevel}</span> MORE TIMES
            </div>
          )}

          {/* Spelling Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={typedInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            enterKeyHint="done"
            inputMode="text"
            placeholder="write here..."
            className="w-full p-4 text-[22px] bg-gradient-to-b from-[#050A1A] to-[#0A1530] border-2 rounded-[15px] text-center text-white font-extrabold transition-all outline-none tracking-wider shrink-0"
            style={{
              borderColor: isFocused ? themeColor : `${themeColor}60`,
              boxShadow: isFocused ? `0 0 35px ${shadowColor}` : "none",
            }}
            id="inputPenal"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />

          {/* Instant Validation status text */}
          <div className="my-2.5 text-sm min-h-[20px] font-black tracking-wide text-center shrink-0 uppercase select-none" id="penalStatus">
            {statusHtml}
          </div>

          {/* Personalized Motivation Phrase */}
          {motivationMessage && (
            <div className="w-full p-3.5 mb-1 rounded-2xl bg-[#00FF66]/5 border border-[#00FF66]/20 text-left relative overflow-hidden select-none shrink-0" id="motivationBox">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#00FF66] shadow-[0_0_8px_rgba(0,255,102,0.6)]" />
              <div className="text-[9px] font-black text-[#00FF66] tracking-widest uppercase mb-1 flex items-center gap-1.5">
                <span>✨ MOTIVACIÓN DIARIA</span>
              </div>
              <p className="text-[11px] font-bold text-slate-100 leading-normal italic">
                {motivationMessage}
              </p>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
