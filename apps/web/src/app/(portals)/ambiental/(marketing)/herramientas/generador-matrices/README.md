# 📐 Generador de Matrices de Evaluación de Impacto Ambiental

[![Status](https://img.shields.io/badge/status-stable-green.svg)](/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](/)

> **Ruta:** `/ambiental/herramientas/generador-matrices`

## Descripción

Herramienta educativa e interactiva para crear matrices de Evaluación de Impacto Ambiental (EIA) utilizando metodologías reconocidas internacionalmente. Guía paso a paso para estudiantes y profesionales ambientales.

## Metodologías Soportadas

### 📊 Matriz de Leopold
- Matriz de doble entrada (acciones × factores)
- Evaluación de magnitud e importancia
- Escala de -10 a +10
- Ideal para proyectos lineales

### 📈 Método de Conesa
- Valoración cualitativa y cuantitativa
- Fórmula de importancia del impacto
- Categorías: Compatible, Moderado, Severo, Crítico
- Incluye medidas correctoras

### 🔬 Sistema Battelle-Columbus
- Parámetros ambientales predefinidos
- Unidades de impacto ambiental (UIA)
- Funciones de transformación
- Comparación con/sin proyecto

## Funcionalidades

### 🎓 Modo Educativo
- Explicaciones paso a paso de cada metodología
- Ejemplos prácticos por tipo de proyecto
- Base de conocimientos con definiciones
- FAQ interactivo

### 🛠️ Constructor de Matrices
- Selección de tipo de proyecto
- Definición de acciones impactantes
- Identificación de factores ambientales
- Valoración guiada de impactos
- Cálculo automático de resultados

### 📄 Exportación
- PDF con formato profesional
- Excel para análisis adicional
- Memoria de cálculo incluida

## Arquitectura

```
generador-matrices/
├── page.tsx                 # Landing con tabs y conocimiento
├── layout.tsx              # SEO metadata (existente)
├── ClientHeroTabs.tsx      # Componente de navegación
├── README.md               # Documentación
├── builder/                # Constructor de matrices
│   └── page.tsx
├── faq/                    # Preguntas frecuentes
│   └── page.tsx
├── matrices/               # Tipos de matrices
│   └── [type]/page.tsx
├── selector/               # Selector de metodología
│   └── page.tsx
└── src/
    └── ...                 # Lógica de negocio
```

## Base de Conocimientos

El conocimiento se carga desde `public/knowledge.json`:

```json
{
  "fundamentos": [
    {
      "text": "Las matrices de EIA son herramientas sistemáticas..."
    }
  ],
  "definiciones": [...],
  "ejemplos": {
    "mineria": [...],
    "hidrocarburos": [...],
    "infraestructura": [...]
  }
}
```

## Paquete Externo

La lógica core está en un paquete separado para reutilización:

```
packages/@ia-next/matriz-generator/
├── src/
│   ├── leopold.ts      # Cálculos Leopold
│   ├── conesa.ts       # Cálculos Conesa
│   ├── battelle.ts     # Cálculos Battelle
│   └── export.ts       # Generación PDF/Excel
├── types/
└── tests/
```

## Rutas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/generador-matrices` | Landing principal |
| `/generador-matrices/selector` | Selección de metodología |
| `/generador-matrices/builder` | Constructor interactivo |
| `/generador-matrices/matrices/leopold` | Matriz Leopold |
| `/generador-matrices/matrices/conesa` | Método Conesa |
| `/generador-matrices/matrices/battelle` | Sistema Battelle |
| `/generador-matrices/faq` | Preguntas frecuentes |

## SEO

- **Title**: Generador de Matrices EIA | Leopold, Conesa, Battelle
- **Keywords**: matriz leopold, EIA, evaluación impacto ambiental
- **Structured Data**: WebApplication schema

## Notas de Desarrollo

> ⚠️ Mantener la interfaz del paquete `@ia-next/matriz-generator` estable para permitir reutilización en otros proyectos.

---

**Mantenido por:** AquatechIA Team  
**Última actualización:** Diciembre 2024
