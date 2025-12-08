# 🔍 AUDITORÍA SEO COMPLETA - Aquatech IA

**Fecha:** Diciembre 7, 2025  
**Proyecto:** Aquatech IA - Plataforma de IA + Gestión Ambiental  
**URL Base:** https://aquatechia.com  
**Alcance:** Análisis profundo enfocado en optimización para motores de búsqueda

---

## 📋 TABLA DE CONTENIDOS
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Análisis de Metadatos](#análisis-de-metadatos)
3. [Estructura de URLs y Navegación](#estructura-de-urls-y-navegación)
4. [Optimización de Imágenes](#optimización-de-imágenes)
5. [Rendimiento y Core Web Vitals](#rendimiento-y-core-web-vitals)
6. [Contenido y Palabras Clave](#contenido-y-palabras-clave)
7. [Estructura de Datos (Schema.org)](#estructura-de-datos)
8. [Robots.txt y Sitemap](#robots-y-sitemap)
9. [Problemas Críticos](#problemas-críticos)
10. [Problemas Moderados](#problemas-moderados)
11. [Mejoras Opcionales](#mejoras-opcionales)
12. [Plan de Acción Prioritizado](#plan-de-acción-prioritizado)

---

## RESUMEN EJECUTIVO

### ✅ FORTALEZAS ACTUALES
- **Estructura Next.js moderna** con soporte completo para metadatos dinámicos
- **Schema.org implementado** con Organization, Website y BreadcrumbList
- **Open Graph y Twitter Cards** configurados correctamente
- **Sitemap.xml dinámico** con frecuencias de cambio apropiadas
- **Robots.txt bien configurado** con reglas específicas por bot
- **MetadataBase correctamente configurado**
- **Dos portales bien diferenciados** (IA y Ambiental)
- **Structured data en múltiples herramientas educativas**

### ⚠️ PROBLEMAS IDENTIFICADOS (CRÍTICOS)
1. **Falta imagen OG global** - No existe `/images/og-image.jpg`
2. **Falta favicon** - Sin archivos favicon/manifest
3. **Herramienta [slug] sin metadata** - Página de herramientas IA incompleta
4. **Falta hreflang** - Sin soporte para versiones en otros idiomas
5. **Página home (`/page.tsx`) sin metadatos SEO completos**
6. **Falta de metadata en blog dinámico** - `blog/[slug]` es "use client"
7. **Múltiples herramientas sin canonical absolutas**

### 📊 PROBLEMAS IDENTIFICADOS (MODERADOS)
1. Algunas imágenes sin atributos alt descriptivos
2. Falta de descripción de contacto en schema
3. Rendimiento de imágenes no optimizado
4. Algunas páginas anidadas sin canonical URL
5. Falta validación de slug existente en herramientas

### 💡 MEJORAS OPTATIVAS
1. Agregar FAQ schema
2. Mejorar breadcrumbs dinámicas
3. Implementar pagination schema
4. Agregar Google Analytics con Next.js
5. Configurar Google Search Console

---

## ANÁLISIS DE METADATOS

### 1. PÁGINA PRINCIPAL (`/`)

**Estado:** ⚠️ INCOMPLETO

```tsx
// ACTUAL
export const metadata = {
  title: "Aquatech IA - Innovación y Sostenibilidad",
  description: "Plataforma de Inteligencia Artificial y Gestión Ambiental...",
};
```

**PROBLEMAS:**
- ❌ No hereda metadata del layout.tsx
- ❌ Falta Open Graph completo
- ❌ Falta Twitter Card
- ❌ Falta canonical
- ❌ Falta palabras clave específicas
- ❌ No tiene alternates: { canonical: ... }

**RECOMENDACIÓN:** Actualizar con metadata completa

---

### 2. PORTAL IA (`/ia`)

**Estado:** ✅ BUENO (pero incompleto)

**Lo que falta:**
- ❌ Falta imagen OG específica para portal IA
- ⚠️ Keywords podrían ser más específicas
- ⚠️ Falta canonical absoluta en alternates

---

### 3. PORTAL AMBIENTAL (`/ambiental`)

**Estado:** ✅ BUENO (pero minimalista)

```tsx
export const metadata: Metadata = {
  title: "Gestión Ambiental - Aquatech IA",
  description: "Herramientas de gestión ambiental, mapas, normas y recursos para un futuro sostenible.",
};
```

**PROBLEMAS:**
- ❌ Falta descripción más detallada (< 160 caracteres es muy corta)
- ❌ Sin Open Graph
- ❌ Sin Twitter Card
- ❌ Sin canonical
- ❌ Sin keywords

---

### 4. HERRAMIENTAS DINÁMICAS (`/ia/herramientas/[slug]`)

**Estado:** ❌ CRÍTICO

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.slug} | Herramientas IA`,
    description: `Explora la herramienta ${params.slug} de inteligencia artificial.`,
  };
}
```

**PROBLEMAS GRAVES:**
- ❌ Metadata estática sin datos reales
- ❌ Sin descripción completa de la herramienta
- ❌ Sin Open Graph
- ❌ Sin canonical
- ❌ Sin Keywords
- ❌ Sin validación de existencia (podría retornar 404 mal)
- ❌ TODO: Get tool data from registry - NO IMPLEMENTADO

---

### 5. BLOG DINÁMICO (`/ambiental/blog/[slug]`)

**Estado:** ❌ CRÍTICO

```tsx
// El archivo es "use client" - PROBLEMA GRAVE para SEO
"use client";

type BlogArticle = {
  slug: string;
  title: string;
  // ...
};

const ARTICLE_DATA: BlogArticle = {
  slug: "plan-restauracion-hidrica-2030",
  // ...
};
```

**PROBLEMAS GRAVES:**
- ❌ **NO TIENE METADATA - es "use client"**
- ❌ Artículos hardcodeados sin datos dinámicos reales
- ❌ Sin `generateMetadata()` asincrónica
- ❌ Sin Open Graph con imagen del artículo
- ❌ Sin schema de Article
- ❌ Sin author schema
- ❌ Sin canonicals absolutas
- ❌ Los datos son estáticos, no dinámicos desde DB/CMS

---

## ESTRUCTURA DE URLS Y NAVEGACIÓN

### ✅ ESTRUCTURA GENERAL BUENA
```
/                          # Página inicio
/ia                        # Portal IA
/ia/blog                   # Blog IA
/ia/blog/[slug]           # Artículos IA
/ia/categoria/[slug]      # Categorías IA
/ia/herramientas          # Listado herramientas
/ia/herramientas/[slug]   # Detalle herramienta
/ia/nosotros              # Acerca de IA
/ia/cursos                # Cursos IA
/ia/autor                 # Perfil autor IA

/ambiental                 # Portal Ambiental (SIMILAR)
/ambiental/blog
/ambiental/blog/[slug]
/ambiental/categoria/[slug]
/ambiental/herramientas
/ambiental/herramientas/[slug]
/ambiental/nosotros
/ambiental/autor
```

### ⚠️ PROBLEMAS

1. **Inconsistencia de URLs:**
   - Algunos `/ia/autor` otros `/ia/perfil`
   - Algunos `/ia/herramientas` otros `/ia/productos`

2. **Sin trailing slashes consistentes:**
   - Revisar si `/ia/` y `/ia` son diferentes

3. **URLs muy anidadas:**
   - `/ambiental/herramientas/visor-mapas-ambientales/...` podría ser muy profunda

4. **Falta estructura de tags:**
   - No hay `/ia/tags/[tag]` o similar para agrupar contenido

---

## OPTIMIZACIÓN DE IMÁGENES

### ❌ PROBLEMAS CRÍTICOS

#### 1. **Falta imagen OG global**
```
❌ /images/og-image.jpg NO EXISTE
```

**Impacto:** 
- No hay preview en redes sociales
- Falta imagen en Twitter Card
- Falta imagen en Open Graph

**Solución:**
- Crear imagen de 1200x630 px
- Optimizada en WEBP/AVIF
- Con logo y branding de Aquatech IA

#### 2. **Falta favicon.ico y manifest**
```
❌ /favicon.ico NO EXISTE
❌ /manifest.json NO EXISTE
❌ /apple-touch-icon.png NO EXISTE
```

**Impacto:**
- Error 404 en solicitudes de favicon
- No aparece favicon en navegador
- No se puede instalar como PWA
- Afecta rankings en Chrome Web Search

#### 3. **Imágenes sin atributo alt descriptivo**

Ejemplos encontrados:
```tsx
<Image
  src="/images/Logo Aquatech - IA 512 - sin fondo.png"
  alt="Aquatech IA"  // ⚠️ MUY GENÉRICO
  width={280}
  height={280}
/>

<Image
  src="/images/technology-hero.jpg"
  alt="Tecnología e Inteligencia Artificial"  // ✅ MEJOR
  fill
/>
```

**Recomendación:**
- Ser más descriptivos: 
  - ❌ `alt="Aquatech IA"`
  - ✅ `alt="Logo de Aquatech IA - Plataforma de Inteligencia Artificial para Gestión Ambiental"`

---

### ⚠️ CONFIGURACIÓN ACTUAL (BUENA)

```javascript
// Next.js config está bien configurado
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "lh3.googleusercontent.com" },
    { protocol: "https", hostname: "*.supabase.co" },
  ],
  formats: ["image/avif", "image/webp"],  // ✅ BUENO
  deviceSizes: [...],
  imageSizes: [...],
  minimumCacheTTL: 60,  // ✅ BUENO
},
```

**Pero hay un problema:**

```javascript
dangerouslyAllowSVG: false,  // ✅ CORRECTO (seguridad)
contentDispositionType: "attachment",  // ⚠️ Esto previene mostrar imágenes
contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",  // ⚠️ Muy restrictivo
```

---

## RENDIMIENTO Y CORE WEB VITALS

### ❌ PROBLEMAS IDENTIFICADOS

#### 1. **Next.js Font Loading**

La página carga 2 fuentes Google sin optimización:
```tsx
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],  // ⚠️ Solo peso 700
  variable: "--font-space",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400"],  // ⚠️ Solo peso 400
  variable: "--font-noto",
});
```

**Problema:**
- Se cargan dos fuentes separadas
- Sin `preload` explícito
- Sin `font-display: swap` configurado

**Solución:**
```tsx
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space",
  display: "swap",  // Agregar
  preload: true,    // Agregar
});
```

#### 2. **Falta optimización de imágenes grandes**

La página `/ia` tiene:
```tsx
<Image
  src="/images/technology-hero.jpg"
  alt="Tecnología e Inteligencia Artificial"
  fill
  className="object-cover"
  priority  // ✅ BIEN
/>
```

**Pero:**
- Las imágenes hero son grandes (no se especifica tamaño en public/)
- Podrían estar comprimidas/redimensionadas
- Sin especificar `quality` parameter

#### 3. **Falta de lazy loading**

Muchas imágenes no tienen `loading="lazy"`:
```tsx
// Sin lazy loading en cards de abajo de la carpeta
<Image
  src="/images/portal-ia/..."
  alt="..."
  // ❌ Falta loading="lazy"
/>
```

---

## CONTENIDO Y PALABRAS CLAVE

### ANÁLISIS DE KEYWORDS ACTUALES

**Keywords globales (layout.tsx):**
```
["inteligencia artificial", "gestión ambiental", "sostenibilidad", 
 "herramientas IA", "cursos ambientales", "tecnología ambiental"]
```

**PROBLEMAS:**
- ✅ Keywords relevantes
- ⚠️ Demasiado genéricas
- ❌ Falta keywords de cola larga (long-tail)
- ❌ Falta keywords geo-targeting (Colombia, LatAm)

**RECOMENDACIÓN:**

Expandir keywords a:

**Globales:**
```
[
  "inteligencia artificial",
  "gestión ambiental",
  "sostenibilidad",
  "herramientas IA",
  "cursos ambientales",
  "tecnología ambiental",
  // AGREGAR:
  "IA para agua",
  "machine learning ambiental",
  "análisis ambiental con IA",
  "herramientas sostenibilidad",
  "modelos generativos"
]
```

**Portal IA específicas:**
```
[
  "inteligencia artificial",
  "IA",
  "agua",
  "ambiente",
  "machine learning",
  "modelos generativos",
  "sostenibilidad",
  "tecnología ambiental",
  // AGREGAR:
  "LLM educativos",
  "IA explicable",
  "modelos de lenguaje",
  "procesamiento de texto",
  "generación de imágenes con IA"
]
```

**Portal Ambiental específicas:**
```
// ACTUAL:
["Gestión Ambiental - Aquatech IA"]

// DEBE SER:
[
  "gestión ambiental",
  "sostenibilidad",
  "normativa ambiental",
  "monitoreo ambiental",
  "análisis de impacto ambiental",
  "control de contaminación",
  "agua sostenible",
  "residuos sólidos",
  "calidad del aire",
  "vertimientos",
  "evaluación ambiental"
]
```

---

### ANÁLISIS DE CONTENIDO

#### ❌ PROBLEMAS

1. **Página `/` es muy corta:**
   - Solo 2 tarjetas de portales
   - Sin contenido descriptivo
   - Sin valor agregado visible

2. **Falta página /about o similar:**
   - Sin explicación de qué es AquatechIA
   - Sin valor de propuesta
   - Sin team/credibilidad

3. **Blog sin contenido real:**
   - Artículos son plantillas
   - Datos hardcodeados
   - Sin metadata real de artículos

4. **Herramientas sin descripción:**
   - Página `[slug]` solo tiene TODOs
   - Sin información real
   - Sin CTAs

---

## ESTRUCTURA DE DATOS (SCHEMA.ORG)

### ✅ IMPLEMENTADO CORRECTAMENTE

```json
// Organization Schema ✅
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "AquatechIA",
  "url": "https://aquatechia.com",
  "logo": "https://aquatechia.com/images/logo.png",
  "description": "...",
  "sameAs": ["https://twitter.com/aquatechia", "..."],
  "knowsAbout": ["IA", "ML", "Gestión Ambiental", ...],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "info@aquatechia.com"
  }
}

// Website Schema ✅
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AquatechIA",
  "url": "https://aquatechia.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://aquatechia.com/buscar?q={search_term_string}"
    }
  }
}

// BreadcrumbList Schema ✅
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

### ⚠️ MEJORAS NECESARIAS

1. **Agregar Article Schema en blog:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Título del artículo",
  "description": "Descripción",
  "image": "URL imagen",
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-01",
  "author": {
    "@type": "Person",
    "name": "Nombre autor"
  },
  "publisher": {
    "@type": "Organization",
    "name": "AquatechIA",
    "logo": {"@type": "ImageObject", "url": "..."}
  }
}
```

2. **Agregar EducationalResource en herramientas:**
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalWebApplication",
  "name": "Nombre herramienta",
  "description": "...",
  "applicationCategory": "EducationalApplication",
  "learningResourceType": "Interactive Tool"
}
```

3. **Agregar FAQPage Schema (global):**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es AquatechIA?",
      "acceptedAnswer": {"@type": "Answer", "text": "..."}
    }
  ]
}
```

---

## ROBOTS.TXT Y SITEMAP

### ✅ ROBOTS.TXT - BIEN CONFIGURADO

```plaintext
User-agent: *
Allow: /
Allow: /ia/
Allow: /ambiental/
Allow: /privacy/
Allow: /terms/
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$
Disallow: /.env
Disallow: /.next/
Disallow: /node_modules/

User-agent: Googlebot
Allow: /
Crawl-delay: 0
Request-rate: 100/1m

User-agent: Bingbot
Allow: /
Crawl-delay: 1
Request-rate: 30/1m

# Bloquea bots malos
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

Sitemap: https://aquatechia.com/sitemap.xml
```

**FORTALEZAS:**
- ✅ Sitemap referenciado
- ✅ Crawl delays específicos
- ✅ Bloquea bots malos
- ✅ Reglas específicas por portal

**MEJORAS OPTATIVAS:**
```plaintext
# Agregar User-agent para Google Images
User-agent: Googlebot-Image
Allow: /
```

### ✅ SITEMAP.TS - BIEN IMPLEMENTADO

**Fortalezas:**
- ✅ Dinámico (actualiza automáticamente)
- ✅ Incluye herramientas
- ✅ Incluye artículos
- ✅ Incluye categorías
- ✅ Usa `changeFrequency` apropiadas
- ✅ Prioridades variables

**Pero hay un problema:**

```typescript
// Falta en el sitemap:
// - /ia/herramientas/[slug] (herramientas IA)
// - /ia/blog/[slug] (artículos IA)
// - /ia/categoria/[slug] (categorías IA)
```

El sitemap solo genera URLs base, no necesariamente todas las dinámicas.

---

## PROBLEMAS CRÍTICOS

### 🔴 P1: Falta imagen OG global y favicon

**Severidad:** CRÍTICA  
**Impacto:** Alto - Sin imagen en redes sociales, error 404 en favicon  
**Afecta:** Todas las páginas, tráfico desde redes sociales

**Solución:** Crear 3 archivos:

1. `/public/images/og-image.jpg` (1200x630 px, <100KB)
2. `/public/favicon.ico` (64x64)
3. `/public/manifest.json`

---

### 🔴 P2: Página `/` sin metadata completa

**Severidad:** CRÍTICA  
**Impacto:** Alto - Página principal sin metadatos  
**Código actual:**
```tsx
export const metadata = {
  title: "Aquatech IA - Innovación y Sostenibilidad",
  description: "Plataforma de Inteligencia Artificial y Gestión Ambiental...",
};
```

**Problema:** No hereda del layout ni tiene Open Graph

---

### 🔴 P3: Blog dinámico es "use client" (NO TIENE METADATA)

**Severidad:** CRÍTICA  
**Impacto:** ALTO - Artículos no son rastreables por SEO  
**Archivo:** `/apps/web/src/app/(portals)/ambiental/blog/[slug]/page.tsx`

```tsx
"use client";  // ❌ GRAVE - Sin metadata

const ARTICLE_DATA = { ... };  // ❌ Datos hardcodeados
```

**Solución:** Convertir a Server Component con `generateMetadata()`

---

### 🔴 P4: Herramientas IA sin metadata real

**Severidad:** CRÍTICA  
**Impacto:** ALTO - Herramientas no son SEO-friendly  
**Archivo:** `/apps/web/src/app/(portals)/ia/(marketing)/herramientas/[slug]/page.tsx`

```tsx
export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.slug} | Herramientas IA`,  // ❌ Genérica
    description: `Explora la herramienta ${params.slug}...`,  // ❌ Genérica
  };
}
```

**TODO sin implementar:** `// TODO: Get tool data from registry`

**Solución:** Implementar lectura real de datos de herramientas

---

### 🔴 P5: Falta soporte de hreflang para idiomas

**Severidad:** CRÍTICA  
**Impacto:** Medio - Sin soporte para versiones alternativas  
**Problema:** No hay `alternates: { languages: { ... } }`

**Solución:** Si hay versión en inglés, agregar:
```tsx
alternates: {
  languages: {
    "en": "https://aquatechia.com/en",
    "es": "https://aquatechia.com/es",
    "x-default": "https://aquatechia.com"
  }
}
```

---

## PROBLEMAS MODERADOS

### 🟡 M1: Inconsistencia de URLs y metadata en portales

**Severidad:** MODERADA  
**Impacto:** Confusión en navegación, fragmentación de autoridad

**Ejemplos:**
- `/ia/autor` vs `/ambiental/autor` ✅ Consistente
- `/ia/perfil` vs `/ia/autor` ❌ Inconsistente
- `/ia/productos` vs `/ia/herramientas` ❌ Inconsistente

**Solución:** Estandarizar a:
```
/ia/herramientas
/ia/blog
/ia/cursos
/ia/nosotros
/ia/autor
/ia/privacy
/ia/terms
```

---

### 🟡 M2: Metadata en portales ambiental es muy corta

**Severidad:** MODERADA  
**Impacto:** Bajo - Pero oportunidad de mejorar CTR

**Actual:**
```tsx
description: "Herramientas de gestión ambiental, mapas, normas y recursos para un futuro sostenible.",
```

**Problema:** Falta keywords, beneficios, CTA

**Mejor:**
```tsx
description: "Herramientas de gestión ambiental, normatividad ambiental internacional, mapas interactivos, análisis de impacto ambiental, soluciones sostenibles. Recursos para profesionales ambientales.",
```

---

### 🟡 M3: Falta canonical absoluta en algunas páginas

**Severidad:** MODERADA  
**Impacto:** Riesgo de contenido duplicado

**Encontrado:**
```tsx
// ❌ Relative canonical
alternates: {
  canonical: "/ia/autor"
}

// ✅ Debería ser
alternates: {
  canonical: "https://aquatechia.com/ia/autor"
}
```

---

### 🟡 M4: Atributos alt inconsistentes en imágenes

**Severidad:** MODERADA  
**Impacto:** Bajo en rankings, pero accesibilidad/UX

**Ejemplos encontrados:**
```tsx
// ❌ Genérico
alt="Aquatech IA"

// ⚠️ Mejor sería
alt="Logo de Aquatech IA - Plataforma de inteligencia artificial y gestión ambiental sostenible"

// ❌ Genérico
alt="Tecnología e Inteligencia Artificial"

// ⚠️ Mejor
alt="Visualización de algoritmos de inteligencia artificial para gestión ambiental"
```

---

### 🟡 M5: Falta de noindex en páginas de admin/privadas

**Severidad:** MODERADA  
**Impacto:** Medio - Algunas páginas no deberían ser indexadas

**Encontrado:**
```tsx
// ✅ BIEN
robots: "noindex", // Página privada (en /perfil)

// ❌ PERO FALTA en:
// - /api/* (rutas API)
// - /admin/* (si existe)
// - /search/results (página de búsqueda)
// - /print (si existe)
```

---

## MEJORAS OPCIONALES

### 💡 O1: Implementar búsqueda con JSON-LD

**Actual:**
```tsx
potentialAction: {
  "@type": "SearchAction",
  target: {
    "@type": "EntryPoint",
    urlTemplate: `${baseUrl}/buscar?q={search_term_string}`,
  },
}
```

**Problema:** No existe ruta `/buscar`

**Solución:** O crear la ruta o cambiar a:
```tsx
urlTemplate: `${baseUrl}/ia/blog?search={search_term_string}`,
```

---

### 💡 O2: Agregar FAQ Schema global

**Ubicación:** `layout.tsx`

```tsx
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es AquatechIA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AquatechIA es una plataforma de inteligencia artificial y gestión ambiental..."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo funciona el Portal IA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El Portal IA ofrece herramientas, cursos y recursos educativos..."
      }
    },
    // ... más FAQs
  ]
};
```

---

### 💡 O3: Mejorar meta description con emojis (opcional)

**Google permite emojis en meta descriptions** (si el contenido lo justifica)

**Ejemplo:**
```tsx
description: "🤖 Inteligencia Artificial | 🌍 Gestión Ambiental | 📚 Herramientas y Cursos para profesionales"
```

---

### 💡 O4: Implementar Breadcrumb dinámico

**Actual:**
```tsx
// BreadcrumbList estático en layout.tsx
itemListElement: [
  { position: 1, name: "Inicio", item: baseUrl },
  { position: 2, name: "Portal IA", item: `${baseUrl}/ia` },
  { position: 3, name: "Portal Ambiental", item: `${baseUrl}/ambiental` },
]
```

**Mejor:** Generar dinámicamente según la ruta actual

```tsx
// En cada página, agregar:
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
    { "@type": "ListItem", position: 2, name: "Portal IA", item: `${baseUrl}/ia` },
    { "@type": "ListItem", position: 3, name: "Blog", item: `${baseUrl}/ia/blog` },
    { "@type": "ListItem", position: 4, name: "Artículo Actual", item: currentUrl },
  ]
};
```

---

### 💡 O5: Agregar Google Analytics con NextJS

```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  );
}
```

---

## PLAN DE ACCIÓN PRIORITIZADO

### 🔴 FASE 1: CRÍTICO (Semana 1)

**Duración:** 2-3 días  
**Impacto:** Alto

#### 1.1 Crear archivos de imagen y favicon (1-2 horas)
- [ ] Crear `/public/images/og-image.jpg` (1200x630)
- [ ] Crear `/public/og-image-ia.jpg` (1200x630, tema dark)
- [ ] Crear `/public/og-image-ambiental.jpg` (1200x630, tema light)
- [ ] Crear `/public/favicon.ico` (64x64)
- [ ] Crear `/public/apple-touch-icon.png` (180x180)
- [ ] Crear `/public/manifest.json`

**Referencia:** Ver final de este documento para plantillas

#### 1.2 Actualizar página `/` (1-2 horas)
```tsx
// src/app/page.tsx
export const metadata: Metadata = {
  title: "AquatechIA - Inteligencia Artificial + Gestión Ambiental",
  description: "Plataforma educativa de IA y gestión ambiental. Herramientas, cursos y recursos para profesionales. Modelos generativos, análisis ambiental, sostenibilidad.",
  keywords: [
    "inteligencia artificial", "gestión ambiental", "IA", "sostenibilidad",
    "herramientas IA", "modelos generativos", "agua sostenible", "tecnología ambiental"
  ],
  openGraph: {
    title: "AquatechIA - Inteligencia Artificial + Gestión Ambiental",
    description: "Plataforma educativa de IA para la sostenibilidad y gestión ambiental",
    images: [{ url: `${baseUrl}/images/og-image.jpg`, width: 1200, height: 630 }],
    type: "website",
    locale: "es_ES",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "AquatechIA",
    description: "IA + Gestión Ambiental",
    images: [`${baseUrl}/images/og-image.jpg`],
  },
  alternates: {
    canonical: baseUrl,
  },
};
```

#### 1.3 Reparar metadata en portales (1 hora)

**Portal Ambiental:**
```tsx
export const metadata: Metadata = {
  title: "Portal de Gestión Ambiental | Normas, Mapas y Herramientas | AquatechIA",
  description: "Herramientas de gestión ambiental: normatividad ambiental internacional, mapas interactivos, análisis de impacto ambiental, monitoreo de agua, aire, residuos y vertimientos. Soluciones sostenibles.",
  keywords: [
    "gestión ambiental", "normativa ambiental", "sostenibilidad",
    "herramientas ambientales", "mapas ambientales", "evaluación ambiental",
    "calidad del agua", "calidad del aire", "residuos sólidos"
  ],
  openGraph: {
    title: "Portal Ambiental | AquatechIA",
    description: "Herramientas, normas y recursos para gestión ambiental sostenible",
    images: [{ url: `${baseUrl}/images/og-image-ambiental.jpg`, width: 1200, height: 630 }],
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portal Ambiental | AquatechIA",
    description: "Gestión ambiental sostenible con herramientas innovadoras",
    images: [`${baseUrl}/images/og-image-ambiental.jpg`],
  },
  alternates: {
    canonical: `${baseUrl}/ambiental`,
  },
};
```

#### 1.4 Arreglar blog dinámico ambiental (2-3 horas)

**Convertir de "use client" a Server Component:**

```tsx
// src/app/(portals)/ambiental/(marketing)/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllArticles, getArticleBySlug } from "@/lib/blog-articles";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles("ambiental");
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug("ambiental", slug);

  if (!article) {
    return { title: "Artículo no encontrado" };
  }

  const canonicalUrl = `https://aquatechia.com/ambiental/blog/${slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author.name],
      images: [
        {
          url: article.heroImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.heroImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug("ambiental", slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      {/* Article Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            image: article.heroImage,
            datePublished: article.date,
            author: {
              "@type": "Person",
              name: article.author.name,
            },
            publisher: {
              "@type": "Organization",
              name: "AquatechIA",
              logo: {
                "@type": "ImageObject",
                url: "https://aquatechia.com/images/logo.png",
              },
            },
          }),
        }}
      />
      
      {/* Contenido actual del artículo */}
      <article>
        <h1>{article.title}</h1>
        <p>{article.excerpt}</p>
        {/* ... resto del contenido ... */}
      </article>
    </>
  );
}
```

#### 1.5 Implementar herramientas IA con metadata real (2-3 horas)

```tsx
// src/app/(portals)/ia/(marketing)/herramientas/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolsByPortal, getToolBySlug } from "@/lib/services/tools-registry";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const iaTools = getToolsByPortal("ia");
  return iaTools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug("ia", slug);

  if (!tool) {
    return { title: "Herramienta no encontrada" };
  }

  const canonicalUrl = `https://aquatechia.com/ia/herramientas/${slug}`;

  return {
    title: `${tool.name} | Herramientas IA | AquatechIA`,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: tool.name,
      description: tool.description,
      type: "website",
      images: [
        {
          url: tool.image || "https://aquatechia.com/images/og-image-ia.jpg",
          width: 1200,
          height: 630,
        },
      ],
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: tool.name,
      description: tool.description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function IAToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug("ia", slug);

  if (!tool) {
    notFound();
  }

  return (
    <>
      {/* EducationalWebApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalWebApplication",
            name: tool.name,
            description: tool.description,
            applicationCategory: "EducationalApplication",
            learningResourceType: "Interactive Tool",
            url: `https://aquatechia.com/ia/herramientas/${slug}`,
            author: {
              "@type": "Organization",
              name: "AquatechIA",
            },
          }),
        }}
      />
      
      <h1>{tool.name}</h1>
      <p>{tool.description}</p>
      {/* ... resto del contenido ... */}
    </>
  );
}
```

---

### 🟡 FASE 2: MODERADO (Semana 2)

**Duración:** 2-3 días  
**Impacto:** Medio

#### 2.1 Estandarizar URLs y metadata (2 horas)
- [ ] Revisar todas las URLs inconsistentes
- [ ] Cambiar `/productos` → `/herramientas` si aplica
- [ ] Cambiar `/perfil` → `/autor` si aplica
- [ ] Verificar trailing slashes

#### 2.2 Actualizar atributos alt en imágenes (1-2 horas)
- [ ] Revisar todos los `<Image />` components
- [ ] Actualizar alt text genéricos a descriptivos
- [ ] Agregar `loading="lazy"` donde corresponda

#### 2.3 Agregar canonical absoluta en todas las páginas (1 hora)
- [ ] Convertir canonicals relativas a absolutas
- [ ] Verificar metadataBase en cada layout

#### 2.4 Implementar Article Schema en blog IA (1-2 horas)
- [ ] Aplicar mismo patrón del blog Ambiental
- [ ] Convertir `/ia/blog/[slug]` a Server Component
- [ ] Agregar Article JSON-LD

---

### 💡 FASE 3: OPCIONAL (Semana 3)

**Duración:** 1-2 días

#### 3.1 Agregar FAQ Schema global
- [ ] Crear sección FAQ visible
- [ ] Agregar FAQ Schema JSON-LD

#### 3.2 Mejorar meta descriptions
- [ ] Expandir descriptions < 155 caracteres
- [ ] Agregar palabras clave y beneficios
- [ ] Agregar CTAs sutiles

#### 3.3 Implementar búsqueda real
- [ ] Si no existe `/buscar`, crear ruta
- [ ] Actualizar `potentialAction` en WebSite schema
- [ ] Implementar búsqueda en artículos/herramientas

#### 3.4 Agregar hreflang si hay versión en inglés
- [ ] Crear versión en inglés (opcional)
- [ ] Agregar `alternates.languages` en metadata

#### 3.5 Configurar Google Search Console
- [ ] Crear propiedad en GSC
- [ ] Enviar sitemap.xml
- [ ] Verificar cobertura de URLs
- [ ] Monitorear Core Web Vitals

---

## RESUMEN DE ARCHIVOS A MODIFICAR

| Archivo | Prioridad | Cambio |
|---------|-----------|--------|
| `/src/app/page.tsx` | 🔴 P1 | Agregar metadata completa |
| `/src/app/(portals)/ambiental/layout.tsx` | 🔴 P1 | Expandir metadata |
| `/src/app/(portals)/ambiental/blog/[slug]/page.tsx` | 🔴 P1 | Convertir a Server Component + metadata |
| `/src/app/(portals)/ia/(marketing)/herramientas/[slug]/page.tsx` | 🔴 P1 | Implementar metadata real |
| `/src/app/(portals)/ia/layout.tsx` | 🟡 P2 | Mejorar OG images |
| Todos los `<Image />` components | 🟡 P2 | Mejorar alt text |
| `/public/favicon.ico` | 🔴 P1 | Crear archivo |
| `/public/manifest.json` | 🔴 P1 | Crear archivo |
| `/public/images/og-image*.jpg` | 🔴 P1 | Crear archivos |
| `/next.config.mjs` | 🟡 P2 | Revisar CSP |

---

## PLANTILLAS DE ARCHIVOS A CREAR

### 1. `/public/manifest.json`

```json
{
  "name": "AquatechIA - Inteligencia Artificial y Gestión Ambiental",
  "short_name": "AquatechIA",
  "description": "Plataforma de inteligencia artificial para la gestión ambiental sostenible",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#00efff",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "64x64",
      "type": "image/x-icon"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/images/og-image.jpg",
      "sizes": "1200x630",
      "type": "image/jpeg",
      "form_factor": "wide"
    }
  ],
  "categories": ["education", "productivity"],
  "shortcuts": [
    {
      "name": "Portal IA",
      "short_name": "IA",
      "description": "Acceder al portal de inteligencia artificial",
      "url": "/ia",
      "icons": [{ "src": "/favicon.ico", "sizes": "64x64" }]
    },
    {
      "name": "Portal Ambiental",
      "short_name": "Ambiental",
      "description": "Acceder al portal de gestión ambiental",
      "url": "/ambiental",
      "icons": [{ "src": "/favicon.ico", "sizes": "64x64" }]
    }
  ]
}
```

### 2. Actualizar `next.config.mjs`

```javascript
// Cambiar contentSecurityPolicy para no bloquear imágenes
contentSecurityPolicy: "default-src 'self'; img-src 'self' https: data:; font-src 'self' https:;",
```

---

## CHECKLIST FINAL DE SEO

**Antes de lanzar cambios:**

- [ ] Todas las páginas tienen metadata
- [ ] Todas las páginas tienen canonical absoluta
- [ ] Todos los `<Image />` tienen alt text descriptivo
- [ ] Favicon e imágenes OG existen
- [ ] No hay páginas 404 en recursos estáticos
- [ ] Blog es Server Component, no Client
- [ ] Herramientas tienen metadata real
- [ ] Schema.org está completo (Organization, Website, BreadcrumbList, Article, Educational)
- [ ] robots.txt está actualizado
- [ ] sitemap.xml incluye todas las URLs
- [ ] No hay mixed content (http/https)
- [ ] URLs son consistentes
- [ ] Mobile responsive verificado
- [ ] Core Web Vitals optimizados (LCP, FID, CLS)
- [ ] Google Search Console configurado
- [ ] Analytics implementado

---

## LINKS Y RECURSOS ÚTILES

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org](https://schema.org/)
- [Structured Data Testing Tool](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Web.dev](https://web.dev/)

---

**Fin del Reporte - Próxima revisión recomendada: Enero 2025**

