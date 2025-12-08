# ✅ CHECKLIST DE VERIFICACIÓN SEO

Use este documento para verificar que todos los cambios están implementados correctamente.

---

## FASE 1: CAMBIOS YA REALIZADOS ✅

### Archivos Modificados
- [x] `/public/manifest.json` - Creado
- [x] `/src/app/page.tsx` - Metadata completa
- [x] `/src/app/(portals)/ambiental/layout.tsx` - Mejorada
- [x] `/src/app/(portals)/ia/layout.tsx` - Mejorada
- [x] `/src/app/(portals)/ia/.../herramientas/[slug]/page.tsx` - Estructura mejorada
- [x] `/next.config.mjs` - CSP actualizada
- [x] `/src/app/layout.tsx` - Manifest agregado

### Documentación Creada
- [x] `SEO_AUDIT_REPORT.md` - Reporte técnico completo (2000+ líneas)
- [x] `IMPLEMENTATION_GUIDE.md` - Guía paso a paso para desarrolladores
- [x] `SEO_SUMMARY.md` - Resumen ejecutivo
- [x] Este checklist

---

## FASE 2: TAREAS CRÍTICAS (DEBE HACER ESTA SEMANA)

### 2.1 Crear Imágenes y Favicon

**Descripción:** Crear 5 archivos de imagen críticos para SEO

#### Tarea 2.1.1: Crear imagen OG general
```
Archivo: /public/images/og-image.jpg
Tamaño: 1200 x 630 px
Formato: JPEG (< 100KB)
Contenido: Logo AquatechIA + "IA + Gestión Ambiental"
Colores: Blanco, Negro, Cian/Verde
Prioridad: MÁXIMA
```
- [ ] Imagen creada
- [ ] Guardada en ruta correcta
- [ ] Optimizada (< 100KB)
- [ ] Verificar en navegador (F12)

**Validación:**
```tsx
// En navegador, verificar:
<meta property="og:image" content="https://aquatechia.com/images/og-image.jpg">
```

#### Tarea 2.1.2: Crear imagen OG portal IA
```
Archivo: /public/images/og-image-ia.jpg
Tamaño: 1200 x 630 px
Formato: JPEG (< 100KB)
Contenido: Logo + "Inteligencia Artificial"
Colores: Negro, Cian (tema dark)
Prioridad: MÁXIMA
```
- [ ] Imagen creada
- [ ] Guardada en ruta correcta
- [ ] Optimizada
- [ ] Verifica que se use en /ia

#### Tarea 2.1.3: Crear imagen OG portal Ambiental
```
Archivo: /public/images/og-image-ambiental.jpg
Tamaño: 1200 x 630 px
Formato: JPEG (< 100KB)
Contenido: Logo + "Gestión Ambiental"
Colores: Blanco, Verde (tema light)
Prioridad: MÁXIMA
```
- [ ] Imagen creada
- [ ] Guardada en ruta correcta
- [ ] Optimizada
- [ ] Verifica que se use en /ambiental

#### Tarea 2.1.4: Crear favicon.ico
```
Archivo: /public/favicon.ico
Tamaños: 64x64, 128x128, 256x256 (multiresolution)
Formato: ICO
Contenido: Logo simplificado AquatechIA
Prioridad: MÁXIMA
```
- [ ] Favicon creado
- [ ] Guardado como favicon.ico
- [ ] Verifica que aparezca en tab del navegador
- [ ] Comando: `curl -I https://aquatechia.com/favicon.ico` (debe dar 200)

#### Tarea 2.1.5: Crear apple-touch-icon.png
```
Archivo: /public/apple-touch-icon.png
Tamaño: 180x180 px
Formato: PNG
Contenido: Logo simplificado (sin fondo)
Prioridad: MEDIA
```
- [ ] Imagen creada
- [ ] Guardada en ruta correcta
- [ ] PNG de buena calidad

**Validación después de completar 2.1:**
```bash
# En terminal
curl -I https://aquatechia.com/favicon.ico
curl -I https://aquatechia.com/images/og-image.jpg
curl -I https://aquatechia.com/images/og-image-ia.jpg
curl -I https://aquatechia.com/images/og-image-ambiental.jpg
curl -I https://aquatechia.com/apple-touch-icon.png
```

