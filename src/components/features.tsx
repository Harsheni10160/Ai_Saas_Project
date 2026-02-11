"use client";

import { BarChart3, Globe, Palette, ChevronRight, Brain, FileType, Zap, Lock, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Semantic Understanding",
        description: "Our RAG engine doesn't just match keywords. It understands intent and context using vector embeddings, delivering human-quality accuracy.",
        icon: Brain,
        className: "md:col-span-2 md:row-span-2",
        visual: (
            <div className="absolute right-4 bottom-4 w-1/2 h-1/2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-100/50 backdrop-blur-sm p-4 flex flex-col gap-2">
                <div className="h-2 w-3/4 bg-indigo-200/50 rounded-full" />
                <div className="h-2 w-1/2 bg-indigo-200/30 rounded-full" />
                <div className="mt-auto flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-500/20" />
                    <div className="h-6 w-full bg-indigo-500/10 rounded-md" />
                </div>
            </div>
        )
    },
    {
        title: "Multi-Format Ingestion",
        description: "PDFs, Word Docs, Notion, or plain text. We parse and structure it all automatically.",
        icon: FileType,
        className: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Global Reach",
        description: "Auto-detect language and reply in the customer's native tongue. 50+ languages supported.",
        icon: Globe,
        className: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Deep Analytics",
        description: "Track sentiment, resolution rates, and unanswered queries to improve your knowledge base.",
        icon: BarChart3,
        className: "md:col-span-1 md:row-span-1",
    },
    {
        title: "On-Brand Design",
        description: "Custom colors, fonts, and avatars. Make the widget feel like a native part of your product.",
        icon: Palette,
        className: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Developer API",
        description: "Headless mode available. Build your own UI on top of our RAG infrastructure.",
        icon: Code2,
        className: "md:col-span-1 md:row-span-1",
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900">
                        Enterprise power, <br />
                        <span className="text-zinc-400">consumer simplicity.</span>
                    </h2>
                    <p className="text-lg text-zinc-600 max-w-2xl">
                        Everything you need to scale support without scaling headcount.
                        Built for speed, accuracy, and reliability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto gap-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50/50 p-8 transition-all hover:bg-zinc-50 hover:shadow-lg hover:shadow-zinc-900/5",
                                feature.className
                            )}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 text-zinc-900" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-zinc-900">{feature.title}</h3>
                                <p className="text-zinc-600 leading-relaxed max-w-sm">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-zinc-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            {feature.visual}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
