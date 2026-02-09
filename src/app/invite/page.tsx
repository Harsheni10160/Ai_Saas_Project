"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle2, AlertCircle, Users } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

function InviteContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const workspaceId = searchParams.get("workspace");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            const callbackUrl = encodeURIComponent(window.location.href);
            router.push(`/login?callbackUrl=${callbackUrl}`);
            return;
        }

        if (status === "authenticated" && workspaceId) {
            joinWorkspace();
        } else if (status === "authenticated" && !workspaceId) {
            setError("Invalid invite link: Workspace ID is missing.");
            setLoading(false);
        }
    }, [status, workspaceId, router]);

    const joinWorkspace = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/workspaces/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workspaceId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to join workspace");
            }

            setJoined(true);
            toast.success("Joined workspace successfully!");

            // Set active workspace cookie for consistency
            document.cookie = `active_workspace_id=${workspaceId}; path=/; max-age=2592000; samesite=lax`;

            // Auto redirect after a short delay
            setTimeout(() => {
                router.push(`/dashboard?workspace=${workspaceId}`);
            }, 2000);
        } catch (err: any) {
            console.error("Join workspace error:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full hi-card p-8 text-center"
            >
                <div className="w-16 h-16 bg-pastel-green hi-border rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users size={32} />
                </div>

                <h1 className="text-3xl font-serif font-bold mb-4">Workspace Invitation</h1>

                {loading ? (
                    <div className="space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-pastel-green mx-auto" />
                        <p className="text-muted-foreground italic">Joining the workspace...</p>
                    </div>
                ) : error ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-2 text-destructive font-bold">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Please ask your team owner for a new invitation link.
                        </p>
                        <Link href="/dashboard">
                            <button className="w-full hi-pill-btn h-12">
                                Go to Dashboard
                            </button>
                        </Link>
                    </div>
                ) : joined ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                            <CheckCircle2 size={24} />
                            <span className="text-xl">Welcome to the team!</span>
                        </div>
                        <p className="text-muted-foreground">
                            You have successfully joined the workspace. Redirecting you to your dashboard...
                        </p>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="w-full hi-pill-btn h-12"
                        >
                            Go to Dashboard Now
                        </button>
                    </div>
                ) : null}
            </motion.div>
        </div>
    );
}

export default function InvitePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full hi-card p-8 text-center flex flex-col items-center">
                    <Loader2 className="w-10 h-10 animate-spin text-pastel-green mb-4" />
                    <p className="text-muted-foreground italic">Loading invitation...</p>
                </div>
            </div>
        }>
            <InviteContent />
        </Suspense>
    );
}
