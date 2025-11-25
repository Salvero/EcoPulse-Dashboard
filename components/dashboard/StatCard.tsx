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
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse h-full">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
        );
    }

    const getStatusColor = () => {
        switch (status) {
            case 'good': return 'text-green-600 dark:text-green-400';
            case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
            case 'critical': return 'text-red-600 dark:text-red-400';
            case 'inactive': return 'text-slate-400 dark:text-slate-500';
            default: return 'text-slate-900 dark:text-slate-100';
        }
    };

    return (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors h-full">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{title}</h3>
            <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${status ? getStatusColor() : 'text-slate-900 dark:text-slate-100'}`}>{value}</span>
                    {unit && <span className="text-sm text-slate-500 font-medium">{unit}</span>}
                </div>

                {trend && (
                    <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-red-500 dark:text-red-400' :
                        trend === 'down' ? 'text-green-500 dark:text-green-400' : 'text-slate-500'
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
