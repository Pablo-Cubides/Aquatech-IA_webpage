# 📝 GUÍA DE IMPLEMENTACIÓN - CORRECCIONES SEO

## CAMBIOS YA REALIZADOS ✅

Los siguientes cambios ya han sido implementados automáticamente:

### 1. Archivo: `/public/manifest.json`
- ✅ Creado con configuración PWA completa
- ✅ Incluye iconos, shortcuts, categorías

### 2. Archivo: `/src/app/page.tsx`
- ✅ Metadata completa con Open Graph
- ✅ Twitter Card configurada
- ✅ Keywords expandidos
- ✅ Canonical URL absoluta

### 3. Archivo: `/src/app/(portals)/ambiental/layout.tsx`
- ✅ Metadata expandida y mejorada
- ✅ Keywords específicas para portal ambiental
- ✅ Open Graph con imagen específica
- ✅ Canonical absoluta

### 4. Archivo: `/src/app/(portals)/ia/layout.tsx`
- ✅ Metadata completa y mejorada
- ✅ Keywords para portal IA
- ✅ Open Graph con imagen específica
- ✅ Canonical absoluta

### 5. Archivo: `/src/app/(portals)/ia/(marketing)/herramientas/[slug]/page.tsx`
- ✅ Mejorada metadata dinámica
- ✅ Estructura para params async
- ✅ generateStaticParams placeholder
- ✅ Metadata completa con Open Graph

### 6. Archivo: `/next.config.mjs`
- ✅ Actualizado contentDispositionType a "inline"
- ✅ CSP mejorada para permitir imágenes
- ✅ Configuración de seguridad ajustada

### 7. Archivo: `/src/app/layout.tsx`
- ✅ Agregado manifest.json a metadata

---

## TAREAS PENDIENTES 🔴

### CRÍTICO - DEBE HACERSE INMEDIATAMENTE

#### 1. ❗ CREAR IMÁGENES OG Y FAVICON

**Archivos faltantes:**
- `/public/images/og-image.jpg` (1200x630 px)
- `/public/images/og-image-ia.jpg` (1200x630 px, tema oscuro)
- `/public/images/og-image-ambiental.jpg` (1200x630 px, tema claro)
- `/public/favicon.ico` (64x64 px, múltiples tamaños)
- `/public/apple-touch-icon.png` (180x180 px)

**Por qué es crítico:**
- Sin estas imágenes, las redes sociales no mostrarán preview
- Sin favicon, hay errores 404 en cada página
- Afecta percepción de profesionalismo

**Instrucciones:**
1. Usar Figma/Canva/Photoshop para crear:
   - Logo AquatechIA
   - Colores: Negro/Cian para IA, Blanco/Verde para Ambiental
   - Tamaño exacto: 1200x630 px
   - Formato: JPEG (optimizado < 100KB)

2. Para favicon:
   - Exportar logo en ICO format (64x64, 128x128, 256x256)
   - También PNG para apple-touch-icon (180x180)

**Herramientas gratuitas:**
- https://favicon.io/
- https://convertio.co/
- https://ezgif.com/

---

#### 2. ❗ ARREGLAR BLOG AMBIENTAL (use client → Server Component)

**Archivo:** `/src/app/(portals)/ambiental/(marketing)/blog/[slug]/page.tsx`

**Problema actual:** 
```tsx
"use client";  // ❌ NO TIENE METADATA
const ARTICLE_DATA = { ... };  // ❌ HARDCODEADO
```

**Tareas:**

1. **Remover "use client"** del inicio del archivo
   ```tsx
   // ❌ ELIMINAR ESTA LÍNEA
   "use client";
   ```

2. **Crear función para obtener artículos dinámicamente**
   
   Opción A - Si tienes BD (recomendado):
   ```tsx
   async function getArticleBySlug(portal: string, slug: string) {
     const article = await db.articles.findFirst({
       where: { slug, portal }
     });
     return article;
   }
   ```

   Opción B - Si usas archivos MDX:
   ```tsx
   import { promises as fs } from "fs";
   import path from "path";
   
   async function getArticleBySlug(portal: string, slug: string) {
     const articlesDir = path.join(process.cwd(), "content", portal, "articles");
     const content = await fs.readFile(
       path.join(articlesDir, `${slug}.mdx`),
       "utf8"
     );
     return parseMDX(content);
   }
   ```

3. **Agregar generateMetadata async**
   ```tsx
   export async function generateMetadata({ 
     params 
   }: Props): Promise<Metadata> {
     const { slug } = await params;
     const article = await getArticleBySlug("ambiental", slug);
     
     if (!article) {
       return { title: "Artículo no encontrado" };
     }
     
     const canonicalUrl = `${baseUrl}/ambiental/blog/${slug}`;
     
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
   ```

