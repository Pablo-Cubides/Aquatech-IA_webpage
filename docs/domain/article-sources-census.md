# Censo de fuentes de artículos · mapa fuente × superficie

> **Encargo**: ARQ-004 · **Fecha de medición**: 2026-11-15 · **Medido sobre**: rama `refactor/ARQ-004-censo-articulos` (desde `main` `df6d41e`).
> Lo que no se pudo medir desde aquí (la base de datos de producción) está marcado como tal; no se ha estimado.

## 1. Las fuentes

| # | Fuente | Qué es | IA | Ambiental | Publicados (no retirados) |
|---|---|---|---|---|---|
| 1 | `lib/blog-articles.ts` (`IA_ARTICLES`, `AMBIENTAL_ARTICLES`) | Heredados: los primeros artículos, a mano | 1 (1 retirado, borrado) | 4 (2 retirados, borrados) | **IA 1 · Amb 4** |
| 2 | ~~`lib/new-blog-articles.ts`~~ (borrado en ARQ-006a), `lib/new-ambiental-articles.ts` | Segunda tanda, a mano | 0 (9 retirados, borrados) | 5 (1 retirado, borrado) | **IA 0 · Amb 5** |
| 3 | `lib/articles/index.ts` + `lib/articles/<portal>/*.ts` | Registro "un archivo por artículo" (SPEC-100, ADR-0008, `pnpm content:new`). Conectado por CONT-004b | 1 | 0 | **IA 1 · Amb 0** |
| 4 | PostgreSQL (`BlogPost`) | Artículos publicados por la API del agente y el admin, sin desplegar | ~12 (dato de CONT) | — | **no verificado desde aquí** (sin acceso a la base) |
| 5 | Caché de disco `content/blog/articles.json` | Copia de respaldo que escribe `blog-store`; fallback si la BD falla | 1 | 0 | 1 (`introduccion-a-los-agentes-autonomos-en-ingenieria`, obsoleto respecto de la BD) |
| — | `lib/retired-articles.mjs` | No es una fuente: lista de 14 slugs retirados y su redirección | | | |

**Total publicado en código: 11** (IA 2: `difusion-stable-diffusion`, `tokens-en-espanol-medicion-reproducible`; Ambiental 9). 11 de código + ~12 de la BD = los **23** que citaban otros cargos. Los demás conteos eran subconjuntos: 8 = solo `blog-articles.ts` sin quitar retirados (2 + 6), 11 = todo el código, 12 = lo que solo vive en la BD, 1 = el caché de disco (`getAllArticlesSync` lo suma al código).

**Colisiones de slug entre fuentes de código: ninguna** (prueba `findStaticSlugCollisions` y `articles-contract.test.ts`). Los slugs son únicos también entre portales.

## 2. ¿Deliberado o sedimento?

| Fuente | Veredicto | Por qué |
|---|---|---|
| PostgreSQL | **Deliberada** | Existe la API de agente de blog y el admin para publicar sin desplegar. Decisión del coordinador: no se consolida. |
| `articles/index.ts` | **Deliberada** | Es el flujo documentado en `CLAUDE.md`, el que escribe `pnpm content:new` y el que lee `lint-content`. |
| `blog-articles.ts` y `new-*.ts` | **Sedimento** | Dos oleadas de artículos escritos a mano antes de existir el registro y la API. 10 de los 15 artículos de `new-*` (los 9 de IA y 1 de ambiental) y 3 de los 8 heredados están **retirados**: son cuerpos de artículo muertos que se siguen empaquetando. |
| Caché de disco | **Sedimento con función** | Respaldo ante fallo de BD, pero hoy contiene 1 artículo obsoleto y los tests de `blog-store` escriben sobre el archivo versionado. |

**Fuente canónica recomendada**: PostgreSQL para lo que se publica en caliente y `articles/index.ts` para lo que se escribe como código. `blog-articles.ts` y `new-*.ts` son material a migrar o a podar (no hecho aquí: habría que mover 8 artículos vivos y borrar 13 retirados; encargo aparte).

## 3. Precedencia (decidida)

De menor a mayor: heredados < `new-*` < `articles/index.ts` < **PostgreSQL**. Está en el código (`getStaticArticleMap` y `composeArticles` en `lib/blog-articles.ts`) y deja de ser provisional.

- La base manda porque es donde se edita en caliente: un artículo corregido por el admin debe sustituir a su copia en código.
- Entre fuentes de código gana la más reciente del flujo de trabajo.
- Hoy es irrelevante (0 colisiones) pero está probado: la prueba falla si aparece una. Si falla, se borra o renombra el duplicado; no se reordena.

## 4. Mapa fuente × superficie

Leyenda: ✔ la ve · ✘ no la ve · ◐ solo como respaldo si la BD falla.

