/**
 * Generadores de /llms.txt (indice breve) y /llms-full.txt (contenido integro) para asistentes de IA.
 *
 * llms-full.txt lleva el cuerpo completo de cada articulo y la ficha tecnica de cada herramienta, en Markdown limpio, con
 * titulo, URL canonica absoluta, fechas, autor y portal para poder citar con atribucion correcta. Los route handlers lo
 * generan de forma estatica con revalidacion (no en cada peticion).
 */

import { type BlogArticle } from "@/lib/blog-articles";
import { getArticlesForIndexing } from "@/lib/articles-for-indexing";
import { guidesData } from "@/lib/guides-data";
import { getToolsByPortal } from "@/lib/services/tools-registry";
import { GUIDE_MISMATCH_SLUGS, TOOL_SPECS } from "@/lib/seo/tool-specs";
import { TOOL_PUBLISHED } from "@/lib/seo/tool-dates";
import { toPlainText } from "@/lib/text/plain-text";
import type { Tool } from "@/lib/types";

type Portal = "ia" | "ambiental";

const PORTALS: Portal[] = ["ia", "ambiental"];
const PORTAL_NAME: Record<Portal, string> = { ia: "Portal IA", ambiental: "Portal Ambiental" };

const oneLine = (text: string | undefined, max = 400) => toPlainText(text).slice(0, max);

