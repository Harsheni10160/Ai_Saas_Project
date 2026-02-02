import { prisma } from "./prisma";

export async function searchRelevantChunks(
  workspaceId: string,
  embedding: number[],
  limit = 5
) {
  // We use $queryRaw because Prisma doesn't support the <-> vector operator natively.
  // This requires the pgvector extension and the 'embedding' column to be of type 'vector'.
  return prisma.$queryRaw<{ content: string }[]>`
    SELECT content
    FROM "DocumentChunk"
    WHERE "workspaceId" = ${workspaceId}
    ORDER BY "embedding" <-> ${embedding}::vector
    LIMIT ${limit};
  `;
}
