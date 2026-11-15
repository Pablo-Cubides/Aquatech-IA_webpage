const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char);
}

const CTA_EMOJIS = ["🚀", "🌍", "👉", "📊", "🔗", "✅", "💡"];

/**
 * Caracteres que el navegador ignora o que no pueden formar parte de un esquema:
 * controles C0/C1 (incluye tab, LF, CR), espacio, y separadores/ceros de ancho
 * cero. Se construye con códigos numéricos para que el fuente no lleve
 * caracteres invisibles.
 */
const IGNORED_URL_CHARS = new RegExp(
  "[" +
    [
      [0x00, 0x20],
      [0x7f, 0x9f],
      [0x200b, 0x200f],
      [0x2028, 0x2029],
      [0xfeff, 0xfeff],
    ]
      .map(([from, to]) => `${String.fromCharCode(from)}-${String.fromCharCode(to)}`)
      .join("") +
    "]",
  "g",
);

/** Esquemas absolutos permitidos en enlaces Markdown. */
const ALLOWED_LINK_SCHEMES = new Set(["http", "https", "mailto"]);

/**
 * Decide si el destino de un enlace Markdown es seguro como `href`.
 *
 * Lista blanca: http, https, mailto y rutas relativas (`/ruta`, `#ancla`,
 * `?q=`, `./x`, `../x`, `ruta`). Todo lo demás se rechaza (javascript:, data:,
 * vbscript:, file:, blob:, …).
 *
 * El navegador ignora tabuladores, saltos de línea y espacios/controles al
 * principio al interpretar la URL (`java\tscript:` ejecuta), por eso el esquema
 * se detecta sobre la URL SIN ningún espacio ni carácter de control, y en
 * minúsculas. Si hay un `:` antes de la primera `/`, `?` o `#`, es un esquema;
 * cualquier esquema no incluido en la lista se rechaza, también los que
 * contengan caracteres raros.
 */
export function isSafeLinkUrl(rawUrl: string): boolean {
  const compact = rawUrl.replace(IGNORED_URL_CHARS, "");
  if (!compact) return false;

  const schemeMatch = /^([^/?#:]*):/.exec(compact);
  if (!schemeMatch) return true; // ruta relativa, ancla o query

  return ALLOWED_LINK_SCHEMES.has(schemeMatch[1].toLowerCase());
}

function formatInline(escaped: string, strongClass: string): string {
  return escaped
    .replace(/\*\*\*(.+?)\*\*\*/g, `<strong class="${strongClass}"><em>$1</em></strong>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong class="${strongClass}">$1</strong>`)
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

export function renderSafeRichText(input: string, strongClass: string): string {
  // 0. Los NUL delimitan los marcadores internos: no pueden venir del texto.
  // eslint-disable-next-line no-control-regex
  const source = input.replace(/\u0000/g, "");

  // 1. Escape HTML for security
  let processed = escapeHtml(source);

  // 2. Process Markdown Links: [text](url)
  // Se hace tras escapar (el texto y la URL ya no pueden abrir etiquetas ni
  // salirse del atributo). Los enlaces se guardan aparte y se reinsertan al
  // final, para que el formato Markdown posterior no toque el interior de <a>.
  const anchors: string[] = [];

  processed = processed.replace(/\[(.+?)\]\((.+?)\)/g, (_match, text: string, url: string) => {
    // Un destino no permitido (javascript:, data:, …) se degrada a texto plano.
    if (!isSafeLinkUrl(url)) return text;

    // Check if it's a CTA based on the first character/emoji
    const isCTA = CTA_EMOJIS.some((emoji) => text.trim().startsWith(emoji));
    const linkClass = isCTA
      ? "inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-medium rounded-lg transition-all border border-blue-500/20 my-2 no-underline"
      : "text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 font-medium transition-colors";

    anchors.push(
      `<a href="${url}" class="${linkClass}" target="_blank" rel="noopener noreferrer">${formatInline(text, strongClass)}</a>`,
    );
    return `\u0000${anchors.length - 1}\u0000`;
  });

  // 3. Process other markdown formatting
  const formatted = formatInline(processed, strongClass)
    .replace(/\r?\n/g, "<br>")
    .replace(/• /g, "<br>• ");

  // 4. Reinsertar los enlaces ya validados
  // eslint-disable-next-line no-control-regex
  return formatted.replace(/\u0000(\d+)\u0000/g, (_match, index: string) => anchors[Number(index)] ?? "");
}
