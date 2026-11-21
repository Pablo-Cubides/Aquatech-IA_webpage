/**
 * Adelgazado de la respuesta de GBIF `occurrence/search` (SEC-006).
 *
 * GBIF devuelve ~7,7 KB por registro (extensiones, identificadores, relaciones, problemas...): 300
 * registros pesan 2,2 MiB y tardan hasta 3,7 s. El visor usa ~27 campos (~0,7 KB por registro, 210 KB
 * en total, el 91 % menos). La lista de abajo ES el contrato con el cliente: la prueba
 * `gbif-occurrence-contract.test.ts` falla si `GBIFOccurrence` (lib/gbif.ts) o el código del visor usan
 * un campo que no esté aquí.
 */

export const GBIF_OCCURRENCE_FIELDS = [
  "key",
  "scientificName",
  "decimalLatitude",
  "decimalLongitude",
  "country",
  "countryCode",
  "year",
  "month",
  "day",
  "eventDate",
  "basisOfRecord",
  "kingdom",
  "phylum",
  "class",
  "order",
  "family",
  "genus",
  "species",
  "taxonKey",
  "speciesKey",
  "kingdomKey",
  "phylumKey",
  "classKey",
  "orderKey",
  "familyKey",
  "genusKey",
] as const;

type Primitive = string | number | boolean;
type SlimMedia = { type?: string; format?: string; identifier: string };
export type SlimOccurrence = Partial<Record<(typeof GBIF_OCCURRENCE_FIELDS)[number], Primitive>> & {
  media?: SlimMedia[];
};
export type SlimOccurrenceSearch = {
  offset: number;
  limit: number;
  endOfRecords: boolean;
  count: number;
  results: SlimOccurrence[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isPrimitive = (value: unknown): value is Primitive =>
  typeof value === "string" || typeof value === "number" || typeof value === "boolean";

/** El visor pone `media[0].identifier` en un <img src>: solo URL http(s). */
const HTTP_URL = /^https?:\/\/\S+$/i;

function slimMedia(media: unknown): SlimMedia[] | undefined {
  if (!Array.isArray(media)) return undefined;
  const first = media.find((item) => isRecord(item) && typeof item.identifier === "string" && HTTP_URL.test(item.identifier));
  if (!isRecord(first)) return undefined;
  return [
    {
      ...(typeof first.type === "string" ? { type: first.type } : {}),
      ...(typeof first.format === "string" ? { format: first.format } : {}),
      identifier: first.identifier as string,
    },
  ];
}

function slimOccurrence(raw: Record<string, unknown>): SlimOccurrence {
  const out: SlimOccurrence = {};
  for (const field of GBIF_OCCURRENCE_FIELDS) {
    const value = raw[field];
    if (isPrimitive(value)) (out as Record<string, Primitive>)[field] = value;
  }
  const media = slimMedia(raw.media);
  if (media) out.media = media;
  return out;
}

/** `null` si la respuesta no tiene la forma de una búsqueda de ocurrencias. */
export function slimOccurrenceSearch(data: unknown): SlimOccurrenceSearch | null {
  if (!isRecord(data) || !Array.isArray(data.results)) return null;
  return {
    offset: typeof data.offset === "number" ? data.offset : 0,
    limit: typeof data.limit === "number" ? data.limit : data.results.length,
    endOfRecords: data.endOfRecords === true,
    count: typeof data.count === "number" ? data.count : data.results.length,
    results: data.results.filter(isRecord).map(slimOccurrence),
  };
}
