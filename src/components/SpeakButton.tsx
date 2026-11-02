/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Volume2 } from "lucide-react";
import { speakText } from "../utils/audio";

interface SpeakButtonProps {
  text: string;
  size?: "sm" | "md";
}

export function SpeakButton({ text, size = "md" }: SpeakButtonProps) {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(text);
  };

  const isSm = size === "sm";

  return (
    <button
      onClick={handleSpeak}
      className={`flex items-center justify-center rounded-full transition-all bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/40 hover:bg-[#00D9FF]/20 hover:border-[#00D9FF] active:scale-95 ${
        isSm ? "w-8 h-8 text-sm" : "w-11 h-11 text-lg"
      }`}
      style={{
        boxShadow: "0 0 10px rgba(0, 217, 255, 0.25)",
      }}
      title="Listen Pronunciation"
    >
      <Volume2 className={isSm ? "w-4.5 h-4.5" : "w-6 h-6"} />
    </button>
  );
}
