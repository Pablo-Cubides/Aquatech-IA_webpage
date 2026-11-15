import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  $executeRawUnsafe: vi.fn(),
}));

vi.mock("@ia-next/database", () => ({ prisma: prismaMock }));

async function load() {
  vi.resetModules();
  return import("@/lib/security/rate-limit-postgres");
}

/** Los argumentos de una plantilla etiquetada de Prisma: [strings, ...valores]. */
function boundValues(call: unknown[]): unknown[] {
  return call.slice(1);
}

describe("incrementWindow (almacén PostgreSQL del limitador)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("NEXTAUTH_SECRET", "secreto-de-prueba");
    prismaMock.$executeRawUnsafe.mockResolvedValue(0);
  });

  it("con la tabla ya creada (migración aplicada) no ejecuta DDL", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ found: true }])
      .mockResolvedValueOnce([{ hits: 1, reset_ms: 5000 }]);
    const { incrementWindow } = await load();

    expect(await incrementWindow("rate-limit:a", 60_000, 5)).toEqual({ hits: 1, resetAt: 5000 });
    expect(prismaMock.$executeRawUnsafe).not.toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE"),
    );
  });

  it("solo comprueba la tabla una vez por instancia", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ found: true }])
      .mockResolvedValue([{ hits: 2, reset_ms: 1 }]);
    const { incrementWindow } = await load();

    await incrementWindow("x", 1000, 5);
    await incrementWindow("x", 1000, 5);
    // 1 comprobación + 2 incrementos
    expect(prismaMock.$queryRaw).toHaveBeenCalledTimes(3);
  });

  it("guarda un HMAC, nunca el identificador (IP, correo) en claro", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ found: true }])
      .mockResolvedValueOnce([{ hits: 1, reset_ms: 1 }]);
    const { incrementWindow } = await load();

    await incrementWindow("rate-limit:ip:203.0.113.9", 1000, 5);
    const values = boundValues(prismaMock.$queryRaw.mock.calls[1]);
    expect(String(values[0])).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(values)).not.toContain("203.0.113.9");
  });

  it("el mismo identificador siempre cae en el mismo cubo y otro distinto en otro", async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ hits: 1, reset_ms: 1 }]);
    prismaMock.$queryRaw.mockResolvedValueOnce([{ found: true }]);
    const { incrementWindow } = await load();

    await incrementWindow("a", 1000, 5);
    await incrementWindow("a", 1000, 5);
    await incrementWindow("b", 1000, 5);
    const buckets = prismaMock.$queryRaw.mock.calls.slice(1).map((c) => boundValues(c)[0]);
    expect(buckets[0]).toBe(buckets[1]);
    expect(buckets[0]).not.toBe(buckets[2]);
  });

  it("sin secreto lanza (el llamador aplica su failureMode)", async () => {
    vi.stubEnv("NEXTAUTH_SECRET", "");
    vi.stubEnv("AUTH_SECRET", "");
    const { incrementWindow } = await load();
    await expect(incrementWindow("a", 1000, 5)).rejects.toThrow(/NEXTAUTH_SECRET/);
  });

  it("si la tabla falta la crea; si dos instancias compiten y la otra gana, no falla", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ found: false }]) // aún no existe
      .mockResolvedValueOnce([{ found: true }]) // tras el error de carrera, ya existe
      .mockResolvedValueOnce([{ hits: 1, reset_ms: 1 }]);
    prismaMock.$executeRawUnsafe.mockRejectedValueOnce(new Error("duplicate key pg_type"));
    const { incrementWindow } = await load();

    await expect(incrementWindow("a", 1000, 5)).resolves.toMatchObject({ hits: 1 });
  });

  it("si no hay permiso CREATE y la tabla no existe, lanza y reintenta en la siguiente petición", async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ found: false }]);
    prismaMock.$executeRawUnsafe.mockRejectedValue(new Error("permission denied"));
    const { incrementWindow } = await load();

    await expect(incrementWindow("a", 1000, 5)).rejects.toThrow(/permission denied/);
    prismaMock.$queryRaw.mockReset();
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ found: true }])
      .mockResolvedValueOnce([{ hits: 3, reset_ms: 9 }]);
    await expect(incrementWindow("a", 1000, 5)).resolves.toMatchObject({ hits: 3 });
  });
});
