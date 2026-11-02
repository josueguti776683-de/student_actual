/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppStats {
  userName: string;
  errorsCount: number;
  cupsCount: number;
  medalsCount: number;
  practicedDays: boolean[]; // 7 elements, index 0 is Monday, index 6 is Sunday
  moduleProgress: { [moduleId: number]: number };
  moduleCups?: { [moduleId: number]: number }; // module specific cups
  moduleMedals?: { [moduleId: number]: number }; // module specific medals
  weeklyLearningProgress?: number; // learning bar percentage (0-100)
}

const DEFAULT_STATS: AppStats = {
  userName: "STUDENT 1",
  errorsCount: 0,
  cupsCount: 0,
  medalsCount: 0,
  practicedDays: [false, false, false, false, false, false, false],
  moduleProgress: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
  },
  moduleCups: {},
  moduleMedals: {},
  weeklyLearningProgress: 0
};

const STATS_KEY = "rout_app_stats_v1";

// Helper to get Sunday date string for reset tracking
function getSundayDateString(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Adjust to Sunday (day 0)
  const sunday = new Date(d.setDate(diff));
  return `${sunday.getFullYear()}-${sunday.getMonth() + 1}-${sunday.getDate()}`;
}

export function getStats(): AppStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    let stats: AppStats;
    if (!raw) {
      stats = { ...DEFAULT_STATS };
      saveStats(stats);
    } else {
      stats = JSON.parse(raw) as AppStats;
    }

    // Handle migration / fill missing keys
    if (stats.medalsCount === undefined) stats.medalsCount = 0;
    if (stats.weeklyLearningProgress === undefined) stats.weeklyLearningProgress = 0;
    if (!stats.moduleProgress) stats.moduleProgress = { ...DEFAULT_STATS.moduleProgress };
    if (!stats.moduleCups) stats.moduleCups = {};
    if (!stats.moduleMedals) stats.moduleMedals = {};
    if (stats.practicedDays === undefined || stats.practicedDays.length !== 7) {
      stats.practicedDays = [false, false, false, false, false, false, false];
    }

    // --- Sunday Afternoon Reset Logic ---
    // Sunday in afternoon (12:00 PM or later)
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday...
    const currentHour = now.getHours();
    
    const isSundayAfternoon = (currentDay === 0 && currentHour >= 12);
    const sundayDateStr = getSundayDateString(now);
    const lastResetSunday = localStorage.getItem("rout_app_last_reset_sunday") || "";

    if (isSundayAfternoon && lastResetSunday !== sundayDateStr) {
      // Clear practiced days and weekly learning bar
      stats.practicedDays = [false, false, false, false, false, false, false];
      stats.weeklyLearningProgress = 0;
      localStorage.setItem("rout_app_last_reset_sunday", sundayDateStr);
      saveStats(stats);
    }

    // --- Automatic Today Practice Marker ---
    // Mark today as practiced because the user entered the app/dashboard
    const jsDay = now.getDay();
    const localDayIndex = jsDay === 0 ? 6 : jsDay - 1; // Map Monday to 0, Sunday to 6
    if (!stats.practicedDays[localDayIndex]) {
      stats.practicedDays[localDayIndex] = true;
      // Increment weekly learning progress slightly on first entry of the day
      stats.weeklyLearningProgress = Math.min(100, (stats.weeklyLearningProgress || 0) + 15);
      saveStats(stats);
    }

    return stats;
  } catch (e) {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: AppStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    // Trigger custom event so other components can listen to changes if needed
    window.dispatchEvent(new Event("stats_updated"));
  } catch (e) {
    console.error("Failed to save stats to localStorage", e);
  }
}

export function updateStatsOnGameComplete(moduleId: number, errors: number): AppStats {
  const stats = getStats();
  
  // 1. Add errors
  stats.errorsCount += errors;

  // 2. Mark current day as practiced (already handled, but ensure here too)
  const jsDay = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const localDayIndex = jsDay === 0 ? 6 : jsDay - 1; // Map Monday to 0, Sunday to 6
  stats.practicedDays[localDayIndex] = true;

  // 3. Earn cups or medals based on score
  if (errors === 0) {
    stats.cupsCount += 1;
    // Module specific cups
    if (moduleId !== 999 && moduleId !== 998 && moduleId !== 997 && moduleId !== 996 && moduleId !== 995 && moduleId !== 994) {
      if (!stats.moduleCups) stats.moduleCups = {};
      const currCups = stats.moduleCups[moduleId] || 0;
      stats.moduleCups[moduleId] = currCups + 1;
    }
  } else if (errors === 1 || errors === 2) {
    // Earn a medal
    stats.medalsCount = (stats.medalsCount || 0) + 1;
    // Module specific medals
    if (moduleId !== 999 && moduleId !== 998 && moduleId !== 997 && moduleId !== 996 && moduleId !== 995 && moduleId !== 994) {
      if (!stats.moduleMedals) stats.moduleMedals = {};
      const currMedals = stats.moduleMedals[moduleId] || 0;
      stats.moduleMedals[moduleId] = currMedals + 1;
    }
  }

  // 4. Update module progress
  if (moduleId !== 999 && moduleId !== 998 && moduleId !== 997 && moduleId !== 996 && moduleId !== 995 && moduleId !== 994) {
    const currentProgress = stats.moduleProgress[moduleId] || 0;
    // Increase progress based on performance, minimum increase is 20%
    const increase = errors === 0 ? 40 : errors <= 2 ? 30 : 20;
    const nextProgress = Math.min(100, currentProgress + increase);
    stats.moduleProgress[moduleId] = nextProgress;

    // Gain 1 module cup if progress reached 100% and didn't get one yet from this run
    if (nextProgress === 100 && errors > 0) {
      if (!stats.moduleCups) stats.moduleCups = {};
      const currCups = stats.moduleCups[moduleId] || 0;
      stats.moduleCups[moduleId] = currCups + 1;
      stats.cupsCount += 1;
    }
  }

  // 5. Increase weekly learning progress
  stats.weeklyLearningProgress = Math.min(100, (stats.weeklyLearningProgress || 0) + 20);

  saveStats(stats);
  return stats;
}
