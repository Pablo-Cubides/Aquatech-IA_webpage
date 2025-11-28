# Visor Difusion (Diffusion Visualizer)

Route: `/ia/herramientas/visor-difusion`

Purpose
- Visualize multi-step image diffusion processes, noise patterns, and parameter effects.
- Export generated sequences as GIFs or image frames.

Developer notes
- The component relies on local `cases` and `noise` assets. Ensure the `src/components/static/cases` and `src/components/static/noise` directories exist when building.
- Server-side routes used: `/api/visor-step`, `/api/visor-prompts`, `/api/visor-noise/[step]`.

Local development
```pwsh
cd apps/web
pnpm dev
# http://localhost:3000/ia/herramientas/visor-difusion
```

Tests & maintenance
- Add unit tests for step sequencing and GIF export to avoid regressions. Confirm builds don't fail due to missing static folders.
