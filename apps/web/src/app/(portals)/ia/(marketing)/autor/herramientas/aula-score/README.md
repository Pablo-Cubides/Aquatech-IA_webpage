# Aula Score: Aventuras de juego en Clase

Una aplicación interactive scoreboard para gamificación en aulas universitarias. Diseñada para ser controlada por el profesor (host) con soporte para hasta 30 grupos, temporizador configurables y tema claro/oscuro.

## Características principales

- **Configuración flexible**: Define el número de grupos (1-30) y asigna nombres únicos a cada uno
- **Scoreboard en tiempo real**: Visualización clara de puntuaciones con controles +1 y -1 por grupo
- **Countdown animado**: Modal de inicio con cuenta regresiva "3...2...1" antes de iniciar
- **Temporizador opcional**: Modal con duración configurabe (0:30 a 9:00 min) con pausar/reanudar
- **Agregar grupos tardíos**: Botón para añadir nuevos grupos sin alterar el orden existente
- **Tema claro/oscuro**: Toggle de tema persistente en localStorage
- **Sin persistencia**: Estado local (recarga = reset)
- **Desktop-first**: Optimizado para proyector/pantalla de clase

## Stack tecnológico

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** con tokens personalizados
- **React 19** (useEffect, useState)
- **Sin back-end**: Estado local únicamente

## Estructura de carpetas

```
apps/web/src/app/(portals)/ia/(marketing)/autor/herramientas/aula-score/
├── layout.tsx                 # Layout principal con tema
├── page.tsx                   # Página de configuración (/)
├── clasificacion/
│   └── page.tsx              # Página de clasificación (/clasificacion)
├── components/
│   ├── Modal.tsx             # Modal base con accesibilidad
│   ├── CountdownModal.tsx    # Modal countdown 3...2...1
│   ├── TimerModal.tsx        # Modal temporizador configurable
│   ├── ScoreCard.tsx         # Tarjeta de grupo con +1/-1
│   ├── AddGroupModal.tsx     # Modal para agregar grupos tardíos
│   └── ThemeToggle.tsx       # Toggle claro/oscuro
├── lib/
│   └── utils.ts              # shuffleArray, validateGroupNames
└── theme.css                 # Estilos y variables CSS personalizadas
```

## Rutas

- `/ia/autor/herramientas/aula-score` → Configuración de grupos
- `/ia/autor/herramientas/aula-score/clasificacion` → Scoreboard y clasificación

## Flujo de uso

### Paso 1: Configuración

1. Accede a `/ia/autor/herramientas/aula-score`
2. Selecciona número de grupos (1-30)
3. Ingresa nombres únicos para cada grupo
4. Haz clic en "Ir a Clasificación"

### Paso 2: Scoreboard

1. Se muestra modal de countdown "3...2...1"
2. Al terminar, los grupos se ordenan aleatoriamente (una única vez)
3. Usa +1 y -1 para ajustar puntajes
4. Grupos se muestran ordenados por puntaje descendente
5. Usa botón "+ Agregar grupo" para nuevos grupos (sin reordenar)

### Paso 3: Temporizador (opcional)

1. Haz clic en el ícono ⏱️ en la esquina superior derecha
2. Configura minutos (0-9) y segundos (0-59)
3. Haz clic en "Iniciar" para comenzar la cuenta regresiva
4. Usa "Pausar"/"Reanudar" según sea necesario

## Validaciones y reglas

- **Máximo 30 grupos**: Si ingresas más, muestra error
- **Nombres únicos**: Case-insensitive (Grupo 1 = grupo 1 = GRUPO 1)
- **Sin negativos**: Botón -1 deshabilitado cuando score = 0
- **Shuffle único**: Aleatorización ocurre una única vez tras countdown inicial
- **Agregar tardío**: Nuevo grupo entra al final sin reordenar el resto
- **Sin persistencia**: Al recargar la página, se pierde todo estado

## Pruebas manuales

### Test 1: Validación de grupos

```
1. Intenta ingresar 31 grupos
   ✓ Debe mostrar error "El número de grupos debe estar entre 1 y 30"

2. Intenta usar nombres duplicados (ej: "Grupo 1" y "grupo 1")
   ✓ Debe mostrar error "Los nombres de grupos deben ser únicos"

3. Intenta dejar nombres vacíos
   ✓ Debe mostrar error "Todos los nombres son requeridos"

4. Completa todo correctamente
   ✓ Debe navegar a /clasificacion
```

### Test 2: Countdown

```
1. Navega a /clasificacion
   ✓ Debe mostrarse modal "Preparar inicio"

2. Observa el countdown
   ✓ Debe mostrar "3" → "2" → "1" → "¡YA!"
   ✓ Debe cerrar modal automáticamente al terminar
   ✓ Grupos deben aparecer en orden aleatorio (diferente al ingresado)
```

### Test 3: Puntuación

```
1. Haz clic en botón +1 de un grupo
   ✓ Score debe incrementar

2. Haz clic en botón -1 de un grupo
   ✓ Score debe decrementar (hasta 0)

3. Intenta hacer clic en -1 cuando score = 0
   ✓ Botón -1 debe estar deshabilitado (grisado)

4. Ordena múltiples grupos por puntaje
   ✓ Grupos deben reordenarse de mayor a menor puntaje
```

