# Guía de Contribución de Artículos - Portal Ambiental

Esta guía establece los estándares para agregar nuevos artículos al portal Ambiental de Aquatech-IA. Seguir estas reglas garantiza que el contenido se renderice correctamente, mantenga el diseño premium y sea SEO-friendly.

## 1. Estructura del Archivo
Los artículos se gestionan en `apps/web/src/lib/new-ambiental-articles.ts`. Cada artículo es una entrada en el objeto `NEW_AMBIENTAL_ARTICLES`.

### Plantilla de Datos
```typescript
"slug-del-articulo": {
  slug: "slug-del-articulo",
  title: "Título Impactante del Artículo",
  category: "Nombre de Categoría",
  date: "YYYY-MM-DD",
  readTime: 5, // Minutos estimados
  excerpt: "Breve resumen para las tarjetas del blog (150-200 caracteres).",
  heroImage: "/images/Portal ambiental/blog/nombre_imagen.png",
  author: {
    name: "Nombre del Autor",
    avatar: "/images/Portal ambiental/autor/Nombre.jpg",
    bio: "Breve descripción profesional del autor."
  },
  content: {
    introduction: "Texto introductorio. Soporta **negritas** y *cursivas*.",
    sections: [
      {
        id: "id-seccion",
        title: "Título de la Sección",
        content: "Cuerpo de la sección con soporte para listas (solo viñetas `-`) y enlaces.",
        image: "/images/Portal ambiental/blog/imagen_opcional.png", // Opcional
        callout: { // Opcional
          type: "info" | "warning",
          title: "Título del Callout",
          content: "Contenido destacado."
        }
      }
    ],
    conclusion: "Texto de cierre y llamado a la acción."
  },
  tags: ["tag1", "tag2"],
  nextArticle: { // Sugerencia de lectura
    slug: "slug-siguiente",
    title: "Título Siguiente"
  }
}
```

## 2. Estándares de Contenido

### Formateo (Markdown Seguro)
El portal utiliza una versión segura de Markdown. Solo se permiten:
- **Negritas**: `**texto**`
- *Cursivas*: `*texto*`
- **Enlaces**: `[título](url)`
- **Listas**: Usar viñetas `-` al inicio de la línea.
- **Saltos de línea**: Se respetan los saltos de línea simples.

> [!WARNING]
> No usar etiquetas HTML (como `<b>`, `<i>`) ni otros símbolos de Markdown complejos (como `> `, `# `, `## `) dentro de los campos de texto, a menos que sean títulos de sección.

### Codificación de Caracteres
**REGLA DE ORO:** El archivo DEBE guardarse con codificación **UTF-8**.
- Evita copiar y pegar texto de Word o fuentes externas que puedan incluir caracteres especiales mal codificados.
- Si ves caracteres extraños como `A3`, `A-a`, o `Ã³`, corrígelos manualmente a `ó`, `ía`, `ó`.

## 3. Guía de Imágenes

### Especificaciones Técnicas
- **Ubicación**: Guardar en `apps/web/public/images/Portal ambiental/blog/`.
- **Formato**: `.png` o `.webp` (preferido para web).
- **Dimensiones**:
    - **Hero Image**: 1200x630px (aspecto 1.91:1) para compatibilidad con redes sociales.
    - **Imágenes de sección**: Ancho mínimo de 800px.
- **Peso**: Máximo 300KB por imagen. Usa herramientas de compresión si es necesario.

### Estilo Visual
- Evita imágenes tipo "stock" genéricas con personas sonriendo a la cámara.
- Prioriza:
    - Fotografías de laboratorio reales o artísticas.
    - Paisajes industriales/naturales de alta calidad.
    - Microfotografía o macrofotografía de procesos químicos/biológicos.
    - Infografías limpias y minimalistas.

## 4. Proceso de Publicación
1. **Validación Local**: Antes de subir, revisa el archivo con el linter: `pnpm lint`.
2. **Generar Imágenes**: Usa herramientas de IA o bancos de imágenes premium (Unsplash de alta calidad) para los activos.
3. **Actualizar el Índice**: Asegúrate de que el slug sea único y esté correctamente exportado.
4. **Verificación de UI**: Revisa el artículo en `/ambiental/blog/[slug]` para confirmar que los saltos de línea y negritas se ven bien.

---
*Para soporte técnico sobre la estructura de datos, contactar al equipo de desarrollo de Aquatech-IA.*
