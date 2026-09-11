import fs from "fs";
import path from "path";
import type { BlogArticle } from "@/lib/blog-articles";
import { prisma } from "@/lib/db";
import type { BlogPost, BlogPostStatus, Prisma } from "@prisma/client";

export type BlogArticleStatus = "PUBLISHED" | "SCHEDULED" | "PAUSED" | "ARCHIVED" | "DRAFT";
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

let cachedArticlesPath: string | null = null;

// Find repository content path deterministically for local cache/fallback
function getArticlesFilePath(): string {
  if (cachedArticlesPath && fs.existsSync(cachedArticlesPath)) {
    return cachedArticlesPath;
  }

  // Check from current directory up to find content/blog/articles.json
  let current = process.cwd();
  for (let i = 0; i < 5; i++) {
    const candidate = path.resolve(current, "content", "blog", "articles.json");
    if (fs.existsSync(candidate)) {
      cachedArticlesPath = candidate;
      return candidate;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  // Fallback to localPath
  const fallback = path.resolve(process.cwd(), "content", "blog", "articles.json");
  const dir = path.dirname(fallback);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // Ignore in read-only environments
    }
  }

  cachedArticlesPath = fallback;
  return fallback;
}


// Read stored articles from disk (fallback)
export function getStoredArticlesFromDisk(): StoredBlogArticle[] {
  const isBrowser =
    typeof window !== "undefined" &&
    (typeof process === "undefined" || !process.versions?.node);
  if (isBrowser) {
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
    console.warn("[BlogStore] Warning reading articles from disk:", error);
    return [];
  }
}

// Save articles to disk cache (best effort)
export function saveStoredArticlesToDisk(articles: StoredBlogArticle[]): void {
  try {
    const filePath = getArticlesFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), "utf-8");
  } catch (error) {
    // Non-fatal on serverless read-only filesystem
    console.warn("[BlogStore] Notice: Disk cache write skipped/failed:", error);
  }
}

// Convert a database BlogPost row to StoredBlogArticle
export function mapDbPostToStoredArticle(post: BlogPost): StoredBlogArticle {
  const portal = post.portal.toLowerCase() as "ia" | "ambiental";
  const defaultHeroImage =
    portal === "ia"
      ? "/images/portal-ia/blog/llm-transformers-architecture.jpg"
      : "/images/portal-ambiental/blog/irca-calidad-agua-potable.jpg";

  const defaultAuthorAvatar =
    portal === "ia"
      ? "/images/portal-ia/autor/pablo-cubides.png"
      : "/images/portal-ambiental/autor/pablo-cubides.jpg";

  const defaultAuthorBio =
    portal === "ia"
      ? "Investigador en IA y Automatización"
      : "Ingeniero Ambiental y Químico";

  const parsedContent =
    typeof post.content === "string" ? JSON.parse(post.content) : post.content;

  const publishedIso =
    post.publishedAt instanceof Date
      ? post.publishedAt.toISOString()
      : new Date(post.publishedAt).toISOString();

  const createdIso =
    post.createdAt instanceof Date
      ? post.createdAt.toISOString()
      : new Date(post.createdAt).toISOString();

  const updatedIso =
    post.updatedAt instanceof Date
      ? post.updatedAt.toISOString()
      : new Date(post.updatedAt).toISOString();

  const parsedReferences = post.references
    ? typeof post.references === "string"
      ? JSON.parse(post.references)
      : post.references
    : undefined;

  const parsedNextArticle = post.nextArticle
    ? typeof post.nextArticle === "string"
      ? JSON.parse(post.nextArticle)
      : post.nextArticle
    : undefined;

  return {
    id: post.id,
    portal,
    slug: post.slug,
    title: post.title,
    category: post.category,
    date: publishedIso.split("T")[0],
    readTime: post.readTime,
    excerpt: post.excerpt,
    heroImage: post.heroImage || defaultHeroImage,
    author: {
      name: post.authorName || "Pablo Cubides",
      avatar: post.authorAvatar || defaultAuthorAvatar,
      bio: post.authorBio || defaultAuthorBio,
    },
    content: parsedContent,
    tags: Array.isArray(post.tags) ? post.tags : [post.category, portal.toUpperCase()],
    status: post.status as BlogArticleStatus,
    source: (post.source as BlogArticleSource) || "AGENT",
    references: parsedReferences,
    nextArticle: parsedNextArticle,
    publishedAt: publishedIso,
    createdAt: createdIso,
    updatedAt: updatedIso,
  };
}