| Superficie | Código (1+2+3) | PostgreSQL | Caché disco | Antes de ARQ-004 → ahora |
|---|---|---|---|---|
| Listado `/<portal>/blog` | ✔ | ✔ | ◐ | `getAllArticles` (tolerante). Sin cambio |
| Página `/<portal>/blog/[slug]` | ✔ | ✔ (manda) | ◐ | `getArticle`. Sin cambio |
| Categorías | ✔ | ✔ | ◐ | `getAllArticles`. Sin cambio |
| **Portada `/ia` y `/ambiental`** | ✘ salvo `new-*` | ✘ | ✘ | **Antes**: solo `new-*.ts` → la portada IA salía **vacía** (sus 9 artículos están retirados) y la ambiental mostraba 3 de 9 sin ninguno de la BD. **Ahora**: `getLatestArticles(portal, 3)` sobre todas las fuentes |
| `sitemap.xml` | ✔ | ✔ | ◐ | **Antes** tolerante (BD caída → ~mitad en silencio hasta 1 h). **Ahora** `getArticlesForIndexing` (estricto en producción) |
| `llms.txt`, `llms-full.txt` | ✔ | ✔ | ◐ | Igual que el sitemap |
| "Nosotros" (contador) | ✔ | ✔ | ✘ | **Nuevo**: `getPublishedArticleCount`, estricto; sin BD no se pinta la cifra |
| Admin (`/admin`, `/api/admin/blog/articles`) | ✔ | ✔ | ◐ | Sin cambio |
| `lint-content.mjs` | solo fuente 3 (1 de 11) | ✘ | ✘ | Sigue viendo solo el registro. Ver §5 |
| `articles-contract.test.ts` (nuevo) | ✔ las 3 | ✘ | ✘ | **Nuevo**: valida cada artículo de código contra `blogArticleSchema` |

## 5. Hallazgos que salen del censo

1. **La portada IA estaba vacía** y nadie lo sabía: leía solo `new-blog-articles.ts`, cuyos 9 artículos están todos retirados. Corregido.
2. **El lint no validaba nada**: `lint-content.mjs` solo recorre `lib/articles/<portal>/` y su capa Zod nunca se ejecutó (buscaba `apps/web/src/lib/contracts/article.zod.ts`, que no existe, y además importaba rutas de Windows sin `file://` y un índice sin extensión que Node no resuelve). La capa Zod se ha pasado a una prueba de vitest que ve las tres fuentes de código.
3. **6 de los 11 artículos publicados en código incumplen el contrato** (más de 7 tags, y uno con ids de subsección que no son kebab-case). Quedan listados en `KNOWN_VIOLATIONS` como un trinquete que solo puede disminuir. Arreglarlos es contenido (CONT).
4. **La escritura en BD no usa el contrato canónico**: la API de admin valida con su propio `createArticleSchema`, no con `blogArticleSchema`. Los artículos de la BD no se pueden linar en CI sin base de datos; la defensa real es validar al escribir. Pendiente (SEC/CONT).
5. **Los tests de `blog-store` escriben sobre `content/blog/articles.json`**, un archivo versionado.
6. **Había dos capas que tragaban el error de la BD** (`getStoredArticles` y `getAllArticles`), de modo que ningún consumidor podía detectar el fallo. Resuelto con las variantes estrictas (§6).

## 6. Qué cambia en el código

- `getStoredArticlesStrict()` y `getAllArticlesStrict()`: mismo filtrado, misma fusión y misma precedencia que las tolerantes (comparten `composeArticles` e `isPubliclyVisible`) pero **no capturan** el error de la BD. Con tests que fijan: BD sana ⇒ estricta = tolerante; BD caída ⇒ la estricta lanza y la tolerante degrada.
- `getArticlesForIndexing(portal)` (sitemap, `llms.txt`, `llms-full.txt`): en producción de Vercel el fallo **se propaga** (rompe el build y el despliegue anterior sigue sirviendo; en una revalidación en caliente Next conserva la última versión buena). En otros entornos degrada con error en el log y señal de observabilidad (`indexable-articles-incomplete`). Salida de emergencia: `ALLOW_INCOMPLETE_CONTENT=1`.
- `getPublishedArticleCount(portal)`: `null` si la BD falla. Los "Nosotros" no pintan la tarjeta en ese caso.

## 7. Poda de ARQ-006a (2026-11-15)

Se borraron los cuerpos de los **13 artículos retirados** que seguían empaquetándose (los 14 slugs de `retired-articles.mjs` menos `gestion-comunitaria-...`, que ya no tenía cuerpo en código): 9 de `new-blog-articles.ts` (el archivo entero, que se borra porque quedaba vacío), 3 de `blog-articles.ts` y 1 de `new-ambiental-articles.ts`. Las redirecciones 301 y el filtro `isRetiredArticle` no cambian. Quedan 3 artículos vivos con `nextArticle` apuntando a un slug retirado (funciona por la redirección 301; es contenido, de CONT).
