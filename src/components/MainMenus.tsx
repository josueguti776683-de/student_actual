/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pencil,
  Check,
  BookOpen,
  BarChart2,
  User,
  Award,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  X,
  Timer,
  ChevronRight,
  RotateCcw,
  GraduationCap,
  Book,
  Zap
} from "lucide-react";
import { getStats, saveStats, AppStats } from "../utils/stats";
import { getMotivationForScreen } from "../utils/motivation";
import { getUnifiedDictionary } from "../utils/dictionaryHelper";

// =========================================================================
// 1. MODULES MENU (20 Modules Dashboard View)
// =========================================================================

export interface ModuleItem {
  id: number;
  code: string;
  name: string;
  desc: string;
  active: boolean;
  color?: string;
}

const ALL_MODULES: ModuleItem[] = [
  { id: 1, code: "M1", name: "NATURAL NUMBERS", desc: "Numbers 1 → 100", active: true },
  { id: 2, code: "M2", name: "ORDINAL NUMBERS", desc: "Ordinals 1st → 100th", active: true },
  { id: 3, code: "M3", name: "DAYS, MONTHS & TIME", desc: "Días, Meses y Tiempo", active: true },
  { id: 4, code: "M4", name: "COLORS", desc: "Colores", active: true },
  { id: 5, code: "M5", name: "SPORTS", desc: "Deportes", active: true },
  { id: 6, code: "M6", name: "INSTRUMENTS", desc: "Instrumentos", active: true },
  { id: 7, code: "M7", name: "PROFESSIONS", desc: "Profesiones", active: true },
  { id: 8, code: "M8", name: "FAMILY & PEOPLE", desc: "Familia y Personas", active: true },
  { id: 9, code: "M9", name: "HOUSE & HOME", desc: "Partes de la casa y útiles", active: true },
  { id: 10, code: "M10", name: "CLASSROOM", desc: "School & Subjects", active: true },
  { id: 11, code: "M11", name: "PLACES", desc: "Locations & Transport", active: true },
  { id: 12, code: "M12", name: "WEATHER", desc: "Climate & Seasons", active: true },
  { id: 13, code: "M13", name: "ANIMALS", desc: "Wildlife & Pets", active: true },
  { id: 14, code: "M14", name: "FRUITS", desc: "Fruits & Nuts", active: true },
  { id: 15, code: "M15", name: "VEGETABLES", desc: "Vegetables & Legumes", active: true },
  { id: 16, code: "M16", name: "FOOD", desc: "Food & Drinks", active: true },
  { id: 17, code: "M17", name: "TASTES & COOKING", desc: "Flavors & cooking verbs", active: true },
  { id: 18, code: "M18", name: "CLOTHING & ACCESSORIES", desc: "Clothing & garments", active: true },
  { id: 19, code: "M19", name: "BODY & ANATOMY", desc: "Body parts & anatomy", active: true },
  { id: 20, code: "M20", name: "DAILY ROUTINE & COMMANDS", desc: "Rutina diaria y comandos", active: true }
];

interface ModulesMenuProps {
  onSelectModule: (moduleId: number, wordCount?: number) => void;
}

