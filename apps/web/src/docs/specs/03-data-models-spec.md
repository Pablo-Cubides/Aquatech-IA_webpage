# Spec: Modelos de Datos & Base de Datos

Esta especificación documenta el núcleo del esquema de datos, que reside en Supabase (PostgreSQL) y es orquestado a nivel de aplicación mediante Prisma ORM en `@ia-next/database`.

## 1. Topología de la Red de Datos
- **Fuente de Verdad:** PostgreSQL alojado en Supabase (`aws-1-sa-east-1.pooler.supabase.com`).
- **ORM:** Prisma v7.4.0 (con Client generado de forma compartida desde el paquete interno de la base de datos).

## 2. Modelos Fundamentales y sus Relaciones

### Entidades de Autenticación
Los modelos `User`, `Account`, `Session` y `VerificationToken` siguen estrictamente en su tipado al adaptador estándar de NextAuth.js. No alterar sus nombres ni modificar `cuid()` generados sin entender el impacto en el sistema de inicio de sesión.
- Tienen relación de 1:N con uso de herramientas, contenido y pagos.

### Contenido Multipropósito (`Content`)
Este modelo es central para alojar recursos formativos no estáticos en la DB.
- **Campos críticos**: `portal` (Enum que distingue "IA" o "AMBIENTAL").
- **Secciones Editoriales (`EditorSection`)**: Esquema jerárquico 1:N donde cada artículo puede estar fracturado en bloques (texto enriquecido, código, imágenes embebidas, datos de JSON).

### Sistema Económico / Virtual
- **`CreditLog`**: Inmutable. Registro como ledger (libro mayor) de ingresos y egresos de saldo en la plataforma para auditar anomalías económicas.
- **`Payment`**: Registro de intenciones de pago, referenciando flujos transaccionales (MercadoPago) con estados de ciclo de vida (`PENDING`, `APPROVED`, etc.).

### Análisis de Herramientas
- **`ToolUsage` vs `ToolAnalytics`**:
  - `ToolUsage` está acoplado transaccionalmente a los créditos (`userId`, `toolId`, costo en créditos).
  - `ToolAnalytics` es agnóstico del inicio de sesión (puede capturar eventos anónimos).

## 3. Prácticas al Alterar Datos
1. Todo cambio estructural debe comenzar en `schema.prisma`.
2. Las migraciones se aplican estrictamente vía `npx prisma migrate dev` para crear la SQL final compartida.
3. Se prohíbe el borrado físico (`HARD DELETE`) de modelos transaccionales (`Payment`, `CreditLog`); implementar marcadores lógicos (`isActive`).
