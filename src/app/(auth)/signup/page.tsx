"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { Command } from "lucide-react";

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const workspaceId = searchParams.get("workspace");

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        companyName: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    workspaceId: workspaceId || undefined,
                }),
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error);
            }

            toast.success("Account created! Redirecting to login...");
            const loginUrl = workspaceId ? `/login?callbackUrl=${encodeURIComponent(`/invite?workspace=${workspaceId}`)}` : "/login";
            router.push(loginUrl);
        } catch (error: any) {
            toast.error(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    disabled={loading}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-10 bg-white"
                />
            </div>
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    disabled={loading}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-10 bg-white"
                />
            </div>
            <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    placeholder="Create a password"
                    type="password"
                    disabled={loading}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-10 bg-white"
                />
            </div>
            {!workspaceId && (
                <div className="space-y-1">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                        id="companyName"
                        placeholder="Your Company Inc."
                        type="text"
                        disabled={loading}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="h-10 bg-white"
                    />
                </div>
            )}
            <Button
                disabled={loading}
                className="w-full h-10 mt-4 bg-zinc-900 hover:bg-zinc-800 text-white"
            >
                {loading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Create Account
            </Button>
        </form>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[120px] opacity-20" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                            <Command className="h-5 w-5 text-zinc-900" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Docxbot</span>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <blockquote className="text-2xl font-medium leading-relaxed text-zinc-200">
                            &ldquo;Deploying AI used to take months. With Docxbot, we were live in 30 minutes.&rdquo;
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-zinc-700" />
                            <div>
                                <div className="font-bold">Marcus Chen</div>
                                <div className="text-sm text-zinc-400">CTO, TechFlow</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex gap-4 text-sm text-zinc-500">
                    <span>© 2026 Docxbot Inc.</span>
                </div>
            </div>

            {/* Right: Signup Form */}
            <div className="flex items-center justify-center p-8 bg-zinc-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm space-y-6"
                >
                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Create an account</h1>
                        <p className="text-zinc-500">Enter your details to get started with Docxbot</p>
                    </div>

                    <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div></div>}>
                        <SignupForm />
                    </Suspense>

                    <p className="px-8 text-center text-sm text-zinc-500">
                        By clicking continue, you agree to our{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-zinc-900">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-zinc-900">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                    <p className="px-8 text-center text-sm text-zinc-500">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-zinc-900 font-medium">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
