# 📚 CÓDIGO DE REFERENCIA - SNIPPETS PARA COPIAR Y PEGAR

Este documento contiene fragmentos de código listos para usar en la implementación.

---

## 1. ESTRUCTURA DE TOOL (PARA tools-registry)

```typescript
// src/lib/services/tools-registry.ts

export interface Tool {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  image: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  iframeUrl?: string;
  componentPath?: string;
  author: string;
  dateCreated: string;
  dateUpdated: string;
  tags: string[];
}

export const IA_TOOLS: Tool[] = [
  {
    slug: "parametros-decodificacion",
    name: "Parámetros de Decodificación",
    description: "Aplicación interactiva para entender parámetros de LLM como temperature, top_k y top_p",
    keywords: [
      "LLM",
      "parámetros",
      "temperature",
      "sampling",
      "modelos de lenguaje",
    ],
    image: "/images/tools/parametros-decodificacion.jpg",
    category: "Educativo",
    difficulty: "intermediate",
    iframeUrl: "/ia/herramientas/parametros-decodificacion",
    author: "AquatechIA",
    dateCreated: "2024-01-01",
    dateUpdated: "2024-12-07",
    tags: ["LLM", "IA educativa", "interactive"],
  },
  {
    slug: "como-funcionan-llm",
    name: "Cómo Funcionan los LLM",
    description: "Guía interactiva paso a paso sobre cómo funcionan los modelos de lenguaje",
    keywords: ["LLM", "tokenización", "embeddings", "atención", "transformers"],
    image: "/images/tools/como-funcionan-llm.jpg",
    category: "Educativo",
    difficulty: "beginner",
    iframeUrl: "/ia/herramientas/como-funcionan-llm",
    author: "AquatechIA",
    dateCreated: "2024-01-15",
    dateUpdated: "2024-12-07",
    tags: ["LLM", "educación", "fundamentos"],
  },
  // ... agregar más herramientas
];

export const AMBIENTAL_TOOLS: Tool[] = [
  {
    slug: "visor-mapas-ambientales",
    name: "Visor de Mapas Ambientales",
    description: "Herramienta interactiva para visualizar datos ambientales geoespaciales",
    keywords: [
      "mapas",
      "geoespacial",
      "visualización",
      "datos ambientales",
      "GIS",
    ],
    image: "/images/tools/mapas.jpg",
    category: "Herramientas",
    difficulty: "beginner",
    iframeUrl: "/ambiental/herramientas/visor-mapas-ambientales",
    author: "AquatechIA",
    dateCreated: "2024-02-01",
    dateUpdated: "2024-12-07",
    tags: ["mapas", "geoespacial", "interactivo"],
  },
  // ... agregar más herramientas
];

export function getToolsByPortal(
  portal: "ia" | "ambiental"
): Tool[] {
  if (portal === "ia") {
    return IA_TOOLS;
  } else {
    return AMBIENTAL_TOOLS;
  }
}

export function getToolBySlug(
  portal: "ia" | "ambiental",
  slug: string
): Tool | undefined {
  const tools = getToolsByPortal(portal);
  return tools.find((tool) => tool.slug === slug);
}
```

---

## 2. ESTRUCTURA DE ARTICLE (PARA blog)

```typescript
// src/lib/types/article.ts

export interface Article {
  slug: string;
  title: string;
  category: string;
  date: string;
  dateModified?: string;
  readTime: number;
  excerpt: string;
  heroImage: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  content: string; // o HTMLContent si lo tienes procesado
  tags: string[];
  keywords: string[];
  nextArticle?: {
    slug: string;
    title: string;
  };
}
```

