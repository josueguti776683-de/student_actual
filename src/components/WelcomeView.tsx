/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { speakText, stopSpeaking } from "../utils/audio";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

interface WelcomeViewProps {
  onBack: () => void;
}

// Full alphabet A to Z with American pronunciation names and IPA symbols
interface AlphabetLetter {
  letter: string;
  ipa: string;
  isVowel: boolean;
  audioText: string;
}

const ALPHABET: AlphabetLetter[] = [
  { letter: "Aa", ipa: "/eɪ/", isVowel: true, audioText: "A" },
  { letter: "Bb", ipa: "/biː/", isVowel: false, audioText: "B" },
  { letter: "Cc", ipa: "/siː/", isVowel: false, audioText: "C" },
  { letter: "Dd", ipa: "/diː/", isVowel: false, audioText: "D" },
  { letter: "Ee", ipa: "/iː/", isVowel: true, audioText: "E" },
  { letter: "Ff", ipa: "/ɛf/", isVowel: false, audioText: "F" },
  { letter: "Gg", ipa: "/dʒiː/", isVowel: false, audioText: "G" },
  { letter: "Hh", ipa: "/eɪtʃ/", isVowel: false, audioText: "H" },
  { letter: "Ii", ipa: "/aɪ/", isVowel: true, audioText: "I" },
  { letter: "Jj", ipa: "/dʒeɪ/", isVowel: false, audioText: "J" },
  { letter: "Kk", ipa: "/keɪ/", isVowel: false, audioText: "K" },
  { letter: "Ll", ipa: "/ɛl/", isVowel: false, audioText: "L" },
  { letter: "Mm", ipa: "/ɛm/", isVowel: false, audioText: "M" },
  { letter: "Nn", ipa: "/ɛn/", isVowel: false, audioText: "N" },
  { letter: "Oo", ipa: "/oʊ/", isVowel: true, audioText: "O" },
  { letter: "Pp", ipa: "/piː/", isVowel: false, audioText: "P" },
  { letter: "Qq", ipa: "/kjuː/", isVowel: false, audioText: "Q" },
  { letter: "Rr", ipa: "/ɑːr/", isVowel: false, audioText: "R" },
  { letter: "Ss", ipa: "/ɛs/", isVowel: false, audioText: "S" },
  { letter: "Tt", ipa: "/tiː/", isVowel: false, audioText: "T" },
  { letter: "Uu", ipa: "/juː/", isVowel: true, audioText: "U" },
  { letter: "Vv", ipa: "/viː/", isVowel: false, audioText: "V" },
  { letter: "Ww", ipa: "/ˈdʌbəl.juː/", isVowel: false, audioText: "W" },
  { letter: "Xx", ipa: "/ɛks/", isVowel: false, audioText: "X" },
  { letter: "Yy", ipa: "/waɪ/", isVowel: false, audioText: "Y" },
  { letter: "Zz", ipa: "/ziː/", isVowel: false, audioText: "Z" },
];

interface PhonicsWord {
  word: string;
  ipa: string;
  meaning: string;
}

interface VowelPhonics {
  letter: string;
  closedSound: string;
  closedDesc: string;
  closedWords: PhonicsWord[];
  openSound: string;
  openDesc: string;
  openWords: PhonicsWord[];
}

