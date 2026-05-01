# User Personas / Personas de Usuario
> Reference these personas in specs (§2) and content specs (§3.2).  
> Version: 1.0.0 | Last updated: 2026-04-28

---

## Persona 1 — Pablo (Instructor / Platform Owner)

| Field | Value |
|---|---|
| **Role** | Instructor universitario, desarrollador, dueño de la plataforma |
| **Age** | 35 |
| **Location** | Colombia |
| **Technical level** | Expert (ingeniería química, IA, desarrollo web) |
| **Primary portal** | Both (creator and user) |
| **Goals** | Crear herramientas educativas, publicar contenido técnico de alto valor, monetizar el acceso premium |
| **Pain points** | Tiempo limitado — necesita que los procesos repetitivos sean automatizados o scriptados |
| **Tools used** | Claude Code, VS Code + Copilot, Antigravity, Vercel, Supabase |
| **Content interaction** | Genera artículos con IA, revisa Aula Score y Consulta Nota con sus estudiantes |

**Design implications**: Priorizar velocidad de publicación y automatización. UX de herramientas de autor debe ser eficiente, no didáctica. CLI y shortcuts > GUI para este usuario.

---

## Persona 2 — Estudiante Universitario (IA)

| Field | Value |
|---|---|
| **Role** | Estudiante de ingeniería o ciencias que toma un curso con Pablo |
| **Age** | 19–24 |
| **Location** | Colombia |
| **Technical level** | Beginner–Intermediate en IA |
| **Primary portal** | Portal IA |
| **Goals** | Entender conceptos de IA de forma práctica, consultar su nota, participar en actividades de clase |
| **Pain points** | Terminología técnica sin ejemplos; interfaces lentas en datos móviles |
| **Tools used** | Navegador móvil o laptop; no tiene cuenta en la plataforma (acceso anónimo a herramientas gratuitas) |
| **Content interaction** | Lee artículos del blog, usa herramientas interactivas (parámetros LLM, visor difusión, Consulta Nota) |

**Design implications**: Lenguaje accesible con ejemplos concretos. Mobile-first. LCP <2.5s crítico (datos móviles). Herramientas deben funcionar sin cuenta para el primer uso.

---

## Persona 3 — Profesional Ambiental

| Field | Value |
|---|---|
| **Role** | Consultor o funcionario de gestión ambiental |
| **Age** | 28–45 |
| **Location** | Colombia, LATAM |
| **Technical level** | Domain expert en temas ambientales; intermediate en tecnología |
| **Primary portal** | Portal Ambiental |
| **Goals** | Generar matrices EIA, consultar normativa ambiental, visualizar datos de calidad de agua |
| **Pain points** | Herramientas de GIS o análisis ambientales son caras o complejas; normativa dispersa en PDFs |
| **Tools used** | Navegador desktop, Excel, ArcGIS |
| **Content interaction** | Usa Generador de Matrices, Normas Ambientales, Visor de Mapas, Análisis de Correlaciones |

**Design implications**: Desktop-first para herramientas (datos pesados). Exportación a CSV/PDF esencial. Interfaz limpia, sin distracciones. Citar fuentes normativas con claridad.

---

## Persona 4 — Explorador de IA (Autodidacta)

| Field | Value |
|---|---|
| **Role** | Profesional de otro campo curioso sobre IA |
| **Age** | 25–40 |
| **Location** | LATAM (varios países) |
| **Technical level** | Non-technical pero inteligente |
| **Primary portal** | Portal IA |
| **Goals** | Entender cómo funciona la IA a nivel conceptual, explorar herramientas, mantenerse informado |
| **Pain points** | Contenido técnico demasiado denso; falta de ejemplos en español de calidad |
| **Tools used** | Navegador desktop o móvil |
| **Content interaction** | Lee artículos del blog, puede usar herramientas interactivas básicas |

**Design implications**: Artículos con nivel progresivo (introducción accesible antes de entrar en detalles técnicos). CTAs claros hacia herramientas relacionadas. No asumir conocimiento previo de programación.

---

## Persona Usage in Specs

When writing a spec, reference personas by name:
- "Pablo (Instructor)" for platform-owner/admin features.
- "Estudiante Universitario" for student-facing tools.
- "Profesional Ambiental" for environmental portal tools.
- "Explorador de IA" for general-audience IA portal content.

Multiple personas can be primary/secondary for the same feature.
