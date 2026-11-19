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

/**
 * Formato en línea sobre texto YA escapado. La cursiva `*x*` solo se aplica cuando los asteriscos están
 * PEGADOS al texto (`*palabra*`): `2 * 3 * 4` o `a * b` no se convierten en cursiva. Es la misma regla
 * que `toPlainText` (lib/text/plain-text.ts), para que el texto que ve la persona y el que leen las
 * máquinas (FAQ JSON-LD, llms-full.txt) coincidan.
 */
function formatInline(escaped: string, strongClass: string): string {
  return escaped
    .replace(/\*\*\*(.+?)\*\*\*/g, `<strong class="${strongClass}"><em>$1</em></strong>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong class="${strongClass}">$1</strong>`)
    .replace(/(?<![\w*])\*(?=[^\s*])(.+?)(?<=[^\s*])\*(?![\w*])/g, "<em>$1</em>");
}

/** Lenguaje de un bloque de código: identificador corto; cualquier otra cosa se ignora. */
const CODE_LANGUAGE = /^[A-Za-z0-9_+-]{1,20}$/;

const CODE_BLOCK_CLASS =
  "my-4 overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm leading-6 text-slate-100";
const INLINE_CODE_CLASS = "rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-100";
const TABLE_WRAPPER_CLASS = "my-4 overflow-x-auto";
const TABLE_CLASS = "w-full border-collapse text-left text-sm";
const TH_CLASS = "border border-slate-700 bg-slate-800 px-3 py-2 font-semibold";
const TD_CLASS = "border border-slate-700 px-3 py-2 align-top";

/** Límites para que un texto malicioso o enorme no genere HTML desproporcionado. */
const MAX_TABLE_COLUMNS = 12;
const MAX_TABLE_ROWS = 200;

/** "| a | b |" -> ["a", "b"] (sin pipes de borde). */
function splitTableRow(line: string): string[] {
  let row = line.trim();
  if (row.startsWith("|")) row = row.slice(1);
  if (row.endsWith("|")) row = row.slice(0, -1);
  return row.split("|").map((cell) => cell.trim());
}

const TABLE_SEPARATOR = /^[ \t]*\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)*\|?[ \t]*$/;

export function renderSafeRichText(input: string, strongClass: string): string {
  // 0. Los NUL delimitan los marcadores internos: no pueden venir del texto.
  // eslint-disable-next-line no-control-regex
  const source = input.replace(/\u0000/g, "");

  // Todo HTML que NO sale del escape directo del texto (enlaces validados, código, tablas) se guarda
  // aparte y se reinserta al final: el formato Markdown posterior no puede tocar su interior.
  const stash: string[] = [];
  const stashHtml = (html: string): string => {
    stash.push(html);
    return `\u0000${stash.length - 1}\u0000`;
  };
  // Los bloques (código, tablas) llevan un marcador propio para quitarles los saltos de línea contiguos.
  const stashBlock = (html: string): string => {
    stash.push(html);
    return `\u0000B${stash.length - 1}\u0000`;
  };

  /** Escape + enlaces (lista blanca) + formato en línea de UN fragmento de texto. */
  const renderInline = (fragment: string): string => {
    let processed = escapeHtml(fragment);

    // Enlaces Markdown [texto](url). Se hace tras escapar (el texto y la URL ya no pueden abrir
    // etiquetas ni salirse del atributo).
    processed = processed.replace(/\[(.+?)\]\((.+?)\)/g, (_match, text: string, url: string) => {
      // Un destino no permitido (javascript:, data:, …) se degrada a texto plano.
      if (!isSafeLinkUrl(url)) return text;

      // Check if it's a CTA based on the first character/emoji
      const isCTA = CTA_EMOJIS.some((emoji) => text.trim().startsWith(emoji));
      const linkClass = isCTA
        ? "inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-medium rounded-lg transition-all border border-blue-500/20 my-2 no-underline"
        : "text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 font-medium transition-colors";

      return stashHtml(
        `<a href="${url}" class="${linkClass}" target="_blank" rel="noopener noreferrer">${formatInline(text, strongClass)}</a>`,
      );
    });

    return formatInline(processed, strongClass);
  };

  let text = source.replace(/\r\n?/g, "\n");

  // 1. Bloques de código ```lang … ```: el contenido es OPACO (se escapa y nada más: sin Markdown, sin
  //    enlaces, sin formato). Una cerca sin cierre no es un bloque: queda como texto.
  text = text.replace(/^```([^\n`]*)\n([\s\S]*?)^```[ \t]*$/gm, (_match, info: string, code: string) => {
    const language = info.trim().split(/\s+/)[0] ?? "";
    const classAttr = CODE_LANGUAGE.test(language) ? ` class="language-${language}"` : "";
    return stashBlock(`<pre class="${CODE_BLOCK_CLASS}"><code${classAttr}>${escapeHtml(code.replace(/\n$/, ""))}</code></pre>`);
  });

  // 2. Código en línea `x`: también opaco.
  text = text.replace(/`([^`\n]+)`/g, (_match, code: string) =>
    stashHtml(`<code class="${INLINE_CODE_CLASS}">${escapeHtml(code)}</code>`),
  );

  // 3. Tablas con pipes: cabecera + fila separadora + filas. Cada celda pasa por el mismo escape y la
  //    misma lista blanca de enlaces que el texto normal.
  const lines = text.split("\n");
  const output: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const header = lines[i];
    if (header.includes("|") && i + 1 < lines.length && TABLE_SEPARATOR.test(lines[i + 1]) && lines[i + 1].includes("-")) {
      const headerCells = splitTableRow(header).slice(0, MAX_TABLE_COLUMNS);
      const rows: string[][] = [];
      let j = i + 2;
      while (j < lines.length && lines[j].includes("|") && lines[j].trim() !== "" && rows.length < MAX_TABLE_ROWS) {
        rows.push(splitTableRow(lines[j]));
        j++;
      }
      const columns = headerCells.length;
      const head = `<thead><tr>${headerCells.map((cell) => `<th class="${TH_CLASS}">${renderInline(cell)}</th>`).join("")}</tr></thead>`;
      const body = `<tbody>${rows
        .map((row) => {
          const cells = Array.from({ length: columns }, (_, c) => row[c] ?? "");
          return `<tr>${cells.map((cell) => `<td class="${TD_CLASS}">${renderInline(cell)}</td>`).join("")}</tr>`;
        })
        .join("")}</tbody>`;
      output.push(stashBlock(`<div class="${TABLE_WRAPPER_CLASS}"><table class="${TABLE_CLASS}">${head}${body}</table></div>`));
      i = j - 1;
    } else {
      output.push(header);
    }
  }
  text = output.join("\n");

  // 4. El resto del texto: escape, enlaces y formato en línea.
  const formatted = renderInline(text)
    .replace(/\n/g, "<br>")
    .replace(/• /g, "<br>• ")
    // Un bloque no necesita saltos de línea pegados.
    .replace(/(?:<br>)*(\u0000B\d+\u0000)(?:<br>)*/g, "$1");

  // 5. Reinsertar lo guardado (un enlace puede contener un marcador de código en su texto: se repite).
  let result = formatted;
  for (let pass = 0; pass < 4 && /\u0000B?\d+\u0000/.test(result); pass++) {
    // eslint-disable-next-line no-control-regex
    result = result.replace(/\u0000B?(\d+)\u0000/g, (_match, index: string) => stash[Number(index)] ?? "");
  }
  return result;
}
