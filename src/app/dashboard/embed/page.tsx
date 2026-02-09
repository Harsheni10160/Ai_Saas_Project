"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check, ExternalLink, ShieldCheck, Zap, Info } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EmbedPage() {
    const [workspace, setWorkspace] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

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

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-pastel-green mb-4" />
                <p className="text-muted-foreground font-medium italic">Preparing your installation kit...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <header>
                <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-pastel-yellow" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Installation</span>
                </div>
                <h1 className="text-4xl font-serif font-bold tracking-tight">Connect Your Website</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Follow these simple steps to add the AI support widget to your website and start chatting with your users.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Step 1: Copy Code */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="hi-card p-8 bg-white border-2 border-black relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-pastel-yellow/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-pastel-yellow/10 transition-colors" />

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-pastel-yellow hi-border flex items-center justify-center font-black">1</div>
                            <h2 className="text-2xl font-bold">Copy Your Script</h2>
                        </div>

                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Copy and paste this snippet into your website&apos;s HTML, right before the closing <code className="bg-secondary px-2 py-0.5 rounded font-bold border-2 border-black/5">&lt;/body&gt;</code> tag.
                        </p>

                        <div className="relative group/code">
                            <pre className="bg-secondary/40 p-6 rounded-2xl overflow-x-auto text-sm font-mono border-2 border-black/10 group-hover/code:border-black transition-all">
                                <code>{embedScript}</code>
                            </pre>
                            <Button
                                onClick={handleCopy}
                                className="absolute top-4 right-4 hi-border bg-white hover:bg-black hover:text-white transition-all shadow-md active:scale-95"
                                size="sm"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span className="ml-2 font-bold">{copied ? "Copied" : "Copy Code"}</span>
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Step 2: Benefits/Verification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="hi-card p-6 bg-pastel-green/10 border-dashed border-2 border-pastel-green/50 flex flex-col items-center text-center justify-center gap-4"
                    >
                        <ShieldCheck size={32} className="text-pastel-green" />
                        <div>
                            <p className="font-bold text-lg">Cross-Origin Ready</p>
                            <p className="text-xs text-muted-foreground">The script is optimized to load securely on any domain.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hi-card p-6 bg-pastel-blue/10 border-dashed border-2 border-pastel-blue/50 flex flex-col items-center text-center justify-center gap-4"
                    >
                        <Zap size={32} className="text-pastel-blue" />
                        <div>
                            <p className="font-bold text-lg">Self-Updating</p>
                            <p className="text-xs text-muted-foreground">Changes to your agent in the dashboard reflect instantly.</p>
                        </div>
                    </motion.div>
                </div>

                {/* Troubleshooting / Tips */}
                <Card className="hi-card p-6 border-black/5 bg-secondary/20">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-white hi-border rounded-lg">
                            <Info size={18} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold">Not working?</h3>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Ensure your production URL is correctly set in the dashboard settings.</li>
                                <li>• Check if your CMS or website builder allows custom script tags.</li>
                                <li>• If you use a Content Security Policy (CSP), allow <code className="font-bold">{appUrl}</code>.</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
