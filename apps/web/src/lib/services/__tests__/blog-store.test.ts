import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";

/**
 * La base de datos se SIMULA a propósito (OPS-001/OPS-002). Antes este archivo pasaba solo
 * porque el entorno de test dejaba `DATABASE_URL` apuntando a un puerto muerto: la base
 * fallaba "por accidente" y se ejercitaba el respaldo en disco sin que el test lo supiera.
 * Aquí cada caso decide si la base responde o falla, y el respaldo en disco es siempre un
 * archivo temporal propio (`BLOG_ARTICLES_FILE`), nunca `content/blog/articles.json`.
 */

type Row = Record<string, unknown> & { id: string; portal: string; slug: string };

const db = vi.hoisted(() => ({
  rows: [] as Row[],
  failing: false,
  error: new Error("db caída (simulada)"),
  seq: 0,
}));

vi.mock("@ia-next/database", () => {
  const guard = () => {
    if (db.failing) throw db.error;
  };
  return {
    prisma: {
      blogPost: {
        findMany: vi.fn(async () => {
          guard();
          return [...db.rows].sort(
            (a, b) =>
              new Date(b.publishedAt as string).getTime() - new Date(a.publishedAt as string).getTime(),
          );
        }),
        upsert: vi.fn(
          async (args: {
            where: { portal_slug: { portal: string; slug: string } };
            create: Record<string, unknown>;
            update: Record<string, unknown>;
          }) => {
            guard();
            const { portal, slug } = args.where.portal_slug;
            const now = new Date();
            const index = db.rows.findIndex((r) => r.portal === portal && r.slug === slug);
            if (index >= 0) {
              db.rows[index] = { ...db.rows[index], ...args.update, updatedAt: now };
              return db.rows[index];
            }
            const row = {
              id: `db_${++db.seq}`,
              references: null,
              nextArticle: null,
              createdAt: now,
              updatedAt: now,
              ...args.create,
            } as Row;
            db.rows.push(row);
            return row;
          },
        ),
        delete: vi.fn(async ({ where }: { where: { id: string } }) => {
          guard();
          const index = db.rows.findIndex((r) => r.id === where.id);
          if (index < 0) throw new Error("registro no encontrado (simulado)");
          return db.rows.splice(index, 1)[0];
        }),
      },
    },
  };
});

const reportDegradation = vi.hoisted(() => vi.fn());
vi.mock("@/lib/observability/degradation", () => ({ reportDegradation }));

import {
  parseMarkdownToSections,
  slugify,
  createStoredArticle,
  deleteStoredArticle,
  estimateReadTime,
  getStoredArticles,
  getStoredArticlesStrict,
  getStoredArticlesFromDisk,
  saveStoredArticlesToDisk,
  type StoredBlogArticle,
} from "../blog-store";
import { getArticle, getAllArticles } from "../../blog-articles";

const FUTURE = "2099-12-31T23:59:59.000Z";

function diskArticle(overrides: Partial<StoredBlogArticle> = {}): StoredBlogArticle {
  return {
    id: "art_disco_1",
    portal: "ia",
    slug: "articulo-solo-en-disco",
    title: "Artículo solo en disco",
    category: "IA",
    date: "2026-01-01",
    readTime: 1,
    excerpt: "Vive únicamente en el archivo de respaldo",
    heroImage: "/images/portal-ia/blog/llm-transformers-architecture.jpg",
    author: { name: "Pablo Cubides", avatar: "/a.png", bio: "bio" },
    content: { introduction: "intro", sections: [], conclusion: "fin" },
    tags: ["IA"],
    status: "PUBLISHED",
    source: "AGENT",
    publishedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  } as StoredBlogArticle;
}

