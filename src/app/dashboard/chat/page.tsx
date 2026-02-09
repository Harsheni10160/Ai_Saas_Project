"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ChatTypingIndicator from "@/components/chat-typing-indicator";

export default function ChatPage() {
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch workspace ID first
    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const res = await fetch("/api/workspaces");

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "Failed to load workspaces" }));
                toast.error(errorData.error || "Failed to fetch workspaces");
                return;
            }

            const data = await res.json();
            if (data.length > 0) {
                setActiveWorkspaceId(data[0].id);
            }
        } catch (error) {
            toast.error("Failed to fetch workspaces");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || !activeWorkspaceId) return;

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId: activeWorkspaceId,
                    sessionId: "test-session",
                    message: input,
                    conversationHistory: messages,
                }),
            });

            if (!res.ok) throw new Error("Failed to send message");

            const reader = res.body?.getReader();
            if (!reader) throw new Error("No response body");

            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "",
            };

            setMessages((prev) => [...prev, assistantMessage]);

            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                assistantMessage.content += chunk;
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { ...assistantMessage };
                    return updated;
                });
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to send message");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

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
                        {messages.map((msg: any, idx: number) => (
                            <motion.div
                                key={msg.id || idx}
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

                    {/* Updated Loading State */}
                    {isLoading && messages[messages.length - 1]?.role === "user" && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-pastel-blue hi-border flex-shrink-0 flex items-center justify-center">
                                <Bot className="w-6 h-6" />
                            </div>
                            <ChatTypingIndicator />
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 bg-secondary/30 border-t-2 border-black">
                    <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
                        <div className="flex-1 relative">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ask your knowledge base..."
                                className="h-14 pl-6 pr-12 text-lg rounded-2xl hi-border bg-white shadow-sm focus-visible:ring-pastel-green"
                                disabled={isLoading || !activeWorkspaceId}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Sparkles className={`w-5 h-5 transition-colors ${isLoading ? "text-pastel-green animate-pulse" : "text-muted-foreground"}`} />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading || !activeWorkspaceId || !input.trim()}
                            className="h-14 w-14 rounded-2xl hi-border bg-black text-white hover:bg-pastel-green hover:text-black transition-all hover:scale-105 active:scale-95 shadow-lg group"
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                        </Button>
                    </form>
                    <p className="text-[10px] text-center mt-3 font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                        {isLoading ? "Generating response..." : "AI ready to chat"}
                    </p>
                </div>
            </Card>
        </div>
    );
}
