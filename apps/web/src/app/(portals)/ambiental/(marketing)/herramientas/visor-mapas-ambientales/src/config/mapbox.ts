// Map Configuration
// Using local proxy to OpenStreetMap tiles - no CORS issues, works everywhere
// Proxying through Next.js API route at /api/tiles/[z]/[x]/[y]

export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || null,
  style: {
    version: 8 as const,
    sources: {
      osm: {
        type: "raster" as const,
        tiles: ["/api/tiles/{z}/{x}/{y}"],
        tileSize: 256,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    layers: [
      {
        id: "osm-tiles",
        type: "raster" as const,
        source: "osm",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
};
