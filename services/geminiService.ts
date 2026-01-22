
import { GoogleGenAI, Type } from "@google/genai";
import { HistoryPoint, MarketInsight } from "../types";

const VALID_TRENDS = ['UP', 'DOWN', 'STABLE'] as const;

function isValidMarketInsight(data: unknown): data is MarketInsight {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.summary === 'string' &&
    typeof obj.trend === 'string' &&
    VALID_TRENDS.includes(obj.trend as typeof VALID_TRENDS[number]) &&
    Array.isArray(obj.factors) &&
    typeof obj.recommendation === 'string'
  );
}

function parseApiError(error: Error): Error {
  const message = error.message;
  if (message.includes('quota') || message.includes('429')) {
    return new Error('API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.');
  }
  if (message.includes('401') || message.includes('403')) {
    return new Error('API 인증에 실패했습니다. API 키를 확인해주세요.');
  }
  return error;
}

export const getFXInsights = async (
  currentRate: number, 
  history: HistoryPoint[]
): Promise<MarketInsight> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const historySummary = history
    .slice(-5)
    .map(h => `${h.date}: ${h.rate.toFixed(2)}`)
    .join(", ");
  
  const prompt = `Analyze the current KRW/USD exchange rate. 
  Current rate: ${currentRate.toFixed(2)} KRW per 1 USD.
  Recent history: ${historySummary}.
  Please provide a summary of the situation, the likely trend, key economic factors influencing this pair (e.g., Fed rates, Bank of Korea policy, export trends), and a professional recommendation for someone considering a large transfer.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
    if (!text) {
      throw new Error("AI로부터 빈 응답을 받았습니다.");
    }
    
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("AI 응답을 파싱하는 중 오류가 발생했습니다.");
    }
    
    if (!isValidMarketInsight(parsed)) {
      throw new Error("AI 응답 형식이 올바르지 않습니다.");
    }
    
    return parsed;
  } catch (error) {
    if (import.meta.env.DEV && error instanceof Error) {
      console.error("Gemini Analysis Error:", error);
    }
    
    if (error instanceof Error) {
      throw parseApiError(error);
    }
    
    throw new Error('AI 분석 중 알 수 없는 오류가 발생했습니다.');
  }
};
