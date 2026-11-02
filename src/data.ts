/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NumberItem } from "./types";

const map1a19: { [key: number]: string } = {
  1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
  6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen",
  15: "fifteen", 16: "sixteen", 17: "seventeen", 18: "eighteen",
  19: "nineteen"
};

const mapDecenas: { [key: number]: string } = {
  2: "twenty", 3: "thirty", 4: "forty", 5: "fifty",
  6: "sixty", 7: "seventy", 8: "eighty", 9: "ninety"
};

/**
 * Converts a number from 1 to 100 to its English text equivalent.
 */
export function getEnglishNumber(num: number): string {
  if (num === 100) return "one hundred";
  if (num < 20) return map1a19[num];
  const tens = Math.floor(num / 10);
  const units = num % 10;
  if (units === 0) return mapDecenas[tens];
  return `${mapDecenas[tens]}-${map1a19[units]}`;
}

export type NumberPair = [string, number];

// Group 1 (1-20)
export const numeros1a20: NumberPair[] = Array.from({ length: 20 }, (_, i) => {
  const num = i + 1;
  return [getEnglishNumber(num), num];
});

// Group 2 (21-100)
export const numeros21a100: NumberPair[] = Array.from({ length: 80 }, (_, i) => {
  const num = i + 21;
  return [getEnglishNumber(num), num];
});

// Tens 10-100
export const decenas: NumberPair[] = Array.from({ length: 10 }, (_, i) => {
  const num = (i + 1) * 10;
  return [getEnglishNumber(num), num];
});

// Total 100 numbers
export const totalNumeros100: NumberPair[] = [...numeros1a20, ...numeros21a100];

const ipa1a19: { [key: number]: string } = {
  1: "wʌn",
  2: "tuː",
  3: "θriː",
  4: "fɔːr",
  5: "faɪv",
  6: "sɪks",
  7: "ˈsɛvən",
  8: "eɪt",
  9: "naɪn",
  10: "tɛn",
  11: "ɪˈlɛvən",
  12: "twɛlv",
  13: "θɜːrˈtiːn",
  14: "fɔːrˈtiːn",
  15: "fɪfˈtiːn",
  16: "sɪksˈtiːn",
  17: "sɛvənˈtiːn",
  18: "eɪˈtiːn",
  19: "naɪnˈtiːn"
};

const ipaTens: { [key: number]: string } = {
  2: "ˈtwɛnti",
  3: "ˈθɜːrti",
  4: "ˈfɔːrti",
  5: "ˈfɪfti",
  6: "ˈsɪksti",
  7: "ˈsɛvənti",
  8: "ˈeɪti",
  9: "ˈnaɪnti"
};

/**
 * Returns the IPA American English phonetic representation of any number from 1 to 100.
 */
export function getAmericanIPA(num: number): string {
  if (num === 100) return "/ˌwʌn ˈhʌndrəd/";
  
  if (num < 20) {
    return `/${ipa1a19[num]}/`;
  }
  
  const tens = Math.floor(num / 10);
  const units = num % 10;
  
  if (units === 0) {
    return `/${ipaTens[tens]}/`;
  }
  
  const tensBase = ipaTens[tens].replace("ˈ", "");
  let unitPart = ipa1a19[units];
  if (!unitPart.startsWith("ˈ") && !unitPart.startsWith("ˌ")) {
    unitPart = "ˈ" + unitPart;
  }
  
  return `/ˌ${tensBase}-${unitPart}/`;
}

// =========================================================================
// MODULE 2: ORDINAL NUMBERS GENERATION & DATA
// =========================================================================

export function getEnglishOrdinalWord(n: number): string {
  if (n === 100) return "one hundredth";
  
  const especialesFull: { [key: number]: string } = {
    1: "first", 2: "second", 3: "third", 4: "fourth", 5: "fifth",
    6: "sixth", 7: "seventh", 8: "eighth", 9: "ninth", 10: "tenth",
    11: "eleventh", 12: "twelfth", 13: "thirteenth", 14: "fourteenth",
    15: "fifteenth", 16: "sixteenth", 17: "seventeenth", 18: "eighteenth",
    19: "nineteenth", 20: "twentieth"
  };
  
  if (n <= 20) return especialesFull[n];
  
  const unidades = n % 10;
  if (unidades === 0) {
    const decenaMap: { [key: number]: string } = {
      30: "thirtieth", 40: "fortieth", 50: "fiftieth", 60: "sixtieth",
      70: "seventieth", 80: "eightieth", 90: "ninetieth"
    };
    if (decenaMap[n]) return decenaMap[n];
  }
  
  const decenasMapa: { [key: number]: string } = {
    20: "twenty", 30: "thirty", 40: "forty", 50: "fifty",
    60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety"
  };
  
  const decenaBase = Math.floor(n / 10) * 10;
  let unidadOrdinal = "";
  if (unidades === 1) unidadOrdinal = "first";
  else if (unidades === 2) unidadOrdinal = "second";
  else if (unidades === 3) unidadOrdinal = "third";
  else unidadOrdinal = getEnglishOrdinalWord(unidades);
  
  return `${decenasMapa[decenaBase]}-${unidadOrdinal}`;
}

export function getOrdinalSymbol(n: number): string {
  if (n === 11 || n === 12 || n === 13) return n + "th";
  const u = n % 10;
  if (u === 1) return n + "st";
  if (u === 2) return n + "nd";
  if (u === 3) return n + "rd";
  return n + "th";
}

const ipaOrdinals1a20: { [key: number]: string } = {
  1: "fɜːrst", 2: "ˈsɛkənd", 3: "θɜːrd", 4: "fɔːrθ", 5: "fɪfθ",
  6: "sɪksθ", 7: "ˈsɛvənθ", 8: "eɪtθ", 9: "naɪnθ", 10: "tɛnθ",
  11: "ɪˈlɛvənθ", 12: "twɛlfθ", 13: "θɜːrˈtiːnθ", 14: "fɔːrˈtiːnθ",
  15: "fɪfˈtiːnθ", 16: "sɪksˈtiːnθ", 17: "sɛvənˈtiːnθ", 18: "eɪˈtiːnθ",
  19: "naɪnˈtiːnθ", 20: "ˈtwɛntiəθ"
};

const ipaOrdinalTens: { [key: number]: string } = {
  30: "ˈθɜːrtiəθ", 40: "ˈfɔːrtiəθ", 50: "ˈfɪftiəθ", 60: "ˈsɪkstiəθ",
  70: "ˈsɛvəntiəθ", 80: "ˈeɪtiəθ", 90: "ˈnaɪntiəθ"
};

export function getAmericanIPAOrdinal(num: number): string {
  if (num === 100) return "/ˌwʌn ˈhʌndrədθ/";
  if (num <= 20) return `/${ipaOrdinals1a20[num]}/`;
  
  const tens = Math.floor(num / 10);
  const units = num % 10;
  
  if (units === 0) {
    if (tens === 2) return "/ˈtwɛntiəθ/";
    return `/${ipaOrdinalTens[tens * 10]}/`;
  }
  
  const tensBase = ipaTens[tens].replace("ˈ", "");
  let unitPart = ipaOrdinals1a20[units];
  if (!unitPart.startsWith("ˈ") && !unitPart.startsWith("ˌ")) {
    unitPart = "ˈ" + unitPart;
  }
  
  return `/ˌ${tensBase}-${unitPart}/`;
}

// Group 1 (Ordinals 1st - 20th)
export const ordinal1a20: NumberItem[] = Array.from({ length: 20 }, (_, i) => {
  const num = i + 1;
  return {
    word: getEnglishOrdinalWord(num),
    digit: num,
    symbol: getOrdinalSymbol(num),
    isOrdinal: true
  };
});

// Group 2 (Ordinals 21st - 100th)
export const ordinal21a100: NumberItem[] = Array.from({ length: 80 }, (_, i) => {
  const num = i + 21;
  return {
    word: getEnglishOrdinalWord(num),
    digit: num,
    symbol: getOrdinalSymbol(num),
    isOrdinal: true
  };
});

// Group 3 (Tens 10th - 100th)
export const ordinalDecenas: NumberItem[] = Array.from({ length: 10 }, (_, i) => {
  const num = (i + 1) * 10;
  return {
    word: getEnglishOrdinalWord(num),
    digit: num,
    symbol: getOrdinalSymbol(num),
    isOrdinal: true
  };
});

// Total Ordinals
export const totalOrdinal100: NumberItem[] = [...ordinal1a20, ...ordinal21a100];

// =========================================================================
// MODULE 3: CALENDAR & TIME (Days, Months & Time) DATA
// =========================================================================

export const calendarDays: NumberItem[] = [
  { word: "monday", digit: 1, symbol: "lunes", isCalendar: true, calendarGroup: "days", ipa: "/ˈmʌndeɪ/" },
  { word: "tuesday", digit: 2, symbol: "martes", isCalendar: true, calendarGroup: "days", ipa: "/ˈtuːzdeɪ/" },
  { word: "wednesday", digit: 3, symbol: "miércoles", isCalendar: true, calendarGroup: "days", ipa: "/ˈwɛnzdeɪ/" },
  { word: "thursday", digit: 4, symbol: "jueves", isCalendar: true, calendarGroup: "days", ipa: "/ˈθɜːrzdeɪ/" },
  { word: "friday", digit: 5, symbol: "viernes", isCalendar: true, calendarGroup: "days", ipa: "/ˈfraɪdeɪ/" },
  { word: "saturday", digit: 6, symbol: "sábado", isCalendar: true, calendarGroup: "days", ipa: "/ˈsætərdeɪ/" },
  { word: "sunday", digit: 7, symbol: "domingo", isCalendar: true, calendarGroup: "days", ipa: "/ˈsʌndeɪ/" }
];

export const calendarMonths: NumberItem[] = [
  { word: "january", digit: 1, symbol: "enero", isCalendar: true, calendarGroup: "months", ipa: "/ˈdʒænjuɛri/" },
  { word: "february", digit: 2, symbol: "febrero", isCalendar: true, calendarGroup: "months", ipa: "/ˈfɛbruɛri/" },
  { word: "march", digit: 3, symbol: "marzo", isCalendar: true, calendarGroup: "months", ipa: "/mɑːrtʃ/" },
  { word: "april", digit: 4, symbol: "abril", isCalendar: true, calendarGroup: "months", ipa: "/ˈeɪprəl/" },
  { word: "may", digit: 5, symbol: "mayo", isCalendar: true, calendarGroup: "months", ipa: "/meɪ/" },
  { word: "june", digit: 6, symbol: "junio", isCalendar: true, calendarGroup: "months", ipa: "/dʒuːn/" },
  { word: "july", digit: 7, symbol: "julio", isCalendar: true, calendarGroup: "months", ipa: "/dʒuˈlaɪ/" },
  { word: "august", digit: 8, symbol: "agosto", isCalendar: true, calendarGroup: "months", ipa: "/ˈɔːɡəst/" },
  { word: "september", digit: 9, symbol: "septiembre", isCalendar: true, calendarGroup: "months", ipa: "/sɛpˈtɛmbər/" },
  { word: "october", digit: 10, symbol: "octubre", isCalendar: true, calendarGroup: "months", ipa: "/ɑːkˈtoʊbər/" },
  { word: "november", digit: 11, symbol: "noviembre", isCalendar: true, calendarGroup: "months", ipa: "/noʊˈvɛmbər/" },
  { word: "december", digit: 12, symbol: "diciembre", isCalendar: true, calendarGroup: "months", ipa: "/dɪˈsɛmbər/" }
];

export const calendarTime: NumberItem[] = [
  { word: "century", digit: 1, symbol: "siglo", isCalendar: true, calendarGroup: "time", ipa: "/ˈsɛntʃəri/" },
  { word: "year", digit: 2, symbol: "año", isCalendar: true, calendarGroup: "time", ipa: "/jɪər/" },
  { word: "month", digit: 3, symbol: "mes", isCalendar: true, calendarGroup: "time", ipa: "/mʌnθ/" },
  { word: "week", digit: 4, symbol: "semana", isCalendar: true, calendarGroup: "time", ipa: "/wiːk/" },
  { word: "sunset", digit: 5, symbol: "atardecer", isCalendar: true, calendarGroup: "time", ipa: "/ˈsʌnsɛt/" },
  { word: "day", digit: 6, symbol: "día", isCalendar: true, calendarGroup: "time", ipa: "/deɪ/" },
  { word: "hour", digit: 7, symbol: "hora", isCalendar: true, calendarGroup: "time", ipa: "/ˈaʊər/" },
  { word: "minute", digit: 8, symbol: "minuto", isCalendar: true, calendarGroup: "time", ipa: "/ˈmɪnɪt/" },
  { word: "second", digit: 9, symbol: "segundo", isCalendar: true, calendarGroup: "time", ipa: "/ˈsɛkənd/" },
  { word: "twilight", digit: 10, symbol: "crepúsculo", isCalendar: true, calendarGroup: "time", ipa: "/ˈtwaɪlaɪt/" },
  { word: "morning", digit: 11, symbol: "mañana", isCalendar: true, calendarGroup: "time", ipa: "/ˈmɔːrnɪŋ/" },
  { word: "noon", digit: 12, symbol: "mediodía", isCalendar: true, calendarGroup: "time", ipa: "/nuːn/" },
  { word: "midday", digit: 13, symbol: "mediodía", isCalendar: true, calendarGroup: "time", ipa: "/ˌmɪdˈdeɪ/" },
  { word: "evening", digit: 14, symbol: "tarde/noche", isCalendar: true, calendarGroup: "time", ipa: "/ˈiːvnɪŋ/" },
  { word: "night", digit: 15, symbol: "noche", isCalendar: true, calendarGroup: "time", ipa: "/naɪt/" },
  { word: "early morning", digit: 16, symbol: "madrugada", isCalendar: true, calendarGroup: "time", ipa: "/ˈɜːrli ˈmɔːrnɪŋ/" },
  { word: "today", digit: 17, symbol: "hoy", isCalendar: true, calendarGroup: "time", ipa: "/təˈdeɪ/" },
  { word: "yesterday", digit: 18, symbol: "ayer", isCalendar: true, calendarGroup: "time", ipa: "/ˈjɛstərdeɪ/" },
  { word: "tomorrow", digit: 19, symbol: "mañana (futuro)", isCalendar: true, calendarGroup: "time", ipa: "/təˈmɔːroʊ/" },
  { word: "dawn", digit: 20, symbol: "amanecer", isCalendar: true, calendarGroup: "time", ipa: "/dɔːn/" },
  { word: "midnight", digit: 21, symbol: "medianoche", isCalendar: true, calendarGroup: "time", ipa: "/ˈmɪdnaɪt/" },
  { word: "good morning", digit: 22, symbol: "buenos días", isCalendar: true, calendarGroup: "time", ipa: "/ˌɡʊd ˈmɔːrnɪŋ/" },
  { word: "good afternoon", digit: 23, symbol: "buenas tardes", isCalendar: true, calendarGroup: "time", ipa: "/ˌɡʊd ˌæftərˈnuːn/" },
  { word: "good evening", digit: 24, symbol: "buenas noches (saludo)", isCalendar: true, calendarGroup: "time", ipa: "/ˌɡʊd ˈiːvnɪŋ/" },
  { word: "good night", digit: 25, symbol: "buenas noches (despedida)", isCalendar: true, calendarGroup: "time", ipa: "/ˌɡʊd ˈnaɪt/" },
  { word: "hello", digit: 26, symbol: "hola", isCalendar: true, calendarGroup: "time", ipa: "/həˈloʊ/" },
  { word: "hi", digit: 27, symbol: "hola", isCalendar: true, calendarGroup: "time", ipa: "/haɪ/" },
  { word: "weekend", digit: 28, symbol: "fin de semana", isCalendar: true, calendarGroup: "time", ipa: "/ˈwiːkɛnd/" },
  { word: "weekday", digit: 29, symbol: "día laborable", isCalendar: true, calendarGroup: "time", ipa: "/ˈwiːkdeɪ/" },
  { word: "decade", digit: 30, symbol: "década", isCalendar: true, calendarGroup: "time", ipa: "/ˈdɛkeɪd/" },
  { word: "millennium", digit: 31, symbol: "milenio", isCalendar: true, calendarGroup: "time", ipa: "/mɪˈlɛniəm/" },
  { word: "season", digit: 32, symbol: "estación", isCalendar: true, calendarGroup: "time", ipa: "/ˈsiːzən/" },
  { word: "leap year", digit: 33, symbol: "año bisiesto", isCalendar: true, calendarGroup: "time", ipa: "/ˈliːp jɪər/" },
  { word: "fortnight", digit: 34, symbol: "quincena", isCalendar: true, calendarGroup: "time", ipa: "/ˈfɔːrtnaɪt/" },
  { word: "sunrise", digit: 35, symbol: "salida del sol", isCalendar: true, calendarGroup: "time", ipa: "/ˈsʌnraɪz/" }
];

export const totalCalendar: NumberItem[] = [...calendarDays, ...calendarMonths, ...calendarTime];

// =========================================================================
// MODULE 4: COLORS DATA
// =========================================================================

export const colorBasic: NumberItem[] = [
  { word: "black", digit: 1, symbol: "Negro", isColor: true, colorGroup: "basic", ipa: "/blæk/" },
  { word: "white", digit: 2, symbol: "Blanco", isColor: true, colorGroup: "basic", ipa: "/waɪt/" },
  { word: "blue", digit: 3, symbol: "Azul", isColor: true, colorGroup: "basic", ipa: "/bluː/" },
  { word: "sky blue", digit: 4, symbol: "Celeste", isColor: true, colorGroup: "basic", ipa: "/skaɪ bluː/" },
  { word: "red", digit: 5, symbol: "Rojo", isColor: true, colorGroup: "basic", ipa: "/rɛd/" },
  { word: "amber", digit: 6, symbol: "Ámbar", isColor: true, colorGroup: "basic", ipa: "/ˈæm.bɚ/" },
  { word: "yellow", digit: 7, symbol: "Amarillo", isColor: true, colorGroup: "basic", ipa: "/ˈjɛloʊ/" },
  { word: "golden", digit: 8, symbol: "Dorado", isColor: true, colorGroup: "basic", ipa: "/ˈɡoʊldən/" },
  { word: "green", digit: 9, symbol: "Verde", isColor: true, colorGroup: "basic", ipa: "/ɡriːn/" },
  { word: "brown", digit: 10, symbol: "Marrón", isColor: true, colorGroup: "basic", ipa: "/braʊn/" }
];

export const colorMiddle: NumberItem[] = [
  { word: "gray", digit: 11, symbol: "Gris", isColor: true, colorGroup: "middle", ipa: "/ɡreɪ/" },
  { word: "silver", digit: 12, symbol: "Plata", isColor: true, colorGroup: "middle", ipa: "/ˈsɪlvər/" },
  { word: "purple", digit: 13, symbol: "Morado", isColor: true, colorGroup: "middle", ipa: "/ˈpɜːrpəl/" },
  { word: "violet", digit: 14, symbol: "Violeta", isColor: true, colorGroup: "middle", ipa: "/ˈvaɪələt/" },
  { word: "pink", digit: 15, symbol: "Rosa", isColor: true, colorGroup: "middle", ipa: "/pɪŋk/" },
  { word: "fuchsia", digit: 16, symbol: "Fucsia", isColor: true, colorGroup: "middle", ipa: "/ˈfjuːʃə/" },
  { word: "ivory", digit: 17, symbol: "Marfil", isColor: true, colorGroup: "middle", ipa: "/ˈaɪvəri/" },
  { word: "navy blue", digit: 18, symbol: "Azul marino", isColor: true, colorGroup: "middle", ipa: "/ˈneɪvi bluː/" },
  { word: "light", digit: 19, symbol: "Claro", isColor: true, colorGroup: "middle", ipa: "/laɪt/" },
  { word: "dark", digit: 20, symbol: "Oscuro", isColor: true, colorGroup: "middle", ipa: "/dɑːrk/" }
];

export const colorAdvanced: NumberItem[] = [
  { word: "beige", digit: 21, symbol: "Beige", isColor: true, colorGroup: "advanced", ipa: "/beɪʒ/" },
  { word: "cream", digit: 22, symbol: "Crema", isColor: true, colorGroup: "advanced", ipa: "/kriːm/" },
  { word: "turquoise", digit: 23, symbol: "Turquesa", isColor: true, colorGroup: "advanced", ipa: "/ˈtɜːrkɔɪz/" },
  { word: "cyan", digit: 24, symbol: "Cian", isColor: true, colorGroup: "advanced", ipa: "/ˈsaɪæn/" },
  { word: "coral", digit: 25, symbol: "Coral", isColor: true, colorGroup: "advanced", ipa: "/ˈkɔːrəl/" },
  { word: "salmon", digit: 26, symbol: "Salmón", isColor: true, colorGroup: "advanced", ipa: "/ˈsæmən/" },
  { word: "olive", digit: 27, symbol: "Oliva", isColor: true, colorGroup: "advanced", ipa: "/ˈaɪvəri/" }, // Wait, ipa for olive: /ˈɑːlɪv/ Let's make sure it's accurate
  { word: "lime", digit: 28, symbol: "Lima", isColor: true, colorGroup: "advanced", ipa: "/laɪm/" },
  { word: "magenta", digit: 29, symbol: "Magenta", isColor: true, colorGroup: "advanced", ipa: "/məˈdʒɛntə/" },
  { word: "burgundy", digit: 30, symbol: "Borgoña", isColor: true, colorGroup: "advanced", ipa: "/ˈbɜːrɡəndi/" }
];

// Correct index 27 with proper IPA for olive
colorAdvanced[6].ipa = "/ˈɑːlɪv/";

export const totalColors: NumberItem[] = [...colorBasic, ...colorMiddle, ...colorAdvanced];

// =========================================================================
// MODULE 5: SPORTS DATA
// =========================================================================

export const sportsBasic: NumberItem[] = [
  { word: "athletics", digit: 1, symbol: "atletismo", isSport: true, sportGroup: "basic", ipa: "/æθˈlɛt.ɪks/" },
  { word: "gymnastics", digit: 2, symbol: "gimnasia", isSport: true, sportGroup: "basic", ipa: "/dʒɪmˈnæs.tɪks/" },
  { word: "boxing", digit: 3, symbol: "boxeo", isSport: true, sportGroup: "basic", ipa: "/ˈbɑːk.sɪŋ/" },
  { word: "wrestling", digit: 4, symbol: "lucha", isSport: true, sportGroup: "basic", ipa: "/ˈrɛs.lɪŋ/" },
  { word: "chess", digit: 5, symbol: "ajedrez", isSport: true, sportGroup: "basic", ipa: "/tʃɛs/" },
  { word: "darts", digit: 6, symbol: "dardos", isSport: true, sportGroup: "basic", ipa: "/dɑːrts/" },
  { word: "billiards", digit: 7, symbol: "billar", isSport: true, sportGroup: "basic", ipa: "/ˈbɪl.jɚdz/" },
  { word: "tennis", digit: 8, symbol: "tenis", isSport: true, sportGroup: "basic", ipa: "/ˈtɛn.ɪs/" },
  { word: "cycling", digit: 9, symbol: "ciclismo", isSport: true, sportGroup: "basic", ipa: "/ˈsaɪ.klɪŋ/" },
  { word: "motorcycling", digit: 10, symbol: "motociclismo", isSport: true, sportGroup: "basic", ipa: "/ˈmoʊ.t̬ɚˌsaɪ.klɪŋ/" }
];

