import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";

const sendMock = vi.hoisted(() => vi.fn());
const pathMock = vi.hoisted(() => ({ value: "/ambiental/herramientas/analisis-correlaciones" }));

vi.mock("@/lib/analytics/track", () => ({ sendToolEvent: sendMock }));
vi.mock("next/navigation", () => ({ usePathname: () => pathMock.value }));

import { ToolUsageTracker } from "../ToolUsageTracker";

const events = () => sendMock.mock.calls.map(([tool, name, data]) => ({ tool, name, data }));

describe("ToolUsageTracker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pathMock.value = "/ambiental/herramientas/analisis-correlaciones";
    document.body.innerHTML = "";
  });
  afterEach(cleanup);

  it("registra una visita al abrir una herramienta pública", () => {
    render(<ToolUsageTracker />);
    expect(events()).toEqual([
      { tool: "analisis-correlaciones", name: "tool_view", data: undefined },
    ]);
  });

  it("no mide páginas que no son herramientas públicas (blog, herramientas de autor)", () => {
    pathMock.value = "/ia/autor/herramientas/consulta-nota";
    render(<ToolUsageTracker />);
    pathMock.value = "/ia/blog/algo";
    render(<ToolUsageTracker />);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("una interacción cuenta una vez por minuto, no por clic", () => {
    render(<ToolUsageTracker />);
    const button = document.createElement("button");
    button.textContent = "Calcular";
    document.body.appendChild(button);

    button.click();
    button.click();
    button.click();

    expect(events().filter((e) => e.name === "tool_interaction")).toHaveLength(1);
  });

  it("un clic en la cabecera, el menú o el pie no es uso de la herramienta", () => {
    render(<ToolUsageTracker />);
    const nav = document.createElement("nav");
    const link = document.createElement("a");
    nav.appendChild(link);
    document.body.appendChild(nav);

    link.click();

    expect(events().filter((e) => e.name === "tool_interaction")).toHaveLength(0);
  });

  it("subir un CSV registra solo extensión y rango de tamaño, nunca el nombre ni el contenido", () => {
    render(<ToolUsageTracker />);
    const input = document.createElement("input");
    input.type = "file";
    document.body.appendChild(input);
    const file = new File(["fecha,valor\n2024,1"], "notas-de-maria-perez.CSV", { type: "text/csv" });
    Object.defineProperty(input, "files", { value: [file] });

    input.dispatchEvent(new Event("change", { bubbles: true }));

    const upload = events().find((e) => e.name === "file_upload")!;
    expect(upload.data).toEqual({ ext: "csv", size: "<100KB", files: 1 });
    expect(JSON.stringify(events())).not.toContain("maria");
  });

  it("detecta la exportación por el texto del botón y reconoce el formato", () => {
    render(<ToolUsageTracker />);
    const button = document.createElement("button");
    button.textContent = "Descargar PDF";
    document.body.appendChild(button);

    button.click();

    expect(events().find((e) => e.name === "tool_export")?.data).toEqual({ format: "pdf" });
  });

  it("los errores no controlados se registran solo con su nombre y con tope por visita", () => {
    render(<ToolUsageTracker />);
    for (let i = 0; i < 5; i++) {
      window.dispatchEvent(
        new ErrorEvent("error", { error: new TypeError("secreto ana@uni.edu 20241234567"), message: "x" }),
      );
    }

    const errors = events().filter((e) => e.name === "tool_error");
    expect(errors).toHaveLength(3);
    expect(errors[0].data).toEqual({ kind: "window_error", name: "TypeError" });
    expect(JSON.stringify(errors)).not.toContain("secreto");
  });

  it("al desmontar deja de escuchar", () => {
    const { unmount } = render(<ToolUsageTracker />);
    unmount();
    sendMock.mockClear();
    const button = document.createElement("button");
    document.body.appendChild(button);
    button.click();
    expect(sendMock).not.toHaveBeenCalled();
  });
});
