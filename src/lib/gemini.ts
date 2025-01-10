import { GoogleGenerativeAI } from "@google/generative-ai";
import { ModelConfig, DEFAULT_MODEL } from "./models";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error(
    "API key not found. Please add your Gemini API key to the .env file as VITE_GEMINI_API_KEY. " +
      "You can get an API key from https://makersuite.google.com/app/apikey"
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function fileToGenerativePart(file: File) {
  // Validate file type and size
  const supportedTypes = ["image/jpeg", "image/png"];
  if (!supportedTypes.includes(file.type)) {
    throw new Error(
      `Unsupported file type: ${file.type}. ` +
        "The Gemini API currently supports JPG and PNG images only. " +
        "Please convert your image to one of these formats and try again."
    );
  }

  const maxSize = 4 * 1024 * 1024; // 4MB
  if (file.size > maxSize) {
    throw new Error(
      `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. ` +
        "The maximum file size is 4MB. Please compress your image or choose a smaller file."
    );
  }

  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      try {
        const result = reader.result as string;
        const base64EncodedData = result.split(",")[1];
        resolve(base64EncodedData);
      } catch (error) {
        reject(new Error("Failed to process image. Please try another file."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image file. Please try another file."));
    };

    reader.readAsDataURL(file);
  });

  try {
    const data = await base64EncodedDataPromise;
    return {
      inlineData: {
        data,
        mimeType: file.type,
      },
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Unknown file processing error");
  }
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
  } catch (error: any) {
    console.error("Error generating response:", error);

    // Handle specific API error cases
    const errorMsg = error?.message?.toLowerCase() || "";

    if (errorMsg.includes("quota")) {
      throw new Error(
        "API quota exceeded. Please try again in a few minutes. " +
          "If this persists, check your API usage limits at https://makersuite.google.com/app/apikey"
      );
    }

    if (errorMsg.includes("invalid") && errorMsg.includes("key")) {
      throw new Error(
        "Invalid API key. Please check that your API key is correct in the .env file. " +
          "You can get a new key from https://makersuite.google.com/app/apikey"
      );
    }

    if (errorMsg.includes("blocked") || errorMsg.includes("safety")) {
      throw new Error(
        "Content was flagged by safety filters. " +
          "Please modify your prompt to avoid sensitive or inappropriate content and try again."
      );
    }

    if (errorMsg.includes("permission") || errorMsg.includes("unauthorized")) {
      throw new Error(
        "API access denied. Please ensure your API key has the correct permissions. " +
          "Visit https://makersuite.google.com/app/apikey to check your API key settings."
      );
    }

    // Handle file-specific errors
    if (files && files.length > 0) {
      if (errorMsg.includes("file") || errorMsg.includes("image")) {
        throw new Error(
          "Error processing image files. Please ensure:\n" +
            "- Files are valid JPG or PNG images\n" +
            "- Each file is under 4MB\n" +
            "- Images are not corrupted"
        );
      }
    }

    // Rate limit errors
    if (errorMsg.includes("rate") || errorMsg.includes("limit")) {
      throw new Error(
        "Rate limit exceeded. Please wait a moment before trying again. " +
          "If this persists, consider implementing request throttling."
      );
    }

    // Network errors
    if (errorMsg.includes("network") || errorMsg.includes("connection")) {
      throw new Error(
        "Network error occurred. Please check your internet connection and try again. " +
          "If the problem persists, it might be a temporary API service disruption."
      );
    }

    // Generic error with guidance
    throw new Error(
      "An unexpected error occurred. Please try again. " +
        "If the problem persists, contact support with error details:\n" +
        `Error: ${error.message}\n` +
        "Time: " +
        new Date().toISOString()
    );
  }
}
