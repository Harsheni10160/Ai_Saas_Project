"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-20 -left-20 w-64 h-64 bg-pastel-blue opacity-30 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-20 -right-20 w-80 h-80 bg-pastel-yellow opacity-30 rounded-full blur-3xl -z-10 animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
            >
                <h1 className="text-5xl md:text-7xl mb-6">
                    Your 24/7 AI Support Agent, <br />
                    <span className="text-pastel-green underline decoration-black decoration-4 underline-offset-8">Trained on Your Data.</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                    Stop answering the same FAQs. Upload your docs, and let our AI handle customer support instantly.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Link href="/signup">
                        <Button className="hi-pill-btn h-14 px-10 text-lg">
                            Start Your Free Trial
                        </Button>
                    </Link>
                    <Button variant="outline" className="border rounded-full h-14 px-10 text-lg bg-transparent hover:bg-black/5 transition-colors">
                        Watch Demo
                    </Button>
                </div>
            </motion.div>

            {/* Hero Visual: Floating Chat Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full max-w-3xl animate-float"
            >
                <div className="hi-card p-6 md:p-8 bg-white relative overflow-hidden">
                    {/* Mock Chat Interface */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-black/10">
                        <div className="w-10 h-10 rounded-full bg-pastel-green border flex items-center justify-center">
                            <Zap size={20} className="fill-black" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold">AI Support Agent</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Always Online
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-start">
                            <div className="bg-secondary p-4 rounded-2xl rounded-tl-none border max-w-[80%] text-left">
                                Hello! How can I help you today? I've been trained on your latest product manuals.
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="bg-pastel-blue p-4 rounded-2xl rounded-tr-none border max-w-[80%] text-right font-medium">
                                How do I set up custom branding for the widget?
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <div className="bg-pastel-green p-4 rounded-2xl rounded-tl-none border max-w-[80%] text-left">
                                Great question! You can upload your logo and choose custom colors in the "Branding" tab of your dashboard.
                            </div>
                        </div>
                    </div>

                    {/* Floating UI Badges */}
                    <div className="absolute -top-4 -right-4 bg-white border p-3 rounded-xl rotate-6 shadow-md hidden md:block">
                        <div className="flex items-center gap-2 font-bold text-sm">
                            <ShieldCheck size={18} className="text-green-600" />
                            RAG Powered
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-pastel-yellow border p-3 rounded-xl -rotate-6 shadow-md hidden md:block">
                        <div className="flex items-center gap-2 font-bold text-sm">
                            <MessageSquare size={18} />
                            Instant Response
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
