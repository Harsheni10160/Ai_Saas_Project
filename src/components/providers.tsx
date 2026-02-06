"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import CreateWorkspaceModal from "./create-workspace-modal";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <TooltipProvider>
                {children}
                <CreateWorkspaceModal />
                <Toaster position="top-right" richColors closeButton />
            </TooltipProvider>
        </SessionProvider>
    );
}
