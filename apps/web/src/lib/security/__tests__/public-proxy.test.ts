import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { z } from "zod";

const { rateLimitMock } = vi.hoisted(() => ({ rateLimitMock: vi.fn() }));
vi.mock("@/lib/security/rate-limit", () => ({
  rateLimit: rateLimitMock,
  getClientIP: () => "203.0.113.7",
}));
vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { resetLocalRateLimitForTests } from "@/lib/security/local-rate-limit";
import {
  bboxString,
  fetchUpstreamJson,
  guardPublicProxy,
  queryInt,
  toUpstreamQuery,
} from "@/lib/security/public-proxy";

const schema = z.strictObject({ n: queryInt(1, 10).default(5) });
const req = (query: string) => new NextRequest(`http://localhost/x${query}`);

describe("guardPublicProxy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetLocalRateLimitForTests();
  });

  it("memory: no toca el almacén compartido y limita por IP", async () => {
    const opts = { name: "t", schema, perMinutePerIp: 2, limiter: "memory" as const };
    expect((await guardPublicProxy(req("?n=3"), opts)).ok).toBe(true);
    expect((await guardPublicProxy(req(""), opts)).ok).toBe(true);
    const third = await guardPublicProxy(req(""), opts);
    expect(third.ok).toBe(false);
    if (!third.ok) {
      expect(third.response.status).toBe(429);
      expect(third.response.headers.get("retry-after")).toBeTruthy();
    }
    expect(rateLimitMock).not.toHaveBeenCalled();
  });

  it("rechaza enteros no canónicos y fuera de rango", async () => {
    const opts = { name: "t", schema, perMinutePerIp: 100, limiter: "memory" as const };
    for (const q of ["?n=0", "?n=11", "?n=1e1", "?n=0x5", "?n=05", "?n=-1", "?n=1.5", "?n="]) {
      const r = await guardPublicProxy(req(q), opts);
      expect(r.ok, q).toBe(false);
    }
  });

  it("clave desconocida: 400 que nombra la clave", async () => {
    const r = await guardPublicProxy(req("?evil=1"), { name: "t", schema, perMinutePerIp: 5, limiter: "memory" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      const body = await r.response.json();
      expect(JSON.stringify(body)).toContain("evil");
    }
  });
});

describe("fetchUpstreamJson", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("no reenvía el cuerpo de error del proveedor", async () => {
    fetchMock.mockResolvedValue(new Response("SECRET-INTERNAL-DETAIL", { status: 500 }));
    const r = await fetchUpstreamJson("t", "https://example.test/", { timeoutMs: 1000 });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.response.status).toBe(502);
      expect(await r.response.text()).not.toContain("SECRET-INTERNAL-DETAIL");
    }
  });

  it("corta respuestas por encima del tope", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ a: "x".repeat(200) }), { status: 200 }));
    const r = await fetchUpstreamJson("t", "https://example.test/", { timeoutMs: 1000, maxBytes: 50 });
    expect(r.ok).toBe(false);
  });

  it("pasa una señal con timeout al fetch", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    await fetchUpstreamJson("t", "https://example.test/", { timeoutMs: 1000 });
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });
});

describe("piezas de esquema", () => {
  it("bboxString valida rango y orden", () => {
    expect(bboxString.safeParse("-82,-5,-66,14").success).toBe(true);
    expect(bboxString.safeParse("-82,-5,-66,140").success).toBe(false);
    expect(bboxString.safeParse("1,1,0,0").success).toBe(false);
    expect(bboxString.safeParse("1,2,3").success).toBe(false);
  });

  it("toUpstreamQuery ordena y omite indefinidos", () => {
    expect(toUpstreamQuery({ b: 2, a: "x y", c: undefined })).toBe("a=x+y&b=2");
  });
});
