---
id: SPEC-102
title: "Image Pipeline (Optimization & CDN)"
status: approved
owner: Pablo Cubides
created: 2026-04-28
updated: 2026-05-02
---

# SPEC-102 — Image Pipeline (Optimization & CDN)

## 1. Problem [REQUIRED]

AquatechIA images are currently added without a consistent optimization pipeline. Some images exceed LCP-impacting sizes. There is no AVIF variant generation, no budget enforcement, and no clear rule for where images should be stored (local vs CDN). This results in unnecessary bandwidth costs, slower page loads, and inconsistent asset quality.

### Context
Per ADR-0009, new blog images go to Cloudinary; tool/UI images stay local. `sharp` is already installed.

---

## 2. Constraints [REQUIRED]

- **C-001**: Must use `sharp` for server-side optimization to avoid browser-side processing overhead.
- **C-002**: Every image MUST have AVIF and WebP variants to satisfy modern browser performance budgets.
- **C-003**: Performance budgets are hard limits; CI must fail if an image exceeds the allocated size for its context.

---

## 3. Non-Goals [REQUIRED]

- Automatic Cloudinary upload from CLI (manual upload is the current process; future improvement via Cloudinary SDK).
- Video asset pipeline.
- SVG optimization (SVGs handled manually).
- Image CDN for tool UI assets (local is sufficient at current scale).

---

## 4. Users [REQUIRED]

| Persona | Role | How affected |
|---|---|---|
| Pablo (Instructor) | Image creator/uploader | Needs a simple command to optimize and upload images |
| AI Agent | Image sourcer | Follows `.specify/instructions/image-generation.md` for AI-generated images |
| Blog readers / tool users | Image consumers | Experience LCP improvements from optimized images |

---

## 5. User Stories [REQUIRED]

### US-001: Optimize an image before publishing
```gherkin
As Pablo
I want to run a single command to optimize an image
So that it meets budget requirements and has AVIF + WebP variants

Acceptance Criteria:
  Scenario: Local tool image optimization
    Given I have a raw PNG screenshot for a tool
    When I run: pnpm img:optimize ./tmp/screenshot.png --context=tool --output=./apps/web/public/images/portal-ia/herramientas/visor-difusion/
    Then AVIF, WebP, and JPEG variants are generated in the output directory
    And each variant is within the tool budget (≤120KB)
    And the script outputs the size of each variant

  Scenario: Over-budget image
    Given I have a 500KB hero image
    When I run: pnpm img:optimize ./tmp/hero.jpg --context=hero
    Then the script generates variants and reports which exceed the 200KB hero budget
    And the script exits with code 1 (blocking CI if run in workflow)
```

### US-002: CI blocks over-budget image commits
```gherkin
As the CI system
I want to check that no new image exceeds its budget
So that performance budgets are enforced automatically

Acceptance Criteria:
  Scenario: PR with over-budget image
    Given a PR adds a 300KB hero image to public/images/
    When image-budget.yml CI job runs
    Then the job fails with the specific file name and over-budget amount
    And the PR cannot be merged until the image is optimized

  Scenario: PR with compliant images
    Given all new images in the PR are within budget
    Then image-budget.yml passes
    And the PR can proceed to merge
```

### US-003: New blog image uploaded to Cloudinary
```gherkin
As Pablo (or AI agent)
I want new blog hero images stored in Cloudinary
So that they benefit from CDN distribution and format auto-selection

Acceptance Criteria:
  Scenario: Image prepared for Cloudinary
    Given a new blog article needs a hero image
    When I run: pnpm img:optimize ./tmp/hero.jpg --context=hero --cloudinary
    Then the optimized AVIF is ready for upload
    And the script prints the Cloudinary folder path and URL pattern to use
    And I manually upload to Cloudinary and paste the URL into heroImage
```

---

## 6. Business Rules [REQUIRED]

- **BR-001**: All images must have AVIF + WebP + JPEG variants (except SVG icons).
- **BR-002**: Budgets per context (constitution §5.3): hero ≤200KB, inline ≤80KB, tool ≤120KB, author ≤40KB, icon ≤10KB.
- **BR-003**: `alt` text is mandatory on every meaningful image. Empty `alt=""` only for decorative images.
- **BR-004**: New blog images (post-2026-04-28) are stored in Cloudinary.
- **BR-005**: AI-generated images must have an accompanying `.image-manifest.json`.
- **BR-006**: Image file names are kebab-case, no spaces, no uppercase.
- **BR-007**: Original unoptimized images are not committed to git — only optimized variants.

---

## 7. Non-Functional Requirements [REQUIRED]

### Performance
- [x] Hero images ≤200KB (AVIF) = LCP <2.5s target achievable on 4G.
- [x] CI budget check adds <15s to pipeline.

### Accessibility
- [x] `alt` absence is caught by `image-budget.yml` for images referenced in article files.
- [x] `alt` text max 125 chars (screen reader best practice).

---

## 8. Edge Cases & Error Scenarios [REQUIRED]

| Scenario | Expected behavior |
|---|---|
| Sharp not installed | `optimize-image.mjs` exits with clear install instructions |
| Input image is already AVIF | Sharp processes it (re-encodes) — no special case needed |
| Output directory doesn't exist | Script creates it (mkdirSync recursive) |
| Cloudinary URL invalid/unreachable | Not detected by script — developer must verify URL in browser |
| AI image has no manifest | `image-budget.yml` can add a warning check for this |

---

## 9. Dependencies [OPTIONAL]

| Dependency | Type | Notes |
|---|---|---|
| `sharp` (devDep) | Package | Already installed in root `package.json` |
| `jimp` (devDep) | Package | Already installed, available as fallback |
| Cloudinary account | External | `aquatechIA` account |
| `.specify/scripts/optimize-image.mjs` | Script | Main optimization script |
| `.specify/scripts/image-budget.mjs` | Script | CI budget checker |
| `.github/workflows/image-budget.yml` | CI | Budget enforcement |
| `docs/contracts/image-manifest.zod.ts` | Contract | AI image manifest schema |

---

## Constitution Compliance Checklist

- [x] Image budgets from constitution §5.3 enforced by script and CI.
- [x] `alt` text mandatory per constitution §4.2 and §7.3.
- [x] New blog images to Cloudinary per constitution §7.3.
- [x] AI image manifests per constitution §7.4.
- [x] AVIF + WebP required formats per constitution §5.3.
