"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle2, AlertCircle, Building2, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-zinc-200 p-8 text-center relative z-10"
            >
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-zinc-50">
                    {loading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                    ) : joined ? (
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : error ? (
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    ) : (
                        <UserPlus className="w-8 h-8 text-zinc-600" />
                    )}
                </div>

                <h1 className="text-2xl font-bold mb-2 text-zinc-900">
                    {joined ? "Welcome Aboard!" : "Workspace Invite"}
                </h1>

                <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                    {loading && "Verifying your invitation and joining the team..."}
                    {joined && "You've successfully joined the workspace. Redirecting you to the dashboard..."}
                    {error && "We couldn't verify this invitation link. Please check with your administrator."}
                </p>

                {error && (
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-600">
                            {error}
                        </div>
                        <Link href="/dashboard">
                            <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800">
                                Return to Dashboard
                            </Button>
                        </Link>
                    </div>
                )}

                {joined && (
                    <Button
                        onClick={() => router.push("/dashboard")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                    >
                        Go to Dashboard Now
                    </Button>
                )}
            </motion.div>
        </div>
    );
}

export default function InvitePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
                <Loader2 className="w-10 h-10 animate-spin text-zinc-300" />
            </div>
        }>
            <InviteContent />
        </Suspense>
    );
}
