"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateWorkspaceModal() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleOpen = () => setOpen(true);
        window.addEventListener('open-create-workspace-modal', handleOpen);
        return () => window.removeEventListener('open-create-workspace-modal', handleOpen);
    }, []);

    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/workspaces", {
                method: "POST",
                body: JSON.stringify({ name }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "Failed to create workspace" }));
                toast.error(errorData.error || "Failed to create workspace");
                return;
            }

            const workspace = await res.json();
            toast.success(`Workspace "${workspace.name}" created!`);
            // Set as active
            document.cookie = `active_workspace_id=${workspace.id}; path=/; max-age=2592000; samesite=lax`;
            setOpen(false);
            setName("");
            router.refresh();
        } catch (error) {
            console.error("Create workspace error:", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-xl border border-zinc-200 shadow-xl overflow-hidden p-0">
                <div className="bg-zinc-50/50 p-6 border-b border-zinc-100">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900">New Workspace</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-sm">
                            Create a dedicated space for your team and knowledge base.
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <form onSubmit={onCreate} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-zinc-700">Workspace Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Acme Corp Support"
                                className="h-11 rounded-lg border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/10 transition-all text-sm"
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="rounded-lg text-zinc-500 hover:text-zinc-900"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 px-6 font-semibold"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Workspace"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
