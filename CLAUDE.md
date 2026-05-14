# AquatechIA — Claude Code Instructions

## Stack rápido (constitution §1)
- **Monorepo**: Turborepo + pnpm workspaces
- **App**: Next.js 16, React 19, TypeScript strict, Zod 4.1, Prisma 7
- **Portales**: `(portals)/ia/*` y `(portals)/ambiental/*` — aislamiento total
- **Deploy**: trunk-based → main → Vercel auto-deploy
- **Comandos**: `pnpm build` · `pnpm test` · `pnpm lint` · `pnpm typecheck`

---

## Antes de CUALQUIER tarea no trivial
1. Lee `.specify/memory/constitution.md` completo
2. Lee el spec activo: `specs/NNN-slug/spec.md` y `plan.md`
3. Ejecuta el self-check de 10 puntos en `.specify/instructions/agent-sdd-workflow.md`

---

## Reglas que NUNCA debes romper

- **NUNCA** uses `--no-verify` en git (constitution §8.4)
- **NUNCA** hagas `git push --force` a main
- **NUNCA** accedas a la DB desde `apps/web` directamente — solo via `@ia-next/database`
- **NUNCA** importes entre portales (ia ↔ ambiental)
- **NUNCA** uses worktrees (ver memory/feedback_no_worktrees.md)
- **NUNCA** edites `.env*` sin confirmación explícita del usuario
- **NUNCA** dupliques código — si ves un patrón 3 veces, revisa `.specify/instructions/three-strikes-rule.md`
- **NUNCA** congeles un spec durante implementación — puede evolucionar con el código
- **SIEMPRE** valida inputs con Zod en los boundaries de entrada

---

## Slash commands disponibles

| Comando | Uso |
|---|---|
| `/spec.new` | Crear nuevo spec desde cero |
| `/spec.clarify` | Resolver ambigüedades de un spec |
| `/spec.plan` | Diseñar plan técnico |
| `/spec.tasks` | Descomponer spec en tareas atomicas |
| `/spec.implement` | Implementar una tarea específica (T001, T002...) |
| `/spec.review` | Revisar código contra ACs del spec |
| `/spec.analyze` | Auditar código existente |
| `/spec.stub` | Crear stub mínimo para herramienta nueva |
| `/content.new` | Generar artículo de blog |
| `/content.review` | Revisar artículo contra spec editorial |
| `/image.audit` | Auditar imágenes contra presupuesto |
| `/release.preflight` | Checklist completo antes de push |
| `/three-strikes` | Crear artefacto para patrón repetido |

---

## Contexto y compactación (anti-context-rot)

Al compactar (`/clear` o compactación automática), preserva siempre:
- Rama git activa y spec que se está implementando
- Último error o bloqueo encontrado
- Decisiones técnicas tomadas en la sesión (no reversibles)

Si el contexto supera ~50 mensajes, propone `/clear` y resume en 3 bullets qué se hizo.

Para exploración o búsqueda amplia, usa subagentes — no contamines el contexto principal.

---

## Flujos principales

**Nuevo feature**: `pnpm spec:new <slug>` → spec → plan → tasks → implement → verify  
**Nuevo artículo**: `pnpm content:new <portal> <slug>` → llenar campos → agregar a `articles/index.ts`  
**Nueva imagen**: `pnpm img:optimize <input> --context=hero|inline|tool|author`  
**Pre-push**: `pnpm release:preflight` (o se ejecuta automáticamente vía hook)

---

## Archivos clave

```
.specify/memory/constitution.md      ← leer primero siempre
.specify/instructions/               ← protocolos del agente
.specify/templates/                  ← templates para specs, ADRs, content
specs/README.md                      ← índice de todos los specs
docs/contracts/                      ← schemas Zod canónicos
apps/web/src/lib/articles/index.ts   ← punto de entrada de artículos
```
