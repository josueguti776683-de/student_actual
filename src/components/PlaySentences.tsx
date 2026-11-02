/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sentence, sentencesList30, sentencesList80 } from "../data/vocabulary";
import { GameHeader, ProgressBar } from "./GameUI";
import { SpeakButton } from "./SpeakButton";
import { getWordEmoji } from "../utils/wordEmojis";
import { WordEmoji } from "./WordEmoji";

interface PlaySentencesProps {
  mode: "play3_30" | "play3_80" | "play3_80_p1" | "play3_80_p2" | "play3_fast";
  onBack: () => void;
  onComplete: (correctCount: number, errorCount: number, originalTotal: number) => void;
  openPenalty: (word: string, isExam: boolean, plusOne: number, resumeCallback: () => void) => void;
  itemsOverride?: TrackedSentence[];
}

type TrackedSentence = Sentence & { plusOne: number };

function shuffle<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function PlaySentences({ mode, onBack, onComplete, openPenalty, itemsOverride }: PlaySentencesProps) {
  const [list, setList] = useState<TrackedSentence[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [locked, setLocked] = useState<boolean>(false);
  const [selectedDiv, setSelectedDiv] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [currentCorrect, setCurrentCorrect] = useState<string>("");

  const isPlay30 = mode === "play3_30";
  const isPlay80Part1 = mode === "play3_80_p1";
  const isPlay80Part2 = mode === "play3_80_p2";
  const isFast = mode === "play3_fast";
  const title = isFast 
    ? "PLAY 3 — FAST SENTENCES TEST" 
    : isPlay30 
      ? "PLAY 3 — SENTENCES 30" 
      : isPlay80Part1
        ? "PLAY 3 — SENTENCES 80 (PART 1)"
        : isPlay80Part2
          ? "PLAY 3 — SENTENCES 80 (PART 2)"
          : "PLAY 3 — SENTENCES 80";

  // 1. Initialize list
  useEffect(() => {
    if (itemsOverride && itemsOverride.length > 0) {
      setList(itemsOverride);
      setIndex(0);
      setCompleted(0);
      setErrors(0);
      setTotal(itemsOverride.length);
      setLocked(false);
      setSelectedDiv(null);
      return;
    }

    let rawList = isPlay30 ? sentencesList30 : sentencesList80;
    if (isPlay80Part1) {
      rawList = sentencesList80.slice(0, 40);
    } else if (isPlay80Part2) {
      rawList = sentencesList80.slice(40, 80);
    } else if (isFast) {
      rawList = [...sentencesList30, ...sentencesList80];
    }
    let shuffledMapped = shuffle(rawList).map((s) => ({ ...s, plusOne: 0 }));
    if (isFast) {
      shuffledMapped = shuffledMapped.slice(0, 5);
    }
    setList(shuffledMapped);
    setIndex(0);
    setCompleted(0);
    setErrors(0);
    setTotal(shuffledMapped.length);
    setLocked(false);
    setSelectedDiv(null);
  }, [mode, itemsOverride]);

  // 2. Load question when index or list changes
  useEffect(() => {
    if (list.length === 0 || index >= list.length) return;

    const current = list[index];
    const opts = shuffle([current.correct, current.distractors[0], current.distractors[1]]);
    
    setOptions(opts);
    setCurrentCorrect(current.correct);
    setSelectedDiv(null);
    setLocked(false);
  }, [list, index]);

  if (list.length === 0 || index >= list.length) {
    return null;
  }

  const current = list[index];

  const handleSelect = (opt: string) => {
    if (locked) return;

    if (opt === currentCorrect) {
      // CORRECT CHOICE
      setSelectedDiv(opt + "_correct");
      setLocked(true);
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
      // INCORRECT CHOICE
      setSelectedDiv(opt + "_wrong");
      setLocked(true);
      setErrors((prev) => prev + 1);
      setTotal((prev) => prev + 1);

      // Reinsertion logic: clone current item with plusOne + 1
      const updatedItem: TrackedSentence = {
        ...current,
        plusOne: current.plusOne + 1,
      };

      // Determine reinsertion target index (index + 3 to index + 6)
      // Cap at the remaining list length
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
      // Play 3 uses neutralColors: true, which we support by styling beautifully or letting the modal run
      openPenalty(current.english, true, updatedItem.plusOne, () => {
        setSelectedDiv(null);
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
    <div className="p-7 pb-10 pt-8 flex-1 flex flex-col justify-between" id="playSentencesView">
      <div>
        <GameHeader title={title} onBack={onBack} />
        <ProgressBar current={completed + 1} total={total} label="SENTENCE" />

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
          id="playSentencesQuestionCard"
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
                lineHeight: "snug",
                flex: 1,
              }}
              id="englishSentenceText"
            >
              <div>{current.english}</div>
              {getWordEmoji(current.english) && (
                <div className="text-3xl mt-3 flex justify-center select-none">
                  <WordEmoji item={current.english} />
                </div>
              )}
            </div>
            <SpeakButton text={current.english} size="sm" />
          </div>

          {/* Option Buttons */}
          <div className="flex flex-col gap-3" id="playSentencesOptionsList">
            {options.map((opt) => {
              const isCorrectSelected = selectedDiv === opt + "_correct";
              const isWrongSelected = selectedDiv === opt + "_wrong";
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
                    border: isCorrectSelected
                      ? "2px solid #00D9FF"
                      : isWrongSelected
                      ? "2px solid #ff3366"
                      : "2px solid rgba(0, 217, 255, 0.45)",
                    background: isCorrectSelected
                      ? "rgba(0, 217, 255, 0.18)"
                      : isWrongSelected
                      ? "rgba(255, 51, 102, 0.18)"
                      : "rgba(0, 217, 255, 0.06)",
                    boxShadow: isCorrectSelected
                      ? "0 0 15px rgba(0, 217, 255, 0.7)"
                      : isWrongSelected
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
        ROUTINE PLAY 3 • ENGLISH LEARNING SYSTEM
      </div>
    </div>
  );
}
