"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Palette, Shield, User, LogOut, Trash2 } from "lucide-react";
import DeleteWorkspaceModal from "@/components/delete-workspace-modal";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        fetchWorkspace();
    }, []);

    const fetchWorkspace = async () => {
        try {
            const res = await fetch("/api/workspaces/active");
            if (!res.ok) throw new Error("Failed to load");
            const data = await res.json();
            setWorkspace(data);
        } catch (error) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("agentName") as string;

        try {
            const res = await fetch("/api/workspaces/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId: workspace.id,
                    chatbotName: name,
                }),
            });

            if (!res.ok) throw new Error("Save failed");

            toast.success("Profile updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
            fetchWorkspace();
        } catch (error) {
            toast.error("Failed to save changes");
        }
    };

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Settings</h1>
                <p className="text-zinc-500 mt-1">Manage your workspace preferences and configurations.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="danger">Danger Zone</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workspace Identity</CardTitle>
                            <CardDescription>
                                Set the name and identity of your AI agent.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSaveProfile}>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="ws-name">Workspace Name</Label>
                                    <Input id="ws-name" name="workspaceName" defaultValue={workspace?.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="agent-name">Agent Name</Label>
                                    <Input id="agent-name" name="agentName" defaultValue={workspace?.chatbotName || "Support Agent"} />
                                </div>
                                <Button type="submit" className="bg-zinc-900 text-white">Save Changes</Button>
                            </CardContent>
                        </form>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Support Email</CardTitle>
                            <CardDescription>
                                The email address used for notifications and support.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue={workspace?.email || ""} disabled />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="branding" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>
                                Customize how your agent looks to your customers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                                    <Palette className="text-zinc-500" />
                                </div>
                                <div className="flex-1">
                                    <Label className="mb-2 block">Brand Color</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="color" className="w-12 h-12 p-1 rounded-md" defaultValue={workspace?.primaryColor || "#4F46E5"} />
                                        <span className="text-sm text-zinc-500">Selected color will be applied to chat bubbles and buttons.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-100 flex justify-center">
                                {/* Preview Mockup */}
                                <div className="w-64 bg-white rounded-xl shadow-lg overflow-hidden border border-zinc-200">
                                    <div className="bg-indigo-600 p-3 flex items-center gap-2 text-white text-xs font-medium">
                                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                                        Support Agent
                                    </div>
                                    <div className="p-4 space-y-3 h-40 bg-zinc-50">
                                        <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-xs max-w-[80%] border border-zinc-100">
                                            Hello! How can I help you today?
                                        </div>
                                        <div className="bg-indigo-600 text-white p-2 rounded-lg rounded-tr-none shadow-sm text-xs max-w-[80%] self-end ml-auto">
                                            I need reset my password.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button className="bg-zinc-900 text-white">Update Branding</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="danger" className="space-y-6">
                    <Card className="border-red-100 bg-red-50/50">
                        <CardHeader>
                            <CardTitle className="text-red-900">Danger Zone</CardTitle>
                            <CardDescription className="text-red-700">
                                Irreversible actions. Proceed with caution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-white">
                                <div>
                                    <p className="font-medium text-zinc-900">Sign Out</p>
                                    <p className="text-sm text-zinc-500">End your current session.</p>
                                </div>
                                <Button variant="outline" onClick={handleLogout}>Log Out</Button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-white">
                                <div>
                                    <p className="font-medium text-red-600">Delete Workspace</p>
                                    <p className="text-sm text-zinc-500">Permanently delete this workspace and all data.</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteModal(true)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Delete Workspace
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <DeleteWorkspaceModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                workspaceId={workspace?.id}
                workspaceName={workspace?.name}
                onDeleted={() => {
                    router.push("/dashboard");
                    router.refresh();
                }}
            />
        </div>
    );
}
