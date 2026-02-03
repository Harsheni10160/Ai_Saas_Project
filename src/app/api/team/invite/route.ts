import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { workspaceId, email, role } = await req.json();

        if (!workspaceId || !email) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Verify current user is workspace owner
        const currentUserMembership = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: session.user.id,
                role: "OWNER",
            },
        });

        if (!currentUserMembership) {
            return new NextResponse("Only workspace owners can invite members", { status: 403 });
        }

        // Check if user with email exists
        const userToInvite = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!userToInvite) {
            return NextResponse.json(
                {
                    error: "User not found",
                    message: "This user must sign up first before they can be added to your workspace."
                },
                { status: 404 }
            );
        }

        // Check if user is already a member
        const existingMembership = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: userToInvite.id,
            },
        });

        if (existingMembership) {
            return NextResponse.json(
                { error: "User is already a member of this workspace" },
                { status: 400 }
            );
        }

        // Create workspace membership
        const newMember = await prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId: userToInvite.id,
                role: role || "MEMBER",
            },
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
        });

        return NextResponse.json({
            success: true,
            member: newMember,
            message: `${userToInvite.name || userToInvite.email} has been added to your workspace!`
        });
    } catch (error) {
        console.error("INVITE_MEMBER_ERROR:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
