import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

/**
 * SEC-005b: MapLibre 6 busca su worker como un archivo HERMANO de su módulo. Empaquetado en un chunk de
 * Next ese archivo no existe (la URL devuelve la página 404 en HTML) y salía "Worker failed to load":
 * las capas GeoJSON del visor no se dibujaban. No era la CSP. El mapa debe indicar el archivo del worker.
 */
const MAP_COMPONENT = path.join(
  process.cwd(),
  "src/app/(portals)/ambiental/(marketing)/herramientas/visor-mapas-ambientales/src/components/MapComponent.tsx",
);

describe("worker de MapLibre", () => {
  it("MapComponent le indica la URL del worker (webpack la emite como recurso estático)", () => {
    const source = readFileSync(MAP_COMPONENT, "utf8");
    expect(source).toMatch(/setWorkerUrl\(\s*new URL\("maplibre-gl\/dist\/maplibre-gl-worker\.mjs", import\.meta\.url\)\.href/);
  });

  it("el archivo del worker existe en la versión instalada de maplibre-gl (si una actualización lo renombra, esto falla)", () => {
    const require = createRequire(import.meta.url);
    const pkg = require.resolve("maplibre-gl/package.json");
    expect(existsSync(path.join(path.dirname(pkg), "dist", "maplibre-gl-worker.mjs"))).toBe(true);
  });
});
