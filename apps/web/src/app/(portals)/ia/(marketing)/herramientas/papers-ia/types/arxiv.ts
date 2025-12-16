/**
 * ArXiv Paper Types
 */

export interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  published: string;
  updated: string;
  categories: string[];
  pdfUrl: string;
  arxivUrl: string;
  doi?: string;
}

export interface ArxivApiResponse {
  papers: ArxivPaper[];
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
}

export interface ArxivQueryParams {
  category?: string;
  search?: string;
  limit?: number;
  start?: number;
  sortBy?: 'submittedDate' | 'relevance';
}

/**
 * Blog category to ArXiv categories mapping
 */
export const BLOG_TO_ARXIV_CATEGORIES: Record<string, string[]> = {
  'fundamentos-inteligencia-artificial': ['cs.AI', 'cs.LG', 'cs.NE'],
  'modelos-lenguaje-asistentes-llm': ['cs.CL'], // Removed cs.AI to avoid generic AI papers
  'generadores-imagenes-contenido-creativo-ia': ['cs.CV', 'cs.GR', 'cs.MM'],
  'productividad-automatizacion-ia': ['cs.HC', 'cs.SE'], // Removed cs.AI for stricter productivity focus
  'etica-regulacion-futuro-ia': ['cs.CY'], // Removed cs.AI to focus purely on ethics/society
};

export const ARXIV_CATEGORY_NAMES: Record<string, string> = {
  'cs.AI': 'Inteligencia Artificial',
  'cs.LG': 'Machine Learning',
  'cs.CL': 'NLP / Lenguaje',
  'cs.CV': 'Visión por Computadora',
  'cs.NE': 'Redes Neuronales',
  'cs.HC': 'Interacción Humano-Computadora',
  'cs.CY': 'Computadoras y Sociedad',
  'cs.SE': 'Ingeniería de Software',
  'cs.GR': 'Gráficos',
  'cs.MM': 'Multimedia',
};

export const BLOG_CATEGORY_NAMES: Record<string, string> = {
  'fundamentos-inteligencia-artificial': 'Fundamentos de IA',
  'modelos-lenguaje-asistentes-llm': 'Modelos de Lenguaje (LLM)',
  'generadores-imagenes-contenido-creativo-ia': 'IA Generativa Creativa',
  'productividad-automatizacion-ia': 'Productividad con IA',
  'etica-regulacion-futuro-ia': 'Ética en IA',
};
