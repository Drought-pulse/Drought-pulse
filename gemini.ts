import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function chatWithGemini(message: string, history: { role: 'user' | 'assistant', content: string }[]) {
  try {
    const formattedHistory = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user' as any,
      parts: [{ text: h.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...formattedHistory, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: `You are the Drought Pulse Assistant, an AI expert in agriculture and drought management. 
        Your goal is to help Indian farmers and researchers. 
        Provide simple, actionable advice for farmers. 
        For researchers, be more technical and data-driven.
        Keep responses concise and helpful. 
        If asked about drought in their area, suggest they check the dashboard or provide general weather patterns if they specify a state.`,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The assistant is currently unavailable. Please try again later.";
  }
}
