import { BlogArticle, getAllArticles } from "./blog-articles";
import {
  BlogCategory,
  getCategoryBySlug,
  getCategories,
  LEGACY_CATEGORY_MAP,
} from "./blog-categories";

// Re-export types
export type { BlogArticle, BlogCategory };

// Re-export functions
export {
  getCategories,
  getCategoryBySlug,
  getCategoryCanonicalUrl,
  getCategoryBreadcrumbs,
} from "./blog-categories";

export {
  getArticle,
  getAllArticles,
  generateTOC,
} from "./blog-articles";

/**
 * Mapea categoría de artículo a nueva categoría SEO
 */
export function mapArticleCategoryToSeoCategory(
  portal: "ia" | "ambiental",
  legacyCategory: string,
): BlogCategory | null {
  const mapping = LEGACY_CATEGORY_MAP[legacyCategory];
  if (!mapping || mapping.portal !== portal) {
    // Buscar categoría por nombre si no hay mapeo
    const categories = getCategories(portal, true);
    return (
      categories.find(
        (cat) =>
          cat.name.toLowerCase() === legacyCategory.toLowerCase() ||
          cat.displayName.toLowerCase() === legacyCategory.toLowerCase(),
      ) || null
    );
  }
  return getCategoryBySlug(portal, mapping.newSlug);
}

/**
 * Obtiene artículos por categoría SEO
 */
export async function getArticlesByCategory(
  portal: "ia" | "ambiental",
  categorySlug: string,
): Promise<BlogArticle[]> {
  const category = getCategoryBySlug(portal, categorySlug);

  if (!category) {
    return [];
  }

  const articles = await getAllArticles(portal);

  return articles.filter((article) => {
    const articleCategory = mapArticleCategoryToSeoCategory(
      portal,
      article.category,
    );
    return articleCategory?.slug === categorySlug;
  });
}


/**
 * Genera JSON-LD Schema para artículo de blog
 */
export function generateArticleSchema(
  article: BlogArticle,
  portal: "ia" | "ambiental",
  baseUrl = "https://aquatechia.com",
) {
  const publisherName =
    portal === "ia" ? "AquatechIA - Portal IA" : "AquatechIA - Portal Ambiental";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.heroImage,
    datePublished: article.date,
    // dateModified nunca puede ser anterior a datePublished (antes caia a una fecha fija y 8 articulos quedaron invertidos)
    dateModified: (article as { dateModified?: string }).dateModified || article.date,
    inLanguage: "es",
    author: {
      "@type": "Person",
      name: article.author.name,
      description: article.author.bio,
      url: `${baseUrl}/${portal}/autor`,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo-aquatech.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${portal}/blog/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.tags.join(", "),
    wordCount: Math.round(article.readTime * 200), // Estimación basada en tiempo de lectura
  };
}

/**
 * Preguntas frecuentes de un articulo: la seccion "Preguntas frecuentes" con subtitulos "### pregunta?" y su respuesta.
 * Se usa para el schema FAQPage (lo que Google muestra como desplegable y lo que citan los asistentes de IA).
 */
export function extractFaqs(article: BlogArticle): Array<{ question: string; answer: string }> {
  const section = article.content.sections.find((item) => /preguntas\s+frecuentes|faq/i.test(item.title));
  if (!section) return [];
  const faqs: Array<{ question: string; answer: string }> = [];
  const plain = (text: string) => text.replace(/[#*`_>]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\s+/g, " ").trim();
  for (const sub of section.subsections || []) {
    if (/\?\s*$/.test(sub.title) && plain(sub.content)) faqs.push({ question: plain(sub.title), answer: plain(sub.content) });
  }
  if (faqs.length) return faqs;
  const lines = section.content.split("\n");
  let question = "";
  let answer: string[] = [];
  const flush = () => {
    if (question && plain(answer.join(" "))) faqs.push({ question, answer: plain(answer.join(" ")) });
    question = "";
    answer = [];
  };
  for (const line of lines) {
    const heading = line.match(/^#{3,4}\s+(.+\?)\s*$/);
    if (heading) {
      flush();
      question = plain(heading[1]);
    } else if (question) answer.push(line);
  }
  flush();
  return faqs;
}

export function generateFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

/**
 * Genera JSON-LD Schema para página de categoría
 */
export function generateCategorySchema(
  category: BlogCategory,
  portal: "ia" | "ambiental",
  articles: BlogArticle[],
  baseUrl = "https://aquatechia.com",
) {
  const portalName =
    portal === "ia" ? "AquatechIA - Portal IA" : "AquatechIA - Portal Ambiental";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.metaTitle,
    description: category.metaDescription,
    url: `${baseUrl}/${portal}/categoria/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      name: category.name,
      description: category.description,
      numberOfItems: articles.length,
      itemListElement: articles.slice(0, 10).map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          headline: article.title,
          url: `${baseUrl}/${portal}/blog/${article.slug}`,
          datePublished: article.date,
          author: {
            "@type": "Person",
            name: article.author.name,
          },
        },
      })),
    },
    publisher: {
      "@type": "Organization",
      name: portalName,
    },
  };
}

/**
 * Genera JSON-LD BreadcrumbList
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Obtiene todos los slugs de categorías para generateStaticParams
 */
export function getAllCategorySlugs(
  portal: "ia" | "ambiental",
  includeHidden = true,
): string[] {
  const categories = getCategories(portal, includeHidden);
  return categories.map((cat) => cat.slug);
}

/**
 * Obtiene todos los slugs de artículos para sitemap y generateStaticParams
 */
export async function getAllArticleSlugs(portal: "ia" | "ambiental"): Promise<string[]> {
  const articles = await getAllArticles(portal);
  return articles.map((a) => a.slug);
}


/**
 * Genera URL canónica para artículo
 */
export function getArticleCanonicalUrl(
  portal: "ia" | "ambiental",
  slug: string,
  baseUrl = "https://aquatechia.com",
): string {
  return `${baseUrl}/${portal}/blog/${slug}`;
}

/**
 * Genera breadcrumbs para artículo
 */
export function getArticleBreadcrumbs(
  portal: "ia" | "ambiental",
  article: BlogArticle,
  baseUrl = "https://aquatechia.com",
) {
  const category = mapArticleCategoryToSeoCategory(portal, article.category);

  const breadcrumbs = [
    { name: "Inicio", url: `${baseUrl}/${portal}` },
    { name: "Blog", url: `${baseUrl}/${portal}/blog` },
  ];

  if (category) {
    breadcrumbs.push({
      name: category.displayName,
      url: `${baseUrl}/${portal}/categoria/${category.slug}`,
    });
  }

  breadcrumbs.push({
    name: article.title.length > 50 ? article.title.slice(0, 47) + "..." : article.title,
    url: `${baseUrl}/${portal}/blog/${article.slug}`,
  });

  return breadcrumbs;
}
