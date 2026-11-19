/**
 * Resolución 2115 de 2007 (Min. Protección Social y Min. Ambiente, Vivienda y
 * Desarrollo Territorial) — características, instrumentos básicos y
 * frecuencias del sistema de control y vigilancia de la calidad del agua para
 * consumo humano. Diario Oficial No. 46.679 de 4 de julio de 2007; rige desde
 * su publicación (art. 37).
 *
 * Texto consultado: copia del Gestor Normativo de la CRA (reproduce el Diario
 * Oficial) cotejada para el parágrafo del art. 13 con el PDF de Minsalud.
 * Verificado el 2026-11-17. PENDIENTE: cotejo contra el PDF del Diario Oficial
 * mismo (no accesible desde el entorno de trabajo).
 */
import type { NormCitation } from "./types";

const FUENTE_CRA = "https://normas.cra.gov.co/Gestor/Docs/resolucion_minproteccion_2115_2007.htm";
const FUENTE_MINSALUD =
  "https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/Resoluci%C3%B3n_2115_de_2007.pdf";

function cita(articulo: string, url = FUENTE_CRA): NormCitation {
  return {
    norma: "Resolución 2115 de 2007",
    articulo,
    vigenteDesde: "2007-07-04",
    publicacion: "Diario Oficial No. 46.679 de 4 de julio de 2007",
    url,
    verificado: "2026-11-17",
  };
}

export const RES_2115_FECHA_PUBLICACION = "2007-07-04";

export interface CaracteristicaIRCA {
  id: string;
  /** Nombre canónico (el del Cuadro 6). */
  nombre: string;
  unidad: string;
  /** Puntaje de riesgo, art. 13, Cuadro 6. */
  puntaje: number;
  /** Valor máximo aceptable (arts. 2-11). */
  max?: number;
  /** Valor mínimo aceptable. */
  min?: number;
  /** Nombres alternativos aceptados al leer encabezados de CSV (sin norma detrás: criterio de lectura). */
  sinonimos: string[];
  citaPuntaje: NormCitation;
  citaLimite: NormCitation;
}

const C6 = cita("art. 13, Cuadro 6 (puntaje de riesgo)");

