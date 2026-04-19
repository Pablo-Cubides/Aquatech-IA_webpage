# Spec: Arquitectura del Sistema (Turborepo + Next.js App Router)

Esta especificación detalla los límites arquitectónicos del monorepo. Todos los desarrollos de herramientas y páginas deben cumplir con estas barreras arquitectónicas.

## 1. Topología del Monorepo

El código está estructurado en un estilo **Turborepo**:
- `apps/web`: Contiene la aplicación web frontal orientada al usuario y las API REST/Server Actions. Todo el enrutamiento sucede aquí.
- `packages/@ia-next/database`: Encapsula la conexión a la base de datos PostgreSQL, el esquema de Prisma y los clientes compartidos.
- `packages/@ia-next/ui`: Componentes de interfaz de usuario desacoplados.

> **Nunca** importar Prisma o lógicas de base de datos directamente en archivos del cliente (`process.env` explícito de API Keys o DB queries).

## 2. Paradigma del Next.js App Router

### Componentes de Servidor (Server Components) por defecto
1. **Regla de Oro:** Todo componente en `apps/web/src/app` es un Componente de Servidor por defecto.
2. Hacer los *fetches* de datos directamente en el componente de manera asíncrona (`async function Page()`).

### Componentes de Cliente (Client Components)
1. **Regla de Oro:** Solo usar la directiva `"use client"` **en la rama final del árbol de componentes**. Es decir, crear micro-componentes de cliente en lugar de marcar páginas enteras como `"use client"`.
2. **Cuándo usarlos:**
   - Si se usan hooks de React (`useState`, `useEffect`).
   - Si se adjuntan escuchadores de eventos del DOM (`onClick`).

## 3. Manejo de APIs (Server Actions vs Route Handlers)
- Usar **Server Actions** SIEMPRE que sea posible para la mutación de datos (ej. enviar formularios) debido a su estrecha integración con TypeScript.
- Mantener los **Route Handlers** (`app/api/...`) estrictamente para integraciones externas (como webhooks de MercadoPago).

## 4. Gestión de Estáticos (Prerenderizado vs Dinámico)
- En lo posible, todas las landing pages y artículos de blogs estáticos deben ser generados y cacheados en Build Time. 
- Evitar usar `cookies()` o `headers()` en landing pages informativas que arruinarían la ventaja de carga ultrarrápida en el CDN de Vercel.
