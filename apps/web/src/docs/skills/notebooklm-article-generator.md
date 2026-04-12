# Skill: Generador de Artículos con NotebookLM (Automatizado)

Esta "Skill" define el proceso que debe seguir el asistente inteligente (Antigravity) para investigar, redactar e integrar artículos técnicos de alta calidad en el Portal Ambiental.

## Activador (Trigger)
> "Genera un artículo técnico sobre [TEMA] usando NotebookLM"

---

## Fase 1: Investigación y Curaduría (NotebookLM)
1.  **Creación de Notebook**: Crear un nuevo notebook con el nombre `Investigación: [TEMA]`.
2.  **Investigación Profunda**: 
    - Ejecutar `mcp_notebooklm_research_start` con `mode="deep"`.
    - Fuentes sugeridas: Web, manuales técnicos y legislación relevante.
    - *Fallback*: Si el MCP falla, usar `browser_subagent` para realizar la investigación en la UI de NotebookLM.
3.  **Importación**: Esperar a que la investigación termine e importar todas las fuentes útiles.

## Fase 2: Redacción en Studio
1.  **Generación de Borrador**: Usar `mcp_notebooklm_report_create` con formato `"Blog Post"`.
2.  **Análisis de Estilo**: El asistente debe asegurar que el borrador incluya:
    - Perspectiva ESG y AgTech.
    - Referencias a herramientas específicas (Open Source o Industriales).
    - Terminología técnica de ingeniería ambiental.

## Fase 3: Generación de Activos Visuales
1.  **Prompt de IA**: Usar `generate_image` para crear una `heroImage`.
2.  **Especificación**: Imagen estilo "Premium Engineering", minimalista, enfocada en el aspecto técnico del tema (ej. macrofotografía de agua, sensores, o mapas satelitales).
3.  **Localización**: Guardar en `apps/web/public/images/Portal ambiental/blog/` con un nombre representativo.

## Fase 4: Integración Técnica (TypeScript)
1.  **Mapeo de Datos**: Convertir el borrador al objeto `BlogArticle` para `new-ambiental-articles.ts`.
2.  **Slug Genuino**: Crear un slug descriptivo y único.
3.  **Formateo Seguro**: Usar `**bold**` y `*italic*` compatibles con el renderizador local.
4.  **Codificación**: Asegurar estrictamente la codificación **UTF-8**.

## Fase 5: Validación y Despliegue
1.  **Detección de Errores**: Ejecutar `pnpm lint --filter @ia-next/web`.
2.  **Build de Humo**: Ejecutar un build rápido si el linter pasa.
3.  **Publicación**: `git add .`, `git commit -m "feat: [TITLE] article via NotebookLM"`, y `git push origin main`.

---
*Esta skill garantiza que Aquatech-IA mantenga un liderazgo de pensamiento técnico sin intervención manual constante.*
