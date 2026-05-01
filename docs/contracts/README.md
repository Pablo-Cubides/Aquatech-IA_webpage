# Contracts / Contratos

> Fuente única de verdad para todos los contratos de datos del proyecto.  
> Single source of truth for all data contracts in the project.

---

## Files / Archivos

| File | Description | Used in |
|---|---|---|
| [article.zod.ts](article.zod.ts) | `BlogArticle` Zod schema + derived TypeScript types | All article files in `apps/web/src/lib/articles/` |
| [image-manifest.zod.ts](image-manifest.zod.ts) | Schema for AI-generated image manifests | `*.image-manifest.json` files alongside AI images |
| [openapi.yaml](openapi.yaml) | OpenAPI 3.1 spec for all public API endpoints | Generated from Zod schemas in `apps/api/` |

---

## Principles / Principios

**Zod = única fuente de tipos.** No duplicar definiciones de tipo. Todo tipo TypeScript en el proyecto debe ser derivado de un schema Zod o importado desde aquí.

**OpenAPI es generado, no escrito a mano.** Use `zod-to-openapi` to generate `openapi.yaml` from route handler Zod schemas. Do not maintain the YAML manually.

---

## How to use article.zod.ts / Cómo usar el schema de artículos

### In article files (`apps/web/src/lib/articles/<portal>/<slug>.ts`):
```typescript
import { blogArticleSchema } from "@/lib/contracts/article.zod";
import type { BlogArticle } from "@/lib/contracts/article.zod";

const article: BlogArticle = blogArticleSchema.parse({ ... });
export default article;
```

### To get all exported types:
```typescript
import type {
  BlogArticle,
  BlogArticleSection,
  BlogArticleAuthor,
  BlogArticleContent,
  BlogArticleCallout,
} from "@/lib/contracts/article.zod";
```

> **Note**: Copy `article.zod.ts` to `apps/web/src/lib/contracts/article.zod.ts` to use it with the `@/` alias. The canonical version in `docs/contracts/` is for cross-team visibility and documentation.

---

## How to use image-manifest.zod.ts / Cómo usar el schema de manifiestos

### To validate a manifest file:
```typescript
import { imageManifestSchema } from "@/lib/contracts/image-manifest.zod";

const manifest = imageManifestSchema.parse(JSON.parse(manifestFileContent));
```

### Manifest file location:
```
apps/web/public/images/[portal]/blog/[asset-id].image-manifest.json
```

---

## OpenAPI Generation / Generación de OpenAPI

To regenerate `openapi.yaml` after adding/modifying API endpoints:

```bash
# When zod-to-openapi is configured (SPEC-001/002/003 implementation task)
pnpm run contracts:generate
```

Until the generator is set up, document new endpoints in `openapi.yaml` manually using the schema from the corresponding Zod object in the route handler.

---

## Versioning / Versionado

- Schemas are versioned alongside the code (no separate versioning).
- Breaking changes to `article.zod.ts` (removing/renaming fields) require:
  1. A migration script to update all existing article files.
  2. An ADR documenting the decision.
  3. All article files passing validation after migration.
- Non-breaking changes (adding optional fields) can be merged in a single PR.
