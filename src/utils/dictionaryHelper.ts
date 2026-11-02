/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NumberItem } from "../types";
import { ipaFallbackMap } from "./ipaFallbackMap";
import {
  totalCalendar,
  totalColors,
  totalSports,
  totalInstruments,
  totalProfessions,
  totalFamily,
  totalHouse,
  totalClassroom,
  totalPlaces,
  totalWeather,
  totalAnimals,
  totalFruits,
  totalVegetables,
  totalFood,
  totalTastes,
  totalClothing,
  totalBody,
  totalRoutine,
  numeros1a20,
  numeros21a100,
  ordinal1a20,
  ordinal21a100,
  getAmericanIPA,
  getAmericanIPAOrdinal
} from "../data";

// Helpers for Spanish translations
const spanish1a19: { [key: number]: string } = {
  1: "uno", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco",
  6: "seis", 7: "siete", 8: "ocho", 9: "nueve", 10: "diez",
  11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince",
  16: "dieciséis", 17: "diecisiete", 18: "dieciocho", 19: "diecinueve"
};

const spanishDecenas: { [key: number]: string } = {
  2: "veinte", 3: "treinta", 4: "cuarenta", 5: "cincuenta",
  6: "sesenta", 7: "setenta", 8: "ochenta", 9: "noventa"
};

export function getSpanishNumber(num: number): string {
  if (num === 100) return "cien";
  if (num < 20) return spanish1a19[num];
  const tens = Math.floor(num / 10);
  const units = num % 10;
  if (units === 0) return spanishDecenas[tens];
  if (tens === 2) {
    // veintiuno, veintidós, veintitrés, veinticuatro, veinticinco, veintiséis...
    const mapVeinti: { [key: number]: string } = {
      1: "veintiuno", 2: "veintidós", 3: "veintitrés", 4: "veinticuatro",
      5: "veinticinco", 6: "veintiséis", 7: "veintisiete", 8: "veintiocho", 9: "veintinueve"
    };
    return mapVeinti[units];
  }
  return `${spanishDecenas[tens]} y ${spanish1a19[units]}`;
}

const spanishOrdinals1a10: { [key: number]: string } = {
  1: "primero", 2: "segundo", 3: "tercero", 4: "cuarto", 5: "quinto",
  6: "sexto", 7: "séptimo", 8: "octavo", 9: "noveno", 10: "décimo"
};

const spanishOrdinalsTens: { [key: number]: string } = {
  1: "décimo",
  2: "vigésimo",
  3: "trigésimo",
  4: "cuadragésimo",
  5: "quincuagésimo",
  6: "sexagésimo",
  7: "septuagésimo",
  8: "octogésimo",
  9: "nonagésimo"
};

export function getSpanishOrdinal(num: number): string {
  if (num === 100) return "centésimo";
  if (num <= 10) return spanishOrdinals1a10[num];
  if (num === 11) return "undécimo";
  if (num === 12) return "duodécimo";
  const tens = Math.floor(num / 10);
  const units = num % 10;
  if (units === 0) return spanishOrdinalsTens[tens] || `${num}º`;
  return `${spanishOrdinalsTens[tens]} ${spanishOrdinals1a10[units]}`;
}

// IPA Categorization & Styling Helper
export function getIpaClassification(ipa: string): { name: string; color: string; description: string; dotClass: string } {
  const normalized = (ipa || "").toLowerCase();
  
  // 1. Diptongos (Diphthongs - color celeste/azul)
  if (normalized.includes("aɪ") || normalized.includes("aʊ") || normalized.includes("ɔɪ") || normalized.includes("oʊ") || normalized.includes("eɪ")) {
    return {
      name: "Diptongos (Diphthongs)",
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
      dotClass: "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]",
      description: "Combinación de dos sonidos vocálicos en una misma sílaba."
    };
  }
  
  // 2. Schwa (Vocal neutra - color amarillo)
  if (normalized.includes("ə")) {
    return {
      name: "Schwa (/ə/)",
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      dotClass: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]",
      description: "Es el sonido de vocal más común y relajado en inglés (sílaba átona)."
    };
  }

  // 3. Vocales Largas (Long Vowels - color verde)
  if (normalized.includes("iː") || normalized.includes("uː") || normalized.includes("ɔː") || normalized.includes("ɑː") || normalized.includes("ɜː")) {
    return {
      name: "Vocales Largas (Long Vowels)",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      dotClass: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]",
      description: "Sonidos vocálicos más tensos y de mayor duración."
    };
  }
  
  // 4. Vocales Cortas (Short Vowels - color rojo/rosa)
  if (normalized.includes("æ") || normalized.includes("ɛ") || normalized.includes("ɪ") || normalized.includes("ʌ") || normalized.includes("ʊ") || normalized.includes("ɒ") || normalized.includes("ɑ")) {
    return {
      name: "Vocales Cortas (Short Vowels)",
      color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      dotClass: "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.7)]",
      description: "Sonidos cortos y relajados, usualmente en sílabas cerradas."
    };
  }
  
  // 5. Consonantes / Otros (color morado)
  return {
    name: "Sonidos Consonánticos / Otros",
    color: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    dotClass: "bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.7)]",
    description: "Palabras con énfasis en sonidos consonánticos o articulaciones complejas."
  };
}

