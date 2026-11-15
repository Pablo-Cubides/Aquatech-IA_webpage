import { beforeEach, describe, expect, it, vi } from "vitest";

const sdk = vi.hoisted(() => ({ init: vi.fn(), captureException: vi.fn() }));
vi.mock("@sentry/nextjs", () => sdk);

async function load(dsn: string) {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.stubEnv("SENTRY_DSN", dsn);
  vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", dsn);
  return import("../sentry-client");
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("Sentry del navegador con carga diferida", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sin DSN no carga el SDK ni al reportar un error", async () => {
    const { reportClientError, loadSentry } = await load("");
    reportClientError(new Error("x"));
    await flush();
    expect(await loadSentry()).toBeNull();
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.captureException).not.toHaveBeenCalled();
  });

  it("con DSN no carga nada hasta el primer error; entonces inicia una sola vez y reporta", async () => {
    const { installLazyErrorCapture } = await load("https://k@o1.ingest.sentry.io/2");
    installLazyErrorCapture();
    await flush();
    expect(sdk.init).not.toHaveBeenCalled(); // coste cero hasta que haya un error

    window.dispatchEvent(new ErrorEvent("error", { error: new TypeError("boom"), message: "boom" }));
    await flush();
    await flush();

    expect(sdk.init).toHaveBeenCalledTimes(1);
    expect(sdk.init.mock.calls[0][0]).toMatchObject({
      sendDefaultPii: false,
      dsn: "https://k@o1.ingest.sentry.io/2",
    });
    expect(sdk.captureException).toHaveBeenCalledTimes(1);

    // Una vez iniciado, los manejadores propios del SDK toman el relevo: no se duplica.
    window.dispatchEvent(new ErrorEvent("error", { error: new Error("otro"), message: "otro" }));
    await flush();
    expect(sdk.captureException).toHaveBeenCalledTimes(1);
    expect(sdk.init).toHaveBeenCalledTimes(1);
  });

  it("si el SDK no se puede descargar, no lanza", async () => {
    const { reportClientError } = await load("https://k@o1.ingest.sentry.io/2");
    sdk.init.mockImplementationOnce(() => {
      throw new Error("chunk failed");
    });
    expect(() => reportClientError(new Error("x"))).not.toThrow();
    await flush();
  });
});
