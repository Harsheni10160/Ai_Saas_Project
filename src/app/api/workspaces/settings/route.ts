import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { workspaceId, chatbotName, widgetEnabled } = body;

        if (!workspaceId) {
            return NextResponse.json({ error: "Missing workspace ID" }, { status: 400 });
        }

        // Verify ownership/membership
        const membership = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: session.user.id,
                role: { in: ["OWNER", "ADMIN"] }
            },
        });

        if (!membership) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updateData: any = {};
        if (chatbotName !== undefined) updateData.chatbotName = chatbotName;
        if (widgetEnabled !== undefined) updateData.widgetEnabled = widgetEnabled;

        const updatedWorkspace = await prisma.workspace.update({
            where: { id: workspaceId },
            data: updateData,
        });

        return NextResponse.json(updatedWorkspace);
    } catch (error) {
        console.error("[WORKSPACE_SETTINGS_PATCH]", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
