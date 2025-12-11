'use client';
import React from 'react';
import { Cloud, CloudRain, Sun, CloudSun, CloudLightning, Snowflake, AlertTriangle, Brain, RefreshCw, Zap } from 'lucide-react';
import { DailyForecast } from '@/lib/normalize';
import { usePrediction } from '@/hooks/usePrediction';

interface ForecastCardProps {
    forecast?: DailyForecast[];
}

export function ForecastCard({ forecast = [] }: ForecastCardProps) {
    const { prediction, loading, error, backendAvailable, refresh } = usePrediction({
        autoFetch: true,
        pollingInterval: 60000, // Refresh every 60 seconds
    });

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

    const getSeverityColor = (severity: string | null) => {
        switch (severity) {
            case 'high': return 'text-red-500 bg-red-50 dark:bg-red-500/10';
            case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10';
            case 'low': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10';
            default: return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* AI Prediction Section */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                            AI Forecast
                        </h4>
                    </div>
                    <button
                        onClick={refresh}
                        disabled={loading || !backendAvailable}
                        className="p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3 h-3 text-indigo-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {!backendAvailable ? (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        Backend offline • Using simulation mode
                    </div>
                ) : error ? (
                    <div className="text-xs text-red-500">{error}</div>
                ) : prediction ? (
                    <div className="space-y-3">
                        {/* Predicted Usage */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">Next Hour</span>
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {prediction.predicted_usage} <span className="text-xs font-normal text-slate-500">kWh</span>
                            </span>
                        </div>

                        {/* Anomaly Alert */}
                        {prediction.anomaly_detected && (
                            <div className={`flex items-center gap-2 p-2 rounded-lg ${getSeverityColor(prediction.anomaly_severity)}`}>
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-xs font-medium capitalize">
                                    {prediction.anomaly_severity} spike predicted
                                </span>
                            </div>
                        )}

                        {/* Confidence */}
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Confidence</span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all"
                                        style={{ width: `${prediction.confidence_score * 100}%` }}
                                    />
                                </div>
                                <span className="text-slate-700 dark:text-slate-300 font-medium">
                                    {Math.round(prediction.confidence_score * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-slate-500 animate-pulse">Loading prediction...</div>
                )}
            </div>

            {/* Weather Forecast Section */}
            <div>
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-3">5-Day Forecast</h3>
                <div className="space-y-2">
                    {forecast.length > 0 ? (
                        forecast.map((d, i) => {
                            const Icon = getIcon(d.icon);
                            return (
                                <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-500 text-xs font-medium uppercase w-8">{d.dayName}</span>
                                        <Icon className="w-5 h-5 text-slate-400 dark:text-slate-200" />
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
        </div>
    );
}
