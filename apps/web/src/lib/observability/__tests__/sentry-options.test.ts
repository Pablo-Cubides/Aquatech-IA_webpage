import { describe, expect, it } from "vitest";
import type { ErrorEvent } from "@sentry/nextjs";
import { scrubBreadcrumb, scrubEvent, scrubText, scrubUrl, toolFromUrl } from "../sentry-options";

const base = (extra: Partial<ErrorEvent> = {}): ErrorEvent => ({ type: undefined, ...extra }) as ErrorEvent;

describe("scrubText", () => {
  it("enmascara correos, códigos de estudiante y tokens largos", () => {
    const out = scrubText("falló para ana.perez@uni.edu.co con código 20241234567 y token abcdefghijklmnopqrstuvwxyz0123456789");
    expect(out).not.toMatch(/ana\.perez|20241234567|abcdefghijklmnopqrstuvwxyz0123456789/);
    expect(out).toContain("[email]");
    expect(out).toContain("[num]");
    expect(out).toContain("[token]");
  });

  it("deja intacto el texto sin datos personales", () => {
    expect(scrubText("TypeError: x is undefined (línea 42)")).toBe("TypeError: x is undefined (línea 42)");
  });
});

describe("scrubUrl", () => {
  it("quita query y fragmento", () => {
    expect(scrubUrl("https://aquatechia.com/ia/consulta?codigo=20241234567#x")).toBe("https://aquatechia.com/ia/consulta");
    expect(scrubUrl("/ia/consulta?codigo=1")).toBe("/ia/consulta");
  });
});

describe("toolFromUrl", () => {
  it("reconoce herramientas públicas y no las de autor ni el resto", () => {
    expect(toolFromUrl("https://aquatechia.com/ambiental/herramientas/analisis-correlaciones?x=1")).toBe("analisis-correlaciones");
    expect(toolFromUrl("/ia/herramientas/visor-difusion")).toBe("visor-difusion");
    expect(toolFromUrl("/ia/autor/herramientas/consulta-nota")).toBeNull();
    expect(toolFromUrl("/ia/blog/x")).toBeNull();
    expect(toolFromUrl(undefined)).toBeNull();
  });
});

describe("scrubEvent", () => {
  it("elimina usuario, IP, cookies, cabeceras, cuerpo y query", () => {
    const event = scrubEvent(
      base({
        user: { id: "u1", email: "a@b.co", ip_address: "1.2.3.4" },
        server_name: "lambda-123",
        request: {
          url: "https://aquatechia.com/api/notes?code=20241234567",
          method: "POST",
          headers: { cookie: "session=zzz", authorization: "Bearer x" },
          cookies: { session: "zzz" },
          data: { email: "a@b.co", nota: 4.5 },
          query_string: "code=20241234567",
        },
      }),
    )!;
    expect(event.user).toBeUndefined();
    expect(event.server_name).toBeUndefined();
    expect(event.request).toEqual({ url: "https://aquatechia.com/api/notes", method: "POST" });
  });

  it("enmascara mensajes y excepciones y etiqueta la herramienta", () => {
    const event = scrubEvent(
      base({
        message: "fallo con maria@uni.edu",
        exception: { values: [{ type: "Error", value: "código 123456 no válido" }] },
        request: { url: "https://aquatechia.com/ambiental/herramientas/indice-calidad-agua" },
      }),
    )!;
    expect(event.message).toBe("fallo con [email]");
    expect(event.exception!.values![0].value).toBe("código [num] no válido");
    expect(event.tags).toMatchObject({ tool: "indice-calidad-agua" });
  });

  it("descarta health y webhooks", () => {
    expect(scrubEvent(base({ request: { url: "https://x.co/api/health" } }))).toBeNull();
    expect(scrubEvent(base({ request: { url: "https://x.co/api/mp/webhook" } }))).toBeNull();
  });
});

describe("scrubBreadcrumb", () => {
  it("limpia URLs de fetch y quita el texto de las pulsaciones", () => {
    const fetchCrumb = scrubBreadcrumb({ category: "fetch", data: { url: "/api/x?code=999999", body: "secreto" } })!;
    expect(fetchCrumb.data).toEqual({ url: "/api/x" });
    const click = scrubBreadcrumb({ category: "ui.click", message: "button.enviar nota 4.5" })!;
    expect(click.message).toBeUndefined();
  });
});
