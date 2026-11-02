/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

interface HeaderProps {
  title: string;
  autoSpeakEnabled: boolean;
  onToggleAutoSpeak: () => void;
  onBack: () => void;
}

export default function Header({ title, autoSpeakEnabled, onToggleAutoSpeak, onBack }: HeaderProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer active:scale-95 transition-all"
        title="Go back"
        id="headerBackBtn"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Screen Title */}
      <span className="text-center font-sans text-xs font-extrabold tracking-widest text-emerald-400 uppercase max-w-[50%] overflow-hidden text-ellipsis whitespace-nowrap neon-glow-green">
        {title}
      </span>

      {/* Auto Speak Toggle */}
      <button
        onClick={onToggleAutoSpeak}
        className={`audio-toggle flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-2xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
          autoSpeakEnabled
            ? "bg-emerald-500/10 border-emerald-500/80 text-emerald-400 neon-border-green"
            : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400"
        }`}
        title="Toggle Auto Speak"
        id="headerAutoSpeakToggle"
      >
        {autoSpeakEnabled ? (
          <>
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>AUTO: ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span>AUTO: OFF</span>
          </>
        )}
      </button>
    </div>
  );
}
