# Spec: UI / UX & Design System

Esta especificación dicta las reglas visuales estandarizadas para el desarrollo de nuevas interfaces en el proyecto Aquatech-IA. Cualquier agente de IA o desarrollador debe adherirse a estas pautas antes de inventar nuevos estilos.

## 1. Lenguaje Visual por Portal

El ecosistema se divide en dos grandes portales con identidades contrastantes pero armónicas. Nunca mezclar los lenguajes visuales.

### Portal IA (Inteligencia Artificial)
- **Concepto:** Futuro, inmersión tecnológica, limpieza, modernidad profunda.
- **Estilo Base:** *Glassmorphism 3D premium*.
- **Paleta de Colores (Tailwind `ia-*`):**
  - Fondo (`ia.background`): `#18181b` (Oscuro profundo).
  - Texto (`ia.foreground`): `#ffffff` (Blanco puro).
  - Primario (`ia.primary`): `#3b82f6` (Azul tecnológico).
  - Secundario (`ia.secondary`): `#64748b` (Gris frío).
- **Reglas de UI:**
  - Fondos oscuros con mallas de gradientes sutiles.
  - Tarjetas flotantes con `backdrop-blur-md` o superior y bordes translúcidos (ej: `border-white/10`).
  - Animaciones de *hover* sutiles (`hover:-translate-y-1 hover:shadow-xl`).
  - Imágenes/Avatares: Siempre en `.png` con fondos recortados o renderizados 3D.

### Portal Ambiental (AgTech / Sostenibilidad)
- **Concepto:** Naturaleza, realismo, luz, seriedad científica, crecimiento.
- **Estilo Base:** *Realismo Premium & Neumorfismo ligero*.
- **Paleta de Colores (Tailwind `ambiental-*`):**
  - Fondo (`ambiental.background`): `#f4f4f5` (Gris muy claro, casi blanco).
  - Texto (`ambiental.foreground`): `#18181b` (Casi negro para máximo contraste).
  - Primario (`ambiental.primary`): `#10b981` (Verde esmeralda / naturaleza).
  - Secundario (`ambiental.secondary`): `#64748b` (Slate).
- **Reglas de UI:**
  - Fondos luminosos y limpios. Texturas tipo papel mate si es necesario.
  - Sombras suaves en estado de reposo, sombras más marcadas en *hover*.
  - Imágenes/Avatares: Fotografías realistas, alta resolución, archivos `.jpg` o `.webp`. Cero manipulación 3D o colores de neón exagerados.

---

## 2. Tipografía y Espaciado
- **Tipografía:** Depender estrictamente de las fuentes base configuradas en Next.js (Inter/Geist).
- **Jerarquía:** Solo UN `<h1>` por página (para SEO).
- **Espacios:** Usar múltiplos de 4 (Tailwind defaults `p-4`, `m-8`).Ningún valor arbitrario tipo `h-[43px]`.

---

## 3. Comportamiento Responsive
Todo componente DEBE construirse *Mobile-First*.
1. El diseño por defecto asume pantallas móviles (sin prefijo).
2. `md:` para ajustes desde tablet.
3. `lg:` para disposición en escritorio.
