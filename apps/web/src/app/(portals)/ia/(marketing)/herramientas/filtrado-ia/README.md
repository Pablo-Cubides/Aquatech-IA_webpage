# Frontend - Cómo la IA filtra sus respuestas

Este frontend usa Next.js 15 (App Router) y consume la API de FastAPI del backend.

## Estructura sugerida

## Instalación sugerida
1. `cd frontend`
2. `npx create-next-app@latest . --app --ts`
3. Instala dependencias útiles: `npm install html2canvas jspdf @mui/material @mui/icons-material`
4. Crea los componentes y páginas según el diseño educativo.

Todo el contenido y la UI deben estar en español.
```markdown
# Content Filtering (Frontend)

This tool demonstrates how AI output filtering works. It is a client-facing Next.js (App Router) frontend that provides examples and test cases to evaluate filtering strategies.

Purpose
- Provide a lightweight interface to experiment with model responses and filtering heuristics.
- Host example "cases" clients can toggle to reproduce different model outputs.

Tech stack
- Next.js (App Router) + TypeScript
- React 19
- Tailwind CSS (project styling)

Structure
- `/app` — App routes (App Router)
- `/components` — Reusable UI components
- `/public` — Static assets (icons, sample cases)
- `/styles` — Component-level CSS or Tailwind overrides

Developer notes
- The tool uses a `CasosContext` to manage example cases. Tests exist under `__tests__` and should be kept updated when cases change.
- No backend is strictly required; the tool consumes local test cases and can be wired to server APIs for additional filtering logic.
- Translate user-facing copy to English for public contributors; keep case data reproducible.

Local development
```pwsh
cd apps/web
pnpm dev
# Open http://localhost:3000/ia/herramientas/filtrado-ia
```

Testing
- Unit tests: see `__tests__` within the tool folder.

Contributing
- Add new cases under the `cases` folder and include a Jest test asserting the expected filter output.

```
