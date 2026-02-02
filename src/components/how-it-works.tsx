"use client";

import { FileText, BrainCircuit, Code, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        step: "Step 01",
        title: "Upload Your Knowledge",
        description: "Drag and drop your PDFs, Docx, or Notion pages. Our AI parses and indexes everything instantly.",
        icon: <FileText size={40} className="mb-4" />,
        color: "bg-pastel-blue",
    },
    {
        step: "Step 02",
        title: "AI Learns & Adapts",
        description: "Your agent uses RAG (Retrieval Augmented Generation) to understand your specific business logic.",
        icon: <BrainCircuit size={40} className="mb-4" />,
        color: "bg-pastel-green",
    },
    {
        step: "Step 03",
        title: "Embed & Launch",
        description: "Paste a single line of code into your website and watch your AI handle customer queries 24/7.",
        icon: <Code size={40} className="mb-4" />,
        color: "bg-pastel-yellow",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-4 max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl mb-4">How it Works</h2>
                <p className="text-xl text-muted-foreground">Three simple steps to automate your support.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`hi-card p-8 ${item.color} flex flex-col relative group`}
                    >
                        <div className="text-xs font-bold uppercase tracking-widest mb-4 opacity-60">
                            {item.step}
                        </div>
                        {item.icon}
                        <h3 className="text-2xl mb-4">{item.title}</h3>
                        <p className="text-lg leading-relaxed mb-8">
                            {item.description}
                        </p>
                        <div className="mt-auto">
                            <div className="flex items-center gap-2 font-bold cursor-pointer hover:translate-x-1 transition-transform">
                                Read Documentation <ArrowRight size={18} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
