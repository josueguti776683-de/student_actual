/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, Sparkles, Volume2, BookOpen, Lock, Unlock, Home, AlertTriangle, Check } from "lucide-react";
import { speakTextWithRate, stopSpeaking } from "../utils/audio";
import { allVocabList } from "../data/vocabulary";
import { getStats, saveStats } from "../utils/stats";
import { getWordEmoji } from "../utils/wordEmojis";
import { WordEmoji } from "./WordEmoji";
import {
  totalOrdinal100,
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
  cookingVerbsList,
  totalClothing,
  totalBody,
  totalRoutine
} from "../data";

// Helper to build a unified list of [English, Spanish] pairs from Play 1 across the 20 modules
const buildPlay1VocabList = (): [string, string][] => {
  const masterList: [string, string][] = [];
  const sourceLists = [
    totalOrdinal100,
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
    cookingVerbsList,
    totalClothing,
    totalBody,
    totalRoutine
  ];

  sourceLists.forEach(list => {
    if (Array.isArray(list)) {
      list.forEach(item => {
        if (item && item.word && typeof item.word === "string" && item.symbol && typeof item.symbol === "string") {
          const w = item.word.trim();
          const s = item.symbol.trim();
          // Filter out ordinal symbols like "1st", "100th" or digits
          const isOrdinalSymbol = /^\d+(st|nd|rd|th)$/i.test(s);
          const isNumeric = /^\d+$/.test(s);
          if (w && s && !isOrdinalSymbol && !isNumeric) {
            masterList.push([w, s]);
          }
        }
      });
    }
  });

  // Just in case, if empty, fall back to allVocabList from vocabulary.ts
  if (masterList.length === 0) {
    return allVocabList;
  }
  return masterList;
};

interface StoryContent {
  titleEn: string;
  textEn: string;
  textEs: string;
}

interface StoryOption {
  id: number;
  modules: string;
  desc: string;
  h1: StoryContent;
  h2: StoryContent;
}

