# Presupuesto de JS inicial por página (OPS-003)

Puerta de CI **bloqueante** que vigila que ninguna página cargue más de 250 KB de JavaScript comprimido en su primer render (constitución §5.1) y que no crezca de golpe respecto a su estado conocido.

## Qué mide

Para cada ruta de `.specify/bundle-budget.json`, el script `.specify/scripts/bundle-size.mjs` levanta `next start`, pide el HTML y suma el tamaño **gzip (nivel 6)** de los `<script src>` y `<link rel="preload" as="script">` de ese HTML. Los chunks que se cargan después (`next/dynamic`, `import()` dentro de un manejador) **no cuentan**: es lo que se quiere diferir. Brotli (Vercel) pesa ~10-15 % menos, así que gzip es conservador.

## Dos umbrales, los dos bloquean

1. **Techo: 250 KB por página, sin excepciones.** Si una página necesita más, no se añade una lista de excepciones: se cambia la §5.1 de la constitución, de forma deliberada.
2. **Regresión: línea base + 8 KB.** `.specify/bundle-budget.json` guarda los KB medidos de cada página. Una página que supere `base + 8` falla.

## Falla cerrado

El script termina con código 1 (nunca "0 páginas, todo verde") si: el servidor no arranca o el puerto ya está ocupado, una ruta no responde 200, el HTML no trae scripts, la lista de páginas está vacía, una ruta no tiene línea base, o la medición supera 600 s. Un test de `apps/web` (`lib/analytics/__tests__/bundle-budget.test.ts`) exige además que las 12 herramientas de `PUBLIC_TOOLS` estén en la lista y que ninguna base sea `null`.

## Uso

```bash
pnpm build
pnpm bundle:budget            # levanta next start, mide, lo apaga (mismo comando que el CI)
```

En CI es el último paso del job `build` de `.github/workflows/ci.yml`; la tabla (KB, base, Δ, estado) sale en el resumen del job (`$GITHUB_STEP_SUMMARY`).

Para reproducir lo que ve el CI, construye y mide con las mismas variables que pone `ci.yml` (`NODE_ENV=production`, `DATABASE_URL` de relleno, `NEXTAUTH_*`, `UPSTASH_*`). Una web nueva (herramienta, ruta importante) se añade a `pages` con valor `null` y se rellena con `--update-baseline`.

## Cuando falla

- **`REGRESION`**: la página creció más de 8 KB. Casi siempre es un `import` estático de una librería pesada (xlsx, recharts, jspdf, papaparse, html-to-image, un SDK). Cárgala con `import()` dentro del manejador o con `next/dynamic` y un estado de carga (como `analisis-correlaciones`, 586 → 179 KB en OPS-002).
- **`SOBRE_TECHO`**: igual, pero ya por encima de 250 KB.
- **`ERROR` / `SIN_BASE`**: la medición no es válida (ruta caída, HTML sin scripts, ruta nueva sin base). No se arregla subiendo el umbral.

## Subir una línea base (excepcional)

Solo si el aumento es deliberado y no hay forma razonable de diferirlo:

```bash
pnpm build && node .specify/scripts/bundle-size.mjs --serve --update-baseline
```

**Reglas:** cada subida de una base va en un **commit propio**, con la **página, el delta en KB y el porqué** en el mensaje. **El coordinador revisa `.specify/bundle-budget.json` en cada integración.** Bajar una base (porque una página mejoró) no necesita justificación.

## Línea base inicial

Medida el 2026-11-21 sobre `c6828c4` con el entorno de `ci.yml`: de 159,3 KB (`/`) a 203,3 KB (`/ambiental/herramientas/visor-mapas-ambientales`, la más pesada, a 46,7 KB del techo). Tres corridas del mismo build: 0,00 KB de dispersión. Si el primer run real de CI difiere en más de 2 KB en alguna página, se ajusta la base en un commit propio explicando la diferencia.
