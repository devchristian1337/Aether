import { ModelConfig } from "./models";

const API_KEY = import.meta.env.VITE_HYPERBOLIC_API_KEY;
const API_URL = "https://api.hyperbolic.xyz/v1/chat/completions";

if (!API_KEY) {
  throw new Error(
    "Hyperbolic API key not found. Please add your API key to the .env file as VITE_HYPERBOLIC_API_KEY."
  );
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface HyperbolicError {
  message: string;
  type?: string;
  param?: string;
  code?: string;
}

export async function generateHyperbolicResponse(
  prompt: string,
  modelConfig: ModelConfig,
  systemMessage?: string,
  previousMessages: Message[] = []
): Promise<string> {
  const messages: Message[] = [...previousMessages];
  
  if (systemMessage) {
    messages.push({ role: "system", content: systemMessage });
  }
  
  messages.push({ role: "user", content: prompt });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: modelConfig.id,
        messages,
        max_tokens: Math.min(modelConfig.maxTokens, Math.floor(modelConfig.contextLength / 2)), // Ensure we leave room for input
        temperature: modelConfig.temperature ?? 0.7,
        top_p: modelConfig.top_p ?? 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error: HyperbolicError = await response.json().catch(() => ({ message: "Unknown error" }));
      
      // Handle context length errors specifically
      if (error.message?.includes("maximum context length")) {
        throw new Error(
          "The conversation is too long for this model. Please try:\n" +
          "1. Starting a new conversation\n" +
          "2. Sending a shorter message\n" +
          "3. Using a different model with longer context length"
        );
      }
      
      throw new Error(
        `API request failed with status ${response.status}: ${error.message}`
      );
    }

    const json: ChatCompletionResponse = await response.json();
    return json.choices[0].message.content;
  } catch (error: any) {
    console.error("Error generating response:", error);

    // Handle specific API error cases
    const errorMsg = error?.message?.toLowerCase() || "";

    if (errorMsg.includes("context length") || errorMsg.includes("too long")) {
      throw error; // Re-throw our custom context length error
    }

    if (errorMsg.includes("quota") || errorMsg.includes("limit")) {
      throw new Error(
        "API quota exceeded. Please try again in a few minutes or check your usage limits."
      );
    }

    if (errorMsg.includes("invalid") && errorMsg.includes("key")) {
      throw new Error(
        "Invalid API key. Please check that your API key is correct in the .env file."
      );
    }

    if (errorMsg.includes("unauthorized") || errorMsg.includes("forbidden")) {
      throw new Error(
        "API access denied. Please ensure your API key has the correct permissions."
      );
    }

    // Network errors
    if (errorMsg.includes("network") || errorMsg.includes("connection")) {
      throw new Error(
        "Network error occurred. Please check your internet connection and try again."
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