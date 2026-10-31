---
id: SPEC-211
title: "AquaQuiz — preguntas en vivo y asistencia por clase"
status: implementing
owner: Pablo Cubides
created: 2026-10-30
updated: 2026-10-30
---

# SPEC-211 — AquaQuiz

Especificación aprobada por instrucción del usuario de implementar AquaQuiz. Enfoque técnico: [plan.md](plan.md). Secuencia de trabajo: [tasks.md](tasks.md).

**Estado de la entrega:** el código del flujo docente/estudiante, reportes, CSV/XLSX y API está en implementación. La sala comparte PIN y enlace; el QR, las pruebas de autenticación/carga y la aplicación del SQL al entorno quedan pendientes antes de producción.

## 1. Problem / Problema

El docente necesita realizar preguntas sobre la clase con una experiencia de concurso similar a Kahoot y conservar el código estudiantil y el apodo de quienes ingresaron como asistencia de ese encuentro. Los estudiantes pueden ingresar con su cuenta de Aquatech o como invitados, sin solicitar nombre completo. Hoy Aula Score permite controlar puntos por grupos y Ruleta Académica presenta preguntas, pero estas herramientas no proporcionan una partida compartida entre celulares ni un historial de asistencia por estudiante y clase.

La propuesta es una herramienta independiente dentro de Autor: **AquaQuiz · preguntas en vivo**. El docente prepara el cuestionario, proyecta una sala con PIN y QR, dirige las preguntas y consulta al terminar tanto los resultados como la asistencia.

## 2. Constraints / Restricciones

- **C-001**: Mantener Next.js App Router, React, TypeScript estricto, Tailwind, Zod y Prisma del proyecto. Persistencia en Supabase PostgreSQL mediante `apps/api` y `@ia-next/database`.
- **C-002**: Nueva herramienta en el portal IA, sin importaciones desde el portal Ambiental. Los temas de las clases pueden ser ambientales, de IA o de cualquier otra asignatura.
- **C-003**: Docente autenticado y autorizado por rol y propiedad del recurso. Estudiantes tienen dos opciones: ingresar con su cuenta de Aquatech o como invitados sin registrarse. Ambas permiten participar y registrar asistencia.
- **C-004**: Código estudiantil y apodo son los datos de ingreso a la clase; no se solicita nombre completo ni se publica el nombre o correo de la cuenta. El código identifica el registro de asistencia y el apodo se usa en el juego. El PIN localiza una sala, pero no autoriza acciones docentes ni descarga de reportes.
- **C-005**: Asistencia y puntaje son registros distintos. La asistencia se guarda al confirmar el ingreso, independientemente de responder o acertar.
- **C-006**: Puntajes, plazos, corrección y cambios de estado se calculan en el servidor. El navegador no envía puntajes ni determina la respuesta correcta.
- **C-007**: La apariencia combina la dinámica visual de Kahoot con los colores y la marca Aquatech. Usar recursos propios e iconos existentes.
- **C-008**: No trasladar los endpoints heredados de otras herramientas como parte de este trabajo. Las discrepancias existentes entre código, documentación y autenticación deben quedar identificadas al integrar la nueva herramienta.

## 3. Non-Goals / Fuera de alcance inicial

- Generación automática de preguntas con IA, juegos por equipos y actividades asincrónicas; se proponen como evolución.
- Convertir automáticamente el puntaje del juego en una nota en Consulta Nota.
- Cambiar el funcionamiento de Aula Score, Ruleta Académica o Consulta Nota.
- Autenticación biométrica, geolocalización o mecanismos que pretendan demostrar presencia física a partir del ingreso al juego.
- Publicar datos personales, códigos estudiantiles o respuestas individuales en enlaces públicos.

## 4. Users / Usuarios

| Persona                  | Necesidad                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| Pablo / docente          | Preparar preguntas, abrir la sala, dirigir la actividad y conservar asistencia y resultados. |
| Estudiante universitario | Ingresar con cuenta o como invitado usando código y apodo, responder y ver su resultado.     |

