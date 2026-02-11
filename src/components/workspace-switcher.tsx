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

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "Failed to load workspaces" }));
                console.error("Failed to fetch workspaces:", errorData.error);
                return;
            }

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

    if (loading) return <div className="h-10 w-full bg-zinc-100 animate-pulse rounded-lg border border-zinc-200" />;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center flex-shrink-0">
                        <Building2 size={12} className="text-white" />
                    </div>
                    <span className="font-semibold text-sm text-zinc-900 truncate">{activeWorkspace?.name || "Select Workspace"}</span>
                </div>
                <ChevronDown size={14} className="text-zinc-400 flex-shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-1 rounded-xl border border-zinc-200 shadow-lg">
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Your Workspaces
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-100" />
                {workspaces.map((workspace) => (
                    <DropdownMenuItem
                        key={workspace.id}
                        onClick={() => handleSwitch(workspace)}
                        className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors",
                            activeWorkspace?.id === workspace.id ? "bg-zinc-50 text-zinc-900" : "hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900"
                        )}
                    >
                        <span className="font-medium text-sm truncate">{workspace.name}</span>
                        {activeWorkspace?.id === workspace.id && <Check size={14} className="text-indigo-600" />}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-zinc-100" />
                <DropdownMenuItem
                    onSelect={(e: Event) => {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent('open-create-workspace-modal'));
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-indigo-600 hover:bg-indigo-50 font-semibold text-sm"
                >
                    <Plus size={14} />
                    <span>New Workspace</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
