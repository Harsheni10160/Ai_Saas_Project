import OpenAI from "openai";

const getEmbeddingsClient = () => {
    // Support both OpenAI and Cerebras Cloud APIs (Cerebras is OpenAI-compatible)
    const apiKey = process.env.OPENAI_API_KEY || process.env.CEREBRAS_API_KEY || "sk-placeholder";
    const baseURL = process.env.CEREBRAS_API_KEY 
        ? "https://api.cerebras.ai/v1"
        : "https://api.openai.com/v1";
    
    return new OpenAI({
        apiKey,
        baseURL,
    });
};

export async function createEmbedding(text: string): Promise<number[]> {
    if (!process.env.OPENAI_API_KEY && !process.env.CEREBRAS_API_KEY) {
        console.warn("No API key configured, returning placeholder embedding");
        // Return a placeholder embedding (1536 dimensions for text-embedding-3-small)
        return Array(1536).fill(0);
    }
    
    const openai = getEmbeddingsClient();
    
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });
        return response.data[0].embedding;
    } catch (error) {
        console.warn("Embedding creation failed, returning placeholder");
        // Return placeholder on error
        return Array(1536).fill(0);
    }
}

export async function createEmbeddings(texts: string[]): Promise<number[][]> {
    if (!process.env.OPENAI_API_KEY && !process.env.CEREBRAS_API_KEY) {
        console.warn("No API key configured, returning placeholder embeddings");
        // Return placeholder embeddings
        return texts.map(() => Array(1536).fill(0));
    }
    
    try {
        // Batch processing would be better for production, but following the roadmap's logic
        const embeddings = await Promise.all(texts.map((text) => createEmbedding(text)));
        return embeddings;
    } catch (error) {
        console.warn("Embeddings creation failed, returning placeholders");
        return texts.map(() => Array(1536).fill(0));
    }
}
