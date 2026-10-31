# SPEC-211 — Seguimiento de implementación

**Estado:** implementación `implementing`. Una casilla marcada indica que el código correspondiente está agregado; no implica validación en un entorno real. No se ejecutaron pruebas automatizadas ni un piloto de carga. Referencias: [spec.md](spec.md) y [plan.md](plan.md).

## Fase 1: diseño e integración

- [x] **T001 — Implementar autenticación y ruta de API.** API valida el JWT de Aquatech, roles docentes, propiedad y cookies mediante una reescritura same-origin. Falta probar sesiones reales desde ambos servicios.
- [x] **T002 — Diseñar sala, móvil y reporte.** Están implementadas las vistas de ingreso con cuenta/invitado y código/apodo, control, proyección, juego y reporte; el inicio de sesión conserva el formulario de acceso. Falta la revisión visual con dispositivos reales.
- [ ] **T003 — Validar transporte y QR.** Medir consultas de estado con 50 clientes, definir límites por credencial y comprobar envío del enlace de ingreso mediante QR. DoD: mediciones de latencia/coste y decisión de transporte; ADR de cualquier dependencia nueva antes de incorporarla.

## Fase 2: contratos y preparación de contenido

- [ ] **T003 — Validar transporte y QR.** Los clientes consultan estado por polling; el piloto de 50 dispositivos, mediciones de carga y QR quedan pendientes. La sala tiene PIN y enlace compartible.
- [x] **T004 — Definir contratos Zod.** Contratos Zod de curso, encuentro, cuestionario, preguntas, ingreso, respuesta y correcciones; el servidor deriva la cuenta desde la sesión.
- [x] **T005 — Preparar migración aditiva.** Modelos, índices y SQL manual listos, incluidos registros invitados y auditoría. **La migración remota no se ha aplicado.**
- [x] **T006 — Implementar cursos y encuentros.** API y UI permiten curso/grupo, encuentros con hora de Bogotá, lista de códigos y regla de tardanza.
- [x] **T007 — Implementar editor manual.** Preguntas de selección única y verdadero/falso, opción correcta, explicación, tema, dificultad y tiempo; la API bloquea datos inválidos.
- [x] **T008 — Implementar importación.** Plantilla CSV, importador CSV/XLSX con carga diferida, límite de tamaño/preguntas, mensajes por fila y preguntas editables antes de guardar.

## Fase 3: sala y asistencia

- [ ] **T009 — Crear salas y control de ingresos.** PIN único, acciones versionadas y cerrar/abrir ingresos están implementados. Falta emitir QR para la pantalla.
- [x] **T010 — Registrar participante y asistencia.** Ingreso transaccional con cuenta o invitado, código/apodo, registro único por encuentro y credencial guest en cookie HttpOnly. La concurrencia real queda por validar.
- [x] **T011 — Implementar recuperación.** Cookie permite retomar la participación guest; cuenta vinculada puede reingresar desde otro dispositivo. Vincular guest requiere prueba de su credencial.

## Fase 4: juego

- [x] **T012 — Implementar estados y plazos.** Control docente con versión esperada, fases de sala/pregunta/revelación/final y reloj del servidor. La API rechaza respuestas después del plazo.
- [x] **T013 — Implementar respuestas y puntaje.** Una respuesta por estudiante/pregunta, cálculo servidor-side, bono por rapidez opcional y ocultamiento de solución/puntos actuales hasta la revelación.
- [x] **T014 — Implementar pantallas del juego.** Proyección con token limitado, celulares con respuesta guardada, apodos desambiguados sin código, cuenta regresiva y explicación. Falta revisión de accesibilidad y movimiento en dispositivos reales.

## Fase 5: reporte y validación

- [x] **T015 — Implementar historial y correcciones.** Reporte por encuentro, ausentes desde la lista oficial, corrección y registro manual con motivo en auditoría.
- [x] **T016 — Implementar exportación CSV/Excel.** CSV protegido frente a fórmulas y XLSX generado con código como texto; endpoints y reportes limitados al docente propietario.
- [ ] **T017 — Verificar casos críticos.** Cubrir acceso con cuenta e invitado, vinculación segura, códigos/apodos repetidos, autorización, propiedad, concurrencia, reloj del servidor, reconexión y separación asistencia/puntaje. DoD: criterios US-001 a US-007 verificados; cambiar de modalidad no duplica asistencia ni reasigna resultados ajenos.
- [ ] **T018 — Ejecutar piloto técnico.** Simular 50 dispositivos con ingreso y respuestas simultáneas, fallos de red y recarga docente. DoD: métricas p95 y errores cumplen objetivos; resolver transporte alternativo antes de clase si no cumple.
- [x] **T019 — Integrar acceso.** Tarjeta de AquaQuiz agregada al catálogo de Autor; todas las rutas están marcadas noindex. La revisión responsive/contraste y ensayo de extremo a extremo siguen pendientes.

Quedan pendientes T003 (QR y carga), T009 (QR), T017 (casos críticos), T018 (piloto de 50 dispositivos) y las comprobaciones indicadas en T001/T002/T014/T019. Aplicar el SQL manual en el proceso de release antes de habilitar AquaQuiz en un entorno compartido.
