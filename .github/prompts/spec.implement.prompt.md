---
mode: agent
description: Implementar una tarea específica de un spec aprobado. Guía al agente por DoD, archivos a tocar y marca la tarea como complete.
---

# /spec.implement — Implementar una tarea de spec

## Uso
`/spec.implement SPEC-NNN T00X`

Ejemplo: `/spec.implement SPEC-001 T003`

---

## Protocolo de implementación

### Paso 1 — Leer el contexto completo
1. Lee `specs/NNN-slug/spec.md` — enfócate en los ACs de la tarea
2. Lee `specs/NNN-slug/plan.md` — arquitectura, componentes, decisiones técnicas
3. Lee `specs/NNN-slug/tasks.md` — encuentra la tarea T00X, sus archivos y su DoD
4. Lee `.specify/memory/constitution.md` §1-3 — constraints del stack

### Paso 2 — Self-check antes de tocar código
Responde en silencio a estas preguntas antes de escribir una línea:
- [ ] ¿Entendí los ACs de esta tarea específica?
- [ ] ¿Sé exactamente qué archivos debo modificar/crear?
- [ ] ¿El cambio respeta la arquitectura dual-portal (ia/ambiental)?
- [ ] ¿Necesito Zod para validar inputs en este cambio?
- [ ] ¿Hay riesgo de cross-portal import?
- [ ] ¿El cambio requiere migración de DB? Si sí, ¿tengo el schema de Prisma?

### Paso 3 — Implementar
- **Un archivo a la vez**. No hagas cambios en N archivos sin verificar cada uno.
- **Server Components por default** — `use client` solo si hay interactividad real (§2.3)
- **Zod en todos los inputs de usuario y API boundaries** (§3.2)
- **DB solo via `@ia-next/database`** — nunca `prisma` directo desde `apps/web` (§2.4)
- Si descubres que el spec necesita ajuste, **actualiza el spec primero**, luego el código

### Paso 4 — Verificar el DoD de la tarea
Para cada AC de la tarea T00X, confirma que está cubierto:
- Si hay tests requeridos: escríbelos antes del código (TDD)
- Corre `pnpm typecheck` sobre los archivos modificados
- Corre `pnpm lint` sobre los archivos modificados

### Paso 5 — Actualizar tasks.md
En `specs/NNN-slug/tasks.md`, actualiza la tarea T00X:
- Cambia `status` de `pending` → `in_progress` → `completed`
- Agrega en "Progress" una línea con fecha y qué se hizo
- Si hay bloqueos o decisiones tomadas durante la implementación, documéntalas

### Paso 6 — Reportar
Al finalizar, reporta:
```
✅ SPEC-NNN T00X completada
Archivos modificados: [lista]
ACs cubiertos: [lista]
Tests: [escritos / pendientes / no aplica]
Siguiente tarea sugerida: T00Y
```

---

## Reglas específicas durante implementación

- **NUNCA** uses `--no-verify` (constitution §8.4)
- **NUNCA** hagas `any` en TypeScript — si el tipo no está claro, define un schema Zod
- Si encuentras un patrón repetido 3 veces → activa `/three-strikes`
- Si el spec contradice el código existente → **el spec tiene razón**, escala al usuario
- Si ves deuda técnica no relacionada → registra en un comentario `// TODO(SPEC-NNN):`, no la arregles ahora

---

## Anti-patterns conocidos
- No hagas un commit gigante de "feat: implement SPEC-001". Commits atómicos por tarea.
- No marques la tarea como `completed` si falta algún AC, aunque sea menor.
- No explores código no relacionado — mantén el contexto limpio.
