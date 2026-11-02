/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { allVocabList } from "../data/vocabulary";
import { GameHeader, ProgressBar } from "./GameUI";
import { SpeakButton } from "./SpeakButton";
import { getWordEmoji } from "../utils/wordEmojis";
import { WordEmoji } from "./WordEmoji";

interface PlayWordsMultipleProps {
  mode: "play4_v1" | "play4_v2" | "play4_fast";
  onBack: () => void;
  onComplete: (correctCount: number, errorCount: number, originalTotal: number) => void;
  openPenalty: (word: string, isExam: boolean, plusOne: number, resumeCallback: () => void) => void;
  itemsOverride?: TrackedWord[];
}

type TrackedWord = { eng: string; esp: string; plusOne: number };

function shuffle<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function PlayWordsMultiple({ mode, onBack, onComplete, openPenalty, itemsOverride }: PlayWordsMultipleProps) {
  const [list, setList] = useState<TrackedWord[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [locked, setLocked] = useState<boolean>(false);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [selectedCorrect, setSelectedCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [currentCorrect, setCurrentCorrect] = useState<string>("");

  const isV1 = mode === "play4_v1";
  const isFast = mode === "play4_fast";
  const title = isFast 
    ? "PLAY 4 — FAST VOCABULARY TEST" 
    : isV1 
      ? "PLAY 4 — VOCABULARY 1" 
      : "PLAY 4 — VOCABULARY 2";
  const answerField = isFast ? 1 : (isV1 ? 1 : 0); // 1 = Spanish (esp), 0 = English (eng)

  // 1. Initialize list
  useEffect(() => {
    if (itemsOverride && itemsOverride.length > 0) {
      setList(itemsOverride);
      setIndex(0);
      setCompleted(0);
      setErrors(0);
      setTotal(itemsOverride.length);
      setLocked(false);
      setSelectedOpt(null);
      setSelectedCorrect(null);
      return;
    }

    // play4_v1: list is in original order, mapped
    // play4_v2: list is shuffled, mapped
    const baseList = allVocabList.map(([eng, esp]) => ({ eng, esp, plusOne: 0 }));
    let preparedList = isV1 ? baseList : shuffle(baseList);
    if (isFast) {
      preparedList = shuffle(baseList).slice(0, 5);
    }

    setList(preparedList);
    setIndex(0);
    setCompleted(0);
    setErrors(0);
    setTotal(preparedList.length);
    setLocked(false);
    setSelectedOpt(null);
    setSelectedCorrect(null);
  }, [mode, itemsOverride]);

  // Utility to gather choices
  const getDistractors = (correct: string, pool: [string, string][], field: 0 | 1): string[] => {
    const uniqueOptions = Array.from(new Set(pool.map((pair) => pair[field])));
    const filtered = uniqueOptions.filter((val) => val.trim().toLowerCase() !== correct.trim().toLowerCase());
    const shuffled = shuffle(filtered);
    return shuffled.slice(0, 2);
  };

  const buildOptions = (correct: string, pool: [string, string][], field: 0 | 1): string[] => {
    const distractors = getDistractors(correct, pool, field);
    return shuffle([correct, ...distractors]);
  };

  const getPool = (lst: TrackedWord[]): [string, string][] => {
    return lst.map((w) => [w.eng, w.esp]);
  };

  // 2. Load question
  useEffect(() => {
    if (list.length === 0 || index >= list.length) return;

    const current = list[index];
    const correct = answerField === 1 ? current.esp : current.eng;
    const pool = getPool(list);
    
    setCurrentCorrect(correct);
    setOptions(buildOptions(correct, pool, answerField));
    setLocked(false);
    setSelectedOpt(null);
    setSelectedCorrect(null);
  }, [list, index]);

  if (list.length === 0 || index >= list.length) {
    return null;
  }

  const current = list[index];

  const handleSelect = (opt: string) => {
    if (locked) return;

    setSelectedOpt(opt);
    setLocked(true);

    if (opt === currentCorrect) {
      setSelectedCorrect(true);
      setCompleted((prev) => prev + 1);

      setTimeout(() => {
        const nextIdx = index + 1;
        if (nextIdx < list.length) {
          setIndex(nextIdx);
        } else {
          onComplete(completed + 1, errors, list.length);
        }
      }, 700);
    } else {
      setSelectedCorrect(false);
      setErrors((prev) => prev + 1);
      setTotal((prev) => prev + 1);

      // Reinsert word with plusOne + 1
      const updatedItem: TrackedWord = {
        ...current,
        plusOne: current.plusOne + 1,
      };

      const minOffset = 3;
      const maxOffset = 6;
      const remainingCount = list.length - index;
      const offset = Math.min(
        remainingCount,
        Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset
      );
      const targetPos = index + offset;

      const nextList = [...list];
      nextList.splice(targetPos, 0, updatedItem);
      setList(nextList);

      // Open Penalty Modal
      // Play 4 uses neutralColors: false, which is traditional behavior (reds / pinks)
      openPenalty(current.eng, true, updatedItem.plusOne, () => {
        setSelectedOpt(null);
        setSelectedCorrect(null);
        setLocked(false);
        // Advance index
        const nextIdx = index + 1;
        if (nextIdx < nextList.length) {
          setIndex(nextIdx);
        } else {
          onComplete(completed, errors + 1, nextList.length);
        }
      });
    }
  };

  return (
    <div className="p-7 pb-10 pt-8 flex-1 flex flex-col justify-between" id="playWordsMultipleView">
      <div>
        <GameHeader title={title} onBack={onBack} />
        <ProgressBar current={completed + 1} total={total} label="QUESTION" />

        {/* Question Card */}
        <div
          className="relative overflow-hidden mb-6"
          style={{
            background: "linear-gradient(180deg, #0E1F42 0%, #07122E 100%)",
            border: "1px solid rgba(0, 217, 255, 0.25)",
            boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)",
            borderRadius: "25px",
            padding: "24px",
          }}
          id="playWordsMultipleQuestionCard"
        >
          {/* Left Decorative Vertical Bar */}
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "4px",
              height: "100%",
              borderRadius: "25px 0 0 25px",
              background: "linear-gradient(180deg, #00D9FF, #00B8E6, #00D9FF)",
            }}
          />

          {/* Question Text & Audio Button */}
          <div className="flex items-start justify-between gap-3 mb-7">
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#fff",
                textShadow: "0 0 10px rgba(0, 217, 255, 0.5)",
                textAlign: "center",
                flex: 1,
              }}
              id="vocabularyQuestionText"
            >
              {isV1 ? (
                <div>
                  <span>
                    Translate to Spanish:{" "}
                    <strong className="text-[#00D9FF]">{current.eng.toUpperCase()}</strong>
                  </span>
                  {getWordEmoji(current.eng) && (
                    <div className="text-3xl mt-2 flex justify-center select-none">
                      <WordEmoji item={current.eng} />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <span>
                    Translate to English:{" "}
                    <strong className="text-[#00D9FF]">{current.esp}</strong>
                  </span>
                  {getWordEmoji(current.esp || current.eng) && (
                    <div className="text-3xl mt-2 flex justify-center select-none">
                      <WordEmoji item={current.esp || current.eng} />
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Always pronounces the English word */}
            <SpeakButton text={current.eng} size="sm" />
          </div>

          {/* Option Buttons */}
          <div className="flex flex-col gap-3" id="playWordsOptionsList">
            {options.map((opt) => {
              const isSelected = selectedOpt === opt;
              const isCorrectOpt = isSelected && selectedCorrect === true;
              const isWrongOpt = isSelected && selectedCorrect === false;

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={locked}
                  style={{
                    borderRadius: "18px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#fff",
                    textAlign: "center",
                    border: isCorrectOpt
                      ? "2px solid #00D9FF"
                      : isWrongOpt
                      ? "2px solid #ff3366"
                      : "2px solid rgba(0, 217, 255, 0.45)",
                    background: isCorrectOpt
                      ? "rgba(0, 217, 255, 0.18)"
                      : isWrongOpt
                      ? "rgba(255, 51, 102, 0.18)"
                      : "rgba(0, 217, 255, 0.06)",
                    boxShadow: isCorrectOpt
                      ? "0 0 15px rgba(0, 217, 255, 0.7)"
                      : isWrongOpt
                      ? "0 0 15px rgba(255, 51, 102, 0.7)"
                      : "none",
                    cursor: locked ? "default" : "pointer",
                    transition: "all 150ms",
                  }}
                  className="w-full text-left"
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center font-mono text-[9px] text-slate-500 tracking-widest uppercase">
        ROUTINE PLAY 4 • ENGLISH LEARNING SYSTEM
      </div>
    </div>
  );
}
