# Visor de Difusión (PixelGen)

> **Route:** `/ia/herramientas/visor-difusion`  
> **Status:** Stable ✅  
> **Version:** 1.0.0

## Overview

PixelGen is an educational interactive tool that visualizes how AI diffusion models generate images from pure noise. Users can step through the denoising process and export the sequence as an animated GIF.

## Features

- 🎨 **9 Pre-configured Cases**: Spider-Man, Superman, portraits, medieval scenes, and more
- 🔄 **Step-by-step Visualization**: Watch the image emerge from noise over 10 steps
- 📥 **GIF Export**: Download the complete diffusion sequence as an animated GIF
- 📚 **Educational Panel**: Contextual explanations at each step
- 🎯 **Noise Overlay**: Visual representation of remaining noise at each step

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS variables
- **State Management**: React useState/useEffect

## Project Structure

```
visor-difusion/
├── layout.tsx          # SEO metadata
├── page.tsx            # Route entry (re-exports src/app/page)
├── README.md           # This file
└── src/
    ├── app/
    │   ├── page.tsx    # Main component (558 lines)
    │   ├── layout.tsx  # Internal layout
    │   └── globals.css # Tool-specific styles
    ├── components/
    │   ├── EducationalPanel.tsx
    │   ├── ImageViewer.tsx
    │   ├── PromptSelector.tsx
    │   ├── SimulationControls.tsx
    │   └── static/
    │       ├── cases/           # Pre-generated image sequences
    │       ├── noise_step_*.png # Noise overlays
    │       └── Photos to generate/
    ├── context/
    │   └── VisorContext.tsx
    ├── lib/
    └── utils/
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/visor-prompts` | GET | List all available cases |
| `/api/visor-step` | POST | Get image for specific step |
| `/api/visor-noise/[step]` | GET | Get noise overlay for step |
| `/api/visor-export-gif` | GET | Generate animated GIF |

## Local Development

```bash
# From repository root
cd apps/web
pnpm dev

# Open in browser
# http://localhost:3000/ia/herramientas/visor-difusion
```

## How It Works

1. **Select a Prompt**: Choose from 9 pre-configured image generation scenarios
2. **Start Simulation**: Initialize the diffusion process
3. **Step Through**: Advance through 10 denoising steps
4. **Observe**: Watch how the image gradually emerges from noise
5. **Export**: Download the complete sequence as a GIF

## Educational Content

The tool explains:
- What is diffusion in AI image generation
- The denoising process (reverse diffusion)
- How text prompts guide image generation
- The role of noise schedules
- Comparison between different diffusion models (Stable Diffusion, DALL-E, Flux, Gemini)

## Testing

```bash
# Run tests (when implemented)
pnpm test --filter=visor-difusion
```

> **TODO**: Add unit tests for step sequencing and GIF export functionality

## Contributing

1. Add new cases under `src/components/static/cases/[case-id]/`
2. Include 10 step images (step_0.png to step_10.png)
3. Update `caseInfo` object in `src/app/page.tsx`
4. Add case metadata to `/api/visor-prompts/route.ts`

## Maintenance Notes

- Ensure static `cases` directory exists before build
- Images should be optimized for web (WebP preferred)
- GIF export may timeout for very large images

## Related Documentation

- [Architecture](/docs/ARCHITECTURE.md)
- [Master Documentation](/docs/MASTER_DOCUMENTATION.md)
