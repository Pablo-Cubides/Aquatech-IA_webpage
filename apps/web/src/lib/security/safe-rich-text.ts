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

export function renderSafeRichText(input: string, strongClass: string): string {
  // 1. Escape HTML for security
  let processed = escapeHtml(input);

  // 2. Process Markdown Links: [text](url)
  // We do this after escaping to allow links but keep the inner text safe
  processed = processed.replace(/\[(.+?)\]\((.+?)\)/g, (match, text, url) => {
    // Check if it's a CTA based on the first character/emoji
    const isCTA = CTA_EMOJIS.some(emoji => text.trim().startsWith(emoji));
    const linkClass = isCTA 
      ? "inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-medium rounded-lg transition-all border border-blue-500/20 my-2 no-underline"
      : "text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 font-medium transition-colors";
    
    return `<a href="${url}" class="${linkClass}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });

  // 3. Process other markdown formatting
  return processed
    .replace(/\*\*\*(.+?)\*\*\*/g, `<strong class="${strongClass}"><em>$1</em></strong>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong class="${strongClass}">$1</strong>`)
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\r?\n/g, "<br>")
    .replace(/• /g, "<br>• ");
}
