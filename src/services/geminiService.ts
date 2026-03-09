import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  score: number;
  analysis: string;
  emoji: string;
}

export const analyzeHappiness = async (imageBase64: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          },
          {
            text: "Analyze the user's facial expression and surroundings in this photo to estimate their current mood and happiness level. Be nuanced and look for micro-expressions, eye tension, and surroundings to infer a true vibe.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.NUMBER,
            description: "0 to 100 score of happiness",
          },
          analysis: {
            type: Type.STRING,
            description: "A brief, friendly analysis of the user's mood and vibe",
          },
          emoji: {
            type: Type.STRING,
            description: "A single emoji representing the detected mood",
          },
        },
        required: ["score", "analysis", "emoji"],
      },
    },
  });

  try {
    const result = JSON.parse(response.text || "{}");
    return result as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to analyze mood. Please try again.");
  }
};

export const analyzeGroupVibe = async (imageBase64: string): Promise<{ score: number, faceCount: number, analysis: string }> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          },
          {
            text: "Analyze this photo of a group of friends. Count how many faces are visible and estimate the overall happiness/vibe of the group. Look beyond just smiles—reason about their body language, proximity, and the genuine 'vibe' of their connection. Provide a human-centric analysis.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "0 to 100 overall vibe score based on human reasoning" },
          faceCount: { type: Type.NUMBER, description: "Number of faces detected" },
          analysis: { type: Type.STRING, description: "A nuanced, human-centric analysis of the group vibe" },
        },
        required: ["score", "faceCount", "analysis"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to analyze group vibe.");
  }
};

export const analyzeCoupleVibe = async (imageBase64: string): Promise<{ score: number, faceCount: number, analysis: string }> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          },
          {
            text: "Analyze this photo of a couple. Count the faces (should be 2) and estimate their compatibility/happiness. Reason about their micro-expressions, how they lean towards each other, and the overall 'energy' of their relationship. Don't just look for smiles; look for deep connection.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "0 to 100 compatibility score based on human reasoning" },
          faceCount: { type: Type.NUMBER, description: "Number of faces detected" },
          analysis: { type: Type.STRING, description: "A nuanced, human-centric analysis of the couple's vibe" },
        },
        required: ["score", "faceCount", "analysis"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to analyze couple vibe.");
  }
};
