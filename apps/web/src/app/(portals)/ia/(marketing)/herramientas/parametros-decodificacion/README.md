# Decoding Parameters (LLM Playground)

Route: `/ia/herramientas/parametros-decodificacion`

Purpose
- Interactive playground to experiment with LLM decoding parameters: temperature, top_k, top_p, frequency_penalty, presence_penalty, etc.
- Useful for teaching and reproducible experiments.

Developer notes
- Includes a `ProcessContext` and type definitions. Keep examples and presets in sync with the LLM provider used by the backend.

Local development
```pwsh
cd apps/web
pnpm dev
# http://localhost:3000/ia/herramientas/parametros-decodificacion
```
