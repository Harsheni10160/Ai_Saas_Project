"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    CheckCircle2,
    Circle,
    ArrowRight,
    Layout,
    Users,
    Bot,
    FileText,
    Settings,
    Zap,
    BookOpen,
    MessageSquare,
    AlertCircle,
    Loader2,
    Plus
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import QuickTipsModal from "@/components/quick-tips-modal";
import { DashboardSkeleton } from "@/components/loading-skeleton";

// --- Components ---

const StatusCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
        className={`hi-card p-6 relative overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);

const Badge = ({ children, type = "neutral" }: { children: React.ReactNode; type?: "neutral" | "success" | "warning" | "purple" }) => {
    const styles = {
        neutral: "bg-secondary text-muted-foreground",
        success: "bg-pastel-green/20 text-emerald-700",
        warning: "bg-pastel-yellow/20 text-amber-700",
        purple: "bg-pastel-purple/20 text-indigo-700"
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border border-black/5 ${styles[type]}`}>
            {children}
        </span>
    );
};

// --- Main Dashboard ---

export default function DashboardPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [showTipsModal, setShowTipsModal] = useState(false);
    const [stats, setStats] = useState({
        documents: 0,
        agentConfigured: false,
        totalMessages: 0,
        teamMembers: 0,
    });

    const [checklist, setChecklist] = useState([
        { id: 1, label: "Upload your first document", completed: false, link: "/dashboard/documents" },
        { id: 2, label: "Configure AI Agent persona", completed: false, link: "/dashboard/settings" },
        { id: 3, label: "Test chat in playground", completed: false, link: "/dashboard/chat" },
        { id: 4, label: "Install chat widget", completed: false, link: "/dashboard/embed" },
        { id: 5, label: "Invite team members", completed: false, link: "/dashboard/team" },
    ]);

    useEffect(() => {
        fetchDashboardData();
        // Refresh data every 30 seconds for real-time updates
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // ✅ OPTIMIZED: Parallel API calls instead of sequential
            const [wsRes, docRes, analyticsRes] = await Promise.all([
                fetch("/api/workspaces"),
                fetch("/api/workspaces").then(async (res) => {
                    const wsData = await res.json();
                    if (wsData && wsData.length > 0) {
                        return fetch(`/api/documents?workspaceId=${wsData[0].id}`);
                    }
                    return null;
                }),
                fetch("/api/workspaces").then(async (res) => {
                    const wsData = await res.json();
                    if (wsData && wsData.length > 0) {
                        return fetch(`/api/analytics?workspaceId=${wsData[0].id}`).catch(() => null);
                    }
                    return null;
                }),
            ]);

            const wsData = await wsRes.json();

            if (wsData && wsData.length > 0) {
                const activeWs = wsData[0];
                setWorkspace(activeWs);

                // Parse parallel responses
                const docs = docRes ? await docRes.json() : [];
                let analyticsData = { totalMessages: 0 };

                if (analyticsRes) {
                    try {
                        analyticsData = await analyticsRes.json();
                    } catch (err) {
                        console.log("Analytics not available yet");
                    }
                }

                // Check widget installation (from localStorage)
                const widgetInstalled = typeof window !== 'undefined' && localStorage.getItem(`widget_installed_${activeWs.id}`) === 'true';

                // Calculate stats
                const hasDocs = docs && docs.length > 0;
                const isAgentConfigured = activeWs.chatbotName !== null && activeWs.chatbotName.trim() !== '';
                const hasMessages = analyticsData.totalMessages > 0;
                const teamMemberCount = activeWs.members?.length || 0;
                const hasTeamMembers = teamMemberCount > 1;

                setStats({
                    documents: docs ? docs.length : 0,
                    agentConfigured: isAgentConfigured,
                    totalMessages: analyticsData.totalMessages || 0,
                    teamMembers: teamMemberCount,
                });

                // Update checklist based on real data with animation
                setChecklist(prev => prev.map(item => {
                    let newCompleted = item.completed;

                    if (item.id === 1 && hasDocs) newCompleted = true;
                    if (item.id === 2 && isAgentConfigured) newCompleted = true;
                    if (item.id === 3 && hasMessages) newCompleted = true;
                    if (item.id === 4 && widgetInstalled) newCompleted = true;
                    if (item.id === 5 && hasTeamMembers) newCompleted = true;

                    // Show toast when item newly completes
                    if (!item.completed && newCompleted) {
                        toast.success(`✅ ${item.label} - Complete!`);
                    }

                    return { ...item, completed: newCompleted };
                }));
            }
        } catch (error) {
            console.error("Dashboard error:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const progress = Math.round((checklist.filter(i => i.completed).length / checklist.length) * 100);

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-10">

            {/* 1. Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-pastel-green hi-border animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Workspace Active</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-serif font-bold tracking-tight"
                    >
                        Dashboard
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-2"
                    >
                        Welcome to your AI Support workspace. Let’s get you live.
                    </motion.p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold">{workspace?.name || "Acme Corp"}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">{workspace?.plan || "Free"} Plan</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-pastel-yellow hi-border flex items-center justify-center font-bold text-lg shadow-sm">
                        {session?.user?.name?.[0]?.toUpperCase() || "A"}
                    </div>
                </div>
            </header>

            {/* 2. Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard delay={0.1}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-pastel-blue hi-border rounded-xl">
                            <Layout size={20} />
                        </div>
                        <Badge type="purple">Workspace</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{workspace?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">Primary Account</p>
                    <Link href="/dashboard/settings" className="text-sm font-bold flex items-center gap-1 group hover:underline">
                        Workspace Settings
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </StatusCard>

                <StatusCard delay={0.2}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-pastel-green hi-border rounded-xl">
                            <Users size={20} />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{session?.user?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{session?.user?.email}</p>
                    <Link href="/dashboard/settings" className="text-sm font-bold flex items-center gap-1 hover:underline">
                        Manage Profile
                    </Link>
                </StatusCard>

                <StatusCard delay={0.3}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-pastel-yellow hi-border rounded-xl">
                            <Zap size={20} />
                        </div>
                        <Badge type={stats.agentConfigured ? "success" : "warning"}>
                            {stats.agentConfigured ? "Configured" : "Setup Required"}
                        </Badge>
                    </div>
                    <div className="space-y-1 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                            <div className={`w-1.5 h-1.5 rounded-full ${stats.agentConfigured ? "bg-pastel-green" : "bg-slate-300"}`} />
                            Agent: <span className={stats.agentConfigured ? "font-bold" : "text-muted-foreground"}>
                                {stats.agentConfigured ? "Ready" : "Not Configured"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className={`w-1.5 h-1.5 rounded-full ${stats.documents > 0 ? "bg-pastel-green" : "bg-slate-300"}`} />
                            Knowledge: <span className={stats.documents > 0 ? "font-bold" : "text-muted-foreground"}>{stats.documents} Documents</span>
                        </div>
                    </div>
                    <Link href="/dashboard/documents" className="text-sm font-bold text-black border-b-2 border-pastel-green hover:bg-pastel-green/10 transition-colors">
                        {stats.documents > 0 ? "Add More Knowledge" : "Start Setup"}
                    </Link>
                </StatusCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Activation Checklist */}
                <div className="lg:col-span-2 space-y-8">
                    <StatusCard delay={0.4} className="bg-white border-l-8 border-l-pastel-green">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pastel-green/10 rounded-full blur-3xl"></div>

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div>
                                <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                                    🚀 Launch Checklist
                                    <span className="text-sm font-sans font-normal text-muted-foreground tracking-normal">({progress}% Complete)</span>
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">Complete these steps to activate your AI support agent.</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-secondary hi-border h-4 rounded-full mb-8 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-pastel-green rounded-full"
                            />
                        </div>

                        {/* Checklist Items */}
                        <div className="space-y-3 relative z-10">
                            {checklist.map((item, index) => (
                                <Link
                                    key={item.id}
                                    href={item.link}
                                    className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200
                    ${item.completed
                                            ? 'bg-secondary/20 border-black/5 hover:border-black/10'
                                            : 'bg-white border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`transition-colors duration-300 ${item.completed ? 'text-pastel-green' : 'text-slate-300 group-hover:text-black'}`}>
                                            {item.completed ? <CheckCircle2 size={24} className="fill-pastel-green/20" /> : <Circle size={24} />}
                                        </div>
                                        <span className={`text-lg transition-all ${item.completed ? 'text-muted-foreground line-through decoration-black/20' : 'font-bold'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <ArrowRight size={20} className={`transition-transform group-hover:translate-x-2 ${item.completed ? 'opacity-0' : 'opacity-100'}`} />
                                </Link>
                            ))}
                        </div>
                    </StatusCard>

                    {/* 4. Empty State Analytics */}
                    <div className="pt-4">
                        <h3 className="text-xl font-serif font-bold mb-6">Performance Overview</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="hi-card p-6 bg-white border-dashed border-2 opacity-50">
                                    <div className="h-3 w-16 bg-secondary rounded mb-4 animate-pulse"></div>
                                    <div className="h-8 w-10 bg-secondary rounded mb-2 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-secondary/30 rounded-2xl hi-border border-dashed flex items-center justify-center gap-3 text-sm text-muted-foreground">
                            <AlertCircle size={18} />
                            Real-time insights will appear here once your agent starts chatting.
                        </div>
                    </div>
                </div>

                {/* Right Column: Status & Guidance */}
                <div className="space-y-6">

                    {/* 5. AI Agent Status Panel */}
                    <StatusCard delay={0.5} className="bg-black text-white p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-xl">
                                <Bot size={24} className="text-pastel-green" />
                            </div>
                            <span className="text-lg font-bold">Agent Status</span>
                        </div>

                        <div className="text-center py-4">
                            <div className="inline-block p-6 rounded-3xl bg-white/5 mb-6 relative">
                                <div className="absolute inset-0 bg-pastel-green/10 blur-2xl rounded-full animate-pulse"></div>
                                <BookOpen size={48} className="text-white/20 relative z-10" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-3">Agent is hungry!</h3>
                            <p className="text-white/60 text-sm mb-8 leading-relaxed">
                                Feed your agent with documentation so it can learn about your business and start helping customers.
                            </p>
                            <Link href="/dashboard/documents">
                                <button className="w-full py-4 bg-pastel-green text-black rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">
                                    Feed Knowledge
                                </button>
                            </Link>
                            <button className="mt-4 text-sm font-bold text-white/40 hover:text-white transition-colors">
                                View Training Guide
                            </button>
                        </div>
                    </StatusCard>

                    {/* 6. Helpful Guidance */}
                    <StatusCard delay={0.6}>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="text-2xl">✨</span> Quick Tips
                        </h3>
                        <ul className="space-y-6">
                            {[
                                { title: "How AI training works", sub: "Learn about vector embeddings.", icon: "1" },
                                { title: "Best documents to upload", sub: "PDFs vs Word documents.", icon: "2" },
                                { title: "Widget Integration", sub: "Add chat to your website.", icon: "3" },
                            ].map((tip, idx) => (
                                <li key={idx} onClick={() => setShowTipsModal(true)} className="flex gap-4 items-start group cursor-pointer">
                                    <div className="mt-1 min-w-[28px] h-7 rounded-lg bg-secondary hi-border flex items-center justify-center text-sm font-black group-hover:bg-pastel-green transition-colors">
                                        {tip.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold group-hover:text-pastel-green transition-colors">{tip.title}</p>
                                        <p className="text-xs text-muted-foreground">{tip.sub}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </StatusCard>

                </div>
            </div>

            {/* Quick Tips Modal */}
            <QuickTipsModal isOpen={showTipsModal} onClose={() => setShowTipsModal(false)} />
        </div>
    );
}
