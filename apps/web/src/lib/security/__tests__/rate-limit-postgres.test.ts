import { createHmac } from "node:crypto";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  $executeRawUnsafe: vi.fn(),
}));
const nextServerMock = vi.hoisted(() => ({ after: vi.fn() }));

vi.mock("@ia-next/database", () => ({ prisma: prismaMock }));
vi.mock("next/server", () => nextServerMock);

async function load() {
  vi.resetModules();
  return import("@/lib/security/rate-limit-postgres");
}

/** Los valores enlazados de una plantilla etiquetada de Prisma: [strings, ...valores]. */
function boundValues(call: unknown[]): unknown[] {
  return call.slice(1);
}

const RLS_ON = [{ rls: true }];
const RLS_OFF = [{ rls: false }];

describe("incrementWindow (almacén PostgreSQL del limitador)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("NEXTAUTH_SECRET", "secreto-de-prueba");
    prismaMock.$executeRawUnsafe.mockResolvedValue(0);
  });

  afterEach(() => vi.useRealTimers());

  it("con la tabla creada y con RLS (migración aplicada) no ejecuta DDL", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce(RLS_ON)
      .mockResolvedValueOnce([{ hits: 1, reset_ms: 5000 }]);
    const { incrementWindow } = await load();

    expect(await incrementWindow("rate-limit:a", 60_000, 5)).toEqual({ hits: 1, resetAt: 5000 });
    expect(prismaMock.$executeRawUnsafe).not.toHaveBeenCalled();
  });

  it("solo comprueba la tabla una vez por instancia", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce(RLS_ON)
      .mockResolvedValue([{ hits: 2, reset_ms: 1 }]);
    const { incrementWindow } = await load();

    await incrementWindow("x", 1000, 5);
    await incrementWindow("x", 1000, 5);
    expect(prismaMock.$queryRaw).toHaveBeenCalledTimes(3); // 1 comprobación + 2 incrementos
  });

  it("guarda un HMAC con subclave de dominio, nunca el identificador en claro ni el HMAC directo del secreto", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce(RLS_ON)
      .mockResolvedValueOnce([{ hits: 1, reset_ms: 1 }]);
    const { incrementWindow } = await load();

    await incrementWindow("rate-limit:ip:203.0.113.9", 1000, 5);
    const bucket = String(boundValues(prismaMock.$queryRaw.mock.calls[1])[0]);

    expect(bucket).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(boundValues(prismaMock.$queryRaw.mock.calls[1]))).not.toContain("203.0.113.9");

    const subkey = createHmac("sha256", "secreto-de-prueba").update("rate-limit:v1").digest();
    expect(bucket).toBe(createHmac("sha256", subkey).update("rate-limit:ip:203.0.113.9").digest("hex"));
    const direct = createHmac("sha256", "secreto-de-prueba").update("rate-limit:ip:203.0.113.9").digest("hex");
    expect(bucket).not.toBe(direct);
  });

  it("el mismo identificador cae siempre en el mismo cubo y otro distinto en otro", async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ hits: 1, reset_ms: 1 }]);
    prismaMock.$queryRaw.mockResolvedValueOnce(RLS_ON);
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

  describe("límite de tiempo", () => {
    it("si la base no responde, lanza a los 1,8 s en vez de colgar la petición 30-60 s", async () => {
      vi.useFakeTimers();
      prismaMock.$queryRaw.mockReturnValue(new Promise(() => undefined)); // nunca responde
      const { incrementWindow, STORE_TIMEOUT_MS } = await load();

      const result = incrementWindow("a", 1000, 5);
      const assertion = expect(result).rejects.toThrow(/Timeout/);
      await vi.advanceTimersByTimeAsync(STORE_TIMEOUT_MS + 1);
      await assertion;
      expect(STORE_TIMEOUT_MS).toBeLessThanOrEqual(2000);
    });

    it("si responde a tiempo no lanza", async () => {
      prismaMock.$queryRaw
        .mockResolvedValueOnce(RLS_ON)
        .mockResolvedValueOnce([{ hits: 1, reset_ms: 1 }]);
      const { incrementWindow } = await load();
      await expect(incrementWindow("a", 1000, 5)).resolves.toMatchObject({ hits: 1 });
    });
  });

  describe("RLS (la tabla vive en `public`, expuesta a PostgREST)", () => {
    it("tabla sin RLS y no se puede activar (rol no dueño): LANZA y no cuenta", async () => {
      prismaMock.$queryRaw.mockResolvedValue(RLS_OFF);
      prismaMock.$executeRawUnsafe.mockRejectedValue(new Error("must be owner of table"));
      const { incrementWindow } = await load();

      await expect(incrementWindow("a", 1000, 5)).rejects.toThrow(/sin RLS/);
      // ninguna consulta de conteo llegó a ejecutarse
      expect(prismaMock.$queryRaw.mock.calls.every((c) => !String(c[0]).includes("INSERT"))).toBe(true);
    });

    it("tabla existente sin RLS pero activable: la activa y sigue", async () => {
      prismaMock.$queryRaw
        .mockResolvedValueOnce(RLS_OFF) // existe sin RLS
        .mockResolvedValueOnce(RLS_ON) // tras ALTER ... ENABLE ROW LEVEL SECURITY
        .mockResolvedValueOnce([{ hits: 1, reset_ms: 1 }]);
      const { incrementWindow } = await load();

      await expect(incrementWindow("a", 1000, 5)).resolves.toMatchObject({ hits: 1 });
      expect(prismaMock.$executeRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining("ENABLE ROW LEVEL SECURITY"),
      );
    });

    it("si falta la tabla la crea con el mismo CHECK que la migración y exige RLS", async () => {
      prismaMock.$queryRaw
        .mockResolvedValueOnce(undefined as never) // no existe → rows[0] undefined
        .mockResolvedValueOnce(RLS_OFF) // recién creada
        .mockResolvedValueOnce(RLS_ON) // tras activar RLS
        .mockResolvedValueOnce([{ hits: 1, reset_ms: 1 }]);
      prismaMock.$queryRaw.mockReset();
      prismaMock.$queryRaw
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(RLS_OFF)
        .mockResolvedValueOnce(RLS_ON)
        .mockResolvedValueOnce([{ hits: 1, reset_ms: 1 }]);
      const { incrementWindow } = await load();

      await expect(incrementWindow("a", 1000, 5)).resolves.toMatchObject({ hits: 1 });
      const ddl = prismaMock.$executeRawUnsafe.mock.calls.map((c) => String(c[0])).join("\n");
      expect(ddl).toContain("CHECK (hits >= 0)");
      expect(ddl).toContain("ENABLE ROW LEVEL SECURITY");
    });

    it("carrera entre instancias: si el CREATE falla pero la tabla ya existe (con RLS), no falla", async () => {
      prismaMock.$queryRaw
        .mockResolvedValueOnce([]) // no existe
        .mockResolvedValueOnce(RLS_ON) // la otra instancia ya la creó
        .mockResolvedValueOnce(RLS_ON)
        .mockResolvedValueOnce([{ hits: 1, reset_ms: 1 }]);
      prismaMock.$executeRawUnsafe.mockRejectedValueOnce(new Error("duplicate key pg_type"));
      const { incrementWindow } = await load();

      await expect(incrementWindow("a", 1000, 5)).resolves.toMatchObject({ hits: 1 });
    });

    it("sin permiso CREATE y sin tabla: lanza el error real y reintenta en la siguiente petición", async () => {
      prismaMock.$queryRaw.mockResolvedValue([]);
      prismaMock.$executeRawUnsafe.mockRejectedValue(new Error("permission denied"));
      const { incrementWindow } = await load();

      await expect(incrementWindow("a", 1000, 5)).rejects.toThrow(/permission denied/);

      prismaMock.$queryRaw.mockReset();
      prismaMock.$queryRaw
        .mockResolvedValueOnce(RLS_ON)
        .mockResolvedValueOnce([{ hits: 3, reset_ms: 9 }]);
      await expect(incrementWindow("a", 1000, 5)).resolves.toMatchObject({ hits: 3 });
    });
  });

  describe("limpieza de filas vencidas", () => {
    it("borra por lotes y sin bloquear la respuesta (after)", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0); // fuerza la limpieza
      prismaMock.$queryRaw
        .mockResolvedValueOnce(RLS_ON)
        .mockResolvedValueOnce([{ hits: 1, reset_ms: 1 }]);
      const { incrementWindow } = await load();

      await incrementWindow("a", 1000, 5);

      expect(nextServerMock.after).toHaveBeenCalledTimes(1);
      // la limpieza aún no se ha ejecutado: la respuesta no la espera
      expect(prismaMock.$executeRawUnsafe).not.toHaveBeenCalled();
      await nextServerMock.after.mock.calls[0][0]();
      const sql = String(prismaMock.$executeRawUnsafe.mock.calls[0][0]);
      expect(sql).toContain("LIMIT 1000");
      expect(sql).toContain("ctid");
      vi.restoreAllMocks();
    });

    it("sin contexto de petición (after lanza) sigue sin esperar ni romper", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0);
      nextServerMock.after.mockImplementationOnce(() => {
        throw new Error("after() fuera de una petición");
      });
      prismaMock.$queryRaw
        .mockResolvedValueOnce(RLS_ON)
        .mockResolvedValueOnce([{ hits: 1, reset_ms: 1 }]);
      const { incrementWindow } = await load();

      await expect(incrementWindow("a", 1000, 5)).resolves.toMatchObject({ hits: 1 });
      vi.restoreAllMocks();
    });
  });
});
