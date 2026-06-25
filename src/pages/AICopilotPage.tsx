import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
} from "react";

import type {
  Chat,
  ChatMessage,
} from "../types/chat.types";
import { chatService } from "../services/chat.service";

export default function AICopilotPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingChat, setCreatingChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      setError(null);
      const data = await chatService.getAllChats();
      setChats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load chats");
    } finally {
      setLoadingChats(false);
    }
  };

  const handleNewChat = async () => {
    try {
      setCreatingChat(true);
      setError(null);
      const title = `Chat ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      const newChat = await chatService.createChat({ title });
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      setMessages([]);
      setSidebarOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to create chat");
    } finally {
      setCreatingChat(false);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    if (chatId === activeChatId) {
      setSidebarOpen(false);
      return;
    }
    try {
      setLoadingHistory(true);
      setError(null);
      setActiveChatId(chatId);
      setMessages([]);
      setSidebarOpen(false);
      const history = await chatService.getChatHistory(chatId);
      setMessages(history);
    } catch (err: any) {
      setError(err.message || "Failed to load chat history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeChatId || sending) return;
    const content = input.trim();
    setInput("");
    setError(null);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      chatId: activeChatId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Add empty assistant message that will be filled by stream
    const assistantId = `assistant-${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: assistantId,
      chatId: activeChatId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    setSending(true);

    await chatService.sendMessageStream(
      activeChatId,
      { content },
      // onChunk: append each chunk to the assistant message
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        );
      },
      // onDone
      () => {
        setSending(false);
      },
      // onError
      (err) => {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError(err);
        setSending(false);
      }
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="flex h-full w-full overflow-hidden bg-black text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed z-30 top-0 left-0 h-full w-64 flex-shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-950
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:flex
        `}
      >
        <div className="p-3 border-b border-zinc-800">
          <button
            onClick={handleNewChat}
            disabled={creatingChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingChat ? (
              <svg className="animate-spin h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {loadingChats ? (
            <div className="flex flex-col gap-2 p-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-9 rounded bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <p className="text-xs text-zinc-500 px-3 py-4 text-center">No chats yet. Start one above.</p>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm truncate transition-colors ${
                  chat.id === activeChatId
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {chat.title}
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0 h-full">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
          <button
            className="md:hidden p-1.5 rounded hover:bg-zinc-800 text-zinc-400"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-medium text-zinc-300 truncate">
            {activeChat ? activeChat.title : "AI Copilot"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {!activeChatId ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center">
                <svg className="h-6 w-6 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium text-sm">No chat selected</p>
                <p className="text-zinc-500 text-xs mt-1">Create a new chat or select an existing one.</p>
              </div>
            </div>
          ) : loadingHistory ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                  <div className={`h-10 rounded-lg animate-pulse bg-zinc-800 ${i % 2 === 0 ? "w-48" : "w-64"}`} />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <p className="text-zinc-400 text-sm font-medium">Send a message to start the conversation.</p>
              <p className="text-zinc-600 text-xs">Press Enter to send, Shift+Enter for new line.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 bg-zinc-900">
                    <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-zinc-800 text-white rounded-br-sm"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                  {/* Blinking cursor while this assistant message is streaming */}
                  {sending && msg.role === "assistant" && msg.id.startsWith("assistant-") && (
                    <span className="inline-block w-0.5 h-3.5 bg-zinc-400 ml-0.5 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            ))
          )}

          {/* Typing indicator only when assistant bubble not yet added */}
          {sending && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 bg-zinc-900">
                <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="mx-4 mb-2 px-3 py-2 rounded border border-red-900 bg-red-950/40 text-red-400 text-xs flex items-center justify-between gap-2">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-300 flex-shrink-0">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="px-4 pb-4 pt-2 border-t border-zinc-800 bg-zinc-950 flex-shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
              }}
              onKeyDown={handleKeyDown}
              disabled={!activeChatId || sending}
              placeholder={activeChatId ? "Send a message..." : "Select or create a chat to begin"}
              className="flex-1 resize-none bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[42px] max-h-40"
              style={{ overflow: "hidden" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !activeChatId || sending}
              className="h-[42px] w-[42px] flex-shrink-0 flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sending ? (
                <svg className="animate-spin h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}