# 🎨 AquatechIA - Visual System Diagrams

> Comprehensive visual documentation for system understanding
>
> Last Updated: November 17, 2025

---

## 📊 System Overview

### Platform Ecosystem

```
                    ┌─────────────────────────────────────┐
                    │         USERS (Global)              │
                    │  ├─ Students (Academic Tools)       │
                    │  ├─ Environmental Engineers         │
                    │  ├─ Researchers                     │
                    │  └─ Companies                       │
                    └─────────────┬───────────────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │    ENTRY POINTS             │
                    ├─────────────────────────────┤
                    │  • aquatech-ia.com          │
                    │  • aquatech-ia.com/ia       │
                    │  • aquatech-ia.com/ambiental│
                    └─────────────┬───────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐     ┌──────────▼─────────┐    ┌────────▼────────┐
│  IA PORTAL     │     │  SHARED SERVICES   │    │ AMBIENTAL PORTAL│
│  (Dark Theme)  │     │                    │    │  (Light Theme)  │
├────────────────┤     ├────────────────────┤    ├─────────────────┤
│ • AI Tools     │────▶│ • Authentication   │◀───│ • Env. Tools    │
│ • LLM Education│     │ • Payments         │    │ • GIS Maps      │
│ • Visualizers  │     │ • Credit System    │    │ • Regulations   │
│ • Analytics    │     │ • Email Service    │    │ • EIA Matrices  │
└────────────────┘     │ • Rate Limiting    │    └─────────────────┘
                       │ • Caching (Redis)  │
                       │ • Logging (Sentry) │
                       └────────────────────┘
                                  │
                       ┌──────────▼──────────┐
                       │   DATA LAYER        │
                       ├─────────────────────┤
                       │ • PostgreSQL        │
                       │ • Upstash Redis     │
                       │ • File Storage      │
                       │ • CDN Assets        │
                       └─────────────────────┘
```

---

## 🏗️ Monorepo Structure

### Turborepo Workspace Layout

```
aquatech-ia/
│
├─── 🖥️  APPLICATIONS (2)
│    │
│    ├─── apps/web/ (:3000)
│    │    │
│    │    ├─── src/app/
│    │    │    ├─── (portals)/
│    │    │    │    ├─── ia/              ┐
│    │    │    │    │    ├─── (marketing) │ User-facing
│    │    │    │    │    └─── autor/      │ Admin-only
│    │    │    │    │                     ┘
│    │    │    │    └─── ambiental/       ┐
│    │    │    │         ├─── (marketing) │ User-facing
│    │    │    │         └─── autor/      │ Admin-only
│    │    │    │                          ┘
│    │    │    ├─── api/                  ← API Routes
│    │    │    ├─── layout.tsx            ← Root Layout
│    │    │    └─── middleware.ts         ← Edge Middleware
│    │    │
│    │    ├─── public/
│    │    │    ├─── images/
│    │    │    └─── data/json/            ← Regulations DB
│    │    │
│    │    └─── next.config.mjs
│    │
│    └─── apps/api/ (:3001)
│         │
│         ├─── src/app/api/
│         │    ├─── auth/                 ← Firebase verification
│         │    ├─── payments/             ← Payment creation
│         │    ├─── mp/webhook/           ← MercadoPago events
│         │    └─── email/webhook/        ← Brevo events
│         │
│         └─── prisma/schema.prisma       ← Database schema
│
├─── 📦 SHARED PACKAGES (5)
│    │
│    ├─── packages/@ia-next/database/
│    │    ├─── index.ts                   ← Prisma Client
│    │    └─── package.json
│    │
│    ├─── packages/@ia-next/ui/
│    │    ├─── components/                ← React components
│    │    ├─── tailwind.config.ts         ← Shared styles
│    │    └─── package.json
│    │
│    ├─── packages/@ia-next/typescript-config/
│    │    ├─── base.json
│    │    ├─── nextjs.json
│    │    └─── react.json
│    │
│    ├─── packages/@ia-next/eslint-config/
│    │    └─── index.js
│    │
│    └─── packages/@ia-next/matriz-generator/
│         ├─── src/                       ← Leopold/Conesa/Battelle
│         └─── package.json
│
├─── 🔧 CONFIGURATION
│    ├─── turbo.json                      ← Build orchestration
│    ├─── pnpm-workspace.yaml             ← Workspace definition
│    ├─── .env.example                    ← Environment template
│    └─── vercel.json                     ← Deployment config
│
└─── 📚 DOCUMENTATION
     ├─── README.md                        ← Quick start
     ├─── ARCHITECTURE.md                  ← This document
     └─── DIAGRAMS.md                      ← Visual guides
```

