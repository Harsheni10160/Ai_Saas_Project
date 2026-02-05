import OpenAI from "openai";
import { searchRelevantChunks } from "./vectorSearch";
import { buildSystemPrompt } from "./prompts";

const openai = new OpenAI({
    apiKey: process.env.CEREBRAS_API_KEY,
    baseURL: "https://api.cerebras.ai/v1",
});

export async function runChat({
    workspaceId,
    question,
    embedding,
}: {
    workspaceId: string;
    question: string;
    embedding: number[];
}) {
    // 1. Search for relevant context
    const chunks = (await searchRelevantChunks(workspaceId, embedding)) as { content: string }[];

    // 2. Prepare context string
    const context = chunks.length > 0
        ? chunks.map((c) => c.content).join("\n\n")
        : "No relevant documents found.";

    // 3. Call OpenAI with RAG prompt
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: buildSystemPrompt(context) },
            { role: "user", content: question },
        ],
        temperature: 0, // Lower temperature for more factual responses
    });

    return response.choices[0].message.content;
}
