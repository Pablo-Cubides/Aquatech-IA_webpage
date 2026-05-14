---
mode: agent
description: Crear un stub mínimo en specs/README.md para una herramienta nueva. No crea spec completo — solo registra la existencia para tracking.
---

# /spec.stub — Crear stub de herramienta

## Uso
`/spec.stub <portal> <slug> "<título>"`

Ejemplo: `/spec.stub ia calculadora-tokens "Calculadora de Tokens LLM"`

Portales válidos: `ia` | `ambiental` | `ia/autor`

---

## Protocolo

### Paso 1 — Determinar ID
- Herramientas IA: SPEC-200 a SPEC-299
- Herramientas Ambiental: SPEC-200+ (mismo rango, distinguidos por portal)
- Obtén el próximo ID disponible leyendo `specs/README.md`

### Paso 2 — Crear directorio y spec mínimo

Crea `specs/NNN-slug/spec.md` con este contenido mínimo:

```markdown
---
id: SPEC-NNN
title: "<título>"
status: stub
owner: Pablo Cubides
created: YYYY-MM-DD
updated: YYYY-MM-DD
portal: <portal>
---

# SPEC-NNN — <título>

> **Stub**: Este spec existe como placeholder de tracking.
> Cuando la herramienta requiera cambios significativos, evoluciona a spec completo:
> ejecuta `/spec.clarify SPEC-NNN` para arrancar el proceso.

## Descripción breve
[Una o dos líneas describiendo qué hace la herramienta]

## Ruta en el portal
`/<portal>/herramientas/<slug>`

## Estado actual
- Implementada: ✅ / ⚠️ parcial / ❌ no implementada
- Tests: ✅ / ❌
- Spec completo: ❌ (stub)

## Para evolucionar este stub
1. La herramienta va a cambiar significativamente
2. Ejecuta `/spec.clarify SPEC-NNN` → genera User Stories y BRs
3. Ejecuta `/spec.plan SPEC-NNN` → genera plan técnico
4. Cambia status a `draft` y arranca el ciclo SDD completo
```

### Paso 3 — Agregar al índice

En `specs/README.md`, agrega una fila en la tabla "Tool Specs (on-demand)":

```
| [SPEC-NNN](NNN-slug/spec.md) | <título> | <portal> | stub | YYYY-MM-DD |
```

### Paso 4 — Confirmar
Reporta:
```
✅ Stub SPEC-NNN creado: specs/NNN-slug/spec.md
   Agregado al índice en specs/README.md
   Para spec completo: /spec.clarify SPEC-NNN
```

---

## Cuándo usar stub vs spec completo
- **Stub**: herramienta ya implementada sin cambios planificados. Solo tracking.
- **Spec completo**: cualquier cambio no trivial a la herramienta. Arranca con `/spec.new`.
