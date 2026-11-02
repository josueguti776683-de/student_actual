/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Sentence = {
  english: string;    // Oración en inglés (pregunta)
  correct: string;    // Traducción correcta en español
  distractors: [string, string]; // Dos opciones incorrectas en español
};

// --- PLAY 3 — sentencesList30 (30 sentences with protagonists Esther, Rebeca, Noelia, Maribel, Sanery) ---
export const sentencesList30: Sentence[] = [
  {
    english: "Esther wakes up at 6:00 am every day.",
    correct: "Esther se despierta a las 6:00 a. m. todos los días.",
    distractors: ["Esther se acuesta a las 6:00 a. m.", "Esther no se despierta temprano."]
  },
  {
    english: "Rebeca gets up immediately after her alarm rings.",
    correct: "Rebeca se levanta inmediatamente después de que suena su alarma.",
    distractors: ["Rebeca apaga la alarma y sigue durmiendo.", "Rebeca se baña por las mañanas."]
  },
  {
    english: "Noelia always makes the bed before leaving.",
    correct: "Noelia siempre hace la cama antes de salir.",
    distractors: ["Noelia limpia su habitación los fines de semana.", "Noelia se viste para ir a la escuela."]
  },
  {
    english: "Maribel washes her face with cold water.",
    correct: "Maribel se lava la cara con agua fría.",
    distractors: ["Maribel se lava las manos después de comer.", "Maribel se maquilla para la fiesta."]
  },
  {
    english: "Sanery takes a quick shower in the morning.",
    correct: "Sanery se ducha rápidamente por la mañana.",
    distractors: ["Sanery se baña en la tina por las noches.", "Sanery se lava el pelo todos los días."]
  },
  {
    english: "Esther brushes her teeth three times a day.",
    correct: "Esther se cepilla los dientes tres veces al día.",
    distractors: ["Esther se peina el pelo por la tarde.", "Esther usa hilo dental después de desayunar."]
  },
  {
    english: "Rebeca combs her hair in front of the mirror.",
    correct: "Rebeca se peina el pelo delante del espejo.",
    distractors: ["Rebeca se viste en su habitación.", "Rebeca se maquilla por las mañanas."]
  },
  {
    english: "Noelia puts on makeup before going to work.",
    correct: "Noelia se maquilla antes de ir al trabajo.",
    distractors: ["Noelia se lava la cara por las noches.", "Noelia se viste muy elegante hoy."]
  },
  {
    english: "Maribel gets dressed quickly because she is late.",
    correct: "Maribel se viste rápidamente porque se le hace tarde.",
    distractors: ["Maribel desayuna en la cocina rápidamente.", "Maribel sale de su casa corriendo."]
  },
  {
    english: "Sanery has breakfast with her family at 8:00 am.",
    correct: "Sanery desayuna con su familia a las 8:00 a. m.",
    distractors: ["Sanery cena con sus amigos por la noche.", "Sanery prepara la comida los fines de semana."]
  },
  {
    english: "Esther drives to work when it rains.",
    correct: "Esther conduce al trabajo cuando llueve.",
    distractors: ["Esther toma el autobús para ir a la escuela.", "Esther camina al parque por las tardes."]
  },
  {
    english: "Rebeca starts work at nine o'clock sharp.",
    correct: "Rebeca empieza a trabajar a las nueve en punto.",
    distractors: ["Rebeca termina de trabajar temprano.", "Rebeca almuerza en su oficina."]
  },
  {
    english: "Noelia has a short break in the afternoon.",
    correct: "Noelia toma un breve descanso por la tarde.",
    distractors: ["Noelia hace la tarea después de almorzar.", "Noelia pasea a su mascota en la plaza."]
  },
  {
    english: "Maribel has lunch at a small restaurant near the office.",
    correct: "Maribel almuerza en un pequeño restaurante cerca de la oficina.",
    distractors: ["Maribel prepara la cena en su casa.", "Maribel compra fruta en el mercado."]
  },
  {
    english: "Sanery takes a short nap on the couch.",
    correct: "Sanery toma una pequeña siesta en el sofá.",
    distractors: ["Sanery duerme toda la noche en su cama.", "Sanery descansa un rato en el jardín."]
  },
  {
    english: "Esther finishes work at 5:00 pm and feels happy.",
    correct: "Esther termina el trabajo a las 5:00 p. m. y se siente feliz.",
    distractors: ["Esther llega a su casa muy cansada.", "Esther va al gimnasio por la tarde."]
  },
  {
    english: "Rebeca gets home around six in the evening.",
    correct: "Rebeca llega a casa alrededor de las seis de la tarde.",
    distractors: ["Rebeca sale de su oficina al mediodía.", "Rebeca viaja en tren todos los días."]
  },
  {
    english: "Noelia has a healthy snack after exercising.",
    correct: "Noelia toma una merienda saludable después de hacer ejercicio.",
    distractors: ["Noelia prepara una cena deliciosa.", "Noelia desayuna temprano por la mañana."]
  },
  {
    english: "Maribel does her English homework carefully.",
    correct: "Maribel hace su tarea de inglés con cuidado.",
    distractors: ["Maribel lee un libro de aventuras.", "Maribel escribe una carta a su amiga."]
  },
  {
    english: "Sanery does the laundry on Saturday mornings.",
    correct: "Sanery lava la ropa los sábados por la mañana.",
    distractors: ["Sanery limpia la cocina por las tardes.", "Sanery arregla su armario el domingo."]
  },
  {
    english: "Esther washes the dishes after having dinner.",
    correct: "Esther lava los platos después de cenar.",
    distractors: ["Esther pone la mesa para su familia.", "Esther barre el piso de la cocina."]
  },
  {
    english: "Rebeca makes a delicious dinner for her guests.",
    correct: "Rebeca prepara una cena deliciosa para sus invitados.",
    distractors: ["Rebeca come pizza los viernes por la noche.", "Rebeca limpia el comedor después de comer."]
  },
  {
    english: "Noelia sets the table before her parents arrive.",
    correct: "Noelia pone la mesa antes de que lleguen sus padres.",
    distractors: ["Noelia recoge la mesa después de la comida.", "Noelia cocina arroz con pollo hoy."]
  },
  {
    english: "Maribel clears the table after everyone finishes eating.",
    correct: "Maribel recoge la mesa después de que todos terminan de comer.",
    distractors: ["Maribel pone los platos limpios en la mesa.", "Maribel barre la sala de estar."]
  },
  {
    english: "Sanery walks her beautiful dog in the park.",
    correct: "Sanery pasea a su hermoso perro en el parque.",
    distractors: ["Sanery alimenta a su gato en la mañana.", "Sanery juega con su mascota en la casa."]
  },
  {
    english: "Esther feeds her pet birds twice a day.",
    correct: "Esther alimenta a sus aves domésticas dos veces al día.",
    distractors: ["Esther limpia la jaula de sus pájaros.", "Esther compra comida para sus mascotas."]
  },
  {
    english: "Rebeca waters the plants on her sunny balcony.",
    correct: "Rebeca riega las plantas en su balcón soleado.",
    distractors: ["Rebeca poda las flores de su jardín.", "Rebeca compra macetas nuevas hoy."]
  },
  {
    english: "Noelia checks her work emails every night.",
    correct: "Noelia revisa sus correos de trabajo todas las noches.",
    distractors: ["Noelia escribe mensajes a sus amigas.", "Noelia lee noticias en su computadora."]
  },
  {
    english: "Maribel exercises at the gym to stay fit.",
    correct: "Maribel hace ejercicio en el gimnasio para mantenerse en forma.",
    distractors: ["Maribel corre por el parque los fines de semana.", "Maribel descansa después de trabajar."]
  },
  {
    english: "Sanery goes to bed early to rest well.",
    correct: "Sanery se acuesta temprano para descansar bien.",
    distractors: ["Sanery se despierta tarde los domingos.", "Sanery lee un libro antes de dormir."]
  }
];

