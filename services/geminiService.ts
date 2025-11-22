import { GoogleGenAI } from "@google/genai";
import { GeoLocationState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are 'EarthGuard Agent', a specialized Earthquake Preparedness and Response AI for Bangladesh.
Your goal is to save lives and provide calm, accurate, and location-specific advice.

Key Guidelines:
1.  **Context**: You are serving users in Bangladesh. Be aware of local building structures, population density, and the "Fire Service and Civil Defence" (FSCD).
2.  **Language**: Primarily reply in English, but if the user types in Bangla, reply in Bangla. If the user seems panicked, keep answers short and directive (e.g., "Drop, Cover, Hold on").
3.  **Grounding**: 
    *   Use 'googleSearch' for recent news about earthquakes or weather.
    *   Use 'googleMaps' specifically when users ask for locations (e.g., "Where is the nearest hospital?", "Find a shelter").
4.  **Tone**: Calm, authoritative, supportive.

If the user asks what to do *during* an earthquake:
- Emphasize: DROP, COVER, HOLD ON.
- Do not run outside immediately (falling debris risk).
- Stay away from glass/windows.

If the user asks about emergency numbers:
- The main emergency number in Bangladesh is 999.
- Fire Service hotline is 16163.
`;

export const sendMessageToGemini = async (
  message: string,
  location: GeoLocationState
): Promise<{ text: string; groundingMetadata?: any }> => {
  try {
    const tools: any[] = [{ googleSearch: {} }];
    
    // Only add maps tool if we have permission/location or if the user specifically asks for it.
    // However, for best results with the API, we enable it and pass the location config.
    if (location.latitude && location.longitude) {
      tools.push({ googleMaps: {} });
    }

    const model = 'gemini-2.5-flash'; // Using flash for speed in emergency context

    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
        toolConfig: location.latitude && location.longitude ? {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        } : undefined
      },
    });

    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.map(p => p.text).join('') || "I'm having trouble connecting. Please call 999 if this is an emergency.";
    const groundingMetadata = candidate?.groundingMetadata;

    return { text, groundingMetadata };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: "I am currently offline or experiencing high traffic. Please follow standard safety protocols: Drop, Cover, and Hold On. Call 999 for emergencies.",
      groundingMetadata: undefined
    };
  }
};

export const checkRecentQuakes = async (): Promise<string> => {
  try {
      // Simple one-off check for the dashboard
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: "Are there any reported earthquakes in or near Bangladesh in the last 24 hours? Be very brief.",
          config: {
              tools: [{ googleSearch: {} }]
          }
      });
      return response.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || "Unable to fetch recent data.";
  } catch (e) {
      return "Status check unavailable.";
  }
}