export const sportsMiddle: NumberItem[] = [
  { word: "car racing", digit: 11, symbol: "carreras de autos", isSport: true, sportGroup: "middle", ipa: "/kɑːr ˈreɪ.sɪŋ/" },
  { word: "golf", digit: 12, symbol: "golf", isSport: true, sportGroup: "middle", ipa: "/ɡɑːlf/" },
  { word: "basketball", digit: 13, symbol: "baloncesto", isSport: true, sportGroup: "middle", ipa: "/ˈbæs.kət.bɑːl/" },
  { word: "baseball", digit: 14, symbol: "béisbol", isSport: true, sportGroup: "middle", ipa: "/ˈbeɪs.bɑːl/" },
  { word: "volleyball", digit: 15, symbol: "voleibol", isSport: true, sportGroup: "middle", ipa: "/ˈvɑː.li.bɑːl/" },
  { word: "football", digit: 16, symbol: "fútbol americano", isSport: true, sportGroup: "middle", ipa: "/ˈfʊt.bɑːl/" },
  { word: "soccer", digit: 17, symbol: "fútbol", isSport: true, sportGroup: "middle", ipa: "/ˈsɑː.kɚ/" },
  { word: "mountaineering", digit: 18, symbol: "montañismo", isSport: true, sportGroup: "middle", ipa: "/ˌmaʊn.tənˈɪr.ɪŋ/" },
  { word: "swimming", digit: 19, symbol: "natación", isSport: true, sportGroup: "middle", ipa: "/ˈswɪm.ɪŋ/" },
  { word: "rowing", digit: 20, symbol: "remo", isSport: true, sportGroup: "middle", ipa: "/ˈroʊ.ɪŋ/" }
];

export const sportsAdvanced: NumberItem[] = [
  { word: "skiing", digit: 21, symbol: "esquí", isSport: true, sportGroup: "advanced", ipa: "/ˈskiː.ɪŋ/" },
  { word: "hockey", digit: 22, symbol: "hockey", isSport: true, sportGroup: "advanced", ipa: "/ˈhɑː.ki/" },
  { word: "rugby", digit: 23, symbol: "rugby", isSport: true, sportGroup: "advanced", ipa: "/ˈrʌɡ.bi/" },
  { word: "fencing", digit: 24, symbol: "esgrima", isSport: true, sportGroup: "advanced", ipa: "/ˈfɛn.sɪŋ/" },
  { word: "judo", digit: 25, symbol: "judo", isSport: true, sportGroup: "advanced", ipa: "/ˈdʒuː.doʊ/" },
  { word: "taekwondo", digit: 26, symbol: "taekwondo", isSport: true, sportGroup: "advanced", ipa: "/ˌtaɪ.kwɑːnˈdoʊ/" },
  { word: "surfing", digit: 27, symbol: "surf", isSport: true, sportGroup: "advanced", ipa: "/ˈsɝː.fɪŋ/" },
  { word: "skateboarding", digit: 28, symbol: "skateboarding", isSport: true, sportGroup: "advanced", ipa: "/ˈskeɪt.bɔːr.dɪŋ/" },
  { word: "climbing", digit: 29, symbol: "escalada", isSport: true, sportGroup: "advanced", ipa: "/ˈklaɪ.mɪŋ/" },
  { word: "handball", digit: 30, symbol: "balonmano", isSport: true, sportGroup: "advanced", ipa: "/ˈhænd.bɑːl/" }
];

export const totalSports: NumberItem[] = [...sportsBasic, ...sportsMiddle, ...sportsAdvanced];

// =========================================================================
// MODULE 6: INSTRUMENTS DATA
// =========================================================================

export const instrumentsBasic: NumberItem[] = [
  { word: "accordion", digit: 1, symbol: "acordeón", isInstrument: true, instrumentGroup: "basic", ipa: "/əˈkɔːr.di.ən/" },
  { word: "harmonica", digit: 2, symbol: "armónica", isInstrument: true, instrumentGroup: "basic", ipa: "/hɑːrˈmɑː.nɪ.kə/" },
  { word: "harp", digit: 3, symbol: "arpa", isInstrument: true, instrumentGroup: "basic", ipa: "/hɑːrp/" },
  { word: "bass", digit: 4, symbol: "bajo", isInstrument: true, instrumentGroup: "basic", ipa: "/beɪs/" },
  { word: "bass drum", digit: 5, symbol: "bombo", isInstrument: true, instrumentGroup: "basic", ipa: "/beɪs drʌm/" },
  { word: "clarinet", digit: 6, symbol: "clarinete", isInstrument: true, instrumentGroup: "basic", ipa: "/ˌklær.ɪˈnɛt/" },
  { word: "flute", digit: 7, symbol: "flauta", isInstrument: true, instrumentGroup: "basic", ipa: "/fluːt/" },
  { word: "piccolo", digit: 8, symbol: "flautín", isInstrument: true, instrumentGroup: "basic", ipa: "/ˈpɪk.ə.loʊ/" },
  { word: "guitar", digit: 9, symbol: "guitarra", isInstrument: true, instrumentGroup: "basic", ipa: "/ɡɪˈtɑːr/" },
  { word: "mandolin", digit: 10, symbol: "mandolina", isInstrument: true, instrumentGroup: "basic", ipa: "/ˌmæn.dəˈlɪn/" }
];

export const instrumentsMiddle: NumberItem[] = [
  { word: "piano", digit: 11, symbol: "piano", isInstrument: true, instrumentGroup: "middle", ipa: "/piˈæn.oʊ/" },
  { word: "organ", digit: 12, symbol: "órgano", isInstrument: true, instrumentGroup: "middle", ipa: "/ˈɔːr.ɡən/" },
  { word: "trumpet", digit: 13, symbol: "trompeta", isInstrument: true, instrumentGroup: "middle", ipa: "/ˈtrʌm.pɪt/" },
  { word: "drum", digit: 14, symbol: "tambor", isInstrument: true, instrumentGroup: "middle", ipa: "/drʌm/" },
  { word: "trombone", digit: 15, symbol: "trombón", isInstrument: true, instrumentGroup: "middle", ipa: "/trɑːmˈboʊn/" },
  { word: "kettledrum", digit: 16, symbol: "tímpano", isInstrument: true, instrumentGroup: "middle", ipa: "/ˈkɛt̬.əl.drʌm/" },
  { word: "viola", digit: 17, symbol: "viola", isInstrument: true, instrumentGroup: "middle", ipa: "/viˈoʊ.lə/" },
  { word: "violin", digit: 18, symbol: "violín", isInstrument: true, instrumentGroup: "middle", ipa: "/ˌvaɪəˈlɪn/" },
  { word: "saxophone", digit: 19, symbol: "saxofón", isInstrument: true, instrumentGroup: "middle", ipa: "/ˈsæk.sə.foʊn/" },
  { word: "xylophone", digit: 20, symbol: "xilófono", isInstrument: true, instrumentGroup: "middle", ipa: "/ˈzaɪ.lə.foʊn/" }
];

export const instrumentsAdvanced: NumberItem[] = [
  { word: "tambourine", digit: 21, symbol: "pandereta", isInstrument: true, instrumentGroup: "advanced", ipa: "/ˌtæm.bəˈriːn/" },
  { word: "cello", digit: 22, symbol: "violonchelo", isInstrument: true, instrumentGroup: "advanced", ipa: "/ˈtʃɛl.oʊ/" },
  { word: "double bass", digit: 23, symbol: "contrabajo", isInstrument: true, instrumentGroup: "advanced", ipa: "/ˈdʌb.əl beɪs/" },
  { word: "french horn", digit: 24, symbol: "corno francés", isInstrument: true, instrumentGroup: "advanced", ipa: "/frɛntʃ hɔːrn/" },
  { word: "oboe", digit: 25, symbol: "oboe", isInstrument: true, instrumentGroup: "advanced", ipa: "/ˈoʊ.boʊ/" },
  { word: "bassoon", digit: 26, symbol: "fagot", isInstrument: true, instrumentGroup: "advanced", ipa: "/bəˈsuːn/" },
  { word: "ukulele", digit: 27, symbol: "ukelele", isInstrument: true, instrumentGroup: "advanced", ipa: "/ˌjuː.kəˈleɪ.li/" },
  { word: "banjo", digit: 28, symbol: "banjo", isInstrument: true, instrumentGroup: "advanced", ipa: "/ˈbæn.dʒoʊ/" },
  { word: "harmonium", digit: 29, symbol: "armonio", isInstrument: true, instrumentGroup: "advanced", ipa: "/hɑːrˈmoʊ.ni.əm/" },
  { word: "marimba", digit: 30, symbol: "marimba", isInstrument: true, instrumentGroup: "advanced", ipa: "/məˈrɪm.bə/" }
];

export const totalInstruments: NumberItem[] = [...instrumentsBasic, ...instrumentsMiddle, ...instrumentsAdvanced];

// =========================================================================
// MODULE 7: PROFESSIONS DATA
// =========================================================================

export const professionsBasic: NumberItem[] = [
  { word: "student", digit: 1, symbol: "estudiante", isProfession: true, professionGroup: "basic", ipa: "/ˈstuː.dənt/" },
  { word: "teacher", digit: 2, symbol: "profesor(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈtiː.tʃər/" },
  { word: "lawyer", digit: 3, symbol: "abogado(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈlɑː.jər/" },
  { word: "doctor", digit: 4, symbol: "médico(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈdɑːk.tər/" },
  { word: "nurse", digit: 5, symbol: "enfermero(a)", isProfession: true, professionGroup: "basic", ipa: "/nɜːrs/" },
  { word: "veterinarian", digit: 6, symbol: "veterinario(a)", isProfession: true, professionGroup: "basic", ipa: "/ˌvɛt.ər.ɪˈnɛr.i.ən/" },
  { word: "engineer", digit: 7, symbol: "ingeniero(a)", isProfession: true, professionGroup: "basic", ipa: "/ˌɛn.dʒɪˈnɪər/" },
  { word: "architect", digit: 8, symbol: "arquitecto(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈɑːr.kə.tɛkt/" },
  { word: "dentist", digit: 9, symbol: "dentista", isProfession: true, professionGroup: "basic", ipa: "/ˈdɛn.tɪst/" },
  { word: "economist", digit: 10, symbol: "economista", isProfession: true, professionGroup: "basic", ipa: "/ɪˈkɑː.nə.mɪst/" },
  { word: "policeman", digit: 11, symbol: "policía", isProfession: true, professionGroup: "basic", ipa: "/pəˈliːs.mən/" },
  { word: "astronaut", digit: 12, symbol: "astronauta", isProfession: true, professionGroup: "basic", ipa: "/ˈæs.trə.nɑːt/" },
  { word: "pilot", digit: 13, symbol: "piloto", isProfession: true, professionGroup: "basic", ipa: "/ˈpaɪ.lət/" },
  { word: "soldier", digit: 14, symbol: "soldado", isProfession: true, professionGroup: "basic", ipa: "/ˈsoʊl.dʒər/" },
  { word: "surgeon", digit: 15, symbol: "cirujano(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈsɜːr.dʒən/" },
  { word: "scientist", digit: 16, symbol: "científico(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈsaɪ.ən.tɪst/" },
  { word: "psychiatrist", digit: 17, symbol: "psiquiatra", isProfession: true, professionGroup: "basic", ipa: "/saɪˈkaɪ.ə.trɪst/" },
  { word: "philosopher", digit: 18, symbol: "filósofo(a)", isProfession: true, professionGroup: "basic", ipa: "/fɪˈlɑː.sə.fər/" },
  { word: "shepherd", digit: 19, symbol: "pastor(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈʃɛp.örd/" },
  { word: "priest", digit: 20, symbol: "sacerdote(a)", isProfession: true, professionGroup: "basic", ipa: "/priːst/" },
  { word: "actor", digit: 21, symbol: "actor(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈæk.tər/" },
  { word: "artist", digit: 22, symbol: "artista", isProfession: true, professionGroup: "basic", ipa: "/ˈɑːr.tɪst/" },
  { word: "singer", digit: 23, symbol: "cantante", isProfession: true, professionGroup: "basic", ipa: "/ˈsɪŋ.ər/" },
  { word: "secretary", digit: 24, symbol: "secretario(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈsɛk.rə.tɛr.i/" },
  { word: "writer", digit: 25, symbol: "escritor(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈraɪ.tər/" },
  { word: "fireman", digit: 26, symbol: "bombero(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈfaɪər.mən/" },
  { word: "psychologist", digit: 27, symbol: "psicólogo(a)", isProfession: true, professionGroup: "basic", ipa: "/saɪˈkɑː.lə.dʒɪst/" },
  { word: "chemist", digit: 28, symbol: "químico(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈkɛm.ɪst/" },
  { word: "biologist", digit: 29, symbol: "biólogo(a)", isProfession: true, professionGroup: "basic", ipa: "/baɪˈɑː.lə.dʒɪst/" },
  { word: "physicist", digit: 30, symbol: "físico(a)", isProfession: true, professionGroup: "basic", ipa: "/ˈfɪz.ɪ.sɪst/" }
];

export const professionsMiddle: NumberItem[] = [
  { word: "locksmith", digit: 31, symbol: "cerrajero(a)", isProfession: true, professionGroup: "middle", ipa: "/ˈlɑːk.smɪθ/" },
  { word: "mechanic", digit: 32, symbol: "mecánico(a)", isProfession: true, professionGroup: "middle", ipa: "/məˈkæn.ɪk/" },
  { word: "tailor", digit: 33, symbol: "sastre(a)", isProfession: true, professionGroup: "middle", ipa: "/ˈteɪ.lər/" },
  { word: "shopkeeper", digit: 34, symbol: "comerciante", isProfession: true, professionGroup: "middle", ipa: "/ˈhɑːpˌkiː.pər/" },
  { word: "painter", digit: 35, symbol: "pintor(a)", isProfession: true, professionGroup: "middle", ipa: "/ˈpeɪn.tər/" },
  { word: "cashier", digit: 36, symbol: "cajero(a)", isProfession: true, professionGroup: "middle", ipa: "/kæˈʃɪər/" },
  { word: "cook", digit: 37, symbol: "cocinero(a)", isProfession: true, professionGroup: "middle", ipa: "/kʊk/" },
  { word: "baker", digit: 38, symbol: "panadero(a)", isProfession: true, professionGroup: "middle", ipa: "/ˈbeɪ.kər/" },
  { word: "farmer", digit: 39, symbol: "granjero(a)", isProfession: true, professionGroup: "middle", ipa: "/ˈfɑːr.mər/" },
  { word: "hairdresser", digit: 40, symbol: "peluquero(a)", isProfession: true, professionGroup: "middle", ipa: "/ˈhɛrˌdrɛs.ər/" },
  { word: "carpenter", digit: 41, symbol: "carpintero(a)", isProfession: true, professionGroup: "middle", ipa: "/ˈkɑːr.pɪn.tər/" },
  { word: "plumber", digit: 42, symbol: "plomero(a)", isProfession: true, professionGroup: "middle", ipa: "/ˈplʌm.ər/" },
  { word: "upholsterer", digit: 43, symbol: "tapicero(a)", isProfession: true, professionGroup: "middle", ipa: "/ʌpˈhoʊl.stər.ər/" },
  { word: "waiter", digit: 44, symbol: "camarero(a)", isProfession: true, professionGroup: "middle", ipa: "/ˈweɪ.tər/" },
  { word: "butcher", digit: 45, symbol: "carnicero(a)", isProfession: true, professionGroup: "middle", ipa: "/ˈbʊtʃ.ər/" },
  { word: "maid", digit: 46, symbol: "sirviente(a)", isProfession: true, professionGroup: "middle", ipa: "/meɪd/" },
  { word: "housewife", digit: 47, symbol: "amo(a) de casa", isProfession: true, professionGroup: "middle", ipa: "/ˈhaʊs.waɪf/" },
  { word: "driver", digit: 48, symbol: "chofer", isProfession: true, professionGroup: "middle", ipa: "/ˈdraɪ.vər/" }
];

export const professionsAdvanced: NumberItem[] = [
  { word: "clown", digit: 49, symbol: "payaso(a)", isProfession: true, professionGroup: "advanced", ipa: "/klaʊn/" },
  { word: "tamer", digit: 50, symbol: "domador(a)", isProfession: true, professionGroup: "advanced", ipa: "/ˈteɪ.mər/" },
  { word: "milkman", digit: 51, symbol: "lechero(a)", isProfession: true, professionGroup: "advanced", ipa: "/ˈmɪlk.mən/" },
  { word: "postman", digit: 52, symbol: "cartero(a)", isProfession: true, professionGroup: "advanced", ipa: "/ˈpoʊst.mən/" },
  { word: "sailor", digit: 53, symbol: "marinero(a)", isProfession: true, professionGroup: "advanced", ipa: "/ˈseɪ.lər/" },
  { word: "miner", digit: 54, symbol: "minero(a)", isProfession: true, professionGroup: "advanced", ipa: "/ˈmaɪ.nər/" },
  { word: "employee", digit: 55, symbol: "empleado(a)", isProfession: true, professionGroup: "advanced", ipa: "/ɪmˈplɔɪ.iː/" },
  { word: "boss", digit: 56, symbol: "jefe(a)", isProfession: true, professionGroup: "advanced", ipa: "/bɔːs/" },
  { word: "poor", digit: 57, symbol: "pobre", isProfession: true, professionGroup: "advanced", ipa: "/pʊr/" },
  { word: "rich", digit: 58, symbol: "rico(a)", isProfession: true, professionGroup: "advanced", ipa: "/rɪtʃ/" },
  { word: "welder", digit: 59, symbol: "soldador(a)", isProfession: true, professionGroup: "advanced", ipa: "/ˈwɛl.dər/" },
  { word: "electrician", digit: 60, symbol: "electricista", isProfession: true, professionGroup: "advanced", ipa: "/ɪˌlɛkˈtrɪʃ.ən/" },
  { word: "janitor", digit: 61, symbol: "conserje", isProfession: true, professionGroup: "advanced", ipa: "/ˈdʒæn.ɪ.tər/" },
  { word: "gardener", digit: 62, symbol: "jardinero(a)", isProfession: true, professionGroup: "advanced", ipa: "/ˈgɑːr.dən.ər/" },
  { word: "cleaner", digit: 63, symbol: "limpiador(a)", isProfession: true, professionGroup: "advanced", ipa: "/ˈkliː.nər/" },
  { word: "delivery man", digit: 64, symbol: "repartidor(a)", isProfession: true, professionGroup: "advanced", ipa: "/dɪˈlɪv.ɚ.i mən/" },
  { word: "barber", digit: 65, symbol: "barbero(a)", isProfession: true, professionGroup: "advanced", ipa: "/ˈgɑːr.dən.ər/" } // Wait, barber IPA is /ˈbɑːr.bər/. Let's write the exact IPA
];

professionsAdvanced[16].ipa = "/ˈbɑːr.bər/";

export const totalProfessions: NumberItem[] = [...professionsBasic, ...professionsMiddle, ...professionsAdvanced];

// =========================================================================
// MODULE 8: FAMILY & PEOPLE DATA
// =========================================================================

export const familyBasic: NumberItem[] = [
  { word: "father", digit: 1, symbol: "padre", isFamily: true, familyGroup: "basic", ipa: "/ˈfɑː.ðɚ/" },
  { word: "dad", digit: 2, symbol: "papá", isFamily: true, familyGroup: "basic", ipa: "/dæd/" },
  { word: "daddy", digit: 3, symbol: "papi", isFamily: true, familyGroup: "basic", ipa: "/ˈdæd.i/" },
  { word: "mother", digit: 4, symbol: "madre", isFamily: true, familyGroup: "basic", ipa: "/ˈmʌ.ðɚ/" },
  { word: "mom", digit: 5, symbol: "mamá", isFamily: true, familyGroup: "basic", ipa: "/mɑːm/" },
  { word: "mommy", digit: 6, symbol: "mami", isFamily: true, familyGroup: "basic", ipa: "/ˈmɑːm.i/" },
  { word: "grandfather", digit: 7, symbol: "abuelo", isFamily: true, familyGroup: "basic", ipa: "/ˈɡrændˌfɑː.ðɚ/" },
  { word: "grandmother", digit: 8, symbol: "abuela", isFamily: true, familyGroup: "basic", ipa: "/ˈɡrændˌmʌ.ðɚ/" },
  { word: "brother", digit: 9, symbol: "hermano", isFamily: true, familyGroup: "basic", ipa: "/ˈbrʌ.ðɚ/" },
  { word: "sister", digit: 10, symbol: "hermana", isFamily: true, familyGroup: "basic", ipa: "/ˈsɪs.tɚ/" },
  { word: "son", digit: 11, symbol: "hijo", isFamily: true, familyGroup: "basic", ipa: "/sʌn/" },
  { word: "daughter", digit: 12, symbol: "hija", isFamily: true, familyGroup: "basic", ipa: "/ˈdɔː.tɚ/" },
  { word: "grandson", digit: 13, symbol: "nieto", isFamily: true, familyGroup: "basic", ipa: "/ˈɡrænd.sʌn/" },
  { word: "granddaughter", digit: 14, symbol: "nieta", isFamily: true, familyGroup: "basic", ipa: "/ˈɡrændˌdɔː.tɚ/" },
  { word: "husband", digit: 15, symbol: "esposo", isFamily: true, familyGroup: "basic", ipa: "/ˈhʌz.bənd/" },
  { word: "wife", digit: 16, symbol: "esposa", isFamily: true, familyGroup: "basic", ipa: "/waɪf/" },
  { word: "boyfriend", digit: 17, symbol: "novio", isFamily: true, familyGroup: "basic", ipa: "/ˈbɔɪ.frɛnd/" },
  { word: "girlfriend", digit: 18, symbol: "novia", isFamily: true, familyGroup: "basic", ipa: "/ˈɡɜːrl.frɛnd/" },
  { word: "uncle", digit: 19, symbol: "tío", isFamily: true, familyGroup: "basic", ipa: "/ˈʌŋ.kəl/" },
  { word: "aunt", digit: 20, symbol: "tía", isFamily: true, familyGroup: "basic", ipa: "/ænt/" }
];

