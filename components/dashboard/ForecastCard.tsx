import React from 'react';
import { Cloud, CloudRain, Sun, CloudSun, CloudLightning, Snowflake } from 'lucide-react';
import { DailyForecast } from '@/lib/normalize';

interface ForecastCardProps {
    forecast?: DailyForecast[];
}

export function ForecastCard({ forecast = [] }: ForecastCardProps) {
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Sun': return Sun;
            case 'CloudSun': return CloudSun;
            case 'Cloud': return Cloud;
            case 'CloudRain': return CloudRain;
            case 'CloudLightning': return CloudLightning;
            case 'Snowflake': return Snowflake;
            default: return Sun;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 h-full transition-colors">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-4">5-Day Forecast</h3>
            <div className="space-y-4">
                {forecast.length > 0 ? (
                    forecast.map((d, i) => {
                        const Icon = getIcon(d.icon);
                        return (
                            <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-500 text-xs font-medium uppercase w-8">{d.dayName}</span>
                                    <Icon className="w-6 h-6 text-slate-400 dark:text-slate-200" />
                                </div>
                                <span className="text-slate-700 dark:text-slate-300 text-sm font-bold">{d.tempMax}°</span>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-slate-500 text-sm">Loading forecast...</div>
                )}
            </div>
        </div>
    );
}
