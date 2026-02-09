"use client";

import { Bell, Search, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Topbar() {
    const { data: session } = useSession();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [workspace, setWorkspace] = useState<any>(null);

    useEffect(() => {
        const fetchActiveWorkspace = async () => {
            try {
                const res = await fetch("/api/workspaces/active");
                if (res.ok) {
                    const data = await res.json();
                    setWorkspace(data);
                }
            } catch (error) {
                console.error("Failed to load workspace in topbar", error);
            }
        };
        fetchActiveWorkspace();
    }, []);

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <header className="h-20 flex items-center justify-between px-8 bg-background border-b-2 border-black">
            <div className="relative w-96 max-w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                    type="text"
                    placeholder="Search queries, docs, agents..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary border border-transparent focus:border-black focus:bg-background outline-none transition-all"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-secondary transition-colors relative">
                    <Bell size={20} />
                    <div className="absolute top-2 right-2 w-2 h-2 bg-pastel-green rounded-full border" />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l-2 border-black/5 relative">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold">{session?.user?.name || "User"}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">{workspace?.plan || "Free"} Plan</div>
                    </div>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="w-10 h-10 rounded-full bg-pastel-yellow border flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
                    >
                        <User size={20} />
                    </button>

                    {/* User Menu Dropdown */}
                    <AnimatePresence>
                        {showUserMenu && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />

                                {/* Dropdown Menu */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-14 w-56 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50"
                                >
                                    <div className="p-4 border-b-2 border-black bg-secondary/20">
                                        <p className="font-bold text-sm">{session?.user?.name || "User"}</p>
                                        <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                                    </div>

                                    <div className="p-2">
                                        <Link
                                            href="/dashboard/settings"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary transition-colors font-medium text-sm"
                                        >
                                            <Settings size={16} />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors font-medium text-sm"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
