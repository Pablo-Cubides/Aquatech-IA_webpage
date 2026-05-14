---
mode: agent
description: Revisar código implementado contra los Acceptance Criteria del spec referenciado. Produce un reporte de conformidad.
---

# /spec.review — Revisión de código contra spec

## Uso
`/spec.review SPEC-NNN [PR-URL o rama]`

Ejemplo: `/spec.review SPEC-001` (usa la rama actual)

---

## Protocolo de revisión

### Paso 1 — Cargar contexto
1. Lee `specs/NNN-slug/spec.md` — todos los ACs de todas las User Stories
2. Lee `specs/NNN-slug/plan.md` — decisiones técnicas comprometidas
3. Lee `specs/NNN-slug/tasks.md` — DoD de cada tarea
4. Obtén el diff con `git diff main...HEAD` (o el PR si se pasó URL)

### Paso 2 — Revisar por AC
Para cada AC en el spec, determina:

| AC | Estado | Evidencia |
|---|---|---|
| AC-001.1 | ✅ / ⚠️ / ❌ | línea de código o test que lo cubre |

Estados:
- ✅ **Cubierto** — hay código/test que lo satisface directamente
- ⚠️ **Parcial** — está cubierto pero con gaps o casos edge faltantes
- ❌ **Faltante** — no hay evidencia de cobertura

### Paso 3 — Revisar conformidad con constitution
Verifica que el código cumple:
- [ ] §2.1 — Server Components por default, `use client` justificado
- [ ] §2.2 — Sin cross-portal imports (ia ↔ ambiental)
- [ ] §2.3 — Sin acceso a DB desde `apps/web` directamente
- [ ] §3.1 — Tipos derivados de schemas Zod, no duplicados
- [ ] §3.2 — Validación Zod en todos los inputs de API
- [ ] §6.1 — Sin secretos hardcodeados
- [ ] §6.2 — Rate limiting en rutas públicas que lo necesiten

### Paso 4 — Revisar calidad técnica
- Busca `any` en TypeScript nuevo — cada uno es un riesgo
- Busca imports de `prisma` desde `apps/web` — violación §2.4
- Busca `console.log` sin `// TODO remove` — noise en producción
- Verifica que tests nuevos no tienen `skip` sin justificación

### Paso 5 — Producir reporte

```markdown
## Spec Review: SPEC-NNN — [Título del spec]
Rama: [nombre] | Fecha: [hoy]

### Resumen
- ACs totales: N
- ✅ Cubiertos: X
- ⚠️ Parciales: Y
- ❌ Faltantes: Z

### Veredicto
[ APROBADO / APROBADO CON OBSERVACIONES / BLOQUEADO ]

### ACs faltantes o parciales (bloqueantes)
[lista con evidencia]

### Observaciones no bloqueantes
[lista]

### Constitution violations
[lista si hay, o "ninguna"]
```

---

## Notas
- Este review es complementario al PR review humano, no lo reemplaza
- Si encuentras código correcto que el spec no contempla, sugiere actualizar el spec
- Los ACs del spec pueden evolucionar durante implementación — esto es normal
