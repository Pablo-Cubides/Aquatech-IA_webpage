# ADR-0004 — MercadoPago Checkout Pro for Payments
> **Status**: accepted | **Date**: 2025-10-01 | **Author**: Pablo Cubides

## Context
AquatechIA needs to monetize tools via a credit system. Users pay to acquire credits, which are consumed per tool usage. The primary market is Latin America (Colombia, Mexico, Argentina, Brazil). A payment processor with strong regional presence, PCI compliance, and a hosted checkout (no PCI scope on our server) was required.

### Forces
- Primary market: Latin America — local payment methods (PSE, Nequi, Efecty, OXXO) are essential.
- PCI compliance: prefer hosted checkout to avoid storing card data.
- Credit card support for international users.
- Developer experience: well-documented SDK for Node.js.
- Cost: transaction fees competitive with alternatives for the region.

## Decision
**We use MercadoPago Checkout Pro for all payment processing.**

Checkout Pro is MercadoPago's hosted checkout that handles the payment UI, PCI compliance, and regional payment method support. Our server creates a payment preference and redirects the user to MercadoPago's hosted page. The result is communicated via webhook.

## Consequences

### Positive
- Full PCI compliance handled by MercadoPago — no card data on our servers.
- Native support for PSE (Colombia), Nequi, Efecty, OXXO, and major credit cards.
- Webhook-based async payment confirmation — our system stays decoupled from the payment flow.
- Official Node.js SDK with TypeScript types.
- Sandbox environment available for testing without real transactions.

### Negative
- User leaves the platform for payment — potential drop-off at checkout.
- Webhook reliability requires idempotent processing (duplicate webhook handling needed).
- MercadoPago fees (2.99% + fixed per transaction) apply on every sale.

### Neutral
- International cards accepted via MercadoPago international routing.

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Stripe | Excellent globally, but no local LATAM payment methods (PSE, Nequi, Efecty) |
| PayU (LATAM) | Less mature SDK; more complex integration |
| Wompi (Colombia) | Colombia-only; no regional coverage |
| Custom card processing | PCI scope burden — not appropriate for a small team |

## Implementation Notes
- Constitution §6: "MercadoPago webhook signatures validated before processing."
- Webhook endpoint: `/api/webhooks/mercadopago`.
- Preference creation: `/api/payments/init`.
- Idempotency: payment ID stored in DB before crediting — duplicate webhooks are no-ops.
- Sandbox credentials in `.env.example`.
- See SPEC-001 for full payments spec.
- See `docs/contracts/openapi.yaml` for API contracts.
