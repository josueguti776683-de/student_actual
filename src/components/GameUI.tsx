/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface GameHeaderProps {
  title: string;
  onBack: () => void;
}

export function GameHeader({ title, onBack }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#00D9FF]/20">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#00D9FF]/20 hover:border-[#00D9FF] transition-all cursor-pointer"
        id="gameHeaderBackBtn"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      <span
        className="text-[14px] font-black tracking-[2px] text-white uppercase text-center flex-grow select-none"
        style={{
          textShadow: "0 0 10px rgba(0, 217, 255, 0.4)",
        }}
      >
        {title}
      </span>

      {/* Placeholder to balance the layout */}
      <div className="w-9" />
    </div>
  );
}

interface ProgressBarProps {
  current: number;
  total: number;
  label: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  // Ensure we don't divide by zero or exceed 100%
  const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;

  return (
    <div className="mb-6 w-full select-none" id="gameProgressBarContainer">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black tracking-widest text-[#00D9FF] uppercase">
          {label} {current} / {total}
        </span>
        <span className="text-[10px] font-mono font-bold text-white/60">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="w-full h-2.5 bg-slate-900/80 rounded-full border border-[#00D9FF]/15 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #00B8E6 0%, #00D9FF 100%)",
            boxShadow: "0 0 10px #00D9FF",
          }}
        />
      </div>
    </div>
  );
}
