import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PUBLIC_TOOLS } from "../events";

/**
 * La puerta de presupuesto de JS (OPS-003, `.specify/scripts/bundle-size.mjs`) solo vigila las
 * rutas que están en `.specify/bundle-budget.json`. Si una herramienta nueva no se añade ahí,
 * nadie vigila su JS: este test lo impide, igual que `PUBLIC_TOOLS` rige la medición de uso.
 * También impide el fallo contrario: una puerta apoyada en un archivo sin datos (bases `null`)
 * o bloquea todo o no comprueba nada.
 */

const BUDGET_PATH = path.resolve(process.cwd(), "../../.specify/bundle-budget.json");
const budget = JSON.parse(readFileSync(BUDGET_PATH, "utf8")) as {
  ceilingKb: number;
  regressionKb: number;
  generated: string | null;
  pages: Record<string, number | null>;
};

describe("presupuesto de JS: .specify/bundle-budget.json", () => {
  it("vigila las 12 herramientas públicas de PUBLIC_TOOLS", () => {
    const expected = (Object.keys(PUBLIC_TOOLS) as (keyof typeof PUBLIC_TOOLS)[]).flatMap((portal) =>
      PUBLIC_TOOLS[portal].map((slug) => `/${portal}/herramientas/${slug}`),
    );
    expect(expected).toHaveLength(12);
    expect(Object.keys(budget.pages)).toEqual(expect.arrayContaining(expected));
  });

  it("vigila la home y los dos portales", () => {
    expect(Object.keys(budget.pages)).toEqual(expect.arrayContaining(["/", "/ia", "/ambiental"]));
  });

  it("toda página tiene una línea base medida (no null, no 0): la puerta no puede apoyarse en un archivo vacío", () => {
    const sinBase = Object.entries(budget.pages)
      .filter(([, kb]) => typeof kb !== "number" || !Number.isFinite(kb) || kb <= 0)
      .map(([route]) => route);
    expect(sinBase).toEqual([]);
    expect(budget.generated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("el techo es el de la constitución §5.1 (250 KB) y ninguna base lo supera", () => {
    expect(budget.ceilingKb).toBe(250);
    expect(budget.regressionKb).toBeGreaterThan(0);
    expect(budget.regressionKb).toBeLessThanOrEqual(8);
    for (const [route, kb] of Object.entries(budget.pages)) {
      expect(kb, route).toBeLessThanOrEqual(budget.ceilingKb);
    }
  });
});
