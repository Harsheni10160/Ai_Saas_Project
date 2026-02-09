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
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif font-bold">Create Workspace</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Workspaces help you keep your projects, documents, and teams separate.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onCreate}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="font-bold">Workspace Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Acme Corp, Marketing Team"
                                className="rounded-xl border-2 border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-pastel-green"
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="rounded-xl border-2 border-black"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="rounded-xl border-2 border-black bg-pastel-green text-black hover:bg-pastel-green/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
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
