"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, FileText, Loader2, Trash2, CheckCircle2, AlertCircle, File, Search } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        fetchActiveWorkspace();
    }, []);

    const fetchActiveWorkspace = async () => {
        try {
            const res = await fetch("/api/workspaces/active");
            if (!res.ok) throw new Error("Failed to load active workspace");
            const data = await res.json();
            if (data.id) {
                setActiveWorkspaceId(data.id);
                fetchDocuments(data.id);
            }
        } catch (error) {
            toast.error("Failed to fetch active workspace");
            setIsLoading(false);
        }
    };

    const fetchDocuments = async (workspaceId: string) => {
        try {
            const res = await fetch(`/api/documents?workspaceId=${workspaceId}`);
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error("Failed to fetch documents");
        } finally {
            setIsLoading(false);
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file || !activeWorkspaceId) return;

        // Optimistic UI
        const tempId = `temp-${Date.now()}`;
        const tempDoc = {
            id: tempId,
            name: file.name,
            size: file.size,
            status: "uploading",
            createdAt: new Date().toISOString(),
            workspaceId: activeWorkspaceId
        };

        setDocuments((prev) => [tempDoc, ...prev]);
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("workspaceId", activeWorkspaceId);

        try {
            const res = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const doc = await res.json();
            setDocuments((prev) => prev.map(d => d.id === tempId ? doc : d));
            toast.success("Document uploaded successfully");
            queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });

            // Poll for status
            const interval = setInterval(async () => {
                const checkRes = await fetch(`/api/documents?workspaceId=${activeWorkspaceId}`);
                if (checkRes.ok) {
                    const checkData = await checkRes.json();
                    setDocuments(checkData);
                    const updatedDoc = checkData.find((d: any) => d.id === doc.id);
                    if (updatedDoc && updatedDoc.status !== "processing") {
                        clearInterval(interval);
                    }
                }
            }, 3000);

        } catch (error) {
            toast.error("Failed to upload document");
            setDocuments((prev) => prev.filter(d => d.id !== tempId));
        } finally {
            setUploading(false);
        }
    }, [activeWorkspaceId]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        // Optimistic Delete
        setDocuments(prev => prev.filter(d => d.id !== id));

        try {
            await fetch(`/api/documents/${id}`, { method: "DELETE" });
            toast.success("Document deleted");
            queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
        } catch (error) {
            toast.error("Failed to delete document");
            if (activeWorkspaceId) fetchDocuments(activeWorkspaceId);
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
        <div className="max-w-5xl mx-auto space-y-8 block">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Knowledge Base</h1>
                <p className="text-zinc-500 mt-1">Upload documents to train your AI agent.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Area */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Upload File</CardTitle>
                        <CardDescription>
                            Supported formats: PDF, DOCX, TXT
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            {...getRootProps()}
                            className={`
                                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                                ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"}
                                ${uploading ? "opacity-50 pointer-events-none" : ""}
                            `}
                        >
                            <input {...getInputProps()} />
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                            </div>
                            <p className="text-sm font-medium text-zinc-900 mb-1">
                                {isDragActive ? "Drop file here" : "Click to upload"}
                            </p>
                            <p className="text-xs text-zinc-500">
                                Max file size: 10MB
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Documents List */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center text-lg">
                            <span>Library</span>
                            <Badge variant="secondary" className="bg-zinc-100 text-zinc-600">
                                {documents.length} Files
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {/* Empty State */}
                            {!isLoading && documents.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FileText className="text-zinc-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-zinc-900">No documents yet</h3>
                                    <p className="text-xs text-zinc-500 mt-1">Upload your first file to get started.</p>
                                </div>
                            )}

                            <AnimatePresence>
                                {documents.map((doc) => (
                                    <motion.div
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0 text-zinc-500">
                                                <File size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm text-zinc-900 truncate">{doc.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                    <span>{(doc.size / 1024).toFixed(0)} KB</span>
                                                    <span>•</span>
                                                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {doc.status === "processing" && (
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-600 animate-pulse">
                                                    Processing
                                                </Badge>
                                            )}
                                            {doc.status === "completed" && (
                                                <Badge variant="secondary" className="bg-green-50 text-green-600">
                                                    Active
                                                </Badge>
                                            )}
                                            {doc.status === "failed" && (
                                                <Badge variant="secondary" className="bg-red-50 text-red-600">
                                                    Failed
                                                </Badge>
                                            )}

                                            <button
                                                onClick={() => handleDelete(doc.id, doc.name)}
                                                className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
