import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
    loading?: boolean;
    unit?: string;
    status?: 'good' | 'moderate' | 'critical' | 'inactive';
}

export function StatCard({ title, value, trend, loading, unit, status }: StatCardProps) {
    if (loading) {
        return (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg animate-pulse h-full">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
        );
    }

    const getStatusColor = () => {
        switch (status) {
            case 'good': return 'text-emerald-600 dark:text-emerald-400';
            case 'moderate': return 'text-amber-600 dark:text-amber-400';
            case 'critical': return 'text-red-600 dark:text-red-400';
            case 'inactive': return 'text-slate-600 dark:text-slate-300';
            default: return 'text-slate-900 dark:text-slate-100';
        }
    };

    const getStatusBg = () => {
        switch (status) {
            case 'good': return 'from-emerald-500/5 to-green-500/5 dark:from-emerald-500/10 dark:to-green-500/10 border-emerald-500/20';
            case 'moderate': return 'from-amber-500/5 to-yellow-500/5 dark:from-amber-500/10 dark:to-yellow-500/10 border-amber-500/20';
            case 'critical': return 'from-red-500/5 to-rose-500/5 dark:from-red-500/10 dark:to-rose-500/10 border-red-500/20';
            default: return 'from-white/80 to-white/80 dark:from-slate-900/80 dark:to-slate-900/80 border-slate-200/50 dark:border-slate-700/50';
        }
    };

    return (
        <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${getStatusBg()} backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200 h-full group`}>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">{title}</h3>
            <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-1">
                    <span className={`text-xl sm:text-2xl font-bold ${status ? getStatusColor() : 'text-slate-900 dark:text-slate-100'} transition-transform group-hover:scale-105`}>{value}</span>
                    {unit && <span className="text-xs sm:text-sm text-slate-400 font-medium">{unit}</span>}
                </div>

                {trend && (
                    <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-red-500 dark:text-red-400' :
                            trend === 'down' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-500'
                        }`}>
                        {trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                        {trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                        {trend === 'neutral' && <Minus className="w-4 h-4 mr-1" />}
                        <span className="sr-only">{trend} trend</span>
                    </div>
                )}
            </div>
        </div>
    );
}