## 5. User Stories

### US-001: Preparar el cuestionario

```gherkin
Given un docente autorizado
When crea un cuestionario para un curso y tema
Then puede escribir preguntas o importar una plantilla CSV/XLSX
And define opciones, respuesta correcta, explicación y tiempo por pregunta
And una pregunta incompleta no puede publicarse para jugar
```

### US-002: Entrar y registrar asistencia

```gherkin
Given una sala abierta asociada a un encuentro de clase
When un estudiante ingresa mediante PIN, enlace o QR con su cuenta o como invitado y confirma código y apodo
Then el servidor guarda su primera hora de ingreso y asistencia
And devuelve una confirmación visible al estudiante
And acertar, equivocarse o no responder no modifica esa asistencia
```

### US-003: Jugar una sesión compartida

```gherkin
Given estudiantes conectados a una sala
When el docente abre una pregunta
Then los dispositivos muestran el mismo enunciado y las opciones disponibles
And cada participante puede enviar una respuesta durante el plazo
And la respuesta correcta y la explicación se revelan al cerrar la pregunta
And los puntos se calculan en el servidor
```

### US-004: Recuperarse de una desconexión

```gherkin
Given un participante con credencial válida y respuestas guardadas
When recarga o se reconecta desde el mismo navegador
Then recupera su identidad, puntos y pregunta vigente
And no se duplica su asistencia ni su respuesta
And una credencial ausente o inválida no permite apropiarse de un código ya conectado
```

### US-005: Consultar y exportar

```gherkin
Given una clase con asistencia registrada
When el docente propietario consulta el reporte
Then ve curso, grupo, fecha, código, apodo, modalidad de ingreso, primera entrada, estado y participación
And puede descargar CSV o Excel aunque el juego haya sido interrumpido
And solo se muestran ausentes si existe una lista oficial de estudiantes del curso
```

### US-006: Corregir una asistencia

```gherkin
Given un reporte del docente propietario
When corrige un código, apodo o estado de asistencia e indica un motivo
Then se conserva el registro original junto con autor y fecha de la corrección
And los cambios se reflejan en la siguiente exportación
```

### US-007: Elegir ingreso con cuenta o como invitado

```gherkin
Scenario: Ingreso con cuenta
  Given un estudiante con cuenta de Aquatech y una sala abierta
  When elige «Entrar con mi cuenta» y autentica su sesión si hace falta
  Then confirma su código estudiantil y el apodo para la partida
  And el servidor vincula la participación con su cuenta verificada
  And no solicita nombre completo ni muestra el nombre o correo de su cuenta en el juego

Scenario: Ingreso como invitado
  Given un estudiante sin cuenta y una sala abierta
  When elige «Entrar como invitado» y confirma código y apodo
  Then registra su ingreso sin crear una cuenta de Aquatech
  And obtiene las mismas funciones de juego y registro de asistencia

Scenario: Cambio de modalidad
  Given un código con participación o asistencia previa en el encuentro
  When se solicita ingresar por la otra modalidad
  Then no se crea otra asistencia ni se reasignan resultados por conocer el código
  And la recuperación exige la cuenta ya vinculada, la credencial válida del invitado o validación docente
```

## 6. Business Rules / Reglas de negocio

