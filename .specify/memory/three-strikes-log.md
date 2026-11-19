# Three-Strikes Log

> Running log of three-strikes rule triggers. Reviewed monthly.  
> See: [.specify/instructions/three-strikes-rule.md](../instructions/three-strikes-rule.md)

---

## [2026-04-28] — SDD Bootstrap

- **Detected by**: Claude Code (initial SDD implementation)
- **Pattern**: Manual article creation (TypeScript data files) done repeatedly without a scaffold script
- **Instances**: `write-ia-articles.js` (legacy), `new-blog-articles.ts` patterns, `new-ambiental-articles.ts` patterns
- **Artifact created**: `.specify/scripts/new-content.mjs`, `.github/prompts/content.new.prompt.md`
- **Result**: `pnpm content:new <portal> <slug>` scaffolds full article file from template

---

## [2026-04-28] — Image optimization bootstrap

- **Detected by**: Claude Code (initial SDD implementation)
- **Pattern**: Images added without consistent optimization pipeline (mixed sizes, formats, no budget enforcement)
- **Instances**: Multiple images in `public/images/portal-ia/blog/` without AVIF variants
- **Artifact created**: `.specify/scripts/optimize-image.mjs`, `.github/workflows/image-budget.yml`
- **Result**: `pnpm img:optimize <path>` enforces budget + generates variants

---

## [2026-11-17] — Constantes normativas duplicadas (DOM-001)

- **Detected by**: cargo Dominio Técnico-Normativo
- **Pattern**: los mismos límites de calidad del aire/agua vivían en 3 copias divergentes (JSON público, texto de artículos, cortes del calculador de ICA)
- **Instances**: `public/data/calidad-aire/colombia.json`, artículos de normas/aire, `indice-calidad-aire/data/breakpoints/*`, `indice-calidad-agua/data/irca-parameters.ts`
- **Artifact created**: `apps/web/src/lib/normativa/` (fuente canónica con cita y vigencia por constante) + `__tests__/normativa.test.ts` (fija valores y verifica que el JSON público coincida)
- **Result**: las herramientas importan de `@/lib/normativa`; los artículos deben citar esos valores, no copiarlos de otra parte

---

*Add new entries above this line when a new three-strikes trigger occurs.*
