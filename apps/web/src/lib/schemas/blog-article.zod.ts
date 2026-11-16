import { z } from "zod";

/**
 * Esquemas de entrada de /api/admin/blog/articles (SEC-002).
 *
 * Son CERRADOS (.strict()): cualquier clave no listada se rechaza con 400 y el
 * error nombra las claves rechazadas. `id`, `createdAt`, `updatedAt` y `source`
 * los controla el servidor y no se aceptan en el PATCH.
 */

export const articleIdSchema = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(120);
const portal = z.enum(["ia", "ambiental"]);
const status = z.enum(["PUBLISHED", "SCHEDULED", "PAUSED", "ARCHIVED", "DRAFT"]);
const text = (max: number) => z.string().max(max);

// Ruta absoluta del sitio ("/images/...") o https. Nunca data:, javascript:, http plano ni "//host".
const imageUrl = z
  .string()
  .max(2048)
  .refine(
    (value) =>
      (value.startsWith("/") && !value.startsWith("//") && !/\s/.test(value)) ||
      /^https:\/\/[^\s]+$/.test(value),
    "URL de imagen no permitida",
  );
const httpUrl = z
  .string()
  .max(2048)
  .regex(/^https?:\/\/[^\s]+$/, "URL no permitida");
const isoDate = z
  .string()
  .max(40)
  .refine((value) => !Number.isNaN(Date.parse(value)), "Fecha inválida");

const subsection = z
  .object({ id: z.string().max(80), title: text(300), content: text(20_000) })
  .strict();

const section = z
  .object({
    id: z.string().max(80),
    title: text(300),
    content: text(20_000),
    subsections: z.array(subsection).max(20).optional(),
    image: imageUrl.optional(),
    callout: z
      .object({
        type: z.enum(["info", "warning", "success"]),
        title: text(200),
        content: text(4_000),
      })
      .strict()
      .optional(),
  })
  .strict();

const structuredContent = z
  .object({
    introduction: text(10_000),
    sections: z.array(section).min(1).max(60),
    conclusion: text(10_000).optional(),
  })
  .strict();

const content = z.union([z.string().min(1).max(200_000), structuredContent]);
const tags = z.array(z.string().trim().min(1).max(40)).max(7);
const readTime = z.number().int().min(1).max(180);

const author = z
  .object({
    name: text(100).optional(),
    avatar: imageUrl.optional(),
    bio: text(500).optional(),
  })
  .strict();

const reference = z
  .object({
    title: text(300),
    url: httpUrl,
    source: text(200),
    description: text(1_000).optional(),
  })
  .strict();

export const createArticleSchema = z
  .object({
    portal,
    title: z.string().trim().min(1).max(200),
    slug: slug.optional(),
    // La UI de administración envía "" cuando el campo está vacío: la ruta aplica el valor por defecto.
    category: text(80).optional(),
    excerpt: text(500).optional(),
    content,
    heroImage: imageUrl.optional(),
    authorName: text(100).optional(),
    authorAvatar: imageUrl.optional(),
    authorBio: text(500).optional(),
    readTime: readTime.optional(),
    tags: tags.optional(),
    status: status.optional(),
    publishedAt: isoDate.optional(),
    // Compatibilidad con la UI y los agentes actuales: se acepta pero se IGNORA.
    // La procedencia la decide el servidor según cómo se autenticó la petición.
    source: z.enum(["AGENT", "ADMIN"]).optional(),
  })
  .strict();

export const updateArticleSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    slug,
    portal,
    category: z.string().trim().min(1).max(80),
    excerpt: z.string().trim().min(1).max(500),
    content,
    heroImage: imageUrl,
    author,
    readTime,
    tags,
    status,
    publishedAt: isoDate,
    references: z.array(reference).max(50),
    nextArticle: z.object({ slug, title: text(300) }).strict(),
  })
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, "Sin campos que actualizar");

/** Claves rechazadas por el esquema cerrado + resumen de problemas, para el cuerpo del 400. */
export function describeInvalidBody(error: z.ZodError) {
  const rejectedKeys = error.issues.flatMap((issue) =>
    issue.code === "unrecognized_keys" ? [...issue.keys] : [],
  );
  return {
    error: "Cuerpo inválido",
    rejectedKeys,
    issues: error.issues.slice(0, 10).map((issue) => `${issue.path.join(".") || "(raíz)"}: ${issue.message}`),
  };
}

export const MAX_BLOG_BODY_BYTES = 300 * 1024;

/** Lee y parsea el cuerpo JSON con tope de tamaño. Devuelve null si no es JSON válido o es demasiado grande. */
export async function readBoundedJson(req: Request): Promise<{ ok: true; value: unknown } | { ok: false; status: 400 | 413 }> {
  const text = await req.text();
  if (new TextEncoder().encode(text).length > MAX_BLOG_BODY_BYTES) return { ok: false, status: 413 };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, status: 400 };
  }
}
