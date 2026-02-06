import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ACTIVE_WORKSPACE_COOKIE = "active_workspace_id";

export async function getActiveWorkspaceId() {
    const cookieStore = cookies();
    const activeWorkspaceId = cookieStore.get(ACTIVE_WORKSPACE_COOKIE)?.value;

    if (activeWorkspaceId) {
        return activeWorkspaceId;
    }

    // Default to first workspace if none selected
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
        const membership = await prisma.workspaceMember.findFirst({
            where: { userId: session.user.id },
            select: { workspaceId: true },
        });

        if (membership) {
            return membership.workspaceId;
        }
    }

    return null;
}

export function setActiveWorkspaceId(workspaceId: string) {
    const cookieStore = cookies();
    cookieStore.set(ACTIVE_WORKSPACE_COOKIE, workspaceId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
    });
}
