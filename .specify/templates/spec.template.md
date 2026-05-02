---
id: SPEC-NNN
title: "[Feature Title / Título de la feature]"
status: draft
owner: "[name]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# SPEC-NNN — [Feature Title / Título de la feature]

## 1. Problem / Problema [REQUIRED]

> *What problem does this feature solve? Who suffers from this problem today?*
> *¿Qué problema resuelve esta feature? ¿Quién sufre este problema hoy?*

[Describe the problem in 2-5 sentences. Focus on the pain, not the solution.]

### Context / Contexto
[Additional context: business driver, incident that triggered this, external constraint, etc.]

---

## 2. Constraints / Restricciones [REQUIRED]

> *Technical boundaries that MUST NOT be crossed. These act as "Adversarial Agent Patterns" to restrict AI hallucinations.*

- **C-001**: [e.g., Must not introduce new global state libraries]
- **C-002**: [e.g., Must maintain 100% test coverage on business logic]
- **C-003**: [e.g., UI must be 100% accessible (WCAG AA)]

---

## 3. Non-Goals / Fuera de Alcance [REQUIRED]

> *Explicitly state what will NOT be built to prevent scope creep by AI agents.*

- [e.g., "Multi-language article URLs — deferred to SPEC-MMM"]
- [e.g., "Third-party login — handled in SPEC-LLL"]

---

## 4. Users / Usuarios [REQUIRED]

> *Who is affected by this feature? Reference personas from `docs/domain/personas.md`.*

| Persona | Role | How affected |
|---|---|---|
| [e.g., Pablo (instructor)] | [Primary user] | [What they can do or what changes for them] |
| [e.g., Student] | [Secondary user] | [How this impacts their experience] |

---

## 5. User Stories [REQUIRED]

> *Written in Gherkin (Given/When/Then) for testability. Each story maps to at least one acceptance criterion.*

### US-001: [Story title]
```gherkin
As a [persona]
I want to [action]
So that [benefit]

Acceptance Criteria:
  Scenario: [happy path]
    Given [precondition]
    When [action]
    Then [expected outcome]

  Scenario: [edge case or error]
    Given [precondition]
    When [action]
    Then [expected outcome]
```

### US-002: [Story title]
```gherkin
As a [persona]
I want to [action]
So that [benefit]

Acceptance Criteria:
  Scenario: [...]
    Given [...]
    When [...]
    Then [...]
```

---

## 6. Business Rules / Reglas de negocio [REQUIRED]

> *Constraints and invariants that must always hold, regardless of implementation.*

- **BR-001**: [Rule — e.g., "A user cannot have negative credits"]
- **BR-002**: [Rule]
- **BR-003**: [Rule]

---

## 7. Non-Functional Requirements / Requisitos no funcionales [REQUIRED]

### Performance
- [ ] Complies with constitution §5 performance budgets.
- [ ] [Any specific performance requirement for this feature beyond the baseline]

### Accessibility
- [ ] WCAG 2.1 AA compliant.
- [ ] All interactive elements keyboard-navigable.
- [ ] All images have non-empty `alt` attributes.

### Security
- [ ] All user inputs validated with Zod at route handler boundary.
- [ ] No secrets exposed to client.
- [ ] [Any feature-specific security requirement]

### Internationalization [OPTIONAL]
- [ ] Content supports ES (primary) and EN (future).
- [ ] Dates formatted with `date-fns` locale-aware.

### Availability / Reliability [OPTIONAL]
- [ ] [Uptime, retry logic, fallback behavior if external API fails]

---

## 8. Edge Cases & Error Scenarios / Casos límite y errores [REQUIRED]

| Scenario | Expected behavior |
|---|---|
| [e.g., API is unavailable] | [Show error message, do not charge user, retry once] |
| [e.g., User submits form twice] | [Idempotent — second submission is a no-op] |

---

## 9. Dependencies / Dependencias [OPTIONAL]

| Dependency | Type | Notes |
|---|---|---|
| [SPEC-NNN] | Spec | Must be implemented first / blocked by |
| [Cloudinary account] | External service | API key in env |

---

## 10. Open Questions / Preguntas abiertas

> *Unresolved questions that must be answered before implementation starts.*

- [ ] **Q1**: [Question] — *Owner: [name], Due: YYYY-MM-DD*
- [ ] **Q2**: [Question] — *Owner: [name], Due: YYYY-MM-DD*

---

## 11. Glossary / Glosario [OPTIONAL]

> *New terms introduced by this spec. Add resolved terms to `docs/domain/glossary.md`.*

| Term | Definition |
|---|---|
| [term] | [definition] |

---

## Constitution Compliance Checklist / Cumplimiento de la constitución

Before marking this spec `approved`, confirm:

- [ ] Stack used matches constitution §1 (no new libraries introduced without ADR).
- [ ] Dual portal isolation respected (§2.2).
- [ ] Zod validation defined for all inputs (§2.4).
- [ ] Performance budgets addressed (§5).
- [ ] Security rules addressed (§6).
- [ ] Image and content policy addressed if applicable (§7).
- [ ] No `any` types planned (§3.1).

---

*Spec ID: SPEC-NNN | Template version: 1.0.0*
