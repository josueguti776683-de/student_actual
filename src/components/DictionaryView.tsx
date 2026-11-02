/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Volume2, 
  BookOpen, 
  Info, 
  MoreVertical, 
  HelpCircle,
  Sparkles,
  X
} from "lucide-react";
import { speakText } from "../utils/audio";
import { 
  getUnifiedDictionary, 
  getIpaClassification, 
  getWordExampleSentences 
} from "../utils/dictionaryHelper";
import { NumberItem } from "../types";
import { getWordEmoji } from "../utils/wordEmojis";
import { WordEmoji } from "./WordEmoji";

interface DictionaryViewProps {
  onBack: () => void;
}

export function DictionaryView({ onBack }: DictionaryViewProps) {
  const [tab, setTab] = useState<"search" | "ipa">("search");
  
  // Entire dictionary list sorted alphabetically
  const dictionary = useMemo(() => getUnifiedDictionary(), []);
  
  // --- SEARCH TAB STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWord, setSelectedWord] = useState<NumberItem | null>(null);
  
  // Suggestions matching query
  const suggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return dictionary
      .filter(item => item.word.toLowerCase().includes(q))
      .slice(0, 8); // limit to 8 suggestions for performance and UI
  }, [searchQuery, dictionary]);

  // Set a random default word when entering the dictionary view
  useEffect(() => {
    if (selectedWord === null && dictionary.length > 0) {
      const randomIndex = Math.floor(Math.random() * dictionary.length);
      setSelectedWord(dictionary[randomIndex]);
    }
  }, [dictionary, selectedWord]);

  // --- IPA TAB STATES ---
  const [currentIpaIndex, setCurrentIpaIndex] = useState(0);
  const [showAlphabetMenu, setShowAlphabetMenu] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  const [activePhoneticFilter, setActivePhoneticFilter] = useState("all");

  // Filter dictionary for words by letter and/or phonetic category
  const ipaWords = useMemo(() => {
    let filtered = dictionary;

    // 1. Filter by phonetic category first if not 'all'
    if (activePhoneticFilter !== "all") {
      filtered = filtered.filter(w => {
        const cat = getIpaClassification(w.ipa || "").name;
        if (activePhoneticFilter === "diphthongs" && cat.includes("Diptongos")) return true;
        if (activePhoneticFilter === "schwa" && cat.includes("Schwa")) return true;
        if (activePhoneticFilter === "long" && cat.includes("Largas")) return true;
        if (activePhoneticFilter === "short" && cat.includes("Cortas")) return true;
        if (activePhoneticFilter === "consonants" && cat.includes("Consonánticos")) return true;
        return false;
      });
    }

    // 2. Filter by letter unless 'ALL' is selected
    if (selectedLetter !== "ALL") {
      const letter = selectedLetter.toUpperCase();
      filtered = filtered.filter(w => w.word.toUpperCase().startsWith(letter));
    }

    return filtered;
  }, [selectedLetter, activePhoneticFilter, dictionary]);

  // Reset IPA word index when filters change
  useEffect(() => {
    setCurrentIpaIndex(0);
  }, [selectedLetter, activePhoneticFilter]);

  const activeIpaWord = useMemo<NumberItem | null>(() => {
    if (ipaWords.length === 0) return null;
    return ipaWords[currentIpaIndex % ipaWords.length];
  }, [ipaWords, currentIpaIndex]);

  // Handle playing voice
  const handleSpeak = (text: string) => {
    speakText(text);
  };

  // Letters list A to Z
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  // Auto-set selected word when suggestions are clicked
  const handleSelectSuggestion = (item: NumberItem) => {
    setSelectedWord(item);
    setSearchQuery("");
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 relative select-none" id="dictionaryViewContainer">
      
      {/* Top Header Row with Title & Subtitles */}
      <div className="flex items-center justify-between mb-4" id="dictionaryHeader">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all text-xs font-black tracking-wider uppercase cursor-pointer"
          id="dictionaryBackBtn"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          <span>BACK</span>
        </button>

        <div className="text-center flex-1">
          <h1 className="text-2xl font-black tracking-[2px] text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" id="dictionaryTitle">
            DICTIONARY
          </h1>
          <p className="text-[10px] font-black tracking-[1.5px] text-[#00FF66] uppercase mt-0.5" id="dictionarySubtitle">
            {tab === "search" ? "SEARCH" : "VOCABULARIO IPA"}
          </p>
        </div>

        {/* Empty space/spacer to balance layout */}
        <div className="w-[74px]" />
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-950/45 p-1 rounded-2xl border border-slate-850" id="dictionaryTabSelectors">
        <button
          onClick={() => setTab("search")}
          className={`py-2 px-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
            tab === "search"
              ? "bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30 shadow-[0_0_10px_rgba(0,255,102,0.1)]"
              : "text-slate-400 hover:text-white"
          }`}
          id="tabBtnSearch"
        >
          🔍 BUSCADOR
        </button>
        <button
          onClick={() => setTab("ipa")}
          className={`py-2 px-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
            tab === "ipa"
              ? "bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30 shadow-[0_0_10px_rgba(0,255,102,0.1)]"
              : "text-slate-400 hover:text-white"
          }`}
          id="tabBtnIpa"
        >
          🗣️ VOCABULARIO IPA
        </button>
      </div>

      {/* Main Mode Body */}
      <div className="flex-grow flex flex-col justify-start" id="dictionaryBody">
        
        {/* ================== TAB 1: BUSCADOR DE PALABRAS ================== */}
        {tab === "search" && (
          <div className="flex-grow flex flex-col" id="searchTabContent">
            
            {/* Search Input Box */}
            <div className="relative mb-5" id="searchBoxWrapper">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Type an English word to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-750 text-white placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-[#00FF66]/70 focus:shadow-[0_0_15px_rgba(0,255,102,0.15)] transition-all"
                id="wordSearchInput"
              />
              
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                  id="clearSearchQueryBtn"
                >
                  CLEAR
                </button>
              )}

              {/* Instant Suggestions Box */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 mt-2 bg-slate-900 border border-[#00FF66]/20 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                    id="searchSuggestionsList"
                  >
                    {suggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSuggestion(item)}
                        className="px-4 py-3 border-b border-slate-800/40 hover:bg-[#00FF66]/10 flex items-center justify-between cursor-pointer transition-colors"
                        id={`suggestionItem-${idx}`}
                      >
                        <span className="text-white font-black text-sm uppercase tracking-wide">
                          {item.word}
                        </span>
                        <span className="text-slate-400 text-xs italic">
                          {item.symbol}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selected Word Details Card (Celeste / Light blue outline) */}
            {selectedWord ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-grow flex flex-col justify-between"
                key={selectedWord.word}
                id="selectedWordCardWrapper"
              >
                <div 
                  className="w-full bg-slate-950/40 border-2 border-cyan-400 rounded-3xl p-6 shadow-[0_0_20px_rgba(34,211,238,0.15)] relative overflow-hidden"
                  id="celestialWordCard"
                >
                  {/* Visual Glow */}
                  <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />
                  
                  {/* Random Rotation Button */}
                  <button
                    onClick={() => {
                      const remaining = dictionary.filter(w => w.word.toLowerCase() !== selectedWord.word.toLowerCase());
                      if (remaining.length > 0) {
                        const randomIndex = Math.floor(Math.random() * remaining.length);
                        setSelectedWord(remaining[randomIndex]);
                      }
                    }}
                    className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-cyan-500/35 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/25 active:scale-95 transition-all text-[9px] font-black tracking-widest uppercase cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.1)] z-10"
                    title="Nueva Palabra Aleatoria"
                    id="randomWordShuffleBtn"
                  >
                    <Sparkles size={11} className="text-cyan-400 animate-pulse" />
                    <span>ROTAR</span>
                  </button>
                  
                  {/* Header Word & Spanish Word */}
                  <div className="text-center mb-6">
                    <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">
                      PALABRA EN ENGLISH
                    </span>
                    <h2 className="text-3xl font-black tracking-wide text-white uppercase mt-1" id="englishWordDisplay">
                      {selectedWord.word}
                    </h2>
                    
                    <div className="w-12 h-0.5 bg-cyan-400/30 mx-auto my-3" />

                    <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase">
                      PALABRA EN ESPAÑOL
                    </span>
                    <h3 className="text-xl font-bold text-[#00FF66] capitalize mt-1" id="spanishWordDisplay">
                      {selectedWord.symbol}
                    </h3>
                    {getWordEmoji(selectedWord) && (
                      <div className="text-3xl mt-1 select-none" id="dictionaryWordEmoji">
                        <WordEmoji item={selectedWord} />
                      </div>
                    )}
                  </div>

                  {/* Sound, Colored Dot & IPA Phonetics Row */}
                  <div className="flex items-center justify-center gap-4 bg-slate-900/85 p-4 rounded-2xl border border-slate-800" id="phoneticsContainer">
                    
                    {/* Voice Icon */}
                    <button
                      onClick={() => handleSpeak(selectedWord.word)}
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/20 active:scale-95 transition-all shadow-[0_0_10px_rgba(34,211,238,0.25)] cursor-pointer"
                      title="Play Pronunciation"
                      id="speakWordBtn"
                    >
                      <Volume2 size={22} strokeWidth={2.5} />
                    </button>

                    {/* Colored Dot representation for IPA category */}
                    {(() => {
                      const classification = getIpaClassification(selectedWord.ipa || "");
                      return (
                        <div className="flex items-center gap-2.5">
                          <span 
                            className={`w-4.5 h-4.5 rounded-full border border-white/20 animate-pulse shrink-0 ${classification.dotClass}`}
                            title={classification.name}
                          />
                          <div className="text-left">
                            <span className="block text-[14px] font-black tracking-wide text-slate-100 font-mono" id="ipaPhoneticDisplay">
                              {selectedWord.ipa || "/.../"}
                            </span>
                            <span className="block text-[8px] font-extrabold tracking-wider text-slate-400 uppercase leading-none mt-0.5">
                              {classification.name}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Two contextual Example Sentences */}
                  <div className="mt-6 space-y-4" id="sentencesListContainer">
                    <span className="text-[9px] font-extrabold tracking-widest text-cyan-400 uppercase block border-b border-cyan-400/10 pb-1.5">
                      📖 ORACIONES DE EJEMPLO DE USO:
                    </span>
                    
                    {getWordExampleSentences(selectedWord).map((sentence, index) => (
                      <div 
                        key={index} 
                        className="bg-slate-900/40 p-3.5 rounded-xl border border-cyan-400/15"
                        id={`exampleSentence-${index}`}
                      >
                        <p className="text-xs font-bold text-cyan-100 leading-relaxed italic">
                          "{sentence.english}"
                        </p>
                        <p className="text-xs font-semibold text-emerald-400 leading-relaxed mt-1">
                          "{sentence.spanish}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-500 italic mt-4">
                  Sugerencia: Escribe palabras como "red", "brother", "twilight" o "first" para probar.
                </div>
              </motion.div>
            ) : (
              <div className="flex-grow flex items-center justify-center p-8 text-center text-slate-500 text-xs">
                Cargando diccionario...
              </div>
            )}
          </div>
        )}

        {/* ================== TAB 2: VOCABULARIO IPA ================== */}
        {tab === "ipa" && (
          <div className="flex-grow flex flex-col" id="ipaTabContent">
            
            {/* Top Toolbar: Rules Button & Three Dots Dropdown */}
            <div className="flex items-center justify-between mb-4 relative" id="ipaToolbar">
              
              {/* RULES Button in the Center */}
              <button
                onClick={() => setShowRulesModal(true)}
                className="mx-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/35 hover:bg-amber-500/25 active:scale-95 transition-all text-xs font-extrabold uppercase tracking-wide cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                id="ipaRulesBtn"
              >
                <HelpCircle size={15} strokeWidth={2.5} className="animate-bounce" />
                <span>VER REGLAS (RULES)</span>
              </button>

              {/* 3 Dots Menu Button on the Right */}
              <button
                onClick={() => setShowAlphabetMenu(!showAlphabetMenu)}
                className={`p-2.5 rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white transition-all cursor-pointer ${
                  showAlphabetMenu ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50" : ""
                }`}
                title="Filter by Letter"
                id="alphabetFilterToggle"
              >
                <MoreVertical size={18} strokeWidth={2.5} />
              </button>

              {/* Alphabet Dropdown Menu A-Z */}
              <AnimatePresence>
                {showAlphabetMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-12 w-64 bg-slate-900/98 border border-cyan-400/30 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] z-50 p-3"
                    id="alphabetDropdownMenu"
                  >
                    <div className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest text-center mb-2 border-b border-cyan-500/10 pb-1">
                      SELECCIONA UNA LETRA:
                    </div>

                    <button
                      onClick={() => {
                        setSelectedLetter("ALL");
                        setShowAlphabetMenu(false);
                      }}
                      className={`w-full py-2 mb-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        selectedLetter === "ALL"
                          ? "bg-cyan-400 text-[#0B1B3D] shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                      id="allLettersBtn"
                    >
                      🌐 TODAS LAS LETRAS (A-Z)
                    </button>

                    <div className="grid grid-cols-6 gap-1.5" id="alphabetGrid">
                      {alphabet.map((letter) => {
                        const count = dictionary.filter(w => w.word.toUpperCase().startsWith(letter)).length;
                        return (
                          <button
                            key={letter}
                            onClick={() => {
                              setSelectedLetter(letter);
                              setShowAlphabetMenu(false);
                            }}
                            disabled={count === 0}
                            className={`py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              selectedLetter === letter
                                ? "bg-cyan-400 text-[#0B1B3D] scale-110 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                : count === 0
                                ? "opacity-20 text-slate-600 cursor-not-allowed"
                                : "bg-slate-800 text-slate-300 hover:bg-slate-700/80 hover:text-white"
                            }`}
                            id={`letterBtn-${letter}`}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Phonetic Category Filter Pills - Wrapped nicely into multiple rows to avoid horizontal cut-off */}
            <div className="flex flex-wrap gap-2 justify-center mb-4" id="ipaPhoneticPills">
              {[
                { id: "all", label: "TODOS", icon: "🌐", colorClass: "border-slate-700 text-slate-300", activeClass: "bg-slate-800 border-slate-400 text-white" },
                { id: "diphthongs", label: "DIPTONGOS", icon: "🔵", colorClass: "border-cyan-500/30 text-cyan-400", activeClass: "bg-cyan-500/20 border-cyan-400 text-cyan-200" },
                { id: "schwa", label: "SCHWA", icon: "🟡", colorClass: "border-amber-500/30 text-amber-400", activeClass: "bg-amber-500/20 border-amber-400 text-amber-200" },
                { id: "long", label: "V. LARGAS", icon: "🟢", colorClass: "border-emerald-500/30 text-emerald-400", activeClass: "bg-emerald-500/20 border-emerald-400 text-emerald-200" },
                { id: "short", label: "V. CORTAS", icon: "🔴", colorClass: "border-rose-500/30 text-rose-400", activeClass: "bg-rose-500/20 border-rose-400 text-rose-200" },
                { id: "consonants", label: "CONSONANTES", icon: "🟣", colorClass: "border-violet-500/30 text-violet-400", activeClass: "bg-violet-500/20 border-violet-400 text-violet-200" }
              ].map(cat => {
                // calculate word counts for visual feedback
                const count = dictionary.filter(w => {
                  if (cat.id === "all") return true;
                  const c = getIpaClassification(w.ipa || "").name;
                  if (cat.id === "diphthongs" && c.includes("Diptongos")) return true;
                  if (cat.id === "schwa" && c.includes("Schwa")) return true;
                  if (cat.id === "long" && c.includes("Largas")) return true;
                  if (cat.id === "short" && c.includes("Cortas")) return true;
                  if (cat.id === "consonants" && c.includes("Consonánticos")) return true;
                  return false;
                }).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActivePhoneticFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-full border text-[10px] font-black tracking-wide flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                      activePhoneticFilter === cat.id ? cat.activeClass : `${cat.colorClass} bg-slate-900/40 hover:bg-slate-800/50`
                    }`}
                    id={`phoneticFilter-${cat.id}`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label} ({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Word Display Card (Celeste / Light blue outline) */}
            {activeIpaWord ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                key={activeIpaWord.word}
                className="w-full bg-slate-950/40 border-2 border-cyan-400 rounded-3xl p-6 shadow-[0_0_20px_rgba(34,211,238,0.15)] relative overflow-hidden"
                id="ipaWordCard"
              >
                {/* Visual Glow */}
                <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />

                {/* Index Indicator */}
                <div className="absolute top-4 right-4 text-[9px] font-extrabold text-cyan-400/50 uppercase font-mono tracking-wider">
                  {currentIpaIndex + 1} / {ipaWords.length} ({selectedLetter === "ALL" ? "Todas las letras" : `Letra ${selectedLetter}`})
                </div>

                {/* Header Word & Spanish Word */}
                <div className="text-center mb-6">
                  <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">
                    PALABRA EN ENGLISH
                  </span>
                  <h2 className="text-3xl font-black tracking-wide text-white uppercase mt-1">
                    {activeIpaWord.word}
                  </h2>
                  
                  <div className="w-12 h-0.5 bg-cyan-400/30 mx-auto my-3" />

                  <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase">
                    PALABRA EN ESPAÑOL
                  </span>
                  <h3 className="text-xl font-bold text-[#00FF66] capitalize mt-1">
                    {activeIpaWord.symbol}
                  </h3>
                  {getWordEmoji(activeIpaWord) && (
                    <div className="text-3xl mt-1 select-none" id="ipaWordEmoji">
                      <WordEmoji item={activeIpaWord} />
                    </div>
                  )}
                </div>

                {/* Sound, Colored Dot & IPA Phonetics Row */}
                <div className="flex items-center justify-center gap-4 bg-slate-900/85 p-4 rounded-2xl border border-slate-800">
                  
                  {/* Voice Icon */}
                  <button
                    onClick={() => handleSpeak(activeIpaWord.word)}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/20 active:scale-95 transition-all shadow-[0_0_10px_rgba(34,211,238,0.25)] cursor-pointer"
                    title="Play Pronunciation"
                    id="speakIpaWordBtn"
                  >
                    <Volume2 size={22} strokeWidth={2.5} />
                  </button>

                  {/* Colored Dot representation for IPA category */}
                  {(() => {
                    const classification = getIpaClassification(activeIpaWord.ipa || "");
                    return (
                      <div className="flex items-center gap-2.5">
                        <span 
                          className={`w-4.5 h-4.5 rounded-full border border-white/20 animate-pulse shrink-0 ${classification.dotClass}`}
                          title={classification.name}
                        />
                        <div className="text-left">
                          <span className="block text-[14px] font-black tracking-wide text-slate-100 font-mono">
                            {activeIpaWord.ipa || "/.../"}
                          </span>
                          <span className="block text-[8px] font-extrabold tracking-wider text-slate-400 uppercase leading-none mt-0.5">
                            {classification.name}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Two contextual Example Sentences */}
                <div className="mt-6 space-y-4">
                  <span className="text-[9px] font-extrabold tracking-widest text-cyan-400 uppercase block border-b border-cyan-400/10 pb-1.5">
                    📖 ORACIONES DE EJEMPLO DE USO:
                  </span>
                  
                  {getWordExampleSentences(activeIpaWord).map((sentence, index) => (
                    <div key={index} className="bg-slate-900/40 p-3.5 rounded-xl border border-cyan-400/15">
                      <p className="text-xs font-bold text-cyan-100 leading-relaxed italic">
                        "{sentence.english}"
                      </p>
                      <p className="text-xs font-semibold text-emerald-400 leading-relaxed mt-1">
                        "{sentence.spanish}"
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-900/30 border border-slate-800/80 rounded-3xl" id="ipaNoWords">
                <p className="text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                  ⚠️ No hay palabras coincidentes
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-[240px] mb-4">
                  No se encontraron palabras con la letra "{selectedLetter}" que pertenezcan a la categoría de sonido seleccionada.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setSelectedLetter("ALL")}
                    className="px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-[9px] font-black text-cyan-400 uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Ver todas las letras
                  </button>
                  <button
                    onClick={() => setActivePhoneticFilter("all")}
                    className="px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-[9px] font-black text-[#00FF66] uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Mostrar todos los sonidos
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Interactive Word List / Board */}
            <div className="mt-4 bg-slate-900/60 border border-slate-850 p-4 rounded-2xl" id="ipaBottomWordBoard">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase flex items-center gap-1">
                  <BookOpen size={12} className="text-cyan-400" />
                  TABLERO DE SONIDOS ({ipaWords.length} palabras):
                </span>
                {selectedLetter !== "ALL" && (
                  <button 
                    onClick={() => setSelectedLetter("ALL")}
                    className="text-[9px] font-black text-cyan-400 uppercase hover:underline"
                  >
                    Ver todo el abecedario
                  </button>
                )}
              </div>
              
              {ipaWords.length > 0 ? (
                <div className="max-h-[140px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent" id="ipaBottomWordScrollArea">
                  <div className="flex flex-wrap gap-1.5">
                    {ipaWords.map((item, idx) => {
                      const isActive = activeIpaWord?.word === item.word;
                      const classification = getIpaClassification(item.ipa || "");
                      return (
                        <button
                          key={item.word}
                          onClick={() => {
                            setCurrentIpaIndex(idx);
                            handleSpeak(item.word);
                          }}
                          className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-black tracking-wide transition-all duration-150 active:scale-95 flex items-center gap-1 cursor-pointer ${
                            isActive
                              ? `${classification.color} border-current ring-1 ring-cyan-400/40 shadow-[0_0_8px_rgba(34,211,238,0.2)]`
                              : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-white"
                          }`}
                          id={`ipaBottomWord-${item.word}`}
                        >
                          <span className="uppercase">{item.word}</span>
                          <span className="text-[8px] font-mono opacity-50">{item.ipa}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center text-[10px] text-slate-500 italic py-2">
                  No hay palabras disponibles para reproducir.
                </div>
              )}
            </div>

            {/* NEXT Button to switch word in order */}
            {ipaWords.length > 1 && (
              <div className="mt-4" id="ipaNextBtnContainer">
                <motion.button
                  whileHover={{ scale: 1.01, boxShadow: "0 0 10px rgba(34,211,238,0.2)" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setCurrentIpaIndex((currentIpaIndex + 1) % ipaWords.length)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-slate-900/40 border border-cyan-400 text-cyan-200 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white transition-all cursor-pointer shadow-md"
                  id="ipaNextWordBtn"
                >
                  <span>SIGUIENTE PALABRA (NEXT)</span>
                  <ChevronRight size={14} strokeWidth={3} />
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RULES MODAL (Stunning overlay that describes the color dots perfectly as requested) */}
      <AnimatePresence>
        {showRulesModal && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-gradient-to-b from-[#0F1E3D] to-[#060E22] w-full max-w-md rounded-[26px] border border-amber-500/40 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.85)] max-h-[85vh] overflow-y-auto"
              id="rulesModalContent"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-black shadow-inner">
                    <Info size={16} />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    GUÍA DE CLASIFICACIÓN IPA
                  </h3>
                </div>
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
                  id="closeRulesModalBtn"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body Description */}
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed text-left" id="rulesModalBody">
                <p>
                  En inglés, las palabras se clasifican según su pronunciación usando el <strong>Alfabeto Fonético Internacional (IPA)</strong>. 
                  La clasificación principal se divide en sonidos vocálicos (vowels) y sonidos consonánticos (consonants).
                </p>

                {/* Alphabet families block */}
                <div className="bg-slate-900/80 border border-[#00FF66]/20 p-4 rounded-2xl my-2">
                  <h4 className="text-[10px] font-black text-[#00FF66] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#00FF66]" />
                    FAMILIAS DEL ABECEDARIO POR PRONUNCIACIÓN IPA:
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                    En inglés, el abecedario se clasifica según su pronunciación IPA agrupando los nombres de las letras en familias que comparten el mismo sonido vocálico o diptongo:
                  </p>
                  <div className="space-y-1.5 font-mono text-[11px] text-slate-200">
                    <div className="flex gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800">
                      <strong className="text-cyan-400 shrink-0 w-20">Grupo /eɪ/:</strong>
                      <span>A /eɪ/, H /eɪtʃ/, J /dʒeɪ/, K /keɪ/</span>
                    </div>
                    <div className="flex gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400 shrink-0 w-20">Grupo /iː/:</strong>
                      <span>B /biː/, C /siː/, D /diː/, E /iː/, G /dʒiː/, P /piː/, T /tiː/, V /viː/, Z /ziː/ <span className="text-slate-400 text-[10px]">(o /zed/ en británico)</span></span>
                    </div>
                    <div className="flex gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800">
                      <strong className="text-rose-400 shrink-0 w-20">Grupo /ɛ/:</strong>
                      <span>F /ɛf/, L /ɛl/, M /ɛm/, N /ɛn/, S /ɛs/, X /ɛks/</span>
                    </div>
                    <div className="flex gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800">
                      <strong className="text-amber-400 shrink-0 w-20">Grupo /aɪ/:</strong>
                      <span>I /aɪ/, Y /waɪ/</span>
                    </div>
                    <div className="flex gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800">
                      <strong className="text-violet-400 shrink-0 w-20">Grupo /uː/:</strong>
                      <span>Q /kjuː/, U /juː/, W /'dʌbəljuː/</span>
                    </div>
                    <div className="flex gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800">
                      <strong className="text-slate-300 shrink-0 w-20">Sonido /oʊ/:</strong>
                      <span>O /oʊ/</span>
                    </div>
                    <div className="flex gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800">
                      <strong className="text-orange-400 shrink-0 w-20">Sonido /ɑr/:</strong>
                      <span>R /ɑr/ <span className="text-slate-400 text-[10px]">(o /ɑːr/)</span></span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider border-b border-amber-500/10 pb-1 mt-2">
                  🔴 VOCALES CORTAS (Lax/Short Vowels) - Sonido Rojo/Rosa:
                </p>
                <p className="pl-3 border-l-2 border-rose-500">
                  Sonidos relajados que suelen formar palabras de una sílaba.<br />
                  • <span className="font-mono font-bold text-slate-100">/æ/</span>: Como en cat <span className="text-rose-400 font-mono">/kæt/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/ε/</span> o <span className="font-mono font-bold text-slate-100">/e/</span>: Como en bed <span className="text-rose-400 font-mono">/bɛd/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/ɪ/</span>: Como en sit <span className="text-rose-400 font-mono">/sɪt/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/ɒ/</span> o <span className="font-mono font-bold text-slate-100">/ɑ/</span>: Sonido abierto como en hot <span className="text-rose-400 font-mono">/hɑt/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/ʌ/</span>: Sonido corto como en cup <span className="text-rose-400 font-mono">/kʌp/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/ʊ/</span>: Como en put <span className="text-rose-400 font-mono">/pʊt/</span>.
                </p>

                <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider border-b border-amber-500/10 pb-1 mt-3">
                  🟢 VOCALES LARGAS (Tense/Long Vowels) - Sonido Verde:
                </p>
                <p className="pl-3 border-l-2 border-emerald-500">
                  Sonidos más tensos y prolongados de vocal única.<br />
                  • <span className="font-mono font-bold text-slate-100">/iː/</span>: Como en see <span className="text-emerald-400 font-mono">/siː/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/uː/</span>: Como en too <span className="text-emerald-400 font-mono">/tuː/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/ɑː/</span>: Como en father <span className="text-emerald-400 font-mono">/ˈfɑːðər/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/ɔː/</span>: Como en sport <span className="text-emerald-400 font-mono">/spɔːrt/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/ɜː/</span>: Como en shirt <span className="text-emerald-400 font-mono">/ʃɜːrt/</span>.
                </p>

                <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider border-b border-amber-500/10 pb-1 mt-3">
                  🔵 DIPTONGOS (Diphthongs) - Sonido Celeste/Azul:
                </p>
                <p className="pl-3 border-l-2 border-cyan-500">
                  Combinación de dos sonidos vocálicos dentro de una misma sílaba.<br />
                  • <span className="font-mono font-bold text-slate-100">/aɪ/</span>: Como en my <span className="text-cyan-400 font-mono">/maɪ/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/aʊ/</span>: Como en cow <span className="text-cyan-400 font-mono">/kaʊ/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/ɔɪ/</span>: Como en boy <span className="text-cyan-400 font-mono">/bɔɪ/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/oʊ/</span>: Como en go <span className="text-cyan-400 font-mono">/ɡoʊ/</span>.<br />
                  • <span className="font-mono font-bold text-slate-100">/eɪ/</span>: Como en say <span className="text-cyan-400 font-mono">/seɪ/</span>.
                </p>

                <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider border-b border-amber-500/10 pb-1 mt-3">
                  🟡 SCHWA (/ə/) - Sonido Amarillo:
                </p>
                <p className="pl-3 border-l-2 border-amber-500">
                  Es la vocal más común y neutra en inglés. Es un sonido suave que se usa en sílabas no acentuadas o de articulación átona.<br />
                  • Como en about <span className="text-amber-400 font-mono">/əˈbaʊt/</span> o the <span className="text-amber-400 font-mono">/ðə/</span>.
                </p>

                <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider border-b border-amber-500/10 pb-1 mt-3">
                  🟣 CONSONANTES (Consonants) - Sonido Morado:
                </p>
                <p className="pl-3 border-l-2 border-violet-500">
                  Sonidos producidos por obstrucción parcial o total del aire.<br />
                  • <strong>Oclusivas (Stops)</strong>: Sordas <span className="font-mono">/p, t, k/</span> y Sonoras <span className="font-mono">/b, d, g/</span>.<br />
                  • <strong>Fricativas (Fricatives)</strong>: Sordas <span className="font-mono">/f, θ, s, ʃ, h/</span> y Sonoras <span className="font-mono">/v, ð, z, ʒ/</span>.<br />
                  • <strong>Africadas (Affricates)</strong>: Sorda <span className="font-mono">/tʃ/</span> (chair), Sonora <span className="font-mono">/dʒ/</span> (jump).<br />
                  • <strong>Nasales (Nasals)</strong>: Sonoras <span className="font-mono">/m, n, ŋ/</span> (sing).<br />
                  • <strong>Líquidas & Aproximantes</strong>: <span className="font-mono">/l, r, w, j/</span>.
                </p>

                <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider border-b border-amber-500/10 pb-1 mt-3">
                  ⚡ ACENTO PROSÓDICO (Stress):
                </p>
                <p className="pl-3 border-l-2 border-slate-500">
                  • <strong>Acento primario ( /ˈ/ )</strong>: Se coloca justo antes de la sílaba más fuerte de la palabra (ej: about <span className="font-mono">/əˈbaʊt/</span>).<br />
                  • <strong>Acento secundario ( /ˌ/ )</strong>: Un golpe menor en palabras largas (ej: organization <span className="font-mono">/ˌɔːrɡənaɪˈzeɪʃən/</span>).
                </p>
              </div>

              {/* Close Button */}
              <div className="mt-5 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="w-full py-3 rounded-xl bg-amber-500 text-[#0B1B3D] font-black uppercase text-xs tracking-wider hover:bg-amber-400 transition-all cursor-pointer shadow-[0_4px_12px_rgba(245,158,11,0.25)]"
                  id="understandRulesBtn"
                >
                  ¡ENTENDIDO! (I UNDERSTAND)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
