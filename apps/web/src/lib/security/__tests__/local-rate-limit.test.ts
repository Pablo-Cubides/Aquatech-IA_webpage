import { beforeEach, describe, expect, it } from "vitest";
import { localRateLimit, resetLocalRateLimitForTests } from "@/lib/security/local-rate-limit";

describe("localRateLimit", () => {
  beforeEach(() => resetLocalRateLimitForTests());

  it("permite hasta el límite y rechaza después", () => {
    for (let i = 0; i < 3; i++) expect(localRateLimit("k", 3, 1000, 0).success).toBe(true);
    expect(localRateLimit("k", 3, 1000, 0).success).toBe(false);
  });

  it("la ventana se reinicia al vencer", () => {
    for (let i = 0; i < 4; i++) localRateLimit("k", 3, 1000, 0);
    expect(localRateLimit("k", 3, 1000, 1001).success).toBe(true);
  });

  it("cuenta cada clave por separado", () => {
    localRateLimit("a", 1, 1000, 0);
    expect(localRateLimit("a", 1, 1000, 0).success).toBe(false);
    expect(localRateLimit("b", 1, 1000, 0).success).toBe(true);
  });

  it("la memoria queda acotada", () => {
    for (let i = 0; i < 10_500; i++) localRateLimit(`k${i}`, 1, 60_000, 0);
    // Tras superar el tope, las claves antiguas se descartan (la primera ya no cuenta como vista).
    expect(localRateLimit("k0", 1, 60_000, 0).success).toBe(true);
  });
});
