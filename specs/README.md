# Specs Index / Índice de Especificaciones

> Every non-trivial feature must have a spec before implementation.  
> See: `.specify/templates/spec.template.md` | Constitution §8.2

---

## Critical Features / Features críticas

| Spec | Title | Status | Updated |
|---|---|---|---|
| [SPEC-001](001-payments-mercadopago/spec.md) | MercadoPago Payment & Credit Purchase | approved | 2026-04-28 |
| [SPEC-002](002-auth-firebase-supabase/spec.md) | Authentication Flow (Firebase + NextAuth + Supabase) | approved | 2026-04-28 |
| [SPEC-003](003-credits-system/spec.md) | Credit System (Balance, Consumption, Refund) | approved | 2026-04-28 |

## Operational Processes / Procesos operativos

| Spec | Title | Status | Updated |
|---|---|---|---|
| [SPEC-100](100-content-pipeline/spec.md) | Blog Content Pipeline | approved | 2026-04-28 |
| [SPEC-101](101-ai-article-generator/spec.md) | AI Article Generator | approved | 2026-04-28 |
| [SPEC-102](102-image-pipeline/spec.md) | Image Pipeline (Optimization & CDN) | approved | 2026-04-28 |
| [SPEC-103](103-git-workflow/spec.md) | Git Workflow & Branching Strategy | approved | 2026-04-28 |
| [SPEC-104](104-release-deploy-vercel/spec.md) | Release & Vercel Deploy Process | approved | 2026-04-28 |
| [SPEC-105](105-husky-validation/spec.md) | Husky Hooks & Validation Pipeline | approved | 2026-04-28 |
| [SPEC-106](106-harness-engineering-governance/spec.md) | Harness Engineering Governance | approved | 2026-05-14 |

## Tool Specs (on-demand) / Specs de herramientas (bajo demanda)

> These stubs exist for reference. Full specs are created when a tool undergoes significant changes.

| Spec | Tool | Portal | Status | Updated |
|---|---|---|---|---|
| [SPEC-200](200-aula-score/spec.md) | Aula Score | IA / Autor | stub | 2026-04-28 |
| [SPEC-201](201-consulta-nota/spec.md) | Consulta Nota | IA / Autor | stub | 2026-04-28 |
| [SPEC-202](202-ruleta-academica/spec.md) | Ruleta Académica | IA / Autor | stub | 2026-04-28 |
| [SPEC-203](203-visor-difusion/spec.md) | Visor de Difusión | IA | stub | 2026-04-28 |
| [SPEC-204](204-filtrado-ia/spec.md) | Filtrado IA | IA | stub | 2026-04-28 |
| [SPEC-205](205-parametros-decodificacion/spec.md) | Parámetros de Decodificación | IA | stub | 2026-04-28 |
| [SPEC-206](206-como-funcionan-llm/spec.md) | Cómo Funcionan los LLM | IA | stub | 2026-04-28 |
| [SPEC-207](207-visor-mapas-ambientales/spec.md) | Visor de Mapas Ambientales | Ambiental | stub | 2026-04-28 |
| [SPEC-208](208-normas-ambientales/spec.md) | Normas Ambientales | Ambiental | stub | 2026-04-28 |
| [SPEC-209](209-generador-matrices/spec.md) | Generador de Matrices EIA | Ambiental | stub | 2026-04-28 |
| [SPEC-210](210-analisis-correlaciones/spec.md) | Análisis de Correlaciones | Ambiental | stub | 2026-04-28 |

<!-- NEW SPECS ABOVE THIS LINE -->

---

## How to create a new spec / Cómo crear una spec nueva

```bash
pnpm spec:new <slug>
# Example: pnpm spec:new user-notifications
```

Or manually:
1. Copy `.specify/templates/spec.template.md` → `specs/NNN-slug/spec.md`
2. Add row to this README.
3. Open branch: `spec/SPEC-NNN-slug`

## Spec lifecycle / Ciclo de vida de una spec

```
draft → review → approved → implementing → implemented → deprecated
```

A spec must be `approved` before implementation begins.  
Mark as `implemented` when all tasks in `tasks.md` are complete and the PR is merged.
