import { beforeEach, describe, expect, it, vi } from "vitest";

const sentry = vi.hoisted(() => ({ captureMessage: vi.fn() }));
const log = vi.hoisted(() => ({ error: vi.fn() }));
vi.mock("@sentry/nextjs", () => sentry);
vi.mock("@/lib/logger", () => ({ logger: log }));

import {
  DEGRADATION_WINDOW_MS,
  getDegradationSnapshot,
  hasRecentDegradation,
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
    expect(getDegradationSnapshot(11 * 60_000).sinceInstanceStart["blog-store-db-fallback"].count).toBe(3);
  });

  describe("caducidad: un fallo pasado no deja la instancia degradada para siempre", () => {
    it("durante la ventana cuenta como reciente; pasada la ventana ya no", () => {
      reportDegradation("blog-store-db-fallback", new Error("x"), {}, 1_000_000);

      expect(hasRecentDegradation(1_000_000 + 60_000)).toBe(true);
      expect(hasRecentDegradation(1_000_000 + DEGRADATION_WINDOW_MS - 1)).toBe(true);
      expect(hasRecentDegradation(1_000_000 + DEGRADATION_WINDOW_MS)).toBe(false);
      expect(hasRecentDegradation(1_000_000 + 3 * 60 * 60_000)).toBe(false); // horas después
    });

    it("el acumulado se conserva pero NO figura como reciente", () => {
      reportDegradation("blog-articles-fallback", new Error("x"), {}, 1_000_000);
      const later = 1_000_000 + 2 * 60 * 60_000;

      const snapshot = getDegradationSnapshot(later);
      expect(snapshot.recent).toEqual({});
      expect(snapshot.sinceInstanceStart["blog-articles-fallback"].count).toBe(1);
      expect(snapshot.windowMinutes).toBe(10);
    });

    it("una recaída vuelve a marcarla como reciente", () => {
      reportDegradation("blog-store-db-fallback", new Error("x"), {}, 1_000_000);
      const later = 1_000_000 + 2 * 60 * 60_000;
      reportDegradation("blog-store-db-fallback", new Error("x"), {}, later);

      expect(hasRecentDegradation(later + 1)).toBe(true);
      expect(getDegradationSnapshot(later + 1).recent["blog-store-db-fallback"].count).toBe(1);
    });
  });

  it("SÍ avisa durante next build: ahí ocurre la degradación de los índices (sitemap, llms.txt)", () => {
    vi.stubEnv("NEXT_PHASE", "phase-production-build");
    reportDegradation("indexable-articles-incomplete", new Error("x"), { portal: "ia" });
    expect(log.error).toHaveBeenCalledTimes(1);
    expect(sentry.captureMessage).toHaveBeenCalledTimes(1);
    expect(getDegradationSnapshot().sinceInstanceStart["indexable-articles-incomplete"].count).toBe(1);
  });
});