export function ModulesMenu({ onSelectModule }: ModulesMenuProps) {
  const [selectedLockedModule, setSelectedLockedModule] = useState<ModuleItem | null>(null);
  const [stats, setStats] = useState<AppStats>(getStats());
  const [activeTab, setActiveTab] = useState<"rules" | "stats" | "user" | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showUserResetConfirm, setShowUserResetConfirm] = useState(false);
  const [show5MinSubmenu, setShow5MinSubmenu] = useState(false);
  const [showRepasoSubmenu, setShowRepasoSubmenu] = useState(false);

  // Sync with localStorage modifications across the app
  useEffect(() => {
    const handleStatsUpdate = () => {
      setStats(getStats());
    };
    window.addEventListener("stats_updated", handleStatsUpdate);
    return () => {
      window.removeEventListener("stats_updated", handleStatsUpdate);
    };
  }, []);

  // Generate a random motivational quote when activeTab changes
  const tabMotivation = useMemo(() => {
    if (!activeTab) return "";
    return getMotivationForScreen("menu", stats.userName);
  }, [activeTab, stats.userName]);

  const handleModuleClick = (module: ModuleItem) => {
    if (module.active) {
      onSelectModule(module.id);
    } else {
      setSelectedLockedModule(module);
    }
  };

  const toggleDay = (idx: number) => {
    const newDays = [...stats.practicedDays];
    newDays[idx] = !newDays[idx];
    const newStats = { ...stats, practicedDays: newDays };
    setStats(newStats);
    saveStats(newStats);
  };

  const updateModuleProgress = (moduleId: number, delta: number) => {
    const newProgress = { ...stats.moduleProgress };
    const curr = newProgress[moduleId] || 0;
    const nextVal = Math.max(0, Math.min(100, curr + delta));
    newProgress[moduleId] = nextVal;
    const newStats = { ...stats, moduleProgress: newProgress };
    setStats(newStats);
    saveStats(newStats);
  };

  const handleStartEditName = () => {
    setTempName(stats.userName || "");
    setIsEditingName(true);
  };

  const handleSaveName = (specificValue?: string) => {
    const valueToUse = specificValue !== undefined ? specificValue : tempName;
    const trimmed = valueToUse.trim();
    if (trimmed) {
      const newStats = { ...stats, userName: trimmed };
      setStats(newStats);
      saveStats(newStats);
    } else {
      // Fallback if they left it blank
      const fallback = stats.userName || "STUDENT 1";
      const newStats = { ...stats, userName: fallback };
      setStats(newStats);
      saveStats(newStats);
    }
    setIsEditingName(false);
  };

  // Calculate Average completion percent across all 20 modules
  const moduleIds = Object.keys(stats.moduleProgress).map(Number);
  const totalPercent = moduleIds.reduce((sum, id) => sum + (stats.moduleProgress[id] || 0), 0);
  const averagePercent = moduleIds.length > 0 ? Math.round(totalPercent / moduleIds.length) : 0;

  // Calculate total cups earned from modules
  const totalModuleCups = stats.moduleCups ? Object.values(stats.moduleCups).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0) : 0;

  // Generate two unique motivational quotes for the stats panel
  const statsMotivations = useMemo(() => {
    const name = stats.userName.toUpperCase() || "STUDENT 1";
    const phrases = [
      "¡Vamos, {name}! Cada error que cometes y corriges te acerca más a la fluidez absoluta.",
      "¡{name}, el éxito es la suma de pequeños esfuerzos repetidos día tras día!",
      "¡No te rindas, {name}! Equivocarse es parte del entrenamiento de tu cerebro para dominar el inglés.",
      "¡Fuerza, {name}! Recuerda que la constancia y la práctica superan al talento natural.",
      "¡{name}, cada palabra que dominas hoy es una puerta de éxito que abres para tu futuro!",
      "¡Excelente esfuerzo, {name}! El inglés no es cuestión de suerte, es cuestión de práctica constante.",
      "¡Tú puedes, {name}! Los campeones del inglés son simplemente principiantes que nunca se rindieron.",
      "¡Vamos por más, {name}! Dominar un idioma diferente te da una visión diferente del mundo.",
      "¡{name}, la persistencia en este aprendizaje convierte cualquier error de hoy en conocimiento definitivo!",
      "¡Sigue practicando, {name}! Tu disciplina de hoy es tu libertad bilingüe de mañana.",
      "¡{name}, cada paso adelante en inglés te abre nuevas oportunidades y horizontes sin límites!",
      "¡Increíble, {name}! Tu constancia demuestra que con dedicación se puede alcanzar el bilingüismo."
    ];
    
    // Select two random indexes based on the userName charcode sum
    const charCodeSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const idx1 = charCodeSum % phrases.length;
    let idx2 = (charCodeSum + 5) % phrases.length;
    if (idx1 === idx2) {
      idx2 = (idx2 + 1) % phrases.length;
    }
    
    return [
      phrases[idx1].replace(/{name}/g, name),
      phrases[idx2].replace(/{name}/g, name)
    ];
  }, [stats.userName, activeTab]);

  const handleResetStats = () => {
    const emptyProgress: { [moduleId: number]: number } = {};
    for (let i = 1; i <= 20; i++) {
      emptyProgress[i] = 0;
    }
    const resetStats: AppStats = {
      userName: stats.userName || "STUDENT 1",
      errorsCount: 0,
      cupsCount: 0,
      medalsCount: 0,
      moduleCups: {},
      moduleMedals: {},
      moduleProgress: emptyProgress,
      weeklyLearningProgress: 0,
      practicedDays: [false, false, false, false, false, false, false]
    };
    setStats(resetStats);
    saveStats(resetStats);
    setShowResetConfirm(false);
  };

  const handleResetUserModules = () => {
    const emptyProgress: { [moduleId: number]: number } = {};
    for (let i = 1; i <= 20; i++) {
      emptyProgress[i] = 0;
    }
    const resetStats: AppStats = {
      ...stats,
      cupsCount: 0,
      medalsCount: 0,
      moduleCups: {},
      moduleMedals: {},
      moduleProgress: emptyProgress
    };
    setStats(resetStats);
    saveStats(resetStats);
    setShowUserResetConfirm(false);
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent p-6 text-slate-100 select-none relative" id="modulesDashboard">
      
      {/* Header Titles */}
      <div className="flex flex-col items-center text-center mt-2 mb-4 space-y-1">
        <h1 className="text-[26px] font-black tracking-[4px] logo-font text-white html-main-title uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          STUDENT 1
        </h1>
        <div className="flex flex-col items-center">
          <h2 className="text-[17px] font-extrabold tracking-[2px] logo-font text-[#00FF66] uppercase leading-tight">
            tool of study
          </h2>
        </div>
      </div>

      {/* Dynamic Tabs Control Row (3 Dynamic Buttons) */}
      <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto w-full mb-6" id="dashboardTabsRow">
        <button
          onClick={() => setActiveTab(activeTab === "rules" ? null : "rules")}
          className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "rules"
              ? "bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.25)]"
              : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          id="tabBtnRules"
        >
          <BookOpen size={16} className={activeTab === "rules" ? "animate-pulse" : ""} />
          <span className="text-[10px] font-black tracking-wider uppercase">RULES</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === "stats" ? null : "stats")}
          className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "stats"
              ? "bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.25)]"
              : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          id="tabBtnStats"
        >
          <BarChart2 size={16} className={activeTab === "stats" ? "animate-pulse" : ""} />
          <span className="text-[10px] font-black tracking-wider uppercase">STATS</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === "user" ? null : "user")}
          className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "user"
              ? "bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.25)]"
              : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          id="tabBtnUser"
        >
          <User size={16} className={activeTab === "user" ? "animate-pulse" : ""} />
          <span className="text-[10px] font-black tracking-wider uppercase">USUARIO</span>
        </button>
      </div>

      {/* Tabs Content Area */}
      <div className="w-full max-w-md mx-auto mb-6" id="dashboardTabContentArea">
        {activeTab === "rules" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-slate-900/75 to-slate-950/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl text-left"
            id="panelRules"
          >
            <div className="flex items-center gap-2 text-[#00FF66] border-b border-slate-800 pb-2.5">
              <BookOpen size={16} />
              <h3 className="text-[12px] font-black tracking-wider uppercase">Metodología y Reglas del Sistema</h3>
            </div>
            <div className="space-y-4 text-[11px] text-slate-300 leading-relaxed max-h-[550px] overflow-y-auto pr-1.5 custom-scrollbar">
              {/* Rule 1: Objective */}
              <div className="flex gap-2.5 bg-emerald-950/15 border border-emerald-500/25 p-2.5 rounded-xl animate-pulse">
                <span className="text-[#00FF66] font-black text-xs">1.</span>
                <div>
                  <strong className="text-[#00FF66] block mb-0.5 uppercase tracking-wide">🚀 OBJETIVO DE APRENDIZAJE</strong>
                  <span>Si juegas en esta app estás aprendiendo <strong className="text-[#00FF66] font-black">{getUnifiedDictionary().length} palabras</strong> en inglés americano (lo cotidiano), así que <strong className="text-amber-400 font-extrabold uppercase">¡"NO TE RINDAS CARAJO"!</strong>.</span>
                </div>
              </div>

              {/* Rule 2: Play 1 */}
              <div className="flex gap-2.5">
                <span className="text-emerald-400 font-extrabold text-xs">2.</span>
                <div>
                  <strong className="text-white block mb-0.5 uppercase tracking-wide">🧠 PLAY 1: APRENDER Y ESCRIBIR</strong>
                  <span>En la práctica normal de escritura de módulos, debes escribir correctamente el término en <strong className="text-[#00FF66] font-bold">2 ocasiones consecutivas</strong> para memorizarlo y fijar su escritura firmemente antes de poder avanzar. Cuenta con audios y símbolos de fonética americana IPA.</span>
                </div>
              </div>

              {/* Rule 3: Play 2 */}
              <div className="flex gap-2.5">
                <span className="text-teal-400 font-extrabold text-xs">3.</span>
                <div>
                  <strong className="text-white block mb-0.5 uppercase tracking-wide">🎯 PLAY 2: OPCIÓN MÚLTIPLE</strong>
                  <span>Ejercita el reconocimiento visual rápido. Selecciona la opción en inglés adecuada entre las alternativas presentadas. Ideal para entrenar la memoria asociativa antes del examen de escritura.</span>
                </div>
              </div>

              {/* Rule 4: Play 3 */}
              <div className="flex gap-2.5">
                <span className="text-amber-400 font-extrabold text-xs">4.</span>
                <div>
                  <strong className="text-amber-400 block mb-0.5 uppercase tracking-wide">📝 PLAY 3: EXAMEN DE CONTROL (PLAY 4 EN M20)</strong>
                  <span>Una evaluación ágil de escritura para validar tu nivel y obtener <strong className="text-amber-400">Copas (🏆)</strong>. Como ya dominas los términos, solo tendrás que escribir la palabra correctamente <strong className="text-amber-400 font-bold">1 sola vez</strong> para avanzar.</span>
                </div>
              </div>

              {/* Rule 4B: Play 4 / Play 5 Pairs */}
              <div className="flex gap-2.5">
                <span className="text-[#00D9FF] font-extrabold text-xs">5.</span>
                <div>
                  <strong className="text-[#00D9FF] block mb-0.5 uppercase tracking-wide">🧩 PLAY 4 / PLAY 5: PARES (PAIRS • EMPAREJAMIENTO)</strong>
                  <span>Disponible como <strong className="text-[#00D9FF] font-bold">PLAY 4</strong> en los Módulos 1 al 19 y como <strong className="text-[#00D9FF] font-bold">PLAY 5</strong> en el Módulo 20. Empareja tarjetas en inglés y español en bloques dinámicos de 6 pares usando los mismos grupos de estudio del Play 1, con pronunciación automática y penalización de escritura (3x) en caso de error.</span>
                </div>
              </div>

              {/* Rule 5: Unified Penalty */}
              <div className="flex gap-2.5 bg-rose-950/10 border border-rose-500/20 p-2.5 rounded-xl">
                <span className="text-rose-400 font-extrabold text-xs">6.</span>
                <div>
                  <strong className="text-rose-400 block mb-0.5 uppercase tracking-wide">⚠️ ENTRENAMIENTO DE PENALIZACIÓN UNIFICADO</strong>
                  <span>Si cometes un error en PLAY 1, PLAY 2, PLAY 3 o PARES, se abrirá de inmediato la pantalla de penalización. Deberás escribir la palabra correctamente <strong className="text-rose-400 font-bold">3 veces consecutivas</strong>. Ten en cuenta que cada equivocación dentro de la penalización sumará <strong className="text-rose-400 font-black">+1 repetición extra</strong>.</span>
                </div>
              </div>

              {/* Rule 6: Dynamic Reinsertion */}
              <div className="flex gap-2.5">
                <span className="text-purple-400 font-extrabold text-xs">7.</span>
                <div>
                  <strong className="text-white block mb-0.5 uppercase tracking-wide">🔄 REINSERCIÓN DINÁMICA</strong>
                  <span>Los términos fallados en las lecciones no se eliminan al equivocarse. El sistema clona el término y lo reinserta aleatoriamente más adelante en la lección para garantizar un dominio absoluto antes de finalizar.</span>
                </div>
              </div>

              {/* Rule 7: 5 Minutes Mode */}
              <div className="flex gap-2.5">
                <span className="text-cyan-400 font-extrabold text-xs">8.</span>
                <div>
                  <strong className="text-white block mb-0.5 uppercase tracking-wide">⚡ MODO: 5 MINUTOS (SESIÓN RÁPIDA)</strong>
                  <span>Diseñado para practicar velozmente en tus ratos libres. Consta de dos modalidades: <strong className="text-[#00FF66]">ONE MORE</strong> (lección clásica con 15 palabras aleatorias) y <strong className="text-[#00D9FF]">THE PLUS ONE</strong> (sesión rápida de 9 palabras aleatorias de todo el diccionario).</span>
                </div>
              </div>

              {/* Rule 8: Repaso Rápido Mode */}
              <div className="flex gap-2.5">
                <span className="text-[#00D9FF] font-extrabold text-xs">9.</span>
                <div>
                  <strong className="text-[#00D9FF] block mb-0.5 uppercase tracking-wide">⚡ REPASO RÁPIDO (OPCIÓN MÚLTIPLE)</strong>
                  <span>Sesiones veloces de selección múltiple con <strong className="text-[#00D9FF]">ONE MORE</strong> (15 preguntas aleatorias) o <strong className="text-[#00FF66]">THE PLUS ONE</strong> (9 preguntas aleatorias de todo el diccionario). Evalúa tu velocidad de reconocimiento visual y memoria asociativa.</span>
                </div>
              </div>

              {/* Rule 9: Welcome Phonics Mode */}
              <div className="flex gap-2.5">
                <span className="text-sky-400 font-extrabold text-xs">10.</span>
                <div>
                  <strong className="text-white block mb-0.5 uppercase tracking-wide">✨ MODO WELCOME (BIENVENIDO)</strong>
                  <span>Acceso al abecedario completo interactivo en inglés americano con fonética IPA y soporte de audio letra por letra, facilitando que comprendas la articulación correcta de los fonemas desde la raíz.</span>
                </div>
              </div>

              {/* Rule 10: Read & Listen Stories */}
              <div className="flex gap-2.5">
                <span className="text-cyan-400 font-extrabold text-xs">11.</span>
                <div>
                  <strong className="text-white block mb-0.5 uppercase tracking-wide">📖 MODO LECTURA Y AUDICIÓN (READ & LISTEN)</strong>
                  <span>Practica con 13 historias interactivas de Play 1. Al final, se presenta un examen de <strong className="text-cyan-400 font-bold">12 palabras</strong>. Si te equivocas, pasas al siguiente término y pierdes uno de tus <strong className="text-rose-400 font-bold">3 candados (vidas)</strong>. Si los pierdes todos, fallas el examen y vuelves a Home.</span>
                </div>
              </div>

              {/* Rule 11: Student of Exam Ultimate Test */}
              <div className="flex gap-2.5 bg-sky-950/15 border border-sky-400/25 p-2.5 rounded-xl">
                <span className="text-sky-400 font-extrabold text-xs">12.</span>
                <div>
                  <strong className="text-sky-400 block mb-0.5 uppercase tracking-wide">🎓 STUDENT OF EXAM (LA PRUEBA DEFINITIVA)</strong>
                  <span>Evalúa tus conocimientos con 3 niveles: <strong className="text-[#FF2A85]">TEST FAST</strong> (5 palabras, 3 vidas), <strong className="text-[#00FF66]">TRUTH TEST</strong> (10 palabras, 2 vidas) y <strong className="text-[#FFD700]">FINAL EXAM</strong> (15 palabras, 1 vida). Consta de <strong className="text-white font-bold">5 fases consecutivas</strong> de evaluación:</span>
                  <ul className="list-disc pl-4 mt-1 space-y-1 text-[10.5px]">
                    <li><strong className="text-rose-400">Fase 1 (Traducción Directa)</strong>: Escribe los términos escuchados y leídos.</li>
                    <li><strong className="text-cyan-400">Fase 2 (Parejas Coincidentes)</strong>: Empareja 5, 10 o 15 tarjetas en español e inglés contra reloj.</li>
                    <li><strong className="text-amber-400">Fase 3 (Números Contextuales)</strong>: Rellena los espacios vacíos traduciendo números naturales/ordinales en oraciones contextuales reales.</li>
                    <li><strong className="text-purple-400">Fase 4 (Vocabulario en Oraciones)</strong>: Completa oraciones variadas (colores, familia, clima, profesiones, etc.).</li>
                    <li><strong className="text-emerald-400">Fase 5 (Selección Avanzada)</strong>: Preguntas de opción múltiple con distractores de alta similitud.</li>
                  </ul>
                  <span className="block mt-1.5 text-[#00FF66]">🎖️ ¡Al aprobar con éxito, recibirás un prestigioso <strong>Diploma Oficial de Certificación</strong> personalizado con tus logros y estadísticas!</span>
                </div>
              </div>

              {/* Rule 12: Rotating Dictionary */}
              <div className="flex gap-2.5">
                <span className="text-lime-400 font-extrabold text-xs">13.</span>
                <div>
                  <strong className="text-white block mb-0.5 uppercase tracking-wide">📘 DICCIONARIO INTELIGENTE ROTATIVO</strong>
                  <span>Accede a todo el vocabulario con buscador interactivo, audios en inglés americano y oraciones de ejemplo cotidianas en ambos idiomas.</span>
                  <span className="block mt-1 text-[#00FF66] font-semibold">🔄 ¡Rotación Aleatoria!: Cada vez que ingresas al diccionario o pulsas el botón "ROTAR", se selecciona una palabra aleatoria diferente para promover el descubrimiento continuo de palabras.</span>
                </div>
              </div>

              {/* Rule 13: Stats */}
              <div className="flex gap-2.5">
                <span className="text-[#00FF66] font-extrabold text-xs">14.</span>
                <div>
                  <strong className="text-[#00FF66] block mb-0.5 uppercase tracking-wide">📊 SEGUIMIENTO DE ESTADÍSTICAS (STATS)</strong>
                  <span>Tus errores, copas (🏆), medallas (🏅), progreso semanal de aprendizaje y días de práctica se registran automáticamente en tiempo real. Puedes usar el botón de <strong className="text-rose-400 font-bold">Reiniciar</strong> en STATS para restablecer de forma segura todo tu historial a cero (0).</span>
                </div>
              </div>

              {/* Rule 14: Student Profile */}
              <div className="flex gap-2.5">
                <span className="text-[#00FF66] font-extrabold text-xs">15.</span>
                <div>
                  <strong className="text-[#00FF66] block mb-0.5 uppercase tracking-wide">👤 PERFIL, PROGRESO DE MÓDULOS Y FRASES (USUARIO)</strong>
                  <span>Introduce tu nombre para personalizar dinámicamente las <strong className="text-[#00FF66] font-bold">12 frases motivacionales</strong> repartidas por la aplicación. El sistema registra tu progreso detallado en cada uno de los <strong className="text-[#00FF66] font-bold">20 módulos</strong> (de 1% a 10% por sesión de juego superada). Puedes restablecer este progreso de módulos a cero con el botón exclusivo de reinicio.</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-slate-800 text-center">
              <p className="text-[11px] italic text-[#00FF66]/90 font-semibold leading-relaxed">
                {tabMotivation}
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "stats" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-slate-900/75 to-slate-950/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl"
            id="panelStats"
          >
            <div className="flex items-center justify-between text-[#00FF66]">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} />
                <h3 className="text-[12px] font-black tracking-wider uppercase">Cuadro de Estadísticas</h3>
              </div>
              <div className="text-[8px] bg-[#00FF66]/10 text-[#00FF66] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest animate-pulse">
                LIVE STATUS
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {/* Total Words across all 20 modules - top level item */}
              <div className="bg-slate-950/50 border border-slate-850 p-2.5 sm:p-3 rounded-xl flex flex-col justify-between items-center text-center min-h-[76px] sm:min-h-[85px] shadow-sm">
                <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-tight leading-tight break-words block">Palabras Totales</span>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-[17px] sm:text-[20px] font-black text-[#00FF66] tracking-tight">{getUnifiedDictionary().length}</span>
                </div>
              </div>

              {/* Errors Counter - top level item */}
              <div className="bg-slate-950/50 border border-slate-850 p-2.5 sm:p-3 rounded-xl flex flex-col justify-between items-center text-center min-h-[76px] sm:min-h-[85px] shadow-sm">
                <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-tight leading-tight break-words block">Errores Cometidos</span>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-[17px] sm:text-[20px] font-black text-rose-500 tracking-tight">{stats.errorsCount}</span>
                </div>
              </div>

              {/* Dynamic Rewards Display - spans 2 columns on mobile, 1 column on desktop */}
              <div className="col-span-2 sm:col-span-1">
                {stats.cupsCount === 0 && stats.medalsCount === 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2 h-full">
                    <div className="bg-slate-950/50 border border-slate-850 p-2 sm:p-2.5 rounded-xl flex flex-col justify-between items-center text-center min-h-[76px] sm:min-h-[85px] shadow-sm">
                      <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-tight leading-tight block">Copas Ganadas</span>
                      <span className="text-sm sm:text-base font-black text-amber-400 flex items-center justify-center gap-1 mt-1">🏆 0</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-850 p-2 sm:p-2.5 rounded-xl flex flex-col justify-between items-center text-center min-h-[76px] sm:min-h-[85px] shadow-sm">
                      <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-tight leading-tight block">Medallas</span>
                      <span className="text-sm sm:text-base font-black text-slate-300 flex items-center justify-center gap-1 mt-1">🏅 0</span>
                    </div>
                  </div>
                ) : stats.cupsCount > 0 && stats.medalsCount === 0 ? (
                  <div className="bg-slate-950/50 border border-slate-850 p-2.5 sm:p-3 rounded-xl flex flex-col justify-between items-center text-center h-full min-h-[76px] sm:min-h-[85px] shadow-sm">
                    <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-tight leading-tight block">Copas Ganadas</span>
                    <div className="flex flex-col items-center justify-center mt-1">
                      <span className="text-sm sm:text-base font-black text-amber-400 flex items-center gap-1">
                        🏆 {stats.cupsCount}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">
                        Módulos: {totalModuleCups}
                      </span>
                    </div>
                  </div>
                ) : stats.medalsCount > 0 && stats.cupsCount === 0 ? (
                  <div className="bg-slate-950/50 border border-slate-850 p-2.5 sm:p-3 rounded-xl flex flex-col justify-between items-center text-center h-full min-h-[76px] sm:min-h-[85px] shadow-sm">
                    <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-tight leading-tight block">Medallas Ganadas</span>
                    <div className="flex flex-col items-center justify-center mt-1">
                      <span className="text-sm sm:text-base font-black text-[#50E3C2] flex items-center gap-1">
                        🏅 {stats.medalsCount}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">
                        Módulos: {stats.moduleMedals ? Object.values(stats.moduleMedals).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0) : 0}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2 h-full">
                    <div className="bg-slate-950/50 border border-slate-850 p-2 sm:p-2.5 rounded-xl flex flex-col justify-between items-center text-center min-h-[76px] sm:min-h-[85px] shadow-sm">
                      <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-tight leading-tight block">Copas</span>
                      <span className="text-xs sm:text-sm font-black text-amber-400 flex items-center justify-center gap-1 mt-1">
                        🏆 {stats.cupsCount}
                      </span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-850 p-2 sm:p-2.5 rounded-xl flex flex-col justify-between items-center text-center min-h-[76px] sm:min-h-[85px] shadow-sm">
                      <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-tight leading-tight block">Medallas</span>
                      <span className="text-xs sm:text-sm font-black text-[#50E3C2] flex items-center justify-center gap-1 mt-1">
                        🏅 {stats.medalsCount}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reset stats button and motivation phrase */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <div className="sm:col-span-1">
                {!showResetConfirm ? (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/40 text-rose-400 hover:text-rose-300 font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-rose-950"
                    id="resetStatsBtn"
                    title="Reiniciar errores, copas, medallas y progreso de módulos"
                  >
                    <RotateCcw size={12} className="text-rose-400 animate-spin-slow" />
                    Reiniciar
                  </button>
                ) : (
                  <div className="flex flex-col gap-1.5 w-full bg-rose-950/20 border border-rose-500/30 p-1.5 rounded-lg">
                    <span className="text-[8px] text-rose-400 font-black uppercase text-center animate-pulse">¿Reiniciar todo a cero?</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={handleResetStats}
                        className="flex-1 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[9px] uppercase tracking-wider rounded cursor-pointer transition-colors"
                        title="Sí, reiniciar todo a cero"
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-[9px] uppercase tracking-wider rounded cursor-pointer transition-colors"
                        title="No, mantener estadísticas"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] font-medium leading-tight text-slate-300 italic border-l-2 border-[#00FF66]/55 pl-2 text-left">
                  {statsMotivations[0]}
                </p>
              </div>
            </div>

            {/* Calendar Practice Bar */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Días de Práctica (Registro Automático)</span>
              <div className="flex items-center justify-between gap-1.5 bg-slate-950/40 p-2 rounded-xl border border-slate-850">
                {["L", "M", "M", "J", "V", "S", "D"].map((label, idx) => {
                  const isPracticed = stats.practicedDays[idx];
                  return (
                    <div
                      key={idx}
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] transition-all border ${
                        isPracticed
                          ? "bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] shadow-[0_0_8px_rgba(0,255,102,0.3)]"
                          : "bg-slate-900/60 border-slate-850 text-slate-500"
                      }`}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learning Percentage */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <span>Progreso de Aprendizaje Semanal</span>
                <span className="text-[#00FF66] text-xs font-black">{stats.weeklyLearningProgress || 0}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.weeklyLearningProgress || 0}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-[#00FF66] rounded-full shadow-[0_0_8px_rgba(0,255,102,0.4)]"
                />
              </div>
              <div className="text-[8px] text-slate-550 text-slate-400 text-right uppercase tracking-wider">
                Se reinicia automáticamente los domingos por la tarde
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-center">
              <p className="text-[11px] italic text-[#00FF66]/85 font-semibold leading-relaxed">
                {statsMotivations[1]}
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "user" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-slate-900/75 to-slate-950/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl"
            id="panelUser"
          >
            <div className="flex items-center gap-2 text-[#00FF66]">
              <User size={16} />
              <h3 className="text-[12px] font-black tracking-wider uppercase">Perfil de Usuario</h3>
            </div>

            {/* Editable student name */}
            <div className="bg-slate-950/50 border border-slate-850 p-3 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Nombre de Estudiante</span>
              {isEditingName ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveName();
                  }}
                  className="flex items-center gap-1.5"
                >
                   <input
                    type="text"
                    value={tempName}
                    placeholder="Escribe tu nombre..."
                    onChange={(e) => setTempName(e.target.value)}
                    enterKeyHint="done"
                    inputMode="text"
                    className="bg-slate-900 border border-[#00FF66]/60 rounded-lg px-2.5 py-1 text-xs text-white font-black uppercase tracking-wide focus:outline-none focus:border-[#00FF66] flex-grow"
                    autoFocus
                    maxLength={18}
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-[#00FF66] text-[#0B1B3D] rounded-lg hover:bg-white transition-all flex items-center justify-center cursor-pointer"
                    title="Guardar"
                  >
                    <Check size={13} strokeWidth={3} />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      // Prevent input blur so we don't save the blank name before cancel runs
                      e.preventDefault();
                    }}
                    onClick={() => setIsEditingName(false)}
                    className="p-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all flex items-center justify-center cursor-pointer"
                    title="Cancelar"
                  >
                    <X size={13} />
                  </button>
                </form>
              ) : (
                <div 
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={handleStartEditName}
                  title="Haz clic para editar nombre"
                >
                  <span className="text-sm font-black text-white tracking-wide uppercase group-hover:text-[#00FF66] transition-colors">
                    {stats.userName}
                  </span>
                  <button
                    className="p-1 bg-slate-900 group-hover:bg-slate-800 border border-slate-800 group-hover:border-[#00FF66]/50 text-slate-400 group-hover:text-white rounded-lg transition-all flex items-center justify-center pointer-events-none"
                  >
                    <Pencil size={11} />
                  </button>
                </div>
              )}
            </div>

            {/* Reset button for modules in Usuario tab */}
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850 flex items-center justify-between gap-3">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Módulos y Progreso:
              </span>
              <div className="w-[140px] shrink-0">
                {!showUserResetConfirm ? (
                  <button
                    onClick={() => setShowUserResetConfirm(true)}
                    className="w-full py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/40 text-rose-400 hover:text-rose-300 font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="Reiniciar todos los módulos a cero"
                  >
                    <RotateCcw size={10} className="text-rose-400 animate-spin-slow" />
                    Reiniciar
                  </button>
                ) : (
                  <div className="flex gap-1 bg-rose-950/20 border border-rose-500/30 p-1 rounded-lg w-full justify-between items-center">
                    <span className="text-[7.5px] text-rose-400 font-black uppercase text-center animate-pulse mr-1">¿Reiniciar?</span>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={handleResetUserModules}
                        className="py-0.5 px-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[8px] uppercase tracking-wider rounded cursor-pointer transition-colors"
                        title="Sí, reiniciar"
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setShowUserResetConfirm(false)}
                        className="py-0.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-[8px] uppercase tracking-wider rounded cursor-pointer transition-colors"
                        title="No, cancelar"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Module List */}
            <div className="space-y-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Progreso por Módulo (Registro Automático)</span>
              
              <div className="max-h-[385px] overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                {ALL_MODULES.map((module) => {
                  const progress = stats.moduleProgress[module.id] || 0;
                  const displayPercent = progress > 0 ? Math.max(1, Math.min(10, Math.round(progress / 10))) : 0;
                  return (
                    <div 
                      key={module.id}
                      className="bg-slate-950/40 border border-slate-850 p-2.5 rounded-xl flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-white truncate max-w-[170px]">
                          {module.code} — {module.name}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] text-[#00FF66] font-black tracking-wider bg-[#00FF66]/10 px-1.5 py-0.5 rounded">
                            {displayPercent}% aprendido
                          </span>
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            🏆 {stats.moduleCups?.[module.id] || 0}
                          </span>
                          {(stats.moduleMedals?.[module.id] || 0) > 0 && (
                            <span className="text-[10px] font-bold text-slate-300 bg-slate-300/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              🏅 {stats.moduleMedals?.[module.id]}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Range visualization */}
                      <div className="flex items-center gap-3">
                        <div className="flex-grow h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#00FF66] rounded-full" 
                            style={{ width: `${displayPercent * 10}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Motivational phrase at the very bottom of the scrollable area */}
                <div className="pt-4 pb-2 px-2 text-center border-t border-slate-850/60 mt-3 animate-fade-in">
                  <p className="text-[10px] italic font-semibold text-[#00FF66]/90 leading-relaxed max-w-[280px] mx-auto">
                    {statsMotivations[1]}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 5 Minutes Mode Card / Button */}
      <div className="w-full max-w-md mx-auto mb-4" id="modo5MinutosContainer">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 255, 102, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShow5MinSubmenu(prev => !prev)}
          className="w-full py-4 px-6 rounded-2xl border-2 border-[#00FF66] bg-gradient-to-r from-[#00FF66]/20 to-slate-900/60 text-white flex items-center justify-between shadow-[0_0_15px_rgba(0,255,102,0.2)] cursor-pointer transition-all relative overflow-hidden group"
          id="btnModo5Minutos"
        >
          <div className="absolute inset-0 bg-[#00FF66]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00FF66] text-[#0B1B3D] flex items-center justify-center font-black animate-pulse shadow-[0_0_10px_rgba(0,255,102,0.5)]">
              <Timer size={20} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h4 className="text-[14px] font-black tracking-[1.5px] text-[#00FF66] uppercase">
                MODO: 5 MINUTOS
              </h4>
              <p className="text-[10px] font-bold text-slate-300 tracking-wide uppercase">
                {show5MinSubmenu ? "SELECCIONA UNA OPCIÓN:" : "Elige tu opción de aprendizaje"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#00FF66] font-black text-xs uppercase tracking-wider bg-[#00FF66]/10 px-2.5 py-1 rounded-lg">
            <span>{show5MinSubmenu ? "CERRAR" : "VER"}</span>
            <motion.div
              animate={{ rotate: show5MinSubmenu ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={14} strokeWidth={3} />
            </motion.div>
          </div>
        </motion.button>

        {show5MinSubmenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-[#00FF66]/30 shadow-lg"
            id="modo5MinutosSubmenu"
          >
            {/* OPTION 1: ONE MORE */}
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 0 15px rgba(0, 255, 102, 0.4)" }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectModule(999, 15)}
              className="w-full py-3 px-5 rounded-xl border border-[#00FF66]/50 bg-gradient-to-r from-[#00FF66]/15 to-transparent hover:border-[#00FF66] text-white flex items-center justify-between cursor-pointer transition-all"
              id="btnOneMore"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#00FF66] text-[#0B1B3D] flex items-center justify-center font-extrabold text-xs">
                  15
                </div>
                <div className="text-left">
                  <span className="text-[13px] font-black tracking-wide text-white block uppercase">
                    ONE MORE
                  </span>
                  <span className="text-[10px] font-medium text-slate-300">
                    Modo clásico • 15 palabras aleatorias
                  </span>
                </div>
              </div>
              <span className="text-[#00FF66] font-black text-sm">➔</span>
            </motion.button>

            {/* OPTION 2: THE PLUS ONE */}
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 0 15px rgba(0, 217, 255, 0.4)" }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectModule(999, 9)}
              className="w-full py-3 px-5 rounded-xl border border-[#00D9FF]/50 bg-gradient-to-r from-[#00D9FF]/15 to-transparent hover:border-[#00D9FF] text-white flex items-center justify-between cursor-pointer transition-all"
              id="btnThePlusOne"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#00D9FF] text-[#0B1B3D] flex items-center justify-center font-extrabold text-xs">
                  9
                </div>
                <div className="text-left">
                  <span className="text-[13px] font-black tracking-wide text-white block uppercase">
                    THE PLUS ONE
                  </span>
                  <span className="text-[10px] font-medium text-slate-300">
                    Modo rápido • 9 palabras aleatorias
                  </span>
                </div>
              </div>
              <span className="text-[#00D9FF] font-black text-sm">➔</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Welcome Mode Card / Button */}
      <div className="w-full max-w-md mx-auto mb-4" id="welcomeModeContainer">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectModule(998)}
          className="w-full py-4 px-6 rounded-2xl border-2 border-sky-400 bg-gradient-to-r from-sky-500/20 to-slate-900/60 text-white flex items-center justify-between shadow-[0_0_15px_rgba(56,189,248,0.2)] cursor-pointer transition-all relative overflow-hidden group"
          id="btnModoWelcome"
        >
          <div className="absolute inset-0 bg-sky-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-400 text-[#0B1B3D] flex items-center justify-center font-black animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.5)]">
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h4 className="text-[14px] font-black tracking-[1.5px] text-sky-400 uppercase">
                WELCOME (BIENVENIDO)
              </h4>
              <p className="text-[10px] font-bold text-slate-300 tracking-wide uppercase">
                Abecedario completo • Fonética IPA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sky-400 font-black text-xs uppercase tracking-wider bg-sky-500/10 px-2.5 py-1 rounded-lg">
            <span>¡ENTRAR!</span>
            <ChevronRight size={14} strokeWidth={3} />
          </div>
        </motion.button>
      </div>

      {/* Dictionary Mode Card / Button (Debajo de Welcome, contorno verde) */}
      <div className="w-full max-w-md mx-auto mb-6" id="dictionaryModeContainer">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 255, 102, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectModule(995)}
          className="w-full py-4 px-6 rounded-2xl border-2 border-[#00FF66] bg-gradient-to-r from-[#00FF66]/20 to-slate-900/60 text-white flex items-center justify-between shadow-[0_0_15px_rgba(0,255,102,0.2)] cursor-pointer transition-all relative overflow-hidden group"
          id="btnModoDiccionario"
        >
          <div className="absolute inset-0 bg-[#00FF66]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00FF66] text-[#0B1B3D] flex items-center justify-center font-black animate-pulse shadow-[0_0_10px_rgba(0,255,102,0.5)]">
              <Book size={20} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h4 className="text-[14px] font-black tracking-[1.5px] text-[#00FF66] uppercase">
                DICCIONARIO (DICTIONARY)
              </h4>
              <p className="text-[10px] font-bold text-slate-300 tracking-wide uppercase">
                Vocabulario total • {getUnifiedDictionary().length} palabras • Pronunciación
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#00FF66] font-black text-xs uppercase tracking-wider bg-[#00FF66]/10 px-2.5 py-1 rounded-lg">
            <span>¡APRENDER!</span>
            <ChevronRight size={14} strokeWidth={3} />
          </div>
        </motion.button>
      </div>

      {/* Repaso Rápido Mode Card / Button (Debajo de Diccionario, estilo idéntico con opción múltiple) */}
      <div className="w-full max-w-md mx-auto mb-6" id="repasoRapidoModeContainer">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 217, 255, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowRepasoSubmenu(prev => !prev)}
          className="w-full py-4 px-6 rounded-2xl border-2 border-[#00D9FF] bg-gradient-to-r from-[#00D9FF]/20 to-slate-900/60 text-white flex items-center justify-between shadow-[0_0_15px_rgba(0,217,255,0.2)] cursor-pointer transition-all relative overflow-hidden group"
          id="btnModoRepasoRapido"
        >
          <div className="absolute inset-0 bg-[#00D9FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D9FF] text-[#0B1B3D] flex items-center justify-center font-black animate-pulse shadow-[0_0_10px_rgba(0,217,255,0.5)]">
              <Zap size={20} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h4 className="text-[14px] font-black tracking-[1.5px] text-[#00D9FF] uppercase">
                REPASO RÁPIDO
              </h4>
              <p className="text-[10px] font-bold text-slate-300 tracking-wide uppercase">
                {showRepasoSubmenu ? "SELECCIONA UNA OPCIÓN:" : "Opción múltiple • Preguntas aleatorias"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#00D9FF] font-black text-xs uppercase tracking-wider bg-[#00D9FF]/10 px-2.5 py-1 rounded-lg">
            <span>{showRepasoSubmenu ? "CERRAR" : "VER"}</span>
            <motion.div
              animate={{ rotate: showRepasoSubmenu ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={14} strokeWidth={3} />
            </motion.div>
          </div>
        </motion.button>

        {showRepasoSubmenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-[#00D9FF]/30 shadow-lg"
            id="repasoRapidoSubmenu"
          >
            {/* OPTION 1: ONE MORE (15 Preguntas) */}
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 0 15px rgba(0, 217, 255, 0.4)" }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectModule(994, 15)}
              className="w-full py-3 px-5 rounded-xl border border-[#00D9FF]/50 bg-gradient-to-r from-[#00D9FF]/15 to-transparent hover:border-[#00D9FF] text-white flex items-center justify-between cursor-pointer transition-all"
              id="btnRepasoOneMore"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#00D9FF] text-[#0B1B3D] flex items-center justify-center font-extrabold text-xs">
                  15
                </div>
                <div className="text-left">
                  <span className="text-[13px] font-black tracking-wide text-white block uppercase">
                    ONE MORE
                  </span>
                  <span className="text-[10px] font-medium text-slate-300">
                    Modo clásico • 15 preguntas de opción múltiple
                  </span>
                </div>
              </div>
              <span className="text-[#00D9FF] font-black text-sm">➔</span>
            </motion.button>

            {/* OPTION 2: THE PLUS ONE (9 Preguntas) */}
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 0 15px rgba(0, 255, 102, 0.4)" }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectModule(994, 9)}
              className="w-full py-3 px-5 rounded-xl border border-[#00FF66]/50 bg-gradient-to-r from-[#00FF66]/15 to-transparent hover:border-[#00FF66] text-white flex items-center justify-between cursor-pointer transition-all"
              id="btnRepasoThePlusOne"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#00FF66] text-[#0B1B3D] flex items-center justify-center font-extrabold text-xs">
                  9
                </div>
                <div className="text-left">
                  <span className="text-[13px] font-black tracking-wide text-white block uppercase">
                    THE PLUS ONE
                  </span>
                  <span className="text-[10px] font-medium text-slate-300">
                    Modo rápido • 9 preguntas de opción múltiple
                  </span>
                </div>
              </div>
              <span className="text-[#00FF66] font-black text-sm">➔</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Modules List Grid */}
      <div className="flex-grow my-3 space-y-3 pr-1" id="modulesListGrid">
        <p className="text-[10px] font-extrabold text-[#00FF66]/70 uppercase tracking-[2px] text-center mb-1">
          Select Module • Selecciona un Módulo
        </p>

        {ALL_MODULES.map((module) => {
          return (
            <motion.button
              key={module.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleModuleClick(module)}
              className={`w-full py-[16px] px-5 rounded-[18px] transition-all flex items-center justify-between text-left border relative ${
                module.active
                  ? "border-[#00FF66]/50 bg-gradient-to-r from-[#00FF66]/15 to-transparent hover:border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]"
                  : "border-slate-800 bg-slate-900/40 opacity-50 cursor-pointer"
              }`}
              id={`module-btn-${module.id}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                  module.active ? "bg-[#00FF66] text-[#0B1B3D]" : "bg-slate-800 text-slate-500"
                }`}>
                  {module.id}
                </div>
                <div>
                  <div className="text-[14px] font-black tracking-wide text-white uppercase flex items-center flex-wrap gap-2">
                    {module.code} — {module.name}
                    {module.active && (
                      <span className="text-[8px] bg-[#00FF66] text-[#0B1B3D] px-1.5 py-0.5 rounded-full font-bold">
                        ACTIVE
                      </span>
                    )}
                    {(stats.moduleCups?.[module.id] || 0) > 0 && (
                      <span className="text-[10px] font-extrabold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded flex items-center gap-1 shadow-inner">
                        🏆 {stats.moduleCups?.[module.id]}
                      </span>
                    )}
                    {(stats.moduleMedals?.[module.id] || 0) > 0 && (
                      <span className="text-[10px] font-extrabold text-[#50E3C2] bg-[#50E3C2]/10 px-1.5 py-0.5 rounded flex items-center gap-1 shadow-inner">
                        🏅 {stats.moduleMedals?.[module.id]}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-slate-450 text-slate-350 opacity-80">
                    {module.desc}
                  </div>
                </div>
              </div>

              <div>
                {module.active ? (
                  <span className="text-xl text-[#00FF66]">➔</span>
                ) : (
                  <span className="text-md text-slate-600">🔒</span>
                )}
              </div>
            </motion.button>
          );
        })}

        {/* New Special Module: practice READ AND LISTEN */}
        <motion.button
          whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0, 217, 255, 0.35)" }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelectModule(997)}
          className="w-full py-[16px] px-5 rounded-[18px] transition-all flex items-center justify-between text-left border border-[#00D9FF]/50 bg-gradient-to-r from-[#00D9FF]/15 to-transparent hover:border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.15)] cursor-pointer"
          id="practiceReadListenBtn"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00D9FF] text-[#0B1B3D] font-black shrink-0">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="text-[14px] font-black tracking-wide text-white uppercase flex items-center gap-2">
                PRACTICE READ & LISTEN
                <span className="text-[8px] bg-[#00D9FF] text-[#0B1B3D] px-1.5 py-0.5 rounded-full font-bold">
                  SPECIAL
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-350 opacity-85 leading-tight">
                Práctica de Leer y Escuchar • 13 Historias del Play 1
              </div>
            </div>
          </div>

          <div>
            <span className="text-xl text-[#00D9FF]">➔</span>
          </div>
        </motion.button>

        {/* STUDENT OF EXAM (Examen del Estudiante) */}
        <motion.button
          whileHover={{ scale: 1.01, boxShadow: "0 0 25px rgba(255, 42, 133, 0.4)" }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelectModule(996)}
          className="w-full py-[16px] px-5 rounded-[18px] transition-all flex items-center justify-between text-left border border-[#FF2A85]/50 bg-gradient-to-r from-[#FF2A85]/15 to-transparent hover:border-[#FF2A85] shadow-[0_0_15px_rgba(255,42,133,0.15)] cursor-pointer mt-3"
          id="studentOfExamBtn"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FF2A85] text-[#0B1B3D] font-black shrink-0">
              <GraduationCap size={18} />
            </div>
            <div>
              <div className="text-[14px] font-black tracking-wide text-white uppercase flex items-center gap-2">
                STUDENT OF EXAM
                <span className="text-[8px] bg-[#FF2A85] text-[#0B1B3D] px-1.5 py-0.5 rounded-full font-bold">
                  EXAM
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-350 opacity-85 leading-tight">
                Prueba definitiva • 3 Niveles: Test Fast, Truth Test y Final Exam
              </div>
            </div>
          </div>

          <div>
            <span className="text-xl text-[#FF2A85]">➔</span>
          </div>
        </motion.button>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[9px] text-slate-600 pt-3 border-t border-slate-800/40 tracking-widest uppercase mt-auto">
        STUDENT 1 • ENGLISH STUDY TOOL
      </div>

      {/* Coming Soon Popups */}
      <AnimatePresence>
        {selectedLockedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 z-[2000] flex items-center justify-center p-6 backdrop-blur-xs"
            onClick={() => setSelectedLockedModule(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gradient-to-b from-[#111e3b] to-[#070e20] p-6 rounded-[24px] max-w-xs text-center border-2 border-slate-700/60 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-lg font-black text-white tracking-widest uppercase mb-1">
                {selectedLockedModule.code} Locked
              </h3>
              <p className="text-[#00FF66] font-bold text-xs tracking-wider uppercase mb-3">
                {selectedLockedModule.name}
              </p>
              <p className="text-slate-300 text-[12px] leading-relaxed mb-5">
                Módulo en preparación. Actualmente nos enfocamos estratégicamente en los módulos clave de números (Naturales y Ordinales). ¡Completa M1 y M2 para perfeccionar tu base!
              </p>

              <button
                onClick={() => setSelectedLockedModule(null)}
                className="w-full bg-[#00FF66] hover:bg-[#00cc52] text-[#0b1b3d] py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                ENTENDIDO
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================================
// 2. INNER MODULE MAIN MENU (Play 1, Play 2, Play 3 launcher)
// =========================================================================

interface MainMenuProps {
  onSelectPlay: (playMode: "SUBPLAY1" | "SUBPLAY2" | "SUBPLAY3" | "SUBPLAY4" | "SUBPLAY3_ROUTAINE" | "SUBPLAY4_ROUTAINE" | "SUBPLAY5_ROUTAINE") => void;
  onBackToModules: () => void;
  displayTitle: string;  // e.g. "NATURAL NUMBERS" or "ORDINAL NUMBERS"
  displaySubtitle: string; // e.g. "1 AL 100" or "1st → 100th"
  isRoutine?: boolean;
  showPlay4?: boolean;
}

export function MainMenu({ onSelectPlay, onBackToModules, displayTitle, displaySubtitle, isRoutine, showPlay4 }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-full py-8 px-6 text-slate-100 bg-transparent" id="menuPrincipal">
      
      {/* HOME / BACK TO MODULES Button - top center matching visual aesthetic bar */}
      <div className="w-full flex justify-end" id="homeBarContainer">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToModules}
          className="px-6 py-2 bg-[#00FF66]/10 border border-[#00FF66]/50 rounded-full text-[11px] font-black tracking-[2px] text-[#00FF66] transition-all shadow-[0_2px_10px_rgba(0,255,102,0.15)] uppercase cursor-pointer flex items-center gap-1.5"
          id="homeBtnMainMenu"
        >
          🏠 HOME
        </motion.button>
      </div>

      {/* Header Titles */}
      <div className="flex flex-col items-center text-center mt-2 mb-6 space-y-2">
        <h1 className="text-[20px] font-extrabold tracking-[3px] logo-font text-white html-main-title uppercase">
          {displayTitle}
        </h1>
        <h2 className={`text-[30px] font-black tracking-[4px] logo-font html-sub-title uppercase ${isRoutine ? "text-[#00D9FF] drop-shadow-[0_0_15px_rgba(0,217,255,0.6)]" : "text-[#00FF66] drop-shadow-[0_0_15px_rgba(0,255,102,0.6)]"}`}>
          {displaySubtitle}
        </h2>
      </div>

      {/* Primary Play Launcher Buttons */}
      <div className="w-full space-y-4 max-w-sm mt-4 my-auto">
        {isRoutine ? (
          <>
            {/* PLAY 1 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPlay("SUBPLAY1")}
              className="w-full h-15 relative overflow-hidden rounded-[18px] transition-all cursor-pointer flex flex-col justify-center items-center group html-level-btn-green level-btn"
              id="mainMenuPlay1Btn"
            >
              <span className="text-md font-extrabold font-sans text-white tracking-widest group-hover:text-[#00FF66] transition-colors uppercase">
                PLAY 1
              </span>
              <span className="text-[10px] font-bold text-white/90 mt-0.5 uppercase tracking-widest">
                learn & write
              </span>
            </motion.button>

            {/* PLAY 2 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPlay("SUBPLAY2")}
              className="w-full h-15 relative overflow-hidden rounded-[18px] transition-all cursor-pointer flex flex-col justify-center items-center group html-level-btn-green level-btn"
              id="mainMenuPlay2Btn"
            >
              <span className="text-md font-extrabold font-sans text-white tracking-widest group-hover:text-[#00FF66] transition-colors uppercase">
                PLAY 2
              </span>
              <span className="text-[10px] font-bold text-white/90 mt-0.5 uppercase tracking-widest">
                Multiple Choice
              </span>
            </motion.button>

            {/* PLAY 3 (Routine Phrases) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPlay("SUBPLAY3_ROUTAINE")}
              className="w-full h-15 relative overflow-hidden rounded-[18px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn"
              id="mainMenuPlay3Btn"
              style={{
                border: "1px solid rgba(0, 217, 255, 0.45)",
                background: "rgba(0, 217, 255, 0.08)",
                boxShadow: "0 0 10px rgba(0, 217, 255, 0.15)",
              }}
            >
              <span className="text-md font-extrabold font-sans text-white tracking-widest group-hover:text-[#00D9FF] transition-colors uppercase">
                PLAY 3
              </span>
              <span className="text-[10px] font-bold text-[#00D9FF] mt-0.5 uppercase tracking-widest">
                Routine Phrases
              </span>
            </motion.button>

            {/* PLAY 4 (Exam) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPlay("SUBPLAY5_ROUTAINE")}
              className="w-full h-15 relative overflow-hidden rounded-[18px] transition-all cursor-pointer flex flex-col justify-center items-center group html-level-btn-pink level-btn"
              id="mainMenuPlay4Btn"
            >
              <span className="text-md font-extrabold font-sans text-white tracking-widest group-hover:text-rose-400 transition-colors uppercase">
                PLAY 4
              </span>
              <span className="text-[10px] font-bold text-white/90 mt-0.5 uppercase tracking-widest">
                Exam
              </span>
            </motion.button>

            {/* PLAY 5 (Pairs - Routine) */}
            {showPlay4 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPlay("SUBPLAY4")}
                className="w-full h-15 relative overflow-hidden rounded-[18px] transition-all cursor-pointer flex flex-col justify-center items-center group html-level-btn-blue level-btn"
                id="mainMenuPlay5PairsBtn"
              >
                <span className="text-md font-extrabold font-sans text-white tracking-widest group-hover:text-[#00D9FF] transition-colors uppercase">
                  PLAY 5
                </span>
                <span className="text-[10px] font-bold text-white/90 mt-0.5 uppercase tracking-widest">
                  Pairs • Pares
                </span>
              </motion.button>
            )}
          </>
        ) : (
          <>
            {/* PLAY 1 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPlay("SUBPLAY1")}
              className="w-full h-24 relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group html-level-btn-green level-btn"
              id="mainMenuPlay1Btn"
            >
              <span className="text-xl font-extrabold font-sans text-white tracking-widest group-hover:text-[#00FF66] transition-colors uppercase">
                PLAY 1
              </span>
              <span className="text-xs font-bold text-white/90 mt-1 uppercase tracking-widest">
                learn & write
              </span>
            </motion.button>

            {/* PLAY 2 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPlay("SUBPLAY2")}
              className="w-full h-24 relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group html-level-btn-green level-btn"
              id="mainMenuPlay2Btn"
            >
              <span className="text-xl font-extrabold font-sans text-white tracking-widest group-hover:text-[#00FF66] transition-colors uppercase">
                PLAY 2
              </span>
              <span className="text-xs font-bold text-white/90 mt-1 uppercase tracking-widest">
                Multiple Choice
              </span>
            </motion.button>

            {/* PLAY 3 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPlay("SUBPLAY3")}
              className="w-full h-24 relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group html-level-btn-pink level-btn"
              id="mainMenuPlay3Btn"
            >
              <span className="text-xl font-extrabold font-sans text-white tracking-widest group-hover:text-rose-400 transition-colors uppercase">
                PLAY 3
              </span>
              <span className="text-xs font-bold text-white/90 mt-1 uppercase tracking-widest">
                Exam
              </span>
            </motion.button>

            {/* PLAY 4 (Pairs - enabled for Module 1) */}
            {showPlay4 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPlay("SUBPLAY4")}
                className="w-full h-24 relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group html-level-btn-blue level-btn"
                id="mainMenuPlay4PairsBtn"
              >
                <span className="text-xl font-extrabold font-sans text-white tracking-widest group-hover:text-[#00D9FF] transition-colors uppercase">
                  PLAY 4
                </span>
                <span className="text-xs font-bold text-white/90 mt-1 uppercase tracking-widest">
                  Pairs • Pares
                </span>
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* Footer Branding info */}
      <div className="text-center text-[10px] text-slate-650 mt-auto pt-6 tracking-widest uppercase text-slate-500">
        STUDENT 1 • ENGLISH LEARNING HUB
      </div>
    </div>
  );
}

// =========================================================================
// SUBPLAY3_ROUTAINE Menu (Sentences 30 / Sentences 80 Selection)
// =========================================================================
interface Subplay3RoutineMenuProps {
  onBack: () => void;
  onSelectMode: (mode: "play3_30" | "play3_80" | "play3_80_p1" | "play3_80_p2") => void;
}

export function Subplay3RoutineMenu({ onBack, onSelectMode }: Subplay3RoutineMenuProps) {
  const [showPartMenu, setShowPartMenu] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-between min-h-full py-8 px-6 text-slate-100 bg-transparent" id="submenuPlay3Routine">
      <div className="w-full flex flex-col items-center mt-4 mb-2 max-w-sm relative">
        <h1 className="text-[21px] font-extrabold tracking-[3px] text-white html-main-title uppercase leading-tight logo-font text-center">
          PLAY 3 — ROUTINE PHRASES
        </h1>
        <h2 className="text-[27px] font-black tracking-[4px] text-[#00D9FF] html-sub-title uppercase leading-none mt-2 logo-font text-center drop-shadow-[0_0_15px_rgba(0,217,255,0.6)]">
          SENTENCES TRANSLATION
        </h2>
        
        <div className="w-full flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={showPartMenu ? () => setShowPartMenu(false) : onBack}
            className="px-5 py-2 border border-[#00D9FF]/40 bg-[#07122E] rounded-full text-[12px] font-bold tracking-[2px] text-[#00D9FF] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,217,255,0.15)] uppercase whitespace-nowrap"
            id="play3RoutineBackBtn"
          >
            ← BACK
          </motion.button>
        </div>
      </div>

      <div className="w-full space-y-[18px] my-auto max-w-sm">
        {!showPartMenu ? (
          <>
            {/* SENTENCES 30 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMode("play3_30")}
              className="w-full py-[25px] px-[30px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn"
              style={{
                border: "1px solid rgba(0, 217, 255, 0.4)",
                background: "linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(14,31,66,0.8) 100%)",
              }}
              id="play3Sentences30Btn"
            >
              <span className="text-[21px] font-black text-white tracking-widest uppercase transition-colors group-hover:text-[#00D9FF]">
                SENTENCES 30
              </span>
              <span className="text-[12px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center leading-relaxed">
                Translate 30 Daily Routine sentences featuring Esther, Rebeca, Noelia, Maribel & Sanery
              </span>
            </motion.button>

            {/* SENTENCES 80 (Launches Submenu) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPartMenu(true)}
              className="w-full py-[25px] px-[30px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn"
              style={{
                border: "1px solid rgba(0, 217, 255, 0.4)",
                background: "linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(14,31,66,0.8) 100%)",
              }}
              id="play3Sentences80Btn"
            >
              <span className="text-[21px] font-black text-white tracking-widest uppercase transition-colors group-hover:text-[#00D9FF]">
                SENTENCES 80
              </span>
              <span className="text-[12px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center leading-relaxed">
                Extended translation challenge featuring 80 complex sentences with systematic reviews
              </span>
            </motion.button>
          </>
        ) : (
          <>
            <p className="text-[10px] font-extrabold text-[#00D9FF]/70 uppercase tracking-[2px] text-center mb-1">
              Select Part • Selecciona una Parte
            </p>

            {/* PART 1: 1 - 40 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMode("play3_80_p1")}
              className="w-full py-4 px-6 relative overflow-hidden rounded-[18px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn"
              style={{
                border: "1px solid rgba(0, 217, 255, 0.4)",
                background: "linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(14,31,66,0.8) 100%)",
              }}
              id="play3Sentences80P1Btn"
            >
              <span className="text-lg font-black text-white tracking-widest uppercase transition-colors group-hover:text-[#00D9FF]">
                PART 1 (1 - 40)
              </span>
              <span className="text-[11px] font-semibold text-white/80 mt-0.5 tracking-wide text-center leading-relaxed">
                Translate first half of the extended routine challenge
              </span>
            </motion.button>

            {/* PART 2: 41 - 80 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMode("play3_80_p2")}
              className="w-full py-4 px-6 relative overflow-hidden rounded-[18px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn"
              style={{
                border: "1px solid rgba(0, 217, 255, 0.4)",
                background: "linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(14,31,66,0.8) 100%)",
              }}
              id="play3Sentences80P2Btn"
            >
              <span className="text-lg font-black text-white tracking-widest uppercase transition-colors group-hover:text-[#00D9FF]">
                PART 2 (41 - 80)
              </span>
              <span className="text-[11px] font-semibold text-white/80 mt-0.5 tracking-wide text-center leading-relaxed">
                Translate second half of the extended routine challenge
              </span>
            </motion.button>

            {/* ALL 80 SENTENCES */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMode("play3_80")}
              className="w-full py-3 px-6 relative overflow-hidden rounded-[18px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn opacity-90 hover:opacity-100"
              style={{
                border: "1px solid rgba(0, 217, 255, 0.25)",
                background: "linear-gradient(135deg, rgba(0,217,255,0.05) 0%, rgba(14,31,66,0.6) 100%)",
              }}
              id="play3Sentences80FullBtn"
            >
              <span className="text-[15px] font-bold text-white/90 tracking-widest uppercase transition-colors group-hover:text-[#00D9FF]">
                ALL 80 SENTENCES
              </span>
              <span className="text-[10px] font-medium text-white/60 mt-0.5 tracking-wide text-center">
                Complete 80-sentence challenge in a single run
              </span>
            </motion.button>
          </>
        )}
      </div>

      <div className="text-center font-mono text-[9px] text-slate-600 mt-auto pt-6 tracking-widest uppercase">
        ROUTAINE PLAY 3 • STUDY TOOL
      </div>
    </div>
  );
}

// =========================================================================
// SUBPLAY4_ROUTAINE Menu (Vocab V1 / V2 Selection)
// =========================================================================
interface Subplay4RoutineMenuProps {
  onBack: () => void;
  onSelectMode: (mode: "play4_v1" | "play4_v2") => void;
}

export function Subplay4RoutineMenu({ onBack, onSelectMode }: Subplay4RoutineMenuProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-full py-8 px-6 text-slate-100 bg-transparent" id="submenuPlay4Routine">
      <div className="w-full flex flex-col items-center mt-4 mb-2 max-w-sm relative">
        <h1 className="text-[21px] font-extrabold tracking-[3px] text-white html-main-title uppercase leading-tight logo-font text-center">
          PLAY 4 — ROUTINE VOCAB
        </h1>
        <h2 className="text-[27px] font-black tracking-[4px] text-[#00D9FF] html-sub-title uppercase leading-none mt-2 logo-font text-center drop-shadow-[0_0_15px_rgba(0,217,255,0.6)]">
          VOCABULARY MULTIPLE CHOICE
        </h2>
        
        <div className="w-full flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-5 py-2 border border-[#00D9FF]/40 bg-[#07122E] rounded-full text-[12px] font-bold tracking-[2px] text-[#00D9FF] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,217,255,0.15)] uppercase whitespace-nowrap"
            id="play4RoutineBackBtn"
          >
            ← BACK
          </motion.button>
        </div>
      </div>

      <div className="w-full space-y-[18px] my-auto max-w-sm">
        {/* VOCABULARY V1 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode("play4_v1")}
          className="w-full py-[25px] px-[30px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn"
          style={{
            border: "1px solid rgba(0, 217, 255, 0.4)",
            background: "linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(14,31,66,0.8) 100%)",
          }}
          id="play4VocabV1Btn"
        >
          <span className="text-[21px] font-black text-white tracking-widest uppercase transition-colors group-hover:text-[#00D9FF]">
            VOCABULARY 1
          </span>
          <span className="text-[12px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center">
            Translate English to Spanish in original list order (80 words)
          </span>
        </motion.button>

        {/* VOCABULARY V2 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode("play4_v2")}
          className="w-full py-[25px] px-[30px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn"
          style={{
            border: "1px solid rgba(0, 217, 255, 0.4)",
            background: "linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(14,31,66,0.8) 100%)",
          }}
          id="play4VocabV2Btn"
        >
          <span className="text-[21px] font-black text-white tracking-widest uppercase transition-colors group-hover:text-[#00D9FF]">
            VOCABULARY 2
          </span>
          <span className="text-[12px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center">
            Translate Spanish to English in completely randomized order (80 words)
          </span>
        </motion.button>
      </div>

      <div className="text-center font-mono text-[9px] text-slate-600 mt-auto pt-6 tracking-widest uppercase">
        ROUTAINE PLAY 4 • STUDY TOOL
      </div>
    </div>
  );
}

// =========================================================================
// 3. SUBMENU PLAY 1 (Learning Group Selection)
// =========================================================================

interface SubmenuPlay1Props {
  onBack: () => void;
  onSelectGroup: (groupKey: "group1" | "group2" | "group3" | "group4" | "group5") => void;
  isOrdinal: boolean;
  isCalendar?: boolean;
  isColor?: boolean;
  isSport?: boolean;
  isInstrument?: boolean;
  isProfession?: boolean;
  isFamily?: boolean;
  isHouse?: boolean;
  isClassroom?: boolean;
  isPlaces?: boolean;
  isWeather?: boolean;
  isAnimals?: boolean;
  isFruits?: boolean;
  isVegetables?: boolean;
  isFood?: boolean;
  isTastes?: boolean;
  isClothing?: boolean;
  isBody?: boolean;
  isRoutine?: boolean;
  isPlay4?: boolean;
}

export function Subplay1Menu({ onBack, onSelectGroup, isOrdinal, isCalendar, isColor, isSport, isInstrument, isProfession, isFamily, isHouse, isClassroom, isPlaces, isWeather, isAnimals, isFruits, isVegetables, isFood, isTastes, isClothing, isBody, isRoutine, isPlay4 }: SubmenuPlay1Props) {
  const playPrefix = isPlay4 ? (isRoutine ? "PLAY 5" : "PLAY 4") : "PLAY 1";
  return (
    <div className="flex flex-col items-center justify-between min-h-full py-8 px-6 text-slate-100 bg-transparent" id={isPlay4 ? "submenuPlay4" : "submenuPlay1"}>
      
      {/* Header with Title and top-right ← BACK button */}
      <div className="w-full flex flex-col items-center mt-4 mb-2 max-w-sm relative">
        <h1 className="text-[21px] font-extrabold tracking-[3px] text-white html-main-title uppercase leading-tight logo-font text-center">
          {isClassroom ? `${playPrefix} — CLASSROOM` : isPlaces ? `${playPrefix} — PLACES` : isWeather ? `${playPrefix} — WEATHER` : isAnimals ? `${playPrefix} — ANIMALS` : isHouse ? `${playPrefix} — HOUSE & HOME` : isFamily ? `${playPrefix} — FAMILY & PEOPLE` : isProfession ? `${playPrefix} — PROFESSIONS` : isInstrument ? `${playPrefix} — INSTRUMENTS` : isSport ? `${playPrefix} — SPORTS` : isColor ? `${playPrefix} — COLORS` : isCalendar ? `${playPrefix} — CALENDAR` : isOrdinal ? `${playPrefix} — ORDINALS` : isFruits ? `${playPrefix} — FRUITS` : isVegetables ? `${playPrefix} — VEGETABLES` : isFood ? `${playPrefix} — FOOD` : isTastes ? `${playPrefix} — TASTES & COOKING` : isClothing ? `${playPrefix} — CLOTHING` : isBody ? `${playPrefix} — BODY & ANATOMY` : isRoutine ? `${playPrefix} — ROUTINE & COMMANDS` : `${playPrefix} — NUMBERS`}
        </h1>
        <h2 className="text-[27px] font-black tracking-[4px] text-[#00FF66] html-sub-title uppercase leading-none mt-2 logo-font text-center drop-shadow-[0_0_15px_rgba(0,255,102,0.6)]">
          {isPlay4 ? "SELECT GROUP (PAIRS)" : "SELECT GROUP"}
        </h2>
        
        {/* ← BACK button */}
        <div className="w-full flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-5 py-2 border border-[#00FF66]/40 bg-[#07122E] rounded-full text-[12px] font-bold tracking-[2px] text-[#00FF66] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.15)] uppercase whitespace-nowrap"
            id="play1SubmenuBackBtn"
          >
            ← BACK
          </motion.button>
        </div>
      </div>

      {/* Options List */}
      <div className="w-full space-y-[14px] my-auto max-w-sm pr-1">
        
        {/* GROUP 1 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectGroup("group1")}
          className="w-full py-[18px] px-[20px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn html-level-btn-green"
          id="play1Group1Btn"
        >
          <span className="text-[18px] font-black text-white tracking-widest uppercase transition-colors text-center">
            {isAnimals ? "FARM & BIG" : isClassroom ? "SCHOOL SUPPLIES" : isPlaces ? "URBAN PLACES" : isWeather ? "WEATHER WORDS" : isHouse ? "PARTS & OUTSIDE" : isFamily ? "FAMILY BASIC" : isProfession ? "CAREER PROFESSIONS" : isInstrument ? "BASIC INSTRUMENTS" : isSport ? "BASIC SPORTS" : isColor ? "BASIC COLORS" : isCalendar ? "DAYS OF WEEK" : isFruits ? "BASIC FRUITS" : isVegetables ? "GREENS & ROOTS" : isFood ? "MEALS & DRINKS" : isTastes ? "BASIC TASTES" : isClothing ? "BASIC CLOTHING" : isBody ? "EXTERNAL BODY" : isRoutine ? "ROUTINE BASIC" : "GROUP 1"}
          </span>
          <span className="text-[11px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center">
            {isAnimals ? "Farm & big mammals (42 words)" : isClassroom ? "School objects, people & supplies" : isPlaces ? "Urban places & buildings" : isWeather ? "Weather words & phenomena" : isHouse ? "House parts, garden, yard, neighbor ..." : isFamily ? "Father, Mother, Brother, Sister ..." : isProfession ? "Student, Teacher, Lawyer ..." : isInstrument ? "Accordion, Harmonica, Harp ..." : isSport ? "Athletics, Gymnastics, Boxing ..." : isColor ? "Basic colors (Black, White, Blue ...)" : isCalendar ? "Days (Monday, Tuesday ...)" : isOrdinal ? "Ordinals 1st – 20th" : isFruits ? "Basic Fruits & Citrus fruits (15 words)" : isVegetables ? "Common greens, herbs & vegetables" : isFood ? "Standard morning, noon and evening foods" : isTastes ? "Sweet, salty, sour, bitter ... (14 words)" : isClothing ? "Learn basic garments, shirts, shoes & coats (30 words)" : isBody ? "External body parts & senses (45 words)" : isRoutine ? "Daily activities & morning routines (30 words)" : "Numbers 1–20 in order"}
          </span>
         </motion.button>

        {/* GROUP 2 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectGroup("group2")}
          className="w-full py-[18px] px-[20px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn html-level-btn-green"
          id="play1Group2Btn"
        >
          <span className="text-[18px] font-black text-white tracking-widest uppercase transition-colors text-center">
            {isAnimals ? "FOREST & EXOTIC" : isClassroom ? "SHAPES & SUBJECTS" : isPlaces ? "SHOPS & STORES" : isWeather ? "WEATHER PHRASES" : isHouse ? "LIVING ROOM" : isFamily ? "FAMILY EXTENDED" : isProfession ? "LABOR A PROFESSIONS" : isInstrument ? "MIDDLE INSTRUMENTS" : isSport ? "MIDDLE SPORTS" : isColor ? "MIDDLE COLORS" : isCalendar ? "MONTHS OF YEAR" : isFruits ? "BERRIES & NUTS" : isVegetables ? "TUBERS & LEGUMES" : isFood ? "PANTRY & MEATS" : isTastes ? "ADVANCED TASTES" : isClothing ? "WOMEN'S CLOTHING" : isBody ? "INTERNAL & CONDITIONS" : isRoutine ? "COMMON COMMANDS" : "GROUP 2"}
          </span>
          <span className="text-[11px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center">
            {isAnimals ? "Forest & exotic (35 words)" : isClassroom ? "Shapes & school subjects" : isPlaces ? "Shops & stores" : isWeather ? "It's + adjective / verb" : isHouse ? "Sofa, curtains, remote control, lamp ..." : isFamily ? "Stepfather, Cousin, Nephew, Niece ..." : isProfession ? "Locksmith, Mechanic, Tailor ..." : isInstrument ? "Piano, Organ, Trumpet ..." : isSport ? "Car racing, Golf, Soccer ..." : isColor ? "Intermediate colors (Gray, Purple, Pink ...)" : isCalendar ? "Months (January, February ...)" : isOrdinal ? "Ordinals 21st – 100th" : isFruits ? "Stone fruits, berries & nuts (15 words)" : isVegetables ? "Healthy tubers, roots & legumes" : isFood ? "Cooking baking & primary meat meals" : isTastes ? "Mild, roasted, spicy, well-done ... (14 words)" : isClothing ? "Learn blouse, dress, skirt, slippers, purses & accessories (30 words)" : isBody ? "Healthy bones, organs & medical conditions (50 words)" : isRoutine ? "Classroom commands & instruction phrases (30 words)" : "Numbers 21–100 in order"}
          </span>
        </motion.button>

        {/* GROUP 3 */}
        {(!isWeather && !isFruits && !isVegetables && !isClothing && !isBody) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGroup("group3")}
            className="w-full py-[18px] px-[20px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn html-level-btn-green"
            id="play1Group3Btn"
          >
            <span className="text-[18px] font-black text-white tracking-widest uppercase transition-colors text-center">
              {isAnimals ? "BIRDS & MARINE" : isClassroom ? "COUNTRIES" : isPlaces ? "VEHICLES & TRANSPORT" : isHouse ? "KITCHEN" : isFamily ? "PEOPLE & CO." : isProfession ? "LABOR B PROFESSIONS" : isInstrument ? "ADVANCED INSTRUMENTS" : isSport ? "ADVANCED SPORTS" : isColor ? "ADVANCED COLORS" : isCalendar ? "TIME & GREETINGS" : isFood ? "PREPARED FOODS" : isTastes ? "COOKING VERBS" : isRoutine ? "USEFUL PHRASES" : "GROUP 3"}
            </span>
            <span className="text-[11px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center">
              {isAnimals ? "Birds, insects & marine (40 words)" : isClassroom ? "Countries" : isPlaces ? "Vehicles & transport" : isHouse ? "Microwave, blender, cupboard, cup ..." : isFamily ? "Boy, Baby, Gentleman, Lady ..." : isProfession ? "Clown, Tamer, Milkman ..." : isInstrument ? "Tambourine, Cello, Double bass ..." : isSport ? "Skiing, Hockey, Rugby ..." : isColor ? "Advanced colors (Beige, Coral, Lime ...)" : isCalendar ? "Time expressions & greetings (Century, Noon ...)" : isOrdinal ? "Tens 10th, 20th … 100th" : isFood ? "Prepared dishes, snacks & condiments" : isTastes ? "Bake, boil, chop, fry, marinate ... (30 verbs)" : isRoutine ? "Useful remaining routine verbs & polite commands (40 words)" : "Tens 10–100"}
            </span>
          </motion.button>
        )}

        {/* GROUP 4 for House or Animals */}
        {(isHouse || isAnimals) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGroup("group4")}
            className="w-full py-[18px] px-[20px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn html-level-btn-green"
            id="play1Group4Btn"
          >
            <span className="text-[18px] font-black text-white tracking-widest uppercase transition-colors">
              {isAnimals ? "REPTILES & BUGS" : "BEDROOM"}
            </span>
            <span className="text-[11px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center">
              {isAnimals ? "Reptiles & creepy crawlies (35 words)" : "Bed, mattress, pillow, wardrobe, desk ..."}
            </span>
          </motion.button>
        )}

        {/* GROUP 5 for House */}
        {isHouse && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGroup("group5")}
            className="w-full py-[18px] px-[20px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn html-level-btn-green"
            id="play1Group5Btn"
          >
            <span className="text-[18px] font-black text-white tracking-widest uppercase transition-colors">
              BATHROOM & TOILETRIES
            </span>
            <span className="text-[11px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center">
              Toilet, shower, towel, toothbrush, soap ...
            </span>
          </motion.button>
        )}

      </div>

      <div className="text-center font-mono text-[9px] text-slate-655 mt-auto uppercase tracking-widest text-slate-600">
        STUDENT 1 • ENGLISH LEARNING SYSTEM
      </div>
    </div>
  );
}

// =========================================================================
// 4. SUBMENU PLAY 2 (Multiple Choice Size Selection)
// =========================================================================

interface SubmenuPlay2Props {
  onBack: () => void;
  onSelectSize: (size: number, part?: 1 | 2) => void;
  isOrdinal: boolean;
  isCalendar?: boolean;
  isColor?: boolean;
  isSport?: boolean;
  isInstrument?: boolean;
  isProfession?: boolean;
  isFamily?: boolean;
  isHouse?: boolean;
  isClassroom?: boolean;
  isPlaces?: boolean;
  isWeather?: boolean;
  isAnimals?: boolean;
  isFruits?: boolean;
  isVegetables?: boolean;
  isFood?: boolean;
  isTastes?: boolean;
  isClothing?: boolean;
  isBody?: boolean;
  isRoutine?: boolean;
}

export function Subplay2Menu({ onBack, onSelectSize, isOrdinal, isCalendar, isColor, isSport, isInstrument, isProfession, isFamily, isHouse, isClassroom, isPlaces, isWeather, isAnimals, isFruits, isVegetables, isFood, isTastes, isClothing, isBody, isRoutine }: SubmenuPlay2Props) {
  const isBlueTheme = isAnimals || isFood || isTastes || isClothing || isBody || isRoutine;
  const [showChallengeParts, setShowChallengeParts] = useState(false);

  // Total challenge size configuration
  const challengeSize = isClassroom ? 50 : isPlaces ? 50 : isWeather ? 35 : isHouse ? 65 : isFamily ? 70 : isProfession ? 65 : isInstrument ? 30 : isSport ? 30 : isColor ? 31 : isCalendar ? 54 : isAnimals ? 75 : isFruits ? 30 : isVegetables ? 34 : isFood ? 50 : isClothing ? 60 : isBody ? 95 : isRoutine ? 100 : isOrdinal ? 100 : 100;

  const part1Size = Math.ceil(challengeSize / 2);
  const part2Size = challengeSize - part1Size;

  if (showChallengeParts) {
    return (
      <div className="flex flex-col items-center justify-between min-h-full py-8 px-6 text-slate-100 bg-transparent" id="submenuPlay2Parts">
        
        {/* Header with Title and top-right ← BACK button */}
        <div className="w-full flex flex-col items-center mt-4 mb-2 max-w-sm relative">
          <h1 className="text-[21px] font-extrabold tracking-[3px] text-white html-main-title uppercase leading-tight logo-font text-center">
            {isClassroom ? "PLAY 2 — CLASSROOM MC" : isPlaces ? "PLAY 2 — PLACES MC" : isWeather ? "PLAY 2 — WEATHER MC" : isAnimals ? "PLAY 2 — ANIMALS MC" : isHouse ? "PLAY 2 — HOUSE & HOME MC" : isFamily ? "PLAY 2 — FAMILY & PEOPLE MC" : isProfession ? "PLAY 2 — PROFESSIONS MC" : isInstrument ? "PLAY 2 — INSTRUMENTS MC" : isSport ? "PLAY 2 — SPORTS MC" : isColor ? "PLAY 2 — COLORS MC" : isCalendar ? "PLAY 2 — CALENDAR MC" : isOrdinal ? "PLAY 2 — ORDINALS MC" : isFruits ? "PLAY 2 — FRUITS MC" : isVegetables ? "PLAY 2 — VEGETABLES MC" : isFood ? "PLAY 2 — FOOD MC" : isClothing ? "PLAY 2 — CLOTHING MC" : isBody ? "PLAY 2 — BODY & ANATOMY MC" : isRoutine ? "PLAY 2 — ROUTINE & COMMANDS MC" : "PLAY 2 — MC QUESTIONS"}
          </h1>
          <h2 className={`text-[21px] font-black tracking-[4px] html-sub-title uppercase leading-none mt-2 logo-font text-center drop-shadow-[0_0_15px_rgba(${isBlueTheme ? "0,191,255" : "0,255,102"},0.6)] ${isBlueTheme ? "text-[#00BFFF]" : "text-[#00FF66]"}`}>
            CHALLENGE PARTS
          </h2>
          
          {/* ← BACK button */}
          <div className="w-full flex justify-end mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChallengeParts(false)}
              className={`px-5 py-2 border rounded-full text-[12px] font-bold tracking-[2px] transition-all cursor-pointer uppercase whitespace-nowrap ${isBlueTheme ? "border-[#00BFFF]/40 bg-[#07122E] text-[#00BFFF] shadow-[0_0_15px_rgba(0,191,255,0.15)]" : "border-[#00FF66]/40 bg-[#07122E] text-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]"}`}
              id="play2PartsBackBtn"
            >
              ← BACK TO OPTIONS
            </motion.button>
          </div>
        </div>

        {/* Challenge Parts List */}
        <div className="w-full space-y-[18px] my-auto max-w-sm">
          {/* PART 1 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectSize(challengeSize, 1)}
            className={`w-full py-[25px] px-[30px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn ${isBlueTheme ? "html-level-btn-blue" : "html-level-btn-green"}`}
            id="play2Part1Btn"
          >
            <span className="text-[21px] font-black text-white tracking-widest uppercase transition-colors">
              CHALLENGE - PART 1
            </span>
            <span className="text-[12px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center">
              First half of the questions list ({part1Size} items)
            </span>
          </motion.button>

          {/* PART 2 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectSize(challengeSize, 2)}
            className={`w-full py-[25px] px-[30px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn ${isBlueTheme ? "html-level-btn-blue" : "html-level-btn-green"}`}
            id="play2Part2Btn"
          >
            <span className="text-[21px] font-black text-white tracking-widest uppercase transition-colors">
              CHALLENGE - PART 2
            </span>
            <span className="text-[12px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center">
              Second half of the questions list ({part2Size} items)
            </span>
          </motion.button>
        </div>

        <div className="text-center font-mono text-[9px] text-slate-355 mt-auto uppercase tracking-widest text-slate-600">
          STUDENT 1 • ENGLISH LEARNING SYSTEM
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-full py-8 px-6 text-slate-100 bg-transparent" id="submenuPlay2">
      
      {/* Header with Title and top-right ← BACK button */}
      <div className="w-full flex flex-col items-center mt-4 mb-2 max-w-sm relative">
        <h1 className="text-[21px] font-extrabold tracking-[3px] text-white html-main-title uppercase leading-tight logo-font text-center">
          {isClassroom ? "PLAY 2 — CLASSROOM MC" : isPlaces ? "PLAY 2 — PLACES MC" : isWeather ? "PLAY 2 — WEATHER MC" : isAnimals ? "PLAY 2 — ANIMALS MC" : isHouse ? "PLAY 2 — HOUSE & HOME MC" : isFamily ? "PLAY 2 — FAMILY & PEOPLE MC" : isProfession ? "PLAY 2 — PROFESSIONS MC" : isInstrument ? "PLAY 2 — INSTRUMENTS MC" : isSport ? "PLAY 2 — SPORTS MC" : isColor ? "PLAY 2 — COLORS MC" : isCalendar ? "PLAY 2 — CALENDAR MC" : isOrdinal ? "PLAY 2 — ORDINALS MC" : isFruits ? "PLAY 2 — FRUITS MC" : isVegetables ? "PLAY 2 — VEGETABLES MC" : isFood ? "PLAY 2 — FOOD MC" : isTastes ? "PLAY 2 — TASTES & COOKING MC" : isClothing ? "PLAY 2 — CLOTHING MC" : isBody ? "PLAY 2 — BODY & ANATOMY MC" : isRoutine ? "PLAY 2 — ROUTINE & COMMANDS MC" : "PLAY 2 — MC QUESTIONS"}
        </h1>
        <h2 className={`text-[27px] font-black tracking-[4px] html-sub-title uppercase leading-none mt-2 logo-font text-center drop-shadow-[0_0_15px_rgba(${isBlueTheme ? "0,191,255" : "0,255,102"},0.6)] ${isBlueTheme ? "text-[#00BFFF]" : "text-[#00FF66]"}`}>
          {isTastes ? "TASTES & COOKING" : isClothing ? "CLOTHING & ACCESSORIES" : isBody ? "BODY & HUMAN ANATOMY" : isRoutine ? "DAILY ROUTINE & COMMANDS" : "SELECT GROUP"}
        </h2>
        
        {/* ← BACK button */}
        <div className="w-full flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className={`px-5 py-2 border rounded-full text-[12px] font-bold tracking-[2px] transition-all cursor-pointer uppercase whitespace-nowrap ${isBlueTheme ? "border-[#00BFFF]/40 bg-[#07122E] text-[#00BFFF] shadow-[0_0_15px_rgba(0,191,255,0.15)]" : "border-[#00FF66]/40 bg-[#07122E] text-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]"}`}
            id="play2SubmenuBackBtn"
          >
            ← BACK
          </motion.button>
        </div>
      </div>

      {/* Options List */}
      <div className="w-full space-y-[18px] my-auto max-w-sm">
        {isTastes ? (
          <>
            {/* SENTENCES TRANSLATION */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectSize(20)}
              className={`w-full py-[20px] px-[24px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn ${isBlueTheme ? "html-level-btn-blue" : "html-level-btn-green"}`}
              id="tastesSentencesBtn"
            >
              <span className="text-[19px] font-black text-white tracking-widest uppercase transition-colors">
                SENTENCES MC
              </span>
              <span className="text-[11px] font-semibold text-white/95 mt-1 tracking-wide text-center">
                Match the 20 English taste & flavor sentences to Spanish
              </span>
            </motion.button>

            {/* TASTES WORDS MC */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectSize(28)}
              className={`w-full py-[20px] px-[24px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn ${isBlueTheme ? "html-level-btn-blue" : "html-level-btn-green"}`}
              id="tastesWordsMcBtn"
            >
              <span className="text-[19px] font-black text-white tracking-widest uppercase transition-colors">
                TASTES & FLAVORS MC
              </span>
              <span className="text-[11px] font-semibold text-white/95 mt-1 tracking-wide text-center">
                Multiple Choice practice of tastes & flavors vocabulary (28 words)
              </span>
            </motion.button>

            {/* COOKING VERBS MC */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectSize(30)}
              className={`w-full py-[20px] px-[24px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn ${isBlueTheme ? "html-level-btn-blue" : "html-level-btn-green"}`}
              id="tastesVerbsMcBtn"
            >
              <span className="text-[19px] font-black text-white tracking-widest uppercase transition-colors">
                COOKING VERBS MC
              </span>
              <span className="text-[11px] font-semibold text-white/95 mt-1 tracking-wide text-center">
                Multiple Choice practice of food-prep & cooking verbs (30 words)
              </span>
            </motion.button>
          </>
        ) : (
          <>
            {/* GROUP 1 (PRACTICE) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectSize(isClassroom ? 30 : isPlaces ? 30 : isWeather ? 20 : isHouse ? 45 : isFamily ? 40 : isProfession ? 40 : isInstrument ? 20 : isAnimals ? 40 : isFruits ? 15 : isVegetables ? 17 : isFood ? 25 : isClothing ? 30 : isBody ? 45 : isRoutine ? 30 : isSport ? 30 : isColor ? 30 : isCalendar ? 30 : isOrdinal ? 30 : 30)}
              className={`w-full py-[25px] px-[30px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn ${isBlueTheme ? "html-level-btn-blue" : "html-level-btn-green"}`}
              id="play2Size30Btn"
            >
              <span className="text-[21px] font-black text-white tracking-widest uppercase transition-colors">
                {isClassroom || isPlaces || isWeather || isHouse || isFamily || isProfession || isInstrument || isSport || isColor || isCalendar || isAnimals || isFruits || isVegetables || isFood || isClothing || isBody || isRoutine ? "PRACTICE" : "GROUP 1"}
              </span>
              <span className="text-[12px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center">
                {isClassroom ? "Random classroom & subjects questions (30 items)" : isPlaces ? "Random places & buildings questions (30 items)" : isWeather ? "Random weather & climate questions (20 items)" : isHouse ? "Random house words (Multiple Choice - 45 items)" : isFamily ? "Random family & people (Multiple Choice - 40 items)" : isProfession ? "Random professions (Multiple Choice - 40 items)" : isInstrument ? "Random instruments (Multiple Choice - 20 items)" : isSport ? "Random sports (Multiple Choice - 30 items)" : isColor ? "Random colors (Multiple Choice - 30 items)" : isCalendar ? "Random calendar / time questions (30 items)" : isOrdinal ? "Random ordinals (30 items)" : isAnimals ? "Random animal name multiple choice questions (40 items)" : isFruits ? "Random fruits & nuts multiple choice questions (15 items)" : isVegetables ? "Random vegetables & legumes multiple choice questions (17 items)" : isFood ? "Random food & beverages multiple choice questions (25 items)" : isClothing ? "Random clothing & accessories multiple choice (30 items)" : isBody ? "Random body & anatomy multiple choice (45 items)" : isRoutine ? "Random routine & commands multiple choice (30 items)" : "Random numbers (30 items)"}
              </span>
            </motion.button>

            {/* GROUP 2 (CHALLENGE) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowChallengeParts(true)}
              className={`w-full py-[25px] px-[30px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn ${isBlueTheme ? "html-level-btn-blue" : "html-level-btn-green"}`}
              id="play2Size65Btn"
            >
              <span className="text-[21px] font-black text-white tracking-widest uppercase transition-colors">
                {isClassroom || isPlaces || isWeather || isHouse || isFamily || isProfession || isInstrument || isSport || isColor || isCalendar || isAnimals || isFruits || isVegetables || isFood || isClothing || isBody || isRoutine ? "CHALLENGE" : "GROUP 2"}
              </span>
              <span className="text-[12px] font-semibold text-white/90 mt-1 tracking-wide transition-colors text-center">
                {isClassroom ? "Random classroom & subjects questions (Challenge - 50 items)" : isPlaces ? "Random places & transport questions (Challenge - 50 items)" : isWeather ? "Random weather & climate questions (Challenge - 35 items)" : isHouse ? "Random house words (Challenge - 65 items)" : isFamily ? "Full randomized family & people run (70 items)" : isProfession ? "Full randomized professions run (65 items)" : isInstrument ? "Full randomized instruments run (30 items)" : isSport ? "Full randomized sports run (30 items)" : isColor ? "Full randomized colors run (31 items)" : isCalendar ? "Full randomized calendar & time run (54 items)" : isOrdinal ? "Full randomized ordinals run (100 items)" : isAnimals ? "Full randomized animal name multiple choice challenge (75 items)" : isFruits ? "Full randomized fruits & nuts list (30 items)" : isVegetables ? "Full randomized vegetables & legumes list (34 items)" : isFood ? "Full randomized food & drinks list (50 items)" : isClothing ? "Full randomized clothing & accessories list (60 items)" : isBody ? "Full randomized body parts, bones & conditions (95 items)" : isRoutine ? "Full randomized daily routine & commands list (100 items)" : "Full randomized numbers run (100 items)"}
              </span>
            </motion.button>
          </>
        )}
      </div>

      <div className="text-center font-mono text-[9px] text-slate-355 mt-auto uppercase tracking-widest text-slate-600">
        STUDENT 1 • ENGLISH LEARNING SYSTEM
      </div>
    </div>
  );
}

// =========================================================================
// 5. SUBMENU PLAY 3 (Exam size selection)
// =========================================================================

interface SubmenuPlay3Props {
  onBack: () => void;
  onSelectDifficulty: (count: number) => void;
  isOrdinal: boolean;
  isCalendar?: boolean;
  isColor?: boolean;
  isSport?: boolean;
  isInstrument?: boolean;
  isProfession?: boolean;
  isFamily?: boolean;
  isHouse?: boolean;
  isClassroom?: boolean;
  isPlaces?: boolean;
  isWeather?: boolean;
  isAnimals?: boolean;
  isFruits?: boolean;
  isVegetables?: boolean;
  isFood?: boolean;
  isTastes?: boolean;
  isClothing?: boolean;
  isBody?: boolean;
  isRoutine?: boolean;
}

export function Subplay3Menu({ onBack, onSelectDifficulty, isOrdinal, isCalendar, isColor, isSport, isInstrument, isProfession, isFamily, isHouse, isClassroom, isPlaces, isWeather, isAnimals, isFruits, isVegetables, isFood, isTastes, isClothing, isBody, isRoutine }: SubmenuPlay3Props) {
  const isBlueTheme = isAnimals || isFood || isTastes || isClothing || isBody || isRoutine;
  return (
    <div className="flex flex-col items-center justify-between min-h-full py-8 px-6 text-slate-100 bg-transparent" id="submenuPlay3">
      
      {/* Header with Title and top-right ← BACK button */}
      <div className="w-full flex flex-col items-center mt-4 mb-2 max-w-sm relative">
        <h1 className="text-[21px] font-extrabold tracking-[3px] text-white html-main-title uppercase leading-tight logo-font text-center">
          {isClassroom ? "PLAY 3 — CLASSROOM EXAM" : isPlaces ? "PLAY 3 — PLACES EXAM" : isWeather ? "PLAY 3 — WEATHER EXAM" : isAnimals ? "PLAY 3 — ANIMALS EXAM" : isHouse ? "PLAY 3 — HOUSE & HOME EXAM" : isFamily ? "PLAY 3 — FAMILY & PEOPLE EXAM" : isProfession ? "PLAY 3 — PROFESSIONS EXAM" : isInstrument ? "PLAY 3 — INSTRUMENTS EXAM" : isSport ? "PLAY 3 — SPORTS EXAM" : isColor ? "PLAY 3 — COLORS EXAM" : isCalendar ? "PLAY 3 — CALENDAR EXAM" : isFruits ? "PLAY 3 — FRUITS EXAM" : isVegetables ? "PLAY 3 — VEGETABLES EXAM" : isFood ? "PLAY 3 — FOOD EXAM" : isTastes ? "PLAY 3 — TASTES & COOKING EXAM" : isClothing ? "PLAY 3 — CLOTHING EXAM" : isBody ? "PLAY 3 — BODY & ANATOMY EXAM" : isRoutine ? "PLAY 4 — ROUTINE & COMMANDS EXAM" : "PLAY 3 — EXAM MODE"}
        </h1>
        <h2 className="text-[27px] font-black tracking-[4px] text-[#00FF66] html-sub-title uppercase leading-none mt-2 logo-font text-center drop-shadow-[0_0_15px_rgba(0,255,102,0.6)]">
          {isClassroom ? "CLASSROOM & SUBJECTS" : isPlaces ? "PLACES & TRANSPORT" : isWeather ? "WEATHER & CLIMATE" : isAnimals ? "WILDLIFE & PETS" : isHouse ? "HOUSE WORDS" : isFamily ? "FAMILY & PEOPLE" : isProfession ? "PROFESSIONS" : isInstrument ? "INSTRUMENTS" : isSport ? "SPORTS" : isColor ? "COLORS" : isCalendar ? "DAYS, MONTHS & TIME" : isOrdinal ? "ORDINAL NUMBERS" : isFruits ? "FRUITS & NUTS" : isVegetables ? "VEGETABLES & LEGUMES" : isFood ? "FOOD & DRINKS" : isTastes ? "TASTES & COOKING" : isClothing ? "CLOTHING & ACCESSORIES" : isBody ? "BODY & HUMAN ANATOMY" : isRoutine ? "DAILY ROUTINE & COMMANDS" : "NATURAL NUMBERS"}
        </h2>
        
        {/* ← BACK button */}
        <div className="w-full flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-5 py-2 border border-[#00FF66]/40 bg-[#07122E] rounded-full text-[12px] font-bold tracking-[2px] text-[#00FF66] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.15)] uppercase whitespace-nowrap"
            id="play3SubmenuBackBtn"
          >
            ← BACK
          </motion.button>
        </div>
      </div>

      {/* Exam Options List */}
      <div className="w-full space-y-[18px] my-auto max-w-sm">
        
        {/* EASY EXAM */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectDifficulty(isTastes ? 20 : isClassroom ? 25 : isPlaces ? 25 : isWeather ? 15 : isHouse ? 30 : isFamily ? 18 : isProfession ? 20 : isAnimals ? 30 : isFruits ? 18 : isVegetables ? 20 : isFood ? 20 : isClothing ? 20 : isBody ? 20 : isRoutine ? 20 : isInstrument ? 10 : isSport ? 10 : isColor ? 10 : isCalendar ? 20 : isOrdinal ? 20 : 20)}
          className="w-full py-[25px] px-[30px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn html-level-btn-green"
          id="play3EasyBtn"
        >
          <span className="text-[21px] font-black text-white tracking-widest uppercase transition-colors">
            EASY EXAM
          </span>
          <span className="text-[12px] font-semibold text-white/90 mt-1 tracking-wide transition-colors">
            {isTastes ? "20 questions" : isClassroom || isPlaces ? "25 questions" : isWeather ? "15 questions" : isHouse ? "30 questions" : isFamily ? "18 questions" : isProfession ? "20 questions" : isInstrument || isSport || isColor ? "10 questions" : isAnimals ? "30 questions" : isFruits ? "18 questions" : isVegetables ? "20 questions" : isFood ? "20 questions" : isClothing ? "20 questions" : isBody ? "20 questions" : isRoutine ? "20 questions" : "20 questions"}
          </span>
         </motion.button>

        {/* HARD EXAM */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectDifficulty(isTastes ? 40 : isClassroom ? 50 : isPlaces ? 50 : isWeather ? 30 : isHouse ? 50 : isFamily ? 17 : isProfession ? 40 : isAnimals ? 65 : isFruits ? 30 : isVegetables ? 34 : isFood ? 40 : isClothing ? 40 : isBody ? 40 : isRoutine ? 45 : isInstrument ? 20 : isSport ? 20 : isColor ? 20 : isCalendar ? 40 : isOrdinal ? 40 : 40)}
          className="w-full py-[25px] px-[30px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn html-level-btn-green"
          id="play3HardBtn"
        >
          <span className="text-[21px] font-black text-white tracking-widest uppercase transition-colors">
            HARD EXAM
          </span>
          <span className="text-[12px] font-semibold text-white/90 mt-1 tracking-wide transition-colors">
            {isTastes ? "40 questions" : isClassroom || isPlaces ? "50 questions" : isWeather ? "30 questions" : isHouse ? "50 questions" : isFamily ? "17 questions" : isProfession ? "40 questions" : isInstrument || isSport || isColor ? "20 questions" : isAnimals ? "65 questions" : isFruits ? "30 questions" : isVegetables ? "34 questions" : isFood ? "40 questions" : isClothing ? "40 questions" : isBody ? "40 questions" : isRoutine ? "45 questions" : "40 questions"}
          </span>
        </motion.button>

        {/* ADVANCED EXAM */}
        {!isTastes && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectDifficulty(isClassroom ? 80 : isPlaces ? 78 : isWeather ? 47 : isHouse ? 80 : isFamily ? 36 : isProfession ? 65 : isAnimals ? 120 : isFruits ? 30 : isVegetables ? 34 : isFood ? 50 : isClothing ? 60 : isBody ? 70 : isRoutine ? 100 : isInstrument ? 30 : isSport ? 30 : isColor ? 30 : isCalendar ? 54 : isOrdinal ? 60 : 60)}
            className="w-full py-[25px] px-[30px] relative overflow-hidden rounded-[20px] transition-all cursor-pointer flex flex-col justify-center items-center group level-btn html-level-btn-pink"
            id="play3AdvancedBtn"
          >
            <span className="text-[21px] font-black text-white tracking-widest uppercase transition-colors">
              ADVANCED EXAM
            </span>
            <span className="text-[12px] font-semibold text-white/90 mt-1 tracking-wide transition-colors">
              {isClassroom ? "80 questions" : isPlaces ? "78 questions" : isWeather ? "47 questions" : isHouse ? "80 questions" : isFamily ? "36 questions" : isProfession ? "65 questions" : isInstrument || isSport || isColor ? "30 questions" : isAnimals ? "120 questions" : isFruits ? "30 questions" : isVegetables ? "34 questions" : isFood ? "50 questions" : isClothing ? "60 questions" : isBody ? "70 questions" : isRoutine ? "100 questions" : isCalendar ? "54 questions" : "60 questions"}
            </span>
          </motion.button>
        )}

      </div>

      <div className="text-center font-mono text-[9px] text-slate-355 mt-auto uppercase tracking-widest text-slate-600">
        STUDENT 1 • ENGLISH LEARNING SYSTEM
      </div>
    </div>
  );
}
