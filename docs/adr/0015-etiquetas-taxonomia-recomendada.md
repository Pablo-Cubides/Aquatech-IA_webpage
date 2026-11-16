# ADR-0015 — Etiquetas de artículos: taxonomía recomendada, no cerrada / Article tags: recommended taxonomy, not a closed list
> **Status / Estado**: `accepted`
> **Date / Fecha**: 2026-11-16
> **Last reviewed / Última revisión**: 2026-11-16
> **Author / Autor**: Claude Code (cargo CONT, encargo CONT-005)
> **Deciders / Decisores**: Coordinación AquatechIA
> **Related**: ADR-0008 (artículos como datos TypeScript), ADR-0010, SPEC-100 (BR-005), constitución §7.1

---

## Context / Contexto

La constitución §7.1 y SPEC-100 BR-005 exigían que las etiquetas de un artículo salieran de "la taxonomía aprobada" de `docs/domain/glossary.md`. En la práctica el contrato (`blogArticleSchema`) solo comprueba que haya entre 3 y 7 etiquetas, y los artículos usan etiquetas fuera del glosario ("Resolución 1207", "electrocoagulación", "MBR", "ICA Colombia"). El test `articles-contract.test.ts` (ARQ-004) sacó a la luz que 6 artículos de código superaban el máximo de 7 (8, 8, 8, 8, 9 y 10 etiquetas), y al arreglarlos apareció la contradicción: la regla escrita (taxonomía cerrada) no es la que se aplica ni la que conviene.

### Forces / Fuerzas
- Una taxonomía cerrada existe para que las etiquetas sean navegables y consistentes. Verificado el 2026-11-16: no existen rutas de página de etiqueta (`tag`, `tags`, `etiqueta`) y las etiquetas no entran en el sitemap. Se usan como chips en la página del artículo, en la de categoría (solo las 3 primeras), en el admin, en la API, como `keywords` de metadatos (que Google ignora) y como "Etiquetas" en `llms-full.txt`.
- Sin eje de navegación, la consistencia no compra nada y la taxonomía cuesta justo la especificidad que hace citable el contenido: un profesional busca "Resolución 1207" o "electrocoagulación", no "datos ambientales".
- Diez etiquetas en un artículo son relleno de palabras clave.

---

## Decision / Decisión

**El límite de 3–7 etiquetas se mantiene. La taxonomía del glosario pasa de lista cerrada a conjunto canónico recomendado.**

Se admiten etiquetas fuera del glosario cuando aportan especificidad técnica que el glosario no cubre (un número de resolución, un método, un índice concreto). No se admiten sinónimos genéricos de etiquetas que ya existen ("contaminación atmosférica" junto a "calidad del aire"). Al recortar un artículo para cumplir el máximo, se quitan primero las genéricas y se conservan las específicas.

---

## Consequences / Consecuencias

### Positive / Positivas
- La regla escrita coincide con la práctica y con el contrato; se acaba la contradicción.
- Se conserva la especificidad técnica de las etiquetas (lo citable).

### Negative / Negativas
- Sin control de vocabulario, puede haber variantes de una misma etiqueta. Se mitiga con el criterio "no sinónimos genéricos" y con la revisión editorial (cargo CONT).
- Si en el futuro se crean páginas de etiqueta, habrá que normalizar el vocabulario existente; entonces se reevalúa esta decisión.

### Neutral
- El tope de 7 y el mínimo de 3 siguen siendo los del contrato Zod.

---

## Alternatives Considered / Alternativas consideradas

- **Imponer la taxonomía cerrada**: obligaría a reescribir casi todas las etiquetas y perder términos técnicos específicos, para ganar una consistencia que nadie consume.
- **Etiquetas libres sin criterio**: abre la puerta a sinónimos genéricos y a relleno de palabras clave.
- **Subir el tope por encima de 7**: refuerza el relleno; no aporta citabilidad.

---

## Hallazgo de fondo / Underlying finding

**El defecto no es la regla vieja: es que una política viva estuviera escrita por separado en nueve documentos.** La regla de las etiquetas vivía en la constitución §7.1, SPEC-100 (BR-005), SPEC-101, `content-generation.md`, los prompts `content.new` y `content.review`, la plantilla de spec de contenido, un comentario de `new-content.mjs` y el glosario. Una regla repetida en nueve sitios, de la que se enmienda uno, no queda enmendada: queda ambigua, y el siguiente agente seguirá de buena fe la copia desactualizada.

Esta enmienda trata el síntoma: alinea los nueve documentos con la misma frase mínima para que no se contradigan. **La solución durable, que NO se aplica ahora, es que esos documentos citen la constitución en lugar de reescribirla** («etiquetas: ver constitución §7.1»): una referencia no se desincroniza. Es el mismo patrón que la regla de tres strikes ya aplica al código (no duplicar) y que nunca se había aplicado a la documentación; queda registrado en `.specify/memory/three-strikes-log.md`.

Reevaluación: si se crean páginas de etiqueta, o si se aborda la refactorización de la documentación para que cite en vez de copiar, se revisa esta decisión.

---

## References / Referencias
- `.specify/memory/constitution.md` §7.1 (enmienda 1.5.0), `specs/100-content-pipeline/spec.md` BR-005
- `apps/web/src/lib/__tests__/articles-contract.test.ts`
