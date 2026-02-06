"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus, Check, Building2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Workspace {
    id: string;
    name: string;
}

export default function WorkspaceSwitcher() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const res = await fetch("/api/workspaces");
            if (res.ok) {
                const data = await res.json();
                setWorkspaces(data);

                // Try to get active workspace from cookie
                const activeId = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("active_workspace_id="))
                    ?.split("=")[1];

                if (activeId) {
                    const active = data.find((w: Workspace) => w.id === activeId);
                    if (active) setActiveWorkspace(active);
                    else if (data.length > 0) setActiveWorkspace(data[0]);
                } else if (data.length > 0) {
                    setActiveWorkspace(data[0]);
                    // Set default cookie if not exists
                    document.cookie = `active_workspace_id=${data[0].id}; path=/; max-age=2592000; samesite=lax`;
                }
            }
        } catch (error) {
            console.error("Failed to fetch workspaces", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwitch = (workspace: Workspace) => {
        setActiveWorkspace(workspace);
        document.cookie = `active_workspace_id=${workspace.id}; path=/; max-age=2592000; samesite=lax`;
        router.refresh(); // Refresh to update server components with new cookie
    };

    if (loading) return <div className="h-12 w-full bg-secondary/50 animate-pulse rounded-2xl border-2 border-black/5" />;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded bg-pastel-green border border-black flex items-center justify-center flex-shrink-0">
                        <Building2 size={14} />
                    </div>
                    <span className="font-bold truncate">{activeWorkspace?.name || "Select Workspace"}</span>
                </div>
                <ChevronDown size={16} className="text-black/60 flex-shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Workspaces
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black/5" />
                {workspaces.map((workspace) => (
                    <DropdownMenuItem
                        key={workspace.id}
                        onClick={() => handleSwitch(workspace)}
                        className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors",
                            activeWorkspace?.id === workspace.id ? "bg-pastel-green/20" : "hover:bg-secondary"
                        )}
                    >
                        <div className="flex items-center gap-2 truncate">
                            <span className="font-medium truncate">{workspace.name}</span>
                        </div>
                        {activeWorkspace?.id === workspace.id && <Check size={16} className="text-pastel-green" />}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-black/5" />
                <DropdownMenuItem
                    onSelect={(e: Event) => {
                        e.preventDefault();
                        // Signal to parent to show creation modal
                        window.dispatchEvent(new CustomEvent('open-create-workspace-modal'));
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-pastel-green/10 text-pastel-green"
                >
                    <Plus size={16} />
                    <span className="font-bold">Create Workspace</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
