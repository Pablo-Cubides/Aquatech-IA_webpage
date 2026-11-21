import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GBIF_OCCURRENCE_FIELDS, slimOccurrenceSearch } from "../gbif-occurrence";

/**
 * SEC-006: /api/gbif/search adelgaza la respuesta. El contrato con el cliente se verifica LEYENDO el
 * código cliente: si el visor (o el tipo `GBIFOccurrence`) usa un campo que el proxy ya no devuelve,
 * esta prueba falla (antes el síntoma habría sido un campo vacío en el panel, sin error).
 */
const SRC = path.resolve(__dirname, "../..");
const read = (relative: string) => readFileSync(path.join(SRC, relative), "utf8");

const VISOR_PAGE = "app/(portals)/ambiental/(marketing)/herramientas/visor-mapas-ambientales/src/app/PageComponent.tsx";
const KEPT = new Set<string>([...GBIF_OCCURRENCE_FIELDS, "media"]);

describe("el proxy devuelve todo lo que el cliente declara y usa", () => {
  it("cada campo del tipo GBIFOccurrence (lib/gbif.ts) sigue en la respuesta adelgazada", () => {
    const block = read("lib/gbif.ts").match(/export interface GBIFOccurrence \{\r?\n([\s\S]*?)\r?\n\}/);
    expect(block, "no se encontró GBIFOccurrence en lib/gbif.ts").not.toBeNull();
    const declared = [...block![1].matchAll(/^ {2}(\w+)\??:/gm)].map((m) => m[1]);
    expect(declared.length).toBeGreaterThan(20);
    expect(declared.filter((field) => !KEPT.has(field))).toEqual([]);
  });

  it("cada `occurrence.<campo>` que lee el visor está entre los campos conservados", () => {
    const used = new Set([...read(VISOR_PAGE).matchAll(/\boccurrence\.(\w+)/g)].map((m) => m[1]));
    expect(used.size).toBeGreaterThan(15); // si baja, el patrón ya no encuentra el código del visor
    expect([...used].filter((field) => !KEPT.has(field))).toEqual([]);
  });

  it("lo que el visor lee de `result.` en la carga de GBIF también viene del proxy", () => {
    // Solo el bloque de GBIF: otras capas (estaciones, WQP...) tienen su propio `result`.
    const page = read(VISOR_PAGE);
    const start = page.indexOf("const loadGBIFData");
    const end = page.indexOf("loadGBIFData();", start);
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const used = new Set([...page.slice(start, end).matchAll(/\bresult\.(\w+)/g)].map((m) => m[1]));
    expect(used.has("results")).toBe(true);
    expect([...used].filter((field) => !["results", "offset", "limit", "endOfRecords", "count"].includes(field))).toEqual([]);
  });
});

describe("slimOccurrenceSearch", () => {
  const heavy = (i: number) => ({
    key: 1000 + i,
    scientificName: "Pitangus sulphuratus (Linnaeus, 1766)",
    decimalLatitude: 4.6 + i / 1000,
    decimalLongitude: -74.1,
    kingdom: "Animalia",
    classKey: 212,
    year: 2020,
    country: "Colombia",
    extensions: { "http://rs.gbif.org/terms/1.0/Multimedia": [{ a: "x".repeat(500) }] },
    gadmGids: ["COL.1_1"],
    identifiers: [{ identifier: "z".repeat(300) }],
    issues: ["COORDINATE_ROUNDED"],
    media: [
      { type: "StillImage", format: "image/jpeg", identifier: "https://example.org/a.jpg", creator: "x".repeat(200) },
      { type: "StillImage", identifier: "https://example.org/b.jpg" },
    ],
    notes: "n".repeat(2000),
  });

  it("conserva la forma {offset, limit, endOfRecords, count, results} y los campos del visor", () => {
    const slim = slimOccurrenceSearch({ offset: 0, limit: 300, endOfRecords: false, count: 9999, facets: [], results: [heavy(1)] });
    expect(slim).toMatchObject({ offset: 0, limit: 300, endOfRecords: false, count: 9999 });
    expect(slim!.results[0]).toMatchObject({
      key: 1001,
      scientificName: "Pitangus sulphuratus (Linnaeus, 1766)",
      decimalLongitude: -74.1,
      classKey: 212,
      country: "Colombia",
    });
  });

  it("descarta lo que el visor no usa y reduce el tamaño más del 85 %", () => {
    const raw = { offset: 0, limit: 300, endOfRecords: true, count: 300, results: Array.from({ length: 300 }, (_, i) => heavy(i)) };
    const slim = slimOccurrenceSearch(raw)!;
    const row = slim.results[0] as Record<string, unknown>;
    for (const dropped of ["extensions", "gadmGids", "identifiers", "issues", "notes"]) expect(row).not.toHaveProperty(dropped);
    expect(JSON.stringify(slim).length).toBeLessThan(JSON.stringify(raw).length * 0.15);
  });

  it("media: solo el primer elemento con URL http(s), solo type/format/identifier", () => {
    const [row] = slimOccurrenceSearch({ results: [heavy(1)] })!.results;
    expect(row.media).toEqual([{ type: "StillImage", format: "image/jpeg", identifier: "https://example.org/a.jpg" }]);
  });

  it.each([
    ["javascript:", "javascript:alert(1)"],
    ["data:", "data:text/html,<script>alert(1)</script>"],
    ["relativa", "/etc/passwd"],
    ["con espacio", "https://a.com/x y"],
  ])("media con URL %s no pasa al cliente (va a un <img src>)", (_label, identifier) => {
    const [row] = slimOccurrenceSearch({ results: [{ key: 1, media: [{ type: "StillImage", identifier }] }] })!.results;
    expect(row.media).toBeUndefined();
  });

  it("solo copia valores primitivos (un objeto donde se espera un campo se omite)", () => {
    const [row] = slimOccurrenceSearch({ results: [{ key: 1, scientificName: { x: 1 }, kingdom: ["a"], year: 2020 }] })!.results;
    expect(row).toEqual({ key: 1, year: 2020 });
  });

  it.each([[null], [undefined], ["texto"], [{}], [{ results: "no" }], [[]]])("%j no es una búsqueda: devuelve null", (input) => {
    expect(slimOccurrenceSearch(input)).toBeNull();
  });

  it("ignora elementos de results que no son objetos", () => {
    expect(slimOccurrenceSearch({ results: [null, 3, "x", { key: 7 }] })!.results).toEqual([{ key: 7 }]);
  });
});
