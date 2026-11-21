# ADR-0017 — CSP por niveles: nonce en /admin y /auth, 'unsafe-inline' en las páginas públicas / Tiered CSP: nonce on /admin and /auth, 'unsafe-inline' on public pages
> **Status / Estado**: `accepted`
> **Date / Fecha**: 2026-11-21
> **Last reviewed / Última revisión**: 2026-11-21
> **Author / Autor**: Claude Code (cargo SEC, encargo SEC-006)
> **Deciders / Decisores**: Coordinación AquatechIA
> **Related**: SEC-003b / SEC-005b (CSP sin `'unsafe-eval'`, `connect-src` cerrado), ADR-0008 (artículos como datos TypeScript), `docs/presupuesto-js.md`

---

## Context / Contexto

La CSP del sitio vive en `apps/web/next.config.mjs` (`headers()`): una sola política para todas las rutas, sin código en cada visita. Su punto débil conocido es `script-src 'self' 'unsafe-inline'`: Next.js emite scripts en línea (arranque de hidratación, datos de la página), y una CSP sin `'unsafe-inline'` los bloquearía.

La forma estándar de quitar `'unsafe-inline'` es una CSP con **nonce** por petición. Next lo soporta, pero exige que cada página que lo lleva se renderice **por petición**: el HTML prerenderizado en el build no puede contener un nonce que todavía no existe.

El 2026-11-21 se midió el coste de poner el nonce en TODO el sitio (build de producción, Next 16.4.5, mismo árbol; el layout raíz lee `headers()`, que es lo que Next necesita para aplicar el nonce a sus scripts):

| | Hoy | Nonce global |
|---|---|---|
| Rutas estáticas (○) | 70 | 4 |
| Rutas ISR/SSG (●; blog con revalidate de 6 h) | 18 | 3 |
| Rutas dinámicas (ƒ) | 56 | 124 |
| `Cache-Control` de las páginas | `s-maxage=31536000` o `s-maxage=21600, stale-while-revalidate` (las sirve el CDN sin invocar una función) | `private, no-cache, no-store` en todas |
| Compilación | 21 s | 42 s |
| TTFB de un artículo del blog (local, `next start`) | 8–32 ms (caché) | 552–613 ms (~60×) |

(El TTFB dinámico local incluye un intento de conexión a la base de datos que falla en local y cae al disco; en producción será una consulta real. El orden de magnitud vale, la cifra exacta no.)

Es decir: el nonce global convierte **88 páginas públicas** en 88 invocaciones de función por visita, sin caché de CDN, justo en el contenido de más tráfico (blog y herramientas).

En cambio, el área de administración y la de errores de autenticación son pequeñas y ya dinámicas: las 7 rutas bajo `/admin` son `ƒ` hoy, y la única estática bajo `/auth` es `/auth/error` (pasa de 5 a 16 ms en local).

---

## Decision / Decisión

**CSP por niveles. Es una desviación deliberada de «CSP estricta, sin `'unsafe-inline'`, en todo el sitio».**

1. **Nivel 1 — `/admin/*` y `/auth/*`: CSP con nonce y sin `'unsafe-inline'` en `script-src`.** Se genera en `src/proxy.ts`, cuyo `matcher` se limita a esas rutas (más `/api/*` para CORS, como hasta ahora). Las rutas de nivel 1 se renderizan por petición.
2. **Nivel 2 — el resto del sitio (páginas públicas): se mantiene `script-src 'self' 'unsafe-inline'`**, con la política estática de `next.config.mjs`. Las rutas de nivel 1 se excluyen de esa política estática para que no haya dos CSP en la misma respuesta.
3. **No se pone nonce en las páginas públicas** mientras eso implique renderizado por petición (ver Consecuencias → condiciones de revisión).

### Qué compensa `'unsafe-inline'` en las páginas públicas

`'unsafe-inline'` permite que un script en línea inyectado se ejecute. No se acepta sin más: se acota lo que ese script puede hacer y, sobre todo, se evita que llegue a inyectarse:

- **Evitar la inyección (primera línea):**
  - `safeJsonLd` escapa `<`, `>`, `&` y los separadores de línea en el JSON-LD en línea.
  - `safe-rich-text` escapa primero y solo después reconoce Markdown; los enlaces pasan por una lista blanca de esquemas (`isSafeLinkUrl`); el contenido de bloques y código es opaco.
  - Escape de salida de React en todo lo demás; el contenido de los artículos es datos, no HTML crudo.
  - Validación Zod estricta en los límites de entrada (SEC-002 a SEC-005): una clave desconocida o un valor fuera de forma es un 400.
- **Acotar lo que puede hacer un script inyectado (segunda línea):**
  - `connect-src 'self'` **y nada más** (SEC-006): un script inyectado no tiene un destino de red al que enviar datos con `fetch`/XHR/beacon. Los proxies a terceros pasan por `/api/*` del mismo origen y están limitados por IP. Hasta SEC-006 la política también admitía `https://www.google-analytics.com` y `https://vitals.vercel-insights.com`; ninguno se usaba (ver «Analítica y destinos de red» más abajo) y Google Analytics, en concreto, habría sido un canal de salida utilizable (un evento admite parámetros arbitrarios).
  - `object-src 'none'` (sin plugins), `base-uri 'self'` (no se puede cambiar la base de las URL relativas), `frame-ancestors 'none'` (sin clickjacking), `form-action 'self' https://accounts.google.com` (un formulario inyectado no envía a un dominio ajeno).
  - Sin `'unsafe-eval'` en producción (SEC-005b) y sin orígenes de scripts de terceros (Google Tag Manager retirado).
  - `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` restrictiva.
  - Sesión en cookie de NextAuth (JWT); las acciones de administración exigen rol en el servidor, no en el cliente.

