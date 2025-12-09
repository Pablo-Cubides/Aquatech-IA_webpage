# Parámetros de Decodificación (LLM Tune)

> **Route:** `/ia/herramientas/parametros-decodificacion`  
> **Status:** Stable ✅  
> **Version:** 1.0.0

## Overview

LLM Tune is an interactive educational playground that demonstrates how decoding parameters affect text generation in Large Language Models. Users can experiment with Temperature, Top-k, Top-p, and Repetition Penalty to understand their effects.

## Features

- 🌡️ **Temperature Control**: Adjust randomness in sampling
- 🔢 **Top-k Sampling**: Limit candidate tokens
- 🎯 **Top-p (Nucleus) Sampling**: Dynamic probability mass selection
- 🔄 **Repetition Penalty**: Control token repetition
- 📊 **Radar Chart**: Visual representation of current parameters
- 📚 **Academic References**: Links to research papers for each parameter
- 📝 **Pattern Detection**: Automatic identification of generation patterns (A-J)

## Learning Path

1. **Step 1 - Overview**: Understand what each parameter does
2. **Step 2 - Parameters**: Deep dive into each parameter with examples
3. **Step 3 - Playground**: Interactive experimentation with sliders
4. **Step 4 - References**: Academic papers and further reading

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom animations
- **Charts**: Custom radar chart component
- **Export**: html2canvas for PNG, native JSON export

## Project Structure

```
parametros-decodificacion/
├── layout.tsx          # SEO metadata
├── page.tsx            # Route entry
├── README.md           # This file
└── src/
    ├── app/
    │   └── page.tsx    # Main component (1074 lines)
    ├── components/
    │   ├── SliderEnhanced.tsx      # Parameter sliders with optimal ranges
    │   ├── CaseSelector.tsx        # Example case selector
    │   ├── ExampleList.tsx         # Example outputs display
    │   ├── Badge.tsx               # UI badges
    │   ├── PatternRadarChart.tsx   # Parameter visualization
    │   ├── PatternTimeline.tsx     # Pattern history
    │   └── AcademicReferences.tsx  # Research paper links
    ├── context/
    │   └── ProcessContext.tsx
    ├── data/
    │   └── cases.ts    # Pre-configured examples with variants
    ├── types/
    │   ├── data.ts
    │   └── index.ts
    └── utils/
        ├── decoding.ts # Bucket mapping and pattern selection
        └── index.ts
```

## Parameters Explained

### Temperature (0.05 - 1.3)
Controls randomness in sampling:
- **Low (0.1)**: Deterministic, predictable outputs
- **Medium (0.7)**: Balanced coherence and variety
- **High (1.2)**: Creative, potentially incoherent

### Top-k (1 - 150)
Limits candidates to k most probable tokens:
- **Low (5)**: Very focused, repetitive
- **Medium (50)**: Good variety with focus
- **High (150)**: Maximum diversity

### Top-p / Nucleus (0.1 - 0.99)
Selects from smallest set with cumulative probability p:
- **Low (0.2)**: Conservative decisions
- **Medium (0.8)**: Broader alternatives
- **High (0.99)**: Almost no filtering

### Repetition Penalty (1.0 - 2.0)
Penalizes repeated tokens:
- **1.0**: No penalty
- **1.3**: Moderate, reduces common repetitions
- **1.8**: Strong, forces vocabulary diversity

## Pattern Detection

The tool identifies 10 distinct patterns (A-J) based on parameter combinations:

| Pattern | Creativity | Coherence | Diversity | Use Case |
|---------|------------|-----------|-----------|----------|
| A | Low | High | Low | Factual responses |
| C | Medium | High | Medium | Informative content |
| E | Very High | Low | Very High | Brainstorming |
| J | Low | Very High | Low | Precise, focused |

## Local Development

```bash
# From repository root
cd apps/web
pnpm dev

# Open in browser
# http://localhost:3000/ia/herramientas/parametros-decodificacion
```

## Export Options

- **PNG**: Screenshot of current playground state
- **JSON**: Parameter values and generated text

## Academic References

Embedded links to:
- Stanford NLP: Temperature in LLM Sampling
- OpenReview: Top-K Sampling for Generation
- arXiv: Nucleus Sampling Paper
- Google Vertex AI: Parameter Adjustment Guide

## Testing

```bash
# Run tests (when implemented)
pnpm test --filter=parametros-decodificacion
```

> **TODO**: Add unit tests for decoding utilities and pattern detection

## Contributing

1. Add new cases in `src/data/cases.ts`
2. Each case needs variants for all 10 patterns (A-J)
3. Ensure smooth slider interactions
4. Test on mobile devices (responsive design)

## Related

- [GitHub Repository](https://github.com/Pablo-Cubides/modelos-difusion)
- [Architecture](/docs/ARCHITECTURE.md)
- [Master Documentation](/docs/MASTER_DOCUMENTATION.md)
