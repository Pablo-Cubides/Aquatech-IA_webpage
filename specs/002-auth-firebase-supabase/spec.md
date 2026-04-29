# SPEC-002 — Authentication Flow (Firebase + NextAuth + Supabase)
> **Status**: approved | **Owner**: Pablo Cubides | **Created**: 2026-04-28  
> **Plan**: [plan.md](plan.md) | **Tasks**: [tasks.md](tasks.md) | **ADR**: [ADR-0003](../../docs/adr/0003-firebase-auth-supabase-db.md)

---

## 1. Problem

The platform needs users to be identifiable to enable credit purchases, personalized data, and instructor-specific tools. Authentication must support Google OAuth (primary) and must sync user identity from Firebase to Supabase so that relational data (credits, sessions) can be linked to a user record.

### Context
Three systems are involved (Firebase Auth, NextAuth, Supabase) per ADR-0003. They have distinct responsibilities and must not be conflated.

---

## 2. Users

| Persona | Role | How affected |
|---|---|---|
| All registered users | Auth subject | Must sign in to access premium features, credit balance, author tools |
| Pablo (Instructor) | Instructor role | Must authenticate to access Aula Score, Consulta Nota, Ruleta Académica |
| Estudiante / Profesional | Standard user | Must authenticate to purchase credits and see personal balance |

---

## 3. User Stories

### US-001: Sign in with Google
```gherkin
As a visitor
I want to sign in with my Google account
So that I can access premium features without creating a separate password

Acceptance Criteria:
  Scenario: First-time Google sign-in
    Given I am a new user
    When I click "Sign in with Google" and complete the OAuth flow
    Then a new user record is created in Supabase with my Firebase UID
    And a credit balance of 0 is initialized for me
    And I am redirected to the portal I came from

  Scenario: Returning user sign-in
    Given I have previously signed in
    When I complete the Google OAuth flow
    Then I am authenticated with my existing session
    And my credit balance and data are unchanged

  Scenario: OAuth cancelled
    Given I am on the Google OAuth prompt
    When I cancel the flow
    Then I am redirected back to the platform unauthenticated
    And no user record is created
```

### US-002: Protected route access
```gherkin
As an unauthenticated user
I want to be redirected to sign-in when accessing a protected route
So that I understand I need to log in

Acceptance Criteria:
  Scenario: Access author tool without auth
    Given I am not signed in
    When I navigate to /ia/autor/herramientas/aula-score
    Then I am redirected to the sign-in page
    And after sign-in I am returned to the original URL
```

### US-003: Session persistence
```gherkin
As an authenticated user
I want my session to persist across page reloads
So that I don't need to sign in repeatedly

Acceptance Criteria:
  Scenario: Reload while authenticated
    Given I am signed in
    When I reload the page
    Then I remain authenticated (NextAuth session cookie valid)
    And my credit balance is still visible
```

---

## 4. Business Rules

- **BR-001**: A user record in Supabase is created exactly once per Firebase UID — duplicate creation attempts are no-ops.
- **BR-002**: Firebase token is validated server-side on every protected API call — client-side auth state is not trusted.
- **BR-003**: Session expiry: NextAuth session token valid for 30 days. Firebase tokens expire in 1 hour (auto-refreshed by Firebase SDK client-side).
- **BR-004**: Instructor role is determined by a `role` field in the Supabase `users` table. Only Pablo's account has `role: 'instructor'`.
- **BR-005**: Users can only access their own data — no cross-user data access via the API.

---

## 5. Non-Functional Requirements

### Security
- [x] Firebase token validated server-side via Firebase Admin SDK on every protected endpoint.
- [x] Session cookie is `httpOnly`, `secure`, `sameSite: lax`.
- [x] CSRF protection via NextAuth built-in mechanisms.
- [x] No user PII beyond email and display name stored — only Firebase UID + email in Supabase.
- [x] Rate limit: 20 auth attempts per minute per IP on auth endpoints.

### Performance
- [x] Session check (<50ms) — cached by NextAuth, no DB call on each request.
- [x] First sign-in user sync to Supabase: <200ms.

### Accessibility
- [x] Sign-in page keyboard navigable.
- [x] Error messages announced via ARIA live regions.

---

## 6. Edge Cases & Error Scenarios

| Scenario | Expected behavior |
|---|---|
| Firebase service unreachable | Return 503; show user-facing error; log to Sentry |
| Google OAuth token revoked | Redirect to sign-in; clear session |
| Supabase user sync fails on first sign-in | Retry once; if fails, allow sign-in but flag for manual sync; log Sentry critical |
| Duplicate user creation race condition | `upsert` with Firebase UID as unique key — safe |
| Token expired mid-session | Firebase SDK auto-refreshes; NextAuth re-validates on next protected request |
| User attempts to access other user's data | 403 Forbidden; log to Sentry as security event |

---

## 7. Out of Scope

- Email/password authentication (not planned — Google OAuth only for now).
- Magic link / passwordless email auth.
- Multi-factor authentication.
- Social logins beyond Google (future ADR needed).
- Admin user management UI.

---

## 8. Dependencies

| Dependency | Type | Notes |
|---|---|---|
| Firebase Auth project | External service | Google OAuth configured in Firebase Console |
| Supabase `users` table | DB | Must have `firebase_uid`, `email`, `role`, `created_at` fields |
| SPEC-003 (Credits) | Spec | Credit balance initialized on first user creation |
| `FIREBASE_*` env vars | Env | Admin SDK credentials |
| `NEXTAUTH_SECRET` | Env | JWT signing secret |
| `NEXTAUTH_URL` | Env | Callback URL for OAuth redirects |

---

## Constitution Compliance Checklist

- [x] Firebase token validated server-side on every protected call (§6).
- [x] Session cookie httpOnly + secure (§6).
- [x] Zod validation on auth-related API inputs (§2.4).
- [x] Rate limiting on auth endpoints (§6).
- [x] No secrets in code — all in env vars (§6).
- [x] DB access only via `@ia-next/database` (§2.4).
- [x] Errors to Sentry (§3.2).