```typescript
// src/lib/services/articles.ts

const AMBIENTAL_ARTICLES: Article[] = [
  {
    slug: "plan-restauracion-hidrica-2030",
    title: "Plan de restauración hídrica 2030: métricas accionables para un futuro sostenible",
    category: "Políticas Ambientales",
    date: "2024-09-10",
    dateModified: "2024-12-07",
    readTime: 12,
    excerpt: "Cómo priorizar cuencas y definir indicadores claros para medir avances en restauración hídrica a gran escala.",
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Dra. Elena Vance",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
      bio: "Especialista en gestión de recursos hídricos con más de 15 años de experiencia.",
    },
    content: "Artículo completo aquí...",
    tags: ["agua", "política", "sostenibilidad", "gestión hídrica"],
    keywords: [
      "restauración hídrica",
      "cuencas hidrográficas",
      "gestión del agua",
      "sostenibilidad",
    ],
    nextArticle: {
      slug: "siguiente-articulo",
      title: "Título del siguiente artículo",
    },
  },
  // ... más artículos
];

export async function getArticleBySlug(
  portal: "ia" | "ambiental",
  slug: string
): Promise<Article | null> {
  // Si usas BD:
  // return db.articles.findFirst({ where: { slug, portal } });

  // Si usas archivos locales:
  const articles = portal === "ambiental" ? AMBIENTAL_ARTICLES : IA_ARTICLES;
  return articles.find((a) => a.slug === slug) || null;
}

export async function getAllArticles(portal: "ia" | "ambiental"): Promise<Article[]> {
  return portal === "ambiental" ? AMBIENTAL_ARTICLES : IA_ARTICLES;
}
```

---

## 3. BLOG DINÁMICO - ESTRUCTURA COMPLETA

```tsx
// src/app/(portals)/ambiental/(marketing)/blog/[slug]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { getArticleBySlug, getAllArticles } from "@/lib/services/articles";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com";

interface Props {
  params: Promise<{ slug: string }>;
}

// Para estaticidad, generar paths
export async function generateStaticParams() {
  const articles = await getAllArticles("ambiental");
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Metadata dinámica
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("ambiental", slug);

  if (!article) {
    return { title: "Artículo no encontrado" };
  }

  const canonicalUrl = `${baseUrl}/ambiental/blog/${slug}`;

  return {
    title: `${article.title} | Blog Ambiental | AquatechIA`,
    description: article.excerpt,
    keywords: article.keywords,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.dateModified || article.date,
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
      siteName: "AquatechIA",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.heroImage],
      creator: "@aquatechia",
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug("ambiental", slug);

  if (!article) {
    notFound();
  }

  // Article JSON-LD Schema
  const articleSchema = {
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
        width: 250,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/ambiental/blog/${slug}`,
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portal Ambiental",
        item: `${baseUrl}/ambiental`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Blog",
        item: `${baseUrl}/ambiental/blog`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: `${baseUrl}/ambiental/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Schemas */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumbs visibles */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          {" / "}
          <Link href="/ambiental" className="hover:underline">
            Ambiental
          </Link>
          {" / "}
          <Link href="/ambiental/blog" className="hover:underline">
            Blog
          </Link>
          {" / "}
          <span>{article.title}</span>
        </nav>

        {/* Hero Image */}
        <Image
          src={article.heroImage}
          alt={article.title}
          width={1200}
          height={630}
          className="w-full h-auto rounded-lg mb-8"
          priority
        />

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-4 mb-4 text-gray-600">
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{article.author.name}</p>
              <p className="text-sm">
                {new Date(article.date).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {" · "}
                {article.readTime} min lectura
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="prose max-w-none mb-12">
          {/* Si es HTML string */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
          
          {/* O si renderizas componentes React */}
          {/* {article.content} */}
        </div>

        {/* Next Article Link */}
        {article.nextArticle && (
          <div className="border-t pt-8">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              SIGUIENTE ARTÍCULO
            </h3>
            <Link
              href={`/ambiental/blog/${article.nextArticle.slug}`}
              className="text-2xl font-bold hover:text-green-600 transition"
            >
              {article.nextArticle.title}
            </Link>
          </div>
        )}
      </article>
    </>
  );
}
```

---

