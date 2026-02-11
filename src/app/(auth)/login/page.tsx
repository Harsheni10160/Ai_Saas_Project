"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Command } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error("Invalid credentials");
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding & Testimonial */}
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
                            &ldquo;Docxbot has completely transformed how we handle customer support. The RAG accuracy is unmatched.&rdquo;
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-zinc-700" />
                            <div>
                                <div className="font-bold">Sofia Davis</div>
                                <div className="text-sm text-zinc-400">Head of CX, Acme Inc.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex gap-4 text-sm text-zinc-500">
                    <span>© 2026 Docxbot Inc.</span>
                    <span>Privacy Policy</span>
                    <span>Terms</span>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex items-center justify-center p-8 bg-zinc-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm space-y-8"
                >
                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Welcome back</h1>
                        <p className="text-zinc-500">Enter your email to sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={loading}
                                className="h-11 bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                disabled={loading}
                                className="h-11 bg-white"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white"
                        >
                            {loading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                            Sign in with Email
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-50 px-2 text-zinc-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" type="button" disabled={loading} className="h-11 bg-white">
                            Github
                        </Button>
                        <Button variant="outline" type="button" disabled={loading} className="h-11 bg-white">
                            Google
                        </Button>
                    </div>

                    <p className="px-8 text-center text-sm text-zinc-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="underline underline-offset-4 hover:text-zinc-900 font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
