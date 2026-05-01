# 🤖 IA-Next Platform

Modern Next.js monorepo for AI-powered applications with dual-themed portals and comprehensive integrations.

Full developer documentation: `docs/MASTER_DOCUMENTATION.md`

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (Node.js runtime)
- **Database**: Supabase PostgreSQL + Prisma ORM
- **Auth**: Firebase Authentication + Google OAuth
- **Payments**: MercadoPago integration
- **Email**: Brevo transactional emails
- **Monitoring**: Sentry error tracking
- **Rate Limiting**: Upstash Redis

## � Project Structure

```
apps/
├── web/         # Frontend application
└── api/         # Backend API routes
packages/
├── @ia-next/ui/                 # UI components
├── @ia-next/database/           # Database client
├── @ia-next/eslint-config/      # Linting rules
├── @ia-next/prettier-config/    # Code formatting
└── @ia-next/typescript-config/  # TypeScript configs
```

## 🎨 Features

### **Dual Portal System**

- **IA Portal**: Dark theme for AI tools and services
- **Environmental Portal**: Light theme for environmental solutions

### **Authentication**

- Firebase Authentication
- Google OAuth integration
- Secure session management

### **Payment Processing**

- MercadoPago Checkout Pro
- Webhook handling for payment status
- Credit system integration

### **Database**

- PostgreSQL with Supabase
- Prisma ORM for type-safe queries
- Automated migrations

## 🛠️ Development

### **Available Scripts**

```bash
# Development
pnpm dev          # Start all development servers
pnpm dev:web      # Start only web app
pnpm dev:api      # Start only API

# Building
pnpm build        # Build all applications
pnpm build:web    # Build web app only
pnpm build:api    # Build API only

# Database (ejecutar desde apps/api o usar --filter)
pnpm --filter @ia-next/api prisma:push      # Push schema changes to DB
pnpm --filter @ia-next/api prisma:studio    # Open Prisma Studio (visual DB interface)
pnpm --filter @ia-next/api prisma:migrate   # Create and apply migrations

# Linting & Formatting
pnpm lint         # Lint all packages
pnpm format       # Format code
```

### **Environment Variables**

Copy `.env.example` to `.env.local` and configure:

```bash
# Database
DATABASE_URL="your-supabase-connection-string"

# Authentication
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"

# Payments
MERCADOPAGO_ACCESS_TOKEN="your-mercadopago-token"

# Email
BREVO_API_KEY="your-brevo-api-key"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
```

## 🚀 Deployment

### **Production Checklist**

1. Configure environment variables in your hosting platform
2. Set up database in production environment
3. Configure OAuth redirect URLs for production domain
4. Update Brevo templates with production URLs
5. Set up Sentry error tracking for production

### **Build & Deploy**

```bash
# Build for production
pnpm build

# Test production build locally
pnpm start
```

## 📐 Spec-Driven Development (SDD)

This project follows Spec-Driven Development. Specifications are the source of truth — code serves the spec.

### Quick commands

```bash
# Create a new feature spec
pnpm spec:new <slug>
# Example: pnpm spec:new user-notifications

# Create a new blog article
pnpm content:new <portal> <slug>
# Example: pnpm content:new ia redes-neuronales-cnn

# Optimize an image
pnpm img:optimize <path> --context=<hero|inline|tool|author>
# Example: pnpm img:optimize ./tmp/hero.jpg --context=hero --cloudinary

# Validate content pipeline
pnpm lint:content    # Validate all article files
pnpm lint:specs      # Validate spec index integrity
pnpm img:budget      # Check all images against size budgets

# Full pre-push preflight
pnpm release:preflight
```

### SDD structure

```
.specify/
├── memory/
│   ├── constitution.md          # Immutable project principles
│   └── three-strikes-log.md     # Log of automation triggers
├── templates/                   # Spec, plan, tasks, ADR, content, image, release templates
├── scripts/                     # Automation scripts (new-feature, new-content, optimize-image, etc.)
└── instructions/                # AI agent operating rules

specs/                           # All feature specs (SPEC-NNN)
docs/
├── adr/                         # Architecture Decision Records
├── contracts/                   # Zod schemas, OpenAPI spec, JSON Schemas
└── domain/                      # Glossary, personas
.github/
├── prompts/                     # AI slash commands (/spec.new, /content.new, etc.)
└── pull_request_template.md     # PR template enforcing spec reference
```

### AI agent slash commands

| Command | Purpose |
|---|---|
| `/spec.new` | Bootstrap a new feature spec |
| `/spec.clarify` | Resolve open questions before approval |
| `/spec.plan` | Generate technical plan from approved spec |
| `/spec.tasks` | Break plan into atomic tasks |
| `/spec.analyze` | Validate implementation against spec |
| `/content.new` | Generate a new blog article |
| `/content.review` | Review article before publishing |
| `/image.audit` | Audit all images for budget/format compliance |
| `/release.preflight` | Run full preflight before push to main |
| `/three-strikes` | Create artifact for a repeated pattern |

**Full documentation**: [.specify/instructions/agent-sdd-workflow.md](.specify/instructions/agent-sdd-workflow.md)

---

## 📝 License

Private project - All rights reserved

---

**Built with ❤️ using Next.js, Turborepo, and modern web technologies.**

### Vercel Deployment

Set environment variables in Vercel dashboard:

- **Development**: `.env.development.local` values
- **Preview**: `.env.preview.local` values
- **Production**: `.env.production.local` values

## 🤖 AI-First Development

This project is optimized for AI-assisted development:

- **Copilot Instructions**: `.github/copilot-instructions.md`
- **Reusable Prompts**: `.github/prompts/*.prompt.md`
- **MCP Integration**: `.vscode/mcp.json` for GitHub and Playwright
- **VS Code Settings**: Optimized for Copilot Chat and Prompt Files

### Quick AI Commands

Use these in GitHub Copilot Chat:

- `/bootstrap-dev-env` - Set up development environment
- `/gen-readme` - Generate documentation from code
- `/scaffold-tests` - Create test structure

## 📁 Project Structure

### Apps

- **`apps/web/`**: Frontend Next.js application with dual portals
- **`apps/api/`**: Backend API with authentication, payments, and database

### Packages

- **`@ia-next/ui`**: Shared UI components and Tailwind configuration
- **`@ia-next/database`**: Prisma client and database utilities
- **`@ia-next/eslint-config`**: Shared ESLint rules
- **`@ia-next/prettier-config`**: Code formatting configuration
- **`@ia-next/typescript-config`**: TypeScript base configurations

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter web test
pnpm --filter api test
```

## 📝 Contributing

1. Follow conventional commits
2. Use TypeScript strictly
3. Maintain consistency between IA and Environmental portals
4. Write tests for new features
5. Update documentation

## 🔒 Security

- Environment variables for secrets
- Input validation on all API endpoints
- Firebase authentication with proper token validation
- Rate limiting on API endpoints
- CORS configuration for production

## 📄 License

[Your License Here]

Last updated: November 27, 2025
