import { prisma } from "./prisma";

// Cosine similarity function
function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
}

export async function findRelevantChunks(
    workspaceId: string,
    queryEmbedding: number[],
    limit: number = 5
): Promise<Array<{ content: string; similarity: number; documentId: string }>> {
    // Get all chunks for the workspace
    const chunks = await prisma.documentChunk.findMany({
        where: { workspaceId },
        include: { document: true },
    });

    // Calculate similarity scores
    const scoredChunks = chunks.map((chunk) => ({
        content: chunk.content,
        documentId: chunk.documentId,
        similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    // Sort by similarity and take top results
    return scoredChunks
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
}
