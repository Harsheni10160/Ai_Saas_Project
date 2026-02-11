"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function CTA() {
    return (
        <section className="py-24 px-4 bg-zinc-900 text-white overflow-hidden relative">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-6xl font-bold tracking-tight mb-8"
                >
                    Ready to transform your support?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-xl text-zinc-300 mb-12 max-w-2xl mx-auto"
                >
                    Join thousands of companies using our AI to delight customers and reduce support workload.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/signup">
                        <Button className="h-14 px-8 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 text-lg font-bold shadow-lg shadow-white/10">
                            Start Your Free Trial
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="#pricing">
                        <Button variant="outline" className="h-14 px-8 rounded-full border-zinc-700 text-white hover:bg-zinc-800 text-lg bg-transparent">
                            View Pricing
                        </Button>
                    </Link>
                </motion.div>

                <p className="mt-8 text-sm text-zinc-500">
                    No credit card required • 14-day free trial • Cancel anytime
                </p>
            </div>
        </section>
    );
}
