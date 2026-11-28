import { describe, it, expect } from "vitest";
import { findBand } from "../find-band";

const BANDS = [
  { min: 0, max: 24, id: "a" },
  { min: 25, max: 49, id: "b" },
  { min: 50, max: 100, id: "c" },
] as const;

describe("findBand", () => {
  it("devuelve el rango que contiene el valor, extremos incluidos", () => {
    expect(findBand(0, BANDS, { gap: "lower" })?.id).toBe("a");
    expect(findBand(24, BANDS, { gap: "lower" })?.id).toBe("a");
    expect(findBand(25, BANDS, { gap: "lower" })?.id).toBe("b");
    expect(findBand(100, BANDS, { gap: "lower" })?.id).toBe("c");
  });

  it("un valor entre dos rangos cae en el inferior o el superior según `gap`", () => {
    expect(findBand(24.5, BANDS, { gap: "lower" })?.id).toBe("a");
    expect(findBand(24.5, BANDS, { gap: "upper" })?.id).toBe("b");
    expect(findBand(49.99, BANDS, { gap: "lower" })?.id).toBe("b");
    expect(findBand(49.99, BANDS, { gap: "upper" })?.id).toBe("c");
  });

  it("fuera de la escala o no finito: null, nunca una categoría de respaldo", () => {
    for (const v of [NaN, Infinity, -Infinity, -0.001, 100.001]) {
      expect(findBand(v, BANDS, { gap: "lower" }), String(v)).toBeNull();
    }
    expect(findBand(5, [], { gap: "lower" })).toBeNull();
  });

  it("`openTop` acepta cualquier valor finito por encima del último rango, pero no por debajo del primero", () => {
    expect(findBand(1e9, BANDS, { gap: "lower", openTop: true })?.id).toBe("c");
    expect(findBand(Infinity, BANDS, { gap: "lower", openTop: true })).toBeNull();
    expect(findBand(-1, BANDS, { gap: "lower", openTop: true })).toBeNull();
  });
});
