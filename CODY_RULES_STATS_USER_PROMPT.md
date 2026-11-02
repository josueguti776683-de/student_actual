# PROMPT PARA STUDENT 2 — PANEL DE BOTONES DINÁMICOS (RULES, STATS Y USUARIO)

Este prompt recopila con absoluta precisión la especificación de diseño, ubicación, lógicas, datos y flujos de los paneles del tablero superior de **Student 1**. Puedes copiar este bloque y dárselo a cualquier IA para implementar exactamente la misma funcionalidad en **Student 2**.

---

```markdown
Eres un programador experto en React, TypeScript y Tailwind CSS. Tu objetivo es implementar un sistema de navegación dinámico mediante pestañas con tres paneles interactivos (RULES, STATS, USUARIO) en el menú principal (Welcome Dashboard) de "Student 2", replicando con total exactitud la lógica, diseño visual de alto impacto y flujos sin omitir ningún detalle.

A continuación se detallan la ubicación, estilos, comportamiento y lógicas de cada uno de los elementos:

### 1. DISEÑO VISUAL Y UBICACIÓN (GRID DE PESTAÑAS SUPERIOR)
- **Ubicación**: Centrado de forma horizontal en la sección superior del menú principal, justo debajo de los títulos principales y arriba de la lista de módulos.
- **Estructura**: Un grid de 3 columnas de ancho completo para móviles, ajustado a un ancho máximo (`max-w-md mx-auto w-full mb-6`).
- **Los 3 Botones**:
  1. **RULES** (ID: `tabBtnRules`): Icono `BookOpen` de lucide-react y etiqueta de texto "RULES" en mayúsculas, tamaño de fuente micro (`text-[10px]`), peso de fuente ultra negrita (`font-black`), espaciado de letras ampliado (`tracking-wider`).
  2. **STATS** (ID: `tabBtnStats`): Icono `BarChart2` de lucide-react y etiqueta de texto "STATS" con la misma tipografía micro.
  3. **USUARIO** (ID: `tabBtnUser`): Icono `User` de lucide-react y etiqueta de texto "USUARIO" con la misma tipografía micro.
- **Comportamiento de Selección Dinámica (Toggles)**:
  - Al dar clic en un botón activo, este se cierra (vuelve a `null`, ocultando el contenido de la pestaña).
  - Al dar clic en un botón inactivo, se activa ese panel y se cierran automáticamente los otros paneles.
- **Estilos de Estado (Tailwind CSS)**:
  - **Estado Activo**: Fondo verde esmeralda semi-translúcido (`bg-[#00FF66]/15`), borde verde brillante (`border-[#00FF66]`), texto verde vibrante (`text-[#00FF66]`) y una sombra de resplandor neón (`shadow-[0_0_12px_rgba(0,255,102,0.25)]`). El icono ejecuta un efecto dinámico de pulsación suave (`animate-pulse`).
  - **Estado Inactivo**: Fondo oscuro discreto (`bg-slate-900/40`), borde gris pizarra oscuro (`border-slate-800`), texto gris apagado (`text-slate-400`). Al pasar el ratón por encima (`hover:`), el borde se aclara a `border-slate-700` y el texto a `text-slate-200`.

---

### 2. PANEL 1: RULES (METODOLOGÍA Y REGLAS DEL SISTEMA)
- **Identificador de Elemento**: `panelRules` (animado con `motion.div` de `motion/react` con transiciones de opacidad y desplazamiento vertical de `y: 10` a `y: 0`).
- **Diseño**: Fondo con degradado sutil (`bg-gradient-to-b from-slate-900/75 to-slate-950/90`), borde pizarra (`border-slate-800`), relleno generoso (`p-5`), esquinas redondeadas (`rounded-2xl`) y sombra flotante (`shadow-xl`).
- **Cabecera**: Título "Metodología y Reglas del Sistema" (`text-[12px] font-black tracking-wider text-[#00FF66] uppercase`), precedido del icono `BookOpen`.
- **Cuerpo Desplazable**: Una zona con scroll interno personalizado (`max-h-[550px] overflow-y-auto pr-1.5 custom-scrollbar`), que enumera rigurosamente las 13 reglas del sistema con fuentes micro (`text-[11px] text-slate-300 leading-relaxed`):

  1. **🚀 OBJETIVO DE APRENDIZAJE**: Texto destacado con fondo verde esmeralda translúcido (`bg-emerald-950/15 border border-emerald-500/25 p-2.5 rounded-xl animate-pulse`). Explica que el usuario dominará todo el diccionario de vocabulario en inglés americano cotidiano, cerrando con la frase motivacional en mayúsculas: "¡NO TE RINDAS CARAJO!".
  2. **🧠 PLAY 1 (APRENDER Y ESCRIBIR)**: Explica que para memorizar cada término, el usuario debe completarlo correctamente en 2 ocasiones consecutivas en modo de escritura en teclado, apoyado por fonética IPA y audio nativo.
  3. **🎯 PLAY 2 (OPCIÓN MÚLTIPLE)**: Explica que ejercita el reconocimiento visual rápido permitiendo seleccionar la traducción correcta entre alternativas antes de avanzar.
  4. **📝 PLAY 3 (EXAMEN DE CONTROL / PLAY 4 EN M20)**: Explica que es una evaluación de escritura ágil donde se escribe la palabra correctamente una (1) sola vez para avanzar y ganar Copas (🏆).
  5. **🧩 PLAY 4 / PLAY 5 (PARES • PAIRS)**: Disponible como PLAY 4 en los Módulos 1 al 19 y como PLAY 5 en el Módulo 20. Empareja tarjetas en inglés y español en bloques dinámicos de 6 pares usando los mismos grupos de estudio del Play 1, con pronunciación automática y penalización de escritura (3x) en caso de error.
  6. **⚠️ ENTRENAMIENTO DE PENALIZACIÓN UNIFICADO**: Destacado con fondo rojo translúcido (`border-rose-500/20 bg-rose-500/5 p-2.5 rounded-xl`). Explica que errar en PLAY 1, PLAY 2, PLAY 3 o PARES abre de inmediato la penalización donde se debe escribir la palabra de forma perfecta 3 veces consecutivas, sumando un castigo acumulativo de +1 por cada error cometido dentro del modal de castigo.
  7. **🔄 REINSERCIÓN DINÁMICA**: Explica que los términos errados no se eliminan, sino que se clonan y se reinsertan aleatoriamente en turnos futuros para asegurar el dominio absoluto.
  8. **⚡ MODO 5 MINUTOS (SESIÓN RÁPIDA)**: Detalla que está diseñado para prácticas veloces en dos modalidades de juego: "ONE MORE" (15 palabras aleatorias) y "THE PLUS ONE" (9 palabras rápidas del diccionario global).
  9. **✨ MODO WELCOME (BIENVENIDO)**: Explica el funcionamiento del abecedario completo interactivo con sonidos de pronunciación nativa y fonética IPA de apoyo.
  10. **📖 MODO LECTURA Y AUDICIÓN (READ & LISTEN)**: Detalla las historias interactivas de Play 1 seguidas por un examen de 12 palabras donde el usuario cuenta con 3 vidas o candados. Perderlos todos aborta la sesión.
  11. **🎓 STUDENT OF EXAM (LA PRUEBA DEFINITIVA)**: Destacado con fondo azul translúcido (`bg-sky-950/15 border border-sky-400/25 p-2.5 rounded-xl`). Explica las 3 dificultades disponibles (TEST FAST con 5 palabras y 3 vidas, TRUTH TEST con 10 palabras y 2 vidas, FINAL EXAM con 15 palabras y 1 vida), y desglosa rigurosamente sus 5 fases consecutivas:
      - *Fase 1*: Traducción directa escrita del término escuchado.
      - *Fase 2*: Parejas coincidentes contra reloj (tarjetas en inglés y español).
      - *Fase 3*: Números contextuales, completando espacios vacíos en oraciones con cifras naturales u ordinales escritas.
      - *Fase 4*: Vocabulario de uso cotidiano insertado en oraciones lógicas.
      - *Fase 5*: Selección de opción múltiple avanzada con opciones con alta similitud fonética o visual.
      - *Flujo de éxito*: El aprobado exitoso genera e imprime un diploma de certificación oficial con métricas detalladas.
  12. **📘 DICCIONARIO INTELIGENTE ROTATIVO**: Explica que permite buscar vocabulario con pronunciación americana y ejemplos prácticos. Añade la regla de Rotación Aleatoria, donde cada ingreso o pulsación del botón "ROTAR" selecciona un término aleatorio nuevo.
  13. **📊 SEGUIMIENTO DE ESTADÍSTICAS (STATS)**: Explica el funcionamiento del guardado persistente del historial en tiempo real y la presencia del botón de reinicio global.
  14. **👤 PERFIL, PROGRESO DE MÓDULOS Y FRASES (USUARIO)**: Explica que al ingresar un nombre se personalizan dinámicamente las frases motivacionales distribuidas por la app, y que registra los avances individuales de progreso de los 20 módulos principales.

- **Pie de Panel**: Muestra una frase de motivación inteligente, dinámica y con formato cursivo basada en el nombre del usuario y el estado de la aplicación.

---

### 3. PANEL 2: STATS (CUADRO DE ESTADÍSTICAS DEL ESTUDIANTE)
- **Identificador de Elemento**: `panelStats` (animado fluidamente con transiciones en entrada).
- **Estructura Interna**:
  - **Métricas Superiores (Grid de 3 columnas en escritorio, adaptable en móviles)**:
    1. *Palabras Totales*: Tarjeta que calcula dinámicamente la longitud total de palabras del diccionario unificado de vocabulario.
    2. *Errores Cometidos*: Muestra la cifra acumulada de fallas desde `localStorage`.
    3. *Rewards Display (Copa/Medalla)*: Se adapta de forma inteligente en tiempo real:
       - Si no hay logros, renderiza sub-tarjetas gemelas de Copas (🏆 0) y Medallas (🏅 0) en color atenuado.
       - Si solo se han ganado copas, destaca un gran trofeo dorado (🏆) con el desglose exacto de copas ganadas a nivel de módulos de juego.
       - Si solo se han ganado medallas, destaca la medalla platino (🏅) con su desglose correspondiente.
       - Si se poseen ambos, despliega ambos widgets reducidos con perfecta simetría y legibilidad.
  - **Botón de Reinicio Rápido (`resetStatsBtn`)**:
    - **Función**: Permite restablecer todos los errores cometidos, copas y medallas ganadas, progreso semanal de estudio y el calendario de práctica a valores nulos (0).
    - **Flujo de Confirmación Integrado**:
      - Al dar clic, el botón se transforma instantáneamente en un módulo de alerta en rojo suave, preguntando "¿Reiniciar todo a cero?".
      - Despliega dos opciones exclusivas: "Sí" (ejecuta el limpiado en `localStorage` y actualiza el estado de la app en vivo) y "No" (cancela la operación y regresa al estado del botón normal).
  - **Calendario de Práctica Semanal**:
    - Muestra una fila interactiva de círculos representando los días de la semana (L, M, M, J, V, S, D).
    - El sistema rellena en verde brillante (`bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66]`) aquellos días en que se ha registrado actividad de práctica real en el dispositivo de forma persistente.
  - **Barra de Progreso Semanal**:
    - Una barra horizontal con animación de carga inicial (`motion.div`) que se llena en base al porcentaje de aprendizaje semanal (`weeklyLearningProgress` de 0% a 100%).
    - Muestra una nota descriptiva de sistema que aclara que el progreso semanal se reinicia automáticamente los domingos por la tarde.
  - **Mensajes de Motivación Cruzados**: Muestra citas aleatorias altamente personalizadas utilizando el nombre actual del estudiante en mayúsculas (ej. "¡Fuerza, JOSUÉ! Cada palabra que dominas hoy...").

---

### 4. PANEL 3: USUARIO (PERFIL, PROGRESO E HISTORIAL)
- **Identificador de Elemento**: `panelUser` (animado fluidamente en su montaje).
- **Estructura Interna**:
  - **Editor de Nombre de Estudiante (Formulario de un solo campo)**:
    - Muestra la etiqueta "Nombre de Estudiante" en formato micro y gris pizarra.
    - **Flujo de Edición**:
      - Al dar clic sobre el nombre actual o el icono de lápiz (`Pencil`), el texto se transforma en un campo de texto interactivo (`input` enfocado automáticamente con un límite de 18 caracteres).
      - El borde del campo de entrada adquiere un brillo verde neón.
      - Despliega dos botones de control interactivo: un botón verde con el icono `Check` para confirmar y un botón gris con el icono `X` para cancelar.
      - Al dar Enter o confirmar, guarda el nombre de forma persistente en `localStorage` y actualiza inmediatamente las 12 frases motivacionales distribuidas por la aplicación sin forzar una recarga manual del navegador.
  - **Botón para Reiniciar Módulos de Forma Independiente**:
    - Ubicado a la par de la etiqueta del progreso de módulos.
    - Permite vaciar el avance individual de porcentaje de los 20 módulos a 0% de forma segura sin afectar el conteo global de errores, copas o medallas del estudiante. Cuenta con el mismo flujo de confirmación integrado de "Sí/No" contra toques accidentales.
  - **Lista de Progreso Detallada por Módulo (Contenedor Scrollable)**:
    - Un contenedor con límite de altura ajustable (`max-h-[385px] overflow-y-auto pr-1 space-y-1.5 custom-scrollbar`).
    - Despliega un listado vertical de los 20 módulos del sistema (M1 a M20), indicando:
      - Código del módulo y nombre oficial (ej. "M1 — NATURAL NUMBERS").
      - Porcentaje de aprendizaje completado (calculado en pasos de 10% de forma dinámica en base a las sesiones finalizadas).
      - Conteo acumulado de Copas (🏆) y Medallas (🏅) obtenidas específicamente dentro de ese módulo individual.
      - Una barra de progreso horizontal que refleja de forma gráfica el porcentaje de aprendizaje de cada módulo con un slider verde vibrante.

---

### 5. ESPECIFICACIÓN TÉCNICA DE PERSISTENCIA Y EVENTOS (STATE MANAGEMENT)
- Toda la información y estados de estos tres paneles se guardan y leen de `localStorage` utilizando una clave única para evitar conflictos con otras aplicaciones (ej. `student2_stats`).
- Al guardar o reiniciar estadísticas, el componente emite un evento personalizado de ventana (`window.dispatchEvent(new CustomEvent("stats_updated"))`) para que las métricas mostradas en los tres paneles se sincronicen de manera inmediata y en tiempo real a lo largo de toda la interfaz de usuario.
```

Utiliza estas directrices para codificar, estructurar y diseñar con la máxima calidad técnica y estética los paneles interactivos del menú de Student 2.
