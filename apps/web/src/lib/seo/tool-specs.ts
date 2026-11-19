/**
 * Ficha tecnica de cada herramienta para llms-full.txt: que calcula o muestra, que norma o metodologia implementa y que
 * datos necesita. Es descripcion factual (no marketing) y cada dato proviene de algo verificable en el repositorio:
 * el registro de herramientas, su guia (guides-data), el README de la herramienta y su codigo/rutas API.
 * Si una herramienta cambia de metodologia o de fuente de datos, esta ficha debe cambiar con ella.
 */

export type ToolSpec = {
  /** Que calcula, muestra o permite hacer, exactamente. */
  does: string;
  /** Norma, metodologia o base teorica que implementa. */
  method: string;
  /** Datos que necesita del usuario (o de que fuente los toma). */
  inputs: string;
  /** Que entrega. */
  outputs: string;
};

export const TOOL_SPECS: Record<string, ToolSpec> = {
  "indice-calidad-agua": {
    does: "Calcula tres índices de calidad del agua potable: IRCA (riesgo, de 0 % a 100 %), WQI de la NSF (de 0 a 100, mayor es mejor) y DWQI (de 0 a 100 o más, menor es mejor).",
    method:
      "IRCA según la Resolución 2115 de 2007 de Colombia: 22 características con puntajes de riesgo que suman 100; %IRCA = Σ puntajes que no cumplen / Σ puntajes analizados × 100. WQI: índice paramétrico de la National Sanitation Foundation (EE. UU.) con 9 parámetros, curvas de subíndice (Qi) y pesos (Wi). DWQI: método WA-WQI (media aritmética ponderada) con desviación respecto a la norma de la OMS.",
    inputs:
      "Resultados de laboratorio por parámetro: ingreso manual o carga de un CSV con las columnas fecha, ubicacion, pais, parametro, valor y unidad (por ejemplo pH, turbiedad, color aparente, coliformes totales, E. coli, cloro residual libre). Un parámetro no analizado no entra en el cálculo del IRCA.",
    outputs: "Valor del índice, categoría y nivel de riesgo, parámetros faltantes, memoria de cálculo y exportación a CSV.",
  },
  "indice-calidad-aire": {
    does: "Calcula índices de calidad del aire a partir de concentraciones de PM2.5, PM10, O3, NO2, SO2 y CO: US AQI (0-500), ICA Colombia (0-500), IBOCA de Bogotá (0-500), EAQI de la Unión Europea (1-6) e Índice OMS (porcentaje sobre la guía).",
    method:
      "Interpolación lineal segmentada por puntos de corte (breakpoints): I = ((I_hi − I_lo) / (BP_hi − BP_lo)) × (C − BP_lo) + I_lo. El índice reportado es el máximo entre los subíndices de cada contaminante. Perfiles: EPA 454/B-12-001 (US AQI), Resolución 2254 de 2017 (ICA Colombia), Resolución 2840 de 2023 (IBOCA), índice de la Agencia Europea de Medio Ambiente (EAQI) y guías de calidad del aire de la OMS 2021.",
    inputs:
      "Concentraciones medidas de los contaminantes (µg/m³; CO en mg/m³) por formulario manual o archivo CSV; también permite consultar estaciones de la red OpenAQ. El periodo de promedio (horario, 8 h o 24 h) depende de la norma elegida.",
    outputs: "Índice y categoría de salud, subíndice por contaminante, contaminante crítico y breakpoints utilizados.",
  },
  "generador-matrices": {
    does: "Guía la construcción de matrices de Evaluación de Impacto Ambiental (EIA) y calcula la valoración de cada impacto con las metodologías de Leopold, Conesa y Battelle-Columbus.",
    method:
      "Matriz de Leopold (USGS, 1971): acciones del proyecto × factores ambientales, con magnitud e importancia de 1 a 10 y signo. Método de Conesa Fernández-Vítora: importancia del impacto I = ±(3·IN + 2·EX + PE + EF + MO + AC + PR + RV + SI + AC + MC), con valores entre 13 y 100 (Moderado < 25, Severo 25-50, Crítico > 50). Sistema Battelle-Columbus: parámetros ambientales con unidades de importancia y calidad ambiental, comparando escenarios con y sin proyecto.",
    inputs: "Tipo de proyecto, acciones impactantes, factores ambientales afectados y la valoración de cada interacción (magnitud, importancia o los atributos de Conesa).",
    outputs: "Matriz valorada con resultados automáticos por impacto y exportación en PDF.",
  },
  "normas-ambientales": {
    does: "Permite consultar y comparar límites máximos permisibles y normas ambientales por dominio (agua, calidad del aire, vertimientos y residuos sólidos), país y sector.",
    method:
      "No calcula: lee archivos JSON estructurados con la legislación de cada país (parámetro, límite, unidades y notas oficiales) y enlaza a la publicación en el diario oficial. Normas colombianas citadas en el compendio: Resolución 2115 de 2007 (agua potable), Resolución 631 (vertimientos), Resolución 2254 (aire) y Decreto 1077 (residuos sólidos).",
    inputs: "Selección de dominio ambiental, país y sector (y búsqueda opcional por norma o parámetro). Hay datos de Colombia, México, Perú, Chile, Argentina, Brasil, Estados Unidos, Unión Europea, China y El Salvador, según el dominio.",
    outputs: "Tabla con parámetro, límite máximo permisible, unidad, notas y enlace a la norma oficial.",
  },
  "visor-mapas-ambientales": {
    does: "Visualiza datos ambientales sobre mapas interactivos con capas superponibles: focos de incendio (NASA FIRMS), eventos naturales (NASA EONET), sismos (USGS), biodiversidad (GBIF), estaciones de calidad de agua (Water Quality Portal de EE. UU.) y conjuntos de datos propios.",
    method: "Representación geoespacial con MapLibre GL JS; los datos se consultan en tiempo real a las API públicas de cada fuente. No aplica una norma ni calcula un índice.",
    inputs: "No requiere datos para explorar. Para capas propias: archivos GeoJSON o CSV con coordenadas.",
    outputs: "Mapa interactivo con leyenda, búsqueda por ubicación, especie o parámetro, y filtros por tipo de estación y categoría.",
  },
  "analisis-correlaciones": {
    does: "Calcula coeficientes de correlación entre variables ambientales y los muestra como matriz de calor, diagramas de dispersión y líneas de tendencia con R².",
    method: "Coeficientes de Pearson (relación lineal entre variables continuas), Spearman (relación monótona, basada en rangos) y Kendall (concordancia no paramétrica, robusta con muestras pequeñas).",
    inputs: "Archivo CSV o XLSX propio, o indicadores descargados de la API de datos del Banco Mundial y de WHO GHO.",
    outputs: "Matriz de correlaciones, gráficos, y exportación a CSV, XLSX y PNG.",
  },
  "como-funcionan-llm": {
    does: "Explica paso a paso cómo un modelo de lenguaje convierte texto en texto, en siete etapas interactivas: entrada, tokenización, embeddings, atención, probabilidades del siguiente token, generación autorregresiva y bibliografía. Es una herramienta educativa; no calcula un índice.",
    method: "Arquitectura Transformer con mecanismo de auto-atención (Vaswani et al., 2017) y predicción autorregresiva del siguiente token.",
    inputs: "Un texto de ejemplo, escrito por la persona o elegido entre los ejemplos disponibles.",
    outputs: "Visualización de los tokens, los vectores, los pesos de atención y la distribución de probabilidades.",
  },
  "parametros-decodificacion": {
    does: "Permite experimentar con los parámetros de decodificación de un modelo de lenguaje (Temperature, Top-k, Top-p y penalización por repetición) y ver cómo cambian la generación de texto.",
    method: "Escalamiento de logits con Softmax y temperatura, muestreo Top-K y muestreo de núcleo Top-P (nucleus sampling).",
    inputs: "Los valores de los parámetros, ajustados con controles deslizantes.",
    outputs: "Gráfico radar de la configuración, patrones de generación detectados y exportación a PNG y JSON.",
  },
  "filtrado-ia": {
    does: "Muestra cómo los modelos de IA clasifican y moderan entradas y respuestas, con casos de prueba preconfigurados y niveles de riesgo. Es una herramienta educativa.",
    method: "Aprendizaje por refuerzo a partir de retroalimentación humana (RLHF), clasificadores de moderación por categoría de daño y filtros contra inyección de prompts.",
    inputs: "Selección de un caso de prueba entre los disponibles.",
    outputs: "Clasificación y nivel de riesgo del caso, explicación de la técnica de moderación y exportación a PDF o imagen.",
  },
  "visor-difusion": {
    does: "Visualiza paso a paso cómo un modelo de difusión genera una imagen a partir de ruido puro, y exporta la secuencia como GIF animado. Es una herramienta educativa.",
    method: "Modelos de difusión: difusión directa (añade ruido gaussiano) y difusión inversa (una red U-Net predice y resta el ruido), operando en un espacio latente comprimido por un autoencoder variacional.",
    inputs: "Selección de uno de los casos preconfigurados.",
    outputs: "Secuencia de imágenes con el ruido restante en cada paso, panel explicativo y GIF descargable.",
  },
  "modelos-tendencia": {
    does: "Lista los modelos de IA más populares del Hugging Face Hub, con filtros por periodo (última semana o último mes) y por categoría, y muestra sus likes, descargas y puntaje de tendencia.",
    method: "No calcula: consulta la API del Hugging Face Hub y guarda el resultado en caché durante una hora.",
    inputs: "Periodo y categoría (opcionales).",
    outputs: "Tarjetas de modelos con estadísticas y enlace al modelo en Hugging Face.",
  },
  "papers-ia": {
    does: "Busca y lista los artículos científicos más recientes sobre inteligencia artificial publicados en arXiv, con enlace al resumen y al PDF de cada uno.",
    method: "Consulta la API pública de arXiv; los resultados son preprints, que pueden no haber pasado revisión por pares.",
    inputs: "Texto de búsqueda por título, autor o tema, y filtros opcionales de categoría y orden (fecha o relevancia).",
    outputs: "Lista paginada de artículos con título, autores, resumen y enlaces.",
  },
};

/**
 * La guia registrada con el mismo slug describe otra cosa (prueba de Mann-Kendall) y no la herramienta de Hugging Face:
 * no se usa como metodologia en llms-full.txt. Pendiente de corregir en guides-data (contenido, cargo CONT).
 */
export const GUIDE_MISMATCH_SLUGS: ReadonlySet<string> = new Set(["modelos-tendencia"]);
