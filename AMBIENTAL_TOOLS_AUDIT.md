# 🔍 AUDITORÍA COMPLETA - HERRAMIENTAS PORTAL AMBIENTAL

## Resumen Ejecutivo

El portal Ambiental tiene **3 herramientas principales integradas**, pero se necesita verificar:
- ✅ Rutas accesibles desde la página principal
- ✅ Enlaces funcionales en botones "Abrir"
- ✅ Estructura de carpetas correcta
- ✅ Tests unitarios e integración
- ✅ Componentes con AuthModal y Sentry

---

## 1. HERRAMIENTA: Análisis de Correlaciones
**Ruta**: `/ambiental/herramientas/analisis-correlaciones`

### Estructura Actual
```
analisis-correlaciones/
├── page.tsx (wrapper)
├── src/
│   ├── app/
│   │   ├── page.tsx (componente principal)
│   │   ├── about/
│   │   ├── layout.tsx
│   │   ├── ResultsSection.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── CorrelationTable.tsx
│   │   ├── ErrorModal.tsx
│   │   ├── ExportButtons.tsx
│   │   └── FileUploader.tsx
│   ├── context/
│   │   └── (ProcessContext si existe)
│   └── utils/
│       └── (analytics si existe)
```

### ✓ Verificaciones
- [ ] `page.tsx` wrapper re-exporta correctamente desde `./src/app/page`
- [ ] Layout con tema claro (light theme) aplicado
- [ ] Tests unitarios existen
- [ ] AuthModal integrada si es ruta privada
- [ ] Sentry/Analytics configurada
- [ ] Estilos Tailwind consistentes (colores ambientales)

### 🎨 Design System
- Primary: `#0077B6` (Azul)
- Accent: `#10B981` (Verde)
- Background: `#F5F9F8`
- Text: `#0D161C`

---

## 2. HERRAMIENTA: Generador de Matrices EIA
**Ruta**: `/ambiental/herramientas/generador-matrices`

### Estructura Actual
```
generador-matrices/
├── page.tsx (wrapper)
├── app/ (carpeta raíz del tool original)
│   ├── page.tsx
│   ├── layout.tsx
│   ├── admin/
│   ├── casos/
│   ├── matrices/
│   ├── builder/
│   ├── comparar/
│   ├── faq/
│   ├── fundamentos/
│   ├── sitemap.xml
│   └── (rutas secundarias)
```

### ✓ Verificaciones
- [ ] Wrapper (`page.tsx`) re-exporta desde `./app/page`
- [ ] Todas las subrutas funcionan
- [ ] Casos de uso accesibles
- [ ] API routes funcionan (`/api/cases`, `/api/export/*`)
- [ ] Tests del builder pasan
- [ ] Conexión a Supabase si la hay
- [ ] AuthModal para áreas protegidas

### 🎯 Rutas Principales
- `/generador-matrices` - Home
- `/generador-matrices/matrices` - Selector de matrices
- `/generador-matrices/builder/[caseId]/[matriz]` - Editor
- `/generador-matrices/casos` - Mis casos
- `/generador-matrices/faq` - Preguntas frecuentes
- `/generador-matrices/fundamentos` - Educación

---

## 3. HERRAMIENTA: Normas Ambientales
**Ruta**: `/ambiental/herramientas/normas-ambientales`

### Estructura Actual
```
normas-ambientales/
├── page.tsx (wrapper con ProcessProvider)
├── src/
│   ├── app/
│   │   ├── page.tsx (landing)
│   │   ├── explorar/
│   │   │   ├── page.tsx
│   │   │   └── ExplorarContent.tsx
│   │   ├── fundamentos/
│   │   ├── admin/
│   │   ├── api/
│   │   │   ├── normas/route.ts
│   │   │   ├── paises/route.ts
│   │   │   └── sectores/route.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── CountrySelector.tsx
│   │   ├── DomainSelector.tsx
│   │   ├── SectorSelector.tsx
│   │   ├── RegulatorySourcesCard.tsx
│   │   ├── ResultsDisplay.tsx
│   │   └── ui/
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── hooks.ts
│   │   ├── types/index.ts
│   │   ├── sectorIcons.ts
│   │   └── logger.ts
│   └── context/
│       └── ProcessContext.tsx
```

### ✓ Verificaciones
- [ ] Wrapper con ProcessProvider
- [ ] Página landing funciona
- [ ] `/explorar` renderiza sin errores
- [ ] API routes retornan datos
- [ ] Selectores (país, dominio, sector) funcionan
- [ ] Búsqueda funciona
- [ ] Tests pasan
- [ ] Datos JSON cargados correctamente

### 🌍 Dominios Disponibles
- Agua (agua)
- Calidad del Aire (calidad-aire)
- Residuos Sólidos (residuos-solidos)
- Vertimientos (vertimientos)

---

