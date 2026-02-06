"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <header className="sticky top-4 z-50 flex justify-center px-4">
            <nav className="flex w-full max-w-6xl items-center justify-between rounded-full border bg-background/80 px-6 py-3 backdrop-blur-md shadow-lg">
                <Link href="/" className="text-xl font-serif font-bold tracking-tight">
                    AI<span className="text-pastel-green">Support</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="#features" className="hover:text-pastel-green transition-colors">Features</Link>
                    <Link href="#how-it-works" className="hover:text-pastel-green transition-colors">How it Works</Link>
                    <Link href="#pricing" className="hover:text-pastel-green transition-colors">Pricing</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:underline">Log in</Link>
                    <Link href="/signup">
                        <Button variant="default" className="hi-pill-btn h-auto py-2 text-sm">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    );
}
