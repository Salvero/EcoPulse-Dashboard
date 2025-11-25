"use client"
import { CloudSun, Leaf, MapPin, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";

export const CITIES = [
    { name: 'Toronto', coords: { lat: 43.6532, long: -79.3832 } },
    { name: 'New York', coords: { lat: 40.7128, long: -74.0060 } },
    { name: 'London', coords: { lat: 51.5074, long: -0.1278 } },
    { name: 'Tokyo', coords: { lat: 35.6762, long: 139.6503 } },
];

export function Shell({ children, selectedCity, onCityChange, cities = CITIES }: any) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
                {/* Header (Inferred as it was missing in snippet but usually present) */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-green-600 dark:text-green-500" />
                    <h1 className="text-xl font-bold tracking-tight">EcoPulse</h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2 px-2">
                        Stations
                    </div>
                    {cities.map((city: any) => (
                        <button
                            key={city.name}
                            onClick={() => onCityChange(city)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${selectedCity.name === city.name
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            <MapPin size={14} />
                            {city.name}
                        </button>
                    ))}
                </nav>
                {/* Theme Toggle Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all"
                    >
                        {mounted && (theme === "dark" ? (
                            <>
                                <Sun size={14} />
                                <span>Light Mode</span>
                            </>
                        ) : (
                            <>
                                <Moon size={14} />
                                <span>Dark Mode</span>
                            </>
                        ))}
                        {!mounted && (
                            <>
                                <span className="w-4 h-4 block" />
                                <span className="opacity-0">Loading...</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>
            {/* 2. MAIN CONTENT WRAPPER */}
            {/* pl-64 creates the safe zone for the sidebar. max-w-6xl keeps content compact. */}
            <main className="pl-64 min-h-screen">
                <div className="max-w-6xl mx-auto p-6 space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