### Dependency Graph

```
┌─────────────────────────────────────────────────────────┐
│                    ROOT WORKSPACE                        │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   ┌─────────┐    ┌─────────┐    ┌──────────────┐
   │   WEB   │    │   API   │    │   PACKAGES   │
   │  (app)  │    │  (app)  │    │              │
   └────┬────┘    └────┬────┘    └───────┬──────┘
        │              │                  │
        │              │         ┌────────┼────────┐
        │              │         │        │        │
        ▼              ▼         ▼        ▼        ▼
   ┌─────────────────────────────────────────────────┐
   │  @ia-next/database (Prisma)                     │
   └─────────────────────────────────────────────────┘
        ▲              ▲
        │              │
        │    ┌─────────┼─────────┐
        │    │         │         │
   ┌────┴────┴─┐  ┌───┴───┐  ┌──┴─────────┐
   │ @ia-next/ │  │@ia-next│  │  @ia-next/ │
   │    ui     │  │ eslint │  │ typescript │
   └───────────┘  └────────┘  └────────────┘
```

---

## 🔄 Request Flow Diagrams

### 1. Authentication Flow (Google OAuth)

```
┌──────┐                                    ┌──────────┐
│ USER │                                    │  GOOGLE  │
└───┬──┘                                    └────┬─────┘
    │                                            │
    │ 1. Click "Sign in with Google"            │
    ├──────────────────────────────────┐        │
    │                                  │        │
    ▼                                  ▼        │
┌────────────────┐              ┌──────────────┴─────┐
│  BROWSER       │              │   NEXTAUTH.JS      │
│  (Client)      │              │   /api/auth/       │
└────────┬───────┘              │   signin           │
         │                      └──────────┬─────────┘
         │ 2. Redirect                     │
         │◀────────────────────────────────┤
         │                                 │
         │ 3. User authorizes              │
         ├─────────────────────────────────┼─────────▶
         │                                 │          │
         │ 4. Return auth code             │          │
         │◀────────────────────────────────┼──────────┤
         │                                 │
         │ 5. POST /api/auth/callback      │
         ├────────────────────────────────▶│
         │                                 │
         │                                 │ 6. Exchange code
         │                                 ├─────────────────▶
         │                                 │                 │
         │                                 │ 7. Access token │
         │                                 │◀────────────────┤
         │                                 │
         │                                 │ 8. Create/Update User
         │                                 ├─────────────────┐
         │                                 │                 │
         │                                 │ ┌───────────────▼────────┐
         │                                 │ │   DATABASE             │
         │                                 │ │   ├─ User              │
         │                                 │ │   ├─ Account           │
         │                                 │ │   └─ Session           │
         │                                 │ └────────────────────────┘
         │                                 │
         │ 9. Set session cookie           │
         │◀────────────────────────────────┤
         │                                 │
    ┌────┴────┐
    │ LOGGED  │
    │   IN    │
    └─────────┘
```

### 2. Payment Processing Flow

