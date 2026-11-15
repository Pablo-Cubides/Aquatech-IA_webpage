# Plan SPEC-212

Implementar contratos Zod compartidos en @ia-next/contracts, servicio y rutas en apps/api mediante @ia-next/database. Apps/web muestra la consulta e importa a través del rewrite del backend, sin nuevas consultas DB desde frontend. Reutilizar la identidad de sesión JWT ya validada por el API de AquaQuiz; la importación exige ADMIN. La página usa la sesión existente solo para mostrar el cargador administrativo.

Modelo GradeReport separado de Note, clave única periodo/curso/grupo/corte/código (grupo en courseId), JSON con actividades y motivo sin nombres. SQL aditivo e idempotente con RLS y acceso service_role. Se conserva el modelo y cargador histórico. La exportación de Colega elimina nombres y códigos de coautores del texto sin modificar las razones privadas.

Pruebas: contratos y transacciones (idempotencia, nulos, ceros, versión antigua y nombres excluidos), endpoints (autorización, exactitud del código y caché), interfaz (detalle por hover/foco/Escape y vacío/error). Verificación de los tres Excel contra su baseline, prueba nativa de recálculo y revisión visual. No modificar datos ni configuraciones ajenos a la característica.
