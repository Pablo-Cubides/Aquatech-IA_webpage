// Utilidades
export const shuffleArray = <T,>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const validateGroupNames = (names: string[]): { valid: boolean; error?: string } => {
  if (names.length > 30) return { valid: false, error: 'Máximo 30 grupos permitidos' };

  const trimmed = names.map((n) => n.trim());

  if (trimmed.some((n) => !n)) return { valid: false, error: 'Todos los nombres son requeridos' };

  const lowercase = trimmed.map((n) => n.toLowerCase());
  const unique = new Set(lowercase);

  if (unique.size !== lowercase.length) {
    return { valid: false, error: 'Los nombres de grupos deben ser únicos' };
  }

  return { valid: true };
};
