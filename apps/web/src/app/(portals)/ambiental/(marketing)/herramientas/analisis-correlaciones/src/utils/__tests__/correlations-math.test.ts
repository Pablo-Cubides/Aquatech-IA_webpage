import { describe, expect, it } from "vitest";
import { averageRanks, kendallTauB, pearson, spearman } from "../correlations";

/**
 * ARQ-010. Valores de referencia INDEPENDIENTES del código que se prueba.
 *
 * Origen: referencia independiente del coordinador, calculada en Python 3 con aritmética exacta
 * (`fractions` y `decimal` a 40 dígitos) a partir de las definiciones, script en
 * coordinacion/ARQ-010-valores-referencia.md (2026-11-17). No se usó scipy (no se autorizó la descarga).
 * Control externo: el caso `wikipedia_iq_tv` reproduce el valor publicado ρ = −29/165 del artículo
 * "Spearman's rank correlation coefficient" (Wikipedia en inglés).
 *
 * Si algún valor de aquí deja de coincidir, NO lo cambies para que pase: el cálculo está mal.
 */
type Reference = { x: number[]; y: number[]; pearson: number | null; spearman: number | null; kendall: number | null };

const CASES: Record<string, Reference> = {
  perfecta: { x: [1, 2, 3, 4, 5, 6], y: [2, 4, 6, 8, 10, 12], pearson: 1, spearman: 1, kendall: 1 },
  inversa: { x: [1, 2, 3, 4, 5, 6], y: [12, 10, 8, 6, 4, 2], pearson: -1, spearman: -1, kendall: -1 },
  empates_ambas: {
    x: [1, 2, 2, 3, 4, 4, 5],
    y: [2, 1, 3, 3, 5, 4, 6],
    pearson: 0.891642799399193,
    spearman: 0.908295106229247,
    kendall: 0.820782681668123,
  },
  monotona_con_extremo: {
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1000],
    pearson: 0.529213246711001,
    spearman: 1,
    kendall: 1,
  },
  wikipedia_iq_tv: {
    x: [106, 100, 86, 101, 99, 103, 97, 113, 112, 110],
    y: [7, 27, 2, 50, 28, 29, 20, 12, 6, 17],
    pearson: -0.070216326029057,
    spearman: -0.175757575757576,
    kendall: -0.111111111111111,
  },
  varianza_cero: { x: [1, 2, 3], y: [5, 5, 5], pearson: null, spearman: null, kendall: null },
  n1: { x: [1], y: [2], pearson: null, spearman: null, kendall: null },
};

const DIGITS = 10;

function expectValue(actual: number | null, expected: number | null) {
  if (expected === null) expect(actual).toBeNull();
  else {
    expect(actual).not.toBeNull();
    expect(actual as number).toBeCloseTo(expected, DIGITS);
  }
}

