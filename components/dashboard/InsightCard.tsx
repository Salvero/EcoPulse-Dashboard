import React from 'react';
import { Zap, Leaf, AlertTriangle, Wind } from "lucide-react";

export function InsightCard({ data }: { data: any }) {
    // 1. Simple Logic Engine
    const currentSolar = data?.current?.solarOutput || 0;
    const currentAQI = data?.current?.aqi || 0;

    let status = {
        title: "System Status Normal",
        message: "Environmental conditions are stable.",
        color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        icon: Leaf
    };

    // 2. Determine Insight based on Data
    if (currentSolar > 200) {
        status = {
            title: "Peak Generation Mode",
            message: "Solar output is high. Excellent time to run heavy appliances or charge EVs to maximize renewable usage.",
            color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
            icon: Zap
        };
    } else if (currentAQI > 100) {
        status = {
            title: "Poor Air Quality Alert",
            message: "AQI is elevated. Recommendation: Keep windows closed and run air filtration systems if available.",
            color: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20",
            icon: AlertTriangle
        };
    } else if (currentSolar < 50) {
        status = {
            title: "Grid Dependency Active",
            message: "Solar generation is low (Night/Overcast). System is drawing from the main grid. Conserve energy where possible.",
            color: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
            icon: Wind
        };
    }

    const Icon = status.icon;

    return (
        <div className={`h-full rounded-xl p-6 border ${status.color.includes('border') ? '' : 'border-slate-200 dark:border-slate-800'} ${status.color} transition-colors`}>
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-white/50 dark:bg-black/20 shrink-0">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-1">{status.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                        {status.message}
                    </p>
                </div>
            </div>
        </div>
    );
}
