import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if (!workspaceId) {
            return NextResponse.json({ error: "Missing workspace ID" }, { status: 400 });
        }

        // Verify user has access to this workspace
        const membership = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: session.user.id,
            },
        });

        if (!membership) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Parallel counts and checks with defensive structure
        const [workspace, documentsCount, conversationsCount] = await Promise.all([
            prisma.workspace.findUnique({
                where: { id: workspaceId },
                include: {
                    members: true
                }
            }),
            prisma.document.count({
                where: { workspaceId }
            }),
            prisma.conversation.count({
                where: { workspaceId }
            }),
        ]);

        // Production-safe handling: return safe object if workspace not found instead of crashing
        if (!workspace) {
            return NextResponse.json({
                documentsCount: 0,
                conversationsCount: 0,
                membersCount: 0,
                isAiConfigured: false,
                widgetEnabled: false,
            });
        }

        // Defensive calculation for member count using optional chaining as requested
        const membersCount = workspace?.members?.length ?? 0;

        // Ensure calculation cannot break if fields are null
        const isAiConfigured = !!(workspace?.chatbotName && workspace.chatbotName.trim() !== "");

        return NextResponse.json({
            documentsCount: documentsCount ?? 0,
            conversationsCount: conversationsCount ?? 0,
            membersCount: membersCount,
            isAiConfigured: isAiConfigured,
            widgetEnabled: workspace?.widgetEnabled ?? false,
        });

    } catch (error: any) {
        // Structured error handling: log full error for production debugging
        console.error("[DASHBOARD_SUMMARY_ERROR]", {
            message: error?.message,
            stack: error?.stack,
            cause: error?.cause
        });

        return NextResponse.json({
            error: "Internal Server Error",
            message: process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred"
        }, { status: 500 });
    }
}
