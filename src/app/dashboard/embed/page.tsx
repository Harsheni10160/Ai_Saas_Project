"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check, ExternalLink, ShieldCheck, Zap, Info } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function EmbedPage() {
    const [workspace, setWorkspace] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const res = await fetch("/api/workspaces/active");
                if (res.ok) {
                    const data = await res.json();
                    setWorkspace(data);
                }
            } catch (error) {
                console.error("Failed to load workspace", error);
                toast.error("Failed to load workspace details");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspace();
    }, []);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const embedScript = `<script
  src="${appUrl}/embed/widget.js"
  data-workspace="${workspace?.widgetPublicKey || 'YOUR_WIDGET_KEY'}"
  data-api-url="${appUrl}"
></script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(embedScript);
        setCopied(true);
        toast.success("Embed script copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleVerify = async () => {
        try {
            const res = await fetch("/api/workspaces/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId: workspace.id,
                    widgetEnabled: true,
                }),
            });

            if (!res.ok) throw new Error("Verification failed");

            const updatedWs = await res.json();
            setWorkspace(updatedWs);
            toast.success("Widget installation verified!");
            queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
        } catch (error) {
            toast.error("Failed to verify installation. Make sure you added the script.");
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-zinc-900 mb-4" />
                <p className="text-zinc-500 font-medium">Preparing your installation kit...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Connect Website</h1>
                <p className="text-zinc-500 mt-2 max-w-2xl leading-relaxed">
                    Integrate your AI partner into any website with a single line of code. Follow these steps to get started.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Step 1: Copy Code */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-8 border-zinc-200 bg-white shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg">01</div>
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900">Installation Script</h2>
                                <p className="text-xs text-zinc-500 font-medium tracking-wide">COPY & PASTE TO YOUR HEAD OR BODY</p>
                            </div>
                        </div>

                        <p className="text-zinc-600 mb-6 leading-relaxed text-sm">
                            Paste this snippet into your website&apos;s HTML, optimally right before the closing <code className="bg-zinc-100 px-2 py-0.5 rounded font-semibold text-zinc-900">&lt;/body&gt;</code> tag.
                        </p>

                        <div className="relative group/code">
                            <pre className="bg-zinc-50 p-6 rounded-xl overflow-x-auto text-sm font-mono border border-zinc-200 text-zinc-700">
                                <code>{embedScript}</code>
                            </pre>
                            <Button
                                onClick={handleCopy}
                                className="absolute top-4 right-4 bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-sm active:scale-95 h-9"
                                size="sm"
                            >
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                <span className="font-bold text-xs uppercase tracking-widest">{copied ? "Copied" : "Copy"}</span>
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Step 2: Key Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-8 rounded-2xl bg-white border border-zinc-200 flex flex-col items-start gap-4 shadow-sm"
                    >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900">Production Ready</p>
                            <p className="text-sm text-zinc-500 mt-1 leading-relaxed">The script is optimized for performance and security on any production domain.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-2xl bg-white border border-zinc-200 flex flex-col items-start gap-4 shadow-sm"
                    >
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900">Real-time Sync</p>
                            <p className="text-sm text-zinc-500 mt-1 leading-relaxed">Agent changes, knowledge base edits, and styling updates reflect instantly without code changes.</p>
                        </div>
                    </motion.div>
                </div>

                <Card className="p-6 border-zinc-100 bg-zinc-50/50 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-white border border-zinc-200 rounded-lg text-zinc-400">
                                <ShieldCheck size={18} className={workspace?.widgetEnabled ? "text-emerald-500" : ""} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-zinc-900 text-sm">Status: {workspace?.widgetEnabled ? "Enabled" : "Not Verified"}</h3>
                                <p className="text-xs text-zinc-500 max-w-sm">
                                    {workspace?.widgetEnabled
                                        ? "Congratulations! Your widget is successfully enabled and ready for customers."
                                        : "Once you've added the script to your site, click verify to enable the widget."}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={handleVerify}
                            disabled={workspace?.widgetEnabled}
                            className={`${workspace?.widgetEnabled ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}
                        >
                            {workspace?.widgetEnabled ? "Verified" : "Verify Installation"}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
