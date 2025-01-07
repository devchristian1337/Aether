import { GoogleGenerativeAI } from "@google/generative-ai";
import { ModelConfig, DEFAULT_MODEL } from "./models";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing VITE_GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64EncodedData = result.split(",")[1];
      resolve(base64EncodedData);
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

export async function generateResponse(
  prompt: string,
  files?: File[],
  modelConfig: ModelConfig = DEFAULT_MODEL
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: modelConfig.id,
    });

    if (files && files.length > 0) {
      const generativeParts = await Promise.all(
        files.map(fileToGenerativePart)
      );

      const result = await model.generateContent([
        ...generativeParts,
        { text: prompt },
      ]);

      const response = await result.response;
      return response.text();
    } else {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}