- **BR-001**: Cada sala pertenece a un cuestionario y a un encuentro de clase con curso, grupo, fecha académica y zona horaria. Una clase puede contener varias partidas.
- **BR-002**: Fecha académica predeterminada según `America/Bogota`; horas almacenadas en UTC. La fecha queda fijada al crear el encuentro y no cambia al cruzar medianoche.
- **BR-003**: Registro único de asistencia por encuentro y estudiante. Dos encuentros del mismo curso el mismo día siguen siendo independientes.
- **BR-004**: El código estudiantil se maneja como texto, preservando ceros iniciales. Su unicidad pertenece al curso/grupo, no a todos los usuarios de la plataforma.
- **BR-005**: El primer ingreso confirmado registra `presente`; si supera el límite de puntualidad configurado, registra `tarde`. La reconexión conserva la primera hora.
- **BR-006**: Sin lista oficial se informa quién ingresó, sin inferir ausentes. Con lista oficial, los no registrados figuran como `sin registro` mientras la asistencia está abierta y como `ausente` al cerrarla.
- **BR-007**: Si hay lista oficial, se coteja el código con ella; el apodo no se usa para validar identidad. La lista requiere códigos y no necesita nombres completos. Códigos no coincidentes requieren revisión docente y figuran como pendientes de validación, conservando su hora de ingreso.
- **BR-008**: Se pueden bloquear y reabrir nuevos ingresos. Finalizar una partida no borra asistencias, respuestas ni resultados anteriores.
- **BR-009**: Una respuesta válida por participante y pregunta de la partida. Reintentos de la misma solicitud son idempotentes; una segunda elección diferente se rechaza.
- **BR-010**: El cierre de cada pregunta depende del estado y reloj del servidor. Una respuesta fuera de plazo se informa como no aceptada.
- **BR-011**: Predeterminado: 1.000 puntos por acierto, cero por error o falta de respuesta. El docente puede activar antes de iniciar un bono de rapidez de hasta 200 puntos; este ajuste se conserva con la partida. Puntajes iguales comparten puesto.
- **BR-012**: El cuestionario se congela como una copia de la partida al iniciarla; futuras ediciones no cambian resultados históricos.
- **BR-013**: Proyección y clasificación muestran el apodo elegido. Los códigos estudiantiles, asistencias y exportaciones son exclusivos del docente autorizado. No copiar automáticamente el nombre o correo de la cuenta al apodo.
- **BR-014**: Un código duplicado desde otro navegador o modalidad requiere recuperación autorizada. Conocer código y apodo no permite tomar una participación existente ni vincularla con otra cuenta.
- **BR-015**: La cuenta se obtiene de la sesión verificada en el servidor; nunca de un `userId` enviado por el navegador. La inscripción del curso puede vincularse a una cuenta mediante una relación opcional; los invitados permanecen sin cuenta.
- **BR-016**: La unicidad de asistencia depende del encuentro y del código del curso, independientemente de ingresar con cuenta o como invitado. Una cuenta vinculada recupera su propia participación desde otro dispositivo; un invitado requiere su credencial válida o validación docente.
- **BR-017**: Vincular una cuenta a una inscripción previamente usada como invitado exige la credencial válida de ese invitado y la sesión autenticada, o validación docente. Si ya existe vínculo con otra cuenta, se rechaza la reasignación automática.
- **BR-018**: El apodo es editable para nuevas partidas y se conserva como copia histórica en cada participación y asistencia. No es una clave de identidad y puede repetirse; si hace falta distinguirlo en pantalla, se añade un sufijo visual sin mostrar el código.

## 7. Non-Functional Requirements / Requisitos no funcionales

- Objetivo de piloto: una sala con **50 estudiantes concurrentes**, propagación de cambios de estado en menos de **2 segundos p95** en la red de prueba y envío de respuestas en menos de **1 segundo p95**. Son metas por validar, no capacidad demostrada.
- Cumplir los presupuestos de rendimiento del portal IA; cargar importación y exportación de Excel solo cuando se necesiten.
- Navegación por teclado, textos legibles en proyector, controles táctiles amplios y contraste AA verificado. Todas las opciones tienen letra, símbolo y texto además de color.
- Animaciones y sonidos configurables; respetar reducción de movimiento. El tiempo se puede ampliar para adaptaciones de clase.
- Validación Zod, control de propiedad, limitación de solicitudes, protección de credenciales y respuestas sin caché pública.
- Confirmar asistencia o respuesta guardada únicamente después de persistirla. Ante pérdida de red, informar estado pendiente y permitir reintento.
- Historial consultable después de cerrar el navegador del docente. Sin dependencia de memoria de un proceso o `sessionStorage` para datos académicos.

## 8. Edge Cases & Error Scenarios / Casos límite