### Test 4: Agregar grupo tardío

```
1. Haz clic en "+ Agregar grupo"
   ✓ Debe abrirse modal "Agregar grupo"

2. Intenta agregar nombre duplicado
   ✓ Debe mostrar error "Este nombre ya existe"

3. Agregar nombre único (ej: "Nuevo Grupo")
   ✓ Debe aparecer al final de la lista con score 0
   ✓ Otros grupos no deben reordenarse
```

### Test 5: Temporizador

```
1. Haz clic en ícono ⏱️
   ✓ Debe abrirse modal "Temporizador"

2. Configura 1:00 (1 minuto)
   ✓ Display debe mostrar "1:00"

3. Haz clic en "Iniciar"
   ✓ Display debe hacer cuenta regresiva (1:00 → 0:59 → ...)

4. Haz clic en "Pausar"
   ✓ Countdown debe detenerse

5. Haz clic en "Reanudar"
   ✓ Countdown debe reanudar desde donde se pausó

6. Intenta ingresar 10:00 (10 minutos)
   ✓ Debe mostrar error o desactivar botón "Iniciar"
   ✓ Máximo permitido es 9:00

7. Haz clic en "Reiniciar"
   ✓ Timer debe resetear a 0:00
```

### Test 6: Tema claro/oscuro

```
1. Haz clic en toggle tema (☀️/🌙) en esquina superior derecha
   ✓ Colores deben cambiar (claro a oscuro o viceversa)
   ✓ Contraste debe ser suficiente en ambos temas

2. Recarga la página
   ✓ Tema debe persistir (guardado en localStorage)

3. Abre DevTools → Application → localStorage
   ✓ Debe existir clave 'aula-score-theme' con valor 'light' o 'dark'
```

### Test 7: Sin persistencia

```
1. Configura 3 grupos y comienza el juego

2. Ajusta algunos puntajes

3. Recarga la página (F5)
   ✓ Debe redirigirse a / (página de configuración)
   ✓ Todo estado debe perderse
```

## Componentes principales

### Modal.tsx

Base para modales con accesibilidad (role, aria-modal, foco atrapado)

### CountdownModal.tsx

Countdown animado con "animate-pulse". Duración fija: 3 segundos

### TimerModal.tsx

Timer configurable con inputs de minutos/segundos, estados running/paused, interval cleanup

### ScoreCard.tsx

Tarjeta individual de grupo con display de score y botones +1/-1

### ThemeToggle.tsx

Toggle persistente de tema que alterna `data-theme` en `<html>`

### ThemeToggle.tsx

Toggle persistente de tema que alterna `data-theme` en `<html>`

## Utilitarios

### shuffleArray(array)

Fisher-Yates shuffle. Llamada una única vez tras countdown.

### validateGroupNames(names)

Valida:

- No vacíos
- Únicos (case-insensitive)
- Máximo 30
- Retorna `{ valid: boolean, error?: string }`

## Colores y tema

Variables CSS (theme.css):

- `--primary-color`: #3b82f6 (botones principales)
- `--secondary-color`: #8b5cf6 (botones secundarios)
- `--success-color`: #10b981 (botones +1)
- `--danger-color`: #ef4444 (botones -1)
- `--background`: #0f172a (oscuro), #ffffff (claro)
- `--surface`: #1e293b (oscuro), #f3f4f6 (claro)

## Inicio rápido

```bash
# Navega a la carpeta de la app web
cd apps/web

# Inicia el servidor de desarrollo
pnpm dev

# Accede en el navegador
# http://localhost:3000/ia/autor/herramientas/aula-score
```

## Restricciones

- ❌ No hay atajos de teclado
- ❌ No hay botón "Deshacer"
- ❌ No hay rondas (puntuación continua)
- ❌ No hay integración con base de datos (estado local únicamente)
- ❌ No hay exportación de resultados
- ❌ No hay sesiones multi-usuario

## Cumplimiento de especificaciones

✅ Página configuración (paso 1: número, paso 2: nombres)
✅ Página clasificación con +1 y -1 (no baja de 0)
✅ Modal countdown "3...2...1"
✅ Shuffle uno único (tras countdown)
✅ Botón "+ Agregar grupo"
✅ Temporizador hasta 9:00 (iniciar/pausar/reanudar/cerrar)
✅ Tema claro/oscuro
✅ Sin persistencia
✅ Una única aula
✅ Todo en español
✅ TypeScript + Next.js 15 + Tailwind v4
✅ Componentes desacoplados
✅ Accesibilidad básica (modales, aria-labels, foco)

## Notas para desarrollador

- Los sonidos del countdown/timer son datos URI mínimos (no archivos externos)
- El shuffle usa `Math.random()` (no determinista, pero suficiente para clase)
- Los modales son funcionales (no utilizan librerías como Headless UI por simplicidad)
- CSS variables se aplican en nivel raíz; Tailwind soporta `var(--variable-name)`
- El orden de grupos en pantalla es por puntaje descendente, pero internamente mantiene otra estructura
