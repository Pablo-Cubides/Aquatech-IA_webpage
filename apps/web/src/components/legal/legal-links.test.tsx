/**
 * Los enlaces de las páginas legales deben llevar a una página que exista (ING-002).
 * La política de privacidad apuntaba a https://aquatechia.com/contacto, que devolvía 404: un
 * formulario de contacto que nunca existió, escrito en el documento donde el visitante busca cómo
 * ejercer sus derechos.
 *
 * Se renderiza cada página legal y se resuelve cada ruta interna contra los `page.tsx` reales de
 * `src/app` (ignorando los grupos de rutas `(portals)`, `(marketing)`).
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { describe, expect, it } from "vitest";
import PrivacyContent from "./PrivacyContent";
import TermsContent from "./TermsContent";
import { SITE_URL } from "@/lib/site-config";

const APP_DIR = resolve(__dirname, "../../app");

function routas(dir: string, prefix: string, out: Set<string>): Set<string> {
  if (existsSync(join(dir, "page.tsx")) || existsSync(join(dir, "page.ts"))) out.add(prefix || "/");
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    const esGrupo = name.startsWith("(") && name.endsWith(")");
    routas(full, esGrupo ? prefix : `${prefix}/${name}`, out);
  }
  return out;
}

const RUTAS = routas(APP_DIR, "", new Set<string>());

/** Rutas internas citadas en el HTML: `href="/x"` y URLs absolutas del propio sitio en el texto. */
function rutasInternasEn(html: string): string[] {
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]);
  // URLs absolutas del propio sitio escritas en el texto: lo que sigue a SITE_URL hasta el primer
  // carácter que no es de una ruta.
  const absolutas = html
    .split(SITE_URL)
    .slice(1)
    .map((resto) => {
      const ruta = /^\/[A-Za-z0-9_/-]*/.exec(resto)?.[0];
      // Un archivo (logo.png) es un recurso estático, no una ruta de página.
      return ruta && /^\.[a-z]/i.test(resto.slice(ruta.length)) ? undefined : ruta;
    })
    .filter((r): r is string => Boolean(r));
  return [...new Set([...hrefs, ...absolutas])].map((r) => (r.length > 1 ? r.replace(/\/$/, "") : r));
}

describe("enlaces internos de las páginas legales", () => {
  it.each([
    ["privacidad IA", PrivacyContent, "ia"],
    ["privacidad ambiental", PrivacyContent, "ambiental"],
    ["términos IA", TermsContent, "ia"],
    ["términos ambiental", TermsContent, "ambiental"],
  ] as const)("%s: toda ruta citada existe", (_nombre, Component, portal) => {
    const html = renderToStaticMarkup(React.createElement(Component, { portal }));
    const citadas = rutasInternasEn(html);
    expect(citadas.length).toBeGreaterThan(0);
    const rotas = citadas.filter((r) => !RUTAS.has(r));
    expect(rotas, `rutas inexistentes: ${rotas.join(", ")}`).toEqual([]);
  });

  it("el resolvedor de rutas ve la página de soporte y no inventa /contacto", () => {
    expect(RUTAS.has("/soporte")).toBe(true);
    expect(RUTAS.has("/contacto")).toBe(false);
  });
});
