import { WeatherData } from './api/mockData';

// Types for the API responses
interface OpenMeteoWeatherResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    shortwave_radiation: number[];
    wind_speed_10m: number[];
    relative_humidity_2m: number[];
    uv_index: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    weather_code: number[];
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

export async function fetchWeather(lat: number, long: number): Promise<OpenMeteoWeatherResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: long.toString(),
    hourly: 'temperature_2m,shortwave_radiation,wind_speed_10m,relative_humidity_2m,uv_index',
    daily: 'temperature_2m_max,weather_code',
    forecast_days: '6', // Fetch 6 days to ensure we have 5 future days including today
    timezone: 'auto', // Auto-detect timezone based on coordinates
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
}

export async function fetchAirQuality(lat: number, long: number): Promise<OpenMeteoAirQualityResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: long.toString(),
    hourly: 'us_aqi',
    timezone: 'auto',
  });

  const response = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch air quality data');
  }

  return response.json();
}
