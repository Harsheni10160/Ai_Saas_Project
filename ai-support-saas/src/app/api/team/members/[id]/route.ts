import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;

        // Get the member to be removed
        const memberToRemove = await prisma.workspaceMember.findUnique({
            where: { id },
            include: { workspace: true },
        });

        if (!memberToRemove) {
            return new NextResponse("Member not found", { status: 404 });
        }

        // Check if the current user is the workspace owner
        const currentUserMembership = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: memberToRemove.workspaceId,
                userId: session.user.id,
                role: "OWNER",
            },
        });

        if (!currentUserMembership) {
            return new NextResponse("Only workspace owners can remove members", { status: 403 });
        }

        // Prevent removing workspace owner
        if (memberToRemove.role === "OWNER") {
            return new NextResponse("Cannot remove workspace owner", { status: 400 });
        }

        // Delete the member
        await prisma.workspaceMember.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE_MEMBER_ERROR:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
