declare interface ChatPrompt {
  isStreaming: boolean;
  prompt: string;
  messages: Array<message>;
  setPrompt: (prompt: string) => void;
  setMessages: (message: message) => void;
  setIsStreaming: (status: boolean) => void;
  setStreamingMessage: (response: string) => void;
}

declare interface Message {
  prompt: string;
  message: string;
}
