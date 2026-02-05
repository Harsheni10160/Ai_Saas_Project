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
            whileHover={{ y: -5 }}
            className={`hi-card p-6 flex flex-col justify-between ${color}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white border flex items-center justify-center shadow-md">
                    <Icon size={24} />
                </div>
                {change && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border bg-white`}>
                        {change}
                    </span>
                )}
            </div>
            <div>
                <div className="text-sm font-medium text-black/60 mb-1">{label}</div>
                <div className="text-3xl font-serif font-bold text-black">{value}</div>
            </div>
        </motion.div>
    );
}
