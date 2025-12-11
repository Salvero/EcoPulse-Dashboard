'use client';
import React from 'react';
import { Lightbulb, Zap, Sun, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { usePrediction } from '@/hooks/usePrediction';

interface SystemInsightsCardProps {
    solarOutput?: number;
    temperature?: number;
    className?: string;
}

export function SystemInsightsCard({ solarOutput = 0, temperature = 0, className }: SystemInsightsCardProps) {
    const { prediction, backendAvailable } = usePrediction({
        autoFetch: true,
        pollingInterval: 30000,
    });

    const predictedUsage = prediction?.predicted_usage || 0;
    const confidence = prediction?.confidence_score ? Math.round(prediction.confidence_score * 100) : 0;
    const anomalyDetected = prediction?.anomaly_detected || false;

    const getSolarStatus = () => {
        if (solarOutput >= 500) return { level: 'High', color: 'text-cyan-600 dark:text-cyan-400', icon: '🟢' };
        if (solarOutput >= 200) return { level: 'Moderate', color: 'text-slate-600 dark:text-slate-400', icon: '🟡' };
        return { level: 'Low', color: 'text-red-600 dark:text-red-400', icon: '🔴' };
    };

    const getGridStatus = () => {
        if (solarOutput >= 500) return { level: 'Low', color: 'text-emerald-600 dark:text-emerald-400', icon: '🟢' };
        if (solarOutput >= 200) return { level: 'Moderate', color: 'text-slate-600 dark:text-slate-400', icon: '🟡' };
        return { level: 'High', color: 'text-red-600 dark:text-red-400', icon: '🔴' };
    };

    const getConfidenceStatus = () => {
        if (confidence >= 80) return { level: 'Strong', color: 'text-emerald-600 dark:text-emerald-400', icon: '🟢' };
        if (confidence >= 60) return { level: 'Moderate', color: 'text-slate-600 dark:text-slate-400', icon: '🟡' };
        return { level: 'Low', color: 'text-red-600 dark:text-red-400', icon: '🔴' };
    };

    const solarStatus = getSolarStatus();
    const gridStatus = getGridStatus();
    const confidenceStatus = getConfidenceStatus();

    const getNarrative = () => {
        const solarCondition = solarOutput < 200
            ? 'Solar generation is low due to limited sunlight.'
            : solarOutput < 500
                ? 'Solar generation is at moderate capacity.'
                : 'Solar generation is performing strongly.';

        const demandPrediction = predictedUsage > 150
            ? `AI predicts high demand (${predictedUsage.toFixed(1)} kWh)`
            : `AI predicts normal demand (${predictedUsage.toFixed(1)} kWh)`;

        const gridAction = solarOutput < 300
            ? ', drawing from grid.'
            : ', solar offsetting grid.';

        const recommendation = solarOutput < 200 && predictedUsage > 150
            ? ' Consider reducing non-essential loads.'
            : '';

        return `${solarCondition} ${demandPrediction}${gridAction}${recommendation}`;
    };

    return (
        <div className={`card p-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Lightbulb className="w-3.5 h-3.5 text-cyan-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">System Insights</h3>
                </div>

                {anomalyDetected ? (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span className="text-xs font-semibold text-red-700 dark:text-red-400">Attention</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Normal</span>
                    </div>
                )}
            </div>

            {/* Narrative */}
            <div className="mb-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {backendAvailable ? getNarrative() : (
                        <span className="text-slate-500 italic">Backend offline. Using simulation mode.</span>
                    )}
                </p>
            </div>

            {/* Status Pills */}
            <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <Zap className={`w-3.5 h-3.5 ${gridStatus.color}`} />
                    <div>
                        <p className="text-xs text-slate-500">Grid</p>
                        <p className={`text-xs font-semibold ${gridStatus.color}`}>{gridStatus.icon} {gridStatus.level}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <Sun className={`w-3.5 h-3.5 ${solarStatus.color}`} />
                    <div>
                        <p className="text-xs text-slate-500">Solar</p>
                        <p className={`text-xs font-semibold ${solarStatus.color}`}>{solarStatus.level}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <TrendingUp className={`w-3.5 h-3.5 ${confidenceStatus.color}`} />
                    <div>
                        <p className="text-xs text-slate-500">AI</p>
                        <p className={`text-xs font-semibold ${confidenceStatus.color}`}>{confidence}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
