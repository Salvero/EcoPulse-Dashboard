'use client';
import { Sunrise, Sunset } from 'lucide-react';
import React, { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatCard } from '@/components/dashboard/StatCard';
import { EnergyChart } from '@/components/dashboard/EnergyChart';
import { Shell, CITIES } from '@/components/dashboard/Shell';
import { ForecastCard } from '@/components/dashboard/ForecastCard';
import { InsightCard } from '@/components/dashboard/InsightCard';

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const { data, loading, error } = useDashboardData(selectedCity.coords);
  const [time, setTime] = useState<string | null>(null);

  React.useEffect(() => {
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-500">
        <p>Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  // Calculate current stats from the latest data point or defaults
  const currentHour = new Date().getHours();
  const currentIndex = data?.energyData.findIndex(d => {
    const date = new Date(d.timestamp);
    return date.getHours() === currentHour;
  }) ?? -1;

  const currentEnergy = currentIndex !== -1 && data ? data.energyData[currentIndex] : (data?.energyData[0] ?? null);

  return (
    <Shell selectedCity={selectedCity} onCityChange={setSelectedCity}>
      <header className="flex justify-between items-center mb-6">
        {/* Left: City Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {selectedCity.name}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live Telemetry • {selectedCity.coords.lat}, {selectedCity.coords.long}
          </p>
        </div>

        {/* Right: User Profile & Status */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">System Online</p>
            <p className="text-[10px] text-slate-400 min-h-[15px]">{time || '--:--'}</p>
          </div>
        </div>
      </header>

      {/* THE BENTO GRID */}
      {/* THE BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-6">
        {/* 1. HERO CHART: CORRELATION ANALYSIS (Left Side - Top) */}
        <div className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Energy Correlation Analysis</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Air Quality</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Solar</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <EnergyChart data={data?.energyData || []} mode="combined" className="h-full" />
          </div>
        </div>

        {/* 2. FORECAST AREA (Right Side - Vertical Column) */}
        <div className="col-span-1 lg:col-span-1 lg:row-span-2 flex flex-col gap-6">
          {/* FORECAST CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex-1">
            <ForecastCard forecast={data?.forecast} />
          </div>

          {/* SUN PHASE CARD (Astronomy) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-4">Sun Phase</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                    <Sunrise size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Sunrise</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">06:42 AM</p>
                  </div>
                </div>
              </div>
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Sunset size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Sunset</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">08:15 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. STAT CARDS (Left Side - Bottom) */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <StatCard
            title="Temperature"
            value={data?.weather.temperature ?? '--'}
            unit="°C"
            loading={loading}
            status="inactive"
          />
          <StatCard
            title="UV Index"
            value={currentEnergy?.uvIndex ?? 0}
            unit="UV"
            loading={loading}
            status={(currentEnergy?.uvIndex ?? 0) > 6 ? 'critical' : (currentEnergy?.uvIndex ?? 0) > 3 ? 'moderate' : 'good'}
          />
          <StatCard
            title="Wind Speed"
            value={data?.weather.windSpeed ?? '--'}
            unit="km/h"
            loading={loading}
            status="inactive"
          />
          <StatCard
            title="Humidity"
            value={data?.weather.humidity ?? '--'}
            unit="%"
            loading={loading}
            status="inactive"
          />
        </div>

        {/* 3. INSIGHT CARD (New Bottom Section) */}
        <div className="col-span-1 lg:col-span-3">
          <InsightCard data={data} />
        </div>
      </div>
    </Shell>
  );
}
