import { beforeEach, describe, expect, it, vi } from "vitest";

const sentry = vi.hoisted(() => ({ captureMessage: vi.fn() }));
const log = vi.hoisted(() => ({ error: vi.fn() }));
vi.mock("@sentry/nextjs", () => sentry);
vi.mock("@/lib/logger", () => ({ logger: log }));

import {
  getDegradationSnapshot,
  reportDegradation,
  resetDegradationForTests,
} from "../degradation";

describe("reportDegradation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    resetDegradationForTests();
  });

  it("deja log de error y evento en Sentry sin el mensaje de la base", () => {
    reportDegradation(
      "blog-store-db-fallback",
      new Error("password authentication failed for user postgres.abc at db.supabase.co"),
      { articlesFromDisk: 11 },
      1_000,
    );

    expect(log.error).toHaveBeenCalledTimes(1);
    expect(sentry.captureMessage).toHaveBeenCalledTimes(1);
    const sent = JSON.stringify(sentry.captureMessage.mock.calls[0]) + JSON.stringify(log.error.mock.calls[0]);
    expect(sent).not.toContain("supabase");
    expect(sent).not.toContain("password");
    expect(sent).toContain("articlesFromDisk");
  });

  it("limita a un aviso cada 10 minutos por tipo, pero sigue contando", () => {
    reportDegradation("blog-store-db-fallback", new Error("x"), {}, 0);
    reportDegradation("blog-store-db-fallback", new Error("x"), {}, 60_000);
    reportDegradation("blog-articles-fallback", new Error("x"), {}, 60_000);
    reportDegradation("blog-store-db-fallback", new Error("x"), {}, 11 * 60_000);

    expect(sentry.captureMessage).toHaveBeenCalledTimes(3);
    expect(getDegradationSnapshot()["blog-store-db-fallback"].count).toBe(3);
  });

  it("no avisa durante next build (sin base es lo esperado)", () => {
    vi.stubEnv("NEXT_PHASE", "phase-production-build");
    reportDegradation("blog-store-db-fallback", new Error("x"));
    expect(sentry.captureMessage).not.toHaveBeenCalled();
  });
});
