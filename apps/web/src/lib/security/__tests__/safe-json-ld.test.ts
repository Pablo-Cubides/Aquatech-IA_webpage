import { describe, expect, it, vi } from "vitest";
import { safeJsonLd } from "@/lib/security/safe-json-ld";

describe("safeJsonLd", () => {
  it("un título con </script> no puede cerrar el bloque", () => {
    const out = safeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script");
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });

  it("escapa < > & y es JSON equivalente al original", () => {
    const data = { a: "<b>&amp;</b>", n: [1, 2, { x: "a&b" }] };
    const out = safeJsonLd(data);
    expect(out).not.toMatch(/[<>&]/);
    expect(JSON.parse(out)).toEqual(data);
  });

  it("escapa U+2028 y U+2029", () => {
    const data = { t: `a${String.fromCharCode(0x2028)}b${String.fromCharCode(0x2029)}c` };
    const out = safeJsonLd(data);
    expect(out).not.toContain(String.fromCharCode(0x2028));
    expect(out).not.toContain(String.fromCharCode(0x2029));
    expect(JSON.parse(out)).toEqual(data);
  });

  it("neutraliza comentarios HTML", () => {
    expect(safeJsonLd({ t: "<!-- x -->" })).not.toContain("<!--");
  });

  it("deja intacto un JSON-LD normal", () => {
    const data = { "@context": "https://schema.org", "@type": "Article", headline: "Calidad del agua" };
    expect(safeJsonLd(data)).toBe(JSON.stringify(data));
  });

  it("si no es serializable devuelve {} y lo registra (nunca lanza ni emite HTML roto)", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(safeJsonLd(cyclic)).toBe("{}");
    expect(safeJsonLd(undefined)).toBe("{}");
    expect(safeJsonLd({ n: BigInt(1) })).toBe("{}");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
