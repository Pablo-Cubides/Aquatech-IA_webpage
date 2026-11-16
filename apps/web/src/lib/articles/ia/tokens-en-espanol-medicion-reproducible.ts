import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// N11 (plan editorial CONT): medicion propia y reproducible de tokens, espanol frente a ingles.
// Los textos fuente, los hashes y el codigo viven en el propio articulo.
// Los bloques de codigo no usan asteriscos ni backticks a proposito: el renderizador de
// texto enriquecido (safe-rich-text) interpreta * como cursiva y los rompeia.

const article: BlogArticle = blogArticleSchema.parse({
  slug: "tokens-en-espanol-medicion-reproducible",
  title: "Tokens en español: cuántos más gasta el mismo texto que en inglés (medición reproducible)",
  category: "Modelos de Lenguaje",
  date: "2026-11-15",
  readTime: 9,
  excerpt:
    "Medimos dos textos oficiales, uno jurídico y uno técnico sobre agua de consumo, en español y en inglés con dos tokenizadores de OpenAI. El español necesitó entre un 22 % y un 76 % más de tokens. Datos, código y método para repetirlo.",
  heroImage: "/images/portal-ia/blog/neural-network-concept.jpg",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ia/autor/pablo-cubides.png",
  },
  content: {
    introduction: "Un modelo de lenguaje no lee palabras: lee tokens, fragmentos de texto que su tokenizador obtiene según un vocabulario fijo. Si ese vocabulario se entrenó sobre todo con inglés, el mismo contenido puede necesitar más tokens en español. Para saber cuántos más, medimos dos documentos oficiales publicados en las dos lenguas, de registros distintos, con dos tokenizadores de OpenAI, y publicamos el método completo para que puedas repetirlo y obtener los mismos números.\n\n**El dato que sí puedes reutilizar.** La razón de tokens entre español e inglés cambió bastante de un texto a otro, pero los caracteres por token se mantuvieron estables en los dos documentos: en español, unos 4,0 con cl100k_base y unos 4,8 con o200k_base; en inglés, entre 5,3 y 5,6 con ambos. Para estimar tus propios textos en español, parte de esa cifra y comprueba con el tokenizador de tu modelo.\n\n**Una salvedad antes de los resultados.** Comparar un texto con su traducción mide esa traducción, no el idioma. Un traductor que elige «sin embargo» donde el original dice «but», o que escribe «2000 millones» donde el original dice «2 billion», alarga el texto por decisión propia, no por una propiedad del español. Por eso las proporciones que siguen describen estos dos pares de textos concretos: son indicativas, no una constante del idioma.",
    sections: [
    {
      "id": "que-medimos",
      "title": "1. Qué medimos y con qué",
      "content": "• **Corpus A, registro jurídico:** la Declaración Universal de Derechos Humanos (preámbulo y 30 artículos) en sus versiones oficiales en español e inglés, de la Oficina del Alto Comisionado de la ONU para los Derechos Humanos. Preparación: conversión con pdftotext 4.00 (opciones -enc UTF-8 -layout); se empieza en «Preámbulo» o «Preamble», se eliminan los encabezados «Artículo N» o «Article N» y se colapsan espacios y saltos de línea.\n\n• **Corpus B, registro técnico:** la nota descriptiva de la OMS sobre agua de consumo, en inglés («Drinking-water») y en español («Agua para consumo humano»), desde «Key facts» o «Datos y cifras» hasta justo antes de «References» o «Referencias». Ambas páginas comparten estructura, secciones y cifras, y la misma fecha de actualización (13 de septiembre de 2023). Una página web puede cambiar: por eso damos también el hash del texto.\n\n• **Tokenizadores:** cl100k_base y o200k_base, de la librería tiktoken de OpenAI. Según la tabla de modelos de su repositorio (consultada el 15 de noviembre de 2026), los modelos cuyo nombre empieza por gpt-4- y gpt-3.5-turbo- usan cl100k_base, y los de gpt-4o-, gpt-4.1-, gpt-5 y la serie o1 y o3 usan o200k_base. Esa tabla puede cambiar: compruébala si necesitas saber qué codificación usa un modelo concreto.\n\n• **Conteo independiente:** con tiktoken 0.14.0 (Python) y con gpt-tokenizer 4.1.2 (JavaScript). Dieron los mismos números en los dos corpus."
    },
    {
      "id": "resultados",
      "title": "2. Resultados",
      "content": "**Corpus A (jurídico, Declaración Universal de Derechos Humanos):**\n\n• Español: 11.563 caracteres, 1.875 palabras, 2.879 tokens con cl100k_base y 2.410 con o200k_base.\n• Inglés: 10.374 caracteres, 1.714 palabras, 1.971 tokens con cl100k_base y 1.972 con o200k_base.\n• Español/inglés: ×1,115 en caracteres, ×1,094 en palabras, **×1,461** en tokens con cl100k_base y **×1,222** con o200k_base.\n\n**Corpus B (técnico, OMS, agua de consumo):**\n\n• Español: 13.019 caracteres, 2.062 palabras, 3.244 tokens con cl100k_base y 2.716 con o200k_base.\n• Inglés: 10.202 caracteres, 1.485 palabras, 1.840 tokens con cl100k_base y 1.835 con o200k_base.\n• Español/inglés: ×1,276 en caracteres, ×1,389 en palabras, **×1,763** en tokens con cl100k_base y **×1,480** con o200k_base.\n\n**Lectura:**\n\n• **La razón de tokens varía mucho entre textos:** de ×1,46 a ×1,76 con cl100k_base y de ×1,22 a ×1,48 con o200k_base. Buena parte de esa variación viene de cuánto más largo sea el texto traducido (en el corpus B, el español tiene un 28 % más de caracteres y un 39 % más de palabras; en el A, un 11,5 % y un 9,4 %). Es justamente la salvedad de arriba.\n• **Una métrica menos dependiente de la traducción: caracteres por token.** En español salen 4,02 y 4,01 con cl100k_base (corpus A y B) y 4,80 y 4,79 con o200k_base. En inglés, 5,26 y 5,54 con cl100k_base, y 5,26 y 5,56 con o200k_base.\n• **El modelo importa tanto como el idioma:** en español, o200k_base genera un 16,3 % menos de tokens que cl100k_base en ambos corpus; en inglés la diferencia es prácticamente nula (menos de un 0,5 %).\n• **Tokens por palabra** (español / inglés): 1,54 / 1,15 (A) y 1,57 / 1,24 (B) con cl100k_base; 1,29 / 1,15 (A) y 1,32 / 1,24 (B) con o200k_base.\n• Una frase corta lo muestra: «Todos los seres humanos nacen libres e iguales en dignidad y derechos» (12 palabras, 70 caracteres) da 19 tokens con cl100k_base y 15 con o200k_base; su equivalente oficial en inglés (12 palabras, 63 caracteres) da 13 con ambos."
    },
    {
      "id": "quitar-tildes",
      "title": "3. ¿Ayuda quitar las tildes?",
      "content": "No. Probamos los textos en español sin diacríticos. Con cl100k_base la variación fue de −0,2 % (corpus A) y +0,1 % (corpus B); con o200k_base, de +3,1 % (A) y +2,7 % (B): más tokens, no menos. Quitar las tildes cambia la ortografía y no ahorra tokens de forma útil."
    },
    {
      "id": "implicaciones",
      "title": "4. Qué implica en la práctica",
      "content": "• Una ventana de contexto medida en tokens contiene menos texto en español que en inglés. En estos dos documentos, el mismo contenido necesitó entre un 22 % y un 76 % más de tokens, según el texto y el tokenizador.\n\n• El dato depende del tokenizador: lo que se mide con una codificación no se puede trasladar a otra. Para estimar el consumo de un modelo concreto, cuenta con su propio tokenizador y con tu propio texto.\n\n• Para entender dónde se parte una palabra y por qué, mira el paso de tokenización de la herramienta de abajo; para el panorama general, lee [qué es un modelo de lenguaje](/ia/blog/que-es-un-modelo-de-lenguaje).",
      "callout": {
        "type": "success",
        "title": "Herramienta Activa",
        "content": "👉 [Cómo funcionan los LLMs: tokenización paso a paso](/ia/herramientas/como-funcionan-llm)"
      }
    },
    {
      "id": "como-repetirlo",
      "title": "5. Cómo repetirlo",
      "content": "**Corpus A.** Descarga los dos PDF oficiales de la Declaración Universal de Derechos Humanos (español e inglés, en la sección de referencias) y conviértelos con pdftotext -enc UTF-8 -layout para obtener udhr_spn.txt y udhr_eng.txt. Prepara los textos con este script de Node (prepara.mjs):\n\nimport { readFileSync, writeFileSync } from \"node:fs\";\nimport { createHash } from \"node:crypto\";\nconst limpiar = (raw, inicio) => {\n  let t = raw.replace(/\\f/g, \"\\n\");\n  t = t.slice(t.indexOf(inicio));\n  t = t.replace(/^\\s{0,}(Art[ií]culo|Article)\\s+[IVX0-9]+\\s{0,}$/gm, \"\");\n  return t.replace(/\\s+/g, \" \").trim();\n};\nwriteFileSync(\"es.txt\", limpiar(readFileSync(\"udhr_spn.txt\", \"utf8\"), \"Preámbulo\"));\nwriteFileSync(\"en.txt\", limpiar(readFileSync(\"udhr_eng.txt\", \"utf8\"), \"Preamble\"));\nfor (const f of [\"es.txt\", \"en.txt\"])\n  console.log(f, createHash(\"sha256\").update(readFileSync(f)).digest(\"hex\"));\n\nEl SHA-256 de es.txt debe ser e99b5319f10122cbf007fd4ba57876b333be65d96e1ee81100eff907640432c2 y el de en.txt, 42afc6d9006789c91000a2453b464d590106b4de3a5752b27caf1e351317469f.\n\n**Corpus B.** Guarda las dos páginas de la OMS como who_en.html y who_es.html, instala la librería he (npm install he) y ejecuta este script (prepara_oms.mjs):\n\nimport { readFileSync, writeFileSync } from \"node:fs\";\nimport { createHash } from \"node:crypto\";\nimport { decode } from \"he\";\nconst cfg = { en: [\"Key facts\", \"References\"], es: [\"Datos y cifras\", \"Referencias\"] };\nfor (const l of [\"en\", \"es\"]) {\n  let h = readFileSync(`who_${l}.html`, \"utf8\");\n  h = h.replace(/<script[\\s\\S]{0,}?<\\/script>/g, \" \").replace(/<style[\\s\\S]{0,}?<\\/style>/g, \" \")\n       .replace(/<nav[\\s\\S]{0,}?<\\/nav>/g, \" \").replace(/<footer[\\s\\S]{0,}?<\\/footer>/g, \" \");\n  const t = decode(h.replace(/<\\/(p|li|h\\d|div|tr)>/g, \"\\n\").replace(/<[^>]+>/g, \" \"))\n    .replace(/[ \\t ]+/g, \" \").replace(/\\n\\s{0,}\\n+/g, \"\\n\");\n  const [ini, fin] = cfg[l];\n  const i = t.indexOf(ini);\n  const g = t.lastIndexOf(\"\\n \" + fin + \" \\n\");\n  const cuerpo = t.slice(i, g).replace(/\\s+/g, \" \").trim();\n  writeFileSync(`oms_${l}.txt`, cuerpo);\n  console.log(`oms_${l}.txt`, createHash(\"sha256\").update(cuerpo, \"utf8\").digest(\"hex\"));\n}\n\nEl SHA-256 de oms_en.txt debe ser 848e26527f8e44af3d1c45c5ec8d1d56b69ba15df6834fce6b03c4f51d18db58 y el de oms_es.txt, 56da119f153923989e3e5e4fad66f1282c782bb5164714e26f2ecd13f6901e62. Si no coinciden, tu conversión difiere (versión de pdftotext, el HTML actual de la OMS, la codificación) y los conteos pueden variar ligeramente.\n\n**Conteo.** Con Python (pip install tiktoken, probado con la versión 0.14.0), cambiando los nombres de archivo para cada corpus:\n\nimport tiktoken\nes = open(\"es.txt\", encoding=\"utf-8\").read()\nen = open(\"en.txt\", encoding=\"utf-8\").read()\nfor n in [\"cl100k_base\", \"o200k_base\"]: enc = tiktoken.get_encoding(n); print(n, \"es:\", len(enc.encode(es)), \"en:\", len(enc.encode(en)))\n\nSalida esperada: corpus A, cl100k_base es: 2879 en: 1971 y o200k_base es: 2410 en: 1972; corpus B (con oms_es.txt y oms_en.txt), cl100k_base es: 3244 en: 1840 y o200k_base es: 2716 en: 1835."
    },
    {
      "id": "limites",
      "title": "6. Lo que esta medición no dice",
      "content": "• **Mide estas traducciones, no el idioma.** Otra traducción del mismo contenido daría otra longitud y, con ella, otra razón de tokens.\n\n• Son dos documentos, de unas 1.500 a 2.100 palabras cada uno, uno jurídico y otro técnico. Con texto coloquial, con cifras o con código, las razones pueden ser distintas.\n\n• Solo se midieron dos tokenizadores de OpenAI. Otros modelos usan tokenizadores distintos y no se miden aquí.\n\n• Los tokens aquí son los del texto puro; las APIs de cada modelo pueden contar además tokens de formato o de sistema.\n\n• No se comparan precios: no los incluimos porque cambian con frecuencia y se consultan en la documentación de cada proveedor."
    },
    {
      "id": "preguntas-frecuentes",
      "title": "Preguntas frecuentes",
      "content": "Respuestas breves a las dudas más comunes sobre este tema.",
      "subsections": [
        {
          "id": "faq-1",
          "title": "¿Qué es un token?",
          "content": "Un fragmento de texto, a veces una palabra completa y a veces solo una parte, que el tokenizador de un modelo obtiene según un vocabulario fijo."
        },
        {
          "id": "faq-2",
          "title": "¿Gasta más tokens el español que el inglés?",
          "content": "En estos dos documentos, sí: entre un 22 % y un 76 % más según el texto y el tokenizador. Esa razón mide estas traducciones, no el idioma."
        },
        {
          "id": "faq-3",
          "title": "¿Cuántos caracteres hay por token en español?",
          "content": "En los dos documentos medidos, unos 4,0 con cl100k_base y unos 4,8 con o200k_base; en inglés, entre 5,3 y 5,6."
        },
        {
          "id": "faq-4",
          "title": "¿Quitar las tildes reduce los tokens?",
          "content": "No: con o200k_base aumentó entre un 2,7 % y un 3,1 %, y con cl100k_base la variación fue de −0,2 % a +0,1 %."
        },
        {
          "id": "faq-5",
          "title": "¿Puedo repetir la medición?",
          "content": "Sí: el artículo da los textos, las versiones, el código y los hashes para comprobarlo."
        }
      ]
    }
  ],
    conclusion: "Con el mismo contenido, el español necesitó más tokens que el inglés en los dos documentos: entre un 46 % y un 76 % más con cl100k_base y entre un 22 % y un 48 % más con o200k_base. Esa horquilla describe estos textos y sus traducciones, no una constante del idioma; lo más estable fue el número de caracteres por token (alrededor de 4 con cl100k_base y de 4,8 con o200k_base en español). La codificación más reciente redujo la diferencia, pero no la eliminó. Si trabajas con modelos en español, mide tu propio texto con el tokenizador del modelo que uses: con el método de arriba, es cuestión de minutos.",
  },
  tags: ["Tokenización", "LLMs", "IA", "Tutoriales IA"],
  // Sin nextArticle: lint-content solo ve los archivos de articles/, y el articulo relacionado
  // ("que-es-un-modelo-de-lenguaje") vive en PostgreSQL; el enlace va en el cuerpo del texto.
});

export default article;
