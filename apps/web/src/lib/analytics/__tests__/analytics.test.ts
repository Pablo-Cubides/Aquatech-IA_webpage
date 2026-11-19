import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TOOLS, parseToolPath, safeEventData } from "../events";

describe("parseToolPath", () => {
  it("reconoce las 12 herramientas públicas", () => {
    const all = [
      ...PUBLIC_TOOLS.ia.map((t) => `/ia/herramientas/${t}`),
      ...PUBLIC_TOOLS.ambiental.map((t) => `/ambiental/herramientas/${t}`),
    ];
    expect(all).toHaveLength(12);
    for (const path of all) expect(parseToolPath(path)).not.toBeNull();
  });

  it("subrutas cuentan para su herramienta; lo demás no", () => {
    expect(parseToolPath("/ambiental/herramientas/generador-matrices/matrices/leopold")).toEqual({
      portal: "ambiental",
      tool: "generador-matrices",
    });
    expect(parseToolPath("/ia/autor/herramientas/consulta-nota")).toBeNull();
    expect(parseToolPath("/ia/herramientas")).toBeNull();
    expect(parseToolPath("/ia/herramientas/inventada")).toBeNull();
    expect(parseToolPath("/ambiental/herramientas/filtrado-ia")).toBeNull(); // portal equivocado
    expect(parseToolPath(null)).toBeNull();
  });
});

describe("safeEventData", () => {
  it("descarta texto libre, identidad y valores largos", () => {
    expect(
      safeEventData({
        text: "mi prompt privado",
        email: "a@b.co",
        codigo: "20241234567",
        strategy: "greedy",
        steps: 20,
        cached: true,
        casoFrase: "x",
        long: "y".repeat(41),
        "bad key": 1,
      }),
    ).toEqual({ strategy: "greedy", steps: 20, cached: true });
  });

  it("ignora valores no primitivos", () => {
    expect(safeEventData({ obj: { a: 1 }, arr: [1], n: NaN, ok: 1 })).toEqual({ ok: 1 });
  });
});

/** jsdom no implementa Blob.text(). */
function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

describe("sendToolEvent", () => {
  const beacon = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    beacon.mockReset().mockReturnValue(true);
    vi.stubGlobal("navigator", { sendBeacon: beacon, doNotTrack: null, webdriver: false });
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => vi.unstubAllGlobals());

  async function payload() {
    const blob = beacon.mock.calls[0][1] as Blob;
    return JSON.parse(await readBlob(blob));
  }

  it("envía esquema v1 con vid anónimo estable y sin datos personales", async () => {
    const { sendToolEvent } = await import("../track");
    sendToolEvent("visor-difusion", "tool_view", undefined, { portal: "ia" });
    sendToolEvent("visor-difusion", "tool_view", undefined, { portal: "ia" });

    const first = await payload();
    expect(first).toMatchObject({ tool: "visor-difusion", eventName: "tool_view" });
    expect(first.eventData).toMatchObject({ v: 1, portal: "ia", device: "desktop" });
    expect(first.eventData.vid).toMatch(/^[0-9a-f]{32}$/);
    expect(first.eventData.sid).toMatch(/^[0-9a-f]{32}$/);
    const second = JSON.parse(await readBlob(beacon.mock.calls[1][1] as Blob));
    expect(second.eventData.vid).toBe(first.eventData.vid);
  });

  it("no envía nada con Do Not Track activo", async () => {
    vi.stubGlobal("navigator", { sendBeacon: beacon, doNotTrack: "1" });
    const { sendToolEvent } = await import("../track");
    sendToolEvent("visor-difusion", "tool_view");
    expect(beacon).not.toHaveBeenCalled();
  });

  it("no envía nada con Global Privacy Control ni en navegadores automatizados", async () => {
    vi.stubGlobal("navigator", { sendBeacon: beacon, globalPrivacyControl: true });
    let mod = await import("../track");
    mod.sendToolEvent("visor-difusion", "tool_view");
    vi.resetModules();
    vi.stubGlobal("navigator", { sendBeacon: beacon, webdriver: true });
    mod = await import("../track");
    mod.sendToolEvent("visor-difusion", "tool_view");
    expect(beacon).not.toHaveBeenCalled();
  });

  it("si el almacenamiento está bloqueado, envía igualmente sin identificadores", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { sendToolEvent } = await import("../track");
    sendToolEvent("visor-difusion", "tool_view");
    const body = await payload();
    expect(body.eventData.vid).toBeUndefined();
    vi.restoreAllMocks();
  });

  it("nunca lanza, aunque falle el envío", async () => {
    beacon.mockImplementation(() => {
      throw new Error("boom");
    });
    const { sendToolEvent } = await import("../track");
    expect(() => sendToolEvent("visor-difusion", "tool_view")).not.toThrow();
  });
});
