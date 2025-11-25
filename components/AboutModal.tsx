"use client";
import { X, Code, Database, Server, Cpu } from "lucide-react";

export function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Architecture</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                {/* Content */}
                <div className="p-6 space-y-6">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        EcoPulse is a real-time environmental intelligence dashboard correlating solar generation potential with air quality indices.
                    </p>
                    {/* Tech Stack List */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tech Stack</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                <Code size={16} className="text-blue-500" /> Next.js 15
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                <Server size={16} className="text-emerald-500" /> Tailwind CSS
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                <Database size={16} className="text-amber-500" /> TanStack Query
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                <Cpu size={16} className="text-purple-500" /> Recharts
                            </div>
                        </div>
                    </div>
                    {/* Data Sources */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Data Sources</h3>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc list-inside space-y-1">
                            <li>Open-Meteo API (Weather & Solar)</li>
                            <li>European/US Air Quality Index API</li>
                        </ul>
                    </div>
                </div>
                {/* Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-500">Built by Salman • 2025</p>
                </div>
            </div>
        </div>
    );
}