```
┌──────┐
│ USER │
└───┬──┘
    │ 1. Select credit package (100 credits = $10)
    │
    ▼
┌─────────────────────┐
│  FRONTEND           │
│  /ia/productos      │
└──────┬──────────────┘
       │ 2. POST /api/payments
       │    { packageId: 1, amount: 1000 }
       │
       ▼
┌─────────────────────┐
│  API SERVER         │
│  /api/payments      │
└──────┬──────────────┘
       │ 3. Create preference with MercadoPago SDK
       │    ├─ title: "100 Credits"
       │    ├─ unit_price: 1000
       │    ├─ external_reference: payment.id
       │    └─ notification_url: /api/mp/webhook
       │
       ▼
┌─────────────────────┐
│  DATABASE           │
│  Payment table      │
└──────┬──────────────┘
       │ 4. Save Payment (status: PENDING)
       │    payment_id: "pay_abc123"
       │    mercadopago_preference_id: "123456789"
       │
       ▼
┌─────────────────────┐
│  RETURN TO USER     │
│  { checkoutUrl: ... }│
└──────┬──────────────┘
       │ 5. Redirect user to MercadoPago checkout
       │
       ▼
┌──────────────────────┐
│  MERCADOPAGO         │
│  Checkout Page       │
│  (External)          │
└──────┬───────────────┘
       │ 6. User completes payment
       │    (Card, PIX, etc.)
       │
       ├────────────────────────┬─────────────────────┐
       │                        │                     │
       │ Success                │ Webhook (async)     │
       ▼                        ▼                     │
┌────────────────┐    ┌────────────────────┐        │
│ REDIRECT       │    │  /api/mp/webhook   │        │
│ /payment/      │    │                    │        │
│ success        │    │  POST {            │        │
└────────────────┘    │    id: 123456789,  │        │
                      │    status: "approved"│       │
                      │  }                 │        │
                      └──────┬─────────────┘        │
                             │ 7. Verify signature  │
                             │    (webhook secret)  │
                             │                      │
                             ▼                      │
                      ┌────────────────────┐        │
                      │  UPDATE DATABASE   │        │
                      │  ├─ Payment        │        │
                      │  │   status: APPROVED│      │
                      │  ├─ User            │        │
                      │  │   credits += 100│        │
                      │  └─ CreditLog      │        │
                      │      amount: +100  │        │
                      └──────┬─────────────┘        │
                             │ 8. Send confirmation │
                             │    email (Brevo)     │
                             │                      │
                             ▼                      │
                      ┌────────────────────┐        │
                      │  EMAIL SENT        │        │
                      │  "Payment Success" │        │
                      └────────────────────┘        │
```

### 3. Tool Usage Flow (Credit-Gated)

```
┌──────┐
│ USER │
└───┬──┘
    │ 1. Navigate to tool
    │    /ia/herramientas/visor-difusion
    │
    ▼
┌─────────────────────┐
│  PAGE COMPONENT     │
│  useSession()       │
└──────┬──────────────┘
       │ 2. Check authentication
       │
       ├─── Not logged in ───▶ Redirect to /auth/signin
       │
       ├─── Logged in ───┐
       │                 │
       ▼                 ▼
┌─────────────────────┐ ┌─────────────────────┐
│  CHECK CREDITS      │ │  TOOL CATALOG       │
│  session.user.      │ │  Tool.findUnique({  │
│  credits >= cost    │ │    name: "visor"    │
└──────┬──────────────┘ │  })                 │
       │                │  creditCost: 5      │
       │                └─────────────────────┘
       │
       ├─── Insufficient ───▶ Show "Buy Credits" modal
       │
       └─── Sufficient ───┐
                          │ 3. Use tool (generate, process)
                          │
                          ▼
                    ┌─────────────────────┐
                    │  POST /api/tools/   │
                    │  usage              │
                    │  {                  │
                    │    toolId: "visor", │
                    │    credits: 5       │
                    │  }                  │
                    └──────┬──────────────┘
                           │ 4. Deduct credits
                           │
                           ▼
                    ┌─────────────────────┐
                    │  DATABASE           │
                    │  BEGIN TRANSACTION  │
                    │  ├─ User.update({   │
                    │  │   credits -= 5   │
                    │  │ })               │
                    │  ├─ CreditLog.create│
                    │  │   amount: -5     │
                    │  │   reason: "tool" │
                    │  └─ ToolUsage.create│
                    │      toolId, userId │
                    │  COMMIT             │
                    └──────┬──────────────┘
                           │ 5. Return result
                           │
                           ▼
                    ┌─────────────────────┐
                    │  USER               │
                    │  Updated credits: 95│
                    │  Tool output shown  │
                    └─────────────────────┘
```

### 4. Regulations Query Flow (Cached)

