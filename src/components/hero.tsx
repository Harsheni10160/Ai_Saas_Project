"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, ChevronRight, MessageSquareText, FileText, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32 bg-white">
            {/* Abstract Background Mesh */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-zinc-100 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-zinc-50 rounded-full blur-3xl opacity-40" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/50 px-3 py-1 text-sm text-zinc-600 backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                        <span className="font-medium">New: GPT-4o Integration</span>
                        <ChevronRight className="h-3 w-3 text-zinc-400" />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-zinc-900 md:text-7xl lg:text-[5rem] lg:leading-[1.1]"
                >
                    Instant AI Support, <br />
                    <span className="text-zinc-500">Trained on Your Truth.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 md:text-xl"
                >
                    Transform your documentation into an intelligent 24/7 support agent.
                    Reduce ticket volume by 80% without losing the human touch.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <Link href="/signup">
                        <Button className="h-12 rounded-full bg-zinc-900 px-8 text-base font-semibold text-white hover:bg-zinc-800 shadow-xl shadow-zinc-900/10 transition-all hover:scale-105 active:scale-95">
                            Start Building Free
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="outline" className="h-12 rounded-full border-zinc-200 px-8 text-base font-medium text-zinc-900 hover:bg-zinc-50">
                        View Demo
                    </Button>
                </motion.div>

                {/* Dashboard Preview / Visual Anchor */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.2 }}
                    className="mt-20 relative mx-auto max-w-5xl"
                >
                    <div className="relative rounded-xl border border-zinc-200 bg-white/50 p-2 shadow-2xl backdrop-blur-xl lg:rounded-2xl lg:p-3">
                        <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-50 border border-zinc-100 relative shadow-inner">
                            {/* Conceptual UI: Chat + Sidebar */}
                            <div className="absolute inset-0 flex">
                                {/* Sidebar */}
                                <div className="w-64 border-r border-zinc-200 bg-white p-4 hidden md:block">
                                    <div className="h-4 w-1/2 rounded bg-zinc-100 mb-6" />
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50">
                                                <div className="h-4 w-4 rounded bg-zinc-200" />
                                                <div className="h-3 w-3/4 rounded bg-zinc-200" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Main Chat Area */}
                                <div className="flex-1 p-6 md:p-8 flex flex-col">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                                <Bot className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div className="space-y-2 max-w-[80%]">
                                                <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-zinc-100 shadow-sm text-sm leading-relaxed text-zinc-700">
                                                    Based on your knowledge base, the API rate limit for the free tier is 1,000 requests per minute. You can upgrade to Pro for higher limits.
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="px-2 py-1 rounded-md bg-zinc-100 text-[10px] font-medium text-zinc-500 border border-zinc-200 flex items-center gap-1">
                                                        <FileText size={10} /> docs/api-limits.pdf
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 flex-row-reverse">
                                            <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-zinc-300" />
                                            </div>
                                            <div className="p-4 rounded-2xl rounded-tr-none bg-zinc-900 text-white shadow-md text-sm leading-relaxed">
                                                Is there a python SDK available?
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                                <Bot className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div className="space-y-2 max-w-[80%]">
                                                <div className="flex gap-2 items-center text-zinc-400 text-xs mb-1">
                                                    <Sparkles size={12} /> Thinking...
                                                </div>
                                                <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-zinc-100 shadow-sm">
                                                    <div className="h-2 w-3/4 bg-zinc-100 rounded animate-pulse mb-2" />
                                                    <div className="h-2 w-1/2 bg-zinc-100 rounded animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input Mock */}
                                    <div className="mt-6 relative">
                                        <div className="h-14 w-full rounded-xl border border-zinc-200 bg-white shadow-sm flex items-center px-4 justify-between">
                                            <div className="h-2 w-1/3 bg-zinc-100 rounded" />
                                            <div className="h-8 w-8 rounded-lg bg-zinc-100" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -right-12 top-1/2 -translate-y-1/2 p-4 bg-white rounded-xl shadow-xl border border-zinc-100 hidden lg:block animate-float">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <ShieldCheck className="text-green-600 h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-zinc-900">Enterprise Ready</div>
                                <div className="text-xs text-zinc-500">SOC2 Compliant</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
