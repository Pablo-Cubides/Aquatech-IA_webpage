export type Fase = 'preoperativa' | 'operativa' | 'cierre';

export type Action = {
  id: string;
  fase: Fase;
  nombre: string;
  desc?: string;
};

export type Medio = 'fisico' | 'biotico' | 'social';

export type Factor = {
  id: string;
  medio: Medio;
  nombre: string;
  sensibilidad: 'baja' | 'media' | 'alta';
};

export type ImpactoBase = {
  id: string;
  actionId: string;
  factorId: string;
  signo: '+' | '-';
};

export type LeopoldCell = {
  impactoId: string;
  magnitud: number; // -10..10
  importancia: number; // 1..10
  S: number;
};

export type ConesaImpact = {
  impactoId: string;
  signo: '+' | '-';
  IN: number; EX: number; MO: number; PE: number; RV: number; SI: number; AC: number; EF: number; PR: number; MC: number;
  I: number;
  categoria: 'Irrelevante' | 'Moderado' | 'Severo' | 'Crítico';
};

export type BattelleParam = {
  id: string;
  categoria: string;
  componente?: string;
  parametro?: string;
  uip: number; // 1..1000 (Unidades de Importancia del Parámetro)
  calidad_sin: number; // 1..4 (Calidad sin proyecto)
  calidad_con: number; // 1..4 (Calidad con proyecto)
  uia: number;
};

export type BattelleCategory = 'FÍSICO-QUÍMICO' | 'BIOLÓGICO' | 'CULTURAL' | 'ECOLÓGICO-ESTÉTICO';

export type BattelleImpact = {
  impactoId: string;
  categoria: BattelleCategory;
  uip: number; // 1..1000 (Unidades de Importancia del Parámetro)
  calidad_sin: number; // 1..4 (Calidad sin proyecto)
  calidad_con: number; // 1..4 (Calidad con proyecto)
  pia_sin: number; // PIA sin proyecto (UIP × calidad_sin)
  pia_con: number; // PIA con proyecto (UIP × calidad_con)
  uia: number; // UIA (PIA_con - PIA_sin)
};

export type Justificacion = {
  entidad: 'impacto' | 'parametro';
  refId: string;
  markdown: string;
};

export type Medida = {
  impactoId: string;
  tipo: 'prevención' | 'mitigación' | 'corrección' | 'compensación';
  texto: string;
};

export type Case = {
  id: string;
  sector: string;
  nombre: string;
  descripcion?: string;
  factoresSensibles?: string[];
};

export type Proyecto = {
  id: string;
  caseId: string;
  matriz: 'leopold' | 'conesa' | 'battelle';
  acciones: Action[];
  factores: Factor[];
  impactos: ImpactoBase[];
};
