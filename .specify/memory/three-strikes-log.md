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

## [2026-11-15] — Copias por herramienta de ProcessContext, analytics y pie de pagina

- **Detected by**: Claude Code (cargo ARQ, ARQ-003)
- **Pattern**: Codigo copiado entre herramientas y portales al migrar apps: `ProcessContext.tsx` x7, `utils/analytics.ts` x7, `FooterIA`/`FooterAmbiental`, paginas de ambiental que re-exportaban las de ia
- **Instances**: 7 + 7 + 2 + 10 cruces entre portales (ver ADR-0014)
- **Artifact created**: `@ia-next/ui` `ProcessProvider`; `components/nav/SiteFooter.tsx`; `components/autor-tools/`; `components/legal/`; `docs/adr/0014-shared-code-between-portals.md`
- **Result**: una sola implementacion de cada pieza; analytics ya estaba unificado en `lib/analytics/tool-analytics.ts` (OPS-002)

---

---

## [2026-11-16] — Politica editorial de etiquetas copiada en nueve documentos

- **Detected by**: Claude Code (cargo CONT, CONT-005)
- **Pattern**: Una politica viva (reglas de las etiquetas de los articulos) escrita por separado en varios documentos; al cambiarla, cada copia se actualiza o no por su cuenta y nadie sabe cual manda. Es el patron de duplicacion que esta regla aplica al codigo, nunca aplicado a la documentacion.
- **Instances**: constitucion §7.1; SPEC-100 BR-005; SPEC-101 (2 sitios); content-generation.md (3 sitios); prompts content.new y content.review; plantilla content-spec; comentario de new-content.mjs; glosario (2 sitios)
- **Artifact created**: ADR-0015 (decision y registro del patron). **Solucion durable NO aplicada**: que esos documentos citen la constitucion §7.1 en lugar de reescribir la regla
- **Result**: pendiente; hoy los nueve se alinean a mano con la misma frase

---

*Add new entries above this line when a new three-strikes trigger occurs.*
