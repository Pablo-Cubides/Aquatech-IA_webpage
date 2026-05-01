# SPEC-003 — Credit System (Balance, Consumption, Refund)
> **Status**: approved | **Owner**: Pablo Cubides | **Created**: 2026-04-28  
> **Plan**: [plan.md](plan.md) | **Tasks**: [tasks.md](tasks.md)

---

## 1. Problem

Premium tools on both portals require a gating mechanism that incentivizes payment without blocking free exploration. A credit system where users purchase credits and consume them per tool action provides: (1) granular monetization, (2) a free-tier path (tools that don't cost credits), and (3) business visibility into which tools are most valuable.

---

## 2. Users

| Persona | Role | How affected |
|---|---|---|
| Estudiante / Profesional | Credit spender | Consumes credits when using premium tools; needs clear balance visibility |
| Pablo (Instructor) | Observer | Monitors system health; can grant credits manually if needed |

---

## 3. User Stories

### US-001: View credit balance
```gherkin
As an authenticated user
I want to see my current credit balance at all times
So that I know if I can use a premium tool

Acceptance Criteria:
  Scenario: Balance visible in header
    Given I am signed in
    Then I can see my credit balance in the navigation header
    And it updates immediately after a purchase or consumption
```

### US-002: Consume credits when using a premium tool
```gherkin
As an authenticated user
I want credits deducted when I use a premium feature
So that the system correctly limits access to paid features

Acceptance Criteria:
  Scenario: Successful tool usage with sufficient credits
    Given I have 10 credits
    And a tool costs 2 credits
    When I trigger the premium action
    Then 2 credits are deducted atomically
    And my new balance is 8
    And the tool action executes

  Scenario: Insufficient credits
    Given I have 1 credit
    And a tool costs 2 credits
    When I trigger the premium action
    Then NO credits are deducted
    And I see a message: "Créditos insuficientes — necesitas 2, tienes 1"
    And I am offered a link to purchase more credits

  Scenario: Zero balance
    Given I have 0 credits
    When I try to use any premium tool
    Then I am shown the purchase credits flow
    And no credits are deducted
```

### US-003: Credit balance after payment
```gherkin
As a user who just completed a payment
I want my credit balance updated immediately
So that I can use the tools I just paid for

Acceptance Criteria:
  Scenario: Approved payment webhook received
    Given my balance is 5
    When MercadoPago sends an approved payment webhook for 10 credits
    Then my balance becomes 15
    And the transaction is recorded in the credit_transactions table

  Scenario: Balance update is atomic
    Given two concurrent requests attempt to credit the same payment
    Then only one succeeds (idempotency via payment_id unique constraint)
    And balance is only incremented once
```

---

## 4. Business Rules

- **BR-001**: Credit balance is always an integer ≥ 0. Fractional credits are not supported.
- **BR-002**: Credit deduction is atomic — if the tool action fails after deduction, credits are refunded.
- **BR-003**: Balance can never go below 0. Deduction attempts that would result in negative balance are rejected before any DB write.
- **BR-004**: Every credit movement (purchase, consumption, refund, manual grant) is recorded in `credit_transactions` with: user_id, amount, type, tool_slug (if consumption), payment_id (if purchase), timestamp.
- **BR-005**: Manual credit grants (by Pablo) require a note/reason in the transaction record.
- **BR-006**: Credit packs are defined as server-side constants — prices and credit amounts are not sent from the client.

---

## 5. Non-Functional Requirements

### Performance
- [x] Balance check: <50ms (cached after auth, refreshed on mutation).
- [x] Credit deduction: atomic DB transaction, completes in <200ms.

### Security
- [x] Credit amount and pack price determined server-side only — never from client input.
- [x] Authentication required for all credit operations.
- [x] Rate limit on credit consumption endpoints: 30 req/minute per user.

### Reliability
- [x] Atomic transactions: deduction and tool execution in same DB transaction where possible.
- [x] If tool action fails after deduction: automatic refund via compensating transaction.
- [x] All credit movements logged to `credit_transactions` table (audit trail).

---

## 6. Edge Cases & Error Scenarios

| Scenario | Expected behavior |
|---|---|
| Race condition: two requests consume credits simultaneously | DB-level row lock or atomic UPDATE WHERE balance >= cost; only one succeeds |
| Tool action fails after credit deduction | Compensating transaction adds credits back; user sees original balance |
| DB unreachable during deduction | Return 503; NO credits deducted; show user-facing error |
| Negative balance in DB (shouldn't happen) | Application-level check catches this; log Sentry critical alert |
| User requests credit history | Not in scope for this spec — future SPEC |

---

## 7. Out of Scope

- Credit expiry / expiration dates.
- Credit transfer between users.
- Credit history UI (future spec).
- Promotional credit codes / discount system.
- Per-tool pricing UI (prices are defined as server-side constants).

---

## 8. Dependencies

| Dependency | Type | Notes |
|---|---|---|
| SPEC-002 (Auth) | Spec | User must be authenticated |
| SPEC-001 (Payments) | Spec | Credits added on payment webhook |
| `credit_transactions` Prisma model | DB | Must include: id, userId, amount, type, toolSlug?, paymentId?, note?, createdAt |
| `users.credit_balance` Prisma field | DB | Integer, default 0, minimum 0 constraint |

---

## Constitution Compliance Checklist

- [x] Zod validation on credit consumption request (§2.4).
- [x] Authentication required (§6).
- [x] Rate limiting on consumption endpoints (§6).
- [x] Credit amounts server-side only — never from client (§6 OWASP).
- [x] Atomic transactions via Prisma `$transaction` (§2.4).
- [x] All credit movements logged (§7 telemetry).
- [x] Errors to Sentry (§3.2).
