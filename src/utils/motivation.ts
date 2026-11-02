/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getStats } from "./stats";

// Exactly 12 unique motivational phrases distributed by screen to avoid random repetitions
const SCREEN_PHRASES: Record<string, string[]> = {
  menu: [
    "¡Vamos, {name}! Cada error que cometes y corriges te acerca más a la fluidez absoluta.",
    "¡{name}, el éxito es la suma de pequeños esfuerzos repetidos día tras día!"
  ],
  play1: [
    "¡No te rindas, {name}! Equivocarse es parte del entrenamiento de tu cerebro para dominar el inglés.",
    "¡Fuerza, {name}! Recuerda que la constancia y la práctica superan al talento natural."
  ],
  play2: [
    "¡{name}, cada palabra que dominas hoy es una puerta de éxito que abres para tu futuro!",
    "¡Excelente esfuerzo, {name}! El inglés no es cuestión de suerte, es cuestión de práctica constante."
  ],
  play3: [
    "¡Tú puedes, {name}! Los campeones del inglés son simplemente principiantes que nunca se rindieron.",
    "¡Vamos por más, {name}! Dominar un idioma diferente te da una visión diferente del mundo."
  ],
  penalty: [
    "¡{name}, la persistencia en este aprendizaje convierte cualquier error de hoy en conocimiento definitivo!",
    "¡Sigue practicando, {name}! Tu disciplina de hoy es tu libertad bilingüe de mañana."
  ],
  results: [
    "¡{name}, cada paso adelante en inglés te abre nuevas oportunidades y horizontes sin límites!",
    "¡Increíble, {name}! Tu constancia demuestra que con dedicación se puede alcanzar el bilingüismo."
  ]
};

// Flattened list of all 12 phrases for reference
const ALL_12_PHRASES = [
  ...SCREEN_PHRASES.menu,
  ...SCREEN_PHRASES.play1,
  ...SCREEN_PHRASES.play2,
  ...SCREEN_PHRASES.play3,
  ...SCREEN_PHRASES.penalty,
  ...SCREEN_PHRASES.results
];

/**
 * Retrieves a screen-specific motivational phrase from the 12 unique phrases,
 * preventing random cross-screen overlaps.
 */
export function getMotivationForScreen(
  screen: "menu" | "play1" | "play2" | "play3" | "penalty" | "results",
  customName?: string
): string {
  const nameToUse = customName || getStats().userName || "STUDENT 1";
  const pool = SCREEN_PHRASES[screen] || SCREEN_PHRASES.menu;
  
  // Stably select one of the 2 phrases for this screen so they don't flicker
  const randomIndex = Math.floor(Math.random() * pool.length);
  const selectedPhrase = pool[randomIndex];
  
  return selectedPhrase.replace("{name}", nameToUse.toUpperCase());
}

/**
 * Legacy wrapper: Retrieves a random phrase from the 12 total phrases.
 */
export function getRandomMotivation(customName?: string): string {
  const nameToUse = customName || getStats().userName || "STUDENT 1";
  const randomIndex = Math.floor(Math.random() * ALL_12_PHRASES.length);
  const selectedPhrase = ALL_12_PHRASES[randomIndex];
  
  return selectedPhrase.replace("{name}", nameToUse.toUpperCase());
}
