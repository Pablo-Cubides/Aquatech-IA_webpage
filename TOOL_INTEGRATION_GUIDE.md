# 🔧 Guía de Integración de Herramientas Educativas

## Tabla de Contenidos

1. [Overview](#overview)
2. [Pre-Requisitos](#pre-requisitos)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Flujo de Integración](#flujo-de-integración)
5. [Checklist Técnico](#checklist-técnico)
6. [Configuración de NextAuth](#configuración-de-nextauth)
7. [Integración de Sentry](#integración-de-sentry)
8. [Configuración de Enlaces](#configuración-de-enlaces)
9. [Verificación Pre-Deploy](#verificación-pre-deploy)
10. [Deploy a GitHub](#deploy-a-github)

---

## Overview

Este documento define el proceso estándar para integrar nuevas herramientas educativas interactivas en el monorepo Aquatech IA.

**Herramientas a Integrar**:

1. ✅ **Como Funcionan los LLM** - Completada (referencia)
2. ⏳ **Cómo Funcionan los Modelos de Difusión** - En progreso
3. ⏳ **Cómo la IA Filtra las Respuestas** - Pendiente

**Portales**:

- **IA Portal** (Dark Theme): `/ia/herramientas/{slug}`
- **Environmental Portal** (Light Theme): `/ambiental/herramientas/{slug}`

---

## Pre-Requisitos

### Antes de Comenzar

1. **Acceso a Repositorios**
   - GitHub personal para clonar repositorios de herramientas
   - Credenciales de git configuradas

2. **Dependencias Globales**

   ```bash
   node --version  # v20.x o superior
   pnpm --version  # v9.x o superior
   ```

3. **Monorepo Actualizado**

   ```bash
   cd d:\Empresas\AquatechIA\webpage
   git pull origin main
   pnpm install
   ```

4. **Variables de Entorno**
   - `.env.local` debe tener:
     - `NEXT_PUBLIC_BASE_URL`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`
     - `SENTRY_AUTH_TOKEN`

---

## Estructura de Carpetas

### Patrón Estándar

```
apps/web/src/app/(portals)/{PORTAL}/{GROUP}/herramientas/{TOOL_SLUG}/
├── page.tsx                      # Wrapper que re-exporta de ./src/app/page
├── src/
│   ├── app/
│   │   ├── layout.tsx            # ⭐ Con NextAuth + Sentry setup
│   │   ├── page.tsx              # Componente principal de la app
│   │   ├── globals.css           # Estilos self-contained
│   │   ├── api/
│   │   │   └── log/
│   │   │       └── route.ts      # ❌ REMOVER - usar Sentry en su lugar
│   │   └── components/
│   │       ├── Step1.tsx
│   │       ├── Step2.tsx
│   │       └── ...
│   ├── context/
│   │   ├── AppContext.tsx        # State management
│   │   └── __tests__/
│   │       ├── context.test.ts
│   │       └── reducer.test.ts
│   ├── utils/
│   │   ├── algorithms.ts         # Lógica principal
│   │   ├── analytics.ts          # ⭐ Integración Sentry
│   │   └── __tests__/
│   │       ├── algorithm.test.ts
│   │       └── utils.test.ts
│   └── types/
│       └── index.ts              # Interfaces TypeScript
├── REMOVED (antes de integrar):
│   ❌ package.json
│   ❌ vitest.config.ts
│   ❌ next.config.mjs
│   ❌ tsconfig.json
│   ❌ .git/
│   ❌ .github/
│   ❌ Backup files (page_old.tsx, etc)
│   ❌ In-memory API endpoints
```

### Variables de Carpeta

| Variable      | Valor (Ejemplo)      | Descripción                       |
| ------------- | -------------------- | --------------------------------- |
| `{PORTAL}`    | `ia` o `ambiental`   | Portal destino                    |
| `{GROUP}`     | `(marketing)`        | Grupo de rutas (entre paréntesis) |
| `{TOOL_SLUG}` | `como-funcionan-llm` | URL-friendly slug                 |

### Ejemplos Reales

**IA Portal - Marketing:**

```
apps/web/src/app/(portals)/ia/(marketing)/herramientas/como-funcionan-llm/
apps/web/src/app/(portals)/ia/(marketing)/herramientas/modelos-difusion/
apps/web/src/app/(portals)/ia/(marketing)/herramientas/filtrado-ia/
```

**Environmental Portal:**

```
apps/web/src/app/(portals)/ambiental/(marketing)/herramientas/visor-mapas-ambientales/
```

---

## Flujo de Integración

### Paso 1: Clonar Repositorio

```bash
# Ir a carpeta temporal
cd d:\Temp

# Clonar herramienta
git clone https://github.com/{OWNER}/{REPO_NAME}.git {TOOL_SLUG}

# Entrar
cd {TOOL_SLUG}
```

**Ejemplo Real:**

```bash
cd d:\Temp
git clone https://github.com/YOUR_GITHUB/modelos-difusion.git modelos-difusion
cd modelos-difusion
```

### Paso 2: Limpiar Archivos Innecesarios

```bash
# En Windows PowerShell dentro de la carpeta clonada:

# Remover archivos de configuración
Remove-Item -Force package.json
Remove-Item -Force package-lock.json
Remove-Item -Force pnpm-lock.yaml
Remove-Item -Force vitest.config.ts
Remove-Item -Force next.config.mjs
Remove-Item -Force tsconfig.json
Remove-Item -Force postcss.config.mjs
Remove-Item -Force eslint.config.mjs
Remove-Item -Force vercel.json

# Remover carpetas de sistema
Remove-Item -Recurse -Force .git
Remove-Item -Recurse -Force .github
Remove-Item -Recurse -Force .vscode
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force dist
Remove-Item -Recurse -Force coverage

# Remover archivos de documentación de proyecto (si no son necesarios)
Remove-Item -Force README.md
Remove-Item -Force CONTRIBUTING.md
Remove-Item -Force LICENSE

# Remover archivos de respaldo/test
Get-ChildItem -Filter "*_old.tsx" -Recurse | Remove-Item
Get-ChildItem -Filter "*_new.tsx" -Recurse | Remove-Item
Get-ChildItem -Filter "test-*.tsx" -Recurse | Remove-Item
Get-ChildItem -Filter "page_backup.tsx" -Recurse | Remove-Item
```

### Paso 3: Copiar a Monorepo

```bash
# Desde d:\Temp\{TOOL_SLUG}, copiar TODO al destino que se especifique puede ser en un portal ambos segun indicacion


# IA Portal Example:
Copy-Item -Recurse -Force "d:\Temp\modelos-difusion\*" `
  "d:\Empresas\AquatechIA\webpage\apps\web\src\app\(portals)\ia\(marketing)\herramientas\modelos-difusion\"

# Environmental Portal Example:
Copy-Item -Recurse -Force "d:\Temp\visor-mapas\*" `
  "d:\Empresas\AquatechIA\webpage\apps\web\src\app\(portals)\ambiental\(marketing)\herramientas\visor-mapas-ambientales\"
```

### Paso 4: Actualizar layout.tsx

**Copiar template de referencia:**

```bash
# Copiar del proyecto ya integrado
Copy-Item `
  "d:\Empresas\AquatechIA\webpage\apps\web\src\app\(portals)\ia\(marketing)\herramientas\como-funcionan-llm\src\app\layout.tsx" `
  "d:\Empresas\AquatechIA\webpage\apps\web\src\app\(portals)\ia\(marketing)\herramientas\modelos-difusion\src\app\layout.tsx"
```

**Actualizar metadatos** en el nuevo layout.tsx:

```typescript
// CAMBIAR ESTOS VALORES:
title: "ExploraModelo | Aprende cómo funcionan los Modelos de Difusión paso a paso"
description: "Aplicación educativa..."
canonical: "/ia/herramientas/modelos-difusion"  // ⭐ Importante

// En schema.json-LD:
"name": "ExploraModelo - Modelos de Difusión"
"url": process.env.NEXT_PUBLIC_BASE_URL + "/ia/herramientas/modelos-difusion"
```

### Paso 5: Actualizar analytics.ts

**Copiar template:**

```bash
Copy-Item `
  "d:\Empresas\AquatechIA\webpage\apps\web\src\app\(portals)\ia\(marketing)\herramientas\como-funcionan-llm\src\utils\analytics.ts" `
  "d:\Empresas\AquatechIA\webpage\apps\web\src\app\(portals)\ia\(marketing)\herramientas\modelos-difusion\src\utils\analytics.ts"
```

**Sin cambios requeridos** - Ya incluye Sentry genérico.

### Paso 6: Actualizar Context (si aplica)

Si la herramienta tiene contexto específico, actualizar solo nombres internos:

```typescript
// Cambiar nombres para distinguir:
// ProcessContext.tsx → DiffusionContext.tsx
// initialState → initialDiffusionState
// Mantener misma estructura
```

### Paso 7: Crear wrapper page.tsx

En: `apps/web/src/app/(portals)/ia/(marketing)/herramientas/{SLUG}/page.tsx`

```typescript
// Simple re-export del archivo real
export { default } from "./src/app/page";
```

### Paso 8: Configurar Enlaces

**Archivo:** `apps/web/src/app/(portals)/ia/(marketing)/herramientas/page.tsx`

Estructura esperada del componente (mantener este estilo):

```typescript
// Opción 1: Si es herramienta completada
{
  title: "Cómo Funcionan los Modelos de Difusión",
  description: "Explora paso a paso cómo los modelos de difusión generan imágenes",
  icon: "🎨",
  href: "/ia/herramientas/modelos-difusion",
  demo: "https://github.com/YOUR_ORG/modelos-difusion",
  status: "Disponible"
}

// Opción 2: Si es próximamente
{
  title: "Cómo la IA Filtra las Respuestas",
  description: "Comprende los mecanismos de filtrado y seguridad en IA",
  icon: "🔒",
  href: "/ia/herramientas/filtrado-ia",
  demo: "https://github.com/YOUR_ORG/filtrado-ia",
  status: "Próximamente"
}
```

---

## Checklist Técnico

### Antes de Verificar Build

- [ ] Carpeta creada en ubicación correcta
- [ ] Todos los archivos copiados (incluyendo nested `src/`)
- [ ] Archivos obsoletos removidos
- [ ] `layout.tsx` actualizado con metadatos correctos
- [ ] `analytics.ts` presente (copiado de template)
- [ ] `wrapper page.tsx` creado en raíz
- [ ] Enlaces configurados en `herramientas/page.tsx` principal
- [ ] Sin archivos `node_modules` o `.git`

### Build Verification

```bash
# Desde raíz del monorepo
cd d:\Empresas\AquatechIA\webpage

# Build test
pnpm --filter @ia-next/web build

# Verificar ruta en output:
# Γ£ô /ia/herramientas/modelos-difusion
# ├Æ /ia/herramientas/modelos-difusion/src/app  ← Debe aparecer

# Tests
pnpm --filter @ia-next/web test

# Debe pasar 180+ tests
```

### Error Comunes & Soluciones

| Error                                 | Causa                       | Solución                             |
| ------------------------------------- | --------------------------- | ------------------------------------ |
| `Cannot find module './src/app/page'` | Wrapper page.tsx incorrecto | Verificar export en `page.tsx` raíz  |
| `ENOENT: no such file or directory`   | Carpeta mal nombrada        | Usar kebab-case: `modelos-difusion`  |
| `Metadata error`                      | layout.tsx sin metadatos    | Copiar template y actualizar         |
| `Module resolution`                   | Paths relativos rotos       | Usar @/tools/llm alias solo en tests |
| 404 en herramienta                    | Enlaces no configurados     | Actualizar `herramientas/page.tsx`   |

---

## Configuración de NextAuth

### Estructura de layout.tsx

```typescript
import { getServerSession } from "next-auth/next";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="es">
      <body>
        <ProcessProvider user={session?.user}>
          {children}
        </ProcessProvider>
      </body>
    </html>
  );
}
```

### Actualizar ProcessProvider

```typescript
export function ProcessProvider({
  children,
  user,
}: {
  children: ReactNode;
  user?: any;
}) {
  const userRef = React.useRef(user);
  React.useEffect(() => {
    userRef.current = user;
  }, [user]);

  // ... resto del código
}
```

**Por qué**: Permite tracking de usuarios en analytics sin requerir login.

---

## Integración de Sentry

### En analytics.ts

Template ya incluido, estructura:

```typescript
import * as Sentry from "@sentry/nextjs";

export const logEvent = (
  eventName: string,
  params?: Record<string, unknown>,
  userId?: string,
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Event] ${eventName}`, params);
  }

  Sentry.captureMessage(`Tool Event: ${eventName}`, {
    level: "info",
    tags: { tool: "tool-slug", event: eventName },
    extra: params || {},
  });
};
```

### Uso en Componentes

```typescript
import { logEvent, trackToolEvent } from "@/tools/llm/utils/analytics";

// En componentes:
const handleStepChange = (step: number) => {
  trackToolEvent("step_changed", { step, toolName: "Diffusion" }, user?.email);
};

const handleError = (error: Error) => {
  trackError(error, { component: "DiffusionVisualization" }, user?.email);
};
```

---

## Configuración de Enlaces

### 1. Actualizar herramientas/page.tsx Principal

**Ubicación:**

```
apps/web/src/app/(portals)/ia/(marketing)/herramientas/page.tsx
```

Debe incluir array de herramientas con estructura:

```typescript
const TOOLS = [
  {
    id: "como-funcionan-llm",
    title: "Cómo Funcionan los LLM",
    description: "Explora paso a paso...",
    icon: "🧠",
    href: "/ia/herramientas/como-funcionan-llm",
    demoUrl: "https://github.com/user/como-funcionan-llm",
    status: "Disponible",
  },
  {
    id: "modelos-difusion",
    title: "Cómo Funcionan los Modelos de Difusión",
    description: "Visualiza la generación de imágenes...",
    icon: "🎨",
    href: "/ia/herramientas/modelos-difusion",
    demoUrl: "https://github.com/user/modelos-difusion",
    status: "Disponible",
  },
  {
    id: "filtrado-ia",
    title: "Cómo la IA Filtra las Respuestas",
    description: "Entiende mecanismos de seguridad...",
    icon: "🔒",
    href: "/ia/herramientas/filtrado-ia",
    demoUrl: "https://github.com/user/filtrado-ia",
    status: "Próximamente",
  },
];
```

### 2. Actualizar Breadcrumbs (si aplica)

Si hay navegación estructurada:

```typescript
// En componente:
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/ia">IA Portal</BreadcrumbItem>
  <BreadcrumbItem href="/ia/herramientas">Herramientas</BreadcrumbItem>
  <BreadcrumbItem current>Modelos de Difusión</BreadcrumbItem>
</Breadcrumb>
```

### 3. Actualizar Sitemap (automático)

El sitemap se genera automáticamente si:

- Ruta existe en estructura Next.js
- No está en `private_routes`

```typescript
// apps/web/src/app/sitemap.ts
const private_routes = ["/api", "/auth", "/perfil", "/admin"];
```

✅ Herramientas públicas se incluyen automáticamente.

---

## Verificación Pre-Deploy

### Checklist Final

```bash
# 1. Verificar estructura
ls -la apps/web/src/app/(portals)/ia/(marketing)/herramientas/modelos-difusion/
# Debe tener: page.tsx, src/

# 2. Build sin errores
pnpm --filter @ia-next/web build

# 3. Tests pasan
pnpm --filter @ia-next/web test

# 4. Revisar ruta en output
# Γ£ô /ia/herramientas/modelos-difusion ← Debe listarse

# 5. Revisar enlaces funcionan
# Visita: http://localhost:3000/ia/herramientas
# Verifica que enlace /ia/herramientas/modelos-difusion existe

# 6. Analytics funciona
# Abre herramienta, realiza acciones
# Verifica Sentry recibe eventos (en dashboard Sentry)

# 7. Verificar no hay archivos temporales
Get-ChildItem -Recurse -Include "*.tmp", "*.bak", ".DS_Store" |
  Remove-Item -Force

# 8. Git status limpio
git status
# Debe mostrar solo cambios intencionales
```

### Validación de Errores

```bash
# Mostrar todos los errores TypeScript
pnpm --filter @ia-next/web typecheck

# Mostrar lint issues
pnpm --filter @ia-next/web lint

# Ambos deben pasar o mostrar solo warnings
```

---

## Deploy a GitHub

### Paso 1: Verificación Final

```bash
# Desde raíz monorepo
cd d:\Empresas\AquatechIA\webpage

# Verificar estado
git status

# Debe mostrar:
# - apps/web/src/app/(portals)/ia/(marketing)/herramientas/modelos-difusion/
# - apps/web/src/app/(portals)/ia/(marketing)/herramientas/page.tsx (modificado)
# - NO debe haber node_modules, .git, package.json
```

### Paso 2: Agregar Cambios

```bash
# Agregar nueva herramienta
git add apps/web/src/app/(portals)/ia/(marketing)/herramientas/modelos-difusion/

# Agregar actualización de enlaces
git add apps/web/src/app/(portals)/ia/(marketing)/herramientas/page.tsx

# Revisar cambios
git status
```

### Paso 3: Commit

```bash
# Formato de commit:
git commit -m "feat: Add 'Modelos de Difusión' educational tool

- Integrate tool with NextAuth and Sentry analytics
- Add interactive step-based learning flow
- Create server-side analytics endpoint
- Configure tool links in tools registry
- Build verified: 35 routes generated, tool fully integrated
- Tests: 183/183 passing"
```

### Paso 4: Push a GitHub

```bash
# Push a main branch
git push origin main

# Verificar en GitHub
# https://github.com/Pablo-Cubides/Aquatech-IA_webpage
```

### Verificación Post-Deploy

1. **GitHub Actions** (si configurado)
   - Esperar que CI/CD termine
   - Verificar build success

2. **Vercel Preview** (si está conectado)
   - Visitar preview deployment
   - Probar herramienta en vivo
   - Verificar analytics en Sentry

3. **Production** (cuando esté listo)
   - Merge a rama de producción
   - Verificar en sitio en vivo

---

## Estructura de Commit por Herramienta

### Commit 1: Herramienta Base

```
feat: Add 'Tool Name' educational tool

- Integrate tool with NextAuth and Sentry analytics
- Configure metadata and SEO
- Add interactive UI components
- Tests: X/X passing
```

### Commit 2: Enlaces & Configuración

```
feat: Configure 'Tool Name' in tools registry

- Add tool to herramientas/page.tsx
- Update sitemap and breadcrumbs
- Configure canonical URLs
- Build verified: Y routes generated
```

---

## Troubleshooting

### Problema: "Module not found" en imports internos

```
ERROR: Cannot find module '../context/ProcessContext'
```

**Solución**: Verificar paths relativos en componentes:

```typescript
// ❌ INCORRECTO en monorepo
import { useProcess } from "../../../context/ProcessContext";

// ✅ CORRECTO
import { useProcess } from "@/tools/llm/context/ProcessContext";

// ✅ O relativo correcto desde ubicación
import { useProcess } from "../context/ProcessContext";
```

### Problema: Build incluye rutas duplicadas

```
❌ /ia/herramientas/modelos-difusion
❌ /ia/herramientas/modelos-difusion/src/app
```

**Solución**: Remover `src/app/layout.tsx` innecesarios o usar `metadata export`.

### Problema: Sentry no recibe eventos

```
ERROR: Sentry events not appearing in dashboard
```

**Verificación**:

1. `SENTRY_AUTH_TOKEN` configurado en `.env.local`
2. `@sentry/nextjs` inicializado en `instrumentation.ts`
3. Llamadas usan formato correcto: `Sentry.captureMessage()`
4. DSN correcto en Sentry dashboard

---

## Ejemplo Completo: Integrar "Modelos de Difusión"

### Resumen Paso a Paso

```bash
# 1. Clonar
cd d:\Temp
git clone https://github.com/user/modelos-difusion.git
cd modelos-difusion

# 2. Limpiar
Remove-Item -Force package.json, package-lock.json, vitest.config.ts, ...
Remove-Item -Recurse -Force .git, node_modules, .next

# 3. Copiar a monorepo
Copy-Item -Recurse "d:\Temp\modelos-difusion\*" `
  "d:\Empresas\AquatechIA\webpage\apps\web\src\app\(portals)\ia\(marketing)\herramientas\modelos-difusion\"

# 4. Actualizar metadatos
# Editar: src/app/layout.tsx - cambiar título, descripción, slug

# 5. Crear wrapper
# apps/web/src/app/(portals)/ia/(marketing)/herramientas/modelos-difusion/page.tsx
# export { default } from './src/app/page';

# 6. Actualizar enlaces
# Editar: apps/web/src/app/(portals)/ia/(marketing)/herramientas/page.tsx

# 7. Verificar build
cd d:\Empresas\AquatechIA\webpage
pnpm --filter @ia-next/web build

# 8. Tests
pnpm --filter @ia-next/web test

# 9. Commit
git add ...
git commit -m "feat: Add Modelos de Difusión tool"
git push origin main
```

---

## Referencias

- **Template de Referencia**: Como Funcionan los LLM (`apps/web/src/app/(portals)/ia/(marketing)/herramientas/como-funcionan-llm/`)
- **Monorepo Config**: `apps/web/tsconfig.json`, `apps/web/vitest.config.ts`
- **NextAuth Setup**: `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- **Sentry Config**: `instrumentation.ts` en raíz
- **Herramientas Principal Page**: `apps/web/src/app/(portals)/ia/(marketing)/herramientas/page.tsx`

---

**Última Actualización**: Octubre 30, 2025  
**Versión**: 1.0 - Template Establecido  
**Status**: Listo para nuevas herramientas
