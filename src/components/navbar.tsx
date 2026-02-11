"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 20);
    });

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300",
                scrolled ? "py-4" : "py-6"
            )}
        >
            <nav
                className={cn(
                    "flex w-full max-w-6xl items-center justify-between px-6 py-3 transition-all duration-300",
                    scrolled
                        ? "bg-white/80 backdrop-blur-md border border-zinc-200/50 shadow-sm rounded-full mx-4"
                        : "bg-transparent border-transparent"
                )}
            >
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white"
                        >
                            <path
                                d="M12 2L2 7L12 12L22 7L12 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M2 17L12 22L22 17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M2 12L12 17L22 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-zinc-900">
                        Docxbot
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
                    <Link href="#features" className="hover:text-zinc-900 transition-colors">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="hover:text-zinc-900 transition-colors">
                        How it works
                    </Link>
                    <Link href="#pricing" className="hover:text-zinc-900 transition-colors">
                        Pricing
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                        Log in
                    </Link>
                    <Link href="/signup">
                        <Button className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 px-6 h-10 shadow-lg shadow-zinc-900/10">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    );
}
