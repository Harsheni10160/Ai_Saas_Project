import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRAGResponse } from "@/lib/rag-chat";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    try {
        const { workspaceId, sessionId, message, conversationHistory } = await req.json();

        if (!workspaceId || !message) {
            return new NextResponse(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                }
            });
        }

        // Find or create conversation
        let conversation = await prisma.conversation.findFirst({
            where: { workspaceId, sessionId },
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: { workspaceId, sessionId },
            });
        }

        // Save user message
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: "user",
                content: message,
            },
        });

        // Generate AI response
        const { response, sources } = await generateRAGResponse(
            workspaceId,
            message,
            conversationHistory
        );

        // Save AI response
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: "assistant",
                content: response,
                sources: sources as any,
            },
        });

        // Update workspace query count
        await prisma.workspace.update({
            where: { id: workspaceId },
            data: { monthlyQueries: { increment: 1 } },
        });

        return NextResponse.json({ response, sources }, { headers: corsHeaders });
    } catch (error: any) {
        console.error("CHAT_ERROR_DETAIL:", {
            message: error.message,
            stack: error.stack,
            error
        });
        return new NextResponse(JSON.stringify({ error: error.message || "Internal error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        });
    }
}
