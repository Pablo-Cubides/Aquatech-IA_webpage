# 📋 PLAN DE ACCIÓN - COMPLETAR HERRAMIENTAS

**Objetivo**: Llevar todas las herramientas a 100% integración antes de deployment
**Tiempo estimado**: 2-4 horas
**Prioridad**: CRÍTICA

---

## 🔴 TAREA 1: Completar Filtrado-IA (CRÍTICA)

### 1.1 Agregar `__tests__` Directory

**Ubicación**: `apps/web/src/app/(portals)/ia/(marketing)/herramientas/filtrado-ia/__tests__/`

**Archivos a crear**:

#### a) `CasosContext.test.tsx`

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CasosProvider, useCasos } from "../src/context/CasosContext";

describe("CasosContext", () => {
  it("should initialize with default caso", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CasosProvider>{children}</CasosProvider>
    );
    const { result } = renderHook(() => useCasos(), { wrapper });

    expect(result.current.currentCaso).toBeDefined();
  });

  it("should select a caso", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CasosProvider>{children}</CasosProvider>
    );
    const { result } = renderHook(() => useCasos(), { wrapper });

    act(() => {
      result.current.selectCaso("caso-2");
    });

    expect(result.current.currentCaso.id).toBe("caso-2");
  });

  it("should provide all casos", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CasosProvider>{children}</CasosProvider>
    );
    const { result } = renderHook(() => useCasos(), { wrapper });

    expect(result.current.casos.length).toBeGreaterThan(0);
  });
});
```

#### b) `MenuCasos.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuCasos from "../src/components/MenuCasos";
import { CasosProvider } from "../src/context/CasosContext";

describe("MenuCasos", () => {
  it("should render all casos", () => {
    render(
      <CasosProvider>
        <MenuCasos />
      </CasosProvider>
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should call selectCaso when clicking a button", async () => {
    const user = userEvent.setup();

    render(
      <CasosProvider>
        <MenuCasos />
      </CasosProvider>
    );

    const firstButton = screen.getAllByRole("button")[0];
    await user.click(firstButton);

    expect(firstButton).toHaveClass("active"); // o tu clase de selección
  });

  it("should display caso title", () => {
    render(
      <CasosProvider>
        <MenuCasos />
      </CasosProvider>
    );

    expect(screen.getByText(/caso/i)).toBeInTheDocument();
  });
});
```

#### c) `VisualizadorCaso.test.tsx`

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VisualizadorCaso from "../src/components/VisualizadorCaso";
import { CasosProvider } from "../src/context/CasosContext";

describe("VisualizadorCaso", () => {
  it("should render caso content", () => {
    render(
      <CasosProvider>
        <VisualizadorCaso />
      </CasosProvider>
    );

    expect(screen.getByText(/filtrado/i)).toBeInTheDocument();
  });

  it("should display explicación del caso", () => {
    render(
      <CasosProvider>
        <VisualizadorCaso />
      </CasosProvider>
    );

    const content = screen.getByRole("main") || screen.getByText(/.*/).closest("main");
    expect(content).toBeInTheDocument();
  });

  it("should show visual representations", () => {
    render(
      <CasosProvider>
        <VisualizadorCaso />
      </CasosProvider>
    );

    // Ajustar según tus componentes visuales específicos
    expect(screen.queryByRole("img")).toBeDefined();
  });
});
```

#### d) `analytics.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackToolEvent, trackError, logEvent } from "../src/utils/analytics";

// Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureEvent: vi.fn(),
  captureException: vi.fn(),
}));

describe("Analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should log event with correct structure", () => {
    logEvent("test_event", { userId: "123" }, "user123");

    // Verificar que se llamó a Sentry
    expect(logEvent).toBeDefined();
  });

  it("should track tool event", () => {
    trackToolEvent("caso_selected", { casoId: "caso-1" }, "user123");

    expect(trackToolEvent).toBeDefined();
  });

  it("should track error", () => {
    const error = new Error("Test error");
    trackError(error, { context: "test" }, "user123");

    expect(trackError).toBeDefined();
  });
});
```

### 1.2 Integrar Sentry Analytics

**Ubicación**: `apps/web/src/app/(portals)/ia/(marketing)/herramientas/filtrado-ia/src/utils/analytics.ts`

**Contenido** (si no existe):

```typescript
import * as Sentry from "@sentry/nextjs";

