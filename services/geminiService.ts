
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateContent(prompt: string): Promise<string> {
  if (!prompt) {
    return "Prompt is empty.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert writer. Please generate content based on the following prompt. Return only the generated content, without any introductory phrases like "Here is the content:".\n\nPROMPT: "${prompt}"`,
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 32,
        maxOutputTokens: 1024,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "Sorry, I was unable to generate content at this time.";
  }
}
