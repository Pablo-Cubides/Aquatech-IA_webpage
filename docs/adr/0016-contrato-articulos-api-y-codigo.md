# ADR-0016 — Contrato de artículos: qué valida el canónico y qué valida la API / Article contract: what the canonical schema validates and what the API validates
> **Status / Estado**: `accepted`
> **Date / Fecha**: 2026-11-17
> **Last reviewed / Última revisión**: 2026-11-17
> **Author / Autor**: Claude Code (cargo SEC, encargo SEC-004b)
> **Deciders / Decisores**: Coordinación AquatechIA
> **Related**: ADR-0008 (artículos como datos TypeScript), ADR-0015 (etiquetas 3–7), constitución §6 y §7.1, SEC-002 (Zod cerrado de la API de blog)

---

## Context / Contexto

Había dos esquemas que validaban "un artículo" con reglas distintas:

- **`blogArticleSchema`** (`@ia-next/contracts`): el artículo ya maquetado (autor como objeto, `date`, contenido estructurado con mínimos de longitud, 3–7 etiquetas, imagen de portada obligatoria). Lo cumplen los 11 artículos de código.
- **`createArticleSchema` / `updateArticleSchema`** (`apps/web/src/lib/schemas/blog-article.zod.ts`, SEC-002): la **entrada** de `/api/admin/blog/articles` (campos planos `authorName…`, `status`, `portal`, contenido como texto o estructurado, casi todo opcional). Protege la frontera (claves cerradas, tamaños, esquemas de URL) pero no exigía calidad de publicación.

Consecuencia medida el 2026-11-17 sobre producción (solo lectura): de los 13 artículos que viven solo en la base de datos, **11 incumplen el contrato canónico** —10 tienen solo 2 etiquetas (las que el servidor inventa cuando no llegan: `[categoría, portal]`) y 1 tiene 8—, porque la API los dejó publicar. El contrato no era una puerta para lo que entra por la API.

Medidos también los topes de longitud que el canónico no tenía (título, secciones, bio, etc.): ninguno de los 11 artículos de código, los 6 de `write-ia-articles.js` ni los 13 de la base los incumple.

La **lectura** de la base de datos (`mapDbPostToStoredArticle`) no valida contra ningún esquema.

---

## Decision / Decisión

1. **El contrato canónico valida el artículo que se publica**, venga de código o de la API. Se amplía sin relajar nada:
   - `dateModified` (opcional, `YYYY-MM-DD`, no anterior a `date`) y `references` (opcional, máximo 50, solo `http`/`https`);
   - URLs de imagen (`heroImage`, `author.avatar`, `section.image`): solo `https://…` o ruta del sitio con una sola `/` inicial (antes bastaba con empezar por "http" o por "/", lo que admitía `httpfoo` y `//host`);
   - topes de longitud máximos (título 200, sección 20 000, introducción y conclusión 10 000, etiqueta 40, etc.).
   - **El 3–7 de etiquetas no cambia** (ADR-0015).
2. **La API mantiene su forma de entrada** (la usan la interfaz de administración y los agentes) y, para los estados que dejan el artículo visible (**`PUBLISHED` y `SCHEDULED`**), convierte la entrada a la forma que el servidor guardaría —con los mismos valores por defecto— y la valida contra `blogArticleSchema`. Un 400 nombra los campos que fallan.
3. **Los borradores (`DRAFT`, `PAUSED`, `ARCHIVED`) siguen siendo laxos**: se puede guardar trabajo incompleto.
4. **En actualizaciones (`PATCH`)**: publicar o reanudar un artículo valida el resultado completo; editar uno ya publicado exige solo lo que el `PATCH` toca. Así se pueden seguir corrigiendo los 11 artículos antiguos sin quedar bloqueados por defectos previos que el cambio no empeora (para reanudar uno en pausa hay que corregir antes sus etiquetas, lo que se puede hacer mientras está en pausa).
5. **La lectura de la base de datos no valida** y no debe empezar a hacerlo con este esquema: ante un artículo viejo que no lo cumpla se muestra (fallar abierto) en vez de negárselo a todo el mundo.

---

## Consequences / Consecuencias

### Positive / Positivas
- Un artículo no puede publicarse por la API incumpliendo lo que los de código sí cumplen.
- Los esquemas de URL y los topes tienen un solo sitio (el contrato); código y API no pueden divergir.
- `dateModified` y `references` quedan disponibles para el JSON-LD y la sección de fuentes sin cambiar el tipo a mano.

### Negative / Negativas
- Publicar por la API exige ahora ≥ 3 etiquetas, extracto de 20–280 caracteres y contenido con los mínimos del contrato; antes bastaba con título y contenido. La interfaz de administración muestra el motivo en el aviso de error. Los agentes de contenido publican por código, no se ven afectados.
- Reanudar un artículo antiguo en pausa exige primero corregir sus etiquetas.
- Zod 4 no permite derivar (`pick`/`partial`) de un objeto con refinamientos: por eso se exporta `blogArticleBaseSchema` además de `blogArticleSchema`.

### Neutral
- Los 11 artículos antiguos con etiquetas fuera de 3–7 siguen publicados y legibles; arreglarlos es contenido (cargo CONT).
- La copia `docs/contracts/article.zod.ts` está desactualizada y **no es el contrato**: la fuente es `packages/@ia-next/contracts/src/article.zod.ts`. Limpiarla corresponde a ARQ.
- Derivar `BlogArticle` del esquema y retirar el tipo escrito a mano en `blog-articles.ts` queda para ARQ-007.

---

## Alternatives Considered / Alternativas consideradas

- **Unificar en un solo esquema con la forma canónica como entrada de la API**: rompe a los agentes y a la interfaz de administración (campos planos) y no admite borradores.
- **Validar también en la lectura de la base de datos**: 11 de los 13 artículos solo-BD dejarían de mostrarse. Descartado.
- **Relajar el contrato para que los antiguos pasen** (p. ej. mínimo de 2 etiquetas): descartado; el contrato no se relaja para acomodar datos viejos, se arreglan los datos.
