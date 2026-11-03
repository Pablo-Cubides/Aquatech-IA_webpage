---
id: SPEC-201
title: "Consulta Nota"
status: draft
owner: "Pablo Cubides"
created: 2026-04-28
updated: 2026-11-03
---

# SPEC-201 — Consulta Nota

## 1. Problema

Los estudiantes necesitan consultar sus calificaciones publicadas sin solicitar al docente una captura o copia del registro. Cuando hay varios cursos, grupos y cortes, buscar solo por código devuelve demasiada información para ubicar una nota concreta. La consulta debe permitir filtrar con claridad y mostrar el comentario de evaluación correspondiente.

### Contexto

La información publicada se alimenta desde Colega. La consulta pública identifica al estudiante por su código y entrega únicamente las notas que ya están publicadas.

---

## 2. Restricciones

- **C-001**: No mostrar nombres, correos ni códigos de otros estudiantes.
- **C-002**: La búsqueda solo puede devolver registros publicados que coincidan con el código ingresado.
- **C-003**: Los filtros de curso, grupo y corte deben ser compatibles con el esquema compartido de calificaciones.
- **C-004**: Esta herramienta consulta calificaciones; no las modifica ni calcula nuevas notas.
- **C-005**: Validar el código y los filtros en el límite de la API con el contrato Zod.

---

## 3. Fuera de alcance

- Modificar, registrar, redondear o publicar calificaciones.
- Mostrar listados de estudiantes o datos de compañeros.
- Solicitar recuperación de contraseña o autenticación institucional.
- Reemplazar el archivo oficial de notas o el flujo de evaluación de Colega.

---

## 4. Usuarios

| Persona | Rol | Cómo le afecta |
|---|---|---|
| Estudiante universitario | Usuario principal | Consulta las notas publicadas usando su código y filtros opcionales. |
| Pablo (instructor) | Usuario secundario | Comparte una consulta consistente con los datos que publicó desde Colega. |

---

## 5. Historias de usuario

### US-001: Consultar notas por código y filtros
```gherkin
As a estudiante
I want to search using my student code and optionally choose course, group, and cut
So that I can find the grades relevant to my class.

Acceptance Criteria:
  Scenario: Buscar un corte concreto
    Given que el código tiene notas publicadas en varios cursos o cortes
    When el estudiante elige curso, grupo y corte 1, 2 o 3
    Then solo ve las notas publicadas que coinciden con esos filtros

  Scenario: Consultar todas las notas
    Given que el código tiene notas publicadas
    When el estudiante deja los filtros en “Todos”
    Then ve todas sus notas publicadas disponibles
```

### US-002: Revisar el comentario de una nota
```gherkin
As a estudiante
I want to open or focus the detail for a grade
So that I can understand the feedback attached to that activity.

Acceptance Criteria:
  Scenario: Ver detalle
    Given que una nota publicada incluye una justificación
    When el estudiante enfoca o activa el detalle de la nota
    Then ve el comentario correspondiente sin datos personales de otros estudiantes

  Scenario: Nota sin comentario publicado
    Given que una nota no tiene justificación vigente
    When se muestra la consulta
    Then la API no revela datos internos ni expone una explicación distinta a la registrada
```

---

## 6. Reglas de negocio

- **BR-001**: El código estudiantil es obligatorio y debe cumplir el formato admitido por el contrato.
- **BR-002**: Curso, grupo y corte son filtros opcionales e independientes.
- **BR-003**: El corte solo admite 1, 2 o 3.
- **BR-004**: Al seleccionar un curso, el filtro de grupo muestra únicamente los grupos de ese curso y periodo.
- **BR-005**: La respuesta contiene solo registros publicados para el código y los filtros seleccionados.
- **BR-006**: Los comentarios se muestran junto a su actividad o promedio correspondiente; no se muestran ajustes internos de calificación.
- **BR-007**: La consulta no altera notas ni el registro oficial.

---

## 7. Requisitos no funcionales

### Rendimiento
- [ ] Cumplir los presupuestos de rendimiento de la constitución.
- [ ] Evitar solicitudes repetidas al cambiar filtros; consultar cuando se envíe el formulario.

### Accesibilidad
- [ ] Los campos y el botón tienen etiquetas accesibles.
- [ ] Todos los controles pueden usarse con teclado.
- [ ] El detalle del comentario puede abrirse mediante foco o activación, además de hover.

### Seguridad
- [ ] Validar las entradas con Zod en la ruta de consulta.
- [ ] No exponer secretos ni datos de otros estudiantes.
- [ ] Mantener la búsqueda limitada al código ingresado y a registros publicados.

### Disponibilidad
- [ ] Si el catálogo o la consulta fallan, informar el problema sin mostrar resultados incompletos como si fueran definitivos.

---

## 8. Casos límite y errores

| Escenario | Comportamiento esperado |
|---|---|
| Código vacío o con formato inválido | Mostrar un mensaje claro y no consultar. |
| Código válido sin resultados para los filtros | Informar que no hay notas publicadas que coincidan. |
| Curso seleccionado sin grupos adicionales disponibles | Permitir “Todos los grupos” y no fallar la consulta. |
| Cambio de curso después de escoger un grupo | Limpiar el grupo anterior para evitar una combinación inválida. |
| Error de catálogo o API | Mostrar el estado de error y permitir volver a intentar. |
| Grupo o corte no coincide con el código | Devolver cero filas; no ampliar la búsqueda silenciosamente. |

---

## 9. Dependencias

| Dependencia | Tipo | Notas |
|---|---|---|
| SPEC-212 | Especificación | Publicación y sincronización de calificaciones desde Colega. |
| Contratos compartidos de grade reports | Interna | Define campos y validación del código, curso, grupo y corte. |

---

## 10. Preguntas abiertas

No hay preguntas pendientes para el filtro de consulta descrito.

---

## 11. Glosario

| Término | Definición |
|---|---|
| Corte | Periodo de evaluación identificado como 1, 2 o 3. |
| Registro publicado | Calificación marcada como visible para estudiantes en Aquatech. |
| Justificación | Comentario de retroalimentación asociado a una actividad o promedio. |

---

## Cumplimiento de la constitución

- [x] Se usan contratos y validaciones existentes; no se añade una librería.
- [x] La herramienta continúa dentro del portal IA / Autor.
- [x] El código y los filtros se validan con Zod.
- [ ] Confirmar accesibilidad y presupuestos de rendimiento en la revisión de implementación.
- [x] No se planean tipos `any`.

---

*Spec ID: SPEC-201 | Estado: draft | Revisado: 2026-11-03*
