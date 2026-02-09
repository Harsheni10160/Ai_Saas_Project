import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

// Create a new workspace
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const workspace = await prisma.workspace.create({
            data: {
                name,
                ownerId: session.user.id,
                members: {
                    create: {
                        userId: session.user.id,
                        role: Role.OWNER,
                    },
                },
            },
        });

        return NextResponse.json(workspace);
    } catch (error) {
        console.error("[WORKSPACES_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// Get all workspaces for the current user
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: session.user.id,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(workspaces);
    } catch (error) {
        console.error("[WORKSPACES_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
