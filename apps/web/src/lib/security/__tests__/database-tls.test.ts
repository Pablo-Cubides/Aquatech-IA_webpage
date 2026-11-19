/**
 * SEC-001 · TLS de la capa de datos.
 *
 * 1. La misma tabla de casos se ejecuta contra el módulo fuente (src) y contra
 *    su espejo de runtime (dist), que es lo que realmente carga la aplicación.
 * 2. Guardas estáticas: nada en el repositorio asigna la variable de proceso que
 *    desactiva la verificación TLS global, y apps/web no accede a la base de
 *    datos por su cuenta.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

import * as distModule from "@ia-next/database/ssl-config";
import * as srcModule from "../../../../../../packages/@ia-next/database/src/ssl-config";

const FAKE_CA = [
  "-----BEGIN CERTIFICATE-----",
  "MIIBfakefakefakefakefakefakefakefakefakefakefakefakefake",
  "-----END CERTIFICATE-----",
].join("\n");

const REMOTE = "postgresql://postgres.abc:secret@aws-0-us-east-1.pooler.supabase.com:6543/postgres";

const implementations = [
  ["src/ssl-config.ts", srcModule],
  ["dist/ssl-config.js", distModule],
] as const;

describe.each(implementations)("ssl-config (%s)", (_name, impl) => {
  it("por defecto VERIFICA el certificado en una base remota", () => {
    const result = impl.resolveDatabaseSsl(REMOTE, {});
    expect(result.mode).toBe("verify");
    expect(result.ssl).toEqual({ rejectUnauthorized: true });
    expect(result.warnings).toEqual([]);
  });

  it("sslmode=no-verify en la URL ya no desactiva la verificación (se elimina)", () => {
    const result = impl.resolveDatabaseSsl(`${REMOTE}?sslmode=no-verify&pgbouncer=true`, {});
    expect(result.ssl).toEqual({ rejectUnauthorized: true });
    expect(result.connectionString).toBe(`${REMOTE}?pgbouncer=true`);
  });

  it.each(["sslmode=disable", "sslrootcert=system", "ssl=false", "uselibpqcompat=true"])(
    "elimina el parámetro de URL %s para que no pise la opción ssl",
    (param) => {
      const result = impl.resolveDatabaseSsl(`${REMOTE}?${param}`, {});
      expect(result.connectionString).toBe(REMOTE);
      expect(result.ssl?.rejectUnauthorized).toBe(true);
    },
  );

  it("la base local va sin TLS", () => {
    for (const url of [
      "postgresql://postgres:postgres@localhost:5432/postgres",
      "postgresql://postgres:postgres@127.0.0.1:5432/postgres",
      "postgresql://postgres:postgres@[::1]:5432/postgres",
      "postgresql://postgres:postgres@postgres:5432/postgres",
    ]) {
      const result = impl.resolveDatabaseSsl(url, {});
      expect(result.mode).toBe("local");
      expect(result.ssl).toBeUndefined();
    }
  });

  it("la palabra 'localhost' en la contraseña o en la query NO convierte un host remoto en local", () => {
    const sneaky = [
      "postgresql://user:localhost@db.example.com:5432/app",
      "postgresql://user:pw@db.example.com:5432/app?application_name=localhost",
      "postgresql://user:pw@db.example.com:5432/localhost",
    ];
    for (const url of sneaky) {
      const result = impl.resolveDatabaseSsl(url, {});
      expect(result.mode).toBe("verify");
      expect(result.ssl?.rejectUnauthorized).toBe(true);
    }
  });

  it("una URL ilegible se trata como remota (verifica)", () => {
    expect(impl.resolveDatabaseSsl("not a url", {}).mode).toBe("verify");
  });

  it("DATABASE_SSL_CA verifica con esa CA (PEM, PEM con \\n escapados o base64)", () => {
    for (const value of [
      FAKE_CA,
      FAKE_CA.replace(/\n/g, "\\n"),
      Buffer.from(FAKE_CA).toString("base64"),
    ]) {
      const result = impl.resolveDatabaseSsl(REMOTE, { DATABASE_SSL_CA: value });
      expect(result.mode).toBe("verify-custom-ca");
      expect(result.ssl).toEqual({ rejectUnauthorized: true, ca: FAKE_CA });
    }
  });

  it("una CA inválida falla en alto en lugar de degradar a no verificar", () => {
    expect(() => impl.resolveDatabaseSsl(REMOTE, { DATABASE_SSL_CA: "esto no es un certificado" })).toThrow(
      /DATABASE_SSL_CA/,
    );
  });

  it("DATABASE_SSL_ALLOW_UNVERIFIED=true es la única vía para no verificar y advierte", () => {
    const result = impl.resolveDatabaseSsl(REMOTE, { DATABASE_SSL_ALLOW_UNVERIFIED: "true" });
    expect(result.mode).toBe("unverified");
    expect(result.ssl).toEqual({ rejectUnauthorized: false });
    expect(result.warnings.join(" ")).toMatch(/NO verifica/);
  });

  it("otros valores de DATABASE_SSL_ALLOW_UNVERIFIED no la activan", () => {
    for (const value of ["1", "TRUE", "yes", "false", ""]) {
      expect(impl.resolveDatabaseSsl(REMOTE, { DATABASE_SSL_ALLOW_UNVERIFIED: value }).mode).toBe("verify");
    }
  });

  it("con CA y ALLOW_UNVERIFIED a la vez gana la verificación", () => {
    const result = impl.resolveDatabaseSsl(REMOTE, {
      DATABASE_SSL_CA: FAKE_CA,
      DATABASE_SSL_ALLOW_UNVERIFIED: "true",
    });
    expect(result.mode).toBe("verify-custom-ca");
    expect(result.ssl?.rejectUnauthorized).toBe(true);
  });

  it("DATABASE_SSL_REJECT_UNAUTHORIZED=false (variable antigua) no desactiva nada y avisa", () => {
    const result = impl.resolveDatabaseSsl(REMOTE, { DATABASE_SSL_REJECT_UNAUTHORIZED: "false" });
    expect(result.mode).toBe("verify");
    expect(result.warnings.join(" ")).toMatch(/ya no se respeta/);
  });

  it("no altera usuario ni contraseña al limpiar la URL", () => {
    const url = "postgresql://us%40er:p%3Fss%26w@db.example.com:6543/postgres?sslmode=require";
    expect(impl.resolveDatabaseSsl(url, {}).connectionString).toBe(
      "postgresql://us%40er:p%3Fss%26w@db.example.com:6543/postgres",
    );
  });
});

describe("el espejo dist se comporta igual que src", () => {
  it("misma salida para una batería de entradas", () => {
    const envs = [
      {},
      { DATABASE_SSL_CA: FAKE_CA },
      { DATABASE_SSL_ALLOW_UNVERIFIED: "true" },
      { DATABASE_SSL_REJECT_UNAUTHORIZED: "false" },
    ];
    const urls = [REMOTE, `${REMOTE}?sslmode=no-verify`, "postgresql://u:p@localhost:5432/x", undefined];

    for (const url of urls) {
      for (const env of envs) {
        expect(distModule.resolveDatabaseSsl(url, env)).toEqual(srcModule.resolveDatabaseSsl(url, env));
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Guardas estáticas sobre el repositorio
// ---------------------------------------------------------------------------

const repoRoot = resolve(__dirname, "../../../../../..");
// Esta línea se excluye del escaneo (es el propio archivo de prueba).
const TLS_ASSIGNMENT =
  /NODE_TLS_REJECT_UNAUTHORIZED\s*(=(?!=)|:\s*["'`])|["']NODE_TLS_REJECT_UNAUTHORIZED["']\s*\]\s*=/;
const SOURCE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs)$/;
const SKIP_DIRS = new Set(["node_modules", ".next", ".turbo", ".git", "coverage"]);

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SOURCE_EXT.test(entry)) out.push(full);
  }
  return out;
}

describe("guardas estáticas del repositorio", () => {
  const scanRoots = [
    join(repoRoot, "apps/web/src"),
    join(repoRoot, "apps/api/src"),
    join(repoRoot, "packages/@ia-next"),
    join(repoRoot, "scripts"),
  ];
  const files = [
    ...scanRoots.flatMap((root) => walk(root)),
    join(repoRoot, "apps/web/next.config.mjs"),
    join(repoRoot, "apps/api/next.config.mjs"),
  ].filter((file) => existsSync(file) && !file.endsWith("database-tls.test.ts"));

  it("ningún archivo asigna la variable de proceso que desactiva TLS globalmente", () => {
    const offenders = files.filter((file) => TLS_ASSIGNMENT.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("control positivo: el detector reconoce el código que se eliminó", () => {
    for (const bad of [
      'process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";',
      'process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";',
      'Object.assign(process.env, { NODE_TLS_REJECT_UNAUTHORIZED: "0" });',
    ]) {
      expect(TLS_ASSIGNMENT.test(bad)).toBe(true);
    }
    for (const fine of [
      "// Never set NODE_TLS_REJECT_UNAUTHORIZED: it disables TLS",
      'if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") warn();',
    ]) {
      expect(TLS_ASSIGNMENT.test(fine)).toBe(false);
    }
  });

  it("apps/web/src/lib/db.ts ya no existe (el acceso a datos es solo @ia-next/database)", () => {
    expect(existsSync(join(repoRoot, "apps/web/src/lib/db.ts"))).toBe(false);
  });

  it("apps/web/src no importa Prisma ni pg directamente", () => {
    const direct = /from\s+["'](@prisma\/[^"']+|pg)["']|require\(\s*["'](@prisma\/[^"']+|pg)["']\s*\)|["']@\/lib\/db["']/;
    const offenders = walk(join(repoRoot, "apps/web/src"))
      .filter((file) => !file.endsWith("database-tls.test.ts"))
      .filter((file) => direct.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });
});
