
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION_AI } from '../constants';

export const generateAgriAdvice = async (
  prompt: string, 
  userContext: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return "Configuration requise : La clé API Gemini est manquante. Veuillez contacter l'administrateur.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
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
    return "Une erreur est survenue lors de la connexion à l'IA Agri-Expert. Veuillez réessayer ultérieurement.";
  }
};
