/**
 * Índice OMS: la categoría de un porcentaje sobre la guía no puede tener huecos (ING-002).
 * `WHO_INDEX_CATEGORIES` usa rangos enteros (0-100, 101-150, 151-300, 301+) y `getWHOCategory`
 * devolvía la última («Exceso extremo») para cualquier decimal entre ellos: 100.5 % de la guía salía
 * como el peor nivel. Mientras tanto, `calculate-who.ts` tenía una segunda copia de los umbrales.
 */
import { describe, it, expect } from "vitest";
import {
  WHO_CATEGORY_IDS,
  WHO_INDEX_CATEGORIES,
  getWHOCategory,
} from "../../data/breakpoints/who-guidelines";
import { calculateWHOPollutant } from "../calculate-who";

describe("getWHOCategory", () => {
  const nombre = (v: number) => getWHOCategory(v)?.shortName;

  it("los decimales entre rangos no caen en «Extremo»", () => {
    expect(nombre(100.5)).toBe("Exceso leve");
    expect(nombre(150.5)).toBe("Exceso alto");
    expect(nombre(300.5)).toBe("Extremo");
  });

  it("los enteros de siempre siguen igual", () => {
    expect(nombre(0)).toBe("Cumple");
    expect(nombre(100)).toBe("Cumple");
    expect(nombre(101)).toBe("Exceso leve");
    expect(nombre(150)).toBe("Exceso leve");
    expect(nombre(151)).toBe("Exceso alto");
    expect(nombre(300)).toBe("Exceso alto");
    expect(nombre(301)).toBe("Extremo");
    expect(nombre(250000)).toBe("Extremo"); // sin techo real
  });

  it("barrido de 0 a 400 %: siempre hay categoría y nunca retrocede", () => {
    let anterior = -1;
    for (let i = 0; i <= 40000; i++) {
      const v = i / 100;
      const categoria = getWHOCategory(v);
      expect(categoria, `${v} %`).not.toBeNull();
      const idx = WHO_INDEX_CATEGORIES.indexOf(categoria!);
      expect(idx, `${v} % retrocede`).toBeGreaterThanOrEqual(anterior);
      anterior = idx;
    }
    expect(anterior).toBe(WHO_INDEX_CATEGORIES.length - 1);
  });

  it("no numérico o negativo: null, no «Extremo»", () => {
    for (const v of [NaN, Infinity, -Infinity, -1]) expect(getWHOCategory(v), String(v)).toBeNull();
  });

  it("hay un identificador por categoría", () => {
    expect(WHO_CATEGORY_IDS).toHaveLength(WHO_INDEX_CATEGORIES.length);
  });
});

describe("calculateWHOPollutant: nombre de la categoría y su identificador coinciden", () => {
  // Guía diaria de PM2.5 de la OMS 2021: 15 µg/m³. 15.075 µg/m³ = 100.5 % de la guía.
  it("100.5 % de la guía: «Exceso leve» en el nombre, el color y el identificador", () => {
    const r = calculateWHOPollutant("pm25", 15.075, "daily");
    expect(r).not.toBeNull();
    expect(r!.categoryName).toBe("Exceso leve");
    expect(r!.category).toBe("slight-excess");
    expect(r!.color).toBe(WHO_INDEX_CATEGORIES[1].color);
  });

  it("concentración no numérica: sin resultado", () => {
    expect(calculateWHOPollutant("pm25", NaN, "daily")).toBeNull();
  });
});
