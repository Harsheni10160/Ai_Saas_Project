import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

// Create a workspace invite
export async function POST(
    req: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { workspaceId } = params;
        const body = await req.json();
        const { email, role = Role.MEMBER } = body;

        if (!email) {
            return new NextResponse("Email is required", { status: 400 });
        }

        // Verify current user has permission to invite (OWNER or ADMIN)
        const member = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: session.user.id,
                    workspaceId,
                },
            },
        });

        if (!member || (member.role !== Role.OWNER && member.role !== Role.ADMIN)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Create the invite
        const invite = await prisma.invite.upsert({
            where: {
                email_workspaceId: {
                    email,
                    workspaceId,
                },
            },
            update: {
                role,
                token: nanoid(32),
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
            create: {
                email,
                workspaceId,
                role,
                token: nanoid(32),
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        // In a real app, you would send an email here.
        // For this task, we return the invite link for demo purposes.
        const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`;

        return NextResponse.json({ invite, inviteUrl });
    } catch (error) {
        console.error("[WORKSPACE_INVITES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
