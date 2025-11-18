
import { GoogleGenAI } from "@google/genai";
import { DriveFile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAnswerFromDocuments = async (question: string, documents: DriveFile[]): Promise<string> => {
    if (documents.length === 0) {
        return "I couldn't find any relevant documents in your Google Drive to answer that question.";
    }

    const documentContext = documents.map(doc => 
        `---
        Document: "${doc.name}"
        Content:
        ${doc.content}
        ---`
    ).join('\n\n');

    const prompt = `You are a helpful assistant for a user's Google Drive.
    Your task is to answer the user's question based ONLY on the content of the documents provided below.
    Do not use any external knowledge.
    If the answer cannot be found in the provided documents, you MUST explicitly say "I could not find an answer in the provided documents."
    Keep your answer concise and directly address the question.

    Here are the relevant documents:
    ${documentContext}

    Now, please answer the following question:
    Question: "${question}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get an answer from the AI model.");
    }
};
