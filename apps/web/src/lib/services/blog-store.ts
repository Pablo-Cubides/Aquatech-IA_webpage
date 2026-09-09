import fs from "fs";
import path from "path";
import type { BlogArticle } from "@/lib/blog-articles";

export type BlogArticleStatus = "PUBLISHED" | "SCHEDULED" | "PAUSED" | "ARCHIVED";
export type BlogArticleSource = "AGENT" | "ADMIN" | "CODE";

export interface StoredBlogArticle extends BlogArticle {
  id: string;
  portal: "ia" | "ambiental";
  status: BlogArticleStatus;
  source: BlogArticleSource;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Find repository content path
function getArticlesFilePath(): string {
  const possiblePaths = [
    path.join(process.cwd(), "content", "blog", "articles.json"),
    path.join(process.cwd(), "..", "..", "content", "blog", "articles.json"),
    path.join(process.cwd(), "apps", "web", "content", "blog", "articles.json"),
  ];

  for (const p of possiblePaths) {
    const dir = path.dirname(p);
    if (fs.existsSync(dir)) {
      return p;
    }
  }

  // Default fallback
  const defaultPath = path.join(process.cwd(), "content", "blog", "articles.json");
  const dir = path.dirname(defaultPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return defaultPath;
}

// Read all stored dynamic articles
export function getStoredArticles(): StoredBlogArticle[] {
  if (typeof window !== "undefined") {
    return [];
  }
  const filePath = getArticlesFilePath();
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, "utf-8");
    if (!data.trim()) return [];
    return JSON.parse(data) as StoredBlogArticle[];
  } catch (error) {
    console.error("[BlogStore] Error reading articles:", error);
    return [];
  }
}

// Save all articles to storage
export function saveStoredArticles(articles: StoredBlogArticle[]): void {
  const filePath = getArticlesFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), "utf-8");
  } catch (error) {
    console.error("[BlogStore] Error saving articles:", error);
    throw new Error("No se pudo guardar los artículos en el almacenamiento.");
  }
}

