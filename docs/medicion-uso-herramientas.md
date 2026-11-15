# Medición de uso de las 12 herramientas públicas

> Cargo OPS · OPS-001 · esquema versión **1**. El código es la fuente de verdad:
> `apps/web/src/lib/analytics/events.ts` (nombres y campos), `track.ts` (envío) y
> `apps/web/src/components/analytics/ToolUsageTracker.tsx` (qué se mide solo).
> Si cambias uno, cambia este documento.

## Para qué sirve

Decidir en qué nicho especializar el sitio a partir del **uso real**, no de la intuición.
Para cada herramienta y cada mes, el sistema responde:

| Pregunta | Cómo se calcula (consulta 1-7 más abajo) |
|---|---|
| ¿Cuántas **visitas**? | `tool_view` |
| ¿Cuántas **personas distintas**? | `vid` distintos en `tool_view` |
| ¿Cuántas **interacciones reales** (no solo cargar la página)? | visitas (`sid`) con al menos un `tool_interaction`, `tool_action`, `file_upload` o `tool_export` |
| ¿Cuántos **errores**? | `tool_error`, por nombre de error |
| ¿Cuántos **repiten**? | `vid` con visitas en 2 o más días distintos |
| ¿De qué **país** son? | `country` (lo pone el servidor) |
| ¿Cuántos **suben un CSV** (u otro archivo)? | `file_upload` con `ext = 'csv'` |
| ¿Cuántos **exportan** el resultado? | `tool_export` |

Son **12 herramientas públicas** (6 por portal). Las 5 de autor (`/ia/autor/herramientas/*`,
`noindex`) no se miden.

## Dónde viven los datos

Tabla `tool_analytics` de PostgreSQL (Prisma `ToolAnalytics`), escrita por
`POST /api/tools/analytics`. Columnas relevantes:

| Columna | Contenido |
|---|---|
| `tool` | slug de la herramienta, p. ej. `analisis-correlaciones` |
| `event_name` | nombre del evento (tabla siguiente) |
| `event_data` | JSON plano (jsonb) con los campos de la sección "Campos comunes" |
| `user_id` | id opaco de usuario **solo si había sesión** (nunca correo) |
| `created_at` | momento del evento (UTC) |
| `ip_address` | siempre `NULL`: la IP no se guarda |

Retención: **400 días** (13 meses), para poder comparar mes contra mes y medir quién
repite. El borrado es oportunista (≈1 % de las escrituras).

## Eventos

| `event_name` | Cuándo se emite | Campos propios (`event_data`) | Quién lo emite |
|---|---|---|---|
| `tool_view` | al abrir una página de la herramienta (una vez por navegación) | — | `ToolUsageTracker` (automático) |
| `tool_interaction` | clic en un control o cambio de un campo dentro de la herramienta; **máximo 1 por minuto y visita** | — | `ToolUsageTracker` (automático) |
| `tool_action` | acción con nombre propio de la herramienta (generar token, elegir caso…) | `action` + parámetros numéricos/booleanos/cortos que la herramienta pase | `logEvent` / `trackToolEvent` de cada herramienta |
| `file_upload` | se elige un archivo en un campo de subida | `ext` (`csv`, `xlsx`…), `size` (`<100KB`, `100KB-1MB`, `1-10MB`, `>10MB`), `files` | `ToolUsageTracker` (automático) |
| `tool_export` | clic en un botón/enlace de exportar o descargar | `format` si se reconoce (`csv`, `pdf`, `png`…) | `ToolUsageTracker` (automático, por el texto del botón o el atributo `download`) |
| `tool_error` | error no controlado (`window_error`, `unhandled_rejection`) o capturado (`handled`) | `kind`, `name` (solo el **nombre** del error: `TypeError`…; nunca el mensaje) | `ToolUsageTracker` y `trackError` |

### Campos comunes (en todos los eventos)

| Campo | Valor | Notas |
|---|---|---|
| `v` | `1` | versión del esquema |
| `portal` | `ia` \| `ambiental` | |
| `device` | `mobile` \| `desktop` | ancho de pantalla < 768 px |
| `vid` | 32 hex aleatorios | identificador **anónimo** del navegador (localStorage `aq_vid`); permite contar quién repite |
| `sid` | 32 hex aleatorios | identificador de la pestaña/visita (sessionStorage `aq_sid`) |
| `country` | ISO-3166 alfa-2, o `XX` | lo fija el **servidor** desde la cabecera `x-vercel-ip-country`; el cliente no puede falsearlo |

## Qué NO se registra (y cómo se garantiza)

- **Sin correo, sin IP, sin nombres, sin notas, sin texto escrito por el usuario, sin contenido de archivos.**
- `safeEventData` (cliente) descarta toda clave cuyo nombre sugiera texto libre o identidad
  (`text`, `prompt`, `email`, `name`, `codigo`, `frase`, `query`, `message`…) y todo valor que no sea
  número, booleano o cadena de ≤ 40 caracteres. De un archivo solo se guarda la extensión y un rango de tamaño.
- El esquema del servidor es cerrado: máx. 20 claves planas, 4 KB por evento.
- Se respeta **Do Not Track** y **Global Privacy Control**: con cualquiera activo no se envía nada.
  Los navegadores automatizados (`navigator.webdriver`) tampoco.
- Sentry **no** recibe eventos de uso, solo errores, y con los datos personales filtrados
  (`apps/web/src/lib/observability/sentry-options.ts`).
- Si hay sesión iniciada, el servidor guarda `user_id` (id opaco) junto al evento. Las 12 herramientas son
  públicas y se usan casi siempre sin sesión; aun así, un evento con `user_id` y `vid` queda ligado a una
  cuenta. Si se quiere evitar, es una decisión de política (cargo SEC): bastaría con no guardar `user_id`
  en eventos de herramientas.

