# Skill: Gestión Global de Imágenes y Activos Visuales

Esta "Skill" define la política estricta de manejo de medios, ubicaciones y herramientas de almacenamiento para todo el ecosistema de Aquatech-IA (Portal IA y Portal Ambiental).

## 1. Regla General de Almacenamiento (Vercel vs Cloudinary)

El proyecto utiliza una estrategia híbrida para no saturar el repositorio ni sobrepasar cuotas:

### A. Imágenes Base e Interfaz (Archivos Locales - Vercel)
Todas las imágenes que pertenecen al **Core** de la aplicación deben almacenarse localmente en `apps/web/public/images/...` y servirse desde Vercel. Esto incluye:
- Landing pages.
- Imágenes de **todas las herramientas** (actuales y futuras).
- Botones, logos, banners estáticos.
- Imágenes de los artículos fundacionales/iniciales que ya están en el código.

### B. Imágenes de Contenido Dinámico (Servicios Externos)
Todo contenido nuevo y frecuente que se añada al blog debe alojarse externamente.
- **Nuevos Artículos de Blog (Cualquier portal):** Las imágenes generadas por IA o recuperadas para ilustrar nuevos posts **DEBEN** subirse a **Cloudinary**. No se deben guardar en la carpeta `public/`.
- **Imágenes de Stock Libre:** Si la imagen no es de IA, usar URLs de **Unsplash**.

---

## 2. Definición Estricta de Autores (Avatares)

Los perfiles de autor son componentes inmutables del diseño base. **Bajo ninguna circunstancia** se debe inventar o usar otro enlace para la foto del autor principal (Pablo Cubides).

- **Portal Ambiental (Realismo):**
  `@/public/images/portal-ambiental/autor/pablo-cubides.jpg`
- **Portal IA (Moderno/PNG):**
  `@/public/images/portal-ia/autor/pablo-cubides.png`

---

## 3. Guía de Estilos por Portal

Si se generan imágenes con IA (ya sea para herramientas locales o nuevos blogs en Cloudinary), se deben respetar estrictamente las líneas de diseño:

### Portal IA
- **Estilo:** *Glassmorphism 3D premium*, colores acento de tecnología (morados, azules, vibrantes), aspecto inmersivo.
- **Formato:** Preferiblemente `.png` para transparencias si es una herramienta, o fondos renderizados oscuros si es hero de blog.

### Portal Ambiental
- **Estilo:** Realismo premium, fotografía de naturaleza de alta definición, macros de laboratorio o diagramas ambientales serios. Cero saturación exagerada.
- **Formato:** `.jpg` o `.webp`.

---

## 4. Control de Caché en Vercel
Cuando se actualiza una imagen local existente en la carpeta `public/` (ej. se reemplaza la imagen de una herramienta), los navegadores agresivamente mantienen la antigua en caché. 
- **Solución:** Añadir un parámetro de versión (`?v=2`, `?v=3`, etc.) en las rutas que referencien la imagen dentro del código TypeScript (`ia-tools.ts`, etc.) para forzar la actualización visual inmediata.
