export interface DashboardDataPoint {
    timestamp: string;      // "10:00"
    airQualityIndex: number; // US AQI (0-500)
    solarOutput: number;     // W/m²
    isForecast: boolean;     // To style future data differently
}
