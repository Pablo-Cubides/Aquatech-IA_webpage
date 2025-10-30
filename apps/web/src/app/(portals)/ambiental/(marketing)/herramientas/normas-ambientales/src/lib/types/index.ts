export const SECTOR_NORMALIZATION_MAP: Record<string, string> = {
  // Mapping sectors to normalized names
  agua: "water",
  aire: "air",
  suelo: "soil",
  energia: "energy",
  residuos: "waste",
};

export interface WaterUseSector {
  id: string;
  name: string;
  description?: string;
}

export const WATER_USE_SECTORS: WaterUseSector[] = [
  { id: "industrial", name: "Industrial" },
  { id: "agricultural", name: "Agricultural" },
  { id: "domestic", name: "Domestic" },
  { id: "recreational", name: "Recreational" },
];
