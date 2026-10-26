# SPEC-107 implementation plan

1. Preserve the initial audit outside the checkout and group findings by affected package.
2. Update compatible workspace dependencies/transitives. Explicitly move Next.js/Auth.js/Sentry/Vitest to patched releases and document jsPDF/MapLibre major upgrades.
3. Remove unused legacy image-tool dependencies where source inspection confirms no imports.
4. Use an official maintained SheetJS distribution if npm's xlsx release remains vulnerable; preserve pnpm integrity and document its source.
5. Inspect the remaining audit and use narrowly scoped overrides only where the declared graph cannot resolve patched transitives. The uuid 9 → 11 exception retains CommonJS v4 consumers and requires a compatibility check.
6. Add behavior-focused checks for PDF generation, spreadsheet round trips and attribution sanitization.
7. Run frozen installation, audit, full release preflight and API tests; update ADR/spec status and the PR only after the results are known.
