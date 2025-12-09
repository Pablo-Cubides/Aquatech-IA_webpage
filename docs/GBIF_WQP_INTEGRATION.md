# GBIF + WQP Integration - Visor Mapas Ambientales

## 📋 Resumen de Integración

Se han integrado exitosamente dos nuevas fuentes de datos georeferenciados al **visor-mapas-ambientales**:

1. **GBIF (Global Biodiversity Information Facility)** - Datos de biodiversidad global
2. **WQP (Water Quality Portal)** - Datos de calidad del agua de USGS/EPA

### ✅ Estado: Completo (0 errores TypeScript)

---

## 🌿 GBIF - Biodiversidad Global

### Características
- **3.6 mil millones de registros** de observaciones de especies
- Coordenadas geográficas (lat/lon) de cada registro
- Taxonomía completa (reino, filo, clase, orden, familia, género, especie)
- Tipos de registro: Observación humana, espécimen preservado, máquina, etc.
- Filtros temporales por año

### API
- **Base URL**: `https://api.gbif.org/v1`
- **Endpoint**: `/occurrence/search`
- **Formato**: JSON
- **Límite por consulta**: 300 registros
- **Documentación**: https://www.gbif.org/developer/occurrence

### Archivos Creados

#### 1. `/src/lib/gbif.ts` (322 líneas)
**Servicio de integración GBIF**

Interfaces principales:
```typescript
interface GBIFOccurrence {
  key: number;
  scientificName: string;
  decimalLatitude: number;
  decimalLongitude: number;
  kingdom?: string;
  family?: string;
  basisOfRecord?: string;
  year?: number;
  // ... más campos
}
```

Funciones clave:
- `searchOccurrences(params)`: Buscar ocurrencias con filtros
- `searchTaxonSuggestions(query)`: Autocompletar nombres científicos
- `getTaxonColor(taxonKey)`: Color por grupo taxonómico
- `formatOccurrence(occurrence)`: Formatear para popup

Grupos taxonómicos populares (8):
- 🦅 Aves (Clase: Aves)
- 🦁 Mamíferos (Clase: Mammalia)
- 🐟 Peces (Clase: Actinopterygii)
- 🦋 Insectos (Clase: Insecta)
- 🌿 Plantas (Filo: Tracheophyta)
- 🦎 Reptiles (Clase: Reptilia)
- 🐸 Anfibios (Clase: Amphibia)
- 🍄 Hongos (Reino: Fungi)

#### 2. `/src/components/GBIFLayerControl.tsx` (180 líneas)
**Control de capa GBIF**

Props:
```typescript
interface GBIFLayerControlProps {
  onToggle: (enabled: boolean) => void;
  onFiltersChange: (filters: GBIFFilters) => void;
  occurrenceCount: number;
}
```

Filtros disponibles:
- **Grupo Taxonómico**: Grid de 8 grupos populares
- **Tipo de Registro**: Dropdown (observación, espécimen, máquina, fósil)
- **Año**: Input numérico (1900-presente)

Características UI:
- Checkbox para habilitar/deshabilitar capa
- Panel expandible/colapsable
- Badge con conteo de registros
- Colores por grupo taxonómico
- Botón "Limpiar Filtros"

---

## 💧 WQP - Calidad del Agua

### Características
- **Miles de estaciones de monitoreo** en USA y algunos países adicionales
- Datos de **USGS + EPA + 400+ agencias**
- Parámetros: pH, temperatura, oxígeno disuelto, turbidez, nutrientes, coliformes, metales
- Tipos de sitios: Ríos, lagos, pozos, estuarios, océanos, humedales, manantiales
- Filtros por parámetro, tipo de sitio, fecha

### API
- **Base URL**: `https://www.waterqualitydata.us`
- **Endpoint**: `/data/Station/search`
- **Formato**: GeoJSON nativo
- **Límite**: Miles de estaciones por consulta
- **Documentación**: https://www.waterqualitydata.us/webservices_documentation/

### Archivos Creados

#### 3. `/src/lib/wqp.ts` (286 líneas)
**Servicio de integración WQP**

Interfaces principales:
```typescript
interface WQPStation {
  MonitoringLocationIdentifier: string;
  MonitoringLocationName: string;
  MonitoringLocationTypeName: string;
  LatitudeMeasure: number;
  LongitudeMeasure: number;
  OrganizationFormalName: string;
  ProviderName: string; // NWIS, STORET, STEWARDS
  // ... más campos
}
```

Funciones clave:
- `searchStations(params)`: Buscar estaciones con filtros
- `getSiteTypeColor(siteType)`: Color por tipo de sitio
- `formatStation(station)`: Formatear para popup
- `createBBox(west, south, east, north)`: Crear bounding box