const PHONICS_DATA: Record<string, VowelPhonics> = {
  A: {
    letter: "A",
    closedSound: "/æ/",
    closedDesc: "Sonido corto. Labios estirados, boca muy abierta.",
    closedWords: [
      { word: "cat", ipa: "/kæt/", meaning: "gato" },
      { word: "hat", ipa: "/hæt/", meaning: "sombrero" },
      { word: "man", ipa: "/mæn/", meaning: "hombre" },
      { word: "sad", ipa: "/sæd/", meaning: "triste" },
    ],
    openSound: "/eɪ/",
    openDesc: "Sonido largo. Suena idéntico al nombre de la letra A.",
    openWords: [
      { word: "baby", ipa: "/ˈbeɪbi/", meaning: "bebé" },
      { word: "cake", ipa: "/keɪk/", meaning: "pastel" },
      { word: "paper", ipa: "/ˈbeɪpər/", meaning: "papel" },
      { word: "lake", ipa: "/leɪk/", meaning: "lago" },
    ],
  },
  E: {
    letter: "E",
    closedSound: "/ɛ/",
    closedDesc: "Sonido corto. Boca relajada a media altura.",
    closedWords: [
      { word: "bed", ipa: "/bɛd/", meaning: "cama" },
      { word: "red", ipa: "/rɛd/", meaning: "rojo" },
      { word: "hen", ipa: "/hɛn/", meaning: "gallina" },
      { word: "pen", ipa: "/pɛn/", meaning: "bolígrafo" },
    ],
    openSound: "/iː/",
    openDesc: "Sonido largo. Suena estirando los labios como sonriendo.",
    openWords: [
      { word: "me", ipa: "/miː/", meaning: "yo (me)" },
      { word: "he", ipa: "/hiː/", meaning: "él" },
      { word: "we", ipa: "/wiː/", meaning: "nosotros" },
      { word: "tree", ipa: "/triː/", meaning: "árbol" },
    ],
  },
  I: {
    letter: "I",
    closedSound: "/ɪ/",
    closedDesc: "Sonido corto. Vocal corta, relajada y veloz.",
    closedWords: [
      { word: "pin", ipa: "/pɪn/", meaning: "alfiler" },
      { word: "fish", ipa: "/fɪʃ/", meaning: "pez" },
      { word: "milk", ipa: "/mɪlk/", meaning: "leche" },
      { word: "pig", ipa: "/pɪg/", meaning: "cerdo" },
    ],
    openSound: "/aɪ/",
    openDesc: "Sonido largo. Empieza con un sonido de 'a' y pasa a 'i'.",
    openWords: [
      { word: "ice", ipa: "/aɪs/", meaning: "hielo" },
      { word: "fly", ipa: "/flaɪ/", meaning: "volar" },
      { word: "kite", ipa: "/kaɪt/", meaning: "cometa" },
      { word: "bike", ipa: "/baɪk/", meaning: "bicicleta" },
    ],
  },
  O: {
    letter: "O",
    closedSound: "/ɑː/",
    closedDesc: "Sonido corto. Mandíbula baja, garganta abierta.",
    closedWords: [
      { word: "hot", ipa: "/hɑːt/", meaning: "caliente" },
      { word: "dog", ipa: "/dɔːg/", meaning: "perro" },
      { word: "fox", ipa: "/fɑːks/", meaning: "zorro" },
      { word: "box", ipa: "/bɑːks/", meaning: "caja" },
    ],
    openSound: "/oʊ/",
    openDesc: "Sonido largo. Empieza con 'o' y se redondea hacia 'u'.",
    openWords: [
      { word: "go", ipa: "/goʊ/", meaning: "ir" },
      { word: "no", ipa: "/noʊ/", meaning: "no" },
      { word: "home", ipa: "/hoʊm/", meaning: "hogar" },
      { word: "rose", ipa: "/roʊz/", meaning: "rosa" },
    ],
  },
  U: {
    letter: "U",
    closedSound: "/ʌ/",
    closedDesc: "Sonido corto. Sonido de sorpresa, relajado en el centro.",
    closedWords: [
      { word: "cup", ipa: "/kʌp/", meaning: "taza" },
      { word: "sun", ipa: "/sʌn/", meaning: "sol" },
      { word: "bug", ipa: "/bʌg/", meaning: "bicho" },
      { word: "duck", ipa: "/dʌk/", meaning: "pato" },
    ],
    openSound: "/juː/",
    openDesc: "Sonido largo. Suena como la palabra 'you' en inglés.",
    openWords: [
      { word: "music", ipa: "/ˈmjuːzɪk/", meaning: "música" },
      { word: "cube", ipa: "/kjuːb/", meaning: "cubo" },
      { word: "unicorn", ipa: "/ˈjuːnɪkɔːrn/", meaning: "unicornio" },
      { word: "blue", ipa: "/bluː/", meaning: "azul" },
    ],
  },
};