const PRACTICE_STORIES: StoryOption[] = [
  {
    id: 1,
    modules: "M1, M2, M3 (Numbers & Dates)",
    desc: "Practice with natural numbers, ordinals, and calendar days.",
    h1: {
      titleEn: "The First Days",
      textEn: "Today is Monday, January first. It is the first day of the year. Ten people wake up in the morning. One person goes to sleep at night. They count the days on the calendar. Monday is day number one. Tuesday is day number second.",
      textEs: "Hoy es lunes, primero de enero. Es el primer día del año. Diez personas se despiertan por la mañana. Una persona se va a dormir por la noche. Ellos cuentan los días en el calendario. El lunes es el día número uno. El martes es el segundo día."
    },
    h2: {
      titleEn: "Seven Important Days",
      textEn: "We have seven days in a week. On Wednesday, March third, three girls visit the school. On Thursday, they study English for five hours. On Friday, four boys play in the patio. December is the last month of the year. I love calendar dates!",
      textEs: "Tenemos siete días en una semana. El miércoles tres de marzo, tres niñas visitan la escuela. El jueves estudian inglés durante cinco horas. El viernes, cuatro niños juegan en el patio. Diciembre es el último mes del año. ¡Me encantan las fechas del calendario!"
    }
  },
  {
    id: 2,
    modules: "M4, M5 (Colors & Sports)",
    desc: "Learn colors combined with active outdoor sports.",
    h1: {
      titleEn: "Colors in the Park",
      textEn: "In the park, kids play soccer with a yellow ball. My brother rides a blue bicycle. He is very fast! My sister plays tennis with a red racket. Soccer is dynamic and fun. They love to run and play. After the match, we play basketball in the afternoon.",
      textEs: "En el parque, los niños juegan fútbol con una pelota amarilla. Mi hermano monta una bicicleta azul. ¡Él es muy rápido! Mi hermana juega tenis con una raqueta roja. El fútbol es dinámico y divertido. Les encanta correr y jugar. Después del partido, jugamos baloncesto por la tarde."
    },
    h2: {
      titleEn: "The Colorful Team",
      textEn: "Our basketball team wears a green uniform. The other team has a white shirt. We run very fast on the court. He throws a pink ball into the hoop. My favorite sport is swimming, but my cousin prefers baseball. Sport is good and keeps us active!",
      textEs: "Nuestro equipo de baloncesto viste un uniforme verde. El otro equipo tiene una camiseta blanca. Corremos muy rápido en la cancha. Él lanza una pelota rosa al aro. Mi deporte favorito es la natación, pero mi primo prefiere el béisbol. ¡El deporte es bueno y nos mantiene activos!"
    }
  },
  {
    id: 3,
    modules: "M6 (Instruments)",
    desc: "Listen to instruments playing melodies in harmony.",
    h1: {
      titleEn: "The Music Classroom",
      textEn: "Welcome to the music school. In this classroom, you can hear a guitar and a piano. Maria plays the violin in the morning. Pedro plays the flute. John hits the drums with joy. The teacher plays the trumpet. Together, they make a beautiful sound. Everyone smiles and listens to the music.",
      textEs: "Bienvenidos a la escuela de música. En este salón de clases, puedes escuchar una guitarra y un piano. María toca el violín por la mañana. Pedro toca la flauta. John golpea la batería con alegría. El profesor toca la trompeta. Juntos, hacen un sonido hermoso. Todos sonríen y escuchan la música."
    },
    h2: {
      titleEn: "A Song in the Night",
      textEn: "At night, my friend plays the acoustic guitar near the fire. She sings a sweet song. I play the piano softly. The sound of the violin is perfect for this moment. Music helps people relax after a long day. We love to listen to the instruments in the cabin.",
      textEs: "Por la noche, mi amiga toca la guitarra acústica cerca de la fogata. Ella canta una canción dulce. Yo toco el piano suavemente. El sonido del violín es perfecto para este momento. La música ayuda a las personas a relajarse después de un largo día. Nos encanta escuchar los instrumentos en la cabaña."
    }
  },
  {
    id: 4,
    modules: "M7, M8 (Professions & Family)",
    desc: "A warm story connecting family relatives and their professions.",
    h1: {
      titleEn: "My Family's Jobs",
      textEn: "This is my family. My father is a doctor. He works at the hospital. My mother is an excellent teacher. She teaches young kids. My brother wants to be a professional chef because he loves food. I am a bus driver. We work hard every day and get home happy.",
      textEs: "Esta es mi familia. Mi padre es médico. Él trabaja en el hospital. Mi madre es una excelente maestra. Ella enseña a niños pequeños. Mi hermano quiere ser un chef profesional porque le encanta la comida. Yo soy conductor de autobús. Trabajamos duro todos los días y llegamos a casa felices."
    },
    h2: {
      titleEn: "An Active Uncle",
      textEn: "My uncle is a police officer. He protects the town with courage. His wife is an artist; she paints beautiful pictures of families. My cousin is an engineer and builds big bridges. We visit them on Sunday. Family is very important to me!",
      textEs: "Mi tío es oficial de policía. Él protege al pueblo con valentía. Su esposa es artista; ella pinta hermosos cuadros de familias. Mi primo es ingeniero y construye grandes puentes. Los visitamos el domingo. ¡La familia es muy importante para mí!"
    }
  },
  {
    id: 5,
    modules: "M9 (House & Home)",
    desc: "Identify different rooms and common furniture objects.",
    h1: {
      titleEn: "In My Cozy House",
      textEn: "My house is very warm and cozy. In the kitchen, there is a clean table. In the bedroom, I have a comfortable bed and a yellow lamp next to the window. I sit on the sofa to read a book. The dog barks near the door. My home is my favorite place.",
      textEs: "Mi casa es muy cálida y acogedora. En la cocina, hay una mesa limpia. En el dormitorio, tengo una cama cómoda y una lámpara amarilla al lado de la ventana. Me siento en el sofá a leer un libro. El perro ladra cerca de la puerta. Mi hogar es mi lugar favorito."
    },
    h2: {
      titleEn: "A Cleaning Sunday",
      textEn: "On Sunday morning, we clean the house. I sweep the floor in the living room. My sister cleans the bathroom mirror. My parents wash the plates in the kitchen. We put a fresh flower on the table. Now, the house is very clean and smells great!",
      textEs: "El domingo por la mañana, limpiamos la casa. Yo barro el piso de la sala de estar. Mi hermana limpia el espejo del baño. Mis padres lavan los platos en la cocina. Ponemos una flor fresca sobre la mesa. ¡Ahora, la casa está muy limpia y huele genial!"
    }
  },
  {
    id: 6,
    modules: "M10 (Classroom)",
    desc: "Practice school utilities and common student actions.",
    h1: {
      titleEn: "Classroom Lessons",
      textEn: "The school bell rings at eight. Inside the classroom, students sit at their desk. The teacher says: open your book. We write in the notebook with a black pen. I use a blue ruler to draw a straight line. We pay attention to the lesson. Learning English is very cool.",
      textEs: "La campana de la escuela suena a las ocho. Dentro del salón de clases, los estudiantes se sientan en su escritorio. El maestro dice: abran su libro. Escribimos en el cuaderno con un bolígrafo negro. Uso una regla azul para dibujar una línea recta. Prestamos atención a la lección. Aprender inglés es genial."
    },
    h2: {
      titleEn: "The New Backpack",
      textEn: "I have a new red backpack. Inside, there is a pencil, an eraser, and a notebook. I sit next to my best friend at the desk. We look at the whiteboard to read the English words. The teacher gives us a star for good work. School is a happy place!",
      textEs: "Tengo una mochila roja nueva. Dentro, hay un lápiz, un borrador y un cuaderno. Me siento al lado de mi mejor amigo en el escritorio. Miramos la pizarra para leer las palabras en inglés. El maestro nos da una estrella por un buen trabajo. ¡La escuela es un lugar feliz!"
    }
  },
  {
    id: 7,
    modules: "M11 (Locations & Transport)",
    desc: "Navigate through common public spots using transport words.",
    h1: {
      titleEn: "Exploring the Town",
      textEn: "On Saturday, we explore our beautiful town. First, we take a bus to the supermarket to buy fruits. Then, we walk down the quiet street to the local library. Next to the library, there is a green park. My dad drives his white car to the general hospital. The town is active and full of life.",
      textEs: "El sábado, exploramos nuestro hermoso pueblo. Primero, tomamos un autobús al supermercado para comprar frutas. Luego, caminamos por la calle tranquila hacia la biblioteca local. Al lado de la biblioteca, hay un parque verde. Mi papá conduce su auto blanco hacia el hospital general. El pueblo es activo y lleno de vida."
    },
    h2: {
      titleEn: "A Trip to the Bank",
      textEn: "My grandmother needs to go to the bank on the corner. We ride a fast motorcycle because it is quick. Next, we visit the bakery to buy delicious bread. Finally, we take a taxi to the museum. There are many interesting things to see. Traveling in the city is exciting!",
      textEs: "Mi abuela necesita ir al banco de la esquina. Montamos en una motocicleta rápida porque es veloz. Luego, visitamos la panadería para comprar pan delicioso. Finalmente, tomamos un taxi al museo. Hay muchas cosas interesantes para ver. ¡Viajar en la ciudad es emocionante!"
    }
  },
  {
    id: 8,
    modules: "M12 (Weather & Seasons)",
    desc: "A perfect recap of climate conditions, temperature, and sun.",
    h1: {
      titleEn: "A Beautiful Windy Day",
      textEn: "Today the weather is very dynamic. In the morning it is cloudy and it is snowing a little bit. Now, the wind is blowing and it is freezing. In the afternoon, the sun is out and it is sunny but it is still cold. Winter is beautiful but I like warm days.",
      textEs: "Hoy el clima es muy dinámico. Por la mañana está nublado y está nevando un poco. Ahora, el viento está soplando y está helando. Por la tarde, el sol ha salido y está soleado, pero todavía hace frío. El invierno es hermoso pero me gustan los días cálidos."
    },
    h2: {
      titleEn: "Summer Is Coming",
      textEn: "Summer is my favorite season. The sky is clear blue and the sun is bright. It is very hot in July. We go to the beach to swim in the ocean. Sometimes, there is a warm rain, but the rainbow is beautiful. I love to eat ice cream under the sunny sky!",
      textEs: "El verano es mi estación favorita. El cielo es azul claro y el sol es brillante. Hace mucho calor en julio. Vamos a la playa a nadar en el océano. A veces, hay una lluvia cálida, pero el arcoíris es hermoso. ¡Me encanta comer helado bajo el cielo soleado!"
    }
  },
  {
    id: 9,
    modules: "M13 (Animals)",
    desc: "Practice with common domestic and farm animals.",
    h1: {
      titleEn: "Animals on the Farm",
      textEn: "My grandfather has a big farm. A loyal dog guards the animals. A cute cat sleeps near the barn. A small white rabbit jumps in the green grass. The cow gives fresh milk. The strong horse runs very fast. A little pig plays in the mud. A colorful bird sings on the tree.",
      textEs: "Mi abuelo tiene una gran granja. Un perro leal vigila a los animales. Un lindo gato duerme cerca del granero. Un pequeño conejo blanco salta en la hierba verde. La vaca da leche fresca. El caballo fuerte corre muy rápido. Un pequeño cerdo juega en el lodo. Un pájaro colorido canta en el árbol."
    },
    h2: {
      titleEn: "Wild Friends",
      textEn: "We visit the animal sanctuary. We see a big gray elephant eating green leaves. A tall giraffe looks down from the trees. A playful monkey jumps around and eats a yellow banana. A beautiful lion sleeps under the warm sun. The world is full of amazing animals!",
      textEs: "Visitamos el santuario de animales. Vemos un gran elefante gris comiendo hojas verdes. Una jirafa alta mira hacia abajo desde los árboles. Un mono juguetón salta de un lado a otro y come un plátano amarillo. Un hermoso león duerme bajo el cálido sol. ¡El mundo está lleno de animales increíbles!"
    }
  },
  {
    id: 10,
    modules: "M14 (Fruits)",
    desc: "Practice colors, fruits, and simple preparation tastes.",
    h1: {
      titleEn: "Fruit Salad",
      textEn: "Let's prepare a fresh fruit salad! We need a red apple, a yellow banana, and a sweet orange. My sister washes the green grape and the small strawberry. We squeeze a sour lemon for some juice. Fruit is delicious, sweet, and healthy. Everybody loves this colorful snack in the afternoon.",
      textEs: "¡Preparemos una ensalada de frutas frescas! Necesitamos una manzana roja, un plátano amarillo y una naranja dulce. Mi hermana lava la uva verde y la fresa pequeña. Exprimimos un limón ácido para obtener un poco de jugo. La fruta es deliciosa, dulce y saludable. A todos les encanta esta merienda colorida por la tarde."
    },
    h2: {
      titleEn: "Fruits for Breakfast",
      textEn: "Every morning, I eat fresh fruits for breakfast. I cut a sweet melon and a red watermelon into small pieces. My brother prefers sweet cherries and green pears. We also eat yogurt with blueberries. This healthy food gives us energy for the whole day!",
      textEs: "Cada mañana, como frutas frescas en el desayuno. Corto un melón dulce y una sandía roja en trozos pequeños. Mi hermano prefiere cerezas dulces y peras verdes. También comemos yogur con arándanos. ¡Esta comida saludable nos da energía para todo el día!"
    }
  },
  {
    id: 11,
    modules: "M15, M16 (Vegetables & Food)",
    desc: "A healthy meal combining fresh crops and cooking ingredients.",
    h1: {
      titleEn: "Lunch and Vegetables",
      textEn: "It is time for lunch. We cook a hot soup with fresh vegetables. We chop a brown potato, a red tomato, and a sweet onion. On the table, there is fresh bread and delicious cheese. Eating vegetables is very good for your body. Lunch is ready, help yourself and enjoy!",
      textEs: "Es hora de almorzar. Cocinamos una sopa caliente con verduras frescas. Cortamos una papa marrón, un tomate rojo y una cebolla dulce. En la mesa, hay pan fresco y queso delicioso. Comer verduras es muy bueno para tu cuerpo. ¡El almuerzo está listo, sírvete y disfruta!"
    },
    h2: {
      titleEn: "Dinner with Friends",
      textEn: "My friends come to dinner tonight. We prepare a healthy salad with green lettuce, fresh cucumber, and sweet carrots. We also grill chicken and boil white rice. For dessert, we have sweet apple pie. Sitting at the table together is the best part of the day!",
      textEs: "Mis amigos vienen a cenar esta noche. Preparamos una ensalada saludable con lechuga verde, pepino fresco y zanahorias dulces. También asamos pollo y hervimos arroz blanco. De postre, tenemos un dulce pastel de manzana. ¡Sentarse juntos a la mesa es la mejor parte del día!"
    }
  },
  {
    id: 12,
    modules: "M17 (Tastes & Cooking)",
    desc: "Learn about savory, sweet, sour, salty, and spicy cooking methods.",
    h1: {
      titleEn: "The Master Chef",
      textEn: "I love to cook at home. Some foods are sweet like honey, and others are sour like lemons. Potato chips are salty. Coffee is bitter, and chili pepper is very spicy. Today, I want to boil some eggs and fry a fresh fish. Sometimes I bake a chocolate cake. It is fun to learn all these tastes!",
      textEs: "Me encanta cocinar en casa. Algunos alimentos son dulces como la miel, y otros son ácidos como los limones. Las papas fritas son saladas. El café es amargo y el chile es muy picante. Hoy quiero hervir algunos huevos y freír un pescado fresco. A veces horneo un pastel de chocolate. ¡Es divertido aprender todos estos sabores!"
    },
    h2: {
      titleEn: "Baking a Cake",
      textEn: "Today is my sister's birthday, so we bake a cake. We mix sweet sugar, white flour, and fresh butter. I bake it in the hot oven for forty minutes. The cake is sweet and tastes delicious. We also serve cold lemonade which is sweet and sour. Everyone loves the birthday party!",
      textEs: "Hoy es el cumpleaños de mi hermana, así que horneamos un pastel. Mezclamos azúcar dulce, harina blanca y mantequilla fresca. Lo horneo en el horno caliente durante cuarenta minutos. El pastel es dulce y sabe delicioso. También servimos limonada fría que es agridulce. ¡A todos les encanta la fiesta de cumpleaños!"
    }
  },
  {
    id: 13,
    modules: "M18, M19, M20 (Routine & Body)",
    desc: "Connect clothing garments, body parts, and actions after waking up.",
    h1: {
      titleEn: "My Morning Routine",
      textEn: "In the morning, I wake up at seven. I wash my hands and my face. Then, I get dressed. I put on my blue pants, a white shirt, and black shoes. I brush my teeth. I look at my head in the mirror. My body feels strong and ready for a wonderful day. Take care and have a nice day!",
      textEs: "Por la mañana, me despierto a las siete. me lavo las manos y la cara. Luego, me visto. Me pongo mis pantalones azules, una camisa blanca y zapatos negros. Me cepillo los dientes. Miro mi cabeza en el espejo. Mi cuerpo se siente fuerte y listo para un día maravilloso. ¡Cuídate y que tengas un buen día!"
    },
    h2: {
      titleEn: "Ready for Bed",
      textEn: "At night, I prepare to sleep. First, I take a warm shower and wash my body. Next, I put on my warm pajamas and clean socks. I charge my phone on the desk. Finally, I lie down on the soft bed and close my eyes. I say: goodnight family, no worries for tomorrow.",
      textEs: "Por la noche, me preparo para dormir. Primero, tomo una ducha tibia y lavo mi cuerpo. Luego, me pongo mi pijama abrigado y calcetines limpios. Cargo mi teléfono en el escritorio. Finalmente, me acuesto en la cama blanda y cierro los ojos. Digo: buenas noches familia, sin preocupaciones para mañana."
    }
  }
];

