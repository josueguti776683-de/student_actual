/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { getMotivationForScreen } from "../utils/motivation";

interface ResultsViewProps {
  correctCount: number;
  totalQuestionCount: number;
  errorCount: number;
  onAgain: () => void;
  onMainMenu: () => void;
  onFastTest?: () => void;
  subTypeLabel: string;
  lastPlayMode?: string;
}

export default function ResultsView({
  correctCount,
  totalQuestionCount,
  errorCount,
  onAgain,
  onMainMenu,
  onFastTest,
  subTypeLabel,
  lastPlayMode = "1"
}: ResultsViewProps) {
  const isPerfect = errorCount === 0;
  const scorePercent = totalQuestionCount > 0 ? Math.round((correctCount / totalQuestionCount) * 100) : 0;

  // Grade/Nota calculation:
  // 100 if has 0 errors, 90 if has > 0 and <= 5, 80 if has > 5
  const nota = errorCount === 0 ? 100 : (errorCount <= 5 ? 90 : 80);

  // Generate a random personalized quote once when this component mounts
  const randomMotivation = useMemo(() => getMotivationForScreen("results"), []);

  return (
    <div className="flex flex-col items-center justify-start w-full flex-1 py-6 px-4 text-slate-100 bg-transparent font-sans space-y-5" id="pantallaResultado">
      
      {/* Trophy Badge (Centered & Large at the top) */}
      <div className="text-center mt-4 w-full flex flex-col items-center select-none shrink-0" id="resultHeader">
        <div
          className="text-8xl leading-none mb-3 animate-bounce transition-all duration-300"
          id="iconoResultado"
          style={{ 
            animationDuration: "3s",
            filter: isPerfect ? "drop-shadow(0 0 35px rgba(255,215,0,0.65))" : "drop-shadow(0 0 35px rgba(0,255,102,0.45))"
          }}
        >
          {isPerfect ? "🏆" : "🥈"}
        </div>

        {/* COMPLETED 100% */}
        <h2 
          className="text-4xl font-black tracking-widest text-[#00FF66] uppercase leading-none transition-all duration-300 animate-[fadeIn_0.5s_ease-out]"
          style={{ textShadow: "0 0 12px rgba(0,255,102,0.4)" }}
          id="tituloResultado"
        >
          COMPLETED 100%
        </h2>

        <div 
          className="text-[10px] text-slate-400 mt-2.5 uppercase tracking-[3px] font-bold"
          id="subtituloResultado"
        >
          {subTypeLabel || "LEARNING MODE COMPLETED"}
        </div>
      </div>

      {/* Dynamic Cup vs Medal custom message box */}
      <div 
        className="w-full max-w-xs p-4 rounded-[20px] text-center border select-none shrink-0 uppercase tracking-wide font-black text-xs leading-relaxed transition-all duration-300 animate-[fadeIn_0.5s_ease-out]"
        style={{
          background: isPerfect ? "linear-gradient(to right, rgba(0,255,102,0.1), rgba(0,255,102,0.01))" : "linear-gradient(to right, rgba(255,51,102,0.1), rgba(255,51,102,0.01))",
          borderColor: isPerfect ? "#00ff6690" : "#ff336690",
          color: isPerfect ? "#00FF66" : "#ff3366",
          boxShadow: isPerfect ? "0 0 20px rgba(0,255,102,0.15)" : "0 0 20px rgba(255,51,102,0.15)"
        }}
        id="mensajeEspecial"
      >
        {isPerfect 
          ? "BIENVENIDO A LA VICTORIA, TU ERES EL MEJOR SIGUE ASI Y NO TE RINDAS." 
          : "LO INTENTASTE, PERO NO LLORES COMO UNA NENITA Y PRACTICA DE NUEVO."
        }
      </div>

      {/* Progress reports rectangle box (sin esquinas / rounded corners) */}
      <div 
        className="w-full max-w-xs p-5 rounded-[24px] bg-gradient-to-b from-[#0F1E42] to-[#0A1530] border-2 border-[#00FF6650] text-center shrink-0"
        style={{ boxShadow: "0 0 25px rgba(0,255,102,0.08)" }}
        id="scoreBox"
      >
        <div className="text-[10px] text-slate-400 uppercase tracking-[4px] font-black mb-3 select-none" id="labelScore">
          PROGRESS
        </div>

        {/* Large progress number */}
        <div className="text-5xl font-black text-[#00FF66] leading-none tracking-tight select-text" id="statCorrectas">
          {correctCount} / {totalQuestionCount}
        </div>

        {/* Percentage badge */}
        <div className="text-base font-extrabold text-[#00FF66]/80 mt-1 select-text" id="statPorcentaje">
          {scorePercent}%
        </div>

        {/* Horizontal divider */}
        <div className="w-full h-[1px] bg-slate-800/60 my-4" />

        {/* Detailed stats table */}
        <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-left w-full">
          
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black">CANTIDAD</span>
            <span className="text-sm font-extrabold text-white mt-0.5">{correctCount} / {totalQuestionCount}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black">ERRORES</span>
            <span className={`text-sm font-extrabold mt-0.5 ${errorCount > 0 ? 'text-rose-500' : 'text-[#00FF66]'}`}>
              {errorCount}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black">PLAY</span>
            <span className="text-sm font-extrabold text-sky-400 mt-0.5">PLAY {lastPlayMode}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black">NOTA</span>
            <span className={`text-sm font-black mt-0.5 ${nota >= 90 ? 'text-[#00FF66]' : 'text-amber-400'}`}>
              {nota}
            </span>
          </div>

        </div>
      </div>

      {/* Success/Motivation phrase card */}
      {randomMotivation && (
        <div
          className="w-full max-w-xs p-4 rounded-[20px] bg-[#00FF66]/5 border border-[#00FF66]/20 text-left relative overflow-hidden select-none shrink-0 transition-all duration-300 animate-[fadeIn_0.5s_ease-out]"
          id="resultsMotivationBox"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00FF66]" style={{ boxShadow: "0 0 10px rgba(0,255,102,0.6)" }} />
          <div className="text-[9px] font-black text-[#00FF66] tracking-[2px] uppercase mb-1.5 flex items-center gap-1.5">
            <span>✨ MENSAJE DE ÉXITO</span>
          </div>
          <p className="text-xs font-bold text-white/95 leading-relaxed italic">
            {randomMotivation}
          </p>
        </div>
      )}

      {/* Dynamic Control Buttons */}
      <div className="w-full max-w-xs space-y-3 pt-2 shrink-0 select-none">
        
        {/* AGAIN */}
        <button
          onClick={onAgain}
          className="w-full py-4 bg-gradient-to-r from-[#00FF6622] to-[#00FF6605] border-2 border-[#00FF66] rounded-[20px] text-[#00FF66] text-base font-black tracking-widest uppercase cursor-pointer hover:bg-[#00FF66]/10 active:scale-95 transition-all"
          style={{ boxShadow: "0 0 15px rgba(0,255,102,0.12)" }}
          id="againButton"
        >
          AGAIN
        </button>

        {/* FAST TEST (Only if provided) */}
        {onFastTest && (
          <button
            onClick={onFastTest}
            className="w-full py-4 bg-gradient-to-r from-[#00BFFF22] to-[#00BFFF05] border-2 border-[#00BFFF] rounded-[20px] text-[#00BFFF] text-base font-black tracking-widest uppercase cursor-pointer hover:bg-[#00BFFF]/10 active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse"
            style={{ boxShadow: "0 0 15px rgba(0,191,255,0.12)" }}
            id="fastTestButton"
          >
            ⚡ FAST TEST
          </button>
        )}

        {/* MAIN MENU */}
        <button
          onClick={onMainMenu}
          className="w-full py-3.5 bg-gradient-to-b from-[#1e1e2d] to-[#111118] border-2 border-[#64748b50] rounded-[20px] text-[#94a3b8] text-[13px] font-black tracking-widest cursor-pointer hover:border-[#00FF66] hover:text-[#00FF66] active:scale-95 transition-all uppercase"
          id="resultsMainMenuBtn"
        >
          MAIN MENU
        </button>

      </div>

    </div>
  );
}
