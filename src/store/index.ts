import { create } from "zustand";

export const usePromptChat = create<ChatPrompt>((set) => ({
  isStreaming: false,
  prompt: "",
  messages: [],
  setPrompt: (prompt) => set(() => ({ prompt: prompt })),

  setMessages: (message: Message) =>
    set((prev) => ({ messages: [...prev.messages, message] })),

  setIsStreaming: (state: boolean) => set({ isStreaming: state }),

  setStreamingMessage: (response: string) =>
    set((prev) => {
      if (!prev.messages.length) return prev;

      const messages = [...prev.messages];
      const lastIndex = messages.length - 1;

      messages[lastIndex] = {
        prompt: messages[lastIndex].prompt,
        message: (messages[lastIndex].message || "") + response,
      };

      return { messages };
    }),
}));
