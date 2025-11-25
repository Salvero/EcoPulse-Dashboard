import { useState, useEffect } from 'react';
import { DashboardDataPoint } from '@/types/dashboard';
import { normalizeData, generateMockData, normalizeForecast, DailyForecast } from '@/lib/normalize';
import { fetchWeather, fetchAirQuality } from '@/lib/api';

interface DashboardData {
    weather: {
        temperature: number;
        humidity: number;
        condition: string;
        windSpeed: number;
    };
    energyData: DashboardDataPoint[];
    forecast: DailyForecast[];
}

export function useDashboardData(coordinates: { lat: number; long: number } = { lat: 43.6532, long: -79.3832 }) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Reset data when coordinates change to show loading state
    useEffect(() => {
        setData(null);
        setLoading(true);
    }, [coordinates.lat, coordinates.long]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [weatherRes, aqiRes] = await Promise.all([
                    fetchWeather(coordinates.lat, coordinates.long),
                    fetchAirQuality(coordinates.lat, coordinates.long)
                ]);

                // Process Weather Data
                // Open-Meteo returns hourly arrays. We need "current" values.
                // We can pick the current hour's data.
                const now = new Date();
                const currentHourIndex = now.getHours(); // Simple index mapping for today's forecast

                const currentTemp = weatherRes.hourly.temperature_2m[currentHourIndex];
                const currentWind = weatherRes.hourly.wind_speed_10m[currentHourIndex];
                const currentHumidity = weatherRes.hourly.relative_humidity_2m[currentHourIndex];

                // Determine condition based on cloud cover or just simple logic (not requested, but good to have)
                // For now, hardcode or simple logic
                const condition = "Clear";

                const weather = {
                    temperature: currentTemp,
                    humidity: currentHumidity,
                    condition,
                    windSpeed: currentWind
                };

                const energyData = normalizeData(weatherRes.hourly, aqiRes.hourly);
                const forecast = normalizeForecast(weatherRes.daily);

                setData({
                    weather,
                    energyData,
                    forecast
                });
            } catch (err) {
                console.error("Failed to fetch data, using fallback:", err);
                // Fallback to mock data
                setData({
                    weather: {
                        temperature: 20,
                        humidity: 60,
                        condition: 'Partly Cloudy',
                        windSpeed: 15
                    },
                    energyData: generateMockData(),
                    forecast: [] // Empty forecast for mock fallback
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [coordinates.lat, coordinates.long]);

    return { data, loading, error };
}
