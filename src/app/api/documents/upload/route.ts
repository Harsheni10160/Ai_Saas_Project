import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";
import { processDocument } from "@/lib/document-processor";
import { createEmbeddings } from "@/lib/embeddings";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            console.error("UPLOAD_ERROR: Unauthorized");
            return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const workspaceId = formData.get("workspaceId") as string;

        if (!file || !workspaceId) {
            console.error("UPLOAD_ERROR: Missing file or workspace ID", { file: !!file, workspaceId });
            return new NextResponse(JSON.stringify({ error: "Missing file or workspace ID" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        // Verify user has access to workspace
        const membership = await prisma.workspaceMember.findFirst({
            where: {
                userId: session.user.id,
                workspaceId,
            },
        });

        if (!membership) {
            console.error("UPLOAD_ERROR: Access denied", { userId: session.user.id, workspaceId });
            return new NextResponse(JSON.stringify({ error: "Access denied" }), { status: 403, headers: { "Content-Type": "application/json" } });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to S3
        const s3Key = await uploadToS3(buffer, file.name, file.type);

        // Create document record
        const document = await prisma.document.create({
            data: {
                workspaceId,
                name: file.name,
                fileUrl: s3Key,
                fileType: file.type,
                fileSize: file.size,
                status: "processing",
            },
        });

        // Process document asynchronously in background
        processDocumentInBackground(document.id, buffer, file.type, workspaceId).catch(err => {
            console.error("Background processing error:", err);
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error("DOCUMENT_UPLOAD_ERROR:", error instanceof Error ? error.message : String(error));
        console.error("Full error:", error);
        return new NextResponse(JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}

// Process document in background without blocking response
async function processDocumentInBackground(documentId: string, buffer: Buffer, fileType: string, workspaceId: string) {
    try {
        // Extract and chunk text
        const chunks = await processDocument(buffer, fileType);

        // Create embeddings
        const embeddings = await createEmbeddings(chunks);

        // Store chunks with embeddings
        await prisma.$transaction(
            chunks.map((chunk, index) =>
                prisma.documentChunk.create({
                    data: {
                        documentId,
                        workspaceId,
                        content: chunk,
                        embedding: embeddings[index],
                        metadata: { index, total: chunks.length },
                    },
                })
            )
        );

        // Update document status
        await prisma.document.update({
            where: { id: documentId },
            data: { status: "completed" },
        });
    } catch (error) {
        console.error("DOCUMENT_PROCESSING_ERROR", error);
        await prisma.document.update({
            where: { id: documentId },
            data: {
                status: "failed",
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            },
        });
    }
}
