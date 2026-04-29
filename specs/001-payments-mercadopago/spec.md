# SPEC-001 — MercadoPago Payment & Credit Purchase
> **Status**: approved | **Owner**: Pablo Cubides | **Created**: 2026-04-28  
> **Plan**: [plan.md](plan.md) | **Tasks**: [tasks.md](tasks.md) | **ADR**: [ADR-0004](../../docs/adr/0004-mercadopago-checkout-pro.md)

---

## 1. Problem

Users need to purchase credits to access premium tools on both portals. Without a payment system, there is no monetization mechanism. The platform must integrate with a payment processor that supports Latin American payment methods (PSE, Nequi, credit cards) without storing card data on our servers.

### Context
MercadoPago Checkout Pro is selected per ADR-0004. The integration involves creating a payment preference server-side and receiving async confirmation via webhook.

---

## 2. Users

| Persona | Role | How affected |
|---|---|---|
| Pablo (Instructor) | Admin | Can monitor payment activity; must never double-charge |
| Estudiante Universitario | Buyer | Purchases credits to access premium tool features |
| Profesional Ambiental | Buyer | Purchases credits for EIA matrix generation or correlation analysis |

---

## 3. User Stories

### US-001: Purchase credits
```gherkin
As a registered user
I want to purchase a credit pack via MercadoPago
So that I can use premium tools on the platform

Acceptance Criteria:
  Scenario: Successful payment
    Given I am authenticated
    And I select a credit pack
    When I complete payment on MercadoPago's checkout
    Then my credit balance increases by the purchased amount
    And I receive a confirmation on the platform

  Scenario: Payment cancelled
    Given I am on MercadoPago's checkout
    When I cancel the payment
    Then I am redirected back to the platform
    And my credit balance is unchanged

  Scenario: Payment pending (bank transfer / PSE)
    Given I complete a bank transfer payment
    When MercadoPago processes the async payment
    Then my credits are credited only after payment confirmation webhook
    And I see a "payment pending" status in the UI
```

### US-002: Idempotent webhook processing
```gherkin
As the payment system
I want to handle duplicate webhook notifications
So that users are never double-credited

Acceptance Criteria:
  Scenario: Duplicate webhook received
    Given a payment webhook for payment_id "ABC123" has already been processed
    When MercadoPago sends the same webhook again
    Then the system detects the duplicate (payment_id already in DB)
    And credits are NOT added a second time
    And the webhook returns 200 (do not trigger retries)
```

---

## 4. Business Rules

- **BR-001**: Credit balance can never go negative (enforced at DB level via constraint and application logic).
- **BR-002**: Credits are added only after a `payment.updated` webhook with `status: approved`.
- **BR-003**: Each payment is idempotent — MercadoPago payment ID is stored; duplicate webhooks are ignored.
- **BR-004**: Webhook signature must be validated before processing any payment event.
- **BR-005**: Payment preferences expire after 24 hours (MercadoPago default — do not override).
- **BR-006**: No partial credit refunds — refunds are full pack reversals only (handled manually for now).

---

## 5. Non-Functional Requirements

### Performance
- [x] Payment init endpoint responds in <500ms (preference creation is async to MercadoPago).
- [x] Webhook processing completes in <2s to avoid MercadoPago retry storms.

### Security
- [x] Webhook signature validation via `x-signature` header before any DB write.
- [x] Zod validation on all incoming webhook payloads.
- [x] Rate limit: 10 requests/minute per user on `/api/payments/init`.
- [x] Firebase auth required on `/api/payments/init`.

### Reliability
- [x] Idempotent webhook processing (BR-003).
- [x] Failed webhook processing logged to Sentry with full payload.
- [x] Vercel auto-retry NOT blocked (return 200 even on duplicate — MP won't retry 200s).

---

## 6. Edge Cases & Error Scenarios

| Scenario | Expected behavior |
|---|---|
| MercadoPago API unreachable on preference creation | Return 503 with user-facing message; log to Sentry; do NOT charge user |
| Invalid webhook signature | Return 400; log to Sentry; do not process |
| Unknown payment ID in webhook | Return 200 (prevent MP retry); log as warning |
| Credit DB write fails after valid webhook | Retry 3 times; if still failing, alert Sentry with `critical` severity |
| User submits payment form twice | Second request creates a new preference (user lands on same checkout URL) — idempotency at payment level, not preference level |
| Payment status `in_process` (pending) | Store payment record with `pending` status; do NOT credit yet |

---

## 7. Out of Scope

- Subscription / recurring payments.
- Partial refunds (manual process for now).
- Multiple currencies (MercadoPago COP / ARS / MXN — single currency per region, handled by MP).
- Invoice generation.
- Admin dashboard for payment monitoring.

---

## 8. Dependencies

| Dependency | Type | Notes |
|---|---|---|
| MercadoPago account | External service | Sandbox + production credentials in env |
| SPEC-002 (Auth) | Spec | User must be authenticated to purchase |
| SPEC-003 (Credits) | Spec | Credit crediting logic defined in SPEC-003 |
| `DATABASE_URL` | Env var | Supabase connection string |
| `MERCADOPAGO_ACCESS_TOKEN` | Env var | Required for preference creation |

---

## Constitution Compliance Checklist

- [x] Zod validation on all API inputs (§2.4).
- [x] Rate limiting via Upstash (§2.4, §6).
- [x] Firebase auth on payment init endpoint (§6).
- [x] Webhook signature validation (§6).
- [x] All errors to Sentry (§3.2).
- [x] No secrets in code (§6).
- [x] DB access only via `@ia-next/database` (§2.4).
