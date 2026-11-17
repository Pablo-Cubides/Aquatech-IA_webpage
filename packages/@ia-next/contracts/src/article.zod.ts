/**
 * Single source of truth for the BlogArticle type.
 * All article files must validate against this schema.
 *
 * SEC-004b (ADR-0016): el contrato valida el artículo MAQUETADO que se publica. La API de
 * administración recibe otra forma (campos planos, borradores) y, para PUBLISHED y SCHEDULED, la
 * convierte a esta forma y la valida contra este mismo esquema. Los esquemas de URL y los topes de
 * longitud viven aquí para que código y API no puedan divergir.
 */

import { z } from "zod";

// ─── URLs ─────────────────────────────────────────────────────────────────────

/**
 * Imagen: ruta absoluta del sitio ("/images/...") o URL https. Nunca data:, javascript:, http plano
 * ni "//host" (esquema relativo al protocolo). Antes el contrato aceptaba todo lo que empezara por
 * "http" ("httpfoo", "http://") o por "/" ("//evil.example").
 */
export const imageUrlSchema = z
  .string()
  .max(2048, "image URL is too long")
  .refine(
    (value) =>
      (value.startsWith("/") && !value.startsWith("//") && !/\s/.test(value)) ||
      /^https:\/\/[^\s]+$/.test(value),
    "must be an https URL or a site path starting with a single /",
  );

/** Enlace de referencia: http o https, sin espacios. Nunca javascript:, data: ni vbscript:. */
export const httpUrlSchema = z
  .string()
  .max(2048, "URL is too long")
  .regex(/^https?:\/\/[^\s]+$/, "must be an http(s) URL");

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const calloutSchema = z.object({
  type: z.enum(["info", "warning", "success"]),
  title: z.string().min(1, "Callout title cannot be empty").max(200, "Callout title must not exceed 200 characters"),
  content: z.string().min(1, "Callout content cannot be empty").max(4_000, "Callout content must not exceed 4000 characters"),
});

const subsectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Section id must be kebab-case"),
  title: z.string().min(1, "Subsection title cannot be empty").max(300, "Subsection title must not exceed 300 characters"),
  content: z.string().min(1, "Subsection content cannot be empty").max(20_000, "Subsection content must not exceed 20000 characters"),
});

const sectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Section id must be kebab-case"),
  title: z.string().min(1, "Section title cannot be empty").max(300, "Section title must not exceed 300 characters"),
  content: z
    .string()
    .min(50, "Section content must be at least 50 characters")
    .max(20_000, "Section content must not exceed 20000 characters"),
  image: imageUrlSchema.optional(),
  callout: calloutSchema.optional(),
  subsections: z.array(subsectionSchema).max(20, "At most 20 subsections per section").optional(),
});

const authorSchema = z.object({
  name: z.string().min(1, "Author name cannot be empty").max(100, "Author name must not exceed 100 characters"),
  avatar: imageUrlSchema,
  bio: z.string().max(500, "Author bio must not exceed 500 characters").optional(),
});

export const referenceSchema = z.object({
  title: z.string().min(1, "Reference title cannot be empty").max(300, "Reference title must not exceed 300 characters"),
  url: httpUrlSchema,
  source: z.string().min(1, "Reference source cannot be empty").max(200, "Reference source must not exceed 200 characters"),
  description: z.string().max(1_000, "Reference description must not exceed 1000 characters").optional(),
});

const nextArticleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "nextArticle.slug must be kebab-case"),
  title: z.string().min(1, "nextArticle.title cannot be empty"),
});

const contentSchema = z.object({
  introduction: z
    .string()
    .min(100, "Introduction must be at least 100 characters")
    .max(10_000, "Introduction must not exceed 10000 characters"),
  sections: z
    .array(sectionSchema)
    .min(1, "Must have at least one section")
    .max(60, "At most 60 sections per article")
    .refine(
      (sections) => {
        const ids = sections.map((s) => s.id);
        return ids.length === new Set(ids).size;
      },
      { message: "Section IDs must be unique within the article" }
    ),
  conclusion: z
    .string()
    .min(50, "Conclusion must be at least 50 characters")
    .max(10_000, "Conclusion must not exceed 10000 characters")
    .optional(),
});

// ─── Main schema ──────────────────────────────────────────────────────────────

export const blogArticleBaseSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "slug must be kebab-case (lowercase, hyphens only)")
    .min(3, "slug must be at least 3 characters"),

  title: z
    .string()
    .min(5, "title must be at least 5 characters")
    .max(200, "title must not exceed 200 characters"),

  category: z.string().min(1, "category cannot be empty").max(80, "category must not exceed 80 characters"),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be ISO 8601 format: YYYY-MM-DD")
    .refine((d) => !isNaN(new Date(d).getTime()), { message: "date must be a valid date" }),

  readTime: z
    .number()
    .int("readTime must be an integer")
    .positive("readTime must be a positive integer")
    .max(180, "readTime must not exceed 180 minutes"),

  excerpt: z
    .string()
    .min(20, "excerpt must be at least 20 characters")
    .max(280, "excerpt must not exceed 280 characters"),

  heroImage: z
    .string()
    .min(1, "heroImage cannot be empty — upload to Cloudinary before publishing")
    .pipe(imageUrlSchema),

  author: authorSchema,

  content: contentSchema,

  tags: z
    .array(z.string().min(1, "Tag cannot be an empty string").max(40, "Tag must not exceed 40 characters"))
    .min(3, "Must have at least 3 tags")
    .max(7, "Must have at most 7 tags"),

  nextArticle: nextArticleSchema.optional(),

  /** Última modificación sustancial (YYYY-MM-DD, no anterior a `date`). Alimenta dateModified del JSON-LD. */
  dateModified: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dateModified must be ISO 8601 format: YYYY-MM-DD")
    .refine((d) => !isNaN(new Date(d).getTime()), { message: "dateModified must be a valid date" })
    .optional(),

  /** Fuentes citadas (máximo 50). Solo enlaces http(s). */
  references: z.array(referenceSchema).max(50, "At most 50 references").optional(),
});

/**
 * Esquema canónico completo. `dateModified` no puede ser anterior a `date`.
 * Para `.pick()`/`.partial()` usa `blogArticleBaseSchema`: Zod 4 no permite derivar de un objeto con refinamientos.
 */
export const blogArticleSchema = blogArticleBaseSchema.refine(
  (article) => !article.dateModified || article.dateModified >= article.date,
  { message: "dateModified cannot be earlier than date", path: ["dateModified"] },
);

// ─── Derived TypeScript type ──────────────────────────────────────────────────

export type BlogArticle = z.infer<typeof blogArticleSchema>;
export type BlogArticleSection = z.infer<typeof sectionSchema>;
export type BlogArticleAuthor = z.infer<typeof authorSchema>;
export type BlogArticleContent = z.infer<typeof contentSchema>;
export type BlogArticleCallout = z.infer<typeof calloutSchema>;
export type BlogArticleReference = z.infer<typeof referenceSchema>;
