import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com").trim().replace(/\/+$/, "");

  const content = `# AquatechIA - Documentación Completa para Modelos de Lenguaje (LLMs)

> AquatechIA combina Inteligencia Artificial con Gestión Ambiental para ofrecer herramientas analíticas, cursos interactivos, visores de mapas y bibliotecas normativas.

## 1. Misión y Enfoque

AquatechIA desarrolla software y contenido técnico en la intersección de dos áreas fundamentales:
- **Inteligencia Artificial**: Aplicación de Large Language Models (LLMs), visión por computador, modelos de difusión y procesamiento de lenguaje natural en flujos de trabajo profesionales.
- **Gestión Ambiental**: Soluciones para monitoreo de agua (ICA), calidad de aire, cumplimiento normativo (ISO 14001, decretos ambientales colombianos e internacionales), y análisis GIS.

---

## 2. Estructura de Portales

### Portal de Inteligencia Artificial
- URL: ${baseUrl}/ia
- Secciones:
  - **Herramientas**: Calculadoras de parámetros de decodificación (Temperature, Top-P, Top-K), simuladores de filtrado de prompts, explorador de papers de IA y visualizadores de modelos.
  - **Blog de IA**: Artículos en profundidad sobre la construcción de ecosistemas de bots empresariales, integración de LLMs con WhatsApp, arquitectura Spartan y optimización de prompts.
  - **Cursos y Recursos**: Guías paso a paso para el desarrollo de aplicaciones basadas en IA.

### Portal Ambiental
- URL: ${baseUrl}/ambiental
- Secciones:
  - **Visor de Mapas Ambientales**: Herramienta GIS en tiempo real que integra alertas de incendios (FIRMS), eventos naturales (NASA EONET), terremotos (USGS) y biodiversidad (GBIF).
  - **Generador de Matrices de Impacto**: Constructor interactivo de matrices de aspectos e impactos ambientales bajo ISO 14001.
  - **Buscador de Normas Ambientales**: Compendio estructurado de normas, decretos y resoluciones ambientales.
  - **Índice de Calidad del Agua (ICA) y Calidad del Aire (ICAire)**: Calculadoras metodológicas estandarizadas.
  - **Blog Ambiental**: Publicaciones sobre tratamiento de aguas residuales, economía circular y gestión integral del recurso hídrico.

---

## 3. Páginas de Soporte e Información
- FAQ: ${baseUrl}/faq
- Soporte Técnico: ${baseUrl}/soporte
- Términos de Uso: ${baseUrl}/ia/terms y ${baseUrl}/ambiental/terms
- Políticas de Privacidad: ${baseUrl}/ia/privacy y ${baseUrl}/ambiental/privacy
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
