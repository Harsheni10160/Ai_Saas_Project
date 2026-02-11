"use client";

import { Bell, Search, ChevronDown, HelpCircle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

    const userInitials = session?.user?.name
        ? session.user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
        : "U";

    return (
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-zinc-200 sticky top-0 z-40">
            {/* Search Bar - Hidden on Mobile */}
            <div className="hidden md:flex items-center relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input
                    type="text"
                    placeholder="Search docs, conversations..."
                    className="w-full pl-9 pr-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm placeholder:text-zinc-400"
                />
            </div>

            {/* Mobile Spacer */}
            <div className="md:hidden flex-1" />

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                <button className="text-zinc-500 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-full">
                    <HelpCircle size={18} />
                </button>

                <button className="relative text-zinc-500 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-full">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full ring-2 ring-white" />
                </button>

                <div className="h-6 w-px bg-zinc-200 hidden sm:block" />

                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all"
                    >
                        <div className="text-right hidden sm:block mr-1">
                            <div className="text-xs font-semibold text-zinc-900 leading-none">{session?.user?.name || "User"}</div>
                            <div className="text-[10px] text-zinc-500 leading-none mt-1">{workspace?.plan || "Free"} Plan</div>
                        </div>
                        <Avatar className="h-8 w-8 border border-zinc-200">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs font-bold">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <ChevronDown size={14} className="text-zinc-400 mr-1" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl shadow-zinc-900/5 z-50 py-1"
                                >
                                    <div className="px-3 py-2 border-b border-zinc-100 sm:hidden">
                                        <p className="font-semibold text-sm">{session?.user?.name}</p>
                                        <p className="text-xs text-zinc-500 truncate">{session?.user?.email}</p>
                                    </div>

                                    <div className="p-1">
                                        <Link
                                            href="/dashboard/settings"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: "/login" })}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                        >
                                            Log Out
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
