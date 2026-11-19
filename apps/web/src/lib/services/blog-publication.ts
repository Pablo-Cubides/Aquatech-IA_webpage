/**
 * Validación de publicación contra el contrato canónico (SEC-004b, ADR-0016).
 *
 * La API de administración acepta una forma de ENTRADA (campos planos, borradores, markdown). Un
 * artículo que va a quedar visible al público (PUBLISHED o SCHEDULED) debe cumplir el MISMO
 * contrato que los artículos de código (`blogArticleSchema`): hasta ahora la API dejaba publicar
 * artículos con 2 etiquetas, sin extracto utilizable o con URLs de imagen arbitrarias.
 *
 * Los borradores (DRAFT, PAUSED, ARCHIVED) siguen siendo laxos. La LECTURA de la base de datos no
 * valida nada (decisión de fallo abierto: denegar un artículo a todo el mundo es peor que
 * mostrarlo); esto solo gobierna lo que se escribe.
 */

import { blogArticleSchema } from "@ia-next/contracts";
import {
  DEFAULT_AUTHOR_NAME,
  articleDefaultsFor,
  estimateReadTime,
  parseMarkdownToSections,
  resolveFinalStatus,
  slugify,
  type BlogArticleStatus,
  type CreateArticleInput,
  type StoredBlogArticle,
} from "@/lib/services/blog-store";

export const PUBLISHING_STATUSES: ReadonlySet<BlogArticleStatus> = new Set(["PUBLISHED", "SCHEDULED"]);

export type PublicationCheck = { ok: true } | { ok: false; issues: string[] };

function describe(path: PropertyKey[], message: string): string {
  return `${path.map(String).join(".") || "(raíz)"}: ${message}`;
}

/** Cuerpo del 400 cuando el artículo no cumple el contrato de publicación. */
export function describePublicationFailure(issues: string[]) {
  return {
    // La UI de administración muestra solo `error`: por eso lleva los primeros motivos.
    error: `El artículo no cumple el contrato de publicación: ${issues.slice(0, 3).join("; ")}`,
    contract: "blogArticleSchema",
    issues: issues.slice(0, 15),
    hint: "Guárdalo con status DRAFT para publicarlo después, o corrige los campos indicados.",
  };
}

/**
 * Creación: convierte la entrada a la forma que el servidor va a guardar (con los mismos valores por
 * defecto que `createStoredArticle`) y, si el estado resultante es de publicación, la valida.
 */
export function checkCreateForPublication(input: CreateArticleInput, now: Date = new Date()): PublicationCheck {
  const publishedDate = input.publishedAt ? new Date(input.publishedAt) : now;
  const status = resolveFinalStatus(input.status, publishedDate, now);
  if (!PUBLISHING_STATUSES.has(status)) return { ok: true };

  const defaults = articleDefaultsFor(input.portal);
  const content = typeof input.content === "string" ? parseMarkdownToSections(input.content) : input.content;
  const category = input.category?.trim() || defaults.category;
  const tags =
    input.tags && input.tags.length > 0
      ? input.tags.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim()))
      : [category, input.portal.toUpperCase()];

  const candidate = {
    slug: input.slug?.trim() ? slugify(input.slug) : slugify(input.title),
    title: input.title,
    category,
    date: publishedDate.toISOString().split("T")[0],
    readTime: input.readTime || estimateReadTime(content),
    excerpt: input.excerpt,
    heroImage: input.heroImage || defaults.heroImage,
    author: {
      name: input.authorName || DEFAULT_AUTHOR_NAME,
      avatar: input.authorAvatar || defaults.authorAvatar,
      bio: input.authorBio || defaults.authorBio,
    },
    content,
    tags,
  };

  const result = blogArticleSchema.safeParse(candidate);
  if (result.success) return { ok: true };
  return { ok: false, issues: result.error.issues.map((issue) => describe(issue.path, issue.message)) };
}

type PatchLike = Partial<{
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  heroImage: string;
  readTime: number;
  tags: string[];
  status: BlogArticleStatus;
  publishedAt: string;
  content: unknown;
  author: { name?: string; avatar?: string; bio?: string };
  references: unknown;
  nextArticle: unknown;
}>;

// Campo del PATCH -> campo del contrato canónico.
const PATCH_TO_CANONICAL: Record<string, string> = {
  title: "title",
  slug: "slug",
  category: "category",
  excerpt: "excerpt",
  heroImage: "heroImage",
  readTime: "readTime",
  tags: "tags",
  content: "content",
  author: "author",
  references: "references",
  nextArticle: "nextArticle",
  publishedAt: "date",
};

/**
 * Actualización: el resultado debe cumplir el contrato si queda en PUBLISHED/SCHEDULED.
 *  - Si el PATCH PUBLICA un artículo que no lo estaba: se valida el artículo completo resultante.
 *  - Si edita uno ya publicado: se exigen solo los campos que el PATCH toca. Así corregir una errata
 *    en uno de los artículos antiguos (hoy 10 solo tienen 2 etiquetas guardadas) no queda bloqueado
 *    por defectos que ya tenía y que el PATCH no empeora.
 *  - Si el resultado es borrador/pausado/archivado: laxo.
 * `content` en forma de texto se estructura con `parseMarkdownToSections` (el mismo camino que el POST)
 * y se valida como cualquier otro contenido.
 */
export function checkPatchForPublication(existing: StoredBlogArticle, patch: PatchLike): PublicationCheck {
  const resultingStatus = patch.status ?? existing.status;
  if (!PUBLISHING_STATUSES.has(resultingStatus)) return { ok: true };

  const publishing = patch.status !== undefined && !PUBLISHING_STATUSES.has(existing.status);

  const merged = {
    slug: patch.slug ?? existing.slug,
    title: patch.title ?? existing.title,
    category: patch.category ?? existing.category,
    date: patch.publishedAt ? patch.publishedAt.split("T")[0] : existing.date,
    readTime: patch.readTime ?? existing.readTime,
    excerpt: patch.excerpt ?? existing.excerpt,
    heroImage: patch.heroImage ?? existing.heroImage,
    author: { ...existing.author, ...(patch.author ?? {}) },
    // Un `content` en texto se valida ya estructurado, igual que lo guardará el almacén.
    content:
      typeof patch.content === "string"
        ? parseMarkdownToSections(patch.content)
        : patch.content !== undefined && typeof patch.content === "object"
          ? patch.content
          : existing.content,
    tags: patch.tags ?? existing.tags,
    nextArticle: patch.nextArticle !== undefined ? patch.nextArticle : existing.nextArticle,
    references: patch.references !== undefined ? patch.references : existing.references,
    dateModified: existing.dateModified,
  };

  const result = blogArticleSchema.safeParse(merged);
  if (result.success) return { ok: true };

  const touched = new Set(
    Object.keys(patch)
      .map((key) => PATCH_TO_CANONICAL[key])
      .filter((key): key is string => Boolean(key)),
  );
  const relevant = result.error.issues.filter((issue) => publishing || touched.has(String(issue.path[0])));
  if (relevant.length === 0) return { ok: true };
  return { ok: false, issues: relevant.map((issue) => describe(issue.path, issue.message)) };
}
