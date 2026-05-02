# AquatechIA Lessons Learned

This file serves as a persistent memory for AI agents and developers to avoid repeating past mistakes and to document project-specific architectural decisions.

## Architectural Patterns
- [2026-05-01] **Zod Validation**: All API routes must use Zod for input validation at the entry point. Do not skip this even for "simple" routes.
- [2026-05-01] **Supabase Client**: Always use the provided helper in `src/lib/supabase` instead of initializing a new client to ensure environment variables and headers are correctly handled.

## Common Pitfalls
- [2026-05-01] **Edge Runtime**: Be careful with libraries that use Node.js built-ins when working in Edge Runtime routes (like middleware or specific API routes).
- [2026-05-01] **Tailwind Arbitrary Values**: Prefer using the theme colors/spacing instead of arbitrary values like `bg-[#123456]` unless it's a very specific brand color.

## Resolved Incidents
- [None yet]
