import { MetadataRoute } from "next";
import { getToolsByPortal } from "@/lib/services/tools-registry";
import { getCategories, getAllArticles } from "@/lib/blog-seo";
import { SITE_URL } from "@/lib/site-config";

// Los articulos del agente se publican por la API sin desplegar: sin esto el sitemap quedaba congelado hasta el siguiente deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  // lastmod solo donde es real: los articulos usan su fecha; el resto lo omite (antes todo decia "ahora" y Google lo ignoraba).
  const realDate = (value?: string) => {
    const parsed = value ? new Date(value) : null;
    return parsed && !Number.isNaN(parsed.getTime()) ? parsed : undefined;
  };

  // Get tools for both portals
  const iaTools = getToolsByPortal("ia");
  const ambientalTools = getToolsByPortal("ambiental");

  // Get blog categories and articles
  const iaCategories = getCategories("ia");
  const ambientalCategories = getCategories("ambiental");
  const iaArticles = await getAllArticles("ia");
  const ambientalArticles = await getAllArticles("ambiental");


  // Main pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/faq`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/soporte`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/links`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Guides & Technical Manuals
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guia`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // IA Portal pages
  const iaPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ia`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ia/nosotros`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ia/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ia/herramientas`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ia/autor`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ia/terms`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/ia/privacy`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/ia/coach-salud`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ia/coach-salud/privacidad`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/ia/coach-salud/terminos`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // IA Tools pages
  const iaToolsPages: MetadataRoute.Sitemap = iaTools.map((tool) => ({
    url: `${baseUrl}/ia/herramientas/${tool.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // IA Blog Category pages (excluding noindex categories)
  const iaCategoryPages: MetadataRoute.Sitemap = iaCategories
    .filter((cat) => !cat.noindex)
    .map((category) => ({
      url: `${baseUrl}/ia/categoria/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  // IA Blog Article pages
  const iaArticlePages: MetadataRoute.Sitemap = iaArticles.map((article) => ({
    url: `${baseUrl}/ia/blog/${article.slug}`,
    lastModified: realDate(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Environmental Portal pages
  const ambientalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ambiental`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ambiental/nosotros`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ambiental/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ambiental/herramientas`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ambiental/productos`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ambiental/autor`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ambiental/terms`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/ambiental/privacy`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Environmental Tools pages (including matrix generator subroutes, excluding builder 404 and duplicate)
  const ambientalToolsPages: MetadataRoute.Sitemap = [
    ...ambientalTools.map((tool) => ({
      url: `${baseUrl}/ambiental/herramientas/${tool.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/ambiental/herramientas/generador-matrices/matrices`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ambiental/herramientas/generador-matrices/selector`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ambiental/herramientas/generador-matrices/faq`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Ambiental Blog Category pages (excluding noindex categories)
  const ambientalCategoryPages: MetadataRoute.Sitemap = ambientalCategories
    .filter((cat) => !cat.noindex)
    .map((category) => ({
      url: `${baseUrl}/ambiental/categoria/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  // Ambiental Blog Article pages
  const ambientalArticlePages: MetadataRoute.Sitemap = ambientalArticles.map(
    (article) => ({
      url: `${baseUrl}/ambiental/blog/${article.slug}`,
      lastModified: realDate(article.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  return [
    ...mainPages,
    ...guidePages,
    ...iaPages,
    ...iaToolsPages,
    ...iaCategoryPages,
    ...iaArticlePages,
    ...ambientalPages,
    ...ambientalToolsPages,
    ...ambientalCategoryPages,
    ...ambientalArticlePages,
  ];
}