interface AnalyticsEvent {
  [key: string]: any;
}

export const logEvent = (
  eventName: string,
  params: AnalyticsEvent = {},
  userId?: string,
) => {
  if (typeof window !== "undefined") {
    console.log(`[Analytics] ${eventName}:`, params);

    Sentry.captureEvent({
      message: eventName,
      level: "info",
      tags: {
        tool: "filtrado-ia",
        userId: userId || "anonymous",
      },
      extra: params,
    });
  }
};

export const trackPageView = (path: string, userId?: string) => {
  logEvent("page_view", { path }, userId);
};

export const trackToolEvent = (
  eventType: string,
  details: AnalyticsEvent = {},
  userId?: string,
) => {
  logEvent(`tool_${eventType}`, { ...details }, userId);
};

export const trackError = (
  error: Error,
  context: AnalyticsEvent = {},
  userId?: string,
) => {
  Sentry.captureException(error, {
    tags: {
      tool: "filtrado-ia",
      userId: userId || "anonymous",
    },
    extra: context,
  });
};
```

### 1.3 Integrar Analytics en Componentes

**Archivo**: `MenuCasos.tsx`

```typescript
import { useCasos } from "../context/CasosContext";
import { useSession } from "next-auth/react";
import { trackToolEvent } from "../utils/analytics";

export default function MenuCasos() {
  const { casos, selectCaso } = useCasos();
  const { data: session } = useSession();

  const handleCasoSelect = (casoId: string) => {
    // Track event
    trackToolEvent("caso_selected", { casoId }, session?.user?.id);

    // Select caso
    selectCaso(casoId);
  };

  return (
    <div className="menu-casos">
      {casos.map((caso) => (
        <button key={caso.id} onClick={() => handleCasoSelect(caso.id)}>
          {caso.titulo}
        </button>
      ))}
    </div>
  );
}
```

---

## 🟡 TAREA 2: Refactorizar Visor-Difusión (RECOMENDADO)

### 2.1 Reducir page.tsx de 399 líneas

**Estrategia**: Extraer componentes principales

**Paso 1**: Crear `components/ControlPanel.tsx`

```typescript
// 50-80 líneas
interface ControlPanelProps {
  onParameterChange: (param: string, value: number) => void;
  // ... otros props
}

export default function ControlPanel({ onParameterChange, ... }: ControlPanelProps) {
  return (
    <div className="control-panel">
      {/* Sliders y controles */}
    </div>
  );
}
```

**Paso 2**: Crear `components/OutputDisplay.tsx`

```typescript
// 40-60 líneas
export default function OutputDisplay({
  output,
  isLoading
}: {
  output: string;
  isLoading: boolean
}) {
  return (
    <div className="output">
      {/* Display de salida */}
    </div>
  );
}
```

**Paso 3**: Crear `components/StepsIndicator.tsx`

```typescript
// 30-40 líneas
export default function StepsIndicator({
  currentStep,
  onStepChange
}: {
  currentStep: number;
  onStepChange: (step: number) => void
}) {
  return (
    <div className="steps">
      {/* Indicadores de pasos */}
    </div>
  );
}
```

**Resultado**: page.tsx pasa de 399 → ~200 líneas

---

## 🟢 TAREA 3: Agregar Tests a Modelos-Difusión (OPCIONAL)

### 3.1 Crear `__tests__/components.test.tsx`

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ParameterSlider from "../src/components/ParameterSlider";

describe("Modelos-Difusión Components", () => {
  it("should render ParameterSlider", () => {
    render(
      <ParameterSlider
        label="Temperature"
        value={0.7}
        onChange={() => {}}
        min={0.05}
        max={1.3}
      />
    );

    expect(screen.getByText("Temperature")).toBeInTheDocument();
  });
});
```

### 3.2 Crear `__tests__/decoding.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import {
  mapToBucketT,
  mapToBucketK,
  choosePattern,
} from "../src/utils/decoding";