Parámetros populares (8):
- 🌡️ Temperatura del agua
- ⚗️ pH (acidez/alcalinidad)
- 💧 Oxígeno Disuelto (DO)
- 🌫️ Turbidez
- ⚡ Conductividad
- 🧪 Nitratos
- 🧬 Fosfatos
- 🦠 Coliformes Fecales

Categorías de parámetros (6):
- Physical (temperatura, turbidez, color)
- Nutrient (nitrógeno, fósforo, carbono)
- Inorganics, Major, Metals (plomo, mercurio, arsénico)
- Inorganics, Major, Non-metals (cloro, sulfatos)
- Microbiological (bacterias, coliformes)
- Organics, other (pesticidas, herbicidas)

Tipos de sitios (7):
- 🏞️ Río/Arroyo (Stream)
- 🏔️ Lago/Embalse (Lake, Reservoir)
- ⛲ Pozo (Well)
- 🌊 Estuario (Estuary)
- 🌊 Océano (Ocean)
- 💦 Manantial (Spring)
- 🌾 Humedal (Wetland)

#### 4. `/src/components/WQPLayerControl.tsx` (200 líneas)
**Control de capa WQP**

Props:
```typescript
interface WQPLayerControlProps {
  onToggle: (enabled: boolean) => void;
  onFiltersChange: (filters: WQPFilters) => void;
  stationCount: number;
}
```

Filtros disponibles:
- **Parámetro Popular**: Grid de 8 parámetros comunes
- **Categoría de Parámetros**: Dropdown (físicos, nutrientes, metales, microbiológicos)
- **Tipo de Sitio**: Dropdown (río, lago, pozo, estuario, etc.)
- **Desde Año**: Input numérico (1900-presente)

Características UI:
- Checkbox para habilitar/deshabilitar capa
- Panel expandible/colapsable
- Badge con conteo de estaciones
- Colores por tipo de sitio
- Botón "Limpiar Filtros"

---

## 🗺️ Integración en Mapa

### Modificaciones en `page.tsx`

#### Estados Agregados
```typescript
const [gbifData, setGbifData] = useState<GeoJSONFeature[]>([]);
const [showGBIFLayer, setShowGBIFLayer] = useState(false);
const [gbifFilters, setGbifFilters] = useState<GBIFFilters>({});

const [wqpData, setWqpData] = useState<GeoJSONFeature[]>([]);
const [showWQPLayer, setShowWQPLayer] = useState(false);
const [wqpFilters, setWqpFilters] = useState<WQPFilters>({});
```

#### useEffects para Carga de Datos

**GBIF Effect**:
- Trigger: `showGBIFLayer` o cambio en `gbifFilters`
- Acción: Llama `searchOccurrences()` con filtros
- Convierte resultados a GeoJSON features con `_layerType: "gbif"`
- Asigna color por `kingdomKey` usando `getTaxonColor()`

**WQP Effect**:
- Trigger: `showWQPLayer` o cambio en `wqpFilters`
- Acción: Llama `searchStations()` con filtros
- Convierte resultados a GeoJSON features con `_layerType: "wqp"`
- Asigna color por tipo de sitio usando `getSiteTypeColor()`

#### MapComponent Props
```typescript
<MapComponent
  data={[
    ...currentData,
    ...openAQData,
    ...eonetData,
    ...gbifData,    // ⬅️ Nuevo
    ...wqpData      // ⬅️ Nuevo
  ]}
  colorByParameter={
    showOpenAQLayer || 
    showEONETLayer || 
    showGBIFLayer ||   // ⬅️ Nuevo
    showWQPLayer       // ⬅️ Nuevo
  }
/>
```

#### Leyendas del Mapa

**GBIF Legend**:
```tsx
<MapLegend
  items={[
    { color: "#4A90E2", label: "Aves" },
    { color: "#E67E22", label: "Mamíferos" },
    { color: "#3498DB", label: "Peces" },
    { color: "#9B59B6", label: "Insectos" },
    { color: "#27AE60", label: "Plantas" },
    { color: "#16A085", label: "Reptiles" },
  ]}
  title="Biodiversidad"
  parameter="GBIF"
/>
```

**WQP Legend**:
```tsx
<MapLegend
  items={[
    { color: "#3498db", label: "Río/Arroyo" },
    { color: "#2ecc71", label: "Lago/Embalse" },
    { color: "#9b59b6", label: "Pozo" },
    { color: "#1abc9c", label: "Estuario/Océano" },
    { color: "#27ae60", label: "Humedal" },
  ]}
  title="Calidad del Agua"
  parameter="WQP (USGS/EPA)"
/>
```

#### Panel de Detalles