export default function WelcomeView({ onBack }: WelcomeViewProps) {
  const [selectedVowel, setSelectedVowel] = useState<"A" | "E" | "I" | "O" | "U">("A");

  const handleLetterClick = (item: AlphabetLetter) => {
    stopSpeaking();
    speakText(item.audioText);
  };

  const handleWordClick = (word: string) => {
    stopSpeaking();
    speakText(word);
  };

  const currentPhonics = PHONICS_DATA[selectedVowel];

  return (
    <div className="flex flex-col min-h-full bg-transparent px-5 py-6 font-sans select-none text-slate-100" id="pantallaWelcome">
      
      {/* Header */}
      <div className="flex flex-col items-center w-full mb-6 gap-4 border-b border-sky-400/20 pb-4" id="welcomeHeader">
        <div className="text-center">
          <span 
            className="font-black text-[18px] tracking-[4px] text-sky-400 uppercase text-shadow-sm flex items-center justify-center gap-2"
            id="tituloWelcome"
          >
            <Sparkles size={18} className="animate-pulse" />
            WELCOME — BIENVENIDO
          </span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[1.5px] mt-1.5">
            Abecedario, Vocales y Fonética Básica
          </p>
        </div>

        <button 
          onClick={onBack}
          className="border border-sky-400/60 bg-sky-500/5 rounded-full cursor-pointer hover:bg-sky-500/20 active:scale-95 transition-all uppercase select-none text-sky-400 hover:border-sky-400 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)] px-5 py-1.5 text-[11px] font-extrabold tracking-widest mt-1"
          id="btnWelcomeBack"
        >
          ← REGRESAR
        </button>
      </div>

      {/* Alphabet Legend */}
      <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl mb-6 text-center" id="legendWelcome">
        <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-2">Código de Colores:</h3>
        <div className="flex items-center justify-center gap-6 text-[11px] font-bold">
          <div className="flex items-center gap-1.5 text-sky-400">
            <span className="w-3.5 h-3.5 rounded-full bg-sky-500/20 border border-sky-400/50" />
            <span>VOCALES (Celeste)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00FF66]">
            <span className="w-3.5 h-3.5 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/50" />
            <span>CONSONANTES (Verde)</span>
          </div>
        </div>
      </div>

      {/* A-Z Alphabet Grid */}
      <h3 className="text-xs font-black tracking-[2px] text-sky-400 uppercase mb-3 text-center">
        🔤 EL ABECEDARIO COMPLETO (A - Z)
      </h3>
      
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-8" id="alphabetGrid">
        {ALPHABET.map((item) => {
          const colorClasses = item.isVowel 
            ? "border-sky-400/40 bg-sky-500/5 text-sky-400 hover:bg-sky-500/25 hover:border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.05)]" 
            : "border-[#00FF66]/30 bg-[#00FF66]/5 text-[#00FF66] hover:bg-[#00FF66]/20 hover:border-[#00FF66] shadow-[0_0_8px_rgba(0,255,102,0.03)]";
          
          return (
            <motion.div
              key={item.letter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLetterClick(item)}
              className={`border rounded-2xl p-2.5 flex flex-col items-center justify-center cursor-pointer transition-all ${colorClasses}`}
              id={`letter-card-${item.letter}`}
            >
              {/* Voice icon */}
              <span className="text-[10px] mb-1 opacity-70">🔊</span>
              {/* Big letter */}
              <span className="text-2xl font-black tracking-wide leading-none select-none">
                {item.letter}
              </span>
              {/* IPA pronunciation symbol name */}
              <span className="text-[10px] font-extrabold font-mono mt-1 px-1.5 py-0.5 rounded bg-slate-950/50 text-slate-300 leading-none">
                {item.ipa}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Phonics Segment: Open and Closed Syllables for Kids */}
      <div className="bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800 p-5 rounded-3xl" id="phonicsContainer">
        <div className="text-center mb-4">
          <span className="text-[11px] font-black text-amber-400 tracking-[2px] uppercase bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/25">
            🔬 FONÉTICA IPA PARA NIÑOS
          </span>
          <h4 className="text-[13px] font-black tracking-wider text-white mt-3 uppercase">
            Sílabas Abiertas y Cerradas
          </h4>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
            Las vocales en inglés tienen dos sonidos principales: corto (Sílaba Cerrada) y largo (Sílaba Abierta). Elige una vocal para aprender sus reglas.
          </p>
        </div>

        {/* Interactive Vowel Selector */}
        <div className="flex items-center justify-center gap-2.5 mb-6" id="vowelTabs">
          {(["A", "E", "I", "O", "U"] as const).map((vowel) => {
            const isSelected = selectedVowel === vowel;
            return (
              <button
                key={vowel}
                onClick={() => setSelectedVowel(vowel)}
                className={`w-11 h-11 flex items-center justify-center rounded-2xl font-black text-base cursor-pointer transition-all active:scale-90 ${
                  isSelected
                    ? "bg-sky-400 text-[#07122E] shadow-[0_0_15px_rgba(56,189,248,0.5)] border-2 border-sky-400"
                    : "bg-slate-900 border border-slate-800 text-sky-400 hover:bg-slate-800/60"
                }`}
                id={`btn-vowel-${vowel}`}
              >
                {vowel}
              </button>
            );
          })}
        </div>

        {/* Phonics Content Cards (Closed vs Open) */}
        <div className="space-y-5" id="phonicsSyllables">
          {/* Card 1: Closed Syllable / Sílaba Cerrada */}
          <div className="border border-rose-500/20 bg-rose-500/5 rounded-2xl p-4.5 text-left relative overflow-hidden" id="cardClosedSyllable">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500/60" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-rose-400 tracking-wider">
                🚪 Sílaba Cerrada (Closed Syllable)
              </span>
              <span className="text-sm font-black text-rose-300 font-mono bg-rose-500/20 px-2.5 py-0.5 rounded-lg border border-rose-500/30">
                {currentPhonics.closedSound}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-200 mb-1 leading-relaxed">
              La sílaba termina en una consonante, lo que "cierra" la vocal haciéndola sonar de forma <strong className="text-rose-400">corta</strong>.
            </p>
            <p className="text-[10px] italic text-slate-400 mb-4">
              {currentPhonics.closedDesc}
            </p>

            {/* List of Closed Syllable words */}
            <div className="grid grid-cols-2 gap-2.5" id="closedWordsGrid">
              {currentPhonics.closedWords.map((item) => (
                <div
                  key={item.word}
                  onClick={() => handleWordClick(item.word)}
                  className="flex items-center justify-between p-2.5 bg-slate-950/50 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 rounded-xl transition-all cursor-pointer group"
                  id={`word-closed-${item.word}`}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-[14px] font-black text-white group-hover:text-rose-300 capitalize">
                      {item.word}
                    </span>
                    <span className="text-[10px] font-bold font-mono text-slate-400 tracking-wide mt-0.5">
                      {item.ipa}
                    </span>
                    <span className="text-[9px] font-extrabold text-rose-400/80 uppercase mt-0.5 tracking-wider">
                      {item.meaning}
                    </span>
                  </div>
                  <span className="text-xs bg-rose-500/10 p-1 rounded-lg group-hover:bg-rose-500/20 select-none">
                    🔊
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Open Syllable / Sílaba Abierta */}
          <div className="border border-[#00FF66]/20 bg-[#00FF66]/5 rounded-2xl p-4.5 text-left relative overflow-hidden" id="cardOpenSyllable">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00FF66]/60" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-[#00FF66] tracking-wider">
                📖 Sílaba Abierta (Open Syllable)
              </span>
              <span className="text-sm font-black text-[#00FF66] font-mono bg-[#00FF66]/20 px-2.5 py-0.5 rounded-lg border border-[#00FF66]/30">
                {currentPhonics.openSound}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-200 mb-1 leading-relaxed">
              La sílaba termina en vocal, dejándola "abierta" para que suene de forma <strong className="text-[#00FF66]">larga</strong> (su propio nombre en inglés).
            </p>
            <p className="text-[10px] italic text-slate-400 mb-4">
              {currentPhonics.openDesc}
            </p>

            {/* List of Open Syllable words */}
            <div className="grid grid-cols-2 gap-2.5" id="openWordsGrid">
              {currentPhonics.openWords.map((item) => (
                <div
                  key={item.word}
                  onClick={() => handleWordClick(item.word)}
                  className="flex items-center justify-between p-2.5 bg-slate-950/50 hover:bg-[#00FF66]/10 border border-slate-800 hover:border-[#00FF66]/30 rounded-xl transition-all cursor-pointer group"
                  id={`word-open-${item.word}`}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-[14px] font-black text-white group-hover:text-[#00FF66] capitalize">
                      {item.word}
                    </span>
                    <span className="text-[10px] font-bold font-mono text-slate-400 tracking-wide mt-0.5">
                      {item.ipa}
                    </span>
                    <span className="text-[9px] font-extrabold text-[#00FF66]/80 uppercase mt-0.5 tracking-wider">
                      {item.meaning}
                    </span>
                  </div>
                  <span className="text-xs bg-[#00FF66]/10 p-1 rounded-lg group-hover:bg-[#00FF66]/20 select-none">
                    🔊
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