```
┌──────┐
│ USER │
└───┬──┘
    │ 1. Search regulations
    │    pais=colombia&dominio=agua&sector=potable
    │
    ▼
┌─────────────────────────────────────────┐
│  GET /api/normas?pais=colombia&         │
│  dominio=agua&sector=potable            │
└──────┬──────────────────────────────────┘
       │ 2. Rate limit check (50/min)
       │
       ▼
┌─────────────────────────────────────────┐
│  UPSTASH REDIS (Layer 1)                │
│  Key: "normas:agua:colombia:potable"    │
└──────┬──────────────────────────────────┘
       │
       ├─── CACHE HIT ───▶ Return cached (85ms)
       │                   Header: X-Cache-Status: HIT
       │
       └─── CACHE MISS ───┐
                          │ 3. Read file from disk
                          │
                          ▼
                   ┌──────────────────────────────┐
                   │  FILE SYSTEM                 │
                   │  public/data/json/agua/      │
                   │  colombia.json               │
                   └──────┬───────────────────────┘
                          │ 4. Parse JSON (50MB file)
                          │    ~200ms
                          │
                          ▼
                   ┌──────────────────────────────┐
                   │  NORMALIZE DATA              │
                   │  ├─ Validate schema (Zod)    │
                   │  ├─ Map field names          │
                   │  ├─ Extract sector           │
                   │  └─ Enrich with sources      │
                   └──────┬───────────────────────┘
                          │ 5. Paginate (page=1, limit=50)
                          │
                          ▼
                   ┌──────────────────────────────┐
                   │  RESPONSE                    │
                   │  {                           │
                   │    records: [...50 items],   │
                   │    pagination: {             │
                   │      page: 1,                │
                   │      total: 450,             │
                   │      hasNext: true           │
                   │    }                         │
                   │  }                           │
                   └──────┬───────────────────────┘
                          │ 6. Cache result (TTL: 15min)
                          │
                          ▼
                   ┌──────────────────────────────┐
                   │  REDIS CACHE SET             │
                   │  SET "normas:agua:colombia:  │
                   │  potable" EX 900             │
                   └──────────────────────────────┘
                          │
                          ▼
                   ┌──────────────────────────────┐
                   │  USER                        │
                   │  Receives data (450ms total) │
                   │  Header: X-Cache-Status: MISS│
                   └──────────────────────────────┘
```

---

## 🗄️ Database Relationships

### User-Centric Schema

```
                        ┌─────────────────────┐
                        │        USER         │
                        │─────────────────────│
                        │ id: String (PK)     │
                        │ email: String ●     │
                        │ name: String?       │
                        │ role: UserRole      │
                        │ credits: Int        │
                        │ createdAt: DateTime │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
        ┌───────────▼────┐    ┌────▼────────┐    ┌────▼─────────┐
        │    Account     │    │  Session    │    │  Payment     │
        │────────────────│    │─────────────│    │──────────────│
        │ provider: Str  │    │ sessionToken│    │ amount: Dec  │
        │ access_token   │    │ expires     │    │ status: Enum │
        │ refresh_token  │    └─────────────┘    │ credits: Int │
        └────────────────┘                       └──────────────┘
                    │                                    │
                    │                                    │
        ┌───────────▼────┐                    ┌─────────▼──────┐
        │   CreditLog    │                    │  EmailEvent    │
        │────────────────│                    │────────────────│
        │ amount: Int    │                    │ event: Enum    │
        │ reason: String │                    │ status: Enum   │
        │ metadata: Json │                    │ email: String  │
        └────────────────┘                    └────────────────┘
                    │
        ┌───────────▼────┐
        │   ToolUsage    │
        │────────────────│────────┐
        │ credits: Int   │        │
        │ metadata: Json │        │
        └────────────────┘        │
                                  │
                        ┌─────────▼──────┐
                        │      Tool      │
                        │────────────────│
                        │ name: String   │
                        │ creditCost: Int│
                        │ isActive: Bool │
                        └────────────────┘
```

### Content Management

```
┌──────────────────┐
│     Content      │
│──────────────────│
│ id: String (PK)  │
│ slug: String ●   │
│ portal: Enum     │─── Portal.IA / Portal.AMBIENTAL
│ authorId: String │
│ isPublished: Bool│
└────────┬─────────┘
         │ 1:N
         │
         ▼
┌──────────────────┐
│  EditorSection   │
│──────────────────│
│ id: String (PK)  │
│ contentId: String│
│ type: String     │─── "text" | "image" | "code" | "embed"
│ data: Json       │
│ order: Int       │
└──────────────────┘
```

### Academic Tools

