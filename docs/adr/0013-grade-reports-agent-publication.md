# ADR-0013 — Agent publication and grade request limits

Status: accepted. Date: 2026-11-02. Spec: SPEC-212.

The instructor authorized the proposed agent → GitHub → Vercel publication workflow and continuous grade synchronization. Aquatech currently deploys apps/web only; apps/api must be deployed as a second project from the same repository. This preserves the existing boundary: all new database access remains inside apps/api.

The existing Vercel production environment has no Upstash variables and the old API Redis host no longer resolves. Adding another provider is unnecessary for this small grade consultation. A narrow exception to constitution §6 permits an atomic PostgreSQL minute counter for `/api/grade-reports/*`, using the existing Supabase database. Upstash remains available and remains the required default for other endpoints. Missing/failed grade counters block requests; they never fall back to unlimited public access. Keys are HMAC hashes of request identity, with expiry and bounded cleanup. No student code, name or IP is stored in that table.

Colega imports through a separate signed endpoint. A dedicated random secret authenticates method, endpoint, timestamp and exact body. Requests expire after five minutes. Scope is fixed to period 2026-3, second cut and the three authorized courses. Replaying a valid unchanged batch is harmless because imports are idempotent and verified after commit. This key does not grant teacher sessions, general database access, GitHub or Vercel administration. Public exports contain no names; academic data stays outside the public Git repository.

GitHub publication uses an isolated worktree and the existing authenticated technical executor. Agent requests are limited to the Aquatech repository and SPEC-212; checks and preview verification precede production merge. General Socio repository mounts and Vercel observer remain unchanged. Routine grade synchronization updates data without redeploying code.

Alternatives: a new Upstash resource introduces provider setup; exposing the local agent API ties student consultation to the instructor's computer; moving data access into apps/web violates the existing boundary. CLI login on Windows is not a prerequisite for GitHub auto-deployment.
