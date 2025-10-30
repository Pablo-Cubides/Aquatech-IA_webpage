export const getSectorEmoji = (sector: string): string => {
  const sectorLower = sector.toLowerCase();

  const emojiMap: Record<string, string> = {
    agua: "💧",
    water: "💧",
    aire: "🌬️",
    air: "🌬️",
    suelo: "🌍",
    soil: "🌍",
    energia: "⚡",
    energy: "⚡",
    residuos: "🗑️",
    waste: "🗑️",
    biodiversidad: "🌿",
    biodiversity: "🌿",
    bosques: "🌲",
    forests: "🌲",
    mineria: "⛏️",
    mining: "⛏️",
    petróleo: "🛢️",
    oil: "🛢️",
    agricultura: "🚜",
    agriculture: "🚜",
    pesca: "🐟",
    fishing: "🐟",
  };

  return emojiMap[sectorLower] || "📋";
};