```
┌──────────────────┐
│   QuestionSet    │
│──────────────────│
│ id: Int (PK)     │
│ name: String ●   │
│ createdBy: Str?  │
└────────┬─────────┘
         │ 1:N
         │
         ▼
┌──────────────────┐
│    Question      │
│──────────────────│
│ id: Int (PK)     │
│ text: String     │
│ questionSetId    │
└──────────────────┘

┌──────────────────┐
│       Note       │
│──────────────────│
│ id: String (PK)  │
│ university: Str ●│
│ course: String ●│
│ code: String ●  │
│ grade: Float     │
│ studentName: Str?│
└──────────────────┘
```

---

## 🔐 Security Layers

### Defense in Depth

```
┌─────────────────────────────────────────────────────────┐
│                LAYER 1: NETWORK                          │
│  ├─ Vercel Edge Network (DDoS protection)               │
│  ├─ CDN (Static asset protection)                       │
│  └─ TLS 1.3 (Encrypted in transit)                      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                LAYER 2: APPLICATION                      │
│  ├─ Middleware (CORS, Security Headers)                 │
│  ├─ Rate Limiting (Upstash Redis)                       │
│  │   • 50 req/min for reads                             │
│  │   • 10 req/min for writes                            │
│  │   • Fail-closed for sensitive endpoints              │
│  └─ Input Validation (Zod schemas)                      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           LAYER 3: AUTHENTICATION                        │
│  ├─ NextAuth.js (Session management)                    │
│  ├─ Google OAuth (Identity provider)                    │
│  ├─ Database-backed sessions (not JWT)                  │
│  └─ Secure cookies (httpOnly, sameSite)                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           LAYER 4: AUTHORIZATION                         │
│  ├─ Role-based access (USER, ADMIN, MODERATOR)          │
│  ├─ Resource ownership checks                           │
│  ├─ Credit balance validation                           │
│  └─ Admin-only route protection                         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              LAYER 5: DATA                               │
│  ├─ Prisma ORM (SQL injection prevention)               │
│  ├─ Parameterized queries                               │
│  ├─ Database encryption at rest                         │
│  └─ Sensitive data hashing (passwords if stored)        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           LAYER 6: MONITORING                            │
│  ├─ Sentry (Error tracking + alerts)                    │
│  ├─ System logs (Database logging)                      │
│  ├─ Audit trails (CreditLog, AdminLog)                  │
│  └─ Health checks (/api/health)                         │
└─────────────────────────────────────────────────────────┘
```

### Rate Limiting Strategy

```
┌────────────────────────────────────────────────────────┐
│                 INCOMING REQUEST                        │
└──────────────────────┬─────────────────────────────────┘
                       │
         ┌─────────────▼────────────┐
         │  Extract identifier      │
         │  ├─ IP Address           │
         │  ├─ User ID (if auth)    │
         │  └─ API Key (if provided)│
         └─────────────┬────────────┘
                       │
         ┌─────────────▼────────────┐
         │  Check endpoint type     │
         └─────────────┬────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│  SENSITIVE │  │  STANDARD  │  │  HEALTH    │
│  Endpoints │  │  Endpoints │  │  Checks    │
├────────────┤  ├────────────┤  ├────────────┤
│ • /payment │  │ • /notes   │  │ • /health  │
│ • /admin   │  │ • /normas  │  │            │
│ • /delete  │  │ • GET APIs │  │ No limit   │
├────────────┤  ├────────────┤  └────────────┘
│ Limit:     │  │ Limit:     │
│ 10/min     │  │ 50/min     │
│ Fail: DENY │  │ Fail: ALLOW│
└─────┬──────┘  └─────┬──────┘
      │               │
      │  ┌────────────▼──────────┐
      │  │  UPSTASH REDIS        │
      │  │  Sliding Window       │
      │  │  ┌─────────────────┐  │
      └─▶│  │ Key: ip:endpoint│  │
         │  │ Count: 45       │  │
         │  │ Reset: 15s      │  │
         │  └─────────────────┘  │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  Under limit?         │
         └───────────┬───────────┘
                     │
         ┌───────────┼───────────┐
         │ YES       │ NO        │
         ▼           ▼
    ┌─────────┐ ┌──────────────┐
    │ ALLOW   │ │ DENY (429)   │
    │ Process │ │ Retry-After  │
    └─────────┘ └──────────────┘
```

---

## ⚡ Performance Optimization

### Caching Hierarchy

