import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;

        // Get conversation with all messages
        const conversation = await prisma.conversation.findUnique({
            where: { id },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
                workspace: {
                    include: {
                        members: true,
                    },
                },
            },
        });

        if (!conversation) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        // Verify user has access to workspace
        const hasAccess = conversation.workspace.members.some(
            (member: { userId: string }) => member.userId === session.user.id
        );

        if (!hasAccess) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        return NextResponse.json({
            id: conversation.id,
            sessionId: conversation.sessionId,
            createdAt: conversation.createdAt,
            messages: conversation.messages.map((msg: { id: string; role: string; content: string; sources: any; createdAt: Date }) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                sources: msg.sources,
                createdAt: msg.createdAt,
            })),
        });
    } catch (error) {
        console.error("GET_CONVERSATION_ERROR:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
