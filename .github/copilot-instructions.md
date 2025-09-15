# Copilot Instructions: IA-Next Monorepo

## Project Overview

This is a Next.js monorepo using Turborepo and pnpm workspaces, hosting dual portals: IA (dark theme) and Environmental (light theme). The project features modern authentication (Firebase), database management (Supabase + Prisma), payments (MercadoPago), and comprehensive tooling for IA-first development.

## Frontend Architecture & Design System

### **Portal Structure (App Router)**

```
app/
├── home/                    # Portal selector page
├── (portals)/
│   ├── ia/                 # IA Portal (dark theme)
│   │   ├── layout.tsx      # IA-specific layout
│   │   ├── (marketing)/    # Marketing pages group
│   │   │   ├── page.tsx    # IA Home
│   │   │   ├── nosotros/
│   │   │   ├── blog/
│   │   │   ├── herramientas/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   ├── cursos/
│   │   │   ├── autor/
│   │   │   └── perfil/     # Private route
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   └── ambiental/          # Environmental Portal (light theme)
│       └── [same structure as IA]
```

### **Component Architecture**

```
components/
├── ui/           # Base components (button, input, card, modal, etc.)
├── nav/          # Navigation (header, navbar, footer)
├── portal/       # Portal-specific (carousels, hero sections)
├── auth/         # Authentication (AuthModal, provider)
└── tools/        # Tool catalog (ToolCard, ToolDetailShell)
```

### **Design System Tokens**

#### **IA Portal (Dark Theme)**

- Background: `#10111A`
- Text: `white`
- Primary: `#00EFFF` (cyan)
- Secondary: `#0095FF` (blue)
- High contrast grays for secondary text and borders

#### **Environmental Portal (Light Theme)**

- Background: `#F5F9F8`
- Text: `#0D161C`
- Primary: `#0077B6` (blue)
- Accent: `#10B981` (green)
- Medium grays for secondary text and borders

#### **Shared Design Tokens**

- Border radius: `16px` (cards), `9999px` (pills)
- Spacing: `8, 12, 16, 24, 32px` consistent scale
- Typography: Space Grotesk (headlines), Noto Sans (body)
- Shadows: Subtle for cards, optimized per theme

### **Tools System**

#### **IA Tools Registry**

- "Cómo funciona un LLM"
- "Cómo funciona el sistema de difusión"
- "Cómo la IA filtra las respuestas"

#### **Environmental Tools Registry**

- "Visor de mapas ambientales"
- "Normas ambientales"
- "Generador de matrices de EIA"

#### **Tool Interface Requirements**

- Each tool: `slug, name, description, image, type, url, owner, version, status, SEO`
- Iframe handshake via postMessage: `ready, resize, error` events
- Auto-resize functionality with minimum height
- Sandbox security with conservative permissions
- Loading states, error handling, retry mechanisms

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js runtime - NEVER Edge runtime)
- **Database**: Supabase (PostgreSQL) + Prisma ORM with pooler (pgbouncer)
- **Auth**: Firebase Authentication (client-side) + ID token validation (server-side)
- **Payments**: MercadoPago Checkout Pro with webhook handling
- **Emails**: Brevo for transactional emails
- **Observability**: Sentry for error tracking
- **Rate Limiting**: Upstash Redis
- **Monorepo**: Turborepo + pnpm workspaces

## Development Guidelines

### Code Style & Conventions

- **Language**: TypeScript with strict mode enabled
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Components**: Small, reusable, single-purpose functions
- **File Size**: Keep files under 300-400 lines. If exceeded, suggest refactoring
- **Comments**: Well-commented code with JSDoc for functions and classes

### Architecture Patterns

- **Modular Architecture**: Reflected in folder structure
- **Separation of Concerns**: Clear boundaries between apps and packages
- **Type Safety**: Strongly typed interfaces for all API data
- **Security First**: Validate inputs, use environment variables for secrets

### Node.js Runtime Enforcement

- **CRITICAL**: All API routes MUST use Node.js runtime, never Edge runtime
- Add `export const runtime = "nodejs"` to every API route file
- Configure `next.config.mjs` to enforce Node.js runtime globally if needed

### Database Best Practices

- **Connection**: Always use Supabase pooler with `pgbouncer=true&connection_limit=1`
- **Queries**: Use Prisma client through `@ia-next/database` package
- **Migrations**: Run in development, deploy via Supabase dashboard in production

### Authentication & User Management

- **Firebase Auth**: Client-side authentication with server-side validation
- **User Profile**: Stored in Firestore (`usuarios` collection)
- **Profile Fields**: `uid, email, displayName, username, photoURL, bio, location, website, interests[], goals, credits, timestamps`
- **Route Guards**: `/perfil` is private, redirects to auth modal if not logged in

### SEO & Performance Requirements

- **Meta Tags**: Unique title/description per page, OG tags, Twitter cards
- **Canonical URLs**: Prevent IA/Environmental duplicate content
- **Sitemap**: Per portal with all public pages, exclude private routes
- **Images**: Optimized with alt text, free stock images until final assets
- **Performance Budget**: LCP < 2.5s mobile, CLS < 0.1
- **Accessibility**: WCAG compliance, keyboard navigation, screen reader support

### Content Guidelines

- **Language**: Spanish (neutral), technical-friendly tone
- **Free Images**: Use optimized stock photos until brand assets ready
- **SEO Content**: Brief explanatory text on tool pages for search indexing
- **Breadcrumbs**: Consistent structure (Home → Tools → [Tool Name])

### Analytics & Error Handling

- **Events**: `tool_opened, tool_ready, tool_error, auth_login, auth_register, profile_saved`
- **States**: Loading skeletons, empty states, error boundaries with retry
- **Alert Component**: Reusable with variants (info, success, warning, error)
  Pruebas: El comando para ejecutar pruebas unitarias es npm run test.  

Despliegue: El main branch es para producción. El dev branch es para staging. Usa preview deployments en Vercel.

Endpoints: Los API routes están en la carpeta app/api.

Base de Datos: La conexión a la base de datos se maneja a través de Prisma en los API routes. 6. ## Git

- Commits: **Conventional Commits**; usar Smart Action “Generate commit message”, luego editar si es necesario.
- PR: generar resumen con AI, incluir riesgos y pruebas manuales.

7. ## Agente y herramientas (MCP)

- Tiene acceso a GitHub MCP y Playwright MCP (si disponible). No ejecutar comandos destructivos sin confirmación.
- Al instalar dependencias, preferir pnpm; en Python, usar `.venv` local.

8. Tareas Comunes

- **Generar Resumen de PR**: Usar la Smart Action "Generate PR Summary".
- **Generar Mensaje de Commit**: Usar la Smart Action "Generate Commit Message".
- **Refactorizar Código**: Si un archivo supera las 300-400 líneas, sugerir refactorización.
- **Crear Componentes Reutilizables**: Identificar y crear componentes de UI que puedan ser reutilizados.
- **Añadir Tipado**: Asegurarse de que todo el código TypeScript esté fuertemente tipado.
- **Escribir Pruebas**: Añadir pruebas unitarias o E2E para nuevas funcionalidades o correcciones.
- **Revisar consistencia**: Asegurarse de que las versiones IA y ambiental mantengan una coherencia en diseño y funcionalidad, manteniendo el tema oscuro para IA y claro para ambiental.
- **Optimización de Rendimiento**: Identificar y resolver cuellos de botella en el rendimiento.
