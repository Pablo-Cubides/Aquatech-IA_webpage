# Filtrado de IA (Content Filtering)

> **Route:** `/ia/herramientas/filtrado-ia`  
> **Status:** Stable ✅  
> **Version:** 1.0.0

## Overview

This educational tool demonstrates how AI models filter and moderate their responses. Users can explore different test cases to understand content classification, safety mechanisms, and RLHF (Reinforcement Learning from Human Feedback).

## Features

- 🛡️ **Content Classification**: See how AI categorizes different inputs
- 📊 **Risk Assessment**: Visual indicators for different risk levels
- 🔍 **Test Cases**: Pre-configured scenarios for exploration
- 📚 **Educational Content**: Explanations of moderation techniques
- 📥 **Export Options**: PDF and image export via html2canvas/jspdf

## Learning Topics

- Content moderation pipelines
- RLHF (Reinforcement Learning from Human Feedback)
- Classification systems and risk levels
- Policy enforcement in LLMs
- Constitutional AI approaches

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom styles
- **State Management**: React Context (CasosContext)
- **Export**: html2canvas + jsPDF

## Project Structure

```
filtrado-ia/
├── layout.tsx              # SEO metadata
├── page.tsx                # Route entry (wrapper)
├── README.md               # This file
├── __tests__/              # Test suite ✅
│   ├── CasosContext.test.tsx
│   ├── MenuCasos.test.tsx
│   ├── VisualizadorCaso.test.tsx
│   └── analytics.test.ts
├── app/
│   ├── page.tsx            # Main component
│   └── layout.tsx
├── components/
│   ├── MenuCasos.tsx       # Case selector
│   ├── VisualizadorCaso.tsx # Case visualizer
│   ├── ExportButton.tsx    # PDF/Image export
│   └── RiskIndicator.tsx   # Risk level display
├── context/
│   └── CasosContext.tsx    # Global state management
├── public/
│   └── cases/              # Static case assets
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── styles/
│   ├── types/
│   └── utils/
├── styles/
│   └── globals.css
└── types/
    └── index.ts
```

## Local Development

```bash
# From repository root
cd apps/web
pnpm dev

# Open in browser
# http://localhost:3000/ia/herramientas/filtrado-ia
```

## State Management

Uses `CasosContext` for managing test cases:

```typescript
interface CasosState {
  casos: Case[];
  selectedCaso: Case | null;
  isLoading: boolean;
  error: string | null;
}

interface Case {
  id: string;
  title: string;
  description: string;
  input: string;
  output: string;
  riskLevel: 'low' | 'medium' | 'high';
  category: string;
}
```

## Testing

This tool has the most complete test coverage:

```bash
# Run tests
pnpm test --filter=filtrado-ia

# Test files:
# - CasosContext.test.tsx  (context functionality)
# - MenuCasos.test.tsx     (case selector)
# - VisualizadorCaso.test.tsx (case display)
# - analytics.test.ts      (tracking)
```

## Export Features

- **PDF Export**: Full page capture with jsPDF
- **PNG Export**: Screenshot via html2canvas

## Educational Content

The tool explains:
1. **Input Analysis**: How models analyze incoming prompts
2. **Classification**: Category assignment (safe, sensitive, harmful)
3. **Policy Check**: Verification against content policies
4. **Response Generation**: Safe response crafting
5. **Output Filtering**: Final safety verification

## API Integration

Currently uses local test cases. Can be extended to:
- Connect to moderation APIs (OpenAI, Perspective API)
- Real-time classification demonstration
- Custom case upload

## Contributing

1. Add new cases in the `cases` directory
2. Include appropriate metadata (riskLevel, category)
3. Write corresponding tests in `__tests__/`
4. Update CasosContext if new fields are needed
5. Test on multiple browsers (PDF export compatibility)

## Translation Notes

- UI is in Spanish (target audience)
- README and code comments in English for contributors
- Case content should remain in Spanish

## Related

- [GitHub Repository](https://github.com/Pablo-Cubides/filtrado-ia)
- [Architecture](/docs/ARCHITECTURE.md)
- [Master Documentation](/docs/MASTER_DOCUMENTATION.md)