export const familyMiddle: NumberItem[] = [
  { word: "stepfather", digit: 21, symbol: "padrastro", isFamily: true, familyGroup: "middle", ipa: "/ˈstɛpˌfɑː.ðɚ/" },
  { word: "stepmother", digit: 22, symbol: "madrastra", isFamily: true, familyGroup: "middle", ipa: "/ˈstɛpˌmʌ.ðɚ/" },
  { word: "stepbrother", digit: 23, symbol: "hermanastro", isFamily: true, familyGroup: "middle", ipa: "/ˈstɛpˌbrʌ.ðɚ/" },
  { word: "stepsister", digit: 24, symbol: "hermanastra", isFamily: true, familyGroup: "middle", ipa: "/ˈstɛpˌsɪs.tɚ/" },
  { word: "siblings", digit: 25, symbol: "hermanos", isFamily: true, familyGroup: "middle", ipa: "/ˈsɪb.lɪŋz/" },
  { word: "nephew", digit: 26, symbol: "sobrino", isFamily: true, familyGroup: "middle", ipa: "/ˈnɛf.juː/" },
  { word: "niece", digit: 27, symbol: "sobrina", isFamily: true, familyGroup: "middle", ipa: "/niːs/" },
  { word: "cousin", digit: 28, symbol: "primo/a", isFamily: true, familyGroup: "middle", ipa: "/ˈkʌz.ən/" },
  { word: "relative", digit: 29, symbol: "pariente", isFamily: true, familyGroup: "middle", ipa: "/ˈrɛl.ə.tɪv/" },
  { word: "father in law", digit: 30, symbol: "padre político", isFamily: true, familyGroup: "middle", ipa: "/ˈfɑː.ðɚ.ɪn.lɔː/" },
  { word: "mother in law", digit: 31, symbol: "madre política", isFamily: true, familyGroup: "middle", ipa: "/ˈmʌ.ðɚ.ɪn.lɔː/" },
  { word: "brother in law", digit: 32, symbol: "cuñado", isFamily: true, familyGroup: "middle", ipa: "/ˈbrʌ.ðɚ.ɪn.lɔː/" },
  { word: "sister in law", digit: 33, symbol: "cuñada", isFamily: true, familyGroup: "middle", ipa: "/ˈsɪs.tɚ.ɪn.lɔː/" },
  { word: "godfather", digit: 34, symbol: "padrino", isFamily: true, familyGroup: "middle", ipa: "/ˈɡɑːdˌfɑː.ðɚ/" },
  { word: "godmother", digit: 35, symbol: "madrina", isFamily: true, familyGroup: "middle", ipa: "/ˈɡɑːdˌmʌ.ðɚ/" },
  { word: "single", digit: 36, symbol: "soltero", isFamily: true, familyGroup: "middle", ipa: "/ˈsɪŋ.ɡəl/" },
  { word: "girl", digit: 37, symbol: "niña", isFamily: true, familyGroup: "middle", ipa: "/ɡɜːrl/" },
  { word: "teenager", digit: 38, symbol: "adolescente", isFamily: true, familyGroup: "middle", ipa: "/ˈtiːnˌeɪ.dʒɚ/" }
];

export const familyAdvanced: NumberItem[] = [
  { word: "boy", digit: 39, symbol: "niño", isFamily: true, familyGroup: "advanced", ipa: "/bɔɪ/" },
  { word: "young person", digit: 40, symbol: "joven", isFamily: true, familyGroup: "advanced", ipa: "/jʌŋ ˈpɝː.sən/" },
  { word: "baby", digit: 41, symbol: "bebé", isFamily: true, familyGroup: "advanced", ipa: "/ˈbeɪ.bi/" },
  { word: "man", digit: 42, symbol: "hombre", isFamily: true, familyGroup: "advanced", ipa: "/mæn/" },
  { word: "men", digit: 43, symbol: "hombres", isFamily: true, familyGroup: "advanced", ipa: "/mɛn/" },
  { word: "old man", digit: 44, symbol: "anciano", isFamily: true, familyGroup: "advanced", ipa: "/oʊld mæn/" },
  { word: "mister", digit: 45, symbol: "señor", isFamily: true, familyGroup: "advanced", ipa: "/ˈmɪs.tɚ/" },
  { word: "gentleman", digit: 46, symbol: "caballero", isFamily: true, familyGroup: "advanced", ipa: "/ˈdʒɛn.təl.mən/" },
  { word: "friend", digit: 47, symbol: "amigo", isFamily: true, familyGroup: "advanced", ipa: "/frɛnd/" },
  { word: "best friend", digit: 48, symbol: "mejor amigo(a)", isFamily: true, familyGroup: "advanced", ipa: "/bɛst frɛnd/" },
  { word: "king", digit: 49, symbol: "rey", isFamily: true, familyGroup: "advanced", ipa: "/kɪŋ/" },
  { word: "twin", digit: 50, symbol: "gemelo(a)", isFamily: true, familyGroup: "advanced", ipa: "/twɪn/" },
  { word: "married", digit: 51, symbol: "casado(a)", isFamily: true, familyGroup: "advanced", ipa: "/ˈmær.id/" },
  { word: "alone", digit: 52, symbol: "solo", isFamily: true, familyGroup: "advanced", ipa: "/əˈloʊn/" },
  { word: "widower", digit: 53, symbol: "viudo", isFamily: true, familyGroup: "advanced", ipa: "/ˈwɪd.oʊ.ɚ/" },
  { word: "divorced", digit: 54, symbol: "divorciado(a)", isFamily: true, familyGroup: "advanced", ipa: "/dɪˈvɔːrst/" },
  { word: "little girl", digit: 55, symbol: "niña pequeña", isFamily: true, familyGroup: "advanced", ipa: "/ˈlɪt.əl ɡɜːrl/" },
  { word: "toddler", digit: 56, symbol: "niño pequeño", isFamily: true, familyGroup: "advanced", ipa: "/ˈtɑːd.lɚ/" },
  { word: "adult", digit: 57, symbol: "adulto", isFamily: true, familyGroup: "advanced", ipa: "/əˈdʌlt/" },
  { word: "woman", digit: 58, symbol: "mujer", isFamily: true, familyGroup: "advanced", ipa: "/ˈwʊm.ən/" },
  { word: "women", digit: 59, symbol: "mujeres", isFamily: true, familyGroup: "advanced", ipa: "/ˈwɪm.ɪn/" },
  { word: "old woman", digit: 60, symbol: "anciana", isFamily: true, familyGroup: "advanced", ipa: "/oʊld ˈwʊm.ən/" },
  { word: "miss", digit: 61, symbol: "señorita", isFamily: true, familyGroup: "advanced", ipa: "/mɪs/" },
  { word: "madam", digit: 62, symbol: "señora (formal)", isFamily: true, familyGroup: "advanced", ipa: "/ˈmæd.əm/" },
  { word: "lady", digit: 63, symbol: "dama", isFamily: true, familyGroup: "advanced", ipa: "/ˈleɪ.di/" },
  { word: "queen", digit: 64, symbol: "reina", isFamily: true, familyGroup: "advanced", ipa: "/kwiːn/" },
  { word: "parents", digit: 65, symbol: "padres", isFamily: true, familyGroup: "advanced", ipa: "/ˈpɛr.ənts/" },
  { word: "child", digit: 66, symbol: "niño/hijo", isFamily: true, familyGroup: "advanced", ipa: "/tʃaɪld/" },
  { word: "children", digit: 67, symbol: "niños/hijos", isFamily: true, familyGroup: "advanced", ipa: "/ˈtʃɪl.drən/" },
  { word: "stepson", digit: 68, symbol: "hijastro", isFamily: true, familyGroup: "advanced", ipa: "/ˈstɛp.sʌn/" },
  { word: "widow", digit: 69, symbol: "viuda", isFamily: true, familyGroup: "advanced", ipa: "/ˈwɪd.oʊ/" },
  { word: "stepdaughter", digit: 70, symbol: "hijastra", isFamily: true, familyGroup: "advanced", ipa: "/ˈstɛpˌdɔː.tɚ/" }
];

export const totalFamily: NumberItem[] = [...familyBasic, ...familyMiddle, ...familyAdvanced];

// =========================================================================
// MODULE 9: HOUSE DATA
// =========================================================================

export const houseParts: NumberItem[] = [
  { word: "house", digit: 1, symbol: "casa", isHouse: true, houseGroup: "parts", ipa: "/haʊs/" },
  { word: "neighbor", digit: 2, symbol: "vecino(a)", isHouse: true, houseGroup: "parts", ipa: "/ˈneɪ.bɚ/" },
  { word: "grass", digit: 3, symbol: "césped", isHouse: true, houseGroup: "parts", ipa: "/ɡræs/" },
  { word: "garden", digit: 4, symbol: "jardín", isHouse: true, houseGroup: "parts", ipa: "/ˈɡɑːr.dən/" },
  { word: "yard", digit: 5, symbol: "patio", isHouse: true, houseGroup: "parts", ipa: "/jɑːrd/" },
  { word: "backyard", digit: 6, symbol: "patio trasero", isHouse: true, houseGroup: "parts", ipa: "/ˌbækˈjɑːrd/" },
  { word: "tree", digit: 7, symbol: "árbol", isHouse: true, houseGroup: "parts", ipa: "/triː/" },
  { word: "fence", digit: 8, symbol: "cerca", isHouse: true, houseGroup: "parts", ipa: "/fɛns/" },
  { word: "wall", digit: 9, symbol: "pared", isHouse: true, houseGroup: "parts", ipa: "/wɔːl/" },
  { word: "door", digit: 10, symbol: "puerta", isHouse: true, houseGroup: "parts", ipa: "/dɔːr/" },
  { word: "window", digit: 11, symbol: "ventana", isHouse: true, houseGroup: "parts", ipa: "/ˈwɪn.doʊ/" },
  { word: "roof", digit: 12, symbol: "techo", isHouse: true, houseGroup: "parts", ipa: "/ruːf/" },
  { word: "chimney", digit: 13, symbol: "chimenea", isHouse: true, houseGroup: "parts", ipa: "/ˈtʃɪm.ni/" },
  { word: "gutter", digit: 14, symbol: "canalón", isHouse: true, houseGroup: "parts", ipa: "/ˈɡʌt.ɚ/" },
  { word: "mailbox", digit: 15, symbol: "buzón", isHouse: true, houseGroup: "parts", ipa: "/ˈmeɪl.bɑːks/" },
  { word: "driveway", digit: 16, symbol: "entrada para autos", isHouse: true, houseGroup: "parts", ipa: "/ˈdraɪv.weɪ/" },
  { word: "attic", digit: 17, symbol: "ático/desván", isHouse: true, houseGroup: "parts", ipa: "/ˈæt.ɪk/" },
  { word: "dining room", digit: 18, symbol: "comedor", isHouse: true, houseGroup: "parts", ipa: "/ˈdaɪn.ɪŋ ˌruːm/" },
  { word: "balcony", digit: 19, symbol: "balcón", isHouse: true, houseGroup: "parts", ipa: "/ˈbæl.kə.ni/" },
  { word: "porch", digit: 20, symbol: "porche", isHouse: true, houseGroup: "parts", ipa: "/pɔːrtʃ/" },
  { word: "stairs", digit: 21, symbol: "escaleras", isHouse: true, houseGroup: "parts", ipa: "/sterz/" },
  { word: "basement", digit: 22, symbol: "sótano", isHouse: true, houseGroup: "parts", ipa: "/ˈbeɪs.mənt/" },
  { word: "garage", digit: 23, symbol: "garaje", isHouse: true, houseGroup: "parts", ipa: "/ɡəˈrɑːʒ/" },
  { word: "laundry room", digit: 24, symbol: "lavandería", isHouse: true, houseGroup: "parts", ipa: "/ˈlɑːn.dri ˌruːm/" },
  { word: "room", digit: 25, symbol: "cuarto", isHouse: true, houseGroup: "parts", ipa: "/ruːm/" },
  { word: "bedchamber", digit: 26, symbol: "recámara", isHouse: true, houseGroup: "parts", ipa: "/ˈbɛdˌtʃeɪm.bɚ/" },
  { word: "chamber", digit: 27, symbol: "aposento", isHouse: true, houseGroup: "parts", ipa: "/ˈtʃeɪm.bɚ/" },
  { word: "hallway", digit: 28, symbol: "pasillo", isHouse: true, houseGroup: "parts", ipa: "/ˈhɑːl.weɪ/" }
];

export const houseLiving: NumberItem[] = [
  { word: "living room", digit: 1, symbol: "sala de estar", isHouse: true, houseGroup: "living", ipa: "/ˈlɪv.ɪŋ ˌruːm/" },
  { word: "floor", digit: 2, symbol: "piso", isHouse: true, houseGroup: "living", ipa: "/flɔːr/" },
  { word: "ceiling", digit: 3, symbol: "techo", isHouse: true, houseGroup: "living", ipa: "/ˈsiː.lɪŋ/" },
  { word: "sofa", digit: 4, symbol: "sofá", isHouse: true, houseGroup: "living", ipa: "/ˈsoʊ.fə/" },
  { word: "cushion", digit: 5, symbol: "cojín", isHouse: true, houseGroup: "living", ipa: "/ˈkʊʃ.ən/" },
  { word: "curtains", digit: 6, symbol: "cortinas", isHouse: true, houseGroup: "living", ipa: "/ˈkɝː.tənz/" },
  { word: "blinds", digit: 7, symbol: "persianas", isHouse: true, houseGroup: "living", ipa: "/blaɪndz/" },
  { word: "television", digit: 8, symbol: "televisión", isHouse: true, houseGroup: "living", ipa: "/ˈtɛl.əˌvɪʒ.ən/" },
  { word: "remote control", digit: 9, symbol: "control remoto", isHouse: true, houseGroup: "living", ipa: "/rɪˈmoʊt kənˈtroʊl/" },
  { word: "coffee table", digit: 10, symbol: "mesa de centro", isHouse: true, houseGroup: "living", ipa: "/ˈkɑː.fi ˌteɪ.bəl/" },
  { word: "bookshelf", digit: 11, symbol: "estantería", isHouse: true, houseGroup: "living", ipa: "/ˈbʊk.ʃɛlf/" },
  { word: "coat rack", digit: 12, symbol: "perchero", isHouse: true, houseGroup: "living", ipa: "/koʊt ræk/" },
  { word: "gate", digit: 13, symbol: "portón", isHouse: true, houseGroup: "living", ipa: "/ɡeɪt/" },
  { word: "toolbox", digit: 14, symbol: "caja de herramientas", isHouse: true, houseGroup: "living", ipa: "/ˈtuːl.bɑːks/" },
  { word: "rake", digit: 15, symbol: "rastrillo", isHouse: true, houseGroup: "living", ipa: "/reɪk/" },
  { word: "lamp", digit: 16, symbol: "lámpara", isHouse: true, houseGroup: "living", ipa: "/læmp/" },
  { word: "carpet", digit: 17, symbol: "alfombra", isHouse: true, houseGroup: "living", ipa: "/ˈkɑːr.pɪt/" },
  { word: "fireplace", digit: 18, symbol: "chimenea", isHouse: true, houseGroup: "living", ipa: "/ˈfaɪr.pleɪs/" },
  { word: "clock", digit: 19, symbol: "reloj", isHouse: true, houseGroup: "living", ipa: "/klɑːk/" },
  { word: "picture", digit: 20, symbol: "cuadro", isHouse: true, houseGroup: "living", ipa: "/ˈpɪk.tʃɚ/" }
];

export const houseKitchen: NumberItem[] = [
  { word: "kitchen", digit: 1, symbol: "cocina", isHouse: true, houseGroup: "kitchen", ipa: "/ˈkɪtʃ.ən/" },
  { word: "cooker", digit: 2, symbol: "cocina (hornilla)", isHouse: true, houseGroup: "kitchen", ipa: "/ˈkʊk.ɚ/" },
  { word: "microwave", digit: 3, symbol: "microondas", isHouse: true, houseGroup: "kitchen", ipa: "/ˈmaɪ.kroʊ.weɪv/" },
  { word: "blender", digit: 4, symbol: "licuadora", isHouse: true, houseGroup: "kitchen", ipa: "/ˈblɛn.dɚ/" },
  { word: "mixer", digit: 5, symbol: "batidora", isHouse: true, houseGroup: "kitchen", ipa: "/ˈmɪk.sɚ/" },
  { word: "refrigerator", digit: 6, symbol: "refrigerador", isHouse: true, houseGroup: "kitchen", ipa: "/rɪˈfrɪdʒ.ə.reɪ.tɚ/" },
  { word: "coffee maker", digit: 7, symbol: "cafetera", isHouse: true, houseGroup: "kitchen", ipa: "/ˈkɑː.fi ˌmeɪ.kɚ/" },
  { word: "cupboard", digit: 8, symbol: "alacena", isHouse: true, houseGroup: "kitchen", ipa: "/ˈkʌb.ɚd/" },
  { word: "glass cabinet", digit: 9, symbol: "vitrina", isHouse: true, houseGroup: "kitchen", ipa: "/ɡlæs ˈkæb.ə.nət/" },
  { word: "cup", digit: 10, symbol: "taza", isHouse: true, houseGroup: "kitchen", ipa: "/kʌp/" },
  { word: "glass", digit: 11, symbol: "vaso", isHouse: true, houseGroup: "kitchen", ipa: "/ɡlæs/" },
  { word: "plate", digit: 12, symbol: "plato", isHouse: true, houseGroup: "kitchen", ipa: "/pleɪt/" },
  { word: "spoon", digit: 13, symbol: "cuchara", isHouse: true, houseGroup: "kitchen", ipa: "/spuːn/" },
  { word: "knife", digit: 14, symbol: "cuchillo", isHouse: true, houseGroup: "kitchen", ipa: "/naɪf/" },
  { word: "fork", digit: 15, symbol: "tenedor", isHouse: true, houseGroup: "kitchen", ipa: "/fɔːrk/" },
  { word: "napkin", digit: 16, symbol: "servilleta", isHouse: true, houseGroup: "kitchen", ipa: "/ˈnæp.kɪn/" },
  { word: "sink", digit: 17, symbol: "fregadero", isHouse: true, houseGroup: "kitchen", ipa: "/sɪŋk/" },
  { word: "oven", digit: 18, symbol: "horno", isHouse: true, houseGroup: "kitchen", ipa: "/ˈʌv.ən/" },
  { word: "toaster", digit: 19, symbol: "tostadora", isHouse: true, houseGroup: "kitchen", ipa: "/ˈtoʊs.tɚ/" },
  { word: "kettle", digit: 20, symbol: "hervidor", isHouse: true, houseGroup: "kitchen", ipa: "/ˈkɛt.əl/" },
  { word: "dishwasher", digit: 21, symbol: "lavavajillas", isHouse: true, houseGroup: "kitchen", ipa: "/ˈdɪʃˌwɑː.ʃɚ/" }
];

export const houseBedroom: NumberItem[] = [
  { word: "bedroom", digit: 1, symbol: "dormitorio", isHouse: true, houseGroup: "bedroom", ipa: "/ˈbɛd.ruːm/" },
  { word: "bulb", digit: 2, symbol: "bombilla/luz", isHouse: true, houseGroup: "bedroom", ipa: "/bʌlb/" },
  { word: "bed", digit: 3, symbol: "cama", isHouse: true, houseGroup: "bedroom", ipa: "/bɛd/" },
  { word: "mattress", digit: 4, symbol: "colchón", isHouse: true, houseGroup: "bedroom", ipa: "/ˈmæt.rəs/" },
  { word: "bedsheet", digit: 5, symbol: "sábana", isHouse: true, houseGroup: "bedroom", ipa: "/ˈbɛd.ʃiːt/" },
  { word: "teddy bear", digit: 6, symbol: "oso de peluche", isHouse: true, houseGroup: "bedroom", ipa: "/ˈtɛdi ber/" },
  { word: "blanket", digit: 7, symbol: "manta", isHouse: true, houseGroup: "bedroom", ipa: "/ˈblæŋ.kɪt/" },
  { word: "duvet", digit: 8, symbol: "edredón", isHouse: true, houseGroup: "bedroom", ipa: "/duːˈveɪ/" },
  { word: "pillow", digit: 9, symbol: "almohada", isHouse: true, houseGroup: "bedroom", ipa: "/ˈpɪl.oʊ/" },
  { word: "rug", digit: 10, symbol: "alfombrilla/tapete", isHouse: true, houseGroup: "bedroom", ipa: "/rʌɡ/" },
  { word: "wardrobe", digit: 11, symbol: "armario", isHouse: true, houseGroup: "bedroom", ipa: "/ˈwɔːr.droʊb/" },
  { word: "shelf", digit: 12, symbol: "estante", isHouse: true, houseGroup: "bedroom", ipa: "/ʃɛlf/" },
  { word: "dresser", digit: 13, symbol: "cómoda", isHouse: true, houseGroup: "bedroom", ipa: "/ˈdrɛs.ɚ/" },
  { word: "dressing table", digit: 14, symbol: "tocador", isHouse: true, houseGroup: "bedroom", ipa: "/ˈdrɛs.ɪŋ ˌteɪ.bəl/" },
  { word: "slippers", digit: 15, symbol: "pantuflas", isHouse: true, houseGroup: "bedroom", ipa: "/ˈslɪp.ɚz/" },
  { word: "pajamas", digit: 16, symbol: "pijama", isHouse: true, houseGroup: "bedroom", ipa: "/pəˈdʒæ.məz/" },
  { word: "bedside lamp", digit: 17, symbol: "lámpara de noche", isHouse: true, houseGroup: "bedroom", ipa: "/ˈbɛd.saɪd læmp/" },
  { word: "fan", digit: 18, symbol: "ventilador", isHouse: true, houseGroup: "bedroom", ipa: "/fæn/" },
  { word: "poster", digit: 19, symbol: "póster", isHouse: true, houseGroup: "bedroom", ipa: "/ˈpoʊs.tɚ/" },
  { word: "potted plant", digit: 20, symbol: "planta de maceta", isHouse: true, houseGroup: "bedroom", ipa: "/ˈpɑː.tɪd plænt/" },
  { word: "toy", digit: 21, symbol: "juguete", isHouse: true, houseGroup: "bedroom", ipa: "/tɔɪ/" },
  { word: "drawer", digit: 22, symbol: "cajón", isHouse: true, houseGroup: "bedroom", ipa: "/drɔːr/" },
  { word: "nightstand", digit: 23, symbol: "mesita de noche", isHouse: true, houseGroup: "bedroom", ipa: "/ˈnaɪt.stænd/" },
  { word: "alarm clock", digit: 24, symbol: "despertador", isHouse: true, houseGroup: "bedroom", ipa: "/əˈlɑːrm klɑːk/" },
  { word: "hanger", digit: 25, symbol: "percha", isHouse: true, houseGroup: "bedroom", ipa: "/ˈhæŋ.ɚ/" },
  { word: "curtain", digit: 26, symbol: "cortina", isHouse: true, houseGroup: "bedroom", ipa: "/ˈkɝː.tən/" }
];