/** Desplaza los encabezados Markdown del contenido `by` niveles hacia abajo (maximo h6) para que cuelguen del titulo del articulo. */
function shiftHeadings(markdown: string, by: number): string {
  return markdown.replace(/^(#{1,6})([ \t]+)/gm, (_, hashes: string, space: string) => `${"#".repeat(Math.min(6, hashes.length + by))}${space}`);
}

/** Cuerpo en Markdown limpio: sin HTML, sin negritas ni enlaces, con encabezados como jerarquia y listas como viñetas. */
const body = (markdown: string | undefined, headingShift = 0) =>
  toPlainText(shiftHeadings(markdown ?? "", headingShift), { multiline: true, keepHeadings: true });

export function articleUrl(baseUrl: string, portal: Portal, slug: string) {
  return `${baseUrl}/${portal}/blog/${slug}`;
}

/** URL de la version Markdown de un articulo (VIS-004). Para citar se usa la URL canonica HTML, sin .md. */
export function articleMarkdownUrl(baseUrl: string, portal: Portal, slug: string) {
  return `${articleUrl(baseUrl, portal, slug)}.md`;
}

export function renderArticle(article: BlogArticle, portal: Portal, baseUrl: string): string {
  const published = article.date;
  const updated = article.dateModified || article.date;
  const out: string[] = [
    `### ${toPlainText(article.title)}`,
    "",
    `- URL canónica: ${articleUrl(baseUrl, portal, article.slug)}`,
    `- Versión Markdown: ${articleMarkdownUrl(baseUrl, portal, article.slug)}`,
    `- Portal: ${PORTAL_NAME[portal]}`,
    `- Categoría: ${toPlainText(article.category)}`,
    `- Autor: ${toPlainText(article.author.name)}`,
    `- Publicado: ${published}`,
    `- Actualizado: ${updated}`,
    `- Lectura estimada: ${article.readTime} min`,
  ];
  if (article.tags?.length) out.push(`- Etiquetas: ${article.tags.map((tag) => toPlainText(tag)).join(", ")}`);
  out.push("", `Resumen: ${oneLine(article.excerpt, 600)}`, "");

  const intro = body(article.content.introduction, 2);
  if (intro) out.push(intro, "");

  for (const section of article.content.sections) {
    out.push(`#### ${toPlainText(section.title)}`, "");
    const text = body(section.content, 3);
    if (text) out.push(text, "");
    if (section.callout) {
      out.push(`Nota — ${toPlainText(section.callout.title)}:`, "", body(section.callout.content, 3), "");
    }
    for (const sub of section.subsections ?? []) {
      out.push(`##### ${toPlainText(sub.title)}`, "");
      const subText = body(sub.content, 4);
      if (subText) out.push(subText, "");
    }
  }

  if (article.content.conclusion) {
    out.push("#### Conclusión", "", body(article.content.conclusion, 3), "");
  }
  if (article.references?.length) {
    out.push("#### Referencias", "");
    for (const ref of article.references) {
      const detail = ref.description ? ` — ${oneLine(ref.description, 300)}` : "";
      out.push(`- ${toPlainText(ref.title)} (${toPlainText(ref.source)}): ${ref.url}${detail}`);
    }
    out.push("");
  }
  return out.join("\n");
}

export function renderTool(tool: Tool, baseUrl: string): string {
  const spec = TOOL_SPECS[tool.slug];
  const guide = GUIDE_MISMATCH_SLUGS.has(tool.slug) ? undefined : guidesData[tool.slug];
  const out: string[] = [
    `### ${toPlainText(tool.name)}`,
    "",
    `- URL canónica: ${baseUrl}${tool.url}`,
    `- Portal: ${PORTAL_NAME[tool.portal]}`,
    `- Acceso: gratuito, en el navegador`,
  ];
  if (TOOL_PUBLISHED[tool.slug]) out.push(`- Publicada: ${TOOL_PUBLISHED[tool.slug]}`);
  if (spec) {
    out.push(`- Qué calcula o hace: ${spec.does}`, `- Norma o metodología que implementa: ${spec.method}`, `- Datos que necesita: ${spec.inputs}`, `- Qué entrega: ${spec.outputs}`);
  } else {
    out.push(`- Descripción: ${toPlainText(tool.description)}`);
  }
  out.push("");
  if (guide) {
    out.push(`Guía metodológica — ${toPlainText(guide.title)}:`, "");
    for (const section of guide.sections) {
      out.push(`#### ${toPlainText(section.title)}`, "", body(section.content, 3), "");
    }
  }
  return out.join("\n");
}

async function loadArticles(): Promise<Record<Portal, BlogArticle[]>> {
  const [ia, ambiental] = await Promise.all(PORTALS.map((portal) => getArticlesForIndexing(portal)));
  return { ia, ambiental };
}

/** Indice breve y navegable: portales, herramientas, articulos y el enlace al archivo completo. */
export async function buildLlmsTxt(baseUrl: string): Promise<string> {
  const articles = await loadArticles();
  const lines: string[] = [
    "# AquatechIA",
    "",
    "> Plataforma de ingeniería ambiental e inteligencia artificial: herramientas de cálculo de calidad del agua y del aire, normativa ambiental, evaluación de impacto ambiental y artículos técnicos sobre modelos de lenguaje. Contenido en español.",
    "",
    `Texto íntegro de todos los artículos y ficha técnica de cada herramienta, con autor, fechas y URL canónica: [llms-full.txt](${baseUrl}/llms-full.txt).`,
    "",
    "## Portales",
    "",
    `- [Portal Ambiental](${baseUrl}/ambiental): calidad del agua y del aire, normas, EIA y mapas ambientales.`,
    `- [Portal IA](${baseUrl}/ia): cómo funcionan los modelos de lenguaje y la IA generativa.`,
    "",
    "## Herramientas",
    "",
  ];
  for (const portal of PORTALS) {
    for (const tool of getToolsByPortal(portal)) {
      lines.push(`- [${toPlainText(tool.name)}](${baseUrl}${tool.url}): ${oneLine(tool.description, 140)}`);
    }
  }
  for (const portal of PORTALS) {
    lines.push("", `## Artículos — ${PORTAL_NAME[portal]}`, "", "Cada enlace es la versión Markdown del artículo. Para citar, usa la URL canónica sin `.md`.", "");
    for (const article of articles[portal]) {
      lines.push(`- [${oneLine(article.title, 140)}](${articleMarkdownUrl(baseUrl, portal, article.slug)})`);
    }
  }
  lines.push(
    "",
    "## Otros",
    "",
    `- [Guías y manuales](${baseUrl}/guia)`,
    `- [Preguntas frecuentes](${baseUrl}/faq)`,
    `- [Soporte](${baseUrl}/soporte)`,
    `- [Mapa del sitio](${baseUrl}/sitemap.xml)`,
    "",
  );
  return lines.join("\n");
}

/** Documento completo: atribucion, herramientas con su metodologia y el cuerpo integro de cada articulo. */
export async function buildLlmsFullTxt(baseUrl: string): Promise<string> {
  const articles = await loadArticles();
  const total = articles.ia.length + articles.ambiental.length;
  const tools = PORTALS.flatMap((portal) => getToolsByPortal(portal));
  const lines: string[] = [
    "# AquatechIA — contenido completo para modelos de lenguaje",
    "",
    "> Plataforma de ingeniería ambiental e inteligencia artificial. Este archivo reúne el texto íntegro de los artículos y la ficha técnica de las herramientas. Contenido en español.",
    "",
    `Índice breve: ${baseUrl}/llms.txt · Sitio: ${baseUrl}`,
    "",
    "## Cómo citar",
    "",
    'Cita cada pieza con su autor, título, "AquatechIA" y la URL canónica indicada en su ficha. Las fechas de publicación y actualización figuran en cada entrada.',
    "",
    `Contenido: ${tools.length} herramientas y ${total} artículos (${articles.ia.length} del Portal IA, ${articles.ambiental.length} del Portal Ambiental).`,
    "",
    "## Herramientas",
    "",
  ];
  for (const tool of tools) lines.push(renderTool(tool, baseUrl));
  for (const portal of PORTALS) {
    lines.push(`## Artículos — ${PORTAL_NAME[portal]}`, "");
    for (const article of articles[portal]) lines.push(renderArticle(article, portal, baseUrl), "");
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
