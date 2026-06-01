/**
 * Open-Meteo API Integration
 * Base URL: https://api.open-meteo.com/v1/forecast
 * Documentation: https://open-meteo.com/en/docs
 */

export interface OpenMeteoCurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  rain: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  weather_code: number;
  cloud_cover: number;
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
  current: OpenMeteoCurrentWeather;
}

/**
 * Get weather description from WMO weather code
 * Source: https://open-meteo.com/en/docs
 */
export function getWeatherDescription(code: number): { text: string; icon: string } {
  const codes: Record<number, { text: string; icon: string }> = {
    0: { text: "Cielo despejado", icon: "☀️" },
    1: { text: "Mayormente despejado", icon: "🌤️" },
    2: { text: "Parcialmente nublado", icon: "⛅" },
    3: { text: "Nublado", icon: "☁️" },
    45: { text: "Niebla", icon: "🌫️" },
    48: { text: "Niebla con escarcha", icon: "🌫️" },
    51: { text: "Llovizna ligera", icon: "🌧️" },
    53: { text: "Llovizna moderada", icon: "🌧️" },
    55: { text: "Llovizna densa", icon: "🌧️" },
    56: { text: "Llovizna helada ligera", icon: "🌨️" },
    57: { text: "Llovizna helada densa", icon: "🌨️" },
    61: { text: "Lluvia leve", icon: "🌧️" },
    63: { text: "Lluvia moderada", icon: "🌧️" },
    65: { text: "Lluvia fuerte", icon: "🌧️" },
    66: { text: "Lluvia helada leve", icon: "🌨️" },
    67: { text: "Lluvia helada fuerte", icon: "🌨️" },
    71: { text: "Nevada leve", icon: "❄️" },
    73: { text: "Nevada moderada", icon: "❄️" },
    75: { text: "Nevada fuerte", icon: "❄️" },
    77: { text: "Granos de nieve", icon: "❄️" },
    80: { text: "Chubascos leves", icon: "🌦️" },
    81: { text: "Chubascos moderados", icon: "🌦️" },
    82: { text: "Chubascos violentos", icon: "🌧️" },
    85: { text: "Chubascos de nieve leves", icon: "🌨️" },
    86: { text: "Chubascos de nieve fuertes", icon: "🌨️" },
    95: { text: "Tormenta eléctrica", icon: "⛈️" },
    96: { text: "Tormenta con granizo leve", icon: "⛈️" },
    99: { text: "Tormenta con granizo fuerte", icon: "⛈️" },
  };

  return codes[code] || { text: "Desconocido", icon: "❓" };
}

/**
 * Fetch current weather for a specific coordinate
 */
export async function getCurrentWeather(lat: number, lon: number): Promise<OpenMeteoResponse> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString()
    });

    // Call our internal proxy API
    const response = await fetch(`/api/openmeteo/weather?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}