4. **Agregar Article JSON-LD Schema**
   ```tsx
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
         dateModified: article.dateModified || article.date,
         author: {
           "@type": "Person",
           name: article.author.name,
         },
         publisher: {
           "@type": "Organization",
           name: "AquatechIA",
           logo: {
             "@type": "ImageObject",
             url: `${baseUrl}/images/logo.png`,
           },
         },
       }),
     }}
   />
   ```

5. **Reemplazar datos hardcodeados con datos reales**
   ```tsx
   // ❌ REEMPLAZAR ESTO:
   const ARTICLE_DATA: BlogArticle = { ... };
   
   // ✅ CON ESTO:
   const article = await getArticleBySlug("ambiental", slug);
   if (!article) notFound();
   ```

---

#### 3. ❗ SIMILAR: ARREGLAR BLOG IA

**Archivo:** `/src/app/(portals)/ia/(marketing)/blog/[slug]/page.tsx`

Aplicar exactamente el mismo procedimiento que en #2 anterior.

---

#### 4. ⚠️ MEJORAR ATRIBUTOS ALT EN IMÁGENES

**Archivos a revisar:**

- [ ] `/src/app/page.tsx`
- [ ] `/src/app/(portals)/ia/page.tsx`
- [ ] `/src/app/(portals)/ambiental/page.tsx`
- [ ] Todos los componentes en `/src/components/`

**Buscar y reemplazar patrones:**

```tsx
// ❌ MALO - Genérico
alt="Aquatech IA"
alt="Imagen"
alt="Logo"
alt="Portal"

// ✅ BUENO - Descriptivo y SEO
alt="Logo de AquatechIA - Plataforma de inteligencia artificial y gestión ambiental"
alt="Portal de inteligencia artificial con herramientas educativas"
alt="Visualización de herramientas de gestión ambiental sostenible"
alt="Mapa interactivo de análisis ambiental"
alt="Gráfico de monitoreo de calidad del agua"
```

**Checklist por página:**

- [ ] `/page.tsx`:
  - Logo: `"Logo de AquatechIA - IA + Gestión Ambiental"`
  - Technology hero: `"Visualización de inteligencia artificial para gestión ambiental"`
  - Mountains hero: `"Paisaje natural - Gestión ambiental sostenible"`

- [ ] `/ia/page.tsx`:
  - Todas las imágenes con alt descriptivos
  - Incluir palabras clave relevantes

- [ ] `/ambiental/page.tsx`:
  - Similar a portal IA

---

#### 5. ⚠️ IMPLEMENTAR HERRAMIENTAS DINÁMICAS REALES

**Archivos afectados:**
- `/src/app/(portals)/ia/(marketing)/herramientas/[slug]/page.tsx`
- `/src/app/(portals)/ambiental/(marketing)/herramientas/[slug]/page.tsx`

**TODO pendientes en el código:**

```tsx
// 1. Crear/completar tools-registry
export function getToolBySlug(portal: "ia" | "ambiental", slug: string) {
  // Implementar búsqueda real
}

// 2. Implementar getToolsByPortal
export function getToolsByPortal(portal: "ia" | "ambiental") {
  // Retornar todas las herramientas del portal
}

// 3. Validar slug existe
const tool = getToolBySlug("ia", slug);
if (!tool) notFound();

// 4. Renderizar iframe/componente real
// En lugar de solo div con h1
```

**Estructura esperada de tool:**
```typescript
interface Tool {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  keywords: string[];
  image: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  iframeUrl?: string;
  componentPath?: string;
  author: string;
  dateCreated: string;
  dateUpdated: string;
}
```

---

### MODERADO - IMPORTANTE PERO PUEDE ESPERAR UNA SEMANA

#### M1. Revisar y standardizar URLs

**Cambios necesarios:**
- [ ] Verificar que no hay `/productos` duplicado de `/herramientas`
- [ ] Verificar que no hay `/perfil` duplicado de `/autor`
- [ ] Agregar redirects en next.config.mjs si es necesario

```javascript
async redirects() {
  return [
    // ... redirects existentes ...
    {
      source: "/ia/productos",
      destination: "/ia/herramientas",
      permanent: true,
    },
    {
      source: "/ia/perfil",
      destination: "/ia/autor",
      permanent: true,
    },
    {
      source: "/ambiental/productos",
      destination: "/ambiental/herramientas",
      permanent: true,
    },
    {
      source: "/ambiental/perfil",
      destination: "/ambiental/autor",
      permanent: true,
    },
  ];
}
```

#### M2. Agregar noindex a páginas privadas

