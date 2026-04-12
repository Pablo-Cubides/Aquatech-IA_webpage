# Guía de Contribución de Artículos - Portal Ambiental

Esta guía establece los estándares para la creación, edición y publicación de artículos en el portal **Ambiental** de Aquatech IA. Seguir estos pasos asegura la consistencia visual, técnica y de rendimiento.

## 1. Estructura de Datos

Los artículos se gestionan en `apps/web/src/lib/new-ambiental-articles.ts`. Cada artículo es un objeto con la siguiente estructura:

```typescript
"slug-del-articulo": {
  slug: "slug-del-articulo",
  title: "Título profesional y atractivo",
  category: "Categoría (ej. Investigación y Casos de Estudio)",
  date: "YYYY-MM-DD",
  readTime: 10,
  excerpt: "Resumen corto para la tarjeta del blog.",
  heroImage: "/images/Portal ambiental/blog/nombre_imagen.png",
  author: {
    name: "Nombre del Autor",
    avatar: "/images/Portal ambiental/autor/Avatar.jpg",
    bio: "Breve biografía técnica.",
  },
  content: {
    introduction: "Texto introductorio. Admite **negrita** y *cursiva*.",
    sections: [
      {
        id: "id-seccion",
        title: "Título de la Sección",
        content: "Texto con formato enriquecido.",
        image: "/images/Portal ambiental/blog/imagen_seccion.png", // Opcional
        callout: { // Opcional
          type: "info" | "warning" | "success",
          title: "Título del Callout",
          content: "Contenido del aviso."
        }
      }
    ],
    conclusion: "Reflexión final y llamado a la acción."
  },
  tags: ["tag1", "tag2"],
  nextArticle: {
    slug: "slug-siguiente",
    title: "Título Siguiente"
  }
}
```

## 2. Estándares de Contenido

### Formato de Texto
- **Markdown**: El sistema soporta una implementación personalizada de Markdown.
  - `**Texto**` para **negrita**.
  - `*Texto*` para *cursiva*.
  - `\n\n` para saltos de párrafo.
- **Codificación**: Los archivos DEBEN guardarse con codificación **UTF-8** para que tildes y caracteres especiales (ñ, á, é, etc.) se rendericen correctamente.
- **Tono**: Profesional, científico y educativo.

### Imágenes
- **Calidad**: Usar imágenes de alta resolución (mínimo 1200px de ancho para Hero).
- **Ruta**: Guardar siempre en `apps/web/public/images/Portal ambiental/blog/`.
- **Nombres**: Usar `snake_case` (ej. `mi_nueva_imagen.png`).
- **Alt Text**: El slug y título se usan para accesibilidad, asegurar que sean descriptivos.

## 3. Proceso de Publicación

1.  **Preparar Activos**: Generar o seleccionar imágenes y guardarlas en la carpeta `public`.
2.  **Redactar**: Escribir el contenido siguiendo la estructura de secciones.
3.  **Insertar**: Agregar el nuevo objeto a `NEW_AMBIENTAL_ARTICLES`.
4.  **Verificar**:
    - Ejecutar `pnpm build` para asegurar que no hay errores de TypeScript.
    - Revisar visualmente el renderizado de negritas y caracteres especiales.

## 4. Mejores Prácticas de Diseño

- **Callouts**: Usar `warning` para riesgos técnicos (ej. bioacumulación) y `success` para recomendaciones prácticas.
- **Secciones**: Mantener los párrafos cortos (máximo 4-5 líneas) para mejorar la legibilidad móvil.
- **Tablas**: Se pueden usar tablas en formato Markdown dentro del campo `content` de una sección.

---
*Aquatech IA - Impulsando la soberanía hídrica con datos y ciencia.*
