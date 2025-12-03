import { describe, it, expect } from "vitest";
import { getFlagEmoji, DOMINIOS } from "../constants";
import { normalizeData, mergeCandidates } from "../utils";

// Helper type for test assertions on normalized data
type NormalizedData = Record<string, unknown>;

describe("Normas Ambientales - Constants and Utilities", () => {
  describe("getFlagEmoji", () => {
    describe("known countries", () => {
      it("should return correct flag for Colombia", () => {
        expect(getFlagEmoji("colombia")).toBe("🇨🇴");
        expect(getFlagEmoji("co")).toBe("🇨🇴");
        expect(getFlagEmoji("CO")).toBe("🇨🇴");
      });

      it("should return correct flag for Mexico", () => {
        expect(getFlagEmoji("mexico")).toBe("🇲🇽");
        expect(getFlagEmoji("mx")).toBe("🇲🇽");
      });

      it("should return correct flag for Peru", () => {
        expect(getFlagEmoji("peru")).toBe("🇵🇪");
        expect(getFlagEmoji("pe")).toBe("🇵🇪");
      });

      it("should return correct flag for Chile", () => {
        expect(getFlagEmoji("chile")).toBe("🇨🇱");
        expect(getFlagEmoji("cl")).toBe("🇨🇱");
      });

      it("should return correct flag for Argentina", () => {
        expect(getFlagEmoji("argentina")).toBe("🇦🇷");
        expect(getFlagEmoji("ar")).toBe("🇦🇷");
      });

      it("should return correct flag for Brazil", () => {
        expect(getFlagEmoji("brasil")).toBe("🇧🇷");
        expect(getFlagEmoji("brazil")).toBe("🇧🇷");
        expect(getFlagEmoji("br")).toBe("🇧🇷");
      });

      it("should return correct flag for United States", () => {
        expect(getFlagEmoji("estados-unidos")).toBe("🇺🇸");
        expect(getFlagEmoji("us")).toBe("🇺🇸");
      });

      it("should return correct flag for European Union", () => {
        expect(getFlagEmoji("union-europea")).toBe("🇪🇺");
        expect(getFlagEmoji("eu")).toBe("🇪🇺");
      });
    });

    describe("case insensitivity", () => {
      it("should handle uppercase country codes", () => {
        expect(getFlagEmoji("COLOMBIA")).toBe("🇨🇴");
        expect(getFlagEmoji("MEXICO")).toBe("🇲🇽");
      });

      it("should handle mixed case", () => {
        expect(getFlagEmoji("Colombia")).toBe("🇨🇴");
        expect(getFlagEmoji("Mexico")).toBe("🇲🇽");
      });
    });

    describe("ISO code conversion", () => {
      it("should convert 2-letter ISO codes to flags", () => {
        const result = getFlagEmoji("co");
        expect(result).toBeTruthy();
        expect(result).not.toBe("🏳️");
      });

      it("should handle case variations in ISO codes", () => {
        expect(getFlagEmoji("co")).toBe(getFlagEmoji("CO"));
      });
    });

    describe("fallback behavior", () => {
      it("should return white flag for undefined", () => {
        expect(getFlagEmoji(undefined)).toBe("🏳️");
      });

      it("should return white flag for empty string", () => {
        expect(getFlagEmoji("")).toBe("🏳️");
      });

      it("should return white flag for unknown country", () => {
        const result = getFlagEmoji("unknown-country");
        // Could be 🏳️ (white flag) or 🇺🇳 (UN flag) depending on implementation
        expect(result).toMatch(/🏳️|🇺🇳/);
      });
    });

    describe("name-based inference", () => {
      it("should infer flag from country name", () => {
        const result = getFlagEmoji("test", "Colombia");
        expect(result).toBeTruthy();
      });

      it("should handle lowercase names", () => {
        const result = getFlagEmoji("test", "mexico");
        expect(result).toBeTruthy();
      });
    });
  });

  describe("DOMINIOS", () => {
    it("should contain agua domain", () => {
      const agua = DOMINIOS.find((d) => d.id === "agua");
      expect(agua).toBeDefined();
      expect(agua?.label).toBe("Calidad del Agua");
      expect(agua?.icon).toBe("💧");
    });

    it("should contain calidad-aire domain", () => {
      const aire = DOMINIOS.find((d) => d.id === "calidad-aire");
      expect(aire).toBeDefined();
      expect(aire?.label).toBe("Calidad del Aire");
      expect(aire?.icon).toBe("💨");
    });

    it("should contain residuos-solidos domain", () => {
      const residuos = DOMINIOS.find((d) => d.id === "residuos-solidos");
      expect(residuos).toBeDefined();
      expect(residuos?.label).toBe("Residuos Sólidos");
      expect(residuos?.icon).toBe("♻️");
    });

    it("should contain vertimientos domain", () => {
      const vertimientos = DOMINIOS.find((d) => d.id === "vertimientos");
      expect(vertimientos).toBeDefined();
      expect(vertimientos?.label).toBe("Vertimientos");
      expect(vertimientos?.icon).toBe("🫗");
    });

    it("should have all domains with required fields", () => {
      DOMINIOS.forEach((domain) => {
        expect(domain.id).toBeTruthy();
        expect(domain.label).toBeTruthy();
        expect(domain.icon).toBeTruthy();
        expect(domain.description).toBeTruthy();
      });
    });

    it("should have exactly 4 domains", () => {
      expect(DOMINIOS).toHaveLength(4);
    });

    it("should have unique domain IDs", () => {
      const ids = DOMINIOS.map((d) => d.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe("normalizeData", () => {
    it("should return empty object for null input", () => {
      const result = normalizeData(null);
      expect(result).toEqual({});
    });

    it("should return empty object for undefined input", () => {
      const result = normalizeData(undefined);
      expect(result).toEqual({});
    });

    it("should return empty object for non-object input", () => {
      expect(normalizeData("string")).toEqual({});
      expect(normalizeData(123)).toEqual({});
      expect(normalizeData(true)).toEqual({});
    });

    it("should normalize country field", () => {
      const input = { country: "Colombia" };
      const result = normalizeData(input) as NormalizedData;
      expect(result.country).toBe("Colombia");
      expect(result.pais).toBe("Colombia");
    });

    it("should map pais to country", () => {
      const input = { pais: "México" };
      const result = normalizeData(input) as NormalizedData;
      expect(result.pais).toBe("México");
      expect(result.country).toBe("México");
    });

    it("should normalize domain field", () => {
      const input = { domain: "agua" };
      const result = normalizeData(input) as NormalizedData;
      expect(result.domain).toBe("agua");
      expect(result.dominio).toBe("agua");
    });

    it("should map dominio to domain", () => {
      const input = { dominio: "calidad-aire" };
      const result = normalizeData(input) as NormalizedData;
      expect(result.dominio).toBe("calidad-aire");
      expect(result.domain).toBe("calidad-aire");
    });

    it("should normalize version and lastUpdate", () => {
      const input = { version: "2024-01", lastUpdate: "2024-06" };
      const result = normalizeData(input) as NormalizedData;
      expect(result.version).toBe("2024-01");
      expect(result.lastUpdate).toBe("2024-06");
    });

    it("should map records to registros", () => {
      const records = [{ parameter: "pH", limit: 7.5 }];
      const input = { records };
      const result = normalizeData(input) as NormalizedData;
      expect(result.records).toEqual(records);
      expect(result.registros).toEqual(records);
    });

    it("should map registros to records", () => {
      const registros = [{ parametro: "Temperatura", limite: 35 }];
      const input = { registros };
      const result = normalizeData(input) as NormalizedData;
      expect(result.registros).toEqual(registros);
      expect(result.records).toEqual(registros);
    });

    it("should normalize reference field", () => {
      const reference = { norm: "Decreto 1076", year: 2015 };
      const input = { reference };
      const result = normalizeData(input) as NormalizedData;
      expect(result.reference).toEqual(reference);
      expect(result.referencia).toEqual(reference);
    });

    it("should handle complex nested data", () => {
      const input = {
        country: "Colombia",
        domain: "agua",
        version: "2024",
        records: [
          { parameter: "pH", value: 7.5 },
          { parameter: "Turbidity", value: 5 },
        ],
        reference: { norm: "Resolución 2115", year: 2007 },
      };

      const result = normalizeData(input) as NormalizedData;
      expect(result.country).toBe("Colombia");
      expect(result.pais).toBe("Colombia");
      expect(result.domain).toBe("agua");
      expect(result.dominio).toBe("agua");
      expect(result.records).toHaveLength(2);
      expect(result.registros).toHaveLength(2);
      expect(result.reference).toEqual(input.reference);
    });

    it("should preserve sectors field", () => {
      const sectors = { industrial: true, residential: false };
      const input = { sectors };
      const result = normalizeData(input) as NormalizedData;
      expect(result.sectors).toEqual(sectors);
    });
  });

  describe("mergeCandidates", () => {
    it("should attach domain if missing", () => {
      const normalized = { country: "Colombia" };
      const result = mergeCandidates(normalized, "agua", null) as NormalizedData;
      expect(result.domain).toBe("agua");
    });

    it("should attach country if missing", () => {
      const normalized = { domain: "agua" };
      const result = mergeCandidates(normalized, null, "Colombia") as NormalizedData;
      expect(result.country).toBe("Colombia");
    });

    it("should attach both domain and country if missing", () => {
      const normalized = { version: "2024" };
      const result = mergeCandidates(
        normalized,
        "calidad-aire",
        "Mexico",
      ) as NormalizedData;
      expect(result.domain).toBe("calidad-aire");
      expect(result.country).toBe("Mexico");
    });

    it("should not override existing domain", () => {
      const normalized = { domain: "agua", country: "Colombia" };
      const result = mergeCandidates(normalized, "calidad-aire", null) as NormalizedData;
      expect(result.domain).toBe("agua"); // Should keep original
    });

    it("should not override existing country", () => {
      const normalized = { domain: "agua", country: "Colombia" };
      const result = mergeCandidates(normalized, null, "Mexico") as NormalizedData;
      expect(result.country).toBe("Colombia"); // Should keep original
    });

    it("should handle empty normalized object", () => {
      const result = mergeCandidates({}, "vertimientos", "Peru") as NormalizedData;
      expect(result.domain).toBe("vertimientos");
      expect(result.country).toBe("Peru");
    });

    it("should handle null normalized input", () => {
      const result = mergeCandidates(null, "agua", "Chile") as NormalizedData;
      expect(result.domain).toBe("agua");
      expect(result.country).toBe("Chile");
    });

    it("should preserve other fields", () => {
      const normalized = {
        version: "2024",
        records: [{ param: "pH" }],
        extraField: "test",
      };
      const result = mergeCandidates(normalized, "agua", "Colombia") as NormalizedData;
      expect(result.version).toBe("2024");
      expect(result.records).toEqual([{ param: "pH" }]);
      expect(result.extraField).toBe("test");
    });
  });
});