```
┌──────────────────────────────────────────────────────────┐
│                      USER REQUEST                         │
│               GET /api/normas?pais=colombia               │
└────────────────────────┬─────────────────────────────────┘
                         │
         ┌───────────────▼────────────────┐
         │  LEVEL 1: BROWSER CACHE         │
         │  Cache-Control: max-age=300     │
         │  ┌───────────────────────────┐  │
         │  │ HIT: Return immediately   │  │ ← 0ms (instant)
         │  │ MISS: Check Level 2       │  │
         │  └───────────────────────────┘  │
         └───────────────┬────────────────┘
                         │ MISS
         ┌───────────────▼────────────────┐
         │  LEVEL 2: VERCEL CDN            │
         │  Edge locations worldwide       │
         │  ┌───────────────────────────┐  │
         │  │ HIT: Return from edge     │  │ ← ~20ms
         │  │ MISS: Check Level 3       │  │
         │  └───────────────────────────┘  │
         └───────────────┬────────────────┘
                         │ MISS
         ┌───────────────▼────────────────┐
         │  LEVEL 3: UPSTASH REDIS         │
         │  Serverless Redis cache         │
         │  ┌───────────────────────────┐  │
         │  │ HIT: Return cached data   │  │ ← ~85ms
         │  │ MISS: Query database      │  │
         │  └───────────────────────────┘  │
         └───────────────┬────────────────┘
                         │ MISS
         ┌───────────────▼────────────────┐
         │  LEVEL 4: DATABASE QUERY        │
         │  PostgreSQL + PgBouncer         │
         │  ┌───────────────────────────┐  │
         │  │ Execute query             │  │ ← ~450ms
         │  │ Return result             │  │
         │  │ Cache in Redis            │  │
         │  └───────────────────────────┘  │
         └─────────────────────────────────┘
```

### Database Query Optimization

```
┌─────────────────────────────────────────────────────────┐
│               QUERY OPTIMIZATION FLOW                    │
└────────────────────┬────────────────────────────────────┘
                     │
     ┌───────────────▼────────────────┐
     │  1. INDEXING STRATEGY           │
     │  ────────────────────           │
     │  ├─ Primary Keys (default)      │
     │  ├─ Foreign Keys (auto)         │
     │  └─ Custom Indexes:             │
     │     • Note.university           │
     │     • Note.course               │
     │     • Note.code                 │
     │     • SystemLog.level           │
     │     • SystemLog.createdAt       │
     └───────────────┬────────────────┘
                     │
     ┌───────────────▼────────────────┐
     │  2. CONNECTION POOLING          │
     │  ────────────────────           │
     │  ┌──────────────────────────┐  │
     │  │  PGBOUNCER               │  │
     │  │  ├─ Pool size: 20        │  │
     │  │  ├─ Mode: Transaction    │  │
     │  │  └─ Timeout: 30s         │  │
     │  └──────────────────────────┘  │
     └───────────────┬────────────────┘
                     │
     ┌───────────────▼────────────────┐
     │  3. QUERY PATTERNS              │
     │  ────────────────────           │
     │  ✅ GOOD:                       │
     │     • Use WHERE clauses         │
     │     • Limit results (TAKE)      │
     │     • Use indexes               │
     │     • Batch inserts             │
     │                                 │
     │  ❌ BAD:                        │
     │     • SELECT * (all columns)    │
     │     • No LIMIT                  │
     │     • N+1 queries               │
     │     • Unindexed WHERE           │
     └───────────────┬────────────────┘
                     │
     ┌───────────────▼────────────────┐
     │  4. RESULT CACHING              │
     │  ────────────────────           │
     │  ├─ Hot queries → Redis         │
     │  ├─ Cold queries → Database     │
     │  └─ TTL based on volatility     │
     └─────────────────────────────────┘
```

### Code Splitting Strategy

