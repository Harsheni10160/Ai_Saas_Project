import * as pdf from "pdf-parse";
import mammoth from "mammoth";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    const data = await pdf.default(buffer);
    return data.text;
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

export async function extractTextFromTXT(buffer: Buffer): Promise<string> {
    return buffer.toString("utf-8");
}

export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = start + chunkSize;
        const chunk = text.slice(start, end);
        chunks.push(chunk);
        start = end - overlap;

        // Safety break for very small text or infinite loops
        if (start >= text.length || chunk.length < chunkSize - overlap) break;
    }

    return chunks;
}

export async function processDocument(
    buffer: Buffer,
    fileType: string
): Promise<string[]> {
    let text: string;

    switch (fileType) {
        case "application/pdf":
            text = await extractTextFromPDF(buffer);
            break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            text = await extractTextFromDOCX(buffer);
            break;
        case "text/plain":
            text = await extractTextFromTXT(buffer);
            break;
        default:
            throw new Error(`Unsupported file type: ${fileType}`);
    }

    return chunkText(text);
}
