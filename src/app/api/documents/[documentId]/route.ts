import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { documentId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { documentId } = params;

        // First, get the document to verify ownership
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: { workspace: { include: { members: true } } },
        });

        if (!document) {
            return new NextResponse("Document not found", { status: 404 });
        }

        // Verify user has access to this workspace
        const hasAccess = document.workspace.members.some(
            (member) => member.userId === session.user.id
        );

        if (!hasAccess) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Delete all associated chunks first (due to foreign key constraints)
        await prisma.documentChunk.deleteMany({
            where: { documentId },
        });

        // Then delete the document
        await prisma.document.delete({
            where: { id: documentId },
        });

        return NextResponse.json({
            success: true,
            message: "Document deleted successfully"
        });
    } catch (error) {
        console.error("DELETE_DOCUMENT_ERROR:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
