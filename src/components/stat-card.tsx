"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
    label: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down" | "neutral";
    icon: LucideIcon;
    color: string;
}

export function StatCard({ label, value, change, trend, icon: Icon, color }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`p-6 rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-sm ${color}`}
        >
            <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900">
                    <Icon size={20} />
                </div>
                {change && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter border border-zinc-100 bg-white
                        ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-zinc-500'}`}>
                        {change}
                    </span>
                )}
            </div>
            <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</div>
                <div className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</div>
            </div>
        </motion.div>
    );
}
