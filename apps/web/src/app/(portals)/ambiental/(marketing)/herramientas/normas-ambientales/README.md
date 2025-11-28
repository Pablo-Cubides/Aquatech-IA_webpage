# Environmental Regulations Browser

Route: `/ambiental/herramientas/normas-ambientales`

Purpose
- Browse and search environmental regulations (water, air, solid waste, discharges) stored as JSON under `public/data/json/`.

Developer notes
- Uses Redis caching for common queries (`normasCache`). Admin UI exists to manage sources and refresh ingestion.
- API: `/api/normas`, `/api/sectores`.
