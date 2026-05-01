# Domain Glossary / Glosario de Dominio
> Lenguaje ubicuo del proyecto AquatechIA. Todo término nuevo introducido en una spec debe aparecer aquí.  
> Ubiquitous language for the AquatechIA project. Every new term introduced in a spec must appear here.

---

## Platform Concepts / Conceptos de la plataforma

| Term (ES) | Term (EN) | Definition |
|---|---|---|
| **Crédito** | Credit | La unidad de monetización de AquatechIA. Un crédito se consume al usar una herramienta premium. El balance nunca puede ser negativo. |
| **Balance de créditos** | Credit balance | La cantidad actual de créditos disponibles de un usuario. Integer ≥ 0. |
| **Herramienta** | Tool | Una funcionalidad interactiva dentro de un portal (ej. Visor de Difusión, Generador de Matrices). |
| **Portal** | Portal | Una de las dos interfaces diferenciadas del sistema: IA o Ambiental. Tienen temas visuales, audiencias y herramientas distintos. |
| **Portal IA** | IA Portal | La interfaz de tema oscuro dedicada a herramientas de inteligencia artificial. Ruta: `/ia/*`. |
| **Portal Ambiental** | Environmental Portal | La interfaz de tema claro dedicada a soluciones ambientales. Ruta: `/ambiental/*`. |
| **Aula** | Classroom / Course session | Contexto educativo en el que opera el autor/docente. Usado en herramientas como Aula Score y Ruleta Académica. |
| **Autor** | Author/Instructor | Rol de usuario con acceso a herramientas pedagógicas (Aula Score, Consulta Nota, Ruleta Académica). |
| **Estudiante** | Student | Usuario final de herramientas orientadas a aprendizaje (lectura de artículos, consulta de nota). |
| **Score** | Score | Puntuación asignada a un estudiante dentro de una Aula. Calculado y mostrado en Aula Score. |
| **Sesión** | Session | La sesión autenticada de un usuario, manejada por NextAuth y respaldada en Firebase token. |

---

## Content / Contenido

| Term (ES) | Term (EN) | Definition |
|---|---|---|
| **Artículo** | Article | Unidad de contenido del blog. Se representa como un objeto `BlogArticle` en TypeScript. |
| **Slug** | Slug | Identificador URL-safe de un artículo. Formato kebab-case en español. Único en todos los portales. Ej: `como-funcionan-los-llm-guia`. |
| **Excerpt** | Excerpt | Resumen de 1-2 oraciones del artículo (≤280 caracteres). Aparece en listados y meta description SEO. |
| **Hero image** | Hero image | Imagen principal de un artículo. Presupuesto ≤200KB. Almacenada en Cloudinary (artículos nuevos). |
| **Sección** | Section | Subsección de contenido dentro de un artículo. Tiene `id`, `title`, `content`, y opcionalmente `image`, `callout`, `subsections`. |
| **Callout** | Callout | Bloque de énfasis dentro de una sección. Tipos: `info`, `warning`, `success`. |
| **Taxonomía de tags** | Tag taxonomy | Lista de tags aprobados para clasificar artículos. Ver sección de Tags más abajo. |
| **readTime** | Read time | Tiempo estimado de lectura en minutos. Calculado: `ceil(palabras / 200)`. |
| **nextArticle** | Next article | Artículo relacionado sugerido al final de la lectura. Debe ser un slug existente y publicado. |

---

## Environmental Domain / Dominio Ambiental

| Term (ES) | Term (EN) | Definition |
|---|---|---|
| **Matriz EIA** | EIA Matrix | Matriz de Evaluación de Impacto Ambiental. Estructura tabular que cruza acciones de un proyecto con componentes ambientales para evaluar impactos. |
| **Norma ambiental** | Environmental regulation | Regulación legal aplicable a proyectos ambientales (ej. Decreto 2811, Ley 99 de 1993 en Colombia). |
| **Estación de monitoreo** | Monitoring station | Punto geográfico donde se miden parámetros ambientales (temperatura, caudal, turbidez, etc.). |
| **Correlación** | Correlation | Relación estadística entre dos variables ambientales. Calculada con `simple-statistics` en el Portal Ambiental. |
| **GBIF** | GBIF | Global Biodiversity Information Facility. API externa usada para datos de biodiversidad. |
| **WQP** | WQP | Water Quality Portal. API externa usada para datos de calidad de agua. |
| **Parámetro de calidad de agua** | Water quality parameter | Variable medida en un cuerpo de agua (pH, turbidez, coliformes, etc.). |
| **Visor** | Viewer/Explorer | Herramienta de visualización interactiva (Visor de Mapas, Visor de Difusión). |

---

## AI Domain / Dominio IA

