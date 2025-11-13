export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}
