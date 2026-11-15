/**
 * Preguntas frecuentes de una herramienta, en texto plano. Una sola fuente para el texto visible, el JSON-LD (FAQPage)
 * y llms-full.txt: ninguna respuesta lleva HTML ni Markdown, y ninguna se corta a mitad de frase.
 */

import { guidesData } from "@/lib/guides-data";
import { toPlainText, truncateAtSentence } from "@/lib/text/plain-text";
import type { Tool } from "@/lib/types";

/** Objetivo de longitud de una respuesta; se recorta en limite de frase, nunca a mitad de una. */
export const FAQ_ANSWER_MAX_CHARS = 420;

export type ToolFaq = { question: string; answer: string };

export function buildToolFaqs(tool: Tool, portal: "ia" | "ambiental"): ToolFaq[] {
  const guide = guidesData[tool.slug];
  const portalName = portal === "ia" ? "Portal IA" : "Portal Ambiental";
  const faqs: ToolFaq[] = [{ question: `¿Qué es ${tool.name}?`, answer: toPlainText(tool.description) }];
  if (guide?.sections?.length) {
    const how = toPlainText(guide.sections.map((section) => section.content).join("\n\n"));
    faqs.push({ question: `¿Cómo funciona ${tool.name}?`, answer: truncateAtSentence(how, FAQ_ANSWER_MAX_CHARS) });
  }
  faqs.push({
    question: `¿Tiene costo usar ${tool.name}?`,
    answer: `No. ${tool.name} es una herramienta de acceso libre del ${portalName} de AquatechIA y funciona directamente en el navegador.`,
  });
  return faqs;
}
