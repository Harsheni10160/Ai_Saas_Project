"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, RefreshCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatPage() {
    const queryClient = useQueryClient();
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchActiveWorkspace();
    }, []);

    const fetchActiveWorkspace = async () => {
        try {
            const res = await fetch("/api/workspaces/active");
            if (res.ok) {
                const data = await res.json();
                if (data.id) setActiveWorkspaceId(data.id);
            }
        } catch (error) {
            toast.error("Failed to load workspace");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !activeWorkspaceId) return;

        const userMessage = { id: Date.now().toString(), role: "user", content: input };
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
            const decoder = new TextDecoder();

            setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "" }]);

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                setMessages((prev) => {
                    const lastMsg = prev[prev.length - 1];
                    if (lastMsg.role === "assistant") {
                        return [...prev.slice(0, -1), { ...lastMsg, content: lastMsg.content + chunk }];
                    }
                    return prev;
                });
            }
            queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
        } catch (error) {
            toast.error("Failed to generate response");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-zinc-900">AI Playground</h1>
                        <p className="text-xs text-zinc-500">Testing environment</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setMessages([])} className="text-zinc-500">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reset Chat
                </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                        <Sparkles className="w-12 h-12 text-indigo-300 mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900">Ready to test</h3>
                        <p className="text-sm text-zinc-500 max-w-sm">
                            Ask questions about your uploaded documents to verify the AI's responses.
                        </p>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.role === "assistant" && (
                                <Avatar className="h-8 w-8 border border-zinc-200 bg-white flex-shrink-0">
                                    <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs">AI</AvatarFallback>
                                </Avatar>
                            )}

                            <div
                                className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm
                                    ${msg.role === "user"
                                        ? "bg-zinc-900 text-white rounded-tr-sm"
                                        : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm"
                                    }`}
                            >
                                {msg.content}
                            </div>

                            {msg.role === "user" && (
                                <Avatar className="h-8 w-8 border border-zinc-200 bg-white flex-shrink-0">
                                    <AvatarFallback className="bg-zinc-100 text-zinc-600 text-xs">ME</AvatarFallback>
                                </Avatar>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <Avatar className="h-8 w-8 border border-zinc-200 bg-white flex-shrink-0">
                            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs">AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-zinc-200">
                <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-1 pr-12 h-11 bg-zinc-50 border-zinc-200 focus:bg-white transition-all rounded-full"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1 w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800"
                        disabled={isLoading || !input.trim()}
                    >
                        <Send className="w-4 h-4 text-white" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
