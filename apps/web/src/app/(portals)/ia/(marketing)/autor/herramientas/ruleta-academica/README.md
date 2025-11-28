# Academic Wheel (Question Roulette)

Route: `/ia/autor/herramientas/ruleta-academica`

Purpose
- Author and run question wheels for class activities. Create question sets and spin the wheel during sessions.

Developer notes
- Routes include `/juego` for gameplay. Ensure client-only hooks (e.g., `useSearchParams`) are used in client components to avoid prerender errors.
- APIs: `/api/questionsets` for CRUD operations on sets.

Local dev
```pwsh
cd apps/web
pnpm dev
# http://localhost:3000/ia/autor/herramientas/ruleta-academica
```
