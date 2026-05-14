/**
 * App copy — DO NOT edit directly.
 * Canonical: docs/contracts/article.zod.ts
 * Sync: node .specify/scripts/sync-contracts.mjs
 */

/**
 * Single source of truth for the BlogArticle type.
 * All article files must validate against this schema.
 *
 * Constitution §7.1: "Each file exports a single BlogArticle object validated against article.zod.ts"
 * Constitution §3.1: "Derive types from Zod schemas — never duplicate type definitions"
 *
 * Usage in article files:
 *   import { blogArticleSchema } from "@/lib/contracts/article.zod";
 *   import type { BlogArticle } from "@/lib/contracts/article.zod";
 *   const article: BlogArticle = blogArticleSchema.parse({ ... });
 *
 * NOTE: This file should be copied/symlinked to apps/web/src/lib/contracts/article.zod.ts
 * The canonical version lives in docs/contracts/ for cross-team visibility.
 */

import { z } from "zod";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const calloutSchema = z.object({
  type: z.enum(["info", "warning", "success"]),
  title: z.string().min(1, "Callout title cannot be empty"),
  content: z.string().min(1, "Callout content cannot be empty"),
});

const subsectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Section id must be kebab-case"),
  title: z.string().min(1, "Subsection title cannot be empty"),
  content: z.string().min(1, "Subsection content cannot be empty"),
});

const sectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Section id must be kebab-case"),
  title: z.string().min(1, "Section title cannot be empty"),
  content: z.string().min(50, "Section content must be at least 50 characters"),
  image: z.string().url("image must be a valid URL").or(z.string().startsWith("/")).optional(),
  callout: calloutSchema.optional(),
  subsections: z.array(subsectionSchema).optional(),
});

const authorSchema = z.object({
  name: z.string().min(1, "Author name cannot be empty"),
  avatar: z.string().min(1, "Author avatar path cannot be empty"),
  bio: z.string().optional(),
});

const nextArticleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "nextArticle.slug must be kebab-case"),
  title: z.string().min(1, "nextArticle.title cannot be empty"),
});

const contentSchema = z.object({
  introduction: z.string().min(100, "Introduction must be at least 100 characters"),
  sections: z
    .array(sectionSchema)
    .min(1, "Must have at least one section")
    .refine(
      (sections) => {
        const ids = sections.map((s) => s.id);
        return ids.length === new Set(ids).size;
      },
      { message: "Section IDs must be unique within the article" }
    ),
  conclusion: z.string().min(50, "Conclusion must be at least 50 characters").optional(),
});

// ─── Main schema ──────────────────────────────────────────────────────────────

export const blogArticleSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "slug must be kebab-case (lowercase, hyphens only)")
    .min(3, "slug must be at least 3 characters"),

  title: z.string().min(5, "title must be at least 5 characters"),

  category: z.string().min(1, "category cannot be empty"),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be ISO 8601 format: YYYY-MM-DD")
    .refine((d) => !isNaN(new Date(d).getTime()), { message: "date must be a valid date" }),

  readTime: z
    .number()
    .int("readTime must be an integer")
    .positive("readTime must be a positive integer"),

  excerpt: z
    .string()
    .min(20, "excerpt must be at least 20 characters")
    .max(280, "excerpt must not exceed 280 characters"),

  heroImage: z
    .string()
    .min(1, "heroImage cannot be empty — upload to Cloudinary before publishing")
    .refine(
      (v) => v.startsWith("http") || v.startsWith("/"),
      { message: "heroImage must be a Cloudinary URL or an absolute path starting with /" }
    ),

  author: authorSchema,

  content: contentSchema,

  tags: z
    .array(z.string().min(1, "Tag cannot be an empty string"))
    .min(3, "Must have at least 3 tags")
    .max(7, "Must have at most 7 tags"),

  nextArticle: nextArticleSchema.optional(),
});

// ─── Derived TypeScript type ──────────────────────────────────────────────────

export type BlogArticle = z.infer<typeof blogArticleSchema>;
export type BlogArticleSection = z.infer<typeof sectionSchema>;
export type BlogArticleAuthor = z.infer<typeof authorSchema>;
export type BlogArticleContent = z.infer<typeof contentSchema>;
export type BlogArticleCallout = z.infer<typeof calloutSchema>;
