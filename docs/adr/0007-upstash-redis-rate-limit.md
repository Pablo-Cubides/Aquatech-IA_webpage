# ADR-0007 — Upstash Redis for API Rate Limiting
> **Status**: accepted | **Date**: 2025-10-01 | **Author**: Pablo Cubides

## Context
Public API endpoints (payments, credits, content serving) must be protected against abuse — both intentional (DDoS, scraping) and unintentional (runaway clients, buggy scripts). Rate limiting requires a shared state store that works in a serverless environment like Vercel (stateless, no persistent memory between requests).

### Forces
- Vercel serverless: each request runs in an isolated function — no in-memory state between requests.
- Rate limiting requires a shared counter store accessible to all function instances.
- Latency: the rate limit check must be fast (<10ms overhead) to not impact user experience.
- Cost: minimize additional services; prefer pay-per-use over reserved capacity.
- Simplicity: well-integrated with the existing stack.

## Decision
**We use Upstash Redis via `@upstash/ratelimit` and `@upstash/redis` for rate limiting all public-facing API endpoints.**

Upstash provides a serverless Redis HTTP API (REST-based), which works in Vercel edge and serverless functions without persistent TCP connections. The `@upstash/ratelimit` library implements sliding window and fixed window algorithms on top of it.

## Consequences

### Positive
- Stateless rate limiting that works across all Vercel instances.
- HTTP-based Redis client — works in Edge Runtime and Node.js runtime.
- Simple SDK with good TypeScript support.
- Generous free tier (10,000 requests/day free) — sufficient for early stage.
- Sliding window algorithm prevents burst abuse at window boundaries.

### Negative
- Adds a network call per rate-limited endpoint (~5-15ms).
- If Upstash is unreachable, rate limiting fails open (a trade-off — prefer availability over strict limiting).
- Cost scales with request volume — monitor as traffic grows.

### Neutral
- Redis used only for rate limiting. Not used as application cache or session store.

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| In-memory rate limiting | Doesn't work in serverless — each invocation is isolated |
| Vercel's built-in rate limiting | Limited customization; not available on all plans |
| Redis (self-hosted) | Requires managed infrastructure — operational overhead |
| Database-based rate limiting | Too slow for per-request overhead; adds DB load |

## Implementation Notes
- Constitution §2.4 + §6: "Upstash rate limiting on all public-facing API endpoints."
- Env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
- Rate limit policy per endpoint defined in the route handler (e.g., 10 req/10s for payments).
- Fail-open strategy: if Upstash is unreachable, request proceeds (logged to Sentry).
- See SPEC-001 (payments) and SPEC-002 (auth) for specific rate limit values per endpoint.