## 4. HERRAMIENTA: Visor de Mapas Ambientales
**Ruta**: `/ambiental/herramientas/visor-mapas-ambientales`

### Estructura Actual
```
visor-mapas-ambientales/
├── page.tsx (wrapper con ProcessProvider)
├── src/
│   ├── app/
│   │   ├── page.tsx (mapa principal)
│   │   ├── layout.tsx
│   │   ├── guia/page.tsx
│   │   ├── api/
│   │   │   ├── datasets/route.ts
│   │   │   ├── days/route.ts
│   │   │   └── geojson/route.ts
│   │   ├── globals.css
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── MapComponent.tsx (maplibre-gl)
│   │   └── UploadWizard.tsx
│   ├── types/
│   │   └── index.ts
│   ├── context/
│   │   └── ProcessContext.tsx
│   └── lib/
│       └── (logger, supabase si usa)
```

### ✓ Verificaciones
- [ ] Wrapper con ProcessProvider
- [ ] MapComponent renderiza sin errores
- [ ] maplibre-gl cargado correctamente
- [ ] UploadWizard funciona
- [ ] API routes retornan datos
- [ ] Tipos TypeScript correctos
- [ ] Guía de uso accesible
- [ ] Tests del mapa pasan

### 🗺️ Características
- Visualización de datos GIS
- Upload de datasets (CSV, GeoJSON, XLSX)
- Filtros geoespaciales
- Integración con Supabase (si aplica)

---

## 5. FALTANTE: ¿Cuarta Herramienta?

Según el registro actual (`tools-registry.ts`), hay 3 herramientas ambientales:
1. ✅ visor-mapas-ambientales
2. ✅ normas-ambientales
3. ✅ generador-matrices-eia
4. ❓ **FALTA?** analisis-correlaciones no está en el registro

### Posibles Acciones
- [ ] Agregar `analisis-correlaciones` al registro
- [ ] Verificar si hay una 4ª herramienta pendiente
- [ ] Actualizar slugs en el registro si cambiaron

---

## 6. PROBLEMAS A REVISAR

### 6.1 Página Principal Ambiental
**Archivo**: `/apps/web/src/app/(portals)/ambiental/page.tsx`

**Problema**: Los botones "Abrir" no tienen enlaces

```tsx
// ❌ ACTUAL - Sin enlaces
<button className="mt-4 w-full rounded-lg bg-[#0077B6]/10 py-2 ...">
  Abrir
</button>

// ✅ DEBERÍA SER
<Link href="/ambiental/herramientas/visor-mapas-ambientales">
  <button className="mt-4 w-full rounded-lg bg-[#0077B6]/10 py-2 ...">
    Abrir
  </button>
</Link>
```

### 6.2 Registry Desactualizado
El `tools-registry.ts` tiene URLs placeholder y no tiene `analisis-correlaciones`.

### 6.3 Tests de Herramientas
- ✅ visor-mapas-ambientales: `page.test.tsx` existe
- ❓ analisis-correlaciones: ¿Tiene tests?
- ❓ generador-matrices: ¿Tiene tests?
- ❓ normas-ambientales: ¿Tiene tests?

---

## 7. CHECKLIST DE INTEGRACIÓN

### Por Cada Herramienta
- [ ] Wrapper `page.tsx` en raíz de `/herramientas/{slug}/`
- [ ] ProcessProvider envuelve el componente principal
- [ ] Analytics integrada con Sentry
- [ ] Tema claro aplicado (Light theme ambiental)
- [ ] Responsive design funciona
- [ ] Tests unitarios en `src/app/__tests__/`
- [ ] Tests de integración pasan
- [ ] AuthModal si es privada
- [ ] SEO metadata correcta
- [ ] Sitemap generado

### Página Principal
- [ ] Botones "Abrir" tienen enlaces a las herramientas
- [ ] Links usan `<Link>` de Next.js
- [ ] Hover effects funcionan
- [ ] Mobile responsive

### Registry
- [ ] `tools-registry.ts` tiene todas las herramientas
- [ ] URLs apuntan a rutas correctas (no placeholders)
- [ ] Slugs coinciden con carpetas
- [ ] Metadata SEO completa

---

## 8. COMANDOS PARA TESTING

```bash
# Tests de la aplicación principal
npm run test

# Build
pnpm --filter @ia-next/web build

# Tests específicos de herramientas
npm run test -- analisis-correlaciones
npm run test -- generador-matrices
npm run test -- normas-ambientales
npm run test -- visor-mapas-ambientales
```

---

## 9. PRÓXIMOS PASOS

1. [ ] Revisar cada herramienta una por una
2. [ ] Actualizar botones de la página principal con Enlaces
3. [ ] Agregar `analisis-correlaciones` al registry
4. [ ] Verificar y ejecutar tests
5. [ ] Validar ProcessProvider en wrappers
6. [ ] Confirmar tema claro en componentes
7. [ ] Crear sitemap unificado
8. [ ] Commit y push de cambios

