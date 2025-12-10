# 🌬️ Calculadora de Índices de Calidad del Aire

[![Status](https://img.shields.io/badge/status-stable-green.svg)](/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](/)

> **Ruta:** `/ambiental/herramientas/indice-calidad-aire`

## Descripción

Herramienta profesional para calcular índices de calidad del aire a partir de concentraciones de contaminantes atmosféricos. Soporta múltiples metodologías internacionales con un motor de cálculo genérico basado en interpolación lineal de breakpoints.

## Índices Soportados

| Índice | País/Región | Normativa | Rango |
|--------|-------------|-----------|-------|
| **US AQI** | Estados Unidos | EPA 454/B-12-001 | 0-500 |
| **ICA Colombia** | Colombia | Resolución 2254/2017 | 0-500 |
| **IBOCA** | Bogotá | Resolución 2840/2023 | 0-500 |
| **EAQI** | Unión Europea | EEA Air Quality Index | 1-6 |
| **Índice OMS** | Global | WHO AQG 2021 | % sobre guía |

## Contaminantes

| ID | Nombre | Símbolo | Unidad | Descripción |
|----|--------|---------|--------|-------------|
| pm25 | Material Particulado Fino | PM₂.₅ | µg/m³ | Partículas ≤ 2.5 µm |
| pm10 | Material Particulado | PM₁₀ | µg/m³ | Partículas ≤ 10 µm |
| o3 | Ozono Troposférico | O₃ | µg/m³ | Ozono a nivel del suelo |
| no2 | Dióxido de Nitrógeno | NO₂ | µg/m³ | Gas de combustión |
| so2 | Dióxido de Azufre | SO₂ | µg/m³ | Gas de combustión |
| co | Monóxido de Carbono | CO | mg/m³ | Combustión incompleta |

## Funcionalidades

### 📊 Cálculo de Índices
- Interpolación lineal de breakpoints (fórmula EPA)
- Subíndices por contaminante
- Identificación de contaminante crítico
- Categorías con colores y mensajes de salud

### 📁 Fuentes de Datos
- **Entrada manual**: Formulario con los 6 contaminantes
- **Archivo CSV**: Formato ancho o largo
- **OpenAQ API**: Datos globales (próximamente)

### 📈 Visualización
- Resultado principal con color de categoría
- Tabla de subíndices por contaminante
- Explicación del cálculo
- Breakpoints utilizados

## Arquitectura

```
indice-calidad-aire/
├── page.tsx                    # Página principal (UI)
├── layout.tsx                  # SEO metadata
├── README.md                   # Documentación
├── types/
│   └── index.ts               # Tipos TypeScript
├── data/
│   ├── index-profiles.ts      # Registry de perfiles
│   └── breakpoints/
│       ├── us-aqi.ts          # EPA breakpoints
│       ├── ica-colombia.ts    # Res. 2254
│       ├── iboca-bogota.ts    # Res. 2840
│       ├── eaqi-europe.ts     # EEA
│       └── who-guidelines.ts  # OMS 2021
├── utils/
│   ├── calculate-aqi.ts       # Motor de cálculo
│   ├── calculate-who.ts       # Cálculo OMS (%)
│   └── csv-parser.ts          # Parser CSV
└── lib/
    └── openaq-client.ts       # Cliente OpenAQ API
```

## API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/aqi-calculator` | POST | Calcula índices para mediciones |
| `/api/aqi-calculator` | GET | Lista perfiles disponibles |
| `/api/aqi-stations` | GET | Busca estaciones (OpenAQ) |

### Ejemplo de Request

```typescript
POST /api/aqi-calculator
{
  "measurements": [{
    "datetime": "2024-12-09T10:00:00Z",
    "pollutants": [
      { "pollutantId": "pm25", "value": 35.2, "unit": "µg/m³" },
      { "pollutantId": "pm10", "value": 52.1, "unit": "µg/m³" },
      { "pollutantId": "o3", "value": 45.3, "unit": "µg/m³" }
    ],
    "source": "manual"
  }],
  "profileId": "us-aqi"
}
```

### Ejemplo de Response

```typescript
{
  "success": true,
  "profileId": "us-aqi",
  "count": 1,
  "results": [{
    "index": 101,
    "category": {
      "name": "Dañina para grupos sensibles",
      "color": "#FF7E00"
    },
    "criticalPollutant": "pm25",
    "subIndices": [...]
  }]
}
```

## Fórmula de Cálculo

### Subíndice por contaminante

```
Iₚ = I_lo + ((I_hi - I_lo) / (BP_hi - BP_lo)) × (Cₚ - BP_lo)

Donde:
- Iₚ = Subíndice del contaminante p
- Cₚ = Concentración medida
- BP_lo, BP_hi = Límites del tramo de concentración
- I_lo, I_hi = Límites del tramo de índice
```

### Índice Final

```
AQI = max(Iₚ) para todos los contaminantes con datos
Contaminante crítico = argmax(Iₚ)
```

### Índice OMS (especial)

```
H_i = (C_i / G_i) × 100

Donde:
- H_i = Porcentaje sobre la guía
- C_i = Concentración medida
- G_i = Valor guía OMS
```

## Formato CSV

### Formato Ancho (recomendado)

```csv
fecha,estacion,pm25,pm10,o3,no2,so2,co
2024-12-09,Centro,35.2,52.1,45.3,28.5,12.4,2.1
2024-12-09,Norte,28.1,45.6,52.8,22.3,8.7,1.8
```

### Formato Largo

```csv
fecha,estacion,parametro,valor,unidad
2024-12-09,Centro,pm25,35.2,µg/m³
2024-12-09,Centro,pm10,52.1,µg/m³
```

## Categorías US AQI

| Rango | Categoría | Color | Significado |
|-------|-----------|-------|-------------|
| 0-50 | Buena | 🟢 Verde | Sin riesgo |
| 51-100 | Moderada | 🟡 Amarillo | Aceptable |
| 101-150 | Grupos sensibles | 🟠 Naranja | Precaución |
| 151-200 | Dañina | 🔴 Rojo | Reducir actividad |
| 201-300 | Muy dañina | 🟣 Púrpura | Evitar exteriores |
| 301-500 | Peligrosa | 🟤 Marrón | Emergencia |

## Dependencias

- `lucide-react` - Iconos
- `papaparse` (para CSV avanzado)
- `recharts` (para gráficos futuros)

## Fuentes de Datos Externas

- **OpenAQ**: API global v3 (60+ países)
- **AirNow**: EPA (requiere API key)
- **EEA**: European Environment Agency

## Notas de Desarrollo

> ⚠️ **OpenAQ Integration**: La integración con OpenAQ está preparada pero marcada como "próximamente" en la UI. El cliente está funcional.

> 📝 **Extensibilidad**: Para agregar un nuevo índice, crear archivo en `breakpoints/` y agregarlo a `index-profiles.ts`.

## Tests

```bash
# Ejecutar tests del módulo
npx vitest run src/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire
```

## SEO

- **Title**: Calculadora de Índices de Calidad del Aire | AQI, ICA, IBOCA
- **Keywords**: AQI, calidad del aire, PM2.5, ICA Colombia, contaminación
- **Structured Data**: WebApplication schema

---

**Mantenido por:** AquatechIA Team  
**Última actualización:** Diciembre 2024
