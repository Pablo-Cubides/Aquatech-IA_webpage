// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Logger REAL, sin simular: lo que importa es que lo instrumentado llegue a la consola de producción.
describe("logger en producción (contrato de emisión)", () => {
  const spies = {
    info: vi.spyOn(console, "info").mockImplementation(() => {}),
    warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
    error: vi.spyOn(console, "error").mockImplementation(() => {}),
    log: vi.spyOn(console, "log").mockImplementation(() => {}),
  };

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    for (const spy of Object.values(spies)) spy.mockClear();
  });
  afterEach(() => vi.unstubAllEnvs());

  it.each(["info", "warn", "error"] as const)("%s sale por su método de consola", async (level) => {
    const { logger } = await import("../logger");
    logger[level]("mensaje de prueba");
    expect(spies[level]).toHaveBeenCalledTimes(1);
    expect(String(spies[level].mock.calls[0][0])).toContain('"level":"' + level + '"');
  });

  it("debug no sale en producción (silencio por diseño)", async () => {
    const { logger } = await import("../logger");
    logger.debug("ruido");
    for (const spy of Object.values(spies)) expect(spy).not.toHaveBeenCalled();
  });

  it("en el navegador info no sale (no llenar la consola del visitante) pero warn y error sí", async () => {
    vi.stubGlobal("window", {});
    const { logger } = await import("../logger");
    logger.info("visor");
    logger.warn("aviso");
    logger.error("fallo");
    expect(spies.info).not.toHaveBeenCalled();
    expect(spies.warn).toHaveBeenCalledTimes(1);
    expect(spies.error).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
