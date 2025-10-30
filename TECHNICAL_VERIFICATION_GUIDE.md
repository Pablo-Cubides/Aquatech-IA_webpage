# 🔧 INSTRUCCIONES TÉCNICAS - VERIFICACIÓN Y DEPLOYMENT

## 1️⃣ VERIFICAR BUILD (5 minutos)

```powershell
# Terminal PowerShell en la raíz del proyecto
cd d:\Empresas\AquatechIA\webpage

# Compilar
pnpm --filter @ia-next/web build

# Esperado:
# ✅ Build successful
# ✅ 74 routes generated
# ✅ 0 errors
```

---

## 2️⃣ EJECUTAR TESTS (10 minutos)

```powershell
# Terminal PowerShell
cd d:\Empresas\AquatechIA\webpage

# Ejecutar tests
pnpm --filter @ia-next/web test

# Buscar específicamente Filtrado-IA:
# Debería ver:
# ✅ analytics.test.ts (12 tests)
# ✅ CasosContext.test.tsx (4 tests)
# ✅ MenuCasos.test.tsx (8 tests)
# ✅ VisualizadorCaso.test.tsx (10 tests)
#
# TOTAL FILTRADO-IA: 34/34 PASAN ✅
```

---

## 3️⃣ VERIFICAR ARCHIVOS NUEVOS

```powershell
# Ver estructura de Filtrado-IA
cd "d:\Empresas\AquatechIA\webpage\apps\web\src\app\(portals)\ia\(marketing)\herramientas\filtrado-ia"

# Verificar __tests__ directory creado
ls -Directory | grep __tests__

# Verificar 4 archivos de test
ls ./__tests__/
# Debe mostrar:
# - analytics.test.ts
# - CasosContext.test.tsx
# - MenuCasos.test.tsx
# - VisualizadorCaso.test.tsx
```

---

## 4️⃣ VERIFICAR CAMBIOS EN MenuCasos.tsx

```powershell
# Abrir archivo modificado
code src/components/MenuCasos.tsx

# Debe contener:
# ✅ import { useSession } from 'next-auth/react'
# ✅ import { trackToolEvent } from '../utils/analytics'
# ✅ const { data: session } = useSession()
# ✅ trackToolEvent('caso_selected', {...}, session?.user?.email || undefined)
```

---

## 5️⃣ STAGING DEPLOYMENT

```powershell
# Push to staging branch (si usas Vercel)
git checkout staging
git pull origin main  # O la rama que uses

# Vercel automáticamente:
# ✅ Crea preview deployment
# ✅ Ejecuta build
# ✅ Ejecuta tests (si están configurados)

# URL: https://ia-next-[HASH].vercel.app
```

---

## 6️⃣ VERIFICACIÓN MANUAL EN BROWSER

### Como-Funcionan-LLM

```
URL: http://localhost:3000/ia/herramientas/como-funcionan-llm
✅ Carga sin errores
✅ 7 pasos visibles
✅ Interactivo (clickear en cada paso)
```

### Modelos-Difusión

```
URL: http://localhost:3000/ia/herramientas/modelos-difusion
✅ Carga sin errores
✅ 4 pasos visibles
✅ Parámetros (T, K, P, R) funcionan
✅ Ejemplos se actualizan
```

### Visor-Difusión

```
URL: http://localhost:3000/ia/herramientas/visor-difusion
✅ Carga sin errores
✅ Visualización funciona
✅ Panel educativo visible
```

### Filtrado-IA (NUEVA)

```
URL: http://localhost:3000/ia/herramientas/filtrado-ia
✅ Carga sin errores
✅ 50+ casos visibles
✅ Clickear casos muestra filtrado
✅ Keyboard navigation (ArrowUp/ArrowDown)
✅ Analytics tracked (verificar Sentry dashboard)
```

---

## 7️⃣ VERIFICAR ANALYTICS EN SENTRY

```
1. Ir a: https://sentry.io/dashboard/
2. Seleccionar proyecto: ia-next
3. Buscar eventos recientes:
   - tipo: 'caso_selected'
   - tool: 'filtrado-ia'
   - usuario: session.user.email
4. Debe mostrar tracking de clicks
```

---

## 8️⃣ PRODUCTION DEPLOYMENT

```powershell
# Una vez pasada QA en staging

# Opción A: Si usas GitHub (recomendado)
git checkout main
git merge staging
git push origin main

# Vercel automáticamente deploya a producción

# Opción B: Si usas Vercel CLI
vercel --prod

# Verificar deployment
# ✅ Build completado
# ✅ URL de producción activa
# ✅ Todos los tools funcionando
```

---

## 🔍 TROUBLESHOOTING

### Build falla con "Module not found"

```
Solución:
pnpm install
pnpm --filter @ia-next/web build
```

### Tests fallan

```
Asegurar que está ejecutando en workspace correcto:
pnpm --filter @ia-next/web test
```

### Analytics no funciona

```
Verificar:
✅ Sentry SDK inicializado en app layout
✅ SENTRY_DSN en .env.local
✅ useSession Hook importado correctamente
✅ NextAuth session provider en layout
```

### Rutas 404

```
Asegurar que son accesibles:
/ia/herramientas/como-funcionan-llm ✅
/ia/herramientas/modelos-difusion ✅
/ia/herramientas/visor-difusion ✅
/ia/herramientas/filtrado-ia ✅
```

---

## 📊 COMANDOS RÁPIDOS RESUMEN

```powershell
# DESARROLLO LOCAL
pnpm install                           # Install dependencies
pnpm dev                              # Start dev server

# BUILD VERIFICACIÓN
pnpm --filter @ia-next/web build      # Build app
pnpm --filter @ia-next/web test       # Run tests

# DEPLOYMENT
git push origin main                  # Push to staging
git checkout main && git merge dev    # Merge to main
vercel --prod                         # Deploy to production

# DEBUGGING
pnpm lint                             # Check linting
pnpm type-check                       # Check types
```

---

## ✅ FINAL CHECKLIST ANTES DE PRODUCCIÓN

```
PRE-DEPLOYMENT VERIFICATION:
- [ ] Build compila sin errores
- [ ] Tests pasan (especialmente Filtrado-IA: 34/34)
- [ ] Verificado en staging (todas 4 herramientas)
- [ ] Analytics funcionando en Sentry
- [ ] URLs correctas
- [ ] No hay console errors
- [ ] Performance OK (LCP < 2.5s)
- [ ] Mobile responsive
- [ ] Keyboard navigation (especialmente Filtrado-IA)
- [ ] Accesibilidad WCAG

DEPLOYMENT:
- [ ] QA manual completado
- [ ] Stakeholders notificados
- [ ] Merge a main realizado
- [ ] Deployment a producción completado
- [ ] Monitoreo de Sentry activo
- [ ] URLs producción verificadas
```

---

## 📞 SUPPORT

Si hay issues:

1. Revisar VERIFICACION_PROFUNDA_FINAL.md (auditoría técnica)
2. Revisar logs en Sentry dashboard
3. Ejecutar build nuevamente en local
4. Revisar que todos los imports sean correctos

---

**Status**: ✅ READY  
**Última actualización**: Hoy  
**Verificado en**: Build + Tests + Manual