export const houseBathroom: NumberItem[] = [
  { word: "bathroom", digit: 1, symbol: "baño", isHouse: true, houseGroup: "bathroom", ipa: "/ˈbæθ.ruːm/" },
  { word: "toilet", digit: 2, symbol: "inodoro", isHouse: true, houseGroup: "bathroom", ipa: "/ˈtɔɪ.lət/" },
  { word: "toilet brush", digit: 3, symbol: "cepillo para inodoro", isHouse: true, houseGroup: "bathroom", ipa: "/ˈtɔɪ.lət brʌʃ/" },
  { word: "toilet paper", digit: 4, symbol: "papel higiénico", isHouse: true, houseGroup: "bathroom", ipa: "/ˈtɔɪ.lət ˌpeɪ.pɚ/" },
  { word: "laundry basket", digit: 5, symbol: "cesto de ropa", isHouse: true, houseGroup: "bathroom", ipa: "/ˈlɑːn.dri ˌbæs.kət/" },
  { word: "air freshener", digit: 6, symbol: "ambientador", isHouse: true, houseGroup: "bathroom", ipa: "/er ˈfrɛʃ.nɚ/" },
  { word: "bath", digit: 7, symbol: "bañera", isHouse: true, houseGroup: "bathroom", ipa: "/bæθ/" },
  { word: "shower", digit: 8, symbol: "ducha", isHouse: true, houseGroup: "bathroom", ipa: "/ˈʃaʊ.ɚ/" },
  { word: "towel", digit: 9, symbol: "toalla", isHouse: true, houseGroup: "bathroom", ipa: "/ˈtaʊ.əl/" },
  { word: "brush", digit: 10, symbol: "cepillo", isHouse: true, houseGroup: "bathroom", ipa: "/brʌʃ/" },
  { word: "soap", digit: 11, symbol: "jabón", isHouse: true, houseGroup: "bathroom", ipa: "/soʊp/" },
  { word: "mirror", digit: 12, symbol: "espejo", isHouse: true, houseGroup: "bathroom", ipa: "/ˈmɪr.ɚ/" },
  { word: "razor", digit: 13, symbol: "maquinilla de afeitar", isHouse: true, houseGroup: "bathroom", ipa: "/ˈreɪ.zɚ/" },
  { word: "shaving cream", digit: 14, symbol: "crema de afeitar", isHouse: true, houseGroup: "bathroom", ipa: "/ˈʃeɪ.vɪŋ kriːm/" },
  { word: "toothbrush", digit: 15, symbol: "cepillo de dientes", isHouse: true, houseGroup: "bathroom", ipa: "/ˈtuːθ.brʌʃ/" },
  { word: "toothpaste", digit: 16, symbol: "pasta de dientes", isHouse: true, houseGroup: "bathroom", ipa: "/ˈtuːθ.peɪst/" },
  { word: "dental floss", digit: 17, symbol: "hilo dental", isHouse: true, houseGroup: "bathroom", ipa: "/ˈdɛn.təl flɑːs/" },
  { word: "mouthwash", digit: 18, symbol: "enjuague bucal", isHouse: true, houseGroup: "bathroom", ipa: "/ˈmaʊθ.wɑːʃ/" },
  { word: "perfume", digit: 19, symbol: "perfume", isHouse: true, houseGroup: "bathroom", ipa: "/pɚˈfjuːm/" },
  { word: "sunblock", digit: 20, symbol: "protector solar", isHouse: true, houseGroup: "bathroom", ipa: "/ˈsʌn.blɑːk/" },
  { word: "shampoo", digit: 21, symbol: "champú", isHouse: true, houseGroup: "bathroom", ipa: "/ʃæmˈpuː/" },
  { word: "conditioner", digit: 22, symbol: "acondicionador", isHouse: true, houseGroup: "bathroom", ipa: "/kənˈdɪʃ.ən.ɚ/" },
  { word: "deodorant", digit: 23, symbol: "desodorante", isHouse: true, houseGroup: "bathroom", ipa: "/diˈoʊ.dɚ.ənt/" },
  { word: "cotton", digit: 24, symbol: "algodón", isHouse: true, houseGroup: "bathroom", ipa: "/ˈkɑː.tən/" }
];

export const totalHouse: NumberItem[] = [...houseParts, ...houseLiving, ...houseKitchen, ...houseBedroom, ...houseBathroom];

// =========================================================================
// MODULE 10: CLASSROOM DATA
// =========================================================================

export const classroomSupplies: NumberItem[] = [
  { word: "school", digit: 1, symbol: "escuela", isClassroom: true, classroomGroup: "supplies" },
  { word: "classroom", digit: 2, symbol: "aula", isClassroom: true, classroomGroup: "supplies" },
  { word: "students", digit: 3, symbol: "estudiantes", isClassroom: true, classroomGroup: "supplies" },
  { word: "principal", digit: 4, symbol: "director(a)", isClassroom: true, classroomGroup: "supplies" },
  { word: "map", digit: 5, symbol: "mapa", isClassroom: true, classroomGroup: "supplies", ipa: "/mæp/" },
  { word: "globe", digit: 6, symbol: "globo terráqueo", isClassroom: true, classroomGroup: "supplies", ipa: "/ɡloʊb/" },
  { word: "backpack", digit: 7, symbol: "mochila", isClassroom: true, classroomGroup: "supplies" },
  { word: "book", digit: 8, symbol: "libro", isClassroom: true, classroomGroup: "supplies" },
  { word: "notebook", digit: 9, symbol: "cuaderno", isClassroom: true, classroomGroup: "supplies" },
  { word: "paper", digit: 10, symbol: "papel", isClassroom: true, classroomGroup: "supplies" },
  { word: "pencil", digit: 11, symbol: "lápiz", isClassroom: true, classroomGroup: "supplies" },
  { word: "pen", digit: 12, symbol: "bolígrafo", isClassroom: true, classroomGroup: "supplies" },
  { word: "scoreboard", digit: 13, symbol: "marcador", isClassroom: true, classroomGroup: "supplies" },
  { word: "mark", digit: 14, symbol: "nota", isClassroom: true, classroomGroup: "supplies" },
  { word: "eraser", digit: 15, symbol: "borrador", isClassroom: true, classroomGroup: "supplies" },
  { word: "sharpener", digit: 16, symbol: "sacapuntas", isClassroom: true, classroomGroup: "supplies" },
  { word: "scissors", digit: 17, symbol: "tijeras", isClassroom: true, classroomGroup: "supplies" },
  { word: "ruler", digit: 18, symbol: "regla", isClassroom: true, classroomGroup: "supplies" },
  { word: "glue", digit: 19, symbol: "pegamento", isClassroom: true, classroomGroup: "supplies" },
  { word: "blackboard", digit: 20, symbol: "pizarra", isClassroom: true, classroomGroup: "supplies" },
  { word: "pad", digit: 21, symbol: "bloc", isClassroom: true, classroomGroup: "supplies" },
  { word: "break", digit: 22, symbol: "recreo", isClassroom: true, classroomGroup: "supplies" },
  { word: "bell", digit: 23, symbol: "campana", isClassroom: true, classroomGroup: "supplies" },
  { word: "flag", digit: 24, symbol: "bandera", isClassroom: true, classroomGroup: "supplies" },
  { word: "ball", digit: 25, symbol: "pelota", isClassroom: true, classroomGroup: "supplies" },
  { word: "classmate", digit: 26, symbol: "compañero(a)", isClassroom: true, classroomGroup: "supplies" },
  { word: "chair", digit: 27, symbol: "silla", isClassroom: true, classroomGroup: "supplies" },
  { word: "desk", digit: 28, symbol: "mesa", isClassroom: true, classroomGroup: "supplies" },
  { word: "sheet", digit: 29, symbol: "hoja", isClassroom: true, classroomGroup: "supplies" },
  { word: "page", digit: 30, symbol: "página", isClassroom: true, classroomGroup: "supplies" }
];

export const classroomShapes: NumberItem[] = [
  { word: "square", digit: 1, symbol: "cuadrado", isClassroom: true, classroomGroup: "shapes" },
  { word: "rectangle", digit: 2, symbol: "rectángulo", isClassroom: true, classroomGroup: "shapes" },
  { word: "cube", digit: 3, symbol: "cubo", isClassroom: true, classroomGroup: "shapes" },
  { word: "circle", digit: 4, symbol: "círculo", isClassroom: true, classroomGroup: "shapes" },
  { word: "cylinder", digit: 5, symbol: "cilindro", isClassroom: true, classroomGroup: "shapes" },
  { word: "cone", digit: 6, symbol: "cono", isClassroom: true, classroomGroup: "shapes" },
  { word: "triangle", digit: 7, symbol: "triángulo", isClassroom: true, classroomGroup: "shapes" },
  { word: "hexagon", digit: 8, symbol: "hexágono", isClassroom: true, classroomGroup: "shapes" },
  { word: "polygon", digit: 9, symbol: "polígono", isClassroom: true, classroomGroup: "shapes" },
  { word: "rhombus", digit: 10, symbol: "rombo", isClassroom: true, classroomGroup: "shapes" },
  { word: "star", digit: 11, symbol: "estrella", isClassroom: true, classroomGroup: "shapes" },
  { word: "oval", digit: 12, symbol: "óvalo", isClassroom: true, classroomGroup: "shapes" },
  { word: "pentagon", digit: 13, symbol: "pentágono", isClassroom: true, classroomGroup: "shapes" },
  { word: "octagon", digit: 14, symbol: "octágono", isClassroom: true, classroomGroup: "shapes" },
  { word: "math", digit: 15, symbol: "matemáticas", isClassroom: true, classroomGroup: "shapes" },
  { word: "science", digit: 16, symbol: "ciencias", isClassroom: true, classroomGroup: "shapes" },
  { word: "english", digit: 17, symbol: "inglés", isClassroom: true, classroomGroup: "shapes" },
  { word: "history", digit: 18, symbol: "historia", isClassroom: true, classroomGroup: "shapes" },
  { word: "geography", digit: 19, symbol: "geografía", isClassroom: true, classroomGroup: "shapes" },
  { word: "biology", digit: 20, symbol: "biología", isClassroom: true, classroomGroup: "shapes" },
  { word: "chemistry", digit: 21, symbol: "química", isClassroom: true, classroomGroup: "shapes" },
  { word: "physics", digit: 22, symbol: "física", isClassroom: true, classroomGroup: "shapes" },
  { word: "algebra", digit: 23, symbol: "álgebra", isClassroom: true, classroomGroup: "shapes" },
  { word: "geometry", digit: 24, symbol: "geometría", isClassroom: true, classroomGroup: "shapes" },
  { word: "art", digit: 25, symbol: "arte", isClassroom: true, classroomGroup: "shapes" },
  { word: "music", digit: 26, symbol: "música", isClassroom: true, classroomGroup: "shapes" },
  { word: "literature", digit: 27, symbol: "literatura", isClassroom: true, classroomGroup: "shapes" },
  { word: "theater", digit: 28, symbol: "teatro", isClassroom: true, classroomGroup: "shapes" },
  { word: "philosophy", digit: 29, symbol: "filosofía", isClassroom: true, classroomGroup: "shapes" },
  { word: "physical education", digit: 30, symbol: "educación física", isClassroom: true, classroomGroup: "shapes" }
];

export const classroomCountries: NumberItem[] = [
  { word: "united states", digit: 1, symbol: "estados unidos", isClassroom: true, classroomGroup: "countries" },
  { word: "united kingdom", digit: 2, symbol: "reino unido", isClassroom: true, classroomGroup: "countries" },
  { word: "canada", digit: 3, symbol: "canadá", isClassroom: true, classroomGroup: "countries" },
  { word: "mexico", digit: 4, symbol: "méxico", isClassroom: true, classroomGroup: "countries" },
  { word: "spain", digit: 5, symbol: "españa", isClassroom: true, classroomGroup: "countries" },
  { word: "france", digit: 6, symbol: "francia", isClassroom: true, classroomGroup: "countries" },
  { word: "germany", digit: 7, symbol: "alemania", isClassroom: true, classroomGroup: "countries" },
  { word: "italy", digit: 8, symbol: "italia", isClassroom: true, classroomGroup: "countries" },
  { word: "china", digit: 9, symbol: "china", isClassroom: true, classroomGroup: "countries" },
  { word: "japan", digit: 10, symbol: "japón", isClassroom: true, classroomGroup: "countries" },
  { word: "brazil", digit: 11, symbol: "brasil", isClassroom: true, classroomGroup: "countries" },
  { word: "argentina", digit: 12, symbol: "argentina", isClassroom: true, classroomGroup: "countries" },
  { word: "australia", digit: 13, symbol: "australia", isClassroom: true, classroomGroup: "countries" },
  { word: "india", digit: 14, symbol: "india", isClassroom: true, classroomGroup: "countries" },
  { word: "russia", digit: 15, symbol: "rusia", isClassroom: true, classroomGroup: "countries" },
  { word: "portugal", digit: 16, symbol: "portugal", isClassroom: true, classroomGroup: "countries" },
  { word: "netherlands", digit: 17, symbol: "países bajos", isClassroom: true, classroomGroup: "countries" },
  { word: "greece", digit: 18, symbol: "grecia", isClassroom: true, classroomGroup: "countries" },
  { word: "switzerland", digit: 19, symbol: "suiza", isClassroom: true, classroomGroup: "countries" },
  { word: "south korea", digit: 20, symbol: "corea del sur", isClassroom: true, classroomGroup: "countries" }
];

export const totalClassroom: NumberItem[] = [...classroomSupplies, ...classroomShapes, ...classroomCountries];

// =========================================================================
// MODULE 11: PLACES DATA
// =========================================================================

export const placesUrban: NumberItem[] = [
  { word: "neighborhood", digit: 1, symbol: "vecindario", isPlaces: true, placesGroup: "urban" },
  { word: "skyscraper", digit: 2, symbol: "rascacielos", isPlaces: true, placesGroup: "urban", ipa: "/ˈskaɪˌskreɪ.pɚ/" },
  { word: "home", digit: 3, symbol: "hogar", isPlaces: true, placesGroup: "urban" },
  { word: "apartment", digit: 4, symbol: "apartamento", isPlaces: true, placesGroup: "urban" },
  { word: "bridge", digit: 5, symbol: "puente", isPlaces: true, placesGroup: "urban" },
  { word: "avenue", digit: 6, symbol: "avenida", isPlaces: true, placesGroup: "urban" },
  { word: "street", digit: 7, symbol: "calle", isPlaces: true, placesGroup: "urban" },
  { word: "post office", digit: 8, symbol: "oficina de correos", isPlaces: true, placesGroup: "urban", ipa: "/ˈpoʊst ˌɑː.fɪs/" },
  { word: "university", digit: 9, symbol: "universidad", isPlaces: true, placesGroup: "urban" },
  { word: "college", digit: 10, symbol: "colegio universitario", isPlaces: true, placesGroup: "urban" },
  { word: "academy", digit: 11, symbol: "academia", isPlaces: true, placesGroup: "urban" },
  { word: "institute", digit: 12, symbol: "instituto", isPlaces: true, placesGroup: "urban" },
  { word: "museum", digit: 13, symbol: "museo", isPlaces: true, placesGroup: "urban" },
  { word: "library", digit: 14, symbol: "biblioteca", isPlaces: true, placesGroup: "urban" },
  { word: "factory", digit: 15, symbol: "fábrica", isPlaces: true, placesGroup: "urban" },
  { word: "building", digit: 16, symbol: "edificio", isPlaces: true, placesGroup: "urban" },
  { word: "church", digit: 17, symbol: "iglesia", isPlaces: true, placesGroup: "urban" },
  { word: "cathedral", digit: 18, symbol: "catedral", isPlaces: true, placesGroup: "urban" },
  { word: "monument", digit: 19, symbol: "monumento", isPlaces: true, placesGroup: "urban" },
  { word: "statue", digit: 20, symbol: "estatua", isPlaces: true, placesGroup: "urban" },
  { word: "stadium", digit: 21, symbol: "estadio", isPlaces: true, placesGroup: "urban" },
  { word: "circus", digit: 22, symbol: "circo", isPlaces: true, placesGroup: "urban" },
  { word: "downtown", digit: 23, symbol: "centro de la ciudad", isPlaces: true, placesGroup: "urban" },
  { word: "courthouse", digit: 24, symbol: "palacio de justicia", isPlaces: true, placesGroup: "urban" },
  { word: "travel agency", digit: 25, symbol: "agencia de viajes", isPlaces: true, placesGroup: "urban" },
  { word: "bank", digit: 26, symbol: "banco", isPlaces: true, placesGroup: "urban" },
  { word: "parking", digit: 27, symbol: "estacionamiento", isPlaces: true, placesGroup: "urban" },
  { word: "hotel", digit: 28, symbol: "hotel", isPlaces: true, placesGroup: "urban" },
  { word: "restaurant", digit: 29, symbol: "restaurante", isPlaces: true, placesGroup: "urban" },
  { word: "mall", digit: 30, symbol: "centro comercial", isPlaces: true, placesGroup: "urban" },
  { word: "zoo", digit: 31, symbol: "zoológico", isPlaces: true, placesGroup: "urban" },
  { word: "gas station", digit: 32, symbol: "gasolinera", isPlaces: true, placesGroup: "urban" },
  { word: "market", digit: 33, symbol: "mercado", isPlaces: true, placesGroup: "urban" },
  { word: "park", digit: 34, symbol: "parque", isPlaces: true, placesGroup: "urban" },
  { word: "cinema", digit: 35, symbol: "cine", isPlaces: true, placesGroup: "urban" },
  { word: "plaza", digit: 36, symbol: "plaza", isPlaces: true, placesGroup: "urban" },
  { word: "airport", digit: 37, symbol: "aeropuerto", isPlaces: true, placesGroup: "urban" },
  { word: "hospital", digit: 38, symbol: "hospital", isPlaces: true, placesGroup: "urban" },
  { word: "prison", digit: 39, symbol: "cárcel", isPlaces: true, placesGroup: "urban" },
  { word: "cemetery", digit: 40, symbol: "cementerio", isPlaces: true, placesGroup: "urban" }
];

export const placesShops: NumberItem[] = [
  { word: "shoe store", digit: 1, symbol: "zapatería", isPlaces: true, placesGroup: "shops" },
  { word: "cake shop", digit: 2, symbol: "pastelería", isPlaces: true, placesGroup: "shops" },
  { word: "coffee shop", digit: 3, symbol: "cafetería", isPlaces: true, placesGroup: "shops" },
  { word: "bookstore", digit: 4, symbol: "librería", isPlaces: true, placesGroup: "shops" },
  { word: "pet shop", digit: 5, symbol: "tienda de mascotas", isPlaces: true, placesGroup: "shops" },
  { word: "bakery", digit: 6, symbol: "panadería", isPlaces: true, placesGroup: "shops" },
  { word: "shopping center", digit: 7, symbol: "centro comercial", isPlaces: true, placesGroup: "shops" },
  { word: "supermarket", digit: 8, symbol: "supermercado", isPlaces: true, placesGroup: "shops" },
  { word: "drugstore", digit: 9, symbol: "farmacia", isPlaces: true, placesGroup: "shops" },
  { word: "music store", digit: 10, symbol: "tienda de música", isPlaces: true, placesGroup: "shops" },
  { word: "candy store", digit: 11, symbol: "dulcería", isPlaces: true, placesGroup: "shops" },
  { word: "toy store", digit: 12, symbol: "juguetería", isPlaces: true, placesGroup: "shops" },
  { word: "jewelry store", digit: 13, symbol: "joyería", isPlaces: true, placesGroup: "shops" },
  { word: "furniture store", digit: 14, symbol: "mueblería", isPlaces: true, placesGroup: "shops" },
  { word: "clothing store", digit: 15, symbol: "tienda de ropa", isPlaces: true, placesGroup: "shops" },
  { word: "hardware store", digit: 16, symbol: "ferretería", isPlaces: true, placesGroup: "shops" },
  { word: "grocery store", digit: 17, symbol: "abarrotería", isPlaces: true, placesGroup: "shops" },
  { word: "electronics store", digit: 18, symbol: "tienda de electrónicos", isPlaces: true, placesGroup: "shops" },
  { word: "sports store", digit: 19, symbol: "tienda de deportes", isPlaces: true, placesGroup: "shops" },
  { word: "flower shop", digit: 20, symbol: "florería", isPlaces: true, placesGroup: "shops" }
];

export const placesTransport: NumberItem[] = [
  { word: "bicycle", digit: 1, symbol: "bicicleta", isPlaces: true, placesGroup: "transport" },
  { word: "bike", digit: 2, symbol: "bici", isPlaces: true, placesGroup: "transport" },
  { word: "motorcycle", digit: 3, symbol: "motocicleta", isPlaces: true, placesGroup: "transport" },
  { word: "motorbike", digit: 4, symbol: "moto", isPlaces: true, placesGroup: "transport" },
  { word: "car", digit: 5, symbol: "coche", isPlaces: true, placesGroup: "transport" },
  { word: "taxi", digit: 6, symbol: "taxi", isPlaces: true, placesGroup: "transport" },
  { word: "cab", digit: 7, symbol: "taxi", isPlaces: true, placesGroup: "transport" },
  { word: "bus", digit: 8, symbol: "autobús", isPlaces: true, placesGroup: "transport" },
  { word: "truck", digit: 9, symbol: "camión", isPlaces: true, placesGroup: "transport" },
  { word: "train", digit: 10, symbol: "tren", isPlaces: true, placesGroup: "transport" },
  { word: "airplane", digit: 11, symbol: "avión", isPlaces: true, placesGroup: "transport" },
  { word: "plane", digit: 12, symbol: "avión", isPlaces: true, placesGroup: "transport" },
  { word: "helicopter", digit: 13, symbol: "helicóptero", isPlaces: true, placesGroup: "transport" },
  { word: "ship", digit: 14, symbol: "barco", isPlaces: true, placesGroup: "transport" },
  { word: "boat", digit: 15, symbol: "bote", isPlaces: true, placesGroup: "transport" },
  { word: "van", digit: 16, symbol: "furgoneta", isPlaces: true, placesGroup: "transport" },
  { word: "subway", digit: 17, symbol: "metro", isPlaces: true, placesGroup: "transport" },
  { word: "tram", digit: 18, symbol: "tranvía", isPlaces: true, placesGroup: "transport" }
];

export const totalPlaces: NumberItem[] = [...placesUrban, ...placesShops, ...placesTransport];

// =========================================================================
// MODULE 12: WEATHER DATA
// =========================================================================

