"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { MessageSquare, TrendingUp, Users, Clock, Loader2, Sparkles, BarChart3, ArrowUpRight, Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { exportAnalyticsToPDF, exportAnalyticsToCSV } from "@/lib/export-utils";
import { ChartSkeleton, StatCardSkeleton } from "@/components/loading-skeleton";

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [workspaceId, setWorkspaceId] = useState<string | null>(null);
    const [workspaceName, setWorkspaceName] = useState<string>('Workspace');
    const [exporting, setExporting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    useEffect(() => {
        fetchActiveWorkspace();
    }, []);

    const fetchActiveWorkspace = async () => {
        try {
            const res = await fetch("/api/workspaces/active");

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "Failed to load active workspace" }));
                toast.error(errorData.error || "Failed to fetch active workspace");
                return;
            }

            const data = await res.json();
            if (data.id) {
                setWorkspaceId(data.id);
                setWorkspaceName(data.name || 'Workspace');
                fetchAnalytics(data.id);
            }
        } catch (error) {
            toast.error("Failed to fetch active workspace");
        }
    };

    const fetchAnalytics = async (id: string) => {
        try {
            const res = await fetch(`/api/analytics?workspaceId=${id}`);

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "Failed to load analytics" }));
                console.error("Failed to fetch analytics:", errorData.error);
                return;
            }

            const data = await res.json();
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = async () => {
        if (!analytics) {
            toast.error("No data to export");
            return;
        }

        try {
            setExporting(true);
            setShowExportMenu(false);

            exportAnalyticsToPDF(analytics, workspaceName);

            toast.success("PDF report downloaded successfully!");
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Failed to export PDF");
        } finally {
            setExporting(false);
        }
    };

    const handleExportCSV = async () => {
        if (!analytics) {
            toast.error("No data to export");
            return;
        }

        try {
            setExporting(true);
            setShowExportMenu(false);

            exportAnalyticsToCSV(analytics, workspaceName);

            toast.success("CSV report downloaded successfully!");
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Failed to export CSV");
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 pb-20 max-w-7xl mx-auto">
                <div className="flex flex-col gap-2 mb-8">
                    <div className="h-10 w-48 bg-zinc-100 animate-pulse rounded-lg" />
                    <div className="h-4 w-64 bg-zinc-100 animate-pulse rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ChartSkeleton />
                    </div>
                    <div>
                        <ChartSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Analytics</h1>
                    <p className="text-zinc-500 mt-1">
                        Deeper insights into your AI agent&apos;s performance and user engagement.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-600 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Monitoring
                    </div>

                    <div className="relative">
                        <Button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            disabled={exporting}
                            className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg h-9"
                        >
                            {exporting ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Download className="w-4 h-4 mr-2" />
                            )}
                            Export
                            <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                        </Button>

                        <AnimatePresence>
                            {showExportMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden z-20"
                                >
                                    <button
                                        onClick={handleExportPDF}
                                        className="w-full px-4 py-2.5 text-left hover:bg-zinc-50 transition-colors flex items-center gap-3 text-sm font-medium text-zinc-600 hover:text-zinc-900"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Export as PDF
                                    </button>
                                    <div className="border-t border-zinc-100" />
                                    <button
                                        onClick={handleExportCSV}
                                        className="w-full px-4 py-2.5 text-left hover:bg-zinc-50 transition-colors flex items-center gap-3 text-sm font-medium text-zinc-600 hover:text-zinc-900"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        Export as CSV
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Messages", value: analytics?.totalMessages || 0, icon: MessageSquare, iconBg: "bg-blue-50 text-blue-600", trend: "+12%" },
                    { label: "This Month", value: analytics?.messagesThisMonth || 0, icon: TrendingUp, iconBg: "bg-emerald-50 text-emerald-600", trend: "+5%" },
                    { label: "Active Sessions", value: analytics?.totalConversations || 0, icon: Users, iconBg: "bg-indigo-50 text-indigo-600", trend: "+8%" },
                    { label: "Avg Latency", value: "< 1.2s", icon: Clock, iconBg: "bg-amber-50 text-amber-600", trend: "-50ms" },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <Card className="p-5 border-zinc-200 hover:border-zinc-300 transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                                    <stat.icon size={20} />
                                </div>
                                <div className="px-1.5 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-600 uppercase">
                                    {stat.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-zinc-900 tracking-tight">{stat.value}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <Card className="p-8 border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-lg font-bold text-zinc-900">Engagement Volume</h2>
                                <p className="text-xs text-zinc-500 font-medium">Daily message activity for the current period</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-indigo-50 text-[10px] font-bold text-indigo-600 rounded-full border border-indigo-100">
                                    Last 30 Days
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.dailyMessages || []}>
                                    <defs>
                                        <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(val) => val.split("-")[2]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid #E5E7EB',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            padding: '12px',
                                            fontSize: '12px'
                                        }}
                                        itemStyle={{ fontWeight: 700, color: '#18181B' }}
                                        labelStyle={{ fontWeight: 500, color: '#71717A', marginBottom: '4px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#4f46e5"
                                        strokeWidth={2.5}
                                        fillOpacity={1}
                                        fill="url(#colorIndigo)"
                                        activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#4f46e5' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                {/* Top Questions Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-1"
                >
                    <Card className="h-full border-zinc-200 bg-zinc-50/30 shadow-sm flex flex-col overflow-hidden max-h-[500px]">
                        <div className="p-6 border-b border-zinc-100 bg-white">
                            <h2 className="font-bold text-zinc-900 flex items-center gap-2">
                                <Sparkles size={16} className="text-amber-500" />
                                Recent Insights
                            </h2>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Trending Topics</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {analytics?.topQuestions?.map((q: string, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (idx * 0.05) }}
                                    className="p-3.5 bg-white border border-zinc-100 rounded-xl group hover:border-indigo-200 hover:bg-indigo-50/10 transition-all cursor-default"
                                >
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                        <p className="text-xs font-semibold text-zinc-700 leading-normal group-hover:text-zinc-900">{q}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {(!analytics?.topQuestions || analytics?.topQuestions?.length === 0) && (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-4">
                                        <MessageSquare className="text-zinc-200" size={24} />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Waiting for data...</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
