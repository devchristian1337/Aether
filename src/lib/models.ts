export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    description: "Latest experimental flash model",
    maxTokens: 32768,
  },
  {
    id: "gemini-exp-1206",
    name: "Gemini Experimental 1206",
    description: "Experimental model from December 2023",
    maxTokens: 32768,
  },
  {
    id: "gemini-2.0-flash-thinking-exp-1219",
    name: "Gemini 2.0 Flash Thinking",
    description: "Experimental thinking-optimized model",
    maxTokens: 32768,
  },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0];
