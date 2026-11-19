# Bitácora del cargo DOM — Dominio Técnico-Normativo

> Copia de trabajo versionada en el repo (`docs/normativa/`) porque la sesión en la nube no puede escribir en
> `D:\Empresas\AquatechIA\coordinacion\bitacora-DOM.md`. **Copiar este archivo a esa ruta** (es la bitácora oficial).
> Última actualización: 2026-11-17, cierre de DOM-001 y DOM-002.

## Estado del dominio
- Fuente canónica única: `apps/web/src/lib/normativa/` (Res. 2115/2007, Res. 2254/2017, Res. Conjunta 2840/2023). Cada constante con cita, URL y vigencia; fijada por `__tests__/normativa.test.ts`.
- IRCA: núcleo verificado (22 características, puntajes, máximos, 5 rangos). Parágrafo del art. 13, E. coli/sinónimos, censurados, IRCA mensual (art. 14) implementados.
- Aire: ICA (Tabla 6) corregido; IBOCA actualizado a 2840/2023; JSON público separa vigentes y futuros.
- Cuatro puertas en verde al cierre de DOM-001.

## Registro normativo
| Norma | Fecha / publicación | Vigencia | Dónde se usa | Verificada contra texto oficial |
|---|---|---|---|---|
| Res. 2115 de 2007 (MPS-MAVDT) | 2007-07-04, DO 46.679 | Vigente | `lib/normativa/res-2115-2007.ts` → `indice-calidad-agua` | Sí: copia CRA + (art. 13) PDF Minsalud. Falta cotejo con PDF del DO |
| Res. 622 de 2020 (Minsalud) | 2020-04-21, DO 51.292 | Vigente (no se comprobó modificación posterior) | Solo documento de alcance | Leída copia CRA; sin cambio de código |
| Res. 4716 de 2010 (mapa de riesgo) | 2010-12-21, DO 47.930 | ? | Documento de alcance | **No** (solo resumen de búsqueda) |
| Res. 2254 de 2017 (MADS) | 2017-11-12, DO 50.415; rige 2018-01-01 | Vigente (Tabla 2 desde 2030-01-01) | `res-2254-2017.ts` → `indice-calidad-aire`, `public/data/calidad-aire/colombia.json` | Sí: texto CRA y SISJUR; Tabla 6 leída de imagen (contigua y coherente con Tabla 4) |
| Res. Conjunta 2840 de 2023 (SDA-SDS) | 2023-12-15, Reg. Distrital 7885.4; rige 2023-12-16 | Vigente; un informe 2025 menciona una «fase 2» de ajuste de intervalos (no verificado) | `res-2840-2023-iboca.ts` → IBOCA | Sí: SISJUR (tabla HTML) |
| Res. Conjunta 868 de 2021 | 2021-04-15 | **Derogada** por art. 19 de la 2840/2023 | Ninguno (los cortes PM2.5 viejos de la herramienta eran los suyos) | Sí (SISJUR) |
| Decreto 1594 de 1984 | DO 36.700, 1984 | **Derogado** (salvo arts. 20 y 21) por art. 79 Dec. 3930/2010 | `public/data/agua/colombia.json` (rotulado) | Sí (CRA) |
| Decreto 1076 de 2015, arts. 2.2.3.3.9.1, .5, .6, .7 | 2015 | Transitorio «mientras el MADS expide las regulaciones» (art. 2.2.3.3.9.1, mod. Dec. 50/2018) | idem | Sí (CRA) |
| Decreto 3930 de 2010 | 2010 | Compilado | — | Solo la nota de vigencia |

## Verificado contra fuente
Ver la sección «Valores verificados para CONT» del reporte DOM-001. Fuentes usadas (todas consultadas 2026-11-17):
- 2115: <https://normas.cra.gov.co/Gestor/Docs/resolucion_minproteccion_2115_2007.htm>, <https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/Resoluci%C3%B3n_2115_de_2007.pdf>
- 622/2020: <https://normas.cra.gov.co/gestor/docs/resolucion_minsaludps_0622_2020.htm>
- 2254: <https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_2254_2017.htm>, <https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=82634> (Tabla 6: `.../img_n/ixn82634ixnimage001.jpg`)
- 2840/2023: <https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?dt=S&i=152203>; 868/2021: `...Norma1.jsp?dt=S&i=110517`
- 1594/1984: <https://normas.cra.gov.co/gestor/docs/decreto_1594_1984.htm>; 1076/2015: <https://normas.cra.gov.co/gestor/docs/decreto_1076_2015.htm>

## Decisiones tomadas
- Lugar de la fuente canónica: `apps/web/src/lib/normativa/` (no paquete nuevo: no toca la estructura del monorepo; ARQ puede moverlo a `packages/` si lo decide). El JSON público no puede importar TS: lo guarda un test.
- Resultados censurados: no son números. Se decide cumplimiento solo si todo el intervalo posible cae a un lado del valor normativo; si no, «indeterminado»: se excluye del cálculo y se informa. Excepción de la norma: microbiología «<1» cumple (Cuadro 5, enzima-sustrato).
- Override del art. 13: solo ante resultado ingresado; sin límites individuales del art. 8 (dependen de DL50).
- Sin cifras de población en ningún texto de la herramienta (Cuadro 16 = calendario vencido).
- Cortes del ICA con la tabla oficial entera; la concentración se trunca a la precisión de la tabla antes de buscar el rango.

## Convenciones que establecí
- Toda constante normativa: objeto con `NormCitation` (norma, artículo/tabla, vigenteDesde, publicación, URL, verificado) en `lib/normativa`; test que la fija.
- Rótulo de vigencia en JSON públicos: «VIGENTE desde …» / «FUTURO: rige a partir del …».
- Los textos de artículos citan valores desde `lib/normativa`, no de otra copia.

## Encargos cerrados
- DOM-001 (rama `fix/DOM-001-saneamiento-normativo`): bloques A, B1–B4, C1–C5 (C4 resuelto, ver abajo). DOM-002: `docs/normativa/irca-alcance.md`.

## Pendientes y riesgos conocidos
- Cotejar 2115 y 2254 (Tabla 6) con los PDF del Diario Oficial.
- Mapa de riesgo / Res. 4716/2010: leer el texto completo (BLOQUEADO para el documento de alcance).
- O3 de 1 h del ICA (Tabla 6): datos en la fuente canónica; la herramienta no tiene entrada de O3 1 h ni la regla «reportar el mayor de 8 h y 1 h». Decisión de producto/UI.
- IBOCA: el cálculo oficial usa NowCast de 12 h para PM (art. 5); la herramienta recibe el valor ya calculado. Verificar «fase 2» de intervalos mencionada en un informe de 2025.
- Valores de `public/data/agua/colombia.json` (fuera de alcance de DOM-001, no tocados): pecuario «Mercurio 0,002 mg/L» vs 0,01 en Dec. 1076 art. 2.2.3.3.9.6; agrícola «Mercurio 0,001» no figura en 2.2.3.3.9.5; recreativo: coliformes sin valor (norma: fecales 200, totales 1.000 NMP/100 ml). Verificar y corregir en un encargo aparte.
- Artículos de CONT: PM10 24 h = 75 y PM2.5 24 h = 37 desde 1-jul-2018.
- `riskScore` del IRCA: suma 100 (verificado, no tocar).
