"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import CreateWorkspaceModal from "./create-workspace-modal";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <TooltipProvider>
                    {children}
                    <CreateWorkspaceModal />
                    <Toaster position="top-right" richColors closeButton />
                </TooltipProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}
