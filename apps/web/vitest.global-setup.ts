/**
 * Guarda global de los tests de apps/web (OPS-001).
 *
 * Los `articles.json` versionados son el fallback REAL del blog si la base falla: ningún
 * test puede reescribirlos ni borrarlos. Se toma su huella antes de la suite y se compara
 * al terminar; si cambia, la suite entera falla (no depende de que cada test se porte bien).
 * También crea y limpia el directorio temporal donde ahora caen las escrituras de los tests.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { HERMETIC_TMP_DIR } from "../../vitest.hermetic";

const VERSIONED_CACHES = [
  path.resolve(__dirname, "content/blog/articles.json"),
  path.resolve(__dirname, "../../content/blog/articles.json"),
];

function fingerprint(file: string): string {
  return existsSync(file) ? createHash("sha256").update(readFileSync(file)).digest("hex") : "(no existe)";
}

export default function setup() {
  const before = new Map(VERSIONED_CACHES.map((file) => [file, fingerprint(file)]));
  mkdirSync(HERMETIC_TMP_DIR, { recursive: true });

  return () => {
    rmSync(HERMETIC_TMP_DIR, { recursive: true, force: true });

    const changed = VERSIONED_CACHES.filter((file) => fingerprint(file) !== before.get(file));
    if (changed.length > 0) {
      // Un error en el cierre solo se imprime: hay que fijar el código de salida para que falle.
      process.exitCode = 1;
      throw new Error(
        `Los tests modificaron archivos versionados que deben quedar intactos:\n  ${changed.join("\n  ")}\n` +
          "Un test escribió en el repositorio: debe usar BLOG_ARTICLES_FILE (temporal) o un mock.",
      );
    }
  };
}
