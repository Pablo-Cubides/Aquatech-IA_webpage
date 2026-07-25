export interface GuideContent {
  slug: string;
  title: string;
  subtitle: string;
  portal: "ia" | "ambiental";
  icon: string;
  description: string;
  badge: string;
  sections: Array<{
    title: string;
    icon: string;
    content: string; // HTML-safe or string markdown content
  }>;
}

export const guidesData: Record<string, GuideContent> = {
  "normas-ambientales": {
    slug: "normas-ambientales",
    title: "Manual de Normas Ambientales por País",
    subtitle: "Guía metodológica de cumplimiento normativo",
    portal: "ambiental",
    icon: "📋",
    badge: "Normatividad",
    description: "Conozca cómo funciona nuestro comparador y las metodologías de análisis legislativo.",
    sections: [
      {
        title: "Introducción al Cumplimiento Ambiental",
        icon: "⚖️",
        content: `La gestión ambiental moderna requiere el cumplimiento estricto de límites permisibles de calidad de recursos naturales y emisiones. Esta herramienta consolida las normativas oficiales de múltiples países de Latinoamérica y del mundo en cuatro dominios clave:
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Calidad del Agua:</strong> Estándares para consumo humano, riego agrícola, uso pecuario y preservación de flora y fauna.</li>
          <li><strong>Calidad del Aire:</strong> Límites para contaminantes criterio (PM2.5, PM10, SO2, NO2, O3, CO) en el aire ambiente.</li>
          <li><strong>Vertimientos:</strong> Normas de descarga de aguas residuales domésticas y no domésticas a cuerpos superficiales y alcantarillados.</li>
          <li><strong>Residuos Sólidos:</strong> Regulaciones para la clasificación, almacenamiento y disposición final de residuos ordinarios y peligrosos.</li>
        </ul>`
      },
      {
        title: "Cómo funciona el Comparador",
        icon: "🔄",
        content: `El explorador lee directamente archivos JSON estructurados que representan la legislación de cada país. 
        Al seleccionar un <strong>Dominio Ambiental</strong> y un <strong>País</strong>:
        <ol class="list-decimal pl-5 mt-2 space-y-1">
          <li>Se consulta la ruta API <code>/api/paises</code> para listar las opciones disponibles basadas en los archivos presentes en el servidor.</li>
          <li>Se consulta <code>/api/sectores</code> para obtener clasificaciones específicas (como sectores industriales en vertimientos).</li>
          <li>La interfaz muestra una tabla interactiva con el parámetro, el límite máximo permisible, las unidades de medida y notas aclaratorias oficiales.</li>
        </ol>
        Además, la herramienta incluye enlaces directos a las publicaciones de los Diarios Oficiales (como el Diario Oficial de la Unión Europea o el Ministerio de Ambiente de Colombia) para asegurar la trazabilidad.`
      }
    ]
  },
  "indice-calidad-agua": {
    slug: "indice-calidad-agua",
    title: "Manual de Índices de Calidad de Agua",
    subtitle: "Metodologías de cálculo de IRCA, WQI y DWQI",
    portal: "ambiental",
    icon: "💧",
    badge: "Calidad Hídrica",
    description: "Aprenda cómo se evalúa el riesgo y la calidad fisicoquímica del recurso hídrico.",
    sections: [
      {
        title: "Índice de Riesgo de Calidad de Agua (IRCA)",
        icon: "🇨🇴",
        content: `El **IRCA** (Índice de Riesgo de la Calidad del Agua para Consumo Humano) es el estándar oficial de Colombia bajo la **Resolución 2115 de 2007**.
        Asigna un puntaje de riesgo a cada parámetro fisicoquímico y microbiológico que resulte no conforme:
        <div class="bg-gray-50 p-4 rounded-lg my-3 font-mono text-sm border">
          %IRCA = (Σ Puntajes de Riesgo No Conformados / Σ Puntajes de Riesgo Analizados) × 100
        </div>
        <strong>Clasificación del Riesgo:</strong>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><span class="text-green-600 font-bold">0% - 5%:</span> Sin riesgo. Agua apta para consumo humano.</li>
          <li><span class="text-lime-600 font-bold">5.1% - 14%:</span> Riesgo bajo. No recomendable.</li>
          <li><span class="text-yellow-600 font-bold">14.1% - 35%:</span> Riesgo medio. No apta.</li>
          <li><span class="text-orange-600 font-bold">35.1% - 80%:</span> Riesgo alto. Requiere intervención inmediata.</li>
          <li><span class="text-red-600 font-bold">80.1% - 100%:</span> Inviable sanitariamente. Peligro grave.</li>
        </ul>`
      },
      {
        title: "Índice NSF WQI y DWQI",
        icon: "🌐",
        content: `Para análisis internacionales, la calculadora implementa:
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><strong>NSF WQI (Water Quality Index):</strong> Metodología paramétrica estadounidense que pondera 9 parámetros clave (Oxígeno Disuelto, pH, DBO5, Coliformes, etc.) mediante curvas de subíndice (Qi) y pesos de importancia (Wi).</li>
          <li><strong>DWQI (Drinking Water Quality Index):</strong> Basado en el método WA-WQI (Weighted Arithmetic WQI), calcula la desviación proporcional del valor medido respecto a la norma de la OMS y su valor ideal.</li>
        </ul>`
      }
    ]
  },
  "indice-calidad-aire": {
    slug: "indice-calidad-aire",
    title: "Manual de Índices de Calidad del Aire",
    subtitle: "Cálculo e interpretación de AQI, ICA e IBOCA",
    portal: "ambiental",
    icon: "💨",
    badge: "Monitoreo del Aire",
    description: "Metodologías de interpolación segmentada para la salud pública ambiental.",
    sections: [
      {
        title: "Cálculo del AQI (Air Quality Index)",
        icon: "📊",
        content: `Los índices de calidad del aire traducen concentraciones de gases y partículas (PM2.5, PM10, O3, NO2, SO2, CO) en una escala numérica de salud pública de 0 a 500. 
        Se calcula para cada contaminante mediante una función de interpolación lineal segmentada:
        <div class="bg-gray-50 p-4 rounded-lg my-3 font-mono text-xs border">
          I_p = ((I_hi - I_lo) / (BP_hi - BP_lo)) * (C_p - BP_lo) + I_lo
        </div>
        Donde:
        <ul class="list-disc pl-5 mt-1 text-sm space-y-1">
          <li><code>C_p</code>: Concentración del contaminante.</li>
          <li><code>BP_hi / BP_lo</code>: Puntos de corte de concentración de la norma correspondientes al segmento de <code>C_p</code>.</li>
          <li><code>I_hi / I_lo</code>: Valores extremos de AQI para el segmento correspondiente.</li>
        </ul>
        El AQI reportado es el valor máximo calculado entre todos los contaminantes analizados.`
      },
      {
        title: "Normativas Locales y Diferencias",
        icon: "🌍",
        content: `La herramienta permite contrastar los estándares de la **EPA de EE.UU.**, la **Resolución 2254 de Colombia** y el **IBOCA** de Bogotá. Cada norma define diferentes puntos de corte (breakpoints) y periodos de promedio (horario, 8 horas o 24 horas) para reflejar las directrices específicas de exposición a la salud.`
      }
    ]
  },
  "generador-matrices": {
    slug: "generador-matrices",
    title: "Manual de Matrices de EIA",
    subtitle: "Evaluación de Impacto Ambiental integrada",
    portal: "ambiental",
    icon: "📐",
    badge: "EIA Matrices",
    description: "Guía de formulación para metodologías Leopold y Conesa simplificada.",
    sections: [
      {
        title: "La Matriz de Leopold",
        icon: "📋",
        content: `Publicada por el USGS en 1971, es un método matricial bidimensional cualitativo.
        Cruza las **acciones del proyecto** (e.g., excavación, desmonte) en las columnas con los **factores ambientales** (e.g., fauna, calidad del aire) en las filas:
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Magnitud (M):</strong> Del 1 al 10 (con signo +/-), indica el grado de alteración física del recurso.</li>
          <li><strong>Importancia (I):</strong> Del 1 al 10, representa la escala espacial y relevancia del impacto.</li>
        </ul>
        La ponderación visual permite identificar rápidamente las interacciones más severas.`
      },
      {
        title: "Método Conesa Simplificado",
        icon: "🧮",
        content: `El método de Conesa Fernandez-Vitora calcula la importancia del impacto (I) a partir de 11 criterios como la intensidad (IN), extensión (EX), persistencia (PE), reversibilidad (RV), recuperabilidad (MC), entre otros:
        <div class="bg-gray-50 p-4 rounded-lg my-3 font-mono text-sm border">
          I = ±(3*IN + 2*EX + PE + EF + MO + AC + PR + RV + SI + AC + MC)
        </div>
        Genera valores entre 13 y 100, clasificando el impacto como Moderado (<25), Severo (25-50) o Crítico (>50).`
      }
    ]
  },
  "como-funcionan-llm": {
    slug: "como-funcionan-llm",
    title: "Guía didáctica: ¿Cómo funcionan los LLMs?",
    subtitle: "Fundamentos de la Inteligencia Artificial Generativa",
    portal: "ia",
    icon: "🧠",
    badge: "Procesamiento de Lenguaje",
    description: "Aprenda sobre atención, tokens y la arquitectura Transformer.",
    sections: [
      {
        title: "La Arquitectura Transformer",
        icon: "🏗️",
        content: `Los Grandes Modelos de Lenguaje (LLM) modernos se basan en la arquitectura **Transformer** propuesta en 2017. El componente revolucionario es el **Mecanismo de Auto-Atención (Self-Attention)**.
        A diferencia de los modelos antiguos que leen palabra por palabra, la atención permite al modelo mirar todo el contexto simultáneamente y comprender la relación entre palabras distantes.
        Por ejemplo, en la frase: <em>"El banco del río estaba lleno, así que no pude retirar dinero de mi banco"</em>, la atención ayuda al modelo a asignar diferentes representaciones a las dos apariciones de la palabra "banco" según sus palabras vecinas.`
      },
      {
        title: "Tokenización y Predicción del Siguiente Token",
        icon: "🔢",
        content: `Los LLMs no entienden texto directamente; lo dividen en fragmentos llamados **tokens** (que pueden ser palabras completas, sílabas o letras individuales) y los convierten en vectores numéricos de alta dimensión llamados **embeddings**.
        La tarea principal de un modelo autoregresivo es sorprendentemente simple: **predecir cuál es el token más probable que debe seguir a un texto dado**. Al repetir este proceso miles de veces, el modelo genera respuestas coherentes.`
      }
    ]
  },
  "parametros-decodificacion": {
    slug: "parametros-decodificacion",
    title: "Guía didáctica: Parámetros de Decodificación",
    subtitle: "Ajuste de creatividad y precisión en modelos de lenguaje",
    portal: "ia",
    icon: "⚙️",
    badge: "Ajuste de IA",
    description: "Descubra cómo controlar la probabilidad, aleatoriedad y diversidad en las respuestas.",
    sections: [
      {
        title: "Temperatura y Escalamiento de Probabilidades",
        icon: "🌡️",
        content: `Cuando el modelo procesa un texto, calcula un puntaje (logits) para todos los tokens de su vocabulario. Estos puntajes se normalizan en probabilidades usando la función <strong>Softmax</strong>.
        La <strong>Temperatura (T)</strong> altera esta distribución:
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><strong>T baja (<0.5):</strong> Hace que el token con mayor probabilidad sea aún más dominante. Produce respuestas muy precisas, repetitivas y factuales (ej. para código o matemáticas).</li>
          <li><strong>T alta (>1.0):</strong> Aplana la distribución de probabilidades, dando oportunidad a tokens menos probables. Genera respuestas creativas, diversas pero propensas a errores o "alucinaciones".</li>
        </ul>`
      },
      {
        title: "Muestreo Top-K y Top-P (Nucleus Sampling)",
        icon: "🎯",
        content: `Para evitar generar palabras incoherentes, limitamos el conjunto de palabras elegibles:
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Top-K:</strong> Filtra las K palabras más probables (por ejemplo, K=50) y redistribuye la probabilidad únicamente entre ellas.</li>
          <li><strong>Top-P (Nucleus):</strong> Selecciona el conjunto más pequeño de palabras cuya suma de probabilidades acumulada alcance el porcentaje P (por ejemplo, P=0.90 o 90%). El vocabulario considerado varía dinámicamente según la certeza del modelo.</li>
        </ul>
        Combinar una temperatura moderada (0.7) con un Top-P de 0.9 es el estándar para equilibrar coherencia y creatividad.`
      }
    ]
  },
  "filtrado-ia": {
    slug: "filtrado-ia",
    title: "Guía didáctica: Moderación y Seguridad de IA",
    subtitle: "Alineamiento y protección de sistemas conversacionales",
    portal: "ia",
    icon: "🛡️",
    badge: "Seguridad de IA",
    description: "Aprenda cómo se moderan las entradas y salidas de los modelos de lenguaje.",
    sections: [
      {
        title: "Técnicas de Alineamiento: RLHF",
        icon: "🤝",
        content: `Los modelos base entrenados con texto de internet a menudo generan contenido ofensivo o dañino. Para alinearlos con los valores humanos, se utiliza el <strong>Aprendizaje por Refuerzo a partir de Retroalimentación Humana (RLHF)</strong>:
        <ol class="list-decimal pl-5 mt-2 space-y-1">
          <li>Evaluadores humanos clasifican múltiples respuestas generadas por el modelo.</li>
          <li>Se entrena un modelo de recompensa para predecir las preferencias humanas.</li>
          <li>Se optimiza el LLM principal mediante aprendizaje por refuerzo para maximizar la recompensa.</li>
        </ol>`
      },
      {
        title: "Pipelines de Filtro y Moderación en Tiempo Real",
        icon: "🚨",
        content: `En producción, se implementan capas de seguridad antes y después del LLM:
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Clasificadores de Moderación:</strong> Modelos pequeños entrenados para detectar categorías específicas de daño (odio, violencia, autolesión, acoso).</li>
          <li><strong>Filtros de Inyección de Prompts:</strong> Detectan intentos del usuario de "engañar" al modelo para saltarse sus directrices de seguridad.</li>
        </ul>`
      }
    ]
  },
  "visor-difusion": {
    slug: "visor-difusion",
    title: "Guía didáctica: Modelos de Difusión",
    subtitle: "Cómo las redes neuronales crean imágenes a partir de texto",
    portal: "ia",
    icon: "🎨",
    badge: "Generación de Imágenes",
    description: "Entienda el proceso de eliminación de ruido y el espacio latente.",
    sections: [
      {
        title: "El Proceso de Difusión",
        icon: "🌀",
        content: `Los modelos de difusión como **Stable Diffusion** funcionan en base a dos procesos:
        <ol class="list-decimal pl-5 mt-2 space-y-1">
          <li><strong>Difusión directa (Forward):</strong> Añade ruido gaussiano de forma controlada a una imagen de entrenamiento hasta que se convierte en puro ruido.</li>
          <li><strong>Difusión inversa (Reverse/Denoising):</strong> Una red neuronal (U-Net) aprende a predecir exactamente cuánto ruido se añadió en cada paso para poder restarlo.</li>
        </ol>
        Al generar una imagen desde cero, el modelo parte de una matriz de ruido aleatorio puro y aplica el proceso de eliminación de ruido secuencialmente durante 20-50 pasos guiado por el texto.`
      },
      {
        title: "El Espacio Latente",
        icon: "🌌",
        content: `Para hacer viable el cálculo en computadoras domésticas, los modelos operan en un **Espacio Latente** comprimido (usualmente 8 veces más pequeño que los píxeles reales) gracias a un Autoencoder Variacional (VAE). La generación ocurre en este espacio matemático abstracto y luego el VAE la decodifica en una imagen de píxeles reales.`
      }
    ]
  },
  "papers-ia": {
    slug: "papers-ia",
    title: "Guía de Papers y Literatura de IA",
    subtitle: "Estado del arte y bases teóricas de la inteligencia artificial",
    portal: "ia",
    icon: "🔬",
    badge: "Investigación",
    description: "Referencias y análisis de los artículos de investigación que cambiaron el mundo.",
    sections: [
      {
        title: "Artículos Científicos Clave",
        icon: "📚",
        content: `El avance de la IA está liderado por publicaciones científicas abiertas:
        <ul class="list-disc pl-5 mt-2 space-y-2">
          <li><strong>"Attention Is All You Need" (Vaswani et al., 2017):</strong> El paper fundamental que introdujo el Transformer y jubiló a las redes recurrentes (RNN/LSTM).</li>
          <li><strong>"Improving Language Understanding by Generative Pre-Training" (Radford et al., OpenAI, 2018):</strong> Sentó las bases del modelo GPT y el pre-entrenamiento autoregresivo.</li>
          <li><strong>"Denoising Diffusion Probabilistic Models" (Ho et al., 2020):</strong> Abrió el camino moderno para la generación de imágenes hiperrealistas por difusión.</li>
        </ul>`
      }
    ]
  },
  "modelos-tendencia": {
    slug: "modelos-tendencia",
    title: "Manual de Modelos de Tendencia",
    subtitle: "Detección no paramétrica de cambios en variables ambientales",
    portal: "ia",
    icon: "📈",
    badge: "Análisis Temporal",
    description: "Guía matemática para pruebas de tendencia de Mann-Kendall.",
    sections: [
      {
        title: "Prueba de Tendencia de Mann-Kendall",
        icon: "🧮",
        content: `Es una prueba estadística no paramétrica ampliamente utilizada en hidrología y climatología para evaluar si una serie temporal tiene una tendencia monótona ascendente o descendente.
        Al ser no paramétrica, no requiere que los datos sigan una distribución normal y es resistente a datos atípicos:
        <div class="bg-gray-50 p-4 rounded-lg my-3 font-mono text-xs border">
          S = Σ_{i=1}^{n-1} Σ_{j=i+1}^n sign(x_j - x_i)
        </div>
        Donde <code>sign(θ)</code> es 1 si θ > 0, 0 si θ = 0, y -1 si θ < 0. Un valor de S positivo indica tendencia creciente; negativo, decreciente.`
      },
      {
        title: "Estimador de Pendiente de Sen",
        icon: "📏",
        content: `Complementa a Mann-Kendall calculando la magnitud de la tendencia. Calcula la mediana de las pendientes de todos los pares de puntos de datos:
        <div class="bg-gray-50 p-4 rounded-lg my-3 font-mono text-sm border">
          Q = median((x_j - x_i) / (j - i)) para todo j > i
        </div>
        Esto proporciona una estimación de cambio anual robusta que no se ve sesgada por valores extremos o periodos de sequía/inundación atípicos.`
      }
    ]
  }
};