// --- PLAY 3 — sentencesList80 (80 sentences with extra complexity, including sentencesList30) ---
export const sentencesList80: Sentence[] = [
  ...sentencesList30,
  {
    english: "Noelia said: stand up please and greet.",
    correct: "Noelia dijo: párense por favor y saluden.",
    distractors: ["Noelia dijo: siéntense por favor.", "Noelia les pidió guardar silencio."]
  },
  {
    english: "Maribel washes her hands with soap and hot water.",
    correct: "Maribel se lava las manos con jabón y agua caliente.",
    distractors: ["Maribel limpia sus platos con jabón.", "Maribel se lava la cara por las mañanas."]
  },
  {
    english: "Esther always turns off the lights before leaving home.",
    correct: "Esther siempre apaga las luces antes de salir de casa.",
    distractors: ["Esther enciende las lámparas en la noche.", "Esther cierra la puerta con llave antes de salir."]
  },
  {
    english: "Sanery locks the door carefully every single night.",
    correct: "Sanery cierra la puerta con llave cuidadosamente cada noche.",
    distractors: ["Sanery abre las ventanas por las mañanas.", "Sanery apaga las luces del pasillo."]
  },
  {
    english: "Rebeca enjoys listening to pop music while cooking.",
    correct: "Rebeca disfruta escuchar música pop mientras cocina.",
    distractors: ["Rebeca canta canciones alegres en el baño.", "Rebeca baila en su habitación los domingos."]
  },
  {
    english: "Esther reads a mystery book in her comfortable bed.",
    correct: "Esther lee un libro de misterio en su cómoda cama.",
    distractors: ["Esther escribe en su diario personal.", "Esther estudia inglés por las noches."]
  },
  {
    english: "Noelia charges her cell phone overnight on her desk.",
    correct: "Noelia carga su teléfono celular durante la noche en su escritorio.",
    distractors: ["Noelia apaga su teléfono para dormir tranquila.", "Noelia compra un cargador nuevo."]
  },
  {
    english: "Maribel puts on her warm pajamas before sleeping.",
    correct: "Maribel se pone su pijama abrigadora antes de dormir.",
    distractors: ["Maribel se quita la chaqueta pesada.", "Maribel se viste para salir por la noche."]
  },
  {
    english: "Sanery takes off her heavy coat and boots at the entrance.",
    correct: "Sanery se quita su abrigo pesado y sus botas en la entrada.",
    distractors: ["Sanery se viste con ropa elegante hoy.", "Sanery compra botas nuevas para el invierno."]
  },
  {
    english: "Rebeca irons her work clothes on Sunday afternoons.",
    correct: "Rebeca plancha su ropa de trabajo los domingos por la tarde.",
    distractors: ["Rebeca lava sus blusas en la lavadora.", "Rebeca dobla las sábanas limpias."]
  },
  {
    english: "Esther says: pardon me, I did not mean to bother you.",
    correct: "Esther dice: perdóneme, no quise molestarle.",
    distractors: ["Esther dice: de nada, fue un placer.", "Esther dice: lo siento, estoy ocupada."]
  },
  {
    english: "Rebeca asks: please write it down in your notebook.",
    correct: "Rebeca pide: por favor escríbelo en tu cuaderno.",
    distractors: ["Rebeca pide: por favor lee el siguiente párrafo.", "Rebeca pide: abre tu libro en la página diez."]
  },
  {
    english: "Noelia says: thank you for helping me clean.",
    correct: "Noelia dice: gracias por ayudarme a limpiar.",
    distractors: ["Noelia dice: de nada, fue un gusto.", "Noelia dice: por favor pon la mesa."]
  },
  {
    english: "Maribel says: you are welcome, it was my pleasure.",
    correct: "Maribel dice: de nada, fue un placer.",
    distractors: ["Maribel dice: lo siento mucho, no puedo.", "Maribel dice: gracias por la comida."]
  },
  {
    english: "Sanery says: I am sorry for being late today.",
    correct: "Sanery dice: lo siento por llegar tarde hoy.",
    distractors: ["Sanery dice: gracias por esperarme.", "Sanery dice: que tenga un buen día."]
  },
  {
    english: "Esther says: no worries, we have plenty of time.",
    correct: "Esther dice: sin preocupaciones, tenemos mucho tiempo.",
    distractors: ["Esther dice: apúrate por favor.", "Esther dice: no hay problema, yo pagaré."]
  },
  {
    english: "Rebeca says: no problem, I can help you.",
    correct: "Rebeca dice: no hay problema, puedo ayudarte.",
    distractors: ["Rebeca dice: de nada, hasta luego.", "Rebeca dice: lo siento, estoy muy cansada."]
  },
  {
    english: "Noelia says: have a nice day at school.",
    correct: "Noelia dice: que tengas un buen día en la escuela.",
    distractors: ["Noelia dice: nos vemos más tarde en casa.", "Noelia dice: buen trabajo con tu tarea."]
  },
  {
    english: "Maribel says: help yourself to some fresh cookies.",
    correct: "Maribel dice: sírvete algunas galletas frescas.",
    distractors: ["Maribel dice: por favor limpia la cocina.", "Maribel dice: gracias por traer dulces."]
  },
  {
    english: "Sanery says: my pleasure, see you later.",
    correct: "Sanery dice: con gusto, hasta luego.",
    distractors: ["Sanery dice: de nada, quédate aquí.", "Sanery dice: lo siento, tengo prisa."]
  },
  {
    english: "Esther says: good job on finishing the project.",
    correct: "Esther dice: buen trabajo al terminar el proyecto.",
    distractors: ["Esther dice: bien hecho con tu dibujo.", "Esther dice: por favor entrega la tarea."]
  },
  {
    english: "Rebeca says: well done, you passed the exam.",
    correct: "Rebeca dice: bien hecho, aprobaste el examen.",
    distractors: ["Rebeca dice: buen trabajo, sigue estudiando.", "Rebeca dice: saca tu cuaderno por favor."]
  },
  {
    english: "Noelia tells the class: open your books please.",
    correct: "Noelia le dice a la clase: abran sus libros por favor.",
    distractors: ["Noelia le dice a la clase: cierren sus cuadernos.", "Noelia le dice a la clase: presten atención."]
  },
  {
    english: "Maribel tells the children: close your books now.",
    correct: "Maribel le dice a los niños: cierren sus libros ahora.",
    distractors: ["Maribel le dice a los niños: guarden sus cosas.", "Maribel le dice a los niños: hagan silencio."]
  },
  {
    english: "Sanery says: raise your hand if you know.",
    correct: "Sanery dice: levanten la mano si lo saben.",
    distractors: ["Sanery dice: escriban la respuesta.", "Sanery dice: repitan después de mí."]
  },
  {
    english: "Esther says: pay attention to the whiteboard.",
    correct: "Esther dice: presten atención al pizarrón.",
    distractors: ["Esther dice: saquen sus lápices.", "Esther dice: repitan la lección hoy."]
  },
  {
    english: "Rebeca says: repeat after me, step by step.",
    correct: "Rebeca dice: repitan después de mí, paso a paso.",
    distractors: ["Rebeca dice: escriban esto rápido.", "Rebeca dice: abran sus cuadernos ahora."]
  },
  {
    english: "Noelia says: take out your notebook and pen.",
    correct: "Noelia dice: saquen su cuaderno y bolígrafo.",
    distractors: ["Noelia dice: abran sus libros ahora.", "Noelia dice: entreguen su tarea hoy."]
  },
  {
    english: "Maribel says: write it down before you forget.",
    correct: "Maribel dice: escríbelo antes de que lo olvides.",
    distractors: ["Maribel dice: lee el texto con cuidado.", "Maribel dice: repite la frase por favor."]
  },
  {
    english: "Sanery says: sit down and start writing.",
    correct: "Sanery dice: siéntense y empiecen a escribir.",
    distractors: ["Sanery dice: párense y escuchen.", "Sanery dice: abran sus carpetas por favor."]
  },
  {
    english: "Esther says: hurry up, the train is leaving.",
    correct: "Esther dice: apresúrate, el tren está saliendo.",
    distractors: ["Esther dice: camina despacio por favor.", "Esther dice: no corras en el andén."]
  },
  {
    english: "Rebeca says: sit down on the green chair.",
    correct: "Rebeca dice: siéntate en la silla verde.",
    distractors: ["Rebeca dice: párate al lado de la mesa.", "Rebeca dice: limpia la silla por favor."]
  },
  {
    english: "Noelia says: stand up and look at me.",
    correct: "Noelia dice: párate y mírame.",
    distractors: ["Noelia dice: siéntate y escribe.", "Noelia dice: ven aquí ahora."]
  },
  {
    english: "Maribel says: please come in and sit down.",
    correct: "Maribel dice: por favor entra y siéntate.",
    distractors: ["Maribel dice: por favor sal de la habitación.", "Maribel dice: por favor cierra la puerta."]
  },
  {
    english: "Sanery says: please line up in alphabetical order.",
    correct: "Sanery dice: por favor fórmense en fila en orden alfabético.",
    distractors: ["Sanery dice: por favor siéntense en sus lugares.", "Sanery dice: por favor entreguen sus exámenes."]
  },
  {
    english: "Esther says: put away your things and clean up.",
    correct: "Esther dice: guarden sus cosas y limpien.",
    distractors: ["Esther dice: saquen sus cuadernos ahora.", "Esther dice: entreguen la tarea por favor."]
  },
  {
    english: "Rebeca says: hand in your homework before Friday.",
    correct: "Rebeca dice: entreguen su tarea antes del viernes.",
    distractors: ["Rebeca dice: hagan su tarea en parejas hoy.", "Rebeca dice: guarden sus libros ahora."]
  },
  {
    english: "Noelia says: you can work in pairs today.",
    correct: "Noelia dice: pueden trabajar en parejas hoy.",
    distractors: ["Noelia dice: hagan el examen individualmente.", "Noelia dice: guarden silencio por favor."]
  },
  {
    english: "Maribel says: take care, the weather is freezing.",
    correct: "Maribel dice: cuídate, el clima está helado.",
    distractors: ["Maribel dice: ten cuidado con la calle mojada.", "Maribel dice: que tengas un buen viaje."]
  },
  {
    english: "Sanery says: be careful, that glass is fragile.",
    correct: "Sanery dice: ten cuidado, ese vaso es frágil.",
    distractors: ["Sanery dice: por favor lávate las manos.", "Sanery dice: limpia los platos rotos."]
  },
  {
    english: "Esther says: bless you, did you catch a cold?",
    correct: "Esther dice: salud (estornudo), ¿te resfriaste?",
    distractors: ["Esther dice: perdóneme, no quise asustarle.", "Esther dice: gracias por las flores."]
  },
  {
    english: "Rebeca says: excuse me, where is the station?",
    correct: "Rebeca dice: disculpe, ¿dónde está la estación?",
    distractors: ["Rebeca dice: de nada, hasta luego.", "Rebeca dice: por favor ven aquí."]
  },
  {
    english: "Noelia wakes up with a smile on her face.",
    correct: "Noelia se despierta con una sonrisa en la cara.",
    distractors: ["Noelia se acuesta muy tarde por la noche.", "Noelia se baña con agua caliente."]
  },
  {
    english: "Maribel gets up to drink a glass of water.",
    correct: "Maribel se levanta a beber un vaso de agua.",
    distractors: ["Maribel prepara un desayuno saludable.", "Maribel se acuesta a descansar."]
  },
  {
    english: "Sanery makes the bed with clean white sheets.",
    correct: "Sanery hace la cama con sábanas blancas limpias.",
    distractors: ["Sanery limpia el suelo del dormitorio.", "Sanery dobla su pijama azul."]
  },
  {
    english: "Esther washes her face to feel fully awake.",
    correct: "Esther se lava la cara para sentirse completamente despierta.",
    distractors: ["Esther se maquilla para ir a la oficina.", "Esther cepilla sus dientes rápidamente."]
  },
  {
    english: "Rebeca takes a warm shower after a long day.",
    correct: "Rebeca se ducha con agua tibia después de un largo día.",
    distractors: ["Rebeca se viste para ir a la reunión.", "Rebeca prepara la cena para su familia."]
  },
  {
    english: "Noelia dries her hair with a blue towel.",
    correct: "Noelia se seca el pelo con una toalla azul.",
    distractors: ["Noelia se peina con un peine de madera.", "Noelia se maquilla en el baño."]
  },
  {
    english: "Maribel brushes her teeth with mint toothpaste.",
    correct: "Maribel se cepilla los dientes con pasta dental de menta.",
    distractors: ["Maribel usa hilo dental con cuidado.", "Maribel se lava la cara con jabón."]
  },
  {
    english: "Sanery combs her hair into a neat ponytail.",
    correct: "Sanery se peina el pelo en una coleta ordenada.",
    distractors: ["Sanery se viste para ir a la escuela.", "Sanery se maquilla para la fotografía."]
  }
];

