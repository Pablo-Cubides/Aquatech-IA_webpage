# @ia-next/matriz-generator

Generador de Matrices de Evaluación de Impacto Ambiental (EIA) - Paquete NPM local reutilizable para el monorepo IA-Next.

## 📋 Descripción

Herramienta educativa interactiva que permite:

- Aprender sobre matrices de EIA (Leopold, Conesa, Battelle-Columbus)
- Construir matrices completas paso a paso
- Comparar diferentes metodologías
- Exportar resultados en PDF, Excel y CSV

## 🎯 Características

### ✅ Metodologías Soportadas

- **Leopold**: Matriz clásica con magnitud e importancia
- **Conesa**: Evaluación multicriterio con 10 atributos
- **Battelle-Columbus**: Sistema cuantitativo por parámetros

### 📊 Funcionalidades

- Constructor interactivo paso a paso
- Comparación de matrices
- Selector automático de metodología
- Exportación de datos múltiples formatos
- Casos de estudio predefinidos
- Validaciones y cálculos automáticos

## 🚀 Uso

### Como Paquete NPM en el Monorepo

```tsx
// En app/portals/ambiental/herramientas/generador-matrices/page.tsx
import { MatrizGenerator } from "@ia-next/matriz-generator";

export default function GeneradorMatricesPage() {
  return <MatrizGenerator />;
}
```

### Rutas Disponibles

- `/selector` - Selector de matriz
- `/builder/[caseId]/[matriz]` - Constructor paso a paso
- `/comparar/[caseId]` - Comparación de metodologías

## 📁 Estructura

```
packages/matriz-generator/
├── app/                          # Routes (Next.js 15 App Router)
│   ├── page.tsx                 # Home
│   ├── layout.tsx               # Root layout
│   ├── globals.css
│   ├── builder/[caseId]/[matriz]/page.tsx
│   ├── comparar/[caseId]/page.tsx
│   └── selector/page.tsx
├── src/
│   ├── components/              # React components
│   │   ├── HeroTabs.tsx
│   │   ├── LeopoldMatrix.tsx
│   │   ├── ConesaForm.tsx
│   │   ├── BattelleTable.tsx
│   │   ├── ExportButtons.tsx
│   │   └── index.ts
│   ├── lib/
│   │   └── matrices.ts          # Cálculos de impacto
│   └── types/
│       └── index.ts             # TypeScript types
├── content/knowledge/            # Knowledge base
├── tsconfig.json                # Path aliases configured
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

## 🔧 Configuración

### Path Aliases

El paquete usa path aliases para facilitar imports:

```tsx
@components/*      → ./src/components/*
@lib/*            → ./src/lib/*
@types/*          → ./src/types/*
@content/*        → ./content/*
```

### Dependencias

- `next@15.x` (peer dependency)
- `react@18.x` (peer dependency)
- `jspdf`, `xlsx`, `recharts`, `html2canvas`

## 📝 Casos de Uso

### Caso: Vía Regional

- 5 acciones (desmonte, excavación, construcción, etc.)
- 7 factores (aire, agua, suelo, vegetación, fauna, empleo, movilidad)

### Caso: Minería

- 6 acciones (remoción vegetal, vías, explotación, transporte, etc.)
- 8 factores (aire, ruido, aguas, ecosistemas, salud, economía, paisaje)

### Caso: Ecoturismo

- 5 acciones (cabañas, senderos, operación, residuos, educación)
- 6 factores (agua, fauna, hábitats, cultura, economía)

## 📦 Integración en Monorepo

Para integrar en el portal principal:

```tsx
// apps/web/src/app/(portals)/ambiental/herramientas/generador-matrices/page.tsx
import MatrizGeneratorWrapper from "@ia-next/matriz-generator";

export default function GeneradorMatricesPortal() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Generador de Matrices EIA</h1>
      <MatrizGeneratorWrapper />
    </div>
  );
}
```

## 🔄 Desarrollo

Para modificar componentes:

1. Editar componentes en `src/components/`
2. Actualizar tests correspondientes
3. Ejecutar `pnpm test` para validar
4. Hacer commit con descripción clara

## 🧪 Testing

```bash
pnpm test
pnpm test:watch
```

## 📄 Licencia

MIT - Parte del proyecto IA-Next