/** Las 22 características del Cuadro 6. La suma de puntajes es 100. */
export const CARACTERISTICAS_IRCA: readonly CaracteristicaIRCA[] = [
  { id: "color", nombre: "Color aparente", unidad: "UPC", puntaje: 6, max: 15, sinonimos: ["Color", "Color aparente (UPC)"], citaPuntaje: C6, citaLimite: cita("art. 2, Cuadro 1 (características físicas)") },
  { id: "turbiedad", nombre: "Turbiedad", unidad: "UNT", puntaje: 15, max: 2, sinonimos: ["Turbidez", "Turbiedad (UNT)", "Turbidez (NTU)"], citaPuntaje: C6, citaLimite: cita("art. 2, Cuadro 1 (características físicas)") },
  { id: "ph", nombre: "pH", unidad: "unidades", puntaje: 1.5, min: 6.5, max: 9.0, sinonimos: ["Potencial de hidrógeno", "Potencial de hidrogeno"], citaPuntaje: C6, citaLimite: cita("art. 4 (potencial de hidrógeno)") },
  { id: "cloro", nombre: "Cloro residual libre", unidad: "mg/L", puntaje: 15, min: 0.3, max: 2.0, sinonimos: ["Cloro residual", "Cloro libre residual", "Cloro libre"], citaPuntaje: C6, citaLimite: cita("art. 9, num. 2 (0,3 a 2,0 mg/L en cualquier punto de la red)") },
  { id: "alcalinidad", nombre: "Alcalinidad total", unidad: "mg/L CaCO₃", puntaje: 1, max: 200, sinonimos: ["Alcalinidad"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "calcio", nombre: "Calcio", unidad: "mg/L", puntaje: 1, max: 60, sinonimos: ["Calcio (Ca)", "Ca"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "fosfatos", nombre: "Fosfatos", unidad: "mg/L", puntaje: 1, max: 0.5, sinonimos: ["Fosfato", "PO4", "Fosfatos (PO4)"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "manganeso", nombre: "Manganeso", unidad: "mg/L", puntaje: 1, max: 0.1, sinonimos: ["Manganeso (Mn)", "Mn"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "molibdeno", nombre: "Molibdeno", unidad: "mg/L", puntaje: 1, max: 0.07, sinonimos: ["Molibdeno (Mo)", "Mo"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "magnesio", nombre: "Magnesio", unidad: "mg/L", puntaje: 1, max: 36, sinonimos: ["Magnesio (Mg)", "Mg"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "zinc", nombre: "Zinc", unidad: "mg/L", puntaje: 1, max: 3, sinonimos: ["Zinc (Zn)", "Zn", "Cinc"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "dureza", nombre: "Dureza total", unidad: "mg/L CaCO₃", puntaje: 1, max: 300, sinonimos: ["Dureza"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "sulfatos", nombre: "Sulfatos", unidad: "mg/L", puntaje: 1, max: 250, sinonimos: ["Sulfato", "SO4", "Sulfatos (SO4)"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "hierro", nombre: "Hierro total", unidad: "mg/L", puntaje: 1.5, max: 0.3, sinonimos: ["Hierro", "Fe", "Hierro (Fe)", "Hierro total (Fe)"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "cloruros", nombre: "Cloruros", unidad: "mg/L", puntaje: 1, max: 250, sinonimos: ["Cloruro", "Cl-", "Cloruros (Cl-)"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "nitratos", nombre: "Nitratos", unidad: "mg/L NO₃⁻", puntaje: 1, max: 10, sinonimos: ["Nitrato", "NO3", "Nitratos (NO3)"], citaPuntaje: C6, citaLimite: cita("art. 6, Cuadro 3") },
  { id: "nitritos", nombre: "Nitritos", unidad: "mg/L NO₂⁻", puntaje: 3, max: 0.1, sinonimos: ["Nitrito", "NO2", "Nitritos (NO2)"], citaPuntaje: C6, citaLimite: cita("art. 6, Cuadro 3") },
  { id: "aluminio", nombre: "Aluminio", unidad: "mg/L", puntaje: 3, max: 0.2, sinonimos: ["Aluminio (Al)", "Aluminio (Al3+)", "Al3+", "Al"], citaPuntaje: C6, citaLimite: cita("art. 7, Cuadro 4") },
  { id: "fluoruros", nombre: "Fluoruros", unidad: "mg/L", puntaje: 1, max: 1.0, sinonimos: ["Fluoruro", "F-", "Fluoruros (F-)", "Fluor"], citaPuntaje: C6, citaLimite: cita("art. 6, Cuadro 3") },
  { id: "cot", nombre: "COT", unidad: "mg/L", puntaje: 3, max: 5, sinonimos: ["Carbono orgánico total", "Carbono organico total", "TOC"], citaPuntaje: C6, citaLimite: cita("art. 6, Cuadro 3") },
  { id: "coliformes", nombre: "Coliformes totales", unidad: "UFC/100mL", puntaje: 15, max: 0, sinonimos: ["Coliformes", "Coliformes totales (UFC/100mL)"], citaPuntaje: C6, citaLimite: cita("art. 11, Cuadro 5 (filtración por membrana: 0 UFC/100 cm³)") },
  { id: "ecoli", nombre: "Escherichia coli", unidad: "UFC/100mL", puntaje: 25, max: 0, sinonimos: ["E. coli", "E.coli", "Ecoli", "E coli", "Escherichia coli (UFC/100mL)", "E. coli (UFC/100mL)"], citaPuntaje: C6, citaLimite: cita("art. 11, Cuadro 5 y parágrafo 2 (ninguna muestra debe contener E. coli en 100 cm³)") },
];

export const IRCA_PUNTAJE_TOTAL = 100;

/** Art. 15, Cuadro 7: clasificación del nivel de riesgo. Rangos a un decimal. */
export const IRCA_NIVELES_RIESGO = [
  { min: 0, max: 5, nivel: "Sin riesgo", etiquetaNorma: "SIN RIESGO", descripcion: "Agua apta para consumo humano", cita: cita("art. 15, Cuadro 7") },
  { min: 5.1, max: 14, nivel: "Riesgo bajo", etiquetaNorma: "BAJO", descripcion: "Agua no apta para consumo humano, susceptible de mejoramiento", cita: cita("art. 15, Cuadro 7") },
  { min: 14.1, max: 35, nivel: "Riesgo medio", etiquetaNorma: "MEDIO", descripcion: "Agua no apta para consumo humano, gestión directa de la persona prestadora", cita: cita("art. 15, Cuadro 7") },
  { min: 35.1, max: 80, nivel: "Riesgo alto", etiquetaNorma: "ALTO", descripcion: "Agua no apta para consumo humano, gestión directa de la persona prestadora y de alcaldes y gobernadores", cita: cita("art. 15, Cuadro 7") },
  { min: 80.1, max: 100, nivel: "Inviable sanitariamente", etiquetaNorma: "INVIABLE SANITARIAMENTE", descripcion: "Agua no apta para consumo humano", cita: cita("art. 15, Cuadro 7") },
] as const;

/**
 * Art. 5, Cuadro 2: sustancias con reconocido efecto adverso en la salud.
 * Un resultado sobre su valor máximo aceptable lleva el IRCA a 100 (art. 13, parágrafo).
 */
export const SUSTANCIAS_ART5: readonly { id: string; nombre: string; unidad: "mg/L"; max: number; sinonimos: string[] }[] = [
  { id: "antimonio", nombre: "Antimonio", unidad: "mg/L", max: 0.02, sinonimos: ["Sb"] },
  { id: "arsenico", nombre: "Arsénico", unidad: "mg/L", max: 0.01, sinonimos: ["Arsenico", "As"] },
  { id: "bario", nombre: "Bario", unidad: "mg/L", max: 0.7, sinonimos: ["Ba"] },
  { id: "cadmio", nombre: "Cadmio", unidad: "mg/L", max: 0.003, sinonimos: ["Cd"] },
  { id: "cianuro", nombre: "Cianuro libre y disociable", unidad: "mg/L", max: 0.05, sinonimos: ["Cianuro", "CN-"] },
  { id: "cobre", nombre: "Cobre", unidad: "mg/L", max: 1.0, sinonimos: ["Cu"] },
  { id: "cromo", nombre: "Cromo total", unidad: "mg/L", max: 0.05, sinonimos: ["Cromo", "Cr"] },
  { id: "mercurio", nombre: "Mercurio", unidad: "mg/L", max: 0.001, sinonimos: ["Hg"] },
  { id: "niquel", nombre: "Níquel", unidad: "mg/L", max: 0.02, sinonimos: ["Niquel", "Ni"] },
  { id: "plomo", nombre: "Plomo", unidad: "mg/L", max: 0.01, sinonimos: ["Pb"] },
  { id: "selenio", nombre: "Selenio", unidad: "mg/L", max: 0.01, sinonimos: ["Se"] },
  { id: "thm", nombre: "Trihalometanos totales", unidad: "mg/L", max: 0.2, sinonimos: ["Trihalometanos", "THM", "THMs"] },
  { id: "hap", nombre: "Hidrocarburos aromáticos policíclicos", unidad: "mg/L", max: 0.01, sinonimos: ["HAP", "HAPs"] },
];
export const CITA_SUSTANCIAS_ART5 = cita("art. 5, Cuadro 2");

/**
 * Art. 8, parágrafo 2: la suma total de plaguicidas no puede superar 0,1 mg/L.
 * (Los límites individuales del art. 8 dependen de DL50 y de listas del Ministerio:
 * no se codifican aquí.)
 */
export const PLAGUICIDAS_SUMA_MAX_MG_L = 0.1;
export const CITA_PLAGUICIDAS = cita("art. 8, parágrafo 2");

/** Art. 11, parágrafo 3: valor aceptable de Giardia y Cryptosporidium = 0. Art. 13 parágrafo: presencia → IRCA 100. */
export const CITA_GIARDIA_CRYPTO = cita("art. 11, parágrafo 3; art. 13, parágrafo");

/** Texto literal del parágrafo del art. 13 (cotejado en dos copias). */
export const ART13_PARAGRAFO_TEXTO =
  "Si los resultados de los elementos, compuestos químicos y mezclas de compuestos químicos, contemplados en los artículos 5o y 8o de la presente resolución, exceden los valores máximos aceptables, al valor del IRCA se le asignará el puntaje máximo de 100 puntos independientemente de los otros resultados. Igualmente, se le asignará el valor de 100 puntos si hay presencia de Giardia y Cryptosporidium, teniendo en cuenta los plazos estipulados en el artículo 34 de esta resolución.";
export const CITA_ART13_PARAGRAFO = cita("art. 13, parágrafo", FUENTE_MINSALUD);

/**
 * Art. 34, Cuadro 16: PLAZOS (calendario de entrada en aplicación) para vigilar y
 * controlar Giardia y Cryptosporidium según población atendida por municipio.
 * Los plazos corren desde la fecha de publicación (4-jul-2007). Es un calendario
 * de implementación, NO un umbral permanente de exención.
 * (La copia consultada trae el rango "1000.001 – 500.000", errata evidente de
 * "100.001 – 500.000".)
 */
export const CUADRO_16_GIARDIA_CRYPTO = [
  { poblacionDesde: 0, poblacionHasta: 10_000, anios: 8 },
  { poblacionDesde: 10_001, poblacionHasta: 20_000, anios: 6 },
  { poblacionDesde: 20_001, poblacionHasta: 100_000, anios: 5 },
  { poblacionDesde: 100_001, poblacionHasta: 500_000, anios: 4 },
  { poblacionDesde: 500_001, poblacionHasta: null, anios: 3 },
] as const;
export const CITA_CUADRO_16 = cita("art. 34, Cuadro 16");

/** Fecha en que venció el plazo de cada tramo del Cuadro 16 (publicación + años). */
export function fechaVencimientoCuadro16(anios: number): string {
  const [y, m, d] = RES_2115_FECHA_PUBLICACION.split("-").map(Number);
  return `${y + anios}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/**
 * Art. 14: fórmulas. IRCA mensual = Σ IRCA por muestra del mes / número total de muestras del mes.
 */
export const CITA_ART14_FORMULAS = cita("art. 14");

/**
 * Resolución 622 de 2020 (Minsalud), Diario Oficial No. 51.292 de 21-abr-2020, Anexo
 * técnico num. 3.2.1 (Cuadro 1): en zona rural, por red de distribución, el análisis mínimo
 * de la autoridad sanitaria cubre turbiedad, color aparente, pH, cloro residual libre
 * (o residual del desinfectante) y E. coli, con los valores máximos de la Res. 2115.
 * Fuente: https://normas.cra.gov.co/gestor/docs/resolucion_minsaludps_0622_2020.htm
 */
export const RURAL_622_CARACTERISTICAS_MINIMAS = ["turbiedad", "color", "ph", "cloro", "ecoli"] as const;
export const CITA_RES_622_2020: NormCitation = {
  norma: "Resolución 622 de 2020 (Ministerio de Salud y Protección Social)",
  articulo: "Anexo técnico, num. 3.2.1, Cuadro 1; num. 3.5.1",
  vigenteDesde: "2020-04-21",
  publicacion: "Diario Oficial No. 51.292 de 21 de abril de 2020",
  url: "https://normas.cra.gov.co/gestor/docs/resolucion_minsaludps_0622_2020.htm",
  verificado: "2026-11-17",
};
