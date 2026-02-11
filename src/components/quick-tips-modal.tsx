"use client";

import React from "react";
import { X, BookOpen, Zap, Code, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuickTipsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const tips = [
    {
        icon: BookOpen,
        title: "How AI Training Works",
        description: "Your AI agent uses vector embeddings to understand and search through your documents.",
        details: [
            "Documents are split into chunks and converted to embeddings",
            "When users ask questions, we find the most relevant chunks",
            "The AI uses these chunks as context to generate accurate answers"
        ],
        iconBg: "bg-blue-50 text-blue-600"
    },
    {
        icon: Zap,
        title: "Best Documents to Upload",
        description: "Upload clear, well-structured documents for the best results.",
        details: [
            "PDFs and Word documents work great",
            "FAQs and knowledge base articles are ideal",
            "Product documentation and guides",
            "Avoid scanned images without OCR"
        ],
        iconBg: "bg-green-50 text-green-600"
    },
    {
        icon: Code,
        title: "Widget Integration",
        description: "Add the chat widget to your website in minutes.",
        details: [
            "Copy the embed code from Settings",
            "Paste it before the closing </body> tag",
            "Customize colors and position in Settings",
            "Test it on localhost first"
        ],
        iconBg: "bg-amber-50 text-amber-600"
    },
    {
        icon: Sparkles,
        title: "Optimize Your Agent",
        description: "Tips to make your AI agent more effective.",
        details: [
            "Give your agent a clear persona and name",
            "Upload comprehensive documentation",
            "Review chat history to identify gaps",
            "Update documents regularly"
        ],
        iconBg: "bg-indigo-50 text-indigo-600"
    }
];

export default function QuickTipsModal({ isOpen, onClose }: QuickTipsModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-xl border border-zinc-200 max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto shadow-2xl"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                                        <Sparkles className="text-indigo-600" size={20} />
                                        Quick Setup Guide
                                    </h2>
                                    <p className="text-sm text-zinc-500 mt-1">
                                        Learn how to get the most out of your AI support agent.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-900"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {tips.map((tip, idx) => {
                                        const Icon = tip.icon;
                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="p-6 rounded-xl border border-zinc-100 bg-white hover:border-zinc-200 transition-all group"
                                            >
                                                <div className={`inline-block p-3 rounded-xl mb-4 ${tip.iconBg}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <h3 className="text-base font-bold text-zinc-900 mb-2">{tip.title}</h3>
                                                <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                                                    {tip.description}
                                                </p>
                                                <ul className="space-y-2">
                                                    {tip.details.map((detail, detailIdx) => (
                                                        <li key={detailIdx} className="flex items-start gap-2 text-sm text-zinc-600">
                                                            <div className="w-1 h-1 rounded-full bg-zinc-300 mt-2 flex-shrink-0" />
                                                            <span>{detail}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Footer CTA */}
                                <div className="mt-8 p-8 bg-zinc-900 text-white rounded-2xl text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold mb-2">Need More Help?</h3>
                                        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                                            Our documentation covers everything from advanced API usage to custom CSS configurations.
                                        </p>
                                        <div className="flex gap-4 justify-center">
                                            <button className="px-6 py-2 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-white/90 transition-all text-sm">
                                                View Documentation
                                            </button>
                                            <button className="px-6 py-2 border border-white/20 rounded-lg font-semibold hover:bg-white/5 transition-all text-sm">
                                                Join Community
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
