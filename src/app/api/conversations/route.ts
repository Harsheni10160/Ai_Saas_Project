import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Derive the exact Prisma return type for conversations
 * (includes messages + _count)
 */
type ConversationWithMeta = Awaited<
    ReturnType<typeof prisma.conversation.findMany>
>[number];

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");
        const limit = parseInt(searchParams.get("limit") ?? "10", 10);
        const offset = parseInt(searchParams.get("offset") ?? "0", 10);

        if (!workspaceId) {
            return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
        }

        // Verify user has access to workspace
        const workspace = await prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                members: {
                    some: {
                        userId: session.user.id,
                    },
                },
            },
        });

        if (!workspace) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch conversations with metadata
        const conversations = await prisma.conversation.findMany({
            where: { workspaceId },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                    take: 1, // first message preview
                },
                _count: {
                    select: { messages: true },
                },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
        });

        // Total count for pagination
        const total = await prisma.conversation.count({
            where: { workspaceId },
        });

        return NextResponse.json({
            conversations: conversations.map(
                (conv) => ({
                    id: conv.id,
                    sessionId: conv.sessionId,
                    createdAt: conv.createdAt,
                    messageCount: conv._count.messages,
                    firstMessage: conv.messages[0] ?? null,
                })
            ),
            total,
            limit,
            offset,
        });
    } catch (error) {
        console.error("GET_CONVERSATIONS_ERROR:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
