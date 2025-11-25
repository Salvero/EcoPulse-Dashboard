import { DashboardDataPoint } from '@/types/dashboard';

interface HourlyWeather {
    time: string[];
    temperature_2m: number[];
    shortwave_radiation: number[];
    wind_speed_10m: number[];
    relative_humidity_2m: number[];
    uv_index: number[];
}

interface HourlyAirQuality {
    time: string[];
    us_aqi: number[];
}

export function normalizeData(
    weather: HourlyWeather,
    airQuality: HourlyAirQuality
): DashboardDataPoint[] {
    const data: DashboardDataPoint[] = [];
    const now = new Date();
    const currentHour = now.getHours();

    // Open-Meteo returns hourly data. We'll take the first 24 hours.
    // Assuming both arrays are aligned by time (which they should be if requested for same location/timezone)
    const length = Math.min(weather.time.length, airQuality.time.length, 24);

    for (let i = 0; i < length; i++) {
        const timeStr = weather.time[i]; // ISO string "2023-10-27T00:00"
        const date = new Date(timeStr);
        const hour = date.getHours();
        // const timestamp = `${hour.toString().padStart(2, '0')}:00`; // Old format
        const timestamp = timeStr; // Use full ISO string as requested

        const isForecast = hour > currentHour;

        data.push({
            timestamp,
            airQualityIndex: airQuality.us_aqi[i] ?? 0,
            solarOutput: weather.shortwave_radiation[i] ?? 0,
            uvIndex: weather.uv_index[i] ?? 0,
            humidity: weather.relative_humidity_2m[i] ?? 0,
            isForecast
        });
    }

    return data;
}

// WMO Weather Code Mapping
export function mapWeatherCodeToIcon(code: number): string {
    if (code === 0) return 'Sun';
    if (code >= 1 && code <= 3) return 'CloudSun';
    if (code >= 45 && code <= 48) return 'Cloud';
    if (code >= 51 && code <= 67) return 'CloudRain';
    if (code >= 71 && code <= 77) return 'Snowflake';
    if (code >= 80 && code <= 82) return 'CloudRain';
    if (code >= 85 && code <= 86) return 'Snowflake';
    if (code >= 95) return 'CloudLightning';
    return 'Sun';
}

export interface DailyForecast {
    date: string;
    dayName: string;
    tempMax: number;
    weatherCode: number;
    icon: string;
}

export function normalizeForecast(daily: { time: string[]; temperature_2m_max: number[]; weather_code: number[] }): DailyForecast[] {
    return daily.time.map((time, index) => {
        const date = new Date(time);
        // Ensure we get the correct day name regardless of timezone issues by appending T00:00:00 if needed, 
        // but Open-Meteo daily time is just YYYY-MM-DD. 
        // Parsing YYYY-MM-DD as UTC is safer for day names.
        const dateObj = new Date(time + 'T00:00:00');
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const code = daily.weather_code[index];

        return {
            date: time,
            dayName,
            tempMax: Math.round(daily.temperature_2m_max[index]),
            weatherCode: code,
            icon: mapWeatherCodeToIcon(code)
        };
    }).slice(0, 5); // Return 5 days
}

// Fallback for when API fails
export function generateMockData(): DashboardDataPoint[] {
    const data: DashboardDataPoint[] = [];
    const startHour = 0;
    const endHour = 23;

    for (let hour = startHour; hour <= endHour; hour++) {
        const now = new Date();
        now.setHours(hour, 0, 0, 0);
        // Adjust for timezone offset if needed, but for mock data simple ISO is fine
        // Actually, to match "2024-11-25T11", we need local ISO or similar.
        // Let's just construct a fake ISO string for today.
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hourStr = hour.toString().padStart(2, '0');
        const timestamp = `${year}-${month}-${day}T${hourStr}:00`;

        let solarOutput = 0;
        let aqi = 30; // Base AQI (Good)
        const isForecast = hour > new Date().getHours();

        // Solar Curve
        if (hour >= 6 && hour <= 20) {
            // Peak at 13:00
            const peak = 13;
            const dist = Math.abs(hour - peak);
            if (dist < 7) {
                solarOutput = Math.max(0, 800 * (1 - dist / 7));
            }
        }

        // AQI Curve (Traffic peaks)
        if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
            aqi += 20; // Traffic spike
        }

        // Add noise
        solarOutput = Math.max(0, Math.round(solarOutput + (Math.random() * 50 - 25)));
        aqi = Math.max(0, Math.round(aqi + (Math.random() * 10 - 5)));
        const uvIndex = Math.max(0, Math.round((solarOutput / 100) + (Math.random() * 2 - 1))); // Rough correlation
        const humidity = Math.max(0, Math.min(100, Math.round(60 + (Math.random() * 20 - 10))));

        data.push({
            timestamp,
            airQualityIndex: aqi,
            solarOutput: Math.round(solarOutput),
            uvIndex,
            humidity,
            isForecast
        });
    }

    return data;
}
