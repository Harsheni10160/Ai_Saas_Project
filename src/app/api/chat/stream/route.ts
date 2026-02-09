import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { createEmbedding } from "@/lib/embeddings";
import { findRelevantChunks } from "@/lib/vector-search";

export const dynamic = "force-dynamic";

// Initialize OpenAI (using Cerebras as the provider)
const openai = new OpenAI({
    apiKey: process.env.CEREBRAS_API_KEY,
    baseURL: "https://api.cerebras.ai/v1",
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { workspaceId, sessionId, message, conversationHistory = [] } = body;

        if (!workspaceId || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Get or create conversation
        let conversation = await prisma.conversation.findFirst({
            where: { workspaceId, sessionId },
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: { workspaceId, sessionId },
            });
        }

        // 2. Save user message immediately
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: "user",
                content: message,
            },
        });

        // 3. RAG: Retrieve relevant context
        let context = "";
        try {
            const queryEmbedding = await createEmbedding(message);
            const chunks = await findRelevantChunks(workspaceId, queryEmbedding, 3);

            if (chunks && chunks.length > 0) {
                context = chunks.map(c => c.content).join("\n\n");
            }
        } catch (ragError) {
            console.error("RAG_RETRIEVAL_ERROR:", ragError);
        }

        // 4. Prepare System Prompt
        let systemPrompt = "";
        if (context) {
            systemPrompt = `You are a helpful AI support agent for the workspace. 
            Use the following context from uploaded documents to answer the user's question. 
            Answer strictly based on the context. If the answer is not in the context, say: "This information is not available in the uploaded documents."

            Context:
            ${context}`;
        } else {
            // Fallback when no documents are found or RAG fails
            systemPrompt = `You are a helpful AI support agent. 
            Important: No relevant documentation was found for this query. 
            Respond exactly with: "This information is not available in the uploaded documents."`;
        }

        // 5. Create Cerebras Stream
        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b",
            stream: true,
            messages: [
                { role: "system", content: systemPrompt },
                ...conversationHistory.map((msg: any) => ({
                    role: msg.role === "assistant" ? "assistant" : "user",
                    content: msg.content
                })),
                { role: "user", content: message }
            ],
            temperature: 0.1, // Lower temperature for more strict adherence to RAG
            max_tokens: 1000,
        });

        // 6. Transform into a stream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    let fullContent = "";
                    for await (const chunk of response) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            fullContent += content;
                            controller.enqueue(encoder.encode(content));
                        }
                    }

                    // Save the assistant's response to the database
                    if (fullContent && conversation) {
                        await prisma.message.create({
                            data: {
                                conversationId: conversation.id,
                                role: "assistant",
                                content: fullContent,
                            }
                        }).catch(err => console.error("Failed to save assistant message:", err));
                    }

                    controller.close();
                } catch (error) {
                    console.error("Stream generation error:", error);
                    controller.error(error);
                }
            },
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });

    } catch (error: any) {
        console.error("STREAM_ERROR:", error);
        return NextResponse.json(
            { error: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