// --- PLAY 4 — allVocabList (80 words) ---
// Composed of 40 daily routine words, and 40 commands and expressions
export const routineList: [string, string][] = [
  ["wake up", "despertarse"],
  ["get up", "levantarse"],
  ["make the bed", "hacer la cama"],
  ["wash your face", "lavarse la cara"],
  ["take a shower", "ducharse"],
  ["take a bath", "bañarse (en tina)"],
  ["dry your hair", "secarse el pelo"],
  ["floss", "usar hilo dental"],
  ["brush your teeth", "cepillarse los dientes"],
  ["comb your hair", "peinarse"],
  ["shave", "afeitarse"],
  ["put on makeup", "maquillarse"],
  ["get dressed", "vestirse"],
  ["have breakfast", "desayunar"],
  ["go to work", "ir al trabajo"],
  ["go to school", "ir a la escuela"],
  ["leave home", "salir de casa"],
  ["catch the bus", "tomar el autobús"],
  ["drive to work", "conducir al trabajo"],
  ["start work", "empezar a trabajar"],
  ["have a break", "tomar un descanso"],
  ["have lunch", "almorzar"],
  ["take a nap", "tomar una siesta"],
  ["finish work", "terminar el trabajo"],
  ["get home", "llegar a casa"],
  ["have a snack", "tomar una merienda"],
  ["do homework", "hacer la tarea"],
  ["do the laundry", "lavar la ropa"],
  ["wash the dishes", "lavar los platos"],
  ["make dinner", "preparar la cena"],
  ["set the table", "poner la mesa"],
  ["clear the table", "recoger la mesa"],
  ["walk the dog", "pasear al perro"],
  ["feed the pet", "alimentar a la mascota"],
  ["water the plants", "regar las plantas"],
  ["check email", "revisar el correo"],
  ["exercise", "hacer ejercicio"],
  ["go to the gym", "ir al gimnasio"],
  ["have dinner", "cenar"],
  ["go to bed", "acostarse"]
];

