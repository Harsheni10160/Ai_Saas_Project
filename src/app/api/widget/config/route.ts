import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const key = searchParams.get("key");

        if (!key) {
            return new NextResponse("Widget key is required", { status: 400 });
        }

        const workspace = await prisma.workspace.findUnique({
            where: {
                widgetPublicKey: key,
            } as any,
            select: {
                id: true,
                name: true,
                chatbotName: true,
                primaryColor: true,
                logoUrl: true,
            },
        });

        if (!workspace) {
            return new NextResponse("Invalid widget key", { status: 404 });
        }

        // Return config with CORS headers
        return NextResponse.json(workspace, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (error) {
        console.error("[WIDGET_CONFIG_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
        },
    });
}
