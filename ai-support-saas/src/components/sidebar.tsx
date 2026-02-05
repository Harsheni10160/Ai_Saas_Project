"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    BarChart3,
    MessageSquare,
    Settings,
    Users,
    FileText,
    LayoutDashboard,
    LogOut,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: FileText, label: "Documents", href: "/dashboard/documents" },
    { icon: MessageSquare, label: "Chat History", href: "/dashboard/history" },
    { icon: Users, label: "Team", href: "/dashboard/team" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <aside className="w-72 h-screen flex flex-col bg-background border-r-2 border-black p-6">
            <div className="flex items-center gap-2 mb-10 px-2">
                <div className="w-8 h-8 rounded-lg bg-pastel-green border flex items-center justify-center">
                    <Sparkles size={18} className="fill-black" />
                </div>
                <span className="text-xl font-serif font-bold tracking-tight">AI Agent</span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all border border-transparent",
                                isActive
                                    ? "bg-pastel-green border-black translate-x-1 shadow-md"
                                    : "hover:bg-secondary hover:border-black/5"
                            )}
                        >
                            <item.icon size={20} className={cn(isActive ? "text-black" : "text-muted-foreground")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t-2 border-black/5">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