**GBIF Details**:
```tsx
{selectedFeature.properties._layerType === "gbif" && (
  <>
    <div>Especie: {scientificName}</div>
    <div>Reino: {kingdom}</div>
    <div>Familia: {family}</div>
    <div>Tipo: {basisOfRecord}</div>
    <div>Fecha: {eventDate}</div>
    <div>País: {country}</div>
  </>
)}
```

**WQP Details**:
```tsx
{selectedFeature.properties._layerType === "wqp" && (
  <>
    <div>Estación: {stationName}</div>
    <div>Tipo: {siteType}</div>
    <div>Organización: {organization}</div>
    <div>Fuente: {provider}</div>
    <div>Descripción: {description}</div>
  </>
)}
```

---

## 📊 Estructura de Datos

### GBIF Feature Format
```typescript
{
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  properties: {
    id: "occurrence_key",
    _layerType: "gbif",
    _color: "#4A90E2",
    scientificName: "Panthera leo",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    genus: "Panthera",
    species: "Panthera leo",
    basisOfRecord: "HUMAN_OBSERVATION",
    eventDate: "2023-06-15",
    year: 2023,
    country: "Kenya"
  }
}
```

### WQP Feature Format
```typescript
{
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  properties: {
    id: "USGS-01646500",
    _layerType: "wqp",
    _color: "#3498db",
    stationName: "POTOMAC RIVER NEAR WASH, DC",
    siteType: "Stream",
    organization: "USGS Maryland-Delaware-District of Columbia",
    provider: "NWIS",
    description: "Main channel monitoring site",
    country: "US"
  }
}
```

---

## 🎯 Casos de Uso

### GBIF
1. **Monitoreo de Biodiversidad**: Visualizar hotspots de especies
2. **Estudios de Migración**: Observaciones temporales de aves
3. **Inventarios de Flora**: Registros de plantas por región
4. **Investigación Taxonómica**: Distribución geográfica de familias
5. **Educación Ambiental**: Explorar especies locales

### WQP
1. **Calidad del Agua**: Red de estaciones de monitoreo
2. **Contaminación**: Niveles de nutrientes y metales
3. **Salud Pública**: Coliformes fecales en cuerpos de agua
4. **Gestión de Recursos**: Pozos y agua subterránea
5. **Investigación Ambiental**: Series temporales de parámetros

---

## 🔧 Mejoras Futuras

### GBIF
- [ ] Integrar fotos de especies desde GBIF/iNaturalist
- [ ] Clustering de markers cuando hay muchos puntos
- [ ] Búsqueda por nombre científico (autocomplete)
- [ ] Filtros por taxonomía completa (orden, familia)
- [ ] Gráficas de abundancia temporal
- [ ] Exportar datos filtrados

### WQP
- [ ] Cargar datos por bounding box del mapa visible
- [ ] Mostrar series temporales de parámetros
- [ ] Gráficas de tendencias (pH, temperatura, etc.)
- [ ] Comparar estaciones (multi-selección)
- [ ] Alertas de calidad (valores fuera de norma)
- [ ] Integrar datos de resultados (no solo estaciones)

---

## 📝 Notas Técnicas

### GEMStat (No Integrado)
- **Motivo**: GEMStat NO tiene API pública
- **Acceso**: Solo portal web con descarga manual
- **Límite**: Máximo 675 estaciones por descarga
- **Alternativa**: WQP es superior (más datos, API REST, mejor documentación)

### Consideraciones de Performance
- GBIF limita 300 registros por consulta (óptimo para mapas)
- WQP puede retornar miles de estaciones (considerar clustering)
- Ambas APIs son rápidas (<2 segundos típicamente)
- Los datos se cargan solo cuando la capa se habilita

### Limitaciones Conocidas
- GBIF: Cobertura global desigual (más datos en Europa/USA)
- WQP: Principalmente USA (algunos datos de Canadá/México)
- Ambas requieren conexión a internet
- Sin caché local (cada filtro hace nueva consulta)

---

## 🌍 Cobertura Geográfica

### GBIF
- ✅ Global (3.6 mil millones de registros)
- ✅ Todos los continentes
- ✅ 232 países contribuyendo datos
- ⚠️ Mayor densidad en países desarrollados

### WQP
- ✅ USA (USGS, EPA, 400+ agencias)
- ⚠️ Canadá (limitado)
- ⚠️ México (limitado)
- ❌ Otros países (no disponible)

---

## 🎉 Resultado

El **visor-mapas-ambientales** ahora integra **4 capas de datos globales**:

1. 🌬️ **OpenAQ** - Calidad del aire en tiempo real
2. 🔥 **NASA EONET** - Eventos naturales (incendios, volcanes, tormentas)
3. 🌿 **GBIF** - Biodiversidad global (3.6B registros de especies)
4. 💧 **WQP** - Calidad del agua (miles de estaciones USGS/EPA)

Todo esto con **0 errores TypeScript** y UI completamente funcional.
