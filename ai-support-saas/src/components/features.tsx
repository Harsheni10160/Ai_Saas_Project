"use client";

import { BarChart3, Globe, Palette, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        title: "Advanced Analytics",
        description: "Track sentiment, identify common pain points, and monitor agent performance with real-time dashboards.",
        icon: <BarChart3 className="w-12 h-12" />,
        color: "bg-pastel-purple",
        tags: ["Insights", "Real-time"],
    },
    {
        title: "Multi-language Support",
        description: "Support your customers in over 50+ languages automatically. No translation needed.",
        icon: <Globe className="w-12 h-12" />,
        color: "bg-white",
        tags: ["Global", "Native"],
    },
    {
        title: "Custom Branding",
        description: "Customize the chat widget to match your brand identity—colors, logo, and personality.",
        icon: <Palette className="w-12 h-12" />,
        color: "bg-pastel-green",
        tags: ["Design", "Pro"],
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 px-4 bg-secondary/30">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl mb-4">Small Business, <br />Big Experience.</h2>
                        <p className="text-xl text-muted-foreground">Everything you need to scale your customer success without scaling your team.</p>
                    </div>
                    <button className="hi-pill-btn bg-black text-white px-8 py-3 w-fit">
                        View All Features
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className={`hi-card flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 md:p-12 ${feature.color}`}
                        >
                            <div className="flex-1 order-2 md:order-1">
                                <div className="flex gap-2 mb-6">
                                    {feature.tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 rounded-full border border-black/10 text-xs font-bold uppercase tracking-wider bg-white/50">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-3xl md:text-4xl mb-6">{feature.title}</h3>
                                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                    {feature.description}
                                </p>
                                <button className="flex items-center gap-2 font-bold hover:gap-3 transition-all">
                                    Learn more about {feature.title.split(' ')[0]} <ChevronRight size={20} />
                                </button>
                            </div>
                            <div className="w-full md:w-1/3 aspect-square border rounded-2xl bg-white flex items-center justify-center shadow-xl order-1 md:order-2">
                                {feature.icon}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
