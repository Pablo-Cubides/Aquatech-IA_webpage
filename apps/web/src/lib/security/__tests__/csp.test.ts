import { describe, expect, it } from "vitest";
// @ts-expect-error: next.config.mjs no tiene tipos
import nextConfig from "../../../../next.config.mjs";

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

async function csp(): Promise<Record<string, string>> {
  const rules: HeaderRule[] = await nextConfig.headers();
  const value = rules.flatMap((rule) => rule.headers).find((h) => h.key === "Content-Security-Policy")?.value ?? "";
  const directives: Record<string, string> = {};
  for (const part of value.split(";")) {
    const [name, ...rest] = part.trim().split(/\s+/);
    if (name) directives[name] = rest.join(" ");
  }
  return directives;
}

describe("Content-Security-Policy (next.config.mjs)", () => {
  it("control positivo: la política existe y permite el mismo origen", async () => {
    const policy = await csp();
    expect(policy["connect-src"]).toContain("'self'");
    expect(policy["default-src"]).toBe("'self'");
  });

  it("connect-src no abre destinos que el navegador ya no usa (todo va por /api del mismo origen)", async () => {
    const connect = (await csp())["connect-src"];
    for (const host of [
      "api.openaq.org", "api.gbif.org", "waterqualitydata.us", "eonet.gsfc.nasa.gov",
      "huggingface.co", "arxiv.org", "supabase.co", "vercel.app",
    ]) {
      expect(connect, host).not.toContain(host);
    }
    // Sin comodines salvo los de desarrollo local.
    expect(connect.replace(/(ws|wss):\/\/localhost:\*/g, "")).not.toContain("*");
  });

  it("directivas de aislamiento que no deben perderse", async () => {
    const policy = await csp();
    expect(policy["object-src"]).toBe("'none'");
    expect(policy["frame-ancestors"]).toBe("'none'");
    expect(policy["base-uri"]).toBe("'self'");
  });
});

describe("SEC-005b: cabeceras de seguridad endurecidas (comprobado en navegador, ver bitácora SEC)", () => {
  async function allHeaders(): Promise<Record<string, string>> {
    const rules: HeaderRule[] = await nextConfig.headers();
    const all = rules.find((rule) => rule.source === "/(.*)");
    return Object.fromEntries((all?.headers ?? []).map((h) => [h.key, h.value]));
  }

  it("script-src sin 'unsafe-eval' en producción y sin Google Tag Manager / Analytics", async () => {
    const script = (await csp())["script-src"];
    expect(script).toContain("'self'");
    expect(script).not.toContain("'unsafe-eval'");
    expect(script).not.toContain("googletagmanager");
    expect(script).not.toContain("google-analytics");
  });

  it("X-XSS-Protection desactivado (0): el filtro heredado es obsoleto y explotable", async () => {
    expect((await allHeaders())["X-XSS-Protection"]).toBe("0");
  });

  it("worker-src permite 'self' y blob: (los workers de MapLibre y de jspdf)", async () => {
    expect((await csp())["worker-src"]).toContain("'self'");
    expect((await csp())["worker-src"]).toContain("blob:");
  });
});
