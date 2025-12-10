# 📈 Análisis de Correlaciones Ambientales

[![Status](https://img.shields.io/badge/status-stable-green.svg)](/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](/)

> **Ruta:** `/ambiental/herramientas/analisis-correlaciones`

## Descripción

Herramienta estadística avanzada para analizar correlaciones entre variables ambientales. Soporta múltiples coeficientes de correlación, visualizaciones interactivas y conexión con fuentes de datos internacionales.

## Funcionalidades

### 📊 Coeficientes de Correlación
| Coeficiente | Tipo de Datos | Uso Recomendado |
|-------------|---------------|-----------------|
| **Pearson** | Cuantitativos continuos | Relaciones lineales |
| **Spearman** | Ordinales/no lineales | Relaciones monótonas |
| **Kendall** | Ordinales/pequeñas muestras | Robustez a outliers |

### 📁 Fuentes de Datos
- **Archivo CSV/XLSX**: Carga de datos propios
- **World Bank Data API**: Indicadores de desarrollo
- **WHO GHO Data**: Indicadores de salud global

### 📉 Visualizaciones
- Matriz de correlaciones con mapa de calor
- Gráficos de dispersión (scatter plots)
- Líneas de tendencia con R²
- Análisis de crecimiento temporal

### 📤 Exportación
- CSV con matriz de correlaciones
- XLSX con múltiples hojas
- Imágenes de gráficos (PNG)

## Arquitectura

```
analisis-correlaciones/
├── page.tsx                 # Wrapper simplificado
├── layout.tsx              # SEO metadata
├── README.md               # Documentación
├── app/
│   ├── page.tsx            # Componente principal (952 líneas)
│   └── ResultsSection.tsx  # Sección de resultados
├── components/
│   ├── FileUploader.tsx    # Carga de archivos
│   ├── ScatterPlot.tsx     # Gráfico de dispersión
│   ├── CorrelationTable.tsx # Tabla de correlaciones
│   ├── ErrorModal.tsx      # Manejo de errores
│   └── ExportButtons.tsx   # Botones de exportación
└── src/
    ├── utils/
    │   ├── aggregation.ts      # Funciones de agregación
    │   └── __tests__/
    │       └── correlations.test.ts
    └── types/
```

## Algoritmos Implementados

### Correlación de Pearson
```typescript
function pearsonCorrelation(x: number[], y: number[]): number {
  // Coeficiente de correlación producto-momento
  // Rango: -1 a +1
}
```

### Correlación de Spearman
```typescript
function spearmanCorrelation(x: number[], y: number[]): number {
  // Basado en rangos
  // Más robusto a distribuciones no normales
}
```

### Correlación de Kendall
```typescript
function kendallCorrelation(x: number[], y: number[]): number {
  // Basado en pares concordantes/discordantes
  // Más robusto a outliers
}
```

## Análisis Adicionales

### 📊 Agregación Temporal
- Por día, semana, mes, año
- Métodos: promedio, suma, mediana, min, max

### 📈 Análisis de Tendencias
- Regresión lineal
- Tasa de crecimiento
- Proyecciones

### 🔄 Análisis Comparativo
- Comparación entre períodos
- Cambios porcentuales
- Significancia estadística

## Integraciones Externas

### World Bank Data
```typescript
interface WorldBankConfig {
  country: string;
  startYear: number;
  endYear: number;
  indicators: string[]; // Códigos de indicadores
}
```

### WHO GHO Data
```typescript
interface WHOConfig {
  country: string;
  startYear: number;
  endYear: number;
  indicators: string[]; // Códigos GHO
}
```

## Tests

```bash
# Ejecutar tests de correlaciones
npx vitest run src/app/(portals)/ambiental/(marketing)/herramientas/analisis-correlaciones

# Tests específicos
npx vitest run correlations.test.ts
```

## Dependencias

- `papaparse` - Parsing de CSV
- `xlsx` - Lectura/escritura Excel
- `recharts` - Visualizaciones
- `simple-statistics` - Cálculos estadísticos

## SEO

- **Title**: Análisis de Correlaciones Ambientales | Estadística
- **Keywords**: correlación Pearson, Spearman, Kendall, estadística ambiental
- **Structured Data**: WebApplication schema

---

**Mantenido por:** AquatechIA Team  
**Última actualización:** Diciembre 2024
