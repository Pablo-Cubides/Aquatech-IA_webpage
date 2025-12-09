# Cómo Funcionan los LLMs (ExploraModelo)

> **Route:** `/ia/herramientas/como-funcionan-llm`  
> **Status:** Stable ✅  
> **Version:** 1.0.0

## Overview

ExploraModelo is an interactive educational tool that explains how Large Language Models (LLMs) work, step by step. Users journey through the complete pipeline from text input to generated output.

## Features

- 📝 **7 Interactive Steps**: Complete journey through LLM internals
- 🔤 **Tokenization Visualization**: See how text becomes tokens
- 📊 **Embeddings Display**: Understand vector representations
- 🎯 **Attention Mechanism**: Visualize self-attention patterns
- 📈 **Probability Distribution**: See next-token predictions
- ✨ **Autoregressive Generation**: Watch text being generated token by token
- 📚 **Academic References**: Links to foundational papers

## Learning Path

1. **Input (Entrada)**: Enter or select sample text
2. **Tokenization (Tokenización)**: Watch text split into tokens
3. **Embeddings**: See tokens converted to vectors
4. **Attention (Atención)**: Explore attention weights between tokens
5. **Probabilities (Probabilidades)**: View next-token probability distributions
6. **Generation (Generación)**: Observe autoregressive text generation
7. **Bibliography (Bibliografía)**: Explore academic papers and resources

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Variables (IA portal theme)
- **State Management**: React Context (ProcessProvider)

## Project Structure

```
como-funcionan-llm/
├── layout.tsx          # SEO metadata
├── page.tsx            # Route entry
├── README.md           # This file
├── app/
│   ├── page.tsx        # Main component (262 lines)
│   ├── layout.tsx      # Internal layout
│   ├── globals.css     # Tool-specific styles
│   ├── components/
│   │   ├── InputStep.tsx
│   │   ├── TokenizationStep.tsx
│   │   ├── EmbeddingStep.tsx
│   │   ├── AttentionStep.tsx
│   │   ├── ProbabilityStep.tsx
│   │   ├── AutoregressiveStep.tsx
│   │   └── BibliographyStep.tsx
│   └── api/
├── context/
│   └── ProcessContext.tsx  # Global state management
├── types/
│   └── index.ts        # TypeScript definitions
└── utils/
    └── tokenizer.ts    # Tokenization utilities
```

## Local Development

```bash
# From repository root
cd apps/web
pnpm dev

# Open in browser
# http://localhost:3000/ia/herramientas/como-funcionan-llm
```

## State Management

The tool uses a custom `ProcessContext` to manage:

```typescript
interface ProcessState {
  currentStep: number;
  inputText: string;
  tokens: string[];
  embeddings: number[][];
  attentionWeights: number[][];
  probabilities: { token: string; probability: number }[];
  generatedText: string;
  isExplanationMode: boolean;
}
```

## Demo Texts

Pre-configured example texts (in Spanish):
- "Los pájaros vuelan porque tienen alas"
- "La inteligencia artificial es una tecnología fascinante"
- "Para estudiar mejor, recomiendo hacer resúmenes"
- "El agua hierve cuando alcanza cien grados"

## Academic References

The tool references foundational papers:
- "Attention Is All You Need" (Vaswani et al., 2017)
- GPT-3 paper (Brown et al., 2020)
- BERT paper (Devlin et al., 2019)

## Testing

```bash
# Run tests (when implemented)
pnpm test --filter=como-funcionan-llm
```

> **TODO**: Add unit tests for each step component

## Contributing

1. Add new educational content to step components
2. Ensure visualizations are accessible (ARIA labels, keyboard navigation)
3. Maintain consistent styling with IA portal theme
4. Update `ProcessContext` for new state requirements

## Related

- [GitHub Repository](https://github.com/Pablo-Cubides/Como_funcionan_llm)
- [Architecture](/docs/ARCHITECTURE.md)
- [Master Documentation](/docs/MASTER_DOCUMENTATION.md)
