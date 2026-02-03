import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if (!workspaceId) {
            return new NextResponse("Workspace ID required", { status: 400 });
        }

        // Verify user has access to workspace
        const membership = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: session.user.id,
            },
        });

        if (!membership) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Get all members with user details
        const members = await prisma.workspaceMember.findMany({
            where: { workspaceId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: [
                { role: "desc" }, // OWNER first
                { user: { name: "asc" } },
            ],
        });

        return NextResponse.json(members);
    } catch (error) {
        console.error("GET_MEMBERS_ERROR:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
