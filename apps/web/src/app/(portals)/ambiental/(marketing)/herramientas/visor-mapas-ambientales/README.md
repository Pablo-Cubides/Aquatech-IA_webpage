# Environmental Maps Viewer

Route: `/ambiental/herramientas/visor-mapas-ambientales`

Purpose
- Map viewer for environmental datasets with upload wizard, MapLibre integration, and dataset browsing.

Developer notes
- Ensure GeoJSON types are consistent with `apps/web/src/types/index.ts`. Fix type mismatch errors by centralizing shared types.
- API: `/api/datasets` and `/api/tiles/[z]/[x]/[y]`.
