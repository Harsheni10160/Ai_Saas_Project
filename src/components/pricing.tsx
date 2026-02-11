"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for testing and small projects.",
        features: [
            "1 Workspace",
            "50 AI Responses/mo",
            "Upload upto 5 Documents",
            "Basic Analytics",
            "Email Support",
        ],
        cta: "Get Started",
        variant: "outline",
    },
    {
        name: "Pro",
        price: "$49",
        period: "/month",
        description: "For growing businesses and startups.",
        features: [
            "Unlimited Workspaces",
            "5,000 AI Responses/mo",
            "Unlimited Documents",
            "Advanced Analytics",
            "Remove Branding",
            "Priority Support",
        ],
        cta: "Start Free Trial",
        variant: "default",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations with specific needs.",
        features: [
            "Unlimited Everything",
            "Custom LLM Training",
            "SSO / SAML",
            "Dedicated Success Manager",
            "SLA Guarantees",
            "On-premise Deployment",
        ],
        cta: "Contact Sales",
        variant: "outline",
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24 px-4 bg-zinc-50 border-t border-zinc-200">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900">
                        Simple, transparent pricing.
                    </h2>
                    <p className="text-lg text-zinc-600">
                        Start for free, upgrade as you grow. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative rounded-3xl p-8 transition-all hover:-translate-y-1 ${plan.popular
                                    ? "bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 ring-1 ring-zinc-900"
                                    : "bg-white text-zinc-900 border border-zinc-200 shadow-sm hover:shadow-md"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-lg font-medium mb-2 ${plan.popular ? "text-zinc-300" : "text-zinc-500"}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && <span className={`text-sm ${plan.popular ? "text-zinc-400" : "text-zinc-500"}`}>{plan.period}</span>}
                                </div>
                                <p className={`mt-4 text-sm ${plan.popular ? "text-zinc-400" : "text-zinc-600"}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm">
                                        <div className={`p-1 rounded-full ${plan.popular ? "bg-zinc-800" : "bg-zinc-100"}`}>
                                            <Check size={12} className={plan.popular ? "text-white" : "text-zinc-900"} />
                                        </div>
                                        <span className={plan.popular ? "text-zinc-200" : "text-zinc-700"}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.variant === "default" ? "secondary" : "outline"}
                                className={`w-full h-11 rounded-full font-semibold ${plan.popular
                                        ? "bg-white text-zinc-900 hover:bg-zinc-100 border-transparent"
                                        : "bg-transparent border-zinc-200 text-zinc-900 hover:bg-zinc-50"
                                    }`}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
