import { describe, expect, it } from "vitest";
// @ts-expect-error: next.config.mjs no tiene tipos
import nextConfig from "../../../../next.config.mjs";

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

async function csp(): Promise<Record<string, string>> {
  const rules: HeaderRule[] = await nextConfig.headers();
  const all = rules.find((rule) => rule.source === "/(.*)");
  const value = all?.headers.find((h) => h.key === "Content-Security-Policy")?.value ?? "";
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
