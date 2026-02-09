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
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-pastel-green" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <header>
                <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-pastel-blue" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Conversations</span>
                </div>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-serif font-bold tracking-tight"
                >
                    Chat History
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground mt-2"
                >
                    View and manage all customer conversations ({total} total)
                </motion.p>
            </header>

            {/* Search and Filters */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-pastel-green"
                    />
                </div>
            </div>

            {/* Conversations List */}
            {filteredConversations.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hi-card p-12 text-center"
                >
                    <div className="inline-block p-6 rounded-3xl bg-secondary mb-6">
                        <MessageSquare size={48} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold mb-3">No conversations yet</h3>
                    <p className="text-muted-foreground mb-6">
                        Chat history will appear here once customers start using your AI agent.
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Conversation List */}
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {filteredConversations.map((conv, idx) => (
                                <motion.div
                                    key={conv.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => fetchConversationDetails(conv.id)}
                                    className={`hi-card p-4 cursor-pointer transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 ${selectedConversation?.id === conv.id ? 'border-pastel-green bg-pastel-green/10' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-muted-foreground" />
                                            <span className="font-bold text-sm">Session {conv.sessionId.slice(0, 8)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock size={14} />
                                            {format(new Date(conv.createdAt), 'MMM d, h:mm a')}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {conv.firstMessage?.content || "No messages"}
                                    </p>
                                    <div className="flex items-center justify-between pt-3 border-t border-black/5">
                                        <span className="text-xs font-bold">{conv.messageCount} messages</span>
                                        <ChevronRight size={16} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="px-4 py-2 border-2 border-black rounded-xl font-bold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>
                                <span className="px-4 py-2 font-bold">
                                    Page {page + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="px-4 py-2 border-2 border-black rounded-xl font-bold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Conversation Detail */}
                    <div className="hi-card p-6 sticky top-6 h-fit max-h-[calc(100vh-8rem)] flex flex-col">
                        {loadingConversation ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-pastel-green" />
                            </div>
                        ) : selectedConversation ? (
                            <>
                                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black/5">
                                    <div>
                                        <h3 className="text-xl font-bold">Conversation Details</h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(new Date(selectedConversation.createdAt), 'MMMM d, yyyy • h:mm a')}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4 overflow-y-auto flex-1">
                                    {selectedConversation.messages?.map((msg: any, idx: number) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`p-4 rounded-2xl border-2 border-black ${msg.role === 'user' ? 'bg-pastel-blue' : 'bg-pastel-green/20'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                {msg.role === 'user' ? (
                                                    <User size={14} />
                                                ) : (
                                                    <Bot size={14} />
                                                )}
                                                <span className="text-xs font-bold uppercase tracking-wide">
                                                    {msg.role}
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-auto">
                                                    {format(new Date(msg.createdAt), 'h:mm a')}
                                                </span>
                                            </div>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold">Select a conversation to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
