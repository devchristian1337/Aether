export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  fileNames?: string[];
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

export interface GeminiError extends Error {
  message: string;
  name: string;
  stack?: string;
}
