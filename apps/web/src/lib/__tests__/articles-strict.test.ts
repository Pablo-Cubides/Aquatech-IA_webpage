/**
 * Variante estricta de la lectura de artículos (ARQ-004).
 *
 * Qué se protege: hay DOS capas que tragan el error de la base de datos (getStoredArticles y
 * getAllArticles). Con la base caída, un consumidor que mira `length` solo ve un número menor,
 * nunca un error. Estas pruebas fijan que el camino estricto lanza, que el tolerante degrada, y
 * que con la base sana los dos devuelven exactamente lo mismo.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({ down: false, rows: [] as unknown[] }));

vi.mock("@/lib/services/blog-store", () => ({
  // Estricto: sin try/catch, como el real.
  getStoredArticlesStrict: async () => {
    if (db.down) throw new Error("connection refused");
    return db.rows;
  },
  // Tolerante: la base caída se traga y cae al caché de disco (vacío aquí), como el real.
  getStoredArticles: async () => (db.down ? [] : db.rows),
  getStoredArticlesSync: () => [],
}));
vi.mock("@/lib/observability/degradation", () => ({ reportDegradation: vi.fn() }));
vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() } }));

import { getAllArticles, getAllArticlesStrict } from "@/lib/blog-articles";
import {
  getArticlesForIndexing,
  getPublishedArticleCount,
  mustBeComplete,
} from "@/lib/articles-for-indexing";
import { reportDegradation } from "@/lib/observability/degradation";

function dbRow(portal: "ia" | "ambiental", slug: string, over: Record<string, unknown> = {}) {
  return {
    id: slug,
    portal,
    slug,
    title: `Articulo ${slug}`,
    category: "Test",
    date: "2026-03-01",
    readTime: 3,
    excerpt: "Resumen",
    heroImage: "/x.jpg",
    author: { name: "Autor", avatar: "/a.png" },
    content: { introduction: "Intro", sections: [] },
    tags: ["a", "b", "c"],
    status: "PUBLISHED",
    source: "AGENT",
    publishedAt: "2026-03-01T00:00:00.000Z",
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
    ...over,
  };
}

const slugs = (list: { slug: string }[]) => list.map((a) => a.slug).sort();

beforeEach(() => {
  db.down = false;
  db.rows = [
    dbRow("ia", "solo-en-base-de-datos"),
    dbRow("ia", "borrador-no-publico", { status: "DRAFT" }),
    dbRow("ia", "programado-en-el-futuro", { status: "SCHEDULED", publishedAt: "2999-01-01T00:00:00.000Z" }),
    // Mismo slug que uno de código: la base de datos manda.
    dbRow("ia", "difusion-stable-diffusion", { title: "Editado desde el admin" }),
    dbRow("ambiental", "solo-ambiental-en-base-de-datos"),
  ];
  vi.mocked(reportDegradation).mockClear();
});
afterEach(() => vi.unstubAllEnvs());

describe("con la base de datos sana", () => {
  it.each(["ia", "ambiental"] as const)("getAllArticlesStrict coincide con getAllArticles (%s)", async (portal) => {
    const strict = await getAllArticlesStrict(portal);
    const lenient = await getAllArticles(portal);
    expect(slugs(strict)).toEqual(slugs(lenient));
    expect(strict).toHaveLength(lenient.length);
  });

  it("aplica el mismo filtrado y la misma precedencia: borrador y futuro fuera, la base manda", async () => {
    const ia = await getAllArticlesStrict("ia");
    const list = slugs(ia);
    expect(list).toContain("solo-en-base-de-datos");
    expect(list).not.toContain("borrador-no-publico");
    expect(list).not.toContain("programado-en-el-futuro");
    expect(ia.find((a) => a.slug === "difusion-stable-diffusion")?.title).toBe("Editado desde el admin");
    // un artículo ambiental de la base no aparece en el portal IA
    expect(list).not.toContain("solo-ambiental-en-base-de-datos");
  });

  it("el contador coincide con el listado completo", async () => {
    expect(await getPublishedArticleCount("ia")).toBe((await getAllArticles("ia")).length);
    expect(await getPublishedArticleCount("ambiental")).toBe((await getAllArticles("ambiental")).length);
  });

  it("getArticlesForIndexing devuelve el conjunto completo", async () => {
    expect(slugs(await getArticlesForIndexing("ia"))).toEqual(slugs(await getAllArticlesStrict("ia")));
  });
});

describe("con la base de datos caída", () => {
  beforeEach(() => {
    db.down = true;
  });

  it("getAllArticlesStrict lanza; getAllArticles degrada en silencio al código", async () => {
    await expect(getAllArticlesStrict("ia")).rejects.toThrow("connection refused");
    const degraded = await getAllArticles("ia");
    expect(degraded.length).toBeGreaterThan(0);
    expect(slugs(degraded)).not.toContain("solo-en-base-de-datos");
  });

  it("el contador devuelve null: el consumidor no pinta la cifra", async () => {
    expect(await getPublishedArticleCount("ia")).toBeNull();
    expect(await getPublishedArticleCount("ambiental")).toBeNull();
  });

  it("en producción de Vercel el fallo se propaga (rompe el build / conserva la última versión buena)", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    await expect(getArticlesForIndexing("ia")).rejects.toThrow(/Contenido incompleto/);
  });

  it("ALLOW_INCOMPLETE_CONTENT=1 permite desplegar a sabiendas, y deja señal", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("ALLOW_INCOMPLETE_CONTENT", "1");
    const list = await getArticlesForIndexing("ia");
    expect(list.length).toBeGreaterThan(0);
    expect(reportDegradation).toHaveBeenCalledWith("indexable-articles-incomplete", expect.anything(), { portal: "ia" });
  });

  it("fuera de producción degrada con señal en lugar de romper", async () => {
    vi.stubEnv("VERCEL_ENV", "");
    const list = await getArticlesForIndexing("ambiental");
    expect(list.length).toBeGreaterThan(0);
    expect(reportDegradation).toHaveBeenCalledWith("indexable-articles-incomplete", expect.anything(), { portal: "ambiental" });
  });
});

describe("mustBeComplete", () => {
  it("solo exige completitud en producción de Vercel y respeta la salida de emergencia", () => {
    expect(mustBeComplete({ VERCEL_ENV: "production" })).toBe(true);
    expect(mustBeComplete({ VERCEL_ENV: "preview" })).toBe(false);
    expect(mustBeComplete({})).toBe(false);
    expect(mustBeComplete({ VERCEL_ENV: "production", ALLOW_INCOMPLETE_CONTENT: "1" })).toBe(false);
  });
});
