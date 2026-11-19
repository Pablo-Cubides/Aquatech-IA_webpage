import { describe, expect, it } from "vitest";
import { getToolsByPortal } from "@/lib/services/tools-registry";
import { buildToolFaqs } from "../tool-faqs";

describe("buildToolFaqs: respuestas de FAQ de las herramientas reales", () => {
  for (const portal of ["ia", "ambiental"] as const) {
    for (const tool of getToolsByPortal(portal)) {
      it(`${portal}/${tool.slug}: sin marcado y terminando en frase completa`, () => {
        for (const faq of buildToolFaqs(tool, portal)) {
          expect(faq.answer, faq.question).not.toMatch(/\*\*|<[a-z/]|&[a-z]+;|\]\(/i);
          expect(faq.answer, faq.question).toMatch(/[.!?…]["')]?$/);
          expect(faq.answer, faq.question).not.toMatch(/\s[-–—]\s*\.$/); // "…5.1% -."
        }
      });
    }
  }
});