Todos deben retornar `200 OK`

---

### 2.2 Arreglar Blog Ambiental

**Archivo:** `/src/app/(portals)/ambiental/(marketing)/blog/[slug]/page.tsx`

#### Tarea 2.2.1: Remover "use client"
```tsx
// ❌ ELIMINAR ESTA LÍNEA del inicio del archivo
"use client";
```
- [ ] Línea removida
- [ ] Archivo debe empezar con imports

#### Tarea 2.2.2: Reemplazar datos hardcodeados con dinámicos
```tsx
// ❌ REEMPLAZAR ESTO:
const ARTICLE_DATA: BlogArticle = {
  slug: "plan-restauracion-hidrica-2030",
  // ... datos
};

// ✅ CON ESTO:
// Implementar getArticleBySlug() que obtenga datos reales
const article = await getArticleBySlug("ambiental", slug);
if (!article) notFound();
```
- [ ] Función getArticleBySlug() implementada
- [ ] Datos vienen de BD o archivos reales
- [ ] Usa `notFound()` si slug no existe

#### Tarea 2.2.3: Agregar generateMetadata() async
```tsx
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("ambiental", slug);
  
  // ... retornar metadata completa
}
```
- [ ] Función implementada
- [ ] Retorna title, description, keywords
- [ ] Incluye OpenGraph completo
- [ ] Incluye Twitter Card
- [ ] Incluye canonical absoluta

#### Tarea 2.2.4: Agregar Article JSON-LD Schema
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      // ... más campos
    }),
  }}
/>
```
- [ ] Schema agregado al componente
- [ ] Incluye: headline, description, image, datePublished, author
- [ ] Válido según schema.org

**Validación después de completar 2.2:**
```bash
npm run build  # No debe haber errores
npm run start  # Iniciar servidor local

# En navegador:
# 1. Ir a http://localhost:3000/ambiental/blog/plan-restauracion-hidrica-2030
# 2. F12 → Elements → verificar:
#    - <title> correcto
#    - <meta name="description"> presente
#    - <meta property="og:image"> apunta a imagen real
#    - <script type="application/ld+json"> contiene Article schema válido
```

---

### 2.3 Arreglar Blog IA

**Archivo:** `/src/app/(portals)/ia/(marketing)/blog/[slug]/page.tsx`

**APLICAR EXACTAMENTE EL MISMO PROCESO que 2.2**

- [ ] Tarea 2.3.1: Remover "use client"
- [ ] Tarea 2.3.2: Reemplazar datos hardcodeados
- [ ] Tarea 2.3.3: Agregar generateMetadata()
- [ ] Tarea 2.3.4: Agregar Article JSON-LD Schema

---

### 2.4 Implementar Herramientas Dinámicas

#### 2.4.1 Portal IA - `/ia/herramientas/[slug]`

**Archivo:** `/src/app/(portals)/ia/(marketing)/herramientas/[slug]/page.tsx`

- [ ] Implementar `getToolBySlug("ia", slug)` function
- [ ] Implementar `getToolsByPortal("ia")` function
- [ ] Agregar validación: `if (!tool) notFound()`
- [ ] Actualizar generateMetadata() con datos reales:
  - [ ] title: "{tool.name} | Herramientas IA | AquatechIA"
  - [ ] description: tool.description (real)
  - [ ] keywords: tool.keywords (real)
  - [ ] og:image: tool.image (real o fallback)
- [ ] Renderizar componente/iframe real en lugar de placeholder
- [ ] Agregar EducationalWebApplication schema

**Validación:**
```bash
# En navegador:
# Ir a /ia/herramientas/[slug-real]
# F12 → Elements → verificar metadata correcta
```

#### 2.4.2 Portal Ambiental - `/ambiental/herramientas/[slug]`

**Archivo:** `/src/app/(portals)/ambiental/(marketing)/herramientas/[slug]/page.tsx`

**MISMO PROCESO que 2.4.1**

- [ ] Implementar getToolBySlug("ambiental", slug)
- [ ] Agregar metadata completa
- [ ] Agregar validación notFound()
- [ ] Renderizar contenido real

---

## FASE 3: TAREAS MODERADAS (DENTRO DE 2 SEMANAS)

### 3.1 Mejorar atributos alt en imágenes

**Buscar todos los archivos .tsx con `<Image>`:**

```bash
grep -r "alt=" apps/web/src --include="*.tsx"
```

Para cada imagen encontrada:

#### 3.1.1 Página principal (`/src/app/page.tsx`)
- [ ] Logo: "Logo de AquatechIA - Plataforma de inteligencia artificial y gestión ambiental"
- [ ] Technology hero: "Visualización de inteligencia artificial para gestión ambiental"
- [ ] Mountains hero: "Paisaje natural - Gestión ambiental sostenible"

#### 3.1.2 Portal IA (`/src/app/(portals)/ia/page.tsx`)
- [ ] Todas las imágenes con alt descriptivos
- [ ] Incluir palabras clave relevantes

#### 3.1.3 Portal Ambiental (`/src/app/(portals)/ambiental/page.tsx`)
- [ ] Todas las imágenes con alt descriptivos
- [ ] Incluir palabras clave relevantes

#### 3.1.4 Componentes en `/src/components/`
- [ ] Revisar HeaderIA.tsx
- [ ] Revisar FooterIA.tsx
- [ ] Revisar HeaderAmbiental.tsx
- [ ] Revisar FooterAmbiental.tsx
- [ ] Revisar todos los demás componentes con imágenes

**Patrón a seguir:**

```tsx
// ❌ ANTES
<Image src="/images/logo.png" alt="Logo" width={100} height={100} />

