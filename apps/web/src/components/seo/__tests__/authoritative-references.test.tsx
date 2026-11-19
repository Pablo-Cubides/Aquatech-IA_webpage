/**
 * VIS-005: las fuentes de un artículo son solo sus `references` reales; nada por defecto.
 */
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getStaticArticles } from "@/lib/blog-articles";
import { AuthoritativeReferences } from "../AuthoritativeReferences";
import {
  AMBIENTAL_OFFICIAL_RESOURCES,
  IA_OFFICIAL_RESOURCES,
  OFFICIAL_RESOURCES_SUBTITLE,
  OFFICIAL_RESOURCES_TITLE,
} from "../official-resources";

vi.mock("@/lib/blog-articles", async () => {
  const actual = await vi.importActual<typeof import("@/lib/blog-articles")>("@/lib/blog-articles");
  return { ...actual, getArticle: vi.fn(), getAllArticles: vi.fn(async () => []) };
});

const SRC = path.resolve(__dirname, "../../..");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "__tests__") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx?|mdx?)$/.test(entry.name) && !/\.test\./.test(entry.name)) out.push(full);
  }
  return out;
}

describe("AuthoritativeReferences", () => {
  it("pinta exactamente las fuentes recibidas", () => {
    const sources = [
      { title: "Fuente A", url: "https://a.example/x", source: "A" },
      { title: "Fuente B", url: "https://b.example/y", source: "B", description: "Descripción B" },
    ];
    const html = renderToStaticMarkup(<AuthoritativeReferences sources={sources} />);
    expect(html).toContain("Fuente A");
    expect(html).toContain("https://a.example/x");
    expect(html).toContain("Descripción B");
    expect((html.match(/<li/g) ?? []).length).toBe(2);
  });

  it("con lista vacía no pinta nada", () => {
    expect(renderToStaticMarkup(<AuthoritativeReferences sources={[]} />)).toBe("");
  });
});

describe("listas explícitas de portadas e índices", () => {
  it.each([
    ["ia", IA_OFFICIAL_RESOURCES, 5],
    ["ambiental", AMBIENTAL_OFFICIAL_RESOURCES, 4],
  ])("portal %s: https, sin duplicados y sin URL retiradas", (_portal, list, count) => {
    expect(list).toHaveLength(count);
    const urls = list.map((item) => item.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) expect(url).toMatch(/^https:\/\//);
    for (const url of urls) {
      expect(url).not.toMatch(/doi\.org\/10\.1109\/TPAMI|nlp\.stanford\.edu|arxiv\.org\/corr|^https:\/\/www\.w3\.org\/?$/);
    }
    for (const item of list) expect(item.description).toBeTruthy();
  });

  it("título y subtítulo acordados", () => {
    expect(OFFICIAL_RESOURCES_TITLE).toBe("Recursos oficiales para profundizar");
    expect(OFFICIAL_RESOURCES_SUBTITLE).toBe("Organismos y publicaciones de referencia sobre el tema de esta sección.");
  });
});

describe("guarda estática: sin fuentes por defecto", () => {
  const files = walk(SRC);

  it("no queda ninguna lista por defecto ni la prop customSources", () => {
    const offenders = files.filter((file) =>
      /DEFAULT_(AMBIENTAL|IA)_SOURCES|defaultIASources|defaultAmbientalSources|customSources/.test(fs.readFileSync(file, "utf8")),
    );
    expect(offenders.map((file) => path.relative(SRC, file))).toEqual([]);
  });

  it("todo <AuthoritativeReferences> recibe `sources`", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const text = fs.readFileSync(file, "utf8");
      for (const match of text.matchAll(/<AuthoritativeReferences\b([\s\S]*?)\/>/g)) {
        if (!/\bsources=/.test(match[1])) offenders.push(path.relative(SRC, file));
      }
    }
    expect(offenders).toEqual([]);
  });

  it("solo las portadas, los índices de blog y las páginas de artículo usan el componente", () => {
    const users = files
      .filter((file) => !file.endsWith("AuthoritativeReferences.tsx") && /<AuthoritativeReferences\b/.test(fs.readFileSync(file, "utf8")))
      .map((file) => path.relative(SRC, file).split(path.sep).join("/"))
      .sort();
    expect(users).toEqual([
      "app/(portals)/ambiental/(marketing)/blog/[slug]/page.tsx",
      "app/(portals)/ambiental/(marketing)/blog/page.tsx",
      "app/(portals)/ambiental/page.tsx",
      "app/(portals)/ia/(marketing)/blog/[slug]/page.tsx",
      "app/(portals)/ia/(marketing)/blog/page.tsx",
      "app/(portals)/ia/page.tsx",
    ]);
  });
});

describe("páginas de artículo", () => {
  const cases = [
    { portal: "ia" as const, load: () => import("@/app/(portals)/ia/(marketing)/blog/[slug]/page") },
    { portal: "ambiental" as const, load: () => import("@/app/(portals)/ambiental/(marketing)/blog/[slug]/page") },
  ];

  for (const { portal, load } of cases) {
    const articles = getStaticArticles(portal);
    const withRefs = articles.find((article) => article.references?.length);
    if (!withRefs) throw new Error(`hace falta al menos un artículo de ${portal} con references`);
    const references = withRefs.references ?? [];
    // Sintéticos: no dependen de cuántos artículos tengan referencias hoy ni mañana.
    const withoutRefs = { ...withRefs, references: undefined };
    const withEmptyRefs = { ...withRefs, references: [] };

    async function render(article: (typeof articles)[number]) {
      const { getArticle } = await import("@/lib/blog-articles");
      vi.mocked(getArticle).mockResolvedValue(article);
      const page = await load();
      const element = await page.default({ params: Promise.resolve({ slug: article.slug }) });
      return renderToStaticMarkup(element as React.ReactElement);
    }

    it(`${portal}: con references pinta exactamente esas fuentes`, async () => {
      const html = await render(withRefs);
      expect(html).toContain('aria-label="Fuentes y Referencias Autoritativas"');
      const block = html.match(/<aside aria-label="Fuentes y Referencias Autoritativas"[\s\S]*?<\/aside>/)?.[0] ?? "";
      expect((block.match(/<li/g) ?? []).length).toBe(references.length);
      for (const ref of references) expect(block).toContain(ref.title.slice(0, 40).replace(/&/g, "&amp;"));
    });

    const articleJsonLd = (html: string) => {
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
      return blocks.find((block) => block["@type"] === "Article");
    };

    it(`${portal}: sin references no hay bloque de fuentes ni citation`, async () => {
      for (const article of [withoutRefs, withEmptyRefs]) {
        const html = await render(article);
        expect(html).not.toContain("Fuentes y Referencias Autoritativas");
        const ld = articleJsonLd(html);
        expect(ld).toBeTruthy();
        expect(ld).not.toHaveProperty("citation");
      }
    });

    it(`${portal}: con references el JSON-LD emite citation con esas referencias y solo esas`, async () => {
      const ld = articleJsonLd(await render(withRefs));
      expect(ld?.citation).toEqual(
        references.map((ref) => ({ "@type": "CreativeWork", name: ref.title, url: ref.url })),
      );
    });
  }
});
