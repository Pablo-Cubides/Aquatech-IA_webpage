# Image Generation & Management Instructions
> **Applies to**: Any process (manual, AI-assisted, scripted) that creates or manages images for AquatechIA.  
> **Version**: 1.0.0  
> **Reference**: Constitution §5.3, §7.3, §7.4

---

## Decision Tree: Where Does This Image Go?

```
Is this image for a NEW blog article (published after 2026-04-28)?
├─ YES → Storage: Cloudinary
│        Use: optimize-image.mjs --cloudinary
│        Size limit: hero ≤200KB, inline ≤80KB
│
└─ NO → Is it for an existing tool UI / tool screenshot / author photo?
         ├─ YES → Storage: local (public/images/portal-*/...)
         │        Use: optimize-image.mjs (no --cloudinary flag)
         │        Size limit: tool ≤120KB, author ≤40KB
         │
         └─ NO → Evaluate on case-by-case basis.
                  When in doubt: Cloudinary for any public-facing asset.
```

---

## Required Formats

Every image (except SVG icons) must have all three variants:
1. `.avif` — primary format, best compression (AVIF support: ~94% of browsers as of 2026)
2. `.webp` — fallback for browsers without AVIF
3. `.jpg` — final fallback (or `.png` if transparency required)

**Generate via**: `pnpm img:optimize <input-path> [--cloudinary]`

---

## Budget Enforcement

| Context | Max size | Check |
|---|---|---|
| Blog hero | ≤ 200KB | CI `image-budget.yml` blocks PR if exceeded |
| Blog inline | ≤ 80KB | CI `image-budget.yml` blocks PR if exceeded |
| Tool UI / screenshots | ≤ 120KB | CI `image-budget.yml` blocks PR if exceeded |
| Author avatars | ≤ 40KB | CI `image-budget.yml` blocks PR if exceeded |
| Icons / logos | ≤ 10KB (prefer SVG) | Manual review |

---

## Alt Text Requirements

- **`alt` is mandatory on every image**. Empty `alt=""` is only permitted for purely decorative images.
- Alt text must be:
  - Descriptive: describes what the image shows, not what it "is".
  - Contextual: written for a reader who cannot see the image.
  - In Spanish (primary language of the platform).
  - Max 125 characters.
- Good: `"Diagrama del mecanismo de auto-atención en arquitecturas Transformer"`
- Bad: `"imagen"`, `"blog-hero"`, `"photo"`

---

## Naming Conventions

File names: **`kebab-case`** only. No spaces, no underscores, no uppercase.

Pattern: `[descriptor]-[context].[ext]`

Examples:
- `llm-transformers-architecture.avif` ✓
- `water-rural-latam-community.webp` ✓
- `hero_image_2.jpg` ✗
- `LLM Transformers Architecture.jpg` ✗

---

## Directory Structure

```
apps/web/public/images/
├── portal-ia/
│   ├── blog/               # Legacy blog images (pre-2026-04-28)
│   │   └── [image-name].jpg
│   ├── herramientas/       # Tool-specific images
│   │   └── [tool-slug]/
│   │       └── [image-name].webp
│   └── autor/              # Author photos
│       └── pablo-cubides.webp
└── portal-ambiental/
    ├── blog/               # Legacy environmental blog images
    ├── herramientas/
    └── mapas/              # Map-related assets
```

---

## AI-Generated Images

### When to generate with AI
- No appropriate stock/original image exists.
- The concept is abstract (neural networks, data flows, environmental processes).
- Cost of photography is prohibitive.

### Prompt guidelines for technical accuracy
- Be specific about the subject: "A diagram showing the self-attention mechanism in a Transformer neural network, with colored arrows representing Query, Key, and Value matrices"
- Specify style: "flat design", "technical diagram", "photorealistic", "dark background"
- Specify aspect ratio/orientation: "landscape 16:9"
- Avoid: logos, text in images (hard to localize), copyrighted content, identifiable people

### Mandatory manifest file
For every AI-generated image, create `[asset-id].image-manifest.json` alongside the image:

```json
{
  "model": "dall-e-3",
  "prompt": "A diagram showing the self-attention mechanism in a Transformer neural network, with colored arrows representing Query, Key, and Value matrices, dark blue background, flat technical illustration style, 16:9",
  "generatedAt": "2026-04-28",
  "platform": "ChatGPT Plus",
  "license": "ai-generated-no-commercial-restriction",
  "cloudinaryUrl": "https://res.cloudinary.com/aquatechIA/image/upload/q_auto,f_auto/portal-ia/blog/llm-transformers-architecture",
  "altText": "Diagrama del mecanismo de auto-atención en arquitecturas Transformer con matrices Q, K y V representadas por flechas de colores"
}
```

> The `platform` field reflects that models are accessed via platforms (VS Code, Antigravity, Claude Code) rather than direct API — set to the platform used.

---

## Cloudinary Upload Process

1. Optimize locally first: `pnpm img:optimize <input> --cloudinary`
2. Script will:
   - Generate AVIF + WebP + JPEG variants.
   - Verify budget compliance.
   - Output the Cloudinary URL pattern to use.
3. Upload to Cloudinary via dashboard or CLI.
4. Use Cloudinary transformation URL in article:
   ```
   https://res.cloudinary.com/aquatechIA/image/upload/q_auto,f_auto,w_[width]/[folder]/[public-id]
   ```
5. Verify the URL loads in browser.
6. Paste URL into article's `heroImage` or `image` field.

---

## Local Image Optimization Process

1. Place original image in a temp folder (not in `public/`).
2. Run: `pnpm img:optimize <input-path>`
3. Script outputs optimized variants to the appropriate `public/images/...` folder.
4. Confirm sizes are within budget in script output.
5. Delete the original from temp folder.

---

## Common Mistakes

| Mistake | Correct approach |
|---|---|
| Uploading original unoptimized image | Always run `img:optimize` first |
| Empty `alt=""` on meaningful images | Write descriptive alt text |
| Using `.png` when `.webp`/`.avif` suffice | `.png` only if transparency needed |
| Storing new blog images in `public/` | New blog images → Cloudinary |
| Missing `image-manifest.json` for AI images | Create manifest before committing |
| Image URL hardcoded to `localhost` | Use relative paths or Cloudinary URLs only |
| Exceeding budget and not flagging | CI will block — fix before push |
