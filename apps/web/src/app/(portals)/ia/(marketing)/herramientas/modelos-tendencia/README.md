# Modelos de IA en Tendencia (Hugging Face Explorer)

> **Route:** `/ia/herramientas/modelos-tendencia`  
> **Status:** Stable ✅  
> **Version:** 1.0.0

## Overview

Interactive tool to explore the most popular AI models from Hugging Face Hub. Users can filter by trending period (last week/month) and category to discover the latest advances in machine learning.

## Features

- 🔥 **Trending Models**: Real-time data from Hugging Face API
- 📅 **Period Filter**: Last 7 days or last 30 days
- 🏷️ **Category Filter**: Text generation, image generation, speech, etc.
- 📊 **Statistics**: Likes, downloads, trending score
- 🔗 **Direct Links**: Open models in Hugging Face
- ⚡ **Caching**: 1-hour cache to reduce API calls

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom gradients
- **Data Source**: Hugging Face Hub API
- **Caching**: In-memory cache (1 hour TTL)

## Project Structure

```
modelos-tendencia/
├── layout.tsx              # SEO metadata + JSON-LD
├── page.tsx                # Main component with state
├── README.md               # This file
└── components/
    ├── ModelCard.tsx       # Model card with stats
    ├── PeriodFilter.tsx    # Week/Month toggle
    └── CategoryFilter.tsx  # Category dropdown
```

## API Endpoint

**GET** `/api/huggingface-trending`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | `week` \| `month` | `week` | Trending period |
| `limit` | `5-50` | `20` | Number of models |
| `category` | string | `all` | Pipeline tag filter |

**Response:**
```json
{
  "models": [...],
  "cached": boolean,
  "period": "week",
  "limit": 20,
  "category": "all"
}
```

## Environment Variables

```bash
HUGGINGFACE_API_KEY=hf_xxxxxxxxx  # Required for API access
```

## Local Development

```bash
# From repository root
cd apps/web
pnpm dev

# Open in browser
# http://localhost:3000/ia/herramientas/modelos-tendencia
```

## Categories Supported

- 🌐 All (no filter)
- 💬 Text Generation
- 🎨 Text to Image
- 🔊 Text to Speech
- 👁️ Image to Text
- 🎤 Speech Recognition
- 🌍 Translation
- 🎭 Fill Mask

## Data Attribution

All model data is provided by:
- [Hugging Face Hub API](https://huggingface.co/docs/hub/api)
- Models belong to their respective authors and organizations

## Testing

```bash
# Run tests
pnpm vitest run src/app/api/huggingface-trending
```

## Caching Strategy

- **Duration**: 1 hour
- **Key Format**: `{period}-{limit}-{category}`
- **Cache Type**: In-memory Map

## Related

- [Hugging Face](https://huggingface.co)
- [HF API Documentation](https://huggingface.co/docs/hub/api)
- [Architecture](/docs/ARCHITECTURE.md)
