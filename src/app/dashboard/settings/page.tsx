"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Palette, Code, Settings2, Loader2, Sparkles, User, ShieldCheck, Send, LogOut, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);

    useEffect(() => {
        fetchWorkspace();
    }, []);

    const fetchWorkspace = async () => {
        try {
            const res = await fetch("/api/workspaces");
            const data = await res.json();
            if (data.length > 0) {
                setWorkspace(data[0]);
            }
        } catch (error) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    const embedCode = `<script src="${appUrl}/embed/widget.js" data-workspace="${workspace?.id || 'YOUR_WORKSPACE_ID'}" data-api-url="${appUrl}"></script>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        toast.success("Code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-pastel-green" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Settings2 className="w-4 h-4 text-pastel-purple" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Configuration</span>
                    </div>
                    <h1 className="text-4xl font-serif font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Configure your AI agent and integrate it with your website.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >


                    {/* Agent Identity */}
                    <Card className="hi-card p-8 group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-blue/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-pastel-blue/20 transition-colors" />

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-pastel-blue hi-border flex items-center justify-center shadow-sm">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Agent Identity</h2>
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Persona</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="chatbot-name" className="text-sm font-bold ml-1">Agent Name</Label>
                                <Input
                                    id="chatbot-name"
                                    placeholder="e.g. Hobbes AI"
                                    defaultValue={workspace?.chatbotName || "AI Support"}
                                    className="h-12 rounded-2xl hi-border px-4 focus-visible:ring-pastel-blue"
                                />
                            </div>

                            <Button className="hi-pill-btn w-full justify-between h-14 text-lg">
                                <span>Save Changes</span>
                                <Sparkles className="w-5 h-5" />
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-8"
                >
                    {/* Customization */}
                    <Card className="hi-card p-8 group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-green/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-pastel-green/20 transition-colors" />

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-pastel-green hi-border flex items-center justify-center shadow-sm">
                                <Palette className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Branding</h2>
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Look & Feel</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <Label htmlFor="primary-color" className="text-sm font-bold ml-1">Theme Color</Label>
                                <div className="flex gap-4 p-2 bg-secondary/30 hi-border rounded-2xl">
                                    <Input
                                        id="primary-color"
                                        type="color"
                                        defaultValue={workspace?.primaryColor || "#000000"}
                                        className="h-12 w-16 p-1 bg-transparent border-none cursor-pointer"
                                    />
                                    <div className="flex-1 text-xs text-muted-foreground flex flex-col justify-center">
                                        <p className="font-bold text-black">Primary Accent</p>
                                        <p>Used for buttons, icons, and bubbles.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-secondary/10 hi-card border-dashed border-2 relative">
                                <p className="text-[10px] font-black mb-6 uppercase tracking-widest opacity-30 text-center">Live Preview</p>
                                <div className="flex justify-center scale-90 origin-top">
                                    <div className="w-64 h-80 bg-white hi-border rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col">
                                        <div className="p-3 bg-black text-white text-[10px] font-bold flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-pastel-green animate-pulse" />
                                            {workspace?.chatbotName || "AI Support"}
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col gap-3">
                                            <div className="w-3/4 h-8 bg-secondary/50 hi-border rounded-2xl rounded-tl-none" />
                                            <div className="w-2/3 h-8 bg-black hi-border rounded-2xl rounded-tr-none self-end" />
                                            <div className="w-3/4 h-12 bg-secondary/50 hi-border rounded-2xl rounded-tl-none" />
                                        </div>
                                        <div className="p-3 border-t-2 border-black bg-white flex gap-2">
                                            <div className="flex-1 h-8 bg-secondary/20 hi-border rounded-full" />
                                            <div className="w-8 h-8 bg-black hi-border rounded-xl flex items-center justify-center p-1">
                                                <Send className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button className="hi-pill-btn w-full h-14 bg-pastel-green text-black hover:bg-black hover:text-white">Apply Branding</Button>
                        </div>
                    </Card>

                    {/* Subscription */}
                    <Card className="hi-card p-8 group overflow-hidden bg-secondary/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white hi-border flex items-center justify-center shadow-sm">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Billing</h2>
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Plan & Usage</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white hi-border rounded-2xl">
                            <div>
                                <p className="text-sm font-bold">Current Plan</p>
                                <p className="text-xl font-serif font-bold text-pastel-purple">Free Tier</p>
                            </div>
                            <Button variant="outline" className="hi-border rounded-xl font-bold">Upgrade</Button>
                        </div>
                    </Card>

                    {/* Account & Security */}
                    <Card className="hi-card p-8 group overflow-hidden border-destructive/20">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-destructive/10 hi-border flex items-center justify-center shadow-sm">
                                <AlertTriangle className="w-6 h-6 text-destructive" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Account & Security</h2>
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Danger Zone</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-destructive/5 hi-border rounded-2xl border-dashed">
                                <p className="text-sm font-bold mb-2">Sign Out</p>
                                <p className="text-xs text-muted-foreground mb-4">
                                    End your current session and return to the login page.
                                </p>
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="w-full hi-border rounded-xl font-bold hover:bg-destructive hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
