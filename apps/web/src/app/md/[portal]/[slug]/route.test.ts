import { beforeEach, describe, expect, it, vi } from "vitest";

const { getArticlesForIndexing } = vi.hoisted(() => ({ getArticlesForIndexing: vi.fn() }));
vi.mock("@/lib/articles-for-indexing", () => ({ getArticlesForIndexing }));

import { GET, generateStaticParams } from "./route";

const article = (slug: string) => ({
  slug,
  title: `Titulo ${slug}`,
  category: "Gestión Ambiental",
  date: "2026-01-02",
  readTime: 5,
  excerpt: "Resumen.",
  heroImage: "/x.jpg",
  author: { name: "Autor", avatar: "/a.jpg" },
  tags: ["a"],
  content: { introduction: "Intro con **negrita**.", sections: [{ id: "s", title: "Sec", content: "Texto de la sección." }] },
});

beforeEach(() => getArticlesForIndexing.mockReset());

describe("/<portal>/blog/<slug>.md", () => {
  it("generateStaticParams lista todos los articulos de ambos portales", async () => {
    getArticlesForIndexing.mockImplementation(async (portal: string) => [article(`${portal}-uno`), article(`${portal}-dos`)]);
    expect(await generateStaticParams()).toHaveLength(4);
  });

  it("si la fuente falla (produccion) generateStaticParams LANZA: no se publica una lista parcial", async () => {
    getArticlesForIndexing.mockImplementation(async (portal: string) => {
      if (portal === "ambiental") throw new Error("BD caida");
      return [article("ia-uno")];
    });
    let thrown: unknown;
    try {
      await generateStaticParams();
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(Error);
  });

  it("responde Markdown limpio con canonical por cabecera Link", async () => {
    getArticlesForIndexing.mockResolvedValue([article("a")]);
    const res = await GET(new Request("http://x"), { params: Promise.resolve({ portal: "ia", slug: "a" }) });
    expect(res.headers.get("content-type")).toContain("text/markdown");
    expect(res.headers.get("link")).toMatch(/\/ia\/blog\/a>; rel="canonical"/);
    const text = await res.text();
    expect(text).toMatch(/^# Titulo a/);
    expect(text).not.toMatch(/\*\*/);
  });

  it("slug o portal inexistentes dan 404", async () => {
    getArticlesForIndexing.mockResolvedValue([article("a")]);
    expect((await GET(new Request("http://x"), { params: Promise.resolve({ portal: "ia", slug: "no" }) })).status).toBe(404);
    expect((await GET(new Request("http://x"), { params: Promise.resolve({ portal: "otro", slug: "a" }) })).status).toBe(404);
  });
});
