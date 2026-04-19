# Spec: Rutas, Importaciones y Contexto de Despliegue (Routing & Imports)

Esta especificación nace de los aprendizajes de depuración pasados en Vercel y Windows. Define las reglas inquebrantables para el manejo de archivos, rutas de Next.js y carga de activos.

## 1. El Problema de las Rutas con Paréntesis (Route Groups)
Next.js utiliza carpetas con paréntesis como `(portals)` o `(marketing)` para agrupar rutas lógicamente sin afectar la URL.
**Regla Estricta para scripts y la terminal:**
En Windows (PowerShell), los paréntesis son caracteres reservados. Si un Agente IA o script necesita manipular, añadir a Git (`git add`), o hacer lint de un archivo dentro de un Route Group, **la ruta entera DEBE estar envuelta en comillas simples**.
- ❌ `git add apps/web/src/app/(portals)/page.tsx` (ESTALLARÁ EN POWERSHELL)
- ✅ `git add 'apps/web/src/app/(portals)/page.tsx'`

## 2. Sensibilidad a Mayúsculas/Minúsculas en Vercel
OSX y Windows no distinguen mayúsculas/minúsculas, pero **Linux (el SO subyacente de Vercel) SÍ lo hace**.
**Regla:** Todos los nombres de archivos, carpetas, extensiones y atributos `src` de imágenes **DEBEN** estar estrictamente en `kebab-case` o minúsculas en el código base, y coincidir 100% caracter por caracter.
- ❌ Importar `Component.tsx` como `import Component from './component'` romperá Vercel, aunque funcione localmente.

## 3. Alias de Importación Exclusivos
Jamás usar importaciones relativas profundas tipo `../../../../../lib/utils`.
- Usar SIEMPRE el alias configurado en Next.js: `@/`
- Ej: `import { IA_TOOLS } from "@/lib/ia-tools"`
Esto previene roturas si un componente cambia de jerarquía en los Route Groups.

## 4. Cache-Busting de Imágenes Hardcoded
Dado que Next.js y los navegadores cachean estáticamente los activos de `/public`, si se sobrescribe una imagen (ej. el logo de una herramienta), el código que la invoca DEBE mutar.
- **Técnica Obligatoria ('Cache-Busting'):** Al actualizar una imagen existente, alterar el renderizado añadiendo o incrementando el query de versión: `src="/images/logo.png?v=2"`. Nunca dejar imágenes viejas "harcodeadas" huérfanas en los componentes.
