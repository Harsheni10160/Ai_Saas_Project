"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspaceId: string;
    workspaceName: string;
    onDeleted: () => void;
}

export default function DeleteWorkspaceModal({
    isOpen,
    onClose,
    workspaceId,
    workspaceName,
    onDeleted,
}: DeleteWorkspaceModalProps) {
    const [confirmName, setConfirmName] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirmName !== workspaceName) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/workspaces/${workspaceId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success(`Workspace "${workspaceName}" deleted successfully`);
                onDeleted();
                onClose();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to delete workspace");
            }
        } catch (error) {
            console.error("Delete workspace error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px] rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2 text-destructive">
                        <AlertTriangle className="w-6 h-6" />
                        <DialogTitle className="text-2xl font-serif font-bold">Delete Workspace</DialogTitle>
                    </div>
                    <DialogDescription className="text-muted-foreground pt-2">
                        This action is <span className="font-bold text-black uppercase tracking-tighter">permanent</span>.
                        All data associated with <span className="font-bold text-black">"{workspaceName}"</span>
                        including documents, conversations, and settings will be deleted.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="confirm-name" className="text-sm font-bold ml-1">
                            Type <span className="px-1.5 py-0.5 bg-secondary hi-border rounded-md font-mono">{workspaceName}</span> to confirm
                        </Label>
                        <Input
                            id="confirm-name"
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            placeholder="Type workspace name here"
                            className="h-12 rounded-2xl hi-border px-4 focus-visible:ring-destructive"
                            disabled={isDeleting}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-3 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-2xl hi-border font-bold h-12 flex-1"
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={confirmName !== workspaceName || isDeleting}
                        className="rounded-2xl bg-destructive text-white border-2 border-black h-12 flex-1 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:translate-0 disabled:shadow-none"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Workspace
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
