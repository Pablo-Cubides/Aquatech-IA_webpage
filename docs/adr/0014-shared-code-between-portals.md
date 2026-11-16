# ADR-0014 — Código compartido entre portales / Shared code between portals
> **Status / Estado**: `accepted`  
> **Date / Fecha**: 2026-11-15  
> **Last reviewed / Última revisión**: 2026-11-15  
> **Author / Autor**: Claude Code (cargo ARQ, encargo ARQ-003)  
> **Deciders / Decisores**: Coordinación AquatechIA  
> **Related**: ADR-0002 (portales con route groups), constitución §2.2 y §10

---

## Context / Contexto

La constitución §2.2 prohíbe importar entre portales (`(portals)/ia` ↔ `(portals)/ambiental`) y dice "Shared UI → `packages/@ia-next/ui` only". En la práctica había 10 cruces: 8 páginas de `ambiental/autor/herramientas/*` que hacían `export { default } from "@/app/(portals)/ia/..."` y 2 (`privacy`, `terms`) que importaban la página de IA por ruta relativa. Además `ProcessContext.tsx` existía 7 veces, `utils/analytics.ts` 7 veces y los dos pies de página compartían ~85 % del código (regla de tres strikes, §10).

### Forces / Fuerzas
- Varias herramientas se adaptan por portal en tiempo de ejecución con `usePortalTheme()`: deben existir en los dos portales.
- Esos componentes dependen de código de la propia app (`@/lib/hooks`, `@/lib/services`, `next/link`, rutas `/api`); un paquete de workspace no puede importar de `apps/web` sin invertir la dependencia.
- `@ia-next/ui` ya está en dependencias y en `transpilePackages`, pero estaba vacío.

---

## Decision / Decisión

**Lo que debe existir en los dos portales vive fuera de ambos; cada portal tiene páginas delgadas que lo consumen.**

Reglas, por orden de preferencia:
1. Pertenece a un solo portal → redirección 301 en `next.config.mjs` y se borra la página espejo (`consulta-nota`, `ruleta-academica`).
2. Es genérico y sin dependencias de la app → `packages/@ia-next/ui` (`ProcessProvider`/`useProcess`).
3. Necesita código de `apps/web` (tema por portal, servicios, `next/link`) → `apps/web/src/components/<área>/` (`autor-tools/`, `legal/`, `nav/SiteFooter`). La diferencia entre portales se pasa como configuración (props/tema), no como copia.
4. Duplicado sin consumidores → se borra.

Ningún archivo bajo `(portals)/ia` importa de `(portals)/ambiental` ni al revés.

---

## Consequences / Consecuencias

### Positive / Positivas
- Cero imports entre portales; `git grep "(portals)/ia/" -- "apps/web/src/app/(portals)/ambiental"` debe seguir dando 0.
- Una sola implementación de `ProcessProvider`, de las herramientas temáticas, del contenido legal y del pie de página.

### Negative / Negativas
- La regla literal "Shared UI → ui only" de §2.2 no se cumple para el punto 3. **Actualización 2026-11-15 (ARQ-004)**: la constitución se enmendó a la versión 1.4.0 para recogerlo (§2.2), con entrada en `constitution.changelog.md`.

### Neutral
- `utils/analytics.ts` por herramienta se queda: ya son 1 línea de configuración (`createToolAnalytics("<id>")`) sobre la implementación única de `lib/analytics/tool-analytics.ts`.
- `como-funcionan-llm/context/ProcessContext.tsx` se queda: es un contexto con reducer, no el provider mínimo.

---

## Alternatives Considered / Alternativas consideradas

- **Redirigir los 8 re-exports a `/ia`**: pierde el tema claro de Ambiental en herramientas que se adaptan por portal (aula-score, proyectos-investigacion). Solo se aplicó donde la herramienta pertenece a un portal.
- **Todo a `@ia-next/ui`**: obligaría a mover también `usePortalTheme`, servicios y rutas, o a invertir la dependencia `ui → web`.
- **Dejar los re-exports**: incumple la constitución y esconde de qué portal es cada pieza.

---

## References / Referencias
- `.specify/instructions/three-strikes-rule.md`, `.specify/memory/three-strikes-log.md`
