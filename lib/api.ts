import { WeatherData } from './api/mockData';

// Types for the API responses
interface OpenMeteoWeatherResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    shortwave_radiation: number[];
    wind_speed_10m: number[];
  };
  current_weather?: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
}

interface OpenMeteoAirQualityResponse {
  hourly: {
    time: string[];
    us_aqi: number[];
  };
}

export interface AirQualityData {
  aqi: number;
  time: string;
}

const TORONTO_COORDS = {
  lat: 43.6532,
  long: -79.3832,
};

export async function fetchWeather(): Promise<OpenMeteoWeatherResponse> {
  const params = new URLSearchParams({
    latitude: TORONTO_COORDS.lat.toString(),
    longitude: TORONTO_COORDS.long.toString(),
    hourly: 'temperature_2m,shortwave_radiation,wind_speed_10m',
    forecast_days: '1',
    timezone: 'America/Toronto',
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
}

export async function fetchAirQuality(): Promise<OpenMeteoAirQualityResponse> {
  const params = new URLSearchParams({
    latitude: TORONTO_COORDS.lat.toString(),
    longitude: TORONTO_COORDS.long.toString(),
    hourly: 'us_aqi',
    timezone: 'America/Toronto',
  });

  const response = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch air quality data');
  }

  return response.json();
}
