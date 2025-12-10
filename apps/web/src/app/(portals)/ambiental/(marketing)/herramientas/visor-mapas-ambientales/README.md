# 🗺️ Visor de Mapas Ambientales

[![Status](https://img.shields.io/badge/status-stable-green.svg)](/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](/)

> **Ruta:** `/ambiental/herramientas/visor-mapas-ambientales`

## Descripción

Herramienta interactiva de visualización geoespacial que permite explorar datos ambientales en mapas con capas personalizables. Integra múltiples fuentes de datos científicos para análisis territorial y monitoreo ambiental.

## Funcionalidades

### 🌍 Visualización de Mapas
- Mapas interactivos con [MapLibre GL JS](https://maplibre.org/)
- Capas base múltiples (satélite, topográfico, estándar)
- Zoom, pan y navegación fluida
- Leyenda dinámica con interpretación de datos

### 📊 Fuentes de Datos Integradas
| Fuente | Tipo de Datos | Cobertura |
|--------|--------------|-----------|
| **GBIF** | Biodiversidad y ocurrencias de especies | Global |
| **Water Quality Portal** | Estaciones de monitoreo de agua | USA |
| **Datasets propios** | GeoJSON/CSV personalizados | Usuario |

### 📁 Carga de Datos
- Wizard paso a paso para carga de archivos
- Soporte para GeoJSON, CSV con coordenadas
- Validación automática de geometrías
- Vista previa antes de publicar

### 🔍 Búsqueda y Filtros
- Búsqueda por ubicación, especie o parámetro
- Filtros por tipo de estación y categoría
- Codificación por colores según tipo de sitio

## Arquitectura

```
visor-mapas-ambientales/
├── page.tsx                 # Wrapper con ProcessProvider
├── layout.tsx              # SEO metadata
├── README.md               # Documentación
└── src/
    ├── app/
    │   └── page.tsx        # Componente principal (1,377 líneas)
    ├── components/
    │   ├── MapComponent.tsx       # Mapa MapLibre (dinámico)
    │   ├── UploadWizard.tsx       # Wizard de carga
    │   ├── SearchBar.tsx          # Barra de búsqueda
    │   └── MapLegend.tsx          # Leyenda
    ├── context/
    │   └── ProcessContext.tsx     # Estado global
    └── lib/
        ├── __tests__/
        │   └── logger.test.ts     # Tests unitarios
        └── logger.ts              # Utilidades
```

## API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/datasets` | GET/POST | CRUD de datasets |
| `/api/tiles/[z]/[x]/[y]` | GET | Tiles vectoriales |

## Dependencias Principales

- `maplibre-gl` - Renderizado de mapas
- `@mapbox/geojson-area` - Cálculo de áreas
- Next.js dynamic import (SSR disabled para mapa)

## Notas de Desarrollo

> ⚠️ **Importante**: Los tipos GeoJSON deben ser consistentes con `apps/web/src/types/index.ts`. Centralizar tipos compartidos para evitar errores de compatibilidad.

### Carga Dinámica
El componente MapComponent se carga dinámicamente para evitar errores de SSR:

```tsx
const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => <div>Cargando mapa...</div>
});
```

## Tests

```bash
# Ejecutar tests
npx vitest run src/app/(portals)/ambiental/(marketing)/herramientas/visor-mapas-ambientales
```

## SEO

- **Title**: Visor de Mapas Ambientales | GIS Interactivo | AquatechIA
- **Keywords**: mapas ambientales, GIS, GBIF, visor geoespacial
- **Structured Data**: WebApplication schema

---

**Mantenido por:** AquatechIA Team  
**Última actualización:** Diciembre 2024