| Term (ES) | Term (EN) | Definition |
|---|---|---|
| **LLM** | LLM (Large Language Model) | Modelo de Lenguaje Grande. Ej: GPT-4, Claude, LLaMA. |
| **Transformer** | Transformer | Arquitectura de red neuronal basada en mecanismos de atención. Base de los LLMs modernos. |
| **Tokenización** | Tokenization | Proceso de convertir texto en tokens (sub-unidades) procesables por un LLM. |
| **Temperatura** | Temperature | Hiperparámetro que controla la aleatoriedad en la generación de texto (0=determinista, 1=creativo). |
| **Top-P** | Top-P | Nucleus sampling: parámetro que limita el pool de tokens al % de masa de probabilidad especificado. |
| **Top-K** | Top-K | Parámetro que limita la selección del siguiente token a los K más probables. |
| **Difusión** | Diffusion (AI) | Tipo de modelo generativo que aprende a revertir un proceso de ruido (ej. Stable Diffusion para imágenes). |
| **Parámetros de decodificación** | Decoding parameters | Conjunto de hiperparámetros (temperatura, Top-P, Top-K) que controlan la salida de un LLM. |
| **Atención** | Attention | Mecanismo que permite a un transformer relacionar tokens entre sí en una secuencia. |
| **Agente IA** | AI Agent | Sistema que usa un LLM para planificar y ejecutar tareas de manera autónoma. Ej: Claude Code, Copilot. |
| **Antigravity** | Antigravity | Plataforma de desarrollo con IA utilizada en el proyecto (IDE/agente). |

---

## Technical Infrastructure / Infraestructura técnica

| Term (ES) | Term (EN) | Definition |
|---|---|---|
| **Monorepo** | Monorepo | Repositorio único que contiene todas las aplicaciones y paquetes del proyecto. Gestionado con Turborepo + pnpm. |
| **Workspace package** | Workspace package | Paquete interno del monorepo (ej. `@ia-next/database`). Referenciado con `workspace:*`. |
| **App Router** | App Router | Sistema de routing de Next.js 13+ basado en el directorio `app/`. Usa Server Components por defecto. |
| **Route group** | Route group | Directorio entre paréntesis en App Router que no aparece en la URL (ej. `(portals)/ia/`). |
| **Server Component** | Server Component | Componente React renderizado en el servidor. Sin JavaScript en el cliente. Default en este proyecto. |
| **Client Component** | Client Component | Componente React con `"use client"`. Necesario para hooks con estado o APIs del navegador. |
| **Preference (MercadoPago)** | Payment preference | Objeto creado en MercadoPago que define los ítems, precios y URLs de retorno de una transacción. |
| **Webhook** | Webhook | Notificación HTTP enviada por un servicio externo (MercadoPago, Brevo) cuando ocurre un evento. |
| **Edge runtime** | Edge runtime | Entorno de ejecución de Vercel en CDN edge. Requiere APIs compatibles (no Node.js full). |
| **Preflight** | Preflight | Conjunto de validaciones ejecutadas antes de hacer push (typecheck, lint, tests, content-lint). |

---

## Approved Tag Taxonomy / Taxonomía de tags aprobada

Tags usados en artículos del blog. Nuevos tags deben agregarse aquí antes de usarse.

### Portal IA
`LLMs`, `Transformer`, `Tokenización`, `IA`, `Machine Learning`, `Herramientas IA`, `Tutoriales IA`, `Redes Neuronales`, `Generación de Imágenes`, `Difusión`, `Parámetros LLM`, `Claude`, `GPT`, `Filtrado de Contenido`, `Atención`, `Agentes IA`, `Productividad IA`

### Portal Ambiental
`Agua`, `Calidad del Agua`, `Matrices EIA`, `Impacto Ambiental`, `Normativa Ambiental`, `Gestión Hídrica`, `GBIF`, `Biodiversidad`, `Monitoreo Ambiental`, `Colombia`, `LATAM`, `Correlación Estadística`, `Mapas Ambientales`, `Saneamiento`, `ODS 6`

### Shared
`Tutorial`, `Análisis`, `Datos`, `Colombia`, `Educación`, `AquatechIA`

---

## ID Conventions / Convenciones de ID

| Format | Used for | Example |
|---|---|---|
| `SPEC-NNN` | Feature specs | `SPEC-001`, `SPEC-100` |
| `ADR-NNNN` | Architecture decisions | `ADR-0001`, `ADR-0011` |
| `TNNN` | Tasks within a spec | `T001`, `T012` |
| `US-NNN` | User stories within a spec | `US-001` |
| `AC-NNN.X` | Acceptance criteria | `AC-001.1`, `AC-001.3` |
| `BR-NNN` | Business rules within a spec | `BR-001` |