## 4. HERRAMIENTAS DINÁMICAS - ESTRUCTURA COMPLETA

```tsx
// src/app/(portals)/ia/(marketing)/herramientas/[slug]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { getToolBySlug, getToolsByPortal } from "@/lib/services/tools-registry";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generar rutas estáticas
export async function generateStaticParams() {
  const iaTools = getToolsByPortal("ia");
  return iaTools.map((tool) => ({
    slug: tool.slug,
  }));
}

// Metadata dinámica
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug("ia", slug);

  if (!tool) {
    return { title: "Herramienta no encontrada" };
  }

  const canonicalUrl = `${baseUrl}/ia/herramientas/${slug}`;

  return {
    title: `${tool.name} | Herramientas IA | AquatechIA`,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: tool.name,
      description: tool.description,
      type: "website",
      locale: "es_ES",
      images: [
        {
          url: tool.image || `${baseUrl}/images/og-image-ia.jpg`,
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
      url: canonicalUrl,
      siteName: "AquatechIA",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.name,
      description: tool.description,
      images: [tool.image || `${baseUrl}/images/og-image-ia.jpg`],
      creator: "@aquatechia",
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug("ia", slug);

  if (!tool) {
    notFound();
  }

  // EducationalWebApplication Schema
  const educationalSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalWebApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "EducationalApplication",
    learningResourceType: "Interactive Tool",
    educationalLevel: [
      "Beginner",
      "Intermediate",
      "Advanced",
    ][["beginner", "intermediate", "advanced"].indexOf(tool.difficulty)],
    url: `${baseUrl}/ia/herramientas/${slug}`,
    image: tool.image || `${baseUrl}/images/og-image-ia.jpg`,
    author: {
      "@type": "Organization",
      name: "AquatechIA",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "AquatechIA",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.png`,
      },
    },
    inLanguage: "es-ES",
    teaches: tool.keywords,
    dateCreated: tool.dateCreated,
    dateModified: tool.dateUpdated,
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portal IA",
        item: `${baseUrl}/ia`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Herramientas",
        item: `${baseUrl}/ia/herramientas`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: tool.name,
        item: `${baseUrl}/ia/herramientas/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Schemas */}
      <Script
        id="educational-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-black text-white">
        {/* Breadcrumbs */}
        <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-cyan-400">
          <a href="/" className="hover:underline">
            Inicio
          </a>
          {" / "}
          <a href="/ia" className="hover:underline">
            IA
          </a>
          {" / "}
          <a href="/ia/herramientas" className="hover:underline">
            Herramientas
          </a>
          {" / "}
          <span>{tool.name}</span>
        </nav>

        {/* Tool Header */}
        <header className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold mb-4">{tool.name}</h1>
          <p className="text-xl text-gray-300 mb-6">{tool.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-cyan-900 px-3 py-1 rounded">
              {tool.category}
            </span>
            <span className="bg-gray-900 px-3 py-1 rounded">
              Dificultad: {tool.difficulty}
            </span>
            <span className="bg-gray-900 px-3 py-1 rounded">
              {tool.readTime || "Tiempo variable"}
            </span>
          </div>
        </header>

        {/* Tool Content/Iframe */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          {tool.iframeUrl ? (
            <iframe
              src={tool.iframeUrl}
              className="w-full h-[800px] rounded-lg border border-cyan-500"
              title={tool.name}
              allowFullScreen
            />
          ) : (
            <div className="bg-gray-900 rounded-lg p-12 text-center">
              <p className="text-gray-400">
                Herramienta disponible próximamente
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
```

---

## 5. ARTICLE JSON-LD COMPLETO

