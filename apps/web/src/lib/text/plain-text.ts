/**
 * Texto plano a partir de HTML y/o Markdown, para JSON-LD (FAQPage, description), texto visible de FAQ y llms-full.txt.
 *
 * Los contenidos del sitio mezclan HTML (<ul>, <strong>) con Markdown (**negrita**, [enlace](url)), asi que una sola funcion
 * resuelve ambos. Reutilizar desde cualquier generador de texto para maquinas; no duplicar estas expresiones regulares.
 */

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}

export type PlainTextOptions = {
  /** true: conserva parrafos (linea en blanco) y viñetas "- ". false (por defecto): una sola linea. */
  multiline?: boolean;
  /** true: conserva los encabezados Markdown ("## Titulo") para mantener la jerarquia del documento. */
  keepHeadings?: boolean;
};

/** Quita HTML y Markdown y devuelve texto legible. Idempotente sobre texto que ya es plano. */
export function toPlainText(input: string | null | undefined, options: PlainTextOptions = {}): string {
  const { multiline = false, keepHeadings = false } = options;
  let text = String(input ?? "").replace(/\r\n?/g, "\n");

  // HTML: los cierres de bloque separan; <li> se convierte en viñeta; el resto de etiquetas desaparece.
  text = text
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*li\b[^>]*>/gi, "\n- ")
    .replace(/<\/\s*(p|div|ul|ol|li|h[1-6]|tr|table|section|blockquote)\s*>/gi, "\n\n")
    .replace(/<\/?[a-zA-Z][^>]*>/g, ""); // solo etiquetas reales: "(<25)" y "(>50)" son texto
  text = decodeEntities(text);

  // Markdown de bloque.
  text = text
    .replace(/^```[^\n]*\n([\s\S]*?)^```[ \t]*$/gm, "$1")
    // Tablas: se descarta la fila separadora y los pipes de borde ("| a | b |" -> "a | b").
    .replace(/^[ \t]*\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)*\|?[ \t]*$/gm, "")
    .replace(/^[ \t]*\|(.*)\|[ \t]*$/gm, (_, row: string) =>
      row
        .split("|")
        .map((cell) => cell.trim())
        .join(" | "),
    )
    .replace(/^ {0,3}>\s?/gm, "")
    .replace(/^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/gm, "")
    .replace(/^[ \t]*[-*+][ \t]+/gm, "- "); // las listas ordenadas conservan su numeracion
  if (!keepHeadings) text = text.replace(/^ {0,3}#{1,6}[ \t]+(.*?)[ \t]*#*[ \t]*$/gm, "$1");

  // Markdown en linea. Imagen antes que enlace; el texto del enlace se conserva, la URL se descarta.
  text = text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`+([^`\n]+?)`+/g, "$1")
    .replace(/\*\*\*([^*\n]+?)\*\*\*/g, "$1")
    .replace(/\*\*([^\n]+?)\*\*/g, "$1")
    .replace(/(?<![\w_])__([^_\n]+?)__(?![\w_])/g, "$1")
    .replace(/(?<![\w*])\*(?![\s*])([^*\n]+?)(?<![\s*])\*(?![\w*])/g, "$1")
    .replace(/(?<![\w_])_(?![\s_])([^_\n]+?)(?<![\s_])_(?![\w_])/g, "$1")
    .replace(/~~([^~\n]+?)~~/g, "$1");

  if (!multiline) {
    // Las viñetas pierden el guion; si el item no cierra con puntuacion, se separa con ". " para no fundir frases.
    return text
      .split(/\n+/)
      .map((line) => line.replace(/^\s*(?:-|\d+[.)])\s+/, "").trim())
      .filter(Boolean)
      .map((line, index, lines) => (index < lines.length - 1 && !/[.!?…:;]$/.test(line) ? `${line}.` : line))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const ABBREVIATION_BEFORE_PERIOD = /(?:\b(?:EE|UU|e\.g|i\.e|etc|Dr|Dra|Sr|Sra|Art|Arts|No|Núm|Res|Dec|vs|aprox|Fig|Ec|Cap|pág|pp|op|cit)|\b[A-Z])$/;

/** Indices (justo despues del signo) donde termina una frase completa. Ignora "EE.UU.", "e.g.", decimales y siglas. */
function sentenceEnds(text: string): number[] {
  const ends: number[] = [];
  const pattern = /[.!?…]+(?=["')\]]*(?:\s+[A-ZÁÉÍÓÚÑ¿¡0-9"“(\-]|\s*$))/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    const end = match.index + match[0].length;
    const before = text.slice(0, match.index);
    // "5.1%." es fin de frase; "EE.UU." o "Art." no.
    if (match[0] === "." && ABBREVIATION_BEFORE_PERIOD.test(before) && end < text.length) continue;
    ends.push(end);
  }
  return ends;
}

/**
 * Recorta en limite de frase, nunca de caracteres: devuelve las frases completas que caben en `max`.
 * Si la primera frase ya excede `max`, se devuelve esa frase completa (mejor larga que cortada).
 */
export function truncateAtSentence(text: string, max: number): string {
  const clean = text.trim();
  if (clean.length <= max) return closeSentence(clean);
  const ends = sentenceEnds(clean);
  const fitting = ends.filter((end) => end <= max);
  const cut = fitting.length ? fitting[fitting.length - 1] : ends[0];
  return closeSentence(cut ? clean.slice(0, cut) : clean);
}

function closeSentence(text: string): string {
  const trimmed = text.trim().replace(/[,;:\s]+$/, "");
  return /[.!?…]["')\]]*$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/**
 * Para el texto visible de las secciones, que llega como HTML con Markdown en linea (**negrita**).
 * Convierte solo el Markdown en linea a etiquetas; el HTML existente se deja intacto.
 */
export function inlineMarkdownToHtml(html: string): string {
  return html
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*\*([^*\n<]+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^\n<]+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<![\w*])\*(?![\s*])([^*\n<]+?)(?<![\s*])\*(?![\w*])/g, "<em>$1</em>")
    .replace(/`([^`\n<]+?)`/g, "<code>$1</code>");
}