export const weatherPhenomena: NumberItem[] = [
  { word: "spring", digit: 1, symbol: "primavera", isWeather: true, weatherGroup: "phenomena" },
  { word: "summer", digit: 2, symbol: "verano", isWeather: true, weatherGroup: "phenomena" },
  { word: "autumn", digit: 3, symbol: "otoño", isWeather: true, weatherGroup: "phenomena" },
  { word: "winter", digit: 4, symbol: "invierno", isWeather: true, weatherGroup: "phenomena" },
  { word: "sun", digit: 5, symbol: "sol", isWeather: true, weatherGroup: "phenomena" },
  { word: "cloud", digit: 6, symbol: "nube", isWeather: true, weatherGroup: "phenomena" },
  { word: "rain", digit: 7, symbol: "lluvia", isWeather: true, weatherGroup: "phenomena" },
  { word: "wind", digit: 8, symbol: "viento", isWeather: true, weatherGroup: "phenomena" },
  { word: "moon", digit: 9, symbol: "luna", isWeather: true, weatherGroup: "phenomena" },
  { word: "rainbow", digit: 10, symbol: "arcoíris", isWeather: true, weatherGroup: "phenomena", ipa: "/ˈreɪn.boʊ/" },
  { word: "snow", digit: 11, symbol: "nieve", isWeather: true, weatherGroup: "phenomena" },
  { word: "fog", digit: 12, symbol: "niebla", isWeather: true, weatherGroup: "phenomena" },
  { word: "cold", digit: 13, symbol: "frío", isWeather: true, weatherGroup: "phenomena" },
  { word: "storm", digit: 14, symbol: "tormenta", isWeather: true, weatherGroup: "phenomena" },
  { word: "thunder", digit: 15, symbol: "trueno", isWeather: true, weatherGroup: "phenomena" },
  { word: "lightning", digit: 16, symbol: "relámpago", isWeather: true, weatherGroup: "phenomena" },
  { word: "hot", digit: 17, symbol: "calor", isWeather: true, weatherGroup: "phenomena" },
  { word: "warm", digit: 18, symbol: "cálido", isWeather: true, weatherGroup: "phenomena" },
  { word: "cool", digit: 19, symbol: "fresco", isWeather: true, weatherGroup: "phenomena" },
  { word: "freezing", digit: 20, symbol: "helado", isWeather: true, weatherGroup: "phenomena" },
  { word: "thunderstorm", digit: 21, symbol: "tormenta eléctrica", isWeather: true, weatherGroup: "phenomena" },
  { word: "hail", digit: 22, symbol: "granizo", isWeather: true, weatherGroup: "phenomena" },
  { word: "breeze", digit: 23, symbol: "brisa", isWeather: true, weatherGroup: "phenomena" },
  { word: "mist", digit: 24, symbol: "neblina", isWeather: true, weatherGroup: "phenomena" },
  { word: "humid", digit: 25, symbol: "húmedo", isWeather: true, weatherGroup: "phenomena" },
  { word: "humidity", digit: 26, symbol: "humedad", isWeather: true, weatherGroup: "phenomena" },
  { word: "clear sky", digit: 27, symbol: "cielo despejado", isWeather: true, weatherGroup: "phenomena" },
  { word: "drizzle", digit: 28, symbol: "llovizna", isWeather: true, weatherGroup: "phenomena" },
  { word: "downpour", digit: 29, symbol: "aguacero", isWeather: true, weatherGroup: "phenomena" },
  { word: "stormy", digit: 30, symbol: "tormentoso", isWeather: true, weatherGroup: "phenomena" },
  { word: "blowing", digit: 31, symbol: "soplando", isWeather: true, weatherGroup: "phenomena" },
  { word: "flood", digit: 32, symbol: "inundación", isWeather: true, weatherGroup: "phenomena" },
  { word: "drought", digit: 33, symbol: "sequía", isWeather: true, weatherGroup: "phenomena" },
  { word: "tornado", digit: 34, symbol: "tornado", isWeather: true, weatherGroup: "phenomena" },
  { word: "hurricane", digit: 35, symbol: "huracán", isWeather: true, weatherGroup: "phenomena" }
];

export const weatherPhrases: NumberItem[] = [
  { word: "it is freezing", digit: 1, symbol: "está helando", isWeather: true, weatherGroup: "phrases" },
  { word: "it is sunny", digit: 2, symbol: "está soleado", isWeather: true, weatherGroup: "phrases" },
  { word: "it is cloudy", digit: 3, symbol: "está nublado", isWeather: true, weatherGroup: "phrases" },
  { word: "it is foggy", digit: 4, symbol: "hay niebla", isWeather: true, weatherGroup: "phrases" },
  { word: "it is windy", digit: 5, symbol: "hay viento", isWeather: true, weatherGroup: "phrases" },
  { word: "it is stormy", digit: 6, symbol: "está tormentoso", isWeather: true, weatherGroup: "phrases" },
  { word: "it is rainy", digit: 7, symbol: "está lluvioso", isWeather: true, weatherGroup: "phrases" },
  { word: "it is snowy", digit: 8, symbol: "está nevado", isWeather: true, weatherGroup: "phrases" },
  { word: "it is hailing", digit: 9, symbol: "está granizando", isWeather: true, weatherGroup: "phrases" },
  { word: "it is thawing", digit: 10, symbol: "está descongelando", isWeather: true, weatherGroup: "phrases" },
  { word: "it is raining", digit: 11, symbol: "está lloviendo", isWeather: true, weatherGroup: "phrases" },
  { word: "it is snowing", digit: 12, symbol: "está nevando", isWeather: true, weatherGroup: "phrases" }
];

export const totalWeather: NumberItem[] = [...weatherPhenomena, ...weatherPhrases];

// =========================================================================
// MODULE 13: ANIMALS DATA
// =========================================================================

