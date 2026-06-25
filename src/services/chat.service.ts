import api from "./api";

import type {
  Chat,
  ChatMessage,
  CreateChatRequest,
  SendMessageRequest,
} from "../types/chat.types";

export const chatService = {
  async createChat(data: CreateChatRequest): Promise<Chat> {
    const response = await api.post("/chats", data);
    return response.data.data;
  },

  async getAllChats(): Promise<Chat[]> {
    const response = await api.get("/chats");
    return response.data.data;
  },

  async getChatById(chatId: string): Promise<Chat> {
    const response = await api.get(`/chats/${chatId}`);
    return response.data.data;
  },

  async getChatHistory(chatId: string): Promise<ChatMessage[]> {
    const response = await api.get(`/chats/${chatId}/history`);
    return response.data.data;
  },

  async sendMessageStream(
    chatId: string,
    data: SendMessageRequest,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (err: string) => void
  ): Promise<void> {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/chats/${chatId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        onError(`Request failed with status ${response.status}`);
        return;
      }

      const reader = response.body?.getReader();

      if (!reader) {
        onError("No response stream received");
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onDone();
          break;
        }

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();

          if (!trimmed.startsWith("data:")) continue;

          const jsonString = trimmed.replace("data:", "").trim();

          try {
            const parsed = JSON.parse(jsonString);

            if (parsed.chunk) {
              onChunk(parsed.chunk);
            }

            if (parsed.done) {
              onDone();
            }

            if (parsed.error) {
              onError(parsed.error);
            }
          } catch {
            // Ignore malformed chunks
          }
        }
      }
    } catch (error: any) {
      onError(error?.message || "Streaming failed");
    }
  },
};