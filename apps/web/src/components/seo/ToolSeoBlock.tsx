/**
 * Bloque SEO de una herramienta, renderizado en el servidor (visible sin JavaScript).
 *
 * Las herramientas son paginas cliente interactivas con muy poco texto: Google y los asistentes de IA no tenian que
 * leer ni citar. Este bloque agrega, desde el registro de herramientas y la guia de la herramienta (guides-data):
 * una explicacion de que es y como funciona, preguntas frecuentes, y el schema WebApplication + FAQPage + BreadcrumbList.
 */

import React from "react";
import { getToolBySlug } from "@/lib/services/tools-registry";
import { guidesData } from "@/lib/guides-data";
import { SITE_URL, DEFAULT_LOGO } from "@/lib/site-config";

type Portal = "ia" | "ambiental";

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const shorten = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}.`;
};

export default function ToolSeoBlock({ slug, portal }: { slug: string; portal: Portal }) {
  const tool = getToolBySlug(slug, portal);
  if (!tool) return null;
  const guide = guidesData[slug];
  const url = `${SITE_URL}${tool.url}`;
  const portalName = portal === "ia" ? "Portal IA" : "Portal Ambiental";

  const faqs: Array<{ question: string; answer: string }> = [
    { question: `¿Qué es ${tool.name}?`, answer: tool.description },
  ];
  if (guide?.sections?.length) {
    const how = stripHtml(guide.sections.map((section) => section.content).join(" "));
    faqs.push({ question: `¿Cómo funciona ${tool.name}?`, answer: shorten(how, 420) });
  }
  faqs.push({
    question: `¿Tiene costo usar ${tool.name}?`,
    answer: `No. ${tool.name} es una herramienta de acceso libre del ${portalName} de AquatechIA y funciona directamente en el navegador.`,
  });

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.seo.description,
    url,
    applicationCategory: portal === "ia" ? "EducationalApplication" : "EnvironmentalApplication",
    operatingSystem: "Web",
    inLanguage: "es",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "AquatechIA", url: SITE_URL, logo: { "@type": "ImageObject", url: DEFAULT_LOGO } },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: portalName, item: `${SITE_URL}/${portal}` },
      { "@type": "ListItem", position: 3, name: "Herramientas", item: `${SITE_URL}/${portal}/herramientas` },
      { "@type": "ListItem", position: 4, name: tool.name, item: url },
    ],
  };

  return (
    <section aria-labelledby={`sobre-${slug}`} className="mx-auto max-w-4xl px-4 py-12 text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <h2 id={`sobre-${slug}`} className="text-2xl font-bold text-white">
        Sobre {tool.name}
      </h2>
      <p className="mt-3 leading-relaxed">{tool.description}</p>

      {guide?.sections?.map((section) => (
        <div key={section.title} className="mt-8">
          <h3 className="text-xl font-semibold text-white">{section.title}</h3>
          <div className="mt-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      ))}

      <h2 className="mt-12 text-2xl font-bold text-white">Preguntas frecuentes</h2>
      <div className="mt-4 space-y-5">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
            <p className="mt-1 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
