import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { workspaceId } = await req.json();

        if (!workspaceId) {
            return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
        }

        // Check if workspace exists
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
        });

        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        // Check if user is already a member
        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: session.user.id,
                    workspaceId: workspaceId,
                },
            },
        });

        if (existingMember) {
            return NextResponse.json({ message: "Already a member of this workspace" }, { status: 200 });
        }

        // Add user as a member
        await prisma.workspaceMember.create({
            data: {
                userId: session.user.id,
                workspaceId: workspaceId,
                role: "MEMBER",
            },
        });

        return NextResponse.json({ message: "Joined workspace successfully" }, { status: 200 });
    } catch (error) {
        console.error("[WORKSPACE_JOIN]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
