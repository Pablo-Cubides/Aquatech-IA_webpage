// Articulos estaticos retirados el 2026-10-26 (Page Review + Search Console).
//
// Eran paginas de 300-575 palabras que repetian lo que ya dicen una herramienta o un articulo mas completo, o que no encajan con
// el portal (Google no las indexaba y diluian la calidad del sitio). Cada una redirige con 301 a la pagina que la reemplaza y sale
// de las listas y del sitemap. Este archivo es .mjs para que next.config.mjs lo use sin compilar.

/** @type {ReadonlyArray<{ portal: "ia" | "ambiental"; slug: string; to: string }>} */
export const RETIRED_ARTICLES = [
  { portal: "ia", slug: "spartan-plataforma-gestion-inteligente", to: "/ia/blog" },
  { portal: "ia", slug: "ecosistema-bots-empresariales-cubides", to: "/ia/blog/guia-practica-implementacion-ia-empresas" },
  { portal: "ia", slug: "integracion-llm-whatsapp-chatbot", to: "/ia/blog/guia-practica-implementacion-ia-empresas" },
  { portal: "ia", slug: "seguridad-y-filtrado-ia", to: "/ia/herramientas/filtrado-ia" },
  { portal: "ia", slug: "modelos-open-source-tendencias", to: "/ia/herramientas/modelos-tendencia" },
  { portal: "ia", slug: "papers-fundamentales-ia", to: "/ia/herramientas/papers-ia" },
  { portal: "ia", slug: "parametros-decodificacion-ia", to: "/ia/herramientas/parametros-decodificacion" },
  { portal: "ia", slug: "como-funcionan-los-llm-guia", to: "/ia/blog/que-es-un-modelo-de-lenguaje" },
  { portal: "ia", slug: "como-funciona-llm-transformers", to: "/ia/blog/que-es-un-modelo-de-lenguaje" },
  { portal: "ia", slug: "generacion-de-imagenes-difusion", to: "/ia/blog/difusion-stable-diffusion" },
  { portal: "ambiental", slug: "visor-mapas-sig-ambiental", to: "/ambiental/herramientas/visor-mapas-ambientales" },
  { portal: "ambiental", slug: "analisis-correlaciones-estadistica-ambiental", to: "/ambiental/herramientas/analisis-correlaciones" },
  { portal: "ambiental", slug: "aquatech-ia-portal-ambiental-digital", to: "/ambiental" },
  { portal: "ambiental", slug: "gestion-comunitaria-agua-rural-inclusiva-sostenible", to: "/ambiental/blog/desafio-agua-america-latina-rural-estadisticas" },
  // 2026-11-24: competian por "implementar IA en una empresa" (posiciones 27 a 82). La guia practica absorbe a esta; sus secciones
  // unicas (seis dimensiones de evaluacion y arquitectura/MLOps/Centro de Excelencia) pasaron a la guia por la API.
  { portal: "ia", slug: "como-implementar-ia-en-una-empresa", to: "/ia/blog/guia-practica-implementacion-ia-empresas" },
];

/** @param {string} portal @param {string} slug */
export function isRetiredArticle(portal, slug) {
  return RETIRED_ARTICLES.some((entry) => entry.portal === portal && entry.slug === slug);
}

/** Redirecciones para next.config.mjs. */
export function retiredArticleRedirects() {
  return RETIRED_ARTICLES.map((entry) => ({ source: `/${entry.portal}/blog/${entry.slug}`, destination: entry.to, permanent: true }));
}