**Agregar a páginas que no deberían indexarse:**

```tsx
export const metadata: Metadata = {
  robots: "noindex, nofollow",
  // ... resto de metadata
};
```

**Páginas candidatas:**
- `/api/*` (si tienen rutas públicas)
- `/admin/*` (si existen)
- `/dashboard/*` (páginas privadas de usuario)
- Páginas de búsqueda de resultados

#### M3. Implementar búsqueda real

Actualmente en layout.tsx hay:
```tsx
urlTemplate: `${baseUrl}/buscar?q={search_term_string}`,
```

**Pero `/buscar` no existe. Opciones:**

1. Crear ruta `/buscar` real
2. O cambiar a una ruta existente como blog:
   ```tsx
   urlTemplate: `${baseUrl}/ia/blog?search={search_term_string}`,
   ```

---

### OPCIONAL - NICE TO HAVE

#### O1. Agregar FAQ Schema

En `layout.tsx`, agregar:

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
        "text": "AquatechIA es una plataforma educativa de inteligencia artificial aplicada a la gestión ambiental sostenible..."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuáles son los portales disponibles?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tenemos dos portales principales: Portal IA (modelos generativos, LLM, educación) y Portal Ambiental (gestión ambiental, normatividad, herramientas)..."
      }
    },
    // ... agregar más FAQs
  ]
};
```

#### O2. Configurar Google Analytics

```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

// En layout.tsx, dentro del return:
<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

#### O3. Agregar hreflang si hay versión en inglés

```tsx
// Si existe versión en inglés
alternates: {
  languages: {
    "en": "https://aquatechia.com/en",
    "es": "https://aquatechia.com/es",
    "x-default": "https://aquatechia.com"
  }
}
```

#### O4. Mejorar Breadcrumb dinámico

En cada página, incluir breadcrumb específico en lugar del genérico del layout.

---

## VERIFICACIÓN DESPUÉS DE IMPLEMENTAR

### 1. Testing Local
```bash
npm run build
npm run start
```

Verificar que no haya errores de compilación.

### 2. Verificar metadatos en navegador

Abrir Inspector (F12) → Elements, verificar:
- [ ] `<title>` correcto
- [ ] `<meta name="description">` presente
- [ ] `<meta property="og:image">` apunta a imagen real
- [ ] `<link rel="canonical">` correcto
- [ ] `<link rel="manifest">` apunta a `/manifest.json`
- [ ] Schema JSON-LD válido

### 3. Herramientas Google

- [ ] https://search.google.com/test/rich-results
  - Validar que todos los schemas sean válidos
  
- [ ] https://pagespeed.web.dev/
  - Verificar Core Web Vitals
  - Verificar que no haya errores de recursos

- [ ] https://search.google.com/test/mobile-friendly
  - Verificar responsive design

### 4. OpenGraph tester

- [ ] https://www.opengraph.xyz/
  - Copiar URL de página
  - Verificar que imagen OG se muestre correctamente

### 5. Deploy a Staging

Una vez validado:
1. Push cambios a rama `staging` o `develop`
2. Desplegar a URL de staging
3. Realizar testing final
4. Merge a `main`

---

## CHECKLIST FINAL

Antes de considerar SEO completo, verificar:

- [ ] ✅ manifest.json creado y funcionando
- [ ] ✅ Favicon e imágenes OG creadas y optimizadas
- [ ] ✅ Metadata en página principal completa
- [ ] ✅ Metadata en portales completa
- [ ] ✅ Blog ambiental es Server Component con metadata
- [ ] ✅ Blog IA es Server Component con metadata
- [ ] ✅ Herramientas IA con metadata real
- [ ] ✅ Herramientas Ambiental con metadata real
- [ ] ✅ Atributos alt mejorados en todas las imágenes
- [ ] ✅ No hay errores en consola del navegador
- [ ] ✅ All schemas válidos (Rich Results Test)
- [ ] ✅ Core Web Vitals OK (PageSpeed)
- [ ] ✅ Mobile friendly (Mobile Friendly Test)
- [ ] ✅ OpenGraph previews correctos
- [ ] ✅ Google Search Console conectado
- [ ] ✅ Sitemap.xml accesible y válido
- [ ] ✅ Robots.txt accesible y correcto

---

## CONTACTO Y SOPORTE

Si tienes dudas sobre cualquier tarea:
1. Revisar la sección específica en `SEO_AUDIT_REPORT.md`
2. Consultar documentación de Next.js: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
3. Revisar ejemplos de Schema.org: https://schema.org/

---

**¡Excelente! Una vez completes estas tareas, tu sitio estará optimizado para SEO! 🚀**