```
┌──────────────────────────────────────────────────────────┐
│                    INITIAL BUNDLE                         │
│  ├─ Next.js runtime (~200KB)                             │
│  ├─ React runtime (~130KB)                               │
│  ├─ App shell (~150KB)                                   │
│  └─ Critical CSS (~40KB)                                 │
│  TOTAL: ~520KB (gzipped)                                 │
└────────────────────────┬─────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         │                                │
         ▼                                ▼
┌────────────────────┐         ┌────────────────────┐
│  LAZY LOADED       │         │  LAZY LOADED       │
│  (Route-based)     │         │  (Component-based) │
├────────────────────┤         ├────────────────────┤
│ • /ia/herramientas │         │ • ScatterPlot      │
│ • /ambiental       │         │   (recharts)       │
│ • /matrices        │         │ • MapComponent     │
│                    │         │   (maplibre-gl)    │
│ Load on navigate   │         │ • Papa (CSV)       │
│ ~150KB each        │         │ • XLSX parser      │
└────────────────────┘         │ Load on interaction│
                               │ ~50-200KB each     │
                               └────────────────────┘
```

---

## 📱 Responsive Design

### Breakpoint System

```
┌────────────────────────────────────────────────────────────┐
│                    DEVICE SPECTRUM                          │
└────────────────────────────────────────────────────────────┘

Mobile (sm)         Tablet (md)        Desktop (lg)        Wide (xl)
┌────────┐         ┌──────────────┐   ┌──────────────────┐ ┌─────────────────────┐
│        │         │              │   │                  │ │                     │
│  320px │   →     │    768px     │ → │     1024px       │→│       1280px        │
│   to   │         │      to      │   │       to         │ │         to          │
│  640px │         │   1024px     │   │     1280px       │ │       1920px+       │
│        │         │              │   │                  │ │                     │
└────────┘         └──────────────┘   └──────────────────┘ └─────────────────────┘

Layout:             Layout:            Layout:             Layout:
• Single column     • 2 columns        • 2-3 columns       • 3-4 columns
• Stack nav         • Sidebar          • Full sidebar      • Wide content
• Touch targets     • Hybrid nav       • Desktop nav       • Max-width: 1920px
  48px min          • Touch-friendly   • Hover states      • Side padding
```

### Component Adaptations

```
NAVIGATION:
┌─────────────────────────────────────────────────────────┐
│ Mobile (< 768px)         Tablet/Desktop (≥ 768px)       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌───────────────────────────┐│
│  │   [☰ Menu]   │         │ [Logo] Nav Nav Nav [User] ││
│  │              │         └───────────────────────────┘│
│  │  ┌────────┐  │                                       │
│  │  │ Logo   │  │         Persistent horizontal nav     │
│  │  └────────┘  │         with dropdowns                │
│  │              │                                       │
│  │ Drawer menu  │                                       │
│  │ (slides in)  │                                       │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘

DATA TABLES:
┌─────────────────────────────────────────────────────────┐
│ Mobile (< 768px)         Desktop (≥ 1024px)             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌───────────────────────────┐│
│  │ ┌──────────┐ │         │ │Name│Email│Role│Credits│││
│  │ │Name: John│ │         │ ├────┼─────┼────┼───────┤││
│  │ │Email: ...│ │         │ │John│j@...│USER│  100  │││
│  │ │Role: USER│ │         │ │Jane│j@...│ADMIN│ 500  │││
│  │ └──────────┘ │         │ └────┴─────┴────┴───────┘││
│  │ ┌──────────┐ │         │                           ││
│  │ │Name: Jane│ │         │ Full table with sorting   ││
│  │ │Email: ...│ │         │ and pagination            ││
│  │ └──────────┘ │         │                           ││
│  │              │         └───────────────────────────┘│
│  │ Card layout  │                                       │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Theme System

### Dual Portal Themes

```
┌───────────────────────────────────────────────────────────┐
│                      ROOT THEME                            │
│  ├─ CSS Variables                                          │
│  ├─ Tailwind Config                                        │
│  └─ Font: Inter (Variable)                                │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌──────────────────┐   ┌──────────────────┐
│   IA PORTAL      │   │ AMBIENTAL PORTAL │
│   (Dark Theme)   │   │  (Light Theme)   │
├──────────────────┤   ├──────────────────┤
│ Background:      │   │ Background:      │
│   #0a0a0a        │   │   #ffffff        │
│                  │   │                  │
│ Primary:         │   │ Primary:         │
│   #3b82f6 (blue) │   │   #10b981 (green)│
│                  │   │                  │
│ Accent:          │   │ Accent:          │
│   #8b5cf6 (purple│   │   #059669 (teal) │
│                  │   │                  │
│ Text:            │   │ Text:            │
│   #f9fafb        │   │   #111827        │
│                  │   │                  │
│ Components:      │   │ Components:      │
│   • Dark cards   │   │   • Light cards  │
│   • Glow effects │   │   • Shadows      │
│   • Neon accents │   │   • Subtle       │
└──────────────────┘   └──────────────────┘
```

### Color Palette

```
IA PORTAL (Dark):
┌────────┬────────┬────────┬────────┬────────┐
│ bg-900 │ bg-800 │ bg-700 │ bg-600 │ bg-500 │
│ #0a0a0a│ #1a1a1a│ #2a2a2a│ #3a3a3a│ #4a4a4a│
└────────┴────────┴────────┴────────┴────────┘
┌────────┬────────┬────────┬────────┬────────┐
│ blue   │ purple │ cyan   │ green  │ yellow │
│ #3b82f6│ #8b5cf6│ #06b6d4│ #10b981│ #f59e0b│
└────────┴────────┴────────┴────────┴────────┘

