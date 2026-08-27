import { MetadataRoute } from "next";
import { getToolsByPortal } from "@/lib/services/tools-registry";
import { getCategories, getAllArticleSlugs } from "@/lib/blog-seo";
import { guidesData } from "@/lib/guides-data";
import { SITE_URL } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const currentDate = new Date();

  // Get tools for both portals
  const iaTools = getToolsByPortal("ia");
  const ambientalTools = getToolsByPortal("ambiental");

  // Get blog categories and articles
  const iaCategories = getCategories("ia");
  const ambientalCategories = getCategories("ambiental");
  const iaArticleSlugs = getAllArticleSlugs("ia");
  const ambientalArticleSlugs = getAllArticleSlugs("ambiental");

  // Main pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/soporte`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/links`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Guides & Technical Manuals
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guia`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guia/ecostats`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...Object.keys(guidesData).map((slug) => ({
      url: `${baseUrl}/guia/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // IA Portal pages
  const iaPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ia`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ia/nosotros`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ia/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ia/herramientas`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ia/cursos`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ia/autor`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ia/autor/herramientas/ruleta-academica`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ia/autor/herramientas/aula-score`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ia/autor/herramientas/consulta-nota`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ia/autor/herramientas/proyectos-investigacion`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ia/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/ia/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/ia/coach-salud`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ia/coach-salud/privacidad`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/ia/coach-salud/terminos`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // IA Tools pages
  const iaToolsPages: MetadataRoute.Sitemap = iaTools.map((tool) => ({
    url: `${baseUrl}/ia/herramientas/${tool.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // IA Blog Category pages (excluding noindex categories)
  const iaCategoryPages: MetadataRoute.Sitemap = iaCategories
    .filter((cat) => !cat.noindex)
    .map((category) => ({
      url: `${baseUrl}/ia/categoria/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  // IA Blog Article pages
  const iaArticlePages: MetadataRoute.Sitemap = iaArticleSlugs.map((slug) => ({
    url: `${baseUrl}/ia/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Environmental Portal pages
  const ambientalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ambiental`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ambiental/nosotros`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ambiental/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ambiental/herramientas`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ambiental/cursos`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ambiental/autor`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ambiental/autor/herramientas/ruleta-academica`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ambiental/autor/herramientas/aula-score`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ambiental/autor/herramientas/consulta-nota`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ambiental/autor/herramientas/proyectos-investigacion`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ambiental/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/ambiental/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Environmental Tools pages (including matrix generator subroutes)
  const ambientalToolsPages: MetadataRoute.Sitemap = [
    ...ambientalTools.map((tool) => ({
      url: `${baseUrl}/ambiental/herramientas/${tool.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/ambiental/herramientas/generador-matrices`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ambiental/herramientas/generador-matrices/matrices`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ambiental/herramientas/generador-matrices/selector`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ambiental/herramientas/generador-matrices/builder`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ambiental/herramientas/generador-matrices/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Ambiental Blog Category pages (excluding noindex categories)
  const ambientalCategoryPages: MetadataRoute.Sitemap = ambientalCategories
    .filter((cat) => !cat.noindex)
    .map((category) => ({
      url: `${baseUrl}/ambiental/categoria/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  // Ambiental Blog Article pages
  const ambientalArticlePages: MetadataRoute.Sitemap = ambientalArticleSlugs.map(
    (slug) => ({
      url: `${baseUrl}/ambiental/blog/${slug}`,
      lastModified: currentDate,
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
