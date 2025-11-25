import React from 'react';
import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { DashboardDataPoint } from '@/types/dashboard';

interface EnergyChartProps {
    data: DashboardDataPoint[];
}

export function EnergyChart({ data }: EnergyChartProps) {
    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                    <defs>
                        <linearGradient id="colorAQI" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis
                        dataKey="timestamp"
                        stroke="#888"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(value) => {
                            // Value is ISO string "2024-11-25T10:00"
                            // Return "10:00"
                            try {
                                return value.split('T')[1].slice(0, 5);
                            } catch {
                                return value;
                            }
                        }}
                    />
                    {/* Left Y-Axis: Air Quality Index */}
                    <YAxis
                        yAxisId="left"
                        stroke="#ef4444"
                        fontSize={12}
                        label={{ value: 'Air Quality Index (US AQI)', angle: -90, position: 'insideLeft', fill: '#ef4444' }}
                    />
                    {/* Right Y-Axis: Solar Output */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#eab308"
                        fontSize={12}
                        label={{ value: 'Solar Output (W/m²)', angle: 90, position: 'insideRight', fill: '#eab308' }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                        formatter={(value: number, name: string) => {
                            if (name === 'Air Quality Index') return [`${value} AQI`, name];
                            if (name === 'Solar Output') return [`${value} W/m²`, name];
                            return [value, name];
                        }}
                        labelFormatter={(label) => {
                            try {
                                return label.split('T')[1].slice(0, 5);
                            } catch {
                                return label;
                            }
                        }}
                    />
                    <Legend />

                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="airQualityIndex"
                        name="Air Quality Index"
                        fill="url(#colorAQI)"
                        stroke="#ef4444"
                        strokeWidth={2}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="solarOutput"
                        name="Solar Output"
                        stroke="#eab308"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