AMBIENTAL PORTAL (Light):
┌────────┬────────┬────────┬────────┬────────┐
│ bg-50  │ bg-100 │ bg-200 │ bg-300 │ bg-400 │
│ #f9fafb│ #f3f4f6│ #e5e7eb│ #d1d5db│ #9ca3af│
└────────┴────────┴────────┴────────┴────────┘
┌────────┬────────┬────────┬────────┬────────┐
│ green  │ teal   │ blue   │ amber  │ red    │
│ #10b981│ #059669│ #3b82f6│ #f59e0b│ #ef4444│
└────────┴────────┴────────┴────────┴────────┘
```

---

## 📦 Deployment Pipeline

### CI/CD Flow

```
┌──────────────────────────────────────────────────────────┐
│                    DEVELOPER                              │
│  git commit -m "feat: add pagination"                    │
│  git push origin feature/pagination                      │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│               GITHUB (Pull Request)                       │
│  ├─ Code review                                           │
│  ├─ Automated checks                                      │
│  └─ Merge to main                                         │
└────────────────────┬─────────────────────────────────────┘
                     │ Trigger
                     ▼
┌──────────────────────────────────────────────────────────┐
│            GITHUB ACTIONS (CI Pipeline)                   │
│  ┌────────────────────────────────────────────────────┐  │
│  │  JOB 1: Setup                                      │  │
│  │  ├─ Checkout code                                  │  │
│  │  ├─ Install pnpm                                   │  │
│  │  ├─ Cache node_modules                             │  │
│  │  └─ Install dependencies                           │  │
│  └────────────────────────────────────────────────────┘  │
│                         │                                 │
│       ┌─────────────────┼─────────────────┐              │
│       ▼                 ▼                 ▼              │
│  ┌─────────┐      ┌──────────┐      ┌────────┐          │
│  │ JOB 2:  │      │ JOB 3:   │      │ JOB 4: │          │
│  │ Lint    │      │Typecheck │      │ Test   │          │
│  │         │      │          │      │        │          │
│  │ ESLint  │      │ tsc      │      │ Vitest │          │
│  └─────────┘      └──────────┘      └────────┘          │
│       │                 │                 │              │
│       └─────────────────┼─────────────────┘              │
│                         ▼                                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │  JOB 5: Build                                      │  │
│  │  ├─ pnpm build                                     │  │
│  │  ├─ Generate artifacts                             │  │
│  │  └─ Upload build cache                             │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────┘
                     │ All checks pass
                     ▼
┌──────────────────────────────────────────────────────────┐
│                VERCEL (CD Pipeline)                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │  1. Detect push to main                            │  │
│  │  2. Clone repository                               │  │
│  │  3. Install dependencies                           │  │
│  │  4. Build applications                             │  │
│  │     ├─ apps/web                                    │  │
│  │     └─ apps/api                                    │  │
│  │  5. Deploy to edge network                         │  │
│  │  6. Run health checks                              │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────┘
                     │ Deployment successful
                     ▼
┌──────────────────────────────────────────────────────────┐
│                   PRODUCTION                              │
│  ✅ https://aquatech-ia.com                              │
│  ✅ Health checks passing                                │
│  ✅ Monitoring active (Sentry)                           │
└──────────────────────────────────────────────────────────┘
```

---

**Last Updated**: November 17, 2025  
**Maintained By**: Development Team  
**Related Docs**: ARCHITECTURE.md, README.md
