# Aula Score: Aventuras de juego en Clase

Una aplicación interactive scoreboard para gamificación en aulas universitarias. Diseñada para ser controlada por el profesor (host) con soporte para hasta 30 grupos, temporizador configurables y tema claro/oscuro.

## Características principales

- **Configuración flexible**: Define el número de grupos (1-30) y asigna nombres únicos a cada uno
- **Scoreboard en tiempo real**: Visualización clara de puntuaciones con controles +1 y -1 por grupo
- **Countdown animado**: Modal de inicio con cuenta regresiva "3...2...1" antes de iniciar
- **Temporizador opcional**: Modal con duración configurabe (0:30 a 9:00 min) con pausar/reanudar
- **Agregar grupos tardíos**: Botón para añadir nuevos grupos sin alterar el orden existente
- **Tema claro/oscuro**: Toggle de tema persistente en localStorage
```markdown
# Aula Score — Instructor Scoreboard (English)

Simple interactive scoreboard designed for classroom gamification. Intended for an instructor (host) to control rounds and scoring in a classroom or presentation setting.

Key features
- Flexible configuration: choose 1–30 teams and assign unique names
- Real-time scoreboard UI with +1 and -1 controls per team
- Animated 3-second countdown before the activity starts
- Optional configurable timer (0:30 to 9:00) with pause/resume
- Add late teams without reordering existing teams
- Light/dark theme toggle persisted in localStorage
- Client-only state (page refresh resets the session)

Tech stack
- Next.js (App Router) + TypeScript
- React 19
- Tailwind CSS

Folder structure

```
apps/web/src/app/(portals)/ia/(marketing)/autor/herramientas/aula-score/
├── layout.tsx                 # Tool layout and theme
├── page.tsx                   # Config page (root)
├── clasificacion/
│   └── page.tsx               # Scoreboard and ranking
├── components/
│   ├── Modal.tsx              # Accessible modal base
│   ├── CountdownModal.tsx     # 3-second animated countdown
│   ├── TimerModal.tsx         # Configurable timer control
│   ├── ScoreCard.tsx          # Team score card (+1 / -1)
│   ├── AddGroupModal.tsx      # Add late team modal
│   └── ThemeToggle.tsx        # Persisted theme toggle
├── lib/
│   └── utils.ts               # shuffleArray, validateGroupNames
└── theme.css                  # CSS variables and theme tokens
```

Routes
- `/ia/autor/herramientas/aula-score` — configuration
- `/ia/autor/herramientas/aula-score/clasificacion` — active scoreboard

Usage flow

1. Configure teams (1–30) on the configuration page and provide unique names.
2. Start the activity — a 3-second countdown runs, then teams are shuffled once and the scoreboard appears.
3. Use +1 / -1 to update scores. -1 is disabled at zero.
4. Optionally configure and run a timer (max 9:00).
5. Add late teams with the Add Group modal; they are appended to the list without reordering.

Validation rules

- Max teams: 30 (UI validation)
- Unique names: case-insensitive validation
- No negative scores: -1 disabled when score === 0
- Shuffle occurs once after countdown

Manual tests (summary)

- Enter 31 teams → show's validation error
- Add duplicate names (case-insensitive) → validation error
- Countdown displays 3,2,1 and then shows shuffled teams
- +1 and -1 update scores; -1 cannot reduce below 0
- Timer runs, pauses, resumes; cannot start if > 9:00

Components

- `CountdownModal` — animated startup countdown
- `TimerModal` — numeric inputs for minutes/seconds, pause/resume handling
- `ScoreCard` — per-team UI with score and actions

Developer notes

- The tool intentionally does not persist state. Consider adding an opt-in localStorage persistence or a real-time mode (WebSocket) for multi-device sync.
- The shuffle uses Fisher–Yates (Fisher–Yates implementation present in `lib/utils.ts`).

Local dev
```pwsh
cd apps/web
pnpm dev
# Open http://localhost:3000/ia/autor/herramientas/aula-score
```

Contributing

- Add unit tests for critical behaviors (shuffle, validation, timer). Tests currently documented in README-style in this folder; migrate to automated Jest tests for CI.

```
1. Navega a /clasificacion
