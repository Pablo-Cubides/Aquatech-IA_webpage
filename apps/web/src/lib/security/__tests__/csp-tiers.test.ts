import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
// @ts-expect-error: next.config.mjs no tiene tipos
import nextConfig from "../../../../next.config.mjs";
import { NONCE_CSP_PATH, STATIC_CSP_SOURCE, buildContentSecurityPolicy } from "../csp.mjs";
import { config, proxy } from "../../../proxy";

/**
 * SEC-006 / ADR-0017: CSP por niveles. /admin y /auth reciben una CSP con nonce (src/proxy.ts) y SIN
 * 'unsafe-inline' en script-src; el resto del sitio, la estática de next.config.mjs. Las dos no pueden
 * solaparse (dos CSP en una respuesta se aplican a la vez) ni dejar rutas sin ninguna.
 */
const NONCE = "dGVzdG5vbmNlMTIzNDU2Nzg5MA==";
const directive = (policy: string, name: string) =>
  policy.split(";").map((d) => d.trim()).find((d) => d.startsWith(`${name} `)) ?? "";
const withoutScriptSrc = (policy: string) =>
  policy.split(";").map((d) => d.trim()).filter((d) => !d.startsWith("script-src ")).join("; ");

describe("buildContentSecurityPolicy", () => {
  it("sin nonce: script-src con 'unsafe-inline' (páginas públicas)", () => {
    expect(directive(buildContentSecurityPolicy(), "script-src")).toBe("script-src 'self' 'unsafe-inline'");
  });

  it("con nonce: script-src con el nonce y SIN 'unsafe-inline'", () => {
    const script = directive(buildContentSecurityPolicy({ nonce: NONCE }), "script-src");
    expect(script).toBe(`script-src 'self' 'nonce-${NONCE}'`);
    expect(script).not.toContain("unsafe-inline");
  });

  it("las dos políticas solo difieren en script-src (mismas directivas de aislamiento)", () => {
    expect(withoutScriptSrc(buildContentSecurityPolicy({ nonce: NONCE }))).toBe(withoutScriptSrc(buildContentSecurityPolicy()));
    const strict = buildContentSecurityPolicy({ nonce: NONCE });
    expect(directive(strict, "object-src")).toBe("object-src 'none'");
    expect(directive(strict, "base-uri")).toBe("base-uri 'self'");
    expect(directive(strict, "frame-ancestors")).toBe("frame-ancestors 'none'");
    expect(directive(strict, "connect-src")).not.toContain("*");
  });

  it("connect-src: solo el mismo origen (sin analítica de terceros) en las dos políticas", () => {
    expect(directive(buildContentSecurityPolicy(), "connect-src")).toBe("connect-src 'self'");
    expect(directive(buildContentSecurityPolicy({ nonce: NONCE }), "connect-src")).toBe("connect-src 'self'");
    expect(buildContentSecurityPolicy()).not.toMatch(/google-analytics|vitals\.vercel-insights/);
  });

  it("el layout no precarga ni conecta con Google Analytics (nada lo carga)", () => {
    const layout = readFileSync(path.resolve(__dirname, "../../../app/layout.tsx"), "utf8");
    expect(layout).not.toMatch(/google-analytics|googletagmanager/);
  });

  it("'unsafe-eval' solo en desarrollo, también con nonce", () => {
    expect(buildContentSecurityPolicy({ nonce: NONCE })).not.toContain("unsafe-eval");
    expect(buildContentSecurityPolicy({ nonce: NONCE, isDev: true })).toContain("'unsafe-eval'");
  });

  it.each(["abc; script-src *", "x'y'z'0123456789ab", "corto", "a b c d e f g h i j k l", "line\nbreak012345678901"])(
    "rechaza un nonce que podría romper la cabecera: %j",
    (bad) => {
      expect(() => buildContentSecurityPolicy({ nonce: bad })).toThrow();
    },
  );
});

