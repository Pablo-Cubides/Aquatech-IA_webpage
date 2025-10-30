export interface Caso {
  frase: string;
  contexto: string;
  razon_filtro: string;
  historia_real: string;
  leccion: string;
  referencia: string;
  sin_filtro: string;
  coherencia_humana: string;
  alineamiento: string;
  explicacion_politica: string;
  nota: string;
  // Campo adicional para control editorial
  requires_review?: boolean;
}

export type Casos = Caso[];
