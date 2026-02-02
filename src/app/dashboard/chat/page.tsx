"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const res = await fetch("/api/workspaces");
            const data = await res.json();
            if (data.length > 0) {
                setActiveWorkspaceId(data[0].id);
            }
        } catch (error) {
            toast.error("Failed to fetch workspaces");
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !activeWorkspaceId) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId: activeWorkspaceId,
                    sessionId: "test-session",
                    message: input,
                    conversationHistory: messages,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Chat request failed with status ${res.status}`);
            }

            const data = await res.json();
            const assistantMessage: Message = {
                role: "assistant",
                content: data.response,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to get response from AI";
            console.error("Chat error:", error);
            toast.error(message);
            // Remove the last user message if there was an error
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-10rem)] flex flex-col space-y-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-pastel-blue" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Playground</span>
                    </div>
                    <h1 className="text-4xl font-serif font-bold">Test Chat</h1>
                    <p className="text-muted-foreground mt-2">
                        Interact with your AI agent to test its knowledge and personality.
                    </p>
                </div>
            </header>

            <Card className="hi-card flex-1 flex flex-col overflow-hidden bg-white/50 backdrop-blur-sm">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="w-20 h-20 bg-secondary hi-border rounded-3xl flex items-center justify-center animate-float">
                                    <Bot className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Is it working?</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                        Ask your agent anything about the documents you've uploaded.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="w-10 h-10 rounded-2xl bg-pastel-blue hi-border flex-shrink-0 flex items-center justify-center shadow-sm">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] hi-border rounded-3xl px-6 py-3 text-lg leading-relaxed shadow-sm
                                        ${msg.role === "user"
                                            ? "bg-black text-white rounded-tr-none"
                                            : "bg-white rounded-tl-none"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                {msg.role === "user" && (
                                    <div className="w-10 h-10 rounded-2xl bg-pastel-yellow hi-border flex-shrink-0 flex items-center justify-center shadow-sm">
                                        <User className="w-6 h-6" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-pastel-blue hi-border flex-shrink-0 flex items-center justify-center">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div className="bg-white hi-border rounded-3xl rounded-tl-none px-6 py-4 flex items-center justify-center">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-pastel-green hi-border rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-pastel-green hi-border rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-pastel-green hi-border rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 bg-secondary/30 border-t-2 border-black">
                    <div className="flex gap-3 max-w-4xl mx-auto">
                        <div className="flex-1 relative">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask your knowledge base..."
                                className="h-14 pl-6 pr-12 text-lg rounded-2xl hi-border bg-white shadow-sm focus-visible:ring-pastel-green"
                                disabled={loading || !activeWorkspaceId}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Sparkles className={`w-5 h-5 transition-colors ${loading ? "text-pastel-green animate-pulse" : "text-muted-foreground"}`} />
                            </div>
                        </div>
                        <Button
                            onClick={handleSend}
                            disabled={loading || !activeWorkspaceId || !input.trim()}
                            className="h-14 w-14 rounded-2xl hi-border bg-black text-white hover:bg-pastel-green hover:text-black transition-all hover:scale-105 active:scale-95 shadow-lg group"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                        </Button>
                    </div>
                    <p className="text-[10px] text-center mt-3 font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                        Agent is using {messages.length > 0 ? messages.length : 0} context tokens
                    </p>
                </div>
            </Card>
        </div>
    );
}