| Caso                                                    | Comportamiento esperado                                                                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| PIN inexistente, vencido o ingreso bloqueado            | Mensaje claro; no crear participante ni anunciar asistencia.                                                                |
| Dos estudiantes con igual apodo                         | Registros distintos por código; distinguir en pantalla sin publicar el código.                                              |
| Mismo código ingresa con cuenta y como invitado         | Una asistencia; recuperar o vincular únicamente con credencial válida o validación docente.                                 |
| Cuenta sin código estudiantil guardado                  | Solicitar y confirmar código y apodo; no usar el ID de cuenta como código académico.                                        |
| Sesión de cuenta vencida                                | Ofrecer iniciar sesión de nuevo o entrar como invitado, conservando el PIN; no eludir la recuperación de un código ocupado. |
| Dos solicitudes simultáneas de ingreso del mismo código | Restricción única y transacción; un solo registro.                                                                          |
| Estudiante ingresa después de iniciar                   | Recupera la pregunta vigente si se permite; no responde preguntas cerradas.                                                 |
| Dos partidas del mismo encuentro                        | Una asistencia por estudiante, resultados separados por partida.                                                            |
| El docente recarga o se desconecta                      | Puede recuperar la sala; el plazo activo sigue siendo verificable desde el servidor.                                        |
| Archivo con filas inválidas                             | Previsualización y errores por fila; no importar silenciosamente registros incompletos.                                     |
| Caída de base de datos al ingresar                      | Estado pendiente/error; no mostrar «asistencia registrada» sin confirmación.                                                |
| Reporte exportado con texto que parece fórmula          | Tratar como texto y neutralizar fórmulas en CSV/Excel.                                                                      |

## 9. Dependencies / Dependencias

- Diseño y componentes de Autor, Aula Score y Ruleta Académica como referencias; sin dependencia de sus estados temporales.
- Infraestructura de autenticación, PostgreSQL, Prisma, Upstash y exportación ya presente en el repositorio.
- Resolver en una prueba técnica la integración entre la sesión JWT de `apps/web` y la sesión de base de datos declarada en `apps/api`.
- Generador QR: evaluar una dependencia mantenida y documentar el ADR correspondiente antes de incorporarla. El QR solo codifica el enlace de ingreso de la sala.

## 10. Open Questions / Decisiones para la implementación

Se propone trabajar con estos valores iniciales; no hace falta resolverlos para revisar este plan:

| Decisión              | Propuesta inicial                                                               |
| --------------------- | ------------------------------------------------------------------------------- |
| Nombre                | AquaQuiz.                                                                       |
| Acceso                | Con cuenta de Aquatech o como invitado sin registro.                            |
| Identificación        | Código estudiantil y apodo en ambas modalidades; sin solicitar nombre completo. |
| Asistencia            | Al ingreso confirmado; participación y aciertos en columnas separadas.          |
| Puntualidad           | Límite configurable por clase; sin penalización automática si no se configura.  |
| Capacidad             | Piloto de 50 estudiantes; ampliar después de medir carga.                       |
| Contenido de arranque | Un cuestionario revisado por el docente del tema que esté enseñando.            |

Antes de usar con datos reales se deben fijar la política institucional de conservación y eliminación y el criterio de validación de participantes sin lista oficial. La propuesta inicial permite trabajar sin lista, identificando los registros como declarados por el participante y revisables por el docente.

## Constitution Compliance Checklist / Cumplimiento propuesto

- [x] Arquitectura propuesta con base de datos detrás de `apps/api` y del paquete compartido.
- [x] Aislamiento entre portales y validación Zod previstos.
- [x] Rendimiento, accesibilidad, privacidad y pruebas de concurrencia definidos.
- [x] Sin cambios de código, dependencias, configuración ni base de datos en esta entrega de planificación.
- [ ] Validar integración de autenticación y transporte bajo carga antes de aprobar el diseño de implementación.
- [ ] Registrar y revisar ADR para nuevas dependencias si se incorporan.

_Estado: propuesta en borrador; no representa funcionalidad disponible._
