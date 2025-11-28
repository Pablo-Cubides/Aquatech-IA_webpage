# Consulta Nota — Grade Viewer and Importer

Route: `/ia/autor/herramientas/consulta-nota`

Purpose
- Allow instructors to upload grade spreadsheets (CSV/XLSX) and visualize student grades with pagination and filters.

Developer notes
- Server endpoints used: `/api/notes` (GET for queries, POST for bulk imports). Validate all imports with Zod schemas and guard against excessively large payloads.
- Consider adding background processing for very large imports to avoid timeouts.

Local dev
```pwsh
cd apps/web
pnpm dev
# http://localhost:3000/ia/autor/herramientas/consulta-nota
```
