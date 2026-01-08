import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION_AI } from '../constants';

export const generateAgriAdvice = async (
  prompt: string, 
  userContext: string
): Promise<string> => {
  try {
    // Initialize inside the function to ensure process.env is available and avoid top-level crashes
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const fullPrompt = `Context: User is a ${userContext}. \nQuestion: ${prompt}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_AI,
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text || "Désolé, je n'ai pas pu générer de conseil pour le moment.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API_KEY")) {
       return "Erreur de configuration : Clé API manquante ou invalide.";
    }
    return "Une erreur est survenue lors de la connexion à l'IA Agri-Expert.";
  }
};