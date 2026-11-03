---
id: SPEC-212
title: Calificaciones y sincronización de Colega
status: implemented
owner: Pablo Cubides
created: 2026-11-02
updated: 2026-11-02
---

# SPEC-212 — Calificaciones y justificaciones de Colega

## 1. Problem

Las notas conciliadas de Colega deben coincidir con el Excel oficial, el Centro de Mando y la consulta de estudiantes de Aquatech. La consulta anterior no representa el detalle por actividad ni sus razones. La publicación y las siguientes actualizaciones deben ejecutarse mediante herramientas de los agentes con recibos verificables.

## 2. Constraints

- Los tres libros oficiales conservan sus identificadores y valores; dos pestañas reales, Calificaciones y Asistencia. Una celda fuente por código y actividad.
- El acceso nuevo a base de datos permanece en apps/api mediante @ia-next/database; contratos Zod compartidos y portales separados.
- La respuesta pública muestra código exacto, curso/grupo/corte, actividad, escala real y justificación sin nombres ni correos. Las razones originales permanecen privadas en Colega.
- Cero y pendiente se distinguen. La sincronización no recalifica, no aplica penalizaciones y no convierte pendientes en cero.
- La importación interactiva exige ADMIN. La herramienta de Colega usa una credencial de firma limitada a 2026-3, segundo corte y los tres cursos autorizados.
- Publicación por rama/PR con pruebas y preview, seguida de la integración de GitHub/Vercel existente. Notas y respaldos permanecen fuera del repositorio público.
- Consultas limitadas, sin caché ni indexación; ADR-0013 permite un contador transaccional en Supabase solo para grade-reports cuando no se usa Upstash. El contador indisponible detiene la consulta.

## 3. Non-Goals

No modificar rúbricas, notas académicas o sanciones; no publicar en AVA o PAW; no enviar correos; no cerrar cortes incompletos. No conceder acceso general de GitHub/Vercel a Socio ni exponer la API del computador a los estudiantes. No migrar los agentes a un servidor remoto en esta entrega.

## 4. User Stories

- Como estudiante escribo mi código completo y consulto mis actividades y notas sin publicar mi nombre; el icono de información muestra por qué obtuve cada nota mediante cursor, teclado o toque.
- Como profesor registro una nota con su justificación en el libro oficial y Colega solicita la actualización de Aquatech; el panel muestra cola, último guardado confirmado y errores reales.
- Como agente técnico publico el código desde un checkout aislado, conservando los hooks y controles de GitHub. Una nueva nota se actualiza como dato sin redesplegar el software.

## 5. Acceptance Criteria

- La consulta devuelve únicamente el código solicitado; no hay listado público de estudiantes.
- Se preserva el parcial sobre 15 y las actividades sobre 5, los ceros, los pendientes y los promedios existentes.
- El icono abre la justificación al pasar el cursor, recibir foco o pulsarlo; Escape lo cierra y devuelve el foco.
- Cada lote se valida completo, es repetible sin duplicados y rechaza versiones anteriores o la misma versión con archivos distintos.
- La publicación interactiva es explícita. La sincronización autorizada firma cuerpo/ruta/método/fecha, rechaza alteraciones, vencimiento y cursos fuera del alcance y confirma hashes tras el guardado.
- El Centro de Mando distingue solicitud y sincronización verificada; conserva el último recibo bueno ante un fallo y permite reintentar.
- El ejecutor solo admite el repositorio Aquatech y archivos de SPEC-212; una integración de producción exige controles en verde y preview del commit exacto.

## 6. Authorization

El profesor pidió la estructura simplificada y consulta sin nombres y aprobó expresamente el 2-nov-2026 implementar la recomendación de agentes → GitHub → Vercel, API separada y sincronización de Colega. No quedan preguntas de alcance pendientes. ADR-0013 documenta la implementación dentro de la infraestructura existente y la excepción acotada del contador. Este documento no acredita por sí solo el despliegue público.