// Read all stored dynamic articles (from PostgreSQL via Prisma, with fallback to disk)
export async function getStoredArticles(): Promise<StoredBlogArticle[]> {
  const isBrowser =
    typeof window !== "undefined" &&
    (typeof process === "undefined" || !process.versions?.node);
  if (isBrowser) {
    return [];
  }


  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    });
    const articles = posts.map(mapDbPostToStoredArticle);
    return articles;
  } catch (error) {
    console.warn("[BlogStore] Prisma query failed, falling back to disk cache:", error);
    return getStoredArticlesFromDisk();
  }
}

// Synchronous helper for backwards compatibility or static rendering fallbacks
export function getStoredArticlesSync(): StoredBlogArticle[] {
  return getStoredArticlesFromDisk();
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

// Create or enqueue an article from Agent or Admin directly into PostgreSQL
export async function createStoredArticle(input: CreateArticleInput): Promise<StoredBlogArticle> {
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);

  const now = new Date();
  const publishedDate = input.publishedAt ? new Date(input.publishedAt) : now;
  const isFuture = publishedDate.getTime() > now.getTime();

  const finalStatus: BlogArticleStatus =
    isFuture && (!input.status || input.status === "PUBLISHED")
      ? "SCHEDULED"
      : (input.status || "PUBLISHED");


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

  const defaultAuthorBio =
    input.portal === "ia"
      ? "Investigador en IA y Automatización"
      : "Ingeniero Ambiental y Químico";

  const calculatedReadTime =
    input.readTime ||
    Math.max(3, Math.round((JSON.stringify(structuredContent).length / 1000) * 1.5));

  const defaultCategory =
    input.portal === "ia" ? "Inteligencia Artificial" : "Gestión Ambiental";
  const category = input.category?.trim() || defaultCategory;

  const portalEnum = input.portal.toUpperCase() as "IA" | "AMBIENTAL";
  const tags =
    input.tags && input.tags.length > 0
      ? input.tags.filter((t): t is string => typeof t === "string" && Boolean(t.trim()))
      : [category, portalEnum];

  try {
    const post = await prisma.blogPost.upsert({
      where: {
        portal_slug: {
          portal: portalEnum,
          slug,
        },
      },
      update: {
        title: input.title,
        category,
        excerpt: input.excerpt,
        content: structuredContent as unknown as Prisma.InputJsonValue,
        heroImage: input.heroImage || defaultHeroImage,
        authorName: input.authorName || "Pablo Cubides",
        authorAvatar: input.authorAvatar || defaultAuthorAvatar,
        authorBio: input.authorBio || defaultAuthorBio,
        readTime: calculatedReadTime,
        tags,
        status: finalStatus as BlogPostStatus,
        source: input.source || "AGENT",
        publishedAt: publishedDate,
      },
      create: {
        portal: portalEnum,
        slug,
        title: input.title,
        category,

        excerpt: input.excerpt,
        content: structuredContent as unknown as Prisma.InputJsonValue,

        heroImage: input.heroImage || defaultHeroImage,
        authorName: input.authorName || "Pablo Cubides",
        authorAvatar: input.authorAvatar || defaultAuthorAvatar,
        authorBio: input.authorBio || defaultAuthorBio,
        readTime: calculatedReadTime,
        tags,
        status: finalStatus as BlogPostStatus,
        source: input.source || "AGENT",
        publishedAt: publishedDate,
      },
    });

    const storedArticle = mapDbPostToStoredArticle(post);

    // Sync to disk cache best-effort
    try {
      const diskArticles = getStoredArticlesFromDisk();
      const existingIdx = diskArticles.findIndex((a) => a.slug === slug && a.portal === input.portal);
      if (existingIdx >= 0) {
        diskArticles[existingIdx] = storedArticle;
      } else {
        diskArticles.unshift(storedArticle);
      }
      saveStoredArticlesToDisk(diskArticles);
    } catch {
      // Ignore disk sync error
    }

    return storedArticle;
  } catch (error) {
    console.error("[BlogStore] Database error creating article, using disk fallback:", error);
    // Disk fallback if DB fails
    const diskArticles = getStoredArticlesFromDisk();
    const existingIndex = diskArticles.findIndex(
      (a) => a.slug === slug && a.portal === input.portal
    );

    const newArticle: StoredBlogArticle = {
      id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      portal: input.portal,
      slug,
      title: input.title,
      category: input.category,
      date: publishedDate.toISOString().split("T")[0],
      readTime: calculatedReadTime,
      excerpt: input.excerpt,
      heroImage: input.heroImage || defaultHeroImage,
      author: {
        name: input.authorName || "Pablo Cubides",
        avatar: input.authorAvatar || defaultAuthorAvatar,
        bio: input.authorBio || defaultAuthorBio,
      },
      content: structuredContent,
      tags,
      status: finalStatus,
      source: input.source || "AGENT",
      publishedAt: publishedDate.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    if (existingIndex >= 0) {
      newArticle.id = diskArticles[existingIndex].id;
      newArticle.createdAt = diskArticles[existingIndex].createdAt;
      diskArticles[existingIndex] = newArticle;
    } else {
      diskArticles.unshift(newArticle);
    }

    saveStoredArticlesToDisk(diskArticles);
    return newArticle;
  }
}

// Update article status (e.g. PAUSE, PUBLISH, SCHEDULE) or metadata
export async function updateStoredArticle(
  id: string,
  updates: Partial<Omit<StoredBlogArticle, "id" | "createdAt">>
): Promise<StoredBlogArticle | null> {
  try {
    const data: Record<string, unknown> = { ...updates };
    if (updates.portal) {

      data.portal = updates.portal.toUpperCase();
    }
    if (updates.author) {
      if (updates.author.name) data.authorName = updates.author.name;
      if (updates.author.avatar) data.authorAvatar = updates.author.avatar;
      if (updates.author.bio) data.authorBio = updates.author.bio;
      delete data.author;
    }
    if (updates.publishedAt) {
      data.publishedAt = new Date(updates.publishedAt);
    }
    if (updates.content) {
      data.content = updates.content;
    }
    delete data.date;

    const updated = await prisma.blogPost.update({
      where: { id },
      data,
    });

    const storedArticle = mapDbPostToStoredArticle(updated);

    // Sync disk cache best-effort
    try {
      const diskArticles = getStoredArticlesFromDisk();
      const idx = diskArticles.findIndex((a) => a.id === id);
      if (idx !== -1) {
        diskArticles[idx] = storedArticle;
        saveStoredArticlesToDisk(diskArticles);
      }
    } catch {
      // Ignore
    }

    return storedArticle;
  } catch (error) {
    console.warn("[BlogStore] DB update error, attempting disk update:", error);
    const diskArticles = getStoredArticlesFromDisk();
    const index = diskArticles.findIndex((a) => a.id === id);
    if (index === -1) {
      return null;
    }

    const existing = diskArticles[index];
    const fallbackUpdated: StoredBlogArticle = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    diskArticles[index] = fallbackUpdated;
    saveStoredArticlesToDisk(diskArticles);
    return fallbackUpdated;
  }
}

// Delete an article from PostgreSQL
export async function deleteStoredArticle(id: string): Promise<boolean> {
  let dbSuccess = false;
  try {
    await prisma.blogPost.delete({
      where: { id },
    });
    dbSuccess = true;
  } catch (error) {
    console.warn("[BlogStore] DB delete failed or not found, attempting disk delete:", error);
  }

  // Also remove from disk cache
  try {
    const diskArticles = getStoredArticlesFromDisk();
    const initialLength = diskArticles.length;
    const filtered = diskArticles.filter((a) => a.id !== id);
    if (filtered.length !== initialLength) {
      saveStoredArticlesToDisk(filtered);
      return true;
    }
  } catch {
    // Ignore disk error
  }

  return dbSuccess;
}
