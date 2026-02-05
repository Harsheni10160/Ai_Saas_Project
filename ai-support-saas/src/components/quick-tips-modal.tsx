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
        color: "pastel-green"
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
        color: "pastel-blue"
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
        color: "pastel-yellow"
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
        color: "pastel-purple"
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
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl border-2 border-black max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                        >
                            {/* Header */}
                            <div className="p-6 border-b-2 border-black bg-pastel-green flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-serif font-bold">✨ Quick Tips</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Everything you need to know to get started
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-black/10 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {tips.map((tip, idx) => {
                                        const Icon = tip.icon;
                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="hi-card p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
                                            >
                                                <div className={`inline-block p-3 bg-${tip.color} hi-border rounded-xl mb-4`}>
                                                    <Icon size={24} />
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {tip.description}
                                                </p>
                                                <ul className="space-y-2">
                                                    {tip.details.map((detail, detailIdx) => (
                                                        <li key={detailIdx} className="flex items-start gap-2 text-sm">
                                                            <span className="text-pastel-green font-bold mt-0.5">•</span>
                                                            <span>{detail}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Footer CTA */}
                                <div className="mt-8 p-6 bg-black text-white rounded-2xl text-center">
                                    <h3 className="text-xl font-bold mb-2">Need More Help?</h3>
                                    <p className="text-white/70 mb-4">
                                        Check out our full documentation or contact support
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <button className="px-6 py-2 bg-white text-black rounded-full font-bold hover:scale-105 transition-all">
                                            View Docs
                                        </button>
                                        <button className="px-6 py-2 border-2 border-white rounded-full font-bold hover:bg-white/10 transition-all">
                                            Contact Support
                                        </button>
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
