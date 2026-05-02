---
id: SPEC-201
title: "Consulta Nota"
status: stub
owner: Pablo Cubides
created: 2026-04-28
updated: 2026-05-01
---

# SPEC-201 — Consulta Nota


---

## Tool Summary

| Field | Value |
|---|---|
| **Portal** | IA / Autor |
| **Route** | `/[portal]/herramientas/201-consulta-nota` |
| **Primary persona** | Estudiante Universitario |
| **Secondary persona** | Pablo (Instructor) |

**Description**: Herramienta para que estudiantes consulten su nota de curso por medio de un código o email.

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

- README: see `apps/web/src/app/(portals)/[portal]/(marketing)/herramientas/201-consulta-nota/README.md`
- ADRs: no specific ADR yet — add one when a significant architectural decision is made for this tool.

---

*Stub — SPEC-201 | Promote to full spec when changes are planned.*
