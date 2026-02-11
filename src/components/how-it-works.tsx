"use client";

import { FileText, BrainCircuit, Code, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
    {
        step: "01",
        title: "Connect Your Knowledge",
        description: "Upload PDFs, Notion pages, or website URLs. Our engine automatically parses, chunks, and vectorizes your data for optimal retrieval.",
        icon: FileText,
    },
    {
        step: "02",
        title: "Configure Logic",
        description: "Set custom instructions, tone of voice, and escalation rules. The AI learns your specific business context through RAG technology.",
        icon: BrainCircuit,
    },
    {
        step: "03",
        title: "Deploy Anywhere",
        description: "Paste a single script tag to your site or use our API. The widget adapts to your brand and handles inquiries instantly.",
        icon: Code,
    },
];

export function HowItWorks() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="how-it-works" className="py-24 bg-zinc-50 relative overflow-hidden" ref={ref}>
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900"
                    >
                        From Static Docs to <br />
                        <span className="text-indigo-600">Active Intelligence</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-zinc-600"
                    >
                        Three simple steps to automate your support workflow without writing a single line of training code.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-zinc-200 z-0" />

                    {steps.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className="w-24 h-24 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 relative">
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold ring-4 ring-zinc-50">
                                    {item.step}
                                </div>
                                <item.icon size={32} className="text-zinc-700 group-hover:text-indigo-600 transition-colors" />
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-zinc-900">{item.title}</h3>
                            <p className="text-zinc-600 leading-relaxed max-w-sm">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
        </section>
    );
}
