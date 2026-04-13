# Skill: Validación Pre-Push y Integridad de Código

Esta "Skill" define el protocolo de seguridad obligatorio que el asistente inteligente (Antigravity) debe seguir antes de realizar cualquier `push` al repositorio remoto. El objetivo es garantizar que nunca se suban errores de sintaxis o fallos de compilación que afecten a Vercel o al equipo.

## Activador (Trigger)
> "Haz push de los cambios" o cualquier tarea que finalice con una actualización del repositorio remoto.

---

## Fase 1: Validación de Sintaxis (Inmediata)
1.  **Ejecución**: Correr `node scripts/validate-syntax.js`.
2.  **Criterio de Éxito**: El script debe devolver `Final depth: 0` para todos los archivos `.ts` o `.tsx` modificados, especialmente `blog-articles.ts`.
3.  **Acción en caso de Fallo**: Identificar la línea donde la profundidad se vuelve negativa o el archivo donde sobran/faltan llaves y corregirlo antes de reintentar.

## Fase 2: Espejo de CI (Integración Continua Local)
Antes de confirmar el push, el asistente debe emular los checks de GitHub Actions ejecutando:
1.  **Linting**: `pnpm lint --filter @ia-next/web`
2.  **Type-checking**: `pnpm typecheck --filter @ia-next/web`

## Fase 3: Build de Humo (Smoke Build)
Si los cambios afectan la estructura de datos de los artículos o la lógica del portal:
1.  **Ejecución**: `pnpm run build --filter @ia-next/web`.
2.  **Propósito**: Confirmar que Turbopack puede procesar todos los archivos estáticos sin errores de memoria o sintaxis.

## Fase 4: Automatización (Husky Hooks)
Para reforzar esta skill, se han configurado los siguientes candados automáticos:
-   **Pre-commit**: Bloquea el commit si hay errores de sintaxis básicos.
-   **Pre-push**: Bloquea el push si el build no es estable.

---

## Escalación de Errores
Si durante estas fases se detectan errores que el asistente no puede resolver de forma autónoma (ej. errores de dependencias de terceros), se debe informar al usuario detalladamente **antes** de intentar forzar el push con `--no-verify`.

---
*Este protocolo asegura que el ambiente de producción (Vercel) se mantenga siempre estable y funcional.*