```typescript
// Para reutilizar en múltiples lugares
export function generateArticleSchema(baseUrl: string, article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${baseUrl}/ambiental/blog/${article.slug}`,
    isPartOf: {
      "@id": `${baseUrl}/ambiental/blog`,
    },
    author: {
      "@type": "Person",
      name: article.author.name,
      url: article.author.url || baseUrl,
    },
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.dateModified || article.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/ambiental/blog/${article.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "AquatechIA",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.png`,
        width: 250,
        height: 60,
      },
    },
    image: {
      "@type": "ImageObject",
      url: article.heroImage,
      width: 1200,
      height: 630,
    },
    articleBody: article.content,
    keywords: article.keywords.join(", "),
    articleSection: article.category,
    inLanguage: "es-ES",
  };
}
```

---

## 6. FAQ SCHEMA (OPCIONAL)

```typescript
export function generateFAQSchema(baseUrl: string, faqs: Array<{question: string, answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq, index) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Uso en layout.tsx:
const FAQS = [
  {
    question: "¿Qué es AquatechIA?",
    answer: "AquatechIA es una plataforma educativa de inteligencia artificial aplicada a la gestión ambiental sostenible...",
  },
  {
    question: "¿Cuáles son los portales disponibles?",
    answer: "Tenemos dos portales: Portal IA y Portal Ambiental...",
  },
  // ... más FAQs
];

<Script
  id="faq-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(generateFAQSchema(baseUrl, FAQS)),
  }}
/>
```

---

## 7. MEJORA DE IMAGEN ALT - FUNCIÓN HELPER

```tsx
// src/lib/seo/image-alts.ts

export const IMAGE_ALTS = {
  logo: "Logo de AquatechIA - Plataforma de inteligencia artificial y gestión ambiental sostenible",
  technologyHero: "Visualización de inteligencia artificial y algoritmos para gestión ambiental",
  mountainsHero: "Paisaje natural - Gestión ambiental y sostenibilidad",
  portal: {
    ia: "Portal de inteligencia artificial con herramientas educativas",
    ambiental: "Portal de gestión ambiental con mapas y herramientas interactivas",
  },
  tools: {
    llm: "Visualización de Large Language Models",
    maps: "Mapas interactivos de análisis ambiental",
  },
} as const;

// Uso en componentes:
<Image
  src="/images/logo.png"
  alt={IMAGE_ALTS.logo}
  width={100}
  height={100}
/>
```

---

## 8. HERRAMIENTAS DE VALIDACIÓN (SCRIPTS)

```bash
#!/bin/bash
# validate-seo.sh

echo "🔍 Validando SEO..."

# 1. Verificar que /next build compila
echo "✓ Compilando proyecto..."
npm run build || { echo "❌ Build falló"; exit 1; }

# 2. Verificar archivos críticos
echo "✓ Verificando archivos..."
[ -f "public/favicon.ico" ] && echo "  ✅ favicon.ico existe" || echo "  ❌ favicon.ico falta"
[ -f "public/manifest.json" ] && echo "  ✅ manifest.json existe" || echo "  ❌ manifest.json falta"
[ -f "public/images/og-image.jpg" ] && echo "  ✅ og-image.jpg existe" || echo "  ❌ og-image.jpg falta"
[ -f "public/images/og-image-ia.jpg" ] && echo "  ✅ og-image-ia.jpg existe" || echo "  ❌ og-image-ia.jpg falta"
[ -f "public/images/og-image-ambiental.jpg" ] && echo "  ✅ og-image-ambiental.jpg existe" || echo "  ❌ og-image-ambiental.jpg falta"

# 3. Verificar uso de "use client" en blog pages (no debería haber)
echo "✓ Verificando 'use client' en blog pages..."
COUNT=$(grep -r '"use client"' apps/web/src/app/\(portals\)/*/\(marketing\)/blog/\[slug\]/page.tsx 2>/dev/null | wc -l)
if [ $COUNT -eq 0 ]; then
  echo "  ✅ No hay 'use client' en blog pages"
else
  echo "  ❌ Encontrados $COUNT archivos con 'use client' en blog pages"
fi

echo "✅ Validación completada"
```

---

**¡Estos snippets son listos para copiar y pegar! Solo reemplaza los valores con tus datos reales.**

