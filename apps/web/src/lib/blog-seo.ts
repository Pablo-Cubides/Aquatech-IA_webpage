import { BlogArticle, AMBIENTAL_ARTICLES, IA_ARTICLES } from "./blog-articles";
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
export function getArticlesByCategory(
  portal: "ia" | "ambiental",
  categorySlug: string,
): BlogArticle[] {
  const articles = portal === "ia" ? IA_ARTICLES : AMBIENTAL_ARTICLES;
  const category = getCategoryBySlug(portal, categorySlug);

  if (!category) {
    return [];
  }

  return Object.values(articles).filter((article) => {
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
    dateModified: article.date,
    author: {
      "@type": "Person",
      name: article.author.name,
      description: article.author.bio,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.png`,
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
 * Obtiene todos los slugs de artículos para generateStaticParams
 */
export function getAllArticleSlugs(portal: "ia" | "ambiental"): string[] {
  const articles = portal === "ia" ? IA_ARTICLES : AMBIENTAL_ARTICLES;
  return Object.keys(articles);
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
