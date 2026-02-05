import OpenAI from "openai";
import { createEmbedding } from "./embeddings";
import { findRelevantChunks } from "./vector-search";

const getOpenAIClient = () => {
    // Standardized on Cerebras API (OpenAI-compatible)
    const apiKey = process.env.CEREBRAS_API_KEY || "sk-placeholder";
    const baseURL = "https://api.cerebras.ai/v1";

    return new OpenAI({
        apiKey,
        baseURL,
    });
};

// Mock responses for testing without API
const mockResponses: { [key: string]: string } = {
    "what is": "Based on the documents you've uploaded, I can help answer questions about your business and products.",
    "how": "Here's how you can do that: [Information from your documents would appear here]",
    "help": "I'm here to help! Ask me anything about the information in your knowledge base.",
    "default": "Thank you for your question. Based on the documents in your knowledge base, I would provide a relevant answer here.",
};

function getMockResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(mockResponses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    return mockResponses.default;
}

export async function generateRAGResponse(
    workspaceId: string,
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }> = []
): Promise<{
    response: string;
    sources: string[];
}> {
    // Check if API key is configured
    if (!process.env.CEREBRAS_API_KEY) {
        console.warn("No API key configured, using mock response");
        return {
            response: getMockResponse(userMessage),
            sources: [],
        };
    }

    const openai = getOpenAIClient();

    try {
        // Create embedding for user query
        const queryEmbedding = await createEmbedding(userMessage);

        // Find relevant context
        const relevantChunks = await findRelevantChunks(workspaceId, queryEmbedding);

        // Build context from relevant chunks
        const context = relevantChunks.length > 0
            ? relevantChunks
                .map((chunk, i) => `[Context ${i + 1}]: ${chunk.content}`)
                .join("\n\n")
            : "No relevant context found in your documents.";

        // Create system prompt with context
        const systemPrompt = `You are a helpful customer support assistant. Use the following context from the company's documentation to answer questions. If you cannot find the answer in the context, say so politely.

Context:
${context}

Instructions:
- Be friendly and professional
- Answer based on the provided context
- If the context doesn't contain the answer, acknowledge it
- Keep responses concise but helpful`;

        // Use Cerebras model
        const model = "llama-3.3-70b";

        // Generate response
        const completion = await openai.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                ...conversationHistory.map(msg => ({
                    role: msg.role as "user" | "assistant" | "system",
                    content: msg.content
                })),
                { role: "user", content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        return {
            response: completion.choices[0].message.content || "I couldn't generate a response.",
            sources: [...new Set(relevantChunks.map((chunk) => chunk.documentId))],
        };
    } catch (error) {
        console.error("API error:", error);
        // Fall back to mock response on API errors
        return {
            response: getMockResponse(userMessage),
            sources: [],
        };
    }
}
