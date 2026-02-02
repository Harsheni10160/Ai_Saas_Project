"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { MessageSquare, TrendingUp, Users, Clock, Loader2, Sparkles, BarChart3, ArrowUpRight, Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { exportAnalyticsToPDF, exportAnalyticsToCSV } from "@/lib/export-utils";

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [workspaceId, setWorkspaceId] = useState<string | null>(null);
    const [workspaceName, setWorkspaceName] = useState<string>('Workspace');
    const [exporting, setExporting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const res = await fetch("/api/workspaces");
            const data = await res.json();
            if (data.length > 0) {
                setWorkspaceId(data[0].id);
                setWorkspaceName(data[0].name || 'Workspace');
                fetchAnalytics(data[0].id);
            }
        } catch (error) {
            toast.error("Failed to fetch workspaces");
        }
    };

    const fetchAnalytics = async (id: string) => {
        try {
            const res = await fetch(`/api/analytics?workspaceId=${id}`);
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
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-pastel-green" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-pastel-green" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Performance</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-serif font-bold"
                    >
                        Analytics
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-2"
                    >
                        Understand how users are interacting with your AI agent.
                    </motion.p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-white hi-border rounded-xl text-sm font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-pastel-green shadow-[0_0_8px_rgba(217,241,158,1)] animate-pulse" />
                        Live Monitoring
                    </div>

                    {/* Export Button with Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            disabled={exporting}
                            className="px-6 py-2 bg-black text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exporting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Export
                                    <ChevronDown className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <AnimatePresence>
                            {showExportMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-10"
                                >
                                    <button
                                        onClick={handleExportPDF}
                                        className="w-full px-4 py-3 text-left hover:bg-pastel-green transition-colors flex items-center gap-3 font-bold"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Export as PDF
                                    </button>
                                    <div className="border-t-2 border-black" />
                                    <button
                                        onClick={handleExportCSV}
                                        className="w-full px-4 py-3 text-left hover:bg-pastel-blue transition-colors flex items-center gap-3 font-bold"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Messages", value: analytics?.totalMessages || 0, icon: MessageSquare, color: "bg-pastel-blue", trend: "+12%" },
                    { label: "This Month", value: analytics?.messagesThisMonth || 0, icon: TrendingUp, color: "bg-pastel-green", trend: "+5%" },
                    { label: "Conversations", value: analytics?.totalConversations || 0, icon: Users, color: "bg-pastel-purple", trend: "+8%" },
                    { label: "Avg Response", value: "< 1s", icon: Clock, color: "bg-pastel-yellow", trend: "0ms" },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="hi-card p-6 group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${stat.color} hi-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 hi-border rounded-full">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {stat.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                                <p className="text-3xl font-serif font-bold">{stat.value}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2"
                >
                    <Card className="hi-card p-8 bg-white/50 backdrop-blur-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-blue/5 rounded-full blur-3xl -mr-32 -mt-32" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold">Message Volume</h2>
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Last 30 Days</p>
                            </div>
                            <select className="bg-secondary/50 hi-border rounded-xl px-4 py-2 text-xs font-bold focus:outline-none hover:bg-secondary transition-colors">
                                <option>Last 30 Days</option>
                                <option>Last 7 Days</option>
                            </select>
                        </div>

                        <div className="h-[350px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.dailyMessages || []}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#BDDDFC" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#BDDDFC" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#000" strokeOpacity={0.05} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(val) => val.split("-")[2]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#666', fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#666', fontWeight: 600 }}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: '2px solid #000',
                                            boxShadow: '8px 8px 0px #000',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ fontWeight: 800, color: '#000' }}
                                        labelStyle={{ fontWeight: 600, marginBottom: '4px', opacity: 0.5 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#000"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        activeDot={{ r: 6, strokeWidth: 2, stroke: '#000', fill: '#BDDDFC' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                {/* Top Questions */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1"
                >
                    <Card className="hi-card h-full flex flex-col overflow-hidden">
                        <div className="p-6 border-b-2 border-black bg-pastel-yellow/10">
                            <div className="flex items-center gap-3 mb-1">
                                <Sparkles className="w-5 h-5 text-pastel-yellow" />
                                <h2 className="text-2xl font-bold">Recent Insights</h2>
                            </div>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">User Questions</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {analytics?.topQuestions?.map((q: string, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (idx * 0.05) }}
                                    className="p-4 bg-white hi-border rounded-2xl group hover:bg-pastel-purple/10 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all cursor-default"
                                >
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-pastel-purple mt-1.5 flex-shrink-0" />
                                        <p className="text-sm font-bold leading-tight group-hover:translate-x-1 transition-transform">{q}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {(!analytics?.topQuestions || analytics?.topQuestions?.length === 0) && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                                    <MessageSquare className="w-12 h-12 mb-4" />
                                    <p className="text-sm font-bold uppercase tracking-widest">Waiting for data...</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
