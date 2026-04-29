# SPEC-202 — Ruleta Académica
> **Status**: stub | **Owner**: Pablo Cubides | **Created**: 2026-04-28  
> **Full spec**: created when this tool undergoes significant changes (see specs/README.md §Tool Specs)

---

## Tool Summary

| Field | Value |
|---|---|
| **Portal** | IA / Autor |
| **Route** | `/[portal]/herramientas/202-ruleta-academica` |
| **Primary persona** | Pablo (Instructor) |
| **Secondary persona** | Estudiante Universitario |

**Description**: Ruleta de preguntas aleatorias para dinámicas de clase. El instructor define el banco de preguntas.

---

## Current Status

This tool is **stable** and not actively being modified. A full spec is not required until changes are planned.

When changes are planned:
1. Upgrade this stub to a full spec using `.specify/templates/spec.template.md`.
2. Fill all sections: user stories, business rules, NFRs, edge cases.
3. Change status from `stub` to `draft`.
4. Follow the normal spec lifecycle: draft → review → approved → implementing.

---

## Known Constraints / Restricciones conocidas

- Tool must maintain visual consistency with its portal theme (dark: IA, light: Ambiental).
- If tool has premium features: credit consumption must follow SPEC-003 rules.
- If tool fetches external data (GBIF, WQP): must handle API unavailability gracefully.
- Performance budget applies per constitution §5.

---

## Linked Resources

- README: see `apps/web/src/app/(portals)/[portal]/(marketing)/herramientas/202-ruleta-academica/README.md`
- ADRs: no specific ADR yet — add one when a significant architectural decision is made for this tool.

---

*Stub — SPEC-202 | Promote to full spec when changes are planned.*
