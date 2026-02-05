import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                <Topbar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-secondary/20">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
