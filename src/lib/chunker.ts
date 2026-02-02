/**
 * Simple chunking logic to split text into manageable pieces for embeddings.
 * Target: 500-700 tokens (~2000-2800 characters)
 * Overlap: ~100 tokens (~400 characters)
 */
export function chunkText(text: string, chunkSize = 2500, overlap = 400): string[] {
    if (text.length <= chunkSize) {
        return [text];
    }

    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
        let endIndex = startIndex + chunkSize;

        // If not the first chunk, handle overlap
        // Note: In this simple implementation, we just take the slice.
        // A smarter bit would look for the nearest sentence end or space.
        if (endIndex < text.length) {
            // Find the last space before endIndex to avoid cutting words
            const lastSpace = text.lastIndexOf(" ", endIndex);
            if (lastSpace > startIndex) {
                endIndex = lastSpace;
            }
        }

        const chunk = text.slice(startIndex, endIndex).trim();
        if (chunk) {
            chunks.push(chunk);
        }

        startIndex = endIndex - overlap;

        // Safety check to avoid infinite loops if overlap >= chunkSize
        if (startIndex >= text.length || endIndex >= text.length) {
            break;
        }
    }

    return chunks;
}