## Limitaciones conocidas (leer antes de decidir con estos números)

1. **Subconteo**: no se mide a quien tenga DNT/GPC activo ni a quien bloquee el almacenamiento (esos eventos
   llegan sin `vid`, y no cuentan como "repite"). Un mismo usuario con dos navegadores son dos `vid`.
2. **No se filtran robots** más allá de `webdriver` y del límite de 60 eventos/min por IP. Una visita de un
   rastreador que ejecute JavaScript cuenta como visita. Comprobar picos de `tool_view` sin `tool_interaction`.
3. **"Interacción"** es una ráfaga (máx. 1 por minuto y visita), no un recuento de clics. Sirve para saber
   *si* hubo uso real, no *cuánto*.
4. **Exportaciones y subidas se detectan por heurística** (texto del botón, `input[type=file]`). Una herramienta
   que exporte con un botón sin esas palabras no aparecerá en `tool_export`; en ese caso se emite
   `trackToolEvent("export", { format })` desde la herramienta.
5. **No hay datos anteriores** al despliegue de este cambio: la serie empieza en la fecha de OPS-001.
6. `country = 'XX'` significa "desconocido" (ejecución local, o sin cabecera).

## Consultas (SQL, para el editor de Supabase)

Cambiar el mes en `date_trunc('month', created_at) = '2026-12-01'` o quitar el filtro para ver la serie.

```sql
-- 1. Visitas y personas distintas por herramienta y mes
SELECT date_trunc('month', created_at) AS mes, tool,
       count(*)                                   AS visitas,
       count(DISTINCT event_data->>'vid')         AS personas
FROM tool_analytics
WHERE event_name = 'tool_view'
GROUP BY 1, 2 ORDER BY 1 DESC, visitas DESC;

-- 2. Visitas con USO REAL (no solo cargar la página) y tasa de uso
WITH vistas AS (
  SELECT date_trunc('month', created_at) AS mes, tool, event_data->>'sid' AS sid
  FROM tool_analytics WHERE event_name = 'tool_view' GROUP BY 1, 2, 3
), usos AS (
  SELECT date_trunc('month', created_at) AS mes, tool, event_data->>'sid' AS sid
  FROM tool_analytics
  WHERE event_name IN ('tool_interaction', 'tool_action', 'file_upload', 'tool_export')
  GROUP BY 1, 2, 3
)
SELECT v.mes, v.tool, count(*) AS visitas,
       count(u.sid) AS visitas_con_uso,
       round(100.0 * count(u.sid) / count(*), 1) AS pct_uso
FROM vistas v LEFT JOIN usos u USING (mes, tool, sid)
GROUP BY 1, 2 ORDER BY 1 DESC, pct_uso DESC;

-- 3. Errores por herramienta, mes y tipo de error
SELECT date_trunc('month', created_at) AS mes, tool,
       event_data->>'kind' AS tipo, event_data->>'name' AS error, count(*) AS n
FROM tool_analytics WHERE event_name = 'tool_error'
GROUP BY 1, 2, 3, 4 ORDER BY 1 DESC, n DESC;

-- 4. Quién repite: personas con visitas en 2 o más días distintos del mes
SELECT mes, tool,
       count(*) FILTER (WHERE dias >= 2) AS repiten,
       count(*)                          AS personas,
       round(100.0 * count(*) FILTER (WHERE dias >= 2) / count(*), 1) AS pct_repiten
FROM (
  SELECT date_trunc('month', created_at) AS mes, tool, event_data->>'vid' AS vid,
         count(DISTINCT created_at::date) AS dias
  FROM tool_analytics
  WHERE event_name = 'tool_view' AND event_data ? 'vid'
  GROUP BY 1, 2, 3
) t GROUP BY 1, 2 ORDER BY 1 DESC, pct_repiten DESC;

-- 5. País de origen (porcentaje de visitas por herramienta)
SELECT tool, event_data->>'country' AS pais, count(*) AS visitas,
       round(100.0 * count(*) / sum(count(*)) OVER (PARTITION BY tool), 1) AS pct
FROM tool_analytics
WHERE event_name = 'tool_view' AND created_at >= now() - interval '30 days'
GROUP BY 1, 2 ORDER BY 1, visitas DESC;

-- 6. Subidas de archivo por herramienta y tipo (los CSV son ext = 'csv')
SELECT date_trunc('month', created_at) AS mes, tool,
       event_data->>'ext' AS ext, event_data->>'size' AS tamano, count(*) AS subidas
FROM tool_analytics WHERE event_name = 'file_upload'
GROUP BY 1, 2, 3, 4 ORDER BY 1 DESC, subidas DESC;

-- 7. Exportaciones por herramienta y formato
SELECT date_trunc('month', created_at) AS mes, tool,
       coalesce(event_data->>'format', 'sin formato') AS formato, count(*) AS exportaciones
FROM tool_analytics WHERE event_name = 'tool_export'
GROUP BY 1, 2, 3 ORDER BY 1 DESC, exportaciones DESC;
```

## Cómo añadir un evento nuevo

1. Añadir el nombre a `TOOL_EVENTS` en `events.ts` y documentarlo en la tabla de arriba.
2. Emitirlo con `sendToolEvent(tool, TOOL_EVENTS.X, datos)`; **un único helper**, nunca `fetch` directo.
3. Datos: solo números, booleanos o cadenas cortas de un vocabulario cerrado. Nada de texto del usuario.
4. Si cambia el significado de un campo existente, subir `ANALYTICS_SCHEMA_VERSION` y anotarlo aquí.
