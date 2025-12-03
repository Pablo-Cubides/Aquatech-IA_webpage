import { MetadataRoute } from "next";
import { getToolsByPortal } from "@/lib/services/tools-registry";
import { getCategories, getAllArticleSlugs } from "@/lib/blog-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com";
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
      url: `${baseUrl}/home`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
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
  ];

  // Environmental Tools pages
  const ambientalToolsPages: MetadataRoute.Sitemap = ambientalTools.map(
    (tool) => ({
      url: `${baseUrl}/ambiental/herramientas/${tool.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

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