export interface ExampleSentence {
  english: string;
  spanish: string;
}

export function getWordExampleSentences(item: NumberItem): ExampleSentence[] {
  const en = item.word;
  const es = item.symbol || "";
  
  const cleanEn = en.toLowerCase().trim();
  const cleanEs = es.toLowerCase().trim();
  
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const capEs = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (item.isOrdinal) {
    return [
      {
        english: `This is my first time in ${cleanEn} place.`,
        spanish: `Esta es mi primera vez en el ${cleanEs} lugar.`
      },
      {
        english: `The runner finished in ${cleanEn} position.`,
        spanish: `El corredor terminó en la ${cleanEs} posición.`
      }
    ];
  }
  
  // Default numbers 1-100 check
  if (typeof item.digit === "number" && !item.isOrdinal && !item.isCalendar && !item.isColor && !item.isSport && !item.isInstrument && !item.isProfession && !item.isFamily && !item.isHouse && !item.isClassroom && !item.isPlaces && !item.isWeather && !item.isAnimals && !item.isFruits && !item.isVegetables && !item.isFood && !item.isTastes && !item.isClothing && !item.isBody && !item.isRoutine) {
    return [
      {
        english: `I have ${cleanEn} apples in my bag.`,
        spanish: `Tengo ${cleanEs} manzanas en mi bolso.`
      },
      {
        english: `There are ${cleanEn} students in the classroom.`,
        spanish: `Hay ${cleanEs} estudiantes en el salón de clases.`
      }
    ];
  }

  if (item.isCalendar) {
    if (item.calendarGroup === "days") {
      return [
        {
          english: `Today is ${cap(cleanEn)}, the start of my activities.`,
          spanish: `Hoy es ${cleanEs}, el inicio de mis actividades.`
        },
        {
          english: `On ${cap(cleanEn)} I always wake up early.`,
          spanish: `El ${cleanEs} siempre me despierto temprano.`
        }
      ];
    } else if (item.calendarGroup === "months") {
      return [
        {
          english: `My birthday is in ${cap(cleanEn)}.`,
          spanish: `Mi cumpleaños es en ${cleanEs}.`
        },
        {
          english: `${cap(cleanEn)} is a very beautiful month.`,
          spanish: `${capEs(cleanEs)} es un mes muy hermoso.`
        }
      ];
    } else {
      return [
        {
          english: `We measure time in ${cleanEn}.`,
          spanish: `Medimos el tiempo en ${cleanEs}.`
        },
        {
          english: `Each ${cleanEn} is important for us.`,
          spanish: `Cada ${cleanEs} es importante para nosotros.`
        }
      ];
    }
  }

  if (item.isColor) {
    return [
      {
        english: `My favorite t-shirt is ${cleanEn}.`,
        spanish: `Mi camiseta favorita es de color ${cleanEs}.`
      },
      {
        english: `The sky looks beautiful in ${cleanEn} today.`,
        spanish: `El cielo se ve hermoso en ${cleanEs} hoy.`
      }
    ];
  }

  if (item.isSport) {
    return [
      {
        english: `I love to play ${cleanEn} with my friends.`,
        spanish: `Me encanta jugar al ${cleanEs} con mis amigos.`
      },
      {
        english: `${cap(cleanEn)} is a very exciting and popular sport.`,
        spanish: `El ${cleanEs} es un deporte muy emocionante y popular.`
      }
    ];
  }

  if (item.isInstrument) {
    return [
      {
        english: `She plays the ${cleanEn} beautifully.`,
        spanish: `Ella toca el ${cleanEs} hermosamente.`
      },
      {
        english: `I would love to learn how to play the ${cleanEn}.`,
        spanish: `Me encantaría aprender a tocar el ${cleanEs}.`
      }
    ];
  }

  if (item.isProfession) {
    return [
      {
        english: `My dream is to become a professional ${cleanEn}.`,
        spanish: `Mi sueño es convertirme en un ${cleanEs} profesional.`
      },
      {
        english: `The ${cleanEn} works hard every day.`,
        spanish: `El ${cleanEs} trabaja duro todos los días.`
      }
    ];
  }

  if (item.isFamily) {
    return [
      {
        english: `I love my ${cleanEn} very much.`,
        spanish: `Amo mucho a mi ${cleanEs}.`
      },
      {
        english: `My ${cleanEn} always supports me in everything.`,
        spanish: `Mi ${cleanEs} siempre me apoya en todo.`
      }
    ];
  }

  if (item.isHouse) {
    return [
      {
        english: `We have a clean and beautiful ${cleanEn} at home.`,
        spanish: `Tenemos un(a) ${cleanEs} limpio(a) y hermoso(a) en casa.`
      },
      {
        english: `Please put the keys in the ${cleanEn}.`,
        spanish: `Por favor, pon las llaves en el/la ${cleanEs}.`
      }
    ];
  }

  if (item.isClassroom) {
    return [
      {
        english: `The teacher asked us to look at the ${cleanEn}.`,
        spanish: `El profesor nos pidió que miráramos el/la ${cleanEs}.`
      },
      {
        english: `I always carry my ${cleanEn} in my backpack.`,
        spanish: `Siempre llevo mi ${cleanEs} en mi mochila.`
      }
    ];
  }

  if (item.isPlaces) {
    return [
      {
        english: `We are going to visit the ${cleanEn} this weekend.`,
        spanish: `Vamos a visitar el/la ${cleanEs} este fin de semana.`
      },
      {
        english: `There is a big ${cleanEn} near my house.`,
        spanish: `Hay un(a) gran ${cleanEs} cerca de mi casa.`
      }
    ];
  }

  if (item.isWeather) {
    return [
      {
        english: `The weather is showing ${cleanEn} today.`,
        spanish: `El clima muestra ${cleanEs} hoy.`
      },
      {
        english: `Be careful with the ${cleanEn} outside.`,
        spanish: `Ten cuidado con el/la ${cleanEs} afuera.`
      }
    ];
  }

  if (item.isAnimals) {
    return [
      {
        english: `The ${cleanEn} is sleeping peacefully in the shade.`,
        spanish: `El ${cleanEs} está durmiendo pacíficamente en la sombra.`
      },
      {
        english: `We saw a wild ${cleanEn} during our trip to the forest.`,
        spanish: `Vimos un ${cleanEs} salvaje durante nuestro viaje al bosque.`
      }
    ];
  }

  if (item.isFruits) {
    return [
      {
        english: `I eat a delicious ${cleanEn} every morning.`,
        spanish: `Como un(a) delicios(a) ${cleanEs} cada mañana.`
      },
      {
        english: `We need to buy some fresh ${cleanEn} at the market.`,
        spanish: `Necesitamos comprar ${cleanEs} fresc(a) en el mercado.`
      }
    ];
  }

  if (item.isVegetables) {
    return [
      {
        english: `The doctor recommended eating more ${cleanEn} for health.`,
        spanish: `El doctor recomendó comer más ${cleanEs} por salud.`
      },
      {
        english: `We added some fresh ${cleanEn} to the salad.`,
        spanish: `Agregamos un poco de ${cleanEs} fresc(a) a la ensalada.`
      }
    ];
  }

  if (item.isFood) {
    return [
      {
        english: `Would you like to have some ${cleanEn} with us?`,
        spanish: `¿Te gustaría comer/beber un poco de ${cleanEs} con nosotros?`
      },
      {
        english: `The ${cleanEn} we prepared is very hot and delicious.`,
        spanish: `El/la ${cleanEs} que preparamos está muy caliente y delicios(a).`
      }
    ];
  }

  if (item.isTastes) {
    return [
      {
        english: `This dish has a very ${cleanEn} flavor.`,
        spanish: `Este plato tiene un sabor muy ${cleanEs}.`
      },
      {
        english: `I do not like food that is too ${cleanEn}.`,
        spanish: `No me gusta la comida que es demasiado ${cleanEs}.`
      }
    ];
  }

  if (item.isClothing) {
    return [
      {
        english: `He decided to wear his favorite ${cleanEn} today.`,
        spanish: `Él decidió usar su ${cleanEs} favorit(a) hoy.`
      },
      {
        english: `This ${cleanEn} is made of very soft material.`,
        spanish: `Este/a ${cleanEs} está hecho(a) de un material muy suave.`
      }
    ];
  }

  if (item.isBody) {
    return [
      {
        english: `The doctor examined my ${cleanEn} carefully.`,
        spanish: `El doctor examinó mi ${cleanEs} cuidadosamente.`
      },
      {
        english: `Keep your ${cleanEn} clean and healthy.`,
        spanish: `Mantén tu ${cleanEs} limpio/a y saludable.`
      }
    ];
  }

  if (item.isRoutine) {
    return [
      {
        english: `I need to ${cleanEn} before it gets too late.`,
        spanish: `Necesito ${cleanEs} antes de que se haga demasiado tarde.`
      },
      {
        english: `It is important to ${cleanEn} every single day.`,
        spanish: `Es importante ${cleanEs} todos los días.`
      }
    ];
  }

  // Fallback
  return [
    {
      english: `We should practice using the word "${cleanEn}" in a simple conversation.`,
      spanish: `Deberíamos practicar el uso de la palabra "${cleanEs}" en una conversación simple.`
    },
    {
      english: `Could you tell me how to spell "${cleanEn}" correctly?`,
      spanish: `¿Podrías decirme cómo se deletrea "${cleanEs}" correctamente?`
    }
  ];
}

