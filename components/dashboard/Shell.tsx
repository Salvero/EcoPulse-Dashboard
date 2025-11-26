"use client"
import { CloudSun, Leaf, MapPin, Moon, Sun, HelpCircle, Menu, X, BarChart3, History, Bell, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import { AboutModal } from "../AboutModal";

export const CITIES = [
    { name: 'Toronto', coords: { lat: 43.6532, long: -79.3832 } },
    { name: 'New York', coords: { lat: 40.7128, long: -74.0060 } },
    { name: 'London', coords: { lat: 51.5074, long: -0.1278 } },
    { name: 'Tokyo', coords: { lat: 35.6762, long: 139.6503 } },
];

export function Shell({ children, selectedCity, onCityChange, cities = CITIES }: any) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* MOBILE HEADER (Visible only on small screens) */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
                    <Leaf className="text-emerald-500 w-5 h-5" />
                    EcoPulse
                </div>
                <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-600 dark:text-slate-300">
                    <Menu size={24} />
                </button>
            </div>

            {/* SIDEBAR (Drawer on Mobile, Fixed on Desktop) */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
            `}>
                {/* Logo Area (Desktop only, hidden on mobile since we have the header) */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
                        <Leaf className="text-emerald-500 w-5 h-5" />
                        EcoPulse
                    </div>
                    {/* Close Button (Mobile Only) */}
                    <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2 px-2">
                        Stations
                    </div>
                    {cities.map((city: any) => (
                        <button
                            key={city.name}
                            onClick={() => {
                                onCityChange(city);
                                setIsMobileOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${selectedCity.name === city.name
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            <MapPin size={14} />
                            {city.name}
                        </button>
                    ))}

                    {/* SEPARATOR */}
                    <div className="mt-8 mb-2 px-2">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                            System
                        </div>
                    </div>
                    {/* SECONDARY LINKS (Visual only) */}
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <BarChart3 size={14} />
                        Analytics
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <History size={14} />
                        History Logs
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <Bell size={14} />
                        Notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <Settings size={14} />
                        Settings
                    </button>
                </nav>
                {/* Theme Toggle Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors mb-2"
                    >
                        <HelpCircle size={16} />
                        Project Info
                    </button>
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

            {/* OVERLAY (Mobile Only - click to close) */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* MAIN CONTENT WRAPPER */}
            <main className="pl-0 lg:pl-64 min-h-screen pt-4 lg:pt-0 transition-all duration-300">
                <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
                    {children}
                </div>
            </main>
            <AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
