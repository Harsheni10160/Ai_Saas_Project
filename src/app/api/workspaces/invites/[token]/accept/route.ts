import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Accept a workspace invite
export async function POST(
    req: Request,
    { params }: { params: { token: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            // If not logged in, we might want to tell them to login/register first
            // or redirect to a page that handles this.
            return new NextResponse("Unauthorized. Please login first.", { status: 401 });
        }

        const { token } = params;

        const invite = await prisma.invite.findUnique({
            where: { token },
            include: { workspace: true },
        });

        if (!invite) {
            return new NextResponse("Invalid invite token", { status: 404 });
        }

        if (new Date() > invite.expires) {
            return new NextResponse("Invite has expired", { status: 400 });
        }

        // Optional: Check if the user email matches the invite email
        // if (session.user.email !== invite.email) {
        //     return new NextResponse("This invite was sent to a different email address", { status: 403 });
        // }

        // Add user to workspace
        const member = await prisma.workspaceMember.upsert({
            where: {
                userId_workspaceId: {
                    userId: session.user.id,
                    workspaceId: invite.workspaceId,
                },
            },
            update: {
                role: invite.role,
            },
            create: {
                userId: session.user.id,
                workspaceId: invite.workspaceId,
                role: invite.role,
            },
        });

        // Delete the invite after use
        await prisma.invite.delete({
            where: { id: invite.id },
        });

        return NextResponse.json({
            success: true,
            workspaceId: invite.workspaceId,
            workspaceName: invite.workspace.name
        });
    } catch (error) {
        console.error("[INVITE_ACCEPT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