describe("correlaciones contra valores de referencia independientes (ARQ-010)", () => {
  for (const [name, c] of Object.entries(CASES)) {
    it(`${name}: Pearson`, () => expectValue(pearson(c.x, c.y), c.pearson));
    it(`${name}: Spearman`, () => expectValue(spearman(c.x, c.y), c.spearman));
    it(`${name}: Kendall tau-b`, () => expectValue(kendallTauB(c.x, c.y), c.kendall));
  }

  it("el control de Wikipedia coincide con el valor publicado, -29/165", () => {
    expect(spearman(CASES.wikipedia_iq_tv.x, CASES.wikipedia_iq_tv.y)).toBeCloseTo(-29 / 165, 12);
  });

  it("Pearson y Spearman difieren claramente con un valor extremo (misma n, relación monótona)", () => {
    const { x, y } = CASES.monotona_con_extremo;
    expect(spearman(x, y)).toBeCloseTo(1, DIGITS);
    expect(pearson(x, y) as number).toBeLessThan(0.6);
  });

  it("nunca devuelve NaN: serie vacía, de un dato, constante o con valores no finitos dan null", () => {
    for (const fn of [pearson, spearman, kendallTauB]) {
      expect(fn([], [])).toBeNull();
      expect(fn([1], [1])).toBeNull();
      expect(fn([1, 2, 3], [4, 4, 4])).toBeNull();
      expect(fn([4, 4, 4], [1, 2, 3])).toBeNull();
      expect(fn([1, 2, Number.NaN], [1, 2, 3])).toBeNull();
      expect(fn([1, 2, 3], [1, 2])).toBeNull();
    }
  });

  it("los coeficientes son simétricos y quedan en [-1, 1]", () => {
    for (const c of Object.values(CASES)) {
      for (const fn of [pearson, spearman, kendallTauB]) {
        const ab = fn(c.x, c.y);
        const ba = fn(c.y, c.x);
        expect(ab === null).toBe(ba === null);
        if (ab !== null && ba !== null) {
          expect(ab).toBeCloseTo(ba, 12);
          expect(Math.abs(ab)).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

describe("rangos promedio", () => {
  it("asigna el rango al índice ORIGINAL, no a la posición ordenada", () => {
    expect(averageRanks([30, 10, 20])).toEqual([3, 1, 2]);
  });

  it("promedia los empates", () => {
    expect(averageRanks([10, 20, 20, 30])).toEqual([1, 2.5, 2.5, 4]);
    expect(averageRanks([5, 5, 5])).toEqual([2, 2, 2]);
  });

  it("los rangos suman n(n+1)/2 aunque haya empates", () => {
    const ranks = averageRanks(CASES.empates_ambas.x);
    expect(ranks.reduce((a, b) => a + b, 0)).toBe((7 * 8) / 2);
  });
});

/**
 * Prueba de mutante (ARQ-010): el algoritmo que estuvo en producción, copiado aquí SOLO como
 * contraejemplo, tiene que DISTANCIARSE de la referencia en los casos en que debía fallar. Si algún día
 * estas pruebas pasaran a "no se distancia", significaría que los casos de referencia ya no cazan el bug.
 */
describe("el algoritmo antiguo (rango por posición ordenada) NO pasa la referencia", () => {
  function legacySpearman(x: number[], y: number[]): number | null {
    const rank = (values: number[]) =>
      values
        .map((val) => ({ val }))
        .sort((a, b) => a.val - b.val)
        .map((_item, position) => position + 1);
    return pearson(rank(x), rank(y));
  }

  it.each(["inversa", "empates_ambas", "wikipedia_iq_tv"])("%s: el Spearman antiguo da 1 y no el valor de referencia", (name) => {
    const c = CASES[name];
    expect(legacySpearman(c.x, c.y)).toBeCloseTo(1, DIGITS);
    expect(Math.abs((legacySpearman(c.x, c.y) as number) - (c.spearman as number))).toBeGreaterThan(0.05);
  });

  it("el Spearman antiguo es siempre 1,00 para cualquier par de datos (el bug en producción)", () => {
    for (const c of Object.values(CASES)) {
      if (c.x.length < 2 || new Set(c.x).size < 2) continue;
      expect(legacySpearman(c.x, c.y)).toBeCloseTo(1, DIGITS);
    }
  });

  function legacyKendall(x: number[], y: number[]): number {
    let concordant = 0;
    let discordant = 0;
    for (let i = 0; i < x.length; i++) {
      for (let j = i + 1; j < x.length; j++) {
        const signX = Math.sign(x[j] - x[i]);
        const signY = Math.sign(y[j] - y[i]);
        if (signX === signY) concordant++;
        else if (signX !== signY) discordant++;
      }
    }
    return (concordant - discordant) / (concordant + discordant);
  }

  it("el Kendall antiguo (empates como concordantes o discordantes) se aleja de tau-b con empates", () => {
    const c = CASES.empates_ambas;
    expect(Math.abs(legacyKendall(c.x, c.y) - (c.kendall as number))).toBeGreaterThan(0.01);
  });
});
