import { GoogleGenAI, Type } from "@google/genai";
import { DurationCategory } from "../types";

// Initialize the client
// Note: In a production app, ensure API keys are not exposed in client-side code if possible,
// or use a proxy. For this specific environment constraint, we access process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateActivityIdeas = async (category: DurationCategory): Promise<string[]> => {
  try {
    const prompt = `Generate 5 playful, romantic, or fun couple activity ideas that take ${
      category === DurationCategory.SHORT ? "less than 30 minutes" :
      category === DurationCategory.MEDIUM ? "between 1 and 2 hours" :
      "more than 2 hours"
    }. Keep the titles concise (under 10 words). Return a JSON array of strings.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) return [];

    const ideas = JSON.parse(jsonStr) as string[];
    return ideas;

  } catch (error) {
    console.error("Error generating ideas:", error);
    return [];
  }
};