export const commandsList: [string, string][] = [
  ["sit down", "sentarse"],
  ["stand up", "pararse"],
  ["hurry up", "apresurarse"],
  ["be quiet", "hacer silencio"],
  ["calm down", "calmarse"],
  ["do not touch", "no tocar"],
  ["do not run", "no correr"],
  ["come here", "venir aquí"],
  ["come in", "entrar"],
  ["line up", "formarse en fila"],
  ["put away your things", "guardar tus cosas"],
  ["hand in your homework", "entregar la tarea"],
  ["work in pairs", "trabajar en parejas"],
  ["take care", "cuidarse"],
  ["be careful", "tener cuidado"],
  ["wash your hands", "lavarse las manos"],
  ["cover your mouth", "cúbrete la boca"],
  ["bless you", "salud (estornudo)"],
  ["excuse me", "disculpe"],
  ["pardon me", "perdóneme"],
  ["please", "por favor"],
  ["thank you", "gracias"],
  ["you are welcome", "de nada"],
  ["I am sorry", "lo siento"],
  ["no worries", "sin preocupaciones"],
  ["no problem", "no hay problema"],
  ["have a nice day", "que tenga un buen día"],
  ["help yourself", "sírvase"],
  ["my pleasure", "con gusto"],
  ["see you later", "hasta luego"],
  ["good job", "buen trabajo"],
  ["well done", "bien hecho"],
  ["open your book", "abrir el libro"],
  ["close your book", "cerrar el libro"],
  ["raise your hand", "levantar la mano"],
  ["pay attention", "prestar atención"],
  ["repeat after me", "repetir después de mí"],
  ["take out your notebook", "sacar el cuaderno"],
  ["write it down", "escribirlo"],
  ["turn off the lights", "apagar las luces"]
];

export const allVocabList: [string, string][] = [
  ...routineList,
  ...commandsList
];
