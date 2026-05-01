# SPEC-NNN — Technical Plan / Plan Técnico
> **Derived from spec**: [spec.md](spec.md)  
> **Status / Estado**: `draft` | `review` | `approved` | `implementing`  
> **Author / Autor**: [name]  
> **Created / Creado**: YYYY-MM-DD

---

## Pre-plan checklist
Before writing this plan, confirm:
- [ ] Spec is `approved` status.
- [ ] All open questions in spec are resolved.
- [ ] Constitution §1–§10 re-read.

---

## 1. Affected Stack / Stack afectado [REQUIRED]

> *Which layers of the system are touched. Be specific.*

| Layer | Affected? | Details |
|---|---|---|
| `apps/web` | Yes/No | [Which routes, components, hooks] |
| `apps/api` | Yes/No | [Which route handlers, middleware] |
| `packages/@ia-next/database` | Yes/No | [Schema changes, new queries] |
| `packages/@ia-next/ui` | Yes/No | [New or modified components] |
| `docs/contracts/` | Yes/No | [New Zod schemas, OpenAPI changes] |
| External services | Yes/No | [Cloudinary, MercadoPago, Firebase, etc.] |

**New dependencies introduced**: [none | package@version — justification]  
**ADR required for new dep?**: [Yes (link) / No]

---

## 2. Database Changes / Cambios en base de datos [REQUIRED if applicable]

### Prisma Schema Changes
```prisma
// Paste the new/modified Prisma model here
model ExampleModel {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  // ...
}
```

### Migration Strategy
- **Migration type**: `prisma db push` (dev) | `prisma migrate dev` (create migration file)
- **Backfill needed?**: Yes/No — [describe strategy if yes]
- **Breaking change?**: Yes/No — [describe rollback plan if yes]
- **Estimated rows affected**: [N/A | ~X rows]

---

## 3. API Design / Diseño de API [REQUIRED if applicable]

> *Define Zod schemas as source of truth. OpenAPI is generated from these.*

### New Endpoints

#### `[METHOD] /api/[route]`
```typescript
// Request schema (Zod)
const [name]RequestSchema = z.object({
  // ...
});

// Response schema (Zod)  
const [name]ResponseSchema = z.object({
  // ...
});

// Error responses
// 400 — Validation error (Zod parse failure)
// 401 — Unauthenticated
// 403 — Unauthorized
// 404 — Resource not found
// 409 — Conflict (e.g., duplicate slug)
// 429 — Rate limited (Upstash)
// 500 — Internal server error (logged to Sentry)
```

**Rate limit**: `[X requests per Y seconds]` via Upstash  
**Auth required**: `[Firebase token | NextAuth session | public]`

### Modified Endpoints [OPTIONAL]
[Describe breaking vs non-breaking changes to existing endpoints]

---

## 4. Component Design / Diseño de componentes [REQUIRED if applicable]

> *UI components to create or modify. Server Component vs Client Component decision is explicit.*

### New Components

| Component | Location | Type | Reason for type |
|---|---|---|---|
| `<ArticleCard />` | `apps/web/src/components/...` | Server Component | No interactivity needed |
| `<UploadButton />` | `apps/web/src/components/...` | Client Component | Uses `useRef` + click handler |

### Component API (props)
```typescript
// For each new component, define the props type derived from Zod schema
type ArticleCardProps = {
  article: BlogArticle;  // from article.zod.ts
  variant?: "compact" | "full";
};
```

---

## 5. Feature Flag Strategy [OPTIONAL]

- **Flag name**: `[flag-name]`
- **Default**: `[enabled | disabled]`
- **Rollout plan**: [gradual % | instant | by user segment]
- **Cleanup date**: YYYY-MM-DD

---

## 6. Testing Strategy / Estrategia de testing [REQUIRED]

### Unit Tests
| What to test | File location | Coverage target |
|---|---|---|
| Zod schema validation | `src/lib/__tests__/article.zod.test.ts` | 100% of schema branches |
| Business logic | `src/lib/__tests__/...` | ≥70% |

### Integration Tests
| What to test | Approach |
|---|---|
| API endpoint `[METHOD] /api/[route]` | Vitest + fetch mock or real Supabase test DB |
| MercadoPago webhook | Mock webhook payload + validate signature |

### E2E Tests [OPTIONAL]
| User journey | Tool | Priority |
|---|---|---|
| [Happy path flow] | Playwright | High |
| [Error recovery] | Playwright | Medium |

### What NOT to test
- [Trivially obvious behaviors, third-party library internals]

---

## 7. Telemetry & Observability / Telemetría [REQUIRED]

| Event | Where logged | Data captured |
|---|---|---|
| [e.g., article_published] | Sentry breadcrumb | slug, portal, author |
| [e.g., payment_failed] | Sentry error | payment_id, error_code |
| [e.g., image_upload_rejected] | console.warn → Sentry | filename, size, budget |

---

## 8. Risks & Mitigations / Riesgos y mitigaciones [REQUIRED]

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| [e.g., Cloudinary rate limit] | Low | Medium | Cache URLs, lazy upload |
| [e.g., DB migration fails] | Low | High | Test in dev first, have rollback script |
| [e.g., Breaking change in API] | Medium | High | Version the endpoint `/api/v2/...` |

---

## 9. Constitution Compliance / Cumplimiento de constitución [REQUIRED]

Confirm before marking plan `approved`:

- [ ] **§1 Stack**: No new unlisted dependencies. Stack matches constitution.
- [ ] **§2.1 Monorepo**: No DB access from `apps/web`.
- [ ] **§2.2 Portals**: No cross-portal imports.
- [ ] **§2.3 Rendering**: Server Components by default; all `"use client"` justified.
- [ ] **§2.4 Data access**: DB only via `@ia-next/database`. Zod on all inputs.
- [ ] **§3.1 TypeScript**: `strict: true`. No `any`.
- [ ] **§3.2 Naming**: All naming follows conventions.
- [ ] **§4.1 Coverage**: Critical paths have ≥70% coverage planned.
- [ ] **§5 Performance**: Changes won't violate performance budgets.
- [ ] **§6 Security**: OWASP considered. No secrets in code. Rate limiting planned.
- [ ] **§7 Content/Images**: Policies followed if content/images are touched.
- [ ] **§8 Git**: PR will reference this spec. Conventional commits will be used.

---

## 10. Implementation Order / Orden de implementación

> *High-level sequence. Detailed breakdown is in tasks.md.*

1. [First step — e.g., "Prisma schema migration"]
2. [Second step — e.g., "Zod contracts in docs/contracts/"]
3. [Third step — e.g., "API route handler"]
4. [Fourth step — e.g., "UI components"]
5. [Fifth step — e.g., "Tests"]
6. [Final step — e.g., "CI validation"]

---

*Plan for SPEC-NNN | Template version: 1.0.0*
