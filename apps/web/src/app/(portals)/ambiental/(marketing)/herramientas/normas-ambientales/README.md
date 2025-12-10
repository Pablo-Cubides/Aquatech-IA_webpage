# 📜 Navegador de Normas Ambientales

[![Status](https://img.shields.io/badge/status-stable-green.svg)](/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](/)

> **Ruta:** `/ambiental/herramientas/normas-ambientales`

## Descripción

Base de datos completa de regulaciones y normativas ambientales organizadas por país, dominio y sector. Permite consultar límites permisibles, referencias legales y comparativas entre jurisdicciones.

## Funcionalidades

### 🌎 Cobertura por Dominios
| Dominio | Descripción | Normativas |
|---------|-------------|------------|
| **Agua** | Calidad de agua potable y natural | Resolución 2115, EPA |
| **Vertimientos** | Límites de descarga a cuerpos de agua | Resolución 631 |
| **Aire** | Calidad del aire y emisiones | Resolución 2254 |
| **Residuos Sólidos** | Gestión y disposición de residuos | Decreto 1077 |

### 🏳️ Países Soportados
- 🇨🇴 Colombia
- 🇲🇽 México (próximamente)
- 🇵🇪 Perú (próximamente)
- 🇪🇨 Ecuador (próximamente)

### 🔍 Funcionalidades de Búsqueda
- Navegación jerárquica: Dominio → País → Sector
- Búsqueda por nombre de norma o parámetro
- Filtrado por fecha de vigencia
- Comparativa entre normativas

### 📋 Información por Norma
- Nombre y número oficial
- Parámetros regulados con límites
- Texto legal de referencia
- Fecha de expedición y vigencia

## Arquitectura

```
normas-ambientales/
├── page.tsx                 # Wrapper con ProcessProvider
├── layout.tsx              # SEO metadata
├── README.md               # Documentación
├── explorar/               # Ruta de exploración
│   └── page.tsx
└── src/
    ├── app/
    │   └── page.tsx        # Componente principal
    ├── components/
    │   └── ...             # Componentes UI
    ├── context/
    │   └── ProcessContext.tsx
    └── lib/
        ├── __tests__/
        │   └── normas.test.ts  # Tests unitarios
        └── normasCache.ts      # Cache Redis
```

## Almacenamiento de Datos

Los datos de normativas se almacenan en archivos JSON estructurados:

```
public/data/json/
├── agua/
│   ├── colombia.json
│   └── mexico.json
├── vertimientos/
│   └── colombia.json
├── aire/
│   └── colombia.json
└── residuos/
    └── colombia.json
```

## API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/normas` | GET | Lista de normativas con filtros |
| `/api/sectores` | GET | Sectores disponibles por país |

## Caché

Utiliza Redis para cachear consultas frecuentes:

```typescript
// Configuración de caché
const CACHE_TTL = 3600; // 1 hora
const normasCache = new RedisCache('normas');
```

## Tests

```bash
# Ejecutar tests
npx vitest run src/app/(portals)/ambiental/(marketing)/herramientas/normas-ambientales
```

## Contribuir Normativas

Para agregar nuevas normativas:

1. Crear archivo JSON en `public/data/json/{dominio}/{pais}.json`
2. Seguir el esquema definido en `types/normas.ts`
3. Ejecutar validación: `npm run validate:normas`

## SEO

- **Title**: Normas Ambientales por País | Regulaciones | AquatechIA
- **Keywords**: normas ambientales, legislación, regulaciones, Colombia
- **Structured Data**: WebApplication schema

---

**Mantenido por:** AquatechIA Team  
**Última actualización:** Diciembre 2024
