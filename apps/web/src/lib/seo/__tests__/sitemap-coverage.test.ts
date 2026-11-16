/**
 * Cobertura del sitemap: toda pagina real del App Router debe estar en el sitemap o figurar aqui como excluida con su motivo.
 * Si agregas una pagina publica y esta prueba falla: agregala a sitemap.ts (o, si no debe indexarse, a EXCLUDED con su razon).
 */
import fs from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/blog-seo", () => ({
  getCategories: (portal: string) => [
    { slug: `${portal}-cat-a`, noindex: false },
    { slug: `${portal}-cat-oculta`, noindex: true },
  ],
  getAllArticles: async (portal: string) => [{ slug: `${portal}-articulo`, date: "2026-01-02" }],
}));

import sitemap from "@/app/sitemap";
import { getToolsByPortal } from "@/lib/services/tools-registry";

const APP_DIR = path.resolve(__dirname, "../../../app");

/** Paginas existentes que NO deben estar en el sitemap, con el motivo. Una entrada por ruta o por prefijo ("/x/*"). */
const EXCLUDED: Record<string, string> = {
  "/admin/*": "privado: robots.txt lo prohibe",
  "/auth/*": "privado: robots.txt lo prohibe",
  "/guia/[slug]": "301 declarado en next.config.mjs para cada slug",
  "/guia/ecostats": "301 a /ambiental/herramientas/analisis-correlaciones",
  "/ia/perfil": "noindex: pagina privada",
  "/ambiental/perfil": "noindex: pagina privada",
  "/ia/cursos": "noindex deliberado (cursos congelados)",
  "/ambiental/cursos": "noindex deliberado (cursos congelados)",
  "/ia/links": "duplicado de /links: canonica apunta a /links",
  "/ambiental/links": "duplicado de /links: canonica apunta a /links",
  "/ia/productos": "pendiente de decision PROD/CONT: catalogo con enlaces a rutas inexistentes y precios",
  "/ambiental/herramientas/normas-ambientales/explorar": "pendiente: pagina cliente sin metadata propia (proxy de un componente)",
  "/ambiental/herramientas/generador-matrices/builder/[caseId]/[matriz]": "herramienta interactiva por caso de usuario; sin contenido propio",
  "/ia/autor/herramientas/aquaquiz/*": "noindex en su layout",
  "/ia/autor/herramientas/consulta-nota": "noindex: consulta privada de calificaciones",
  "/ia/autor/herramientas/proyectos-investigacion/admin": "noindex: panel de gestion",
  "/ambiental/autor/herramientas/proyectos-investigacion/admin": "noindex: panel de gestion",
  "/ia/autor/herramientas/aula-score": "pendiente: herramienta de aula sin metadata propia",
  "/ia/autor/herramientas/aula-score/clasificacion": "pendiente: herramienta de aula sin metadata propia",
  "/ia/autor/herramientas/ruleta-academica": "pendiente: herramienta de aula",
  "/ia/autor/herramientas/ruleta-academica/juego": "pendiente: herramienta de aula",
  "/ia/autor/herramientas/proyectos-investigacion": "pendiente: herramienta del autor sin metadata propia",
  "/ia/autor/herramientas/proyectos-investigacion/[id]": "pendiente: herramienta del autor sin metadata propia",
  "/ambiental/autor/herramientas/*": "espejo del Portal IA: la canonica apunta a /ia/autor/herramientas/* (consulta-nota y ruleta-academica redirigen 301 a /ia)",
};

/** Rutas dinamicas y como las cubre el sitemap (por datos). */
const DYNAMIC_COVERED: Record<string, string> = {
  "/ia/blog/[slug]": "articulos del portal IA",
  "/ambiental/blog/[slug]": "articulos del portal ambiental",
  "/ia/categoria/[slug]": "categorias sin noindex",
  "/ambiental/categoria/[slug]": "categorias sin noindex",
  "/ia/herramientas/[slug]": "registro de herramientas (las que no tienen carpeta propia)",
  "/ambiental/herramientas/[slug]": "registro de herramientas (las que no tienen carpeta propia)",
  "/ambiental/herramientas/generador-matrices/matrices/[type]": "leopold, conesa, battelle",
};

function discoverRoutes(dir: string, segments: string[] = []): string[] {
  const routes: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      if (entry.name === "page.tsx") routes.push("/" + segments.join("/"));
      continue;
    }
    if (entry.name === "api" || entry.name === "src") continue; // "src" anidados son restos que Next no enruta
    const isGroup = /^\(.+\)$/.test(entry.name);
    routes.push(...discoverRoutes(path.join(dir, entry.name), isGroup ? segments : [...segments, entry.name]));
  }
  return routes;
}

const isExcluded = (route: string) =>
  Object.keys(EXCLUDED).some((key) => (key.endsWith("/*") ? route === key.slice(0, -2) || route.startsWith(key.slice(0, -1)) : key === route));

describe("sitemap.xml: cobertura de paginas", () => {
  let urls: string[] = [];
  let pathnames: Set<string>;

  beforeAll(async () => {
    urls = (await sitemap()).map((entry) => entry.url);
    pathnames = new Set(urls.map((url) => new URL(url).pathname.replace(/\/$/, "") || "/"));
  });

  it("toda pagina real esta en el sitemap, es dinamica cubierta o esta excluida con motivo", () => {
    const routes = discoverRoutes(APP_DIR).map((r) => (r === "/" ? "/" : r.replace(/\/$/, "")));
    expect(routes.length).toBeGreaterThan(50);
    const unlisted = routes.filter((route) => !pathnames.has(route) && !(route in DYNAMIC_COVERED) && !isExcluded(route));
    expect(unlisted, `Paginas publicas sin listar en sitemap.ts ni en EXCLUDED:\n${unlisted.join("\n")}`).toEqual([]);
  });

  it("ninguna URL del sitemap esta en EXCLUDED (no listar noindex, redirecciones ni duplicados)", () => {
    const listed = [...pathnames].filter((pathname) => isExcluded(pathname));
    expect(listed, `URLs excluidas que estan en el sitemap:\n${listed.join("\n")}`).toEqual([]);
  });

  it("no hay URLs duplicadas ni /guia/<slug> (son 301)", () => {
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.filter((url) => /\/guia\/.+/.test(url))).toEqual([]);
  });

  it("incluye el indice, las herramientas de ambos portales y las paginas de metodologia de matrices", () => {
    for (const portal of ["ia", "ambiental"] as const) {
      for (const tool of getToolsByPortal(portal)) expect(pathnames, tool.url).toContain(tool.url);
    }
    for (const type of ["leopold", "conesa", "battelle"]) {
      expect(pathnames).toContain(`/ambiental/herramientas/generador-matrices/matrices/${type}`);
    }
    expect(pathnames).toContain("/");
  });

  it("las rutas dinamicas declaradas existen en el App Router (la lista no queda obsoleta)", () => {
    const routes = new Set(discoverRoutes(APP_DIR));
    for (const route of Object.keys(DYNAMIC_COVERED)) expect(routes, route).toContain(route);
    for (const key of Object.keys(EXCLUDED).filter((k) => !k.endsWith("/*"))) expect(routes, key).toContain(key);
  });
});
