// Centralized data for Environmental Tools
// When you update images or data here, it will reflect on all pages

export interface AmbientalTool {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  tags: string[];
  href: string;
  status: "available" | "coming_soon" | "beta";
}

export const AMBIENTAL_TOOLS: AmbientalTool[] = [
  {
    id: "visor-mapas",
    slug: "visor-mapas-ambientales",
    name: "Visor de Mapas Ambientales",
    shortDescription: "Visualización interactiva de datos geoespaciales ambientales en tiempo real.",
    description: "Visualiza datos ambientales geoespaciales con capas interactivas para análisis territorial y monitoreo de proyectos.",
    image: "/images/portal-ambiental/herramientas/visor-mapas-ambientales-v2.png",
    tags: ["Mapas", "Visualización", "SIG"],
    href: "/ambiental/herramientas/visor-mapas-ambientales",
    status: "available",
  },
  {
    id: "generador-matrices",
    slug: "generador-matrices",
    name: "Generador de Matrices de EIA",
    shortDescription: "Herramienta para crear y gestionar matrices de Evaluación de Impacto Ambiental.",
    description: "Crea matrices de evaluación de impacto ambiental (Leopold, Conesa, Battelle) automáticamente según tu proyecto.",
    image: "/images/portal-ambiental/herramientas/generador-matrices-eia-v2.png",
    tags: ["EIA", "Matrices", "Impacto"],
    href: "/ambiental/herramientas/generador-matrices",
    status: "available",
  },
  {
    id: "normas-ambientales",
    slug: "normas-ambientales",
    name: "Normas Ambientales por País",
    shortDescription: "Base de datos completa de regulaciones y normativas ambientales vigentes.",
    description: "Accede a la base de datos actualizada de regulaciones ambientales por país y sector, con análisis comparativo.",
    image: "/images/portal-ambiental/herramientas/normas-ambientales-v2.png",
    tags: ["Regulaciones", "Normas", "Cumplimiento"],
    href: "/ambiental/herramientas/normas-ambientales",
    status: "available",
  },
  {
    id: "analisis-correlaciones",
    slug: "analisis-correlaciones",
    name: "Análisis de Correlaciones Ambientales",
    shortDescription: "Análisis estadístico de correlaciones entre variables ambientales.",
    description: "Visualiza y analiza correlaciones entre variables ambientales usando matrices de calor interactivas y estadística avanzada.",
    image: "/images/portal-ambiental/herramientas/analisis-correlaciones-v2.png",
    tags: ["Análisis", "Correlación", "Datos"],
    href: "/ambiental/herramientas/analisis-correlaciones",
    status: "available",
  },
  {
    id: "indice-calidad-agua",
    slug: "indice-calidad-agua",
    name: "Calculadora de Índices de Calidad de Agua",
    shortDescription: "Calcule índices de calidad de agua potable (IRCA, WQI, DWQI).",
    description: "Calcule y compare índices de calidad de agua potable (IRCA, WQI, DWQI) a partir de datos de laboratorio.",
    image: "/images/portal-ambiental/herramientas/indice-calidad-agua-v2.png",
    tags: ["Agua Potable", "Calidad", "Índices"],
    href: "/ambiental/herramientas/indice-calidad-agua",
    status: "available",
  },
  {
    id: "indice-calidad-aire",
    slug: "indice-calidad-aire",
    name: "Calculadora de Calidad del Aire",
    shortDescription: "Calcula índices de calidad del aire internacionales (AQI, ICA, IBOCA).",
    description: "Calcula índices de calidad del aire internacionales (AQI, ICA, IBOCA, EAQI, OMS) a partir de concentraciones de contaminantes.",
    image: "/images/portal-ambiental/herramientas/indice-calidad-aire-v2.png",
    tags: ["Aire", "AQI", "Índices"],
    href: "/ambiental/herramientas/indice-calidad-aire",
    status: "available",
  },
];

// Helper to get featured tools for landing page (first 3)
export function getFeaturedAmbientalTools(count: number = 3): AmbientalTool[] {
  return AMBIENTAL_TOOLS.slice(0, count);
}

// Helper to get tool by slug
export function getAmbientalToolBySlug(slug: string): AmbientalTool | undefined {
  return AMBIENTAL_TOOLS.find((tool) => tool.slug === slug);
}
