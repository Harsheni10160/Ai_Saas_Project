import OpenAI from "openai";

const getEmbeddingsClient = () => {
    // Embeddings require OpenAI as Cerebras doesn't support them currently
    const apiKey = process.env.OPENAI_API_KEY || process.env.CEREBRAS_API_KEY || "sk-placeholder";

    // Explicitly use OpenAI for embeddings unless someone provides a specific different baseURL
    // Cerebras baseURL "https://api.cerebras.ai/v1" will NOT work for embeddings
    const baseURL = process.env.OPENAI_API_KEY ? undefined : undefined;

    return new OpenAI({
        apiKey,
        // Only use custom baseURL if specifically using a provider that supports embeddings
        // Default to OpenAI's actual endpoint if we have an OpenAI key
    });
};

export async function createEmbedding(text: string): Promise<number[]> {
    if (!process.env.OPENAI_API_KEY && !process.env.CEREBRAS_API_KEY) {
        console.warn("No API key configured for embeddings, returning placeholder embedding");
        return Array(1536).fill(0);
    }

    const openai = getEmbeddingsClient();

    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text.replace(/\n/g, " "), // Best practice for OpenAI embeddings
        });
        return response.data[0].embedding;
    } catch (error: any) {
        console.error("EMBEDDING_CREATION_FAILED:", error?.message || error);
        if (error?.status === 404 || error?.message?.includes("Cerebras")) {
            console.warn("Cerebras does not support embeddings. Please provide an OPENAI_API_KEY.");
        }
        return Array(1536).fill(0);
    }
}

export async function createEmbeddings(texts: string[]): Promise<number[][]> {
    if (!process.env.CEREBRAS_API_KEY) {
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
