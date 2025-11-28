# Contributing

Thank you for contributing to AquatechIA. This file documents the core developer workflow, branch rules, and testing expectations.

Branching
- Use feature branches: `feature/<short-descriptor>`
- Use `fix/` for bugfixes and `chore/` for infra tasks.

Commits
- Follow Conventional Commits (type: scope?): `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.

PRs
- Include a clear description, list of changed files, and testing steps.
- Link any related issue.
- Ensure CI passes (lint, typecheck, tests) before requesting review.

Local checks before PR
```pwsh
pnpm install
pnpm lint
pnpm typecheck
pnpm test
```

Code style
- Use the shared `@ia-next` ESLint and Prettier config. Run `pnpm format` before committing.

Testing
- Add unit tests for new logic and critical flows. Place tests near modules in `__tests__` folders.

Security
- Do not commit secrets. Use `.env.example` as a template.

Review checklist
- Type checking passes
- Linting passes
- Tests added for new behaviors
- Documentation updated (tool READMEs, ARCHITECTURE.md)
