import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { rateLimitMock } = vi.hoisted(() => ({ rateLimitMock: vi.fn() }));

vi.mock("@/lib/security/rate-limit", () => ({
  rateLimit: rateLimitMock,
  getClientIP: () => "203.0.113.7",
}));

import { GET } from "./route";

const call = (z: string, x: string, y: string) =>
  GET(new NextRequest(`http://localhost/api/tiles/${z}/${x}/${y}`), {
    params: Promise.resolve({ z, x, y }),
  });

describe("GET /api/tiles/[z]/[x]/[y]", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    rateLimitMock.mockResolvedValue({ success: true, limit: 1500, remaining: 1499, reset: Date.now() + 60_000 });
    fetchMock.mockImplementation(async () => new Response(new Uint8Array([137, 80, 78, 71]), { status: 200 }));
  });

  it("sirve una tesela válida con caché y SIN CORS comodín", async () => {
    const response = await call("5", "10", "12");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
    expect(response.headers.get("cache-control")).toContain("s-maxage=");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://tile.openstreetmap.org/5/10/12.png",
      expect.any(Object),
    );
  });

  it.each([
    ["z mayor que 19", "20", "0", "0"],
    ["x fuera de rango para el zoom", "3", "8", "0"],
    ["y fuera de rango para el zoom", "3", "0", "8"],
    ["valores negativos", "-1", "0", "0"],
    ["decimales", "1.5", "0", "0"],
    ["notación científica", "1e1", "0", "0"],
    ["hexadecimal", "0x2", "0", "0"],
    ["ceros a la izquierda", "03", "0", "0"],
    ["no numérico", "a", "b", "c"],
    ["intento de path traversal", "..", "0", "0"],
    ["intento de inyección en la URL", "1", "0", "0%2F..%2Fx"],
  ])("rechaza %s con 400 sin llamar a OSM", async (_label, z, x, y) => {
    const response = await call(z, x, y);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("acepta los extremos del rango", async () => {
    expect((await call("0", "0", "0")).status).toBe(200);
    expect((await call("19", String(2 ** 19 - 1), String(2 ** 19 - 1))).status).toBe(200);
    expect((await call("19", String(2 ** 19), "0")).status).toBe(400);
  });

  it("aplica límite de tasa (429) y declara failureMode open de forma explícita", async () => {
    rateLimitMock.mockResolvedValue({ success: false, limit: 1500, remaining: 0, reset: Date.now() + 60_000 });

    const response = await call("1", "0", "0");

    expect(response.status).toBe(429);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(rateLimitMock).toHaveBeenCalledWith(
      "tiles:203.0.113.7",
      expect.objectContaining({ failureMode: "open" }),
    );
  });

  it("no filtra el estado de OSM: un fallo aguas arriba es 404/502", async () => {
    fetchMock.mockResolvedValue(new Response("x", { status: 503 }));
    expect((await call("1", "0", "0")).status).toBe(502);
  });
});
