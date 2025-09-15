# Gestión de Artículos del Blog

Este sistema permite gestionar fácilmente los artículos de blog para ambos portales (IA y Ambiental) desde un único archivo de configuración.

## 📁 Archivo Principal

**`src/lib/blog-articles.ts`** - Contiene toda la configuración de artículos

## 🔧 Cómo Agregar un Nuevo Artículo

### Paso 1: Editar el archivo de configuración

1. Abre `src/lib/blog-articles.ts`
2. Encuentra la constante apropiada:
   - `AMBIENTAL_ARTICLES` para artículos ambientales
   - `IA_ARTICLES` para artículos de IA

### Paso 2: Agregar el nuevo artículo

```typescript
"mi-nuevo-articulo": {
  slug: "mi-nuevo-articulo",
  title: "Título de mi artículo",
  category: "Categoría",
  date: "2024-12-01", // Formato YYYY-MM-DD
  readTime: 8, // Tiempo de lectura en minutos
  excerpt: "Descripción breve del artículo...",
  heroImage: "https://images.unsplash.com/...", // URL de imagen
  author: {
    name: "Nombre del Autor",
    avatar: "https://images.unsplash.com/...", // URL del avatar
    bio: "Biografía opcional del autor"
  },
  content: {
    introduction: "Párrafo introductorio...",
    sections: [
      {
        id: "seccion-1",
        title: "Título de la Sección",
        content: "Contenido de la sección...",
        image: "https://images.unsplash.com/...", // Opcional
        callout: { // Opcional
          type: "info", // "info", "warning", "success"
          title: "Título del callout",
          content: "Contenido del callout"
        },
        subsections: [ // Opcional
          {
            id: "subseccion-1",
            title: "Título de la Subsección",
            content: "Contenido de la subsección..."
          }
        ]
      }
    ],
    conclusion: "Párrafo de conclusión..." // Opcional
  },
  tags: ["Tag1", "Tag2", "Tag3"],
  nextArticle: { // Opcional
    slug: "siguiente-articulo",
    title: "Título del siguiente artículo"
  }
}
```

## 🎨 Categorías Disponibles

### Portal Ambiental

- Políticas Ambientales
- Gestión Hídrica
- Sostenibilidad
- Conservación
- Tecnología Verde

### Portal IA

- Machine Learning
- Computer Vision
- Deep Learning
- Generative AI
- Data Science

## 🖼️ Imágenes

Para las imágenes, puedes usar:

1. **Unsplash** (recomendado para desarrollo):

   ```
   https://images.unsplash.com/photo-ID?auto=format&fit=crop&w=1600&q=80
   ```

2. **Imágenes propias** (en producción):
   - Coloca las imágenes en `public/images/blog/`
   - Usa rutas como `/images/blog/mi-imagen.jpg`

## 📝 Formato del Contenido

### Párrafos Múltiples

Para párrafos múltiples, usa saltos de línea (`\n`):

```typescript
content: "Primer párrafo.\n\nSegundo párrafo.\n\nTercer párrafo.";
```

### Listas

Para listas con viñetas:

```typescript
content: "• Elemento 1\n• Elemento 2\n• Elemento 3";
```

### Callouts

Los callouts son cajas destacadas con 3 tipos:

- `info` (azul) - Para información adicional
- `warning` (naranja) - Para advertencias o puntos importantes
- `success` (verde) - Para consejos o resultados positivos

## 🔄 Tabla de Contenidos Automática

El sistema genera automáticamente:

- Tabla de contenidos en el sidebar
- Enlaces de navegación interna
- Numeración automática de secciones

## 📱 URLs de los Artículos

Las URLs se generan automáticamente:

- Portal Ambiental: `/ambiental/blog/[slug]`
- Portal IA: `/ia/blog/[slug]`

## 🏷️ Tags y SEO

- **Tags**: Se muestran como etiquetas al final del artículo
- **SEO**: El título y excerpt se usan para meta tags automáticamente
- **OG Images**: La heroImage se usa para redes sociales

## 🔗 Navegación Entre Artículos

Para vincular artículos usa `nextArticle`:

```typescript
nextArticle: {
  slug: "slug-del-siguiente-articulo",
  title: "Título que aparecerá en el link"
}
```

## ⚡ Funciones Helper Disponibles

- `getArticle(portal, slug)` - Obtiene un artículo específico
- `getAllArticles(portal)` - Obtiene todos los artículos de un portal
- `generateTOC(sections)` - Genera tabla de contenidos

## 🎯 Mejores Prácticas

1. **Slugs únicos**: Cada slug debe ser único dentro de su portal
2. **Fechas recientes**: Usa fechas realistas para el orden cronológico
3. **Tiempo de lectura**: Calcula aproximadamente 200 palabras por minuto
4. **Excerpts atractivos**: Máximo 2-3 líneas, que enganchen al lector
5. **Tags relevantes**: 3-5 tags por artículo, específicos y útiles
6. **Imágenes optimizadas**: Usa parámetros de Unsplash para optimizar carga

## 🚀 Desarrollo Futuro

Este sistema puede expandirse fácilmente para:

- Integración con CMS headless (Strapi, Contentful)
- Soporte para Markdown
- Sistema de comentarios
- Analytics de lectura
- Búsqueda avanzada
- Categorías dinámicas
