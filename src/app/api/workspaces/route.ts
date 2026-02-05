import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const memberships = await prisma.workspaceMember.findMany({
            where: { userId: session.user.id },
            include: { workspace: true },
        });

        return NextResponse.json(memberships.map((m) => m.workspace));
    } catch (error) {
        console.error("WORKSPACES_ERROR", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
