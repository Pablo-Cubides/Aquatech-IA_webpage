# ADR-0012 — Patched dependency migrations

> **Status**: proposed | **Date**: 2026-10-26 | **Spec**: SPEC-107

## Context
The dependency audit includes critical advisories affecting runtime and development packages. The owner approved a security-remediation scope. Remaining on jsPDF 3 and MapLibre 5 cannot satisfy the published patched ranges.

## Decision
Retain the existing technology families. Upgrade Next.js within version 16, Auth.js within version 4, Sentry within version 10 and Vitest within version 4. Move jsPDF to the patched version 4 line with its compatible AutoTable release and MapLibre to patched version 6. Prefer maintained official packages and compatible transitive updates over broad global overrides. Remove unused legacy image-processing declarations after import inspection. Use the official SheetJS 0.20.3 tarball from https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz because npm xlsx 0.18.5 is not maintained. pnpm records the fetched artifact integrity in the lockfile.

Use scoped overrides for vulnerable glob 10 → 10.5.0 and uuid 9 → 11.1.1. uuid 11 retains the CommonJS v4 API consumed by Google SDKs and MercadoPago; version 12 would remove CommonJS support. Validate these consumers without external requests. Pin OpenTelemetry API 1.9.0 to satisfy the SDK/Sentry peer range `<1.10.0`.

Vite 8.3.5 is an explicit test-toolchain dependency rather than an auto-resolved peer. Vitest and the React plugin use the same transformer, and the web test configuration explicitly selects the automatic React JSX runtime for TSX tests excluded by Next's tsconfig. CI restores dependency caches before installation, never afterward. Its new cache namespace requires an exact lockfile/schema match, uses non-overlapping workspace paths and omits fallback restores from other lockfiles. Every consuming job verifies a frozen installation; lint no longer rewrites dependency declarations. This prevents old cached binaries/modules from overlaying the validated toolchain. No global React shim or weaker assertions are introduced.

## Consequences
Public APIs may have type-level changes. PDF/spreadsheet export and attribution sanitization require regression checks in addition to the existing suite. No migration is considered validated until typecheck, tests, build and audit complete. No credential or production-data migration is part of this decision.