function dbRow(overrides: Record<string, unknown> = {}): Row {
  const now = new Date("2026-02-01T00:00:00.000Z");
  return {
    id: `db_fila_${++db.seq}`,
    portal: "IA",
    slug: "articulo-en-base",
    title: "Artículo en la base",
    category: "IA",
    excerpt: "Vive en PostgreSQL",
    content: { introduction: "intro", sections: [], conclusion: "fin" },
    heroImage: null,
    authorName: null,
    authorAvatar: null,
    authorBio: null,
    readTime: 1,
    tags: ["IA"],
    status: "PUBLISHED",
    source: "AGENT",
    references: null,
    nextArticle: null,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as Row;
}

let tmpDir: string;
let articlesFile: string;

beforeEach(() => {
  db.rows = [];
  db.failing = false;
  db.seq = 0;
  reportDegradation.mockClear();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "blog-store-test-"));
  articlesFile = path.join(tmpDir, "articles.json");
  vi.stubEnv("BLOG_ARTICLES_FILE", articlesFile);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("Blog Store: utilidades puras", () => {
  it("slugify creates url-safe lowercase slugs without accents", () => {
    expect(slugify("¿Cómo funciona la Inteligencia Artificial?")).toBe(
      "como-funciona-la-inteligencia-artificial",
    );
  });

  it("estimateReadTime usa ceil(palabras / 200), no la longitud del JSON", () => {
    const words = (n: number) => Array.from({ length: n }, () => "palabra").join(" ");
    expect(estimateReadTime({ introduction: words(200) })).toBe(1);
    expect(estimateReadTime({ introduction: words(201) })).toBe(2);
    expect(
      estimateReadTime({
        introduction: words(100),
        sections: [{ title: "Titulo", content: words(499) }],
        conclusion: words(100),
      }),
    ).toBe(4); // 100 + 1 + 499 + 100 = 700 palabras
    expect(estimateReadTime({ introduction: "" })).toBe(1);
  });

  it("parseMarkdownToSections extracts introduction, headings, and conclusion", () => {
    const markdown = `# Título Principal
Esta es la introducción del post.

## Primera Sección
Contenido de la primera sección.

## Conclusión
Resumen final del artículo.`;

    const parsed = parseMarkdownToSections(markdown);
    expect(parsed.introduction).toBe("Esta es la introducción del post.");
    expect(parsed.sections).toHaveLength(1);
    expect(parsed.sections[0].title).toBe("Primera Sección");
    expect(parsed.conclusion).toBe("Resumen final del artículo.");
  });
});

describe("Blog Store: la base de datos RESPONDE", () => {
  it("assigns SCHEDULED status when publishedAt is in the future", async () => {
    const article = await createStoredArticle({
      portal: "ia",
      title: "Artículo Futuro 2099",
      excerpt: "Prueba futura",
      content: "Contenido",
      publishedAt: FUTURE,
      // status omitido: lo decide la función
    });

    expect(article.status).toBe("SCHEDULED");
    // Se guardó en la base simulada, no en el respaldo local de fallo.
    expect(db.rows).toHaveLength(1);
    expect(article.id).toBe(db.rows[0].id);
    expect(article.id.startsWith("art_")).toBe(false);
  });

  it("assigns SCHEDULED status even if status was sent as PUBLISHED for a future date", async () => {
    const article = await createStoredArticle({
      portal: "ia",
      title: "Artículo Futuro Forzado 2099",
      excerpt: "Prueba futura",
      content: "Contenido",
      publishedAt: FUTURE,
      status: "PUBLISHED",
    });

    expect(article.status).toBe("SCHEDULED");
    expect(db.rows[0].status).toBe("SCHEDULED");
  });

  it("hides future-dated articles from public getArticle and getAllArticles", async () => {
    const created = await createStoredArticle({
      portal: "ia",
      title: "Post Secreto Futuro 2099",
      excerpt: "Oculto para el público",
      content: "No debe verse públicamente",
      publishedAt: FUTURE,
    });

    expect(await getArticle("ia", created.slug)).toBeNull();
    const adminResult = await getArticle("ia", created.slug, true);
    expect(adminResult?.title).toBe("Post Secreto Futuro 2099");

    expect((await getAllArticles("ia")).some((a) => a.slug === created.slug)).toBe(false);
    expect((await getAllArticles("ia", true)).some((a) => a.slug === created.slug)).toBe(true);

    // Con la base respondiendo no hubo degradación.
    expect(reportDegradation).not.toHaveBeenCalled();
  });

  it("getStoredArticles devuelve las filas de la base, sin tocar el disco ni avisar", async () => {
    // El respaldo en disco trae OTRO artículo: si se leyera, se vería mezclado.
    saveStoredArticlesToDisk([diskArticle()]);
    db.rows.push(dbRow());

    const stored = await getStoredArticles();

    expect(stored.map((a) => a.slug)).toEqual(["articulo-en-base"]);
    expect(reportDegradation).not.toHaveBeenCalled();
  });

  it("deleteStoredArticle borra de la base", async () => {
    const row = dbRow();
    db.rows.push(row);

    await expect(deleteStoredArticle(row.id)).resolves.toBe(true);
    expect(db.rows).toHaveLength(0);
  });
});

describe("Blog Store: la base de datos FALLA y se cae al respaldo en disco", () => {
  beforeEach(() => {
    db.failing = true;
  });

  it("getStoredArticles lee BLOG_ARTICLES_FILE e invoca reportDegradation", async () => {
    fs.writeFileSync(articlesFile, JSON.stringify([diskArticle()]), "utf-8");

    const stored = await getStoredArticles();

    expect(stored.map((a) => a.slug)).toEqual(["articulo-solo-en-disco"]);
    expect(reportDegradation).toHaveBeenCalledTimes(1);
    expect(reportDegradation).toHaveBeenCalledWith("blog-store-db-fallback", db.error, {
      articlesFromDisk: 1,
    });
  });

  it("sin archivo de respaldo devuelve [] y aun así avisa de la degradación", async () => {
    expect(fs.existsSync(articlesFile)).toBe(false);

    await expect(getStoredArticles()).resolves.toEqual([]);

    expect(reportDegradation).toHaveBeenCalledWith("blog-store-db-fallback", db.error, {
      articlesFromDisk: 0,
    });
  });

  it("getStoredArticlesStrict NO cae al disco: lanza y no avisa (quien lo usa necesita saber)", async () => {
    fs.writeFileSync(articlesFile, JSON.stringify([diskArticle()]), "utf-8");

    await expect(getStoredArticlesStrict()).rejects.toBe(db.error);
    expect(reportDegradation).not.toHaveBeenCalled();
  });

  it("getArticle sigue sirviendo el artículo del respaldo en disco", async () => {
    fs.writeFileSync(articlesFile, JSON.stringify([diskArticle()]), "utf-8");

    const article = await getArticle("ia", "articulo-solo-en-disco");

    expect(article?.title).toBe("Artículo solo en disco");
    expect(reportDegradation).toHaveBeenCalledWith(
      "blog-store-db-fallback",
      db.error,
      expect.any(Object),
    );
  });

  it("createStoredArticle guarda en BLOG_ARTICLES_FILE con id de respaldo (art_…)", async () => {
    const article = await createStoredArticle({
      portal: "ia",
      title: "Creado sin base",
      excerpt: "Va al respaldo",
      content: "Contenido",
    });

    expect(article.id.startsWith("art_")).toBe(true);
    expect(db.rows).toHaveLength(0);
    const onDisk = JSON.parse(fs.readFileSync(articlesFile, "utf-8")) as StoredBlogArticle[];
    expect(onDisk.map((a) => a.slug)).toEqual(["creado-sin-base"]);
  });

  it("deleteStoredArticle borra del respaldo en disco cuando la base falla", async () => {
    saveStoredArticlesToDisk([diskArticle(), diskArticle({ id: "art_disco_2", slug: "otro" })]);

    await expect(deleteStoredArticle("art_disco_1")).resolves.toBe(true);

    expect(getStoredArticlesFromDisk().map((a) => a.id)).toEqual(["art_disco_2"]);
  });
});
