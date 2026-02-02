import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { email, password, name, companyName } = await req.json();

        if (!email || !password || !companyName) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                },
            });

            // 2. Create Workspace
            const workspace = await tx.workspace.create({
                data: {
                    name: companyName,
                    ownerId: user.id,
                },
            });

            // 3. Create Membership
            await tx.workspaceMember.create({
                data: {
                    userId: user.id,
                    workspaceId: workspace.id,
                    role: "OWNER",
                },
            });

            return { user, workspace };
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("REGISTRATION_ERROR_DETAIL:", {
            message: error.message,
            stack: error.stack,
            error
        });
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
