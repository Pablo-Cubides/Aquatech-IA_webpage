import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com").trim().replace(/\/+$/, "");

  const content = `# AquatechIA

> AquatechIA es una plataforma integral de Inteligencia Artificial aplicada a la gestión ambiental sostenible, recursos hídricos, analítica de datos ambientales y educación tecnológica.

## Portales Principales

- [Portal IA](${baseUrl}/ia): Herramientas, cursos, artículos y modelos de inteligencia artificial aplicados.
- [Portal Ambiental](${baseUrl}/ambiental): Monitoreo de calidad de agua y aire, normatividad ambiental colombiana e internacional, y herramientas de análisis.

## Herramientas Destacadas

- [Visor de Mapas Ambientales](${baseUrl}/ambiental/herramientas/visor-mapas-ambientales): Plataforma GIS interactiva para visualización de capas ambientales y datos satelitales.
- [Generador de Matrices Ambiental](${baseUrl}/ambiental/herramientas/generador-matrices): Evaluación de aspectos e impactos ambientales según ISO 14001.
- [Consulta de Normas Ambientales](${baseUrl}/ambiental/herramientas/normas-ambientales): Buscador y compendio de legislación ambiental.
- [Índice de Calidad del Agua](${baseUrl}/ambiental/herramientas/indice-calidad-agua): Calculadora interactiva de calidad hídrica.
- [Índice de Calidad del Aire](${baseUrl}/ambiental/herramientas/indice-calidad-aire): Estimación y parámetros de calidad del aire.
- [Filtrado de Respuestas IA](${baseUrl}/ia/herramientas/filtrado-ia): Análisis y optimización de prompts y salidas de modelos de lenguaje.

## Recursos Educativos y Documentación

- [Blog de IA](${baseUrl}/ia/blog): Artículos sobre LLMs, arquitectura de agentes y bots empresariales.
- [Blog Ambiental](${baseUrl}/ambiental/blog): Publicaciones sobre tratamiento de aguas, economía circular y gestión de recursos.
- [Preguntas Frecuentes](${baseUrl}/faq): Respuestas detalladas sobre el uso de la plataforma.
- [Soporte Técnico](${baseUrl}/soporte): Información de contacto y centro de ayuda.
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
