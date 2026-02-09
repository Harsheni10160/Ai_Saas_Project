import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function DELETE(
    req: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const { workspaceId } = params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!workspaceId) {
            return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
        }

        // Verify user is an OWNER or ADMIN of the workspace
        const membership = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: session.user.id,
                role: {
                    in: [Role.OWNER, Role.ADMIN]
                }
            }
        });

        if (!membership) {
            return NextResponse.json(
                { error: "Forbidden: Only owners or admins can delete workspaces" },
                { status: 403 }
            );
        }

        // Perform the deletion (cascade handles the rest)
        await prisma.workspace.delete({
            where: {
                id: workspaceId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[WORKSPACE_DELETE_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
