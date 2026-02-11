"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Users,
    Code2,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    MessageSquareText
} from "lucide-react";
import { cn } from "@/lib/utils";
import WorkspaceSwitcher from "./workspace-switcher";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: FileText, label: "Knowledge Base", href: "/dashboard/documents" },
    { icon: MessageSquare, label: "Chat", href: "/dashboard/chat" },
    { icon: MessageSquareText, label: "Conversations", href: "/dashboard/history" },
    { icon: Users, label: "Team", href: "/dashboard/team" },
    { icon: Code2, label: "Integration", href: "/dashboard/embed" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-zinc-900 text-zinc-400">
            {/* Logo Area */}
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                        <span className="font-bold">V</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight">Docxbot</span>
                </Link>
            </div>

            {/* Workspace Switcher */}
            <div className="px-4 mb-6">
                <WorkspaceSwitcher />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all group relative",
                                isActive
                                    ? "bg-zinc-800 text-white"
                                    : "hover:bg-zinc-800/50 hover:text-white"
                            )}
                        >
                            <item.icon
                                size={18}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
                                )}
                            />
                            {item.label}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-zinc-800">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800/50 hover:text-white transition-colors text-zinc-500"
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 h-screen flex-col border-r border-zinc-800 shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Header Trigger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 z-50">
                <Link href="/dashboard" className="flex items-center gap-2 text-white">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                        <span className="font-bold">V</span>
                    </div>
                    <span className="font-bold">Docxbot</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Backdrop & Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden bg-zinc-900 shadow-xl"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
