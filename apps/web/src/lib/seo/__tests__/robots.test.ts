import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { AI_CRAWLERS, PRIVATE_PATHS } from "../robots-rules";

const rules = (() => {
  const raw = robots().rules;
  return Array.isArray(raw) ? raw : [raw];
})();

describe("robots.txt", () => {
  it("prohibe las rutas privadas en TODAS las reglas, incluidas las de bots de IA", () => {
    expect(rules.length).toBeGreaterThanOrEqual(2);
    for (const rule of rules) {
      const disallow = ([] as string[]).concat(rule.disallow ?? []);
      for (const path of PRIVATE_PATHS) {
        expect(disallow, `${JSON.stringify(rule.userAgent)} debe prohibir ${path}`).toContain(path);
      }
    }
  });

  it("los bots de IA no tienen mas acceso que el resto: solo permiten contenido publico", () => {
    const aiRule = rules.find((rule) => ([] as string[]).concat(rule.userAgent ?? []).includes("GPTBot"));
    expect(aiRule).toBeDefined();
    expect(([] as string[]).concat(aiRule!.userAgent!)).toEqual(AI_CRAWLERS);
    // Solo "/" (acotado por los Disallow, que son mas especificos) y los llms: nada mas.
    expect(([] as string[]).concat(aiRule!.allow ?? [])).toEqual(["/", "/llms.txt", "/llms-full.txt"]);
  });

  it("declara el sitemap", () => {
    expect(String(robots().sitemap)).toMatch(/\/sitemap\.xml$/);
  });
});