// Convert markdown text into structured sections if an agent sends raw markdown
export function parseMarkdownToSections(rawText: string): {
  introduction: string;
  sections: StoredBlogArticle["content"]["sections"];
  conclusion?: string;
} {
  const lines = rawText.split("\n");
  const introLines: string[] = [];
  const sections: StoredBlogArticle["content"]["sections"] = [];
  let currentSection: { id: string; title: string; content: string[] } | null = null;
  let conclusion: string | undefined;

  let inIntro = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for H2 (##) headings
    if (line.startsWith("## ")) {
      inIntro = false;
      if (currentSection) {
        if (
          currentSection.title.toLowerCase().includes("conclusión") ||
          currentSection.title.toLowerCase().includes("conclusion")
        ) {
          conclusion = currentSection.content.join("\n").trim();
        } else {
          sections.push({
            id: currentSection.id,
            title: currentSection.title,
            content: currentSection.content.join("\n").trim(),
          });
        }
      }

      const title = line.replace(/^##\s+/, "").trim();
      const id = slugify(title);
      currentSection = {
        id,
        title,
        content: [],
      };
      continue;
    }

    if (inIntro) {
      // Ignore initial H1 (#) if present
      if (!line.startsWith("# ")) {
        introLines.push(line);
      }
    } else if (currentSection) {
      currentSection.content.push(line);
    }
  }

  if (currentSection) {
    if (
      currentSection.title.toLowerCase().includes("conclusión") ||
      currentSection.title.toLowerCase().includes("conclusion")
    ) {
      conclusion = currentSection.content.join("\n").trim();
    } else {
      sections.push({
        id: currentSection.id,
        title: currentSection.title,
        content: currentSection.content.join("\n").trim(),
      });
    }
  }

  const introduction = introLines.join("\n").trim() || "Introducción del artículo.";

  if (sections.length === 0) {
    // If no ## headings were found, put whole body in a single section
    sections.push({
      id: "contenido-principal",
      title: "Contenido Principal",
      content: rawText.replace(/^#\s+[^\n]+\n+/, "").trim(),
    });
  }

  return {
    introduction,
    sections,
    conclusion,
  };
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface CreateArticleInput {
  portal: "ia" | "ambiental";
  title: string;
  slug?: string;
  category: string;
  excerpt: string;
  content:
    | string
    | {
        introduction: string;
        sections: StoredBlogArticle["content"]["sections"];
        conclusion?: string;
      };
  heroImage?: string;
  authorName?: string;
  authorAvatar?: string;
  authorBio?: string;
  readTime?: number;
  tags?: string[];
  status?: BlogArticleStatus;
  publishedAt?: string;
  source?: BlogArticleSource;
}

// Create or enqueue an article from Agent or Admin
export function createStoredArticle(input: CreateArticleInput): StoredBlogArticle {
  const articles = getStoredArticles();
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);

  // Check if slug exists in dynamic articles
  const existingIndex = articles.findIndex(
    (a) => a.slug === slug && a.portal === input.portal,
  );

  const now = new Date();
  const publishedDate = input.publishedAt ? new Date(input.publishedAt) : now;
  const isFuture = publishedDate.getTime() > now.getTime();

  // Status determination:
  // Default to PUBLISHED unless explicitly provided or future date
  const finalStatus: BlogArticleStatus = input.status || (isFuture ? "SCHEDULED" : "PUBLISHED");

  const structuredContent =
    typeof input.content === "string"
      ? parseMarkdownToSections(input.content)
      : input.content;

  const defaultHeroImage =
    input.portal === "ia"
      ? "/images/portal-ia/blog/llm-transformers-architecture.jpg"
      : "/images/portal-ambiental/blog/irca-calidad-agua-potable.jpg";

  const defaultAuthorAvatar =
    input.portal === "ia"
      ? "/images/portal-ia/autor/pablo-cubides.png"
      : "/images/portal-ambiental/autor/pablo-cubides.jpg";

  const newArticle: StoredBlogArticle = {
    id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    portal: input.portal,
    slug,
    title: input.title,
    category: input.category,
    date: publishedDate.toISOString().split("T")[0],
    readTime: input.readTime || Math.max(3, Math.round((JSON.stringify(structuredContent).length / 1000) * 1.5)),
    excerpt: input.excerpt,
    heroImage: input.heroImage || defaultHeroImage,
    author: {
      name: input.authorName || "Pablo Cubides",
      avatar: input.authorAvatar || defaultAuthorAvatar,
      bio: input.authorBio || (input.portal === "ia" ? "Investigador en IA y Automatización" : "Ingeniero Ambiental y Químico"),
    },
    content: structuredContent,
    tags: input.tags && input.tags.length > 0 ? input.tags : [input.category, input.portal.toUpperCase()],
    status: finalStatus,
    source: input.source || "AGENT",
    publishedAt: publishedDate.toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  if (existingIndex >= 0) {
    // Overwrite existing with updated ID
    newArticle.id = articles[existingIndex].id;
    newArticle.createdAt = articles[existingIndex].createdAt;
    articles[existingIndex] = newArticle;
  } else {
    articles.unshift(newArticle);
  }

  saveStoredArticles(articles);
  return newArticle;
}

// Update article status (e.g. PAUSE, PUBLISH, SCHEDULE) or metadata
export function updateStoredArticle(
  id: string,
  updates: Partial<Omit<StoredBlogArticle, "id" | "createdAt">>
): StoredBlogArticle | null {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) {
    return null;
  }

  const existing = articles[index];
  const updated: StoredBlogArticle = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  articles[index] = updated;
  saveStoredArticles(articles);
  return updated;
}

// Delete an article
export function deleteStoredArticle(id: string): boolean {
  const articles = getStoredArticles();
  const initialLength = articles.length;
  const filtered = articles.filter((a) => a.id !== id);

  if (filtered.length === initialLength) {
    return false;
  }

  saveStoredArticles(filtered);
  return true;
}