const MOTIVATION_PHRASES = [
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

interface PracticeReadListenProps {
  onBack: () => void;
}

export default function PracticeReadListen({ onBack }: PracticeReadListenProps) {
  const [selectedOption, setSelectedOption] = useState<StoryOption | null>(null);
  const [activeStoryKey, setActiveStoryKey] = useState<"h1" | "h2">("h1");
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState<"normal" | "slow" | null>(null);

  // Gamified Lock States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showExam, setShowExam] = useState(false);

  // Exam States
  const [examWords, setExamWords] = useState<[string, string][]>([]);
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [lives, setLives] = useState(3);
  const [isInputError, setIsInputError] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState("");
  const [examFinishedError, setExamFinishedError] = useState(false);

  const examInputRef = useRef<HTMLInputElement>(null);

  // Normalizes comparison helper
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()¿?]/g, "") // remove punctuation
      .replace(/\s+/g, " ") // normalize spacing
      .trim();
  };

  const isAnswerCorrect = (typed: string, target: string): boolean => {
    const normTyped = normalizeText(typed);
    const normTarget = normalizeText(target);
    
    if (normTyped === normTarget) return true;
    
    // Check main part before parenthesis, e.g. "salud (estornudo)" -> match "salud"
    if (target.includes("(")) {
      const mainPart = target.split("(")[0];
      if (normalizeText(mainPart) === normTyped) return true;
    }

    // Support comma or slash alternatives
    const parts = target.split(/[\/,]/);
    if (parts.length > 1) {
      return parts.some(part => normalizeText(part) === normTyped);
    }
    
    return false;
  };

  const getStudentName = () => {
    try {
      return getStats().userName || "Josué";
    } catch {
      return "Josué";
    }
  };

  const loadRandomMotivation = () => {
    const randomPhrase = MOTIVATION_PHRASES[Math.floor(Math.random() * MOTIVATION_PHRASES.length)];
    setCurrentMotivation(randomPhrase.replace(/{name}/g, getStudentName()));
  };

  // Start Exam session
  const handleStartExam = () => {
    stopSpeaking();
    setIsPlaying(null);
    
    // Get master list of Play 1 vocabulary words across the 20 modules
    const play1Vocab = buildPlay1VocabList();
    
    // Get 12 random unique words from play1Vocab
    const shuffled = [...play1Vocab].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 12);
    
    setExamWords(selected);
    setCurrentExamIndex(0);
    setTypedAnswer("");
    setLives(3);
    setIsInputError(false);
    setExamFinishedError(false);
    loadRandomMotivation();
    setShowExam(true);

    setTimeout(() => {
      if (examInputRef.current && document.activeElement !== examInputRef.current) {
        examInputRef.current.focus();
      }
    }, 10);
  };

  // Process Exam Answer Verification
  const handleVerifyAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typedAnswer.trim()) return;

    const currentWordPair = examWords[currentExamIndex];
    if (!currentWordPair) return;

    const [english, spanish] = currentWordPair;
    const isCorrect = isAnswerCorrect(typedAnswer, spanish);

    const saveSuccessStats = (finalLives: number) => {
      try {
        const currentStats = getStats();
        currentStats.cupsCount += 1;
        const totalMistakesThisExam = 3 - finalLives;
        currentStats.errorsCount += totalMistakesThisExam;
        const jsDay = new Date().getDay();
        const localDayIndex = jsDay === 0 ? 6 : jsDay - 1;
        currentStats.practicedDays[localDayIndex] = true;
        
        if (!currentStats.moduleProgress) currentStats.moduleProgress = {};
        currentStats.moduleProgress[997] = 100; // Special read & listen is 100% complete
        
        if (!currentStats.moduleCups) currentStats.moduleCups = {};
        currentStats.moduleCups[997] = (currentStats.moduleCups[997] || 0) + 1;
        
        saveStats(currentStats);
      } catch (err) {
        console.error("Failed to update stats on exam completion", err);
      }
    };

    if (isCorrect) {
      // Correct!
      const nextIndex = currentExamIndex + 1;
      if (nextIndex >= 12) {
        // Unlocked successfully!
        setIsUnlocked(true);
        setShowTranslation(true);
        setShowExam(false);
        saveSuccessStats(lives);
      } else {
        setCurrentExamIndex(nextIndex);
        setTypedAnswer("");
        loadRandomMotivation();
        setTimeout(() => {
          if (examInputRef.current && document.activeElement !== examInputRef.current) {
            examInputRef.current.focus();
          }
        }, 10);
      }
    } else {
      // Incorrect!
      setIsInputError(true);
      const nextLives = lives - 1;
      setLives(nextLives);
      
      // Flash red animation
      setTimeout(() => {
        setIsInputError(false);
      }, 500);

      if (nextLives <= 0) {
        // Lost all 3 lives (3 attempts failed), immediately show the ALERTA ERROR with HOME button
        setExamFinishedError(true);
      } else {
        // Pass to the next word immediately even if failed (outline became red and lost 1 life)
        const nextIndex = currentExamIndex + 1;
        if (nextIndex >= 12) {
          // Finished all 12 words with lives left! Unlocked successfully!
          setIsUnlocked(true);
          setShowTranslation(true);
          setShowExam(false);
          saveSuccessStats(nextLives);
        } else {
          setCurrentExamIndex(nextIndex);
          setTypedAnswer("");
          loadRandomMotivation();
          setTimeout(() => {
            if (examInputRef.current && document.activeElement !== examInputRef.current) {
              examInputRef.current.focus();
            }
          }, 10);
        }
      }
    }
  };

  const handleSpeak = (text: string, rate: number, type: "normal" | "slow") => {
    if (isPlaying === type) {
      stopSpeaking();
      setIsPlaying(null);
      return;
    }
    
    setIsPlaying(type);
    speakTextWithRate(text, rate, () => {
      setIsPlaying(null);
    });
  };

  const handleSwitchStory = (key: "h1" | "h2") => {
    stopSpeaking();
    setIsPlaying(null);
    setActiveStoryKey(key);
    setShowTranslation(false);
    setIsUnlocked(false); // Reset unlock state for new story
  };

  const handleBackToMenu = () => {
    stopSpeaking();
    setIsPlaying(null);
    setSelectedOption(null);
    setActiveStoryKey("h1");
    setShowTranslation(false);
    setIsUnlocked(false);
  };

  const handleBackMain = () => {
    stopSpeaking();
    onBack();
  };

  const currentStory = selectedOption ? selectedOption[activeStoryKey] : null;

  return (
    <div className="flex flex-col min-h-full bg-transparent p-6 text-slate-100 select-none relative" id="practiceDashboard">
      <AnimatePresence mode="wait">
        {showExam ? (
          /* UNLOCK EXAM SCREEN (Emerald green color theme) */
          <motion.div
            key="exam-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-grow flex flex-col items-center justify-center p-4"
            id="examScreenOverlay"
          >
            {examFinishedError ? (
              /* EXAM GAME OVER SCREEN (RED/ALERT WARNING) */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-slate-950/90 border-2 border-red-500 rounded-[24px] p-8 text-center shadow-[0_0_40px_rgba(239,68,68,0.25)] flex flex-col items-center justify-center"
                id="examErrorAlertCard"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center text-red-500 mb-5 animate-pulse">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-black tracking-wide text-red-500 uppercase mb-2">
                  ALERTA ERROR
                </h2>
                <p className="text-sm font-semibold text-slate-300 leading-relaxed mb-8 max-w-xs">
                  Has agotado tus 3 oportunidades de desbloqueo. ¡Vuelve a repasar el vocabulario básico e inténtalo de nuevo!
                </p>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(239,68,68,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    stopSpeaking();
                    onBack(); // Returns to main home menu
                  }}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-black text-sm tracking-[2px] uppercase flex items-center justify-center gap-2 cursor-pointer border border-red-400/40"
                  id="btnErrorHome"
                >
                  <Home size={18} />
                  <span>HOME</span>
                </motion.button>
              </motion.div>
            ) : (
              /* ACTIVE EXAM INTERFACE (GREEN THEME) */
              <div className="w-full max-w-md bg-gradient-to-b from-[#092E1C] to-[#04120B] border border-[#00FF66]/40 rounded-[28px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex flex-col items-center" id="activeExamContent">
                
                {/* Header Block/Unblock Status */}
                <div className="flex items-center justify-between w-full mb-6 border-b border-[#00FF66]/20 pb-4">
                  <div className="text-left">
                    <span className="text-[9px] font-black tracking-[2px] text-[#00FF66] uppercase block">
                      DESBLOQUEO
                    </span>
                    <span className="text-xs font-extrabold text-slate-350 uppercase">
                      TRADUCCIÓN
                    </span>
                  </div>

                  {/* 3 Candados / Locks lives display */}
                  <div className="flex gap-1.5" id="examLivesLocks">
                    {[1, 2, 3].map((num) => {
                      const isLost = num > lives;
                      return (
                        <motion.div
                          key={num}
                          animate={isLost ? { scale: [1, 0.8, 1], rotate: [0, 15, -15, 0] } : {}}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                            isLost
                              ? "border-red-500/30 bg-red-500/10 text-red-500"
                              : "border-[#00FF66]/50 bg-[#00FF66]/10 text-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,0.2)]"
                          }`}
                          id={`lock-life-${num}`}
                        >
                          {isLost ? <Unlock size={16} /> : <Lock size={16} />}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Counter Terms indicator */}
                <div className="bg-[#00FF66]/10 border border-[#00FF66]/30 px-3.5 py-1.5 rounded-full mb-6" id="examTermCounter">
                  <span className="text-[11px] font-black text-[#00FF66] tracking-[2.5px] uppercase">
                    {currentExamIndex}/12 TÉRMINOS CONTESTADOS
                  </span>
                </div>

                {/* Current English Word Card */}
                <div className="w-full bg-slate-950/60 border border-[#00FF66]/20 rounded-2xl py-6 px-4 mb-6 text-center shadow-inner" id="examWordCard">
                  <span className="text-[9px] text-[#00FF66]/60 font-black tracking-[3px] uppercase block mb-1">
                    ENGLISH WORD
                  </span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide break-words select-text px-2" id="examEnglishWordText">
                    {examWords[currentExamIndex]?.[0]}
                  </h3>
                  {getWordEmoji(examWords[currentExamIndex]?.[0]) && (
                    <div className="text-3xl mt-2.5 flex justify-center select-none" id="examWordEmoji">
                      <WordEmoji item={examWords[currentExamIndex]?.[0]} />
                    </div>
                  )}
                </div>

                {/* Input Text Form */}
                <form onSubmit={handleVerifyAnswer} className="w-full mb-6" id="examVerifyForm">
                  <motion.div
                    animate={isInputError ? { x: [-6, 6, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`relative rounded-2xl border-2 transition-all ${
                      isInputError
                        ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                        : "border-[#00FF66]/40 focus-within:border-[#00FF66] focus-within:shadow-[0_0_20px_rgba(0,255,102,0.25)]"
                    }`}
                  >
                    <input
                      ref={examInputRef}
                      type="text"
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      enterKeyHint="done"
                      inputMode="text"
                      placeholder="Escribe la traducción en español..."
                      className="w-full py-4 px-5 bg-slate-950/70 rounded-2xl outline-none border-none text-white text-base text-center font-bold tracking-wide placeholder:text-slate-500"
                      id="examAnswerInput"
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </motion.div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        stopSpeaking();
                        setShowExam(false);
                      }}
                      className="flex-1 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                      id="btnCancelExam"
                    >
                      VOLVER
                    </button>
                    <button
                      type="submit"
                      disabled={!typedAnswer.trim()}
                      className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                        typedAnswer.trim()
                          ? "bg-[#00FF66] text-[#0B1B3D] border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:brightness-110"
                          : "bg-slate-850 text-slate-500 border-slate-800 cursor-not-allowed"
                      }`}
                      id="btnVerifyExam"
                    >
                      VERIFICAR
                    </button>
                  </div>
                </form>

                {/* Motivational Quote at bottom */}
                <p className="text-[11px] text-[#00FF66]/85 font-semibold text-center italic leading-relaxed px-4 max-w-xs" id="examMotivationQuote">
                  {currentMotivation}
                </p>

              </div>
            )}
          </motion.div>
        ) : !selectedOption ? (
          /* STORY CATEGORY SELECTION LIST */
          <motion.div
            key="story-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-grow flex flex-col"
            id="storyListContainer"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6" id="practiceHeader">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackMain}
                className="px-4 py-2 border border-[#00FF66]/40 bg-[#07122E] rounded-full text-[11px] font-black tracking-[2px] text-[#00FF66] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.15)] uppercase"
                id="practiceBackBtn"
              >
                ◀ VOLVER
              </motion.button>
              <div className="text-right">
                <span className="text-[10px] font-extrabold text-[#00D9FF] tracking-[2px] block">
                  SPECIAL MODULE
                </span>
                <span className="text-[8px] font-extrabold text-slate-400 tracking-[1.5px] uppercase block">
                  READ & LISTEN PRACTICE
                </span>
              </div>
            </div>

            {/* Banner */}
            <div className="p-5 rounded-2xl border border-[#00D9FF]/40 bg-gradient-to-r from-[#00D9FF]/10 to-slate-900/60 mb-6 flex items-center gap-4" id="practiceBanner">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#00D9FF] to-[#0088cc] text-[#0B1B3D] flex items-center justify-center font-black shadow-[0_0_15px_rgba(0,217,255,0.4)] shrink-0">
                <BookOpen size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-base font-black tracking-wide text-white uppercase">
                  PRACTICE READ & LISTEN
                </h3>
                <p className="text-[11px] font-medium text-slate-350 leading-snug">
                  Lee y escucha relatos cortos creados con el vocabulario básico del Play 1 de cada módulo. ¡Cada opción incluye dos historias diferentes!
                </p>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3.5 flex-grow pr-1" id="storyListGrid">
              <p className="text-[10px] font-extrabold text-[#00FF66]/70 uppercase tracking-[2px] text-center mb-2">
                Select a Category • Selecciona una Categoría
              </p>

              {PRACTICE_STORIES.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.015, x: 2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    setSelectedOption(option);
                    setActiveStoryKey("h1");
                    setIsUnlocked(false);
                  }}
                  className="w-full py-4 px-5 rounded-2xl transition-all flex items-center justify-between text-left border border-slate-800/80 bg-slate-900/40 hover:bg-[#00D9FF]/5 hover:border-[#00D9FF]/40 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                  id={`story-btn-${option.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30 flex items-center justify-center font-black text-sm shrink-0">
                      {option.id}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black tracking-wide text-white uppercase flex items-center gap-2">
                        {option.h1.titleEn} / {option.h2.titleEn}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#00FF66]/70 uppercase tracking-wider mt-0.5">
                        {option.modules}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 line-clamp-1">
                        {option.desc}
                      </p>
                    </div>
                  </div>
                  <div className="text-xl text-[#00D9FF] shrink-0 font-bold ml-2">➔</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ACTIVE STORY DISPLAY */
          <motion.div
            key="active-story"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-grow flex flex-col"
            id="activeStoryContainer"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5" id="storyHeader">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToMenu}
                className="px-4 py-2 border border-[#00D9FF]/40 bg-[#07122E] rounded-full text-[11px] font-black tracking-[2px] text-[#00D9FF] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,217,255,0.15)] uppercase"
                id="storyBackBtn"
              >
                ◀ MENU
              </motion.button>
              <div className="text-right">
                <span className="text-[10px] font-extrabold text-[#00FF66] tracking-[2px] block">
                  OPTION {selectedOption.id}
                </span>
                <span className="text-[8px] font-extrabold text-slate-400 tracking-[1.5px] uppercase block">
                  {selectedOption.modules}
                </span>
              </div>
            </div>

            {/* Active Story Card */}
            <div className="bg-gradient-to-b from-[#0E1F42] to-[#0A1530] border border-[#00D9FF]/30 rounded-[24px] p-6 flex-grow flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]" id="storyContentCard">
              
              <div className="flex items-center gap-2 text-[#00D9FF] mb-2" id="storyMetaTag">
                <Sparkles size={16} className="animate-spin" style={{ animationDuration: "3s" }} />
                <span className="text-[10px] font-black tracking-[3px] uppercase">HISTORY</span>
              </div>

              {/* Title Section (No translation, only EN) */}
              <h2 className="text-xl font-black text-white text-center uppercase tracking-wide px-2 leading-tight mb-5" id="storyTitleEn">
                {currentStory?.titleEn}
              </h2>

              {/* Speech Rates / Audio Controls */}
              <div className="flex items-center justify-center gap-3.5 mb-4 w-full max-w-xs" id="storyAudioControls">
                {/* Voice Normal Button */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => currentStory && handleSpeak(currentStory.textEn, 0.9, "normal")}
                  className={`flex-1 py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border font-bold text-xs uppercase tracking-wider ${
                    isPlaying === "normal"
                      ? "bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.2)]"
                      : "bg-[#00D9FF]/10 border-[#00D9FF]/40 text-[#00D9FF] hover:bg-[#00D9FF]/20"
                  }`}
                  id="btnVoiceNormal"
                >
                  <Volume2 size={16} className={isPlaying === "normal" ? "animate-bounce" : ""} />
                  <span>{isPlaying === "normal" ? "STOP" : "VOZ NORMAL"}</span>
                </motion.button>

                {/* Voice Slow Button */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => currentStory && handleSpeak(currentStory.textEn, 0.55, "slow")}
                  className={`flex-1 py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border font-bold text-xs uppercase tracking-wider ${
                    isPlaying === "slow"
                      ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      : "bg-[#00D9FF]/10 border-[#00D9FF]/40 text-[#00D9FF] hover:bg-[#00D9FF]/20"
                  }`}
                  id="btnVoiceSlow"
                >
                  <Volume2 size={16} className={isPlaying === "slow" ? "animate-pulse" : ""} />
                  <span>{isPlaying === "slow" ? "STOP" : "VOZ LENTA"}</span>
                </motion.button>
              </div>

              {/* Dynamic Toggle buttons for H1 and H2 below Voice Normal and Voice Slow */}
              <div className="flex items-center justify-center p-1 bg-slate-950/40 border border-slate-850 rounded-2xl mb-6 w-full max-w-xs" id="storyH1H2Selector">
                <button
                  onClick={() => handleSwitchStory("h1")}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs tracking-wider uppercase transition-all cursor-pointer ${
                    activeStoryKey === "h1"
                      ? "bg-[#00D9FF] text-[#0B1B3D] shadow-[0_0_12px_rgba(0,217,255,0.4)]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                  }`}
                  id="btnSelectH1"
                >
                  Historia 1 (H1)
                </button>
                <button
                  onClick={() => handleSwitchStory("h2")}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs tracking-wider uppercase transition-all cursor-pointer ${
                    activeStoryKey === "h2"
                      ? "bg-[#00D9FF] text-[#0B1B3D] shadow-[0_0_12px_rgba(0,217,255,0.4)]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                  }`}
                  id="btnSelectH2"
                >
                  Historia 2 (H2)
                </button>
              </div>

              {/* Story English Text Body */}
              <div className="w-full bg-[#050B1A]/80 border border-slate-800 rounded-2xl p-5 mb-5 select-text shadow-inner flex-grow flex items-center justify-center" id="storyTextEnBox">
                <p className="text-[15px] font-medium leading-relaxed text-slate-200 text-center select-text">
                  {currentStory?.textEn}
                </p>
              </div>

              {/* Translation Dropdown / Expandable Section with Candado Unlocking System */}
              <div className="w-full" id="storyTranslationSection">
                <motion.button
                  onClick={() => {
                    if (isUnlocked) {
                      // Toggle and re-lock if collapsed
                      const nextShow = !showTranslation;
                      setShowTranslation(nextShow);
                      if (!nextShow) {
                        setIsUnlocked(false); // Relocks automatically when closed!
                      }
                    } else {
                      // Triggers the exam session
                      handleStartExam();
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer font-bold text-xs uppercase tracking-wider ${
                    isUnlocked
                      ? "border-[#00FF66]/40 bg-[#00FF66]/5 text-[#00FF66] hover:bg-[#00FF66]/10"
                      : "border-amber-500/40 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.05)]"
                  }`}
                  id="btnToggleTranslation"
                >
                  <span className="flex items-center gap-2">
                    📖 TRADUCCIÓN AL ESPAÑOL
                  </span>

                  {/* Lock/Unlock Candado indicator beside collapse arrow */}
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <div className="flex items-center gap-1 text-[#00FF66] text-[10px] font-black tracking-wider">
                        <Unlock size={14} className="animate-pulse" />
                        <span>UNLOCKED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-400 text-[10px] font-black tracking-wider">
                        <Lock size={14} />
                        <span>LOCKED</span>
                      </div>
                    )}
                    {showTranslation && isUnlocked ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </motion.button>

                <AnimatePresence>
                  {showTranslation && isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden w-full bg-[#00FF66]/05 border border-[#00FF66]/20 rounded-xl p-4 text-center"
                      id="storyTextEsBox"
                    >
                      <p className="text-[14px] font-semibold leading-relaxed text-slate-300 italic select-text">
                        {currentStory?.textEs}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
