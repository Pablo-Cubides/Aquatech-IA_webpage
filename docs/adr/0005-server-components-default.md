# ADR-0005 — Server Components as Default Rendering Strategy
> **Status**: accepted | **Date**: 2025-10-01 | **Author**: Pablo Cubides

## Context
Next.js 13+ App Router introduced Server Components as the new default. The choice between Server Components and Client Components has significant performance and architectural implications. Given that AquatechIA serves content-heavy portals (blog, tool documentation, educational content) alongside interactive tools (charts, maps, forms), a clear rendering strategy was needed.

### Forces
- Performance: reducing client-side JavaScript bundle size is critical for LCP targets.
- Content portals (blog, landing pages) are mostly static or server-rendered — no client state needed.
- Interactive tools (MapLibre maps, Recharts, form-heavy UI) require browser APIs.
- SEO: Server-rendered HTML is indexed without JavaScript execution by crawlers.
- Constitution performance budget: LCP <2.5s for marketing pages.

## Decision
**Server Components are the default. `"use client"` is added only when browser APIs or React hooks with side effects are required.**

Every new component is written as a Server Component unless the developer has a documented reason to opt into Client Components. The three valid reasons are:
1. Browser APIs needed (window, localStorage, navigator, geolocation).
2. React hooks that require interactivity (useState, useEffect for side effects, useRef for DOM).
3. Third-party libraries that are client-only (MapLibre GL, html2canvas, jsPDF).

When `"use client"` is added, a one-line comment explaining the reason is mandatory.

## Consequences

### Positive
- Smaller JS bundles → better LCP and INP scores.
- Direct data access in Server Components — no API calls needed for server-rendered pages.
- Better SEO for content pages (blog, tool descriptions).
- Easier mental model for new components: "start as Server Component, opt out if needed."

### Negative
- Developers accustomed to class/hook-heavy patterns must adjust.
- Server/Client boundary bugs can be subtle (passing non-serializable props, etc.).
- Some libraries require wrapping in a Client Component shell (e.g., context providers).

### Neutral
- Interactivity is still fully supported via Client Components at the leaf level.

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| `"use client"` everywhere (old Next.js Pages Router style) | Defeats Server Components benefits; larger bundles |
| Pure SSG (Static Site Generation) | Dynamic content (credits, user state) requires server rendering |
| Remix-style approach | Not applicable — we're on Next.js 16 |

## Implementation Notes
- Constitution §2.3: Document every `"use client"` with a one-line comment.
- Interactive tool components (maps, charts) are isolated in `*Client.tsx` or `*Interactive.tsx` files to keep the parent Server Component clean.
- Context providers (ThemeProvider, etc.) are wrapped in Client Component wrappers in the root layout.
