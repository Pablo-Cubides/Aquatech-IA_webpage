import {
  LeopoldCell,
  ConesaImpact,
  BattelleParam,
  BattelleImpact,
} from "../types";

export function computeLeopoldCell(cell: LeopoldCell): LeopoldCell {
  const magn = Math.max(-10, Math.min(10, cell.magnitud));
  const imp = Math.max(1, Math.min(10, cell.importancia));
  const S = Math.abs(magn) * imp;
  return { ...cell, magnitud: magn, importancia: imp, S };
}

export function computeConesa(impact: Partial<ConesaImpact>): ConesaImpact {
  const IN = Math.max(1, Math.min(12, impact.IN ?? 1));
  const EX = Math.max(1, Math.min(8, impact.EX ?? 1));
  const MO = Math.max(1, Math.min(4, impact.MO ?? 1));
  const PE = Math.max(1, Math.min(4, impact.PE ?? 1));
  const RV = Math.max(1, Math.min(4, impact.RV ?? 1));
  const SI = Math.max(1, Math.min(4, impact.SI ?? 1));
  const AC = Math.max(1, Math.min(4, impact.AC ?? 1));
  const EF = Math.max(1, Math.min(4, impact.EF ?? 1));
  const PR = Math.max(1, Math.min(4, impact.PR ?? 1));
  const MC = Math.max(1, Math.min(8, impact.MC ?? 1));

  const I = 3 * IN + 2 * EX + MO + PE + RV + SI + AC + EF + PR + MC;

  let categoria: ConesaImpact["categoria"] = "Irrelevante";
  if (I >= 75) categoria = "Crítico";
  else if (I >= 50) categoria = "Severo";
  else if (I >= 25) categoria = "Moderado";

  return {
    impactoId: impact.impactoId ?? "unknown",
    signo: (impact.signo as any) ?? "+",
    IN,
    EX,
    MO,
    PE,
    RV,
    SI,
    AC,
    EF,
    PR,
    MC,
    I,
    categoria,
  } as ConesaImpact;
}

export function computeBattelleParam(
  param: Partial<BattelleParam>,
): BattelleParam {
  const uip = Math.max(1, Math.min(1000, param.uip ?? 1));
  const calidad_sin = Math.max(1, Math.min(4, param.calidad_sin ?? 1));
  const calidad_con = Math.max(1, Math.min(4, param.calidad_con ?? 1));
  const uia = uip * (calidad_con - calidad_sin);
  return {
    id: param.id ?? "p",
    categoria: param.categoria ?? "",
    componente: param.componente ?? "",
    parametro: param.parametro ?? "",
    uip,
    calidad_sin,
    calidad_con,
    uia,
  } as BattelleParam;
}

export function computeBattelle(
  impact: Partial<BattelleImpact>,
): BattelleImpact {
  const uip = Math.max(1, Math.min(1000, impact.uip ?? 50));
  const calidad_sin = Math.max(1, Math.min(4, impact.calidad_sin ?? 2));
  const calidad_con = Math.max(1, Math.min(4, impact.calidad_con ?? 3));
  const pia_sin = uip * calidad_sin;
  const pia_con = uip * calidad_con;
  const uia = pia_con - pia_sin;

  return {
    impactoId: impact.impactoId ?? "unknown",
    categoria: impact.categoria ?? "FÍSICO-QUÍMICO",
    uip,
    calidad_sin,
    calidad_con,
    pia_sin,
    pia_con,
    uia,
  } as BattelleImpact;
}