describe("reparto entre la CSP estática y la de nonce", () => {
  // `source` de headers() es path-to-regexp; esta forma de lookahead equivale a la expresión regular.
  const staticRule = new RegExp(`^${STATIC_CSP_SOURCE.replace(/^\//, "/")}$`);
  const PATHS = [
    "/", "/ia", "/ia/blog/algo", "/ambiental/herramientas/visor-mapas-ambientales", "/api/gbif/search",
    "/administracion", "/authors", "/auth-info", "/ia/autor/herramientas/proyectos-investigacion/admin",
    "/admin", "/admin/", "/admin/users", "/admin/tools/maps", "/auth", "/auth/error", "/auth/signin/x",
  ];

  it.each(PATHS)("%s recibe exactamente UNA de las dos políticas", (p) => {
    const isStatic = staticRule.test(p);
    const isNonce = NONCE_CSP_PATH.test(p);
    expect(isStatic !== isNonce, `${p}: estática=${isStatic} nonce=${isNonce}`).toBe(true);
  });

  it("/admin y /auth (y sus subrutas) son de nonce; /administracion y /authors no", () => {
    for (const p of ["/admin", "/admin/users", "/auth", "/auth/error"]) expect(NONCE_CSP_PATH.test(p), p).toBe(true);
    for (const p of ["/administracion", "/authors", "/ia/admin"]) expect(NONCE_CSP_PATH.test(p), p).toBe(false);
  });

  it("next.config.mjs aplica la CSP estática en UNA regla, con ese source, y con 'unsafe-inline'", async () => {
    const rules: { source: string; headers: { key: string; value: string }[] }[] = await nextConfig.headers();
    const cspRules = rules.filter((rule) => rule.headers.some((h) => h.key === "Content-Security-Policy"));
    expect(cspRules).toHaveLength(1);
    expect(cspRules[0].source).toBe(STATIC_CSP_SOURCE);
    expect(directive(cspRules[0].headers[0].value, "script-src")).toContain("'unsafe-inline'");
  });
});

describe("proxy: CSP con nonce en /admin y /auth", () => {
  const run = (pathname: string, init?: RequestInit) => proxy(new NextRequest(`http://localhost${pathname}`, init as never));
  const nonceOf = (policy: string) => /'nonce-([^']+)'/.exec(policy)?.[1];

  it.each(["/admin", "/admin/users", "/admin/tools/maps", "/auth/error"])("%s: CSP con nonce y sin 'unsafe-inline'", (p) => {
    const response = run(p);
    const policy = response.headers.get("content-security-policy") ?? "";
    const script = directive(policy, "script-src");
    expect(script).toMatch(/^script-src 'self' 'nonce-[A-Za-z0-9+/=]{20,}'$/);
    expect(script).not.toContain("unsafe-inline");
  });

  it("Next recibe el nonce en la PETICIÓN (CSP y x-nonce) y es el mismo que el de la respuesta", () => {
    const response = run("/admin/users");
    const nonce = nonceOf(response.headers.get("content-security-policy") ?? "");
    expect(nonce).toBeTruthy();
    expect(response.headers.get("x-middleware-request-x-nonce")).toBe(nonce);
    expect(response.headers.get("x-middleware-request-content-security-policy")).toContain(`'nonce-${nonce}'`);
  });

  it("un nonce distinto en cada petición", () => {
    const nonces = new Set(Array.from({ length: 20 }, () => nonceOf(run("/admin").headers.get("content-security-policy") ?? "")));
    expect(nonces.size).toBe(20);
  });

  it("el nonce no puede venir del cliente: se descarta un x-nonce / CSP de la petición", () => {
    const response = run("/admin", { headers: { "x-nonce": "falsoFALSOfalso1234", "content-security-policy": "script-src *" } });
    const nonce = nonceOf(response.headers.get("content-security-policy") ?? "");
    expect(nonce).not.toBe("falsoFALSOfalso1234");
    expect(response.headers.get("x-middleware-request-x-nonce")).toBe(nonce);
    expect(response.headers.get("x-middleware-request-content-security-policy")).not.toContain("script-src *");
  });

  it("una ruta pública o de /api NO recibe CSP del proxy (la pone next.config.mjs); el CORS sigue igual", () => {
    expect(run("/ia/blog/algo").headers.get("content-security-policy")).toBeNull();
    const api = run("/api/gbif/search", { headers: { origin: "https://aquatechia.com" } });
    expect(api.headers.get("content-security-policy")).toBeNull();
    expect(api.headers.get("access-control-allow-origin")).toBe("https://aquatechia.com");
  });

  it("el matcher cubre /api, /admin y /auth (y nada más)", () => {
    expect(config.matcher).toEqual(["/api/:path*", "/admin/:path*", "/auth/:path*"]);
  });
});

describe("las rutas de nonce se renderizan por petición", () => {
  it("el layout de /auth llama a connection() (un nonce no cabe en HTML prerenderizado)", () => {
    const source = readFileSync(path.resolve(__dirname, "../../../app/auth/layout.tsx"), "utf8");
    expect(source).toContain("await connection()");
  });
});
