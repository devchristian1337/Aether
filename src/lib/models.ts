export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  contextLength: number;
  provider?: "gemini" | "hyperbolic";
  temperature?: number;
  top_p?: number;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    description: "Latest experimental flash model",
    maxTokens: 32768,
    contextLength: 32768,
    provider: "gemini"
  },
  {
    id: "gemini-exp-1206",
    name: "Gemini Experimental 1206",
    description: "Experimental model from December 2023",
    maxTokens: 32768,
    contextLength: 32768,
    provider: "gemini"
  },
  {
    id: "gemini-2.0-flash-thinking-exp-1219",
    name: "Gemini 2.0 Flash Thinking",
    description: "Experimental thinking-optimized model",
    maxTokens: 32768,
    contextLength: 32768,
    provider: "gemini"
  },
  {
    id: "meta-llama/Llama-3.2-3B-Instruct",
    name: "Llama 3.2",
    description: "Meta's Llama 3.2 3B model optimized for instruction following",
    maxTokens: 4096,
    contextLength: 131072,
    provider: "hyperbolic",
    temperature: 0.7,
    top_p: 0.9
  },
  {
    id: "Qwen/Qwen2.5-Coder-32B-Instruct",
    name: "Qwen 2.5 Coder",
    description: "Qwen 2.5 32B model optimized for coding tasks",
    maxTokens: 512,
    contextLength: 512,
    provider: "hyperbolic",
    temperature: 0.1,
    top_p: 0.9
  },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0];
