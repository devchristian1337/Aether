export interface Attachment {
  fileName: string;
  url: string;
  type: "image" | "other";
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  attachments?: Attachment[];
  error?: boolean;
  errorDetails?: string;
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
