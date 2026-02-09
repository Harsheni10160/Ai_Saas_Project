import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

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
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="hi-border transition-all focus:ring-2 focus:ring-pastel-green/20"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="hi-border transition-all focus:ring-2 focus:ring-pastel-green/20"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="hi-border transition-all focus:ring-2 focus:ring-pastel-green/20"
                />
                <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                </p>
            </div>

            {!workspaceId && (
                <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
                    <Input
                        id="companyName"
                        type="text"
                        placeholder="Your Company"
                        value={formData.companyName}
                        onChange={(e) =>
                            setFormData({ ...formData, companyName: e.target.value })
                        }
                        required
                        className="hi-border transition-all focus:ring-2 focus:ring-pastel-green/20"
                    />
                </div>
            )}

            <Button
                type="submit"
                disabled={loading}
                className="hi-pill-btn w-full h-11 text-base font-medium transition-all hover:shadow-lg disabled:opacity-50"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Account...
                    </span>
                ) : (
                    "Create Account"
                )}
            </Button>
        </form>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-40 w-80 h-80 bg-pastel-green/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 -right-40 w-80 h-80 bg-pastel-green/5 rounded-full blur-3xl"></div>
            </div>

            <Card className="hi-card w-full max-w-md p-8 relative z-10 shadow-2xl">
                <div className="mb-2">
                    <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                    Start building your AI support agent today
                </p>

                <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-pastel-green border-t-transparent rounded-full animate-spin"></div></div>}>
                    <SignupForm />
                </Suspense>

                <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-sm text-center text-muted-foreground">
                        Already have an account?{" "}
                        <a href="/login" className="font-medium text-pastel-green hover:text-pastel-green/80 transition-colors underline">
                            Sign in
                        </a>
                    </p>
                </div>
            </Card>
        </div>
    );
}
