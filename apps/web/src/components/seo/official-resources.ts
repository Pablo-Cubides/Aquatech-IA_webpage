import type { AuthoritativeSource } from "./AuthoritativeReferences";

/**
 * Listas explícitas de recursos oficiales para las portadas y los índices de blog (VIS-005).
 *
 * Regla: solo URL que abren y cuyo contenido corresponde a la descripción. Las descripciones
 * dicen qué ES el organismo o el recurso; no prometen contenido que la página no muestre.
 * Verificadas con curl y navegador el 2026-11-17. Volver a abrirlas antes de ampliar la lista.
 *
 * Los artículos NO usan estas listas: muestran solo sus `references` reales.
 */
export const OFFICIAL_RESOURCES_TITLE = "Recursos oficiales para profundizar";
export const OFFICIAL_RESOURCES_SUBTITLE =
  "Organismos y publicaciones de referencia sobre el tema de esta sección.";

export const IA_OFFICIAL_RESOURCES: AuthoritativeSource[] = [
  {
    title: "Attention Is All You Need (Vaswani et al., 2017)",
    url: "https://arxiv.org/abs/1706.03762",
    source: "arXiv",
    description: "Artículo que introdujo la arquitectura Transformer.",
  },
  {
    title: "arXiv: Inteligencia Artificial (cs.AI)",
    url: "https://arxiv.org/list/cs.AI/recent",
    source: "arXiv",
    description: "Listado de preprints recientes; los preprints pueden no haber pasado revisión por pares.",
  },
  {
    title: "AI Risk Management Framework",
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
    source: "NIST",
    description: "Marco del NIST para gestionar riesgos de la inteligencia artificial.",
  },
  {
    title: "Association for the Advancement of Artificial Intelligence (AAAI)",
    url: "https://aaai.org/about-aaai/",
    source: "AAAI",
    description: "Sociedad científica de inteligencia artificial.",
  },
  {
    title: "Stanford Center for Research on Foundation Models (CRFM)",
    url: "https://crfm.stanford.edu/",
    source: "Stanford University",
    description: "Centro de investigación sobre modelos fundacionales.",
  },
];

export const AMBIENTAL_OFFICIAL_RESOURCES: AuthoritativeSource[] = [
  {
    title: "Ministerio de Ambiente y Desarrollo Sostenible de Colombia",
    url: "https://www.minambiente.gov.co/",
    source: "MinAmbiente",
    description: "Autoridad ambiental nacional de Colombia.",
  },
  {
    title: "Instituto de Hidrología, Meteorología y Estudios Ambientales (IDEAM)",
    url: "https://www.ideam.gov.co/",
    source: "IDEAM",
    description: "Instituto de hidrología, meteorología y estudios ambientales de Colombia.",
  },
  {
    title: "Programa de las Naciones Unidas para el Medio Ambiente (PNUMA)",
    url: "https://www.unep.org/es",
    source: "PNUMA / UNEP",
    description: "Programa de la ONU para el medio ambiente.",
  },
  {
    title: "USGS Water Resources Mission Area",
    url: "https://www.usgs.gov/mission-areas/water-resources",
    source: "USGS",
    description: "Área de recursos hídricos del Servicio Geológico de Estados Unidos.",
  },
];