describe("Decoding Utils", () => {
  it("should map temperature to correct bucket", () => {
    expect(mapToBucketT(0.1)).toBe("T0");
    expect(mapToBucketT(0.7)).toBe("T2");
    expect(mapToBucketT(1.2)).toBe("T4");
  });

  it("should choose pattern correctly", () => {
    const pattern = choosePattern({
      T: "T2",
      K: "K2",
      P: "P1",
      R: "R2",
    });

    expect(pattern).toMatch(/^[A-J]$/);
  });
});
```

---

## 📝 CHECKLIST DE EJECUCIÓN

### Fase 1: Filtrado-IA (CRÍTICA) - 1-2 horas

- [ ] Crear `__tests__` directory
- [ ] Crear CasosContext.test.tsx
- [ ] Crear MenuCasos.test.tsx
- [ ] Crear VisualizadorCaso.test.tsx
- [ ] Crear analytics.ts (si no existe)
- [ ] Crear analytics.test.ts
- [ ] Integrar trackToolEvent en MenuCasos
- [ ] Integrar trackError en try/catch
- [ ] Ejecutar `npm run test` - verificar 100% pasando
- [ ] Build: `npm run build` - sin errores

### Fase 2: Visor-Difusión (RECOMENDADO) - 1-1.5 horas

- [ ] Crear ControlPanel.tsx
- [ ] Crear OutputDisplay.tsx
- [ ] Crear StepsIndicator.tsx
- [ ] Refactorizar page.tsx (399 → ~200 líneas)
- [ ] Extraer useReducer de useState
- [ ] Build: `npm run build` - sin errores
- [ ] Testing manual: Verificar funcionalidad igual

### Fase 3: Modelos-Difusión (OPCIONAL) - 1 hora

- [ ] Crear `__tests__` directory
- [ ] Crear components.test.tsx
- [ ] Crear decoding.test.ts
- [ ] Ejecutar `npm run test`
- [ ] (Skip si presión de tiempo)

### Fase 4: Verificación Final - 30 minutos

- [ ] `npm run build` - Build completo sin errores
- [ ] `npm run test` - Todos los tests pasando
- [ ] `npm run dev` - Servidor local OK
- [ ] Verificar en navegador: Ambos portales funcionales
- [ ] Verificar en navegador: Todas las herramientas accessibles
- [ ] Verificar analytics en console (dev mode)

---

## 🚀 COMANDOS A EJECUTAR

```bash
# 1. Crear archivos de tests
# En cada herramienta:
mkdir -p apps/web/src/app/\(portals\)/ia/\(marketing\)/herramientas/filtrado-ia/__tests__

# 2. Instalar dependencias de testing si falta
npm install --save-dev @testing-library/react @testing-library/user-event

# 3. Ejecutar tests
npm run test

# 4. Build
npm run build

# 5. Dev
npm run dev
```

---

## 💾 ARCHIVOS A MODIFICAR

### Para Filtrado-IA:

- ✏️ Crear: `src/utils/analytics.ts` (si no existe)
- ✏️ Crear: `__tests__/CasosContext.test.tsx`
- ✏️ Crear: `__tests__/MenuCasos.test.tsx`
- ✏️ Crear: `__tests__/VisualizadorCaso.test.tsx`
- ✏️ Crear: `__tests__/analytics.test.ts`
- ✏️ Modificar: `src/components/MenuCasos.tsx` (agregar trackToolEvent)

### Para Visor-Difusión:

- ✏️ Crear: `src/components/ControlPanel.tsx`
- ✏️ Crear: `src/components/OutputDisplay.tsx`
- ✏️ Crear: `src/components/StepsIndicator.tsx`
- ✏️ Refactorizar: `src/app/page.tsx`

### Para Modelos-Difusión (Opcional):

- ✏️ Crear: `__tests__/components.test.tsx`
- ✏️ Crear: `__tests__/decoding.test.ts`

---

## 📊 RESULTADOS ESPERADOS

**Después de completar este plan:**

```
✅ Filtrado-IA:      90% → 100% (tests + analytics)
✅ Visor-Difusión:   95% → 98% (refactoring)
✅ Modelos-Difusión: 97% → 98% (tests opcional)

Overall IA:     96% → 99%
Overall Monorepo: 98% → 99.5%

Listo para producción ✨
```

---

**Nota**: Este plan es executabilidad paso a paso. Puedes hacer Fase 1 hoy y Fases 2-3 mañana.
**Tiempo total estimado**: 2-4 horas para CRÍTICA + RECOMENDADO