### Límite que esta decisión reconoce

El nonce protege las páginas de `/admin` y `/auth`. **El formulario de inicio de sesión (`AuthModal`) se muestra en páginas públicas**, que siguen con `'unsafe-inline'`: un script inyectado en una página pública podría actuar sobre ese formulario. Por eso la primera línea (no inyectar) y `connect-src`/`form-action` (no exfiltrar) son las defensas que cuentan en el nivel 2, y por eso se documentan aquí.

Fuera del alcance del nivel 1: `/ia|ambiental/autor/herramientas/proyectos-investigacion/admin`, que cuelgan de los portales y no de `/admin/*`.

---

## Consequences / Consecuencias

### Positive / Positivas
- Las páginas de administración y de errores de autenticación no admiten scripts en línea sin nonce.
- Las 88 páginas públicas prerenderizadas conservan caché de CDN, TTFB de milisegundos y sin coste de función por visita.
- El nivel 1 reutiliza el `proxy.ts` existente; no añade infraestructura nueva.

### Negative / Negativas
- Las páginas públicas conservan `'unsafe-inline'` en `script-src`: un fallo de escape que permitiera inyectar un `<script>` en línea no lo frenaría la CSP (sí lo acotarían `connect-src`, `form-action` y el resto).
- `/auth/error` pasa a renderizarse por petición.
- Cualquier servicio de terceros que el navegador deba llamar exige añadir su origen a `connect-src` (o pasar por un proxy propio) y una prueba que lo justifique.
- Hay dos políticas que mantener; una prueba (`csp.test.ts`) fija que las rutas de nivel 1 reciben la de nonce y no la estática, y que las de nivel 2 reciben la estática.

### Neutral
- Esta decisión no cambia `style-src 'unsafe-inline'`, necesario hoy para los estilos en línea de Next y las bibliotecas de mapas.

### Analítica y destinos de red (SEC-006)
Cada destino de `connect-src` es un canal por el que un script inyectado puede sacar datos, así que cada uno debe tener un uso real. Verificado el 2026-11-21:
- **Google Analytics: no se carga en ningún sitio.** Solo había un `dns-prefetch` en el layout (retirado) y llamadas a `window.gtag` en `lib/track-env.ts`, que nunca existe. `trackViewList` y `trackAffiliateClick` (tarjetas de recomendaciones) son hoy un no-op: **el sitio no mide clics de afiliados ni listados**. Quien quiera esos datos tendrá que cargar GA o usar eventos de `@vercel/analytics`, y abrir la CSP a conciencia.
- **`vitals.vercel-insights.com`: no se usa.** `@vercel/analytics` 2.x carga `/_vercel/insights/script.js` y envía a `/_vercel/insights/event`, ambos del mismo origen. Ni Next 16.4.5 ni el código del sitio lo referencian.
- **Sentry en el navegador: inerte por falta de DSN**, no por la CSP (no hay `NEXT_PUBLIC_SENTRY_DSN` ni `SENTRY_DSN` en producción). **Si algún día se configura el DSN del navegador, habrá que decidir entre un túnel (`/monitoring`, mismo origen) o permitir el host de ingesta en `connect-src`**; si no, los errores del navegador se bloquearían en silencio, que es el mismo patrón de instrumentación muda que ya se encontró con GA y con los avisos de proxy que el `logger` no emitía en producción.

### Condiciones de revisión (cuándo reabrir)
Se reabre si (a) Next permite aplicar nonce a páginas prerenderizadas sin renderizado por petición, o hashes de scripts en línea estables (CSP con `'sha256-…'` y `'strict-dynamic'`); (b) el tráfico o el coste de invocaciones deja de hacer relevante la caché de CDN; o (c) se detecta una vía de inyección en páginas públicas que la primera línea no cubra.

---

## Alternatives Considered / Alternativas consideradas

- **Nonce en todo el sitio**: es la CSP más estricta, pero cuesta la caché de CDN de 88 páginas públicas (tabla de arriba). Descartado por coste, no por seguridad.
- **Hashes (`'sha256-…'`) de los scripts en línea de Next en vez de nonce**: los scripts de arranque cambian en cada build y llevan datos de página; los hashes no son estables y obligarían a regenerar la política por página. No viable hoy.
- **Mantener todo como estaba (una sola CSP con `'unsafe-inline'`)**: deja sin protección reforzada precisamente las áreas con privilegio (administración). Descartado.
- **CSP en modo solo informe (`Report-Only`) con nonce en todo el sitio**: no bloquea y no aporta defensa; útil como medida, no como decisión. Puede usarse más adelante para vigilar el nivel 2.
