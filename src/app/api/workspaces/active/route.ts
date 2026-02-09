import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const cookieStore = await cookies();
        const activeWorkspaceId = cookieStore.get("active_workspace_id")?.value;

        let workspace;

        if (activeWorkspaceId) {
            workspace = await prisma.workspace.findFirst({
                where: {
                    id: activeWorkspaceId,
                    members: {
                        some: {
                            userId: session.user.id,
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    widgetPublicKey: true,
                } as any,
            });
        }

        // Fallback to the first workspace if no active one is set or found
        if (!workspace) {
            workspace = await prisma.workspace.findFirst({
                where: {
                    members: {
                        some: {
                            userId: session.user.id,
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    widgetPublicKey: true,
                } as any,
                orderBy: {
                    createdAt: "asc",
                },
            });
        }

        if (!workspace) {
            return new NextResponse("Workspace Not Found", { status: 404 });
        }

        return NextResponse.json(workspace);
    } catch (error) {
        console.error("[ACTIVE_WORKSPACE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
