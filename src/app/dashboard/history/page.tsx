"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    MessageSquare,
    Search,
    Filter,
    Calendar,
    User,
    Clock,
    Loader2,
    ChevronRight,
    Trash2,
    ChevronLeft,
    Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function ChatHistoryPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState<any[]>([]);
    const [workspace, setWorkspace] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [loadingConversation, setLoadingConversation] = useState(false);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const limit = 10;

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Get active workspace
            const wsRes = await fetch("/api/workspaces/active");

            if (!wsRes.ok) return;

            const activeWs = await wsRes.json();
            setWorkspace(activeWs);

            // Fetch conversations
            const convRes = await fetch(
                `/api/conversations?workspaceId=${activeWs.id}&limit=${limit}&offset=${page * limit}`
            );

            if (convRes.ok) {
                const data = await convRes.json();
                setConversations(data.conversations || []);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error("History error:", error);
            toast.error("Failed to load chat history");
        } finally {
            setLoading(false);
        }
    };

    const fetchConversationDetails = async (id: string) => {
        try {
            setLoadingConversation(true);
            const res = await fetch(`/api/conversations/${id}`);

            if (res.ok) {
                const data = await res.json();
                setSelectedConversation(data);
            } else {
                toast.error("Failed to load conversation");
            }
        } catch (error) {
            console.error("Conversation error:", error);
            toast.error("Failed to load conversation");
        } finally {
            setLoadingConversation(false);
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.firstMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.sessionId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(total / limit);

    if (loading && page === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-zinc-900 mb-4" />
                <p className="text-zinc-500 font-medium">Loading chat archives...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Chat History</h1>
                    <p className="text-zinc-500 mt-1">Review all past interactions with your AI agent.</p>
                </div>
                <div className="px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-200">
                    {total} Conversations
                </div>
            </div>

            {/* Search */}
            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search messages or sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                />
            </div>

            {/* Content Grid */}
            {filteredConversations.length === 0 ? (
                <div className="border border-zinc-200 rounded-2xl p-12 text-center bg-zinc-50/50">
                    <div className="inline-block p-4 rounded-full bg-white border border-zinc-100 mb-6 shadow-sm">
                        <MessageSquare size={32} className="text-zinc-300" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-1">No history found</h3>
                    <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                        Conversations will be archived here once your agent starts interacting with users.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* List Section */}
                    <div className="lg:col-span-4 space-y-3">
                        <AnimatePresence mode="popLayout">
                            {filteredConversations.map((conv, idx) => (
                                <motion.div
                                    key={conv.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => fetchConversationDetails(conv.id)}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${selectedConversation?.id === conv.id
                                        ? 'border-indigo-600 bg-indigo-50/30'
                                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${selectedConversation?.id === conv.id ? 'bg-indigo-600' : 'bg-zinc-300'}`} />
                                            <span className="font-bold text-xs text-zinc-900 uppercase">#{conv.sessionId.slice(0, 6)}</span>
                                        </div>
                                        <span className="text-[10px] text-zinc-400 font-medium">
                                            {format(new Date(conv.createdAt), 'MMM d')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                                        {conv.firstMessage?.content || "No interactions recorded"}
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                                        <span>{conv.messageCount} exchanges</span>
                                        <ChevronRight size={12} className={selectedConversation?.id === conv.id ? 'text-indigo-600' : 'text-zinc-300'} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between gap-2 pt-6">
                                <Button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs font-bold uppercase tracking-widest text-zinc-500"
                                >
                                    <ChevronLeft size={14} className="mr-1" /> Prev
                                </Button>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    {page + 1} / {totalPages}
                                </span>
                                <Button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs font-bold uppercase tracking-widest text-zinc-500"
                                >
                                    Next <ChevronRight size={14} className="ml-1" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Detail Section */}
                    <div className="lg:col-span-8 border border-zinc-200 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col h-[700px]">
                        {loadingConversation ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                <p className="text-xs font-semibold uppercase tracking-widest">Retrieving Logs...</p>
                            </div>
                        ) : selectedConversation ? (
                            <>
                                <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                                    <div>
                                        <h3 className="font-bold text-zinc-900">Session Details</h3>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                                            {format(new Date(selectedConversation.createdAt), 'MMMM d, yyyy • h:mm a')}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="px-2 py-1 rounded bg-indigo-50 text-[10px] font-bold text-indigo-600 uppercase">Archive</div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/20">
                                    {selectedConversation.messages?.map((msg: any, idx: number) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-zinc-900' : 'bg-indigo-600'
                                                }`}>
                                                {msg.role === 'user' ? (
                                                    <User size={14} className="text-white" />
                                                ) : (
                                                    <Bot size={14} className="text-white" />
                                                )}
                                            </div>
                                            <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                    ? 'bg-zinc-900 text-white rounded-tr-none'
                                                    : 'bg-white border border-zinc-200 text-zinc-700 rounded-tl-none shadow-sm'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                                                    {format(new Date(msg.createdAt), 'h:mm a')}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mb-4 border border-zinc-100">
                                    <MessageSquare size={24} className="text-zinc-300" />
                                </div>
                                <h3 className="text-base font-bold text-zinc-900">Transcript Preview</h3>
                                <p className="text-sm text-zinc-500 max-w-xs mt-1">
                                    Select a session from the list to view the full conversation transcript.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
