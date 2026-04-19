# Spec: Flujos y Meta-Skills del Agente IA (Agent Workflows)

Esta especificación actúa como el "Directorio Raíz" para el comportamiento transaccional del agente IA operando sobre el código base de Aquatech-IA.

## 0. Directiva Base de Mejora Continua (Meta-Agent Learning)
El Agente tiene la **responsabilidad proactiva** de analizar sus propios bucles y rutinas de trabajo.
**REGLA:** Si realizamos una acción idéntica, repetitiva o que requiera lidiar con una peculiaridad del sistema repetidamente (más de 2 veces), **es exigencia del agente proponerle al humano la creación de una nueva Skill/Regla**. El conocimiento no debe quedarse en la memoria a corto plazo del chat de IA, sino instanciarse perdurablemente en esta jerarquía de documentación SDD.

## 1. Reglas Inmediatas
Cualquier agente debe validar mentalmente lo siguiente antes de ejecutar código en terminal:
1. ¿Es indispensable compilar ahora? (Solo para confirmar Smoke Builds, usar `pnpm build`).
2. ¿Hay caracteres como paréntesis en las rutas de Next.js App Router para comandos como Git? Usa comillas simples en Windows. (El detalle extendido está documentado en [05-routing-imports-spec.md](./05-routing-imports-spec.md)).

## 2. Catálogo Oficial de Skills Especializadas

Las habilidades satélite del proyecto. El agente siempre debe usar y respetar estas lógicas antes de crear archivos de características:

-   📄 **`media-and-assets-guide.md` (Media & Assets)**: Ubicada en `docs/skills/media-and-assets-guide.md`. Rige *Cloudinary* (imágenes nuevas) vs *Vercel* (base local estática).
-   📄 **`notebooklm-article-generator.md`**: Define el workflow de redacción técnica que combina investigación en NotebookLM y generación en Studio.
-   📄 **`pre-push-validation.md`**: Reglas de Integración Continua Local antes del `git push`. Interviene obligatoriamente con `lint` y chequeos restrictivos de TypeScript.

## 3. Filtrado Spec-Driven
Ante cualquier requerimiento humano no-trivial como ("Lanza una herramienta nueva", "Conecta una nueva BBDD"):
- **Prohibido:** Proceder a programar directamente.
- **Flujo:** Evaluar impacto contra `UI_UX`, `Architecture`, y `Data Models`. Informar brechas y proponer plan.
