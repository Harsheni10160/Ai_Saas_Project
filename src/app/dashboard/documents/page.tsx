"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Loader2, Trash2, CheckCircle, XCircle, Sparkles, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const res = await fetch("/api/workspaces");
            const data = await res.json();
            if (data.length > 0) {
                setActiveWorkspaceId(data[0].id);
                fetchDocuments(data[0].id);
            }
        } catch (error) {
            toast.error("Failed to fetch workspaces");
        }
    };

    const fetchDocuments = async (workspaceId: string) => {
        try {
            const res = await fetch(`/api/documents?workspaceId=${workspaceId}`);
            const data = await res.json();
            setDocuments(data);
        } catch (error) {
            console.error("Failed to fetch documents");
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file || !activeWorkspaceId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("workspaceId", activeWorkspaceId);

        try {
            const res = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Upload failed with status ${res.status}`);
            }

            const doc = await res.json();
            setDocuments((prev) => [doc, ...prev]);
            toast.success("Document uploaded successfully!");

            // Refresh documents to get processing status updates
            const interval = setInterval(async () => {
                const checkRes = await fetch(`/api/documents?workspaceId=${activeWorkspaceId}`);
                const checkData = await checkRes.json();
                setDocuments(checkData);
                if (checkData.find((d: any) => d.id === doc.id && d.status !== "processing")) {
                    clearInterval(interval);
                }
            }, 3000);

        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to upload document";
            console.error("Upload error:", error);
            toast.error(message);
        } finally {
            setUploading(false);
        }
    }, [activeWorkspaceId]);

    const handleDelete = async () => {
        if (!deleteConfirm || !activeWorkspaceId) return;

        try {
            setDeleting(true);

            // Optimistic update - remove from UI immediately
            const documentToDelete = deleteConfirm;
            setDocuments(prev => prev.filter(d => d.id !== documentToDelete.id));
            setDeleteConfirm(null);

            const res = await fetch(`/api/documents/${documentToDelete.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete document");
            }

            toast.success(`"${documentToDelete.name}" deleted successfully`);
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete document");
            // Revert optimistic update on error
            if (activeWorkspaceId) {
                fetchDocuments(activeWorkspaceId);
            }
        } finally {
            setDeleting(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "text/plain": [".txt"],
        },
        maxFiles: 1,
    });

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-pastel-yellow" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Knowledge Base</span>
                    </div>
                    <h1 className="text-4xl font-serif font-bold">Documents</h1>
                    <p className="text-muted-foreground mt-2">
                        Feed your AI agent with documentation to make it smarter.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Upload Zone */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="sticky top-8"
                    >
                        <div
                            {...getRootProps()}
                            className={`hi-card p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group
                                ${isDragActive ? "bg-pastel-blue" : "bg-white hover:border-pastel-green hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"}
                                ${uploading ? "pointer-events-none opacity-60" : ""}
                            `}
                        >
                            <input {...getInputProps()} />

                            {/* Decorative background circle */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary rounded-full blur-3xl group-hover:bg-pastel-green/20 transition-colors" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-secondary hi-border rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    ) : (
                                        <Upload className={`w-8 h-8 ${isDragActive ? "text-black" : "text-muted-foreground"}`} />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-2">
                                    {isDragActive ? "Drop it!" : "Add Knowledge"}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    {uploading ? "Uploading and processing..." : "Drag & drop your files here or click to browse"}
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <span className="px-2 py-1 bg-secondary text-[10px] font-black uppercase tracking-tighter hi-border rounded-lg">PDF</span>
                                    <span className="px-2 py-1 bg-secondary text-[10px] font-black uppercase tracking-tighter hi-border rounded-lg">DOCX</span>
                                    <span className="px-2 py-1 bg-secondary text-[10px] font-black uppercase tracking-tighter hi-border rounded-lg">TXT</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 hi-card bg-pastel-yellow/10 border-dashed">
                            <p className="text-xs font-medium leading-relaxed">
                                <Sparkles className="w-3 h-3 inline mr-1 text-pastel-yellow" />
                                <b>Tip:</b> High-quality documentation leads to a better AI experience. Try to avoid tables and use clear headings.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Documents List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold">Your Library</h2>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{documents.length} Files</span>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {documents.map((doc, idx) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card className="hi-card p-6 group hover:translate-x-1 transition-transform">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="w-12 h-12 rounded-xl bg-secondary hi-border flex items-center justify-center flex-shrink-0 group-hover:bg-pastel-blue transition-colors">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="font-bold text-lg truncate">{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                                                        Added {new Date(doc.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {doc.status === "processing" && (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-secondary hi-border rounded-full text-xs font-bold">
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                        <span>Syncing</span>
                                                    </div>
                                                )}
                                                {doc.status === "completed" && (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-pastel-green/40 hi-border rounded-full text-xs font-bold text-emerald-800">
                                                        <CheckCircle className="w-3 h-3" />
                                                        <span>Ready</span>
                                                    </div>
                                                )}
                                                {doc.status === "failed" && (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-destructive/20 hi-border rounded-full text-xs font-bold text-destructive">
                                                        <XCircle className="w-3 h-3" />
                                                        <span>Sync Failed</span>
                                                    </div>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteConfirm({ id: doc.id, name: doc.name })}
                                                    className="rounded-full hover:bg-destructive/10 hover:text-destructive hover:scale-110 transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {documents.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hi-card p-20 bg-secondary/20 border-dashed text-center"
                            >
                                <div className="w-16 h-16 bg-white hi-border rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <p className="text-muted-foreground font-bold">Your knowledge base is empty.</p>
                                <p className="text-sm text-muted-foreground mt-1">Upload a file to get started.</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
                {deleteConfirm && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !deleting && setDeleteConfirm(null)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />

                        {/* Dialog */}
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-3xl border-2 border-black max-w-md w-full p-8 pointer-events-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-destructive/10 hi-border flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="w-6 h-6 text-destructive" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold mb-2">Delete Document?</h2>
                                        <p className="text-muted-foreground">
                                            Are you sure you want to delete <span className="font-bold">"{deleteConfirm.name}"</span>? This action cannot be undone.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        disabled={deleting}
                                        className="flex-1 px-6 py-3 border-2 border-black rounded-2xl font-bold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="flex-1 px-6 py-3 bg-destructive text-white border-2 border-black rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {deleting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
