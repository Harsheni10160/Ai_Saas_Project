import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name, companyName, workspaceId } = body;

        if (!email || !password || (!companyName && !workspaceId)) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    email: email.toLowerCase(),
                    name,
                    password: hashedPassword,
                },
            });

            let workspace;

            if (workspaceId) {
                // 2. Joining an existing workspace (via invite)
                workspace = await tx.workspace.findUnique({
                    where: { id: workspaceId },
                });

                if (!workspace) {
                    throw new Error("Target workspace not found");
                }

                // 3. Create Membership as MEMBER
                await tx.workspaceMember.create({
                    data: {
                        userId: user.id,
                        workspaceId: workspace.id,
                        role: "MEMBER",
                    },
                });
            } else {
                // 2. Create New Workspace
                workspace = await tx.workspace.create({
                    data: {
                        name: companyName,
                        ownerId: user.id,
                    },
                });

                // 3. Create Membership as OWNER
                await tx.workspaceMember.create({
                    data: {
                        userId: user.id,
                        workspaceId: workspace.id,
                        role: "OWNER",
                    },
                });
            }

            return { user, workspace };
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("REGISTRATION_ERROR:", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