// Generate the fully unified list of unique words
let cachedDictionary: NumberItem[] | null = null;

export function getUnifiedDictionary(): NumberItem[] {
  if (cachedDictionary) return cachedDictionary;

  const wordMap: { [word: string]: NumberItem } = {};

  const addWord = (item: NumberItem) => {
    if (!item.word) return;
    const cleanWord = item.word.toLowerCase().trim();
    
    const ipaFromFallback = !item.ipa && ipaFallbackMap[cleanWord] ? ipaFallbackMap[cleanWord] : item.ipa;

    if (wordMap[cleanWord]) {
      // Merge properties if duplicate
      const existing = wordMap[cleanWord];
      const existingSym = (existing.symbol || "").toLowerCase();
      const newSym = (item.symbol || "").toLowerCase();
      if (newSym && !existingSym.includes(newSym) && !newSym.includes(existingSym)) {
        existing.symbol = `${existing.symbol} / ${item.symbol}`;
      }
      
      // Preserve IPAs
      if (!existing.ipa) {
        existing.ipa = ipaFromFallback;
      }

      // Merge category flags
      if (item.isOrdinal) existing.isOrdinal = true;
      if (item.isCalendar) existing.isCalendar = true;
      if (item.isColor) existing.isColor = true;
      if (item.isSport) existing.isSport = true;
      if (item.isInstrument) existing.isInstrument = true;
      if (item.isProfession) existing.isProfession = true;
      if (item.isFamily) existing.isFamily = true;
      if (item.isHouse) existing.isHouse = true;
      if (item.isClassroom) existing.isClassroom = true;
      if (item.isPlaces) existing.isPlaces = true;
      if (item.isWeather) existing.isWeather = true;
      if (item.isAnimals) existing.isAnimals = true;
      if (item.isFruits) existing.isFruits = true;
      if (item.isVegetables) existing.isVegetables = true;
      if (item.isFood) existing.isFood = true;
      if (item.isTastes) existing.isTastes = true;
      if (item.isClothing) existing.isClothing = true;
      if (item.isBody) existing.isBody = true;
      if (item.isRoutine) existing.isRoutine = true;
    } else {
      wordMap[cleanWord] = { 
        ...item,
        ipa: ipaFromFallback
      };
    }
  };

  // 1. Process Natural Numbers (1 to 100)
  const mappedNaturalNumbers = [...numeros1a20, ...numeros21a100].map(([word, num]) => ({
    word,
    digit: num,
    symbol: getSpanishNumber(num),
    ipa: getAmericanIPA(num)
  }));
  mappedNaturalNumbers.forEach(addWord);

  // 2. Process Ordinal Numbers (1st to 100th)
  const mappedOrdinals = [...ordinal1a20, ...ordinal21a100].map(item => ({
    ...item,
    symbol: `${item.symbol} (${getSpanishOrdinal(item.digit)})`,
    ipa: getAmericanIPAOrdinal(item.digit)
  }));
  mappedOrdinals.forEach(addWord);

  // 3. Process All Standard Modules
  totalCalendar.forEach(addWord);
  totalColors.forEach(addWord);
  totalSports.forEach(addWord);
  totalInstruments.forEach(addWord);
  totalProfessions.forEach(addWord);
  totalFamily.forEach(addWord);
  totalHouse.forEach(addWord);
  totalClassroom.forEach(addWord);
  totalPlaces.forEach(addWord);
  totalWeather.forEach(addWord);
  totalAnimals.forEach(addWord);
  totalFruits.forEach(addWord);
  totalVegetables.forEach(addWord);
  totalFood.forEach(addWord);
  totalTastes.forEach(addWord);
  totalClothing.forEach(addWord);
  totalBody.forEach(addWord);
  totalRoutine.forEach(addWord);

  // Convert to sorted array
  const sortedWords = Object.values(wordMap).sort((a, b) =>
    a.word.localeCompare(b.word)
  );

  cachedDictionary = sortedWords;
  return sortedWords;
}
