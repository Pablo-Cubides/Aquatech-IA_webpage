# ADR-0009 — Image Pipeline: Local for Tools, Cloudinary for New Blog Images
> **Status**: accepted | **Date**: 2026-04-28 | **Author**: Pablo Cubides

## Context
AquatechIA has grown to have two categories of images: (1) tool UI assets and author photos that rarely change and are tightly coupled to the codebase; (2) blog hero and inline images that are created frequently as new content is published. Managing all images in `public/` increases repository size over time and lacks optimization tooling for the content pipeline.

### Forces
- Blog images are published frequently — CDN distribution and automatic format conversion reduce bandwidth costs.
- Tool UI images are stable — no benefit from CDN unless traffic scales significantly.
- Cloudinary free tier: 25GB storage, 25GB monthly bandwidth — sufficient for current scale.
- `next/image` handles responsive loading for both local and external URLs.
- Repository bloat: committing high-res hero images directly to git is bad practice.
- `sharp` is already a dev dependency — local optimization is free.
- Team size: solo developer — minimal tooling overhead preferred.

## Decision
**Two-tier image storage strategy:**
- **Local** (`apps/web/public/images/`): tool UI screenshots, author avatars, portal hero images (legacy). Optimized via `optimize-image.mjs` during development.
- **Cloudinary**: all new blog article hero and inline images (published after 2026-04-28). AI-generated images also go to Cloudinary with an accompanying `image-manifest.json`.

Existing images in `public/` are not migrated — they stay local until a future spec decides otherwise.

## Consequences

### Positive
- Cloudinary `f_auto` and `q_auto` transformations serve the optimal format/quality per browser automatically.
- Blog images don't bloat the git repository.
- Cloudinary CDN reduces Vercel bandwidth costs for image-heavy pages.
- AI-generated image manifests provide audit trail for AI-created assets.

### Negative
- Split storage strategy adds mental overhead — developers must know which category an image belongs to.
- Cloudinary dependency: if account is suspended or service is down, new blog images can't be served.
- No Cloudinary upload automation yet — manual upload via dashboard (future: `optimize-image.mjs --cloudinary` prints instructions, auto-upload is a future improvement).

### Neutral
- `next/image` handles both local paths and Cloudinary URLs uniformly via `remotePatterns` configuration.

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| All images in Cloudinary | Migration cost for existing images; overkill for static tool UI assets |
| All images in `public/` | Repository bloat; no automatic format optimization; no CDN distribution |
| Vercel Blob storage | Newer product, less mature tooling; Cloudinary has better transformation API |
| Amazon S3 + CloudFront | Too much infrastructure for current team size |
| Imgix | Cost; Cloudinary free tier is sufficient |

## Implementation Notes
- Constitution §7.3: defines the two-tier storage policy.
- Constitution §5.3: image budgets enforced by `image-budget.mjs` regardless of storage location.
- `next.config.js` must include Cloudinary domain in `remotePatterns` for `<Image>` to serve external URLs.
- `optimize-image.mjs` handles both cases with `--cloudinary` flag.
- See `.specify/instructions/image-generation.md` for the complete workflow.
