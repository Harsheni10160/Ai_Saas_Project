"use client";

import React from "react";
import { useSession } from "next-auth/react";
import {
    Users,
    ArrowRight,
    Zap,
    Bot,
    CheckCircle2,
    Circle,
    Activity,
    FileText,
    MessageSquareText
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/loading-skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

// --- Components ---

const StatCard = ({ icon: Icon, title, value, subtext, colorClass }: any) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-zinc-500">{title}</p>
                    <h3 className="text-2xl font-bold text-zinc-900">{value}</h3>
                    {subtext && <p className="text-xs text-zinc-400 mt-1">{subtext}</p>}
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function DashboardPage() {
    const { data: session } = useSession();

    // 1. Fetch Active Workspace
    const { data: workspace, isLoading: wsLoading } = useQuery({
        queryKey: ["activeWorkspace"],
        queryFn: async () => {
            const res = await fetch("/api/workspaces/active");
            if (!res.ok) throw new Error("No active workspace");
            return res.json();
        }
    });

    // 2. Fetch Dashboard Summary (only when workspace is loaded)
    const { data: summary, isLoading: statsLoading } = useQuery({
        queryKey: ["dashboardSummary", workspace?.id],
        queryFn: async () => {
            const res = await fetch(`/api/dashboard/summary?workspaceId=${workspace.id}`);
            if (!res.ok) throw new Error("Failed to fetch summary");
            return res.json();
        },
        enabled: !!workspace?.id
    });

    // Derived State
    const stats = {
        documents: summary?.documentsCount || 0,
        agentConfigured: summary?.isAiConfigured || false,
        totalMessages: summary?.conversationsCount || 0,
        teamMembers: summary?.membersCount || 0,
    };

    const checklist = [
        { id: 1, label: "Upload knowledge base", completed: stats.documents > 0, link: "/dashboard/documents" },
        { id: 2, label: "Configure AI persona", completed: stats.agentConfigured, link: "/dashboard/settings" },
        { id: 3, label: "Test chat playground", completed: stats.totalMessages > 0, link: "/dashboard/chat" },
        { id: 4, label: "Embed widget", completed: summary?.widgetEnabled || false, link: "/dashboard/embed" },
    ];

    const progress = Math.round((checklist.filter(i => i.completed).length / checklist.length) * 100);

    if (wsLoading || statsLoading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
                    <p className="text-zinc-500 mt-1">Overview of your workspace performance.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/documents">
                        <Button variant="outline">Manage Docs</Button>
                    </Link>
                    <Link href="/dashboard/chat">
                        <Button className="bg-zinc-900 text-white hover:bg-zinc-800">
                            Open Playground
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={FileText}
                    title="Knowledge Base"
                    value={`${stats.documents} Docs`}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    icon={MessageSquareText}
                    title="Total Conversations"
                    value={stats.totalMessages}
                    colorClass="bg-green-50 text-green-600"
                />
                <StatCard
                    icon={Bot}
                    title="AI Status"
                    value={stats.agentConfigured ? "Active" : "Pending"}
                    subtext={!stats.agentConfigured ? "Needs configuration" : "Ready to chat"}
                    colorClass={stats.agentConfigured ? "bg-indigo-50 text-indigo-600" : "bg-orange-50 text-orange-600"}
                />
                <StatCard
                    icon={Users}
                    title="Team Members"
                    value={stats.teamMembers}
                    colorClass="bg-purple-50 text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Onboarding Checklist */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Setup Progress</span>
                            <span className="text-sm font-normal text-zinc-500">{progress}% Completed</span>
                        </CardTitle>
                        <CardDescription>Get your AI agent production-ready with these steps.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-zinc-100 rounded-full mb-6 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-indigo-600 rounded-full"
                            />
                        </div>

                        <div className="space-y-4">
                            {checklist.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${item.completed
                                        ? "bg-zinc-50 border-zinc-100 opacity-75"
                                        : "bg-white border-zinc-200 hover:border-indigo-200 hover:shadow-sm"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`flex-shrink-0 `}>
                                            {item.completed
                                                ? <CheckCircle2 className="text-green-500 w-6 h-6" />
                                                : <Circle className="text-zinc-300 w-6 h-6" />
                                            }
                                        </div>
                                        <span className={`font-medium ${item.completed ? "text-zinc-500 line-through" : "text-zinc-900"}`}>
                                            {item.label}
                                        </span>
                                    </div>

                                    {!item.completed && (
                                        <Link href={item.link}>
                                            <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                Start <ArrowRight className="ml-1 w-4 h-4" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity / Empty State */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-zinc-500" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Zap className="w-6 h-6 text-zinc-400" />
                            </div>
                            <h3 className="font-medium text-zinc-900 mb-1">No activity yet</h3>
                            <p className="text-sm text-zinc-500 mb-6">
                                Upload documents and start chatting to see live analytics here.
                            </p>
                            <Link href="/dashboard/documents">
                                <Button variant="secondary" className="w-full">
                                    Upload Documents
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
