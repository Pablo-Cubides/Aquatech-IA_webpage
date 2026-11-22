/**
 * VIS-008: la fecha de una muestra del CSV (`2024-01-15`) se queda en el 15 en cualquier zona.
 * Antes se leía como medianoche UTC y en Colombia salía «14».
 */
import { afterEach, describe, expect, it } from "vitest";
import { csvToWaterSamples, parseCSV } from "../csv-utils";

const ORIGINAL_TZ = process.env.TZ;
afterEach(() => {
  if (ORIGINAL_TZ === undefined) delete process.env.TZ;
  else process.env.TZ = ORIGINAL_TZ;
});

describe("fecha de la muestra del CSV", () => {
  it("se conserva el día en cualquier zona de la máquina", () => {
    const csv = "date,location,parameter,value\n2024-01-15,Rio Bogota,ph,7.1\n";
    for (const zone of ["America/Bogota", "UTC", "Pacific/Kiritimati"]) {
      process.env.TZ = zone;
      const samples = csvToWaterSamples(parseCSV(csv));
      expect(samples.length, zone).toBeGreaterThan(0);
      expect(samples[0].sampleDate, zone).toBe("2024-01-15");
      expect(samples[0].date?.getDate(), zone).toBe(15);
      expect(samples[0].date?.getMonth(), zone).toBe(0);
    }
  });
});
