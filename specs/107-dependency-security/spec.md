---
id: SPEC-107
title: "Dependency security remediation"
status: implementing
owner: Pablo-Cubides
created: 2026-10-26
updated: 2026-10-26
---

# SPEC-107 — Dependency security remediation

## 1. Problem [REQUIRED]
The installed dependency graph reports critical, high and moderate advisories. The owner authorized remediation on 2026-10-26 before the portfolio changes are merged. Runtime libraries include Next.js, Auth.js, PDF export and map rendering; development tools also need compatible patched versions.

## 2. Constraints [REQUIRED]
- Preserve both portals, application routes and user-data boundaries.
- Use official patched releases, verified TLS and lockfile integrity. Do not suppress audit findings or bypass hooks.
- Keep the existing technology families; document necessary major-version migrations in ADR-0012.
- Use local/synthetic data for checks and never copy operational credentials into fixtures or reports.

## 3. Non-Goals [REQUIRED]
No new product features, identity-provider migration, database-schema migration or private-data publication.

## 4. Users [REQUIRED]
Public tool users processing documents/maps, authenticated product users and maintainers running development tooling.

## 5. User Stories [REQUIRED]
### US-001: Patched application dependencies
Given the frozen workspace lockfile, when dependencies are installed and audited, critical/high/moderate findings must be resolved before merge.
### US-002: Compatible tools
Given synthetic document and map inputs, when PDF/spreadsheet export and map attribution rendering are exercised, the existing workflows remain functional and unsafe attribution markup is rejected.

## 6. Acceptance Criteria [REQUIRED]
- AC-001: Audit reports no critical, high or moderate findings; low findings are explicitly reported.
- AC-002: Typecheck, lint, web/API tests and production web build pass.
- AC-003: PDF and spreadsheet round trips and map attribution sanitization have representative regression checks.
- AC-004: Dependency declarations and pnpm lockfile agree; frozen installation succeeds.
- AC-005: PR documents migrations, validation and remaining limitations without claiming untested production behavior.
- AC-006: The local preflight and CI fail when the moderate audit gate fails; CI also runs the API suite.

## 7. Business Rules [REQUIRED]
Security patches retain existing APIs where possible. Libraries with no maintained compatible version may be removed only when unused or replaced by their official supported distribution.

## 8. Edge Cases [REQUIRED]
Malicious attribution attributes, malformed document inputs, unavailable package destinations and unsupported peer dependencies must not be hidden by test exclusions or disabled verification.

## 9. Non-Functional Requirements [REQUIRED]
Do not increase the attack surface through new services or expose credentials in logs. Preserve portal isolation and reproducible installation.
