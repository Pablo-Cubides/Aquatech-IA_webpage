/**
 * VIS-008: un día suelto se muestra como ese mismo día en cualquier zona; «hoy» es el día de Colombia.
 */
import { afterEach, describe, expect, it } from "vitest";
import { SITE_TIME_ZONE, formatCalendarDate, parseCalendarDate, todayCalendarDate } from "../calendar-date";

const ORIGINAL_TZ = process.env.TZ;
afterEach(() => {
  if (ORIGINAL_TZ === undefined) delete process.env.TZ;
  else process.env.TZ = ORIGINAL_TZ;
});

const ZONES = ["America/Bogota", "UTC", "Pacific/Kiritimati", "Pacific/Pago_Pago"];

describe("el defecto que se corrige", () => {
  it("new Date('2024-01-15').toLocaleDateString() se corre un día en Colombia (documenta por qué existe el helper)", () => {
    process.env.TZ = "America/Bogota";
    expect(new Date("2024-01-15").getDate()).toBe(14);
  });
});

describe("formatCalendarDate: un día suelto no se corre en ninguna zona", () => {
  for (const zone of ZONES) {
    it(`TZ=${zone}`, () => {
      process.env.TZ = zone;
      expect(formatCalendarDate("2024-01-15", "es-ES", { day: "2-digit", month: "short", year: "numeric" })).toBe("15 ene 2024");
      expect(formatCalendarDate("2024-12-09", "es-ES", { day: "numeric", month: "long", year: "numeric" })).toBe("9 de diciembre de 2024");
      expect(formatCalendarDate("2024-02-29", "en-US")).toBe("2/29/2024");
    });
  }

  it("valores vacíos o inválidos dan cadena vacía, no «Invalid Date»", () => {
    for (const bad of ["", "   ", null, undefined, "no-es-fecha", "2026-02-30", "2026-13-01", "15/01/2024"]) {
      expect(formatCalendarDate(bad as string, "es-ES"), String(bad)).toBe("");
    }
  });

  it("un instante con hora se muestra en la zona del sitio, igual en cualquier zona de la máquina", () => {
    // 2026-11-22T03:00:00Z son las 22:00 del 21 en Bogotá.
    for (const zone of ZONES) {
      process.env.TZ = zone;
      expect(formatCalendarDate("2026-11-22T03:00:00Z", "es-ES", { day: "numeric", month: "numeric", year: "numeric" })).toBe("21/11/2026");
    }
  });
});

describe("parseCalendarDate", () => {
  for (const zone of ZONES) {
    it(`TZ=${zone}: el día local es el escrito`, () => {
      process.env.TZ = zone;
      const date = parseCalendarDate("2024-01-15");
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(0);
      expect(date?.getDate()).toBe(15);
    });
  }
  it("solo acepta YYYY-MM-DD reales", () => {
    expect(parseCalendarDate("2024-01-15T10:00:00Z")).toBeUndefined();
    expect(parseCalendarDate("2023-02-29")).toBeUndefined();
    expect(parseCalendarDate("2024-02-29")).toBeInstanceOf(Date);
    expect(parseCalendarDate("")).toBeUndefined();
    expect(parseCalendarDate(undefined)).toBeUndefined();
  });
});

describe("todayCalendarDate: «hoy» es el día de Colombia", () => {
  it("entre las 19:00 y las 24:00 de Bogotá sigue siendo el mismo día (UTC ya es mañana)", () => {
    expect(todayCalendarDate(new Date("2026-11-22T03:00:00Z"))).toBe("2026-11-21");
    expect(new Date("2026-11-22T03:00:00Z").toISOString().split("T")[0]).toBe("2026-11-22"); // el defecto antiguo
  });
  it("mediodía UTC es el mismo día", () => {
    expect(todayCalendarDate(new Date("2026-11-22T12:00:00Z"))).toBe("2026-11-22");
  });
  it("cambia de día a las 05:00 UTC (medianoche de Bogotá)", () => {
    expect(todayCalendarDate(new Date("2026-11-22T04:59:59Z"))).toBe("2026-11-21");
    expect(todayCalendarDate(new Date("2026-11-22T05:00:00Z"))).toBe("2026-11-22");
  });
  it("no depende de la zona de la máquina y acepta otra zona", () => {
    for (const zone of ZONES) {
      process.env.TZ = zone;
      expect(todayCalendarDate(new Date("2026-11-22T03:00:00Z"))).toBe("2026-11-21");
    }
    expect(todayCalendarDate(new Date("2026-11-22T03:00:00Z"), "UTC")).toBe("2026-11-22");
    expect(SITE_TIME_ZONE).toBe("America/Bogota");
  });
});
