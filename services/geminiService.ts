
import { GoogleGenAI, Type } from "@google/genai";
import { HistoryPoint } from "../types";

export const getFXInsights = async (currentRate: number, history: HistoryPoint[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const historySummary = history.slice(-5).map(h => `${h.date}: ${h.rate.toFixed(2)}`).join(", ");
  
  const prompt = `Analyze the current KRW/USD exchange rate. 
  Current rate: ${currentRate.toFixed(2)} KRW per 1 USD.
  Recent history: ${historySummary}.
  Please provide a summary of the situation, the likely trend, key economic factors influencing this pair (e.g., Fed rates, Bank of Korea policy, export trends), and a professional recommendation for someone considering a large transfer.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A concise summary of the current market state." },
            trend: { type: Type.STRING, enum: ["UP", "DOWN", "STABLE"], description: "The predicted short-term trend." },
            factors: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Top 3 factors influencing the rate."
            },
            recommendation: { type: Type.STRING, description: "Actionable advice." }
          },
          required: ["summary", "trend", "factors", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