export const animalsFarm: NumberItem[] = [
  { word: "dog", digit: 1, symbol: "perro(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "doggy", digit: 2, symbol: "perrito(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "bitch", digit: 3, symbol: "perra", isAnimals: true, animalsGroup: "farm" },
  { word: "cat", digit: 4, symbol: "gato(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "kitten", digit: 5, symbol: "gatito(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "mouse", digit: 6, symbol: "ratón(ona)", isAnimals: true, animalsGroup: "farm" },
  { word: "rooster", digit: 7, symbol: "gallo", isAnimals: true, animalsGroup: "farm" },
  { word: "hen", digit: 8, symbol: "gallina", isAnimals: true, animalsGroup: "farm" },
  { word: "bull", digit: 9, symbol: "toro", isAnimals: true, animalsGroup: "farm" },
  { word: "cow", digit: 10, symbol: "vaca", isAnimals: true, animalsGroup: "farm" },
  { word: "duck", digit: 11, symbol: "pato(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "goose", digit: 12, symbol: "ganso(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "horse", digit: 13, symbol: "caballo(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "mare", digit: 14, symbol: "yegua", isAnimals: true, animalsGroup: "farm" },
  { word: "pig", digit: 15, symbol: "cerdo(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "boar", digit: 16, symbol: "jabalí", isAnimals: true, animalsGroup: "farm" },
  { word: "rabbit", digit: 17, symbol: "conejo(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "hare", digit: 18, symbol: "liebre", isAnimals: true, animalsGroup: "farm" },
  { word: "goat", digit: 19, symbol: "cabra", isAnimals: true, animalsGroup: "farm" },
  { word: "sheep", digit: 20, symbol: "oveja", isAnimals: true, animalsGroup: "farm" },
  { word: "chick", digit: 21, symbol: "pollito", isAnimals: true, animalsGroup: "farm", ipa: "/tʃɪk/" },
  { word: "lamb", digit: 22, symbol: "cordero(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "swan", digit: 23, symbol: "cisne", isAnimals: true, animalsGroup: "farm" },
  { word: "turkey", digit: 24, symbol: "pavo(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "hamster", digit: 25, symbol: "hámster", isAnimals: true, animalsGroup: "farm" },
  { word: "squirrel", digit: 26, symbol: "ardilla", isAnimals: true, animalsGroup: "farm" },
  { word: "donkey", digit: 27, symbol: "burro(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "mule", digit: 28, symbol: "mula", isAnimals: true, animalsGroup: "farm" },
  { word: "lion", digit: 29, symbol: "león(ona)", isAnimals: true, animalsGroup: "farm" },
  { word: "tiger", digit: 30, symbol: "tigre", isAnimals: true, animalsGroup: "farm" },
  { word: "elephant", digit: 31, symbol: "elefante", isAnimals: true, animalsGroup: "farm" },
  { word: "giraffe", digit: 32, symbol: "jirafa", isAnimals: true, animalsGroup: "farm" },
  { word: "wolf", digit: 33, symbol: "lobo(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "gazelle", digit: 34, symbol: "gacela", isAnimals: true, animalsGroup: "farm" },
  { word: "rhinoceros", digit: 35, symbol: "rinoceronte", isAnimals: true, animalsGroup: "farm" },
  { word: "hippopotamus", digit: 36, symbol: "hipopótamo", isAnimals: true, animalsGroup: "farm" },
  { word: "zebra", digit: 37, symbol: "cebra", isAnimals: true, animalsGroup: "farm" },
  { word: "camel", digit: 38, symbol: "camello(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "llama", digit: 39, symbol: "llama", isAnimals: true, animalsGroup: "farm" },
  { word: "buffalo", digit: 40, symbol: "búfalo", isAnimals: true, animalsGroup: "farm" },
  { word: "deer", digit: 41, symbol: "ciervo(a)", isAnimals: true, animalsGroup: "farm" },
  { word: "moose", digit: 42, symbol: "alce", isAnimals: true, animalsGroup: "farm" }
];

export const animalsForest: NumberItem[] = [
  { word: "monkey", digit: 1, symbol: "mono(a)", isAnimals: true, animalsGroup: "forest" },
  { word: "gorilla", digit: 2, symbol: "gorila", isAnimals: true, animalsGroup: "forest" },
  { word: "koala", digit: 3, symbol: "coala", isAnimals: true, animalsGroup: "forest", ipa: "/koʊˈɑː.lə/" },
  { word: "panda", digit: 4, symbol: "oso panda", isAnimals: true, animalsGroup: "forest", ipa: "/ˈpæn.də/" },
  { word: "fox", digit: 5, symbol: "zorro", isAnimals: true, animalsGroup: "forest", ipa: "/fɑːks/" },
  { word: "vixen", digit: 6, symbol: "zorra", isAnimals: true, animalsGroup: "forest", ipa: "/ˈvɪk.sən/" },
  { word: "snake", digit: 7, symbol: "serpiente", isAnimals: true, animalsGroup: "forest", ipa: "/sneɪk/" },
  { word: "lizard", digit: 8, symbol: "lagarto", isAnimals: true, animalsGroup: "forest", ipa: "/ˈlɪz.ɚd/" },
  { word: "hedgehog", digit: 9, symbol: "erizo", isAnimals: true, animalsGroup: "forest", ipa: "/ˈhɛdʒ.hɔːɡ/" },
  { word: "kangaroo", digit: 10, symbol: "canguro", isAnimals: true, animalsGroup: "forest" },
  { word: "bear", digit: 11, symbol: "oso(a)", isAnimals: true, animalsGroup: "forest" },
  { word: "anteater", digit: 12, symbol: "oso hormiguero", isAnimals: true, animalsGroup: "forest" },
  { word: "badger", digit: 13, symbol: "tejón(ona)", isAnimals: true, animalsGroup: "forest" },
  { word: "raccoon", digit: 14, symbol: "mapache", isAnimals: true, animalsGroup: "forest" },
  { word: "opossum", digit: 15, symbol: "zarigüeya", isAnimals: true, animalsGroup: "forest" },
  { word: "mole", digit: 16, symbol: "topo(a)", isAnimals: true, animalsGroup: "forest" },
  { word: "ferret", digit: 17, symbol: "hurón(ona)", isAnimals: true, animalsGroup: "forest" },
  { word: "platypus", digit: 18, symbol: "ornitorrinco", isAnimals: true, animalsGroup: "forest" },
  { word: "lynx", digit: 19, symbol: "lince", isAnimals: true, animalsGroup: "forest" },
  { word: "leopard", digit: 20, symbol: "leopardo", isAnimals: true, animalsGroup: "forest" },
  { word: "ox", digit: 21, symbol: "buey", isAnimals: true, animalsGroup: "forest" },
  { word: "calf", digit: 22, symbol: "ternero(a)", isAnimals: true, animalsGroup: "forest" },
  { word: "jaguar", digit: 23, symbol: "jaguar", isAnimals: true, animalsGroup: "forest" },
  { word: "puma", digit: 24, symbol: "puma", isAnimals: true, animalsGroup: "forest" },
  { word: "cheetah", digit: 25, symbol: "guepardo", isAnimals: true, animalsGroup: "forest" },
  { word: "hyena", digit: 26, symbol: "hiena", isAnimals: true, animalsGroup: "forest" },
  { word: "sloth", digit: 27, symbol: "perezoso(a)", isAnimals: true, animalsGroup: "forest" },
  { word: "armadillo", digit: 28, symbol: "armadillo", isAnimals: true, animalsGroup: "forest" },
  { word: "beaver", digit: 29, symbol: "castor", isAnimals: true, animalsGroup: "forest" },
  { word: "otter", digit: 30, symbol: "nutria", isAnimals: true, animalsGroup: "forest" },
  { word: "weasel", digit: 31, symbol: "comadreja", isAnimals: true, animalsGroup: "forest" },
  { word: "mink", digit: 32, symbol: "visón", isAnimals: true, animalsGroup: "forest" },
  { word: "skunk", digit: 33, symbol: "mofeta", isAnimals: true, animalsGroup: "forest" },
  { word: "porcupine", digit: 34, symbol: "puercoespín", isAnimals: true, animalsGroup: "forest" },
  { word: "wombat", digit: 35, symbol: "wómbat", isAnimals: true, animalsGroup: "forest" }
];

export const animalsBirds: NumberItem[] = [
  { word: "falcon", digit: 1, symbol: "halcón", isAnimals: true, animalsGroup: "birds" },
  { word: "hawk", digit: 2, symbol: "halcón (ave rapaz)", isAnimals: true, animalsGroup: "birds" },
  { word: "eagle", digit: 3, symbol: "águila", isAnimals: true, animalsGroup: "birds" },
  { word: "pigeon", digit: 4, symbol: "paloma", isAnimals: true, animalsGroup: "birds" },
  { word: "dove", digit: 5, symbol: "paloma (tórtola)", isAnimals: true, animalsGroup: "birds" },
  { word: "condor", digit: 6, symbol: "cóndor", isAnimals: true, animalsGroup: "birds" },
  { word: "bird", digit: 7, symbol: "pájaro", isAnimals: true, animalsGroup: "birds" },
  { word: "parrot", digit: 8, symbol: "loro(a)", isAnimals: true, animalsGroup: "birds" },
  { word: "canary", digit: 9, symbol: "canario", isAnimals: true, animalsGroup: "birds" },
  { word: "nightingale", digit: 10, symbol: "ruiseñor", isAnimals: true, animalsGroup: "birds" },
  { word: "stork", digit: 11, symbol: "cigüeña", isAnimals: true, animalsGroup: "birds" },
  { word: "seagull", digit: 12, symbol: "gaviota", isAnimals: true, animalsGroup: "birds" },
  { word: "swallow", digit: 13, symbol: "golondrina", isAnimals: true, animalsGroup: "birds" },
  { word: "sparrow", digit: 14, symbol: "gorrión", isAnimals: true, animalsGroup: "birds" },
  { word: "ostrich", digit: 15, symbol: "avestruz", isAnimals: true, animalsGroup: "birds" },
  { word: "owl", digit: 16, symbol: "búho", isAnimals: true, animalsGroup: "birds" },
  { word: "hummingbird", digit: 17, symbol: "colibrí", isAnimals: true, animalsGroup: "birds" },
  { word: "dragonfly", digit: 18, symbol: "libélula", isAnimals: true, animalsGroup: "birds" },
  { word: "moth", digit: 19, symbol: "polilla", isAnimals: true, animalsGroup: "birds" },
  { word: "butterfly", digit: 20, symbol: "mariposa", isAnimals: true, animalsGroup: "birds" },
  { word: "ladybug", digit: 21, symbol: "mariquita", isAnimals: true, animalsGroup: "birds" },
  { word: "firefly", digit: 22, symbol: "luciérnaga", isAnimals: true, animalsGroup: "birds" },
  { word: "bee", digit: 23, symbol: "abeja", isAnimals: true, animalsGroup: "birds" },
  { word: "wasp", digit: 24, symbol: "avispa", isAnimals: true, animalsGroup: "birds" },
  { word: "crow", digit: 25, symbol: "cuervo", isAnimals: true, animalsGroup: "birds" },
  { word: "bat", digit: 26, symbol: "murciélago", isAnimals: true, animalsGroup: "birds" },
  { word: "shark", digit: 27, symbol: "tiburón", isAnimals: true, animalsGroup: "birds" },
  { word: "octopus", digit: 28, symbol: "pulpo", isAnimals: true, animalsGroup: "birds" },
  { word: "whale", digit: 29, symbol: "ballena", isAnimals: true, animalsGroup: "birds" },
  { word: "killer whale", digit: 30, symbol: "orca", isAnimals: true, animalsGroup: "birds" },
  { word: "crocodile", digit: 31, symbol: "cocodrilo", isAnimals: true, animalsGroup: "birds" },
  { word: "alligator", digit: 32, symbol: "caimán", isAnimals: true, animalsGroup: "birds" },
  { word: "seal", digit: 33, symbol: "foca", isAnimals: true, animalsGroup: "birds" },
  { word: "dolphin", digit: 34, symbol: "delfín", isAnimals: true, animalsGroup: "birds" },
  { word: "penguin", digit: 35, symbol: "pingüino", isAnimals: true, animalsGroup: "birds" },
  { word: "walrus", digit: 36, symbol: "morsa", isAnimals: true, animalsGroup: "birds" },
  { word: "jellyfish", digit: 37, symbol: "medusa", isAnimals: true, animalsGroup: "birds" },
  { word: "eel", digit: 38, symbol: "anguila", isAnimals: true, animalsGroup: "birds" },
  { word: "squid", digit: 39, symbol: "calamar", isAnimals: true, animalsGroup: "birds" },
  { word: "lobster", digit: 40, symbol: "langosta", isAnimals: true, animalsGroup: "birds" }
];

export const animalsReptiles: NumberItem[] = [
  { word: "larva", digit: 1, symbol: "larva", isAnimals: true, animalsGroup: "reptiles" },
  { word: "slug", digit: 2, symbol: "babosa", isAnimals: true, animalsGroup: "reptiles" },
  { word: "turtle", digit: 3, symbol: "tortuga", isAnimals: true, animalsGroup: "reptiles" },
  { word: "snail", digit: 4, symbol: "caracol", isAnimals: true, animalsGroup: "reptiles" },
  { word: "scorpion", digit: 5, symbol: "escorpión", isAnimals: true, animalsGroup: "reptiles" },
  { word: "spider", digit: 6, symbol: "araña", isAnimals: true, animalsGroup: "reptiles" },
  { word: "fly", digit: 7, symbol: "mosca", isAnimals: true, animalsGroup: "reptiles" },
  { word: "mosquito", digit: 8, symbol: "mosquito", isAnimals: true, animalsGroup: "reptiles" },
  { word: "cricket", digit: 9, symbol: "grillo", isAnimals: true, animalsGroup: "reptiles" },
  { word: "grasshopper", digit: 10, symbol: "saltamontes", isAnimals: true, animalsGroup: "reptiles" },
  { word: "ant", digit: 11, symbol: "hormiga", isAnimals: true, animalsGroup: "reptiles" },
  { word: "cockroach", digit: 12, symbol: "cucaracha", isAnimals: true, animalsGroup: "reptiles" },
  { word: "centipede", digit: 13, symbol: "ciempiés", isAnimals: true, animalsGroup: "reptiles" },
  { word: "earthworm", digit: 14, symbol: "lombriz de tierra", isAnimals: true, animalsGroup: "reptiles" },
  { word: "worm", digit: 15, symbol: "gusano", isAnimals: true, animalsGroup: "reptiles" },
  { word: "caterpillar", digit: 16, symbol: "oruga", isAnimals: true, animalsGroup: "reptiles" },
  { word: "toad", digit: 17, symbol: "sapo", isAnimals: true, animalsGroup: "reptiles" },
  { word: "frog", digit: 18, symbol: "rana", isAnimals: true, animalsGroup: "reptiles" },
  { word: "tick", digit: 19, symbol: "garrapata", isAnimals: true, animalsGroup: "reptiles" },
  { word: "flea", digit: 20, symbol: "pulga", isAnimals: true, animalsGroup: "reptiles" },
  { word: "louse", digit: 21, symbol: "piojo", isAnimals: true, animalsGroup: "reptiles" },
  { word: "beetle", digit: 22, symbol: "escarabajo", isAnimals: true, animalsGroup: "reptiles" },
  { word: "millipede", digit: 23, symbol: "milpiés", isAnimals: true, animalsGroup: "reptiles" },
  { word: "mantis", digit: 24, symbol: "mantis religiosa", isAnimals: true, animalsGroup: "reptiles" },
  { word: "leech", digit: 25, symbol: "sanguijuela", isAnimals: true, animalsGroup: "reptiles" },
  { word: "chameleon", digit: 26, symbol: "camaleón", isAnimals: true, animalsGroup: "reptiles" },
  { word: "gecko", digit: 27, symbol: "gecko", isAnimals: true, animalsGroup: "reptiles" },
  { word: "iguana", digit: 28, symbol: "iguana", isAnimals: true, animalsGroup: "reptiles" },
  { word: "cobra", digit: 29, symbol: "cobra", isAnimals: true, animalsGroup: "reptiles" },
  { word: "viper", digit: 30, symbol: "víbora", isAnimals: true, animalsGroup: "reptiles" },
  { word: "python", digit: 31, symbol: "pitón", isAnimals: true, animalsGroup: "reptiles" },
  { word: "salamander", digit: 32, symbol: "salamandra", isAnimals: true, animalsGroup: "reptiles" },
  { word: "newt", digit: 33, symbol: "tritón", isAnimals: true, animalsGroup: "reptiles" },
  { word: "axolotl", digit: 34, symbol: "ajolote", isAnimals: true, animalsGroup: "reptiles" },
  { word: "komodo dragon", digit: 35, symbol: "dragón de Komodo", isAnimals: true, animalsGroup: "reptiles" }
];

export const totalAnimals: NumberItem[] = [...animalsFarm, ...animalsForest, ...animalsBirds, ...animalsReptiles];

// =========================================================================
// MODULE 14: FRUITS DATA
// =========================================================================
export const fruitsBasic: NumberItem[] = [
  { word: "apple", digit: 1, symbol: "manzana", isFruits: true, fruitsGroup: "basic" },
  { word: "orange", digit: 2, symbol: "naranja", isFruits: true, fruitsGroup: "basic" },
  { word: "tangerine", digit: 3, symbol: "mandarina", isFruits: true, fruitsGroup: "basic" },
  { word: "lemon", digit: 4, symbol: "limón", isFruits: true, fruitsGroup: "basic" },
  { word: "banana", digit: 5, symbol: "plátano", isFruits: true, fruitsGroup: "basic" },
  { word: "mango", digit: 6, symbol: "mango", isFruits: true, fruitsGroup: "basic" },
  { word: "custard apple", digit: 7, symbol: "chirimoya", isFruits: true, fruitsGroup: "basic" },
  { word: "pear", digit: 8, symbol: "pera", isFruits: true, fruitsGroup: "basic" },
  { word: "watermelon", digit: 9, symbol: "sandía", isFruits: true, fruitsGroup: "basic" },
  { word: "melon", digit: 10, symbol: "melón", isFruits: true, fruitsGroup: "basic" },
  { word: "grape", digit: 11, symbol: "uva", isFruits: true, fruitsGroup: "basic" },
  { word: "papaya", digit: 12, symbol: "papaya", isFruits: true, fruitsGroup: "basic" },
  { word: "coconut", digit: 13, symbol: "coco", isFruits: true, fruitsGroup: "basic" },
  { word: "pineapple", digit: 14, symbol: "piña", isFruits: true, fruitsGroup: "basic" },
  { word: "pomegranate", digit: 15, symbol: "granada", isFruits: true, fruitsGroup: "basic" }
];

export const fruitsBerries: NumberItem[] = [
  { word: "peach", digit: 16, symbol: "durazno", isFruits: true, fruitsGroup: "berries" },
  { word: "fig", digit: 17, symbol: "higo", isFruits: true, fruitsGroup: "berries" },
  { word: "strawberry", digit: 18, symbol: "fresa", isFruits: true, fruitsGroup: "berries" },
  { word: "plum", digit: 19, symbol: "ciruela", isFruits: true, fruitsGroup: "berries" },
  { word: "cherry", digit: 20, symbol: "cereza", isFruits: true, fruitsGroup: "berries" },
  { word: "blackberry", digit: 21, symbol: "mora", isFruits: true, fruitsGroup: "berries" },
  { word: "raspberry", digit: 22, symbol: "frambuesa", isFruits: true, fruitsGroup: "berries" },
  { word: "almond", digit: 23, symbol: "almendra", isFruits: true, fruitsGroup: "berries" },
  { word: "walnut", digit: 24, symbol: "nuez", isFruits: true, fruitsGroup: "berries" },
  { word: "kiwi", digit: 25, symbol: "kiwi", isFruits: true, fruitsGroup: "berries" },
  { word: "grapefruit", digit: 26, symbol: "toronja", isFruits: true, fruitsGroup: "berries" },
  { word: "apricot", digit: 27, symbol: "albaricoque", isFruits: true, fruitsGroup: "berries" },
  { word: "date", digit: 28, symbol: "dátil", isFruits: true, fruitsGroup: "berries" },
  { word: "cranberry", digit: 29, symbol: "arándano rojo", isFruits: true, fruitsGroup: "berries" },
  { word: "blueberry", digit: 30, symbol: "arándano azul", isFruits: true, fruitsGroup: "berries" }
];

export const totalFruits: NumberItem[] = [...fruitsBasic, ...fruitsBerries];

// =========================================================================
// MODULE 15: VEGETABLES DATA
// =========================================================================
export const vegetablesGreens: NumberItem[] = [
  { word: "potato", digit: 1, symbol: "papa", isVegetables: true, vegetablesGroup: "greens" },
  { word: "onion", digit: 2, symbol: "cebolla", isVegetables: true, vegetablesGroup: "greens" },
  { word: "corn", digit: 3, symbol: "maíz", isVegetables: true, vegetablesGroup: "greens" },
  { word: "tomato", digit: 4, symbol: "tomate", isVegetables: true, vegetablesGroup: "greens" },
  { word: "lettuce", digit: 5, symbol: "lechuga", isVegetables: true, vegetablesGroup: "greens" },
  { word: "carrot", digit: 6, symbol: "zanahoria", isVegetables: true, vegetablesGroup: "greens" },
  { word: "cabbage", digit: 7, symbol: "repollo", isVegetables: true, vegetablesGroup: "greens" },
  { word: "cucumber", digit: 8, symbol: "pepino", isVegetables: true, vegetablesGroup: "greens" },
  { word: "cauliflower", digit: 9, symbol: "coliflor", isVegetables: true, vegetablesGroup: "greens" },
  { word: "broccoli", digit: 10, symbol: "brócoli", isVegetables: true, vegetablesGroup: "greens" },
  { word: "celery", digit: 11, symbol: "apio", isVegetables: true, vegetablesGroup: "greens" },
  { word: "green beans", digit: 12, symbol: "chauchas", isVegetables: true, vegetablesGroup: "greens" },
  { word: "green pepper", digit: 13, symbol: "pimiento verde", isVegetables: true, vegetablesGroup: "greens" },
  { word: "chard", digit: 14, symbol: "acelga", isVegetables: true, vegetablesGroup: "greens" },
  { word: "asparagus", digit: 15, symbol: "espárrago", isVegetables: true, vegetablesGroup: "greens" },
  { word: "spinach", digit: 16, symbol: "espinaca", isVegetables: true, vegetablesGroup: "greens" },
  { word: "parsley", digit: 17, symbol: "perejil", isVegetables: true, vegetablesGroup: "greens" }
];

export const vegetablesTubers: NumberItem[] = [
  { word: "turnip", digit: 18, symbol: "nabo", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "beet", digit: 19, symbol: "remolacha", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "artichoke", digit: 20, symbol: "alcachofa", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "eggplant", digit: 21, symbol: "berenjena", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "sweet potato", digit: 22, symbol: "batata", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "pumpkin", digit: 23, symbol: "calabaza", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "squash", digit: 24, symbol: "calabacín", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "bell pepper", digit: 25, symbol: "pimentón", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "hot pepper", digit: 26, symbol: "ají picante", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "chickpeas", digit: 27, symbol: "garbanzos", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "beans", digit: 28, symbol: "frijoles", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "broad beans", digit: 29, symbol: "habas", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "lentils", digit: 30, symbol: "lentejas", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "garlic", digit: 31, symbol: "ajo", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "radish", digit: 32, symbol: "rábano", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "zucchini", digit: 33, symbol: "zapallito", isVegetables: true, vegetablesGroup: "tubers" },
  { word: "kale", digit: 34, symbol: "col rizada", isVegetables: true, vegetablesGroup: "tubers" }
];

export const totalVegetables: NumberItem[] = [...vegetablesGreens, ...vegetablesTubers];

// =========================================================================
// MODULE 16: FOOD DATA
// =========================================================================
export const foodMeals: NumberItem[] = [
  { word: "breakfast", digit: 1, symbol: "desayuno", isFood: true, foodGroup: "meals" },
  { word: "snack", digit: 2, symbol: "merienda", isFood: true, foodGroup: "meals" },
  { word: "lunch", digit: 3, symbol: "almuerzo", isFood: true, foodGroup: "meals" },
  { word: "dinner", digit: 4, symbol: "cena", isFood: true, foodGroup: "meals" },
  { word: "food", digit: 5, symbol: "comida", isFood: true, foodGroup: "meals" },
  { word: "water", digit: 6, symbol: "agua", isFood: true, foodGroup: "meals" },
  { word: "soft drink", digit: 7, symbol: "refresco", isFood: true, foodGroup: "meals" },
  { word: "lemonade", digit: 8, symbol: "limonada", isFood: true, foodGroup: "meals" },
  { word: "juice", digit: 9, symbol: "jugo", isFood: true, foodGroup: "meals" },
  { word: "soda", digit: 10, symbol: "gaseosa", isFood: true, foodGroup: "meals" },
  { word: "coffee", digit: 11, symbol: "café", isFood: true, foodGroup: "meals" },
  { word: "milk", digit: 12, symbol: "leche", isFood: true, foodGroup: "meals" },
  { word: "tea", digit: 13, symbol: "té", isFood: true, foodGroup: "meals" },
  { word: "wine", digit: 14, symbol: "vino", isFood: true, foodGroup: "meals" },
  { word: "beer", digit: 15, symbol: "cerveza", isFood: true, foodGroup: "meals" },
  { word: "bread", digit: 16, symbol: "pan", isFood: true, foodGroup: "meals" },
  { word: "eggs", digit: 17, symbol: "huevos", isFood: true, foodGroup: "meals" },
  { word: "cheese", digit: 18, symbol: "queso", isFood: true, foodGroup: "meals" }
];

export const foodPantry: NumberItem[] = [
  { word: "ham", digit: 19, symbol: "jamón", isFood: true, foodGroup: "pantry" },
  { word: "butter", digit: 20, symbol: "mantequilla", isFood: true, foodGroup: "pantry" },
  { word: "pastry", digit: 21, symbol: "pastelito", isFood: true, foodGroup: "pantry" },
  { word: "desserts", digit: 22, symbol: "postres", isFood: true, foodGroup: "pantry" },
  { word: "soup", digit: 23, symbol: "sopa", isFood: true, foodGroup: "pantry" },
  { word: "salad", digit: 24, symbol: "ensalada", isFood: true, foodGroup: "pantry" },
  { word: "pizza", digit: 25, symbol: "pizza", isFood: true, foodGroup: "pantry" },
  { word: "sugar", digit: 26, symbol: "azúcar", isFood: true, foodGroup: "pantry" },
  { word: "oil", digit: 27, symbol: "aceite", isFood: true, foodGroup: "pantry" },
  { word: "meat", digit: 28, symbol: "carne", isFood: true, foodGroup: "pantry" },
  { word: "pork", digit: 29, symbol: "cerdo", isFood: true, foodGroup: "pantry" },
  { word: "cookie", digit: 30, symbol: "galleta", isFood: true, foodGroup: "pantry" },
  { word: "flour", digit: 31, symbol: "harina", isFood: true, foodGroup: "pantry" },
  { word: "honey", digit: 32, symbol: "miel", isFood: true, foodGroup: "pantry" },
  { word: "ice cream", digit: 33, symbol: "helado", isFood: true, foodGroup: "pantry" },
  { word: "fish", digit: 34, symbol: "pescado", isFood: true, foodGroup: "pantry" }
];

export const foodPrepared: NumberItem[] = [
  { word: "chicken", digit: 35, symbol: "pollo", isFood: true, foodGroup: "prepared" },
  { word: "sausage", digit: 36, symbol: "salchicha", isFood: true, foodGroup: "prepared" },
  { word: "jam", digit: 37, symbol: "mermelada", isFood: true, foodGroup: "prepared" },
  { word: "rice", digit: 38, symbol: "arroz", isFood: true, foodGroup: "prepared" },
  { word: "salt", digit: 39, symbol: "sal", isFood: true, foodGroup: "prepared" },
  { word: "olives", digit: 40, symbol: "aceitunas", isFood: true, foodGroup: "prepared" },
  { word: "jelly", digit: 41, symbol: "gelatina", isFood: true, foodGroup: "prepared" },
  { word: "chili pepper", digit: 42, symbol: "ají", isFood: true, foodGroup: "prepared" },
  { word: "fried chicken", digit: 43, symbol: "pollo frito", isFood: true, foodGroup: "prepared" },
  { word: "hamburger", digit: 44, symbol: "hamburguesa", isFood: true, foodGroup: "prepared" },
  { word: "chocolate", digit: 45, symbol: "chocolate", isFood: true, foodGroup: "prepared" },
  { word: "pasta", digit: 46, symbol: "pasta", isFood: true, foodGroup: "prepared" },
  { word: "yogurt", digit: 47, symbol: "yogur", isFood: true, foodGroup: "prepared" },
  { word: "vinegar", digit: 48, symbol: "vinagre", isFood: true, foodGroup: "prepared" },
  { word: "toast", digit: 49, symbol: "tostada", isFood: true, foodGroup: "prepared" },
  { word: "pancake", digit: 50, symbol: "panqueque", isFood: true, foodGroup: "prepared" }
];

export const totalFood: NumberItem[] = [...foodMeals, ...foodPantry, ...foodPrepared];

// =========================================================================
// MODULE 17: TASTES, FLAVORS & COOKING DATA
// =========================================================================
export const tastesBasic: NumberItem[] = [
  { word: "bitter", digit: 1, symbol: "amargo", isTastes: true, tastesGroup: "basic", ipa: "/ˈbɪt.ɚ/" },
  { word: "bland", digit: 2, symbol: "insípido", isTastes: true, tastesGroup: "basic", ipa: "/blænd/" },
  { word: "chewy", digit: 3, symbol: "chicloso", isTastes: true, tastesGroup: "basic", ipa: "/ˈtʃuː.i/" },
  { word: "cold", digit: 4, symbol: "frío", isTastes: true, tastesGroup: "basic", ipa: "/koʊld/" },
  { word: "creamy", digit: 5, symbol: "cremoso", isTastes: true, tastesGroup: "basic", ipa: "/ˈkriː.mi/" },
  { word: "crispy", digit: 6, symbol: "crujiente", isTastes: true, tastesGroup: "basic", ipa: "/ˈkrɪs.pi/" },
  { word: "crunchy", digit: 7, symbol: "crocante", isTastes: true, tastesGroup: "basic", ipa: "/ˈkrʌn.tʃi/" },
  { word: "delicious", digit: 8, symbol: "delicioso", isTastes: true, tastesGroup: "basic", ipa: "/dɪˈlɪʃ.əs/" },
  { word: "dry", digit: 9, symbol: "seco", isTastes: true, tastesGroup: "basic", ipa: "/draɪ/" },
  { word: "fresh", digit: 10, symbol: "fresco", isTastes: true, tastesGroup: "basic", ipa: "/frɛʃ/" },
  { word: "frozen", digit: 11, symbol: "congelado", isTastes: true, tastesGroup: "basic", ipa: "/ˈfroʊ.zən/" },
  { word: "hot", digit: 12, symbol: "caliente", isTastes: true, tastesGroup: "basic", ipa: "/hɑːt/" },
  { word: "juicy", digit: 13, symbol: "jugoso", isTastes: true, tastesGroup: "basic", ipa: "/ˈdʒuː.si/" },
  { word: "medium", digit: 14, symbol: "al punto", isTastes: true, tastesGroup: "basic", ipa: "/ˈmiː.di.əm/" }
];

export const tastesAdvanced: NumberItem[] = [
  { word: "mild", digit: 15, symbol: "suave", isTastes: true, tastesGroup: "advanced", ipa: "/maɪld/" },
  { word: "overcooked", digit: 16, symbol: "recocido", isTastes: true, tastesGroup: "advanced", ipa: "/ˌoʊ.vɚˈkʊkt/" },
  { word: "raw", digit: 17, symbol: "crudo", isTastes: true, tastesGroup: "advanced", ipa: "/rɑː/" },
  { word: "rare", digit: 18, symbol: "poco hecho", isTastes: true, tastesGroup: "advanced", ipa: "/rer/" },
  { word: "ripe", digit: 19, symbol: "maduro", isTastes: true, tastesGroup: "advanced", ipa: "/raɪp/" },
  { word: "roasted", digit: 20, symbol: "asado", isTastes: true, tastesGroup: "advanced", ipa: "/ˈroʊ.stɪd/" },
  { word: "salty", digit: 21, symbol: "salado", isTastes: true, tastesGroup: "advanced", ipa: "/ˈsɑːl.ti/" },
  { word: "sour", digit: 22, symbol: "agrio", isTastes: true, tastesGroup: "advanced", ipa: "/ˈsaʊ.ɚ/" },
  { word: "spicy", digit: 23, symbol: "picante", isTastes: true, tastesGroup: "advanced", ipa: "/ˈspaɪ.si/" },
  { word: "sweet", digit: 24, symbol: "dulce", isTastes: true, tastesGroup: "advanced", ipa: "/swiːt/" },
  { word: "tasty", digit: 25, symbol: "sabroso", isTastes: true, tastesGroup: "advanced", ipa: "/ˈteɪ.sti/" },
  { word: "tender", digit: 26, symbol: "tierno", isTastes: true, tastesGroup: "advanced", ipa: "/ˈtɛn.dɚ/" },
  { word: "well-done", digit: 27, symbol: "bien cocido", isTastes: true, tastesGroup: "advanced", ipa: "/ˌwɛlˈdʌn/" },
  { word: "zesty", digit: 28, symbol: "cítrico", isTastes: true, tastesGroup: "advanced", ipa: "/ˈzɛs.ti/" }
];

export const totalTastes: NumberItem[] = [...tastesBasic, ...tastesAdvanced];

export const cookingVerbsList: NumberItem[] = [
  { word: "roast", digit: 1, symbol: "asar", isTastes: true, tastesGroup: "verbs", ipa: "/roʊst/" },
  { word: "stew", digit: 2, symbol: "estofar", isTastes: true, tastesGroup: "verbs", ipa: "/stuː/" },
  { word: "smoke", digit: 3, symbol: "ahumar", isTastes: true, tastesGroup: "verbs", ipa: "/smoʊk/" },
  { word: "steam", digit: 4, symbol: "cocinar al vapor", isTastes: true, tastesGroup: "verbs", ipa: "/stiːm/" },
  { word: "bake", digit: 5, symbol: "hornear", isTastes: true, tastesGroup: "verbs", ipa: "/beɪk/" },
  { word: "barbecue", digit: 6, symbol: "asar a la parrilla", isTastes: true, tastesGroup: "verbs", ipa: "/ˈbɑːr.bə.kjuː/" },
  { word: "blend", digit: 7, symbol: "licuar", isTastes: true, tastesGroup: "verbs", ipa: "/blɛnd/" },
  { word: "boil", digit: 8, symbol: "hervir", isTastes: true, tastesGroup: "verbs", ipa: "/bɔɪl/" },
  { word: "chop", digit: 9, symbol: "picar", isTastes: true, tastesGroup: "verbs", ipa: "/tʃɑːp/" },
  { word: "cook", digit: 10, symbol: "cocinar", isTastes: true, tastesGroup: "verbs", ipa: "/kʊk/" },
  { word: "cut", digit: 11, symbol: "cortar", isTastes: true, tastesGroup: "verbs", ipa: "/kʌt/" },
  { word: "dice", digit: 12, symbol: "cortar en cubos", isTastes: true, tastesGroup: "verbs", ipa: "/daɪs/" },
  { word: "drink", digit: 13, symbol: "beber", isTastes: true, tastesGroup: "verbs", ipa: "/drɪŋk/" },
  { word: "eat", digit: 14, symbol: "comer", isTastes: true, tastesGroup: "verbs", ipa: "/iːt/" },
  { word: "fry", digit: 15, symbol: "freír", isTastes: true, tastesGroup: "verbs", ipa: "/fraɪ/" },
  { word: "grate", digit: 16, symbol: "rallar", isTastes: true, tastesGroup: "verbs", ipa: "/ɡreɪt/" },
  { word: "grill", digit: 17, symbol: "asar a la plancha", isTastes: true, tastesGroup: "verbs", ipa: "/ɡrɪl/" },
  { word: "have", digit: 18, symbol: "tomar", isTastes: true, tastesGroup: "verbs", ipa: "/hæv/" },
  { word: "marinate", digit: 19, symbol: "marinar", isTastes: true, tastesGroup: "verbs", ipa: "/ˈmær.ə.neɪt/" },
  { word: "melt", digit: 20, symbol: "derretir", isTastes: true, tastesGroup: "verbs", ipa: "/mɛlt/" },
  { word: "mix", digit: 21, symbol: "mezclar", isTastes: true, tastesGroup: "verbs", ipa: "/mɪks/" },
  { word: "peel", digit: 22, symbol: "pelar", isTastes: true, tastesGroup: "verbs", ipa: "/piːl/" },
  { word: "pour", digit: 23, symbol: "verter", isTastes: true, tastesGroup: "verbs", ipa: "/pɔːr/" },
  { word: "season", digit: 24, symbol: "sazonar", isTastes: true, tastesGroup: "verbs", ipa: "/ˈsiː.zən/" },
  { word: "serve", digit: 25, symbol: "servir", isTastes: true, tastesGroup: "verbs", ipa: "/sɝːv/" },
  { word: "slice", digit: 26, symbol: "rebanar", isTastes: true, tastesGroup: "verbs", ipa: "/slaɪs/" },
  { word: "stir", digit: 27, symbol: "revolver", isTastes: true, tastesGroup: "verbs", ipa: "/stɝː/" },
  { word: "take", digit: 28, symbol: "tomar", isTastes: true, tastesGroup: "verbs", ipa: "/teɪk/" },
  { word: "taste", digit: 29, symbol: "probar", isTastes: true, tastesGroup: "verbs", ipa: "/teɪst/" },
  { word: "toast", digit: 30, symbol: "tostar", isTastes: true, tastesGroup: "verbs", ipa: "/toʊst/" }
];

export const tastesSentences: { e: string, c: string, d: string[] }[] = [
  { e: "This curry is quite spicy but delicious.", c: "Este curry es bastante picante pero delicioso.", d: ["Este curry es muy salado pero sabroso.", "Este curry es dulce y suave."] },
  { e: "I prefer sweet apples to sour ones.", c: "Prefiero manzanas dulces a las ácidas.", d: ["Me gustan las manzanas verdes.", "Las manzanas rojas son ácidas."] },
  { e: "The meat is tender and juicy.", c: "La carne está tierna y jugosa.", d: ["La carne está seca y dura.", "El pescado está fresco."] },
  { e: "These cookies are crispy and sweet.", c: "Estas galletas son crujientes y dulces.", d: ["Estas galletas están blandas y saladas.", "Los pasteles son suaves."] },
  { e: "I like my steak medium, not well-done.", c: "Me gusta mi bistec al punto, no bien cocido.", d: ["Prefiero la carne cruda.", "El pollo debe estar jugoso."] },
  { e: "The soup is a bit bland, add some salt.", c: "La sopa está un poco insípida, agrega un poco de sal.", d: ["La sopa está muy picante.", "El caldo está dulce."] },
  { e: "Fresh lemonade is very refreshing.", c: "La limonada fresca es muy refrescante.", d: ["El jugo de naranja es amargo.", "El agua caliente es buena."] },
  { e: "This cake is creamy and delicious.", c: "Este pastel es cremoso y delicioso.", d: ["El pastel está seco.", "La torta está quemada."] },
  { e: "Raw fish is used in sushi.", c: "El pescado crudo se usa en el sushi.", d: ["El pescado frito es mejor.", "La carne cruda es peligrosa."] },
  { e: "The sauce is too salty for me.", c: "La salsa está demasiado salada para mí.", d: ["La salsa está dulce.", "El aderezo es ácido."] },
  { e: "I love crispy fried chicken.", c: "Me encanta el pollo frito crujiente.", d: ["Odio el pollo hervido.", "El pavo asado es seco."] },
  { e: "These grapes are ripe and sweet.", c: "Estas uvas están maduras y dulces.", d: ["Las uvas están verdes y ácidas.", "Las manzanas están podridas."] },
  { e: "The steak is rare, just how I like it.", c: "El bistec está poco hecho, justo como me gusta.", d: ["La carne está muy cocida.", "El pescado está crudo."] },
  { e: "This chocolate is rich and creamy.", c: "Este chocolate es intenso y cremoso.", d: ["El chocolate es amargo.", "El caramelo es duro."] },
  { e: "The pizza has a crispy crust.", c: "La pizza tiene una corteza crujiente.", d: ["La pizza está empapada.", "El pan está blando."] },
  { e: "I do not like spicy food; it is too hot for me.", c: "No me gusta la comida picante; es muy picante para mí.", d: ["Me encanta la comida dulce.", "La comida salada es mala."] },
  { e: "The salad is fresh and crunchy.", c: "La ensalada es fresca y crocante.", d: ["La ensalada está marchita.", "El adrezo es pesado."] },
  { e: "Roasted vegetables are very tasty.", c: "Las verduras asadas son muy sabrosas.", d: ["Las verduras hervidas son insípidas.", "La carne cruda es peligrosa."] },
  { e: "This ice cream is creamy and cold.", c: "Este helado es cremoso y frío.", d: ["El helado está derretido.", "El yogur es caliente."] },
  { e: "The bread is fresh out of the oven.", c: "El pan está recién salido del horno.", d: ["El pan está duro.", "La tortilla está quemada."] }
];

// =========================================================================
// MODULE 18: CLOTHING DATA
// =========================================================================
export const clothingBasic: NumberItem[] = [
  { word: "t-shirt", digit: 1, symbol: "camiseta", isClothing: true, clothingGroup: "basic", ipa: "/ˈtiː.ʃɝːt/" },
  { word: "polo shirt", digit: 2, symbol: "polo", isClothing: true, clothingGroup: "basic", ipa: "/ˈpoʊ.loʊ ʃɝːt/" },
  { word: "shirt", digit: 3, symbol: "camisa", isClothing: true, clothingGroup: "basic", ipa: "/ʃɝːt/" },
  { word: "jumper", digit: 4, symbol: "suéter", isClothing: true, clothingGroup: "basic", ipa: "/ˈdʒʌm.pɚ/" },
  { word: "jacket", digit: 5, symbol: "chaqueta", isClothing: true, clothingGroup: "basic", ipa: "/ˈdʒæk.ɪt/" },
  { word: "long-sleeved shirt", digit: 6, symbol: "camisa de manga larga", isClothing: true, clothingGroup: "basic", ipa: "/lɑːŋ.sliːvd ʃɝːt/" },
  { word: "belt", digit: 7, symbol: "cinturón", isClothing: true, clothingGroup: "basic", ipa: "/bɛlt/" },
  { word: "shorts", digit: 8, symbol: "shorts", isClothing: true, clothingGroup: "basic", ipa: "/ʃɔːrts/" },
  { word: "pants", digit: 9, symbol: "pantalones", isClothing: true, clothingGroup: "basic", ipa: "/pænts/" },
  { word: "coat", digit: 10, symbol: "abrigo", isClothing: true, clothingGroup: "basic", ipa: "/koʊt/" },
  { word: "vest", digit: 11, symbol: "chaleco", isClothing: true, clothingGroup: "basic", ipa: "/vɛst/" },
  { word: "underwear", digit: 12, symbol: "ropa interior", isClothing: true, clothingGroup: "basic", ipa: "/ˈʌn.dɚ.wer/" },
  { word: "boxer shorts", digit: 13, symbol: "boxers", isClothing: true, clothingGroup: "basic", ipa: "/ˈbɑːk.sɚ ʃɔːrts/" },
  { word: "sock", digit: 14, symbol: "calcetín", isClothing: true, clothingGroup: "basic", ipa: "/sɑːk/" },
  { word: "cap", digit: 15, symbol: "gorra", isClothing: true, clothingGroup: "basic", ipa: "/kæp/" },
  { word: "hat", digit: 16, symbol: "sombrero", isClothing: true, clothingGroup: "basic", ipa: "/hæt/" },
  { word: "tie", digit: 17, symbol: "corbata", isClothing: true, clothingGroup: "basic", ipa: "/taɪ/" },
  { word: "bow tie", digit: 18, symbol: "moño", isClothing: true, clothingGroup: "basic", ipa: "/ˌboʊ ˈtaɪ/" },
  { word: "wallet", digit: 19, symbol: "billetera", isClothing: true, clothingGroup: "basic", ipa: "/ˈwɑː.lɪt/" },
  { word: "watch", digit: 20, symbol: "reloj", isClothing: true, clothingGroup: "basic", ipa: "/wɑːtʃ/" },
  { word: "flip-flop", digit: 21, symbol: "chancla", isClothing: true, clothingGroup: "basic", ipa: "/ˈflɪp.flɑːp/" },
  { word: "sport shoe", digit: 22, symbol: "zapatilla deportiva", isClothing: true, clothingGroup: "basic", ipa: "/spɔːrt ʃuː/" },
  { word: "shoe", digit: 23, symbol: "zapato", isClothing: true, clothingGroup: "basic", ipa: "/ʃuː/" },
  { word: "shoes", digit: 24, symbol: "zapatos", isClothing: true, clothingGroup: "basic", ipa: "/ʃuːz/" },
  { word: "sneakers", digit: 25, symbol: "tenis", isClothing: true, clothingGroup: "basic", ipa: "/ˈsniː.kɚz/" },
  { word: "jeans", digit: 26, symbol: "jeans", isClothing: true, clothingGroup: "basic", ipa: "/dʒiːnz/" },
  { word: "sweater", digit: 27, symbol: "suéter", isClothing: true, clothingGroup: "basic", ipa: "/ˈswɛt.ɚ/" },
  { word: "hoodie", digit: 28, symbol: "sudadera con capucha", isClothing: true, clothingGroup: "basic", ipa: "/ˈhʊd.i/" },
  { word: "scarf", digit: 29, symbol: "bufanda", isClothing: true, clothingGroup: "basic", ipa: "/skɑːrf/" },
  { word: "gloves", digit: 30, symbol: "guantes", isClothing: true, clothingGroup: "basic", ipa: "/ɡlʌvz/" }
];

export const clothingWomens: NumberItem[] = [
  { word: "blouse", digit: 1, symbol: "blusa", isClothing: true, clothingGroup: "womens", ipa: "/blaʊz/" },
  { word: "dress", digit: 2, symbol: "vestido", isClothing: true, clothingGroup: "womens", ipa: "/drɛs/" },
  { word: "breeches", digit: 3, symbol: "calzón (bombacho)", isClothing: true, clothingGroup: "womens", ipa: "/ˈbrɪtʃ.ɪz/" },
  { word: "skirt", digit: 4, symbol: "falda", isClothing: true, clothingGroup: "womens", ipa: "/skɝːt/" },
  { word: "suit", digit: 5, symbol: "traje", isClothing: true, clothingGroup: "womens", ipa: "/suːt/" },
  { word: "pajamas", digit: 6, symbol: "pijama", isClothing: true, clothingGroup: "womens", ipa: "/pəˈdʒæm.əz/" },
  { word: "garment", digit: 7, symbol: "prenda de vestir", isClothing: true, clothingGroup: "womens", ipa: "/ˈɡɑːr.mənt/" },
  { word: "raincoat", digit: 8, symbol: "impermeable", isClothing: true, clothingGroup: "womens", ipa: "/ˈreɪn.koʊt/" },
  { word: "brassiere", digit: 9, symbol: "sostén", isClothing: true, clothingGroup: "womens", ipa: "/brəˈzɪr/" },
  { word: "scarf", digit: 10, symbol: "bufanda", isClothing: true, clothingGroup: "womens", ipa: "/skɑːrf/" },
  { word: "necklace", digit: 11, symbol: "collar", isClothing: true, clothingGroup: "womens", ipa: "/ˈnɛk.ləs/" },
  { word: "earring", digit: 12, symbol: "arete", isClothing: true, clothingGroup: "womens", ipa: "/ˈɪr.ɪŋ/" },
  { word: "ring", digit: 13, symbol: "anillo", isClothing: true, clothingGroup: "womens", ipa: "/rɪŋ/" },
  { word: "bracelet", digit: 14, symbol: "pulsera", isClothing: true, clothingGroup: "womens", ipa: "/ˈbreɪ.slət/" },
  { word: "umbrella", digit: 15, symbol: "paraguas", isClothing: true, clothingGroup: "womens", ipa: "/ʌmˈbrɛl.ə/" },
  { word: "purse", digit: 16, symbol: "cartera", isClothing: true, clothingGroup: "womens", ipa: "/pɝːs/" },
  { word: "comb", digit: 17, symbol: "peine", isClothing: true, clothingGroup: "womens", ipa: "/koʊm/" },
  { word: "glasses", digit: 18, symbol: "gafas", isClothing: true, clothingGroup: "womens", ipa: "/ˈɡlæs.ɪz/" },
  { word: "gloves", digit: 19, symbol: "guantes", isClothing: true, clothingGroup: "womens", ipa: "/ɡlʌvz/" },
  { word: "slipper", digit: 20, symbol: "zapatilla de casa", isClothing: true, clothingGroup: "womens", ipa: "/ˈslɪp.ɚ/" },
  { word: "sandals", digit: 21, symbol: "sandalias", isClothing: true, clothingGroup: "womens", ipa: "/ˈsæn.dəlz/" },
  { word: "boot", digit: 22, symbol: "bota", isClothing: true, clothingGroup: "womens", ipa: "/buːt/" },
  { word: "mirror", digit: 23, symbol: "espejo", isClothing: true, clothingGroup: "womens", ipa: "/ˈmɪr.ɚ/" },
  { word: "high heels", digit: 24, symbol: "tacones", isClothing: true, clothingGroup: "womens", ipa: "/ˌhaɪ ˈhiːlz/" },
  { word: "stockings", digit: 25, symbol: "medias", isClothing: true, clothingGroup: "womens", ipa: "/ˈstɑː.kɪŋz/" },
  { word: "leggings", digit: 26, symbol: "leggings", isClothing: true, clothingGroup: "womens", ipa: "/ˈlɛɡ.ɪŋz/" },
  { word: "cardigan", digit: 27, symbol: "cárdigan", isClothing: true, clothingGroup: "womens", ipa: "/ˈkɑːr.dɪ.ɡən/" },
  { word: "tank top", digit: 28, symbol: "camiseta sin mangas", isClothing: true, clothingGroup: "womens", ipa: "/ˈtæŋk ˌtɑːp/" },
  { word: "kimono", digit: 29, symbol: "kimono", isClothing: true, clothingGroup: "womens", ipa: "/kɪˈmoʊ.noʊ/" },
  { word: "shawl", digit: 30, symbol: "chal", isClothing: true, clothingGroup: "womens", ipa: "/ʃɑːl/" }
];

export const totalClothing: NumberItem[] = [...clothingBasic, ...clothingWomens];

// =========================================================================
// MODULE 19: BODY & HUMAN ANATOMY DATA
// =========================================================================
export const bodyExternal: NumberItem[] = [
  { word: "head", digit: 1, symbol: "cabeza", isBody: true, bodyGroup: "external", ipa: "/hɛd/" },
  { word: "face", digit: 2, symbol: "cara", isBody: true, bodyGroup: "external", ipa: "/feɪs/" },
  { word: "hair", digit: 3, symbol: "cabello", isBody: true, bodyGroup: "external", ipa: "/hɛr/" },
  { word: "ear", digit: 4, symbol: "oreja", isBody: true, bodyGroup: "external", ipa: "/ɪr/" },
  { word: "forehead", digit: 5, symbol: "frente", isBody: true, bodyGroup: "external", ipa: "/ˈfɔːr.hɛd/" },
  { word: "eyebrow", digit: 6, symbol: "ceja", isBody: true, bodyGroup: "external", ipa: "/ˈaɪ.braʊ/" },
  { word: "eyelid", digit: 7, symbol: "párpado", isBody: true, bodyGroup: "external", ipa: "/ˈaɪ.lɪd/" },
  { word: "eyelash", digit: 8, symbol: "pestaña", isBody: true, bodyGroup: "external", ipa: "/ˈaɪ.læʃ/" },
  { word: "eye", digit: 9, symbol: "ojo", isBody: true, bodyGroup: "external", ipa: "/aɪ/" },
  { word: "nose", digit: 10, symbol: "nariz", isBody: true, bodyGroup: "external", ipa: "/noʊz/" },
  { word: "cheek", digit: 11, symbol: "mejilla", isBody: true, bodyGroup: "external", ipa: "/tʃiːk/" },
  { word: "mouth", digit: 12, symbol: "boca", isBody: true, bodyGroup: "external", ipa: "/maʊθ/" },
  { word: "lips", digit: 13, symbol: "labios", isBody: true, bodyGroup: "external", ipa: "/lɪps/" },
  { word: "tooth", digit: 14, symbol: "diente", isBody: true, bodyGroup: "external", ipa: "/tuːθ/" },
  { word: "teeth", digit: 15, symbol: "dientes", isBody: true, bodyGroup: "external", ipa: "/tiːθ/" },
  { word: "tongue", digit: 16, symbol: "lengua", isBody: true, bodyGroup: "external", ipa: "/tʌŋ/" },
  { word: "chin", digit: 17, symbol: "barbilla", isBody: true, bodyGroup: "external", ipa: "/tʃɪn/" },
  { word: "neck", digit: 18, symbol: "cuello", isBody: true, bodyGroup: "external", ipa: "/nɛk/" },
  { word: "back", digit: 19, symbol: "espalda", isBody: true, bodyGroup: "external", ipa: "/bæk/" },
  { word: "shoulders", digit: 20, symbol: "hombros", isBody: true, bodyGroup: "external", ipa: "/ˈʃoʊl.dɚz/" },
  { word: "arm", digit: 21, symbol: "brazo", isBody: true, bodyGroup: "external", ipa: "/ɑːrm/" },
  { word: "elbow", digit: 22, symbol: "codo", isBody: true, bodyGroup: "external", ipa: "/ˈɛl.boʊ/" },
  { word: "wrist", digit: 23, symbol: "muñeca", isBody: true, bodyGroup: "external", ipa: "/rɪst/" },
  { word: "hand", digit: 24, symbol: "mano", isBody: true, bodyGroup: "external", ipa: "/hænd/" },
  { word: "finger", digit: 25, symbol: "dedo", isBody: true, bodyGroup: "external", ipa: "/ˈfɪŋ.ɡɚ/" },
  { word: "nails", digit: 26, symbol: "uñas", isBody: true, bodyGroup: "external", ipa: "/neɪlz/" },
  { word: "chest", digit: 27, symbol: "pecho", isBody: true, bodyGroup: "external", ipa: "/tʃɛst/" },
  { word: "breast", digit: 28, symbol: "seno", isBody: true, bodyGroup: "external", ipa: "/brɛst/" },
  { word: "buttocks", digit: 29, symbol: "nalgas", isBody: true, bodyGroup: "external", ipa: "/ˈbʌt.əks/" },
  { word: "stomach", digit: 30, symbol: "estómago", isBody: true, bodyGroup: "external", ipa: "/ˈstʌm.ək/" },
  { word: "belly", digit: 31, symbol: "vientre", isBody: true, bodyGroup: "external", ipa: "/ˈbɛl.i/" },
  { word: "hip", digit: 32, symbol: "cadera", isBody: true, bodyGroup: "external", ipa: "/hɪp/" },
  { word: "leg", digit: 33, symbol: "pierna", isBody: true, bodyGroup: "external", ipa: "/lɛɡ/" },
  { word: "knee", digit: 34, symbol: "rodilla", isBody: true, bodyGroup: "external", ipa: "/niː/" },
  { word: "ankle", digit: 35, symbol: "tobillo", isBody: true, bodyGroup: "external", ipa: "/ˈæŋ.kəl/" },
  { word: "foot", digit: 36, symbol: "pie", isBody: true, bodyGroup: "external", ipa: "/fʊt/" },
  { word: "feet", digit: 37, symbol: "pies", isBody: true, bodyGroup: "external", ipa: "/fiːt/" },
  { word: "toe", digit: 38, symbol: "dedo del pie", isBody: true, bodyGroup: "external", ipa: "/toʊ/" },
  { word: "see", digit: 39, symbol: "ver", isBody: true, bodyGroup: "external", ipa: "/siː/" },
  { word: "hear", digit: 40, symbol: "oír", isBody: true, bodyGroup: "external", ipa: "/hɪr/" },
  { word: "touch", digit: 41, symbol: "tocar", isBody: true, bodyGroup: "external", ipa: "/tʌtʃ/" },
  { word: "listen", digit: 42, symbol: "escuchar", isBody: true, bodyGroup: "external", ipa: "/ˈlɪs.ən/" },
  { word: "feel", digit: 43, symbol: "sentir", isBody: true, bodyGroup: "external", ipa: "/fiːl/" },
  { word: "smell", digit: 44, symbol: "oler", isBody: true, bodyGroup: "external", ipa: "/smɛl/" },
  { word: "taste", digit: 45, symbol: "gustar (sabor)", isBody: true, bodyGroup: "external", ipa: "/teɪst/" }
];

export const bodyInternal: NumberItem[] = [
  { word: "bone", digit: 1, symbol: "hueso", isBody: true, bodyGroup: "internal", ipa: "/boʊn/" },
  { word: "cranium", digit: 2, symbol: "cráneo", isBody: true, bodyGroup: "internal", ipa: "/ˈkreɪ.ni.əm/" },
  { word: "mandible", digit: 3, symbol: "mandíbula", isBody: true, bodyGroup: "internal", ipa: "/ˈmæn.də.bəl/" },
  { word: "sternum", digit: 4, symbol: "esternón", isBody: true, bodyGroup: "internal", ipa: "/ˈstɝː.nəm/" },
  { word: "ribs", digit: 5, symbol: "costillas", isBody: true, bodyGroup: "internal", ipa: "/rɪbz/" },
  { word: "fibula", digit: 6, symbol: "peroné", isBody: true, bodyGroup: "internal", ipa: "/ˈfɪb.jə.lə/" },
  { word: "humerus", digit: 7, symbol: "húmero", isBody: true, bodyGroup: "internal", ipa: "/ˈhjuː.mər.əs/" },
  { word: "radius", digit: 8, symbol: "radio", isBody: true, bodyGroup: "internal", ipa: "/ˈreɪ.di.əs/" },
  { word: "ulna", digit: 9, symbol: "cúbito", isBody: true, bodyGroup: "internal", ipa: "/ˈʌl.nə/" },
  { word: "femur", digit: 10, symbol: "fémur", isBody: true, bodyGroup: "internal", ipa: "/ˈfiː.mɚ/" },
  { word: "patella", digit: 11, symbol: "rótula", isBody: true, bodyGroup: "internal", ipa: "/pəˈtɛl.ə/" },
  { word: "tibia", digit: 12, symbol: "tibia", isBody: true, bodyGroup: "internal", ipa: "/ˈtɪb.i.ə/" },
  { word: "body", digit: 13, symbol: "cuerpo", isBody: true, bodyGroup: "internal", ipa: "/ˈbɑː.di/" },
  { word: "brain", digit: 14, symbol: "cerebro", isBody: true, bodyGroup: "internal", ipa: "/breɪn/" },
  { word: "muscle", digit: 15, symbol: "músculo", isBody: true, bodyGroup: "internal", ipa: "/ˈmʌs.əl/" },
  { word: "heart", digit: 16, symbol: "corazón", isBody: true, bodyGroup: "internal", ipa: "/hɑːrt/" },
  { word: "throat", digit: 17, symbol: "garganta", isBody: true, bodyGroup: "internal", ipa: "/θroʊt/" },
  { word: "esophagus", digit: 18, symbol: "esófago", isBody: true, bodyGroup: "internal", ipa: "/ɪˈsɑː.fə.ɡəs/" },
  { word: "liver", digit: 19, symbol: "hígado", isBody: true, bodyGroup: "internal", ipa: "/ˈlɪv.ɚ/" },
  { word: "lung", digit: 20, symbol: "pulmón", isBody: true, bodyGroup: "internal", ipa: "/lʌŋ/" },
  { word: "kidney", digit: 21, symbol: "riñón", isBody: true, bodyGroup: "internal", ipa: "/ˈkɪd.ni/" },
  { word: "vein", digit: 22, symbol: "vena", isBody: true, bodyGroup: "internal", ipa: "/veɪn/" },
  { word: "artery", digit: 23, symbol: "arteria", isBody: true, bodyGroup: "internal", ipa: "/ˈɑːr.t̬ɚ.i/" },
  { word: "blood", digit: 24, symbol: "sangre", isBody: true, bodyGroup: "internal", ipa: "/blʌd/" },
  { word: "skin", digit: 25, symbol: "piel", isBody: true, bodyGroup: "internal", ipa: "/skɪn/" },
  { word: "tear", digit: 26, symbol: "lágrima", isBody: true, bodyGroup: "internal", ipa: "/tɪr/" },
  { word: "sweat", digit: 27, symbol: "sudor", isBody: true, bodyGroup: "internal", ipa: "/swɛt/" },
  { word: "cry", digit: 28, symbol: "llorar", isBody: true, bodyGroup: "internal", ipa: "/kraɪ/" },
  { word: "spit", digit: 29, symbol: "escupir", isBody: true, bodyGroup: "internal", ipa: "/spɪt/" },
  { word: "cough", digit: 30, symbol: "toser", isBody: true, bodyGroup: "internal", ipa: "/kɔːf/" },
  { word: "fart", digit: 31, symbol: "tirarse un gas", isBody: true, bodyGroup: "internal", ipa: "/fɑːrt/" },
  { word: "allergy", digit: 32, symbol: "alergia", isBody: true, bodyGroup: "internal", ipa: "/ˈæl.ɚ.dʒi/" },
  { word: "allergic", digit: 33, symbol: "alérgico", isBody: true, bodyGroup: "internal", ipa: "/əˈlɝː.dʒɪk/" },
  { word: "cold", digit: 34, symbol: "resfriado", isBody: true, bodyGroup: "internal", ipa: "/koʊld/" },
  { word: "sick", digit: 35, symbol: "enfermo", isBody: true, bodyGroup: "internal", ipa: "/sɪk/" },
  { word: "healthy", digit: 36, symbol: "sano", isBody: true, bodyGroup: "internal", ipa: "/ˈhɛl.θi/" },
  { word: "laugh", digit: 37, symbol: "reír", isBody: true, bodyGroup: "internal", ipa: "/læf/" },
  { word: "smile", digit: 38, symbol: "sonreír", isBody: true, bodyGroup: "internal", ipa: "/smaɪl/" },
  { word: "pimple", digit: 39, symbol: "grano", isBody: true, bodyGroup: "internal", ipa: "/ˈpɪm.pəl/" },
  { word: "scar", digit: 40, symbol: "cicatriz", isBody: true, bodyGroup: "internal", ipa: "/skɑːr/" },
  { word: "wrinkle", digit: 41, symbol: "arruga", isBody: true, bodyGroup: "internal", ipa: "/ˈrɪŋ.kəl/" },
  { word: "infection", digit: 42, symbol: "infección", isBody: true, bodyGroup: "internal", ipa: "/ɪnˈfɛk.ʃən/" },
  { word: "scratch", digit: 43, symbol: "raspón", isBody: true, bodyGroup: "internal", ipa: "/skrætʃ/" },
  { word: "deaf", digit: 44, symbol: "sordo", isBody: true, bodyGroup: "internal", ipa: "/dɛf/" },
  { word: "mute", digit: 45, symbol: "mudo", isBody: true, bodyGroup: "internal", ipa: "/mjuːt/" },
  { word: "blind", digit: 46, symbol: "ciego", isBody: true, bodyGroup: "internal", ipa: "/blaɪnd/" },
  { word: "fever", digit: 47, symbol: "fiebre", isBody: true, bodyGroup: "internal", ipa: "/ˈfiː.vɚ/" },
  { word: "headache", digit: 48, symbol: "dolor de cabeza", isBody: true, bodyGroup: "internal", ipa: "/ˈhɛd.eɪk/" },
  { word: "stomachache", digit: 49, symbol: "dolor de estómago", isBody: true, bodyGroup: "internal", ipa: "/ˈstʌm.ək.eɪk/" },
  { word: "bruise", digit: 50, symbol: "moretón", isBody: true, bodyGroup: "internal", ipa: "/bruːz/" }
];

export const totalBody: NumberItem[] = [...bodyExternal, ...bodyInternal];

// =========================================================================
// MODULE 20: ROUTINE & Commands DATA (100 words total)
// =========================================================================
export const routineBasic: NumberItem[] = [
  { word: "wake up", digit: 1, symbol: "despertarse", isRoutine: true, routineGroup: "daily", ipa: "/weɪk ʌp/" },
  { word: "get up", digit: 2, symbol: "levantarse", isRoutine: true, routineGroup: "daily", ipa: "/ɡɛt ʌp/" },
  { word: "make the bed", digit: 3, symbol: "hacer la cama", isRoutine: true, routineGroup: "daily", ipa: "/meɪk ðə bɛd/" },
  { word: "wash your face", digit: 4, symbol: "lavarse la cara", isRoutine: true, routineGroup: "daily", ipa: "/wɑːʃ jʊər feɪs/" },
  { word: "take a shower", digit: 5, symbol: "ducharse", isRoutine: true, routineGroup: "daily", ipa: "/teɪk ə ˈʃaʊ.ər/" },
  { word: "take a bath", digit: 6, symbol: "bañarse (en tina)", isRoutine: true, routineGroup: "daily", ipa: "/teɪk ə bæθ/" },
  { word: "dry your hair", digit: 7, symbol: "secarse el pelo", isRoutine: true, routineGroup: "daily", ipa: "/draɪ jʊər hɛr/" },
  { word: "floss", digit: 8, symbol: "usar hilo dental", isRoutine: true, routineGroup: "daily", ipa: "/flɑːs/" },
  { word: "brush your teeth", digit: 9, symbol: "cepillarse los dientes", isRoutine: true, routineGroup: "daily", ipa: "/brʌʃ jʊər tiːθ/" },
  { word: "comb your hair", digit: 10, symbol: "peinarse", isRoutine: true, routineGroup: "daily", ipa: "/koʊm jʊər hɛr/" },
  { word: "shave", digit: 11, symbol: "afeitarse", isRoutine: true, routineGroup: "daily", ipa: "/ʃeɪv/" },
  { word: "put on makeup", digit: 12, symbol: "maquillarse", isRoutine: true, routineGroup: "daily", ipa: "/pʊt ɑːn ˈmeɪk.ʌp/" },
  { word: "get dressed", digit: 13, symbol: "vestirse", isRoutine: true, routineGroup: "daily", ipa: "/ɡɛt drɛst/" },
  { word: "have breakfast", digit: 14, symbol: "desayunar", isRoutine: true, routineGroup: "daily", ipa: "/hæv ˈbrɛk.fəst/" },
  { word: "go to work", digit: 15, symbol: "ir al trabajo", isRoutine: true, routineGroup: "daily", ipa: "/ɡoʊ tuː wɝːk/" },
  { word: "go to school", digit: 16, symbol: "ir a la escuela", isRoutine: true, routineGroup: "daily", ipa: "/ɡoʊ tuː skuːl/" },
  { word: "leave home", digit: 17, symbol: "salir de casa", isRoutine: true, routineGroup: "daily", ipa: "/liːv hoʊm/" },
  { word: "catch the bus", digit: 18, symbol: "tomar el autobús", isRoutine: true, routineGroup: "daily", ipa: "/kætʃ ðə bʌs/" },
  { word: "drive to work", digit: 19, symbol: "conducir al trabajo", isRoutine: true, routineGroup: "daily", ipa: "/draɪv tuː wɝːk/" },
  { word: "start work", digit: 20, symbol: "empezar a trabajar", isRoutine: true, routineGroup: "daily", ipa: "/stɑːrt wɝːk/" },
  { word: "have a break", digit: 21, symbol: "tomar un descanso", isRoutine: true, routineGroup: "daily", ipa: "/hæv ə breɪk/" },
  { word: "have lunch", digit: 22, symbol: "almorzar", isRoutine: true, routineGroup: "daily", ipa: "/hæv lʌntʃ/" },
  { word: "take a nap", digit: 23, symbol: "tomar una siesta", isRoutine: true, routineGroup: "daily", ipa: "/teɪk ə næp/" },
  { word: "finish work", digit: 24, symbol: "terminar el trabajo", isRoutine: true, routineGroup: "daily", ipa: "/ˈfɪn.ɪʃ wɝːk/" },
  { word: "get home", digit: 25, symbol: "llegar a casa", isRoutine: true, routineGroup: "daily", ipa: "/ɡɛt hoʊm/" },
  { word: "have a snack", digit: 26, symbol: "tomar una merienda", isRoutine: true, routineGroup: "daily", ipa: "/hæv ə snæk/" },
  { word: "do homework", digit: 27, symbol: "hacer la tarea", isRoutine: true, routineGroup: "daily", ipa: "/duː ˈhoʊm.wɝːk/" },
  { word: "do the laundry", digit: 28, symbol: "lavar la ropa", isRoutine: true, routineGroup: "daily", ipa: "/duː ðə ˈlɑːn.dri/" },
  { word: "wash the dishes", digit: 29, symbol: "lavar los platos", isRoutine: true, routineGroup: "daily", ipa: "/wɑːʃ ðə dɪʃɪz/" },
  { word: "cook dinner", digit: 30, symbol: "cocinar la cena", isRoutine: true, routineGroup: "daily", ipa: "/kʊk ˈdɪn.ər/" }
];

export const routineCommands: NumberItem[] = [
  { word: "sit down", digit: 1, symbol: "sentarse", isRoutine: true, routineGroup: "commands", ipa: "/sɪt daʊn/" },
  { word: "stand up", digit: 2, symbol: "pararse", isRoutine: true, routineGroup: "commands", ipa: "/stænd ʌp/" },
  { word: "get out", digit: 3, symbol: "salir", isRoutine: true, routineGroup: "commands", ipa: "/ɡɛt aʊt/" },
  { word: "shut up", digit: 4, symbol: "callarse", isRoutine: true, routineGroup: "commands", ipa: "/ʃʌt ʌp/" },
  { word: "be quiet", digit: 5, symbol: "estar callado", isRoutine: true, routineGroup: "commands", ipa: "/biː ˈkwaɪ.ət/" },
  { word: "keep quiet", digit: 6, symbol: "mantenerse en silencio", isRoutine: true, routineGroup: "commands", ipa: "/kiːp ˈkwaɪ.ət/" },
  { word: "silence please", digit: 7, symbol: "silencio por favor", isRoutine: true, routineGroup: "commands", ipa: "/ˈsaɪ.ləns pliːz/" },
  { word: "listen carefully", digit: 8, symbol: "escuchar con atención", isRoutine: true, routineGroup: "commands", ipa: "/ˈlɪs.ən ˈkɛr.fəl.i/" },
  { word: "listen up", digit: 9, symbol: "presten atención (coloquial)", isRoutine: true, routineGroup: "commands", ipa: "/ˈlɪs.ən ʌp/" },
  { word: "look at me", digit: 10, symbol: "mirarme", isRoutine: true, routineGroup: "commands", ipa: "/lʊk æt miː/" },
  { word: "wait here", digit: 11, symbol: "esperar aquí", isRoutine: true, routineGroup: "commands", ipa: "/weɪt hɪr/" },
  { word: "follow me", digit: 12, symbol: "seguirme", isRoutine: true, routineGroup: "commands", ipa: "/ˈfɑː.loʊ miː/" },
  { word: "hurry up", digit: 13, symbol: "apresurarse", isRoutine: true, routineGroup: "commands", ipa: "/ˈhʌr.i ʌp/" },
  { word: "stop it", digit: 14, symbol: "parar eso", isRoutine: true, routineGroup: "commands", ipa: "/stɑːp ɪt/" },
  { word: "get lost", digit: 15, symbol: "perderse / irse", isRoutine: true, routineGroup: "commands", ipa: "/ɡɛt lɔːst/" },
  { word: "calm down", digit: 16, symbol: "calmarse", isRoutine: true, routineGroup: "commands", ipa: "/kɑːm daʊn/" },
  { word: "do not touch", digit: 17, symbol: "no tocar", isRoutine: true, routineGroup: "commands", ipa: "/duː nɑːt tʌtʃ/" },
  { word: "do not run", digit: 18, symbol: "no correr", isRoutine: true, routineGroup: "commands", ipa: "/duː nɑːt rʌn/" },
  { word: "come here", digit: 19, symbol: "venir aquí", isRoutine: true, routineGroup: "commands", ipa: "/kʌm hɪr/" },
  { word: "come in", digit: 20, symbol: "entrar", isRoutine: true, routineGroup: "commands", ipa: "/kʌm ɪn/" },
  { word: "line up", digit: 21, symbol: "formarse en fila", isRoutine: true, routineGroup: "commands", ipa: "/laɪn ʌp/" },
  { word: "put away your things", digit: 22, symbol: "guardar tus cosas", isRoutine: true, routineGroup: "commands", ipa: "/pʊt əˈweɪ jʊər θɪŋz/" },
  { word: "hand in your homework", digit: 23, symbol: "entregar la tarea", isRoutine: true, routineGroup: "commands", ipa: "/hænd ɪn jʊər ˈhoʊm.wɝːk/" },
  { word: "work in pairs", digit: 24, symbol: "trabajar en parejas", isRoutine: true, routineGroup: "commands", ipa: "/wɝːk ɪn pɛrz/" },
  { word: "take care", digit: 25, symbol: "cuidarse", isRoutine: true, routineGroup: "commands", ipa: "/teɪk kɛr/" },
  { word: "be careful", digit: 26, symbol: "tener cuidado", isRoutine: true, routineGroup: "commands", ipa: "/biː ˈkɛr.fəl/" },
  { word: "wash your hands", digit: 27, symbol: "lavarse las manos", isRoutine: true, routineGroup: "commands", ipa: "/wɑːʃ jʊər hændz/" },
  { word: "cover your mouth", digit: 28, symbol: "cúbrete la boca", isRoutine: true, routineGroup: "commands", ipa: "/ˈkʌv.ər jʊər maʊθ/" },
  { word: "bless you", digit: 29, symbol: "salud (estornudo)", isRoutine: true, routineGroup: "commands", ipa: "/blɛs juː/" },
  { word: "excuse me", digit: 30, symbol: "disculpe", isRoutine: true, routineGroup: "commands", ipa: "/ɪkˈskjuːz miː/" }
];

export const routineRemaining: NumberItem[] = [
  { word: "make dinner", digit: 1, symbol: "preparar la cena", isRoutine: true, routineGroup: "remaining", ipa: "/meɪk ˈdɪn.ər/" },
  { word: "set the table", digit: 2, symbol: "poner la mesa", isRoutine: true, routineGroup: "remaining", ipa: "/sɛt ðə ˈteɪ.bəl/" },
  { word: "clear the table", digit: 3, symbol: "recoger la mesa", isRoutine: true, routineGroup: "remaining", ipa: "/klɪr ðə ˈteɪ.bəl/" },
  { word: "walk the dog", digit: 4, symbol: "pasear al perro", isRoutine: true, routineGroup: "remaining", ipa: "/wɔːk ðə dɔːɡ/" },
  { word: "feed the pet", digit: 5, symbol: "alimentar a la mascota", isRoutine: true, routineGroup: "remaining", ipa: "/fiːd ðə pɛt/" },
  { word: "water the plants", digit: 6, symbol: "regar las plantas", isRoutine: true, routineGroup: "remaining", ipa: "/ˈwɔː.tər ðə plænts/" },
  { word: "check email", digit: 7, symbol: "revisar el correo", isRoutine: true, routineGroup: "remaining", ipa: "/tʃɛk ˈiː.meɪl/" },
  { word: "exercise", digit: 8, symbol: "hacer ejercicio", isRoutine: true, routineGroup: "remaining", ipa: "/ˈɛk.sɚ.saɪz/" },
  { word: "go to the gym", digit: 9, symbol: "ir al gimnasio", isRoutine: true, routineGroup: "remaining", ipa: "/ɡoʊ tuː ðə dʒɪm/" },
  { word: "have dinner", digit: 10, symbol: "cenar", isRoutine: true, routineGroup: "remaining", ipa: "/hæv ˈdɪn.ər/" },
  { word: "watch TV", digit: 11, symbol: "ver televisión", isRoutine: true, routineGroup: "remaining", ipa: "/wɑːtʃ ˌtiːˈviː/" },
  { word: "read a book", digit: 12, symbol: "leer un libro", isRoutine: true, routineGroup: "remaining", ipa: "/riːd ə bʊk/" },
  { word: "listen to music", digit: 13, symbol: "escuchar música", isRoutine: true, routineGroup: "remaining", ipa: "/ˈlɪs.ən tuː ˈmjuː.zɪk/" },
  { word: "take off your clothes", digit: 14, symbol: "quitarse la ropa", isRoutine: true, routineGroup: "remaining", ipa: "/teɪk ɔːf jʊər kloʊðz/" },
  { word: "put on your pajamas", digit: 15, symbol: "ponerse el pijama", isRoutine: true, routineGroup: "remaining", ipa: "/pʊt ɑːn jʊər pəˈdʒæm.əz/" },
  { word: "iron clothes", digit: 16, symbol: "planchar la ropa", isRoutine: true, routineGroup: "remaining", ipa: "/ˈaɪ.ərn kloʊðz/" },
  { word: "charge your phone", digit: 17, symbol: "cargar el teléfono", isRoutine: true, routineGroup: "remaining", ipa: "/tʃɑːrdʒ jʊər foʊn/" },
  { word: "turn off the lights", digit: 18, symbol: "apagar las luces", isRoutine: true, routineGroup: "remaining", ipa: "/tɝːn ɔːf ðə laɪts/" },
  { word: "lock the door", digit: 19, symbol: "cerrar con llave", isRoutine: true, routineGroup: "remaining", ipa: "/lɑːk ðə dɔːr/" },
  { word: "go to bed", digit: 20, symbol: "acostarse", isRoutine: true, routineGroup: "remaining", ipa: "/ɡoʊ tuː bɛd/" },
  { word: "pardon me", digit: 21, symbol: "perdóneme", isRoutine: true, routineGroup: "remaining", ipa: "/ˈpɑːr.dən miː/" },
  { word: "please", digit: 22, symbol: "por favor", isRoutine: true, routineGroup: "remaining", ipa: "/pliːz/" },
  { word: "thank you", digit: 23, symbol: "gracias", isRoutine: true, routineGroup: "remaining", ipa: "/θæŋk juː/" },
  { word: "you are welcome", digit: 24, symbol: "de nada", isRoutine: true, routineGroup: "remaining", ipa: "/juː ɑːr ˈwɛl.kəm/" },
  { word: "I am sorry", digit: 25, symbol: "lo siento", isRoutine: true, routineGroup: "remaining", ipa: "/aɪm ˈsɑː.ri/" },
  { word: "no worries", digit: 26, symbol: "sin preocupaciones", isRoutine: true, routineGroup: "remaining", ipa: "/noʊ ˈwɝː.iz/" },
  { word: "no problem", digit: 27, symbol: "no hay problema", isRoutine: true, routineGroup: "remaining", ipa: "/noʊ ˈprɑː.bləm/" },
  { word: "have a nice day", digit: 28, symbol: "que tenga un buen día", isRoutine: true, routineGroup: "remaining", ipa: "/hæv ə naɪs deɪ/" },
  { word: "help yourself", digit: 29, symbol: "sírvase", isRoutine: true, routineGroup: "remaining", ipa: "/hɛlp jʊərˈsɛlf/" },
  { word: "my pleasure", digit: 30, symbol: "con gusto", isRoutine: true, routineGroup: "remaining", ipa: "/maɪ ˈplɛʒ.ər/" },
  { word: "see you later", digit: 31, symbol: "hasta luego", isRoutine: true, routineGroup: "remaining", ipa: "/siː juː ˈleɪ.t̬ɚ/" },
  { word: "good job", digit: 32, symbol: "buen trabajo", isRoutine: true, routineGroup: "remaining", ipa: "/ɡʊd dʒɑːb/" },
  { word: "well done", digit: 33, symbol: "bien hecho", isRoutine: true, routineGroup: "remaining", ipa: "/wɛl dʌn/" },
  { word: "open your book", digit: 34, symbol: "abrir el libro", isRoutine: true, routineGroup: "remaining", ipa: "/ˈoʊ.pən jʊər bʊk/" },
  { word: "close your book", digit: 35, symbol: "cerrar el libro", isRoutine: true, routineGroup: "remaining", ipa: "/kloʊz jʊər bʊk/" },
  { word: "raise your hand", digit: 36, symbol: "levantar la mano", isRoutine: true, routineGroup: "remaining", ipa: "/reɪz jʊər hænd/" },
  { word: "pay attention", digit: 37, symbol: "prestar atención", isRoutine: true, routineGroup: "remaining", ipa: "/peɪ əˈtɛn.ʃən/" },
  { word: "repeat after me", digit: 38, symbol: "repetir después de mí", isRoutine: true, routineGroup: "remaining", ipa: "/rɪˈpiːt ˈæf.tɚ miː/" },
  { word: "take out your notebook", digit: 39, symbol: "sacar el cuaderno", isRoutine: true, routineGroup: "remaining", ipa: "/teɪk aʊt jʊər ˈnoʊt.bʊk/" },
  { word: "write it down", digit: 40, symbol: "escribirlo", isRoutine: true, routineGroup: "remaining", ipa: "/raɪt ɪt daʊn/" }
];

export const totalRoutine: NumberItem[] = [...routineBasic, ...routineCommands, ...routineRemaining];

export const routineSentences: { e: string, c: string, d: string[] }[] = [
  { e: "I wake up at six-thirty every morning.", c: "Me despierto a las seis y media cada mañana.", d: ["Me acuesto tarde.", "Como de noche."] },
  { e: "Please help me clear the table.", c: "Por favor ayúdame a recoger la mesa.", d: ["Pon la mesa ahora.", "Lava todos los platos hoy."] },
  { e: "The teacher said: stand up please.", c: "El maestro dijo: párense por favor.", d: ["El maestro dijo: cállense.", "El alumno se sentó."] },
  { e: "Don't touch that hot pan or you'll burn yourself.", c: "No toques esa sartén caliente o te quemarás.", d: ["Cocina la cena rápido.", "Limpia la mesa."] },
  { e: "I always brush my teeth after eating lunch.", c: "Siempre me cepillo los dientes después de almorzar.", d: ["Me lavo la cara al despertar.", "Hago la cama a menudo."] },
  { e: "Be quiet, the baby is sleeping.", c: "Silencio, el bebé está durmiendo.", d: ["Habla alto por favor.", "Ven aquí rápido."] },
  { e: "She is going to drive to work today.", c: "Ella va a conducir al trabajo hoy.", d: ["Ella toma el autobús hoy.", "Ella camina a casa."] },
  { e: "Remember to lock the door before leaving.", c: "Recuerda cerrar la puerta con llave antes de salir.", d: ["Cierra la ventana.", "Apaga la luz de la sala."] },
  { e: "Calm down, everything is going to be fine.", c: "Cálmate, todo va a salir bien.", d: ["Apresúrate por favor.", "No corras en el pasillo."] },
  { e: "Open your books to page fifty.", c: "Abran sus libros en la página cincuenta.", d: ["Saquen sus cuadernos hoy.", "Cierren sus libros ahora."] },
  { e: "I cook dinner for my family on Mondays.", c: "Cocino la cena para mi familia los lunes.", d: ["Preparo el desayuno temprano.", "Saco la basura por la noche."] },
  { e: "Work in pairs to finish this exercise.", c: "Trabajen en parejas para terminar este ejercicio.", d: ["Hagan la tarea individualmente.", "Entreguen sus exámenes."] },
  { e: "I have to wash the dishes now.", c: "Tengo que lavar los platos ahora.", d: ["Tengo que lavar la ropa hoy.", "Tengo que limpiar el baño."] },
  { e: "Wash your hands before eating your meal.", c: "Lávate las manos antes de tomar tus alimentos.", d: ["Lávate la cara por la mañana.", "Usa hilo dental."] },
  { e: "Turn off the lights when you go to bed.", c: "Apaga las luces cuando te vayas a acostar.", d: ["Carga tu teléfono en la noche.", "Ház la cama primero."] },
  { e: "Listen carefully to the instructions.", c: "Escuchen con atención las instrucciones.", d: ["Repitan después de mí hoy.", "Escriban esto rápido."] },
  { e: "I catch the bus at seven forty-five.", c: "Tomo el autobús a las siete y cuarenta y cinco.", d: ["Conduzco al trabajo temprano.", "Llego a casa tarde."] },
  { e: "Please water the plants this afternoon.", c: "Por favor riega las plantas esta tarde.", d: ["Alimenta a la mascota hoy.", "Pasea al perro ahora."] },
  { e: "Raise your hand if you have a question.", c: "Levanta la mano si tienes alguna pregunta.", d: ["Responde la pregunta ahora.", "Escribe la respuesta."] },
  { e: "I usually take a shower at night.", c: "Normalmente me ducho por la noche.", d: ["Me baño en la tina por las mañanas.", "Me peino con cuidado."] }
];







