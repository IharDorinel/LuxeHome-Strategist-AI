
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { HomeRequirements } from "./types";
import { SYSTEM_INSTRUCTION } from "./constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const updateRequirementsDeclaration: FunctionDeclaration = {
  name: "update_requirements",
  parameters: {
    type: Type.OBJECT,
    description: "Update the technical requirements and vision of the user's home.",
    properties: {
      type: { type: Type.STRING, description: "Type of house (villa, mansion, penthouse, etc.)" },
      floors: { type: Type.STRING, description: "Number of floors" },
      style: { type: Type.STRING, description: "Architectural style (minimalist, brutalist, classic, etc.)" },
      zones: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Zones like pool, garden, garage, etc." },
      interior: { type: Type.STRING, description: "Interior preferences" },
      materials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Preferred materials" },
      mood: { type: Type.STRING, description: "Atmosphere and lighting" },
      budget: { type: Type.STRING, description: "Project budget" },
      timeframe: { type: Type.STRING, description: "Project timeline" },
    },
  },
};

const generateVisualizationDeclaration: FunctionDeclaration = {
  name: "generate_visualization",
  parameters: {
    type: Type.OBJECT,
    description: "Triggers the generation of an architectural visualization.",
    properties: {
      architectural_prompt: { 
        type: Type.STRING, 
        description: "A highly detailed, structured prompt for the image generator. Must include style, materials, environment, camera, and lighting." 
      },
    },
    required: ["architectural_prompt"],
  },
};

export const createChat = () => {
  const ai = getAI();
  return ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ functionDeclarations: [updateRequirementsDeclaration, generateVisualizationDeclaration] }],
    },
  });
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned from API");
};
