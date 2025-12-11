'use client';
import React, { useState } from 'react';
import { Sparkles, X, Zap, Sun, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { usePrediction } from '@/hooks/usePrediction';

interface SystemInsightsModalProps {
    solarOutput?: number;
    temperature?: number;
}

export function SystemInsightsModal({ solarOutput = 0, temperature = 0 }: SystemInsightsModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { prediction, backendAvailable } = usePrediction({
        autoFetch: true,
        pollingInterval: 30000,
    });

    const predictedUsage = prediction?.predicted_usage || 0;
    const confidence = prediction?.confidence_score ? Math.round(prediction.confidence_score * 100) : 0;
    const anomalyDetected = prediction?.anomaly_detected || false;

    const getSolarStatus = () => {
        if (solarOutput >= 500) return { level: 'High', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10', border: 'border-cyan-200 dark:border-cyan-500/30', icon: '🟢' };
        if (solarOutput >= 200) return { level: 'Moderate', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', icon: '🟡' };
        return { level: 'Low', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/30', icon: '🔴' };
    };

    const getGridStatus = () => {
        if (solarOutput >= 500) return { level: 'Low', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/30', icon: '🟢' };
        if (solarOutput >= 200) return { level: 'Moderate', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', icon: '🟡' };
        return { level: 'High', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/30', icon: '🔴' };
    };

    const getConfidenceStatus = () => {
        if (confidence >= 80) return { level: 'Strong', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/30', icon: '🟢' };
        if (confidence >= 60) return { level: 'Moderate', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', icon: '🟡' };
        return { level: 'Low', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/30', icon: '🔴' };
    };

    const solarStatus = getSolarStatus();
    const gridStatus = getGridStatus();
    const confidenceStatus = getConfidenceStatus();

    const getNarrative = () => {
        const solarCondition = solarOutput < 200
            ? 'Solar generation is currently low due to limited sunlight conditions.'
            : solarOutput < 500
                ? 'Solar generation is operating at moderate capacity.'
                : 'Solar generation is performing strongly with optimal conditions.';

        const demandPrediction = predictedUsage > 150
            ? `The AI model predicts high energy demand (${predictedUsage.toFixed(1)} kWh) in the next hour`
            : `The AI model predicts normal energy demand (${predictedUsage.toFixed(1)} kWh) for the next hour`;

        const gridAction = solarOutput < 300
            ? ', requiring additional power from the grid.'
            : ', with solar offsetting most grid dependency.';

        const recommendation = solarOutput < 200 && predictedUsage > 150
            ? ' Consider reducing non-essential loads during this period to minimize costs.'
            : '';

        return `${solarCondition} ${demandPrediction}${gridAction}${recommendation}`;
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-200 dark:border-cyan-500/30 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors"
            >
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400 hidden sm:inline">AI Insights</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative z-10 w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Real-Time System Analysis</h2>
                                    <p className="text-xs text-slate-500">Powered by LSTM Neural Network</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                {anomalyDetected ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                        <span className="text-sm font-semibold text-red-700 dark:text-red-400">Attention Required</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">System Normal</span>
                                    </div>
                                )}
                            </div>

                            {/* Narrative */}
                            <div className="mb-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                    {backendAvailable ? getNarrative() : (
                                        <span className="text-slate-500 italic">Backend offline. Using simulation mode for predictions.</span>
                                    )}
                                </p>
                            </div>

                            {/* Status Indicators - Vertical Layout */}
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">System Status</p>

                                {/* Grid Dependency */}
                                <div className={`flex items-center justify-between p-3 rounded-xl ${gridStatus.bg} border ${gridStatus.border}`}>
                                    <div className="flex items-center gap-3">
                                        <Zap className={`w-5 h-5 ${gridStatus.color}`} />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Grid Dependency</p>
                                            <p className="text-xs text-slate-500">Power drawn from grid</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold ${gridStatus.color}`}>{gridStatus.icon} {gridStatus.level}</span>
                                </div>

                                {/* Solar Output */}
                                <div className={`flex items-center justify-between p-3 rounded-xl ${solarStatus.bg} border ${solarStatus.border}`}>
                                    <div className="flex items-center gap-3">
                                        <Sun className={`w-5 h-5 ${solarStatus.color}`} />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Solar Output</p>
                                            <p className="text-xs text-slate-500">{solarOutput.toFixed(0)} W/m² irradiance</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold ${solarStatus.color}`}>{solarStatus.icon} {solarStatus.level}</span>
                                </div>

                                {/* AI Confidence */}
                                <div className={`flex items-center justify-between p-3 rounded-xl ${confidenceStatus.bg} border ${confidenceStatus.border}`}>
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className={`w-5 h-5 ${confidenceStatus.color}`} />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">AI Confidence</p>
                                            <p className="text-xs text-slate-500">Model prediction accuracy</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold ${confidenceStatus.color}`}>{confidenceStatus.icon} {confidence}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <p className="text-xs text-slate-500 text-center">
                                Last updated: {new Date().toLocaleTimeString()} • Refreshes every 30s
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