// ✅ DESPUÉS
<Image 
  src="/images/logo.png" 
  alt="Logo de AquatechIA - Plataforma de inteligencia artificial y gestión ambiental sostenible"
  width={100} 
  height={100} 
  loading="lazy"  // Agregar si no es above-the-fold
/>
```

---

### 3.2 Estandarizar URLs

- [ ] Verificar no hay `/productos` duplicado de `/herramientas`
- [ ] Verificar no hay `/perfil` duplicado de `/autor`
- [ ] Agregar redirects en next.config.mjs si es necesario
- [ ] Verificar trailing slashes consistentes

---

### 3.3 Agregar canonical absolutas donde faltan

Buscar:
```bash
grep -r "canonical:" apps/web/src --include="*.tsx" | grep -v "https://"
```

Reemplazar relativos por absolutos:
```tsx
// ❌ Relative
alternates: { canonical: "/ia/autor" }

// ✅ Absolute
alternates: { canonical: "https://aquatechia.com/ia/autor" }
```

- [ ] Todas las canonicals son absolutas

---

### 3.4 Agregar noindex a páginas privadas

- [ ] Identificar páginas privadas/internas
- [ ] Agregar `robots: "noindex, nofollow"` a metadata

---

## FASE 4: TAREAS OPCIONALES (BONIFICACIÓN)

### 4.1 Agregar FAQ Schema
- [ ] Crear sección FAQ visible en página
- [ ] Agregar FAQPage JSON-LD Schema

### 4.2 Configurar Google Analytics
- [ ] Instalar @next/third-parties/google
- [ ] Agregar GoogleAnalytics component en layout.tsx
- [ ] Reemplazar "G-XXXXXXXXXX" con ID real

### 4.3 Implementar búsqueda real
- [ ] Verificar si `/buscar` existe o crear
- [ ] Actualizar potentialAction en WebSite schema

### 4.4 Agregar hreflang si hay versión EN
- [ ] Crear versión en inglés (opcional)
- [ ] Agregar alternates.languages en metadata

---

## VALIDACIÓN FINAL

Después de completar FASE 2, ejecutar:

### A. Build
```bash
cd apps/web
npm run build
```
- [ ] Build exitoso sin errores
- [ ] Sin warnings críticos

### B. Validación de metadatos
```bash
npm run start
```

Para cada página importante:
1. Abrir en http://localhost:3000
2. F12 → Elements → <head>
3. Verificar:
   - [ ] `<title>` correcto
   - [ ] `<meta name="description">` presente (155-160 chars)
   - [ ] `<meta name="keywords">` presente
   - [ ] `<meta property="og:image">` con imagen válida
   - [ ] `<meta property="og:title">` presente
   - [ ] `<meta property="og:description">` presente
   - [ ] `<meta name="twitter:card">` = "summary_large_image"
   - [ ] `<link rel="canonical">` absoluta
   - [ ] `<link rel="manifest">` = "/manifest.json"
   - [ ] `<script type="application/ld+json">` con schema válido

### C. Herramientas Google

#### C.1 Rich Results Test
- Ir a: https://search.google.com/test/rich-results
- Para cada página con schema:
  - [ ] Copiar URL y validar
  - [ ] Verificar schema válido (sin errores)
  - [ ] Verificar schema visible en resultados

#### C.2 Mobile-Friendly Test
- Ir a: https://search.google.com/test/mobile-friendly
- [ ] Página es mobile-friendly
- [ ] No hay problemas críticos

#### C.3 PageSpeed Insights
- Ir a: https://pagespeed.web.dev/
- Para URL principal:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms (o INP < 200ms)
  - [ ] CLS < 0.1
  - [ ] Score > 70

#### C.4 OpenGraph Validator
- Ir a: https://www.opengraph.xyz/
- Para cada página con og:image:
  - [ ] Imagen aparece en preview
  - [ ] Tamaño correcto (1200x630)
  - [ ] No hay errores de carga

### D. Verificación de Favicon
```bash
# En terminal
curl -I https://aquatechia.com/favicon.ico
```
- [ ] Status 200 OK
- [ ] Content-Type: image/x-icon

### E. Verificación de Manifest
```bash
curl https://aquatechia.com/manifest.json
```
- [ ] JSON válido
- [ ] Contiene iconos, name, description

---

## CHECKLIST DE ENTREGA FINAL

Antes de considerar COMPLETADO:

### Código
- [ ] Todos los archivos compilados sin errores
- [ ] No hay console.errors en producción
- [ ] No hay broken links internos
- [ ] No hay broken images (404)

### SEO Técnico
- [ ] Todas las páginas tienen metadata
- [ ] Todas las páginas tienen canonical
- [ ] Todos los schemas son válidos
- [ ] Favicon accesible
- [ ] Manifest válido
- [ ] OG images accesibles

### Contenido
- [ ] Atributos alt mejora dos
- [ ] Descripciones > 155 caracteres
- [ ] URLs consistentes
- [ ] Sin contenido duplicado

### Testing
- [ ] Rich Results valid ✅
- [ ] Mobile Friendly ✅
- [ ] PageSpeed Score > 70 ✅
- [ ] OpenGraph previews correctos ✅

### Documentación
- [ ] Este checklist completado
- [ ] SEO_AUDIT_REPORT.md actualizado
- [ ] IMPLEMENTATION_GUIDE.md referenciado
- [ ] Todo documentado en commit

---

## ESTIMADO DE TIEMPO

| Fase | Horas | Status |
|------|-------|--------|
| Fase 1 (Análisis) | 8 | ✅ Completado |
| Fase 2 (Crítico) | 10-12 | ⏳ Pendiente |
| Fase 3 (Moderado) | 4-5 | ⏳ Pendiente |
| Fase 4 (Opcional) | 2-3 | ⏳ Pendiente |
| **TOTAL** | **24-28** | |

**Si dedicas 8 horas/día = 3-3.5 días de trabajo**

---

## SIGNOFF

Una vez completadas todas las tareas:

```
✅ Revisión de código: ___________________ Fecha: _______
✅ Testing: ___________________ Fecha: _______
✅ Deployment: ___________________ Fecha: _______
✅ Monitoreo (1 semana): ___________________ Fecha: _______
```

---

**¡Éxito! Una vez completes este checklist, AquatechIA estará completamente optimizada para SEO! 🚀**

