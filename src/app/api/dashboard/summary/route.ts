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

        // Parallel counts and checks
        const [
            workspace,
            documentsCount,
            conversationsCount,
            membersCount
        ] = await Promise.all([
            prisma.workspace.findUnique({
                where: { id: workspaceId },
                select: {
                    chatbotName: true,
                    widgetEnabled: true,
                } as any
            }),
            prisma.document.count({ where: { workspaceId } }),
            prisma.conversation.count({ where: { workspaceId } }),
            prisma.workspaceMember.count({ where: { workspaceId } })
        ]);

        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        const isAiConfigured = !!((workspace as any).chatbotName && (workspace as any).chatbotName.trim() !== "");

        return NextResponse.json({
            documentsCount,
            conversationsCount,
            membersCount,
            isAiConfigured,
            widgetEnabled: workspace.widgetEnabled,
        });
    } catch (error) {
        console.error("[DASHBOARD_SUMMARY_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
