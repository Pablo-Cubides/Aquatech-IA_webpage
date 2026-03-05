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

export function renderSafeRichText(input: string, strongClass: string): string {
  const escaped = escapeHtml(input);

  return escaped
    .replace(/\*\*(.+?)\*\*/g, `<strong class="${strongClass}">$1</strong>`)
    .replace(/\r?\n/g, "<br>")
    .replace(/• /g, "<br>• ");
}
